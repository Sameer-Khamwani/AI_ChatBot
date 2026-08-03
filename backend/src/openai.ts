import OpenAI from 'openai';
import { Chunk } from './store.js';
import { cosineSimilarity, keywordScore } from './rag.js';
import { SourceChip, toSourceChips } from './types.js';

let client: OpenAI | null = null;

export const getOpenAI = (): OpenAI | null => {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
};

/** Clear the cached client (e.g. after .env key change + server restart). */
export const resetOpenAIClient = () => {
  client = null;
};

export const isQuotaOrRateLimitError = (error: unknown): boolean => {
  const err = error as {
    status?: number;
    code?: string;
    message?: string;
    error?: { code?: string; type?: string };
  };
  const status = err?.status;
  const code = err?.code || err?.error?.code || '';
  const message = (err?.message || '').toLowerCase();
  return (
    status === 429 ||
    code === 'rate_limit_exceeded' ||
    code === 'insufficient_quota' ||
    message.includes('rate limit') ||
    message.includes('quota') ||
    message.includes('429')
  );
};

export const friendlyOpenAIError = (error: unknown): string => {
  if (isQuotaOrRateLimitError(error)) {
    return 'OpenAI rate limit / quota hit (429). Free API keys have very low limits — add billing credit at platform.openai.com/settings/organization/billing, wait a minute, or turn Real API off for local mock replies.';
  }
  const err = error as { message?: string };
  return err?.message || 'OpenAI request failed';
};

export const embedTexts = async (texts: string[]): Promise<number[][]> => {
  const openai = getOpenAI();
  if (!openai) {
    return texts.map(() => []);
  }
  try {
    const response = await openai.embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
      input: texts,
    });
    return response.data.map(d => d.embedding);
  } catch (error) {
    if (isQuotaOrRateLimitError(error)) {
      console.warn('[openai] embeddings 429/quota — falling back to keyword retrieval');
      return texts.map(() => []);
    }
    throw error;
  }
};

export const retrieveTopChunks = async (
  question: string,
  docChunks: Chunk[],
  topK = 3,
): Promise<{ chunks: Chunk[]; scores: number[] }> => {
  if (!docChunks.length) return { chunks: [], scores: [] };

  const openai = getOpenAI();
  if (openai && docChunks[0].embedding?.length) {
    try {
      const [queryEmbedding] = await embedTexts([question]);
      if (queryEmbedding.length) {
        const ranked = [...docChunks]
          .map(chunk => ({
            chunk,
            score: cosineSimilarity(queryEmbedding, chunk.embedding || []),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, topK);
        return {
          chunks: ranked.map(x => x.chunk),
          scores: ranked.map(x => x.score),
        };
      }
    } catch (error) {
      if (!isQuotaOrRateLimitError(error)) {
        throw error;
      }
      console.warn('[openai] retrieve embed failed — keyword fallback');
    }
  }

  const ranked = [...docChunks]
    .map(chunk => ({
      chunk,
      score: keywordScore(question, chunk.text),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return {
    chunks: ranked.map(x => x.chunk),
    scores: ranked.map(x => x.score),
  };
};

const buildMessages = (
  question: string,
  title: string,
  contextChunks: Chunk[],
) => {
  const context = contextChunks.map(c => c.text).join('\n\n---\n\n');
  return [
    {
      role: 'system' as const,
      content:
        'You are a helpful document Q&A assistant. Answer ONLY using the provided context. If the answer is not in the context, say you cannot find it in the document. Be concise.',
    },
    {
      role: 'user' as const,
      content: `Document title: ${title}\n\nContext:\n${context}\n\nQuestion: ${question}`,
    },
  ];
};

export const buildMockAnswer = (title: string, contextChunks: Chunk[]): string => {
  const snippet = contextChunks[0]?.text?.slice(0, 280) || 'No context found.';
  return `Based on "${title}" (local mock RAG): ${snippet}${
    snippet.endsWith('.') ? '' : '...'
  }`;
};

const streamMockAnswer = async function* (
  title: string,
  contextChunks: Chunk[],
): AsyncGenerator<{ type: 'token'; token: string } | { type: 'done' }> {
  const answer = buildMockAnswer(title, contextChunks);
  const words = answer.split(/(\s+)/);
  for (const word of words) {
    if (word) {
      yield { type: 'token', token: word };
      await new Promise(r => setTimeout(r, 12));
    }
  }
  yield { type: 'done' };
};

export const generateAnswer = async (
  question: string,
  title: string,
  contextChunks: Chunk[],
  scores?: number[],
): Promise<{ answer: string; sources: SourceChip[]; usedFallback?: boolean }> => {
  const sources = toSourceChips(contextChunks, scores);
  const openai = getOpenAI();

  if (!openai) {
    return {
      answer: buildMockAnswer(title, contextChunks),
      sources,
      usedFallback: true,
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      messages: buildMessages(question, title, contextChunks),
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() ||
      'I could not generate an answer.';

    return { answer, sources };
  } catch (error) {
    if (isQuotaOrRateLimitError(error)) {
      console.warn('[openai] chat 429/quota — falling back to local mock answer');
      return {
        answer: `${buildMockAnswer(title, contextChunks)}\n\n(Note: OpenAI returned 429 rate/quota limit — using local fallback.)`,
        sources,
        usedFallback: true,
      };
    }
    throw error;
  }
};

export async function* generateAnswerStream(
  question: string,
  title: string,
  contextChunks: Chunk[],
  scores?: number[],
): AsyncGenerator<
  | { type: 'sources'; sources: SourceChip[] }
  | { type: 'token'; token: string }
  | { type: 'done' }
  | { type: 'notice'; message: string }
> {
  const sources = toSourceChips(contextChunks, scores);
  yield { type: 'sources', sources };

  const openai = getOpenAI();
  if (!openai) {
    yield* streamMockAnswer(title, contextChunks);
    return;
  }

  try {
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      stream: true,
      messages: buildMessages(question, title, contextChunks),
    });

    for await (const part of stream) {
      const token = part.choices[0]?.delta?.content;
      if (token) {
        yield { type: 'token', token };
      }
    }
    yield { type: 'done' };
  } catch (error) {
    if (isQuotaOrRateLimitError(error)) {
      console.warn('[openai] stream 429/quota — falling back to local mock stream');
      yield {
        type: 'notice',
        message:
          'OpenAI 429 (rate/quota). Showing local fallback answer. Add billing credit or retry later.',
      };
      yield* streamMockAnswer(title, contextChunks);
      return;
    }
    throw error;
  }
}
