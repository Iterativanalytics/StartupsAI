import React, { lazy, Suspense, useEffect } from 'react';
import { UserType } from '@shared/schema';
import { DashboardProvider } from './providers/DashboardProvider';
import { WidgetRegistryProvider, useRegisterWidget } from './providers/WidgetRegistry';
import DashboardLayout from './core/DashboardLayout';
import { DashboardWidget } from './types/dashboard.types';

// Lazy load widgets for better performance
const RevenueWidget = lazy(() => import('./widgets/analytics/RevenueWidget'));
const ActivityFeedWidget = lazy(() => import('./widgets/activity/ActivityFeedWidget'));
const AIInsightsWidget = lazy(() => import('./widgets/ai/AIInsightsWidget'));
const GoalsTrackerWidget = lazy(() => import('./widgets/goals/GoalsTrackerWidget'));

// Widget loading fallback
const WidgetFallback: React.FC<{ widgetId: string }> = ({ widgetId }) => (
  <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-sm text-gray-600">Loading {widgetId}...</p>
    </div>
  </div>
);

// Widget registry component
const WidgetRegistry: React.FC = () => {
  const registerWidget = useRegisterWidget();

  useEffect(() => {
    // Register analytics widgets
    registerWidget({
      id: 'revenue-overview',
      type: 'analytics',
      title: 'Revenue Overview',
      component: RevenueWidget,
      size: 'large',
      minSize: { w: 4, h: 3 },
      maxSize: { w: 6, h: 4 },
      permissions: [],
      userTypes: [UserType.ENTREPRENEUR, UserType.INVESTOR, UserType.PARTNER],
      category: 'analytics',
      refreshInterval: 300000, // 5 minutes
      priority: 10,
      defaultEnabled: true,
      description: 'Track revenue performance and growth trends',
    });

    // Register activity widgets
    registerWidget({
      id: 'activity-feed',
      type: 'activity',
      title: 'Activity Feed',
      component: ActivityFeedWidget,
      size: 'medium',
      minSize: { w: 3, h: 4 },
      maxSize: { w: 6, h: 6 },
      permissions: [],
      userTypes: Object.values(UserType),
      category: 'activity',
      refreshInterval: 60000, // 1 minute
      priority: 8,
      defaultEnabled: true,
      description: 'View recent activities and updates',
    });

    // Register AI widgets
    registerWidget({
      id: 'ai-insights',
      type: 'ai',
      title: 'AI Insights',
      component: AIInsightsWidget,
      size: 'medium',
      minSize: { w: 3, h: 3 },
      maxSize: { w: 6, h: 5 },
      permissions: [],
      userTypes: Object.values(UserType),
      category: 'ai',
      refreshInterval: 600000, // 10 minutes
      priority: 9,
      defaultEnabled: true,
      description: 'Get AI-powered insights and recommendations',
    });

    // Register goals widgets
    registerWidget({
      id: 'goals-tracker',
      type: 'goals',
      title: 'Goals Tracker',
      component: GoalsTrackerWidget,
      size: 'medium',
      minSize: { w: 3, h: 4 },
      maxSize: { w: 6, h: 6 },
      permissions: [],
      userTypes: [UserType.ENTREPRENEUR, UserType.TEAM_MEMBER],
      category: 'goals',
      refreshInterval: 300000, // 5 minutes
      priority: 7,
      defaultEnabled: true,
      description: 'Track and manage your goals and milestones',
    });

    // TODO: Register more widgets as they are created
    // - Credit monitoring widgets
    // - Funding opportunity widgets
    // - Performance metrics widgets
    // - Collaboration widgets
  }, [registerWidget]);

  return <></>;
};

// Mock data providers
const getMockRevenueData = () => ({
  current: 125000,
  previous: 98000,
  target: 150000,
  currency: 'USD',
  chartData: [
    { month: 'Jan', revenue: 45000, target: 50000, growth: 12.5 },
    { month: 'Feb', revenue: 52000, target: 55000, growth: 15.6 },
    { month: 'Mar', revenue: 48000, target: 50000, growth: -7.7 },
    { month: 'Apr', revenue: 61000, target: 60000, growth: 27.1 },
    { month: 'May', revenue: 58000, target: 65000, growth: -4.9 },
    { month: 'Jun', revenue: 67000, target: 70000, growth: 15.5 },
  ],
});

const getMockActivityData = () => ({
  activities: [
    {
      id: '1',
      type: 'user' as const,
      title: 'New team member joined',
      description: 'Sarah Johnson joined as Product Manager',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      user: {
        name: 'Sarah Johnson',
        initials: 'SJ',
      },
      status: 'completed' as const,
      priority: 'medium' as const,
    },
    {
      id: '2',
      type: 'financial' as const,
      title: 'Payment received',
      description: 'Payment of $5,000 received from client ABC Corp',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'completed' as const,
      metadata: {
        amount: 5000,
        category: 'Revenue',
      },
    },
    {
      id: '3',
      type: 'milestone' as const,
      title: 'Milestone completed',
      description: 'Q1 revenue target achieved',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      status: 'completed' as const,
      priority: 'high' as const,
    },
  ],
  unreadCount: 2,
});

