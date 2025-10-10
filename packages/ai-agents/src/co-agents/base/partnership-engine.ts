import { UserType, RelationshipMetrics, InteractionSummary } from '../../types';

/**
 * Partnership Engine - Manages the deep relationship aspect of Co-Agents
 * 
 * This is the core system that builds and maintains the partnership relationship
 * between the AI agent and the user. It tracks relationship health, adapts to
 * user preferences, and ensures consistent partnership experience.
 */
export class PartnershipEngine {
  private userType: UserType;
  private relationshipStore: Map<string, RelationshipMetrics> = new Map();

  constructor(userType: UserType) {
    this.userType = userType;
  }

  /**
   * Get current relationship score for a user
   */
  async getRelationshipScore(userId: string): Promise<RelationshipMetrics> {
    const existing = this.relationshipStore.get(userId);
    
    if (existing) {
      return existing;
    }

    // Initialize new relationship
    const initialMetrics: RelationshipMetrics = {
      trustLevel: 50, // Start neutral
      engagementScore: 60,
      satisfactionRating: 70,
      communicationEffectiveness: 65,
      conflictResolution: 50,
      overallScore: 59,
      interactionHistory: []
    };

    this.relationshipStore.set(userId, initialMetrics);
    return initialMetrics;
  }

  /**
   * Update relationship metrics based on interaction
   */
  async updateRelationshipMetrics(
    userId: string,
    interactionType: string,
    outcome: 'positive' | 'neutral' | 'negative',
    feedback?: any
  ): Promise<void> {
    
    const metrics = await this.getRelationshipScore(userId);
    
    // Create interaction summary
    const interaction: InteractionSummary = {
      date: new Date(),
      type: interactionType,
      outcome,
      topics: feedback?.topics || [],
      duration: feedback?.duration || 0
    };

    // Update metrics based on outcome
    const adjustment = this.calculateMetricAdjustment(outcome, interactionType);
    
    metrics.trustLevel = this.adjustMetric(metrics.trustLevel, adjustment.trust);
    metrics.engagementScore = this.adjustMetric(metrics.engagementScore, adjustment.engagement);
    metrics.satisfactionRating = this.adjustMetric(metrics.satisfactionRating, adjustment.satisfaction);
    metrics.communicationEffectiveness = this.adjustMetric(metrics.communicationEffectiveness, adjustment.communication);
    
    if (outcome === 'negative') {
      metrics.conflictResolution = this.adjustMetric(metrics.conflictResolution, -5);
    } else if (feedback?.conflictResolved) {
      metrics.conflictResolution = this.adjustMetric(metrics.conflictResolution, 10);
    }

    // Recalculate overall score
    metrics.overallScore = this.calculateOverallScore(metrics);
    
    // Add to interaction history
    metrics.interactionHistory.push(interaction);
    
    // Keep only last 50 interactions
    if (metrics.interactionHistory.length > 50) {
      metrics.interactionHistory = metrics.interactionHistory.slice(-50);
    }

    this.relationshipStore.set(userId, metrics);
  }

  /**
   * Analyze relationship patterns and provide insights
   */
  async analyzeRelationshipPatterns(userId: string): Promise<any> {
    const metrics = await this.getRelationshipScore(userId);
    const history = metrics.interactionHistory;
    
    return {
      trends: this.analyzeTrends(history),
      strengths: this.identifyStrengths(metrics),
      improvementAreas: this.identifyImprovementAreas(metrics),
      recommendedActions: this.recommendActions(metrics),
      relationshipStage: this.determineRelationshipStage(metrics)
    };
  }

  /**
   * Get personalized communication recommendations
   */
  async getCommunicationRecommendations(userId: string): Promise<any> {
    const metrics = await this.getRelationshipScore(userId);
    const patterns = await this.analyzeRelationshipPatterns(userId);
    
    return {
      preferredStyle: this.determinePreferredStyle(metrics, patterns),
      topicRecommendations: this.getTopicRecommendations(patterns),
      timingRecommendations: this.getTimingRecommendations(patterns),
      approachModifications: this.getApproachModifications(metrics)
    };
  }

