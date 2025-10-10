
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface DecisionAnalysis {
  criteria: Array<{
    factor: string;
    weight: number;
    evaluation: string;
  }>;
  options: Array<{
    name: string;
    score: number;
    pros: string[];
    cons: string[];
  }>;
  recommendation: string;
  reasoning: string;
}

export interface ScenarioAnalysis {
  scenarios: {
    bestCase: {
      description: string;
      probability: number;
      outcomes: string[];
    };
    likelyCase: {
      description: string;
      probability: number;
      outcomes: string[];
    };
    worstCase: {
      description: string;
      probability: number;
      outcomes: string[];
    };
  };
  earlyWarningSignals: string[];
}

export function useDecisionSupport() {
  const analyzeDecisionMutation = useMutation({
    mutationFn: async ({ decision, options }: { decision: string; options?: string[] }) => {
      return await apiRequest<DecisionAnalysis>('/api/ai-agents/co-founder/decision/analyze', {
        method: 'POST',
        body: JSON.stringify({ decision, options })
      });
    }
  });

  const runScenariosMutation = useMutation({
    mutationFn: async (decision: string) => {
      return await apiRequest<ScenarioAnalysis>('/api/ai-agents/co-founder/decision/scenarios', {
        method: 'POST',
        body: JSON.stringify({ decision })
      });
    }
  });

  const runPremortemMutation = useMutation({
    mutationFn: async (decision: string) => {
      return await apiRequest('/api/ai-agents/co-founder/decision/premortem', {
        method: 'POST',
        body: JSON.stringify({ decision })
      });
    }
  });

  return {
    analyzeDecision: analyzeDecisionMutation.mutateAsync,
    runScenarios: runScenariosMutation.mutateAsync,
    runPremortem: runPremortemMutation.mutateAsync,
    isAnalyzing: analyzeDecisionMutation.isPending,
    isRunningScenarios: runScenariosMutation.isPending,
    isRunningPremortem: runPremortemMutation.isPending,
    decisionAnalysis: analyzeDecisionMutation.data,
    scenarioAnalysis: runScenariosMutation.data
  };
}
