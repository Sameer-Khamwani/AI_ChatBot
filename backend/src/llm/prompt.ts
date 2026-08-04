import { Chunk } from '../store.js';

export const buildMessages = (
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
