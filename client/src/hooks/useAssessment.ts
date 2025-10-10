/**
 * Assessment Hook
 * 
 * React hook for managing assessment sessions and results
 * - Start/resume assessments
 * - Submit responses
 * - Track progress
 * - View results
 */

import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ============================================================================
// TYPES
// ============================================================================

export interface AssessmentType {
  id: string;
  name: string;
  description: string;
  duration: string;
  questions: number;
  benefits: string[];
}

export interface AssessmentSession {
  sessionId: string;
  assessmentType: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  progressPercentage: number;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  category?: string;
  options?: Array<{ value: number; label: string }>;
}

export interface AssessmentProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  progressPercentage: number;
  isComplete: boolean;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

async function fetchAssessmentTypes(): Promise<AssessmentType[]> {
  const response = await fetch('/api/assessments/types');
  if (!response.ok) throw new Error('Failed to fetch assessment types');
  const data = await response.json();
  return data.assessmentTypes;
}

async function startAssessment(assessmentType: string): Promise<{
  session: AssessmentSession;
  questions: AssessmentQuestion[];
}> {
  const response = await fetch('/api/assessments/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assessmentType })
  });
  
  if (!response.ok) throw new Error('Failed to start assessment');
  return await response.json();
}

async function submitResponse(
  sessionId: string,
  questionId: string,
  value: number | string
): Promise<AssessmentProgress> {
  const response = await fetch('/api/assessments/response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, questionId, value })
  });
  
  if (!response.ok) throw new Error('Failed to submit response');
  const data = await response.json();
  return data.progress;
}

