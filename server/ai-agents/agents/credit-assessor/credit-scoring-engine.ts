// ============================================================================
// AI Credit Scoring Engine - Core Implementation
// ============================================================================

import {
  CreditApplication,
  CreditScore,
  ComponentScore,
  Factor,
  LoanRecommendation,
  Explainability,
  WhatIfScenario,
  TraditionalCreditData,
  FinancialData,
  BusinessInfo,
  AlternativeData,
  BankingBehavior,
  BusinessMetrics,
  DigitalFootprint,
  SupplierRelationships,
  CustomerBehavior
} from './types';

export class AICreditScoringEngine {
  private readonly WEIGHTS = {
    traditionalCredit: 0.35,
    financialHealth: 0.30,
    businessStability: 0.20,
    alternativeData: 0.10,
    industryRisk: 0.05
  };

  async scoreCreditApplication(application: CreditApplication): Promise<CreditScore> {
    // Calculate component scores
    const traditionalCreditScore = this.scoreTraditionalCredit(application.traditionalCredit);
    const financialHealthScore = this.scoreFinancialHealth(application.financialData);
    const businessStabilityScore = this.scoreBusinessStability(application.businessInfo);
    const alternativeDataScore = this.scoreAlternativeData(application.alternativeData);
    const industryRiskScore = await this.scoreIndustryRisk(application.businessInfo.industry);

    // Calculate weighted overall score
    const overallScore = this.calculateOverallScore({
      traditionalCredit: traditionalCreditScore,
      financialHealth: financialHealthScore,
      businessStability: businessStabilityScore,
      alternativeData: alternativeDataScore,
      industryRisk: industryRiskScore
    });

    // Calculate default probability using ML model
    const defaultProbability = await this.predictDefaultProbability(application);

    // Determine rating and risk category
    const rating = this.determineRating(overallScore);
    const riskCategory = this.determineRiskCategory(defaultProbability);

    // Generate recommendation
    const recommendation = this.generateRecommendation(
      application,
      overallScore,
      defaultProbability,
      {
        traditionalCredit: traditionalCreditScore,
        financialHealth: financialHealthScore,
        businessStability: businessStabilityScore,
        alternativeData: alternativeDataScore,
        industryRisk: industryRiskScore
      }
    );

    // Extract key factors
    const keyFactors = this.extractKeyFactors(application, {
      traditionalCredit: traditionalCreditScore,
      financialHealth: financialHealthScore,
      businessStability: businessStabilityScore,
      alternativeData: alternativeDataScore,
      industryRisk: industryRiskScore
    });

    // Generate explainability
    const explainability = await this.generateExplainability(application, overallScore);

    return {
      overallScore,
      rating,
      defaultProbability,
      riskCategory,
      confidenceLevel: this.calculateConfidence(application),
      componentScores: {
        traditionalCredit: traditionalCreditScore,
        financialHealth: financialHealthScore,
        businessStability: businessStabilityScore,
        alternativeData: alternativeDataScore,
        industryRisk: industryRiskScore
      },
      keyFactors,
      recommendation,
      explainability
    };
  }

  // ===========================
  // TRADITIONAL CREDIT SCORING
  // ===========================

