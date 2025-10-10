import { AgentConfig, AgentContext, AgentResponse, AgentType } from '../../types';

/**
 * Credit Analyst Agent - Updated for new routing architecture
 * 
 * This functional agent provides specialized credit analysis, risk assessment,
 * and underwriting support. It works in collaboration with Co-Agents and other
 * functional agents to deliver comprehensive credit insights.
 */
export class CreditAnalystAgent {
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  async execute(context: AgentContext, options: any): Promise<AgentResponse> {
    // Analyze the task type and route to appropriate handler
    const taskType = options.taskType || this.identifyTaskType(context);
    
    switch (taskType) {
      case 'credit_assessment':
        return await this.assessCredit(context);
      case 'risk_analysis':
        return await this.analyzeRisk(context);
      case 'underwriting':
        return await this.underwriteLoan(context);
      case 'financial_analysis':
        return await this.analyzeFinancials(context);
      case 'collateral_analysis':
        return await this.analyzeCollateral(context);
      case 'compliance_review':
        return await this.reviewCompliance(context);
      default:
        return await this.generalCreditAdvice(context);
    }
  }

  private async assessCredit(context: AgentContext): Promise<AgentResponse> {
    const creditData = context.relevantData?.credit || {};
    
    const assessment = {
      creditScore: this.calculateCreditScore(creditData),
      riskLevel: this.assessRiskLevel(creditData),
      strengths: this.identifyCreditStrengths(creditData),
      weaknesses: this.identifyCreditWeaknesses(creditData),
      recommendations: this.generateCreditRecommendations(creditData),
      keyMetrics: this.extractCreditMetrics(creditData),
      paymentHistory: this.analyzePaymentHistory(creditData),
      debtCapacity: this.assessDebtCapacity(creditData)
    };

    return {
      content: `I've conducted a comprehensive credit assessment. Here's my analysis:

💳 **Credit Assessment**

**Credit Score: ${assessment.creditScore}/100**
**Risk Level: ${assessment.riskLevel}**

**📊 KEY METRICS:**
${assessment.keyMetrics.map((metric, i) => `${i + 1}. ${metric.name}: ${metric.value}`).join('\n')}

**✅ CREDIT STRENGTHS:**
${assessment.strengths.map((strength, i) => `${i + 1}. ${strength}`).join('\n')}

**⚠️ AREAS OF CONCERN:**
${assessment.weaknesses.map((weakness, i) => `${i + 1}. ${weakness}`).join('\n')}

**📈 PAYMENT HISTORY:**
${assessment.paymentHistory}

**💰 DEBT CAPACITY:**
${assessment.debtCapacity}

**💡 CREDIT RECOMMENDATIONS:**

${assessment.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**Summary:**
• Credit Score: ${assessment.creditScore}/100
• Risk Level: ${assessment.riskLevel}
• Payment History: ${assessment.paymentHistory}
• Debt Capacity: ${assessment.debtCapacity}

**Next Steps:**
1. ${assessment.creditScore > 70 ? 'Proceed with credit application' : 'Address credit concerns first'}
2. Implement recommendations
3. Monitor credit metrics
4. Regular credit reviews

Would you like me to help you develop a credit improvement strategy?`,

      suggestions: [
        "Develop credit improvement plan",
        "Address credit concerns",
        "Monitor credit metrics",
        "Optimize debt structure",
        "Build credit history"
      ],

      actions: [
        {
          type: 'credit_improvement_plan',
          label: 'Create Credit Improvement Plan'
        },
        {
          type: 'debt_optimization',
          label: 'Optimize Debt Structure'
        },
        {
          type: 'credit_monitoring',
          label: 'Set Up Credit Monitoring'
        }
      ],

      insights: [
        {
          type: 'recommendation',
          title: 'Credit Assessment',
          description: `Credit score: ${assessment.creditScore}/100 - ${assessment.creditScore > 70 ? 'Good' : 'Needs improvement'}`,
          priority: 'high',
          actionable: true
        }
      ]
    };
  }

