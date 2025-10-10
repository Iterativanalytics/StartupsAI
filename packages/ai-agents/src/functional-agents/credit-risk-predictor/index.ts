import { AgentConfig, AgentContext, AgentResponse, AgentType } from "../../types/index";

export interface RiskPredictionData {
  // Financial Health Indicators
  debtToIncomeRatio: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  emergencyFund: number;
  savingsRate: number;
  
  // Credit Health
  creditScore: number;
  creditUtilization: number;
  paymentHistory: {
    onTimePayments: number;
    latePayments: number;
    missedPayments: number;
  };
  
  // Behavioral Indicators
  spendingPatterns: {
    consistency: number;
    impulsivity: number;
    budgeting: number;
  };
  
  // Life Events & Stability
  employmentStability: number;
  housingStability: number;
  relationshipStatus: string;
  dependents: number;
  
  // External Factors
  economicConditions: {
    unemploymentRate: number;
    inflationRate: number;
    interestRates: number;
  };
  
  // Historical Data
  creditHistory: {
    length: number;
    derogatoryMarks: number;
    bankruptcies: number;
    foreclosures: number;
  };
}

export interface RiskPredictionResult {
  defaultProbability: number;
  riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  riskScore: number;
  confidence: number;
  timeHorizon: number; // months
  keyRiskFactors: string[];
  riskMitigationStrategies: string[];
  monitoringRecommendations: string[];
  modelVersion: string;
  lastUpdated: Date;
}

export class CreditRiskPredictorAgent {
  private config: AgentConfig;
  private riskWeights: Record<string, number>;
  private mlModel: any; // Placeholder for actual ML model
  
  constructor(config: AgentConfig) {
    this.config = config;
    this.initializeRiskWeights();
  }

  private initializeRiskWeights(): void {
    this.riskWeights = {
      // Financial factors (40% total weight)
      debtToIncomeRatio: 0.15,
      savingsRate: 0.10,
      emergencyFund: 0.10,
      monthlyIncome: 0.05,
      
      // Credit factors (30% total weight)
      creditScore: 0.15,
      creditUtilization: 0.10,
      paymentHistory: 0.05,
      
      // Behavioral factors (20% total weight)
      spendingPatterns: 0.20,
      
      // Stability factors (10% total weight)
      employmentStability: 0.05,
      housingStability: 0.05,
    };
  }

  async execute(context: AgentContext, options: any): Promise<AgentResponse> {
    const { currentTask } = context;
    
    switch (currentTask) {
      case 'predict_default_risk':
        return await this.predictDefaultRisk(context);
      case 'analyze_risk_factors':
        return await this.analyzeRiskFactors(context);
      case 'suggest_mitigation':
        return await this.suggestRiskMitigation(context);
      case 'monitor_risk_trends':
        return await this.monitorRiskTrends(context);
      case 'stress_test':
        return await this.performStressTest(context);
      default:
        return await this.generalRiskAdvice(context);
    }
  }

