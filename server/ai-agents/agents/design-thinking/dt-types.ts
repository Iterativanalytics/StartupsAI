// ============================================================================
// DESIGN THINKING SYSTEM - COMPREHENSIVE TYPE DEFINITIONS
// ============================================================================

// ===========================
// WORKFLOW TYPES
// ===========================

export interface DTWorkflow {
  id: string;
  projectId: string;
  userId: string;
  name: string;
  description: string;
  currentPhase: DTPhase;
  phaseProgress: Record<string, number>;
  status: WorkflowStatus;
  
  // AI Configuration
  aiFacilitationEnabled: boolean;
  aiModelVersion: string;
  facilitationStyle: FacilitationStyle;
  
  // Collaboration
  collaborationMode: CollaborationMode;
  teamMembers: TeamMember[];
  
  // Metadata
  industry?: string;
  targetMarket?: string;
  innovationType?: InnovationType;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type DTPhase = 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
export type WorkflowStatus = 'active' | 'paused' | 'completed' | 'archived';
export type FacilitationStyle = 'minimal' | 'balanced' | 'active' | 'intensive';
export type CollaborationMode = 'real-time' | 'async' | 'hybrid';
export type InnovationType = 'product' | 'service' | 'process' | 'business_model' | 'social';

export interface TeamMember {
  userId: string;
  role: string;
  permissions: string[];
  joinedAt: Date;
}

// ===========================
// CANVAS TYPES
// ===========================

export interface CollaborativeCanvas {
  id: string;
  workflowId: string;
  canvasType: CanvasType;
  name: string;
  elements: CanvasElement[];
  layout: CanvasLayout;
  version: number;
  
  // Collaboration
  activeUsers: string[];
  lastModifiedBy: string;
  lastModifiedAt: Date;
  
  createdAt: Date;
  createdBy: string;
}

export type CanvasType = 
  | 'empathy_map'
  | 'journey_map'
  | 'pov_statement'
  | 'hmw_questions'
  | 'brainstorm_board'
  | 'idea_matrix'
  | 'prototype_plan'
  | 'test_plan'
  | 'stakeholder_map'
  | 'impact_map';

export interface CanvasElement {
  id: string;
  type: ElementType;
  content: string;
  position: Position;
  size?: Size;
  style?: ElementStyle;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ElementType = 
  | 'sticky_note'
  | 'text'
  | 'shape'
  | 'line'
  | 'arrow'
  | 'image'
  | 'group'
  | 'cluster';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ElementStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  fontSize?: number;
  fontWeight?: string;
}

export interface CanvasLayout {
  zoom: number;
  pan: Position;
  grid: boolean;
  snapToGrid: boolean;
}

// ===========================
// EMPATHY DATA TYPES
// ===========================

export interface EmpathyData {
  id: string;
  workflowId: string;
  dataType: EmpathyDataType;
  
  // Participant info
  participantPersona: string;
  participantDemographics: Record<string, any>;
  
  // Raw data
  rawData: string;
  transcription?: string;
  recordingUrl?: string;
  
  // Structured insights
  insights: string[];
  painPoints: string[];
  needs: string[];
  behaviors: string[];
  emotions: string[];
  
  // AI Analysis
  aiAnalyzed: boolean;
  aiInsights: Record<string, any>;
  sentimentScore?: number;
  
  createdAt: Date;
  createdBy: string;
}

export type EmpathyDataType = 'interview' | 'observation' | 'survey' | 'secondary_research';

// ===========================
// PROBLEM STATEMENT TYPES
// ===========================

export interface POVStatement {
  id: string;
  workflowId: string;
  
  // POV Formula: [User] needs [Need] because [Insight]
  userPersona: string;
  need: string;
  insight: string;
  
  // Supporting evidence
  supportingEmpathyData: string[];
  evidenceStrength: number;
  
  // Validation
  validated: boolean;
  validationNotes?: string;
  solutionBiasDetected: boolean;
  
  // Prioritization
  priorityScore: number;
  selectedForIdeation: boolean;
  
  createdAt: Date;
  createdBy: string;
}

export interface HMWQuestion {
  id: string;
  povStatementId: string;
  workflowId: string;
  
  question: string;
  reframingType?: ReframingType;
  