  private async analyzeRisk(context: AgentContext): Promise<AgentResponse> {
    const riskData = context.relevantData?.risk || {};
    
    const riskAnalysis = {
      overallRisk: this.calculateOverallRisk(riskData),
      riskFactors: this.identifyRiskFactors(riskData),
      riskCategories: this.categorizeRisks(riskData),
      mitigationStrategies: this.developMitigationStrategies(riskData),
      recommendations: this.generateRiskRecommendations(riskData),
      monitoring: this.suggestRiskMonitoring(riskData),
      metrics: this.extractRiskMetrics(riskData)
    };

    return {
      content: `I've conducted a comprehensive risk analysis. Here's my assessment:

⚠️ **Risk Analysis**

**Overall Risk Level: ${riskAnalysis.overallRisk}**

**📊 RISK METRICS:**
${riskAnalysis.metrics.map((metric, i) => `${i + 1}. ${metric.name}: ${metric.value}`).join('\n')}

**🔍 IDENTIFIED RISK FACTORS:**
${riskAnalysis.riskFactors.map((factor, i) => `${i + 1}. ${factor}`).join('\n')}

**📋 RISK CATEGORIES:**
${riskAnalysis.riskCategories.map((category, i) => `${i + 1}. ${category}`).join('\n')}

**🛡️ MITIGATION STRATEGIES:**

${riskAnalysis.mitigationStrategies.map((strategy, i) => `${i + 1}. ${strategy}`).join('\n')}

**💡 RISK RECOMMENDATIONS:**

${riskAnalysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**📈 RISK MONITORING:**
${riskAnalysis.monitoring}

**Risk Summary:**
• Risk Level: ${riskAnalysis.overallRisk}
• Key Factors: ${riskAnalysis.riskFactors.slice(0, 3).join(', ')}
• Mitigation Priority: High

**Next Steps:**
1. Implement mitigation strategies
2. Set up risk monitoring
3. Develop contingency plans
4. Regular risk assessments

Would you like me to help you develop a comprehensive risk management strategy?`,

      suggestions: [
        "Develop risk management plan",
        "Implement mitigation strategies",
        "Set up risk monitoring",
        "Create contingency plans",
        "Conduct regular risk assessments"
      ],

      actions: [
        {
          type: 'risk_management_plan',
          label: 'Create Risk Management Plan'
        },
        {
          type: 'mitigation_strategies',
          label: 'Implement Mitigation'
        },
        {
          type: 'risk_monitoring',
          label: 'Set Up Risk Monitoring'
        }
      ]
    };
  }

  private async underwriteLoan(context: AgentContext): Promise<AgentResponse> {
    const loanData = context.relevantData?.loan || {};
    
    const underwriting = {
      loanScore: this.calculateLoanScore(loanData),
      approvalRecommendation: this.generateApprovalRecommendation(loanData),
      loanTerms: this.suggestLoanTerms(loanData),
      conditions: this.identifyLoanConditions(loanData),
      collateral: this.assessCollateral(loanData),
      repaymentCapacity: this.assessRepaymentCapacity(loanData),
      recommendations: this.generateUnderwritingRecommendations(loanData),
      metrics: this.extractUnderwritingMetrics(loanData)
    };

    return {
      content: `I've completed a comprehensive loan underwriting analysis. Here's my assessment:

🏦 **Loan Underwriting**

**Loan Score: ${underwriting.loanScore}/100**
**Recommendation: ${underwriting.approvalRecommendation}**

**📊 UNDERWRITING METRICS:**
${underwriting.metrics.map((metric, i) => `${i + 1}. ${metric.name}: ${metric.value}`).join('\n')}

**💰 SUGGESTED LOAN TERMS:**
${underwriting.loanTerms}

**📋 LOAN CONDITIONS:**
${underwriting.conditions.map((condition, i) => `${i + 1}. ${condition}`).join('\n')}

**🏠 COLLATERAL ASSESSMENT:**
${underwriting.collateral}

**💳 REPAYMENT CAPACITY:**
${underwriting.repaymentCapacity}

**💡 UNDERWRITING RECOMMENDATIONS:**

${underwriting.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**Summary:**
• Loan Score: ${underwriting.loanScore}/100
• Recommendation: ${underwriting.approvalRecommendation}
• Loan Terms: ${underwriting.loanTerms}
• Conditions: ${underwriting.conditions.length} conditions

**Next Steps:**
1. ${underwriting.loanScore > 70 ? 'Proceed with loan approval' : 'Address underwriting concerns'}
2. Implement loan conditions
3. Monitor loan performance
4. Regular loan reviews

Would you like me to help you develop a loan monitoring strategy?`,

      suggestions: [
        "Develop loan monitoring strategy",
        "Address underwriting concerns",
        "Implement loan conditions",
        "Monitor loan performance",
        "Optimize loan terms"
      ],

      actions: [
        {
          type: 'loan_monitoring',
          label: 'Set Up Loan Monitoring'
        },
        {
          type: 'loan_conditions',
          label: 'Implement Loan Conditions'
        },
        {
          type: 'loan_optimization',
          label: 'Optimize Loan Terms'
        }
      ]
    };
  }

