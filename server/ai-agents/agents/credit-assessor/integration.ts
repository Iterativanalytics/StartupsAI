// ============================================================================
// Credit Analyst Agent Integration
// Comprehensive integration layer for AI credit scoring system
// ============================================================================

import {
  CreditApplication,
  CreditScore,
  CreditAnalysisReport,
  PortfolioAnalysisReport,
  LoanMonitoringReport,
  FraudAssessment,
  CreditLimitRecommendation,
  FinancialData,
  AlternativeData
} from './types';
import { AICreditScoringEngine } from './credit-scoring-engine';
import { CreditScoringAdvancedFeatures } from './advanced-features';

export class CreditAnalystAgentIntegration {
  private scoringEngine: AICreditScoringEngine;
  private advancedFeatures: CreditScoringAdvancedFeatures;

  constructor() {
    this.scoringEngine = new AICreditScoringEngine();
    this.advancedFeatures = new CreditScoringAdvancedFeatures();
  }

  /**
   * Main method called by Credit Analyst Agent
   * Performs complete credit analysis and returns formatted results
   */
  async analyzeApplication(application: CreditApplication): Promise<CreditAnalysisReport> {
    // Run all analyses in parallel
    const [creditScore, fraudAssessment, creditLimit] = await Promise.all([
      this.scoringEngine.scoreCreditApplication(application),
      this.advancedFeatures.detectFraud(application),
      this.scoringEngine.scoreCreditApplication(application)
        .then(score => this.advancedFeatures.calculateOptimalCreditLimit(application, score))
    ]);

    // Generate comprehensive report
    return this.generateReport(application, creditScore, fraudAssessment, creditLimit);
  }

  /**
   * Generate comprehensive credit analysis report
   */
  private generateReport(
    application: CreditApplication,
    score: CreditScore,
    fraud: FraudAssessment,
    creditLimit: CreditLimitRecommendation
  ): CreditAnalysisReport {
    return {
      applicationId: application.applicantId,
      timestamp: new Date().toISOString(),
      applicant: {
        businessName: application.businessInfo.businessName,
        industry: application.businessInfo.industry,
        yearsInBusiness: application.businessInfo.yearsInBusiness
      },
      scoring: {
        overallScore: score.overallScore,
        rating: score.rating,
        defaultProbability: score.defaultProbability,
        riskCategory: score.riskCategory,
        confidenceLevel: score.confidenceLevel
      },
      components: score.componentScores,
      recommendation: score.recommendation,
      keyFactors: score.keyFactors,
      fraudAssessment: fraud,
      creditLimit: creditLimit,
      explainability: score.explainability,
      summary: this.generateExecutiveSummary(application, score, fraud),
      nextSteps: this.generateNextSteps(score, fraud)
    };
  }

  /**
   * Generate executive summary
   */
  private generateExecutiveSummary(
    application: CreditApplication,
    score: CreditScore,
    fraud: FraudAssessment
  ): string {
    const summaryParts: string[] = [];

    summaryParts.push(
      `${application.businessInfo.businessName} has received a credit score of ${Math.round(score.overallScore)}/850 (${score.rating}) ` +
      `with a ${(score.defaultProbability * 100).toFixed(1)}% default probability.`
    );

    if (fraud.riskScore > 50) {
      summaryParts.push('⚠️ ALERT: High fraud risk detected. Manual investigation required.');
    } else if (fraud.riskScore > 30) {
      summaryParts.push('⚠️ CAUTION: Moderate fraud indicators present. Additional verification recommended.');
    }

    if (score.recommendation.decision === 'approve') {
      summaryParts.push(
        `✅ Recommended for approval with maximum loan amount of $${score.recommendation.maxLoanAmount.toLocaleString()} ` +
        `at ${score.recommendation.suggestedInterestRate.toFixed(2)}% interest rate.`
      );
    } else if (score.recommendation.decision === 'approve_with_conditions') {
      summaryParts.push(
        `⚠️ Conditional approval recommended with ${score.recommendation.conditions.length} conditions. ` +
        `Maximum loan amount: $${score.recommendation.maxLoanAmount.toLocaleString()}.`
      );
    } else if (score.recommendation.decision === 'review') {
      summaryParts.push('📋 Manual underwriting review required before final decision.');
    } else {
      summaryParts.push('❌ Application does not meet minimum credit standards at this time.');
    }

    // Add key strength
    if (score.keyFactors.positive.length > 0) {
      summaryParts.push(`💪 Key strength: ${score.keyFactors.positive[0].factor}.`);
    }

    // Add key concern
    if (score.keyFactors.negative.length > 0) {
      summaryParts.push(`⚠️ Primary concern: ${score.keyFactors.negative[0].factor}.`);
    }

    return summaryParts.join(' ');
  }

