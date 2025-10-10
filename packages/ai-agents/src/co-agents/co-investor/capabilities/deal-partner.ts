import { AgentConfig, AgentContext } from '../../../core/agent-engine';

/**
 * Deal Partner - Co-Investor's deal evaluation and partnership capability
 * 
 * This capability provides sophisticated deal analysis, strategic evaluation,
 * and investment partnership guidance for investors.
 */
export class DealPartner {
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  /**
   * Comprehensive deal analysis from a strategic partnership perspective
   */
  async analyzeDeal(dealData: any, investorProfile: any, context: AgentContext): Promise<any> {
    
    const analysis = {
      strategicFit: await this.assessStrategicFit(dealData, investorProfile),
      thesisAlignment: await this.assessThesisAlignment(dealData, investorProfile),
      portfolioSynergies: await this.identifyPortfolioSynergies(dealData, investorProfile),
      riskProfile: await this.assessDealRisk(dealData),
      valuationAssessment: await this.assessValuation(dealData),
      teamEvaluation: await this.evaluateTeam(dealData),
      marketAnalysis: await this.analyzeMarket(dealData),
      competitivePosition: await this.assessCompetitivePosition(dealData),
      recommendation: '',
      nextSteps: []
    };

    // Generate overall recommendation
    analysis.recommendation = this.generateRecommendation(analysis);
    analysis.nextSteps = this.generateNextSteps(analysis, dealData);

    return analysis;
  }

  /**
   * Quick deal screening for initial evaluation
   */
  async quickDealScreen(dealData: any, investorProfile: any): Promise<any> {
    
    const screeningResult = {
      passesInitialScreen: false,
      score: 0,
      redFlags: [],
      greenFlags: [],
      priority: 'low',
      recommendedAction: '',
      reasoning: ''
    };

    // Stage alignment check
    const stageAlignment = this.checkStageAlignment(dealData, investorProfile);
    screeningResult.score += stageAlignment.score;
    
    if (!stageAlignment.passes) {
      screeningResult.redFlags.push(stageAlignment.reason);
    } else {
      screeningResult.greenFlags.push(stageAlignment.reason);
    }

    // Sector alignment check
    const sectorAlignment = this.checkSectorAlignment(dealData, investorProfile);
    screeningResult.score += sectorAlignment.score;
    
    if (!sectorAlignment.passes) {
      screeningResult.redFlags.push(sectorAlignment.reason);
    } else {
      screeningResult.greenFlags.push(sectorAlignment.reason);
    }

    // Check size alignment
    const checkSizeAlignment = this.checkCheckSizeAlignment(dealData, investorProfile);
    screeningResult.score += checkSizeAlignment.score;
    
    if (!checkSizeAlignment.passes) {
      screeningResult.redFlags.push(checkSizeAlignment.reason);
    } else {
      screeningResult.greenFlags.push(checkSizeAlignment.reason);
    }

    // Geography check
    const geoAlignment = this.checkGeographyAlignment(dealData, investorProfile);
    screeningResult.score += geoAlignment.score;
    
    if (!geoAlignment.passes) {
      screeningResult.redFlags.push(geoAlignment.reason);
    } else {
      screeningResult.greenFlags.push(geoAlignment.reason);
    }

    // Determine if passes screening
    screeningResult.passesInitialScreen = screeningResult.score >= 60 && screeningResult.redFlags.length <= 1;
    
    // Set priority
    if (screeningResult.score >= 80) {
      screeningResult.priority = 'high';
    } else if (screeningResult.score >= 65) {
      screeningResult.priority = 'medium';
    }

    // Generate recommendation
    screeningResult.recommendedAction = this.generateScreeningAction(screeningResult);
    screeningResult.reasoning = this.generateScreeningReasoning(screeningResult);

    return screeningResult;
  }

