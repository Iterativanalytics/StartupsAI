import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Briefcase, 
  Target, 
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  ArrowRight,
  Plus,
  BarChart3
} from 'lucide-react';
import { BaseDashboard, MetricWidget, ActivityFeedWidget, ProgressWidget, ListWidget } from './shared/BaseDashboard';
import { InvestorDashboardData, DashboardProps } from '@/types/dashboard.types';

export const InvestorDashboard: React.FC<DashboardProps> = ({
  userType,
  data,
  loading = false,
  error,
  onRefresh,
  onWidgetClick
}) => {
  const investorData = data as InvestorDashboardData;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline">
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investor Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor your portfolio performance and discover new investment opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Investment
          </Button>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" size="sm">
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Investments</p>
                <p className="text-2xl font-bold">{investorData.portfolioMetrics.totalInvestments}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {investorData.portfolioMetrics.activeInvestments} active
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold">
                  ${investorData.portfolioMetrics.totalValue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  IRR: {investorData.portfolioMetrics.irr}%
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Multiple</p>
                <p className="text-2xl font-bold">{investorData.portfolioMetrics.multiple}x</p>
                <p className="text-sm text-gray-500 mt-1">
                  Cash Flow: ${investorData.portfolioMetrics.cashFlow.toLocaleString()}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Score</p>
                <p className="text-2xl font-bold">{investorData.portfolioMetrics.riskScore}/10</p>
                <p className="text-sm text-gray-500 mt-1">
                  {investorData.portfolioMetrics.riskScore <= 3 ? 'Low Risk' : 
                   investorData.portfolioMetrics.riskScore <= 7 ? 'Medium Risk' : 'High Risk'}
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deal Flow Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">New Deals</p>
              <p className="text-3xl font-bold text-blue-600">{investorData.dealFlow.newDeals}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">In Review</p>
              <p className="text-3xl font-bold text-yellow-600">{investorData.dealFlow.inReview}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{investorData.dealFlow.approved}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Average Deal Size</p>
              <p className="text-3xl font-bold text-purple-600">
                ${investorData.dealFlow.averageDealSize.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investorData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {activity.type === 'investment_made' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {activity.type === 'deal_reviewed' && <Eye className="w-5 h-5 text-blue-500" />}
                      {activity.type === 'deal_received' && <Briefcase className="w-5 h-5 text-purple-500" />}
                      {activity.type === 'company_update' && <Target className="w-5 h-5 text-orange-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {activity.companyName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Performance */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Portfolio Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {investorData.portfolioMetrics.irr}%
                  </p>
                  <p className="text-sm text-gray-600">IRR</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {investorData.portfolioMetrics.multiple}x
                  </p>
                  <p className="text-sm text-gray-600">Multiple</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    ${investorData.portfolioMetrics.cashFlow.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Cash Flow</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Portfolio Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Portfolio Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investorData.portfolioCompanies.map((company) => (
              <div key={company.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{company.name}</h3>
                  <Badge 
                    variant={
                      company.status === 'performing' ? 'default' :
                      company.status === 'at_risk' ? 'destructive' : 'secondary'
                    }
                  >
                    {company.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Stage: {company.stage}
                  </p>
                  <p className="text-sm text-gray-600">
                    Industry: {company.industry}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Investment:</span>
                    <span className="text-sm font-medium">
                      ${company.investmentAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Value:</span>
                    <span className="text-sm font-medium">
                      ${company.currentValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Performance:</span>
                    <span className={`text-sm font-medium ${
                      company.performance > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {company.performance > 0 ? '+' : ''}{company.performance}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last Update: {new Date(company.lastUpdate).toLocaleDateString()}
                  </p>
                </div>
                <Button className="w-full mt-3" variant="outline" size="sm">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investorData.marketInsights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
                insight.impact === 'positive' ? 'border-green-500 bg-green-50' :
                insight.impact === 'negative' ? 'border-red-500 bg-red-50' :
                'border-gray-500 bg-gray-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2">
                      {insight.category}
                    </Badge>
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-gray-500 mr-2">Confidence:</span>
                      <Progress value={insight.confidence} className="w-16 h-1" />
                      <span className="text-xs font-medium text-gray-700 ml-2">
                        {insight.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
