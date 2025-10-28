import React from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export type HubModule = 'studio' | 'accelerators' | 'incubators' | 'competitions';

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

export interface PivotType {
  id: string;
  name: string;
  description: string;
}

export interface CompetitorRow {
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