  /**
   * Generate investment committee materials
   */
  async generateICMaterials(dealData: any, analysis: any): Promise<any> {
    
    return {
      executiveSummary: this.generateExecutiveSummary(dealData, analysis),
      investmentThesis: this.generateInvestmentThesis(dealData, analysis),
      riskAnalysis: this.generateRiskAnalysis(dealData, analysis),
      financialProjections: this.generateFinancialProjections(dealData),
      competitiveAnalysis: this.generateCompetitiveAnalysis(dealData),
      teamAssessment: this.generateTeamAssessment(dealData),
      referenceQuestions: this.generateReferenceQuestions(dealData),
      termSheetGuidance: this.generateTermSheetGuidance(dealData, analysis),
      votingRecommendation: this.generateVotingRecommendation(analysis)
    };
  }

  /**
   * Track deal progress and provide updates
   */
  async trackDealProgress(dealId: string, milestones: any[]): Promise<any> {
    
    return {
      currentStage: this.identifyCurrentStage(milestones),
      completedMilestones: milestones.filter(m => m.completed),
      upcomingMilestones: milestones.filter(m => !m.completed),
      risksIdentified: this.identifyProgressRisks(milestones),
      recommendedActions: this.recommendProgressActions(milestones),
      timeline: this.generateTimeline(milestones)
    };
  }

  // Private helper methods

  private async assessStrategicFit(dealData: any, investorProfile: any): Promise<number> {
    let fitScore = 0;

    // Stage fit (0-30 points)
    const stageFit = this.calculateStageFit(dealData.stage, investorProfile.targetStages);
    fitScore += stageFit;

    // Sector fit (0-25 points)
    const sectorFit = this.calculateSectorFit(dealData.sector, investorProfile.targetSectors);
    fitScore += sectorFit;

    // Business model fit (0-25 points)
    const modelFit = this.calculateBusinessModelFit(dealData.businessModel, investorProfile.preferredModels);
    fitScore += modelFit;

    // Geographic fit (0-20 points)
    const geoFit = this.calculateGeographicFit(dealData.geography, investorProfile.targetGeographies);
    fitScore += geoFit;

    return fitScore / 100; // Normalize to 0-1
  }

  private async assessThesisAlignment(dealData: any, investorProfile: any): Promise<number> {
    const investmentThesis = investorProfile.investmentThesis || {};
    let alignmentScore = 0;

    // Theme alignment
    const themes = investmentThesis.themes || [];
    const themeAlignment = themes.reduce((score, theme) => {
      if (this.dealAlignsWith(dealData, theme)) {
        return score + 0.3;
      }
      return score;
    }, 0);

    alignmentScore += Math.min(themeAlignment, 1.0);

    return alignmentScore;
  }

  private async identifyPortfolioSynergies(dealData: any, investorProfile: any): Promise<any> {
    const portfolio = investorProfile.portfolio || [];
    const synergies = [];

    portfolio.forEach(company => {
      if (this.hasSynergy(dealData, company)) {
        synergies.push({
          company: company.name,
          synergyType: this.identifySynergyType(dealData, company),
          potential: this.assessSynergyPotential(dealData, company),
          actionItems: this.generateSynergyActions(dealData, company)
        });
      }
    });

    return {
      synergies,
      overallSynergyScore: this.calculateOverallSynergyScore(synergies),
      strategicValue: this.assessStrategicValue(synergies)
    };
  }

  private async assessDealRisk(dealData: any): Promise<any> {
    return {
      marketRisk: this.assessMarketRisk(dealData),
      teamRisk: this.assessTeamRisk(dealData),
      executionRisk: this.assessExecutionRisk(dealData),
      competitiveRisk: this.assessCompetitiveRisk(dealData),
      financialRisk: this.assessFinancialRisk(dealData),
      overallRisk: 'medium' // Would calculate based on above
    };
  }

  private async assessValuation(dealData: any): Promise<any> {
    return {
      currentValuation: dealData.valuation || 0,
      marketComparables: this.getMarketComparables(dealData),
      valuationMultiples: this.calculateValuationMultiples(dealData),
      fairValueRange: this.calculateFairValueRange(dealData),
      premiumDiscount: this.calculatePremiumDiscount(dealData),
      justification: this.generateValuationJustification(dealData)
    };
  }