  /**
   * Generate next steps based on decision
   */
  private generateNextSteps(score: CreditScore, fraud: FraudAssessment): string[] {
    const steps: string[] = [];

    if (fraud.riskScore > 50) {
      steps.push('🚨 IMMEDIATE: Escalate to fraud investigation team');
      steps.push('Verify applicant identity and business registration');
      steps.push('Request additional documentation');
      return steps;
    }

    if (score.recommendation.decision === 'approve') {
      steps.push('✅ Generate approval letter with terms');
      steps.push('📅 Schedule closing appointment');
      steps.push('📄 Prepare loan documents');
      steps.push('💰 Set up disbursement schedule');
    } else if (score.recommendation.decision === 'approve_with_conditions') {
      steps.push('📧 Send conditional approval letter');
      steps.push('📋 Document required conditions clearly');
      steps.push('⏰ Set timeline for condition fulfillment');
      steps.push('🔄 Schedule follow-up review');
    } else if (score.recommendation.decision === 'review') {
      steps.push('👤 Assign to senior underwriter for manual review');
      steps.push('📊 Request additional financial documentation');
      steps.push('📞 Conduct reference checks');
      steps.push('🏢 Perform site visit if necessary');
    } else {
      steps.push('📧 Send decline letter with specific reasons');
      steps.push('💡 Provide improvement recommendations');
      steps.push('📅 Offer reapplication timeline');
      steps.push('🔄 Suggest alternative financing options if applicable');
    }

    // Add monitoring if approved
    if (score.recommendation.decision === 'approve' || score.recommendation.decision === 'approve_with_conditions') {
      if (score.riskCategory === 'medium' || score.riskCategory === 'high') {
        steps.push('📊 Set up enhanced monitoring for this account');
        steps.push('📅 Schedule quarterly portfolio reviews');
      }
    }

    return steps;
  }

  /**
   * Batch scoring for portfolio analysis
   */
  async scorePortfolio(applications: CreditApplication[]): Promise<PortfolioAnalysisReport> {
    const scores = await Promise.all(
      applications.map(app => 
        this.scoringEngine.scoreCreditApplication(app).then(score => ({ application: app, score }))
      )
    );

    const portfolioRisk = this.advancedFeatures.analyzePortfolioRisk(scores);

    return {
      totalApplications: applications.length,
      portfolioMetrics: {
        averageScore: scores.reduce((sum, s) => sum + s.score.overallScore, 0) / scores.length,
        averageDefaultProbability: scores.reduce((sum, s) => sum + s.score.defaultProbability, 0) / scores.length,
        approvalRate: scores.filter(s => s.score.recommendation.decision === 'approve').length / scores.length
      },
      riskDistribution: this.calculateRiskDistribution(scores),
      portfolioRisk,
      topRisks: scores
        .sort((a, b) => b.score.defaultProbability - a.score.defaultProbability)
        .slice(0, 10)
        .map(s => ({
          applicationId: s.application.applicantId,
          businessName: s.application.businessInfo.businessName,
          score: s.score.overallScore,
          defaultProbability: s.score.defaultProbability,
          loanAmount: s.application.loanRequest.amount
        })),
      recommendations: portfolioRisk.recommendations
    };
  }

  /**
   * Calculate risk distribution across portfolio
   */
  private calculateRiskDistribution(
    scores: Array<{ application: CreditApplication; score: CreditScore }>
  ): Record<string, number> {
    const distribution: Record<string, number> = {
      very_low: 0,
      low: 0,
      medium: 0,
      high: 0,
      very_high: 0
    };

    scores.forEach(s => {
      distribution[s.score.riskCategory]++;
    });

    return distribution;
  }

