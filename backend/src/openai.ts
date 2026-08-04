import OpenAI from 'openai';
import { Chunk } from './store.js';
import { SourceChip, toSourceChips } from './types.js';
import { buildMessages } from './llm/prompt.js';
import { buildMockAnswer, streamMockAnswer } from './llm/mock.js';
import { rankByEmbedding, rankByKeyword } from './llm/retrieval.js';

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
        return rankByEmbedding(queryEmbedding, docChunks, topK);
      }
    } catch (error) {
      if (!isQuotaOrRateLimitError(error)) {
        throw error;
      }
      console.warn('[openai] retrieve embed failed — keyword fallback');
    }
  }

  return rankByKeyword(question, docChunks, topK);
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
