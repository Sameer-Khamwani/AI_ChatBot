import { getMockAiReply } from '../src/Utils/data';
import documentsSlice, {
  addDocument,
  appendChatMessage,
  removeDocument,
} from '../src/Redux/Slices/documentsSlice';

describe('getMockAiReply', () => {
  const content =
    'Retrieval-Augmented Generation combines search with language models. Chunk documents before embedding.';

  it('returns contextual answer when keywords match', () => {
    const reply = getMockAiReply(
      'What is Retrieval-Augmented Generation?',
      'RAG Guide',
      content,
    );
    expect(reply).toContain('RAG Guide');
    expect(reply.toLowerCase()).toContain('retrieval');
  });

  it('returns fallback snippet when no keyword match', () => {
    const reply = getMockAiReply('xyz unknown topic', 'Doc', content);
    expect(reply).toContain('Doc');
    expect(reply).toContain('document mentions');
  });
});

describe('documentsSlice', () => {
  const initial = documentsSlice.getInitialState();

  it('adds and removes documents with chat cleanup', () => {
    let state = documentsSlice.reducer(
      initial,
      addDocument({
        id: 'doc-test',
        title: 'Test',
        content: 'Sample content for testing redux slice behavior.',
        fileType: 'text',
        createdAt: new Date().toISOString(),
      }),
    );
    expect(state.items.some(d => d.id === 'doc-test')).toBe(true);

    state = documentsSlice.reducer(
      state,
      appendChatMessage({
        documentId: 'doc-test',
        message: {
          _id: 'm1',
          text: 'hello',
          createdAt: new Date().toISOString(),
          role: 'user',
        },
      }),
    );
    expect(state.chats['doc-test']?.messages.length).toBe(1);

    state = documentsSlice.reducer(state, removeDocument('doc-test'));
    expect(state.items.some(d => d.id === 'doc-test')).toBe(false);
    expect(state.chats['doc-test']).toBeUndefined();
  });
});
