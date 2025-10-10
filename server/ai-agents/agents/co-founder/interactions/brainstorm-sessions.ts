
import { AgentContext } from "../../../core/agent-engine";

export interface BrainstormIdea {
  idea: string;
  category: 'conventional' | 'unconventional' | 'wildcard';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  feasibility: number;
}

export class BrainstormSession {
  async facilitateBrainstorm(
    topic: string,
    context: AgentContext
  ): Promise<{
    ideas: BrainstormIdea[];
    synthesizedApproaches: string[];
    nextSteps: string[];
  }> {
    const ideas = await this.generateIdeas(topic, context);
    const synthesized = await this.synthesizeApproaches(ideas);
    const nextSteps = await this.defineNextSteps(ideas, synthesized);
    
    return {
      ideas,
      synthesizedApproaches: synthesized,
      nextSteps
    };
  }

  private async generateIdeas(topic: string, context: AgentContext): Promise<BrainstormIdea[]> {
    const ideas: BrainstormIdea[] = [];
    
    if (topic.toLowerCase().includes('revenue') || topic.toLowerCase().includes('monetiz')) {
      ideas.push(
        {
          idea: 'Add premium tier with advanced analytics',
          category: 'conventional',
          effort: 'medium',
          impact: 'medium',
          feasibility: 80
        },
        {
          idea: 'Create a marketplace for user-generated templates',
          category: 'unconventional',
          effort: 'high',
          impact: 'high',
          feasibility: 60
        },
        {
          idea: 'Offer white-label licensing to agencies',
          category: 'conventional',
          effort: 'medium',
          impact: 'high',
          feasibility: 70
        },
        {
          idea: 'Launch a certification program for power users',
          category: 'unconventional',
          effort: 'low',
          impact: 'medium',
          feasibility: 75
        },
        {
          idea: 'Partner with complementary tools for revenue share',
          category: 'conventional',
          effort: 'low',
          impact: 'medium',
          feasibility: 85
        },
        {
          idea: 'Create a DAO and issue tokens for platform governance',
          category: 'wildcard',
          effort: 'high',
          impact: 'high',
          feasibility: 30
        }
      );
    } else if (topic.toLowerCase().includes('growth') || topic.toLowerCase().includes('customer')) {
      ideas.push(
        {
          idea: 'Build product-led growth with freemium model',
          category: 'conventional',
          effort: 'medium',
          impact: 'high',
          feasibility: 75
        },
        {
          idea: 'Create viral referral program with incentives',
          category: 'conventional',
          effort: 'low',
          impact: 'medium',
          feasibility: 85
        },
        {
          idea: 'Launch community-driven content platform',
          category: 'unconventional',
          effort: 'medium',
          impact: 'high',
          feasibility: 65
        },
        {
          idea: 'Partner with influencers for authentic promotion',
          category: 'conventional',
          effort: 'low',
          impact: 'medium',
          feasibility: 80
        },
        {
          idea: 'Gamify the product to increase engagement',
          category: 'unconventional',
          effort: 'medium',
          impact: 'medium',
          feasibility: 70
        },
        {
          idea: 'Acquire a complementary company for user base',
          category: 'wildcard',
          effort: 'high',
          impact: 'high',
          feasibility: 40
        }
      );
    } else {
      ideas.push(
        {
          idea: 'Optimize existing processes incrementally',
          category: 'conventional',
          effort: 'low',
          impact: 'medium',
          feasibility: 90
        },
        {
          idea: 'Completely reimagine the approach',
          category: 'unconventional',
          effort: 'high',
          impact: 'high',
          feasibility: 50
        },
        {
          idea: 'Form strategic partnerships',
          category: 'conventional',
          effort: 'medium',
          impact: 'medium',
          feasibility: 75
        },
        {
          idea: 'Build community-first solution',
          category: 'unconventional',
          effort: 'medium',
          impact: 'high',
          feasibility: 65
        },
        {
          idea: 'Leverage emerging technology',
          category: 'wildcard',
          effort: 'high',
          impact: 'high',
          feasibility: 45
        }
      );
    }
    
    return ideas;
  }

  private async synthesizeApproaches(ideas: BrainstormIdea[]): Promise<string[]> {
    const quickWins = ideas.filter(i => i.effort === 'low' && i.impact !== 'low');
    const highImpact = ideas.filter(i => i.impact === 'high' && i.feasibility > 60);
    
    const approaches: string[] = [];
    
    if (quickWins.length > 0) {
      approaches.push(
        `Quick Wins Strategy: ${quickWins.map(i => i.idea).join(', ')}. Start here for fast traction.`
      );
    }
    
    if (highImpact.length > 0) {
      approaches.push(
        `High Impact Bets: ${highImpact.map(i => i.idea).join(', ')}. Invest heavily if validated.`
      );
    }
    
    approaches.push(
      'Hybrid Approach: Combine 2-3 ideas for compounding effect',
      'Experimental Portfolio: Test multiple approaches simultaneously with clear success metrics'
    );
    
    return approaches;
  }

  private async defineNextSteps(ideas: BrainstormIdea[], synthesized: string[]): Promise<string[]> {
    const topIdeas = ideas
      .sort((a, b) => {
        const scoreA = this.calculateScore(a);
        const scoreB = this.calculateScore(b);
        return scoreB - scoreA;
      })
      .slice(0, 3);
    
    return [
      `Validate top idea with customers: "${topIdeas[0].idea}"`,
      'Create quick prototype or mockup to test concept',
      'Define success metrics for each approach',
      'Set 30-day timeline to test and measure',
      'Schedule follow-up to review results'
    ];
  }

  private calculateScore(idea: BrainstormIdea): number {
    const effortScore = idea.effort === 'low' ? 3 : idea.effort === 'medium' ? 2 : 1;
    const impactScore = idea.impact === 'high' ? 3 : idea.impact === 'medium' ? 2 : 1;
    return (effortScore + impactScore + idea.feasibility / 20);
  }

  async formatBrainstormSession(topic: string, context: AgentContext): Promise<string> {
    const session = await this.facilitateBrainstorm(topic, context);
    
    const conventional = session.ideas.filter(i => i.category === 'conventional');
    const unconventional = session.ideas.filter(i => i.category === 'unconventional');
    const wildcard = session.ideas.filter(i => i.category === 'wildcard');
    
    return `
💡 **Brainstorm Session: ${topic}**

Let's explore all possibilities - no judgment, just ideas!

**🎯 Conventional Approaches:**
${conventional.map((i, idx) => `${idx + 1}. ${i.idea}\n   Effort: ${i.effort} | Impact: ${i.impact} | Feasibility: ${i.feasibility}%`).join('\n\n')}

**🚀 Unconventional Angles:**
${unconventional.map((i, idx) => `${idx + 1}. ${i.idea}\n   Effort: ${i.effort} | Impact: ${i.impact} | Feasibility: ${i.feasibility}%`).join('\n\n')}

**🎲 Wildcard Ideas:**
${wildcard.map((i, idx) => `${idx + 1}. ${i.idea}\n   Effort: ${i.effort} | Impact: ${i.impact} | Feasibility: ${i.feasibility}%`).join('\n\n')}

**✨ Synthesized Approaches:**
${session.synthesizedApproaches.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**📋 Suggested Next Steps:**
${session.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Which direction sparks the most energy for you? Or should we explore something completely different?
    `.trim();
  }
}
