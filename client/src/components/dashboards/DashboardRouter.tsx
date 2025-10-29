import React, { useState, useEffect } from 'react';
import { UserType } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { EntrepreneurDashboard } from './EntrepreneurDashboard';
import { InvestorDashboard } from './InvestorDashboard';
import { LenderDashboard } from './LenderDashboard';
import { GrantorDashboard } from './GrantorDashboard';
import { PartnerDashboard } from './PartnerDashboard';
import { 
  EntrepreneurDashboardData, 
  InvestorDashboardData, 
  LenderDashboardData, 
  GrantorDashboardData, 
  PartnerDashboardData 
} from '@/types/dashboard.types';

// Mock data generators for each user type
const generateEntrepreneurData = (): EntrepreneurDashboardData => ({
  businessMetrics: {
    totalPlans: 12,
    activePlans: 8,
    completedPlans: 4,
    fundingRaised: 250000,
    monthlyGrowth: 15,
    teamSize: 6,
    revenue: 45000,
    burnRate: 12000,
    runway: 18
  },
  recentActivity: [
    {
      id: '1',
      type: 'plan_created',
      title: 'New Business Plan Created',
      description: 'E-commerce platform business plan completed',
      timestamp: new Date('2024-01-20T10:30:00'),
      status: 'success'
    },
    {
      id: '2',
      type: 'funding_received',
      title: 'Seed Funding Received',
      description: 'Successfully raised $50,000 in seed funding',
      timestamp: new Date('2024-01-18T14:20:00'),
      status: 'success'
    },
    {
      id: '3',
      type: 'milestone_reached',
      title: 'Product Launch Milestone',
      description: 'Beta version launched with 100+ users',
      timestamp: new Date('2024-01-15T09:15:00'),
      status: 'success'
    }
  ],
  upcomingTasks: [
    {
      id: '1',
      title: 'Complete Series A Pitch Deck',
      dueDate: new Date('2024-02-15'),
      priority: 'high',
      category: 'funding'
    },
    {
      id: '2',
      title: 'Hire Senior Developer',
      dueDate: new Date('2024-02-01'),
      priority: 'critical',
      category: 'operations'
    },
    {
      id: '3',
      title: 'Update Financial Projections',
      dueDate: new Date('2024-01-30'),
      priority: 'medium',
      category: 'funding'
    }
  ],
  fundingOpportunities: [
    {
      id: '1',
      name: 'TechStars Accelerator',
      type: 'equity',
      amount: 120000,
      deadline: new Date('2024-03-01'),
      matchScore: 85,
      status: 'available'
    },
    {
      id: '2',
      name: 'SBA Small Business Loan',
      type: 'debt',
      amount: 500000,
      deadline: new Date('2024-02-28'),
      matchScore: 92,
      status: 'applied'
    }
  ],
  aiInsights: [
    {
      id: '1',
      type: 'recommendation',
      title: 'Market Expansion Opportunity',
      description: 'Based on your metrics, consider expanding to the European market',
      confidence: 87,
      actionRequired: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Burn Rate Alert',
      description: 'Your burn rate is higher than industry average. Consider cost optimization',
      confidence: 95,
      actionRequired: true
    }
  ]
});

