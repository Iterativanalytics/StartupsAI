import React from 'react';

// Performance monitoring utilities

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

interface PerformanceConfig {
  enabled: boolean;
  sampleRate: number;
  maxMetrics: number;
  endpoint?: string;
}

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: PerformanceMetric[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enabled: true,
      sampleRate: 1.0,
      maxMetrics: 1000,
      ...config
    };
  }

  // Start timing a performance metric
  startTiming(name: string): () => void {
    if (!this.config.enabled || Math.random() > this.config.sampleRate) {
      return () => {};
    }

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      this.recordMetric({
        name,
        value: endTime - startTime,
        timestamp: Date.now()
      });
    };
  }

  // Record a custom metric
  recordMetric(metric: PerformanceMetric): void {
    if (!this.config.enabled) return;

    this.metrics.push(metric);
    
    // Keep only the most recent metrics
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics = this.metrics.slice(-this.config.maxMetrics);
    }

    // Send to monitoring endpoint if configured
    if (this.config.endpoint) {
      this.sendMetric(metric);
    }
  }

  // Get performance metrics
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name);
    }
    return [...this.metrics];
  }

  // Get average performance for a metric
  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  // Monitor Web Vitals
  monitorWebVitals(): void {
    if (!this.config.enabled) return;

    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // First Contentful Paint (FCP)
    this.observeFCP();
  }

  private observeLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.recordMetric({
        name: 'LCP',
        value: lastEntry.startTime,
        timestamp: Date.now(),
        metadata: {
          element: lastEntry.element?.tagName,
          url: lastEntry.url
        }
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.set('LCP', observer);
  }

  private observeFID(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.recordMetric({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          timestamp: Date.now(),
          metadata: {
            eventType: entry.name,
            target: entry.target?.tagName
          }
        });
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.set('FID', observer);
  }

  private observeCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.recordMetric({
        name: 'CLS',
        value: clsValue,
        timestamp: Date.now()
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('CLS', observer);
  }

  private observeFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.recordMetric({
          name: 'FCP',
          value: entry.startTime,
          timestamp: Date.now()
        });
      });
    });

    observer.observe({ entryTypes: ['paint'] });
    this.observers.set('FCP', observer);
  }

  private async sendMetric(metric: PerformanceMetric): Promise<void> {
    if (!this.config.endpoint) return;

    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metric)
      });
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  // Clean up observers
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor({
  enabled: process.env.NODE_ENV === 'production',
  sampleRate: 0.1, // 10% sampling in production
  maxMetrics: 1000
});

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = React.useState<PerformanceMetric[]>([]);

  React.useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const recordMetric = React.useCallback((metric: Omit<PerformanceMetric, 'timestamp'>) => {
    performanceMonitor.recordMetric({
      ...metric,
      timestamp: Date.now()
    });
  }, []);

  const startTiming = React.useCallback((name: string) => {
    return performanceMonitor.startTiming(name);
  }, []);

  return {
    metrics,
    recordMetric,
    startTiming,
    getAverageMetric: performanceMonitor.getAverageMetric.bind(performanceMonitor)
  };
}

// Performance decorator for functions
export function measurePerformance(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const endTiming = performanceMonitor.startTiming(name);
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } finally {
        endTiming();
      }
    };

    return descriptor;
  };
}

// Performance utility for React components
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const WrappedComponent = (props: P) => {
    const endTiming = performanceMonitor.startTiming(`component-render-${componentName}`);
    
    React.useEffect(() => {
      endTiming();
    });

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  
  return WrappedComponent;
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.monitorWebVitals();
}
