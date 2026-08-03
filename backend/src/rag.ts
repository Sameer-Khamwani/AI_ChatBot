export const chunkText = (
  text: string,
  chunkSize = 500,
  overlap = 80,
): string[] => {
  const clean = text.replace(/\r\n/g, '\n').trim();
  if (!clean) return [];

  const words = clean.split(/\s+/);
  if (words.length <= chunkSize) {
    return [clean];
  }

  const result: string[] = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    result.push(words.slice(start, end).join(' '));
    if (end === words.length) break;
    start = Math.max(0, end - overlap);
  }
  return result;
};

export const cosineSimilarity = (a: number[], b: number[]): number => {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

/** Simple keyword score when embeddings are unavailable */
export const keywordScore = (query: string, text: string): number => {
  const qWords = query
    .toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 3);
  if (!qWords.length) return 0;
  const lower = text.toLowerCase();
  let hits = 0;
  for (const w of qWords) {
    if (lower.includes(w)) hits += 1;
  }
  return hits / qWords.length;
};
