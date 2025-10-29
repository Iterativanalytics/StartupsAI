import { DatabaseService } from './database-service';

/**
 * Lean Design Thinking™ Analytics Engine
 * 
 * Provides comprehensive analytics for LLDT workflows:
 * - Effectiveness measurement
 * - Insight mapping
 * - Benchmark comparison
 * - Predictive analytics
 */
export class LDTAnalyticsEngine {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * Calculate comprehensive effectiveness score
   */
  async calculateEffectivenessScore(workflowId: string): Promise<EffectivenessScore> {
    try {
      const workflow = await this.db.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      // Get all analytics data
      const [
        userCentricity,
        ideaDiversity,
        iterationSpeed,
        teamCollaboration,
        outcomeQuality,
        processAdherence
      ] = await Promise.all([
        this.measureUserCentricity(workflowId),
        this.measureIdeaDiversity(workflowId),
        this.measureIterationSpeed(workflowId),
        this.measureTeamCollaboration(workflowId),
        this.measureOutcomeQuality(workflowId),
        this.measureProcessAdherence(workflowId)
      ]);

      // Calculate overall score
      const overall = this.calculateOverallScore({
        userCentricity,
        ideaDiversity,
        iterationSpeed,
        teamCollaboration,
        outcomeQuality,
        processAdherence
      });

      // Generate recommendations
      const recommendations = await this.generateRecommendations(workflowId, {
        userCentricity,
        ideaDiversity,
        iterationSpeed,
        teamCollaboration,
        outcomeQuality,
        processAdherence
      });

      return {
        overall,
        dimensions: {
          userCentricity,
          ideaDiversity,
          iterationSpeed,
          teamCollaboration,
          outcomeQuality,
          processAdherence
        },
        recommendations,
        benchmarks: await this.compareToBenchmarks(workflowId),
        calculatedAt: new Date()
      };
    } catch (error) {
      console.error('Error calculating effectiveness score:', error);
      throw new Error('Failed to calculate effectiveness score');
    }
  }

