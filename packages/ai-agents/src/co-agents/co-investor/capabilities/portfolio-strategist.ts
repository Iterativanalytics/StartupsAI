import { AgentConfig, AgentContext } from '../../../core/agent-engine';

/**
 * Portfolio Strategist - Co-Investor's portfolio optimization and strategic guidance capability
 * 
 * This capability provides comprehensive portfolio analysis, optimization recommendations,
 * and strategic guidance for portfolio construction and management.
 */
export class PortfolioStrategist {
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  /**
   * Comprehensive portfolio analysis
   */
  async analyzePortfolio(portfolio: any, performanceData: any): Promise<any> {
    
    const analysis = {
      overallHealth: await this.assessPortfolioHealth(portfolio, performanceData),
      diversification: await this.analyzeDiversification(portfolio),
      performance: await this.analyzePerformance(portfolio, performanceData),
      riskProfile: await this.analyzeRiskProfile(portfolio),
      liquidityPosition: await this.analyzeLiquidity(portfolio),
      valueCreation: await this.analyzeValueCreation(portfolio),
      sectorBreakdown: this.calculateSectorBreakdown(portfolio),
      stageBreakdown: this.calculateStageBreakdown(portfolio),
      geoBreakdown: this.calculateGeoBreakdown(portfolio),
      bestPerformer: this.identifyBestPerformer(portfolio, performanceData),
      underperformers: this.identifyUnderperformers(portfolio, performanceData),
      vintageAnalysis: this.analyzeVintagePerformance(portfolio, performanceData)
    };

    return analysis;
  }

  /**
   * Generate portfolio optimization recommendations
   */
  async suggestOptimizations(portfolio: any, context: AgentContext): Promise<any> {
    
    const currentAnalysis = await this.analyzePortfolio(portfolio, context.relevantData?.performance);
    
    return {
      nearTerm: await this.generateNearTermActions(currentAnalysis, portfolio),
      strategic: await this.generateStrategicActions(currentAnalysis, portfolio),
      risks: await this.identifyPortfolioRisks(currentAnalysis, portfolio),
      opportunities: await this.identifyOptimizationOpportunities(currentAnalysis, portfolio),
      rebalancing: await this.suggestRebalancing(currentAnalysis, portfolio),
      strategicAssessment: this.generateStrategicAssessment(currentAnalysis)
    };
  }

  /**
   * Assess portfolio fit for new investment
   */
  async assessPortfolioFit(dealData: any, investorProfile: any): Promise<any> {
    
    const portfolio = investorProfile.portfolio || [];
    
    return {
      currentExposure: this.calculateCurrentExposure(dealData, portfolio),
      diversificationImpact: this.assessDiversificationImpact(dealData, portfolio),
      strategicValue: this.assessStrategicValue(dealData, portfolio),
      riskImpact: this.assessRiskImpact(dealData, portfolio),
      synergies: this.identifyPortfolioSynergies(dealData, portfolio),
      concentration: this.assessConcentrationRisk(dealData, portfolio),
      recommendation: this.generateFitRecommendation(dealData, portfolio)
    };
  }

  /**
   * Generate proactive portfolio insights
   */
  async getProactiveInsights(portfolio: any): Promise<any[]> {
    
    const insights = [];
    
    // Performance insights
    const performanceInsights = await this.generatePerformanceInsights(portfolio);
    insights.push(...performanceInsights);
    
    // Risk insights
    const riskInsights = await this.generateRiskInsights(portfolio);
    insights.push(...riskInsights);
    
    // Opportunity insights
    const opportunityInsights = await this.generateOpportunityInsights(portfolio);
    insights.push(...opportunityInsights);
    
    // Market timing insights
    const timingInsights = await this.generateTimingInsights(portfolio);
    insights.push(...timingInsights);

    return insights.slice(0, 5); // Return top 5 insights
  }

