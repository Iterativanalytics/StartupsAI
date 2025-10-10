import { BaseDocument, DocumentType, DocumentContent, DocumentMetadata } from '../document.types';

/**
 * Business Plan Document Type
 * 
 * This document type handles business plan creation, management, and analysis.
 * It includes structured sections for executive summary, market analysis,
 * financial projections, and more.
 */
export interface BusinessPlanDocument extends BaseDocument {
  type: 'business-plan';
  content: BusinessPlanContent;
  metadata: BusinessPlanMetadata;
}

export interface BusinessPlanContent extends DocumentContent {
  format: 'structured';
  data: {
    sections: BusinessPlanSection[];
    financialProjections: FinancialProjections;
    marketAnalysis: MarketAnalysis;
    competitiveAnalysis: CompetitiveAnalysis;
    riskAssessment: RiskAssessment;
  };
}

export interface BusinessPlanSection {
  id: string;
  title: string;
  content: string;
  order: number;
  required: boolean;
  completed: boolean;
  wordCount: number;
  lastModified: Date;
  aiGenerated: boolean;
  aiScore?: number;
  suggestions?: string[];
}

export interface FinancialProjections {
  revenue: RevenueProjection[];
  expenses: ExpenseProjection[];
  cashFlow: CashFlowProjection[];
  breakEven: BreakEvenAnalysis;
  funding: FundingRequirements;
}

export interface RevenueProjection {
  year: number;
  quarter: number;
  revenue: number;
  growthRate: number;
  assumptions: string[];
}

export interface ExpenseProjection {
  year: number;
  quarter: number;
  category: string;
  amount: number;
  percentage: number;
}

export interface CashFlowProjection {
  year: number;
  quarter: number;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
}

export interface BreakEvenAnalysis {
  breakEvenPoint: number;
  breakEvenTime: string;
  assumptions: string[];
  sensitivity: SensitivityAnalysis[];
}

export interface SensitivityAnalysis {
  variable: string;
  baseCase: number;
  optimistic: number;
  pessimistic: number;
  impact: number;
}

export interface FundingRequirements {
  totalAmount: number;
  useOfFunds: UseOfFunds[];
  fundingRounds: FundingRound[];
  exitStrategy: string;
}

export interface UseOfFunds {
  category: string;
  amount: number;
  percentage: number;
  description: string;
}

export interface FundingRound {
  round: string;
  amount: number;
  valuation: number;
  investors: string[];
  timeline: string;
}

export interface MarketAnalysis {
  marketSize: MarketSize;
  targetMarket: TargetMarket;
  marketTrends: MarketTrend[];
  customerSegments: CustomerSegment[];
}

export interface MarketSize {
  totalAddressableMarket: number;
  serviceableAddressableMarket: number;
  serviceableObtainableMarket: number;
  growthRate: number;
  assumptions: string[];
}

export interface TargetMarket {
  description: string;
  size: number;
  characteristics: string[];
  needs: string[];
  painPoints: string[];
}

export interface MarketTrend {
  trend: string;
  impact: 'positive' | 'negative' | 'neutral';
  timeframe: string;
  confidence: number;
  sources: string[];
}

export interface CustomerSegment {
  name: string;
  description: string;
  size: number;
  characteristics: string[];
  needs: string[];
  acquisitionCost: number;
  lifetimeValue: number;
}

export interface CompetitiveAnalysis {
  competitors: Competitor[];
  competitiveAdvantages: string[];
  marketPosition: string;
  differentiation: string[];
}

export interface Competitor {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: number;
  pricing: string;
  positioning: string;
}

export interface RiskAssessment {
  risks: Risk[];
  mitigationStrategies: MitigationStrategy[];
  contingencyPlans: ContingencyPlan[];
}

