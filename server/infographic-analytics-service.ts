import { InfographicData } from './ai-infographic-service';

export interface InfographicAnalytics {
  id: string;
  infographicId: string;
  userId: string;
  event: 'created' | 'viewed' | 'exported' | 'shared' | 'enhanced' | 'deleted';
  timestamp: Date;
  metadata: {
    format?: string;
    enhancementType?: string;
    shareMethod?: string;
    viewDuration?: number;
    userAgent?: string;
    ipAddress?: string;
  };
}

export interface InfographicUsageStats {
  totalInfographics: number;
  totalViews: number;
  totalExports: number;
  totalShares: number;
  averageViewsPerInfographic: number;
  mostPopularFormats: Array<{ format: string; count: number }>;
  mostUsedTemplates: Array<{ template: string; count: number }>;
  userEngagement: {
    averageViewDuration: number;
    bounceRate: number;
    returnRate: number;
  };
  timeBasedStats: {
    daily: Array<{ date: string; count: number }>;
    weekly: Array<{ week: string; count: number }>;
    monthly: Array<{ month: string; count: number }>;
  };
}

export interface UserInfographicStats {
  userId: string;
  totalCreated: number;
  totalViews: number;
  totalExports: number;
  totalShares: number;
  favoriteTemplates: string[];
  mostUsedFormats: string[];
  averageCreationTime: number;
  lastActivity: Date;
  engagementScore: number;
}

export class InfographicAnalyticsService {
  private analytics: InfographicAnalytics[] = [];
  private infographics: Map<string, InfographicData> = new Map();

