/**
 * AI Readiness Assessment Models
 * Evaluates founder's readiness to leverage AI in their startup
 */

import { LikertScale, DifficultyLevel, ImpactLevel } from './common.model';

export type AIDimension = 'digital_competence' | 'ai_awareness' | 'adoption_mindset' | 'implementation_confidence';
export type AIReadinessLevel = 'beginner' | 'intermediate' | 'advanced' | 'ai_native';
export type QuestionType = 'likert' | 'multiple_choice' | 'scenario';

export interface AIReadinessQuestion {
  id: string;
  dimension: AIDimension;
  subdimension: string;
  question: string;
  questionType: QuestionType;
  options?: string[];
  startupContext: string;
}

export interface DimensionScore {
  score: number;
  level: string;
  subdimensions: { [key: string]: number };
  strengths: string[];
  gaps: string[];
}

export interface MaturityLevel {
  level: AIReadinessLevel;
  description: string;
  capabilities: string[];
}

export interface MaturityMatrix {
  current: MaturityLevel;
  target: MaturityLevel;
  gap: string[];
}

export interface AIOpportunity {
  area: string;
  tool: string;
  difficulty: DifficultyLevel;
  timeToValue: string;
  impact: ImpactLevel;
  description: string;
  steps: string[];
  estimatedCost: string;
  estimatedSavings: string;
}

export interface LearningModule {
  week: number | string;
  title: string;
  topics: string[];
  resources: string[];
}

export interface LearningPath {
  title: string;
  duration: string;
  timeCommitment: string;
  modules: LearningModule[];
  outcomes: string[];
  nextSteps: string;
}

export interface AITool {
  category: string;
  name: string;
  cost: string;
  difficulty: DifficultyLevel;
  useCase: string;
  roi: 'low' | 'medium' | 'high' | 'very_high';
  priority: 'essential' | 'recommended' | 'situational';
}

export interface Initiative {
  title: string;
  description: string;
  timeline: string;
  resources: string[];
  expectedOutcome: string;
}

export interface IndustryBenchmark {
  yourScore: number;
  industryAverage: number;
  topQuartile: number;
  interpretation: string;
}

export interface AIReadinessRecommendations {
  quickWins: AIOpportunity[];
  skillDevelopment: LearningPath[];
  toolRecommendations: AITool[];
  strategicInitiatives: Initiative[];
}

export interface AIReadinessProfile {
  overallLevel: AIReadinessLevel;
  overallScore: number; // 0-100
  dimensions: {
    digitalCompetence: DimensionScore;
    aiAwareness: DimensionScore;
    adoptionMindset: DimensionScore;
    implementationConfidence: DimensionScore;
  };
  maturityMatrix: MaturityMatrix;
  recommendations: AIReadinessRecommendations;
  industryBenchmark: IndustryBenchmark;
}