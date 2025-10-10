// ============================================================================
// Real-Time Credit Decision Engine
// Instant decisioning for qualifying applications
// ============================================================================

import { CreditApplication, CreditScore, InstantDecisionResult } from './types';
import { AICreditScoringEngine } from './credit-scoring-engine';
import { CreditScoringAdvancedFeatures } from './advanced-features';

export class RealTimeCreditDecisionEngine {
  private scoringEngine: AICreditScoringEngine;
  private advancedFeatures: CreditScoringAdvancedFeatures;
  private readonly AUTO_APPROVE_THRESHOLD = 750;
  private readonly AUTO_DECLINE_THRESHOLD = 500;
  private readonly MAX_AUTO_APPROVE_AMOUNT = 100000;

  constructor() {
    this.scoringEngine = new AICreditScoringEngine();
    this.advancedFeatures = new CreditScoringAdvancedFeatures();
  }

  /**
   * Instant decision for qualifying applications
   * Used for small business loans under $100K
   */
  async instantDecision(application: CreditApplication): Promise<InstantDecisionResult> {
    const startTime = Date.now();

    // Quick pre-qualification checks
    const preQualChecks = this.runPreQualificationChecks(application);
    if (!preQualChecks.passed) {
      return {
        decision: 'decline',
        reason: preQualChecks.reason!,
        processingTime: Date.now() - startTime,
        requiresManualReview: false
      };
    }

    // Run full scoring
    const [score, fraud] = await Promise.all([
      this.scoringEngine.scoreCreditApplication(application),
      this.advancedFeatures.detectFraud(application)
    ]);

    // Check fraud flags
    if (fraud.isFraudulent) {
      return {
        decision: 'decline',
        reason: 'Application flagged for fraud review',
        processingTime: Date.now() - startTime,
        requiresManualReview: true,
        score: score.overallScore
      };
    }

    // Auto-approve if score is high enough
    if (score.overallScore >= this.AUTO_APPROVE_THRESHOLD && 
        score.defaultProbability < 0.10 &&
        application.loanRequest.amount <= this.MAX_AUTO_APPROVE_AMOUNT) {
      return {
        decision: 'approve',
        reason: 'Excellent credit profile meets auto-approval criteria',
        processingTime: Date.now() - startTime,
        requiresManualReview: false,
        score: score.overallScore,
        approvedAmount: application.loanRequest.amount,
        interestRate: score.recommendation.suggestedInterestRate,
        terms: {
          amount: application.loanRequest.amount,
          term: application.loanRequest.term,
          rate: score.recommendation.suggestedInterestRate,
          monthlyPayment: this.calculateMonthlyPayment(
            application.loanRequest.amount,
            score.recommendation.suggestedInterestRate,
            application.loanRequest.term
          )
        }
      };
    }

    // Auto-decline if score is too low
    if (score.overallScore < this.AUTO_DECLINE_THRESHOLD || score.defaultProbability > 0.50) {
      return {
        decision: 'decline',
        reason: score.recommendation.reasoning,
        processingTime: Date.now() - startTime,
        requiresManualReview: false,
        score: score.overallScore,
        improvementSuggestions: score.explainability.whatIfScenarios.map(s => s.change)
      };
    }

    // Everything else requires manual review
    return {
      decision: 'review',
      reason: 'Application requires underwriter review',
      processingTime: Date.now() - startTime,
      requiresManualReview: true,
      score: score.overallScore,
      reviewPriority: this.calculateReviewPriority(score, application)
    };
  }

  /**
   * Batch instant decisions for multiple applications
   */
  async batchInstantDecisions(
    applications: CreditApplication[]
  ): Promise<Map<string, InstantDecisionResult>> {
    const results = new Map<string, InstantDecisionResult>();
    
    // Process in parallel
    const decisions = await Promise.all(
      applications.map(app => this.instantDecision(app))
    );

    applications.forEach((app, index) => {
      results.set(app.applicantId, decisions[index]);
    });

    return results;
  }

