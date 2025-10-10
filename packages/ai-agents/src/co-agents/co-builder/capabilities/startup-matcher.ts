import { AgentConfig, AgentContext } from '../../../core/agent-engine';

/**
 * Startup Matcher - Co-Builder's startup evaluation and matching capability
 */
export class StartupMatcher {
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  async evaluateStartup(startupData: any, programCriteria: any): Promise<any> {
    return {
      overallScore: this.calculateOverallScore(startupData, programCriteria),
      startupQuality: this.assessStartupQuality(startupData),
      marketOpportunity: this.assessMarketOpportunity(startupData),
      teamStrength: this.assessTeamStrength(startupData),
      productMarketFit: this.assessProductMarketFit(startupData),
      tractionMetrics: this.assessTractionMetrics(startupData),
      valueCreation: this.assessValueCreation(startupData, programCriteria),
      mentorshipNeeds: this.assessMentorshipNeeds(startupData),
      networkRequirements: this.assessNetworkRequirements(startupData),
      resourceUtilization: this.assessResourceUtilization(startupData),
      growthPotential: this.assessGrowthPotential(startupData),
      programImpact: this.assessProgramImpact(startupData, programCriteria),
      cohortDiversity: this.assessCohortDiversity(startupData, programCriteria),
      successProbability: this.assessSuccessProbability(startupData),
      alumniPotential: this.assessAlumniPotential(startupData),
      brandValue: this.assessBrandValue(startupData),
      strengths: this.identifyStrengths(startupData),
      concerns: this.identifyConcerns(startupData),
      recommendation: this.generateRecommendation(startupData, programCriteria),
      nextSteps: this.generateNextSteps(startupData, programCriteria)
    };
  }

  async analyzeFit(startupData: any, programCriteria: any): Promise<any> {
    return {
      programAlignment: this.calculateProgramAlignment(startupData, programCriteria),
      stageFit: this.assessStageFit(startupData, programCriteria),
      sectorAlignment: this.assessSectorAlignment(startupData, programCriteria),
      geographicFit: this.assessGeographicFit(startupData, programCriteria),
      timelineAlignment: this.assessTimelineAlignment(startupData, programCriteria)
    };
  }

  async matchStartupsToProgram(startups: any[], programCriteria: any): Promise<any> {
    const matches = startups.map(startup => ({
      startup,
      fitScore: this.calculateOverallScore(startup, programCriteria),
      alignment: this.calculateProgramAlignment(startup, programCriteria),
      recommendation: this.generateMatchRecommendation(startup, programCriteria)
    }));

    return {
      matches: matches.sort((a, b) => b.fitScore - a.fitScore),
      topMatches: matches.filter(m => m.fitScore > 0.7),
      goodMatches: matches.filter(m => m.fitScore > 0.5 && m.fitScore <= 0.7),
      poorMatches: matches.filter(m => m.fitScore <= 0.5)
    };
  }

  async generateMatchingInsights(startups: any[], programCriteria: any): Promise<any> {
    return {
      overallFit: this.calculateOverallFit(startups, programCriteria),
      commonStrengths: this.identifyCommonStrengths(startups),
      commonConcerns: this.identifyCommonConcerns(startups),
      diversityAnalysis: this.analyzeDiversity(startups),
      recommendations: this.generateMatchingRecommendations(startups, programCriteria)
    };
  }

  // Private helper methods