  private async analyzeFinancials(context: AgentContext): Promise<AgentResponse> {
    const financials = context.relevantData?.financials || {};
    
    const analysis = {
      financialHealth: this.assessFinancialHealth(financials),
      cashFlow: this.analyzeCashFlow(financials),
      profitability: this.assessProfitability(financials),
      liquidity: this.assessLiquidity(financials),
      leverage: this.assessLeverage(financials),
      trends: this.identifyFinancialTrends(financials),
      recommendations: this.generateFinancialRecommendations(financials),
      metrics: this.extractFinancialMetrics(financials)
    };

    return {
      content: `I've conducted a comprehensive financial analysis. Here's my assessment:

📊 **Financial Analysis**

**Financial Health: ${analysis.financialHealth}**

**📈 KEY METRICS:**
${analysis.metrics.map((metric, i) => `${i + 1}. ${metric.name}: ${metric.value}`).join('\n')}

**💰 CASH FLOW ANALYSIS:**
${analysis.cashFlow}

**📊 PROFITABILITY ASSESSMENT:**
${analysis.profitability}

**💧 LIQUIDITY ANALYSIS:**
${analysis.liquidity}

**⚖️ LEVERAGE ASSESSMENT:**
${analysis.leverage}

**📈 FINANCIAL TRENDS:**
${analysis.trends.map((trend, i) => `${i + 1}. ${trend}`).join('\n')}

**💡 FINANCIAL RECOMMENDATIONS:**

${analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**Summary:**
• Financial Health: ${analysis.financialHealth}
• Cash Flow: ${analysis.cashFlow}
• Profitability: ${analysis.profitability}
• Liquidity: ${analysis.liquidity}

**Next Steps:**
1. ${analysis.financialHealth === 'Strong' ? 'Continue current financial management' : 'Address financial concerns'}
2. Implement recommendations
3. Monitor financial metrics
4. Regular financial reviews

Would you like me to help you develop a financial improvement strategy?`,

      suggestions: [
        "Develop financial improvement plan",
        "Address financial concerns",
        "Monitor financial metrics",
        "Optimize cash flow",
        "Improve profitability"
      ],

      actions: [
        {
          type: 'financial_improvement_plan',
          label: 'Create Financial Improvement Plan'
        },
        {
          type: 'cash_flow_optimization',
          label: 'Optimize Cash Flow'
        },
        {
          type: 'profitability_improvement',
          label: 'Improve Profitability'
        }
      ]
    };
  }

