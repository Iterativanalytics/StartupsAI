import { useState, useEffect } from 'react';
import { useAuth } from '../use-auth';

interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  priority: number;
}

export function useSmartSuggestions() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSuggestions();
    }
  }, [user]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
      // Fallback to default suggestions
      setSuggestions(getDefaultSuggestions(user?.userType));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSuggestions = async (context?: Record<string, any>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context })
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to refresh suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suggestions,
    isLoading,
    refreshSuggestions
  };
}

function getDefaultSuggestions(userType?: string): SmartSuggestion[] {
  const suggestionMap: Record<string, SmartSuggestion[]> = {
    entrepreneur: [
      {
        id: '1',
        title: 'Review Business Plan',
        description: 'Get AI feedback on your business plan',
        prompt: 'Can you review my business plan and provide specific feedback?',
        category: 'planning',
        priority: 1
      },
      {
        id: '2',
        title: 'Calculate Financial Runway',
        description: 'Analyze your cash position and burn rate',
        prompt: 'Calculate my financial runway based on current metrics',
        category: 'financial',
        priority: 2
      },
      {
        id: '3',
        title: 'Market Analysis',
        description: 'Get insights on your target market',
        prompt: 'Help me analyze my target market and competition',
        category: 'market',
        priority: 3
      }
    ],
    investor: [
      {
        id: '1',
        title: 'Evaluate Deal',
        description: 'Analyze a potential investment',
        prompt: 'Help me evaluate this investment opportunity',
        category: 'analysis',
        priority: 1
      },
      {
        id: '2',
        title: 'Portfolio Review',
        description: 'Review your investment portfolio',
        prompt: 'Analyze my current investment portfolio',
        category: 'portfolio',
        priority: 2
      }
    ],
    lender: [
      {
        id: '1',
        title: 'Credit Assessment',
        description: 'Evaluate loan application creditworthiness',
        prompt: 'Assess the credit risk of this application',
        category: 'credit',
        priority: 1
      }
    ],
    grantor: [
      {
        id: '1',
        title: 'Impact Evaluation',
        description: 'Assess social and environmental impact',
        prompt: 'Evaluate the impact potential of this grant application',
        category: 'impact',
        priority: 1
      }
    ],
    partner: [
      {
        id: '1',
        title: 'Startup Matching',
        description: 'Find compatible startups for your program',
        prompt: 'Find startups that match our partnership criteria',
        category: 'matching',
        priority: 1
      }
    ]
  };

  return suggestionMap[userType || 'entrepreneur'] || suggestionMap.entrepreneur;
}