import { useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import {
  selectChatByDocumentId,
  selectDocumentById,
  selectUseRealApi,
} from '../../../Redux/Selectors';
import {
  setChatMessages,
} from '../../../Redux/Slices/documentsSlice';
import { getMockAiReply, getWelcomeMessage } from '../../../Utils/data';
import { IMessage, ISourceChip } from '../../../Utils/interface';
import { streamChat } from '../../../Utils/streamChat';

const MAX_QUESTION_LENGTH = 2000;

export const CHAT_SUGGESTIONS = [
  'Summarize this document',
  'What are the key points?',
  'Explain this in simple terms',
];

const useDocumentChatController = () => {
  const route = useRoute<any>();
  const documentId: string = route.params?.documentId;
  const dispatch = useDispatch();
  const document = useSelector(selectDocumentById(documentId || ''));
  const chat = useSelector(selectChatByDocumentId(documentId || ''));
  const useRealApi = useSelector(selectUseRealApi);

  const flatListRef = useRef<FlatList<IMessage>>(null);
  const seededRef = useRef<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [awaitingFirstToken, setAwaitingFirstToken] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (!documentId || !document) return;

    if (chat?.messages?.length) {
      setMessages(chat.messages);
      seededRef.current = documentId;
      return;
    }

    if (seededRef.current === documentId) return;
    seededRef.current = documentId;

    const welcome = getWelcomeMessage(document.title);
    setMessages([welcome]);
    dispatch(setChatMessages({ documentId, messages: [welcome] }));
  }, [documentId, document, chat?.messages, dispatch]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, []);

  const persistMessages = useCallback(
    (next: IMessage[]) => {
      setMessages(next);
      dispatch(setChatMessages({ documentId, messages: next }));
    },
    [dispatch, documentId],
  );

  const sendQuestion = useCallback(
    async (rawText: string) => {
      const text = rawText.trim().slice(0, MAX_QUESTION_LENGTH);
      if (!text || !document || sending) return;

      setSending(true);
      setInputText('');

      const userMsg: IMessage = {
        _id: `u-${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
        role: 'user',
      };

      const withUser = [...messages, userMsg];
      persistMessages(withUser);
      scrollToBottom();

      try {
        if (useRealApi) {
          const assistantId = `a-${Date.now()}`;
          let assistantMsg: IMessage = {
            _id: assistantId,
            text: '',
            createdAt: new Date().toISOString(),
            role: 'assistant',
            sources: [],
          };
          let current = [...withUser, assistantMsg];
          persistMessages(current);
          setAwaitingFirstToken(true);

          await streamChat(
            {
              documentId,
              question: text,
              content: document.content,
              title: document.title,
            },
            {
              onSources: (sources: ISourceChip[]) => {
                assistantMsg = { ...assistantMsg, sources };
                current = [...withUser, assistantMsg];
                persistMessages(current);
              },
              onNotice: (message: string) => {
                Toast.show({
                  type: 'info',
                  text1: 'Using local fallback',
                  text2: message,
                });
              },
              onToken: (token: string) => {
                setAwaitingFirstToken(false);
                assistantMsg = {
                  ...assistantMsg,
                  text: `${assistantMsg.text}${token}`,
                };
                current = [...withUser, assistantMsg];
                persistMessages(current);
                scrollToBottom();
              },
              onDone: () => {
                setAwaitingFirstToken(false);
                if (!assistantMsg.text.trim()) {
                  assistantMsg = {
                    ...assistantMsg,
                    text: getMockAiReply(
                      text,
                      document.title,
                      document.content,
                    ),
                  };
                  current = [...withUser, assistantMsg];
                  persistMessages(current);
                }
              },
              onError: (message: string) => {
                setAwaitingFirstToken(false);
                Toast.show({
                  type: 'info',
                  text1: 'Backend unavailable',
                  text2: message || 'Showing a local answer instead.',
                });
                const fallback: IMessage = {
                  _id: assistantId,
                  text: getMockAiReply(text, document.title, document.content),
                  createdAt: new Date().toISOString(),
                  role: 'assistant',
                  sources: [
                    {
                      id: 'local-1',
                      label: 'Local match',
                      snippet: document.content.slice(0, 120),
                    },
                  ],
                };
                persistMessages([...withUser, fallback]);
              },
            },
          );
        } else {
          setAwaitingFirstToken(true);
          await new Promise<void>(resolve => setTimeout(resolve, 800));
          setAwaitingFirstToken(false);
          const replyText = getMockAiReply(
            text,
            document.title,
            document.content,
          );
          const assistantMsg: IMessage = {
            _id: `a-${Date.now()}`,
            text: replyText,
            createdAt: new Date().toISOString(),
            role: 'assistant',
            sources: [
              {
                id: 'local-1',
                label: 'Chunk 1 (local)',
                snippet: document.content.replace(/\s+/g, ' ').slice(0, 120),
              },
            ],
          };
          persistMessages([...withUser, assistantMsg]);
          scrollToBottom();
        }
      } finally {
        setSending(false);
        setAwaitingFirstToken(false);
      }
    },
    [
      document,
      sending,
      documentId,
      useRealApi,
      messages,
      persistMessages,
      scrollToBottom,
    ],
  );

  const handleSend = useCallback(() => {
    sendQuestion(inputText);
  }, [inputText, sendQuestion]);

  const handleSuggestion = useCallback(
    (suggestion: string) => {
      sendQuestion(suggestion);
    },
    [sendQuestion],
  );

  const setInputTextSafe = useCallback((value: string) => {
    setInputText(value.slice(0, MAX_QUESTION_LENGTH));
  }, []);

  const showSuggestions =
    messages.length <= 1 &&
    !sending &&
    messages.every(m => m.role === 'assistant');

  return {
    values: {
      document,
      messages,
      inputText,
      sending,
      awaitingFirstToken,
      flatListRef,
      useRealApi,
      maxQuestionLength: MAX_QUESTION_LENGTH,
      showSuggestions,
      suggestions: CHAT_SUGGESTIONS,
    },
    functions: {
      setInputText: setInputTextSafe,
      handleSend,
      handleSuggestion,
      scrollToBottom,
    },
  };
};

export default useDocumentChatController;
