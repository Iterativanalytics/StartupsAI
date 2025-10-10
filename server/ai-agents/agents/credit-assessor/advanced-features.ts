// ============================================================================
// Advanced Credit Scoring Features
// Fraud Detection, Portfolio Analysis, and Credit Limit Optimization
// ============================================================================

import {
  CreditApplication,
  CreditScore,
  FraudAssessment,
  CreditLimitRecommendation,
  PortfolioRiskAnalysis,
  FinancialData,
  AlternativeData
} from './types';

export class CreditScoringAdvancedFeatures {
  
  // ===========================
  // FRAUD DETECTION
  // ===========================
  
  async detectFraud(application: CreditApplication): Promise<FraudAssessment> {
    const flags: string[] = [];
    let riskScore = 0;

    // Check for inconsistencies
    const expectedRevenue = application.businessInfo.numberOfEmployees * 100000;
    if (application.financialData.annualRevenue > expectedRevenue * 3) {
      flags.push('Revenue significantly higher than typical for employee count');
      riskScore += 20;
    }

    // Check for suspicious patterns
    if (application.alternativeData.bankingBehavior.depositFrequency > 50) {
      flags.push('Unusually high deposit frequency');
      riskScore += 15;
    }

    // Check credit report red flags
    if (application.traditionalCredit.inquiries > 10) {
      flags.push('Excessive credit inquiries in recent period');
      riskScore += 10;
    }

    // Check business age vs. credit history
    if (application.businessInfo.yearsInBusiness > application.traditionalCredit.oldestAccountAge / 12) {
      flags.push('Business age exceeds oldest credit account age');
      riskScore += 25;
    }

    // Check for round numbers (potential fabrication)
    if (this.isRoundNumber(application.financialData.annualRevenue) &&
        this.isRoundNumber(application.financialData.netIncome)) {
      flags.push('Suspiciously round financial figures');
      riskScore += 10;
    }

    // Check cash flow volatility vs. reported stability
    if (application.alternativeData.bankingBehavior.cashFlowVolatility > 0.7 &&
        application.financialData.profitMargin > 0.20) {
      flags.push('High cash flow volatility inconsistent with reported profitability');
      riskScore += 15;
    }

    return {
      isFraudulent: riskScore > 50,
      riskScore,
      flags,
      recommendation: riskScore > 50 ? 'reject' : riskScore > 30 ? 'investigate' : 'proceed'
    };
  }

  private isRoundNumber(value: number): boolean {
    return value % 10000 === 0 && value > 0;
  }

  // ===========================
  // CREDIT LIMIT OPTIMIZATION
  // ===========================
  
  calculateOptimalCreditLimit(
    application: CreditApplication,
    creditScore: CreditScore
  ): CreditLimitRecommendation {
    const monthlyRevenue = application.financialData.monthlyRevenue;
    const cashReserves = application.financialData.cashReserves;
    const profitMargin = application.financialData.profitMargin;

    // Base limit on revenue and score
    let baseLimit = monthlyRevenue * 2;

    // Adjust based on credit score
    const scoreMultiplier = (creditScore.overallScore - 300) / 550;
    baseLimit *= (0.5 + scoreMultiplier * 0.5);

    // Adjust based on cash reserves
    if (cashReserves > monthlyRevenue * 3) {
      baseLimit *= 1.2;
    } else if (cashReserves < monthlyRevenue) {
      baseLimit *= 0.8;
    }

    // Adjust based on profitability
    if (profitMargin > 0.15) {
      baseLimit *= 1.1;
    } else if (profitMargin < 0.05) {
      baseLimit *= 0.9;
    }

    // Adjust based on business stability
    if (application.businessInfo.yearsInBusiness > 5) {
      baseLimit *= 1.1;
    } else if (application.businessInfo.yearsInBusiness < 2) {
      baseLimit *= 0.85;
    }

    return {
      recommendedLimit: Math.round(baseLimit),
      minimumLimit: Math.round(baseLimit * 0.7),
      maximumLimit: Math.round(baseLimit * 1.3),
      reviewPeriod: creditScore.rating >= 'B+' ? 12 : 6,
      reasoning: this.generateCreditLimitReasoning(baseLimit, application, creditScore)
    };
  }

  private generateCreditLimitReasoning(
    limit: number,
    application: CreditApplication,
    creditScore: CreditScore
  ): string {
    const factors: string[] = [];

    factors.push(`Based on monthly revenue of $${application.financialData.monthlyRevenue.toLocaleString()}`);
    factors.push(`Credit score rating: ${creditScore.rating}`);
    
    if (application.financialData.cashReserves > application.financialData.monthlyRevenue * 3) {
      factors.push('Strong cash reserves support higher limit');
    }
    
    if (application.financialData.profitMargin > 0.15) {
      factors.push('Healthy profit margins indicate strong repayment capacity');
    }

    if (application.businessInfo.yearsInBusiness > 5) {
      factors.push('Established business history reduces risk');
    }

    return factors.join('. ');
  }

  // ===========================
  // PORTFOLIO RISK ANALYSIS
  // ===========================
  
