import Anthropic from '@anthropic-ai/sdk';
import { BaseAgent } from '../base-agent';
import { AgentType, AgentConfig, AgentContext } from '../../types';

export class ImpactEvaluatorAgent extends BaseAgent {
  protected agentType = AgentType.IMPACT_EVALUATOR;

  constructor(client: Anthropic, config: AgentConfig) {
    super(client, config);
  }

  protected async generateInsights(context: AgentContext): Promise<string[]> {
    const insights: string[] = [];

    // Impact scoring
    if (context.relevantData?.program) {
      insights.push(await this.scoreImpact(context.relevantData.program));
    }

    // Sustainability analysis
    if (context.relevantData?.sustainability) {
      insights.push(await this.analyzeSustainability(context.relevantData.sustainability));
    }

    // Outcome prediction
    if (context.relevantData?.metrics) {
      insights.push(await this.predictOutcomes(context.relevantData.metrics));
    }

    return insights;
  }

  private async scoreImpact(program: any): Promise<string> {
    let impactScore = 0;

    // Social impact factors
    if (program.beneficiaries > 1000) impactScore += 30;
    else if (program.beneficiaries > 100) impactScore += 20;
    else impactScore += 10;

    // Environmental impact
    if (program.co2Reduction > 100) impactScore += 30;
    else if (program.co2Reduction > 10) impactScore += 20;

    // Economic impact
    if (program.jobsCreated > 50) impactScore += 20;
    else if (program.jobsCreated > 10) impactScore += 10;

    // Sustainability
    if (program.sustainable === true) impactScore += 20;

    if (impactScore >= 70) {
      return `💡 Impact Score: ${impactScore}/100 - Exceptional impact potential. Strong candidate for funding.`;
    } else if (impactScore >= 50) {
      return `Impact Score: ${impactScore}/100 - Good impact potential. Consider for funding.`;
    } else {
      return `Impact Score: ${impactScore}/100 - Moderate impact. May need strengthening in key areas.`;
    }
  }

  private async analyzeSustainability(sustainability: any): Promise<string> {
    const esgScore = (
      (sustainability.environmental || 0) +
      (sustainability.social || 0) +
      (sustainability.governance || 0)
    ) / 3;

    if (esgScore >= 80) {
      return `ESG Analysis: Score of ${esgScore.toFixed(1)}/100 - Excellent sustainability practices.`;
    } else if (esgScore >= 60) {
      return `ESG Analysis: Score of ${esgScore.toFixed(1)}/100 - Good progress, room for improvement.`;
    } else {
      return `⚠️ ESG Analysis: Score of ${esgScore.toFixed(1)}/100 - Needs significant improvement.`;
    }
  }

  private async predictOutcomes(metrics: any): Promise<string> {
    const successProbability = this.calculateSuccessProbability(metrics);

    if (successProbability >= 0.7) {
      return `💡 Outcome Prediction: ${(successProbability * 100).toFixed(0)}% probability of achieving stated goals.`;
    } else if (successProbability >= 0.5) {
      return `Outcome Prediction: ${(successProbability * 100).toFixed(0)}% success probability. Monitor closely.`;
    } else {
      return `⚠️ Outcome Prediction: ${(successProbability * 100).toFixed(0)}% success probability. High risk of underperformance.`;
    }
  }

  private calculateSuccessProbability(metrics: any): number {
    // Simple algorithm - in production would use ML model
    let probability = 0.5;

    if (metrics.teamExperience >= 5) probability += 0.2;
    if (metrics.fundingSecured) probability += 0.15;
    if (metrics.pilotSuccessful) probability += 0.15;

    return Math.min(probability, 1.0);
  }
}