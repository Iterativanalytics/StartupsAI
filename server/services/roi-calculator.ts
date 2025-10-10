import { DatabaseService } from './database-service';

/**
 * ROI Calculator for Design Thinking System
 * 
 * Calculates return on investment for DT workflows:
 * - Investment calculation
 * - Returns measurement
 * - ROI calculation
 * - Payback period analysis
 */
export class ROICalculator {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * Calculate comprehensive ROI for workflow
   */
  async calculateROI(workflow: DTWorkflow): Promise<ROIAnalysis> {
    try {
      const investment = await this.calculateInvestment(workflow);
      const returns = await this.calculateReturns(workflow);
      const roi = this.calculateROIPercentage(investment, returns);
      const paybackPeriod = this.calculatePaybackPeriod(investment, returns);
      const intangibleBenefits = await this.identifyIntangibleBenefits(workflow);

      return {
        investment,
        returns,
        roi,
        paybackPeriod,
        intangibleBenefits,
        calculatedAt: new Date()
      };
    } catch (error) {
      console.error('Error calculating ROI:', error);
      throw new Error('Failed to calculate ROI');
    }
  }

  /**
   * Calculate investment
   */
  private async calculateInvestment(workflow: DTWorkflow): Promise<InvestmentBreakdown> {
    const timeInvested = await this.calculateTimeInvestment(workflow);
    const resourceCost = await this.calculateResourceCost(workflow);
    const toolCost = await this.calculateToolCost(workflow);
    const opportunityCost = await this.calculateOpportunityCost(workflow);

    const total = timeInvested + resourceCost + toolCost + opportunityCost;

    return {
      timeInvested,
      resourceCost,
      toolCost,
      opportunityCost,
      total
    };
  }

  /**
   * Calculate returns
   */
  private async calculateReturns(workflow: DTWorkflow): Promise<ReturnsBreakdown> {
    const timeToMarketReduction = await this.estimateTimeToMarketReduction(workflow);
    const developmentCostSavings = await this.estimateDevelopmentCostSavings(workflow);
    const revenueImpact = await this.estimateRevenueImpact(workflow);
    const riskMitigation = await this.estimateRiskMitigation(workflow);
    const innovationValue = await this.estimateInnovationValue(workflow);

    const total = timeToMarketReduction + developmentCostSavings + revenueImpact + riskMitigation + innovationValue;

    return {
      timeToMarketReduction,
      developmentCostSavings,
      revenueImpact,
      riskMitigation,
      innovationValue,
      total
    };
  }

  /**
   * Calculate time investment
   */
  private async calculateTimeInvestment(workflow: DTWorkflow): Promise<number> {
    try {
      const sessions = await this.db.getWorkflowSessions(workflow.id);
      const participants = await this.db.getWorkflowParticipants(workflow.id);
      
      const totalSessionTime = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
      const preparationTime = totalSessionTime * 0.3; // 30% preparation time
      const followUpTime = totalSessionTime * 0.2; // 20% follow-up time
      
      const totalTime = totalSessionTime + preparationTime + followUpTime;
      const hourlyRate = 50; // Average hourly rate
      
      return totalTime * hourlyRate;
    } catch (error) {
      console.error('Error calculating time investment:', error);
      return 0;
    }
  }

  /**
   * Calculate resource cost
   */
  private async calculateResourceCost(workflow: DTWorkflow): Promise<number> {
    try {
      const participants = await this.db.getWorkflowParticipants(workflow.id);
      const sessions = await this.db.getWorkflowSessions(workflow.id);
      
      const facilitatorCost = sessions.length * 200; // $200 per session
      const participantCost = participants.length * 50; // $50 per participant
      const materialsCost = sessions.length * 25; // $25 per session
      
      return facilitatorCost + participantCost + materialsCost;
    } catch (error) {
      console.error('Error calculating resource cost:', error);
      return 0;
    }
  }

