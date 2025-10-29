import React from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  onClick?: () => void;
}

export interface PivotType {
  id: string;
  name: string;
  description: string;
}

export type PlatformTab = 'platform' | 'methodology' | 'competitors' | 'pricing';

export type Mode = 'fast-track' | 'validated';

export type HubModule = 'plans' | 'decks' | 'proposals' | 'forms';

export type Persona = 'entrepreneur' | 'incubator' | 'investor' | 'lender';

export type EntrepreneurStage = 'ideation' | 'pre-seed' | 'growth';

export interface User {
  loggedIn: boolean;
  persona: Persona | null;
  name: string;
  entrepreneurStage?: EntrepreneurStage;
  compositeProfile?: CompositeProfile;
}

export interface Assumption {
  id: string;
  text: string;
  risk: 'high' | 'medium' | 'low';
  status: 'untested' | 'validated' | 'invalidated';
  sourceSection: string;
}

export interface PhaseStep {
  id: string;
  title: string;
  description: string;
  tool: string;
}

export interface Phase {
  name:string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  methodology: string;
  steps: PhaseStep[];
}

export type Phases = Record<string, Phase>;

export interface Tool {
  name: string;
  description: string;
  outputs: string[];
}

export type Tools = Record<string, Tool>;

export type ActivePhase = 'discover' | 'define' | 'ideate' | 'experiment' | 'measure' | 'scale' | 'prototype' | 'test';

export interface PlanCompetitorRow {
  feature: string;
  iterativePlans: string;
  growthWheel: string;
  venturePlanner: string;
  livePlan: string;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface RevenueStream {
  stream: string;
  year1: string;
  year2: string;
  year3: string;
  percentage: string;
}

export interface DeckCompetitorRow {
  feature: string;
  iterativDecks: string;
  growthWheel: string;
  venturePlanner: string;
  livePlan: string;
}

export interface DeckStyle {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  instruction: string;
}

export interface ApplicationFormField {
  id: string;
  label: string;
  type: 'textarea' | 'text';
  required: boolean;
  maxLength?: number;
  placeholder?: string;
}

export interface ApplicationFormSection {
  id: string;
  title: string;
  fields: ApplicationFormField[];
}

export interface ApplicationForm {
  id: string;
  name: string;
  type: 'accelerator' | 'grant' | 'competition' | 'investment';
  organization: string;
  deadline: string;
  sections: ApplicationFormSection[];
}

export interface AISuggestion {
  fieldId: string;
  suggestion: string;
}

export type BusinessPlan = Record<string, {
  text?: string;
  visuals?: { chartType: string; title: string }[];
}>;

export interface SimpleBusinessPlanData {
  companyName: string;
  description: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  traction: string;
  team: string;
  financials: string;
}

// Project Context Types
export interface Project<T> {
  content: T;
  assumptions: Assumption[];
  name: string;
  year?: number;
}

// Co-Founder Agent Types
export type ConversationMode = 'strategic' | 'quick_advice' | 'devils_advocate' | 'brainstorm' | 'accountability';

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    mode?: ConversationMode;
}

export interface CoFounderPersonality {
  traits: {
    assertiveness: number;
    optimism: number;
    detail_orientation: number;
    risk_tolerance: number;
    directness: number;
  };
  style: {
    formality: 'casual' | 'professional' | 'adaptive';
    humor: 'frequent' | 'occasional' | 'rare';
    storytelling: boolean;
    questioning: 'direct' | 'socratic' | 'exploratory';
  };
  expertise: {
    primary: string[];
    secondary: string[];
    learning: string[];
  };
  interaction: {
    proactivity: 'low' | 'medium' | 'high';
    checkInFrequency: 'daily' | 'weekly' | 'monthly';
    challengeLevel: 'supportive' | 'balanced' | 'challenging';
  };
}

export interface Insight {
    id: string;
    type: 'risk' | 'warning' | 'opportunity' | 'celebration' | 'accountability';
    priority: 'high' | 'medium' | 'low';
    title: string;
    message: string;
    delivery?: ('dashboard' | 'whatsapp')[];
}

export interface Goal {
    id: string;
    text: string;
    status: 'on-track' | 'at-risk' | 'off-track' | 'complete';
    isMilestone?: boolean;
    milestoneType?: string;
    multiplier?: number;
}

export interface WhatsAppSettings {
    enabled: boolean;
    phoneNumber: string;
    sendHighPriority: boolean;
    sendGoalUpdates: boolean;
    sendWeeklySummary: boolean;
}

export interface AgentConfig {
  name: string;
  icon: React.ElementType;
  welcomeMessage: string;
  systemIdentity: string;
}

// Assessment System Types
export interface RIASECScore {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

export interface BigFiveScore {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface AIReadinessScore {
  awareness: number;
  adoption: number;
  implementation: number;
  strategy: number;
  overall: number;
}

export interface FounderArchetype {
    name: string;
    code: string;
    description: string;
    strengths: string[];
    challenges: string[];
}

export interface CompositeProfile {
  riasec: RIASECScore;
  bigFive: BigFiveScore;
  aiReadiness: AIReadinessScore;
  founderArchetype: FounderArchetype;
  coreStrengths: string[];
  blindSpots: string[];
}