  // DVF Scoring
  desirabilityScore?: number;
  feasibilityScore?: number;
  viabilityScore?: number;
  
  // Engagement
  voteCount: number;
  ideaCount: number;
  
  selectedForIdeation: boolean;
  
  createdAt: Date;
  createdBy: string;
}

export type ReframingType = 
  | 'amplify'
  | 'remove_constraint'
  | 'opposite'
  | 'question_assumption'
  | 'resource_change'
  | 'analogy'
  | 'break_down'
  | 'build_up';

// ===========================
// IDEA TYPES
// ===========================

export interface Idea {
  id: string;
  workflowId: string;
  hmwQuestionId?: string;
  
  title: string;
  description: string;
  category?: string;
  
  // Details
  userBenefit: string;
  businessValue: string;
  implementationApproach: string;
  
  // Evaluation scores
  desirabilityScore?: number;
  feasibilityScore?: number;
  viabilityScore?: number;
  innovationScore?: number;
  impactScore?: number;
  overallScore?: number;
  
  // AI Analysis
  aiEvaluation: Record<string, any>;
  identifiedRisks: Risk[];
  identifiedOpportunities: Opportunity[];
  synergies: string[];
  
  // Status
  status: IdeaStatus;
  selectedForPrototyping: boolean;
  
  createdAt: Date;
  createdBy: string;
}

export type IdeaStatus = 'draft' | 'evaluated' | 'selected' | 'prototyped' | 'tested' | 'rejected';

export interface Risk {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  mitigation?: string;
}

export interface Opportunity {
  type: string;
  description: string;
  potential: string;
}

// ===========================
// PROTOTYPE TYPES
// ===========================

export interface Prototype {
  id: string;
  workflowId: string;
  ideaId?: string;
  
  name: string;
  description: string;
  
  // Characteristics
  fidelity: PrototypeFidelity;
  prototypeType: PrototypeType;
  
  // Learning goals
  learningGoals: string[];
  hypotheses: Hypothesis[];
  
  // Resources
  files: FileReference[];
  links: string[];
  effortEstimate?: number;
  costEstimate?: number;
  
  // Testing
  testPlanId?: string;
  testResults: TestResult[];
  
  status: PrototypeStatus;
  
  createdAt: Date;
  createdBy: string;
}

export type PrototypeFidelity = 'paper' | 'low' | 'medium' | 'high' | 'functional';
export type PrototypeType = 'sketch' | 'wireframe' | 'mockup' | 'interactive' | 'physical' | 'service' | 'experience';
export type PrototypeStatus = 'planning' | 'building' | 'ready' | 'testing' | 'tested' | 'iterated';

export interface Hypothesis {
  statement: string;
  testable: boolean;
  priority: number;
}

export interface FileReference {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface TestResult {
  sessionId: string;
  findings: string[];
  metrics: Record<string, number>;
  validated: boolean;
}

// ===========================
// TEST SESSION TYPES
// ===========================

export interface TestSession {
  id: string;
  workflowId: string;
  prototypeId: string;
  
  sessionName: string;
  testMethodology: TestMethodology;
  
  // Participant
  participantPersona: string;
  participantDemographics: Record<string, any>;
  
  // Session details
  scheduledAt: Date;
  durationMinutes: number;
  facilitatorId: string;
  
  // Data collection
  recordingUrl?: string;
  transcription?: string;
  observations: string;
  feedback: UserFeedback[];
  metrics: Record<string, any>;
  
  // AI Analysis
  aiSynthesis: Record<string, any>;
  sentimentAnalysis: Record<string, any>;
  keyFindings: string[];
  
  status: SessionStatus;
  
  createdAt: Date;
  createdBy: string;
}

export type TestMethodology = 'usability' | 'concept' | 'a_b' | 'wizard_of_oz' | 'concierge' | 'smoke';
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';

export interface UserFeedback {
  question: string;
  response: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  rating?: number;
}

// ===========================
// INSIGHT TYPES
// ===========================

export interface DTInsight {
  id: string;
  workflowId: string;
  phase: DTPhase;
  
  insightType: InsightType;
  title: string;
  content: string;
  
  // Confidence & Impact
  confidenceScore: number;
  impactScore: number;
  actionabilityScore: number;
  
