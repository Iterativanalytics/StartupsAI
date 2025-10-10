/**
 * Composite Profile Models
 * Integration of all assessment dimensions
 */

import { RIASECProfile } from './riasec.model';
import { BigFiveProfile, BlindSpot, FounderArchetype } from './big-five.model';
import { AIReadinessProfile, LearningPath } from './ai-readiness.model';
import { DTReadinessProfile } from '../assessments/design-thinking/scoring';
import { PriorityLevel, SeverityLevel } from './common.model';

export interface AssessmentBundle {
  riasec: RIASECProfile;
  bigFive: BigFiveProfile;
  aiReadiness: AIReadinessProfile;
  designThinking: DTReadinessProfile;
  completedDate: Date;
}

export interface CoreStrength {
  name: string;
  description: string;
  components: string[];
  applicationAreas: string[];
  uniquenessScore: number; // 0-100, higher = rarer combination
  leverage: string;
  examples: string[];
}

export interface DevelopmentPriority {
  area: string;
  priority: PriorityLevel;
  reasoning: string;
  actions: string[];
  timeline: string;
  measurableOutcome: string;
}

export interface RiskFactor {
  type: 'burnout' | 'cofounder_conflict' | 'ai_disruption' | 'execution_gap' | 'market_invisibility';
  level: SeverityLevel;
  probability: number; // 0-1
  timeframe: string;
  indicators: string[];
  prevention: string[];
  monitoring: string;
}

export interface CompositeSynthesis {
  founderArchetype: FounderArchetype;
  coreStrengths: CoreStrength[];
  criticalBlindSpots: BlindSpot[];
  developmentPriorities: DevelopmentPriority[];
  riskFactors: RiskFactor[];
}

export interface TeamNeed {
  role: string;
  skills: string[];
  personality: string;
  urgency: PriorityLevel;
  reasoning: string;
}

export interface MentorMatch {
  mentorType: string;
  expertise: string[];
  personalityFit: string;
  focusAreas: string[];
  matchScore: number;
}

export interface InvestorFit {
  investorType: string;
  stage: string;
  sectors: string[];
  fitReasoning: string;
  matchScore: number;
}

export interface AcceleratorFit {
  acceleratorType: string;
  programFocus: string[];
  fitReasoning: string;
  matchScore: number;
}

export interface MatchingProfiles {
  idealCofounderProfile: any; // CofounderProfile from big-five.model
  teamCompositionNeeds: TeamNeed[];
  mentorMatches: MentorMatch[];
  investorFit: InvestorFit[];
  acceleratorFit: AcceleratorFit[];
}

export interface Action {
  priority: PriorityLevel;
  title: string;
  description: string;
  timeline: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  category: 'risk_mitigation' | 'ai_adoption' | 'team_building' | 'skill_development' | 'network_building';
  steps?: string[];
  expectedOutcome?: string;
}

export interface NetworkStrategy {
  objective: string;
  channels: string[];
  timeCommitment: string;
  keyActivities: string[];
  metrics: string[];
}

export interface Recommendations {
  immediate: Action[]; // Next 30 days
  shortTerm: Action[]; // 90 days
  longTerm: Action[]; // 6-12 months
  skillDevelopment: LearningPath[];
  networkBuilding: NetworkStrategy[];
}

export interface PredictorFactor {
  factor: string;
  impact: 'positive' | 'negative';
  weight: number;
  description: string;
}

export interface BenchmarkComparison {
  category: string;
  yourScore: number;
  successfulFoundersAverage: number;
  topPerformersAverage: number;
  interpretation: string;
}

export interface SuccessPredictors {
  overallScore: number; // 0-100 predicted success likelihood
  strengths: PredictorFactor[];
  concerns: PredictorFactor[];
  comparisonToSuccessful: BenchmarkComparison[];
}

export interface CompositeProfile {
  entrepreneur: {
    id: string;
    name: string;
    email: string;
  };
  assessments: AssessmentBundle;
  synthesis: CompositeSynthesis;
  matching: MatchingProfiles;
  recommendations: Recommendations;
  successPredictors: SuccessPredictors;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileEvolution {
  baseline: CompositeProfile;
  checkpoints: ProfileCheckpoint[];
  behavioralSignals: BehavioralSignals;
  trajectory: 'improving' | 'stable' | 'concerning';
}

export interface ProfileCheckpoint {
  date: Date;
  profile: CompositeProfile;
  changes: ProfileChange[];
  triggers: string[];
}

export interface ProfileChange {
  dimension: string;
  metric: string;
  oldValue: number;
  newValue: number;
  change: number;
  interpretation: string;
}

export interface BehavioralSignals {
  executionRate: number; // Tasks completed / committed
  pivotFrequency: number; // Strategic changes
  stressIndicators: string[]; // Language analysis
  learningVelocity: number; // New skills adopted
  networkingActivity: number;
  aiToolAdoption: number;
}