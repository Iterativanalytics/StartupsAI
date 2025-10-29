import Anthropic from '@anthropic-ai/sdk';
import { BaseAgent } from '../base-agent';
import { AgentType, AgentConfig, AgentContext } from '../../types';

export class BusinessAnalystAgent extends BaseAgent {
  protected agentType = AgentType.BUSINESS_ANALYST;

  constructor(client: Anthropic, config: AgentConfig) {
    super(client, config);
  }

  protected async generateInsights(context: AgentContext): Promise<string[]> {
    const insights: string[] = [];

    // Platform-wide analytics
    if (context.relevantData?.platformMetrics) {
      insights.push(await this.analyzePlatformHealth(context.relevantData.platformMetrics));
    }

    // Workflow coordination
    if (context.relevantData?.workflows) {
      insights.push(await this.optimizeWorkflows(context.relevantData.workflows));
    }

    // Anomaly detection
    if (context.relevantData?.activities) {
      insights.push(await this.detectAnomalies(context.relevantData.activities));
    }

    return insights;
  }

  private async analyzePlatformHealth(metrics: any): Promise<string> {
    const activeUsers = metrics.activeUsers || 0;
    const totalUsers = metrics.totalUsers || 1;
    const engagementRate = activeUsers / totalUsers;

    if (engagementRate < 0.3) {
      return `⚠️ Platform Engagement: ${(engagementRate * 100).toFixed(1)}% - Below healthy threshold. Consider engagement initiatives.`;
    }

    return `Platform Health: ${(engagementRate * 100).toFixed(1)}% engagement rate, ${metrics.transactions || 0} transactions this month.`;
  }

  private async optimizeWorkflows(workflows: any[]): Promise<string> {
    const bottlenecks = workflows.filter(w => w.averageCompletionTime > w.targetTime * 1.5);

    if (bottlenecks.length > 0) {
      return `💡 Workflow Optimization: ${bottlenecks.length} workflows have bottlenecks. Priority: ${bottlenecks[0].name}`;
    }

    return 'Workflows operating efficiently within target parameters.';
  }

  private async detectAnomalies(activities: any[]): Promise<string> {
    // Simple anomaly detection - in production would use statistical models
    const recentActivities = activities.slice(-24); // Last 24 hours
    const avgActivity = recentActivities.length / 24;

    const lastHour = activities.filter(a => {
      const hourAgo = new Date(Date.now() - 3600000);
      return new Date(a.timestamp) > hourAgo;
    }).length;

    if (lastHour > avgActivity * 3) {
      return `⚠️ Anomaly Detected: Activity spike (${lastHour} vs avg ${avgActivity.toFixed(0)}). Investigating...`;
    }

    if (lastHour < avgActivity * 0.3) {
      return `⚠️ Anomaly Detected: Activity drop (${lastHour} vs avg ${avgActivity.toFixed(0)}). System check recommended.`;
    }

    return 'No anomalies detected. Platform operating normally.';
  }
}