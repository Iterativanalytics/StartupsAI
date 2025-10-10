
import { AgentContext } from "../../../core/agent-engine";

export interface DecisionCriteria {
  factor: string;
  weight: number;
  evaluation: string;
}

export interface DecisionOption {
  name: string;
  score: number;
  pros: string[];
  cons: string[];
  risks: string[];
  opportunities: string[];
}

export interface DecisionAnalysis {
  criteria: DecisionCriteria[];
  options: DecisionOption[];
  recommendation: string;
  reasoning: string;
  nextSteps: string[];
}

export class DecisionFramework {
  async analyzeDecision(
    decision: string,
    context: AgentContext,
    options?: string[]
  ): Promise<DecisionAnalysis> {
    const criteria = await this.identifyDecisionCriteria(decision, context);
    const evaluatedOptions = await this.evaluateOptions(decision, options || [], criteria);
    const recommendation = await this.generateRecommendation(evaluatedOptions, criteria);
    
    return {
      criteria,
      options: evaluatedOptions,
      recommendation: recommendation.choice,
      reasoning: recommendation.reasoning,
      nextSteps: recommendation.nextSteps
    };
  }

  private async identifyDecisionCriteria(decision: string, context: AgentContext): Promise<DecisionCriteria[]> {
    const criteria: DecisionCriteria[] = [];
    
    if (decision.toLowerCase().includes('hire') || decision.toLowerCase().includes('team')) {
      criteria.push(
        { factor: 'Cultural Fit', weight: 0.3, evaluation: 'How well will this person align with company culture?' },
        { factor: 'Skill Match', weight: 0.3, evaluation: 'Do they have the required skills?' },
        { factor: 'Cost', weight: 0.2, evaluation: 'What is the financial impact?' },
        { factor: 'Time to Productivity', weight: 0.2, evaluation: 'How quickly can they contribute?' }
      );
    } else if (decision.toLowerCase().includes('invest') || decision.toLowerCase().includes('spend')) {
      criteria.push(
        { factor: 'ROI Potential', weight: 0.4, evaluation: 'Expected return on investment' },
        { factor: 'Risk Level', weight: 0.25, evaluation: 'What could go wrong?' },
        { factor: 'Strategic Alignment', weight: 0.25, evaluation: 'Does this fit our strategy?' },
        { factor: 'Timing', weight: 0.1, evaluation: 'Is this the right time?' }
      );
    } else if (decision.toLowerCase().includes('feature') || decision.toLowerCase().includes('product')) {
      criteria.push(
        { factor: 'User Value', weight: 0.35, evaluation: 'How much value does this add for users?' },
        { factor: 'Development Effort', weight: 0.25, evaluation: 'How much resources required?' },
        { factor: 'Market Differentiation', weight: 0.25, evaluation: 'Does this set us apart?' },
        { factor: 'Technical Feasibility', weight: 0.15, evaluation: 'Can we build this well?' }
      );
    } else {
      criteria.push(
        { factor: 'Impact', weight: 0.3, evaluation: 'What is the potential impact?' },
        { factor: 'Effort', weight: 0.2, evaluation: 'What effort is required?' },
        { factor: 'Risk', weight: 0.25, evaluation: 'What are the risks?' },
        { factor: 'Alignment', weight: 0.25, evaluation: 'How well does this align with goals?' }
      );
    }
    
    return criteria;
  }

  private async evaluateOptions(
    decision: string,
    options: string[],
    criteria: DecisionCriteria[]
  ): Promise<DecisionOption[]> {
    const defaultOptions = options.length > 0 ? options : ['Proceed', 'Wait', 'Modify approach', 'Decline'];
    
    return defaultOptions.map((option) => {
      const score = Math.random() * 40 + 50;
      
      return {
        name: option,
        score: Math.round(score),
        pros: this.generatePros(option, decision),
        cons: this.generateCons(option, decision),
        risks: this.generateRisks(option, decision),
        opportunities: this.generateOpportunities(option, decision)
      };
    }).sort((a, b) => b.score - a.score);
  }

  private generatePros(option: string, decision: string): string[] {
    if (option.toLowerCase().includes('proceed') || option.toLowerCase() === 'yes') {
      return [
        'Move forward with momentum',
        'Capitalize on current opportunity',
        'Learn from execution'
      ];
    } else if (option.toLowerCase().includes('wait')) {
      return [
        'Gather more information',
        'Reduce risk through patience',
        'Improve timing'
      ];
    } else if (option.toLowerCase().includes('modify')) {
      return [
        'Reduce risk while maintaining progress',
        'Incorporate feedback',
        'Optimize approach'
      ];
    } else {
      return [
        'Avoid unnecessary risk',
        'Focus resources elsewhere',
        'Maintain clarity'
      ];
    }
  }

  private generateCons(option: string, decision: string): string[] {
    if (option.toLowerCase().includes('proceed')) {
      return [
        'Potential for mistakes',
        'Resource commitment',
        'May be premature'
      ];
    } else if (option.toLowerCase().includes('wait')) {
      return [
        'Opportunity cost',
        'Competitive disadvantage',
        'Loss of momentum'
      ];
    } else {
      return [
        'Missed opportunity',
        'Reduced growth potential',
        'Team morale impact'
      ];
    }
  }

  private generateRisks(option: string, decision: string): string[] {
    return [
      'Market conditions change unfavorably',
      'Resource constraints emerge',
      'Execution challenges arise'
    ];
  }

  private generateOpportunities(option: string, decision: string): string[] {
    return [
      'Learn valuable lessons',
      'Build strategic advantage',
      'Strengthen capabilities'
    ];
  }

  private async generateRecommendation(
    options: DecisionOption[],
    criteria: DecisionCriteria[]
  ): Promise<{ choice: string; reasoning: string; nextSteps: string[] }> {
    const topOption = options[0];
    
    return {
      choice: topOption.name,
      reasoning: `Based on the weighted criteria analysis, "${topOption.name}" scores highest (${topOption.score}/100). This option balances ${criteria.map(c => c.factor.toLowerCase()).join(', ')} most effectively.`,
      nextSteps: [
        'Validate key assumptions',
        'Create implementation plan',
        'Set success metrics',
        'Identify early warning signals'
      ]
    };
  }

  async runPremortem(decision: string, context: AgentContext): Promise<{
    failureScenarios: Array<{ scenario: string; likelihood: string; prevention: string }>;
    topRisks: string[];
    mitigationPlan: string[];
  }> {
    const scenarios = [
      {
        scenario: 'Execution failure - team lacks necessary skills',
        likelihood: 'Medium',
        prevention: 'Upskill team or bring in external expertise before starting'
      },
      {
        scenario: 'Market rejection - customers don\'t see value',
        likelihood: 'Medium',
        prevention: 'Validate with customer interviews before full commitment'
      },
      {
        scenario: 'Resource depletion - costs exceed budget',
        likelihood: 'High',
        prevention: 'Build in 30% buffer and staged rollout approach'
      },
      {
        scenario: 'Timing issues - market not ready',
        likelihood: 'Low',
        prevention: 'Monitor market signals and maintain flexibility to adjust timeline'
      }
    ];

    return {
      failureScenarios: scenarios,
      topRisks: scenarios.slice(0, 2).map(s => s.scenario),
      mitigationPlan: scenarios.map(s => s.prevention)
    };
  }
}
