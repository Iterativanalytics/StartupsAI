
// Enhanced user type definitions for comprehensive startup ecosystem

// Core user types
export enum UserType {
  ENTREPRENEUR = 'entrepreneur',
  INVESTOR = 'investor',
  LENDER = 'lender',
  GRANTOR = 'grantor',
  PARTNER = 'partner',
  TEAM_MEMBER = 'team_member',
  ADMIN = 'admin'
}

// Detailed user subtypes
export interface UserSubtypes {
  entrepreneur: 'first-time-founder' | 'serial-entrepreneur' | 'corporate-innovator';
  investor: 'angel-investor' | 'vc-fund' | 'pe-fund' | 'family-office' | 'strategic-investor';
  lender: 'commercial-bank' | 'credit-union' | 'online-lender' | 'sba-lender' | 'alternative-lender';
  grantor: 'government-agency' | 'foundation' | 'corporate-foundation' | 'research-grant';
  partner: 'accelerator' | 'incubator' | 'consultant' | 'advisor' | 'mentor' | 'service-provider';
  teamMember: 'admin' | 'member' | 'viewer' | 'contributor' | 'stakeholder';
}

// User-specific metrics and interests
export interface UserMetrics {
  entrepreneur: {
    businessGrowth: number;
    fundingStage: string;
    teamSize: number;
    revenueGrowth: number;
    marketValidation: number;
  };
  investor: {
    dealAttractiveness: number;
    potentialROI: number;
    riskLevel: string;
    industryFit: number;
    stageAlignment: string;
  };
  lender: {
    creditworthiness: number;
    dscr: number; // Debt Service Coverage Ratio
    collateralValue: number;
    riskAssessment: string;
    paymentHistory: number;
  };
  grantor: {
    socialImpact: number;
    sustainability: number;
    communityBenefit: number;
    innovationLevel: number;
    complianceScore: number;
  };
  partner: {
    strategicFit: number;
    resourceRequirements: string[];
    collaborationModel: string;
    successRate: number;
    networkValue: number;
  };
}

// Enhanced User interface
export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  userType: UserType;
  userSubtype?: string;
  role?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  phone?: string;
  preferences?: Record<string, unknown>;
  metrics?: Record<string, unknown>;
  verified: boolean;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertUser {
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  userType: UserType;
  userSubtype?: string;
  role?: string;
  preferences?: Record<string, unknown>;
  metrics?: Record<string, unknown>;
  verified?: boolean;
  onboardingCompleted?: boolean;
}

// Permission system
export interface UserPermissions {
  viewBusinessPlans: boolean;
  accessFinancials: boolean;
  reviewDocuments: boolean;
  initiateConnection: boolean;
  manageTeam: boolean;
  approveTransactions: boolean;
  generateReports: boolean;
  accessAnalytics: boolean;
  manageFunding: boolean;
  processLoans: boolean;
  evaluateGrants: boolean;
  facilitatePartnerships: boolean;
}

// Matching system interfaces
export interface MatchingCriteria {
  entrepreneur: {
    fundingStage: string;
    industry: string[];
    location: string;
    teamSize: number;
    revenueStage: string;
    growthRate: number;
  };
  investor: {
    investmentFocus: string[];
    checkSize: { min: number; max: number };
    stage: string[];
    geography: string[];
    industryPreference: string[];
    riskTolerance: string;
  };
  lender: {
    loanTypes: string[];
    loanRange: { min: number; max: number };
    creditRequirements: string;
    industries: string[];
    regions: string[];
  };
  grantor: {
    grantTypes: string[];
    focusAreas: string[];
    impactRequirements: string[];
    eligibilityCriteria: any;
  };
  partner: {
    partnershipTypes: string[];
    expertiseAreas: string[];
    resourceOfferings: string[];
    collaborationModels: string[];
  };
}

export interface CompatibilityScore {
  industryFit: number;
  stageFit: number;
  sizeFit: number;
  geoFit: number;
  riskFit: number;
  strategicFit: number;
  overallScore: number;
}