  // Source data
  sourceData: Record<string, any>;
  relatedEntities: string[];
  
  // AI metadata
  aiModelVersion: string;
  generationMethod: string;
  
  // User interaction
  acknowledged: boolean;
  actedUpon: boolean;
  userFeedback?: 'helpful' | 'neutral' | 'not_helpful';
  
  createdAt: Date;
}

export type InsightType = 
  | 'pattern'
  | 'gap'
  | 'opportunity'
  | 'risk'
  | 'recommendation'
  | 'contradiction'
  | 'trend'
  | 'outlier'
  | 'connection';

// ===========================
// SESSION TYPES
// ===========================

export interface DTSession {
  id: string;
  workflowId: string;
  
  sessionType: DTSessionType;
  name: string;
  description: string;
  
  // Scheduling
  scheduledAt: Date;
  durationMinutes: number;
  timezone: string;
  
  // Participants
  facilitatorId: string;
  participants: SessionParticipant[];
  
  // Session data
  agenda: AgendaItem[];
  deliverables: string[];
  recordingUrl?: string;
  transcription?: string;
  notes: string;
  
  // AI Facilitation
  aiFacilitationEnabled: boolean;
  aiInterventions: AIIntervention[];
  aiSessionAnalysis: Record<string, any>;
  
  status: SessionStatus;
  
  createdAt: Date;
  createdBy: string;
}

export type DTSessionType = 
  | 'empathy_interview'
  | 'define_workshop'
  | 'ideation_session'
  | 'prototype_review'
  | 'test_session'
  | 'design_sprint'
  | 'retrospective';

export interface SessionParticipant {
  userId: string;
  name: string;
  role: string;
  contributions: number;
  engagementScore?: number;
}

export interface AgendaItem {
  time: string;
  activity: string;
  duration: number;
  facilitator: string;
}

export interface AIIntervention {
  timestamp: Date;
  type: InterventionType;
  content: string;
  context: Record<string, any>;
  participantReaction?: 'positive' | 'neutral' | 'negative' | 'ignored';
  effectivenessScore?: number;
}

export type InterventionType = 
  | 'suggestion'
  | 'question'
  | 'guidance'
  | 'warning'
  | 'celebration'
  | 'time_check'
  | 'engagement_prompt'
  | 'reframe'
  | 'synthesis';

// ===========================
// ANALYTICS TYPES
// ===========================

export interface EffectivenessMetrics {
  workflowId: string;
  metricCategory: MetricCategory;
  metricName: string;
  value: number;
  targetValue?: number;
  phase?: DTPhase;
  measurementContext: Record<string, any>;
  measurementDate: Date;
}

export type MetricCategory = 
  | 'user_centricity'
  | 'idea_diversity'
  | 'iteration_speed'
  | 'team_collaboration'
  | 'outcome_quality'
  | 'process_adherence';

export interface EffectivenessScore {
  overall: number;
  dimensions: {
    userCentricity: number;
    ideaDiversity: number;
    iterationSpeed: number;
    teamCollaboration: number;
    outcomeQuality: number;
    processAdherence: number;
  };
  recommendations: string[];
  benchmarks?: BenchmarkComparison;
}

export interface BenchmarkComparison {
  industry: string;
  averageScore: number;
  topQuartile: number;
  yourScore: number;
  percentile: number;
}

export interface InsightEvolution {
  originalInsight: DTInsight;
  transformations: InsightTransformation[];
  finalOutcome: DTInsight;
  impact: number;
  businessValue: number;
}

export interface InsightTransformation {
  phase: DTPhase;
  transformation: string;
  contributingFactors: string[];
  refinements: string[];
}

export interface InsightMap {
  nodes: InsightNode[];
  edges: InsightEdge[];
  clusters: InsightCluster[];
  criticalPath: string[];
}

export interface InsightNode {
  id: string;
  label: string;
  phase: DTPhase;
  importance: number;
  connections: number;
}

export interface InsightEdge {
  from: string;
  to: string;
  type: string;
  strength: number;
}

export interface InsightCluster {
  id: string;
  name: string;
  insights: string[];
  theme: string;
}

// ===========================
// DESIGN SPRINT TYPES
// ===========================

export interface DesignSprint {
  id: string;
  workflowId: string;
  
  sprintName: string;
  challenge: string;
  
