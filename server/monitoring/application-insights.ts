/**
 * Azure Application Insights Integration
 * Centralized monitoring and telemetry
 */

import { logger } from '../utils/logger';

interface TelemetryConfig {
  instrumentationKey?: string;
  connectionString?: string;
  enableAutoCollection: boolean;
  enableLiveMetrics: boolean;
  samplingPercentage: number;
}

interface CustomMetric {
  name: string;
  value: number;
  properties?: Record<string, string>;
}

interface CustomEvent {
  name: string;
  properties?: Record<string, string>;
  measurements?: Record<string, number>;
}

class ApplicationInsightsService {
  private client: any = null;
  private isInitialized = false;
  private config: TelemetryConfig;

  constructor() {
    this.config = {
      instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
      connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
      enableAutoCollection: true,
      enableLiveMetrics: process.env.NODE_ENV === 'production',
      samplingPercentage: 100
    };
  }

  /**
   * Initialize Application Insights
   */
  initialize(): void {
    if (this.isInitialized) {
      logger.warn('Application Insights already initialized');
      return;
    }

    if (!this.config.connectionString && !this.config.instrumentationKey) {
      logger.warn('Application Insights not configured - running without telemetry');
      return;
    }

    try {
      // Dynamic import to avoid issues if package not installed
      const appInsights = require('applicationinsights');
      
      appInsights.setup(this.config.connectionString || this.config.instrumentationKey)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(this.config.enableAutoCollection)
        .setAutoCollectPerformance(this.config.enableAutoCollection, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(this.config.enableAutoCollection)
        .setAutoCollectConsole(true, true)
        .setUseDiskRetryCaching(true)
        .setSendLiveMetrics(this.config.enableLiveMetrics)
        .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C);

      // Set sampling percentage
      appInsights.defaultClient.config.samplingPercentage = this.config.samplingPercentage;

      // Start collection
      appInsights.start();

      this.client = appInsights.defaultClient;
      this.isInitialized = true;

      logger.info('Application Insights initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Application Insights', error);
    }
  }

  /**
   * Track custom metric
   */
  trackMetric(metric: CustomMetric): void {
    if (!this.isInitialized || !this.client) {
      logger.debug('Metric not tracked - Application Insights not initialized', metric);
      return;
    }

    try {
      this.client.trackMetric({
        name: metric.name,
        value: metric.value,
        properties: metric.properties
      });
    } catch (error) {
      logger.error('Failed to track metric', error, { metric });
    }
  }

  /**
   * Track custom event
   */
  trackEvent(event: CustomEvent): void {
    if (!this.isInitialized || !this.client) {
      logger.debug('Event not tracked - Application Insights not initialized', event);
      return;
    }

    try {
      this.client.trackEvent({
        name: event.name,
        properties: event.properties,
        measurements: event.measurements
      });
    } catch (error) {
      logger.error('Failed to track event', error, { event });
    }
  }

  /**
   * Track exception
   */
  trackException(error: Error, properties?: Record<string, string>): void {
    if (!this.isInitialized || !this.client) {
      logger.debug('Exception not tracked - Application Insights not initialized', { error: error.message });
      return;
    }

    try {
      this.client.trackException({
        exception: error,
        properties
      });
    } catch (err) {
      logger.error('Failed to track exception', err);
    }
  }

  /**
   * Track dependency call
   */
  trackDependency(
    name: string,
    commandName: string,
    duration: number,
    success: boolean,
    dependencyType: string = 'HTTP'
  ): void {
    if (!this.isInitialized || !this.client) {
      return;
    }

    try {
      this.client.trackDependency({
        target: name,
        name: commandName,
        data: commandName,
        duration,
        resultCode: success ? 200 : 500,
        success,
        dependencyTypeName: dependencyType
      });
    } catch (error) {
      logger.error('Failed to track dependency', error);
    }
  }

  /**
   * Track request
   */
  trackRequest(
    name: string,
    url: string,
    duration: number,
    responseCode: number,
    success: boolean
  ): void {
    if (!this.isInitialized || !this.client) {
      return;
    }

    try {
      this.client.trackRequest({
        name,
        url,
        duration,
        resultCode: responseCode,
        success
      });
    } catch (error) {
      logger.error('Failed to track request', error);
    }
  }

  /**
   * Flush telemetry
   */
  async flush(): Promise<void> {
    if (!this.isInitialized || !this.client) {
      return;
    }

    return new Promise((resolve) => {
      this.client.flush({
        callback: () => {
          logger.info('Application Insights telemetry flushed');
          resolve();
        }
      });
    });
  }

  /**
   * Shutdown Application Insights
   */
  async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    await this.flush();
    this.isInitialized = false;
    logger.info('Application Insights shutdown complete');
  }
}

// Export singleton instance
export const appInsights = new ApplicationInsightsService();

// Auto-initialize if configured
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  appInsights.initialize();
}
