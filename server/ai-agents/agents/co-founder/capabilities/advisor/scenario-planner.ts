
import { AgentContext } from "../../../../core/agent-engine";

export interface Scenario {
  name: string;
  description: string;
  probability: number;
  impact: number;
  triggers: string[];
  outcomes: string[];
  requiredActions: string[];
}

export class ScenarioPlanner {
  async generateScenarios(
    decision: string,
    context: AgentContext
  ): Promise<{
    bestCase: Scenario;
    likelyCase: Scenario;
    worstCase: Scenario;
    wildcard: Scenario;
  }> {
    return {
      bestCase: {
        name: 'Best Case Scenario',
        description: 'Everything goes better than expected',
        probability: 15,
        impact: 100,
        triggers: [
          'Market timing is perfect',
          'Team executes flawlessly',
          'No major competitive moves',
          'Resources are sufficient'
        ],
        outcomes: [
          'Rapid market adoption',
          'Strong revenue growth',
          'Team morale high',
          'Investor interest increases'
        ],
        requiredActions: [
          'Scale infrastructure quickly',
          'Hire aggressively',
          'Prepare for next funding round',
          'Expand to new markets'
        ]
      },
      
      likelyCase: {
        name: 'Most Likely Scenario',
        description: 'Mixed results requiring adjustments',
        probability: 60,
        impact: 60,
        triggers: [
          'Some features work, others don\'t',
          'Slower adoption than hoped',
          'Budget overruns by 20-30%',
          'Team needs reinforcement'
        ],
        outcomes: [
          'Moderate traction',
          'Need to pivot some aspects',
          'Extended timeline to profitability',
          'More fundraising required'
        ],
        requiredActions: [
          'Double down on what\'s working',
          'Cut or modify underperforming initiatives',
          'Extend runway through cost management',
          'Refine product-market fit'
        ]
      },
      
      worstCase: {
        name: 'Worst Case Scenario',
        description: 'Major challenges threaten viability',
        probability: 20,
        impact: -80,
        triggers: [
          'Market rejection',
          'Key team members leave',
          'Major technical failures',
          'Competitor launches superior solution'
        ],
        outcomes: [
          'Minimal customer adoption',
          'Rapid cash burn',
          'Team demoralization',
          'Pivot or shutdown required'
        ],
        requiredActions: [
          'Emergency cost cutting',
          'Immediate pivot assessment',
          'Bridge financing or wind down planning',
          'Transparent stakeholder communication'
        ]
      },
      
      wildcard: {
        name: 'Wildcard Scenario',
        description: 'Unexpected external event changes everything',
        probability: 5,
        impact: 50,
        triggers: [
          'Regulatory change',
          'Major industry consolidation',
          'Technology breakthrough',
          'Economic shock'
        ],
        outcomes: [
          'Complete strategy revision needed',
          'New opportunities or threats emerge',
          'Competitive landscape shifts',
          'Customer priorities change'
        ],
        requiredActions: [
          'Rapid strategy reassessment',
          'Flexible resource allocation',
          'Quick decision-making protocols',
          'Maintain strategic optionality'
        ]
      }
    };
  }

  async planForScenarios(
    decision: string,
    context: AgentContext
  ): Promise<{
    scenarios: {
      bestCase: Scenario;
      likelyCase: Scenario;
      worstCase: Scenario;
      wildcard: Scenario;
    };
    preparednessScore: number;
    recommendations: string[];
    earlyWarningSignals: string[];
  }> {
    const scenarios = await this.generateScenarios(decision, context);
    
    const preparednessScore = this.calculatePreparednessScore(scenarios);
    
    const recommendations = [
      'Build flexibility into plans to adapt across scenarios',
      'Define clear decision triggers for each scenario',
      'Allocate 20% resources to wildcard scenario preparation',
      'Review scenario progress monthly and update probabilities'
    ];
    
    const earlyWarningSignals = [
      'Customer engagement metrics trending below targets',
      'Burn rate exceeding projections by >15%',
      'Key team members expressing concerns',
      'Competitor activity increasing significantly',
      'Market sentiment shifting'
    ];
    
    return {
      scenarios,
      preparednessScore,
      recommendations,
      earlyWarningSignals
    };
  }

  private calculatePreparednessScore(scenarios: {
    bestCase: Scenario;
    likelyCase: Scenario;
    worstCase: Scenario;
  }): number {
    const hasContingencyPlans = true;
    const hasEarlyWarning = true;
    const hasFlexibility = true;
    
    let score = 0;
    if (hasContingencyPlans) score += 40;
    if (hasEarlyWarning) score += 30;
    if (hasFlexibility) score += 30;
    
    return score;
  }

  async formatScenarioAnalysis(
    decision: string,
    context: AgentContext
  ): Promise<string> {
    const analysis = await this.planForScenarios(decision, context);
    
    return `
📊 **Scenario Planning: ${decision}**

Let's think through what could happen:

**🎯 Most Likely (${analysis.scenarios.likelyCase.probability}% chance)**
${analysis.scenarios.likelyCase.description}
${analysis.scenarios.likelyCase.outcomes.map(o => `• ${o}`).join('\n')}

Actions needed: ${analysis.scenarios.likelyCase.requiredActions.join(', ')}

**🚀 Best Case (${analysis.scenarios.bestCase.probability}% chance)**
${analysis.scenarios.bestCase.description}
${analysis.scenarios.bestCase.outcomes.map(o => `• ${o}`).join('\n')}

**⚠️ Worst Case (${analysis.scenarios.worstCase.probability}% chance)**
${analysis.scenarios.worstCase.description}
${analysis.scenarios.worstCase.outcomes.map(o => `• ${o}`).join('\n')}

**🎲 Wildcard (${analysis.scenarios.wildcard.probability}% chance)**
${analysis.scenarios.wildcard.description}

**Early Warning Signals to Watch:**
${analysis.earlyWarningSignals.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Preparedness Score: ${analysis.preparednessScore}/100**

Which scenario are you most concerned about? Let's plan for it.
    `.trim();
  }
}
