import { useState, useCallback } from 'react';
import { useAuth } from '../use-auth';
import { processStreamingResponse, getOrCreateSessionId, handleAgentError } from '@/utils/streamingUtils';

interface AgentRequest {
  message: string;
  userType?: string;
  streaming?: boolean;
  context?: Record<string, unknown>;
}

interface AgentInsight {
  type: 'recommendation' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
}

interface AgentResponse {
  id: string;
  content: string;
  agentType: string;
  timestamp: Date;
  suggestions?: string[];
  insights?: AgentInsight[];
  metadata?: Record<string, unknown>;
}

export function useAgent() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string,
    options?: {
      userType?: string;
      streaming?: boolean;
      onChunk?: (chunk: string) => void;
      context?: Record<string, unknown>;
    }
  ): Promise<AgentResponse | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sessionId = getOrCreateSessionId();
      
      const requestBody = {
        userId: user.id,
        userType: options?.userType || user.userType,
        message,
        sessionId,
        streaming: options?.streaming || false,
        context: options?.context || {}
      };

      if (options?.streaming) {
        return await handleStreamingRequest(requestBody, options.onChunk);
      } else {
        return await handleRegularRequest(requestBody);
      }
    } catch (err) {
      const errorMessage = handleAgentError(err, 'Agent message');
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleRegularRequest = async (requestBody: AgentRequest & { userId: string; sessionId: string }): Promise<AgentResponse> => {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      ...data,
      timestamp: new Date(data.timestamp)
    };
  };

  const handleStreamingRequest = async (
    requestBody: AgentRequest & { userId: string; sessionId: string },
    onChunk?: (chunk: string) => void
  ): Promise<AgentResponse> => {
    const response = await fetch('/api/ai/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    return processStreamingResponse(response, onChunk, requestBody.userType);
  };

  return {
    sendMessage,
    isLoading,
    error
  };
}

// Session ID utility moved to streamingUtils.ts