async function completeAssessment(sessionId: string): Promise<any> {
  const response = await fetch('/api/assessments/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });
  
  if (!response.ok) throw new Error('Failed to complete assessment');
  return await response.json();
}

async function abandonAssessment(sessionId: string): Promise<void> {
  const response = await fetch('/api/assessments/abandon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });
  
  if (!response.ok) throw new Error('Failed to abandon assessment');
}

async function fetchActiveSessions(): Promise<AssessmentSession[]> {
  const response = await fetch('/api/assessments/active');
  if (!response.ok) throw new Error('Failed to fetch active sessions');
  const data = await response.json();
  return data.sessions;
}

async function fetchAssessmentResults(assessmentType: string): Promise<any> {
  const response = await fetch(`/api/assessments/results/${assessmentType}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch assessment results');
  }
  const data = await response.json();
  return data.assessment;
}

async function fetchAllResults(): Promise<any[]> {
  const response = await fetch('/api/assessments/results');
  if (!response.ok) throw new Error('Failed to fetch assessments');
  const data = await response.json();
  return data.assessments;
}

async function fetchCompositeProfile(): Promise<any> {
  const response = await fetch('/api/assessments/profile');
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch composite profile');
  }
  const data = await response.json();
  return data.profile;
}

async function triggerAgentAdaptation(): Promise<any> {
  const response = await fetch('/api/assessments/adapt-agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!response.ok) throw new Error('Failed to trigger agent adaptation');
  return await response.json();
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useAssessment() {
  const queryClient = useQueryClient();
  const [currentSession, setCurrentSession] = useState<AssessmentSession | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fetch available assessment types
  const { data: assessmentTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['assessmentTypes'],
    queryFn: fetchAssessmentTypes
  });

  // Fetch active sessions
  const { data: activeSessions, isLoading: isLoadingActiveSessions } = useQuery({
    queryKey: ['activeSessions'],
    queryFn: fetchActiveSessions
  });

  // Start assessment mutation
  const startAssessmentMutation = useMutation({
    mutationFn: (assessmentType: string) => startAssessment(assessmentType),
    onSuccess: (data) => {
      setCurrentSession(data.session);
      setCurrentQuestions(data.questions);
      setCurrentQuestionIndex(data.session.currentQuestionIndex);
      queryClient.invalidateQueries({ queryKey: ['activeSessions'] });
    }
  });

  // Submit response mutation
  const submitResponseMutation = useMutation({
    mutationFn: ({ sessionId, questionId, value }: {
      sessionId: string;
      questionId: string;
      value: number | string;
    }) => submitResponse(sessionId, questionId, value),
    onSuccess: (progress) => {
      setCurrentQuestionIndex(progress.currentQuestionIndex);
      
      if (currentSession) {
        setCurrentSession({
          ...currentSession,
          currentQuestionIndex: progress.currentQuestionIndex,
          progressPercentage: progress.progressPercentage
        });
      }
    }
  });

  // Complete assessment mutation
  const completeAssessmentMutation = useMutation({
    mutationFn: (sessionId: string) => completeAssessment(sessionId),
    onSuccess: () => {
      setCurrentSession(null);
      setCurrentQuestions([]);
      setCurrentQuestionIndex(0);
      queryClient.invalidateQueries({ queryKey: ['activeSessions'] });
      queryClient.invalidateQueries({ queryKey: ['assessmentResults'] });
      queryClient.invalidateQueries({ queryKey: ['compositeProfile'] });
    }
  });

  // Abandon assessment mutation
  const abandonAssessmentMutation = useMutation({
    mutationFn: (sessionId: string) => abandonAssessment(sessionId),
    onSuccess: () => {
      setCurrentSession(null);
      setCurrentQuestions([]);
      setCurrentQuestionIndex(0);
      queryClient.invalidateQueries({ queryKey: ['activeSessions'] });
    }
  });

  // Trigger agent adaptation mutation
  const adaptAgentsMutation = useMutation({
    mutationFn: () => triggerAgentAdaptation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentAdaptation'] });
    }
  });

  // ============================================================================
  // CONVENIENCE METHODS
  // ============================================================================

  const startNewAssessment = useCallback((assessmentType: string) => {
    return startAssessmentMutation.mutateAsync(assessmentType);
  }, [startAssessmentMutation]);

  const answerQuestion = useCallback((questionId: string, value: number | string) => {
    if (!currentSession) {
      throw new Error('No active session');
    }

    return submitResponseMutation.mutateAsync({
      sessionId: currentSession.sessionId,
      questionId,
      value
    });
  }, [currentSession, submitResponseMutation]);

  const finishAssessment = useCallback(() => {
    if (!currentSession) {
      throw new Error('No active session');
    }

    return completeAssessmentMutation.mutateAsync(currentSession.sessionId);
  }, [currentSession, completeAssessmentMutation]);

  const cancelAssessment = useCallback(() => {
    if (!currentSession) {
      throw new Error('No active session');
    }

    return abandonAssessmentMutation.mutateAsync(currentSession.sessionId);
  }, [currentSession, abandonAssessmentMutation]);

  const getCurrentQuestion = useCallback(() => {
    if (!currentQuestions || currentQuestionIndex >= currentQuestions.length) {
      return null;
    }
    return currentQuestions[currentQuestionIndex];
  }, [currentQuestions, currentQuestionIndex]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, currentQuestions]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return {
    // Data
    assessmentTypes,
    activeSessions,
    currentSession,
    currentQuestion: getCurrentQuestion(),
    currentQuestionIndex,
    totalQuestions: currentQuestions.length,
    progressPercentage: currentSession?.progressPercentage || 0,
    
    // State
    isLoadingTypes,
    isLoadingActiveSessions,
    isStarting: startAssessmentMutation.isPending,
    isSubmitting: submitResponseMutation.isPending,
    isCompleting: completeAssessmentMutation.isPending,
    isAbandoning: abandonAssessmentMutation.isPending,
    isAdaptingAgents: adaptAgentsMutation.isPending,
    
    // Navigation
    isLastQuestion,
    isFirstQuestion,
    canGoNext: currentQuestionIndex < currentQuestions.length - 1,
    canGoPrevious: currentQuestionIndex > 0,
    
    // Actions
    startNewAssessment,
    answerQuestion,
    finishAssessment,
    cancelAssessment,
    goToNextQuestion,
    goToPreviousQuestion,
    adaptAgents: () => adaptAgentsMutation.mutateAsync(),
    
    // Errors
    error: startAssessmentMutation.error || 
           submitResponseMutation.error || 
           completeAssessmentMutation.error ||
           abandonAssessmentMutation.error
  };
}

// ============================================================================
// RESULTS HOOK
// ============================================================================

export function useAssessmentResults(assessmentType?: string) {
  const queryClient = useQueryClient();

  // Fetch specific assessment results
  const { data: results, isLoading, error } = useQuery({
    queryKey: ['assessmentResults', assessmentType],
    queryFn: () => assessmentType ? fetchAssessmentResults(assessmentType) : null,
    enabled: !!assessmentType
  });

  // Fetch all results
  const { data: allResults, isLoading: isLoadingAll } = useQuery({
    queryKey: ['allAssessmentResults'],
    queryFn: fetchAllResults
  });

  // Fetch composite profile
  const { data: compositeProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['compositeProfile'],
    queryFn: fetchCompositeProfile
  });

  const refreshResults = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['assessmentResults'] });
    queryClient.invalidateQueries({ queryKey: ['allAssessmentResults'] });
    queryClient.invalidateQueries({ queryKey: ['compositeProfile'] });
  }, [queryClient]);

  return {
    results,
    allResults,
    compositeProfile,
    isLoading: isLoading || isLoadingAll || isLoadingProfile,
    error,
    refreshResults,
    hasResults: !!results,
    hasCompositeProfile: !!compositeProfile
  };
}

// ============================================================================
// AGENT ADAPTATION HOOK
// ============================================================================

export function useAgentAdaptation(agentType?: string) {
  const queryClient = useQueryClient();

  // Fetch agent adaptation
  const { data: adaptation, isLoading } = useQuery({
    queryKey: ['agentAdaptation', agentType],
    queryFn: async () => {
      if (!agentType) return null;
      
      const response = await fetch(`/api/assessments/agent-adaptation/${agentType}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch agent adaptation');
      }
      const data = await response.json();
      return data.adaptation;
    },
    enabled: !!agentType
  });

  // Fetch personality insights
  const { data: personalityInsights, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['personalityInsights'],
    queryFn: async () => {
      const response = await fetch('/api/assessments/personality/insights');
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Failed to fetch personality insights');
      }
      const data = await response.json();
      return data.insights;
    }
  });

  const refreshAdaptation = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['agentAdaptation'] });
    queryClient.invalidateQueries({ queryKey: ['personalityInsights'] });
  }, [queryClient]);

  return {
    adaptation,
    personalityInsights,
    isLoading: isLoading || isLoadingInsights,
    refreshAdaptation,
    hasAdaptation: !!adaptation
  };
}
