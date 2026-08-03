import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOCK_DOCUMENTS } from '../../Utils/data';
import { IDocument, IDocumentChat, IMessage } from '../../Utils/interface';

interface DocumentsState {
  items: IDocument[];
  chats: Record<string, IDocumentChat>;
  activeDocumentId: string | null;
}

const initialState: DocumentsState = {
  items: MOCK_DOCUMENTS,
  chats: {},
  activeDocumentId: null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addDocument: (state, action: PayloadAction<IDocument>) => {
      state.items.unshift(action.payload);
    },
    removeDocument: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(d => d.id !== action.payload);
      delete state.chats[action.payload];
      if (state.activeDocumentId === action.payload) {
        state.activeDocumentId = null;
      }
    },
    setActiveDocument: (state, action: PayloadAction<string | null>) => {
      state.activeDocumentId = action.payload;
    },
    setChatMessages: (
      state,
      action: PayloadAction<{ documentId: string; messages: IMessage[] }>,
    ) => {
      const { documentId, messages } = action.payload;
      state.chats[documentId] = { documentId, messages };
    },
    appendChatMessage: (
      state,
      action: PayloadAction<{ documentId: string; message: IMessage }>,
    ) => {
      const { documentId, message } = action.payload;
      if (!state.chats[documentId]) {
        state.chats[documentId] = { documentId, messages: [] };
      }
      state.chats[documentId].messages.push(message);
    },
  },
});

export const {
  addDocument,
  removeDocument,
  setActiveDocument,
  setChatMessages,
  appendChatMessage,
} = documentsSlice.actions;

export const documentsReducer = documentsSlice.reducer;
export default documentsSlice;
