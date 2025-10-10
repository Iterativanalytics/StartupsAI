/**
 * Utility functions for handling streaming responses
 * Centralizes streaming logic to avoid duplication across agent clients
 */

export interface StreamingChunk {
  chunk?: string;
  metadata?: any;
  done?: boolean;
}

export interface StreamingResponse {
  id: string;
  content: string;
  agentType: string;
  timestamp: Date;
  suggestions?: string[];
  insights?: any[];
  actions?: any[];
  metadata?: any;
}

/**
 * Processes a streaming response from an SSE endpoint
 * Handles chunk parsing, error recovery, and metadata extraction
 */
export async function processStreamingResponse(
  response: Response,
  onChunk?: (chunk: string) => void,
  fallbackAgentType: string = 'unknown'
): Promise<StreamingResponse> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
    throw new Error(error.message || 'Failed to process streaming response');
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';
  let metadata: any = {};

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed: StreamingChunk = JSON.parse(data);
            if (parsed.chunk) {
              fullContent += parsed.chunk;
              onChunk?.(parsed.chunk);
            }
            if (parsed.metadata) {
              metadata = { ...metadata, ...parsed.metadata };
            }
          } catch (e) {
            // Ignore parse errors for partial chunks
            console.debug('Failed to parse streaming chunk:', e);
          }
        }
      }
    }
  }

  return {
    id: metadata.id || `resp-${Date.now()}`,
    content: fullContent,
    agentType: metadata.agentType || fallbackAgentType,
    timestamp: new Date(),
    suggestions: metadata.suggestions,
    insights: metadata.insights,
    actions: metadata.actions,
    metadata
  };
}

/**
 * Creates a session ID for agent conversations
 * Centralizes session ID generation logic
 */
export function getOrCreateSessionId(): string {
  const STORAGE_KEY = 'ai_session_id';
  let sessionId = sessionStorage.getItem(STORAGE_KEY);
  
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Standardized error handling for agent requests
 * Provides consistent error messages and logging
 */
export function handleAgentError(error: any, context: string = 'Agent request'): string {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  console.error(`${context} error:`, error);
  return errorMessage;
}