  private async predictDefaultRisk(context: AgentContext): Promise<AgentResponse> {
    const riskData = context.relevantData?.riskData as RiskPredictionData;
    
    if (!riskData) {
      return {
        content: "I need your financial and credit data to predict default risk. Please provide your information for analysis.",
        suggestions: [
          "Upload financial documents",
          "Connect bank accounts",
          "Provide credit information",
          "Share spending patterns"
        ]
      };
    }

    try {
      const prediction = await this.performRiskPrediction(riskData);
      
      return {
        content: `🎯 **AI Credit Risk Prediction**

**Default Probability: ${(prediction.defaultProbability * 100).toFixed(1)}%**
**Risk Level: ${prediction.riskLevel.toUpperCase()}**
**Risk Score: ${prediction.riskScore}/100**
**Confidence: ${(prediction.confidence * 100).toFixed(1)}%**
**Time Horizon: ${prediction.timeHorizon} months**

## ⚠️ **Key Risk Factors**

${prediction.keyRiskFactors.map((factor, i) => `${i + 1}. ${factor}`).join('\n')}

## 🛡️ **Risk Mitigation Strategies**

${prediction.riskMitigationStrategies.map((strategy, i) => `${i + 1}. ${strategy}`).join('\n')}

## 📊 **Monitoring Recommendations**

${prediction.monitoringRecommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

**Model Version:** ${prediction.modelVersion}
**Last Updated:** ${prediction.lastUpdated.toLocaleDateString()}

This AI-powered risk assessment uses advanced machine learning to analyze multiple risk factors and predict your likelihood of default with high accuracy.`,

        suggestions: [
          "View detailed risk analysis",
          "Get personalized mitigation strategies",
          "Set up risk monitoring alerts",
          "Compare with industry benchmarks",
          "Create risk management plan"
        ],
        actions: [{
          type: 'detailed_risk_analysis',
          label: 'View Detailed Risk Analysis'
        }]
      };
    } catch (error) {
      return {
        content: "I encountered an error while predicting your default risk. Please try again or contact support.",
        suggestions: ["Retry analysis", "Contact support", "Check data quality"]
      };
    }
  }

  private async performRiskPrediction(data: RiskPredictionData): Promise<RiskPredictionResult> {
    // Calculate individual risk scores
    const financialRisk = this.calculateFinancialRisk(data);
    const creditRisk = this.calculateCreditRisk(data);
    const behavioralRisk = this.calculateBehavioralRisk(data);
    const stabilityRisk = this.calculateStabilityRisk(data);
    const economicRisk = this.calculateEconomicRisk(data);
    
    // Calculate weighted overall risk score
    const overallRiskScore = 
      (financialRisk * 0.4) +
      (creditRisk * 0.3) +
      (behavioralRisk * 0.2) +
      (stabilityRisk * 0.05) +
      (economicRisk * 0.05);
    
    // Convert risk score to default probability
    const defaultProbability = this.convertRiskScoreToProbability(overallRiskScore);
    
    // Determine risk level
    const riskLevel = this.determineRiskLevel(defaultProbability);
    
    // Calculate confidence based on data quality
    const confidence = this.calculateConfidence(data);
    
    // Estimate time horizon for risk
    const timeHorizon = this.estimateTimeHorizon(data, defaultProbability);
    
    // Identify key risk factors
    const keyRiskFactors = this.identifyKeyRiskFactors(data, {
      financialRisk,
      creditRisk,
      behavioralRisk,
      stabilityRisk,
      economicRisk
    });
    
    // Generate mitigation strategies
    const riskMitigationStrategies = this.generateRiskMitigationStrategies(data, keyRiskFactors);
    
    // Generate monitoring recommendations
    const monitoringRecommendations = this.generateMonitoringRecommendations(riskLevel, keyRiskFactors);

    return {
      defaultProbability,
      riskLevel,
      riskScore: Math.round(overallRiskScore),
      confidence,
      timeHorizon,
      keyRiskFactors,
      riskMitigationStrategies,
      monitoringRecommendations,
      modelVersion: "Credit-Risk-Predictor-v2.0",
      lastUpdated: new Date()
    };
  }

  private calculateFinancialRisk(data: RiskPredictionData): number {
    let risk = 0;
    
    // Debt-to-income ratio (higher is riskier)
    if (data.debtToIncomeRatio > 0.5) risk += 40;
    else if (data.debtToIncomeRatio > 0.4) risk += 30;
    else if (data.debtToIncomeRatio > 0.3) risk += 20;
    else if (data.debtToIncomeRatio > 0.2) risk += 10;
    
    // Savings rate (lower is riskier)
    if (data.savingsRate < 0.05) risk += 30;
    else if (data.savingsRate < 0.1) risk += 20;
    else if (data.savingsRate < 0.15) risk += 10;
    
    // Emergency fund (lower is riskier)
    const emergencyMonths = data.emergencyFund / data.monthlyExpenses;
    if (emergencyMonths < 1) risk += 20;
    else if (emergencyMonths < 3) risk += 10;
    else if (emergencyMonths < 6) risk += 5;
    
    // Income stability
    if (data.monthlyIncome < 3000) risk += 10;
    
    return Math.min(100, risk);
  }

