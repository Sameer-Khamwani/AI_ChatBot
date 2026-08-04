import { Chunk } from '../store.js';
import { SourceChip, toSourceChips } from '../types.js';
import { buildMessages } from './prompt.js';
import { buildMockAnswer, streamMockAnswer } from './mock.js';
import { rankByEmbedding, rankByKeyword } from './retrieval.js';

const baseUrl = () => process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const chatModel = () => process.env.OLLAMA_CHAT_MODEL || 'llama3.2';
const embedModel = () => process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';

const isConnectionError = (error: unknown): boolean => {
  const err = error as { cause?: { code?: string }; message?: string };
  const code = err?.cause?.code || '';
  return code === 'ECONNREFUSED' || (err?.message || '').includes('fetch failed');
};

export const friendlyOllamaError = (error: unknown): string => {
  if (isConnectionError(error)) {
    return `Could not reach Ollama at ${baseUrl()}. Make sure "ollama serve" is running and the model is pulled (ollama pull ${chatModel()}).`;
  }
  const err = error as { message?: string };
  return err?.message || 'Ollama request failed';
};

export const embedTexts = async (texts: string[]): Promise<number[][]> => {
  try {
    const results: number[][] = [];
    for (const text of texts) {
      const res = await fetch(`${baseUrl()}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: embedModel(), prompt: text }),
      });
      if (!res.ok) throw new Error(`Ollama embeddings failed: ${res.status}`);
      const data = (await res.json()) as { embedding?: number[] };
      results.push(data.embedding || []);
    }
    return results;
  } catch (error) {
    console.warn('[ollama] embeddings failed — falling back to keyword retrieval', friendlyOllamaError(error));
    return texts.map(() => []);
  }
};

export const retrieveTopChunks = async (
  question: string,
  docChunks: Chunk[],
  topK = 3,
): Promise<{ chunks: Chunk[]; scores: number[] }> => {
  if (!docChunks.length) return { chunks: [], scores: [] };

  if (docChunks[0].embedding?.length) {
    try {
      const [queryEmbedding] = await embedTexts([question]);
      if (queryEmbedding.length) {
        return rankByEmbedding(queryEmbedding, docChunks, topK);
      }
    } catch (error) {
      console.warn('[ollama] retrieve embed failed — keyword fallback', friendlyOllamaError(error));
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

  try {
    const res = await fetch(`${baseUrl()}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: chatModel(),
        messages: buildMessages(question, title, contextChunks),
        stream: false,
        options: { temperature: 0.2 },
      }),
    });
    if (!res.ok) throw new Error(`Ollama chat failed: ${res.status}`);
    const data = (await res.json()) as { message?: { content?: string } };
    const answer = data.message?.content?.trim() || 'I could not generate an answer.';
    return { answer, sources };
  } catch (error) {
    console.warn('[ollama] chat failed — falling back to local mock answer', friendlyOllamaError(error));
    return {
      answer: `${buildMockAnswer(title, contextChunks)}\n\n(Note: ${friendlyOllamaError(error)})`,
      sources,
      usedFallback: true,
    };
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

  let res: Response;
  try {
    res = await fetch(`${baseUrl()}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: chatModel(),
        messages: buildMessages(question, title, contextChunks),
        stream: true,
        options: { temperature: 0.2 },
      }),
    });
    if (!res.ok || !res.body) throw new Error(`Ollama chat failed: ${res.status}`);
  } catch (error) {
    yield {
      type: 'notice',
      message: `${friendlyOllamaError(error)} Showing local fallback answer.`,
    };
    yield* streamMockAnswer(title, contextChunks);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const parseLine = (line: string) => {
    if (!line.trim()) return null;
    try {
      return JSON.parse(line) as { message?: { content?: string }; done?: boolean };
    } catch {
      return null;
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const token = parseLine(line)?.message?.content;
        if (token) {
          yield { type: 'token', token };
        }
      }
    }
    const trailingToken = parseLine(buffer)?.message?.content;
    if (trailingToken) {
      yield { type: 'token', token: trailingToken };
    }
    yield { type: 'done' };
  } catch (error) {
    console.warn('[ollama] stream read failed', friendlyOllamaError(error));
    yield { type: 'notice', message: friendlyOllamaError(error) };
    yield { type: 'done' };
  }
}
