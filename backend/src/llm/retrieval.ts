import { Chunk } from '../store.js';
import { cosineSimilarity, keywordScore } from '../rag.js';

export const rankByEmbedding = (
  queryEmbedding: number[],
  docChunks: Chunk[],
  topK: number,
): { chunks: Chunk[]; scores: number[] } => {
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
};

export const rankByKeyword = (
  question: string,
  docChunks: Chunk[],
  topK: number,
): { chunks: Chunk[]; scores: number[] } => {
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