  private scoreTraditionalCredit(data: TraditionalCreditData): ComponentScore {
    const factors: string[] = [];
    let score = 300; // Base score

    // Personal credit score (30% of traditional)
    const personalCreditContribution = (data.personalCreditScore / 850) * 255;
    score += personalCreditContribution * 0.30;
    
    if (data.personalCreditScore >= 750) {
      factors.push('Excellent personal credit score');
    } else if (data.personalCreditScore < 600) {
      factors.push('Poor personal credit score');
    }

    // Business credit score (25% of traditional)
    if (data.businessCreditScore > 0) {
      const businessCreditContribution = (data.businessCreditScore / 100) * 255;
      score += businessCreditContribution * 0.25;
      
      if (data.businessCreditScore >= 80) {
        factors.push('Strong business credit history');
      }
    }

    // Payment history (35% of traditional)
    const latePayments = data.paymentHistory.filter(p => p.paymentStatus !== 'current').length;
    const paymentHistoryScore = Math.max(0, 1 - (latePayments / data.paymentHistory.length));
    score += paymentHistoryScore * 255 * 0.35;
    
    if (latePayments === 0) {
      factors.push('Perfect payment history');
    } else if (latePayments > 3) {
      factors.push('Multiple late payments');
    }

    // Credit utilization (10% of traditional)
    const utilizationScore = Math.max(0, 1 - (data.creditUtilization / 100));
    score += utilizationScore * 255 * 0.10;
    
    if (data.creditUtilization < 30) {
      factors.push('Low credit utilization');
    } else if (data.creditUtilization > 70) {
      factors.push('High credit utilization');
    }

    // Negative marks
    if (data.bankruptcies > 0) {
      score -= 100;
      factors.push('Bankruptcy on record');
    }
    if (data.foreclosures > 0) {
      score -= 75;
      factors.push('Foreclosure on record');
    }
    if (data.collections > 0) {
      score -= 25 * data.collections;
      factors.push('Accounts in collections');
    }

    // Credit history length
    if (data.oldestAccountAge > 60) {
      score += 25;
      factors.push('Long credit history');
    }

    // Normalize to 300-850 range
    score = Math.max(300, Math.min(850, score));

    return {
      score,
      weight: this.WEIGHTS.traditionalCredit,
      contribution: (score / 850) * this.WEIGHTS.traditionalCredit,
      factors
    };
  }

  // ===========================
  // FINANCIAL HEALTH SCORING
  // ===========================

  private scoreFinancialHealth(data: FinancialData): ComponentScore {
    const factors: string[] = [];
    let score = 0;

    // Revenue strength (25%)
    const revenueScore = Math.min(1, data.annualRevenue / 1000000) * 100;
    score += revenueScore * 0.25;
    
    if (data.annualRevenue > 1000000) {
      factors.push('Strong annual revenue');
    }

    // Profitability (30%)
    const profitabilityScore = Math.min(1, data.profitMargin) * 100;
    score += profitabilityScore * 0.30;
    
    if (data.profitMargin > 0.15) {
      factors.push('Healthy profit margins');
    } else if (data.profitMargin < 0.05) {
      factors.push('Low profit margins');
    }

    // Cash reserves (20%)
    const monthlyBurnRate = data.monthlyExpenses;
    const monthsOfRunway = data.cashReserves / monthlyBurnRate;
    const cashScore = Math.min(1, monthsOfRunway / 6) * 100;
    score += cashScore * 0.20;
    
    if (monthsOfRunway > 6) {
      factors.push('Strong cash reserves');
    } else if (monthsOfRunway < 3) {
      factors.push('Limited cash reserves');
    }

    // Debt-to-equity ratio (15%)
    const equity = data.assets - data.liabilities;
    const debtToEquity = equity > 0 ? data.liabilities / equity : 5;
    const debtScore = Math.max(0, 1 - (debtToEquity / 3)) * 100;
    score += debtScore * 0.15;
    
    if (debtToEquity < 1) {
      factors.push('Low debt-to-equity ratio');
    } else if (debtToEquity > 2) {
      factors.push('High debt burden');
    }

    // Revenue growth (10%)
    const growthScore = Math.min(1, Math.max(0, data.revenueGrowthRate)) * 100;
    score += growthScore * 0.10;
    
    if (data.revenueGrowthRate > 0.20) {
      factors.push('Strong revenue growth');
    } else if (data.revenueGrowthRate < 0) {
      factors.push('Revenue declining');
    }

    // Normalize to 300-850 range
    const normalizedScore = 300 + (score / 100) * 550;

    return {
      score: normalizedScore,
      weight: this.WEIGHTS.financialHealth,
      contribution: (score / 100) * this.WEIGHTS.financialHealth,
      factors
    };
  }

  // ===========================
  // BUSINESS STABILITY SCORING
  // ===========================

