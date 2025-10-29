
import { AgentConfig, AgentContext, AgentResponse } from "../../core/agent-engine";
import { CreditAnalystAgentIntegration } from "./integration";
import { RealTimeCreditDecisionEngine } from "./real-time-decision";
import { CreditApplication } from "./types";

export class CreditAnalystAgent {
  private config: AgentConfig;
  private integration: CreditAnalystAgentIntegration;
  private decisionEngine: RealTimeCreditDecisionEngine;
  
  constructor(config: AgentConfig) {
    this.config = config;
    this.integration = new CreditAnalystAgentIntegration();
    this.decisionEngine = new RealTimeCreditDecisionEngine();
  }
  
  async execute(context: AgentContext, options: any): Promise<AgentResponse> {
    const { currentTask } = context;
    
    switch (currentTask) {
      case 'assess_credit':
        return await this.assessCredit(context, options);
      case 'analyze_financials':
        return await this.analyzeFinancials(context);
      case 'calculate_dscr':
        return await this.calculateDSCR(context);
      case 'risk_modeling':
        return await this.performRiskModeling(context);
      case 'underwriting':
        return await this.performUnderwriting(context);
      case 'ai_credit_score':
        return await this.performAICreditScoring(context, options);
      case 'predict_risk':
        return await this.predictDefaultRisk(context, options);
      case 'instant_decision':
        return await this.instantDecision(context, options);
      case 'portfolio_analysis':
        return await this.analyzePortfolio(context, options);
      case 'monitor_loan':
        return await this.monitorLoan(context, options);
      case 'fraud_detection':
        return await this.detectFraud(context, options);
      default:
        return await this.generalLenderAdvice(context);
    }
  }
  
  private async assessCredit(context: AgentContext, options: any): Promise<AgentResponse> {
    // If application data is provided, perform full AI credit scoring
    if (options?.application) {
      const application = options.application as CreditApplication;
      const report = await this.integration.analyzeApplication(application);
      
      return {
        content: this.formatCreditAnalysisReport(report),
        suggestions: [
          "View detailed scoring breakdown",
          "Check fraud assessment",
          "Review what-if scenarios",
          "Generate approval letter",
          "Compare with other applications"
        ],
        actions: [{
          type: 'credit_report',
          label: 'View Full Report',
          data: report
        }]
      };
    }
    
    return {
      content: "I'll help you assess credit risk for loan applications using advanced AI scoring. Please provide the applicant's information for comprehensive analysis.",
      suggestions: [
        "Run AI credit score analysis",
        "Perform instant decision",
        "Detect fraud indicators",
        "Calculate optimal credit limit",
        "Analyze portfolio risk"
      ],
      actions: [{
        type: 'credit_analyzer',
        label: 'Open Credit Analysis Tool'
      }]
    };
  }
  
  private async analyzeFinancials(context: AgentContext): Promise<AgentResponse> {
    return {
      content: "I can analyze financial statements and provide insights on creditworthiness. What financial documents would you like me to review?",
      suggestions: [
        "Income statement analysis",
        "Balance sheet review",
        "Cash flow statement evaluation",
        "Financial ratio calculations",
        "Trend analysis"
      ]
    };
  }
  
  private async calculateDSCR(context: AgentContext): Promise<AgentResponse> {
    return {
      content: "I'll help you calculate the Debt Service Coverage Ratio (DSCR) to evaluate the borrower's ability to service debt.",
      suggestions: [
        "Calculate current DSCR",
        "Project future DSCR",
        "Analyze DSCR trends",
        "Compare to industry benchmarks",
        "Assess minimum DSCR requirements"
      ],
      actions: [{
        type: 'dscr_calculator',
        label: 'Open DSCR Calculator'
      }]
    };
  }
  
  private async performRiskModeling(context: AgentContext): Promise<AgentResponse> {
    return {
      content: "I can help you build predictive risk models to assess default probability and optimize lending decisions.",
      suggestions: [
        "Default probability modeling",
        "Loss given default analysis",
        "Economic scenario stress testing",
        "Portfolio risk assessment",
        "Regulatory compliance check"
      ]
    };
  }
  
  private async performUnderwriting(context: AgentContext): Promise<AgentResponse> {
    return {
      content: "I'll assist with the underwriting process, helping you make informed lending decisions based on comprehensive risk analysis.",
      suggestions: [
        "Automated underwriting rules",
        "Manual review recommendations",
        "Loan structuring advice",
        "Terms and pricing optimization",
        "Approval workflow guidance"
      ]
    };
  }
  
