import type React from 'react';
import { PivotType } from './types-hub';
import { Target, Brain, Settings, DollarSign } from 'lucide-react';
import { PlatformTab } from './types-hub';

export const PIVOT_TYPES: PivotType[] = [
  { id: 'zoom-in', name: 'Zoom-In Pivot', description: 'Single feature becomes the product' },
  { id: 'zoom-out', name: 'Zoom-Out Pivot', description: 'Product becomes single feature of larger product' },
  { id: 'customer-segment', name: 'Customer Segment Pivot', description: 'Solve same problem for different customer' },
  { id: 'customer-need', name: 'Customer Need Pivot', description: 'Solve different problem for same customer' },
  { id: 'platform', name: 'Platform Pivot', description: 'Application becomes platform or vice versa' },
  { id: 'business-architecture', name: 'Business Architecture Pivot', description: 'High margin/low volume ↔ Low margin/high volume' },
  { id: 'value-capture', name: 'Value Capture Pivot', description: 'Monetization model change' },
  { id: 'engine-of-growth', name: 'Engine of Growth Pivot', description: 'Change growth strategy (viral, sticky, paid)' },
  { id: 'channel', name: 'Channel Pivot', description: 'Same solution, different distribution' },
  { id: 'technology', name: 'Technology Pivot', description: 'Same solution, different technology' }
];

export const NAV_TABS: {id: PlatformTab, label: string, icon: React.ComponentType<any>}[] = [
  { id: 'platform', label: 'Platform', icon: Settings },
  { id: 'methodology', label: 'Methodology', icon: Brain },
  { id: 'competitors', label: 'vs Competitors', icon: Target },
  { id: 'pricing', label: 'Pricing', icon: DollarSign }
];

export { DECK_PHASES, DECK_TOOLS, DECK_COMPETITOR_COMPARISON, DECK_PRICING_TIERS, DECK_REVENUE_STREAMS, DECK_STYLES } from './modules/decks/constants';
export { PLAN_PHASES, PLAN_TOOLS } from './modules/plans/constants';
export { PROPOSAL_PHASES, PROPOSAL_TOOLS, PROPOSAL_COMPETITOR_COMPARISON, PROPOSAL_PRICING_TIERS } from './modules/proposals/constants';
export { MOCK_BUSINESS_PLAN } from './modules/forms/constants';
