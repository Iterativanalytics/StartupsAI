import Anthropic from '@anthropic-ai/sdk';
import { BaseAgent } from '../base-agent';
import { AgentType, AgentConfig, AgentContext } from '../../types';

export class ProgramAnalystAgent extends BaseAgent {
  protected agentType = AgentType.PROGRAM_ANALYST;

  constructor(client: Anthropic, config: AgentConfig) {
    super(client, config);
  }

  protected async generateInsights(context: AgentContext): Promise<string[]> {
    const insights: string[] = [];

    // Matching insights
    if (context.relevantData?.startups) {
      insights.push(await this.findMatches(context.relevantData.startups));
    }

    // Program optimization
    if (context.relevantData?.program) {
      insights.push(await this.optimizeProgram(context.relevantData.program));
    }

    // Success prediction
    if (context.relevantData?.partnership) {
      insights.push(await this.predictSuccess(context.relevantData.partnership));
    }

    return insights;
  }

  private async findMatches(startups: any[]): Promise<string> {
    const matches = startups.filter(startup => {
      // Simple matching algorithm - in production would use ML
      return startup.stage === 'seed' && startup.industry === 'fintech';
    });

    if (matches.length > 0) {
      return `💡 Found ${matches.length} startups matching your criteria. Top matches: ${matches.slice(0, 3).map(s => s.name).join(', ')}`;
    }

    return 'No strong matches found at this time. Consider broadening criteria.';
  }

  private async optimizeProgram(program: any): Promise<string> {
    const recommendations: string[] = [];

    // Analyze program performance
    const completionRate = program.completions / program.enrolled;
    if (completionRate < 0.7) {
      recommendations.push('Increase mentor engagement to improve completion rate');
    }

    const satisfactionScore = program.satisfaction || 0;
    if (satisfactionScore < 4.0) {
      recommendations.push('Gather feedback to improve program content');
    }

    if (recommendations.length > 0) {
      return `Recommendations: ${recommendations.join('; ')}`;
    }

    return 'Program performing well. Continue current approach.';
  }

  private async predictSuccess(partnership: any): Promise<string> {
    let successScore = 50; // Base score

    // Factor in compatibility
    if (partnership.industryAlignment === 'high') successScore += 20;
    if (partnership.cultureMatch === 'strong') successScore += 15;
    if (partnership.resourceFit === 'excellent') successScore += 15;

    if (successScore >= 80) {
      return `💡 Partnership Success Probability: ${successScore}% - Excellent fit, high likelihood of success.`;
    } else if (successScore >= 60) {
      return `Partnership Success Probability: ${successScore}% - Good potential, monitor alignment.`;
    } else {
      return `⚠️ Partnership Success Probability: ${successScore}% - Moderate fit, may face challenges.`;
    }
  }
}