  private async generalLenderAdvice(context: AgentContext): Promise<AgentResponse> {
    return {
      content: `🤖 **AI-Enhanced Credit Assessor**

Hello! I'm your advanced AI Credit Assessor with cutting-edge capabilities. I specialize in:

**Traditional Credit Assessment:**
• Credit risk analysis and financial evaluation
• Debt service coverage ratio calculations
• Financial statement analysis
• Underwriting support and loan decisions

**AI-Enhanced Capabilities:**
• AI-powered credit scoring using 50+ data points
• Alternative data analysis (banking behavior, customer metrics)
• Behavioral risk assessment and prediction
• Real-time risk monitoring and alerts
• Fraud detection and prevention
• Portfolio risk analysis and optimization

**Key Advantages:**
✅ More accurate than traditional FICO scores
✅ Includes alternative data for better assessment
✅ Real-time risk analysis and monitoring
✅ Explainable AI with SHAP values
✅ Instant decision engine for qualifying loans
✅ Comprehensive fraud detection

How can I help with your credit assessment needs today?`,
      suggestions: [
        "Calculate AI credit score",
        "Perform instant decision",
        "Detect fraud indicators",
        "Analyze portfolio risk",
        "Monitor existing loans",
        "Get improvement recommendations"
      ],
      actions: [{
        type: 'ai_credit_analysis',
        label: 'Start AI Credit Analysis'
      }, {
        type: 'pending_applications',
        label: 'Review Pending Applications'
      }]
    };
  }

  // ===========================
  // NEW AI CREDIT SCORING METHODS
  // ===========================

  private async performAICreditScoring(context: AgentContext, options: any): Promise<AgentResponse> {
    if (!options?.application) {
      return {
        content: "Please provide the credit application data to perform AI credit scoring.",
        suggestions: ["Upload application data", "Use sample application", "View scoring methodology"]
      };
    }

    const application = options.application as CreditApplication;
    const report = await this.integration.analyzeApplication(application);

    return {
      content: this.formatCreditAnalysisReport(report),
      suggestions: [
        "View SHAP values explanation",
        "Check what-if scenarios",
        "Generate approval letter",
        "Export detailed report"
      ],
      actions: [{
        type: 'credit_report',
        label: 'View Full Report',
        data: report
      }]
    };
  }

  private async predictDefaultRisk(context: AgentContext, options: any): Promise<AgentResponse> {
    if (!options?.application) {
      return {
        content: "Please provide application data to predict default risk.",
        suggestions: ["Upload application", "View risk factors"]
      };
    }

    const application = options.application as CreditApplication;
    const report = await this.integration.analyzeApplication(application);

    const riskAnalysis = `
**Default Risk Analysis**

📊 **Overall Risk Assessment:**
• Default Probability: ${(report.scoring.defaultProbability * 100).toFixed(2)}%
• Risk Category: ${report.scoring.riskCategory.toUpperCase()}
• Confidence Level: ${(report.scoring.confidenceLevel * 100).toFixed(0)}%

⚠️ **Key Risk Factors:**
${report.keyFactors.negative.map(f => `• ${f.factor}: ${f.description}`).join('\n')}

💪 **Mitigating Factors:**
${report.keyFactors.positive.map(f => `• ${f.factor}: ${f.description}`).join('\n')}

📈 **Risk Trend:** ${report.scoring.riskCategory === 'very_low' || report.scoring.riskCategory === 'low' ? 'Favorable' : 'Requires Attention'}
`;

    return {
      content: riskAnalysis,
      suggestions: [
        "View detailed risk breakdown",
        "Run stress test scenarios",
        "Get risk mitigation strategies",
        "Compare with portfolio average"
      ]
    };
  }

  private async instantDecision(context: AgentContext, options: any): Promise<AgentResponse> {
    if (!options?.application) {
      return {
        content: "Instant Decision Engine ready. Provide application data for immediate decisioning on loans up to $100,000.",
        suggestions: ["Upload application", "View decision criteria"]
      };
    }

    const application = options.application as CreditApplication;
    const decision = await this.decisionEngine.instantDecision(application);

    let decisionContent = `
**⚡ Instant Decision Result**

**Decision:** ${decision.decision.toUpperCase()}
**Processing Time:** ${decision.processingTime}ms
**Credit Score:** ${decision.score ? Math.round(decision.score) : 'N/A'}

`;

    if (decision.decision === 'approve') {
      decisionContent += `
✅ **APPROVED**

**Loan Terms:**
• Approved Amount: $${decision.approvedAmount?.toLocaleString()}
• Interest Rate: ${decision.interestRate?.toFixed(2)}%
• Term: ${decision.terms?.term} months
• Monthly Payment: $${decision.terms?.monthlyPayment.toFixed(2)}

**Reason:** ${decision.reason}
`;
    } else if (decision.decision === 'decline') {
      decisionContent += `
❌ **DECLINED**

**Reason:** ${decision.reason}

${decision.improvementSuggestions ? `
**Improvement Suggestions:**
${decision.improvementSuggestions.map(s => `• ${s}`).join('\n')}
` : ''}
`;
    } else {
      decisionContent += `
📋 **REQUIRES MANUAL REVIEW**

**Reason:** ${decision.reason}
**Priority:** ${decision.reviewPriority?.toUpperCase()}
`;
    }

    return {
      content: decisionContent,
      suggestions: decision.decision === 'approve' 
        ? ["Generate loan documents", "Send approval letter", "Schedule closing"]
        : decision.decision === 'decline'
        ? ["Send decline letter", "Provide feedback", "Suggest alternatives"]
        : ["Assign to underwriter", "Request additional docs", "Schedule review"]
    };
  }

