import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { chatRouter } from './routes/chat.js';
import { documentsRouter } from './routes/documents.js';

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/', (_req, res) => {
  res.json({
    name: 'DocuAsk API',
    ok: true,
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    endpoints: {
      health: 'GET /health',
      documents: 'GET|POST /documents',
      upload: 'POST /documents/upload',
      chat: 'POST /chat',
      chatStream: 'POST /chat/stream',
    },
  });
});

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
  });
});

app.use('/documents', documentsRouter);
app.use('/chat', chatRouter);

app.listen(PORT, () => {
  console.log(`AI Document Q&A API listening on http://localhost:${PORT}`);
  if (!process.env.OPENAI_API_KEY) {
    console.log(
      'OPENAI_API_KEY not set — using local keyword retrieval + mock answers.',
    );
  }
});