  /**
   * Calculate tool cost
   */
  private async calculateToolCost(workflow: DTWorkflow): Promise<number> {
    try {
      const toolUsage = await this.db.getWorkflowToolUsage(workflow.id);
      const aiServiceCost = toolUsage.aiCalls * 0.01; // $0.01 per AI call
      const collaborationCost = toolUsage.collaborationMinutes * 0.05; // $0.05 per minute
      const analyticsCost = toolUsage.analyticsQueries * 0.02; // $0.02 per query
      
      return aiServiceCost + collaborationCost + analyticsCost;
    } catch (error) {
      console.error('Error calculating tool cost:', error);
      return 0;
    }
  }

  /**
   * Calculate opportunity cost
   */
  private async calculateOpportunityCost(workflow: DTWorkflow): Promise<number> {
    try {
      const timeInvested = await this.calculateTimeInvestment(workflow);
      const alternativeReturn = timeInvested * 0.1; // 10% alternative return
      
      return alternativeReturn;
    } catch (error) {
      console.error('Error calculating opportunity cost:', error);
      return 0;
    }
  }

  /**
   * Estimate time to market reduction
   */
  private async estimateTimeToMarketReduction(workflow: DTWorkflow): Promise<number> {
    try {
      const outcomes = await this.db.getWorkflowOutcomes(workflow.id);
      const prototypes = await this.db.getWorkflowPrototypes(workflow.id);
      
      const timeReduction = outcomes.length * 30; // 30 days per outcome
      const prototypeAcceleration = prototypes.length * 15; // 15 days per prototype
      
      const totalDays = timeReduction + prototypeAcceleration;
      const dailyValue = 1000; // $1000 per day
      
      return totalDays * dailyValue;
    } catch (error) {
      console.error('Error estimating time to market reduction:', error);
      return 0;
    }
  }

  /**
   * Estimate development cost savings
   */
  private async estimateDevelopmentCostSavings(workflow: DTWorkflow): Promise<number> {
    try {
      const prototypes = await this.db.getWorkflowPrototypes(workflow.id);
      const tests = await this.db.getWorkflowTests(workflow.id);
      
      const prototypeSavings = prototypes.length * 5000; // $5000 per prototype
      const testSavings = tests.length * 2000; // $2000 per test
      
      return prototypeSavings + testSavings;
    } catch (error) {
      console.error('Error estimating development cost savings:', error);
      return 0;
    }
  }

  /**
   * Estimate revenue impact
   */
  private async estimateRevenueImpact(workflow: DTWorkflow): Promise<number> {
    try {
      const outcomes = await this.db.getWorkflowOutcomes(workflow.id);
      const businessValue = await this.calculateBusinessValue(workflow);
      
      const revenuePerOutcome = 10000; // $10,000 per successful outcome
      const totalRevenue = outcomes.length * revenuePerOutcome;
      
      return totalRevenue + businessValue;
    } catch (error) {
      console.error('Error estimating revenue impact:', error);
      return 0;
    }
  }

  /**
   * Estimate risk mitigation
   */
  private async estimateRiskMitigation(workflow: DTWorkflow): Promise<number> {
    try {
      const risks = await this.db.getWorkflowRisks(workflow.id);
      const mitigations = await this.db.getWorkflowMitigations(workflow.id);
      
      const riskValue = risks.length * 5000; // $5000 per risk mitigated
      const mitigationValue = mitigations.length * 2000; // $2000 per mitigation
      
      return riskValue + mitigationValue;
    } catch (error) {
      console.error('Error estimating risk mitigation:', error);
      return 0;
    }
  }

  /**
   * Estimate innovation value
   */
  private async estimateInnovationValue(workflow: DTWorkflow): Promise<number> {
    try {
      const insights = await this.db.getWorkflowInsights(workflow.id);
      const ideas = await this.db.getWorkflowIdeas(workflow.id);
      
      const insightValue = insights.length * 1000; // $1000 per insight
      const ideaValue = ideas.length * 500; // $500 per idea
      
      return insightValue + ideaValue;
    } catch (error) {
      console.error('Error estimating innovation value:', error);
      return 0;
    }
  }

