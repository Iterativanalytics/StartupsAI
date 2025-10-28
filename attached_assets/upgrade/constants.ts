
import { PivotType } from './types';
import { Target, Brain, Settings, DollarSign } from 'lucide-react';
import { PlatformTab } from './types';

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