  private async analyzeCollateral(context: AgentContext): Promise<AgentResponse> {
    const collateralData = context.relevantData?.collateral || {};
    
    const analysis = {
      collateralValue: this.assessCollateralValue(collateralData),
      collateralQuality: this.assessCollateralQuality(collateralData),
      liquidity: this.assessCollateralLiquidity(collateralData),
      risks: this.identifyCollateralRisks(collateralData),
      recommendations: this.generateCollateralRecommendations(collateralData),
      metrics: this.extractCollateralMetrics(collateralData)
    };

    return {
      content: `I've conducted a comprehensive collateral analysis. Here's my assessment:

🏠 **Collateral Analysis**

**Collateral Value: ${analysis.collateralValue}**
**Collateral Quality: ${analysis.collateralQuality}**

**📊 COLLATERAL METRICS:**
${analysis.metrics.map((metric, i) => `${i + 1}. ${metric.name}: ${metric.value}`).join('\n')}

**💧 COLLATERAL LIQUIDITY:**
${analysis.liquidity}

**⚠️ COLLATERAL RISKS:**
${analysis.risks.map((risk, i) => `${i + 1}. ${risk}`).join('\n')}

**💡 COLLATERAL RECOMMENDATIONS:**

${analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**Summary:**
• Collateral Value: ${analysis.collateralValue}
• Collateral Quality: ${analysis.collateralQuality}
• Liquidity: ${analysis.liquidity}
• Risks: ${analysis.risks.length} identified

**Next Steps:**
1. ${analysis.collateralQuality === 'High' ? 'Proceed with collateral-based lending' : 'Address collateral concerns'}
2. Implement recommendations
3. Monitor collateral value
4. Regular collateral reviews

Would you like me to help you develop a collateral monitoring strategy?`,

      suggestions: [
        "Develop collateral monitoring strategy",
        "Address collateral concerns",
        "Monitor collateral value",
        "Optimize collateral portfolio",
        "Manage collateral risks"
      ],

      actions: [
        {
          type: 'collateral_monitoring',
          label: 'Set Up Collateral Monitoring'
        },
        {
          type: 'collateral_optimization',
          label: 'Optimize Collateral Portfolio'
        },
        {
          type: 'collateral_risk_management',
          label: 'Manage Collateral Risks'
        }
      ]
    };
  }

  private async reviewCompliance(context: AgentContext): Promise<AgentResponse> {
    const complianceData = context.relevantData?.compliance || {};
    
    const review = {
      complianceScore: this.calculateComplianceScore(complianceData),
      complianceStatus: this.assessComplianceStatus(complianceData),
      violations: this.identifyViolations(complianceData),
      requirements: this.identifyRequirements(complianceData),
      recommendations: this.generateComplianceRecommendations(complianceData),
      monitoring: this.suggestComplianceMonitoring(complianceData),
      metrics: this.extractComplianceMetrics(complianceData)
    };

    return {
      content: `I've completed a comprehensive compliance review. Here's my assessment:

⚖️ **Compliance Review**

**Compliance Score: ${review.complianceScore}/100**
**Compliance Status: ${review.complianceStatus}**

**📊 COMPLIANCE METRICS:**
${review.metrics.map((metric, i) => `${i + 1}. ${metric.name}: ${metric.value}`).join('\n')}

**🚨 IDENTIFIED VIOLATIONS:**
${review.violations.map((violation, i) => `${i + 1}. ${violation}`).join('\n')}

**📋 COMPLIANCE REQUIREMENTS:**
${review.requirements.map((requirement, i) => `${i + 1}. ${requirement}`).join('\n')}

**💡 COMPLIANCE RECOMMENDATIONS:**

${review.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**📈 COMPLIANCE MONITORING:**
${review.monitoring}

**Summary:**
• Compliance Score: ${review.complianceScore}/100
• Status: ${review.complianceStatus}
• Violations: ${review.violations.length}
• Requirements: ${review.requirements.length}

**Next Steps:**
1. ${review.complianceScore > 80 ? 'Maintain compliance standards' : 'Address compliance violations'}
2. Implement recommendations
3. Set up monitoring systems
4. Regular compliance audits

Would you like me to help you develop a compliance management strategy?`,

      suggestions: [
        "Develop compliance management strategy",
        "Address compliance violations",
        "Set up monitoring systems",
        "Conduct regular audits",
        "Train staff on compliance"
      ],

      actions: [
        {
          type: 'compliance_management',
          label: 'Create Compliance Management Plan'
        },
        {
          type: 'compliance_monitoring',
          label: 'Set Up Compliance Monitoring'
        },
        {
          type: 'compliance_training',
          label: 'Implement Compliance Training'
        }
      ]
    };
  }

  private async generalCreditAdvice(context: AgentContext): Promise<AgentResponse> {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.content || '';
    
    return {
      content: `I'm here to help you with your credit analysis needs. Based on your query, here's how I can assist:

💳 **Credit Analysis Services**

I can help you with:
• Credit assessment and scoring
• Risk analysis and management
• Loan underwriting and approval
• Financial analysis and review
• Collateral analysis and valuation
• Compliance review and monitoring

**What specific credit analysis would you like me to conduct?**

I can provide detailed analysis and recommendations for any aspect of your credit decisions. Just let me know what you'd like to focus on, and I'll dive deep into that area.`,

      suggestions: [
        "Assess creditworthiness",
        "Analyze credit risk",
        "Underwrite a loan",
        "Review financials",
        "Analyze collateral"
      ],

      actions: [
        {
          type: 'credit_assessment',
          label: 'Conduct Credit Assessment'
        },
        {
          type: 'risk_analysis',
          label: 'Perform Risk Analysis'
        }
      ]
    };
  }

