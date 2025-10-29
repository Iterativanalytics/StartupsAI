import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Target, 
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  ArrowRight,
  Plus,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { BaseDashboard, MetricWidget, ActivityFeedWidget, ProgressWidget, ListWidget } from './shared/BaseDashboard';
import { LenderDashboardData, DashboardProps } from '@/types/dashboard.types';

export const LenderDashboard: React.FC<DashboardProps> = ({
  userType,
  data,
  loading = false,
  error,
  onRefresh,
  onWidgetClick
}) => {
  const lenderData = data as LenderDashboardData;

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
          <h1 className="text-3xl font-bold">Lender Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your loan portfolio and monitor credit risk
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Loan
          </Button>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" size="sm">
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Loan Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Loans</p>
                <p className="text-2xl font-bold">{lenderData.loanPortfolio.totalLoans}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {lenderData.loanPortfolio.activeLoans} active
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
                <p className="text-2xl font-bold">
                  ${lenderData.loanPortfolio.totalOutstanding.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Avg: ${lenderData.loanPortfolio.averageLoanSize.toLocaleString()}
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
                <p className="text-sm font-medium text-gray-600">Default Rate</p>
                <p className="text-2xl font-bold">{lenderData.loanPortfolio.defaultRate}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  Recovery: {lenderData.loanPortfolio.recoveryRate}%
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio Yield</p>
                <p className="text-2xl font-bold">{lenderData.loanPortfolio.portfolioYield}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  Risk-adjusted return
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">New Applications</p>
              <p className="text-3xl font-bold text-blue-600">{lenderData.applications.newApplications}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">In Review</p>
              <p className="text-3xl font-bold text-yellow-600">{lenderData.applications.inReview}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{lenderData.applications.approved}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Approval Rate</p>
              <p className="text-3xl font-bold text-purple-600">{lenderData.applications.approvalRate}%</p>
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
                {lenderData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {activity.type === 'loan_approved' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {activity.type === 'application_reviewed' && <Eye className="w-5 h-5 text-blue-500" />}
                      {activity.type === 'application_received' && <CreditCard className="w-5 h-5 text-purple-500" />}
                      {activity.type === 'payment_received' && <DollarSign className="w-5 h-5 text-green-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          ${activity.amount.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Overview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Risk Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {lenderData.loanPortfolio.defaultRate}%
                  </p>
                  <p className="text-sm text-gray-600">Default Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {lenderData.loanPortfolio.recoveryRate}%
                  </p>
                  <p className="text-sm text-gray-600">Recovery Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {lenderData.loanPortfolio.portfolioYield}%
                  </p>
                  <p className="text-sm text-gray-600">Portfolio Yield</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* At-Risk Loans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            At-Risk Loans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lenderData.atRiskLoans.map((loan) => (
              <div key={loan.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{loan.borrowerName}</h3>
                  <Badge variant="destructive">
                    At Risk
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Loan Amount:</span>
                    <span className="text-sm font-medium">
                      ${loan.loanAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Outstanding:</span>
                    <span className="text-sm font-medium">
                      ${loan.outstandingBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Days Past Due:</span>
                    <span className="text-sm font-medium text-red-600">
                      {loan.daysPastDue} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Risk Score:</span>
                    <div className="flex items-center">
                      <Progress value={loan.riskScore} className="w-16 h-2 mr-2" />
                      <span className="text-sm font-medium">{loan.riskScore}/100</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last Payment: {new Date(loan.lastPayment).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-red-600 font-medium">
                    {loan.actionRequired}
                  </p>
                </div>
                <Button className="w-full mt-3" variant="destructive" size="sm">
                  Take Action
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Credit Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Credit Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lenderData.creditInsights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
                insight.riskLevel === 'low' ? 'border-green-500 bg-green-50' :
                insight.riskLevel === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2">
                      {insight.category}
                    </Badge>
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <p className="text-sm text-gray-700 mt-2 font-medium">
                      {insight.recommendation}
                    </p>
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
