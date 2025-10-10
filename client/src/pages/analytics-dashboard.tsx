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

interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
  read: boolean;
}

const COLORS = ['#8A4EF5', '#4ED0F5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Safe number formatting helpers to avoid calling toLocaleString on undefined
const formatNumber = (n?: number) => (typeof n === 'number' && isFinite(n) ? n.toLocaleString() : '0');
const formatPercent = (n?: number) => (typeof n === 'number' && isFinite(n) ? `${n}%` : '0%');

export default function AnalyticsDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string>("overview");
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Cache key for offline support
  const cacheKey = `analytics-dashboard-${timeRange}`;

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

  // Load cached data for offline support
  const loadCachedData = (): AnalyticsData | null => {
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  // Save data to cache
  const saveToCache = (data: AnalyticsData) => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(`${cacheKey}-timestamp`, Date.now().toString());
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  };

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

  // Use cached data when offline
  const data = analyticsData || loadCachedData();

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

  // Notification management
  const addNotification = (notification: Omit<NotificationData, 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
    setUnreadCount(prev => prev + 1);
  };

  // Generate notifications based on metrics
  useEffect(() => {
    if (!currentData?.performanceMetrics) return;

    const { performanceMetrics } = currentData;

    // Check for important updates
    if (performanceMetrics.revenueGrowth > 25) {
      addNotification({
        title: "Revenue Milestone!",
        message: `Revenue growth exceeded 25% (${performanceMetrics.revenueGrowth}%)`,
        type: 'success',
        timestamp: new Date(),
        read: false
      });
    }

    if (performanceMetrics.churnRate > 7) {
      addNotification({
        title: "High Churn Alert",
        message: `Customer churn rate is at ${performanceMetrics.churnRate}%`,
        type: 'warning',
        timestamp: new Date(),
        read: false
      });
    }

    if (performanceMetrics.runway < 12) {
      addNotification({
        title: "Low Runway Warning",
        message: `Only ${performanceMetrics.runway} months of runway remaining`,
        type: 'error',
        timestamp: new Date(),
        read: false
      });
    }
  }, [currentData?.performanceMetrics]);

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend, 
    description,
    color = "blue"
  }: {
    title: string;
    value: string | number;
    change: number;
    icon: any;
    trend: "up" | "down";
    description: string;
    color?: string;
  }) => (
    <Card className="glass-card hover:shadow-lg transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-500`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          {trend === 'up' ? (
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(change)}%
          </span>
          <span className="ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  );

  const NotificationBell = () => (
    <div className="relative">
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
    </div>
  );

  const RiskFactorCard = ({ factor }: { factor: typeof currentData.predictiveModels.riskFactors[0] }) => (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{factor.factor}</CardTitle>
          <Badge variant={factor.likelihood > 70 ? "destructive" : factor.likelihood > 40 ? "secondary" : "default"}>
            {factor.likelihood}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Impact:</span>
            <span className={factor.impact === "High" ? "text-red-500" : factor.impact === "Medium" ? "text-yellow-500" : "text-green-500"}>
              {factor.impact}
            </span>
          </div>
          <Progress value={factor.likelihood} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">{factor.mitigation}</p>
        </div>
      </CardContent>
    </Card>
  );

  const OpportunityCard = ({ opportunity }: { opportunity: typeof currentData.predictiveModels.marketOpportunities[0] }) => (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{opportunity.opportunity}</CardTitle>
          <Badge variant="default" className="bg-green-100 text-green-800">
            {opportunity.score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Timeline:</span>
            <span>{opportunity.timeline}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Potential:</span>
            <span className="font-semibold text-green-600">{opportunity.potential}</span>
          </div>
          <Progress value={opportunity.score} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading && !data) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button 
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7d")}
            data-testid="timerange-7d"
          >
            7D
          </Button>
          <Button 
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30d")}
            data-testid="timerange-30d"
          >
            30D
          </Button>
          <Button 
            variant={timeRange === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90d")}
            data-testid="timerange-90d"
          >
            90D
          </Button>
        </div>
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
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold" data-testid="metric-active-users">{currentData.realTimeMetrics.activeUsers}</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold" data-testid="metric-conversions">{currentData.realTimeMetrics.salesConversions}</div>
              <div className="text-xs text-muted-foreground">Conversions Today</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <Eye className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold" data-testid="metric-sentiment">{currentData.realTimeMetrics.marketSentiment}%</div>
              <div className="text-xs text-muted-foreground">Market Sentiment</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
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

          {/* Financial Health Overview */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Financial Health
              </CardTitle>
              <CardDescription>Key financial metrics and ratios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">CAC vs LTV Ratio</span>
                <div className="text-right">
                  <div className="text-lg font-semibold">1:12.1</div>
                  <div className="text-xs text-green-500">Healthy</div>
                </div>
              </div>
              <Progress value={82} className="h-2" />
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Burn Rate</span>
                <div className="text-right">
                  <div className="text-lg font-semibold">${formatNumber(currentData.performanceMetrics.burnRate)}/mo</div>
                  <div className="text-xs text-yellow-500">Monitor</div>
                </div>
              </div>
              <Progress value={65} className="h-2" />
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Growth Rate</span>
                <div className="text-right">
                  <div className="text-lg font-semibold">{currentData.performanceMetrics.revenueGrowth}%</div>
                  <div className="text-xs text-green-500">Strong</div>
                </div>
              </div>
              <Progress value={currentData.performanceMetrics.revenueGrowth * 3} className="h-2" />
            </CardContent>
          </Card>
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
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
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

      {/* Mobile-Optimized Quick Actions */}
      <Card className="glass-card lg:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Reports
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Monitor
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Forecast
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}