  // Private helper methods

  private identifyTaskType(context: AgentContext): string {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.content || '';
    
    if (/credit|creditworthiness|score/i.test(lastMessage)) return 'credit_assessment';
    if (/risk|risky|danger/i.test(lastMessage)) return 'risk_analysis';
    if (/loan|underwrite|approve/i.test(lastMessage)) return 'underwriting';
    if (/financial|revenue|profit/i.test(lastMessage)) return 'financial_analysis';
    if (/collateral|security|asset/i.test(lastMessage)) return 'collateral_analysis';
    if (/compliance|regulatory|legal/i.test(lastMessage)) return 'compliance_review';
    
    return 'general_credit_advice';
  }

  private calculateCreditScore(creditData: any): number {
    let score = 50; // Base score
    
    if (creditData.paymentHistory) score += 20;
    if (creditData.creditUtilization < 0.3) score += 15;
    if (creditData.creditHistory > 5) score += 10;
    if (creditData.creditMix) score += 5;
    
    return Math.min(score, 100);
  }

  private assessRiskLevel(creditData: any): string {
    const score = this.calculateCreditScore(creditData);
    
    if (score > 80) return 'Low Risk';
    if (score > 60) return 'Moderate Risk';
    return 'High Risk';
  }

  private identifyCreditStrengths(creditData: any): string[] {
    const strengths = [];
    
    if (creditData.paymentHistory) strengths.push('Excellent payment history');
    if (creditData.creditUtilization < 0.3) strengths.push('Low credit utilization');
    if (creditData.creditHistory > 5) strengths.push('Long credit history');
    if (creditData.creditMix) strengths.push('Diverse credit mix');
    
    return strengths.length > 0 ? strengths : ['Good credit fundamentals'];
  }

  private identifyCreditWeaknesses(creditData: any): string[] {
    const weaknesses = [];
    
    if (!creditData.paymentHistory) weaknesses.push('Limited payment history');
    if (creditData.creditUtilization > 0.7) weaknesses.push('High credit utilization');
    if (creditData.creditHistory < 2) weaknesses.push('Short credit history');
    if (!creditData.creditMix) weaknesses.push('Limited credit mix');
    
    return weaknesses.length > 0 ? weaknesses : ['Minor areas for improvement'];
  }

  private generateCreditRecommendations(creditData: any): string[] {
    return [
      'Maintain low credit utilization',
      'Make payments on time',
      'Diversify credit mix',
      'Monitor credit reports regularly'
    ];
  }

  private extractCreditMetrics(creditData: any): any[] {
    return [
      { name: 'Credit Score', value: this.calculateCreditScore(creditData) },
      { name: 'Credit Utilization', value: `${(creditData.creditUtilization || 0) * 100}%` },
      { name: 'Credit History', value: `${creditData.creditHistory || 0} years` },
      { name: 'Credit Mix', value: creditData.creditMix ? 'Diverse' : 'Limited' }
    ];
  }

  private analyzePaymentHistory(creditData: any): string {
    return creditData.paymentHistory ? 'Excellent payment history' : 'Limited payment history';
  }

  private assessDebtCapacity(creditData: any): string {
    const utilization = creditData.creditUtilization || 0;
    if (utilization < 0.3) return 'High debt capacity';
    if (utilization < 0.5) return 'Moderate debt capacity';
    return 'Low debt capacity';
  }

  private calculateOverallRisk(riskData: any): string {
    const risk = riskData.overallRisk || 0.6;
    if (risk > 0.8) return 'High Risk';
    if (risk > 0.5) return 'Moderate Risk';
    return 'Low Risk';
  }

  private identifyRiskFactors(riskData: any): string[] {
    return [
      'Credit risk',
      'Market risk',
      'Operational risk',
      'Liquidity risk'
    ];
  }

