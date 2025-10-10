import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { WidgetConfig } from '../types/dashboard.types';

interface WidgetDataConfig {
  widgetId: string;
  config?: WidgetConfig;
  enabled?: boolean;
  refetchInterval?: number;
}

// Smart data fetching hook for widgets
export const useWidgetData = ({ 
  widgetId, 
  config, 
  enabled = true 
}: WidgetDataConfig) => {
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ['widget', widgetId, config], [widgetId, config]);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      // This would be replaced with actual API calls
      const response = await fetch(`/api/widgets/${widgetId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data for widget ${widgetId}`);
      }
      
      return response.json();
    },
    staleTime: config?.refreshInterval || 300000, // 5 minutes default
    refetchInterval: config?.autoRefresh ? config.refreshInterval : false,
    enabled: enabled && config?.enabled !== false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const prefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const response = await fetch(`/api/widgets/${widgetId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });
        return response.json();
      },
    });
  }, [queryClient, queryKey, widgetId, config]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
    refresh,
    prefetch,
    isStale: query.isStale,
    lastUpdated: query.dataUpdatedAt,
  };
};

// Batch data fetching for multiple widgets
export const useBatchWidgetData = (widgetIds: string[]) => {
  const queryClient = useQueryClient();

  const queries = useQuery({
    queryKey: ['batch-widgets', widgetIds],
    queryFn: async () => {
      const responses = await Promise.all(
        widgetIds.map(id => 
          fetch(`/api/widgets/${id}`)
            .then(res => res.json())
            .catch(error => ({ id, error: error.message }))
        )
      );
      
      return responses.reduce((acc, data, index) => {
        acc[widgetIds[index]] = data;
        return acc;
      }, {} as Record<string, any>);
    },
    staleTime: 300000, // 5 minutes
    enabled: widgetIds.length > 0,
  });

  const refreshAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['batch-widgets', widgetIds] });
  }, [queryClient, widgetIds]);

  return {
    data: queries.data,
    isLoading: queries.isLoading,
    error: queries.error,
    refreshAll,
  };
};

// Prefetch critical widgets
export const usePrefetchCriticalWidgets = (userType: string) => {
  const queryClient = useQueryClient();

  const prefetchCritical = useCallback(async () => {
    const criticalWidgets = getCriticalWidgets(userType);
    
    await Promise.all(
      criticalWidgets.map(widget => 
        queryClient.prefetchQuery({
          queryKey: ['widget', widget.id],
          queryFn: () => fetch(`/api/widgets/${widget.id}`).then(res => res.json()),
          staleTime: 300000,
        })
      )
    );
  }, [queryClient, userType]);

  return { prefetchCritical };
};

// Get critical widgets for a user type
const getCriticalWidgets = (userType: string) => {
  const criticalWidgets: Record<string, Array<{ id: string; priority: number }>> = {
    entrepreneur: [
      { id: 'revenue-overview', priority: 10 },
      { id: 'goals-tracker', priority: 9 },
      { id: 'activity-feed', priority: 8 },
    ],
    investor: [
      { id: 'portfolio-overview', priority: 10 },
      { id: 'deal-pipeline', priority: 9 },
      { id: 'activity-feed', priority: 8 },
    ],
    lender: [
      { id: 'credit-monitoring', priority: 10 },
      { id: 'loan-portfolio', priority: 9 },
      { id: 'activity-feed', priority: 8 },
    ],
  };

  return criticalWidgets[userType.toLowerCase()] || [];
};

// Real-time data updates using WebSocket
export const useRealtimeWidget = (widgetId: string, enabled = true) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['realtime-widget', widgetId],
    queryFn: () => {
      return new Promise((resolve, reject) => {
        const ws = new WebSocket(`wss://api.example.com/widgets/${widgetId}/realtime`);
        
        ws.onopen = () => {
          console.log(`Connected to realtime updates for widget ${widgetId}`);
        };
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          queryClient.setQueryData(['widget', widgetId], data);
          resolve(data);
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
        
        ws.onclose = () => {
          console.log(`Disconnected from realtime updates for widget ${widgetId}`);
        };
      });
    },
    enabled,
    staleTime: Infinity, // Real-time data doesn't go stale
    refetchInterval: false,
  });

  return { data, isLoading, error };
};

// Optimistic updates for widget actions
export const useOptimisticWidgetUpdate = (widgetId: string) => {
  const queryClient = useQueryClient();

  const optimisticUpdate = useCallback((updater: (oldData: any) => any) => {
    queryClient.setQueryData(['widget', widgetId], updater);
  }, [queryClient, widgetId]);

  const rollback = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['widget', widgetId] });
  }, [queryClient, widgetId]);

  return { optimisticUpdate, rollback };
};

// Cache management utilities
export const useWidgetCache = () => {
  const queryClient = useQueryClient();

  const clearWidgetCache = useCallback((widgetId?: string) => {
    if (widgetId) {
      queryClient.removeQueries({ queryKey: ['widget', widgetId] });
    } else {
      queryClient.removeQueries({ queryKey: ['widget'] });
    }
  }, [queryClient]);

  const getCacheSize = useCallback(() => {
    return queryClient.getQueryCache().getAll().length;
  }, [queryClient]);

  const clearStaleData = useCallback(() => {
    queryClient.getQueryCache().clear();
  }, [queryClient]);

  return {
    clearWidgetCache,
    getCacheSize,
    clearStaleData,
  };
};