  private async evaluateTeam(dealData: any): Promise<any> {
    const team = dealData.team || [];
    
    return {
      founderMarketFit: this.assessFounderMarketFit(team, dealData),
      experienceScore: this.calculateExperienceScore(team),
      teamCompleteness: this.assessTeamCompleteness(team, dealData),
      leadershipQuality: this.assessLeadershipQuality(team),
      culturalFit: this.assessCulturalFit(team),
      keyPersonRisk: this.assessKeyPersonRisk(team),
      recommendations: this.generateTeamRecommendations(team, dealData)
    };
  }

  private async analyzeMarket(dealData: any): Promise<any> {
    return {
      marketSize: this.assessMarketSize(dealData),
      growthRate: this.assessGrowthRate(dealData),
      marketTiming: this.assessMarketTiming(dealData),
      regulatoryEnvironment: this.assessRegulatoryEnvironment(dealData),
      customerValidation: this.assessCustomerValidation(dealData),
      marketRisks: this.identifyMarketRisks(dealData)
    };
  }

  private async assessCompetitivePosition(dealData: any): Promise<any> {
    return {
      competitiveLandscape: this.mapCompetitiveLandscape(dealData),
      differentiationStrength: this.assessDifferentiation(dealData),
      competitiveAdvantages: this.identifyCompetitiveAdvantages(dealData),
      threats: this.identifyCompetitiveThreats(dealData),
      strategicMoats: this.identifyStrategicMoats(dealData)
    };
  }

  private generateRecommendation(analysis: any): string {
    const score = this.calculateOverallScore(analysis);
    
    if (score >= 0.8) {
      return "Strong investment opportunity - recommend proceeding to detailed due diligence";
    } else if (score >= 0.6) {
      return "Interesting opportunity with some concerns - conditional proceed";
    } else if (score >= 0.4) {
      return "Mixed signals - requires deeper investigation before decision";
    } else {
      return "Below investment threshold - recommend passing";
    }
  }

  private generateNextSteps(analysis: any, dealData: any): string[] {
    const steps = [];
    const score = this.calculateOverallScore(analysis);

    if (score >= 0.6) {
      steps.push("Conduct management presentation");
      steps.push("Complete customer reference calls");
      steps.push("Financial model deep dive");
      
      if (analysis.teamEvaluation.teamCompleteness < 0.7) {
        steps.push("Address team completeness gaps");
      }
      
      if (analysis.riskProfile.overallRisk === 'high') {
        steps.push("Develop risk mitigation plan");
      }
    } else {
      steps.push("Address key concerns before proceeding");
      steps.push("Gather additional market validation");
    }

    return steps;
  }

  // Simplified implementations for helper methods
  private checkStageAlignment(dealData: any, investorProfile: any): any {
    const targetStages = investorProfile.targetStages || ['series_a', 'series_b'];
    const dealStage = dealData.stage;
    
    return {
      passes: targetStages.includes(dealStage),
      score: targetStages.includes(dealStage) ? 25 : 0,
      reason: targetStages.includes(dealStage) ? 
        `Stage ${dealStage} aligns with investment criteria` :
        `Stage ${dealStage} outside target stages`
    };
  }

  private checkSectorAlignment(dealData: any, investorProfile: any): any {
    const targetSectors = investorProfile.targetSectors || [];
    const dealSector = dealData.sector;
    
    return {
      passes: targetSectors.includes(dealSector) || targetSectors.length === 0,
      score: targetSectors.includes(dealSector) ? 25 : 10,
      reason: targetSectors.includes(dealSector) ? 
        `Sector ${dealSector} is in target portfolio` :
        `Sector ${dealSector} outside core focus`
    };
  }

