import { DatabaseService } from './database-service';

/**
 * Insight Tracker for Lean Design Thinking™ System
 * 
 * Tracks insight evolution across LDT phases:
 * - Evolution tracking
 * - Impact measurement
 * - Business value calculation
 * - Cross-phase connections
 */
export class InsightTracker {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * Track insight evolution
   */
  async trackEvolution(insightId: string): Promise<InsightEvolution> {
    try {
      const evolution = await this.getInsightHistory(insightId);
      const impact = await this.measureInsightImpact(insightId);
      const businessValue = await this.calculateBusinessValue(insightId);

      return {
        originalInsight: evolution[0],
        transformations: evolution.map((e, i) => ({
          phase: e.phase,
          transformation: this.compareInsights(evolution[i], evolution[i + 1]),
          contributingFactors: e.factors,
          refinements: e.refinements
        })),
        finalOutcome: evolution[evolution.length - 1],
        impact,
        businessValue,
        trackedAt: new Date()
      };
    } catch (error) {
      console.error('Error tracking insight evolution:', error);
      throw new Error('Failed to track insight evolution');
    }
  }

  /**
   * Get insight history
   */
  private async getInsightHistory(insightId: string): Promise<InsightHistoryEntry[]> {
    return await this.db.getInsightHistory(insightId);
  }

  /**
   * Measure insight impact
   */
  private async measureInsightImpact(insightId: string): Promise<InsightImpact> {
    try {
      const usage = await this.db.getInsightUsage(insightId);
      const influence = await this.calculateInfluenceScore(insightId);
      const businessValue = await this.calculateBusinessValue(insightId);
      const timeToImpact = await this.calculateTimeToImpact(insightId);

      return {
        usageCount: usage.length,
        influenceScore: influence,
        businessValue,
        timeToImpact,
        measuredAt: new Date()
      };
    } catch (error) {
      console.error('Error measuring insight impact:', error);
      return {
        usageCount: 0,
        influenceScore: 0,
        businessValue: 0,
        timeToImpact: 0,
        measuredAt: new Date()
      };
    }
  }

  /**
   * Calculate business value
   */
  private async calculateBusinessValue(insightId: string): Promise<number> {
    try {
      const insight = await this.db.getInsight(insightId);
      const relatedIdeas = await this.db.getRelatedIdeas(insightId);
      const prototypes = await this.db.getRelatedPrototypes(insightId);
      const tests = await this.db.getRelatedTests(insightId);

      const ideaValue = relatedIdeas.length * 0.1;
      const prototypeValue = prototypes.length * 0.3;
      const testValue = tests.length * 0.2;
      const insightQuality = insight?.importance || 0;

      return (ideaValue + prototypeValue + testValue + insightQuality) / 4;
    } catch (error) {
      console.error('Error calculating business value:', error);
      return 0;
    }
  }

  /**
   * Calculate influence score
   */
  private async calculateInfluenceScore(insightId: string): Promise<number> {
    try {
      const connections = await this.db.getInsightConnections(insightId);
      const usage = await this.db.getInsightUsage(insightId);
      const references = await this.db.getInsightReferences(insightId);

      const connectionScore = Math.min(connections.length / 10, 1);
      const usageScore = Math.min(usage.length / 5, 1);
      const referenceScore = Math.min(references.length / 3, 1);

      return (connectionScore + usageScore + referenceScore) / 3;
    } catch (error) {
      console.error('Error calculating influence score:', error);
      return 0;
    }
  }

  /**
   * Calculate time to impact
   */
  private async calculateTimeToImpact(insightId: string): Promise<number> {
    try {
      const insight = await this.db.getInsight(insightId);
      const firstUsage = await this.db.getFirstInsightUsage(insightId);
      
      if (!insight || !firstUsage) return 0;
      
      const timeDiff = firstUsage.timestamp.getTime() - insight.createdAt.getTime();
      return timeDiff / (1000 * 60 * 60 * 24); // Days
    } catch (error) {
      console.error('Error calculating time to impact:', error);
      return 0;
    }
  }

  /**
   * Compare insights
   */
  private compareInsights(insight1: InsightHistoryEntry, insight2: InsightHistoryEntry): InsightTransformation {
    if (!insight2) {
      return {
        type: 'final',
        changes: [],
        improvements: [],
        newElements: []
      };
    }

    const changes = this.identifyChanges(insight1, insight2);
    const improvements = this.identifyImprovements(insight1, insight2);
    const newElements = this.identifyNewElements(insight1, insight2);

    return {
      type: this.determineTransformationType(changes, improvements, newElements),
      changes,
      improvements,
      newElements
    };
  }

