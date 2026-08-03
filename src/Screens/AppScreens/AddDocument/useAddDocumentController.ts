import * as RNDocumentsPicker from '@react-native-documents/picker';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import {
  useUploadDocumentFileMutation,
  useUploadDocumentMutation,
} from '../../../Redux/Api/Documents';
import { selectUseRealApi } from '../../../Redux/Selectors';
import { addDocument } from '../../../Redux/Slices/documentsSlice';
import { DocumentFileType, IDocument } from '../../../Utils/interface';
import { goBack } from '../../../Utils/navigation';
import { truncateText } from '../../../Utils/helper';
import { BASE_URL } from '../../../Utils/baseUrls';

const isPdfFile = (name?: string, type?: string) => {
  const lower = (name || '').toLowerCase();
  return type === 'application/pdf' || lower.endsWith('.pdf');
};

const useAddDocumentController = () => {
  const dispatch = useDispatch();
  const useRealApi = useSelector(selectUseRealApi);
  const [uploadDocument] = useUploadDocumentMutation();
  const [uploadDocumentFile] = useUploadDocumentFileMutation();
  const [picking, setPicking] = useState(false);
  const [saving, setSaving] = useState(false);

  const pickDocument = async (
    setFieldValue: (field: string, value: any) => void,
  ) => {
    try {
      setPicking(true);
      const picked = await (RNDocumentsPicker as any).pick({
        allowMultiSelection: false,
        type: [
          'text/plain',
          'public.plain-text',
          'application/pdf',
          'com.adobe.pdf',
          '*/*',
        ],
      });
      const file = Array.isArray(picked) ? picked[0] : picked;
      if (!file?.uri) return;

      const name = (file.name ?? 'Untitled').replace(/\.[^/.]+$/, '');
      setFieldValue('title', name);

      if (isPdfFile(file.name, file.type)) {
        if (!useRealApi) {
          Toast.show({
            type: 'info',
            text1: 'PDF needs Real API',
            text2: 'Enable Real API in Settings and keep the backend running.',
          });
          return;
        }

        try {
          const formData = new FormData();
          formData.append('title', name);
          formData.append('file', {
            uri: file.uri,
            name: file.name || `${name}.pdf`,
            type: file.type || 'application/pdf',
          } as any);

          const result: any = await uploadDocumentFile(formData).unwrap();
          dispatch(
            addDocument({
              id: result.id,
              title: result.title,
              content: result.content,
              fileType: 'pdf',
              createdAt: result.createdAt || new Date().toISOString(),
              summary: result.summary,
            }),
          );
          Toast.show({
            type: 'success',
            text1: 'PDF indexed',
            text2: 'Ready for Q&A in your library.',
          });
          goBack();
        } catch {
          Toast.show({
            type: 'error',
            text1: 'PDF upload failed',
            text2: `Could not reach ${BASE_URL}. Start the backend and try again.`,
          });
        }
        return;
      }

      try {
        const response = await fetch(file.uri);
        const text = await response.text();
        if (text && text.length > 0) {
          setFieldValue('content', text);
        } else {
          Toast.show({
            type: 'info',
            text1: 'File selected',
            text2: 'Could not read text. Paste content manually.',
          });
        }
      } catch {
        Toast.show({
          type: 'info',
          text1: 'File selected',
          text2: 'Paste content manually if the file could not be read.',
        });
      }
    } catch (err) {
      if (!(RNDocumentsPicker as any).isCancel?.(err)) {
        Toast.show({
          type: 'error',
          text1: 'Picker error',
          text2: 'Unable to open document picker.',
        });
      }
    } finally {
      setPicking(false);
    }
  };

  const handleSubmit = async (formValues: {
    title: string;
    content: string;
  }) => {
    try {
      setSaving(true);
      const fileType: DocumentFileType = 'text';
      const localDoc: IDocument = {
        id: `doc-${Date.now()}`,
        title: formValues.title.trim(),
        content: formValues.content.trim(),
        fileType,
        createdAt: new Date().toISOString(),
        summary: truncateText(formValues.content.trim(), 120),
      };

      if (useRealApi) {
        try {
          const result: any = await uploadDocument({
            title: localDoc.title,
            content: localDoc.content,
            fileType,
          }).unwrap();
          dispatch(
            addDocument({
              ...localDoc,
              id: result.id ?? localDoc.id,
            }),
          );
          Toast.show({
            type: 'success',
            text1: 'Document saved',
            text2: 'Indexed on backend for RAG chat.',
          });
        } catch {
          dispatch(addDocument(localDoc));
          Toast.show({
            type: 'info',
            text1: 'Saved locally',
            text2: 'Backend unavailable — document stored on device.',
          });
        }
      } else {
        dispatch(addDocument(localDoc));
        Toast.show({
          type: 'success',
          text1: 'Document saved',
          text2: 'Ready for Q&A in your library.',
        });
      }
      goBack();
    } finally {
      setSaving(false);
    }
  };

  return {
    values: { picking, saving },
    functions: { pickDocument, handleSubmit },
  };
};

export default useAddDocumentController;
