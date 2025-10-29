import { DatabaseService } from './database-service';
import { LDTAnalyticsEngine } from './dt-analytics-engine';
import { InsightTracker } from './insight-tracker';
import { ROICalculator } from './roi-calculator';
import { BenchmarkService } from './benchmark-service';

/**
 * Enhanced Lean Design Thinking™ Analytics Service
 * 
 * This service provides comprehensive analytics for LDT workflows:
 * - Effectiveness measurement
 * - ROI calculation
 * - Benchmark comparison
 * - Insight tracking
 * - Predictive analytics
 */
export class LDTAnalyticsService {
  private db: DatabaseService;
  private analyticsEngine: LDTAnalyticsEngine;
  private insightTracker: InsightTracker;
  private roiCalculator: ROICalculator;
  private benchmarkService: BenchmarkService;

  constructor() {
    this.db = new DatabaseService();
    this.analyticsEngine = new LDTAnalyticsEngine();
    this.insightTracker = new InsightTracker();
    this.roiCalculator = new ROICalculator();
    this.benchmarkService = new BenchmarkService();
  }

  /**
   * Get comprehensive analytics for a LDT workflow
   */
  async getComprehensiveAnalytics(workflowId: string): Promise<ComprehensiveAnalytics> {
    try {
      const workflow = await this.db.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      // Get all analytics components
      const [
        effectivenessScore,
        insightMap,
        roiAnalysis,
        benchmarkComparison,
        participantMetrics,
        phaseMetrics,
        collaborationMetrics,
        outcomeMetrics
      ] = await Promise.all([
        this.analyticsEngine.calculateEffectivenessScore(workflowId),
        this.analyticsEngine.generateInsightMap(workflowId),
        this.roiCalculator.calculateROI(workflow),
        this.benchmarkService.compareToBenchmarks(workflow),
        this.getParticipantMetrics(workflowId),
        this.getPhaseMetrics(workflowId),
        this.getCollaborationMetrics(workflowId),
        this.getOutcomeMetrics(workflowId)
      ]);

      return {
        workflowId,
        effectivenessScore,
        insightMap,
        roiAnalysis,
        benchmarkComparison,
        participantMetrics,
        phaseMetrics,
        collaborationMetrics,
        outcomeMetrics,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error getting comprehensive analytics:', error);
      throw error;
    }
  }

  /**
   * Calculate effectiveness score for a workflow
   */
  async calculateEffectivenessScore(workflowId: string): Promise<EffectivenessScore> {
    return await this.analyticsEngine.calculateEffectivenessScore(workflowId);
  }

  /**
   * Generate insight map for a workflow
   */
  async generateInsightMap(workflowId: string): Promise<InsightMap> {
    return await this.analyticsEngine.generateInsightMap(workflowId);
  }

  /**
   * Track insight evolution
   */
  async trackInsightEvolution(insightId: string): Promise<InsightEvolution> {
    return await this.insightTracker.trackEvolution(insightId);
  }

  /**
   * Calculate ROI for a workflow
   */
  async calculateROI(workflowId: string): Promise<ROIAnalysis> {
    const workflow = await this.db.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    return await this.roiCalculator.calculateROI(workflow);
  }

  /**
   * Compare workflow to benchmarks
   */
  async compareToBenchmarks(workflowId: string): Promise<BenchmarkComparison> {
    const workflow = await this.db.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    return await this.benchmarkService.compareToBenchmarks(workflow);
  }

  /**
   * Get participant metrics
   */
  private async getParticipantMetrics(workflowId: string): Promise<ParticipantMetrics> {
    const participants = await this.db.getWorkflowParticipants(workflowId);
    const activities = await this.db.getWorkflowActivities(workflowId);

    const participationRates = participants.map(p => ({
      participantId: p.id,
      participationRate: this.calculateParticipationRate(p.id, activities),
      contributionQuality: this.calculateContributionQuality(p.id, activities),
      engagementScore: this.calculateEngagementScore(p.id, activities)
    }));

    return {
      totalParticipants: participants.length,
      averageParticipationRate: this.calculateAverage(participationRates.map(p => p.participationRate)),
      averageContributionQuality: this.calculateAverage(participationRates.map(p => p.contributionQuality)),
      averageEngagementScore: this.calculateAverage(participationRates.map(p => p.engagementScore)),
      participationDistribution: this.calculateParticipationDistribution(participationRates),
      topContributors: this.identifyTopContributors(participationRates),
      engagementTrends: await this.calculateEngagementTrends(workflowId)
    };
  }

  /**
   * Get phase metrics
   */
  private async getPhaseMetrics(workflowId: string): Promise<PhaseMetrics> {
    const phases = ['empathize', 'define', 'ideate', 'prototype', 'test'];
    const phaseMetrics: PhaseMetric[] = [];

    for (const phase of phases) {
      const phaseData = await this.db.getPhaseData(workflowId, phase);
      const metrics = await this.calculatePhaseMetrics(phase, phaseData);
      phaseMetrics.push(metrics);
    }

    return {
      phases: phaseMetrics,
      overallProgress: this.calculateOverallProgress(phaseMetrics),
      phaseTransitions: await this.calculatePhaseTransitions(workflowId),
      bottlenecks: this.identifyBottlenecks(phaseMetrics),
      recommendations: await this.generatePhaseRecommendations(phaseMetrics)
    };
  }

  /**
   * Get collaboration metrics
   */
  private async getCollaborationMetrics(workflowId: string): Promise<CollaborationMetrics> {
    const sessions = await this.db.getWorkflowSessions(workflowId);
    const collaborations = await this.db.getWorkflowCollaborations(workflowId);

    return {
      totalSessions: sessions.length,
      averageSessionDuration: this.calculateAverage(sessions.map(s => s.duration)),
      collaborationQuality: this.calculateCollaborationQuality(collaborations),
      conflictResolutionRate: this.calculateConflictResolutionRate(collaborations),
      realTimeUsage: this.calculateRealTimeUsage(sessions),
      mobileUsage: this.calculateMobileUsage(sessions),
      offlineUsage: this.calculateOfflineUsage(sessions),
      teamDynamics: await this.analyzeTeamDynamics(workflowId)
    };
  }

  /**
   * Get outcome metrics
   */
  private async getOutcomeMetrics(workflowId: string): Promise<OutcomeMetrics> {
    const outcomes = await this.db.getWorkflowOutcomes(workflowId);
    const prototypes = await this.db.getWorkflowPrototypes(workflowId);
    const tests = await this.db.getWorkflowTests(workflowId);

    return {
      totalOutcomes: outcomes.length,
      prototypeSuccessRate: this.calculatePrototypeSuccessRate(prototypes),
      testEffectiveness: this.calculateTestEffectiveness(tests),
      ideaToPrototypeRate: this.calculateIdeaToPrototypeRate(workflowId),
      prototypeToTestRate: this.calculatePrototypeToTestRate(workflowId),
      timeToInsight: this.calculateTimeToInsight(workflowId),
      businessImpact: await this.calculateBusinessImpact(workflowId),
      userSatisfaction: this.calculateUserSatisfaction(outcomes)
    };
  }

  /**
   * Generate predictive analytics
   */
  async generatePredictiveAnalytics(workflowId: string): Promise<PredictiveAnalytics> {
    const workflow = await this.db.getWorkflow(workflowId);
    const historicalData = await this.db.getHistoricalData(workflowId);
    const similarWorkflows = await this.db.getSimilarWorkflows(workflow);

    return {
      successProbability: await this.predictSuccessProbability(workflow, historicalData),
      estimatedCompletionTime: await this.predictCompletionTime(workflow, historicalData),
      resourceRequirements: await this.predictResourceRequirements(workflow, historicalData),
      riskFactors: await this.identifyRiskFactors(workflow, historicalData),
      opportunityAreas: await this.identifyOpportunityAreas(workflow, similarWorkflows),
      recommendations: await this.generatePredictiveRecommendations(workflow, historicalData)
    };
  }

  /**
   * Generate insights and recommendations
   */
  async generateInsightsAndRecommendations(workflowId: string): Promise<InsightsAndRecommendations> {
    const analytics = await this.getComprehensiveAnalytics(workflowId);
    const predictive = await this.generatePredictiveAnalytics(workflowId);

    return {
      keyInsights: await this.extractKeyInsights(analytics),
      improvementAreas: await this.identifyImprovementAreas(analytics),
      successFactors: await this.identifySuccessFactors(analytics),
      riskMitigation: await this.generateRiskMitigationStrategies(analytics),
      optimizationOpportunities: await this.identifyOptimizationOpportunities(analytics),
      nextSteps: await this.generateNextSteps(analytics, predictive),
      longTermStrategy: await this.generateLongTermStrategy(analytics, predictive)
    };
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(workflowId: string, format: 'json' | 'csv' | 'pdf'): Promise<ExportData> {
    const analytics = await this.getComprehensiveAnalytics(workflowId);
    const predictive = await this.generatePredictiveAnalytics(workflowId);
    const insights = await this.generateInsightsAndRecommendations(workflowId);

    const exportData = {
      workflowId,
      analytics,
      predictive,
      insights,
      exportedAt: new Date()
    };

    switch (format) {
      case 'json':
        return {
          format: 'json',
          data: JSON.stringify(exportData, null, 2),
          filename: `dt-analytics-${workflowId}.json`
        };
      
      case 'csv':
        return {
          format: 'csv',
          data: await this.convertToCSV(exportData),
          filename: `dt-analytics-${workflowId}.csv`
        };
      
      case 'pdf':
        return {
          format: 'pdf',
          data: await this.generatePDF(exportData),
          filename: `dt-analytics-${workflowId}.pdf`
        };
      
      default:
        throw new Error('Unsupported export format');
    }
  }

  // Helper methods
  private calculateParticipationRate(participantId: string, activities: Activity[]): number {
    const participantActivities = activities.filter(a => a.participantId === participantId);
    const totalActivities = activities.length;
    return totalActivities > 0 ? participantActivities.length / totalActivities : 0;
  }

  private calculateContributionQuality(participantId: string, activities: Activity[]): number {
    const participantActivities = activities.filter(a => a.participantId === participantId);
    if (participantActivities.length === 0) return 0;

    const qualityScores = participantActivities.map(a => a.qualityScore || 0);
    return this.calculateAverage(qualityScores);
  }

  private calculateEngagementScore(participantId: string, activities: Activity[]): number {
    const participantActivities = activities.filter(a => a.participantId === participantId);
    if (participantActivities.length === 0) return 0;

    const engagementScores = participantActivities.map(a => a.engagementScore || 0);
    return this.calculateAverage(engagementScores);
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  private calculateParticipationDistribution(participationRates: ParticipationRate[]): Distribution {
    const rates = participationRates.map(p => p.participationRate);
    return {
      low: rates.filter(r => r < 0.3).length,
      medium: rates.filter(r => r >= 0.3 && r < 0.7).length,
      high: rates.filter(r => r >= 0.7).length
    };
  }

  private identifyTopContributors(participationRates: ParticipationRate[]): TopContributor[] {
    return participationRates
      .sort((a, b) => b.contributionQuality - a.contributionQuality)
      .slice(0, 5)
      .map(p => ({
        participantId: p.participantId,
        contributionQuality: p.contributionQuality,
        participationRate: p.participationRate
      }));
  }

  private async calculateEngagementTrends(workflowId: string): Promise<EngagementTrend[]> {
    // Implementation for calculating engagement trends over time
    return [];
  }

  private async calculatePhaseMetrics(phase: string, phaseData: any): Promise<PhaseMetric> {
    // Implementation for calculating phase-specific metrics
    return {
      phase,
      duration: 0,
      activities: 0,
      participants: 0,
      quality: 0,
      progress: 0
    };
  }

  private calculateOverallProgress(phaseMetrics: PhaseMetric[]): number {
    const totalProgress = phaseMetrics.reduce((sum, phase) => sum + phase.progress, 0);
    return totalProgress / phaseMetrics.length;
  }

  private async calculatePhaseTransitions(workflowId: string): Promise<PhaseTransition[]> {
    // Implementation for calculating phase transitions
    return [];
  }

  private identifyBottlenecks(phaseMetrics: PhaseMetric[]): Bottleneck[] {
    return phaseMetrics
      .filter(phase => phase.duration > phaseMetrics.reduce((sum, p) => sum + p.duration, 0) / phaseMetrics.length * 1.5)
      .map(phase => ({
        phase: phase.phase,
        duration: phase.duration,
        severity: 'medium' as const
      }));
  }

  private async generatePhaseRecommendations(phaseMetrics: PhaseMetric[]): Promise<string[]> {
    // Implementation for generating phase recommendations
    return [];
  }

  private calculateCollaborationQuality(collaborations: Collaboration[]): number {
    if (collaborations.length === 0) return 0;
    const qualityScores = collaborations.map(c => c.qualityScore || 0);
    return this.calculateAverage(qualityScores);
  }

  private calculateConflictResolutionRate(collaborations: Collaboration[]): number {
    const totalConflicts = collaborations.reduce((sum, c) => sum + (c.conflicts?.length || 0), 0);
    const resolvedConflicts = collaborations.reduce((sum, c) => sum + (c.resolvedConflicts?.length || 0), 0);
    return totalConflicts > 0 ? resolvedConflicts / totalConflicts : 1;
  }

  private calculateRealTimeUsage(sessions: Session[]): number {
    const realTimeSessions = sessions.filter(s => s.realTime);
    return sessions.length > 0 ? realTimeSessions.length / sessions.length : 0;
  }

  private calculateMobileUsage(sessions: Session[]): number {
    const mobileSessions = sessions.filter(s => s.mobile);
    return sessions.length > 0 ? mobileSessions.length / sessions.length : 0;
  }

  private calculateOfflineUsage(sessions: Session[]): number {
    const offlineSessions = sessions.filter(s => s.offline);
    return sessions.length > 0 ? offlineSessions.length / sessions.length : 0;
  }

  private async analyzeTeamDynamics(workflowId: string): Promise<TeamDynamics> {
    // Implementation for analyzing team dynamics
    return {
      communicationQuality: 0,
      conflictResolution: 0,
      collaborationEffectiveness: 0,
      leadershipDistribution: 0
    };
  }

  private calculatePrototypeSuccessRate(prototypes: Prototype[]): number {
    if (prototypes.length === 0) return 0;
    const successfulPrototypes = prototypes.filter(p => p.success);
    return successfulPrototypes.length / prototypes.length;
  }

  private calculateTestEffectiveness(tests: Test[]): number {
    if (tests.length === 0) return 0;
    const effectiveTests = tests.filter(t => t.effective);
    return effectiveTests.length / tests.length;
  }

  private calculateIdeaToPrototypeRate(workflowId: string): number {
    // Implementation for calculating idea to prototype conversion rate
    return 0;
  }

  private calculatePrototypeToTestRate(workflowId: string): number {
    // Implementation for calculating prototype to test conversion rate
    return 0;
  }

  private calculateTimeToInsight(workflowId: string): number {
    // Implementation for calculating time to insight
    return 0;
  }

  private async calculateBusinessImpact(workflowId: string): Promise<BusinessImpact> {
    // Implementation for calculating business impact
    return {
      revenue: 0,
      costReduction: 0,
      customerSatisfaction: 0,
      competitiveAdvantage: 0,
      marketOpportunity: 0
    };
  }

  private calculateUserSatisfaction(outcomes: Outcome[]): number {
    if (outcomes.length === 0) return 0;
    const satisfactionScores = outcomes.map(o => o.satisfactionScore || 0);
    return this.calculateAverage(satisfactionScores);
  }

  private async predictSuccessProbability(workflow: Workflow, historicalData: any): Promise<number> {
    // Implementation for predicting success probability
    return 0.8;
  }

  private async predictCompletionTime(workflow: Workflow, historicalData: any): Promise<number> {
    // Implementation for predicting completion time
    return 0;
  }

  private async predictResourceRequirements(workflow: Workflow, historicalData: any): Promise<ResourceRequirements> {
    // Implementation for predicting resource requirements
    return {
      time: 0,
      people: 0,
      budget: 0
    };
  }

  private async identifyRiskFactors(workflow: Workflow, historicalData: any): Promise<RiskFactor[]> {
    // Implementation for identifying risk factors
    return [];
  }

  private async identifyOpportunityAreas(workflow: Workflow, similarWorkflows: Workflow[]): Promise<OpportunityArea[]> {
    // Implementation for identifying opportunity areas
    return [];
  }

  private async generatePredictiveRecommendations(workflow: Workflow, historicalData: any): Promise<string[]> {
    // Implementation for generating predictive recommendations
    return [];
  }

  private async extractKeyInsights(analytics: ComprehensiveAnalytics): Promise<KeyInsight[]> {
    // Implementation for extracting key insights
    return [];
  }

  private async identifyImprovementAreas(analytics: ComprehensiveAnalytics): Promise<ImprovementArea[]> {
    // Implementation for identifying improvement areas
    return [];
  }

  private async identifySuccessFactors(analytics: ComprehensiveAnalytics): Promise<SuccessFactor[]> {
    // Implementation for identifying success factors
    return [];
  }

  private async generateRiskMitigationStrategies(analytics: ComprehensiveAnalytics): Promise<RiskMitigationStrategy[]> {
    // Implementation for generating risk mitigation strategies
    return [];
  }

  private async identifyOptimizationOpportunities(analytics: ComprehensiveAnalytics): Promise<OptimizationOpportunity[]> {
    // Implementation for identifying optimization opportunities
    return [];
  }

  private async generateNextSteps(analytics: ComprehensiveAnalytics, predictive: PredictiveAnalytics): Promise<NextStep[]> {
    // Implementation for generating next steps
    return [];
  }

  private async generateLongTermStrategy(analytics: ComprehensiveAnalytics, predictive: PredictiveAnalytics): Promise<LongTermStrategy> {
    // Implementation for generating long-term strategy
    return {
      vision: '',
      goals: [],
      strategies: [],
      timeline: 0
    };
  }

  private async convertToCSV(data: any): Promise<string> {
    // Implementation for converting data to CSV
    return '';
  }

  private async generatePDF(data: any): Promise<Buffer> {
    // Implementation for generating PDF
    return Buffer.from('');
  }
}

// Type definitions
interface ComprehensiveAnalytics {
  workflowId: string;
  effectivenessScore: EffectivenessScore;
  insightMap: InsightMap;
  roiAnalysis: ROIAnalysis;
  benchmarkComparison: BenchmarkComparison;
  participantMetrics: ParticipantMetrics;
  phaseMetrics: PhaseMetrics;
  collaborationMetrics: CollaborationMetrics;
  outcomeMetrics: OutcomeMetrics;
  generatedAt: Date;
}

interface EffectivenessScore {
  overall: number;
  dimensions: {
    userCentricity: number;
    ideaDiversity: number;
    iterationSpeed: number;
    teamCollaboration: number;
    outcomeQuality: number;
    processAdherence: number;
  };
  recommendations: string[];
  benchmarks: BenchmarkComparison;
}

interface InsightMap {
  nodes: InsightNode[];
  edges: InsightEdge[];
  clusters: InsightCluster[];
  criticalPath: string[];
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
}

interface InsightEvolution {
  originalInsight: Insight;
  transformations: InsightTransformation[];
  finalOutcome: Insight;
  impact: InsightImpact;
  businessValue: number;
}

interface InsightTransformation {
  phase: string;
  transformation: any;
  contributingFactors: string[];
  refinements: string[];
}

interface InsightImpact {
  usageCount: number;
  influenceScore: number;
  businessValue: number;
  timeToImpact: number;
}

interface ROIAnalysis {
  investment: {
    timeInvested: number;
    resourceCost: number;
    toolCost: number;
    total: number;
  };
  returns: {
    timeToMarketReduction: number;
    developmentCostSavings: number;
    revenueImpact: number;
    riskMitigation: number;
    innovationValue: number;
  };
  roi: number;
  paybackPeriod: number;
  intangibleBenefits: string[];
}

interface BenchmarkComparison {
  industry: string;
  similarProjects: number;
  performanceRanking: number;
  keyDifferences: string[];
  improvementOpportunities: string[];
}

interface ParticipantMetrics {
  totalParticipants: number;
  averageParticipationRate: number;
  averageContributionQuality: number;
  averageEngagementScore: number;
  participationDistribution: Distribution;
  topContributors: TopContributor[];
  engagementTrends: EngagementTrend[];
}

interface Distribution {
  low: number;
  medium: number;
  high: number;
}

interface TopContributor {
  participantId: string;
  contributionQuality: number;
  participationRate: number;
}

interface EngagementTrend {
  date: Date;
  engagementScore: number;
}

interface PhaseMetrics {
  phases: PhaseMetric[];
  overallProgress: number;
  phaseTransitions: PhaseTransition[];
  bottlenecks: Bottleneck[];
  recommendations: string[];
}

interface PhaseMetric {
  phase: string;
  duration: number;
  activities: number;
  participants: number;
  quality: number;
  progress: number;
}

interface PhaseTransition {
  from: string;
  to: string;
  duration: number;
  quality: number;
}

interface Bottleneck {
  phase: string;
  duration: number;
  severity: 'low' | 'medium' | 'high';
}

interface CollaborationMetrics {
  totalSessions: number;
  averageSessionDuration: number;
  collaborationQuality: number;
  conflictResolutionRate: number;
  realTimeUsage: number;
  mobileUsage: number;
  offlineUsage: number;
  teamDynamics: TeamDynamics;
}

interface TeamDynamics {
  communicationQuality: number;
  conflictResolution: number;
  collaborationEffectiveness: number;
  leadershipDistribution: number;
}

interface OutcomeMetrics {
  totalOutcomes: number;
  prototypeSuccessRate: number;
  testEffectiveness: number;
  ideaToPrototypeRate: number;
  prototypeToTestRate: number;
  timeToInsight: number;
  businessImpact: BusinessImpact;
  userSatisfaction: number;
}

interface BusinessImpact {
  revenue: number;
  costReduction: number;
  customerSatisfaction: number;
  competitiveAdvantage: number;
  marketOpportunity: number;
}

interface PredictiveAnalytics {
  successProbability: number;
  estimatedCompletionTime: number;
  resourceRequirements: ResourceRequirements;
  riskFactors: RiskFactor[];
  opportunityAreas: OpportunityArea[];
  recommendations: string[];
}

interface ResourceRequirements {
  time: number;
  people: number;
  budget: number;
}

interface RiskFactor {
  factor: string;
  probability: number;
  impact: number;
  mitigation: string;
}

interface OpportunityArea {
  area: string;
  potential: number;
  effort: number;
  recommendation: string;
}

interface InsightsAndRecommendations {
  keyInsights: KeyInsight[];
  improvementAreas: ImprovementArea[];
  successFactors: SuccessFactor[];
  riskMitigation: RiskMitigationStrategy[];
  optimizationOpportunities: OptimizationOpportunity[];
  nextSteps: NextStep[];
  longTermStrategy: LongTermStrategy;
}

interface KeyInsight {
  insight: string;
  importance: number;
  evidence: string[];
}

interface ImprovementArea {
  area: string;
  currentState: number;
  targetState: number;
  recommendations: string[];
}

interface SuccessFactor {
  factor: string;
  impact: number;
  evidence: string[];
}

interface RiskMitigationStrategy {
  risk: string;
  strategy: string;
  implementation: string[];
}

interface OptimizationOpportunity {
  opportunity: string;
  potential: number;
  effort: number;
  recommendation: string;
}

interface NextStep {
  action: string;
  priority: 'high' | 'medium' | 'low';
  timeline: string;
  resources: string[];
}

interface LongTermStrategy {
  vision: string;
  goals: string[];
  strategies: string[];
  timeline: number;
}

interface ExportData {
  format: string;
  data: string | Buffer;
  filename: string;
}

// Supporting interfaces
interface Activity {
  id: string;
  participantId: string;
  type: string;
  qualityScore?: number;
  engagementScore?: number;
  timestamp: Date;
}

interface ParticipationRate {
  participantId: string;
  participationRate: number;
  contributionQuality: number;
  engagementScore: number;
}

interface Collaboration {
  id: string;
  qualityScore?: number;
  conflicts?: Conflict[];
  resolvedConflicts?: Conflict[];
}

interface Conflict {
  id: string;
  type: string;
  description: string;
}

interface Session {
  id: string;
  duration: number;
  realTime: boolean;
  mobile: boolean;
  offline: boolean;
}

interface Prototype {
  id: string;
  success: boolean;
}

interface Test {
  id: string;
  effective: boolean;
}

interface Outcome {
  id: string;
  satisfactionScore?: number;
}

interface Workflow {
  id: string;
  name: string;
  currentPhase: string;
}

interface Insight {
  id: string;
  content: string;
  phase: string;
  importance: number;
}
