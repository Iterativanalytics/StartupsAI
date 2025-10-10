// ============================================================================
// AI-Based Credit Scoring System - Type Definitions
// Advanced credit risk assessment using machine learning and alternative data
// ============================================================================

// ===========================
// 1. CORE TYPES & INTERFACES
// ===========================

export interface CreditApplication {
  applicantId: string;
  businessInfo: BusinessInfo;
  financialData: FinancialData;
  traditionalCredit: TraditionalCreditData;
  alternativeData: AlternativeData;
  loanRequest: LoanRequest;
}

export interface BusinessInfo {
  businessName: string;
  industry: string;
  yearsInBusiness: number;
  businessStructure: 'sole_proprietorship' | 'llc' | 'corporation' | 's_corp' | 'partnership';
  numberOfEmployees: number;
  locations: number;
  ownershipPercentage: number;
}

export interface FinancialData {
  monthlyRevenue: number;
  annualRevenue: number;
  monthlyExpenses: number;
  netIncome: number;
  cashReserves: number;
  accountsReceivable: number;
  accountsPayable: number;
  inventory: number;
  assets: number;
  liabilities: number;
  revenueGrowthRate: number;
  profitMargin: number;
}

export interface TraditionalCreditData {
  personalCreditScore: number;
  businessCreditScore: number;
  paymentHistory: PaymentHistory[];
  creditUtilization: number;
  totalDebt: number;
  bankruptcies: number;
  foreclosures: number;
  collections: number;
  inquiries: number;
  accountsOpen: number;
  oldestAccountAge: number;
}

export interface PaymentHistory {
  creditor: string;
  accountType: string;
  balance: number;
  paymentStatus: 'current' | 'late_30' | 'late_60' | 'late_90' | 'default';
  monthsHistory: number;
}

export interface AlternativeData {
  bankingBehavior: BankingBehavior;
  businessMetrics: BusinessMetrics;
  digitalFootprint: DigitalFootprint;
  supplierRelationships: SupplierRelationships;
  customerBehavior: CustomerBehavior;
}

export interface BankingBehavior {
  averageDailyBalance: number;
  minimumBalance: number;
  overdrafts: number;
  nsf: number; // Non-sufficient funds
  depositFrequency: number;
  depositConsistency: number;
  cashFlowVolatility: number;
}

export interface BusinessMetrics {
  onlineReviews: {
    averageRating: number;
    totalReviews: number;
    responseRate: number;
  };
  socialMediaPresence: {
    followers: number;
    engagementRate: number;
    activeChannels: number;
  };
  websiteTraffic: number;
  conversionRate: number;
}

export interface DigitalFootprint {
  domainAge: number;
  websiteQuality: number;
  sslCertificate: boolean;
  businessListings: number;
  mediaPresence: number;
}

export interface SupplierRelationships {
  numberOfSuppliers: number;
  paymentTermsNegotiated: boolean;
  tradeReferences: number;
  averagePaymentDays: number;
}

export interface CustomerBehavior {
  repeatCustomerRate: number;
  averageTransactionValue: number;
  customerLifetimeValue: number;
  churnRate: number;
}

export interface LoanRequest {
  amount: number;
  term: number; // months
  purpose: string;
  collateral?: Collateral;
}

export interface Collateral {
  type: string;
  value: number;
  description: string;
}

// ===========================
// 2. CREDIT SCORING OUTPUTS
// ===========================

export interface CreditScore {
  overallScore: number; // 300-850 scale
  rating: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  defaultProbability: number; // 0-1
  riskCategory: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  confidenceLevel: number; // 0-1
  
  componentScores: {
    traditionalCredit: ComponentScore;
    financialHealth: ComponentScore;
    businessStability: ComponentScore;
    alternativeData: ComponentScore;
    industryRisk: ComponentScore;
  };
  
  keyFactors: {
    positive: Factor[];
    negative: Factor[];
  };
  
  recommendation: LoanRecommendation;
  explainability: Explainability;
}

export interface ComponentScore {
  score: number;
  weight: number;
  contribution: number;
  factors: string[];
}

export interface Factor {
  factor: string;
  impact: number;
  description: string;
}

export interface LoanRecommendation {
  decision: 'approve' | 'approve_with_conditions' | 'review' | 'decline';
  maxLoanAmount: number;
  suggestedInterestRate: number;
  suggestedTerm: number;
  requiredCollateral: number;
  conditions: string[];
  reasoning: string;
}

export interface Explainability {
  shapValues: Record<string, number>; // SHAP values for each feature
  featureImportance: Record<string, number>;
  decisionPath: string[];
  whatIfScenarios: WhatIfScenario[];
}

export interface WhatIfScenario {
  change: string;
  currentValue: any;
  suggestedValue: any;
  scoreImpact: number;
}

// ===========================
// 3. ADVANCED FEATURES
// ===========================

export interface FraudAssessment {
  isFraudulent: boolean;
  riskScore: number;
  flags: string[];
  recommendation: 'proceed' | 'investigate' | 'reject';
}

export interface CreditLimitRecommendation {
  recommendedLimit: number;
  minimumLimit: number;
  maximumLimit: number;
  reviewPeriod: number;
  reasoning: string;
}

export interface PortfolioRiskAnalysis {
  totalExposure: number;
  portfolioDefaultProbability: number;
  expectedLoss: number;
  expectedLossRate: number;
  concentrationRisk: number;
  industryExposure: Record<string, number>;
  riskRating: string;
  recommendations: string[];
}

// ===========================
// 4. REPORTING & ANALYSIS
// ===========================

export interface CreditAnalysisReport {
  applicationId: string;
  timestamp: string;
  applicant: {
    businessName: string;
    industry: string;
    yearsInBusiness: number;
  };
  scoring: {
    overallScore: number;
    rating: string;
    defaultProbability: number;
    riskCategory: string;
    confidenceLevel: number;
  };
  components: Record<string, ComponentScore>;
  recommendation: LoanRecommendation;
  keyFactors: {
    positive: Factor[];
    negative: Factor[];
  };
  fraudAssessment: FraudAssessment;
  creditLimit: CreditLimitRecommendation;
  explainability: Explainability;
  summary: string;
  nextSteps: string[];
}

export interface PortfolioAnalysisReport {
  totalApplications: number;
  portfolioMetrics: {
    averageScore: number;
    averageDefaultProbability: number;
    approvalRate: number;
  };
  riskDistribution: Record<string, number>;
  portfolioRisk: PortfolioRiskAnalysis;
  topRisks: Array<{
    applicationId: string;
    businessName: string;
    score: number;
    defaultProbability: number;
    loanAmount: number;
  }>;
  recommendations: string[];
}

export interface LoanMonitoringReport {
  loanId: string;
  monitoringDate: string;
  currentScore: number;
  originalScore: number;
  scoreDelta: number;
  currentRisk: number;
  originalRisk: number;
  riskDelta: number;
  warnings: string[];
  actionRequired: 'none' | 'monitor' | 'review' | 'restructure' | 'escalate';
  recommendations: string[];
}

// ===========================
// 5. INSTANT DECISION
// ===========================

export interface InstantDecisionResult {
  decision: 'approve' | 'decline' | 'review';
  reason: string;
  processingTime: number;
  requiresManualReview: boolean;
  score?: number;
  approvedAmount?: number;
  interestRate?: number;
  terms?: {
    amount: number;
    term: number;
    rate: number;
    monthlyPayment: number;
  };
  improvementSuggestions?: string[];
  reviewPriority?: 'high' | 'medium' | 'low';
}