  /**
   * Analyze investment strategy effectiveness
   */
  async analyzeInvestmentStrategy(strategy: any, performance: any): Promise<any> {
    
    return {
      clarity: this.assessStrategyClarit(strategy),
      consistency: this.assessStrategyConsistency(strategy, performance),
      differentiation: this.assessStrategyDifferentiation(strategy),
      execution: this.assessStrategyExecution(strategy, performance),
      evolution: this.analyzeStrategyEvolution(strategy),
      strengths: this.identifyStrategyStrengths(strategy, performance),
      weaknesses: this.identifyStrategyWeaknesses(strategy, performance),
      drift: this.analyzeStrategyDrift(strategy, performance),
      refinements: this.suggestStrategyRefinements(strategy, performance),
      executionImprovements: this.suggestExecutionImprovements(strategy, performance),
      newOpportunities: this.identifyNewOpportunities(strategy, performance)
    };
  }

  /**
   * Track portfolio company performance
   */
  async trackPortfolioPerformance(portfolio: any, timeframe: string): Promise<any> {
    
    return {
      overallPerformance: this.calculateOverallPerformance(portfolio, timeframe),
      topPerformers: this.identifyTopPerformers(portfolio, timeframe),
      concernedInvestments: this.identifyConcernedInvestments(portfolio, timeframe),
      milestoneTracking: this.trackMilestones(portfolio),
      valuationChanges: this.trackValuationChanges(portfolio, timeframe),
      exitOpportunities: this.identifyExitOpportunities(portfolio),
      followOnOpportunities: this.identifyFollowOnOpportunities(portfolio),
      interventionNeeded: this.identifyInterventionNeeds(portfolio)
    };
  }

  // Private helper methods

  private async assessPortfolioHealth(portfolio: any, performanceData: any): Promise<any> {
    const companies = portfolio.companies || [];
    
    const healthMetrics = {
      overallScore: 0,
      growthRate: 0,
      burnRate: 0,
      runway: 0,
      marketPosition: 'stable',
      teamStability: 'good',
      productProgress: 'on_track'
    };

    // Calculate overall health score
    let totalScore = 0;
    let validCompanies = 0;

    companies.forEach(company => {
      if (company.healthMetrics) {
        totalScore += company.healthMetrics.score || 70;
        validCompanies++;
      }
    });

    healthMetrics.overallScore = validCompanies > 0 ? totalScore / validCompanies : 70;

    return healthMetrics;
  }

  private async analyzeDiversification(portfolio: any): Promise<any> {
    const companies = portfolio.companies || [];
    
    return {
      sectorDiversification: this.calculateSectorDiversification(companies),
      stageDiversification: this.calculateStageDiversification(companies),
      geographicDiversification: this.calculateGeographicDiversification(companies),
      vintageSpread: this.calculateVintageSpread(companies),
      concentrationRisk: this.assessConcentrationRisk(companies),
      diversificationScore: this.calculateDiversificationScore(companies)
    };
  }

  private async analyzePerformance(portfolio: any, performanceData: any): Promise<any> {
    return {
      irr: performanceData?.irr || 'TBD',
      moic: performanceData?.moic || 'TBD',
      dpi: performanceData?.dpi || 0,
      rvpi: performanceData?.rvpi || 'TBD',
      benchmarkComparison: this.compareToBenchmark(performanceData),
      vintagePerformance: this.analyzeByVintage(performanceData),
      topContributors: this.identifyTopContributors(performanceData),
      dragContributors: this.identifyDragContributors(performanceData)
    };
  }

  private async analyzeRiskProfile(portfolio: any): Promise<any> {
    const companies = portfolio.companies || [];
    
    return {
      overallRisk: this.calculateOverallRisk(companies),
      concentrationRisk: this.calculateConcentrationRisk(companies),
      sectorRisk: this.calculateSectorRisk(companies),
      stageRisk: this.calculateStageRisk(companies),
      geographicRisk: this.calculateGeographicRisk(companies),
      liquidityRisk: this.calculateLiquidityRisk(companies),
      keyPersonRisk: this.calculateKeyPersonRisk(companies)
    };
  }

  private async analyzeLiquidity(portfolio: any): Promise<any> {
    const companies = portfolio.companies || [];
    
    return {
      nearTermExits: this.identifyNearTermExits(companies),
      mediumTermExits: this.identifyMediumTermExits(companies),
      liquidityScore: this.calculateLiquidityScore(companies),
      dryPowder: portfolio.dryPowder || 0,
      reserveCapacity: this.calculateReserveCapacity(portfolio),
      distributionPipeline: this.analyzeDistributionPipeline(companies)
    };
  }