  private async analyzePortfolio(context: AgentContext, options: any): Promise<AgentResponse> {
    if (!options?.applications || !Array.isArray(options.applications)) {
      return {
        content: "Portfolio Analysis requires multiple loan applications. Please provide portfolio data.",
        suggestions: ["Upload portfolio data", "View sample analysis"]
      };
    }

    const applications = options.applications as CreditApplication[];
    const portfolioReport = await this.integration.scorePortfolio(applications);

    const portfolioContent = `
**📊 Portfolio Risk Analysis**

**Portfolio Overview:**
• Total Applications: ${portfolioReport.totalApplications}
• Average Credit Score: ${Math.round(portfolioReport.portfolioMetrics.averageScore)}
• Average Default Probability: ${(portfolioReport.portfolioMetrics.averageDefaultProbability * 100).toFixed(2)}%
• Approval Rate: ${(portfolioReport.portfolioMetrics.approvalRate * 100).toFixed(1)}%

**Risk Distribution:**
${Object.entries(portfolioReport.riskDistribution).map(([risk, count]) => 
  `• ${risk.replace('_', ' ').toUpperCase()}: ${count} (${((count / portfolioReport.totalApplications) * 100).toFixed(1)}%)`
).join('\n')}

**Portfolio Risk Rating:** ${portfolioReport.portfolioRisk.riskRating}
• Total Exposure: $${portfolioReport.portfolioRisk.totalExposure.toLocaleString()}
• Expected Loss: $${portfolioReport.portfolioRisk.expectedLoss.toLocaleString()}
• Expected Loss Rate: ${(portfolioReport.portfolioRisk.expectedLossRate * 100).toFixed(2)}%
• Concentration Risk: ${(portfolioReport.portfolioRisk.concentrationRisk * 100).toFixed(1)}%

**Top Risk Exposures:**
${portfolioReport.topRisks.slice(0, 5).map((risk, i) => 
  `${i + 1}. ${risk.businessName} - Score: ${Math.round(risk.score)}, Default Risk: ${(risk.defaultProbability * 100).toFixed(1)}%`
).join('\n')}

**Recommendations:**
${portfolioReport.recommendations.map(r => `• ${r}`).join('\n')}
`;

    return {
      content: portfolioContent,
      suggestions: [
        "View industry concentration",
        "Run stress test scenarios",
        "Export portfolio report",
        "Set monitoring alerts"
      ]
    };
  }

  private async monitorLoan(context: AgentContext, options: any): Promise<AgentResponse> {
    if (!options?.originalApplication || !options?.currentFinancials) {
      return {
        content: "Loan monitoring requires original application data and current financial data.",
        suggestions: ["Upload loan data", "View monitoring criteria"]
      };
    }

    const monitoringReport = await this.integration.monitorExistingLoan(
      options.originalApplication,
      options.currentFinancials,
      options.currentAlternativeData
    );

    const severityEmoji = monitoringReport.actionRequired === 'escalate' ? '🚨' :
                          monitoringReport.actionRequired === 'restructure' ? '⚠️' :
                          monitoringReport.actionRequired === 'review' ? '📋' :
                          monitoringReport.actionRequired === 'monitor' ? '👀' : '✅';

    const monitoringContent = `
**${severityEmoji} Loan Monitoring Report**

**Loan ID:** ${monitoringReport.loanId}
**Monitoring Date:** ${new Date(monitoringReport.monitoringDate).toLocaleDateString()}

**Score Changes:**
• Original Score: ${Math.round(monitoringReport.originalScore)}
• Current Score: ${Math.round(monitoringReport.currentScore)}
• Change: ${monitoringReport.scoreDelta > 0 ? '+' : ''}${Math.round(monitoringReport.scoreDelta)} points

**Risk Changes:**
• Original Risk: ${(monitoringReport.originalRisk * 100).toFixed(2)}%
• Current Risk: ${(monitoringReport.currentRisk * 100).toFixed(2)}%
• Change: ${monitoringReport.riskDelta > 0 ? '+' : ''}${(monitoringReport.riskDelta * 100).toFixed(2)}%

**Action Required:** ${monitoringReport.actionRequired.toUpperCase()}

${monitoringReport.warnings.length > 0 ? `
**⚠️ Warnings:**
${monitoringReport.warnings.map(w => `• ${w}`).join('\n')}
` : ''}

**Recommendations:**
${monitoringReport.recommendations.map(r => `${r}`).join('\n')}
`;

    return {
      content: monitoringContent,
      suggestions: [
        "Schedule borrower meeting",
        "Request updated financials",
        "Escalate to workout team",
        "Update monitoring frequency"
      ]
    };
  }

