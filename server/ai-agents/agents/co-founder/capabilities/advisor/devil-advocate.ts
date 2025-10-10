
import { AgentContext } from "../../../../core/agent-engine";

export interface ChallengePoint {
  assumption: string;
  challenge: string;
  evidence: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class DevilsAdvocate {
  async challengeIdea(idea: string, context: AgentContext): Promise<{
    assumptions: string[];
    challenges: ChallengePoint[];
    alternativePerspectives: string[];
    strengthenedApproach: string[];
  }> {
    const assumptions = await this.identifyAssumptions(idea);
    const challenges = await this.generateChallenges(assumptions, context);
    const perspectives = await this.offerAlternatives(idea, context);
    const improvements = await this.suggestImprovements(challenges);
    
    return {
      assumptions,
      challenges,
      alternativePerspectives: perspectives,
      strengthenedApproach: improvements
    };
  }

  private async identifyAssumptions(idea: string): Promise<string[]> {
    const assumptions: string[] = [];
    
    const patterns = [
      { regex: /users? (will|would|must|should|always)/i, assumption: 'Assuming predictable user behavior' },
      { regex: /(everyone|all|every)/i, assumption: 'Assuming universal applicability' },
      { regex: /(just|simply|easily|obviously)/i, assumption: 'Assuming simplicity of execution' },
      { regex: /(competitors? can't|won't|wouldn't)/i, assumption: 'Underestimating competition' },
      { regex: /market (is|will be)/i, assumption: 'Assuming market conditions' },
      { regex: /(clearly|definitely|certainly)/i, assumption: 'Assuming certainty in uncertain conditions' }
    ];
    
    patterns.forEach(({ regex, assumption }) => {
      if (regex.test(idea)) {
        assumptions.push(assumption);
      }
    });
    
    if (assumptions.length === 0) {
      assumptions.push(
        'Assuming current market conditions will persist',
        'Assuming team has required capabilities',
        'Assuming adequate resources available'
      );
    }
    
    return assumptions;
  }

  private async generateChallenges(assumptions: string[], context: AgentContext): Promise<ChallengePoint[]> {
    const challenges: ChallengePoint[] = [];
    
    if (assumptions.some(a => a.includes('user'))) {
      challenges.push({
        assumption: 'Users will adopt this behavior',
        challenge: 'What if users don\'t change their current habits? Behavior change is the hardest problem in tech.',
        evidence: '70% of product failures are due to lack of user adoption, not technical issues',
        severity: 'high'
      });
    }
    
    if (assumptions.some(a => a.includes('simple') || a.includes('easy'))) {
      challenges.push({
        assumption: 'This will be simple to execute',
        challenge: 'Implementation complexity often reveals itself only after starting. What hidden complexity might emerge?',
        evidence: 'Projects typically take 2-3x longer than initial estimates due to unforeseen complexity',
        severity: 'medium'
      });
    }
    
    if (assumptions.some(a => a.includes('competition'))) {
      challenges.push({
        assumption: 'Competitors won\'t respond',
        challenge: 'What if competitors copy this immediately? Or already have it in development?',
        evidence: 'First-mover advantage is often overrated - fast followers can win with better execution',
        severity: 'high'
      });
    }
    
    if (assumptions.some(a => a.includes('market'))) {
      challenges.push({
        assumption: 'Market will be receptive',
        challenge: 'Markets can shift quickly. What macro trends could make this irrelevant?',
        evidence: 'Economic conditions, regulations, and technology shifts can invalidate strategies overnight',
        severity: 'critical'
      });
    }
    
    if (challenges.length === 0) {
      challenges.push({
        assumption: 'Resources are sufficient',
        challenge: 'What if this takes 3x the time and budget you\'re expecting?',
        evidence: 'Most startup initiatives exceed time and budget estimates significantly',
        severity: 'medium'
      });
    }
    
    return challenges;
  }

  private async offerAlternatives(idea: string, context: AgentContext): Promise<string[]> {
    return [
      'What if you tested a smaller version first to validate core assumptions?',
      'What if you focused on a specific niche instead of the broad market?',
      'What if you partnered instead of building in-house?',
      'What if you waited 6 months to gather more data?',
      'What if you completely reversed the approach?'
    ];
  }

  private async suggestImprovements(challenges: ChallengePoint[]): Promise<string[]> {
    return [
      'Test core assumptions with minimum viable experiments before full commitment',
      'Build in circuit breakers - clear signals that would cause you to stop',
      'Create parallel backup plans for high-severity risks',
      'Get external validation from customers, advisors, or industry experts',
      'Document what would prove you wrong and actively look for that evidence'
    ];
  }

  async playDevilsAdvocate(
    proposal: string,
    context: AgentContext
  ): Promise<string> {
    const result = await this.challengeIdea(proposal, context);
    
    return `
🔍 **Playing Devil's Advocate**

I need to challenge this idea constructively. Here's what concerns me:

**Assumptions I'm Seeing:**
${result.assumptions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

**Key Challenges:**
${result.challenges.map(c => `
⚠️ **${c.assumption}**
Challenge: ${c.challenge}
Evidence: ${c.evidence}
Severity: ${c.severity.toUpperCase()}
`).join('\n')}

**Alternative Perspectives:**
${result.alternativePerspectives.map((p, i) => `${i + 1}. ${p}`).join('\n')}

**How to Strengthen This Approach:**
${result.strengthenedApproach.map((s, i) => `${i + 1}. ${s}`).join('\n')}

I'm not trying to kill this idea - I'm trying to make it bulletproof. How do you respond to these challenges?
    `.trim();
  }
}