  analyzePortfolioRisk(loans: Array<{ application: CreditApplication; score: CreditScore }>): PortfolioRiskAnalysis {
    const totalExposure = loans.reduce((sum, loan) => sum + loan.application.loanRequest.amount, 0);
    const weightedDefaultProb = loans.reduce(
      (sum, loan) => sum + (loan.score.defaultProbability * loan.application.loanRequest.amount),
      0
    ) / totalExposure;

    // Concentration risk by industry
    const industryExposure: Record<string, number> = {};
    loans.forEach(loan => {
      const industry = loan.application.businessInfo.industry;
      industryExposure[industry] = (industryExposure[industry] || 0) + loan.application.loanRequest.amount;
    });

    const maxIndustryConcentration = Math.max(...Object.values(industryExposure)) / totalExposure;

    // Calculate expected loss
    const expectedLoss = loans.reduce((sum, loan) => {
      const loanAmount = loan.application.loanRequest.amount;
      const pd = loan.score.defaultProbability;
      const lgd = 0.45; // Loss Given Default (typical 45%)
      return sum + (loanAmount * pd * lgd);
    }, 0);

    return {
      totalExposure,
      portfolioDefaultProbability: weightedDefaultProb,
      expectedLoss,
      expectedLossRate: expectedLoss / totalExposure,
      concentrationRisk: maxIndustryConcentration,
      industryExposure,
      riskRating: this.determinePortfolioRiskRating(weightedDefaultProb, maxIndustryConcentration),
      recommendations: this.generatePortfolioRecommendations(weightedDefaultProb, maxIndustryConcentration, industryExposure)
    };
  }

  private determinePortfolioRiskRating(defaultProb: number, concentration: number): string {
    if (defaultProb < 0.10 && concentration < 0.30) return 'Low Risk';
    if (defaultProb < 0.20 && concentration < 0.40) return 'Moderate Risk';
    if (defaultProb < 0.30 && concentration < 0.50) return 'Elevated Risk';
    return 'High Risk';
  }

  private generatePortfolioRecommendations(
    defaultProb: number,
    concentration: number,
    industryExposure: Record<string, number>
  ): string[] {
    const recommendations: string[] = [];

    if (defaultProb > 0.20) {
      recommendations.push('Tighten underwriting standards for new loans');
      recommendations.push('Consider increasing interest rates to compensate for risk');
      recommendations.push('Implement enhanced monitoring for high-risk loans');
    }

    if (concentration > 0.40) {
      recommendations.push('Diversify portfolio across more industries');
      const topIndustry = Object.entries(industryExposure).sort((a, b) => b[1] - a[1])[0][0];
      recommendations.push(`Reduce exposure to ${topIndustry} sector`);
      recommendations.push('Set industry concentration limits');
    }

    if (defaultProb > 0.15 && concentration > 0.35) {
      recommendations.push('Implement enhanced monitoring for high-risk segments');
      recommendations.push('Consider portfolio hedging strategies');
    }

    if (defaultProb < 0.10) {
      recommendations.push('Portfolio performing well - maintain current standards');
      recommendations.push('Consider modest expansion in low-risk segments');
    }

    return recommendations;
  }

  // ===========================
  // STRESS TESTING
  // ===========================
  
  performStressTest(
    loans: Array<{ application: CreditApplication; score: CreditScore }>,
    scenarios: {
      economicDownturn?: boolean;
      interestRateShock?: boolean;
      industryCollapse?: string;
    }
  ): {
    baselineDefaultRate: number;
    stressedDefaultRate: number;
    additionalLosses: number;
    affectedLoans: number;
  } {
    const baselineDefaultRate = loans.reduce((sum, loan) => 
      sum + loan.score.defaultProbability, 0) / loans.length;

    let stressedDefaultRate = baselineDefaultRate;
    let affectedLoans = 0;

    if (scenarios.economicDownturn) {
      // Increase default probability by 50% in economic downturn
      stressedDefaultRate *= 1.5;
      affectedLoans = loans.length;
    }

    if (scenarios.interestRateShock) {
      // Increase default probability by 30% for interest rate shock
      stressedDefaultRate *= 1.3;
      affectedLoans = loans.length;
    }

    if (scenarios.industryCollapse) {
      // Double default probability for affected industry
      const industryLoans = loans.filter(
        loan => loan.application.businessInfo.industry === scenarios.industryCollapse
      );
      const industryImpact = (industryLoans.length / loans.length) * baselineDefaultRate;
      stressedDefaultRate += industryImpact;
      affectedLoans = industryLoans.length;
    }

    const totalExposure = loans.reduce((sum, loan) => 
      sum + loan.application.loanRequest.amount, 0);
    const lgd = 0.45;
    
    const baselineLosses = totalExposure * baselineDefaultRate * lgd;
    const stressedLosses = totalExposure * stressedDefaultRate * lgd;
    const additionalLosses = stressedLosses - baselineLosses;

    return {
      baselineDefaultRate,
      stressedDefaultRate: Math.min(1, stressedDefaultRate),
      additionalLosses,
      affectedLoans
    };
  }

