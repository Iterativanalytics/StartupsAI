/**
 * Validation Schemas
 * Zod schemas for runtime validation with proper types
 */

import { z } from 'zod';

// ============================================================================
// Reusable Schema Components
// ============================================================================

export const MetricSchema = z.object({
  name: z.string().min(1).max(100),
  value: z.number(),
  unit: z.string().optional(),
  trend: z.enum(['up', 'down', 'stable']).optional(),
  description: z.string().max(500).optional(),
});

export const TeamMemberSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  experience: z.number().min(0).max(100),
  skills: z.array(z.string().max(50)).max(20),
  bio: z.string().max(1000).optional(),
  linkedIn: z.string().url().optional(),
});

export const CreditFactorSchema = z.object({
  name: z.string().min(1).max(100),
  impact: z.enum(['positive', 'negative', 'neutral']),
  weight: z.number().min(0).max(1),
  description: z.string().max(500).optional(),
});

export const PitchSlideSchema = z.object({
  id: z.string().uuid(),
  order: z.number().int().min(0),
  type: z.enum(['cover', 'problem', 'solution', 'market', 'product', 'business-model', 'traction', 'team', 'financials', 'ask', 'custom']),
  title: z.string().min(1).max(200),
  content: z.string().max(5000),
  imageUrl: z.string().url().optional(),
  notes: z.string().max(2000).optional(),
});

// ============================================================================
// Business Plan Schemas
// ============================================================================

export const InsertBusinessPlanSchema = z.object({
  userId: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\-_]+$/),
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(5000).trim().optional(),
  industry: z.string().max(100).trim().optional(),
  stage: z.enum(['idea', 'prototype', 'mvp', 'growth', 'scale']).optional(),
});

export const InsertPlanSectionSchema = z.object({
  businessPlanId: z.string().uuid(),
  chapterId: z.string().min(1).max(100),
  sectionId: z.string().min(1).max(100),
  content: z.string().max(50000),
  order: z.number().int().min(0).optional(),
});

export const InsertFinancialDataSchema = z.object({
  businessPlanId: z.string().uuid(),
  year: z.number().int().min(2000).max(2100),
  revenue: z.number().min(0),
  expenses: z.number().min(0),
  profit: z.number(),
  cashFlow: z.number(),
  projectedRevenue: z.number().min(0).optional(),
  projectedExpenses: z.number().min(0).optional(),
});

export const InsertAnalysisScoreSchema = z.object({
  businessPlanId: z.string().uuid(),
  companyValue: z.number().min(0),
  companyValueChange: z.number(),
  revenueMultiple: z.number().min(0),
  revenueMultipleChange: z.number(),
  runway: z.number().min(0),
  runwayChange: z.number(),
  burnRate: z.number().min(0),
  burnRateChange: z.number(),
  financialMetrics: z.array(MetricSchema),
  nonFinancialMetrics: z.array(MetricSchema),
  marketMetrics: z.array(MetricSchema),
  teamAssessment: z.array(TeamMemberSchema),
});

// ============================================================================
// Pitch Deck Schemas
// ============================================================================

export const InsertPitchDeckSchema = z.object({
  businessPlanId: z.string().uuid(),
  title: z.string().min(1).max(200),
  slides: z.array(PitchSlideSchema).min(1).max(50),
  version: z.number().int().min(1).optional(),
});

// ============================================================================
// Investment & Funding Schemas
// ============================================================================

export const InsertInvestmentSchema = z.object({
  planId: z.string().uuid(),
  investorId: z.string().uuid(),
  amount: z.number().min(0),
  equity: z.number().min(0).max(100).optional(),
  valuation: z.number().min(0).optional(),
  investmentType: z.enum(['seed', 'series-a', 'series-b', 'series-c', 'bridge', 'convertible-note']),
  date: z.coerce.date(),
  status: z.enum(['pending', 'committed', 'completed', 'cancelled']).optional(),
  terms: z.record(z.unknown()).optional(),
});

export const InsertLoanSchema = z.object({
  planId: z.string().uuid(),
  lenderId: z.string().uuid(),
  amount: z.number().min(0),
  interestRate: z.number().min(0).max(100),
  termMonths: z.number().int().min(1).max(600),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  monthlyPayment: z.number().min(0).optional(),
  status: z.enum(['pending', 'approved', 'active', 'paid-off', 'defaulted']).optional(),
  collateral: z.string().max(500).optional(),
});

export const InsertAdvisoryServiceSchema = z.object({
  planId: z.string().uuid(),
  partnerId: z.string().uuid(),
  serviceType: z.enum(['legal', 'accounting', 'marketing', 'technology', 'hr', 'strategy', 'other']),
  description: z.string().max(2000).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
  cost: z.number().min(0).optional(),
});

