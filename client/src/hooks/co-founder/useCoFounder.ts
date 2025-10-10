
import { useState, useCallback } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface CoFounderMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: string;
}

export interface CoFounderResponse {
  content: string;
  suggestions?: string[];
  actions?: Array<{
    type: string;
    label: string;
    data?: any;
  }>;
  insights?: any[];
}

export function useCoFounder() {
  const [conversationHistory, setConversationHistory] = useState<CoFounderMessage[]>([]);
  const [currentMode, setCurrentMode] = useState<string>('general');

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, mode }: { message: string; mode?: string }) => {
      const response = await apiRequest<CoFounderResponse>('/api/ai-agents/co-founder/chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
          mode: mode || currentMode,
          conversationHistory: conversationHistory.slice(-10)
        })
      });
      return response;
    },
    onSuccess: (data, variables) => {
      setConversationHistory(prev => [
        ...prev,
        {
          role: 'user',
          content: variables.message,
          timestamp: new Date().toISOString(),
          mode: variables.mode || currentMode
        },
        {
          role: 'assistant',
          content: data.content,
          timestamp: new Date().toISOString(),
          mode: variables.mode || currentMode
        }
      ]);
    }
  });

  const startSession = useCallback((mode: string) => {
    setCurrentMode(mode);
    setConversationHistory([]);
  }, []);

  const sendMessage = useCallback(async (message: string, mode?: string) => {
    return sendMessageMutation.mutateAsync({ message, mode });
  }, [sendMessageMutation]);

  const clearHistory = useCallback(() => {
    setConversationHistory([]);
  }, []);

  return {
    conversationHistory,
    currentMode,
    startSession,
    sendMessage,
    clearHistory,
    isLoading: sendMessageMutation.isPending
  };
}