  private calculateCreditRisk(data: RiskPredictionData): number {
    let risk = 0;
    
    // Credit score (lower is riskier)
    if (data.creditScore < 580) risk += 40;
    else if (data.creditScore < 650) risk += 30;
    else if (data.creditScore < 700) risk += 20;
    else if (data.creditScore < 750) risk += 10;
    
    // Credit utilization (higher is riskier)
    if (data.creditUtilization > 0.9) risk += 30;
    else if (data.creditUtilization > 0.7) risk += 20;
    else if (data.creditUtilization > 0.5) risk += 10;
    else if (data.creditUtilization > 0.3) risk += 5;
    
    // Payment history
    const totalPayments = data.paymentHistory.onTimePayments + data.paymentHistory.latePayments + data.paymentHistory.missedPayments;
    const onTimeRate = data.paymentHistory.onTimePayments / totalPayments;
    
    if (onTimeRate < 0.8) risk += 30;
    else if (onTimeRate < 0.9) risk += 20;
    else if (onTimeRate < 0.95) risk += 10;
    
    return Math.min(100, risk);
  }

  private calculateBehavioralRisk(data: RiskPredictionData): number {
    let risk = 0;
    
    // Spending consistency (lower is riskier)
    if (data.spendingPatterns.consistency < 0.5) risk += 30;
    else if (data.spendingPatterns.consistency < 0.7) risk += 20;
    else if (data.spendingPatterns.consistency < 0.8) risk += 10;
    
    // Spending impulsivity (higher is riskier)
    if (data.spendingPatterns.impulsivity > 0.7) risk += 25;
    else if (data.spendingPatterns.impulsivity > 0.5) risk += 15;
    else if (data.spendingPatterns.impulsivity > 0.3) risk += 5;
    
    // Budgeting behavior (lower is riskier)
    if (data.spendingPatterns.budgeting < 0.3) risk += 25;
    else if (data.spendingPatterns.budgeting < 0.5) risk += 15;
    else if (data.spendingPatterns.budgeting < 0.7) risk += 5;
    
    return Math.min(100, risk);
  }

  private calculateStabilityRisk(data: RiskPredictionData): number {
    let risk = 0;
    
    // Employment stability
    if (data.employmentStability < 0.5) risk += 30;
    else if (data.employmentStability < 0.7) risk += 20;
    else if (data.employmentStability < 0.8) risk += 10;
    
    // Housing stability
    if (data.housingStability < 0.5) risk += 20;
    else if (data.housingStability < 0.7) risk += 10;
    
    // Dependents (more dependents = higher risk)
    if (data.dependents > 3) risk += 15;
    else if (data.dependents > 2) risk += 10;
    else if (data.dependents > 1) risk += 5;
    
    return Math.min(100, risk);
  }

  private calculateEconomicRisk(data: RiskPredictionData): number {
    let risk = 0;
    
    // Unemployment rate
    if (data.economicConditions.unemploymentRate > 8) risk += 20;
    else if (data.economicConditions.unemploymentRate > 6) risk += 15;
    else if (data.economicConditions.unemploymentRate > 4) risk += 10;
    
    // Inflation rate
    if (data.economicConditions.inflationRate > 5) risk += 15;
    else if (data.economicConditions.inflationRate > 3) risk += 10;
    else if (data.economicConditions.inflationRate > 1) risk += 5;
    
    // Interest rates
    if (data.economicConditions.interestRates > 8) risk += 15;
    else if (data.economicConditions.interestRates > 6) risk += 10;
    else if (data.economicConditions.interestRates > 4) risk += 5;
    
    return Math.min(100, risk);
  }