// ============================================================================
// Program & Cohort Schemas
// ============================================================================

export const InsertProgramSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(['accelerator', 'incubator', 'training', 'mentorship']),
  duration: z.number().int().min(1).max(365).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(['active', 'completed', 'upcoming', 'cancelled']).optional(),
  maxParticipants: z.number().int().min(1).optional(),
});

export const InsertCohortSchema = z.object({
  programId: z.string().uuid(),
  name: z.string().min(1).max(200),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  participantCount: z.number().int().min(0).optional(),
  status: z.enum(['active', 'completed', 'upcoming']).optional(),
});

// ============================================================================
// Portfolio Schemas
// ============================================================================

export const InsertPortfolioSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  totalValue: z.number().min(0).optional(),
  companyCount: z.number().int().min(0).optional(),
});

export const InsertPortfolioCompanySchema = z.object({
  portfolioId: z.string().uuid(),
  cohortId: z.string().uuid().optional(),
  companyName: z.string().min(1).max(200),
  industry: z.string().min(1).max(100),
  stage: z.enum(['idea', 'prototype', 'mvp', 'growth', 'scale']),
  website: z.string().url().optional(),
  description: z.string().max(2000).optional(),
  investmentAmount: z.number().min(0).optional(),
  equity: z.number().min(0).max(100).optional(),
  valuation: z.number().min(0).optional(),
  status: z.enum(['active', 'exited', 'failed', 'acquired']).optional(),
});

// ============================================================================
// Education & Mentorship Schemas
// ============================================================================

export const InsertEducationalModuleSchema = z.object({
  creatorId: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  category: z.string().max(100).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  duration: z.number().int().min(1).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export const InsertMentorshipSchema = z.object({
  mentorId: z.string().uuid(),
  menteeId: z.string().uuid(),
  programId: z.string().uuid().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  status: z.enum(['active', 'completed', 'cancelled', 'on-hold']).optional(),
  focusAreas: z.array(z.string().max(100)).max(10).optional(),
  meetingFrequency: z.string().max(100).optional(),
});

// ============================================================================
// Venture Project Schemas
// ============================================================================

export const InsertVentureProjectSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['planning', 'active', 'completed', 'on-hold', 'cancelled']).optional(),
  budget: z.number().min(0).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  teamSize: z.number().int().min(0).optional(),
});

// ============================================================================
// Credit Scoring Schemas
// ============================================================================

export const InsertCreditScoreSchema = z.object({
  userId: z.string().uuid(),
  score: z.number().int().min(300).max(850),
  date: z.coerce.date(),
  factors: z.array(CreditFactorSchema).optional(),
  recommendations: z.array(z.string().max(500)).max(10).optional(),
});

export const InsertFinancialMilestoneSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  targetAmount: z.number().min(0).optional(),
  currentAmount: z.number().min(0).optional(),
  targetDate: z.coerce.date().optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'missed']).optional(),
  category: z.enum(['revenue', 'funding', 'profitability', 'growth', 'other']),
});

export const InsertAiCoachingMessageSchema = z.object({
  userId: z.string().uuid(),
  message: z.string().min(1).max(5000),
  category: z.enum(['credit', 'business', 'financial', 'strategic', 'general']),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  read: z.boolean().optional(),
});

export const InsertCreditTipSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  category: z.string().min(1).max(100),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  impact: z.enum(['low', 'medium', 'high']).optional(),
});

export const InsertUserCreditTipSchema = z.object({
  userId: z.string().uuid(),
  creditTipId: z.string().uuid(),
  status: z.enum(['new', 'in-progress', 'completed', 'dismissed']).optional(),
  progress: z.number().min(0).max(100).optional(),
});

// ============================================================================
// Financial Projection Schemas
// ============================================================================

export const InsertFinancialProjectionSchema = z.object({
  businessPlanId: z.string().uuid(),
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12).optional(),
  revenue: z.number().min(0),
  expenses: z.number().min(0),
  profit: z.number(),
  cashFlow: z.number(),
  assumptions: z.array(z.string().max(500)).max(20).optional(),
  scenario: z.enum(['conservative', 'realistic', 'optimistic']).optional(),
});

export const InsertAiBusinessAnalysisSchema = z.object({
  businessPlanId: z.string().uuid(),
  strengths: z.array(z.string().max(500)).min(1).max(10),
  weaknesses: z.array(z.string().max(500)).min(1).max(10),
  opportunities: z.array(z.string().max(500)).min(1).max(10),
  threats: z.array(z.string().max(500)).min(1).max(10),
  recommendations: z.array(z.string().max(500)).min(1).max(10),
  overallScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
});