const getMockAIInsightsData = () => ({
  insights: [
    {
      id: '1',
      type: 'opportunity' as const,
      title: 'Revenue Growth Opportunity',
      description: 'Based on current trends, you could increase revenue by 15% by optimizing your pricing strategy.',
      confidence: 87,
      impact: 'high' as const,
      category: 'Revenue',
      suggestedActions: [
        'Analyze competitor pricing',
        'Conduct customer price sensitivity survey',
        'Implement A/B testing for new pricing tiers',
      ],
      metadata: {
        affectedMetrics: ['Revenue', 'Customer Acquisition Cost'],
        timeframe: '3 months',
        probability: 0.87,
      },
    },
    {
      id: '2',
      type: 'risk' as const,
      title: 'Customer Churn Risk',
      description: 'Several key customers show signs of potential churn. Immediate action recommended.',
      confidence: 73,
      impact: 'medium' as const,
      category: 'Customer Success',
      suggestedActions: [
        'Reach out to at-risk customers',
        'Review support ticket patterns',
        'Offer retention incentives',
      ],
      metadata: {
        affectedMetrics: ['Customer Lifetime Value', 'Churn Rate'],
        timeframe: '2 weeks',
        probability: 0.73,
      },
    },
  ],
  lastUpdated: new Date(),
  modelVersion: '2.1',
});

const getMockGoalsData = () => ({
  goals: [
    {
      id: '1',
      title: 'Increase Monthly Revenue',
      description: 'Achieve $150K monthly recurring revenue by end of Q2',
      target: 150000,
      current: 125000,
      unit: 'USD',
      deadline: new Date('2024-06-30'),
      status: 'in-progress' as const,
      priority: 'high' as const,
      category: 'Revenue',
      milestones: [
        {
          id: '1.1',
          title: 'Reach $100K MRR',
          completed: true,
          dueDate: new Date('2024-03-31'),
        },
        {
          id: '1.2',
          title: 'Reach $125K MRR',
          completed: true,
          dueDate: new Date('2024-04-30'),
        },
        {
          id: '1.3',
          title: 'Reach $150K MRR',
          completed: false,
          dueDate: new Date('2024-06-30'),
        },
      ],
    },
    {
      id: '2',
      title: 'Product Launch',
      description: 'Launch new mobile app feature by end of May',
      target: 100,
      current: 75,
      unit: '%',
      deadline: new Date('2024-05-31'),
      status: 'in-progress' as const,
      priority: 'medium' as const,
      category: 'Product',
      milestones: [
        {
          id: '2.1',
          title: 'Design completion',
          completed: true,
          dueDate: new Date('2024-04-15'),
        },
        {
          id: '2.2',
          title: 'Development completion',
          completed: false,
          dueDate: new Date('2024-05-15'),
        },
        {
          id: '2.3',
          title: 'Testing completion',
          completed: false,
          dueDate: new Date('2024-05-25'),
        },
      ],
    },
  ],
  totalGoals: 2,
  completedGoals: 0,
  overdueGoals: 0,
});

// Main Unified Dashboard Component
interface UnifiedDashboardProps {
  userType: UserType;
  title?: string;
  subtitle?: string;
  editable?: boolean;
}

const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  userType,
  title,
  subtitle,
  editable = true,
}) => {
  const getDashboardTitle = () => {
    if (title) return title;
    
    switch (userType) {
      case UserType.ENTREPRENEUR:
        return 'Entrepreneur Dashboard';
      case UserType.INVESTOR:
        return 'Investor Dashboard';
      case UserType.LENDER:
        return 'Lender Dashboard';
      case UserType.GRANTOR:
        return 'Grantor Dashboard';
      case UserType.PARTNER:
        return 'Partner Dashboard';
      case UserType.TEAM_MEMBER:
        return 'Team Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getDashboardSubtitle = () => {
    if (subtitle) return subtitle;
    
    switch (userType) {
      case UserType.ENTREPRENEUR:
        return 'Track your startup progress and growth metrics';
      case UserType.INVESTOR:
        return 'Monitor your portfolio and discover new opportunities';
      case UserType.LENDER:
        return 'Manage lending operations and credit monitoring';
      case UserType.GRANTOR:
        return 'Oversee grant programs and impact metrics';
      case UserType.PARTNER:
        return 'Collaborate and track partnership activities';
      case UserType.TEAM_MEMBER:
        return 'Stay updated on team goals and activities';
      default:
        return 'Your personalized dashboard';
    }
  };

  return (
    <WidgetRegistryProvider>
      <DashboardProvider userType={userType}>
        <WidgetRegistry />
        <Suspense fallback={<WidgetFallback widgetId="dashboard" />}>
          <DashboardLayout
            title={getDashboardTitle()}
            subtitle={getDashboardSubtitle()}
            editable={editable}
            onSave={() => {
              console.log('Saving dashboard layout...');
              // TODO: Implement save functionality
            }}
            onExport={() => {
              console.log('Exporting dashboard...');
              // TODO: Implement export functionality
            }}
            onImport={() => {
              console.log('Importing dashboard...');
              // TODO: Implement import functionality
            }}
          />
        </Suspense>
      </DashboardProvider>
    </WidgetRegistryProvider>
  );
};

export default UnifiedDashboard;

// Export mock data for testing
export {
  getMockRevenueData,
  getMockActivityData,
  getMockAIInsightsData,
  getMockGoalsData,
};