  /**
   * Generate insight map for workflow
   */
  async generateInsightMap(workflowId: string): Promise<InsightMap> {
    try {
      const insights = await this.getWorkflowInsights(workflowId);
      const relationships = await this.identifyRelationships(insights);
      const clusters = await this.clusterInsights(insights);
      const criticalPath = await this.identifyCriticalPath(insights);

      return {
        nodes: insights.map(insight => ({
          id: insight.id,
          label: insight.content,
          phase: insight.phase,
          importance: insight.importance,
          connections: insight.connections || []
        })),
        edges: relationships,
        clusters,
        criticalPath,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating insight map:', error);
      throw new Error('Failed to generate insight map');
    }
  }

  /**
   * Compare workflow to benchmarks
   */
  async compareToBenchmarks(workflowId: string): Promise<BenchmarkComparison> {
    try {
      const workflow = await this.db.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const benchmarks = await this.findBenchmarks(workflow);
      const comparison = await this.performComparison(workflow, benchmarks);

      return {
        industry: workflow.industry || 'general',
        similarProjects: benchmarks.length,
        performanceRanking: comparison.ranking,
        keyDifferences: comparison.differences,
        improvementOpportunities: comparison.opportunities,
        comparedAt: new Date()
      };
    } catch (error) {
      console.error('Error comparing to benchmarks:', error);
      throw new Error('Failed to compare to benchmarks');
    }
  }

  /**
   * Measure user centricity
   */
  private async measureUserCentricity(workflowId: string): Promise<number> {
    try {
      const empathyData = await this.db.getEmpathyData(workflowId);
      const userInterviews = await this.db.getUserInterviews(workflowId);
      const personaQuality = await this.assessPersonaQuality(empathyData);
      const interviewDepth = await this.assessInterviewDepth(userInterviews);

      return (personaQuality + interviewDepth) / 2;
    } catch (error) {
      console.error('Error measuring user centricity:', error);
      return 0;
    }
  }

  /**
   * Measure idea diversity
   */
  private async measureIdeaDiversity(workflowId: string): Promise<number> {
    try {
      const ideas = await this.db.getWorkflowIdeas(workflowId);
      const diversityScore = await this.calculateIdeaDiversity(ideas);
      return diversityScore;
    } catch (error) {
      console.error('Error measuring idea diversity:', error);
      return 0;
    }
  }

  /**
   * Measure iteration speed
   */
  private async measureIterationSpeed(workflowId: string): Promise<number> {
    try {
      const iterations = await this.db.getWorkflowIterations(workflowId);
      const speedScore = await this.calculateIterationSpeed(iterations);
      return speedScore;
    } catch (error) {
      console.error('Error measuring iteration speed:', error);
      return 0;
    }
  }

  /**
   * Measure team collaboration
   */
  private async measureTeamCollaboration(workflowId: string): Promise<number> {
    try {
      const sessions = await this.db.getWorkflowSessions(workflowId);
      const collaborationScore = await this.calculateCollaborationScore(sessions);
      return collaborationScore;
    } catch (error) {
      console.error('Error measuring team collaboration:', error);
      return 0;
    }
  }

  /**
   * Measure outcome quality
   */
  private async measureOutcomeQuality(workflowId: string): Promise<number> {
    try {
      const outcomes = await this.db.getWorkflowOutcomes(workflowId);
      const qualityScore = await this.calculateOutcomeQuality(outcomes);
      return qualityScore;
    } catch (error) {
      console.error('Error measuring outcome quality:', error);
      return 0;
    }
  }

  /**
   * Measure process adherence
   */
  private async measureProcessAdherence(workflowId: string): Promise<number> {
    try {
      const workflow = await this.db.getWorkflow(workflowId);
      const adherenceScore = await this.calculateProcessAdherence(workflow);
      return adherenceScore;
    } catch (error) {
      console.error('Error measuring process adherence:', error);
      return 0;
    }
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(dimensions: EffectivenessDimensions): number {
    const weights = {
      userCentricity: 0.2,
      ideaDiversity: 0.15,
      iterationSpeed: 0.15,
      teamCollaboration: 0.2,
      outcomeQuality: 0.2,
      processAdherence: 0.1
    };

    return Object.entries(dimensions).reduce((sum, [key, value]) => {
      return sum + (value * (weights[key as keyof typeof weights] || 0));
    }, 0);
  }

  /**
   * Generate recommendations
   */
  private async generateRecommendations(workflowId: string, dimensions: EffectivenessDimensions): Promise<string[]> {
    const recommendations: string[] = [];

    if (dimensions.userCentricity < 0.6) {
      recommendations.push('Increase user research depth and persona development');
    }

    if (dimensions.ideaDiversity < 0.6) {
      recommendations.push('Encourage more diverse idea generation techniques');
    }

    if (dimensions.iterationSpeed < 0.6) {
      recommendations.push('Optimize iteration cycles and feedback loops');
    }

    if (dimensions.teamCollaboration < 0.6) {
      recommendations.push('Improve team collaboration and communication');
    }

    if (dimensions.outcomeQuality < 0.6) {
      recommendations.push('Focus on higher quality deliverables and outcomes');
    }

    if (dimensions.processAdherence < 0.6) {
      recommendations.push('Better adherence to Lean Design Thinking™ methodology');
    }

    return recommendations;
  }

  /**
   * Get workflow insights
   */
  private async getWorkflowInsights(workflowId: string): Promise<Insight[]> {
    return await this.db.getWorkflowInsights(workflowId);
  }

  /**
   * Identify relationships between insights
   */
  private async identifyRelationships(insights: Insight[]): Promise<InsightEdge[]> {
    const edges: InsightEdge[] = [];

    for (let i = 0; i < insights.length; i++) {
      for (let j = i + 1; j < insights.length; j++) {
        const similarity = await this.calculateInsightSimilarity(insights[i], insights[j]);
        if (similarity > 0.5) {
          edges.push({
            from: insights[i].id,
            to: insights[j].id,
            type: 'related',
            strength: similarity
          });
        }
      }
    }

    return edges;
  }

  /**
   * Cluster insights
   */
  private async clusterInsights(insights: Insight[]): Promise<InsightCluster[]> {
    const clusters: InsightCluster[] = [];
    const processed = new Set<string>();

    for (const insight of insights) {
      if (processed.has(insight.id)) continue;

      const cluster = await this.createInsightCluster(insight, insights);
      clusters.push(cluster);
      
      cluster.insights.forEach(id => processed.add(id));
    }

    return clusters;
  }

  /**
   * Identify critical path
   */
  private async identifyCriticalPath(insights: Insight[]): Promise<string[]> {
    const sortedInsights = insights.sort((a, b) => (b.importance || 0) - (a.importance || 0));
    return sortedInsights.slice(0, 5).map(insight => insight.id);
  }

  /**
   * Calculate insight similarity
   */
  private async calculateInsightSimilarity(insight1: Insight, insight2: Insight): Promise<number> {
    // Simple similarity calculation based on content and phase
    const contentSimilarity = this.calculateContentSimilarity(insight1.content, insight2.content);
    const phaseSimilarity = insight1.phase === insight2.phase ? 1 : 0;
    
    return (contentSimilarity + phaseSimilarity) / 2;
  }

  /**
   * Calculate content similarity
   */
  private calculateContentSimilarity(content1: string, content2: string): number {
    // Simple word-based similarity
    const words1 = content1.toLowerCase().split(/\s+/);
    const words2 = content2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  /**
   * Create insight cluster
   */
  private async createInsightCluster(seedInsight: Insight, allInsights: Insight[]): Promise<InsightCluster> {
    const cluster: InsightCluster = {
      id: this.generateId(),
      name: `Cluster ${seedInsight.phase}`,
      insights: [seedInsight.id],
      theme: seedInsight.phase,
      confidence: 0.8
    };

    for (const insight of allInsights) {
      if (insight.id === seedInsight.id) continue;
      
      const similarity = await this.calculateInsightSimilarity(seedInsight, insight);
      if (similarity > 0.6) {
        cluster.insights.push(insight.id);
      }
    }

    return cluster;
  }

  /**
   * Find benchmarks
   */
  private async findBenchmarks(workflow: Workflow): Promise<Benchmark[]> {
    return await this.db.findSimilarWorkflows(workflow);
  }

  /**
   * Perform comparison
   */
  private async performComparison(workflow: Workflow, benchmarks: Benchmark[]): Promise<ComparisonResult> {
    // Implementation for comparing workflow to benchmarks
    return {
      ranking: 0.5,
      differences: [],
      opportunities: []
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Placeholder methods for database operations
  private async assessPersonaQuality(empathyData: any[]): Promise<number> { return 0.8; }
  private async assessInterviewDepth(interviews: any[]): Promise<number> { return 0.7; }
  private async calculateIdeaDiversity(ideas: any[]): Promise<number> { return 0.6; }
  private async calculateIterationSpeed(iterations: any[]): Promise<number> { return 0.5; }
  private async calculateCollaborationScore(sessions: any[]): Promise<number> { return 0.7; }
  private async calculateOutcomeQuality(outcomes: any[]): Promise<number> { return 0.8; }
  private async calculateProcessAdherence(workflow: any): Promise<number> { return 0.6; }
}

// Type definitions
interface EffectivenessScore {
  overall: number;
  dimensions: EffectivenessDimensions;
  recommendations: string[];
  benchmarks: BenchmarkComparison;
  calculatedAt: Date;
}

interface EffectivenessDimensions {
  userCentricity: number;
  ideaDiversity: number;
  iterationSpeed: number;
  teamCollaboration: number;
  outcomeQuality: number;
  processAdherence: number;
}

interface InsightMap {
  nodes: InsightNode[];
  edges: InsightEdge[];
  clusters: InsightCluster[];
  criticalPath: string[];
  generatedAt: Date;
}

interface InsightNode {
  id: string;
  label: string;
  phase: string;
  importance: number;
  connections: string[];
}

interface InsightEdge {
  from: string;
  to: string;
  type: string;
  strength: number;
}

interface InsightCluster {
  id: string;
  name: string;
  insights: string[];
  theme: string;
  confidence: number;
}

interface BenchmarkComparison {
  industry: string;
  similarProjects: number;
  performanceRanking: number;
  keyDifferences: string[];
  improvementOpportunities: string[];
  comparedAt: Date;
}

interface Insight {
  id: string;
  content: string;
  phase: string;
  importance: number;
  connections?: string[];
}

interface Workflow {
  id: string;
  industry?: string;
}

interface Benchmark {
  id: string;
  industry: string;
  metrics: any;
}

interface ComparisonResult {
  ranking: number;
  differences: string[];
  opportunities: string[];
}
