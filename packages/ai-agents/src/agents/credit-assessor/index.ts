import Anthropic from '@anthropic-ai/sdk';
import { BaseAgent } from '../base-agent';
import { AgentType, AgentConfig, AgentContext } from '../../types';

export class CreditAssessorAgent extends BaseAgent {
  protected agentType = AgentType.CREDIT_ASSESSOR;

  constructor(client: Anthropic, config: AgentConfig) {
    super(client, config);
  }

  protected async generateInsights(context: AgentContext): Promise<string[]> {
    const insights: string[] = [];

    // Credit scoring
    if (context.relevantData?.application) {
      insights.push(await this.assessCreditScore(context.relevantData.application));
    }

    // Cash flow analysis
    if (context.relevantData?.cashFlow) {
      insights.push(await this.analyzeCashFlow(context.relevantData.cashFlow));
    }

    // Collateral evaluation
    if (context.relevantData?.collateral) {
      insights.push(await this.evaluateCollateral(context.relevantData.collateral));
    }

    return insights;
  }

  private async assessCreditScore(application: any): Promise<string> {
    let score = 700; // Base score

    // Adjust based on payment history
    if (application.paymentHistory === 'excellent') score += 50;
    if (application.paymentHistory === 'poor') score -= 100;

    // Adjust based on debt-to-income ratio
    const dti = application.totalDebt / application.annualIncome;
    if (dti > 0.5) score -= 50;
    if (dti < 0.3) score += 30;

    if (score < 650) {
      return `⚠️ Credit Score: ${score} - High risk. Consider requiring additional collateral.`;
    } else if (score < 700) {
      return `Credit Score: ${score} - Moderate risk. Standard terms recommended.`;
    } else {
      return `💡 Credit Score: ${score} - Low risk. Favorable terms can be offered.`;
    }
  }

  private async analyzeCashFlow(cashFlow: any): Promise<string> {
    const operatingCashFlow = cashFlow.operating || 0;
    const freeCashFlow = cashFlow.free || 0;
    const debtService = cashFlow.debtService || 0;

    const dscr = operatingCashFlow / debtService; // Debt Service Coverage Ratio

    if (dscr < 1.25) {
      return `⚠️ DSCR: ${dscr.toFixed(2)} - Below recommended threshold of 1.25. Cash flow may be insufficient.`;
    }

    return `Cash Flow Analysis: DSCR of ${dscr.toFixed(2)} indicates strong debt servicing capability.`;
  }

  private async evaluateCollateral(collateral: any): Promise<string> {
    const loanAmount = collateral.requestedAmount || 0;
    const collateralValue = collateral.value || 0;
    const ltv = loanAmount / collateralValue; // Loan-to-Value ratio

    if (ltv > 0.8) {
      return `⚠️ LTV: ${(ltv * 100).toFixed(1)}% - High risk. Consider reducing loan amount or requiring additional collateral.`;
    }

    return `Collateral Coverage: LTV of ${(ltv * 100).toFixed(1)}% provides adequate security.`;
  }
}