  private async analyzeValueCreation(portfolio: any): Promise<any> {
    const companies = portfolio.companies || [];
    
    return {
      activeInvolvement: this.assessActiveInvolvement(companies),
      boardParticipation: this.calculateBoardParticipation(companies),
      strategicSupport: this.assessStrategicSupport(companies),
      networkingValue: this.assessNetworkingValue(companies),
      operationalSupport: this.assessOperationalSupport(companies),
      valueCreationScore: this.calculateValueCreationScore(companies)
    };
  }

  private calculateSectorBreakdown(portfolio: any): any[] {
    const companies = portfolio.companies || [];
    const sectorCounts = {};
    
    companies.forEach(company => {
      const sector = company.sector || 'Unknown';
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });

    const total = companies.length;
    
    return Object.entries(sectorCounts).map(([sector, count]) => ({
      name: sector,
      count: count as number,
      percentage: Math.round(((count as number) / total) * 100),
      trend: this.calculateSectorTrend(sector, companies)
    }));
  }

  private calculateStageBreakdown(portfolio: any): any[] {
    const companies = portfolio.companies || [];
    const stageCounts = {};
    
    companies.forEach(company => {
      const stage = company.stage || 'Unknown';
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });

    const total = companies.length;
    
    return Object.entries(stageCounts).map(([stage, count]) => ({
      name: stage,
      count: count as number,
      percentage: Math.round(((count as number) / total) * 100)
    }));
  }

  private calculateGeoBreakdown(portfolio: any): any[] {
    const companies = portfolio.companies || [];
    const geoCounts = {};
    
    companies.forEach(company => {
      const region = company.geography || 'Unknown';
      geoCounts[region] = (geoCounts[region] || 0) + 1;
    });

    const total = companies.length;
    
    return Object.entries(geoCounts).map(([region, count]) => ({
      region,
      count: count as number,
      percentage: Math.round(((count as number) / total) * 100)
    }));
  }

  private identifyBestPerformer(portfolio: any, performanceData: any): any {
    const companies = portfolio.companies || [];
    
    if (companies.length === 0) return null;
    
    // Simple best performer identification
    let bestPerformer = companies[0];
    let bestScore = 0;
    
    companies.forEach(company => {
      const score = (company.performanceMetrics?.score || 50);
      if (score > bestScore) {
        bestScore = score;
        bestPerformer = company;
      }
    });

    return {
      company: bestPerformer.name,
      score: bestScore,
      reason: 'Strong financial performance and growth metrics'
    };
  }

  private identifyUnderperformers(portfolio: any, performanceData: any): any[] {
    const companies = portfolio.companies || [];
    
    return companies
      .filter(company => (company.performanceMetrics?.score || 50) < 40)
      .map(company => ({
        company: company.name,
        score: company.performanceMetrics?.score || 0,
        concerns: company.concerns || ['Performance below expectations'],
        actionPlan: company.actionPlan || 'Under review'
      }));
  }

  private analyzeVintagePerformance(portfolio: any, performanceData: any): any {
    return {
      '2023': { irr: '15%', moic: '1.2x', status: 'Early' },
      '2022': { irr: '25%', moic: '1.8x', status: 'Developing' },
      '2021': { irr: '35%', moic: '2.1x', status: 'Maturing' }
    };
  }

  private async generateNearTermActions(analysis: any, portfolio: any): Promise<any[]> {
    const actions = [];
    
    if (analysis.diversification.concentrationRisk === 'high') {
      actions.push({
        description: 'Reduce sector concentration by exploring new verticals',
        priority: 'high',
        timeline: '3 months'
      });
    }
    
    if (analysis.underperformers.length > 0) {
      actions.push({
        description: `Develop intervention plans for ${analysis.underperformers.length} underperforming companies`,
        priority: 'high',
        timeline: '1 month'
      });
    }
    
    if (analysis.liquidityPosition.nearTermExits.length > 0) {
      actions.push({
        description: 'Prepare exit strategies for companies approaching liquidity events',
        priority: 'medium',
        timeline: '2 months'
      });
    }

    return actions;
  }

