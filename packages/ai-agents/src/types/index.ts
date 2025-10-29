// Import required types
import { PlatformOrchestratorAgent } from '../agents/platform-orchestrator';
import { PartnershipEngine } from '../co-agents/base/partnership-engine';

// Agent Type Definitions
export enum AgentType {
  // Primary Co-Agents (Deep Partnership)
  CO_FOUNDER = 'co_founder',           // For Entrepreneurs
  CO_INVESTOR = 'co_investor',         // For Investors
  CO_BUILDER = 'co_builder',           // For Partners
  
  // Specialized Functional Agents (Concept Document Standardized)
  BUSINESS_ADVISOR = 'business_advisor',        // Agent-CBA
  INVESTMENT_ANALYST = 'investment_analyst',    // Agent-CFA
  CREDIT_ANALYST = 'credit_analyst',            // Agent-CRA
  IMPACT_ANALYST = 'impact_analyst',            // Agent-CIA
  PROGRAM_ANALYST = 'program_analyst',          // Agent-PMA
  BUSINESS_ANALYST = 'business_analyst',        // Agent-PBA (Platform Orchestrator + Business Analysis)
  
  // Legacy aliases for backward compatibility
  DEAL_ANALYZER = 'deal_analyzer',              // Legacy: Use INVESTMENT_ANALYST
  CREDIT_ASSESSOR = 'credit_assessor',          // Legacy: Use CREDIT_ANALYST
  IMPACT_EVALUATOR = 'impact_evaluator',        // Legacy: Use IMPACT_ANALYST
  PARTNERSHIP_FACILITATOR = 'partnership_facilitator', // Legacy: Use PROGRAM_ANALYST
  PROGRAM_MANAGER = 'program_manager',          // Legacy: Use PROGRAM_ANALYST
  PLATFORM_ORCHESTRATOR = 'platform_orchestrator' // Legacy: Use BUSINESS_ANALYST
}

// Query Types for Intelligent Routing
export enum QueryType {
  STRATEGIC = 'strategic',
  ACCOUNTABILITY = 'accountability',
  EMOTIONAL = 'emotional',
  RELATIONSHIP = 'relationship',
  BRAINSTORM = 'brainstorm',
  ANALYSIS = 'analysis',
  RESEARCH = 'research',
  DOCUMENT = 'document',
  TECHNICAL = 'technical',
  REPORTING = 'reporting',
  GENERAL = 'general'
}

// Agent Tier Classification
export enum AgentTier {
  CO_AGENT = 'co_agent',      // Partnership layer
  FUNCTIONAL = 'functional'    // Task layer
}

export enum UserType {
  ENTREPRENEUR = 'entrepreneur',
  INVESTOR = 'investor',
  LENDER = 'lender',
  GRANTOR = 'grantor',
  PARTNER = 'partner',
  ADMIN = 'admin'
}

// Agent Capabilities
export interface AgentCapabilities {
  naturalLanguageProcessing: boolean;
  documentAnalysis: boolean;
  predictiveModeling: boolean;
  automatedWorkflows: boolean;
  realTimeRecommendations: boolean;
  multiUserCoordination: boolean;
}

// Message Types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Agent Context
export interface AgentContext {
  userId: string;
  userType: UserType;
  currentTask: string;
  conversationHistory: Message[];
  relevantData: any;
  permissions: string[];
  sessionId: string;
}

// Agent Request
export interface AgentRequest {
  userId: string;
  userType: UserType;
  message: string;
  sessionId: string;
  taskType?: string;
  streaming?: boolean;
  context?: Record<string, any>;
}

// Agent Response
export interface AgentResponse {
  id: string;
  content: string;
  agentType: AgentType;
  timestamp: Date;
  suggestions?: string[];
  actions?: AgentAction[];
  insights?: Insight[];
  metadata?: Record<string, any>;
}

// Agent Action
export interface AgentAction {
  type: string;
  description: string;
  label?: string;
  parameters: Record<string, any>;
  automated: boolean;
  requiresApproval: boolean;
}

// Insight
export interface Insight {
  type: 'warning' | 'recommendation' | 'opportunity' | 'risk';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  relatedData?: any;
}

// Tool Definition
export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any, context: AgentContext) => Promise<any>;
}

// Agent Config
export interface AgentConfig {
  apiKey: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  enableMemory?: boolean;
  enableTools?: boolean;
  vectorStoreUrl?: string;
  redisUrl?: string;
}

// Memory Entry
export interface MemoryEntry {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  type: 'conversation' | 'fact' | 'preference' | 'decision';
  content: string;
  embedding?: number[];
  metadata?: Record<string, any>;
}

// Knowledge Entry
export interface KnowledgeEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  embedding: number[];
  source: string;
  tags: string[];
  relevanceScore?: number;
}