export interface Risk {
  category: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  severity: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface MitigationStrategy {
  risk: string;
  strategy: string;
  owner: string;
  timeline: string;
  cost: number;
  effectiveness: number;
}

export interface ContingencyPlan {
  scenario: string;
  plan: string;
  triggers: string[];
  actions: string[];
  timeline: string;
}

export interface BusinessPlanMetadata extends DocumentMetadata {
  industry: string;
  businessStage: 'idea' | 'startup' | 'growth' | 'mature' | 'exit';
  fundingStage: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'ipo';
  targetAudience: string[];
  businessModel: string;
  revenueModel: string;
  keyMetrics: KeyMetric[];
}

export interface KeyMetric {
  name: string;
  value: number;
  unit: string;
  target: number;
  timeframe: string;
  importance: 'low' | 'medium' | 'high';
}

// Business Plan Factory
export function createBusinessPlan(data: Partial<BusinessPlanDocument>): BusinessPlanDocument {
  const now = new Date();
  
  return {
    id: data.id || `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'business-plan',
    title: data.title || 'Business Plan',
    description: data.description || 'Comprehensive business plan document',
    content: data.content || createDefaultBusinessPlanContent(),
    metadata: {
      category: 'business-plan',
      tags: ['business-plan', 'strategy', 'planning'],
      status: 'draft',
      visibility: 'private',
      language: 'en',
      wordCount: 0,
      pageCount: 0,
      readingTime: 0,
      complexity: 'high',
      industry: 'technology',
      businessStage: 'startup',
      fundingStage: 'pre-seed',
      targetAudience: ['investors', 'stakeholders'],
      businessModel: 'B2B',
      revenueModel: 'subscription',
      keyMetrics: [],
      creationMethod: 'manual',
      ...data.metadata
    },
    version: {
      current: '1.0.0',
      history: [],
      locked: false
    },
    permissions: {
      owner: data.permissions?.owner || '',
      editors: data.permissions?.editors || [],
      viewers: data.permissions?.viewers || [],
      commenters: data.permissions?.commenters || [],
      public: false
    },
    collaboration: {
      activeUsers: [],
      comments: [],
      suggestions: [],
      mentions: [],
      lastActivity: now
    },
    ai: {
      analyzed: false,
      overallScore: 0,
      qualityScore: 0,
      completenessScore: 0,
      readabilityScore: 0,
      insights: [],
      suggestions: [],
      autoGenerated: false,
      aiAssisted: false,
      confidence: 0
    },
    createdAt: now,
    updatedAt: now,
    createdBy: data.createdBy || '',
    lastModifiedBy: data.createdBy || ''
  };
}

// Default business plan content
function createDefaultBusinessPlanContent(): BusinessPlanContent {
  return {
    format: 'structured',
    data: {
      sections: [
        {
          id: 'executive-summary',
          title: 'Executive Summary',
          content: '',
          order: 1,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'company-description',
          title: 'Company Description',
          content: '',
          order: 2,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'market-analysis',
          title: 'Market Analysis',
          content: '',
          order: 3,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'organization-management',
          title: 'Organization & Management',
          content: '',
          order: 4,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'service-product-line',
          title: 'Service or Product Line',
          content: '',
          order: 5,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'marketing-sales',
          title: 'Marketing & Sales',
          content: '',
          order: 6,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'funding-request',
          title: 'Funding Request',
          content: '',
          order: 7,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'financial-projections',
          title: 'Financial Projections',
          content: '',
          order: 8,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'appendix',
          title: 'Appendix',
          content: '',
          order: 9,
          required: false,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        }
      ],
      financialProjections: {
        revenue: [],
        expenses: [],
        cashFlow: [],
        breakEven: {
          breakEvenPoint: 0,
          breakEvenTime: '',
          assumptions: [],
          sensitivity: []
        },
        funding: {
          totalAmount: 0,
          useOfFunds: [],
          fundingRounds: [],
          exitStrategy: ''
        }
      },
      marketAnalysis: {
        marketSize: {
          totalAddressableMarket: 0,
          serviceableAddressableMarket: 0,
          serviceableObtainableMarket: 0,
          growthRate: 0,
          assumptions: []
        },
        targetMarket: {
          description: '',
          size: 0,
          characteristics: [],
          needs: [],
          painPoints: []
        },
        marketTrends: [],
        customerSegments: []
      },
      competitiveAnalysis: {
        competitors: [],
        competitiveAdvantages: [],
        marketPosition: '',
        differentiation: []
      },
      riskAssessment: {
        risks: [],
        mitigationStrategies: [],
        contingencyPlans: []
      }
    }
  };
}
