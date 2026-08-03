import { Router } from 'express';
import { randomUUID } from 'crypto';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { chunkText } from '../rag.js';
import { embedTexts } from '../openai.js';
import { Chunk, documents, chunks, StoredDocument } from '../store.js';

export const documentsRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const storeDocument = async (input: {
  title: string;
  content: string;
  fileType: string;
}): Promise<StoredDocument & { chunkCount: number; embeddingsReady: boolean }> => {
  const id = randomUUID();
  const doc: StoredDocument = {
    id,
    title: input.title.trim(),
    content: input.content.trim(),
    fileType: input.fileType,
    createdAt: new Date().toISOString(),
    summary: input.content.trim().slice(0, 120),
  };

  documents.set(id, doc);

  const textChunks = chunkText(doc.content);
  const embeddings = await embedTexts(textChunks);
  const storedChunks: Chunk[] = textChunks.map((text, index) => ({
    id: `${id}-c${index}`,
    documentId: id,
    text,
    index,
    embedding: embeddings[index],
  }));
  chunks.set(id, storedChunks);

  return {
    ...doc,
    chunkCount: storedChunks.length,
    embeddingsReady: Boolean(storedChunks[0]?.embedding?.length),
  };
};

documentsRouter.get('/', (_req, res) => {
  res.json({ documents: Array.from(documents.values()) });
});

documentsRouter.get('/:id', (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: 'Document not found' });
  }
  return res.json(doc);
});

documentsRouter.post('/', async (req, res) => {
  try {
    const { title, content, fileType = 'text' } = req.body || {};
    if (!title?.trim() || !content?.trim()) {
      return res
        .status(400)
        .json({ message: 'title and content are required' });
    }

    const result = await storeDocument({
      title: String(title),
      content: String(content),
      fileType: String(fileType),
    });

    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error?.message || 'Failed to create document',
    });
  }
});

documentsRouter.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'file is required' });
    }

    const originalName = file.originalname || 'Untitled';
    const title =
      (typeof req.body?.title === 'string' && req.body.title.trim()) ||
      originalName.replace(/\.[^/.]+$/, '');

    const mime = file.mimetype || '';
    const lowerName = originalName.toLowerCase();
    const isPdf =
      mime === 'application/pdf' || lowerName.endsWith('.pdf');
    const isTxt =
      mime.startsWith('text/') ||
      lowerName.endsWith('.txt') ||
      mime === 'application/octet-stream';

    let content = '';
    let fileType: string = 'text';

    if (isPdf) {
      fileType = 'pdf';
      const parser = new PDFParse({ data: new Uint8Array(file.buffer) });
      try {
        const result = await parser.getText();
        content = result.text || '';
      } finally {
        await parser.destroy();
      }
    } else if (isTxt) {
      fileType = 'text';
      content = file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({
        message: 'Unsupported file type. Upload a PDF or .txt file.',
      });
    }

    if (!content.trim()) {
      return res.status(400).json({
        message: 'Could not extract text from the uploaded file.',
      });
    }

    const result = await storeDocument({ title, content, fileType });
    return res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error?.message || 'Failed to upload document',
    });
  }
});
