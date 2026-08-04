import { Chunk } from '../store.js';

export const buildMockAnswer = (title: string, contextChunks: Chunk[]): string => {
  const snippet = contextChunks[0]?.text?.slice(0, 280) || 'No context found.';
  return `Based on "${title}" (local mock RAG): ${snippet}${
    snippet.endsWith('.') ? '' : '...'
  }`;
};

export const streamMockAnswer = async function* (
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