  private scoreBusinessStability(data: BusinessInfo): ComponentScore {
    const factors: string[] = [];
    let score = 0;

    // Years in business (40%)
    const yearsScore = Math.min(1, data.yearsInBusiness / 10) * 100;
    score += yearsScore * 0.40;
    
    if (data.yearsInBusiness >= 5) {
      factors.push('Established business');
    } else if (data.yearsInBusiness < 2) {
      factors.push('Early-stage business');
    }

    // Business structure (20%)
    const structureScores: Record<string, number> = {
      corporation: 100,
      s_corp: 90,
      llc: 80,
      partnership: 60,
      sole_proprietorship: 40
    };
    const structureScore = structureScores[data.businessStructure];
    score += structureScore * 0.20;
    
    if (data.businessStructure === 'corporation' || data.businessStructure === 's_corp') {
      factors.push('Formal business structure');
    }

    // Scale (20%)
    const employeeScore = Math.min(1, data.numberOfEmployees / 50) * 100;
    const locationScore = Math.min(1, data.locations / 5) * 100;
    const scaleScore = (employeeScore + locationScore) / 2;
    score += scaleScore * 0.20;
    
    if (data.numberOfEmployees > 20) {
      factors.push('Substantial team size');
    }
    if (data.locations > 1) {
      factors.push('Multi-location operations');
    }

    // Ownership concentration (20%)
    const ownershipScore = Math.min(1, data.ownershipPercentage / 100) * 100;
    score += ownershipScore * 0.20;

    // Normalize to 300-850 range
    const normalizedScore = 300 + (score / 100) * 550;

    return {
      score: normalizedScore,
      weight: this.WEIGHTS.businessStability,
      contribution: (score / 100) * this.WEIGHTS.businessStability,
      factors
    };
  }

  // ===========================
  // ALTERNATIVE DATA SCORING
  // ===========================

  private scoreAlternativeData(data: AlternativeData): ComponentScore {
    const factors: string[] = [];
    let score = 0;

    // Banking behavior (35%)
    const bankingScore = this.scoreBankingBehavior(data.bankingBehavior);
    score += bankingScore * 0.35;
    
    if (data.bankingBehavior.overdrafts === 0 && data.bankingBehavior.nsf === 0) {
      factors.push('Excellent banking behavior');
    }
    if (data.bankingBehavior.cashFlowVolatility < 0.2) {
      factors.push('Consistent cash flow');
    }

    // Business metrics (25%)
    const metricsScore = this.scoreBusinessMetrics(data.businessMetrics);
    score += metricsScore * 0.25;
    
    if (data.businessMetrics.onlineReviews.averageRating > 4.0) {
      factors.push('Strong customer satisfaction');
    }

    // Digital footprint (20%)
    const digitalScore = this.scoreDigitalFootprint(data.digitalFootprint);
    score += digitalScore * 0.20;
    
    if (data.digitalFootprint.domainAge > 3) {
      factors.push('Established online presence');
    }

    // Supplier relationships (10%)
    const supplierScore = this.scoreSupplierRelationships(data.supplierRelationships);
    score += supplierScore * 0.10;

    // Customer behavior (10%)
    const customerScore = this.scoreCustomerBehavior(data.customerBehavior);
    score += customerScore * 0.10;
    
    if (data.customerBehavior.repeatCustomerRate > 0.5) {
      factors.push('High customer retention');
    }

    // Normalize to 300-850 range
    const normalizedScore = 300 + (score / 100) * 550;

    return {
      score: normalizedScore,
      weight: this.WEIGHTS.alternativeData,
      contribution: (score / 100) * this.WEIGHTS.alternativeData,
      factors
    };
  }

