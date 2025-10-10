import { useCallback, useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  dataLoadTime: number;
  widgetCount: number;
  memoryUsage?: number;
  errorCount: number;
}

interface PerformanceThresholds {
  maxRenderTime: number; // milliseconds
  maxDataLoadTime: number; // milliseconds
  maxWidgetCount: number;
  maxMemoryUsage: number; // MB
}

const defaultThresholds: PerformanceThresholds = {
  maxRenderTime: 100,
  maxDataLoadTime: 1000,
  maxWidgetCount: 20,
  maxMemoryUsage: 100,
};

// Performance monitoring hook
export const useDashboardPerformance = (thresholds = defaultThresholds) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    dataLoadTime: 0,
    widgetCount: 0,
    errorCount: 0,
  });

  const [alerts, setAlerts] = useState<string[]>([]);
  const renderStartTime = useRef<number>(0);
  const dataLoadStartTime = useRef<number>(0);

  // Start performance measurement
  const startRenderMeasurement = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderMeasurement = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;
    setMetrics(prev => ({ ...prev, renderTime }));
    
    if (renderTime > thresholds.maxRenderTime) {
      setAlerts(prev => [...prev, `Render time exceeded threshold: ${renderTime.toFixed(2)}ms`]);
    }
  }, [thresholds.maxRenderTime]);

  const startDataLoadMeasurement = useCallback(() => {
    dataLoadStartTime.current = performance.now();
  }, []);

  const endDataLoadMeasurement = useCallback(() => {
    const dataLoadTime = performance.now() - dataLoadStartTime.current;
    setMetrics(prev => ({ ...prev, dataLoadTime }));
    
    if (dataLoadTime > thresholds.maxDataLoadTime) {
      setAlerts(prev => [...prev, `Data load time exceeded threshold: ${dataLoadTime.toFixed(2)}ms`]);
    }
  }, [thresholds.maxDataLoadTime]);

  const updateWidgetCount = useCallback((count: number) => {
    setMetrics(prev => ({ ...prev, widgetCount: count }));
    
    if (count > thresholds.maxWidgetCount) {
      setAlerts(prev => [...prev, `Widget count exceeded threshold: ${count}`]);
    }
  }, [thresholds.maxWidgetCount]);

  const incrementErrorCount = useCallback(() => {
    setMetrics(prev => ({ ...prev, errorCount: prev.errorCount + 1 }));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Memory usage monitoring (if available)
  useEffect(() => {
    if ('memory' in performance) {
      const updateMemoryUsage = () => {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
        setMetrics(prev => ({ ...prev, memoryUsage }));
        
        if (memoryUsage > thresholds.maxMemoryUsage) {
          setAlerts(prev => [...prev, `Memory usage exceeded threshold: ${memoryUsage.toFixed(2)}MB`]);
        }
      };

      updateMemoryUsage();
      const interval = setInterval(updateMemoryUsage, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [thresholds.maxMemoryUsage]);

  return {
    metrics,
    alerts,
    startRenderMeasurement,
    endRenderMeasurement,
    startDataLoadMeasurement,
    endDataLoadMeasurement,
    updateWidgetCount,
    incrementErrorCount,
    clearAlerts,
  };
};

// Widget-specific performance monitoring
export const useWidgetPerformance = (widgetId: string) => {
  const [renderTime, setRenderTime] = useState(0);
  const [dataFetchTime, setDataFetchTime] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const renderStartTime = useRef<number>(0);
  const dataFetchStartTime = useRef<number>(0);

  const startRender = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    const time = performance.now() - renderStartTime.current;
    setRenderTime(time);
  }, []);

  const startDataFetch = useCallback(() => {
    dataFetchStartTime.current = performance.now();
  }, []);

  const endDataFetch = useCallback(() => {
    const time = performance.now() - dataFetchStartTime.current;
    setDataFetchTime(time);
  }, []);

  const incrementError = useCallback(() => {
    setErrorCount(prev => prev + 1);
  }, []);

  // Log performance metrics
  useEffect(() => {
    if (renderTime > 50) { // Log slow renders
      console.warn(`Widget ${widgetId} slow render: ${renderTime.toFixed(2)}ms`);
    }
  }, [widgetId, renderTime]);

  useEffect(() => {
    if (dataFetchTime > 500) { // Log slow data fetches
      console.warn(`Widget ${widgetId} slow data fetch: ${dataFetchTime.toFixed(2)}ms`);
    }
  }, [widgetId, dataFetchTime]);

  return {
    renderTime,
    dataFetchTime,
    errorCount,
    startRender,
    endRender,
    startDataFetch,
    endDataFetch,
    incrementError,
  };
};

// Bundle size monitoring
export const useBundleSizeMonitoring = () => {
  const [bundleSize, setBundleSize] = useState<number>(0);
  const [chunkSizes, setChunkSizes] = useState<Record<string, number>>({});

  useEffect(() => {
    // This would typically be done at build time or through a webpack plugin
    // For now, we'll simulate it
    const estimateBundleSize = () => {
      // Estimate based on loaded modules
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      const sizes: Record<string, number> = {};

      scripts.forEach(script => {
        const src = (script as HTMLScriptElement).src;
        if (src.includes('chunk') || src.includes('bundle')) {
          // This is a simplified estimation
          const size = Math.random() * 100000; // Simulated size
          totalSize += size;
          sizes[src] = size;
        }
      });

      setBundleSize(totalSize);
      setChunkSizes(sizes);
    };

    estimateBundleSize();
  }, []);

  return { bundleSize, chunkSizes };
};

// Performance optimization suggestions
export const usePerformanceOptimizations = (metrics: PerformanceMetrics) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const newSuggestions: string[] = [];

    if (metrics.renderTime > 100) {
      newSuggestions.push('Consider memoizing expensive components');
    }

    if (metrics.dataLoadTime > 1000) {
      newSuggestions.push('Optimize API calls or implement caching');
    }

    if (metrics.widgetCount > 15) {
      newSuggestions.push('Consider lazy loading or virtual scrolling for widgets');
    }

    if (metrics.memoryUsage && metrics.memoryUsage > 100) {
      newSuggestions.push('Check for memory leaks in widgets');
    }

    if (metrics.errorCount > 5) {
      newSuggestions.push('Review error handling in widgets');
    }

    setSuggestions(newSuggestions);
  }, [metrics]);

  return suggestions;
};

// Performance reporting
export const usePerformanceReporting = () => {
  const reportMetrics = useCallback((metrics: PerformanceMetrics, context: string) => {
    // Send metrics to analytics service
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'dashboard_performance', {
        event_category: 'performance',
        event_label: context,
        value: Math.round(metrics.renderTime),
        custom_map: {
          data_load_time: metrics.dataLoadTime,
          widget_count: metrics.widgetCount,
          memory_usage: metrics.memoryUsage,
          error_count: metrics.errorCount,
        },
      });
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Dashboard Performance Metrics:', {
        context,
        ...metrics,
      });
    }
  }, []);

  return { reportMetrics };
};