const generateInvestorData = (): InvestorDashboardData => ({
  portfolioMetrics: {
    totalInvestments: 25,
    activeInvestments: 18,
    totalValue: 2500000,
    irr: 24.5,
    multiple: 3.2,
    cashFlow: 125000,
    riskScore: 6
  },
  dealFlow: {
    newDeals: 8,
    inReview: 5,
    approved: 3,
    rejected: 12,
    averageDealSize: 150000,
    averageTimeToDecision: 14
  },
  recentActivity: [
    {
      id: '1',
      type: 'deal_received',
      title: 'New Deal Received',
      description: 'AI startup seeking Series A funding',
      timestamp: new Date('2024-01-20T10:30:00'),
      companyId: 'comp-1',
      companyName: 'AI Innovations Inc.'
    },
    {
      id: '2',
      type: 'investment_made',
      title: 'Investment Completed',
      description: 'Invested $200K in fintech startup',
      timestamp: new Date('2024-01-18T14:20:00'),
      companyId: 'comp-2',
      companyName: 'PayTech Solutions'
    }
  ],
  portfolioCompanies: [
    {
      id: '1',
      name: 'TechStart Inc.',
      stage: 'Series A',
      industry: 'SaaS',
      investmentAmount: 500000,
      currentValue: 1200000,
      performance: 140,
      lastUpdate: new Date('2024-01-15'),
      status: 'performing'
    },
    {
      id: '2',
      name: 'GreenEnergy Corp',
      stage: 'Seed',
      industry: 'CleanTech',
      investmentAmount: 200000,
      currentValue: 450000,
      performance: 125,
      lastUpdate: new Date('2024-01-10'),
      status: 'performing'
    }
  ],
  marketInsights: [
    {
      id: '1',
      category: 'industry',
      title: 'AI Market Growth',
      description: 'AI sector showing 40% YoY growth in Q4',
      impact: 'positive',
      confidence: 92
    },
    {
      id: '2',
      category: 'stage',
      title: 'Series A Valuations',
      description: 'Series A valuations up 15% this quarter',
      impact: 'positive',
      confidence: 88
    }
  ]
});

const generateLenderData = (): LenderDashboardData => ({
  loanPortfolio: {
    totalLoans: 150,
    activeLoans: 120,
    totalOutstanding: 5000000,
    averageLoanSize: 35000,
    defaultRate: 3.2,
    recoveryRate: 85,
    portfolioYield: 8.5
  },
  applications: {
    newApplications: 12,
    inReview: 8,
    approved: 5,
    declined: 3,
    averageProcessingTime: 7,
    approvalRate: 62
  },
  recentActivity: [
    {
      id: '1',
      type: 'application_received',
      title: 'New Loan Application',
      description: 'Small business loan application received',
      timestamp: new Date('2024-01-20T10:30:00'),
      loanId: 'loan-1',
      amount: 50000
    },
    {
      id: '2',
      type: 'loan_approved',
      title: 'Loan Approved',
      description: 'Equipment financing loan approved',
      timestamp: new Date('2024-01-18T14:20:00'),
      loanId: 'loan-2',
      amount: 75000
    }
  ],
  atRiskLoans: [
    {
      id: '1',
      borrowerName: 'ABC Manufacturing',
      loanAmount: 100000,
      outstandingBalance: 45000,
      daysPastDue: 15,
      riskScore: 75,
      lastPayment: new Date('2024-01-05'),
      actionRequired: 'Contact borrower for payment plan'
    }
  ],
  creditInsights: [
    {
      id: '1',
      category: 'industry',
      title: 'Manufacturing Sector Risk',
      description: 'Manufacturing sector showing increased default risk',
      riskLevel: 'medium',
      recommendation: 'Increase credit requirements for manufacturing loans'
    }
  ]
});

const generateGrantorData = (): GrantorDashboardData => ({
  grantPortfolio: {
    totalGrants: 45,
    activeGrants: 30,
    totalAwarded: 2500000,
    averageGrantSize: 55000,
    completionRate: 78,
    impactScore: 8.2
  },
  applications: {
    newApplications: 15,
    inReview: 10,
    approved: 8,
    declined: 5,
    averageProcessingTime: 21,
    approvalRate: 53
  },
  recentActivity: [
    {
      id: '1',
      type: 'application_received',
      title: 'New Grant Application',
      description: 'Education technology grant application received',
      timestamp: new Date('2024-01-20T10:30:00'),
      grantId: 'grant-1',
      amount: 100000
    },
    {
      id: '2',
      type: 'grant_awarded',
      title: 'Grant Awarded',
      description: 'Environmental sustainability grant awarded',
      timestamp: new Date('2024-01-18T14:20:00'),
      grantId: 'grant-2',
      amount: 75000
    }
  ],
  activeGrants: [
    {
      id: '1',
      granteeName: 'EduTech Foundation',
      grantAmount: 100000,
      disbursedAmount: 60000,
      progress: 60,
      nextMilestone: 'Mid-term report submission',
      dueDate: new Date('2024-02-15'),
      status: 'on_track'
    }
  ],
  impactInsights: [
    {
      id: '1',
      category: 'social_impact',
      title: 'Education Technology Impact',
      description: 'EdTech grants showing 40% improvement in student outcomes',
      impact: 'high',
      recommendation: 'Increase funding for EdTech initiatives'
    }
  ]
});

