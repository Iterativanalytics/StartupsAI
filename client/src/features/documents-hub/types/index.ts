import React from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export interface PivotType {
  id: string;
  name: string;
  description: string;
}

export type PlatformTab = 'platform' | 'methodology' | 'competitors' | 'pricing';

export type Mode = 'fast-track' | 'validated';

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
  name: string;
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

export interface DeckCompetitorRow {
  feature: string;
  iterativDecks: string;
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

export interface DeckStyle {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  instruction: string;
}

// AI Application Filler Types
export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  required: boolean;
  maxLength?: number;
  placeholder?: string;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export interface ApplicationForm {
  id: string;
  name: string;
  type: 'accelerator' | 'grant' | 'competition' | 'investment';
  organization: string;
  deadline: string;
  sections: FormSection[];
}

export interface BusinessPlan {
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

export interface AISuggestion {
  fieldId: string;
  suggestion: string;
}

// Hub Module Types
export type HubModule = 'plans' | 'decks' | 'proposals' | 'forms';

// Proposal Types
export interface ProposalTemplate {
  id: string;
  name: string;
  type: 'consulting' | 'partnership' | 'service' | 'product';
  description: string;
  sections: string[];
}

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  order: number;
}