  // ===========================
  // EARLY WARNING SYSTEM
  // ===========================
  
  generateEarlyWarnings(
    application: CreditApplication,
    currentFinancials: FinancialData,
    currentAlternativeData: AlternativeData
  ): {
    warnings: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendedAction: string;
  } {
    const warnings: string[] = [];
    let severityScore = 0;

    // Check revenue decline
    if (currentFinancials.revenueGrowthRate < -0.10) {
      warnings.push('Revenue declining by more than 10%');
      severityScore += 3;
    }

    // Check profit margin compression
    if (currentFinancials.profitMargin < 0.05) {
      warnings.push('Profit margins compressed below 5%');
      severityScore += 2;
    }

    // Check cash runway
    const monthsOfRunway = currentFinancials.cashReserves / currentFinancials.monthlyExpenses;
    if (monthsOfRunway < 2) {
      warnings.push('Cash reserves critically low - less than 2 months runway');
      severityScore += 4;
    } else if (monthsOfRunway < 3) {
      warnings.push('Cash reserves below 3 months - monitor closely');
      severityScore += 2;
    }

    // Check banking behavior
    if (currentAlternativeData.bankingBehavior.overdrafts > 3) {
      warnings.push('Multiple overdraft incidents detected');
      severityScore += 2;
    }

    // Check cash flow volatility
    if (currentAlternativeData.bankingBehavior.cashFlowVolatility > 0.6) {
      warnings.push('High cash flow volatility indicates instability');
      severityScore += 2;
    }

    // Check customer churn
    if (currentAlternativeData.customerBehavior.churnRate > 0.30) {
      warnings.push('High customer churn rate above 30%');
      severityScore += 2;
    }

    // Determine severity
    let severity: 'low' | 'medium' | 'high' | 'critical';
    if (severityScore >= 8) severity = 'critical';
    else if (severityScore >= 5) severity = 'high';
    else if (severityScore >= 3) severity = 'medium';
    else severity = 'low';

    // Recommended action
    let recommendedAction: string;
    if (severity === 'critical') {
      recommendedAction = 'URGENT: Immediate intervention required - consider loan restructuring or acceleration';
    } else if (severity === 'high') {
      recommendedAction = 'Schedule immediate meeting with borrower - request updated business plan';
    } else if (severity === 'medium') {
      recommendedAction = 'Increase monitoring frequency - request monthly financials';
    } else {
      recommendedAction = 'Continue standard monitoring procedures';
    }

    return {
      warnings,
      severity,
      recommendedAction
    };
  }

  // ===========================
  // LOAN PRICING OPTIMIZATION
  // ===========================
  
  optimizeLoanPricing(
    application: CreditApplication,
    creditScore: CreditScore,
    marketConditions: {
      baseRate: number;
      competitorRates: number[];
      demandLevel: 'low' | 'medium' | 'high';
    }
  ): {
    optimalRate: number;
    rateRange: { min: number; max: number };
    expectedReturn: number;
    competitiveness: string;
    reasoning: string;
  } {
    // Start with base rate
    let optimalRate = marketConditions.baseRate;

    // Add risk premium based on default probability
    const riskPremium = creditScore.defaultProbability * 10; // 10% max risk premium
    optimalRate += riskPremium;

    // Adjust for credit score
    const scoreAdjustment = (850 - creditScore.overallScore) / 850 * 3; // Up to 3% adjustment
    optimalRate += scoreAdjustment;

    // Adjust for market demand
    if (marketConditions.demandLevel === 'high') {
      optimalRate += 0.5; // Can charge more in high demand
    } else if (marketConditions.demandLevel === 'low') {
      optimalRate -= 0.5; // Need to be competitive in low demand
    }

    // Calculate competitive position
    const avgCompetitorRate = marketConditions.competitorRates.reduce((a, b) => a + b, 0) / 
                               marketConditions.competitorRates.length;
    
    let competitiveness: string;
    if (optimalRate < avgCompetitorRate - 0.5) {
      competitiveness = 'Highly Competitive';
    } else if (optimalRate < avgCompetitorRate) {
      competitiveness = 'Competitive';
    } else if (optimalRate < avgCompetitorRate + 0.5) {
      competitiveness = 'Market Rate';
    } else {
      competitiveness = 'Premium Pricing';
    }

    // Calculate expected return
    const loanAmount = application.loanRequest.amount;
    const term = application.loanRequest.term;
    const expectedReturn = (loanAmount * optimalRate / 100 * term / 12) * 
                          (1 - creditScore.defaultProbability);

    const reasoning = `Rate based on ${marketConditions.baseRate}% base + ${riskPremium.toFixed(2)}% risk premium + ${scoreAdjustment.toFixed(2)}% credit adjustment. ${competitiveness} compared to market average of ${avgCompetitorRate.toFixed(2)}%.`;

    return {
      optimalRate: Math.round(optimalRate * 100) / 100,
      rateRange: {
        min: Math.round((optimalRate - 1) * 100) / 100,
        max: Math.round((optimalRate + 1) * 100) / 100
      },
      expectedReturn,
      competitiveness,
      reasoning
    };
  }
}
