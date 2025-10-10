
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

export interface Goal {
  id: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
}

export interface Commitment {
  id: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
}

export function useAccountability() {
  const goalsQuery = useQuery<Goal[]>({
    queryKey: ['/api/ai-agents/co-founder/goals'],
  });

  const commitmentsQuery = useQuery<Commitment[]>({
    queryKey: ['/api/ai-agents/co-founder/commitments'],
  });

  const addGoalMutation = useMutation({
    mutationFn: async (goal: Omit<Goal, 'id' | 'status' | 'progress'>) => {
      return await apiRequest('/api/ai-agents/co-founder/goals', {
        method: 'POST',
        body: JSON.stringify(goal)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-agents/co-founder/goals'] });
    }
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Goal> }) => {
      return await apiRequest(`/api/ai-agents/co-founder/goals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-agents/co-founder/goals'] });
    }
  });

  const addCommitmentMutation = useMutation({
    mutationFn: async (commitment: Omit<Commitment, 'id' | 'status'>) => {
      return await apiRequest('/api/ai-agents/co-founder/commitments', {
        method: 'POST',
        body: JSON.stringify(commitment)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-agents/co-founder/commitments'] });
    }
  });

  return {
    goals: goalsQuery.data || [],
    commitments: commitmentsQuery.data || [],
    isLoadingGoals: goalsQuery.isLoading,
    isLoadingCommitments: commitmentsQuery.isLoading,
    addGoal: addGoalMutation.mutate,
    updateGoal: updateGoalMutation.mutate,
    addCommitment: addCommitmentMutation.mutate,
    isAddingGoal: addGoalMutation.isPending,
    isUpdatingGoal: updateGoalMutation.isPending
  };
}