// Agent Ecosystem Types
export interface AgentEcosystem {
  primaryAgent: CoAgent;              // Main partnership agent
  functionalAgents: FunctionalAgent[]; // Specialized task agents
  orchestrator: PlatformOrchestratorAgent;  // Cross-user coordination
}

// Agent Interaction
export interface AgentInteraction {
  userQuery: string;
  userType: UserType;
  context: UserContext;
}

// User Context (Enhanced)
export interface UserContext {
  userId: string;
  userType: UserType;
  profileData: any;
  businessData?: any;
  investmentData?: any;
  assessmentResults?: any;
  relationshipHistory: RelationshipMetrics;
  preferences: UserPreferences;
  currentState: UserState;
}

// Routing Decision
export interface RoutingDecision {
  primaryAgent: AgentType;
  supportAgents: AgentType[];
  approach: 'conversational' | 'task_focused';
  mayDelegate?: boolean;
  notifyCoAgent?: boolean;
}

// Co-Agent Base Interface
export interface CoAgent {
  type: AgentType;
  tier: AgentTier.CO_AGENT;
  userType: UserType;
  personality: PersonalityProfile;
  relationshipManager: PartnershipEngine;
  capabilities: CoAgentCapabilities;
  modes: ConversationMode[];
}

// Functional Agent Interface
export interface FunctionalAgent {
  type: AgentType;
  tier: AgentTier.FUNCTIONAL;
  specialization: string;
  tools: Tool[];
  expertise: ExpertiseArea[];
  integrations: AgentIntegration[];
}

// Co-Agent Capabilities
export interface CoAgentCapabilities {
  strategicGuidance: boolean;
  accountabilityCoaching: boolean;
  emotionalSupport: boolean;
  decisionFrameworks: boolean;
  brainstormingPartner: boolean;
  crisisSupport: boolean;
  proactiveInsights: boolean;
  personalityAdaptation: boolean;
}

// Conversation Modes
export interface ConversationMode {
  name: string;
  description: string;
  triggers: string[];
  personality: PersonalityTraits;
  frameworks: string[];
}

// Personality Profile
export interface PersonalityProfile {
  communicationStyle: 'direct' | 'supportive' | 'analytical' | 'creative';
  decisionStyle: 'data-driven' | 'intuitive' | 'collaborative' | 'decisive';
  coachingApproach: 'challenging' | 'nurturing' | 'structured' | 'adaptive';
  energyLevel: 'calm' | 'moderate' | 'high' | 'variable';
  adaptationLevel: number; // 0-100, how much to adapt to user
}

// Personality Traits
export interface PersonalityTraits {
  supportiveness: number;
  directness: number;
  analyticalDepth: number;
  creativity: number;
  patience: number;
}

// Relationship Metrics
export interface RelationshipMetrics {
  trustLevel: number;
  engagementScore: number;
  satisfactionRating: number;
  communicationEffectiveness: number;
  conflictResolution: number;
  overallScore: number;
  interactionHistory: InteractionSummary[];
}

// User Preferences
export interface UserPreferences {
  communicationFrequency: 'low' | 'medium' | 'high';
  feedbackStyle: 'gentle' | 'direct' | 'data-focused';
  meetingPreference: 'structured' | 'casual' | 'mixed';
  challengeLevel: 'supportive' | 'moderate' | 'high';
  privacySettings: PrivacySettings;
}

// User State
export interface UserState {
  currentPhase: string; // e.g., 'ideation', 'mvp', 'growth', 'scale'
  stressLevel: 'low' | 'medium' | 'high';
  confidenceLevel: number;
  motivationLevel: number;
  availableTime: 'limited' | 'moderate' | 'flexible';
  currentChallenges: string[];
}

// Agent Communication
export interface AgentCommunication {
  fromAgent: AgentType;
  toAgent: AgentType;
  messageType: 'delegation' | 'context_share' | 'result_handoff' | 'collaboration';
  payload: any;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

// Multi-Agent Response
export interface MultiAgentResponse {
  primaryResponse: AgentResponse;
  contributingAgents: AgentType[];
  synthesizedInsights: Insight[];
  collaborationMetadata: any;
}

// Additional interfaces for specific agents
export interface InteractionSummary {
  date: Date;
  type: string;
  outcome: 'positive' | 'neutral' | 'negative';
  topics: string[];
  duration: number;
}

export interface PrivacySettings {
  shareWithFunctionalAgents: boolean;
  allowProactiveInsights: boolean;
  dataRetentionPeriod: number; // days
  allowAnalytics: boolean;
}

export interface ExpertiseArea {
  domain: string;
  level: 'basic' | 'intermediate' | 'expert';
  certifications?: string[];
}

export interface AgentIntegration {
  type: 'assessment' | 'platform' | 'external_api' | 'other_agent';
  name: string;
  endpoint?: string;
  capabilities: string[];
}