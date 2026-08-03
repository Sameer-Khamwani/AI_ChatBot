import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../../Utils/baseUrls';

export const documentsApi = createApi({
  reducerPath: 'documentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Documents'],
  endpoints: builder => ({
    uploadDocument: builder.mutation({
      query: (body: { title: string; content: string; fileType?: string }) => ({
        url: '/documents',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Documents'],
    }),
    uploadDocumentFile: builder.mutation({
      query: (formData: FormData) => ({
        url: '/documents/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Documents'],
    }),
    listDocuments: builder.query({
      query: () => '/documents',
      providesTags: ['Documents'],
    }),
  }),
});

export const {
  useUploadDocumentMutation,
  useUploadDocumentFileMutation,
  useListDocumentsQuery,
} = documentsApi;
