import { IDocument, IMessage } from './interface';

export const MOCK_DOCUMENTS: IDocument[] = [
  {
    id: 'doc-1',
    title: 'React Native Best Practices',
    content: `React Native Best Practices Guide

Component Structure
Keep screens thin and move logic into controller hooks that return values and functions. Co-locate styles.ts next to each screen. Prefer reusable primitives like CustomText, Button, and AppWrapper.

State Management
Use Redux Toolkit for global state such as authentication and persisted documents. Keep ephemeral UI state local with useState. Prefer RTK Query for server communication.

Navigation
Use nested navigators: a root stack for auth and main flows, and feature stacks for document library and chat. Imperative helpers like navigate() and goBack() keep navigation accessible from controllers.

Performance
Memoize expensive list filtering with useMemo. Use FlatList for long message lists. Avoid anonymous inline functions in renderItem when possible by wrapping handlers.

Styling
Use StyleSheet.create with a shared theme palette and responsive helpers (widthPixel, heightPixel, font). Stick to one design system so the product feels cohesive.`,
    fileType: 'text',
    createdAt: new Date('2026-07-20').toISOString(),
    summary: 'Guide covering RN architecture, Redux, navigation, and styling patterns.',
  },
  {
    id: 'doc-2',
    title: 'RAG Explained',
    content: `Retrieval-Augmented Generation (RAG)

What is RAG?
RAG combines information retrieval with large language models. Instead of relying only on the model's training data, the system retrieves relevant document chunks and injects them into the prompt as context.

Pipeline
1. Parse — extract plain text from PDF, DOCX, or pasted content.
2. Chunk — split text into overlapping segments of roughly 500 tokens.
3. Embed — convert each chunk into a vector using an embeddings API.
4. Store — keep vectors in memory, SQLite, or a vector database.
5. Retrieve — on each user question, embed the query and find top-k similar chunks.
6. Generate — send the chunks plus the question to a chat model for the final answer.

Benefits
- Answers stay grounded in your documents.
- Reduces hallucinations for domain-specific questions.
- Works well for support bots, legal review, and internal knowledge bases.

Limitations
- Poor chunking can miss context.
- Retrieval quality depends on embedding model and similarity metric.
- Long documents may need hierarchical or summary-based retrieval.`,
    fileType: 'text',
    createdAt: new Date('2026-07-22').toISOString(),
    summary: 'Overview of RAG pipeline: parse, chunk, embed, retrieve, generate.',
  },
];

export const getWelcomeMessage = (docTitle: string): IMessage => ({
  _id: `welcome-${Date.now()}`,
  text: `Hi! I've loaded "${docTitle}". Ask me anything about this document.`,
  createdAt: new Date().toISOString(),
  role: 'assistant',
});

export const getMockAiReply = (
  question: string,
  docTitle: string,
  content: string,
): string => {
  const lowerQ = question.toLowerCase();
  const sentences = content
    .split(/[.!?]\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);

  const matched = sentences.find(s =>
    s
      .toLowerCase()
      .split(/\s+/)
      .some(word => word.length > 4 && lowerQ.includes(word.toLowerCase())),
  );

  if (matched) {
    return `Based on "${docTitle}", ${matched.endsWith('.') ? matched : `${matched}.`}`;
  }

  const snippet = content.slice(0, 180).replace(/\n+/g, ' ').trim();
  return `Based on "${docTitle}", the document mentions: "${snippet}...". Try asking about a specific section for a more focused answer.`;
};
