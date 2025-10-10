/**
 * Domain Type Definitions
 * Comprehensive type definitions for all domain entities
 */

// ============================================================================
// Business Plan Related Types
// ============================================================================

export interface PlanSection {
  id: string;
  businessPlanId: string;
  chapterId: string;
  sectionId: string;
  content: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertPlanSection {
  businessPlanId: string;
  chapterId: string;
  sectionId: string;
  content: string;
  order?: number;
}

export interface FinancialData {
  id: string;
  businessPlanId: string;
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  projectedRevenue?: number;
  projectedExpenses?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertFinancialData {
  businessPlanId: string;
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  projectedRevenue?: number;
  projectedExpenses?: number;
}

export interface Metric {
  name: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  experience: number;
  skills: string[];
  bio?: string;
  linkedIn?: string;
}

export interface AnalysisScore {
  id: string;
  businessPlanId: string;
  companyValue: number;
  companyValueChange: number;
  revenueMultiple: number;
  revenueMultipleChange: number;
  runway: number;
  runwayChange: number;
  burnRate: number;
  burnRateChange: number;
  financialMetrics: Metric[];
  nonFinancialMetrics: Metric[];
  marketMetrics: Metric[];
  teamAssessment: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertAnalysisScore {
  businessPlanId: string;
  companyValue: number;
  companyValueChange: number;
  revenueMultiple: number;
  revenueMultipleChange: number;
  runway: number;
  runwayChange: number;
  burnRate: number;
  burnRateChange: number;
  financialMetrics: Metric[];
  nonFinancialMetrics: Metric[];
  marketMetrics: Metric[];
  teamAssessment: TeamMember[];
}

// ============================================================================
// Pitch Deck Types
// ============================================================================

export interface PitchSlide {
  id: string;
  order: number;
  type: 'cover' | 'problem' | 'solution' | 'market' | 'product' | 'business-model' | 'traction' | 'team' | 'financials' | 'ask' | 'custom';
  title: string;
  content: string;
  imageUrl?: string;
  notes?: string;
}

export interface PitchDeck {
  id: string;
  businessPlanId: string;
  title: string;
  slides: PitchSlide[];
  version?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertPitchDeck {
  businessPlanId: string;
  title: string;
  slides: PitchSlide[];
  version?: number;
}

// ============================================================================
// Investment & Funding Types
// ============================================================================

export interface Investment {
  id: string;
  planId: string;
  investorId: string;
  amount: number;
  equity?: number;
  valuation?: number;
  investmentType: 'seed' | 'series-a' | 'series-b' | 'series-c' | 'bridge' | 'convertible-note';
  date: Date;
  status: 'pending' | 'committed' | 'completed' | 'cancelled';
  terms?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertInvestment {
  planId: string;
  investorId: string;
  amount: number;
  equity?: number;
  valuation?: number;
  investmentType: 'seed' | 'series-a' | 'series-b' | 'series-c' | 'bridge' | 'convertible-note';
  date: Date;
  status?: 'pending' | 'committed' | 'completed' | 'cancelled';
  terms?: Record<string, unknown>;
}

export interface Loan {
  id: string;
  planId: string;
  lenderId: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  startDate: Date;
  endDate: Date;
  monthlyPayment?: number;
  status: 'pending' | 'approved' | 'active' | 'paid-off' | 'defaulted';
  collateral?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertLoan {
  planId: string;
  lenderId: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  startDate: Date;
  endDate: Date;
  monthlyPayment?: number;
  status?: 'pending' | 'approved' | 'active' | 'paid-off' | 'defaulted';
  collateral?: string;
}

export interface AdvisoryService {
  id: string;
  planId: string;
  partnerId: string;
  serviceType: 'legal' | 'accounting' | 'marketing' | 'technology' | 'hr' | 'strategy' | 'other';
  description?: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'cancelled';
  cost?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertAdvisoryService {
  planId: string;
  partnerId: string;
  serviceType: 'legal' | 'accounting' | 'marketing' | 'technology' | 'hr' | 'strategy' | 'other';
  description?: string;
  startDate: Date;
  endDate?: Date;
  status?: 'active' | 'completed' | 'cancelled';
  cost?: number;
}

// ============================================================================
// Program & Cohort Types
// ============================================================================

export interface Program {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  type: 'accelerator' | 'incubator' | 'training' | 'mentorship';
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'upcoming' | 'cancelled';
  maxParticipants?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertProgram {
  organizationId: string;
  name: string;
  description?: string;
  type: 'accelerator' | 'incubator' | 'training' | 'mentorship';
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  status?: 'active' | 'completed' | 'upcoming' | 'cancelled';
  maxParticipants?: number;
}

export interface Cohort {
  id: string;
  programId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  participantCount?: number;
  status: 'active' | 'completed' | 'upcoming';
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertCohort {
  programId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  participantCount?: number;
  status?: 'active' | 'completed' | 'upcoming';
}

// ============================================================================
// Portfolio Types
// ============================================================================

export interface Portfolio {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  totalValue?: number;
  companyCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertPortfolio {
  organizationId: string;
  name: string;
  description?: string;
  totalValue?: number;
  companyCount?: number;
}

export interface PortfolioCompany {
  id: string;
  portfolioId: string;
  cohortId?: string;
  companyName: string;
  industry: string;
  stage: 'idea' | 'prototype' | 'mvp' | 'growth' | 'scale';
  website?: string;
  description?: string;
  investmentAmount?: number;
  equity?: number;
  valuation?: number;
  status: 'active' | 'exited' | 'failed' | 'acquired';
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertPortfolioCompany {
  portfolioId: string;
  cohortId?: string;
  companyName: string;
  industry: string;
  stage: 'idea' | 'prototype' | 'mvp' | 'growth' | 'scale';
  website?: string;
  description?: string;
  investmentAmount?: number;
  equity?: number;
  valuation?: number;
  status?: 'active' | 'exited' | 'failed' | 'acquired';
}

// ============================================================================
// Education & Mentorship Types
// ============================================================================

export interface EducationalModule {
  id: string;
  creatorId: string;
  title: string;
  content: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertEducationalModule {
  creatorId: string;
  title: string;
  content: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  tags?: string[];
}

export interface Mentorship {
  id: string;
  mentorId: string;
  menteeId: string;
  programId?: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'cancelled' | 'on-hold';
  focusAreas?: string[];
  meetingFrequency?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertMentorship {
  mentorId: string;
  menteeId: string;
  programId?: string;
  startDate: Date;
  endDate?: Date;
  status?: 'active' | 'completed' | 'cancelled' | 'on-hold';
  focusAreas?: string[];
  meetingFrequency?: string;
}

// ============================================================================
// Venture Project Types
// ============================================================================

export interface VentureProject {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  budget?: number;
  startDate?: Date;
  endDate?: Date;
  teamSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertVentureProject {
  organizationId: string;
  name: string;
  description?: string;
  status?: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  budget?: number;
  startDate?: Date;
  endDate?: Date;
  teamSize?: number;
}

// ============================================================================
// Credit Scoring Types
// ============================================================================

export interface CreditScore {
  id: string;
  userId: string;
  score: number;
  date: Date;
  factors?: CreditFactor[];
  recommendations?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description?: string;
}

export interface InsertCreditScore {
  userId: string;
  score: number;
  date: Date;
  factors?: CreditFactor[];
  recommendations?: string[];
}

export interface FinancialMilestone {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'missed';
  category: 'revenue' | 'funding' | 'profitability' | 'growth' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertFinancialMilestone {
  userId: string;
  title: string;
  description?: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: Date;
  status?: 'pending' | 'in-progress' | 'completed' | 'missed';
  category: 'revenue' | 'funding' | 'profitability' | 'growth' | 'other';
}

export interface AiCoachingMessage {
  id: string;
  userId: string;
  message: string;
  category: 'credit' | 'business' | 'financial' | 'strategic' | 'general';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: Date;
}

export interface InsertAiCoachingMessage {
  userId: string;
  message: string;
  category: 'credit' | 'business' | 'financial' | 'strategic' | 'general';
  priority?: 'low' | 'medium' | 'high';
  read?: boolean;
}

export interface CreditTip {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  impact?: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertCreditTip {
  title: string;
  content: string;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  impact?: 'low' | 'medium' | 'high';
}

export interface UserCreditTip {
  id: string;
  userId: string;
  creditTipId: string;
  status: 'new' | 'in-progress' | 'completed' | 'dismissed';
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertUserCreditTip {
  userId: string;
  creditTipId: string;
  status?: 'new' | 'in-progress' | 'completed' | 'dismissed';
  progress?: number;
}

// ============================================================================
// Financial Projection Types
// ============================================================================

export interface FinancialProjection {
  id: string;
  businessPlanId: string;
  year: number;
  month?: number;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  assumptions?: string[];
  scenario: 'conservative' | 'realistic' | 'optimistic';
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertFinancialProjection {
  businessPlanId: string;
  year: number;
  month?: number;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  assumptions?: string[];
  scenario?: 'conservative' | 'realistic' | 'optimistic';
}

export interface AiBusinessAnalysis {
  id: string;
  businessPlanId: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
  overallScore: number;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertAiBusinessAnalysis {
  businessPlanId: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
  overallScore: number;
  confidence: number;
}

export interface CreditScoreTier {
  id: string;
  name: string;
  minScore: number;
  maxScore: number;
  description?: string;
  benefits?: string[];
  color?: string;
}
