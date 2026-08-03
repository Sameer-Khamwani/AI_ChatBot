# AI Document Q&A Backend

Thin Express API for Phase 2 RAG.

## Setup

```bash
cd backend
npm run dev
```

## Endpoints

- `GET /health` — server status
- `POST /documents` — `{ title, content, fileType? }` → stores, chunks, embeds
- `GET /documents` — list stored docs
- `POST /chat` — `{ documentId?, question, content?, title? }` → retrieve + answer

Without `OPENAI_API_KEY`, the server still runs using keyword retrieval and mock answers so the mobile app can be tested end-to-end.