  private checkCheckSizeAlignment(dealData: any, investorProfile: any): any {
    const minCheck = investorProfile.minCheckSize || 0;
    const maxCheck = investorProfile.maxCheckSize || Infinity;
    const requiredCheck = dealData.minimumInvestment || 0;
    
    return {
      passes: requiredCheck >= minCheck && requiredCheck <= maxCheck,
      score: (requiredCheck >= minCheck && requiredCheck <= maxCheck) ? 25 : 5,
      reason: (requiredCheck >= minCheck && requiredCheck <= maxCheck) ? 
        'Check size within investment range' :
        'Check size outside comfortable range'
    };
  }

  private checkGeographyAlignment(dealData: any, investorProfile: any): any {
    const targetGeos = investorProfile.targetGeographies || ['north_america'];
    const dealGeo = dealData.geography;
    
    return {
      passes: targetGeos.includes(dealGeo),
      score: targetGeos.includes(dealGeo) ? 15 : 5,
      reason: targetGeos.includes(dealGeo) ? 
        'Geographic focus aligns' :
        'Outside core geographic focus'
    };
  }

  private generateScreeningAction(result: any): string {
    if (result.passesInitialScreen) {
      return result.priority === 'high' ? 
        'Fast track to detailed evaluation' :
        'Proceed to standard due diligence';
    } else {
      return result.redFlags.length > 2 ? 
        'Pass - multiple misalignments' :
        'Hold - monitor for changes';
    }
  }

  private generateScreeningReasoning(result: any): string {
    return `Score: ${result.score}/100. ${result.greenFlags.length} positive factors, ${result.redFlags.length} concerns.`;
  }

  // Additional helper methods with simplified implementations
  private calculateStageFit(stage: string, targetStages: string[]): number {
    return targetStages.includes(stage) ? 30 : 0;
  }

  private calculateSectorFit(sector: string, targetSectors: string[]): number {
    return targetSectors.includes(sector) ? 25 : 10;
  }

  private calculateBusinessModelFit(model: string, preferredModels: string[]): number {
    return preferredModels.includes(model) ? 25 : 15;
  }

  private calculateGeographicFit(geo: string, targetGeos: string[]): number {
    return targetGeos.includes(geo) ? 20 : 5;
  }

  private dealAlignsWith(dealData: any, theme: any): boolean {
    // Simplified theme alignment check
    return dealData.sector === theme.sector || dealData.keywords?.some(k => theme.keywords?.includes(k));
  }

  private hasSynergy(dealData: any, portfolioCompany: any): boolean {
    return dealData.sector === portfolioCompany.sector || 
           dealData.customerBase === portfolioCompany.customerBase;
  }

  private identifySynergyType(dealData: any, portfolioCompany: any): string {
    if (dealData.sector === portfolioCompany.sector) return 'sector_synergy';
    if (dealData.customerBase === portfolioCompany.customerBase) return 'customer_synergy';
    return 'strategic_synergy';
  }

  private assessSynergyPotential(dealData: any, portfolioCompany: any): string {
    return 'medium'; // Simplified
  }

  private generateSynergyActions(dealData: any, portfolioCompany: any): string[] {
    return ['Facilitate introductions', 'Explore partnership opportunities'];
  }

  private calculateOverallSynergyScore(synergies: any[]): number {
    return synergies.length * 0.1; // Simplified
  }

  private assessStrategicValue(synergies: any[]): string {
    return synergies.length > 2 ? 'high' : synergies.length > 0 ? 'medium' : 'low';
  }

  private calculateOverallScore(analysis: any): number {
    // Weighted average of key factors
    return (
      analysis.strategicFit * 0.25 +
      analysis.thesisAlignment * 0.20 +
      (analysis.teamEvaluation?.experienceScore || 0.5) * 0.20 +
      (analysis.marketAnalysis?.marketTiming || 0.5) * 0.15 +
      (1 - this.riskToScore(analysis.riskProfile?.overallRisk)) * 0.20
    );
  }

  private riskToScore(risk: string): number {
    const riskMap = { low: 0.1, medium: 0.3, high: 0.7 };
    return riskMap[risk] || 0.3;
  }