  private categorizeRisks(riskData: any): string[] {
    return [
      'Credit Risk',
      'Market Risk',
      'Operational Risk',
      'Liquidity Risk'
    ];
  }

  private developMitigationStrategies(riskData: any): string[] {
    return [
      'Diversify credit portfolio',
      'Implement risk monitoring',
      'Develop contingency plans',
      'Regular risk assessments'
    ];
  }

  private generateRiskRecommendations(riskData: any): string[] {
    return [
      'Implement risk management framework',
      'Diversify risk exposure',
      'Monitor risk metrics',
      'Develop risk mitigation strategies'
    ];
  }

  private suggestRiskMonitoring(riskData: any): string {
    return 'Set up regular risk monitoring and reporting';
  }

  private extractRiskMetrics(riskData: any): any[] {
    return [
      { name: 'Overall Risk', value: riskData.overallRisk || 0 },
      { name: 'Credit Risk', value: riskData.creditRisk || 0 },
      { name: 'Market Risk', value: riskData.marketRisk || 0 },
      { name: 'Operational Risk', value: riskData.operationalRisk || 0 }
    ];
  }

  private calculateLoanScore(loanData: any): number {
    let score = 50; // Base score
    
    if (loanData.creditScore > 700) score += 20;
    if (loanData.debtToIncome < 0.4) score += 15;
    if (loanData.employmentHistory > 2) score += 10;
    if (loanData.collateral) score += 5;
    
    return Math.min(score, 100);
  }

  private generateApprovalRecommendation(loanData: any): string {
    const score = this.calculateLoanScore(loanData);
    
    if (score > 80) return 'Strong approval recommendation';
    if (score > 60) return 'Approval with conditions';
    if (score > 40) return 'Approval with significant conditions';
    return 'Not recommended for approval';
  }

  private suggestLoanTerms(loanData: any): string {
    const score = this.calculateLoanScore(loanData);
    
    if (score > 80) return 'Favorable terms with low interest rate';
    if (score > 60) return 'Standard terms with moderate interest rate';
    return 'Conservative terms with higher interest rate';
  }

  private identifyLoanConditions(loanData: any): string[] {
    return [
      'Maintain credit score above 650',
      'Provide regular financial statements',
      'Maintain employment',
      'Keep debt-to-income ratio below 40%'
    ];
  }

  private assessCollateral(loanData: any): string {
    return loanData.collateral ? 'Adequate collateral provided' : 'Additional collateral required';
  }

  private assessRepaymentCapacity(loanData: any): string {
    const dti = loanData.debtToIncome || 0;
    if (dti < 0.3) return 'Strong repayment capacity';
    if (dti < 0.4) return 'Good repayment capacity';
    return 'Limited repayment capacity';
  }

  private generateUnderwritingRecommendations(loanData: any): string[] {
    return [
      'Monitor credit score regularly',
      'Maintain stable employment',
      'Keep debt levels manageable',
      'Provide regular financial updates'
    ];
  }

  private extractUnderwritingMetrics(loanData: any): any[] {
    return [
      { name: 'Loan Score', value: this.calculateLoanScore(loanData) },
      { name: 'Debt-to-Income', value: `${(loanData.debtToIncome || 0) * 100}%` },
      { name: 'Credit Score', value: loanData.creditScore || 0 },
      { name: 'Employment History', value: `${loanData.employmentHistory || 0} years` }
    ];
  }

  private assessFinancialHealth(financials: any): string {
    const health = financials.health || 0.7;
    if (health > 0.8) return 'Strong';
    if (health > 0.6) return 'Good';
    return 'Needs improvement';
  }

  private analyzeCashFlow(financials: any): string {
    const cashFlow = financials.cashFlow || 0;
    if (cashFlow > 0) return 'Positive cash flow';
    return 'Negative cash flow';
  }

  private assessProfitability(financials: any): string {
    const margin = financials.margin || 0.1;
    if (margin > 0.2) return 'Highly profitable';
    if (margin > 0.1) return 'Moderately profitable';
    return 'Low profitability';
  }

  private assessLiquidity(financials: any): string {
    const ratio = financials.currentRatio || 1.5;
    if (ratio > 2) return 'High liquidity';
    if (ratio > 1) return 'Adequate liquidity';
    return 'Low liquidity';
  }