  /**
   * Track an infographic event
   */
  async trackEvent(
    infographicId: string,
    userId: string,
    event: InfographicAnalytics['event'],
    metadata: Partial<InfographicAnalytics['metadata']> = {}
  ): Promise<void> {
    const analytics: InfographicAnalytics = {
      id: `analytics-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      infographicId,
      userId,
      event,
      timestamp: new Date(),
      metadata: {
        ...metadata,
        userAgent: metadata.userAgent || 'unknown',
        ipAddress: metadata.ipAddress || 'unknown'
      }
    };

    this.analytics.push(analytics);
    
    // Update infographic usage stats
    if (this.infographics.has(infographicId)) {
      const infographic = this.infographics.get(infographicId)!;
      infographic.metadata.usage[event === 'viewed' ? 'views' : 
                                 event === 'exported' ? 'exports' : 
                                 event === 'shared' ? 'shares' : 'views']++;
    }
  }

  /**
   * Register an infographic for tracking
   */
  async registerInfographic(infographic: InfographicData): Promise<void> {
    this.infographics.set(infographic.id, infographic);
    await this.trackEvent(infographic.id, infographic.metadata.userId, 'created');
  }

  /**
   * Get comprehensive usage statistics
   */
  async getUsageStats(timeRange?: { start: Date; end: Date }): Promise<InfographicUsageStats> {
    const filteredAnalytics = timeRange 
      ? this.analytics.filter(a => a.timestamp >= timeRange.start && a.timestamp <= timeRange.end)
      : this.analytics;

    const totalInfographics = this.infographics.size;
    const totalViews = filteredAnalytics.filter(a => a.event === 'viewed').length;
    const totalExports = filteredAnalytics.filter(a => a.event === 'exported').length;
    const totalShares = filteredAnalytics.filter(a => a.event === 'shared').length;

    // Calculate format popularity
    const formatCounts = new Map<string, number>();
    filteredAnalytics
      .filter(a => a.event === 'exported' && a.metadata.format)
      .forEach(a => {
        const format = a.metadata.format!;
        formatCounts.set(format, (formatCounts.get(format) || 0) + 1);
      });

    const mostPopularFormats = Array.from(formatCounts.entries())
      .map(([format, count]) => ({ format, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate template usage
    const templateCounts = new Map<string, number>();
    this.infographics.forEach(infographic => {
      const template = infographic.metadata.category;
      templateCounts.set(template, (templateCounts.get(template) || 0) + 1);
    });

    const mostUsedTemplates = Array.from(templateCounts.entries())
      .map(([template, count]) => ({ template, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate engagement metrics
    const viewEvents = filteredAnalytics.filter(a => a.event === 'viewed');
    const averageViewDuration = viewEvents.reduce((sum, event) => 
      sum + (event.metadata.viewDuration || 0), 0) / viewEvents.length || 0;

    // Calculate time-based stats
    const dailyStats = this.calculateTimeBasedStats(filteredAnalytics, 'daily');
    const weeklyStats = this.calculateTimeBasedStats(filteredAnalytics, 'weekly');
    const monthlyStats = this.calculateTimeBasedStats(filteredAnalytics, 'monthly');

    return {
      totalInfographics,
      totalViews,
      totalExports,
      totalShares,
      averageViewsPerInfographic: totalInfographics > 0 ? totalViews / totalInfographics : 0,
      mostPopularFormats,
      mostUsedTemplates,
      userEngagement: {
        averageViewDuration,
        bounceRate: 0.3, // Placeholder - would need more sophisticated tracking
        returnRate: 0.7   // Placeholder - would need more sophisticated tracking
      },
      timeBasedStats: {
        daily: dailyStats,
        weekly: weeklyStats,
        monthly: monthlyStats
      }
    };
  }

  /**
   * Get user-specific statistics
   */
  async getUserStats(userId: string): Promise<UserInfographicStats> {
    const userAnalytics = this.analytics.filter(a => a.userId === userId);
    const userInfographics = Array.from(this.infographics.values())
      .filter(i => i.metadata.userId === userId);

    const totalCreated = userInfographics.length;
    const totalViews = userAnalytics.filter(a => a.event === 'viewed').length;
    const totalExports = userAnalytics.filter(a => a.event === 'exported').length;
    const totalShares = userAnalytics.filter(a => a.event === 'shared').length;

    // Calculate favorite templates
    const templateCounts = new Map<string, number>();
    userInfographics.forEach(infographic => {
      const template = infographic.metadata.category;
      templateCounts.set(template, (templateCounts.get(template) || 0) + 1);
    });

    const favoriteTemplates = Array.from(templateCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([template]) => template);

    // Calculate most used formats
    const formatCounts = new Map<string, number>();
    userAnalytics
      .filter(a => a.event === 'exported' && a.metadata.format)
      .forEach(a => {
        const format = a.metadata.format!;
        formatCounts.set(format, (formatCounts.get(format) || 0) + 1);
      });

    const mostUsedFormats = Array.from(formatCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([format]) => format);

    // Calculate engagement score
    const engagementScore = this.calculateEngagementScore(userAnalytics, userInfographics);

    return {
      userId,
      totalCreated,
      totalViews,
      totalExports,
      totalShares,
      favoriteTemplates,
      mostUsedFormats,
      averageCreationTime: 0, // Placeholder - would need creation time tracking
      lastActivity: userAnalytics.length > 0 
        ? new Date(Math.max(...userAnalytics.map(a => a.timestamp.getTime())))
        : new Date(),
      engagementScore
    };
  }

  /**
   * Get trending infographics
   */
  async getTrendingInfographics(limit: number = 10): Promise<Array<{
    infographic: InfographicData;
    views: number;
    exports: number;
    shares: number;
    engagementScore: number;
  }>> {
    const infographicStats = new Map<string, {
      infographic: InfographicData;
      views: number;
      exports: number;
      shares: number;
    }>();

    // Aggregate stats for each infographic
    this.analytics.forEach(analytics => {
      if (!infographicStats.has(analytics.infographicId)) {
        const infographic = this.infographics.get(analytics.infographicId);
        if (infographic) {
          infographicStats.set(analytics.infographicId, {
            infographic,
            views: 0,
            exports: 0,
            shares: 0
          });
        }
      }

      const stats = infographicStats.get(analytics.infographicId);
      if (stats) {
        switch (analytics.event) {
          case 'viewed':
            stats.views++;
            break;
          case 'exported':
            stats.exports++;
            break;
          case 'shared':
            stats.shares++;
            break;
        }
      }
    });

    // Calculate engagement scores and sort
    return Array.from(infographicStats.values())
      .map(stats => ({
        ...stats,
        engagementScore: this.calculateInfographicEngagementScore(stats)
      }))
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, limit);
  }

  /**
   * Get performance insights
   */
  async getPerformanceInsights(): Promise<{
    topPerformingTemplates: Array<{ template: string; performance: number }>;
    optimalExportFormats: Array<{ format: string; usage: number }>;
    userBehaviorPatterns: Array<{ pattern: string; frequency: number }>;
    recommendations: string[];
  }> {
    const stats = await this.getUsageStats();
    
    // Analyze template performance
    const templatePerformance = stats.mostUsedTemplates.map(template => ({
      template: template.template,
      performance: template.count / stats.totalInfographics
    }));

    // Analyze export format usage
    const formatUsage = stats.mostPopularFormats.map(format => ({
      format: format.format,
      usage: format.count / stats.totalExports
    }));

    // Identify user behavior patterns
    const behaviorPatterns = this.analyzeUserBehaviorPatterns();

    // Generate recommendations
    const recommendations = this.generateRecommendations(stats);

    return {
      topPerformingTemplates: templatePerformance,
      optimalExportFormats: formatUsage,
      userBehaviorPatterns: behaviorPatterns,
      recommendations
    };
  }

  private calculateTimeBasedStats(
    analytics: InfographicAnalytics[], 
    granularity: 'daily' | 'weekly' | 'monthly'
  ): Array<{ date: string; count: number }> {
    const stats = new Map<string, number>();

    analytics.forEach(analytics => {
      let key: string;
      const date = new Date(analytics.timestamp);

      switch (granularity) {
        case 'daily':
          key = date.toISOString().split('T')[0];
          break;
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }

      stats.set(key, (stats.get(key) || 0) + 1);
    });

    return Array.from(stats.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private calculateEngagementScore(
    userAnalytics: InfographicAnalytics[],
    userInfographics: InfographicData[]
  ): number {
    const views = userAnalytics.filter(a => a.event === 'viewed').length;
    const exports = userAnalytics.filter(a => a.event === 'exported').length;
    const shares = userAnalytics.filter(a => a.event === 'shared').length;
    const enhancements = userAnalytics.filter(a => a.event === 'enhanced').length;

    // Weighted scoring
    const score = (views * 1) + (exports * 3) + (shares * 5) + (enhancements * 2);
    const maxPossibleScore = userInfographics.length * 10; // Assuming max 10 actions per infographic

    return maxPossibleScore > 0 ? Math.min(score / maxPossibleScore, 1) : 0;
  }

  private calculateInfographicEngagementScore(stats: {
    views: number;
    exports: number;
    shares: number;
  }): number {
    return (stats.views * 1) + (stats.exports * 3) + (stats.shares * 5);
  }

  private analyzeUserBehaviorPatterns(): Array<{ pattern: string; frequency: number }> {
    // This would analyze user behavior patterns
    // For now, return placeholder data
    return [
      { pattern: 'Users prefer PNG exports', frequency: 0.65 },
      { pattern: 'Revenue charts are most popular', frequency: 0.45 },
      { pattern: 'Users enhance infographics 2-3 times', frequency: 0.32 },
      { pattern: 'Corporate theme is preferred', frequency: 0.58 }
    ];
  }

  private generateRecommendations(stats: InfographicUsageStats): string[] {
    const recommendations: string[] = [];

    if (stats.averageViewsPerInfographic < 2) {
      recommendations.push('Consider adding more interactive features to increase engagement');
    }

    if (stats.mostPopularFormats[0]?.format === 'png') {
      recommendations.push('PNG is the most popular format - ensure high-quality rendering');
    }

    if (stats.userEngagement.averageViewDuration < 30) {
      recommendations.push('Infographics may need more compelling visual design');
    }

    return recommendations;
  }
}
