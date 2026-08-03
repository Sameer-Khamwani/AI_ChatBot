# QA Report — AI Document Q&A

Date: 2026-07-28

## Static Checks

| Check | Result |
|-------|--------|
| TypeScript (mobile) | PASS |
| TypeScript (backend) | PASS |
| ESLint (mobile) | PASS |
| Jest unit tests | PASS (4/4) |

## Backend API (mock mode, no OpenAI key)

| Endpoint | Result |
|----------|--------|
| GET /health | PASS |
| POST /documents (missing content) | PASS (400) |
| POST /documents (success) | PASS |
| GET /documents/:id | PASS |
| GET /documents/:id (404) | PASS |
| POST /chat (missing question) | PASS (400) |
| POST /chat (missing document) | PASS (404) |
| POST /chat (with documentId) | PASS |
| POST /chat (ephemeral content) | PASS |

**Backend QA:** 9/9 passed (`npm run qa`)

## RAG utilities

| Check | Result |
|-------|--------|
| chunkText long text | PASS |
| chunkText short text | PASS |
| keywordScore overlap | PASS |
| cosineSimilarity | PASS |

**RAG unit:** 4/4 passed (`npm run qa:rag`)

## Mobile Critical Flows (code + unit validation)

| Flow | Result | Notes |
|------|--------|-------|
| App launch → DocumentLibrary | PASS | MainNavigation initial route |
| Mock documents visible | PASS | MOCK_DOCUMENTS in Redux initial state |
| Add document (paste) | PASS | Formik + Yup validation |
| Add document (file picker) | PASS | Picker with graceful read failure toast |
| Open document → chat | PASS | Navigation + welcome message seeding |
| Mock chat reply | PASS | getMockAiReply unit tested |
| Settings toggle Real API | PASS | Persisted in settingsSlice |
| Delete document + chat cleanup | PASS | removeDocument unit tested |
| Document not found UX | PASS | Back button added |
| Backend unavailable fallback | PASS | Toast + local mock reply |
| Android emulator API host | PASS | BASE_URL uses 10.0.2.2 |
| Duplicate welcome prevention | PASS | seededRef + Redux chat sync |
| Double-send prevention | PASS | sending guard |
| Long question cap | PASS | 2000 char limit |

## Known Limitations

- Real OpenAI mode not verified in CI (requires `OPENAI_API_KEY` in `backend/.env`).
- Physical device testing requires LAN IP instead of localhost/10.0.2.2.
- PDF parsing not implemented on mobile; `.txt` paste/pick only in Phase 1.
- Backend storage is in-memory (resets on server restart).

## Demo Readiness

**Status: READY** for portfolio demo in mock mode. Enable Real API after starting backend with optional OpenAI key.