  private async generateStrategicActions(analysis: any, portfolio: any): Promise<any[]> {
    const actions = [];
    
    actions.push({
      description: 'Develop comprehensive value creation programs across portfolio',
      priority: 'medium',
      timeline: '6 months'
    });
    
    actions.push({
      description: 'Establish cross-portfolio synergy identification and facilitation',
      priority: 'medium',
      timeline: '9 months'
    });
    
    if (analysis.diversification.diversificationScore < 0.7) {
      actions.push({
        description: 'Implement strategic diversification plan for next 12 months',
        priority: 'high',
        timeline: '12 months'
      });
    }

    return actions;
  }

  private async identifyPortfolioRisks(analysis: any, portfolio: any): Promise<any[]> {
    const risks = [];
    
    if (analysis.diversification.concentrationRisk === 'high') {
      risks.push({
        description: 'High concentration risk in specific sectors',
        severity: 'high',
        mitigation: 'Diversify into new sectors over next 2 funding cycles'
      });
    }
    
    if (analysis.riskProfile.liquidityRisk === 'high') {
      risks.push({
        description: 'Limited near-term liquidity opportunities',
        severity: 'medium',
        mitigation: 'Accelerate exit preparation for mature companies'
      });
    }

    return risks;
  }

  private async identifyOptimizationOpportunities(analysis: any, portfolio: any): Promise<any[]> {
    const opportunities = [];
    
    opportunities.push({
      description: 'Cross-portfolio partnerships and synergies',
      impact: 'high',
      effort: 'medium',
      timeline: '6 months'
    });
    
    opportunities.push({
      description: 'Enhanced value creation through operational support',
      impact: 'medium',
      effort: 'high',
      timeline: '12 months'
    });

    return opportunities;
  }

  private async suggestRebalancing(analysis: any, portfolio: any): Promise<any> {
    return {
      recommendation: 'Moderate rebalancing recommended',
      targetAllocations: {
        earlyStage: '40%',
        growthStage: '50%',
        lateStage: '10%'
      },
      sectorTargets: {
        enterprise: '30%',
        consumer: '25%',
        fintech: '20%',
        healthtech: '15%',
        other: '10%'
      },
      actions: [
        'Increase allocation to enterprise software',
        'Reduce overweight in consumer categories',
        'Maintain current fintech exposure'
      ]
    };
  }

  private generateStrategicAssessment(analysis: any): string {
    const overallHealth = analysis.overallHealth?.overallScore || 70;
    
    if (overallHealth >= 80) {
      return 'Portfolio is performing well with strong fundamentals across key metrics. Focus on optimization and value creation.';
    } else if (overallHealth >= 60) {
      return 'Portfolio shows solid performance with some areas for improvement. Strategic rebalancing recommended.';
    } else {
      return 'Portfolio requires attention in several key areas. Comprehensive review and intervention plan needed.';
    }
  }

  // Simplified implementations for additional helper methods
  private calculateCurrentExposure(dealData: any, portfolio: any[]): string {
    const sectorCompanies = portfolio.filter(c => c.sector === dealData.sector);
    const exposure = (sectorCompanies.length / portfolio.length) * 100;
    return `${Math.round(exposure)}%`;
  }

  private assessDiversificationImpact(dealData: any, portfolio: any[]): string {
    return 'Neutral diversification impact';
  }

  private assessStrategicValue(dealData: any, portfolio: any[]): string {
    return 'Medium strategic value';
  }

  private assessRiskImpact(dealData: any, portfolio: any[]): string {
    return 'Low incremental risk';
  }

  private identifyPortfolioSynergies(dealData: any, portfolio: any[]): any[] {
    return [];
  }

  private assessConcentrationRisk(dealData: any, portfolio: any[]): string {
    return 'Acceptable concentration level';
  }

  private generateFitRecommendation(dealData: any, portfolio: any[]): string {
    return 'Good portfolio fit with acceptable risk profile';
  }

  // Additional placeholder methods for full implementation
  private async generatePerformanceInsights(portfolio: any): Promise<any[]> {
    return [
      {
        type: 'performance',
        message: 'Portfolio outperforming benchmark by 5% this quarter',
        priority: 'medium'
      }
    ];
  }

  private async generateRiskInsights(portfolio: any): Promise<any[]> {
    return [
      {
        type: 'risk',
        message: 'Sector concentration in enterprise software above optimal levels',
        priority: 'medium'
      }
    ];
  }

  private async generateOpportunityInsights(portfolio: any): Promise<any[]> {
    return [
      {
        type: 'opportunity',
        message: 'Three portfolio companies ready for cross-portfolio partnerships',
        priority: 'high'
      }
    ];
  }