  /**
   * Calculate business value
   */
  private async calculateBusinessValue(workflow: DTWorkflow): Promise<number> {
    try {
      const outcomes = await this.db.getWorkflowOutcomes(workflow.id);
      const quality = await this.assessOutcomeQuality(outcomes);
      const marketSize = await this.estimateMarketSize(workflow);
      
      return quality * marketSize * 0.1; // 10% of market size
    } catch (error) {
      console.error('Error calculating business value:', error);
      return 0;
    }
  }

  /**
   * Calculate ROI percentage
   */
  private calculateROIPercentage(investment: InvestmentBreakdown, returns: ReturnsBreakdown): number {
    if (investment.total === 0) return 0;
    return ((returns.total - investment.total) / investment.total) * 100;
  }

  /**
   * Calculate payback period
   */
  private calculatePaybackPeriod(investment: InvestmentBreakdown, returns: ReturnsBreakdown): number {
    if (returns.total <= 0) return Infinity;
    return investment.total / returns.total;
  }

  /**
   * Identify intangible benefits
   */
  private async identifyIntangibleBenefits(workflow: DTWorkflow): Promise<string[]> {
    const benefits: string[] = [];
    
    const insights = await this.db.getWorkflowInsights(workflow.id);
    if (insights.length > 0) {
      benefits.push('Enhanced team learning and knowledge');
    }
    
    const collaboration = await this.assessCollaborationQuality(workflow);
    if (collaboration > 0.7) {
      benefits.push('Improved team collaboration');
    }
    
    const innovation = await this.assessInnovationCulture(workflow);
    if (innovation > 0.7) {
      benefits.push('Strengthened innovation culture');
    }
    
    return benefits;
  }

  /**
   * Assess outcome quality
   */
  private async assessOutcomeQuality(outcomes: any[]): Promise<number> {
    if (outcomes.length === 0) return 0;
    
    const qualityScores = outcomes.map(outcome => outcome.quality || 0.5);
    return qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
  }

  /**
   * Estimate market size
   */
  private async estimateMarketSize(workflow: DTWorkflow): Promise<number> {
    // Simple market size estimation based on industry
    const industryMultipliers: Record<string, number> = {
      'technology': 1000000,
      'healthcare': 800000,
      'finance': 600000,
      'education': 400000,
      'retail': 300000
    };
    
    return industryMultipliers[workflow.industry || 'general'] || 500000;
  }

  /**
   * Assess collaboration quality
   */
  private async assessCollaborationQuality(workflow: DTWorkflow): Promise<number> {
    try {
      const sessions = await this.db.getWorkflowSessions(workflow.id);
      const participants = await this.db.getWorkflowParticipants(workflow.id);
      
      if (sessions.length === 0 || participants.length === 0) return 0;
      
      const participationRate = sessions.reduce((sum, session) => 
        sum + (session.participants?.length || 0), 0) / (sessions.length * participants.length);
      
      return participationRate;
    } catch (error) {
      console.error('Error assessing collaboration quality:', error);
      return 0;
    }
  }

  /**
   * Assess innovation culture
   */
  private async assessInnovationCulture(workflow: DTWorkflow): Promise<number> {
    try {
      const ideas = await this.db.getWorkflowIdeas(workflow.id);
      const prototypes = await this.db.getWorkflowPrototypes(workflow.id);
      
      const ideaToPrototypeRate = prototypes.length / Math.max(ideas.length, 1);
      return Math.min(ideaToPrototypeRate, 1);
    } catch (error) {
      console.error('Error assessing innovation culture:', error);
      return 0;
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

interface ROIAnalysis {
  investment: InvestmentBreakdown;
  returns: ReturnsBreakdown;
  roi: number;
  paybackPeriod: number;
  intangibleBenefits: string[];
  calculatedAt: Date;
}

interface InvestmentBreakdown {
  timeInvested: number;
  resourceCost: number;
  toolCost: number;
  opportunityCost: number;
  total: number;
}

interface ReturnsBreakdown {
  timeToMarketReduction: number;
  developmentCostSavings: number;
  revenueImpact: number;
  riskMitigation: number;
  innovationValue: number;
  total: number;
}
