import * as Yup from 'yup';

export const addDocumentSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters'),
  content: Yup.string()
    .trim()
    .required('Document content is required')
    .min(20, 'Content must be at least 20 characters'),
});

export const addDocumentInitialValues = {
  title: '',
  content: '',
};

export const settingsSchema = Yup.object({
  apiKey: Yup.string().trim(),
  useRealApi: Yup.boolean(),
});

export const settingsInitialValues = {
  apiKey: '',
  useRealApi: false,
};