  /**
   * Real-time monitoring for existing loans
   */
  async monitorExistingLoan(
    originalApplication: CreditApplication,
    currentFinancials: FinancialData,
    currentAlternativeData: AlternativeData
  ): Promise<LoanMonitoringReport> {
    // Create updated application with current data
    const updatedApplication: CreditApplication = {
      ...originalApplication,
      financialData: currentFinancials,
      alternativeData: currentAlternativeData
    };

    // Re-score with current data
    const currentScore = await this.scoringEngine.scoreCreditApplication(updatedApplication);
    const originalScore = await this.scoringEngine.scoreCreditApplication(originalApplication);

    // Calculate changes
    const scoreDelta = currentScore.overallScore - originalScore.overallScore;
    const riskDelta = currentScore.defaultProbability - originalScore.defaultProbability;

    // Generate early warnings
    const earlyWarnings = this.advancedFeatures.generateEarlyWarnings(
      originalApplication,
      currentFinancials,
      currentAlternativeData
    );

    // Determine action required
    let actionRequired: 'none' | 'monitor' | 'review' | 'restructure' | 'escalate';
    if (earlyWarnings.severity === 'critical') {
      actionRequired = 'escalate';
    } else if (earlyWarnings.severity === 'high') {
      actionRequired = 'restructure';
    } else if (earlyWarnings.severity === 'medium') {
      actionRequired = 'review';
    } else if (earlyWarnings.warnings.length > 0) {
      actionRequired = 'monitor';
    } else {
      actionRequired = 'none';
    }

    return {
      loanId: originalApplication.applicantId,
      monitoringDate: new Date().toISOString(),
      currentScore: currentScore.overallScore,
      originalScore: originalScore.overallScore,
      scoreDelta,
      currentRisk: currentScore.defaultProbability,
      originalRisk: originalScore.defaultProbability,
      riskDelta,
      warnings: earlyWarnings.warnings,
      actionRequired,
      recommendations: this.generateMonitoringRecommendations(actionRequired, earlyWarnings.warnings, currentScore)
    };
  }

  /**
   * Generate monitoring recommendations
   */
  private generateMonitoringRecommendations(
    action: string,
    warnings: string[],
    score: CreditScore
  ): string[] {
    const recommendations: string[] = [];

    switch (action) {
      case 'none':
        recommendations.push('✅ Continue standard monitoring procedures');
        recommendations.push('📅 Next review in 90 days');
        break;

      case 'monitor':
        recommendations.push('📊 Increase monitoring frequency to monthly');
        recommendations.push('📄 Request updated financials next month');
        recommendations.push('👀 Watch for further deterioration');
        break;

      case 'review':
        recommendations.push('📅 Schedule meeting with borrower within 2 weeks');
        recommendations.push('📊 Request detailed financial projections');
        recommendations.push('🔒 Assess need for additional collateral or guarantees');
        recommendations.push('📝 Consider covenant modifications');
        break;

      case 'restructure':
        recommendations.push('🚨 PRIORITY: Immediate borrower meeting required');
        recommendations.push('👥 Engage workout team');
        recommendations.push('🔄 Evaluate restructuring options');
        recommendations.push('💰 Consider payment plan modifications');
        recommendations.push('🏢 Assess collateral liquidation value');
        break;

      case 'escalate':
        recommendations.push('⚠️ URGENT: Escalate to special assets team');
        recommendations.push('⚡ Consider acceleration of loan');
        recommendations.push('⚖️ Evaluate legal remedies');
        recommendations.push('💼 Begin collection procedures');
        recommendations.push('📊 Update loss reserves');
        break;
    }

    // Add specific recommendations based on warnings
    if (warnings.some(w => w.includes('cash reserves'))) {
      recommendations.push('💵 Require cash injection or additional equity');
    }
    if (warnings.some(w => w.includes('overdraft'))) {
      recommendations.push('🏦 Implement cash management controls');
    }
    if (warnings.some(w => w.includes('revenue declining'))) {
      recommendations.push('📈 Request business plan update with recovery strategy');
    }

    return recommendations;
  }

  /**
   * Compare multiple applications
   */
  async compareApplications(applications: CreditApplication[]): Promise<{
    rankings: Array<{
      applicationId: string;
      businessName: string;
      score: number;
      rank: number;
      recommendation: string;
    }>;
    bestCandidate: string;
    analysis: string;
  }> {
    const scores = await Promise.all(
      applications.map(app => 
        this.scoringEngine.scoreCreditApplication(app)
          .then(score => ({ application: app, score }))
      )
    );

    // Sort by score
    const sorted = scores.sort((a, b) => b.score.overallScore - a.score.overallScore);

    const rankings = sorted.map((item, index) => ({
      applicationId: item.application.applicantId,
      businessName: item.application.businessInfo.businessName,
      score: item.score.overallScore,
      rank: index + 1,
      recommendation: item.score.recommendation.decision
    }));

    const bestCandidate = sorted[0].application.applicantId;
    const analysis = `${sorted[0].application.businessInfo.businessName} ranks highest with a score of ${Math.round(sorted[0].score.overallScore)} and ${sorted[0].score.recommendation.decision} recommendation.`;

    return {
      rankings,
      bestCandidate,
      analysis
    };
  }
}