  private scoreBankingBehavior(data: BankingBehavior): number {
    let score = 100;

    // Penalize overdrafts and NSF
    score -= data.overdrafts * 5;
    score -= data.nsf * 10;

    // Reward consistent deposits
    score += Math.min(20, data.depositConsistency * 20);

    // Penalize cash flow volatility
    score -= data.cashFlowVolatility * 30;

    // Reward healthy balances
    if (data.averageDailyBalance > 10000) score += 10;
    if (data.minimumBalance > 5000) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private scoreBusinessMetrics(data: BusinessMetrics): number {
    let score = 0;

    // Online reviews
    const reviewScore = (data.onlineReviews.averageRating / 5) * 40;
    score += reviewScore;

    // Social media presence
    const socialScore = Math.min(30, (data.socialMediaPresence.followers / 10000) * 30);
    score += socialScore;

    // Website traffic
    const trafficScore = Math.min(30, (data.websiteTraffic / 100000) * 30);
    score += trafficScore;

    return Math.min(100, score);
  }

  private scoreDigitalFootprint(data: DigitalFootprint): number {
    let score = 0;

    score += Math.min(40, (data.domainAge / 10) * 40);
    score += data.websiteQuality * 30;
    score += data.sslCertificate ? 10 : 0;
    score += Math.min(20, (data.businessListings / 10) * 20);

    return Math.min(100, score);
  }

  private scoreSupplierRelationships(data: SupplierRelationships): number {
    let score = 50;

    score += Math.min(25, (data.numberOfSuppliers / 10) * 25);
    score += data.paymentTermsNegotiated ? 10 : 0;
    score += Math.min(15, (data.tradeReferences / 5) * 15);

    // Reward fast payments
    if (data.averagePaymentDays < 30) score += 10;
    else if (data.averagePaymentDays > 60) score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  private scoreCustomerBehavior(data: CustomerBehavior): number {
    let score = 0;

    score += data.repeatCustomerRate * 40;
    score += Math.min(30, (data.customerLifetimeValue / 10000) * 30);
    score += Math.max(0, (1 - data.churnRate) * 30);

    return Math.min(100, score);
  }

  // ===========================
  // INDUSTRY RISK SCORING
  // ===========================

  private async scoreIndustryRisk(industry: string): Promise<ComponentScore> {
    const factors: string[] = [];
    
    // Industry risk scores (lower = higher risk)
    const industryRiskScores: Record<string, number> = {
      'technology': 75,
      'healthcare': 80,
      'financial_services': 70,
      'retail': 55,
      'food_service': 50,
      'construction': 45,
      'transportation': 60,
      'manufacturing': 65,
      'professional_services': 85,
      'education': 80,
      'real_estate': 55,
      'hospitality': 40,
      'default': 60
    };

    const riskScore = industryRiskScores[industry] || industryRiskScores.default;
    
    if (riskScore >= 75) {
      factors.push('Low-risk industry');
    } else if (riskScore <= 50) {
      factors.push('High-risk industry');
    }

    // Normalize to 300-850 range
    const normalizedScore = 300 + (riskScore / 100) * 550;

    return {
      score: normalizedScore,
      weight: this.WEIGHTS.industryRisk,
      contribution: (riskScore / 100) * this.WEIGHTS.industryRisk,
      factors
    };
  }

  // ===========================
  // OVERALL SCORE CALCULATION
  // ===========================

  private calculateOverallScore(components: Record<string, ComponentScore>): number {
    let weightedSum = 0;

    for (const component of Object.values(components)) {
      weightedSum += (component.score / 850) * component.weight;
    }

    // Convert back to 300-850 scale
    return 300 + (weightedSum * 550);
  }

  // ===========================
  // ML-BASED DEFAULT PREDICTION
  // ===========================

  private async predictDefaultProbability(application: CreditApplication): Promise<number> {
    // Simplified ML model using logistic regression
    const features = [
      application.traditionalCredit.personalCreditScore / 850,
      application.financialData.profitMargin,
      application.businessInfo.yearsInBusiness / 10,
      1 - (application.traditionalCredit.creditUtilization / 100),
      application.financialData.revenueGrowthRate,
      application.alternativeData.bankingBehavior.cashFlowVolatility,
      application.alternativeData.customerBehavior.repeatCustomerRate
    ];

    const weights = [0.25, 0.20, 0.15, 0.10, 0.10, -0.10, 0.10];
    const bias = -2.0;

    let logit = bias;
    for (let i = 0; i < features.length; i++) {
      logit += features[i] * weights[i];
    }

    // Sigmoid function
    const probability = 1 / (1 + Math.exp(-logit));

    return Math.max(0.01, Math.min(0.99, probability));
  }

  // ===========================
  // RATING & RISK DETERMINATION
  // ===========================

  private determineRating(score: number): CreditScore['rating'] {
    if (score >= 800) return 'A+';
    if (score >= 750) return 'A';
    if (score >= 700) return 'B+';
    if (score >= 650) return 'B';
    if (score >= 600) return 'C+';
    if (score >= 550) return 'C';
    if (score >= 500) return 'D';
    return 'F';
  }

  private determineRiskCategory(probability: number): CreditScore['riskCategory'] {
    if (probability < 0.05) return 'very_low';
    if (probability < 0.15) return 'low';
    if (probability < 0.30) return 'medium';
    if (probability < 0.50) return 'high';
    return 'very_high';
  }

  // ===========================
  // RECOMMENDATION GENERATION
  // ===========================

  private generateRecommendation(
    application: CreditApplication,
    score: number,
    defaultProbability: number,
    components: Record<string, ComponentScore>
  ): LoanRecommendation {
    const loanAmount = application.loanRequest.amount;
    const annualRevenue = application.financialData.annualRevenue;
    const cashReserves = application.financialData.cashReserves;

    let decision: LoanRecommendation['decision'];
    let maxLoanAmount: number;
    let suggestedInterestRate: number;
    let requiredCollateral: number;
    const conditions: string[] = [];

    if (score >= 700 && defaultProbability < 0.15) {
      decision = 'approve';
      maxLoanAmount = Math.min(loanAmount, annualRevenue * 0.25);
      suggestedInterestRate = 6.5 + (1 - score / 850) * 3;
      requiredCollateral = 0;
    } else if (score >= 600 && defaultProbability < 0.30) {
      decision = 'approve_with_conditions';
      maxLoanAmount = Math.min(loanAmount, annualRevenue * 0.20);
      suggestedInterestRate = 8.5 + (1 - score / 850) * 4;
      requiredCollateral = maxLoanAmount * 0.5;
      
      conditions.push('Personal guarantee required');
      conditions.push('Quarterly financial reporting');
      if (components.traditionalCredit.score < 650) {
        conditions.push('Improve personal credit score to 650+');
      }
      if (cashReserves < application.financialData.monthlyExpenses * 3) {
        conditions.push('Maintain 3 months cash reserves');
      }
    } else if (score >= 500 && defaultProbability < 0.50) {
      decision = 'review';
      maxLoanAmount = Math.min(loanAmount, annualRevenue * 0.15);
      suggestedInterestRate = 12.0 + (1 - score / 850) * 5;
      requiredCollateral = maxLoanAmount * 0.8;
      
      conditions.push('Requires manual underwriting review');
      conditions.push('Additional documentation needed');
    } else {
      decision = 'decline';
      maxLoanAmount = 0;
      suggestedInterestRate = 0;
      requiredCollateral = 0;
    }

    const reasoning = this.generateRecommendationReasoning(
      decision,
      score,
      defaultProbability,
      components
    );

    return {
      decision,
      maxLoanAmount,
      suggestedInterestRate,
      suggestedTerm: application.loanRequest.term,
      requiredCollateral,
      conditions,
      reasoning
    };
  }

  private generateRecommendationReasoning(
    decision: string,
    score: number,
    defaultProbability: number,
    components: Record<string, ComponentScore>
  ): string {
    const reasons: string[] = [];

    if (decision === 'approve') {
      reasons.push(`Strong credit profile with score of ${Math.round(score)}`);
      reasons.push(`Low default probability (${(defaultProbability * 100).toFixed(1)}%)`);
      
      if (components.traditionalCredit.score >= 750) {
        reasons.push('Excellent traditional credit history');
      }
      if (components.financialHealth.score >= 700) {
        reasons.push('Strong financial health indicators');
      }
    } else if (decision === 'approve_with_conditions') {
      reasons.push(`Moderate credit profile with score of ${Math.round(score)}`);
      reasons.push(`Manageable default risk (${(defaultProbability * 100).toFixed(1)}%)`);
      reasons.push('Conditions will mitigate risk exposure');
    } else if (decision === 'review') {
      reasons.push(`Credit score of ${Math.round(score)} requires additional review`);
      reasons.push(`Default probability of ${(defaultProbability * 100).toFixed(1)}% is elevated`);
      reasons.push('Manual underwriting recommended for final decision');
    } else {
      reasons.push(`Credit score of ${Math.round(score)} falls below minimum threshold`);
      reasons.push(`High default probability (${(defaultProbability * 100).toFixed(1)}%)`);
      reasons.push('Recommend reapplication after addressing key issues');
    }

    return reasons.join('. ');
  }

  // ===========================
  // KEY FACTORS EXTRACTION
  // ===========================

  private extractKeyFactors(
    application: CreditApplication,
    components: Record<string, ComponentScore>
  ): { positive: Factor[]; negative: Factor[] } {
    const positive: Factor[] = [];
    const negative: Factor[] = [];

    // Traditional credit factors
    if (application.traditionalCredit.personalCreditScore >= 750) {
      positive.push({
        factor: 'Excellent Personal Credit',
        impact: 0.15,
        description: `Personal credit score of ${application.traditionalCredit.personalCreditScore} demonstrates strong creditworthiness`
      });
    } else if (application.traditionalCredit.personalCreditScore < 600) {
      negative.push({
        factor: 'Poor Personal Credit',
        impact: -0.20,
        description: `Personal credit score of ${application.traditionalCredit.personalCreditScore} indicates credit risk`
      });
    }

    // Payment history
    const latePayments = application.traditionalCredit.paymentHistory.filter(
      p => p.paymentStatus !== 'current'
    ).length;
    if (latePayments === 0) {
      positive.push({
        factor: 'Perfect Payment History',
        impact: 0.12,
        description: 'No late payments across all tradelines'
      });
    } else if (latePayments > 3) {
      negative.push({
        factor: 'Multiple Late Payments',
        impact: -0.15,
        description: `${latePayments} accounts with payment delays`
      });
    }

    // Financial health factors
    if (application.financialData.profitMargin > 0.15) {
      positive.push({
        factor: 'Strong Profitability',
        impact: 0.10,
        description: `Profit margin of ${(application.financialData.profitMargin * 100).toFixed(1)}% indicates healthy operations`
      });
    } else if (application.financialData.profitMargin < 0.05) {
      negative.push({
        factor: 'Low Profitability',
        impact: -0.12,
        description: `Profit margin of ${(application.financialData.profitMargin * 100).toFixed(1)}% is below industry standards`
      });
    }

    // Revenue growth
    if (application.financialData.revenueGrowthRate > 0.20) {
      positive.push({
        factor: 'Strong Growth Trajectory',
        impact: 0.08,
        description: `${(application.financialData.revenueGrowthRate * 100).toFixed(0)}% year-over-year revenue growth`
      });
    } else if (application.financialData.revenueGrowthRate < 0) {
      negative.push({
        factor: 'Declining Revenue',
        impact: -0.10,
        description: `${(application.financialData.revenueGrowthRate * 100).toFixed(0)}% revenue decline year-over-year`
      });
    }

    // Cash reserves
    const monthsOfRunway = application.financialData.cashReserves / application.financialData.monthlyExpenses;
    if (monthsOfRunway > 6) {
      positive.push({
        factor: 'Strong Cash Position',
        impact: 0.08,
        description: `${monthsOfRunway.toFixed(1)} months of cash runway`
      });
    } else if (monthsOfRunway < 3) {
      negative.push({
        factor: 'Limited Cash Reserves',
        impact: -0.10,
        description: `Only ${monthsOfRunway.toFixed(1)} months of operating capital`
      });
    }

    // Business stability
    if (application.businessInfo.yearsInBusiness >= 5) {
      positive.push({
        factor: 'Established Business',
        impact: 0.10,
        description: `${application.businessInfo.yearsInBusiness} years of operating history`
      });
    } else if (application.businessInfo.yearsInBusiness < 2) {
      negative.push({
        factor: 'Limited Operating History',
        impact: -0.08,
        description: `Only ${application.businessInfo.yearsInBusiness} years in business`
      });
    }

    // Sort by impact
    positive.sort((a, b) => b.impact - a.impact);
    negative.sort((a, b) => a.impact - b.impact);

    return {
      positive: positive.slice(0, 5),
      negative: negative.slice(0, 5)
    };
  }

  // ===========================
  // EXPLAINABILITY & SHAP VALUES
  // ===========================

  private async generateExplainability(
    application: CreditApplication,
    score: number
  ): Promise<Explainability> {
    // SHAP (SHapley Additive exPlanations) values
    const shapValues = {
      'personal_credit_score': this.calculateShapValue(application.traditionalCredit.personalCreditScore, 300, 850, 0.15),
      'business_credit_score': this.calculateShapValue(application.traditionalCredit.businessCreditScore, 0, 100, 0.10),
      'payment_history': this.calculateShapValue(
        application.traditionalCredit.paymentHistory.filter(p => p.paymentStatus === 'current').length,
        0,
        application.traditionalCredit.paymentHistory.length,
        0.12
      ),
      'profit_margin': this.calculateShapValue(application.financialData.profitMargin * 100, 0, 30, 0.10),
      'revenue_growth': this.calculateShapValue(application.financialData.revenueGrowthRate * 100, -20, 50, 0.08),
      'years_in_business': this.calculateShapValue(application.businessInfo.yearsInBusiness, 0, 20, 0.08),
      'cash_reserves': this.calculateShapValue(
        application.financialData.cashReserves / application.financialData.monthlyExpenses,
        0,
        12,
        0.07
      ),
      'debt_to_equity': this.calculateShapValue(
        (application.financialData.liabilities / Math.max(1, application.financialData.assets - application.financialData.liabilities)) * -1,
        -5,
        0,
        0.06
      ),
      'banking_behavior': this.calculateShapValue(
        100 - (application.alternativeData.bankingBehavior.overdrafts * 10),
        0,
        100,
        0.05
      ),
      'customer_retention': this.calculateShapValue(
        application.alternativeData.customerBehavior.repeatCustomerRate * 100,
        0,
        100,
        0.04
      )
    };

    const featureImportance = this.calculateFeatureImportance(shapValues);
    const decisionPath = this.generateDecisionPath(application, score);
    const whatIfScenarios = this.generateWhatIfScenarios(application, score);

    return {
      shapValues,
      featureImportance,
      decisionPath,
      whatIfScenarios
    };
  }

  private calculateShapValue(
    actualValue: number,
    minValue: number,
    maxValue: number,
    weight: number
  ): number {
    const normalized = (actualValue - minValue) / (maxValue - minValue);
    const clampedNormalized = Math.max(0, Math.min(1, normalized));
    return (clampedNormalized - 0.5) * weight * 100;
  }

  private calculateFeatureImportance(shapValues: Record<string, number>): Record<string, number> {
    const totalAbsShap = Object.values(shapValues).reduce((sum, val) => sum + Math.abs(val), 0);
    const importance: Record<string, number> = {};

    for (const [feature, value] of Object.entries(shapValues)) {
      importance[feature] = Math.abs(value) / totalAbsShap;
    }

    return importance;
  }

  private generateDecisionPath(application: CreditApplication, score: number): string[] {
    const path: string[] = [];

    path.push('Application received and initial validation completed');
    path.push(`Traditional credit evaluation: Score ${application.traditionalCredit.personalCreditScore}/850`);
    path.push(`Financial health assessment: ${application.financialData.profitMargin > 0.10 ? 'Strong' : 'Moderate'} profitability`);
    path.push(`Business stability check: ${application.businessInfo.yearsInBusiness} years operating history`);
    path.push(`Alternative data analysis: Banking and customer metrics evaluated`);
    path.push(`Industry risk assessment: ${application.businessInfo.industry} sector analyzed`);
    path.push(`ML model prediction: Default probability calculated`);
    path.push(`Final credit score computed: ${Math.round(score)}/850`);
    
    if (score >= 700) {
      path.push('Decision: Approved for lending');
    } else if (score >= 600) {
      path.push('Decision: Approved with conditions');
    } else if (score >= 500) {
      path.push('Decision: Requires manual review');
    } else {
      path.push('Decision: Declined - recommend improvement plan');
    }

    return path;
  }

  private generateWhatIfScenarios(application: CreditApplication, currentScore: number): WhatIfScenario[] {
    const scenarios: WhatIfScenario[] = [];

    // Scenario 1: Improve personal credit score
    if (application.traditionalCredit.personalCreditScore < 750) {
      const targetScore = 750;
      const scoreDelta = (targetScore - application.traditionalCredit.personalCreditScore) / 850 * 0.15 * 550;
      scenarios.push({
        change: 'Improve personal credit score to 750+',
        currentValue: application.traditionalCredit.personalCreditScore,
        suggestedValue: 750,
        scoreImpact: Math.round(scoreDelta)
      });
    }

    // Scenario 2: Increase profit margin
    if (application.financialData.profitMargin < 0.15) {
      const scoreDelta = (0.15 - application.financialData.profitMargin) * 0.30 * 550;
      scenarios.push({
        change: 'Increase profit margin to 15%',
        currentValue: `${(application.financialData.profitMargin * 100).toFixed(1)}%`,
        suggestedValue: '15%',
        scoreImpact: Math.round(scoreDelta)
      });
    }

    // Scenario 3: Build cash reserves
    const currentRunway = application.financialData.cashReserves / application.financialData.monthlyExpenses;
    if (currentRunway < 6) {
      const scoreDelta = (6 - currentRunway) / 6 * 0.20 * 550;
      scenarios.push({
        change: 'Build cash reserves to 6 months',
        currentValue: `${currentRunway.toFixed(1)} months`,
        suggestedValue: '6 months',
        scoreImpact: Math.round(scoreDelta)
      });
    }

    // Scenario 4: Reduce credit utilization
    if (application.traditionalCredit.creditUtilization > 30) {
      const scoreDelta = (application.traditionalCredit.creditUtilization - 30) / 100 * 0.10 * 550;
      scenarios.push({
        change: 'Reduce credit utilization to 30%',
        currentValue: `${application.traditionalCredit.creditUtilization}%`,
        suggestedValue: '30%',
        scoreImpact: Math.round(scoreDelta)
      });
    }

    return scenarios.sort((a, b) => b.scoreImpact - a.scoreImpact).slice(0, 5);
  }

  // ===========================
  // CONFIDENCE CALCULATION
  // ===========================

  private calculateConfidence(application: CreditApplication): number {
    let confidence = 1.0;

    // Reduce confidence for missing data
    if (!application.traditionalCredit.businessCreditScore) confidence -= 0.05;
    if (application.businessInfo.yearsInBusiness < 2) confidence -= 0.10;
    if (application.traditionalCredit.paymentHistory.length < 3) confidence -= 0.05;
    
    // Reduce confidence for volatile metrics
    if (application.alternativeData.bankingBehavior.cashFlowVolatility > 0.5) confidence -= 0.10;
    if (application.financialData.revenueGrowthRate < 0) confidence -= 0.05;

    // Reduce confidence for high-risk industries
    const highRiskIndustries = ['food_service', 'hospitality', 'retail', 'construction'];
    if (highRiskIndustries.includes(application.businessInfo.industry)) confidence -= 0.05;

    return Math.max(0.5, Math.min(1.0, confidence));
  }
}
