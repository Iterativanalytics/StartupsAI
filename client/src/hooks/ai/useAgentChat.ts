import { useState, useCallback, useEffect } from 'react';
import { useAgent } from './useAgent';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  insights?: any[];
  suggestions?: string[];
  metadata?: Record<string, any>;
}

export function useAgentChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { sendMessage: sendAgentMessage, isLoading, error } = useAgent();

  // Load conversation history on mount
  useEffect(() => {
    loadConversationHistory();
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      saveConversationHistory();
    }
  }, [messages]);

  const loadConversationHistory = useCallback(() => {
    try {
      const stored = localStorage.getItem('ai_chat_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, []);

  const saveConversationHistory = useCallback(() => {
    try {
      localStorage.setItem('ai_chat_history', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, [messages]);

  const sendMessage = useCallback(async (content: string, context?: Record<string, any>) => {
    // Add user message immediately
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Send to agent with streaming
    let assistantContent = '';
    const assistantId = `msg-${Date.now()}-assistant`;

    const response = await sendAgentMessage(content, {
      streaming: true,
      context,
      onChunk: (chunk) => {
        assistantContent += chunk;
        
        setMessages(prev => {
          const withoutLastAssistant = prev.filter(m => m.id !== assistantId);
          return [
            ...withoutLastAssistant,
            {
              id: assistantId,
              role: 'assistant' as const,
              content: assistantContent,
              timestamp: new Date()
            }
          ];
        });
      }
    });

    // Update with final response including insights and suggestions
    if (response) {
      setMessages(prev => {
        const withoutLastAssistant = prev.filter(m => m.id !== assistantId);
        return [
          ...withoutLastAssistant,
          {
            id: response.id,
            role: 'assistant' as const,
            content: response.content,
            timestamp: response.timestamp,
            insights: response.insights,
            suggestions: response.suggestions,
            metadata: response.metadata
          }
        ];
      });
    }
  }, [sendAgentMessage]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('ai_chat_history');
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const regenerateLastResponse = useCallback(async () => {
    if (messages.length < 2) return;

    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last assistant response
    setMessages(prev => {
      const lastAssistantIndex = prev.findLastIndex(m => m.role === 'assistant');
      if (lastAssistantIndex === -1) return prev;
      return prev.slice(0, lastAssistantIndex);
    });

    // Resend the last user message
    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  return {
    messages,
    sendMessage,
    clearHistory,
    deleteMessage,
    regenerateLastResponse,
    isLoading,
    error
  };
}