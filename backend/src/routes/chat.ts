import { Router, Response } from 'express';
import { randomUUID } from 'crypto';
import {
  generateAnswer,
  generateAnswerStream,
  retrieveTopChunks,
  embedTexts,
  friendlyLLMError,
  isRetryableProviderError,
} from '../llm/index.js';
import { chunkText } from '../rag.js';
import { Chunk, chunks, documents, StoredDocument } from '../store.js';

export const chatRouter = Router();

type ResolveDocResult = {
  doc: StoredDocument;
  docChunks: Chunk[];
} | null;

const resolveDocument = async (body: {
  documentId?: string;
  content?: string;
  title?: string;
}): Promise<ResolveDocResult> => {
  const { documentId, content, title } = body;
  let doc = documentId ? documents.get(documentId) : undefined;
  let docChunks = documentId ? chunks.get(documentId) : undefined;

  if (!doc && content?.trim()) {
    const id = documentId || randomUUID();
    doc = {
      id,
      title: title?.trim() || 'Untitled',
      content: String(content).trim(),
      fileType: 'text',
      createdAt: new Date().toISOString(),
    };
    documents.set(id, doc);

    const textChunks = chunkText(doc.content);
    const embeddings = await embedTexts(textChunks);
    docChunks = textChunks.map((text, index) => ({
      id: `${id}-c${index}`,
      documentId: id,
      text,
      index,
      embedding: embeddings[index],
    }));
    chunks.set(id, docChunks);
  }

  if (!doc || !docChunks?.length) {
    return null;
  }

  return { doc, docChunks };
};

const writeSse = (res: Response, event: string, data: unknown) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

chatRouter.post('/', async (req, res) => {
  try {
    const { documentId, question, content, title } = req.body || {};
    if (!question?.trim()) {
      return res.status(400).json({ message: 'question is required' });
    }

    const normalizedQuestion = String(question).trim();
    if (normalizedQuestion.length > 2000) {
      return res.status(400).json({ message: 'question is too long' });
    }

    const resolved = await resolveDocument({ documentId, content, title });
    if (!resolved) {
      return res.status(404).json({
        message: 'Document not found. Upload it first or send content.',
      });
    }

    const { chunks: top, scores } = await retrieveTopChunks(
      normalizedQuestion,
      resolved.docChunks,
      3,
    );
    const { answer, sources } = await generateAnswer(
      normalizedQuestion,
      resolved.doc.title,
      top,
      scores,
    );

    return res.json({
      answer,
      sources,
      documentId: resolved.doc.id,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(isRetryableProviderError(error) ? 429 : 500).json({
      message: friendlyLLMError(error),
    });
  }
});

chatRouter.post('/stream', async (req, res) => {
  try {
    const { documentId, question, content, title } = req.body || {};
    if (!question?.trim()) {
      return res.status(400).json({ message: 'question is required' });
    }

    const normalizedQuestion = String(question).trim();
    if (normalizedQuestion.length > 2000) {
      return res.status(400).json({ message: 'question is too long' });
    }

    const resolved = await resolveDocument({ documentId, content, title });
    if (!resolved) {
      return res.status(404).json({
        message: 'Document not found. Upload it first or send content.',
      });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const { chunks: top, scores } = await retrieveTopChunks(
      normalizedQuestion,
      resolved.docChunks,
      3,
    );

    for await (const event of generateAnswerStream(
      normalizedQuestion,
      resolved.doc.title,
      top,
      scores,
    )) {
      if (event.type === 'sources') {
        writeSse(res, 'sources', { sources: event.sources });
      } else if (event.type === 'token') {
        writeSse(res, 'token', { token: event.token });
      } else if (event.type === 'notice') {
        writeSse(res, 'notice', { message: event.message });
      } else if (event.type === 'done') {
        writeSse(res, 'done', { documentId: resolved.doc.id });
      }
    }

    res.end();
  } catch (error: any) {
    console.error(error);
    if (!res.headersSent) {
      return res.status(isRetryableProviderError(error) ? 429 : 500).json({
        message: friendlyLLMError(error),
      });
    }
    writeSse(res, 'error', {
      message: friendlyLLMError(error),
    });
    res.end();
  }
});
