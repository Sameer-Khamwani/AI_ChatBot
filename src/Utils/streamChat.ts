import { BASE_URL } from './baseUrls';
import { ISourceChip } from './interface';

export type StreamChatBody = {
  documentId: string;
  question: string;
  content?: string;
  title?: string;
};

export type StreamChatHandlers = {
  onSources?: (sources: ISourceChip[]) => void;
  onToken?: (token: string) => void;
  onDone?: (documentId?: string) => void;
  onError?: (message: string) => void;
  onNotice?: (message: string) => void;
};

const parseSseChunk = (
  chunk: string,
  handlers: StreamChatHandlers,
): void => {
  const blocks = chunk.split('\n\n');
  for (const block of blocks) {
    if (!block.trim()) continue;
    const lines = block.split('\n');
    let event = 'message';
    let dataLine = '';
    for (const line of lines) {
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLine += line.slice(5).trim();
      }
    }
    if (!dataLine) continue;
    try {
      const data = JSON.parse(dataLine);
      if (event === 'sources' && Array.isArray(data.sources)) {
        handlers.onSources?.(data.sources);
      } else if (event === 'token' && typeof data.token === 'string') {
        handlers.onToken?.(data.token);
      } else if (event === 'done') {
        handlers.onDone?.(data.documentId);
      } else if (event === 'notice') {
        handlers.onNotice?.(data.message || 'Notice');
      } else if (event === 'error') {
        handlers.onError?.(data.message || 'Stream error');
      }
    } catch {
      // ignore malformed chunk
    }
  }
};

/**
 * Streams chat SSE from POST /chat/stream.
 * Works with React Native fetch when response.body.getReader is available;
 * falls back to reading full text if streaming body is unsupported.
 */
export const streamChat = async (
  body: StreamChatBody,
  handlers: StreamChatHandlers,
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const err = await response.json();
      message = err.message || message;
    } catch {
      // ignore
    }
    handlers.onError?.(message);
    throw new Error(message);
  }

  const reader = (response.body as any)?.getReader?.();
  if (!reader) {
    const text = await response.text();
    parseSseChunk(text, handlers);
    return;
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';
    for (const part of parts) {
      parseSseChunk(`${part}\n\n`, handlers);
    }
  }

  if (buffer.trim()) {
    parseSseChunk(buffer, handlers);
  }
};