const generatePartnerData = (): PartnerDashboardData => ({
  programMetrics: {
    totalPrograms: 8,
    activePrograms: 5,
    totalParticipants: 120,
    successRate: 78,
    averageProgramDuration: 12,
    satisfactionScore: 8.5
  },
  portfolio: {
    totalCompanies: 85,
    activeCompanies: 45,
    graduatedCompanies: 40,
    averageGrowth: 35,
    totalFundingRaised: 15000000
  },
  recentActivity: [
    {
      id: '1',
      type: 'company_joined',
      title: 'New Company Joined',
      description: 'AI startup joined accelerator program',
      timestamp: new Date('2024-01-20T10:30:00'),
      companyId: 'comp-1',
      companyName: 'AI Innovations Inc.'
    },
    {
      id: '2',
      type: 'graduation',
      title: 'Company Graduated',
      description: 'Fintech startup graduated from program',
      timestamp: new Date('2024-01-18T14:20:00'),
      companyId: 'comp-2',
      companyName: 'PayTech Solutions'
    }
  ],
  activeCompanies: [
    {
      id: '1',
      name: 'TechStart Inc.',
      stage: 'Series A',
      industry: 'SaaS',
      joinDate: new Date('2024-01-01'),
      progress: 75,
      nextMilestone: 'Product launch',
      status: 'on_track'
    }
  ],
  collaborationOpportunities: [
    {
      id: '1',
      type: 'mentorship',
      title: 'Tech Mentorship Program',
      description: 'Connect experienced tech leaders with startups',
      priority: 'high',
      deadline: new Date('2024-02-15'),
      participants: ['TechCorp', 'InnovationHub']
    }
  ]
});

export const DashboardRouter: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user?.userType) {
      // Simulate data loading
      setDataLoading(true);
      setTimeout(() => {
        let data;
        switch (user.userType) {
          case UserType.ENTREPRENEUR:
            data = generateEntrepreneurData();
            break;
          case UserType.INVESTOR:
            data = generateInvestorData();
            break;
          case UserType.LENDER:
            data = generateLenderData();
            break;
          case UserType.GRANTOR:
            data = generateGrantorData();
            break;
          case UserType.PARTNER:
            data = generatePartnerData();
            break;
          default:
            data = generateEntrepreneurData(); // Default fallback
        }
        setDashboardData(data);
        setDataLoading(false);
      }, 1000);
    }
  }, [user?.userType]);

  if (isLoading || dataLoading) {
    return <PageLoadingSpinner text="Loading your personalized dashboard..." />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Please log in</h3>
          <p className="text-gray-600">You need to be logged in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    setDataLoading(true);
    setTimeout(() => {
      let data;
      switch (user.userType) {
        case UserType.ENTREPRENEUR:
          data = generateEntrepreneurData();
          break;
        case UserType.INVESTOR:
          data = generateInvestorData();
          break;
        case UserType.LENDER:
          data = generateLenderData();
          break;
        case UserType.GRANTOR:
          data = generateGrantorData();
          break;
        case UserType.PARTNER:
          data = generatePartnerData();
          break;
        default:
          data = generateEntrepreneurData();
      }
      setDashboardData(data);
      setDataLoading(false);
    }, 1000);
  };

  const commonProps = {
    userType: user.userType as UserType,
    data: dashboardData,
    loading: dataLoading,
    onRefresh: handleRefresh
  };

  switch (user.userType) {
    case UserType.ENTREPRENEUR:
      return <EntrepreneurDashboard {...commonProps} />;
    case UserType.INVESTOR:
      return <InvestorDashboard {...commonProps} />;
    case UserType.LENDER:
      return <LenderDashboard {...commonProps} />;
    case UserType.GRANTOR:
      return <GrantorDashboard {...commonProps} />;
    case UserType.PARTNER:
      return <PartnerDashboard {...commonProps} />;
    default:
      return <EntrepreneurDashboard {...commonProps} />;
  }
};
