import { combineReducers } from '@reduxjs/toolkit';
import { documentsApi } from '../Api/Documents';
import { chatApi } from '../Api/Chat';
import { documentsReducer } from '../Slices/documentsSlice';
import { settingsReducer } from '../Slices/settingsSlice';

const rootReducer = combineReducers({
  documents: documentsReducer,
  settings: settingsReducer,
  [documentsApi.reducerPath]: documentsApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
});

export default rootReducer;
