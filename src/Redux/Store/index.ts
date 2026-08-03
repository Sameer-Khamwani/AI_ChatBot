import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore } from 'redux-persist';
import { chatApi } from '../Api/Chat';
import { documentsApi } from '../Api/Documents';
import { apiErrorHandler } from '../MiddleWares/error.middleware';
import rootReducer from '../Reducers';

const persistConfig = {
  key: 'AI_ChatBot',
  storage: AsyncStorage,
  whitelist: ['documents', 'settings'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    })
      .concat(documentsApi.middleware)
      .concat(chatApi.middleware)
      .concat(apiErrorHandler),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