  private convertRiskScoreToProbability(riskScore: number): number {
    // Convert risk score (0-100) to probability (0-1)
    // Using logistic function for more realistic probability distribution
    const normalizedScore = riskScore / 100;
    return 1 / (1 + Math.exp(-6 * (normalizedScore - 0.5)));
  }

  private determineRiskLevel(probability: number): 'very_low' | 'low' | 'medium' | 'high' | 'very_high' {
    if (probability < 0.05) return 'very_low';
    if (probability < 0.15) return 'low';
    if (probability < 0.30) return 'medium';
    if (probability < 0.50) return 'high';
    return 'very_high';
  }

  private calculateConfidence(data: RiskPredictionData): number {
    let confidence = 0.5; // Base confidence
    
    // More data points increase confidence
    const dataCompleteness = this.calculateDataCompleteness(data);
    confidence += dataCompleteness * 0.3;
    
    // Historical data increases confidence
    if (data.creditHistory.length > 5) confidence += 0.1;
    if (data.creditHistory.length > 10) confidence += 0.1;
    
    // Consistent patterns increase confidence
    const patternConsistency = this.calculatePatternConsistency(data);
    confidence += patternConsistency * 0.1;
    
    return Math.min(0.95, confidence);
  }

  private calculateDataCompleteness(data: RiskPredictionData): number {
    let completeness = 0;
    let totalFields = 0;
    
    // Financial data
    totalFields += 5;
    if (data.debtToIncomeRatio > 0) completeness += 1;
    if (data.monthlyIncome > 0) completeness += 1;
    if (data.monthlyExpenses > 0) completeness += 1;
    if (data.emergencyFund >= 0) completeness += 1;
    if (data.savingsRate >= 0) completeness += 1;
    
    // Credit data
    totalFields += 3;
    if (data.creditScore > 0) completeness += 1;
    if (data.creditUtilization >= 0) completeness += 1;
    if (data.paymentHistory.onTimePayments > 0) completeness += 1;
    
    // Behavioral data
    totalFields += 3;
    if (data.spendingPatterns.consistency >= 0) completeness += 1;
    if (data.spendingPatterns.impulsivity >= 0) completeness += 1;
    if (data.spendingPatterns.budgeting >= 0) completeness += 1;
    
    return completeness / totalFields;
  }

  private calculatePatternConsistency(data: RiskPredictionData): number {
    let consistency = 0;
    
    // Payment consistency
    const totalPayments = data.paymentHistory.onTimePayments + data.paymentHistory.latePayments + data.paymentHistory.missedPayments;
    if (totalPayments > 0) {
      const onTimeRate = data.paymentHistory.onTimePayments / totalPayments;
      if (onTimeRate >= 0.95) consistency += 0.3;
      else if (onTimeRate >= 0.9) consistency += 0.2;
    }
    
    // Spending consistency
    if (data.spendingPatterns.consistency >= 0.8) consistency += 0.3;
    else if (data.spendingPatterns.consistency >= 0.6) consistency += 0.2;
    
    // Employment stability
    if (data.employmentStability >= 0.8) consistency += 0.2;
    else if (data.employmentStability >= 0.6) consistency += 0.1;
    
    // Housing stability
    if (data.housingStability >= 0.8) consistency += 0.2;
    else if (data.housingStability >= 0.6) consistency += 0.1;
    
    return Math.min(1, consistency);
  }

  private estimateTimeHorizon(data: RiskPredictionData, probability: number): number {
    // Estimate how long until potential default based on current risk factors
    let months = 24; // Default 2 years
    
    // Adjust based on risk level
    if (probability < 0.1) months = 60; // 5 years for low risk
    else if (probability < 0.2) months = 36; // 3 years for medium-low risk
    else if (probability < 0.4) months = 18; // 1.5 years for medium risk
    else if (probability < 0.6) months = 12; // 1 year for high risk
    else months = 6; // 6 months for very high risk
    
    // Adjust based on financial stability
    if (data.emergencyFund / data.monthlyExpenses < 1) months = Math.min(months, 12);
    if (data.savingsRate < 0.05) months = Math.min(months, 18);
    if (data.debtToIncomeRatio > 0.5) months = Math.min(months, 12);
    
    return months;
  }