  private calculateOverallScore(startupData: any, programCriteria: any): number {
    const weights = {
      startupQuality: 0.25,
      marketOpportunity: 0.20,
      teamStrength: 0.20,
      programFit: 0.15,
      growthPotential: 0.10,
      diversity: 0.10
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([factor, weight]) => {
      const score = this.getFactorScore(factor, startupData, programCriteria);
      totalScore += score * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0.5;
  }

  private getFactorScore(factor: string, startupData: any, programCriteria: any): number {
    switch (factor) {
      case 'startupQuality':
        return this.assessStartupQuality(startupData);
      case 'marketOpportunity':
        return this.assessMarketOpportunity(startupData);
      case 'teamStrength':
        return this.assessTeamStrength(startupData);
      case 'programFit':
        return this.calculateProgramAlignment(startupData, programCriteria);
      case 'growthPotential':
        return this.assessGrowthPotential(startupData);
      case 'diversity':
        return this.assessDiversityValue(startupData, programCriteria);
      default:
        return 0.5;
    }
  }

  private assessStartupQuality(startupData: any): number {
    const factors = [
      startupData.productQuality || 0.7,
      startupData.businessModel || 0.6,
      startupData.technology || 0.8,
      startupData.innovation || 0.7
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  }

  private assessMarketOpportunity(startupData: any): number {
    const factors = [
      startupData.marketSize || 0.6,
      startupData.marketGrowth || 0.7,
      startupData.competitivePosition || 0.5,
      startupData.customerValidation || 0.6
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  }

  private assessTeamStrength(startupData: any): number {
    const team = startupData.team || {};
    const factors = [
      team.experience || 0.7,
      team.completeness || 0.6,
      team.cohesion || 0.8,
      team.leadership || 0.7
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  }

  private assessProductMarketFit(startupData: any): number {
    return startupData.productMarketFit || 0.6;
  }

  private assessTractionMetrics(startupData: any): number {
    const metrics = startupData.traction || {};
    const factors = [
      metrics.revenue || 0.5,
      metrics.users || 0.6,
      metrics.growth || 0.7,
      metrics.retention || 0.6
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  }

  private assessValueCreation(startupData: any, programCriteria: any): number {
    const valueFactors = [
      startupData.mentorshipNeeds || 0.7,
      startupData.networkValue || 0.6,
      startupData.resourceUtilization || 0.5,
      startupData.growthPotential || 0.8
    ];
    
    return valueFactors.reduce((sum, factor) => sum + factor, 0) / valueFactors.length;
  }

  private assessMentorshipNeeds(startupData: any): number {
    return startupData.mentorshipNeeds || 0.7;
  }

  private assessNetworkRequirements(startupData: any): number {
    return startupData.networkRequirements || 0.6;
  }

  private assessResourceUtilization(startupData: any): number {
    return startupData.resourceUtilization || 0.5;
  }

  private assessGrowthPotential(startupData: any): number {
    return startupData.growthPotential || 0.7;
  }

  private assessProgramImpact(startupData: any, programCriteria: any): number {
    const impactFactors = [
      this.assessCohortDiversity(startupData, programCriteria),
      this.assessSuccessProbability(startupData),
      this.assessAlumniPotential(startupData),
      this.assessBrandValue(startupData)
    ];
    
    return impactFactors.reduce((sum, factor) => sum + factor, 0) / impactFactors.length;
  }

  private assessCohortDiversity(startupData: any, programCriteria: any): number {
    return startupData.diversityValue || 0.6;
  }

  private assessSuccessProbability(startupData: any): number {
    return startupData.successProbability || 0.7;
  }

  private assessAlumniPotential(startupData: any): number {
    return startupData.alumniPotential || 0.6;
  }

  private assessBrandValue(startupData: any): number {
    return startupData.brandValue || 0.5;
  }

  private identifyStrengths(startupData: any): string[] {
    const strengths = [];
    
    if (startupData.team?.strength > 0.8) strengths.push('Strong founding team');
    if (startupData.market?.opportunity > 0.8) strengths.push('Large market opportunity');
    if (startupData.traction?.growth > 0.7) strengths.push('Strong growth trajectory');
    if (startupData.innovation > 0.8) strengths.push('Innovative solution');
    
    return strengths.length > 0 ? strengths : ['Solid fundamentals'];
  }

  private identifyConcerns(startupData: any): string[] {
    const concerns = [];
    
    if (startupData.team?.completeness < 0.6) concerns.push('Incomplete team');
    if (startupData.market?.validation < 0.5) concerns.push('Limited market validation');
    if (startupData.traction?.revenue < 0.3) concerns.push('Limited revenue traction');
    if (startupData.competition?.intensity > 0.8) concerns.push('High competition');
    
    return concerns.length > 0 ? concerns : ['No major concerns'];
  }

  private generateRecommendation(startupData: any, programCriteria: any): string {
    const score = this.calculateOverallScore(startupData, programCriteria);
    
    if (score >= 0.8) {
      return 'Excellent fit - strongly recommend acceptance';
    } else if (score >= 0.6) {
      return 'Good fit - recommend acceptance with conditions';
    } else if (score >= 0.4) {
      return 'Moderate fit - consider with additional support';
    } else {
      return 'Poor fit - recommend rejection or waitlist';
    }
  }

  private generateNextSteps(startupData: any, programCriteria: any): string[] {
    const steps = [];
    const score = this.calculateOverallScore(startupData, programCriteria);
    
    if (score >= 0.6) {
      steps.push('Conduct founder interview');
      steps.push('Review business plan and financials');
      steps.push('Check references and background');
      
      if (startupData.team?.completeness < 0.7) {
        steps.push('Address team completeness gaps');
      }
      
      if (startupData.market?.validation < 0.6) {
        steps.push('Require additional market validation');
      }
    } else {
      steps.push('Provide feedback on application');
      steps.push('Suggest areas for improvement');
      steps.push('Consider for future cohorts');
    }
    
    return steps;
  }

  private calculateProgramAlignment(startupData: any, programCriteria: any): number {
    const alignmentFactors = [
      this.assessStageFit(startupData, programCriteria),
      this.assessSectorAlignment(startupData, programCriteria),
      this.assessGeographicFit(startupData, programCriteria),
      this.assessTimelineAlignment(startupData, programCriteria)
    ];
    
    return alignmentFactors.reduce((sum, factor) => sum + factor, 0) / alignmentFactors.length;
  }

  private assessStageFit(startupData: any, programCriteria: any): number {
    const startupStage = startupData.stage;
    const targetStages = programCriteria.targetStages || [];
    
    return targetStages.includes(startupStage) ? 1.0 : 0.3;
  }

  private assessSectorAlignment(startupData: any, programCriteria: any): number {
    const startupSector = startupData.sector;
    const targetSectors = programCriteria.targetSectors || [];
    
    if (targetSectors.length === 0) return 0.7; // No sector restrictions
    return targetSectors.includes(startupSector) ? 1.0 : 0.2;
  }

  private assessGeographicFit(startupData: any, programCriteria: any): number {
    const startupLocation = startupData.location;
    const targetLocations = programCriteria.targetLocations || [];
    
    if (targetLocations.length === 0) return 0.7; // No geographic restrictions
    return targetLocations.includes(startupLocation) ? 1.0 : 0.3;
  }

  private assessTimelineAlignment(startupData: any, programCriteria: any): number {
    const startupTimeline = startupData.timeline;
    const programTimeline = programCriteria.timeline;
    
    // Simplified timeline alignment check
    return Math.abs(startupTimeline - programTimeline) < 3 ? 1.0 : 0.5;
  }

  private generateMatchRecommendation(startup: any, programCriteria: any): string {
    const score = this.calculateOverallScore(startup, programCriteria);
    
    if (score >= 0.8) return 'Excellent match';
    if (score >= 0.6) return 'Good match';
    if (score >= 0.4) return 'Moderate match';
    return 'Poor match';
  }

  private calculateOverallFit(startups: any[], programCriteria: any): number {
    if (startups.length === 0) return 0;
    
    const totalScore = startups.reduce((sum, startup) => {
      return sum + this.calculateOverallScore(startup, programCriteria);
    }, 0);
    
    return totalScore / startups.length;
  }

  private identifyCommonStrengths(startups: any[]): string[] {
    const strengthCounts = {};
    
    startups.forEach(startup => {
      const strengths = this.identifyStrengths(startup);
      strengths.forEach(strength => {
        strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;
      });
    });
    
    return Object.entries(strengthCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([strength]) => strength);
  }

  private identifyCommonConcerns(startups: any[]): string[] {
    const concernCounts = {};
    
    startups.forEach(startup => {
      const concerns = this.identifyConcerns(startup);
      concerns.forEach(concern => {
        concernCounts[concern] = (concernCounts[concern] || 0) + 1;
      });
    });
    
    return Object.entries(concernCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([concern]) => concern);
  }

  private analyzeDiversity(startups: any[]): any {
    return {
      sectorDiversity: this.calculateSectorDiversity(startups),
      geographicDiversity: this.calculateGeographicDiversity(startups),
      stageDiversity: this.calculateStageDiversity(startups),
      teamDiversity: this.calculateTeamDiversity(startups)
    };
  }

  private calculateSectorDiversity(startups: any[]): number {
    const sectors = new Set(startups.map(s => s.sector));
    return sectors.size / startups.length;
  }

  private calculateGeographicDiversity(startups: any[]): number {
    const locations = new Set(startups.map(s => s.location));
    return locations.size / startups.length;
  }

  private calculateStageDiversity(startups: any[]): number {
    const stages = new Set(startups.map(s => s.stage));
    return stages.size / startups.length;
  }

  private calculateTeamDiversity(startups: any[]): number {
    // Simplified team diversity calculation
    return 0.6;
  }

  private generateMatchingRecommendations(startups: any[], programCriteria: any): string[] {
    const recommendations = [];
    
    const overallFit = this.calculateOverallFit(startups, programCriteria);
    
    if (overallFit < 0.6) {
      recommendations.push('Consider adjusting program criteria to attract better fits');
    }
    
    const diversity = this.analyzeDiversity(startups);
    if (diversity.sectorDiversity < 0.5) {
      recommendations.push('Increase sector diversity in startup selection');
    }
    
    if (diversity.geographicDiversity < 0.3) {
      recommendations.push('Expand geographic reach in startup sourcing');
    }
    
    return recommendations;
  }

  private assessDiversityValue(startupData: any, programCriteria: any): number {
    // Simplified diversity value assessment
    return startupData.diversityValue || 0.6;
  }
}
