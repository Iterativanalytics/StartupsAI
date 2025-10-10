import { DatabaseService } from './database-service';

/**
 * Benchmark Service for Design Thinking System
 * 
 * Provides benchmarking capabilities for DT workflows:
 * - Industry comparisons
 * - Performance ranking
 * - Best practice identification
 * - Improvement recommendations
 */
export class BenchmarkService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * Compare workflow to benchmarks
   */
  async compareToBenchmarks(workflow: DTWorkflow): Promise<BenchmarkComparison> {
    try {
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
   * Find relevant benchmarks
   */
  private async findBenchmarks(workflow: DTWorkflow): Promise<Benchmark[]> {
    try {
      const industry = workflow.industry || 'general';
      const phase = workflow.currentPhase;
      const size = await this.estimateWorkflowSize(workflow);
      
      const benchmarks = await this.db.findSimilarWorkflows({
        industry,
        phase,
        size,
        limit: 10
      });
      
      return benchmarks;
    } catch (error) {
      console.error('Error finding benchmarks:', error);
      return [];
    }
  }

  /**
   * Perform comparison
   */
  private async performComparison(workflow: DTWorkflow, benchmarks: Benchmark[]): Promise<ComparisonResult> {
    try {
      const workflowMetrics = await this.calculateWorkflowMetrics(workflow);
      const benchmarkMetrics = await this.calculateBenchmarkMetrics(benchmarks);
      
      const ranking = this.calculatePerformanceRanking(workflowMetrics, benchmarkMetrics);
      const differences = this.identifyKeyDifferences(workflowMetrics, benchmarkMetrics);
      const opportunities = this.identifyImprovementOpportunities(workflowMetrics, benchmarkMetrics);
      
      return {
        ranking,
        differences,
        opportunities
      };
    } catch (error) {
      console.error('Error performing comparison:', error);
      return {
        ranking: 0.5,
        differences: [],
        opportunities: []
      };
    }
  }

  /**
   * Calculate workflow metrics
   */
  private async calculateWorkflowMetrics(workflow: DTWorkflow): Promise<WorkflowMetrics> {
    try {
      const [
        effectiveness,
        efficiency,
        quality,
        innovation,
        collaboration
      ] = await Promise.all([
        this.calculateEffectiveness(workflow),
        this.calculateEfficiency(workflow),
        this.calculateQuality(workflow),
        this.calculateInnovation(workflow),
        this.calculateCollaboration(workflow)
      ]);

      return {
        effectiveness,
        efficiency,
        quality,
        innovation,
        collaboration,
        overall: (effectiveness + efficiency + quality + innovation + collaboration) / 5
      };
    } catch (error) {
      console.error('Error calculating workflow metrics:', error);
      return {
        effectiveness: 0,
        efficiency: 0,
        quality: 0,
        innovation: 0,
        collaboration: 0,
        overall: 0
      };
    }
  }

  /**
   * Calculate benchmark metrics
   */
  private async calculateBenchmarkMetrics(benchmarks: Benchmark[]): Promise<BenchmarkMetrics> {
    try {
      const metrics = benchmarks.map(benchmark => benchmark.metrics);
      
      return {
        effectiveness: this.calculateAverage(metrics.map(m => m.effectiveness)),
        efficiency: this.calculateAverage(metrics.map(m => m.efficiency)),
        quality: this.calculateAverage(metrics.map(m => m.quality)),
        innovation: this.calculateAverage(metrics.map(m => m.innovation)),
        collaboration: this.calculateAverage(metrics.map(m => m.collaboration)),
        overall: this.calculateAverage(metrics.map(m => m.overall))
      };
    } catch (error) {
      console.error('Error calculating benchmark metrics:', error);
      return {
        effectiveness: 0,
        efficiency: 0,
        quality: 0,
        innovation: 0,
        collaboration: 0,
        overall: 0
      };
    }
  }

  /**
   * Calculate performance ranking
   */
  private calculatePerformanceRanking(workflowMetrics: WorkflowMetrics, benchmarkMetrics: BenchmarkMetrics): number {
    const workflowScore = workflowMetrics.overall;
    const benchmarkScore = benchmarkMetrics.overall;
    
    if (workflowScore >= benchmarkScore) {
      return 0.8 + (workflowScore - benchmarkScore) * 0.2;
    } else {
      return 0.5 + (workflowScore / benchmarkScore) * 0.3;
    }
  }

  /**
   * Identify key differences
   */
  private identifyKeyDifferences(workflowMetrics: WorkflowMetrics, benchmarkMetrics: BenchmarkMetrics): string[] {
    const differences: string[] = [];
    
    if (workflowMetrics.effectiveness < benchmarkMetrics.effectiveness - 0.1) {
      differences.push('Effectiveness below benchmark');
    }
    
    if (workflowMetrics.efficiency < benchmarkMetrics.efficiency - 0.1) {
      differences.push('Efficiency below benchmark');
    }
    
    if (workflowMetrics.quality < benchmarkMetrics.quality - 0.1) {
      differences.push('Quality below benchmark');
    }
    
    if (workflowMetrics.innovation < benchmarkMetrics.innovation - 0.1) {
      differences.push('Innovation below benchmark');
    }
    
    if (workflowMetrics.collaboration < benchmarkMetrics.collaboration - 0.1) {
      differences.push('Collaboration below benchmark');
    }
    
    return differences;
  }

  /**
   * Identify improvement opportunities
   */
  private identifyImprovementOpportunities(workflowMetrics: WorkflowMetrics, benchmarkMetrics: BenchmarkMetrics): string[] {
    const opportunities: string[] = [];
    
    if (workflowMetrics.effectiveness < benchmarkMetrics.effectiveness) {
      opportunities.push('Focus on user research and validation');
    }
    
    if (workflowMetrics.efficiency < benchmarkMetrics.efficiency) {
      opportunities.push('Optimize process and reduce cycle time');
    }
    
    if (workflowMetrics.quality < benchmarkMetrics.quality) {
      opportunities.push('Improve deliverable quality and standards');
    }
    
    if (workflowMetrics.innovation < benchmarkMetrics.innovation) {
      opportunities.push('Encourage more creative thinking and experimentation');
    }
    
    if (workflowMetrics.collaboration < benchmarkMetrics.collaboration) {
      opportunities.push('Enhance team collaboration and communication');
    }
    
    return opportunities;
  }

  /**
   * Calculate effectiveness
   */
  private async calculateEffectiveness(workflow: DTWorkflow): Promise<number> {
    try {
      const outcomes = await this.db.getWorkflowOutcomes(workflow.id);
      const tests = await this.db.getWorkflowTests(workflow.id);
      
      const outcomeQuality = outcomes.length > 0 ? 
        outcomes.reduce((sum, outcome) => sum + (outcome.quality || 0.5), 0) / outcomes.length : 0;
      
      const testSuccess = tests.length > 0 ? 
        tests.filter(test => test.success).length / tests.length : 0;
      
      return (outcomeQuality + testSuccess) / 2;
    } catch (error) {
      console.error('Error calculating effectiveness:', error);
      return 0;
    }
  }

  /**
   * Calculate efficiency
   */
  private async calculateEfficiency(workflow: DTWorkflow): Promise<number> {
    try {
      const sessions = await this.db.getWorkflowSessions(workflow.id);
      const outcomes = await this.db.getWorkflowOutcomes(workflow.id);
      
      if (sessions.length === 0) return 0;
      
      const totalTime = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
      const outcomesPerHour = outcomes.length / (totalTime / 60);
      
      return Math.min(outcomesPerHour / 2, 1); // Normalize to 0-1
    } catch (error) {
      console.error('Error calculating efficiency:', error);
      return 0;
    }
  }

  /**
   * Calculate quality
   */
  private async calculateQuality(workflow: DTWorkflow): Promise<number> {
    try {
      const deliverables = await this.db.getWorkflowDeliverables(workflow.id);
      
      if (deliverables.length === 0) return 0;
      
      const qualityScores = deliverables.map(deliverable => deliverable.quality || 0.5);
      return qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
    } catch (error) {
      console.error('Error calculating quality:', error);
      return 0;
    }
  }

  /**
   * Calculate innovation
   */
  private async calculateInnovation(workflow: DTWorkflow): Promise<number> {
    try {
      const ideas = await this.db.getWorkflowIdeas(workflow.id);
      const prototypes = await this.db.getWorkflowPrototypes(workflow.id);
      
      const ideaCount = ideas.length;
      const prototypeCount = prototypes.length;
      const innovationRate = prototypeCount / Math.max(ideaCount, 1);
      
      return Math.min(innovationRate, 1);
    } catch (error) {
      console.error('Error calculating innovation:', error);
      return 0;
    }
  }

  /**
   * Calculate collaboration
   */
  private async calculateCollaboration(workflow: DTWorkflow): Promise<number> {
    try {
      const sessions = await this.db.getWorkflowSessions(workflow.id);
      const participants = await this.db.getWorkflowParticipants(workflow.id);
      
      if (sessions.length === 0 || participants.length === 0) return 0;
      
      const participationRate = sessions.reduce((sum, session) => 
        sum + (session.participants?.length || 0), 0) / (sessions.length * participants.length);
      
      return participationRate;
    } catch (error) {
      console.error('Error calculating collaboration:', error);
      return 0;
    }
  }

  /**
   * Estimate workflow size
   */
  private async estimateWorkflowSize(workflow: DTWorkflow): Promise<string> {
    try {
      const participants = await this.db.getWorkflowParticipants(workflow.id);
      const sessions = await this.db.getWorkflowSessions(workflow.id);
      
      const participantCount = participants.length;
      const sessionCount = sessions.length;
      
      if (participantCount <= 3 && sessionCount <= 5) return 'small';
      if (participantCount <= 8 && sessionCount <= 15) return 'medium';
      return 'large';
    } catch (error) {
      console.error('Error estimating workflow size:', error);
      return 'medium';
    }
  }

  /**
   * Calculate average
   */
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  /**
   * Get industry benchmarks
   */
  async getIndustryBenchmarks(industry: string): Promise<IndustryBenchmark> {
    try {
      const benchmarks = await this.db.getIndustryBenchmarks(industry);
      
      return {
        industry,
        averageEffectiveness: this.calculateAverage(benchmarks.map(b => b.effectiveness)),
        averageEfficiency: this.calculateAverage(benchmarks.map(b => b.efficiency)),
        averageQuality: this.calculateAverage(benchmarks.map(b => b.quality)),
        averageInnovation: this.calculateAverage(benchmarks.map(b => b.innovation)),
        averageCollaboration: this.calculateAverage(benchmarks.map(b => b.collaboration)),
        bestPractices: await this.identifyBestPractices(industry),
        sampleSize: benchmarks.length
      };
    } catch (error) {
      console.error('Error getting industry benchmarks:', error);
      return {
        industry,
        averageEffectiveness: 0,
        averageEfficiency: 0,
        averageQuality: 0,
        averageInnovation: 0,
        averageCollaboration: 0,
        bestPractices: [],
        sampleSize: 0
      };
    }
  }

  /**
   * Identify best practices
   */
  private async identifyBestPractices(industry: string): Promise<string[]> {
    try {
      const topPerformers = await this.db.getTopPerformingWorkflows(industry, 5);
      const practices: string[] = [];
      
      for (const workflow of topPerformers) {
        const practices = await this.db.getWorkflowPractices(workflow.id);
        practices.push(...practices);
      }
      
      return [...new Set(practices)]; // Remove duplicates
    } catch (error) {
      console.error('Error identifying best practices:', error);
      return [];
    }
  }
}

// Type definitions
interface DTWorkflow {
  id: string;
  name: string;
  industry?: string;
  currentPhase: string;
  status: string;
}

interface BenchmarkComparison {
  industry: string;
  similarProjects: number;
  performanceRanking: number;
  keyDifferences: string[];
  improvementOpportunities: string[];
  comparedAt: Date;
}

interface Benchmark {
  id: string;
  industry: string;
  metrics: WorkflowMetrics;
  practices: string[];
}

interface WorkflowMetrics {
  effectiveness: number;
  efficiency: number;
  quality: number;
  innovation: number;
  collaboration: number;
  overall: number;
}

interface BenchmarkMetrics {
  effectiveness: number;
  efficiency: number;
  quality: number;
  innovation: number;
  collaboration: number;
  overall: number;
}

interface ComparisonResult {
  ranking: number;
  differences: string[];
  opportunities: string[];
}

interface IndustryBenchmark {
  industry: string;
  averageEffectiveness: number;
  averageEfficiency: number;
  averageQuality: number;
  averageInnovation: number;
  averageCollaboration: number;
  bestPractices: string[];
  sampleSize: number;
}