// Business Plans (enhanced)
export interface BusinessPlan {
  id: number;
  name: string;
  userId: string;
  content?: string;
  description?: string;
  industry?: string;
  stage?: string;
  fundingGoal?: number;
  teamSize?: number;
  revenueProjection?: number;
  marketSize?: number;
  competitiveAdvantage?: string;
  userType: UserType;
  visibility: 'private' | 'team' | 'investors' | 'partners' | 'public';
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertBusinessPlan {
  name: string;
  userId: string;
  content?: string;
  description?: string;
  industry?: string;
  stage?: string;
  fundingGoal?: number;
  teamSize?: number;
  revenueProjection?: number;
  marketSize?: number;
  competitiveAdvantage?: string;
  userType: UserType;
  visibility?: 'private' | 'team' | 'investors' | 'partners' | 'public';
}

// Plan Sections (unchanged)
export interface PlanSection {
  id: number;
  businessPlanId: string;
  chapterId: string;
  sectionId: string;
  title: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertPlanSection {
  businessPlanId: string;
  chapterId: string;
  sectionId: string;
  title: string;
  content?: string;
}

// Financial Data (enhanced)
export interface FinancialData {
  id: number;
  businessPlanId: string;
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  burnRate?: number;
  runway?: number;
  customerAcquisitionCost?: number;
  lifetimeValue?: number;
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
  burnRate?: number;
  runway?: number;
  customerAcquisitionCost?: number;
  lifetimeValue?: number;
}

// Analysis Scores (enhanced for multi-user perspectives)
export interface AnalysisScore {
  id: number;
  businessPlanId: string;
  userType: UserType;
  companyValue: number;
  companyValueChange: number;
  revenueMultiple: number;
  revenueMultipleChange: number;
  runway: number;
  runwayChange: number;
  burnRate: number;
  burnRateChange: number;
  financialMetrics?: Record<string, unknown>;
  nonFinancialMetrics?: Record<string, unknown>;
  marketMetrics?: Record<string, unknown>;
  teamAssessment?: Record<string, unknown>;
  riskAssessment?: Record<string, unknown>;
  investorPerspective?: Record<string, unknown>;
  lenderPerspective?: Record<string, unknown>;
  grantorPerspective?: Record<string, unknown>;
  partnerPerspective?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertAnalysisScore {
  businessPlanId: string;
  userType: UserType;
  companyValue: number;
  companyValueChange: number;
  revenueMultiple: number;
  revenueMultipleChange: number;
  runway: number;
  runwayChange: number;
  burnRate: number;
  burnRateChange: number;
  financialMetrics?: Record<string, unknown>;
  nonFinancialMetrics?: Record<string, unknown>;
  marketMetrics?: Record<string, unknown>;
  teamAssessment?: Record<string, unknown>;
  riskAssessment?: Record<string, unknown>;
  investorPerspective?: Record<string, unknown>;
  lenderPerspective?: Record<string, unknown>;
  grantorPerspective?: Record<string, unknown>;
  partnerPerspective?: Record<string, unknown>;
}

// Organizations (enhanced)
export interface Organization {
  id: number;
  name: string;
  description?: string;
  organizationType: UserType;
  ownerId: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertOrganization {
  name: string;
  description?: string;
  organizationType: UserType;
  ownerId: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  verified?: boolean;
}

// Connections/Matches
export interface Connection {
  id: number;
  initiatorId: string;
  targetId: string;
  connectionType: string;
  status: 'pending' | 'accepted' | 'declined' | 'archived';
  compatibilityScore: number;
  initiatorType: UserType;
  targetType: UserType;
  connectionContext?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertConnection {
  initiatorId: string;
  targetId: string;
  connectionType: string;
  compatibilityScore: number;
  initiatorType: UserType;
  targetType: UserType;
  connectionContext?: Record<string, unknown>;
}

// Portfolios (enhanced)
export interface Portfolio {
  id: number;
  name: string;
  description?: string;
  organizationId: string;
  portfolioType: UserType;
  metrics?: Record<string, unknown>;
  totalValue?: string;
  performance?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertPortfolio {
  name: string;
  description?: string;
  organizationId: string;
  portfolioType: UserType;
  metrics?: Record<string, unknown>;
  totalValue?: string;
  performance?: Record<string, unknown>;
}

// Educational Modules (unchanged)
export interface EducationalModule {
  id: number;
  title: string;
  description?: string;
  creatorId: string;
  targetUserTypes: UserType[];
  content?: Record<string, unknown>;
  resources?: Record<string, unknown>;
  prerequisites?: Record<string, unknown>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  completions?: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertEducationalModule {
  title: string;
  description?: string;
  creatorId: string;
  targetUserTypes: UserType[];
  content?: Record<string, unknown>;
  resources?: Record<string, unknown>;
  prerequisites?: Record<string, unknown>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
}

// Venture Projects (enhanced)
export interface VentureProject {
  id: number;
  name: string;
  description?: string;
  organizationId: string;
  stage: string;
  projectType: 'venture-studio' | 'accelerator' | 'incubator';
  businessPlanId?: string;
  team?: Record<string, unknown>;
  resources?: Record<string, unknown>;
  roadmap?: Record<string, unknown>;
  validationResults?: Record<string, unknown>;
  fundingStatus?: Record<string, unknown>;
  mentors?: Record<string, unknown>;
  milestones?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertVentureProject {
  name: string;
  description?: string;
  organizationId: string;
  stage: string;
  projectType: 'venture-studio' | 'accelerator' | 'incubator';
  businessPlanId?: string;
  team?: Record<string, unknown>;
  resources?: Record<string, unknown>;
  roadmap?: Record<string, unknown>;
  validationResults?: Record<string, unknown>;
  fundingStatus?: Record<string, unknown>;
  mentors?: Record<string, unknown>;
  milestones?: Record<string, unknown>;
}

// Co-Founder Agent schemas
export interface CoFounderGoal {
  id: string;
  userId: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  createdAt: string;
}

export interface InsertCoFounderGoal {
  userId: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface CoFounderCommitment {
  id: string;
  userId: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  createdAt: string;
}

export interface InsertCoFounderCommitment {
  userId: string;
  description: string;
  dueDate: string;
}