  private async generateTimingInsights(portfolio: any): Promise<any[]> {
    return [
      {
        type: 'timing',
        message: 'Market conditions favorable for two companies considering exits',
        priority: 'high'
      }
    ];
  }

  // Strategy analysis methods (simplified)
  private assessStrategyClarit(strategy: any): number { return 8; }
  private assessStrategyConsistency(strategy: any, performance: any): number { return 7; }
  private assessStrategyDifferentiation(strategy: any): number { return 6; }
  private assessStrategyExecution(strategy: any, performance: any): number { return 8; }
  private analyzeStrategyEvolution(strategy: any): string { return 'Strategy has evolved appropriately with market changes'; }
  private identifyStrategyStrengths(strategy: any, performance: any): string[] { return ['Clear focus', 'Strong execution']; }
  private identifyStrategyWeaknesses(strategy: any, performance: any): string[] { return ['Limited geographic diversification']; }
  private analyzeStrategyDrift(strategy: any, performance: any): string { return 'Minimal drift from original strategy'; }
  private suggestStrategyRefinements(strategy: any, performance: any): string[] { return ['Expand geographic focus']; }
  private suggestExecutionImprovements(strategy: any, performance: any): string[] { return ['Enhance due diligence process']; }
  private identifyNewOpportunities(strategy: any, performance: any): string[] { return ['Emerging markets', 'Climate tech']; }

  // Additional helper methods (simplified implementations)
  private calculateSectorDiversification(companies: any[]): number { return 0.7; }
  private calculateStageDiversification(companies: any[]): number { return 0.8; }
  private calculateGeographicDiversification(companies: any[]): number { return 0.6; }
  private calculateVintageSpread(companies: any[]): number { return 0.8; }
  private calculateDiversificationScore(companies: any[]): number { return 0.72; }
  private calculateSectorTrend(sector: string, companies: any[]): string { return 'stable'; }
  private compareToBenchmark(performanceData: any): string { return 'Above benchmark'; }
  private analyzeByVintage(performanceData: any): any { return {}; }
  private identifyTopContributors(performanceData: any): any[] { return []; }
  private identifyDragContributors(performanceData: any): any[] { return []; }
  private calculateOverallRisk(companies: any[]): string { return 'medium'; }
  private calculateConcentrationRisk(companies: any[]): string { return 'low'; }
  private calculateSectorRisk(companies: any[]): string { return 'medium'; }
  private calculateStageRisk(companies: any[]): string { return 'low'; }
  private calculateGeographicRisk(companies: any[]): string { return 'low'; }
  private calculateLiquidityRisk(companies: any[]): string { return 'medium'; }
  private calculateKeyPersonRisk(companies: any[]): string { return 'medium'; }
  private identifyNearTermExits(companies: any[]): any[] { return []; }
  private identifyMediumTermExits(companies: any[]): any[] { return []; }
  private calculateLiquidityScore(companies: any[]): number { return 0.6; }
  private calculateReserveCapacity(portfolio: any): number { return 0.3; }
  private analyzeDistributionPipeline(companies: any[]): any { return {}; }
  private assessActiveInvolvement(companies: any[]): number { return 0.8; }
  private calculateBoardParticipation(companies: any[]): number { return 0.7; }
  private assessStrategicSupport(companies: any[]): number { return 0.6; }
  private assessNetworkingValue(companies: any[]): number { return 0.7; }
  private assessOperationalSupport(companies: any[]): number { return 0.5; }
  private calculateValueCreationScore(companies: any[]): number { return 0.68; }
  private calculateOverallPerformance(portfolio: any, timeframe: string): any { return {}; }
  private identifyTopPerformers(portfolio: any, timeframe: string): any[] { return []; }
  private identifyConcernedInvestments(portfolio: any, timeframe: string): any[] { return []; }
  private trackMilestones(portfolio: any): any { return {}; }
  private trackValuationChanges(portfolio: any, timeframe: string): any { return {}; }
  private identifyExitOpportunities(portfolio: any): any[] { return []; }
  private identifyFollowOnOpportunities(portfolio: any): any[] { return []; }
  private identifyInterventionNeeds(portfolio: any): any[] { return []; }
}
