import { AgentContext, AgentResponse } from '../types';

export interface ChainStep {
  name: string;
  agentType: string;
  input: (context: AgentContext, previousResults: any[]) => any;
  condition?: (context: AgentContext, previousResults: any[]) => boolean;
}

export class AgentChain {
  private steps: ChainStep[] = [];

  addStep(step: ChainStep): this {
    this.steps.push(step);
    return this;
  }

  async execute(initialContext: AgentContext): Promise<any[]> {
    const results: any[] = [];
    let context = { ...initialContext };

    for (const step of this.steps) {
      // Check condition if exists
      if (step.condition && !step.condition(context, results)) {
        console.log(`Skipping step: ${step.name}`);
        continue;
      }

      console.log(`Executing step: ${step.name}`);
      
      // Prepare input for this step
      const input = step.input(context, results);
      
      // Execute agent (would call actual agent here)
      const result = await this.executeAgent(step.agentType, input);
      
      results.push({
        step: step.name,
        result
      });

      // Update context with results
      context.relevantData = {
        ...context.relevantData,
        previousSteps: results
      };
    }

    return results;
  }

  private async executeAgent(agentType: string, input: any): Promise<any> {
    // Placeholder - would call actual agent
    return {
      agentType,
      input,
      output: `Result from ${agentType}`,
      timestamp: new Date()
    };
  }
}

// Example chain: Complete deal analysis
export function createDealAnalysisChain(): AgentChain {
  return new AgentChain()
    .addStep({
      name: 'initial_screening',
      agentType: 'deal_analyzer',
      input: (context) => ({
        task: 'screen_deal',
        dealData: context.relevantData.deal
      })
    })
    .addStep({
      name: 'detailed_valuation',
      agentType: 'deal_analyzer',
      input: (context, results) => ({
        task: 'value_company',
        dealData: context.relevantData.deal,
        screeningResult: results[0]
      }),
      condition: (context, results) => {
        return results[0]?.result?.passed === true;
      }
    })
    .addStep({
      name: 'risk_assessment',
      agentType: 'deal_analyzer',
      input: (context, results) => ({
        task: 'assess_risk',
        dealData: context.relevantData.deal,
        valuation: results[1]
      })
    });
}

// Example chain: Loan underwriting
export function createLoanUnderwritingChain(): AgentChain {
  return new AgentChain()
    .addStep({
      name: 'credit_scoring',
      agentType: 'credit_assessor',
      input: (context) => ({
        task: 'score_credit',
        application: context.relevantData.application
      })
    })
    .addStep({
      name: 'cash_flow_analysis',
      agentType: 'credit_assessor',
      input: (context) => ({
        task: 'analyze_cash_flow',
        financials: context.relevantData.financials
      })
    })
    .addStep({
      name: 'collateral_evaluation',
      agentType: 'credit_assessor',
      input: (context) => ({
        task: 'evaluate_collateral',
        collateral: context.relevantData.collateral
      })
    })
    .addStep({
      name: 'final_decision',
      agentType: 'credit_assessor',
      input: (context, results) => ({
        task: 'make_decision',
        creditScore: results[0],
        cashFlowAnalysis: results[1],
        collateralEvaluation: results[2]
      })
    });
}