  /**
   * Identify changes between insights
   */
  private identifyChanges(insight1: InsightHistoryEntry, insight2: InsightHistoryEntry): string[] {
    const changes: string[] = [];
    
    if (insight1.content !== insight2.content) {
      changes.push('Content updated');
    }
    
    if (insight1.importance !== insight2.importance) {
      changes.push('Importance changed');
    }
    
    if (insight1.confidence !== insight2.confidence) {
      changes.push('Confidence updated');
    }

    return changes;
  }

  /**
   * Identify improvements
   */
  private identifyImprovements(insight1: InsightHistoryEntry, insight2: InsightHistoryEntry): string[] {
    const improvements: string[] = [];
    
    if (insight2.importance > insight1.importance) {
      improvements.push('Importance increased');
    }
    
    if (insight2.confidence > insight1.confidence) {
      improvements.push('Confidence improved');
    }
    
    if (insight2.content.length > insight1.content.length) {
      improvements.push('Content expanded');
    }

    return improvements;
  }

  /**
   * Identify new elements
   */
  private identifyNewElements(insight1: InsightHistoryEntry, insight2: InsightHistoryEntry): string[] {
    const newElements: string[] = [];
    
    if (insight2.connections && insight2.connections.length > (insight1.connections?.length || 0)) {
      newElements.push('New connections added');
    }
    
    if (insight2.tags && insight2.tags.length > (insight1.tags?.length || 0)) {
      newElements.push('New tags added');
    }

    return newElements;
  }

  /**
   * Determine transformation type
   */
  private determineTransformationType(changes: string[], improvements: string[], newElements: string[]): string {
    if (improvements.length > 0 && newElements.length > 0) {
      return 'enhanced';
    } else if (improvements.length > 0) {
      return 'improved';
    } else if (newElements.length > 0) {
      return 'expanded';
    } else if (changes.length > 0) {
      return 'modified';
    } else {
      return 'unchanged';
    }
  }

  /**
   * Track insight usage
   */
  async trackInsightUsage(insightId: string, context: InsightUsageContext): Promise<void> {
    try {
      await this.db.logInsightUsage(insightId, context);
    } catch (error) {
      console.error('Error tracking insight usage:', error);
    }
  }

  /**
   * Get insight relationships
   */
  async getInsightRelationships(insightId: string): Promise<InsightRelationship[]> {
    try {
      return await this.db.getInsightRelationships(insightId);
    } catch (error) {
      console.error('Error getting insight relationships:', error);
      return [];
    }
  }

  /**
   * Generate insight report
   */
  async generateInsightReport(insightId: string): Promise<InsightReport> {
    try {
      const evolution = await this.trackEvolution(insightId);
      const relationships = await this.getInsightRelationships(insightId);
      const usage = await this.db.getInsightUsage(insightId);

      return {
        insightId,
        evolution,
        relationships,
        usage: usage.length,
        recommendations: await this.generateInsightRecommendations(insightId),
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating insight report:', error);
      throw new Error('Failed to generate insight report');
    }
  }

  /**
   * Generate insight recommendations
   */
  private async generateInsightRecommendations(insightId: string): Promise<string[]> {
    const recommendations: string[] = [];
    
    const insight = await this.db.getInsight(insightId);
    if (!insight) return recommendations;

    if (insight.importance < 0.7) {
      recommendations.push('Consider increasing insight importance through validation');
    }

    if (insight.confidence < 0.6) {
      recommendations.push('Gather more evidence to increase confidence');
    }

    const connections = await this.db.getInsightConnections(insightId);
    if (connections.length < 3) {
      recommendations.push('Explore connections to other insights');
    }

    return recommendations;
  }
}

// Type definitions
interface InsightEvolution {
  originalInsight: InsightHistoryEntry;
  transformations: InsightTransformation[];
  finalOutcome: InsightHistoryEntry;
  impact: InsightImpact;
  businessValue: number;
  trackedAt: Date;
}

interface InsightTransformation {
  type: string;
  changes: string[];
  improvements: string[];
  newElements: string[];
}

interface InsightImpact {
  usageCount: number;
  influenceScore: number;
  businessValue: number;
  timeToImpact: number;
  measuredAt: Date;
}

interface InsightHistoryEntry {
  id: string;
  content: string;
  phase: string;
  importance: number;
  confidence: number;
  connections?: string[];
  tags?: string[];
  createdAt: Date;
}

interface InsightUsageContext {
  userId: string;
  action: string;
  context: any;
  timestamp: Date;
}

interface InsightRelationship {
  id: string;
  relatedInsightId: string;
  relationshipType: string;
  strength: number;
  createdAt: Date;
}

interface InsightReport {
  insightId: string;
  evolution: InsightEvolution;
  relationships: InsightRelationship[];
  usage: number;
  recommendations: string[];
  generatedAt: Date;
}
