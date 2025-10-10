
export interface RelationshipMetrics {
  engagement: {
    conversationFrequency: number;
    responseTime: number;
    conversationDepth: number;
    modeVariety: number;
  };
  
  trust: {
    vulnerabilityScore: number;
    actionOnAdvice: number;
    disagreementRate: number;
    feedbackProvided: number;
  };
  
  impact: {
    decisionsInfluenced: number;
    goalsAchieved: number;
    problemsSolved: number;
    insightsValued: number;
  };
  
  overallScore: number;
  healthTrend: 'improving' | 'stable' | 'declining';
  recommendations: string[];
}

export class RelationshipManager {
  private relationships: Map<string, RelationshipMetrics> = new Map();
  private interactionHistory: Map<string, any[]> = new Map();
  
  async getRelationshipScore(userId: string): Promise<RelationshipMetrics> {
    const existing = this.relationships.get(userId);
    if (existing) {
      return existing;
    }
    
    // Initialize new relationship
    const newRelationship: RelationshipMetrics = {
      engagement: {
        conversationFrequency: 1,
        responseTime: 60, // seconds
        conversationDepth: 50,
        modeVariety: 1
      },
      trust: {
        vulnerabilityScore: 30,
        actionOnAdvice: 0,
        disagreementRate: 0,
        feedbackProvided: 0
      },
      impact: {
        decisionsInfluenced: 0,
        goalsAchieved: 0,
        problemsSolved: 0,
        insightsValued: 0
      },
      overallScore: 40, // Starting score
      healthTrend: 'stable',
      recommendations: [
        'Continue daily check-ins to build rapport',
        'Share more context about challenges to build trust',
        'Try different conversation modes to find your preference'
      ]
    };
    
    this.relationships.set(userId, newRelationship);
    return newRelationship;
  }
  
  async recordInteraction(userId: string, interaction: {
    type: string;
    duration: number;
    depth: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    mode: string;
    actionTaken?: boolean;
    feedbackGiven?: boolean;
  }): Promise<void> {
    const history = this.interactionHistory.get(userId) || [];
    history.push({
      ...interaction,
      timestamp: new Date()
    });
    
    // Keep last 100 interactions
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    this.interactionHistory.set(userId, history);
    
    // Update relationship metrics
    await this.updateRelationshipMetrics(userId, interaction, history);
  }
  
  async updateGoalAchievement(userId: string, goalAchieved: boolean): Promise<void> {
    const relationship = await this.getRelationshipScore(userId);
    if (goalAchieved) {
      relationship.impact.goalsAchieved++;
    }
    
    await this.recalculateOverallScore(userId, relationship);
  }
  
  async recordDecisionInfluence(userId: string, influenced: boolean): Promise<void> {
    const relationship = await this.getRelationshipScore(userId);
    if (influenced) {
      relationship.impact.decisionsInfluenced++;
    }
    
    await this.recalculateOverallScore(userId, relationship);
  }
  
  async recordProblemSolved(userId: string): Promise<void> {
    const relationship = await this.getRelationshipScore(userId);
    relationship.impact.problemsSolved++;
    
    await this.recalculateOverallScore(userId, relationship);
  }
  
  private async updateRelationshipMetrics(userId: string, interaction: any, history: any[]): Promise<void> {
    const relationship = await this.getRelationshipScore(userId);
    
    // Update engagement metrics
    const recentInteractions = history.slice(-7); // Last 7 interactions
    relationship.engagement.conversationFrequency = recentInteractions.length;
    relationship.engagement.conversationDepth = recentInteractions.reduce((sum, i) => sum + i.depth, 0) / recentInteractions.length;
    
    // Track mode variety
    const uniqueModes = new Set(recentInteractions.map(i => i.mode));
    relationship.engagement.modeVariety = uniqueModes.size;
    
    // Update trust metrics
    if (interaction.depth > 70) {
      relationship.trust.vulnerabilityScore = Math.min(100, relationship.trust.vulnerabilityScore + 2);
    }
    
    if (interaction.actionTaken) {
      relationship.trust.actionOnAdvice++;
    }
    
    if (interaction.feedbackGiven) {
      relationship.trust.feedbackProvided++;
    }
    
    // Detect disagreement (healthy for relationship)
    if (interaction.sentiment === 'negative' && interaction.type === 'challenge') {
      relationship.trust.disagreementRate = Math.min(30, relationship.trust.disagreementRate + 1); // Cap at healthy level
    }
    
    await this.recalculateOverallScore(userId, relationship);
  }
  