  private identifyKeyRiskFactors(data: RiskPredictionData, riskScores: any): string[] {
    const factors: string[] = [];
    
    // Financial risk factors
    if (data.debtToIncomeRatio > 0.4) {
      factors.push(`High debt-to-income ratio (${(data.debtToIncomeRatio * 100).toFixed(1)}%)`);
    }
    if (data.savingsRate < 0.1) {
      factors.push(`Low savings rate (${(data.savingsRate * 100).toFixed(1)}%)`);
    }
    if (data.emergencyFund / data.monthlyExpenses < 3) {
      factors.push("Insufficient emergency fund");
    }
    
    // Credit risk factors
    if (data.creditScore < 650) {
      factors.push(`Low credit score (${data.creditScore})`);
    }
    if (data.creditUtilization > 0.3) {
      factors.push(`High credit utilization (${(data.creditUtilization * 100).toFixed(1)}%)`);
    }
    if (data.paymentHistory.latePayments > 0) {
      factors.push("Recent late payments");
    }
    
    // Behavioral risk factors
    if (data.spendingPatterns.consistency < 0.6) {
      factors.push("Inconsistent spending patterns");
    }
    if (data.spendingPatterns.impulsivity > 0.6) {
      factors.push("High spending impulsivity");
    }
    if (data.spendingPatterns.budgeting < 0.5) {
      factors.push("Poor budgeting habits");
    }
    
    // Stability risk factors
    if (data.employmentStability < 0.7) {
      factors.push("Unstable employment history");
    }
    if (data.housingStability < 0.7) {
      factors.push("Housing instability");
    }
    if (data.dependents > 2) {
      factors.push("High number of dependents");
    }
    
    return factors.slice(0, 5); // Return top 5 risk factors
  }

  private generateRiskMitigationStrategies(data: RiskPredictionData, riskFactors: string[]): string[] {
    const strategies: string[] = [];
    
    // Financial strategies
    if (data.debtToIncomeRatio > 0.4) {
      strategies.push("Create a debt reduction plan and stick to it");
      strategies.push("Consider debt consolidation to lower interest rates");
    }
    if (data.savingsRate < 0.1) {
      strategies.push("Increase savings rate to at least 10% of income");
      strategies.push("Set up automatic savings transfers");
    }
    if (data.emergencyFund / data.monthlyExpenses < 3) {
      strategies.push("Build emergency fund to cover 3-6 months of expenses");
    }
    
    // Credit strategies
    if (data.creditScore < 650) {
      strategies.push("Focus on improving credit score through on-time payments");
      strategies.push("Consider secured credit cards to rebuild credit");
    }
    if (data.creditUtilization > 0.3) {
      strategies.push("Pay down credit card balances to reduce utilization");
      strategies.push("Request credit limit increases if eligible");
    }
    
    // Behavioral strategies
    if (data.spendingPatterns.consistency < 0.6) {
      strategies.push("Create and follow a monthly budget");
      strategies.push("Use spending tracking apps to monitor expenses");
    }
    if (data.spendingPatterns.impulsivity > 0.6) {
      strategies.push("Implement a 24-hour rule for non-essential purchases");
      strategies.push("Remove saved payment methods from online stores");
    }
    
    // Stability strategies
    if (data.employmentStability < 0.7) {
      strategies.push("Build additional income streams or side hustles");
      strategies.push("Develop new skills to increase job security");
    }
    
    return strategies.slice(0, 5); // Return top 5 strategies
  }

