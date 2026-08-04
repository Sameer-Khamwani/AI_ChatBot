import * as openaiProvider from '../openai.js';
import * as ollamaProvider from './ollama.js';

const useOllama = () => (process.env.LLM_PROVIDER || 'openai').toLowerCase() === 'ollama';

export const embedTexts: typeof openaiProvider.embedTexts = texts =>
  useOllama() ? ollamaProvider.embedTexts(texts) : openaiProvider.embedTexts(texts);

export const retrieveTopChunks: typeof openaiProvider.retrieveTopChunks = (question, docChunks, topK) =>
  useOllama()
    ? ollamaProvider.retrieveTopChunks(question, docChunks, topK)
    : openaiProvider.retrieveTopChunks(question, docChunks, topK);

export const generateAnswer: typeof openaiProvider.generateAnswer = (question, title, contextChunks, scores) =>
  useOllama()
    ? ollamaProvider.generateAnswer(question, title, contextChunks, scores)
    : openaiProvider.generateAnswer(question, title, contextChunks, scores);

export const generateAnswerStream = (
  question: string,
  title: string,
  contextChunks: Parameters<typeof openaiProvider.generateAnswer>[2],
  scores?: number[],
) =>
  useOllama()
    ? ollamaProvider.generateAnswerStream(question, title, contextChunks, scores)
    : openaiProvider.generateAnswerStream(question, title, contextChunks, scores);

export const friendlyLLMError = (error: unknown): string =>
  useOllama() ? ollamaProvider.friendlyOllamaError(error) : openaiProvider.friendlyOpenAIError(error);

/** Whether the error is a transient provider issue (rate limit, connection refused) worth surfacing as a 429 rather than a 500. */
export const isRetryableProviderError = (error: unknown): boolean =>
  useOllama() ? false : openaiProvider.isQuotaOrRateLimitError(error);