  /**
   * Handle relationship challenges and conflicts
   */
  async handleRelationshipChallenge(
    userId: string,
    challengeType: string,
    context: any
  ): Promise<any> {
    
    const metrics = await this.getRelationshipScore(userId);
    
    const strategy = {
      'communication_style_mismatch': this.handleStyleMismatch(metrics, context),
      'expectation_misalignment': this.handleExpectationMismatch(metrics, context),
      'trust_issues': this.handleTrustIssues(metrics, context),
      'engagement_decline': this.handleEngagementDecline(metrics, context),
      'feedback_concerns': this.handleFeedbackConcerns(metrics, context)
    };

    return strategy[challengeType] || this.handleGenericChallenge(metrics, context);
  }

  /**
   * Proactively identify relationship risks
   */
  async identifyRelationshipRisks(userId: string): Promise<any[]> {
    const metrics = await this.getRelationshipScore(userId);
    const risks = [];

    // Low trust risk
    if (metrics.trustLevel < 40) {
      risks.push({
        type: 'trust_decline',
        severity: 'high',
        description: 'Trust levels are below healthy threshold',
        recommendedAction: 'Focus on reliability and transparency'
      });
    }

    // Engagement decline risk
    if (metrics.engagementScore < 30) {
      risks.push({
        type: 'disengagement',
        severity: 'high',
        description: 'User engagement is significantly declining',
        recommendedAction: 'Reassess value proposition and approach'
      });
    }

    // Communication effectiveness risk
    if (metrics.communicationEffectiveness < 50) {
      risks.push({
        type: 'communication_breakdown',
        severity: 'medium',
        description: 'Communication style may not be resonating',
        recommendedAction: 'Adapt communication approach'
      });
    }

    // Satisfaction risk
    if (metrics.satisfactionRating < 40) {
      risks.push({
        type: 'satisfaction_decline',
        severity: 'high',
        description: 'User satisfaction is below acceptable levels',
        recommendedAction: 'Conduct satisfaction review and course correction'
      });
    }

    return risks;
  }

  // Private helper methods

  private calculateMetricAdjustment(
    outcome: 'positive' | 'neutral' | 'negative',
    interactionType: string
  ): any {
    
    const baseAdjustments = {
      positive: { trust: 3, engagement: 5, satisfaction: 4, communication: 3 },
      neutral: { trust: 0, engagement: 1, satisfaction: 1, communication: 0 },
      negative: { trust: -5, engagement: -3, satisfaction: -6, communication: -2 }
    };

    // Adjust based on interaction type
    const typeMultipliers = {
      'strategic_session': 1.5,
      'deal_evaluation': 1.3,
      'portfolio_review': 1.2,
      'general_conversation': 1.0,
      'crisis_support': 2.0
    };

    const multiplier = typeMultipliers[interactionType] || 1.0;
    const baseAdj = baseAdjustments[outcome];

    return {
      trust: Math.round(baseAdj.trust * multiplier),
      engagement: Math.round(baseAdj.engagement * multiplier),
      satisfaction: Math.round(baseAdj.satisfaction * multiplier),
      communication: Math.round(baseAdj.communication * multiplier)
    };
  }

  private adjustMetric(currentValue: number, adjustment: number): number {
    return Math.max(0, Math.min(100, currentValue + adjustment));
  }

  private calculateOverallScore(metrics: RelationshipMetrics): number {
    const weights = {
      trust: 0.25,
      engagement: 0.20,
      satisfaction: 0.25,
      communication: 0.20,
      conflictResolution: 0.10
    };

    return Math.round(
      metrics.trustLevel * weights.trust +
      metrics.engagementScore * weights.engagement +
      metrics.satisfactionRating * weights.satisfaction +
      metrics.communicationEffectiveness * weights.communication +
      metrics.conflictResolution * weights.conflictResolution
    );
  }

  private analyzeTrends(history: InteractionSummary[]): any {
    if (history.length < 5) return { insufficient_data: true };

    const recentHistory = history.slice(-10);
    const positiveRatio = recentHistory.filter(h => h.outcome === 'positive').length / recentHistory.length;
    const negativeRatio = recentHistory.filter(h => h.outcome === 'negative').length / recentHistory.length;

    return {
      trend: positiveRatio > 0.6 ? 'improving' : 
             negativeRatio > 0.4 ? 'declining' : 'stable',
      positiveRatio,
      negativeRatio,
      mostCommonTopics: this.getMostCommonTopics(recentHistory),
      averageDuration: this.getAverageDuration(recentHistory)
    };
  }

