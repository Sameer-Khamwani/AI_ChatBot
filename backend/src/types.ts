export type SourceChip = {
  id: string;
  label: string;
  snippet: string;
  score?: number;
};

export const toSourceChips = (
  chunks: Array<{ id: string; index: number; text: string }>,
  scores?: number[],
): SourceChip[] =>
  chunks.map((c, i) => ({
    id: c.id,
    label: `Chunk ${c.index + 1}${i === 0 ? ' (top)' : ''}`,
    snippet: c.text.replace(/\s+/g, ' ').trim().slice(0, 120),
    score: scores?.[i],
  }));