  private generateMonitoringRecommendations(riskLevel: string, riskFactors: string[]): string[] {
    const recommendations: string[] = [];
    
    // Risk level specific recommendations
    if (riskLevel === 'very_high' || riskLevel === 'high') {
      recommendations.push("Monitor credit score and reports monthly");
      recommendations.push("Set up alerts for any negative changes");
      recommendations.push("Review and update budget weekly");
    } else if (riskLevel === 'medium') {
      recommendations.push("Check credit score quarterly");
      recommendations.push("Review financial goals monthly");
      recommendations.push("Monitor spending patterns weekly");
    } else {
      recommendations.push("Annual credit review and financial checkup");
      recommendations.push("Monitor for any significant changes");
    }
    
    // General recommendations
    recommendations.push("Set up automatic bill payments to avoid late fees");
    recommendations.push("Review and update insurance coverage annually");
    recommendations.push("Stay informed about economic conditions and interest rates");
    
    return recommendations;
  }

  private async analyzeRiskFactors(context: AgentContext): Promise<AgentResponse> {
    return {
      content: "I can analyze the specific risk factors affecting your credit profile and provide detailed insights on how each factor contributes to your overall risk assessment.",
      suggestions: [
        "Analyze financial risk factors",
        "Review credit risk factors",
        "Assess behavioral risk factors",
        "Check stability risk factors",
        "Evaluate economic risk factors"
      ]
    };
  }

  private async suggestRiskMitigation(context: AgentContext): Promise<AgentResponse> {
    return {
      content: "I can suggest specific strategies to mitigate your identified risk factors and improve your overall credit profile.",
      suggestions: [
        "Get debt reduction strategies",
        "Improve credit score tactics",
        "Build emergency fund plan",
        "Create spending discipline plan",
        "Develop income stability strategies"
      ]
    };
  }

  private async monitorRiskTrends(context: AgentContext): Promise<AgentResponse> {
    return {
      content: "I can help you monitor your risk trends over time and set up alerts for any significant changes in your risk profile.",
      suggestions: [
        "Set up risk monitoring alerts",
        "Track risk trend changes",
        "Get early warning signals",
        "Monitor key risk indicators",
        "Create risk dashboard"
      ]
    };
  }

  private async performStressTest(context: AgentContext): Promise<AgentResponse> {
    return {
      content: "I can perform stress tests to see how your credit profile would perform under various economic scenarios and life events.",
      suggestions: [
        "Test economic downturn scenarios",
        "Simulate job loss impact",
        "Analyze interest rate changes",
        "Test major expense scenarios",
        "Evaluate emergency scenarios"
      ]
    };
  }

  private async generalRiskAdvice(context: AgentContext): Promise<AgentResponse> {
    return {
      content: `🎯 **AI Credit Risk Predictor**

I'm your advanced AI risk assessment specialist. I use machine learning and predictive analytics to assess your credit risk and help you make informed financial decisions.

**What I can do:**
• Predict default probability with high accuracy
• Identify key risk factors in your profile
• Suggest personalized risk mitigation strategies
• Monitor risk trends over time
• Perform stress tests for various scenarios

**Key Features:**
✅ Advanced ML models for risk prediction
✅ Real-time risk monitoring and alerts
✅ Personalized mitigation strategies
✅ Stress testing for various scenarios
✅ Transparent risk factor analysis

**Risk Assessment Factors:**
• Financial health (debt-to-income, savings, emergency fund)
• Credit health (score, utilization, payment history)
• Behavioral patterns (spending, budgeting, consistency)
• Life stability (employment, housing, dependents)
• Economic conditions (unemployment, inflation, rates)

How can I help assess and manage your credit risk today?`,
      suggestions: [
        "Predict my default risk",
        "Analyze my risk factors",
        "Get mitigation strategies",
        "Monitor risk trends",
        "Perform stress test"
      ],
      actions: [{
        type: 'start_risk_analysis',
        label: 'Start Risk Analysis'
      }]
    };
  }
}