  private async recalculateOverallScore(userId: string, relationship: RelationshipMetrics): Promise<void> {
    // Weighted scoring system
    const engagementScore = (
      relationship.engagement.conversationFrequency * 5 +
      Math.min(relationship.engagement.conversationDepth, 100) * 0.3 +
      relationship.engagement.modeVariety * 10
    ) / 3;
    
    const trustScore = (
      relationship.trust.vulnerabilityScore * 0.4 +
      Math.min(relationship.trust.actionOnAdvice * 10, 40) +
      Math.min(relationship.trust.disagreementRate * 2, 30) + // Healthy disagreement is good
      Math.min(relationship.trust.feedbackProvided * 5, 30)
    );
    
    const impactScore = (
      Math.min(relationship.impact.decisionsInfluenced * 5, 30) +
      Math.min(relationship.impact.goalsAchieved * 8, 40) +
      Math.min(relationship.impact.problemsSolved * 3, 20) +
      Math.min(relationship.impact.insightsValued * 2, 10)
    );
    
    const previousScore = relationship.overallScore;
    relationship.overallScore = Math.round((engagementScore + trustScore + impactScore) / 3);
    
    // Determine trend
    if (relationship.overallScore > previousScore + 5) {
      relationship.healthTrend = 'improving';
    } else if (relationship.overallScore < previousScore - 5) {
      relationship.healthTrend = 'declining';
    } else {
      relationship.healthTrend = 'stable';
    }
    
    // Generate recommendations
    relationship.recommendations = this.generateRecommendations(relationship);
    
    this.relationships.set(userId, relationship);
  }
  
  private generateRecommendations(relationship: RelationshipMetrics): string[] {
    const recommendations: string[] = [];
    
    if (relationship.engagement.conversationFrequency < 3) {
      recommendations.push('Try having more frequent check-ins to build momentum');
    }
    
    if (relationship.engagement.modeVariety < 3) {
      recommendations.push('Explore different conversation modes like strategic sessions or brainstorming');
    }
    
    if (relationship.trust.vulnerabilityScore < 50) {
      recommendations.push('Share more about your challenges and uncertainties to deepen trust');
    }
    
    if (relationship.trust.actionOnAdvice < 2) {
      recommendations.push('Try implementing some suggestions to see what works for your situation');
    }
    
    if (relationship.trust.disagreementRate < 10) {
      recommendations.push('Feel free to push back on ideas - healthy disagreement strengthens partnerships');
    }
    
    if (relationship.impact.decisionsInfluenced < 3) {
      recommendations.push('Involve your co-founder in more decision-making processes');
    }
    
    if (relationship.overallScore > 80) {
      recommendations.push('Great partnership! Consider tackling bigger strategic challenges together');
    }
    
    return recommendations.slice(0, 3); // Max 3 recommendations
  }
  
  async getPartnershipInsights(userId: string): Promise<{
    strengthAreas: string[];
    improvementAreas: string[];
    milestones: string[];
    nextSteps: string[];
  }> {
    const relationship = await this.getRelationshipScore(userId);
    
    const strengthAreas: string[] = [];
    const improvementAreas: string[] = [];
    
    // Identify strengths
    if (relationship.engagement.conversationFrequency > 5) {
      strengthAreas.push('High engagement - you consistently interact');
    }
    if (relationship.trust.vulnerabilityScore > 70) {
      strengthAreas.push('Strong trust - you share challenges openly');
    }
    if (relationship.impact.goalsAchieved > 3) {
      strengthAreas.push('Effective collaboration - goals are being achieved');
    }
    
    // Identify improvement areas
    if (relationship.engagement.modeVariety < 2) {
      improvementAreas.push('Try different conversation modes for varied perspectives');
    }
    if (relationship.trust.actionOnAdvice < 1) {
      improvementAreas.push('Experiment with implementing more suggestions');
    }
    if (relationship.impact.decisionsInfluenced < 2) {
      improvementAreas.push('Involve co-founder in more strategic decisions');
    }
    
    return {
      strengthAreas,
      improvementAreas,
      milestones: [
        relationship.overallScore > 25 ? '✅ Basic rapport established' : '⏳ Building basic rapport',
        relationship.overallScore > 50 ? '✅ Trust foundation built' : '⏳ Building trust foundation',
        relationship.overallScore > 75 ? '✅ Strong partnership formed' : '⏳ Forming strong partnership',
        relationship.overallScore > 90 ? '✅ Exceptional co-founder relationship' : '⏳ Working toward exceptional partnership'
      ],
      nextSteps: relationship.recommendations
    };
  }
}
