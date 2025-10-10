import Anthropic from '@anthropic-ai/sdk';
import { BaseAgent } from '../base-agent';
import { AgentType, AgentConfig, AgentContext } from '../../types';

export class DealAnalyzerAgent extends BaseAgent {
  protected agentType = AgentType.DEAL_ANALYZER;

  constructor(client: Anthropic, config: AgentConfig) {
    super(client, config);
  }

  protected async generateInsights(context: AgentContext): Promise<string[]> {
    const insights: string[] = [];

    // Deal valuation insights
    if (context.relevantData?.deal) {
      insights.push(await this.analyzeDealValuation(context.relevantData.deal));
    }

    // Portfolio insights
    if (context.relevantData?.portfolio) {
      insights.push(await this.analyzePortfolio(context.relevantData.portfolio));
    }

    // Risk assessment
    if (context.relevantData?.company) {
      insights.push(await this.assessRisk(context.relevantData.company));
    }

    return insights;
  }

  private async analyzeDealValuation(deal: any): Promise<string> {
    const valuation = deal.valuation || 0;
    const revenue = deal.revenue || 0;
    const multiple = valuation / revenue;

    if (multiple > 10) {
      return `⚠️ Valuation appears high: ${multiple.toFixed(1)}x revenue multiple. Industry average is 6-8x.`;
    }

    return `💡 Valuation looks reasonable: ${multiple.toFixed(1)}x revenue multiple.`;
  }

  private async analyzePortfolio(portfolio: any): Promise<string> {
    const portfolioSize = portfolio.companies?.length || 0;
    const sectors = new Set(portfolio.companies?.map((c: any) => c.sector) || []);

    if (sectors.size < portfolioSize / 3) {
      return `Recommendation: Consider diversifying across more sectors. Current concentration risk detected.`;
    }

    return `Portfolio diversification looks healthy across ${sectors.size} sectors.`;
  }

  private async assessRisk(company: any): Promise<string> {
    const riskFactors: string[] = [];

    if (company.monthlyRecurringRevenue && company.churnRate > 0.05) {
      riskFactors.push('High churn rate (>5%)');
    }

    if (company.customerConcentration > 0.3) {
      riskFactors.push('Customer concentration risk');
    }

    if (riskFactors.length > 0) {
      return `⚠️ Risk factors identified: ${riskFactors.join(', ')}`;
    }

    return 'Risk profile: Low to moderate risk detected.';
  }
}