  private identifyStrengths(metrics: RelationshipMetrics): string[] {
    const strengths = [];

    if (metrics.trustLevel > 75) strengths.push('High trust relationship');
    if (metrics.engagementScore > 80) strengths.push('Strong user engagement');
    if (metrics.satisfactionRating > 75) strengths.push('High satisfaction levels');
    if (metrics.communicationEffectiveness > 80) strengths.push('Effective communication style');
    if (metrics.conflictResolution > 70) strengths.push('Good conflict resolution');

    return strengths;
  }

  private identifyImprovementAreas(metrics: RelationshipMetrics): string[] {
    const areas = [];

    if (metrics.trustLevel < 60) areas.push('Trust building');
    if (metrics.engagementScore < 50) areas.push('User engagement');
    if (metrics.satisfactionRating < 60) areas.push('Overall satisfaction');
    if (metrics.communicationEffectiveness < 60) areas.push('Communication approach');
    if (metrics.conflictResolution < 50) areas.push('Conflict resolution skills');

    return areas;
  }

  private recommendActions(metrics: RelationshipMetrics): string[] {
    const actions = [];

    if (metrics.trustLevel < 60) {
      actions.push('Focus on consistency and reliability in responses');
    }
    if (metrics.engagementScore < 50) {
      actions.push('Increase proactive insights and value-added suggestions');
    }
    if (metrics.communicationEffectiveness < 60) {
      actions.push('Adapt communication style to user preferences');
    }

    return actions;
  }

  private determineRelationshipStage(metrics: RelationshipMetrics): string {
    if (metrics.overallScore > 80) return 'trusted_partner';
    if (metrics.overallScore > 60) return 'developing_trust';
    if (metrics.overallScore > 40) return 'building_rapport';
    return 'establishing_relationship';
  }

  // Additional helper methods (simplified implementations)
  private determinePreferredStyle(metrics: RelationshipMetrics, patterns: any): any {
    return {
      directness: metrics.communicationEffectiveness > 70 ? 'direct' : 'gentle',
      analyticalDepth: this.userType === UserType.INVESTOR ? 'high' : 'medium',
      personalTouch: metrics.trustLevel > 70 ? 'high' : 'medium'
    };
  }

  private getTopicRecommendations(patterns: any): string[] {
    return patterns.mostCommonTopics || ['strategy', 'market_insights', 'portfolio_optimization'];
  }

  private getTimingRecommendations(patterns: any): any {
    return {
      preferredFrequency: 'weekly',
      bestTimes: ['morning', 'early_evening'],
      avoidTimes: ['late_night']
    };
  }

  private getApproachModifications(metrics: RelationshipMetrics): any {
    return {
      increaseSupport: metrics.trustLevel < 50,
      increaseChallenging: metrics.trustLevel > 80,
      focusOnValue: metrics.satisfactionRating < 60
    };
  }

  private handleStyleMismatch(metrics: RelationshipMetrics, context: any): any {
    return {
      strategy: 'adapt_communication_style',
      actions: ['Adjust directness level', 'Modify analytical depth', 'Change pace']
    };
  }

  private handleExpectationMismatch(metrics: RelationshipMetrics, context: any): any {
    return {
      strategy: 'realign_expectations',
      actions: ['Clarify capabilities', 'Set realistic outcomes', 'Define success metrics']
    };
  }

  private handleTrustIssues(metrics: RelationshipMetrics, context: any): any {
    return {
      strategy: 'rebuild_trust',
      actions: ['Increase transparency', 'Demonstrate reliability', 'Acknowledge limitations']
    };
  }

  private handleEngagementDecline(metrics: RelationshipMetrics, context: any): any {
    return {
      strategy: 'reinvigorate_engagement',
      actions: ['Provide more value', 'Increase personalization', 'Introduce new perspectives']
    };
  }

  private handleFeedbackConcerns(metrics: RelationshipMetrics, context: any): any {
    return {
      strategy: 'address_feedback',
      actions: ['Acknowledge concerns', 'Implement changes', 'Follow up on improvements']
    };
  }

  private handleGenericChallenge(metrics: RelationshipMetrics, context: any): any {
    return {
      strategy: 'assess_and_adapt',
      actions: ['Gather more information', 'Adjust approach', 'Monitor outcomes']
    };
  }

  private getMostCommonTopics(history: InteractionSummary[]): string[] {
    const topicCounts = {};
    
    history.forEach(interaction => {
      interaction.topics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });

    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([topic]) => topic);
  }

  private getAverageDuration(history: InteractionSummary[]): number {
    if (history.length === 0) return 0;
    
    const totalDuration = history.reduce((sum, h) => sum + h.duration, 0);
    return totalDuration / history.length;
  }
}
