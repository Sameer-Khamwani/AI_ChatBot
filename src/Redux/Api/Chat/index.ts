import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../../Utils/baseUrls';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    askQuestion: builder.mutation({
      query: (body: {
        documentId: string;
        question: string;
        content?: string;
        title?: string;
      }) => ({
        url: '/chat',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useAskQuestionMutation } = chatApi;
