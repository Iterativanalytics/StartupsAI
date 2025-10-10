
import { AgentContext } from "../../../core/agent-engine";

export interface WeeklyMetrics {
  revenue: { current: number; target: number; change: number };
  pipeline: { current: number; target: number; change: number };
  teamVelocity: { current: number; target: number; change: number };
  customerMetrics: { current: number; target: number; change: number };
}

export interface OKRProgress {
  objective: string;
  keyResults: Array<{
    description: string;
    target: number;
    current: number;
    status: 'on_track' | 'at_risk' | 'behind' | 'achieved';
  }>;
}

export class WeeklyReview {
  async conductWeeklyReview(context: AgentContext): Promise<{
    metrics: WeeklyMetrics;
    okrProgress: OKRProgress[];
    wins: string[];
    challenges: string[];
    insights: string[];
    focusAreas: string[];
  }> {
    const metrics = await this.gatherWeeklyMetrics(context);
    const okrProgress = await this.assessOKRProgress(context);
    const wins = await this.identifyWins(context);
    const challenges = await this.identifyChallenges(context);
    const insights = await this.generateInsights(metrics, okrProgress);
    const focusAreas = await this.suggestFocusAreas(metrics, okrProgress, challenges);
    
    return {
      metrics,
      okrProgress,
      wins,
      challenges,
      insights,
      focusAreas
    };
  }

  private async gatherWeeklyMetrics(context: AgentContext): Promise<WeeklyMetrics> {
    const businessData = context.relevantData || {};
    
    return {
      revenue: {
        current: businessData.revenue || 50000,
        target: 55000,
        change: 8
      },
      pipeline: {
        current: businessData.pipeline || 180000,
        target: 200000,
        change: -10
      },
      teamVelocity: {
        current: businessData.velocity || 85,
        target: 90,
        change: -5
      },
      customerMetrics: {
        current: businessData.customers || 120,
        target: 130,
        change: 5
      }
    };
  }

  private async assessOKRProgress(context: AgentContext): Promise<OKRProgress[]> {
    return [
      {
        objective: 'Hit $500K ARR by Q2 end',
        keyResults: [
          {
            description: 'Reach $42K MRR',
            target: 42000,
            current: 38500,
            status: 'on_track'
          },
          {
            description: 'Close 15 new deals',
            target: 15,
            current: 11,
            status: 'at_risk'
          },
          {
            description: 'Achieve 95% retention',
            target: 95,
            current: 92,
            status: 'behind'
          }
        ]
      },
      {
        objective: 'Launch v2.0 product',
        keyResults: [
          {
            description: 'Complete core features',
            target: 100,
            current: 85,
            status: 'at_risk'
          },
          {
            description: 'Beta test with 20 customers',
            target: 20,
            current: 12,
            status: 'behind'
          }
        ]
      }
    ];
  }

  private async identifyWins(context: AgentContext): Promise<string[]> {
    return [
      'Closed largest deal ever - $50K ARR contract',
      'Team velocity improved by 15% this sprint',
      'Customer satisfaction score up to 4.6/5',
      'Successfully recruited senior engineer'
    ];
  }

  private async identifyChallenges(context: AgentContext): Promise<string[]> {
    return [
      'Pipeline conversion rate dropping from 35% to 28%',
      'Product release delayed by 2 weeks',
      'Customer support ticket volume increasing',
      'Key team member considering leaving'
    ];
  }

  private async generateInsights(
    metrics: WeeklyMetrics,
    okrProgress: OKRProgress[]
  ): Promise<string[]> {
    const insights: string[] = [];
    
    if (metrics.revenue.change > 5) {
      insights.push(`Revenue momentum is strong (+${metrics.revenue.change}%) - capitalize on this trend`);
    }
    
    if (metrics.pipeline.change < -5) {
      insights.push(`Pipeline declining ${metrics.pipeline.change}% - this needs immediate attention`);
    }
    
    const atRiskOKRs = okrProgress.flatMap(okr => 
      okr.keyResults.filter(kr => kr.status === 'at_risk' || kr.status === 'behind')
    );
    
    if (atRiskOKRs.length > 0) {
      insights.push(`${atRiskOKRs.length} key results are at risk - may need to re-prioritize`);
    }
    
    return insights;
  }

  private async suggestFocusAreas(
    metrics: WeeklyMetrics,
    okrProgress: OKRProgress[],
    challenges: string[]
  ): Promise<string[]> {
    return [
      'Fix pipeline conversion - analyze why deals are stalling',
      'Get v2.0 product back on track - what\'s blocking progress?',
      'Address team retention - have 1-on-1 with at-risk team member',
      'Capitalize on revenue momentum - increase sales activity'
    ];
  }

  async formatWeeklyReview(context: AgentContext): Promise<string> {
    const review = await this.conductWeeklyReview(context);
    
    return `
📅 **Weekly Strategic Review**

**📊 Last Week's Numbers:**
• Revenue: $${review.metrics.revenue.current.toLocaleString()} (${review.metrics.revenue.change > 0 ? '+' : ''}${review.metrics.revenue.change}%) ${review.metrics.revenue.change > 0 ? '📈' : '📉'}
• Pipeline: $${review.metrics.pipeline.current.toLocaleString()} (${review.metrics.pipeline.change > 0 ? '+' : ''}${review.metrics.pipeline.change}%) ${review.metrics.pipeline.change > 0 ? '📈' : '📉'}
• Team Velocity: ${review.metrics.teamVelocity.current}% (${review.metrics.teamVelocity.change > 0 ? '+' : ''}${review.metrics.teamVelocity.change}%)
• Customers: ${review.metrics.customerMetrics.current} (${review.metrics.customerMetrics.change > 0 ? '+' : ''}${review.metrics.customerMetrics.change}%)

**🎯 OKR Progress:**
${review.okrProgress.map(okr => `
${okr.objective}:
${okr.keyResults.map(kr => `  • ${kr.description}: ${kr.current}/${kr.target} ${this.getStatusEmoji(kr.status)}`).join('\n')}
`).join('\n')}

**✅ This Week's Wins:**
${review.wins.map(w => `• ${w}`).join('\n')}

**⚠️ Challenges:**
${review.challenges.map(c => `• ${c}`).join('\n')}

**💡 Key Insights:**
${review.insights.map(i => `• ${i}`).join('\n')}

**🎯 This Week's Focus:**
${review.focusAreas.map((area, i) => `${i + 1}. ${area}`).join('\n')}

What do you want to tackle first this week?
    `.trim();
  }

  private getStatusEmoji(status: string): string {
    switch (status) {
      case 'achieved': return '✅';
      case 'on_track': return '🟢';
      case 'at_risk': return '🟡';
      case 'behind': return '🔴';
      default: return '⚪';
    }
  }
}
