import { useState, useEffect, useCallback } from 'react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'event' | 'schedule' | 'manual';
    event?: string;
    schedule?: string;
  };
  conditions: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  actions: Array<{
    type: string;
    parameters: Record<string, any>;
  }>;
  enabled: boolean;
  priority: number;
}

export function useAutomation() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/automation/rules');
      if (!response.ok) throw new Error('Failed to load rules');
      
      const data = await response.json();
      setRules(data.rules || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rules');
      console.error('Error loading automation rules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createRule = async (rule: Omit<AutomationRule, 'id'>) => {
    try {
      const response = await fetch('/api/ai/automation/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      });

      if (!response.ok) throw new Error('Failed to create rule');
      
      const data = await response.json();
      setRules(prev => [...prev, data.rule]);
      return data.rule;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create rule');
      throw err;
    }
  };

  const updateRule = async (id: string, updates: Partial<AutomationRule>) => {
    try {
      const response = await fetch(`/api/ai/automation/rules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update rule');
      
      const data = await response.json();
      setRules(prev => prev.map(r => r.id === id ? data.rule : r));
      return data.rule;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rule');
      throw err;
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const response = await fetch(`/api/ai/automation/rules/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete rule');
      
      setRules(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete rule');
      throw err;
    }
  };

  const toggleRule = useCallback(async (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return;

    await updateRule(id, { enabled: !rule.enabled });
  }, [rules]);

  const triggerRule = async (id: string, context?: Record<string, any>) => {
    try {
      const response = await fetch(`/api/ai/automation/rules/${id}/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context })
      });

      if (!response.ok) throw new Error('Failed to trigger rule');
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger rule');
      throw err;
    }
  };

  return {
    rules,
    isLoading,
    error,
    loadRules,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    triggerRule
  };
}