  // Placeholder methods for comprehensive implementation
  private assessMarketRisk(dealData: any): string { return 'medium'; }
  private assessTeamRisk(dealData: any): string { return 'low'; }
  private assessExecutionRisk(dealData: any): string { return 'medium'; }
  private assessCompetitiveRisk(dealData: any): string { return 'medium'; }
  private assessFinancialRisk(dealData: any): string { return 'low'; }
  
  private getMarketComparables(dealData: any): any[] { return []; }
  private calculateValuationMultiples(dealData: any): any { return {}; }
  private calculateFairValueRange(dealData: any): any { return {}; }
  private calculatePremiumDiscount(dealData: any): number { return 0; }
  private generateValuationJustification(dealData: any): string { return 'Valuation appears reasonable'; }
  
  private assessFounderMarketFit(team: any[], dealData: any): number { return 0.7; }
  private calculateExperienceScore(team: any[]): number { return 0.6; }
  private assessTeamCompleteness(team: any[], dealData: any): number { return 0.8; }
  private assessLeadershipQuality(team: any[]): number { return 0.7; }
  private assessCulturalFit(team: any[]): number { return 0.6; }
  private assessKeyPersonRisk(team: any[]): string { return 'medium'; }
  private generateTeamRecommendations(team: any[], dealData: any): string[] { return []; }
  
  private assessMarketSize(dealData: any): any { return {}; }
  private assessGrowthRate(dealData: any): number { return 0.2; }
  private assessMarketTiming(dealData: any): number { return 0.7; }
  private assessRegulatoryEnvironment(dealData: any): any { return {}; }
  private assessCustomerValidation(dealData: any): any { return {}; }
  private identifyMarketRisks(dealData: any): any[] { return []; }
  
  private mapCompetitiveLandscape(dealData: any): any { return {}; }
  private assessDifferentiation(dealData: any): number { return 0.6; }
  private identifyCompetitiveAdvantages(dealData: any): string[] { return []; }
  private identifyCompetitiveThreats(dealData: any): string[] { return []; }
  private identifyStrategicMoats(dealData: any): string[] { return []; }

  // IC Materials generators (simplified)
  private generateExecutiveSummary(dealData: any, analysis: any): string {
    return `Executive summary for ${dealData.companyName || 'Investment Opportunity'}`;
  }

  private generateInvestmentThesis(dealData: any, analysis: any): string {
    return `Investment thesis based on strategic fit and market opportunity`;
  }

  private generateRiskAnalysis(dealData: any, analysis: any): string {
    return `Risk analysis covering market, team, and execution risks`;
  }

  private generateFinancialProjections(dealData: any): any {
    return { projections: 'Financial projections and models' };
  }

  private generateCompetitiveAnalysis(dealData: any): string {
    return `Competitive landscape analysis`;
  }

  private generateTeamAssessment(dealData: any): string {
    return `Team assessment and recommendations`;
  }

  private generateReferenceQuestions(dealData: any): string[] {
    return ['Customer satisfaction', 'Product effectiveness', 'Team execution'];
  }

  private generateTermSheetGuidance(dealData: any, analysis: any): any {
    return { terms: 'Term sheet recommendations' };
  }

  private generateVotingRecommendation(analysis: any): string {
    const score = this.calculateOverallScore(analysis);
    return score >= 0.7 ? 'Recommend Yes' : score >= 0.5 ? 'Conditional Yes' : 'Recommend No';
  }

  private identifyCurrentStage(milestones: any[]): string {
    return 'due_diligence'; // Simplified
  }

  private identifyProgressRisks(milestones: any[]): any[] {
    return []; // Simplified
  }

  private recommendProgressActions(milestones: any[]): string[] {
    return ['Continue due diligence', 'Schedule management presentation'];
  }

  private generateTimeline(milestones: any[]): any {
    return { estimatedClose: '4-6 weeks' };
  }
}
