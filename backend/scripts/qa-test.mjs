/**
 * Lightweight QA script for backend endpoints.
 * Run: npm run qa (from backend/)
 */
const BASE = process.env.QA_BASE_URL || 'http://localhost:3001';

/** @type {Array<{name: string, ok: boolean, detail?: string}>} */
const results = [];

const record = (name, ok, detail) => {
  results.push({ name, ok, detail });
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ''}`);
};

async function run() {
  try {
    const res = await fetch(`${BASE}/health`);
    const body = await res.json();
    record('GET /health', res.ok && body.ok === true, JSON.stringify(body));
  } catch (e) {
    record('GET /health', false, e.message);
  }

  try {
    const res = await fetch(`${BASE}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Only title' }),
    });
    record('POST /documents missing content', res.status === 400);
  } catch (e) {
    record('POST /documents missing content', false, e.message);
  }

  let docId = '';
  try {
    const res = await fetch(`${BASE}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'QA Test Doc',
        content:
          'Retrieval-Augmented Generation combines search with language models. Chunk documents, embed them, retrieve top matches, then generate an answer.',
      }),
    });
    const body = await res.json();
    docId = body.id;
    record(
      'POST /documents success',
      res.status === 201 && Boolean(body.id),
      `id=${body.id}`,
    );
    record(
      'POST /documents returns chunkCount',
      typeof body.chunkCount === 'number',
      `chunks=${body.chunkCount}`,
    );
  } catch (e) {
    record('POST /documents success', false, e.message);
  }

  try {
    const res = await fetch(`${BASE}/documents/${docId}`);
    record('GET /documents/:id', res.status === 200);
  } catch (e) {
    record('GET /documents/:id', false, e.message);
  }

  try {
    const res = await fetch(`${BASE}/documents/missing-id`);
    record('GET /documents/:id 404', res.status === 404);
  } catch (e) {
    record('GET /documents/:id 404', false, e.message);
  }

  // Multipart txt upload
  try {
    const form = new FormData();
    form.append('title', 'Uploaded Txt');
    form.append(
      'file',
      new Blob(
        ['Chunk documents into overlapping segments before embedding vectors.'],
        { type: 'text/plain' },
      ),
      'notes.txt',
    );
    const res = await fetch(`${BASE}/documents/upload`, {
      method: 'POST',
      body: form,
    });
    const body = await res.json();
    record(
      'POST /documents/upload txt',
      res.status === 201 && body.fileType === 'text' && Boolean(body.content),
      `id=${body.id}`,
    );
  } catch (e) {
    record('POST /documents/upload txt', false, e.message);
  }

  try {
    const res = await fetch(`${BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId: docId }),
    });
    record('POST /chat missing question', res.status === 400);
  } catch (e) {
    record('POST /chat missing question', false, e.message);
  }

  try {
    const res = await fetch(`${BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId: 'missing', question: 'What is RAG?' }),
    });
    record('POST /chat missing document', res.status === 404);
  } catch (e) {
    record('POST /chat missing document', false, e.message);
  }

  try {
    const res = await fetch(`${BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentId: docId,
        question: 'What is Retrieval-Augmented Generation?',
      }),
    });
    const body = await res.json();
    const sourcesOk =
      Array.isArray(body.sources) &&
      body.sources[0] &&
      typeof body.sources[0].label === 'string' &&
      typeof body.sources[0].snippet === 'string';
    record(
      'POST /chat success',
      res.ok && Boolean(body.answer) && sourcesOk,
      body.answer?.slice(0, 80),
    );
  } catch (e) {
    record('POST /chat success', false, e.message);
  }

  try {
    const res = await fetch(`${BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'What does chunk mean?',
        title: 'Ephemeral',
        content: 'Chunk documents into overlapping segments before embedding.',
      }),
    });
    const body = await res.json();
    record(
      'POST /chat ephemeral content',
      res.ok && Boolean(body.answer),
      body.answer?.slice(0, 80),
    );
  } catch (e) {
    record('POST /chat ephemeral content', false, e.message);
  }

  // Streaming SSE
  try {
    const res = await fetch(`${BASE}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        documentId: docId,
        question: 'What is Retrieval-Augmented Generation?',
      }),
    });
    const text = await res.text();
    const hasToken = text.includes('event: token');
    const hasSources = text.includes('event: sources');
    const hasDone = text.includes('event: done');
    record(
      'POST /chat/stream SSE',
      res.ok && hasToken && hasSources && hasDone,
      `sources=${hasSources} token=${hasToken} done=${hasDone}`,
    );
  } catch (e) {
    record('POST /chat/stream SSE', false, e.message);
  }

  const failed = results.filter(r => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
