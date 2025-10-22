# Analytics Hub - Complete Code Documentation

## Overview
The Analytics Hub is a comprehensive analytics system that provides real-time metrics, predictive analytics, and performance monitoring across the StartupsAI platform. It includes multiple analytics engines for different domains including Design Thinking workflows, infographic usage, AI agent interactions, and dashboard performance.

## Table of Contents
1. [Frontend Components](#frontend-components)
2. [Backend Services](#backend-services)
3. [Types & Interfaces](#types--interfaces)
4. [Hooks & Utilities](#hooks--utilities)
5. [API Endpoints](#api-endpoints)
6. [Usage Examples](#usage-examples)

---

## Frontend Components

### Main Analytics Dashboard
**File:** `client/src/pages/analytics-dashboard.tsx`

The primary analytics dashboard providing comprehensive business metrics, predictive analytics, and real-time monitoring.

```typescript
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  AlertTriangle,
  BarChart3,
  LineChart,
  Activity,
  Shield,
  Zap,
  Lightbulb,
  Calendar,
  Eye,
  Bell,
  Wifi,
  WifiOff,
  Smartphone
} from "lucide-react";
import { BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, Area, AreaChart, LineChart as RechartsLineChart } from "recharts";

interface AnalyticsData {
  performanceMetrics: {
    totalRevenue: number;
    revenueGrowth: number;
    userGrowth: number;
    conversionRate: number;
    customerAcquisitionCost: number;
    lifetimeValue: number;
    burnRate: number;
    runway: number;
    activeUsers: number;
    churnRate: number;
  };
  predictiveModels: {
    revenueForecasting: Array<{
      month: string;
      predicted: number;
      actual?: number;
      confidence: number;
    }>;
    userGrowthPrediction: Array<{
      month: string;
      predicted: number;
      lowerBound: number;
      upperBound: number;
    }>;
    riskFactors: Array<{
      factor: string;
      likelihood: number;
      impact: 'High' | 'Medium' | 'Low';
      mitigation: string;
    }>;
    marketOpportunities: Array<{
      opportunity: string;
      score: number;
      timeline: string;
      potential: string;
    }>;
  };
  realTimeMetrics: {
    activeUsers: number;
    salesConversions: number;
    marketSentiment: number;
    competitivePosition: number;
  };
}

export default function AnalyticsDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string>("overview");
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch analytics data with offline fallback
  const { data: analyticsData, isLoading } = useQuery<AnalyticsData>({
    queryKey: [`/api/analytics/dashboard`, timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch analytics data');
      const data = await response.json();
      saveToCache(data);
      return data;
    },
    enabled: isOnline,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30000, // 30 seconds when online
  });

  // Mock data for demonstration
  const mockData: AnalyticsData = {
    performanceMetrics: {
      totalRevenue: 485000,
      revenueGrowth: 23.5,
      userGrowth: 18.2,
      conversionRate: 12.8,
      customerAcquisitionCost: 285,
      lifetimeValue: 3450,
      burnRate: 45000,
      runway: 18.5,
      activeUsers: 12470,
      churnRate: 5.2
    },
    predictiveModels: {
      revenueForecasting: [
        { month: "Jan", predicted: 42000, actual: 41200, confidence: 0.92 },
        { month: "Feb", predicted: 46000, actual: 47800, confidence: 0.89 },
        { month: "Mar", predicted: 52000, actual: 51200, confidence: 0.91 },
        { month: "Apr", predicted: 58000, confidence: 0.87 },
        { month: "May", predicted: 64000, confidence: 0.85 },
        { month: "Jun", predicted: 72000, confidence: 0.83 }
      ],
      userGrowthPrediction: [
        { month: "Jan", predicted: 10000, lowerBound: 9500, upperBound: 10500 },
        { month: "Feb", predicted: 11500, lowerBound: 10800, upperBound: 12200 },
        { month: "Mar", predicted: 13200, lowerBound: 12300, upperBound: 14100 },
        { month: "Apr", predicted: 15100, lowerBound: 13900, upperBound: 16300 },
        { month: "May", predicted: 17200, lowerBound: 15700, upperBound: 18700 },
        { month: "Jun", predicted: 19600, lowerBound: 17800, upperBound: 21400 }
      ],
      riskFactors: [
        { factor: "Market Saturation", likelihood: 65, impact: "High", mitigation: "Expand to new markets" },
        { factor: "Competition Increase", likelihood: 78, impact: "Medium", mitigation: "Strengthen USP" },
        { factor: "Economic Downturn", likelihood: 42, impact: "High", mitigation: "Diversify revenue streams" }
      ],
      marketOpportunities: [
        { opportunity: "AI Integration", score: 89, timeline: "3-6 months", potential: "$120K ARR" },
        { opportunity: "Mobile App", score: 76, timeline: "6-9 months", potential: "$80K ARR" },
        { opportunity: "Enterprise Sales", score: 94, timeline: "2-4 months", potential: "$200K ARR" }
      ]
    },
    realTimeMetrics: {
      activeUsers: 1247,
      salesConversions: 23,
      marketSentiment: 78,
      competitivePosition: 85
    }
  };

  const currentData = data || mockData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" data-testid="analytics-dashboard">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Analytics Hub
            </h1>
            <div className="flex items-center gap-2 ml-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <div className="flex items-center gap-1">
                  <WifiOff className="h-5 w-5 text-orange-500" />
                  <span className="text-xs text-orange-500">Offline</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            AI-powered insights with predictive analytics and real-time metrics
          </p>
        </div>

        {/* Real-time Metrics */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Metrics
            </CardTitle>
            <CardDescription>Live updates every 30 seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold" data-testid="metric-active-users">{currentData.realTimeMetrics.activeUsers}</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold" data-testid="metric-conversions">{currentData.realTimeMetrics.salesConversions}</div>
                <div className="text-xs text-muted-foreground">Conversions Today</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <Eye className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold" data-testid="metric-sentiment">{currentData.realTimeMetrics.marketSentiment}%</div>
                <div className="text-xs text-muted-foreground">Market Sentiment</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <Zap className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold" data-testid="metric-position">{currentData.realTimeMetrics.competitivePosition}%</div>
                <div className="text-xs text-muted-foreground">Competitive Position</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard
            title="Revenue"
            value={`$${(currentData.performanceMetrics.totalRevenue / 1000).toFixed(0)}K`}
            change={currentData.performanceMetrics.revenueGrowth}
            icon={DollarSign}
            trend="up"
            description="vs last month"
            color="green"
          />
          <MetricCard
            title="Active Users"
            value={formatNumber(currentData.performanceMetrics.activeUsers)}
            change={currentData.performanceMetrics.userGrowth}
            icon={Users}
            trend="up"
            description="growth"
            color="blue"
          />
          <MetricCard
            title="Conversion"
            value={`${currentData.performanceMetrics.conversionRate}%`}
            change={2.1}
            icon={Target}
            trend="up"
            description="rate"
            color="purple"
          />
          <MetricCard
            title="Churn Rate"
            value={`${currentData.performanceMetrics.churnRate}%`}
            change={-1.2}
            icon={AlertTriangle}
            trend="down"
            description="improved"
            color="orange"
          />
          <MetricCard
            title="LTV/CAC"
            value={`${(currentData.performanceMetrics.lifetimeValue / currentData.performanceMetrics.customerAcquisitionCost).toFixed(1)}x`}
            change={8.5}
            icon={BarChart3}
            trend="up"
            description="ratio"
            color="teal"
          />
          <MetricCard
            title="Runway"
            value={`${currentData.performanceMetrics.runway}mo`}
            change={-2.1}
            icon={Calendar}
            trend="down"
            description="remaining"
            color="red"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Predictions</span>
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Risk Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Opportunities</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Forecasting Chart */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Revenue Forecasting
                  </CardTitle>
                  <CardDescription>AI-predicted vs actual revenue trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={currentData.predictiveModels.revenueForecasting}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="predicted" stackId="1" stroke="#8A4EF5" fill="#8A4EF5" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="actual" stackId="2" stroke="#4ED0F5" fill="#4ED0F5" fillOpacity={0.8} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Growth Prediction */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Growth Prediction
                  </CardTitle>
                  <CardDescription>Predicted user acquisition with confidence bands</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={currentData.predictiveModels.userGrowthPrediction}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="upperBound" 
                        stroke="#E5E7EB" 
                        fill="#E5E7EB" 
                        fillOpacity={0.3} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="lowerBound" 
                        stroke="#E5E7EB" 
                        fill="#FFFFFF" 
                        fillOpacity={1} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#10B981" 
                        strokeWidth={2} 
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI-Powered Predictions
                </CardTitle>
                <CardDescription>Machine learning insights for business planning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-4">Revenue Confidence Levels</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={currentData.predictiveModels.revenueForecasting.map(d => ({ ...d, confidence: d.confidence * 100 }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value: number) => `${value.toFixed(0)}%`} />
                        <Bar dataKey="confidence" fill="#8A4EF5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-4">Prediction Accuracy</h4>
                    <div className="space-y-3">
                      {currentData.predictiveModels.revenueForecasting
                        .filter(d => d.actual)
                        .map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <span className="text-sm">{item.month}</span>
                            <div className="text-right">
                              <div className="text-sm font-semibold">
                                {((1 - Math.abs(item.predicted - (item.actual || 0)) / item.predicted) * 100).toFixed(1)}% accurate
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ${formatNumber(item.predicted)} vs ${item.actual ? formatNumber(item.actual) : 'N/A'}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Risk Assessment
                </CardTitle>
                <CardDescription>AI-powered risk analysis and mitigation strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentData.predictiveModels.riskFactors.map((factor, index) => (
                    <RiskFactorCard key={index} factor={factor} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Market Opportunities
                </CardTitle>
                <CardDescription>AI-identified growth opportunities and strategic recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentData.predictiveModels.marketOpportunities.map((opportunity, index) => (
                    <OpportunityCard key={index} opportunity={opportunity} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
```

### Design Thinking Analytics Dashboard
**File:** `client/src/components/design-thinking/enhanced/DTAnalyticsDashboard.tsx`

Specialized analytics dashboard for Design Thinking workflows.

```typescript
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Zap,
  Brain,
  Activity,
  Download,
  RefreshCw,
  Eye,
  Lightbulb,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface DTAnalytics {
  workflowId: string;
  effectivenessScore: {
    overall: number;
    dimensions: {
      userCentricity: number;
      ideaDiversity: number;
      iterationSpeed: number;
      teamCollaboration: number;
      outcomeQuality: number;
      processAdherence: number;
    };
  };
  participantMetrics: {
    totalParticipants: number;
    averageParticipationRate: number;
    averageContributionQuality: number;
    averageEngagementScore: number;
  };
  phaseMetrics: {
    phases: Array<{
      phase: string;
      duration: number;
      activities: number;
      participants: number;
      quality: number;
      progress: number;
    }>;
    overallProgress: number;
  };
  collaborationMetrics: {
    totalSessions: number;
    averageSessionDuration: number;
    collaborationQuality: number;
    realTimeUsage: number;
  };
  outcomeMetrics: {
    totalOutcomes: number;
    prototypeSuccessRate: number;
    testEffectiveness: number;
    businessImpact: {
      revenue: number;
      costReduction: number;
      customerSatisfaction: number;
    };
  };
  insights: Array<{
    id: string;
    content: string;
    importance: number;
    confidence: number;
    type: string;
  }>;
  recommendations: Array<{
    id: string;
    content: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }>;
}

export function DTAnalyticsDashboard({ workflowId, className }: DTAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<DTAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  useEffect(() => {
    loadAnalytics();
  }, [workflowId]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/dt/workflows/${workflowId}/analytics`);
      if (!response.ok) throw new Error('Failed to load analytics');
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600">{error}</p>
            <Button onClick={loadAnalytics} size="sm" className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadAnalytics}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? '−' : '+'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Overview Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(analytics.effectivenessScore.overall)}
              </div>
              <div className="text-xs text-blue-800">Effectiveness</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analytics.participantMetrics.totalParticipants}
              </div>
              <div className="text-xs text-green-800">Participants</div>
            </div>
          </div>

          {/* Effectiveness Dimensions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Effectiveness Dimensions</h3>
            <div className="space-y-2">
              {Object.entries(analytics.effectivenessScore.dimensions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress value={value * 100} className="w-16 h-2" />
                    <span className={`text-xs font-medium ${getScoreColor(value)}`}>
                      {formatPercentage(value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase Progress */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Phase Progress</h3>
            <div className="space-y-2">
              {analytics.phaseMetrics.phases.map((phase) => (
                <div key={phase.phase} className="flex items-center justify-between">
                  <span className="text-xs capitalize">{phase.phase}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={phase.progress * 100} className="w-16 h-2" />
                    <span className="text-xs text-gray-600">
                      {formatPercentage(phase.progress)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          {analytics.insights.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Key Insights</h3>
              <div className="space-y-2">
                {analytics.insights.slice(0, 3).map((insight) => (
                  <div
                    key={insight.id}
                    className="p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-medium">
                        {insight.type}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getScoreBgColor(insight.confidence)}`}
                      >
                        {formatPercentage(insight.confidence)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-700">{insight.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analytics.recommendations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Recommendations</h3>
              <div className="space-y-2">
                {analytics.recommendations.slice(0, 2).map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="p-2 bg-yellow-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="w-3 h-3 text-yellow-600" />
                      <span className="text-xs font-medium">
                        {recommendation.category}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getPriorityColor(recommendation.priority)}`}
                      >
                        {recommendation.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-700">{recommendation.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* Export analytics */}}
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* View detailed analytics */}}
                className="flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                Details
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
```

---

## Backend Services

### Design Thinking Analytics Service
**File:** `server/services/dt-analytics-service.ts`

Comprehensive analytics service for Design Thinking workflows.

```typescript
import { DatabaseService } from './database-service';
import { DTAnalyticsEngine } from './dt-analytics-engine';
import { InsightTracker } from './insight-tracker';
import { ROICalculator } from './roi-calculator';
import { BenchmarkService } from './benchmark-service';

export class DTAnalyticsService {
  private db: DatabaseService;
  private analyticsEngine: DTAnalyticsEngine;
  private insightTracker: InsightTracker;
  private roiCalculator: ROICalculator;
  private benchmarkService: BenchmarkService;

  constructor() {
    this.db = new DatabaseService();
    this.analyticsEngine = new DTAnalyticsEngine();
    this.insightTracker = new InsightTracker();
    this.roiCalculator = new ROICalculator();
    this.benchmarkService = new BenchmarkService();
  }

  async getComprehensiveAnalytics(workflowId: string): Promise<ComprehensiveAnalytics> {
    try {
      const workflow = await this.db.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const [
        effectivenessScore,
        insightMap,
        roiAnalysis,
        benchmarkComparison,
        participantMetrics,
        phaseMetrics,
        collaborationMetrics,
        outcomeMetrics
      ] = await Promise.all([
        this.analyticsEngine.calculateEffectivenessScore(workflowId),
        this.analyticsEngine.generateInsightMap(workflowId),
        this.roiCalculator.calculateROI(workflow),
        this.benchmarkService.compareToBenchmarks(workflow),
        this.getParticipantMetrics(workflowId),
        this.getPhaseMetrics(workflowId),
        this.getCollaborationMetrics(workflowId),
        this.getOutcomeMetrics(workflowId)
      ]);

      return {
        workflowId,
        effectivenessScore,
        insightMap,
        roiAnalysis,
        benchmarkComparison,
        participantMetrics,
        phaseMetrics,
        collaborationMetrics,
        outcomeMetrics,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error getting comprehensive analytics:', error);
      throw error;
    }
  }

  async calculateEffectivenessScore(workflowId: string): Promise<EffectivenessScore> {
    return await this.analyticsEngine.calculateEffectivenessScore(workflowId);
  }

  async generateInsightMap(workflowId: string): Promise<InsightMap> {
    return await this.analyticsEngine.generateInsightMap(workflowId);
  }

  async trackInsightEvolution(insightId: string): Promise<InsightEvolution> {
    return await this.insightTracker.trackEvolution(insightId);
  }

  async calculateROI(workflowId: string): Promise<ROIAnalysis> {
    const workflow = await this.db.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    return await this.roiCalculator.calculateROI(workflow);
  }

  async compareToBenchmarks(workflowId: string): Promise<BenchmarkComparison> {
    const workflow = await this.db.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    return await this.benchmarkService.compareToBenchmarks(workflow);
  }

  async generatePredictiveAnalytics(workflowId: string): Promise<PredictiveAnalytics> {
    const workflow = await this.db.getWorkflow(workflowId);
    const historicalData = await this.db.getHistoricalData(workflowId);
    const similarWorkflows = await this.db.getSimilarWorkflows(workflow);

    return {
      successProbability: await this.predictSuccessProbability(workflow, historicalData),
      estimatedCompletionTime: await this.predictCompletionTime(workflow, historicalData),
      resourceRequirements: await this.predictResourceRequirements(workflow, historicalData),
      riskFactors: await this.identifyRiskFactors(workflow, historicalData),
      opportunityAreas: await this.identifyOpportunityAreas(workflow, similarWorkflows),
      recommendations: await this.generatePredictiveRecommendations(workflow, historicalData)
    };
  }

  async exportAnalytics(workflowId: string, format: 'json' | 'csv' | 'pdf'): Promise<ExportData> {
    const analytics = await this.getComprehensiveAnalytics(workflowId);
    const predictive = await this.generatePredictiveAnalytics(workflowId);
    const insights = await this.generateInsightsAndRecommendations(workflowId);

    const exportData = {
      workflowId,
      analytics,
      predictive,
      insights,
      exportedAt: new Date()
    };

    switch (format) {
      case 'json':
        return {
          format: 'json',
          data: JSON.stringify(exportData, null, 2),
          filename: `dt-analytics-${workflowId}.json`
        };
      
      case 'csv':
        return {
          format: 'csv',
          data: await this.convertToCSV(exportData),
          filename: `dt-analytics-${workflowId}.csv`
        };
      
      case 'pdf':
        return {
          format: 'pdf',
          data: await this.generatePDF(exportData),
          filename: `dt-analytics-${workflowId}.pdf`
        };
      
      default:
        throw new Error('Unsupported export format');
    }
  }

  // Helper methods
  private calculateParticipationRate(participantId: string, activities: Activity[]): number {
    const participantActivities = activities.filter(a => a.participantId === participantId);
    const totalActivities = activities.length;
    return totalActivities > 0 ? participantActivities.length / totalActivities : 0;
  }

  private calculateContributionQuality(participantId: string, activities: Activity[]): number {
    const participantActivities = activities.filter(a => a.participantId === participantId);
    if (participantActivities.length === 0) return 0;

    const qualityScores = participantActivities.map(a => a.qualityScore || 0);
    return this.calculateAverage(qualityScores);
  }

  private calculateEngagementScore(participantId: string, activities: Activity[]): number {
    const participantActivities = activities.filter(a => a.participantId === participantId);
    if (participantActivities.length === 0) return 0;

    const engagementScores = participantActivities.map(a => a.engagementScore || 0);
    return this.calculateAverage(engagementScores);
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }
}
```

### Design Thinking Analytics Engine
**File:** `server/services/dt-analytics-engine.ts`

Core analytics engine for Design Thinking effectiveness measurement.

```typescript
import { DatabaseService } from './database-service';

export class DTAnalyticsEngine {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  async calculateEffectivenessScore(workflowId: string): Promise<EffectivenessScore> {
    try {
      const workflow = await this.db.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const [
        userCentricity,
        ideaDiversity,
        iterationSpeed,
        teamCollaboration,
        outcomeQuality,
        processAdherence
      ] = await Promise.all([
        this.measureUserCentricity(workflowId),
        this.measureIdeaDiversity(workflowId),
        this.measureIterationSpeed(workflowId),
        this.measureTeamCollaboration(workflowId),
        this.measureOutcomeQuality(workflowId),
        this.measureProcessAdherence(workflowId)
      ]);

      const overall = this.calculateOverallScore({
        userCentricity,
        ideaDiversity,
        iterationSpeed,
        teamCollaboration,
        outcomeQuality,
        processAdherence
      });

      const recommendations = await this.generateRecommendations(workflowId, {
        userCentricity,
        ideaDiversity,
        iterationSpeed,
        teamCollaboration,
        outcomeQuality,
        processAdherence
      });

      return {
        overall,
        dimensions: {
          userCentricity,
          ideaDiversity,
          iterationSpeed,
          teamCollaboration,
          outcomeQuality,
          processAdherence
        },
        recommendations,
        benchmarks: await this.compareToBenchmarks(workflowId),
        calculatedAt: new Date()
      };
    } catch (error) {
      console.error('Error calculating effectiveness score:', error);
      throw new Error('Failed to calculate effectiveness score');
    }
  }

  async generateInsightMap(workflowId: string): Promise<InsightMap> {
    try {
      const insights = await this.getWorkflowInsights(workflowId);
      const relationships = await this.identifyRelationships(insights);
      const clusters = await this.clusterInsights(insights);
      const criticalPath = await this.identifyCriticalPath(insights);

      return {
        nodes: insights.map(insight => ({
          id: insight.id,
          label: insight.content,
          phase: insight.phase,
          importance: insight.importance,
          connections: insight.connections || []
        })),
        edges: relationships,
        clusters,
        criticalPath,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating insight map:', error);
      throw new Error('Failed to generate insight map');
    }
  }

  async compareToBenchmarks(workflowId: string): Promise<BenchmarkComparison> {
    try {
      const workflow = await this.db.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const benchmarks = await this.findBenchmarks(workflow);
      const comparison = await this.performComparison(workflow, benchmarks);

      return {
        industry: workflow.industry || 'general',
        similarProjects: benchmarks.length,
        performanceRanking: comparison.ranking,
        keyDifferences: comparison.differences,
        improvementOpportunities: comparison.opportunities,
        comparedAt: new Date()
      };
    } catch (error) {
      console.error('Error comparing to benchmarks:', error);
      throw new Error('Failed to compare to benchmarks');
    }
  }

  private calculateOverallScore(dimensions: EffectivenessDimensions): number {
    const weights = {
      userCentricity: 0.2,
      ideaDiversity: 0.15,
      iterationSpeed: 0.15,
      teamCollaboration: 0.2,
      outcomeQuality: 0.2,
      processAdherence: 0.1
    };

    return Object.entries(dimensions).reduce((sum, [key, value]) => {
      return sum + (value * (weights[key as keyof typeof weights] || 0));
    }, 0);
  }

  private async generateRecommendations(workflowId: string, dimensions: EffectivenessDimensions): Promise<string[]> {
    const recommendations: string[] = [];

    if (dimensions.userCentricity < 0.6) {
      recommendations.push('Increase user research depth and persona development');
    }

    if (dimensions.ideaDiversity < 0.6) {
      recommendations.push('Encourage more diverse idea generation techniques');
    }

    if (dimensions.iterationSpeed < 0.6) {
      recommendations.push('Optimize iteration cycles and feedback loops');
    }

    if (dimensions.teamCollaboration < 0.6) {
      recommendations.push('Improve team collaboration and communication');
    }

    if (dimensions.outcomeQuality < 0.6) {
      recommendations.push('Focus on higher quality deliverables and outcomes');
    }

    if (dimensions.processAdherence < 0.6) {
      recommendations.push('Better adherence to Design Thinking methodology');
    }

    return recommendations;
  }

  private async getWorkflowInsights(workflowId: string): Promise<Insight[]> {
    return await this.db.getWorkflowInsights(workflowId);
  }

  private async identifyRelationships(insights: Insight[]): Promise<InsightEdge[]> {
    const edges: InsightEdge[] = [];

    for (let i = 0; i < insights.length; i++) {
      for (let j = i + 1; j < insights.length; j++) {
        const similarity = await this.calculateInsightSimilarity(insights[i], insights[j]);
        if (similarity > 0.5) {
          edges.push({
            from: insights[i].id,
            to: insights[j].id,
            type: 'related',
            strength: similarity
          });
        }
      }
    }

    return edges;
  }

  private async clusterInsights(insights: Insight[]): Promise<InsightCluster[]> {
    const clusters: InsightCluster[] = [];
    const processed = new Set<string>();

    for (const insight of insights) {
      if (processed.has(insight.id)) continue;

      const cluster = await this.createInsightCluster(insight, insights);
      clusters.push(cluster);
      
      cluster.insights.forEach(id => processed.add(id));
    }

    return clusters;
  }

  private async identifyCriticalPath(insights: Insight[]): Promise<string[]> {
    const sortedInsights = insights.sort((a, b) => (b.importance || 0) - (a.importance || 0));
    return sortedInsights.slice(0, 5).map(insight => insight.id);
  }

  private async calculateInsightSimilarity(insight1: Insight, insight2: Insight): Promise<number> {
    const contentSimilarity = this.calculateContentSimilarity(insight1.content, insight2.content);
    const phaseSimilarity = insight1.phase === insight2.phase ? 1 : 0;
    
    return (contentSimilarity + phaseSimilarity) / 2;
  }

  private calculateContentSimilarity(content1: string, content2: string): number {
    const words1 = content1.toLowerCase().split(/\s+/);
    const words2 = content2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  private async createInsightCluster(seedInsight: Insight, allInsights: Insight[]): Promise<InsightCluster> {
    const cluster: InsightCluster = {
      id: this.generateId(),
      name: `Cluster ${seedInsight.phase}`,
      insights: [seedInsight.id],
      theme: seedInsight.phase,
      confidence: 0.8
    };

    for (const insight of allInsights) {
      if (insight.id === seedInsight.id) continue;
      
      const similarity = await this.calculateInsightSimilarity(seedInsight, insight);
      if (similarity > 0.6) {
        cluster.insights.push(insight.id);
      }
    }

    return cluster;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Placeholder methods for database operations
  private async measureUserCentricity(workflowId: string): Promise<number> { return 0.8; }
  private async measureIdeaDiversity(workflowId: string): Promise<number> { return 0.6; }
  private async measureIterationSpeed(workflowId: string): Promise<number> { return 0.5; }
  private async measureTeamCollaboration(workflowId: string): Promise<number> { return 0.7; }
  private async measureOutcomeQuality(workflowId: string): Promise<number> { return 0.8; }
  private async measureProcessAdherence(workflowId: string): Promise<number> { return 0.6; }
  private async findBenchmarks(workflow: Workflow): Promise<Benchmark[]> { return []; }
  private async performComparison(workflow: Workflow, benchmarks: Benchmark[]): Promise<ComparisonResult> {
    return { ranking: 0.5, differences: [], opportunities: [] };
  }
}
```

### Infographic Analytics Service
**File:** `server/infographic-analytics-service.ts`

Analytics service for tracking infographic usage and performance.

```typescript
import { InfographicData } from './ai-infographic-service';

export interface InfographicAnalytics {
  id: string;
  infographicId: string;
  userId: string;
  event: 'created' | 'viewed' | 'exported' | 'shared' | 'enhanced' | 'deleted';
  timestamp: Date;
  metadata: {
    format?: string;
    enhancementType?: string;
    shareMethod?: string;
    viewDuration?: number;
    userAgent?: string;
    ipAddress?: string;
  };
}

export interface InfographicUsageStats {
  totalInfographics: number;
  totalViews: number;
  totalExports: number;
  totalShares: number;
  averageViewsPerInfographic: number;
  mostPopularFormats: Array<{ format: string; count: number }>;
  mostUsedTemplates: Array<{ template: string; count: number }>;
  userEngagement: {
    averageViewDuration: number;
    bounceRate: number;
    returnRate: number;
  };
  timeBasedStats: {
    daily: Array<{ date: string; count: number }>;
    weekly: Array<{ week: string; count: number }>;
    monthly: Array<{ month: string; count: number }>;
  };
}

export class InfographicAnalyticsService {
  private analytics: InfographicAnalytics[] = [];
  private infographics: Map<string, InfographicData> = new Map();

  async trackEvent(
    infographicId: string,
    userId: string,
    event: InfographicAnalytics['event'],
    metadata: Partial<InfographicAnalytics['metadata']> = {}
  ): Promise<void> {
    const analytics: InfographicAnalytics = {
      id: `analytics-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      infographicId,
      userId,
      event,
      timestamp: new Date(),
      metadata: {
        ...metadata,
        userAgent: metadata.userAgent || 'unknown',
        ipAddress: metadata.ipAddress || 'unknown'
      }
    };

    this.analytics.push(analytics);
    
    if (this.infographics.has(infographicId)) {
      const infographic = this.infographics.get(infographicId)!;
      infographic.metadata.usage[event === 'viewed' ? 'views' : 
                                 event === 'exported' ? 'exports' : 
                                 event === 'shared' ? 'shares' : 'views']++;
    }
  }

  async registerInfographic(infographic: InfographicData): Promise<void> {
    this.infographics.set(infographic.id, infographic);
    await this.trackEvent(infographic.id, infographic.metadata.userId, 'created');
  }

  async getUsageStats(timeRange?: { start: Date; end: Date }): Promise<InfographicUsageStats> {
    const filteredAnalytics = timeRange 
      ? this.analytics.filter(a => a.timestamp >= timeRange.start && a.timestamp <= timeRange.end)
      : this.analytics;

    const totalInfographics = this.infographics.size;
    const totalViews = filteredAnalytics.filter(a => a.event === 'viewed').length;
    const totalExports = filteredAnalytics.filter(a => a.event === 'exported').length;
    const totalShares = filteredAnalytics.filter(a => a.event === 'shared').length;

    const formatCounts = new Map<string, number>();
    filteredAnalytics
      .filter(a => a.event === 'exported' && a.metadata.format)
      .forEach(a => {
        const format = a.metadata.format!;
        formatCounts.set(format, (formatCounts.get(format) || 0) + 1);
      });

    const mostPopularFormats = Array.from(formatCounts.entries())
      .map(([format, count]) => ({ format, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const templateCounts = new Map<string, number>();
    this.infographics.forEach(infographic => {
      const template = infographic.metadata.category;
      templateCounts.set(template, (templateCounts.get(template) || 0) + 1);
    });

    const mostUsedTemplates = Array.from(templateCounts.entries())
      .map(([template, count]) => ({ template, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const viewEvents = filteredAnalytics.filter(a => a.event === 'viewed');
    const averageViewDuration = viewEvents.reduce((sum, event) => 
      sum + (event.metadata.viewDuration || 0), 0) / viewEvents.length || 0;

    const dailyStats = this.calculateTimeBasedStats(filteredAnalytics, 'daily');
    const weeklyStats = this.calculateTimeBasedStats(filteredAnalytics, 'weekly');
    const monthlyStats = this.calculateTimeBasedStats(filteredAnalytics, 'monthly');

    return {
      totalInfographics,
      totalViews,
      totalExports,
      totalShares,
      averageViewsPerInfographic: totalInfographics > 0 ? totalViews / totalInfographics : 0,
      mostPopularFormats,
      mostUsedTemplates,
      userEngagement: {
        averageViewDuration,
        bounceRate: 0.3,
        returnRate: 0.7
      },
      timeBasedStats: {
        daily: dailyStats,
        weekly: weeklyStats,
        monthly: monthlyStats
      }
    };
  }

  async getUserStats(userId: string): Promise<UserInfographicStats> {
    const userAnalytics = this.analytics.filter(a => a.userId === userId);
    const userInfographics = Array.from(this.infographics.values())
      .filter(i => i.metadata.userId === userId);

    const totalCreated = userInfographics.length;
    const totalViews = userAnalytics.filter(a => a.event === 'viewed').length;
    const totalExports = userAnalytics.filter(a => a.event === 'exported').length;
    const totalShares = userAnalytics.filter(a => a.event === 'shared').length;

    const templateCounts = new Map<string, number>();
    userInfographics.forEach(infographic => {
      const template = infographic.metadata.category;
      templateCounts.set(template, (templateCounts.get(template) || 0) + 1);
    });

    const favoriteTemplates = Array.from(templateCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([template]) => template);

    const formatCounts = new Map<string, number>();
    userAnalytics
      .filter(a => a.event === 'exported' && a.metadata.format)
      .forEach(a => {
        const format = a.metadata.format!;
        formatCounts.set(format, (formatCounts.get(format) || 0) + 1);
      });

    const mostUsedFormats = Array.from(formatCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([format]) => format);

    const engagementScore = this.calculateEngagementScore(userAnalytics, userInfographics);

    return {
      userId,
      totalCreated,
      totalViews,
      totalExports,
      totalShares,
      favoriteTemplates,
      mostUsedFormats,
      averageCreationTime: 0,
      lastActivity: userAnalytics.length > 0 
        ? new Date(Math.max(...userAnalytics.map(a => a.timestamp.getTime())))
        : new Date(),
      engagementScore
    };
  }

  private calculateTimeBasedStats(
    analytics: InfographicAnalytics[], 
    granularity: 'daily' | 'weekly' | 'monthly'
  ): Array<{ date: string; count: number }> {
    const stats = new Map<string, number>();

    analytics.forEach(analytics => {
      let key: string;
      const date = new Date(analytics.timestamp);

      switch (granularity) {
        case 'daily':
          key = date.toISOString().split('T')[0];
          break;
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }

      stats.set(key, (stats.get(key) || 0) + 1);
    });

    return Array.from(stats.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private calculateEngagementScore(
    userAnalytics: InfographicAnalytics[],
    userInfographics: InfographicData[]
  ): number {
    const views = userAnalytics.filter(a => a.event === 'viewed').length;
    const exports = userAnalytics.filter(a => a.event === 'exported').length;
    const shares = userAnalytics.filter(a => a.event === 'shared').length;
    const enhancements = userAnalytics.filter(a => a.event === 'enhanced').length;

    const score = (views * 1) + (exports * 3) + (shares * 5) + (enhancements * 2);
    const maxPossibleScore = userInfographics.length * 10;

    return maxPossibleScore > 0 ? Math.min(score / maxPossibleScore, 1) : 0;
  }
}
```

---

## Types & Interfaces

### Analytics Types
**File:** `client/src/features/documents/types/analytics.types.ts`

```typescript
export interface UsagePattern {
  id: string;
  userId: string;
  documentId: string;
  action: string;
  timestamp: Date;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface CollaborationMetrics {
  activeCollaborators: number;
  commentsPerDocument: number;
  suggestionsPerDocument: number;
  averageSessionTime: number;
  realTimeEdits: number;
  mentionsPerDocument: number;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  cachePerformance: number;
  apiResponseTime: number;
  errorRate: number;
}

export interface MetricValue {
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface DocumentAnalytics {
  documentId: string;
  views: number;
  edits: number;
  comments: number;
  shares: number;
  lastAccessed: Date;
  averageSessionTime: number;
  userEngagement: number;
}

export interface UserAnalytics {
  userId: string;
  documentsCreated: number;
  documentsEdited: number;
  commentsMade: number;
  timeSpent: number;
  lastActive: Date;
  preferredFeatures: string[];
}

export interface AnalyticsDashboard {
  usagePatterns: UsagePattern[];
  collaborationMetrics: CollaborationMetrics;
  performanceMetrics: PerformanceMetrics;
  documentAnalytics: DocumentAnalytics[];
  userAnalytics: UserAnalytics[];
  totalUsers: number;
  totalDocuments: number;
  averageSessionTime: number;
  topFeatures: string[];
}
```

---

## Hooks & Utilities

### Agent Analytics Hook
**File:** `client/src/hooks/ai/useAgentAnalytics.ts`

```typescript
import { useState, useEffect } from 'react';

interface AgentAnalytics {
  totalConversations: number;
  totalMessages: number;
  averageResponseTime: number;
  satisfactionScore: number;
  topTopics: Array<{
    topic: string;
    count: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: Date;
  }>;
  usageStats: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export function useAgentAnalytics() {
  const [analytics, setAnalytics] = useState<AgentAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analytics');
      
      if (!response.ok) {
        throw new Error('Failed to load analytics');
      }

      const data = await response.json();
      setAnalytics({
        ...data,
        recentActivities: data.recentActivities?.map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        })) || []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      console.error('Error loading agent analytics:', err);
      
      setAnalytics({
        totalConversations: 0,
        totalMessages: 0,
        averageResponseTime: 0,
        satisfactionScore: 0,
        topTopics: [],
        recentActivities: [],
        usageStats: {
          today: 0,
          thisWeek: 0,
          thisMonth: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const trackInteraction = async (type: string, metadata?: Record<string, any>) => {
    try {
      await fetch('/api/ai/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, metadata, timestamp: new Date() })
      });
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  };

  const provideFeedback = async (messageId: string, rating: number, comment?: string) => {
    try {
      await fetch('/api/ai/analytics/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, rating, comment })
      });
      
      await loadAnalytics();
    } catch (err) {
      console.error('Failed to provide feedback:', err);
      throw err;
    }
  };

  return {
    analytics,
    isLoading,
    error,
    loadAnalytics,
    trackInteraction,
    provideFeedback
  };
}
```

### Dashboard Performance Hook
**File:** `client/src/components/dashboard/hooks/useDashboardPerformance.ts`

```typescript
import { useCallback, useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  dataLoadTime: number;
  widgetCount: number;
  memoryUsage?: number;
  errorCount: number;
}

interface PerformanceThresholds {
  maxRenderTime: number;
  maxDataLoadTime: number;
  maxWidgetCount: number;
  maxMemoryUsage: number;
}

const defaultThresholds: PerformanceThresholds = {
  maxRenderTime: 100,
  maxDataLoadTime: 1000,
  maxWidgetCount: 20,
  maxMemoryUsage: 100,
};

export const useDashboardPerformance = (thresholds = defaultThresholds) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    dataLoadTime: 0,
    widgetCount: 0,
    errorCount: 0,
  });

  const [alerts, setAlerts] = useState<string[]>([]);
  const renderStartTime = useRef<number>(0);
  const dataLoadStartTime = useRef<number>(0);

  const startRenderMeasurement = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderMeasurement = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;
    setMetrics(prev => ({ ...prev, renderTime }));
    
    if (renderTime > thresholds.maxRenderTime) {
      setAlerts(prev => [...prev, `Render time exceeded threshold: ${renderTime.toFixed(2)}ms`]);
    }
  }, [thresholds.maxRenderTime]);

  const startDataLoadMeasurement = useCallback(() => {
    dataLoadStartTime.current = performance.now();
  }, []);

  const endDataLoadMeasurement = useCallback(() => {
    const dataLoadTime = performance.now() - dataLoadStartTime.current;
    setMetrics(prev => ({ ...prev, dataLoadTime }));
    
    if (dataLoadTime > thresholds.maxDataLoadTime) {
      setAlerts(prev => [...prev, `Data load time exceeded threshold: ${dataLoadTime.toFixed(2)}ms`]);
    }
  }, [thresholds.maxDataLoadTime]);

  const updateWidgetCount = useCallback((count: number) => {
    setMetrics(prev => ({ ...prev, widgetCount: count }));
    
    if (count > thresholds.maxWidgetCount) {
      setAlerts(prev => [...prev, `Widget count exceeded threshold: ${count}`]);
    }
  }, [thresholds.maxWidgetCount]);

  const incrementErrorCount = useCallback(() => {
    setMetrics(prev => ({ ...prev, errorCount: prev.errorCount + 1 }));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  useEffect(() => {
    if ('memory' in performance) {
      const updateMemoryUsage = () => {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / 1024 / 1024;
        setMetrics(prev => ({ ...prev, memoryUsage }));
        
        if (memoryUsage > thresholds.maxMemoryUsage) {
          setAlerts(prev => [...prev, `Memory usage exceeded threshold: ${memoryUsage.toFixed(2)}MB`]);
        }
      };

      updateMemoryUsage();
      const interval = setInterval(updateMemoryUsage, 5000);
      return () => clearInterval(interval);
    }
  }, [thresholds.maxMemoryUsage]);

  return {
    metrics,
    alerts,
    startRenderMeasurement,
    endRenderMeasurement,
    startDataLoadMeasurement,
    endDataLoadMeasurement,
    updateWidgetCount,
    incrementErrorCount,
    clearAlerts,
  };
};

export const useWidgetPerformance = (widgetId: string) => {
  const [renderTime, setRenderTime] = useState(0);
  const [dataFetchTime, setDataFetchTime] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const renderStartTime = useRef<number>(0);
  const dataFetchStartTime = useRef<number>(0);

  const startRender = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    const time = performance.now() - renderStartTime.current;
    setRenderTime(time);
  }, []);

  const startDataFetch = useCallback(() => {
    dataFetchStartTime.current = performance.now();
  }, []);

  const endDataFetch = useCallback(() => {
    const time = performance.now() - dataFetchStartTime.current;
    setDataFetchTime(time);
  }, []);

  const incrementError = useCallback(() => {
    setErrorCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (renderTime > 50) {
      console.warn(`Widget ${widgetId} slow render: ${renderTime.toFixed(2)}ms`);
    }
  }, [widgetId, renderTime]);

  useEffect(() => {
    if (dataFetchTime > 500) {
      console.warn(`Widget ${widgetId} slow data fetch: ${dataFetchTime.toFixed(2)}ms`);
    }
  }, [widgetId, dataFetchTime]);

  return {
    renderTime,
    dataFetchTime,
    errorCount,
    startRender,
    endRender,
    startDataFetch,
    endDataFetch,
    incrementError,
  };
};
```

---

## API Endpoints

### Analytics Dashboard API
```typescript
// GET /api/analytics/dashboard?timeRange=30d
// Returns comprehensive analytics data for the main dashboard

// POST /api/analytics/track
// Track user interactions and events
{
  "type": "page_view",
  "metadata": {
    "page": "analytics-dashboard",
    "duration": 120000
  },
  "timestamp": "2024-01-01T00:00:00Z"
}

// GET /api/dt/workflows/{workflowId}/analytics
// Returns Design Thinking workflow analytics

// POST /api/dt/workflows/{workflowId}/analytics/export
// Export analytics data in various formats
{
  "format": "json" | "csv" | "pdf"
}

// GET /api/infographics/analytics/stats
// Returns infographic usage statistics

// POST /api/infographics/{id}/track
// Track infographic events
{
  "event": "viewed" | "exported" | "shared",
  "metadata": {
    "format": "png",
    "viewDuration": 45000
  }
}

// GET /api/ai/analytics
// Returns AI agent analytics

// POST /api/ai/analytics/track
// Track AI agent interactions
{
  "type": "conversation_start",
  "metadata": {
    "topic": "design_thinking",
    "userType": "entrepreneur"
  }
}
```

---

## Usage Examples

### Basic Analytics Dashboard Usage
```typescript
import AnalyticsDashboard from '@/pages/analytics-dashboard';

function App() {
  return (
    <div className="App">
      <AnalyticsDashboard />
    </div>
  );
}
```

### Design Thinking Analytics Integration
```typescript
import { DTAnalyticsDashboard } from '@/components/design-thinking/enhanced/DTAnalyticsDashboard';

function WorkflowPage({ workflowId }: { workflowId: string }) {
  return (
    <div className="workflow-page">
      <DTAnalyticsDashboard 
        workflowId={workflowId}
        className="mb-6"
      />
    </div>
  );
}
```

### Agent Analytics Tracking
```typescript
import { useAgentAnalytics } from '@/hooks/ai/useAgentAnalytics';

function ChatInterface() {
  const { analytics, trackInteraction, provideFeedback } = useAgentAnalytics();

  const handleMessageSend = async (message: string) => {
    await trackInteraction('message_sent', {
      messageLength: message.length,
      timestamp: new Date()
    });
  };

  const handleFeedback = async (messageId: string, rating: number) => {
    await provideFeedback(messageId, rating, 'Great response!');
  };

  return (
    <div>
      <div>Total Conversations: {analytics?.totalConversations}</div>
      <div>Satisfaction Score: {analytics?.satisfactionScore}</div>
    </div>
  );
}
```

### Performance Monitoring
```typescript
import { useDashboardPerformance, useWidgetPerformance } from '@/components/dashboard/hooks/useDashboardPerformance';

function Dashboard() {
  const { metrics, alerts, startRenderMeasurement, endRenderMeasurement } = useDashboardPerformance();
  
  useEffect(() => {
    startRenderMeasurement();
    // Dashboard rendering logic
    endRenderMeasurement();
  }, []);

  return (
    <div>
      <div>Render Time: {metrics.renderTime}ms</div>
      <div>Memory Usage: {metrics.memoryUsage}MB</div>
      {alerts.map((alert, index) => (
        <div key={index} className="alert">{alert}</div>
      ))}
    </div>
  );
}

function Widget({ widgetId }: { widgetId: string }) {
  const { renderTime, startRender, endRender } = useWidgetPerformance(widgetId);
  
  useEffect(() => {
    startRender();
    // Widget rendering logic
    endRender();
  }, []);

  return <div>Widget render time: {renderTime}ms</div>;
}
```

---

## Key Features

### Real-time Analytics
- Live metrics updates every 30 seconds
- Offline support with cached data
- Real-time notifications and alerts

### Predictive Analytics
- AI-powered revenue forecasting
- User growth predictions with confidence bands
- Risk factor analysis and mitigation strategies
- Market opportunity identification

### Performance Monitoring
- Dashboard performance tracking
- Widget-level performance metrics
- Memory usage monitoring
- Error tracking and alerting

### Export Capabilities
- JSON, CSV, and PDF export formats
- Comprehensive analytics reports
- Customizable time ranges
- Batch export functionality

### Design Thinking Analytics
- Effectiveness scoring across 6 dimensions
- Insight mapping and clustering
- ROI calculation and benchmarking
- Participant engagement metrics

### Infographic Analytics
- Usage pattern tracking
- Format popularity analysis
- User engagement scoring
- Performance insights and recommendations

This comprehensive Analytics Hub provides deep insights into platform usage, user behavior, and business performance across all major features of the StartupsAI platform.