  /**
   * Pre-qualification checks (fast fail)
   */
  private runPreQualificationChecks(application: CreditApplication): { 
    passed: boolean; 
    reason?: string 
  } {
    // Minimum credit score
    if (application.traditionalCredit.personalCreditScore < 550) {
      return { 
        passed: false, 
        reason: 'Personal credit score below minimum threshold of 550' 
      };
    }

    // Minimum time in business
    if (application.businessInfo.yearsInBusiness < 1) {
      return { 
        passed: false, 
        reason: 'Business must be operating for at least 1 year' 
      };
    }

    // Recent bankruptcy
    if (application.traditionalCredit.bankruptcies > 0) {
      return { 
        passed: false, 
        reason: 'Recent bankruptcy on record - not eligible for instant approval' 
      };
    }

    // Minimum revenue
    if (application.financialData.annualRevenue < 100000) {
      return { 
        passed: false, 
        reason: 'Annual revenue below minimum threshold of $100,000' 
      };
    }

    // Negative net income
    if (application.financialData.netIncome < 0) {
      return { 
        passed: false, 
        reason: 'Business must demonstrate profitability' 
      };
    }

    // Excessive debt
    const debtToRevenue = application.traditionalCredit.totalDebt / application.financialData.annualRevenue;
    if (debtToRevenue > 2) {
      return { 
        passed: false, 
        reason: 'Debt-to-revenue ratio exceeds maximum threshold' 
      };
    }

    // Collections
    if (application.traditionalCredit.collections > 2) {
      return { 
        passed: false, 
        reason: 'Multiple accounts in collections - requires manual review' 
      };
    }

    return { passed: true };
  }

  /**
   * Calculate monthly payment
   */
  private calculateMonthlyPayment(
    principal: number, 
    annualRate: number, 
    termMonths: number
  ): number {
    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) return principal / termMonths;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
           (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  /**
   * Calculate review priority for manual underwriting
   */
  private calculateReviewPriority(
    score: CreditScore, 
    application: CreditApplication
  ): 'high' | 'medium' | 'low' {
    // High priority: Good score or large amount
    if (score.overallScore >= 700 || application.loanRequest.amount > 500000) {
      return 'high';
    }
    
    // Medium priority: Moderate score
    if (score.overallScore >= 600) {
      return 'medium';
    }
    
    // Low priority: Below average score
    return 'low';
  }

  /**
   * Get decision statistics for a batch
   */
  getDecisionStatistics(decisions: Map<string, InstantDecisionResult>): {
    totalApplications: number;
    approved: number;
    declined: number;
    requiresReview: number;
    approvalRate: number;
    averageProcessingTime: number;
    averageApprovedAmount: number;
  } {
    const decisionsArray = Array.from(decisions.values());
    
    const approved = decisionsArray.filter(d => d.decision === 'approve').length;
    const declined = decisionsArray.filter(d => d.decision === 'decline').length;
    const requiresReview = decisionsArray.filter(d => d.decision === 'review').length;
    
    const totalProcessingTime = decisionsArray.reduce((sum, d) => sum + d.processingTime, 0);
    const approvedAmounts = decisionsArray
      .filter(d => d.approvedAmount)
      .map(d => d.approvedAmount!);
    
    return {
      totalApplications: decisionsArray.length,
      approved,
      declined,
      requiresReview,
      approvalRate: approved / decisionsArray.length,
      averageProcessingTime: totalProcessingTime / decisionsArray.length,
      averageApprovedAmount: approvedAmounts.length > 0 
        ? approvedAmounts.reduce((a, b) => a + b, 0) / approvedAmounts.length 
        : 0
    };
  }

  /**
   * Simulate decision outcomes with different thresholds
   */
  simulateThresholdImpact(
    applications: CreditApplication[],
    thresholds: {
      autoApprove: number;
      autoDecline: number;
    }
  ): Promise<{
    approvalRate: number;
    expectedDefaultRate: number;
    manualReviewRate: number;
    totalVolume: number;
  }> {
    // Temporarily adjust thresholds
    const originalApprove = this.AUTO_APPROVE_THRESHOLD;
    const originalDecline = this.AUTO_DECLINE_THRESHOLD;
    
    // This would be implemented with actual simulation logic
    // For now, return a placeholder
    return Promise.resolve({
      approvalRate: 0,
      expectedDefaultRate: 0,
      manualReviewRate: 0,
      totalVolume: applications.length
    });
  }
}
