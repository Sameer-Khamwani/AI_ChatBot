import { RootState } from '../Store';

export const selectDocuments = (state: RootState) => state.documents.items;
export const selectDocumentById = (id: string) => (state: RootState) =>
  state.documents.items.find(d => d.id === id);
export const selectActiveDocumentId = (state: RootState) =>
  state.documents.activeDocumentId;
export const selectChatByDocumentId = (id: string) => (state: RootState) =>
  state.documents.chats[id];
export const selectUseRealApi = (state: RootState) => state.settings.useRealApi;
export const selectApiKeyHint = (state: RootState) => state.settings.apiKeyHint;