  // Configuration
  durationDays: number;
  startDate: Date;
  endDate: Date;
  
  // Team
  deciderId: string;
  facilitatorId: string;
  teamMembers: string[];
  
  // Daily deliverables
  day1Deliverables: Record<string, any>;
  day2Deliverables: Record<string, any>;
  day3Deliverables: Record<string, any>;
  day4Deliverables: Record<string, any>;
  day5Deliverables: Record<string, any>;
  
  // Results
  winningConceptId?: string;
  testResults: Record<string, any>;
  nextSteps: string;
  
  status: SprintStatus;
  
  createdAt: Date;
  createdBy: string;
}

export type SprintStatus = 'planning' | 'active' | 'completed' | 'cancelled';

// ===========================
// PLAYBOOK TYPES
// ===========================

export interface DTPlaybook {
  id: string;
  name: string;
  description: string;
  playbookType: PlaybookType;
  
  // Configuration
  phases: PlaybookPhase[];
  timelineWeeks: number;
  teamSizeMin: number;
  teamSizeMax: number;
  
  // Metadata
  industryFocus?: string;
  difficultyLevel: DifficultyLevel;
  
  isTemplate: boolean;
  usageCount: number;
  
  createdAt: Date;
  createdBy: string;
}

export type PlaybookType = 
  | 'new_product'
  | 'service_redesign'
  | 'cx_improvement'
  | 'digital_transformation'
  | 'social_innovation'
  | 'process_optimization';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface PlaybookPhase {
  phase: DTPhase;
  activities: PlaybookActivity[];
  estimatedDuration: number;
  deliverables: string[];
}

export interface PlaybookActivity {
  name: string;
  description: string;
  duration: number;
  participants: number;
  materials: string[];
  instructions: string[];
}

// ===========================
// METHOD CARD TYPES
// ===========================

export interface MethodCard {
  id: string;
  name: string;
  category: string;
  phase: DTPhase;
  
  description: string;
  whenToUse: string;
  howToUse: string;
  timeRequired: number;
  participantsMin: number;
  participantsMax: number;
  
  // Interactive content
  videoTutorialUrl?: string;
  exampleImages: string[];
  templates: string[];
  
  // AI features
  aiDemoAvailable: boolean;
  aiGuidanceAvailable: boolean;
  
  difficultyLevel: DifficultyLevel;
  popularityScore: number;
  
  createdAt: Date;
}

// ===========================
// LEARNING TYPES
// ===========================

export interface DTLearningProgress {
  id: string;
  userId: string;
  
  // Progress
  level: number;
  experiencePoints: number;
  completedModules: string[];
  
  // Skills
  skills: Record<string, number>;
  
  // Achievements
  badges: Badge[];
  achievements: Record<string, boolean>;
  
  // Statistics
  workflowsCompleted: number;
  sessionsFacilitated: number;
  insightsGenerated: number;
  prototypesCreated: number;
  
  updatedAt: Date;
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

// ===========================
// FACILITATION TYPES
// ===========================

export interface FacilitationResponse {
  suggestions: Suggestion[];
  nextSteps: NextStep[];
  interventions: Intervention[];
  celebrations: Celebration[];
  warnings: Warning[];
}

export interface Suggestion {
  type: string;
  priority: 'low' | 'medium' | 'high';
  content: string;
  technique: string;
}

export interface NextStep {
  action: string;
  timeframe: string;
  priority: number;
}

export interface Intervention {
  type: string;
  priority: string;
  title: string;
  content: string;
  techniques: Technique[];
  expectedOutcome: string;
  metrics: string[];
}

export interface Technique {
  name: string;
  description: string;
  duration?: number;
  instructions?: string[];
  script?: string;
}

export interface Celebration {
  achievement: string;
  message: string;
  impact?: string;
}

export interface Warning {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  suggestedAction?: string;
}

// ===========================
// EXPORT TYPES
// ===========================

export interface ExportOptions {
  format: 'json' | 'pdf' | 'csv' | 'markdown';
  includeInsights: boolean;
  includeAnalytics: boolean;
  includeTimeline: boolean;
  includeParticipants: boolean;
}

export interface ExportResult {
  data: any;
  format: string;
  filename: string;
  size: number;
  generatedAt: Date;
}
