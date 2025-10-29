import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Gift, 
  Target, 
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  ArrowRight,
  Plus,
  Heart,
  Award,
  Users
} from 'lucide-react';
import { BaseDashboard, MetricWidget, ActivityFeedWidget, ProgressWidget, ListWidget } from './shared/BaseDashboard';
import { GrantorDashboardData, DashboardProps } from '@/types/dashboard.types';

export const GrantorDashboard: React.FC<DashboardProps> = ({
  userType,
  data,
  loading = false,
  error,
  onRefresh,
  onWidgetClick
}) => {
  const grantorData = data as GrantorDashboardData;

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
          <h1 className="text-3xl font-bold">Grantor Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track grant impact and manage your funding programs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Grant Program
          </Button>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" size="sm">
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Grant Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Grants</p>
                <p className="text-2xl font-bold">{grantorData.grantPortfolio.totalGrants}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {grantorData.grantPortfolio.activeGrants} active
                </p>
              </div>
              <Gift className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Awarded</p>
                <p className="text-2xl font-bold">
                  ${grantorData.grantPortfolio.totalAwarded.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Avg: ${grantorData.grantPortfolio.averageGrantSize.toLocaleString()}
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
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{grantorData.grantPortfolio.completionRate}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  Impact Score: {grantorData.grantPortfolio.impactScore}/10
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impact Score</p>
                <p className="text-2xl font-bold">{grantorData.grantPortfolio.impactScore}/10</p>
                <p className="text-sm text-gray-500 mt-1">
                  Social impact rating
                </p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
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
              <p className="text-3xl font-bold text-blue-600">{grantorData.applications.newApplications}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">In Review</p>
              <p className="text-3xl font-bold text-yellow-600">{grantorData.applications.inReview}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{grantorData.applications.approved}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Approval Rate</p>
              <p className="text-3xl font-bold text-purple-600">{grantorData.applications.approvalRate}%</p>
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
                {grantorData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {activity.type === 'grant_awarded' && <Award className="w-5 h-5 text-green-500" />}
                      {activity.type === 'application_reviewed' && <Eye className="w-5 h-5 text-blue-500" />}
                      {activity.type === 'application_received' && <Gift className="w-5 h-5 text-purple-500" />}
                      {activity.type === 'report_received' && <CheckCircle className="w-5 h-5 text-green-500" />}
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

        {/* Impact Overview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Impact Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {grantorData.grantPortfolio.impactScore}/10
                  </p>
                  <p className="text-sm text-gray-600">Impact Score</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {grantorData.grantPortfolio.completionRate}%
                  </p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    ${grantorData.grantPortfolio.totalAwarded.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Awarded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Grants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Active Grants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grantorData.activeGrants.map((grant) => (
              <div key={grant.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{grant.granteeName}</h3>
                  <Badge 
                    variant={
                      grant.status === 'on_track' ? 'default' :
                      grant.status === 'at_risk' ? 'destructive' : 'secondary'
                    }
                  >
                    {grant.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Grant Amount:</span>
                    <span className="text-sm font-medium">
                      ${grant.grantAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Disbursed:</span>
                    <span className="text-sm font-medium">
                      ${grant.disbursedAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progress:</span>
                      <span className="text-sm font-medium">{grant.progress}%</span>
                    </div>
                    <Progress value={grant.progress} className="h-2" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Next: {grant.nextMilestone}
                  </p>
                  <p className="text-xs text-gray-500">
                    Due: {new Date(grant.dueDate).toLocaleDateString()}
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

      {/* Impact Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Impact Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grantorData.impactInsights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
                insight.impact === 'high' ? 'border-green-500 bg-green-50' :
                insight.impact === 'medium' ? 'border-yellow-500 bg-yellow-50' :
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
