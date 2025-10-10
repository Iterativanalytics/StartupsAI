import Anthropic from '@anthropic-ai/sdk';
import { BaseAgent } from '../base-agent';
import { AgentType, AgentConfig, AgentContext } from '../../types';

export class BusinessAdvisorAgent extends BaseAgent {
  protected agentType = AgentType.BUSINESS_ADVISOR;

  constructor(client: Anthropic, config: AgentConfig) {
    super(client, config);
  }

  protected async generateInsights(context: AgentContext): Promise<string[]> {
    const insights: string[] = [];

    // Analyze business plan if available
    if (context.relevantData?.businessPlan) {
      insights.push(await this.analyzeBusinessPlan(context.relevantData.businessPlan));
    }

    // Financial health insights
    if (context.relevantData?.financials) {
      insights.push(await this.analyzeFinancials(context.relevantData.financials));
    }

    // Market insights
    if (context.relevantData?.market) {
      insights.push(await this.analyzeMarket(context.relevantData.market));
    }

    return insights;
  }

  private async analyzeBusinessPlan(businessPlan: any): Promise<string> {
    // Implement business plan analysis logic
    return 'Business plan analysis: Strong value proposition, consider expanding market section.';
  }

  private async analyzeFinancials(financials: any): Promise<string> {
    // Implement financial analysis logic
    const burnRate = financials.monthlyBurn || 0;
    const runway = financials.cash / burnRate;
    
    if (runway < 6) {
      return `⚠️ Warning: Only ${runway.toFixed(1)} months runway remaining. Consider fundraising or reducing burn rate.`;
    }
    
    return `Financial health: ${runway.toFixed(1)} months runway, burn rate under control.`;
  }

  private async analyzeMarket(market: any): Promise<string> {
    // Implement market analysis logic
    return 'Market opportunity: $2B TAM, growing at 15% annually. Strong positioning.';
  }
}