  private assessLeverage(financials: any): string {
    const ratio = financials.debtToEquity || 0.5;
    if (ratio < 0.3) return 'Low leverage';
    if (ratio < 0.6) return 'Moderate leverage';
    return 'High leverage';
  }

  private identifyFinancialTrends(financials: any): string[] {
    return [
      'Revenue growth trend',
      'Profitability improvement',
      'Cash flow optimization',
      'Cost management efficiency'
    ];
  }

  private generateFinancialRecommendations(financials: any): string[] {
    return [
      'Improve cash flow management',
      'Optimize cost structure',
      'Enhance profitability',
      'Strengthen financial position'
    ];
  }

  private extractFinancialMetrics(financials: any): any[] {
    return [
      { name: 'Revenue', value: `$${financials.revenue || 0}` },
      { name: 'Profit Margin', value: `${(financials.margin || 0) * 100}%` },
      { name: 'Current Ratio', value: financials.currentRatio || 0 },
      { name: 'Debt-to-Equity', value: financials.debtToEquity || 0 }
    ];
  }

  private assessCollateralValue(collateralData: any): string {
    const value = collateralData.value || 0;
    return `$${value.toLocaleString()}`;
  }

  private assessCollateralQuality(collateralData: any): string {
    const quality = collateralData.quality || 0.7;
    if (quality > 0.8) return 'High';
    if (quality > 0.6) return 'Good';
    return 'Needs improvement';
  }

  private assessCollateralLiquidity(collateralData: any): string {
    const liquidity = collateralData.liquidity || 0.7;
    if (liquidity > 0.8) return 'High liquidity';
    if (liquidity > 0.6) return 'Moderate liquidity';
    return 'Low liquidity';
  }

  private identifyCollateralRisks(collateralData: any): string[] {
    return [
      'Market value fluctuation',
      'Liquidity risk',
      'Concentration risk',
      'Regulatory risk'
    ];
  }

  private generateCollateralRecommendations(collateralData: any): string[] {
    return [
      'Diversify collateral portfolio',
      'Monitor collateral values',
      'Maintain adequate coverage',
      'Regular collateral reviews'
    ];
  }

  private extractCollateralMetrics(collateralData: any): any[] {
    return [
      { name: 'Collateral Value', value: `$${collateralData.value || 0}` },
      { name: 'Coverage Ratio', value: collateralData.coverageRatio || 0 },
      { name: 'Liquidity Score', value: collateralData.liquidity || 0 },
      { name: 'Quality Score', value: collateralData.quality || 0 }
    ];
  }

  private calculateComplianceScore(complianceData: any): number {
    let score = 50; // Base score
    
    if (complianceData.regulatoryCompliance) score += 20;
    if (complianceData.documentation) score += 15;
    if (complianceData.procedures) score += 10;
    if (complianceData.training) score += 5;
    
    return Math.min(score, 100);
  }

  private assessComplianceStatus(complianceData: any): string {
    const score = this.calculateComplianceScore(complianceData);
    
    if (score > 80) return 'Compliant';
    if (score > 60) return 'Mostly Compliant';
    return 'Non-Compliant';
  }

  private identifyViolations(complianceData: any): string[] {
    return complianceData.violations || ['No violations identified'];
  }

  private identifyRequirements(complianceData: any): string[] {
    return [
      'Regulatory compliance',
      'Documentation requirements',
      'Procedural compliance',
      'Training requirements'
    ];
  }

  private generateComplianceRecommendations(complianceData: any): string[] {
    return [
      'Implement compliance framework',
      'Regular compliance training',
      'Monitor regulatory changes',
      'Conduct regular audits'
    ];
  }

  private suggestComplianceMonitoring(complianceData: any): string {
    return 'Set up regular compliance monitoring and reporting';
  }

  private extractComplianceMetrics(complianceData: any): any[] {
    return [
      { name: 'Compliance Score', value: this.calculateComplianceScore(complianceData) },
      { name: 'Violations', value: complianceData.violations?.length || 0 },
      { name: 'Requirements Met', value: complianceData.requirementsMet || 0 },
      { name: 'Audit Score', value: complianceData.auditScore || 0 }
    ];
  }
}
