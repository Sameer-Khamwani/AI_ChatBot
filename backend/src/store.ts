export type Chunk = {
  id: string;
  documentId: string;
  text: string;
  embedding?: number[];
  index: number;
};

export type StoredDocument = {
  id: string;
  title: string;
  content: string;
  fileType: string;
  createdAt: string;
  summary?: string;
};

export const documents = new Map<string, StoredDocument>();
export const chunks = new Map<string, Chunk[]>();
