import { UserType } from '@shared/schema';

// Base dashboard widget interface
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'list' | 'action' | 'insight';
  size: 'small' | 'medium' | 'large' | 'full';
  position: { x: number; y: number; w: number; h: number };
  data?: any;
  config?: Record<string, any>;
  refreshInterval?: number;
  lastUpdated?: Date;
}

// Dashboard configuration interface
export interface DashboardConfig {
  userType: UserType;
  title: string;
  subtitle: string;
  widgets: DashboardWidget[];
  layout: 'grid' | 'masonry' | 'custom';
  theme: 'light' | 'dark' | 'auto';
  refreshInterval: number;
  lastUpdated: Date;
}

// User-specific dashboard data interfaces
export interface EntrepreneurDashboardData {
  businessMetrics: {
    totalPlans: number;
    activePlans: number;
    completedPlans: number;
    fundingRaised: number;
    monthlyGrowth: number;
    teamSize: number;
    revenue: number;
    burnRate: number;
    runway: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'plan_created' | 'plan_updated' | 'funding_received' | 'milestone_reached';
    title: string;
    description: string;
    timestamp: Date;
    status: 'success' | 'warning' | 'info';
  }>;
  upcomingTasks: Array<{
    id: string;
    title: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: 'funding' | 'product' | 'marketing' | 'operations';
  }>;
  fundingOpportunities: Array<{
    id: string;
    name: string;
    type: 'equity' | 'debt' | 'grant';
    amount: number;
    deadline: Date;
    matchScore: number;
    status: 'available' | 'applied' | 'reviewed' | 'rejected';
  }>;
  aiInsights: Array<{
    id: string;
    type: 'recommendation' | 'warning' | 'opportunity';
    title: string;
    description: string;
    confidence: number;
    actionRequired: boolean;
  }>;
}

export interface InvestorDashboardData {
  portfolioMetrics: {
    totalInvestments: number;
    activeInvestments: number;
    totalValue: number;
    irr: number;
    multiple: number;
    cashFlow: number;
    riskScore: number;
  };
  dealFlow: {
    newDeals: number;
    inReview: number;
    approved: number;
    rejected: number;
    averageDealSize: number;
    averageTimeToDecision: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'deal_received' | 'deal_reviewed' | 'investment_made' | 'company_update';
    title: string;
    description: string;
    timestamp: Date;
    companyId: string;
    companyName: string;
  }>;
  portfolioCompanies: Array<{
    id: string;
    name: string;
    stage: string;
    industry: string;
    investmentAmount: number;
    currentValue: number;
    performance: number;
    lastUpdate: Date;
    status: 'performing' | 'at_risk' | 'exited';
  }>;
  marketInsights: Array<{
    id: string;
    category: 'industry' | 'stage' | 'geography';
    title: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    confidence: number;
  }>;
}

export interface LenderDashboardData {
  loanPortfolio: {
    totalLoans: number;
    activeLoans: number;
    totalOutstanding: number;
    averageLoanSize: number;
    defaultRate: number;
    recoveryRate: number;
    portfolioYield: number;
  };
  applications: {
    newApplications: number;
    inReview: number;
    approved: number;
    declined: number;
    averageProcessingTime: number;
    approvalRate: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'application_received' | 'application_reviewed' | 'loan_approved' | 'payment_received';
    title: string;
    description: string;
    timestamp: Date;
    loanId: string;
    amount: number;
  }>;
  atRiskLoans: Array<{
    id: string;
    borrowerName: string;
    loanAmount: number;
    outstandingBalance: number;
    daysPastDue: number;
    riskScore: number;
    lastPayment: Date;
    actionRequired: string;
  }>;
  creditInsights: Array<{
    id: string;
    category: 'industry' | 'geography' | 'loan_type';
    title: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
}

export interface GrantorDashboardData {
  grantPortfolio: {
    totalGrants: number;
    activeGrants: number;
    totalAwarded: number;
    averageGrantSize: number;
    completionRate: number;
    impactScore: number;
  };
  applications: {
    newApplications: number;
    inReview: number;
    approved: number;
    declined: number;
    averageProcessingTime: number;
    approvalRate: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'application_received' | 'application_reviewed' | 'grant_awarded' | 'report_received';
    title: string;
    description: string;
    timestamp: Date;
    grantId: string;
    amount: number;
  }>;
  activeGrants: Array<{
    id: string;
    granteeName: string;
    grantAmount: number;
    disbursedAmount: number;
    progress: number;
    nextMilestone: string;
    dueDate: Date;
    status: 'on_track' | 'at_risk' | 'completed';
  }>;
  impactInsights: Array<{
    id: string;
    category: 'social_impact' | 'sustainability' | 'innovation';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    recommendation: string;
  }>;
}

export interface PartnerDashboardData {
  programMetrics: {
    totalPrograms: number;
    activePrograms: number;
    totalParticipants: number;
    successRate: number;
    averageProgramDuration: number;
    satisfactionScore: number;
  };
  portfolio: {
    totalCompanies: number;
    activeCompanies: number;
    graduatedCompanies: number;
    averageGrowth: number;
    totalFundingRaised: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'company_joined' | 'milestone_reached' | 'graduation' | 'partnership_formed';
    title: string;
    description: string;
    timestamp: Date;
    companyId: string;
    companyName: string;
  }>;
  activeCompanies: Array<{
    id: string;
    name: string;
    stage: string;
    industry: string;
    joinDate: Date;
    progress: number;
    nextMilestone: string;
    status: 'on_track' | 'needs_support' | 'at_risk';
  }>;
  collaborationOpportunities: Array<{
    id: string;
    type: 'mentorship' | 'investment' | 'partnership' | 'resource';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    deadline: Date;
    participants: string[];
  }>;
}

// Dashboard props interface
export interface DashboardProps {
  userType: UserType;
  data: EntrepreneurDashboardData | InvestorDashboardData | LenderDashboardData | GrantorDashboardData | PartnerDashboardData;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  onWidgetClick?: (widgetId: string) => void;
}

// Widget component props
export interface WidgetProps {
  widget: DashboardWidget;
  data: any;
  loading?: boolean;
  error?: string;
  onAction?: (action: string, payload?: any) => void;
}

// Dashboard context interface
export interface DashboardContextType {
  userType: UserType;
  data: any;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  updateWidget: (widgetId: string, data: any) => void;
}

// Dashboard action types
export type DashboardAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: any }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_WIDGET'; payload: { widgetId: string; data: any } }
  | { type: 'REFRESH' };