  private async detectFraud(context: AgentContext, options: any): Promise<AgentResponse> {
    if (!options?.application) {
      return {
        content: "Fraud detection requires application data. Please provide the application to analyze.",
        suggestions: ["Upload application", "View fraud indicators"]
      };
    }

    const application = options.application as CreditApplication;
    const report = await this.integration.analyzeApplication(application);
    const fraud = report.fraudAssessment;

    const fraudEmoji = fraud.isFraudulent ? '🚨' : fraud.riskScore > 30 ? '⚠️' : '✅';

    const fraudContent = `
**${fraudEmoji} Fraud Detection Analysis**

**Risk Score:** ${fraud.riskScore}/100
**Assessment:** ${fraud.isFraudulent ? 'HIGH FRAUD RISK' : fraud.riskScore > 30 ? 'MODERATE RISK' : 'LOW RISK'}
**Recommendation:** ${fraud.recommendation.toUpperCase()}

${fraud.flags.length > 0 ? `
**🚩 Red Flags Detected:**
${fraud.flags.map(f => `• ${f}`).join('\n')}
` : '**✅ No significant fraud indicators detected**'}

${fraud.isFraudulent ? `
**⚠️ IMMEDIATE ACTIONS REQUIRED:**
• Escalate to fraud investigation team
• Verify applicant identity
• Request additional documentation
• Conduct enhanced due diligence
` : fraud.riskScore > 30 ? `
**📋 RECOMMENDED ACTIONS:**
• Perform additional verification
• Request supporting documentation
• Conduct reference checks
` : `
**✅ PROCEED WITH STANDARD PROCESS**
• Continue normal underwriting
• No additional fraud checks required
`}
`;

    return {
      content: fraudContent,
      suggestions: fraud.isFraudulent 
        ? ["Escalate to fraud team", "Request verification", "Decline application"]
        : fraud.riskScore > 30
        ? ["Request additional docs", "Verify information", "Conduct checks"]
        : ["Proceed with application", "Continue standard process"]
    };
  }

  private formatCreditAnalysisReport(report: any): string {
    return `
**📊 AI Credit Analysis Report**

**Applicant:** ${report.applicant.businessName}
**Industry:** ${report.applicant.industry}
**Years in Business:** ${report.applicant.yearsInBusiness}

**Credit Score:** ${Math.round(report.scoring.overallScore)}/850 (${report.scoring.rating})
**Default Probability:** ${(report.scoring.defaultProbability * 100).toFixed(2)}%
**Risk Category:** ${report.scoring.riskCategory.toUpperCase()}
**Confidence:** ${(report.scoring.confidenceLevel * 100).toFixed(0)}%

**Decision:** ${report.recommendation.decision.toUpperCase()}
${report.recommendation.decision === 'approve' || report.recommendation.decision === 'approve_with_conditions' ? `
• Max Loan Amount: $${report.recommendation.maxLoanAmount.toLocaleString()}
• Suggested Rate: ${report.recommendation.suggestedInterestRate.toFixed(2)}%
• Required Collateral: $${report.recommendation.requiredCollateral.toLocaleString()}
` : ''}

**💪 Key Strengths:**
${report.keyFactors.positive.map((f: any) => `• ${f.factor}: ${f.description}`).join('\n')}

**⚠️ Key Concerns:**
${report.keyFactors.negative.map((f: any) => `• ${f.factor}: ${f.description}`).join('\n')}

**📈 Improvement Opportunities:**
${report.explainability.whatIfScenarios.slice(0, 3).map((s: any) => 
  `• ${s.change}: +${s.scoreImpact} points`
).join('\n')}

**Summary:** ${report.summary}
`;
  }
}

// Export types for external use
export * from './types';
export { CreditAnalystAgentIntegration } from './integration';
export { RealTimeCreditDecisionEngine } from './real-time-decision';
