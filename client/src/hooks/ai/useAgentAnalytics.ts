import { useState, useEffect } from 'react';

interface AgentAnalytics {
  totalConversations: number;
  totalMessages: number;
  averageResponseTime: number;
  satisfactionScore: number;
  topTopics: Array<{
    topic: string;
    count: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: Date;
  }>;
  usageStats: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export function useAgentAnalytics() {
  const [analytics, setAnalytics] = useState<AgentAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analytics');
      
      if (!response.ok) {
        throw new Error('Failed to load analytics');
      }

      const data = await response.json();
      setAnalytics({
        ...data,
        recentActivities: data.recentActivities?.map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        })) || []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      console.error('Error loading agent analytics:', err);
      
      // Set fallback data
      setAnalytics({
        totalConversations: 0,
        totalMessages: 0,
        averageResponseTime: 0,
        satisfactionScore: 0,
        topTopics: [],
        recentActivities: [],
        usageStats: {
          today: 0,
          thisWeek: 0,
          thisMonth: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const trackInteraction = async (type: string, metadata?: Record<string, any>) => {
    try {
      await fetch('/api/ai/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, metadata, timestamp: new Date() })
      });
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  };

  const provideFeedback = async (messageId: string, rating: number, comment?: string) => {
    try {
      await fetch('/api/ai/analytics/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, rating, comment })
      });
      
      // Reload analytics to reflect new feedback
      await loadAnalytics();
    } catch (err) {
      console.error('Failed to provide feedback:', err);
      throw err;
    }
  };

  return {
    analytics,
    isLoading,
    error,
    loadAnalytics,
    trackInteraction,
    provideFeedback
  };
}