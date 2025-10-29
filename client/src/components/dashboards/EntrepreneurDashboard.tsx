import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Clock,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Calendar,
  ArrowRight,
  Plus
} from 'lucide-react';
import { BaseDashboard, MetricWidget, ActivityFeedWidget, ProgressWidget, ListWidget } from './shared/BaseDashboard';
import { EntrepreneurDashboardData, DashboardProps } from '@/types/dashboard.types';

export const EntrepreneurDashboard: React.FC<DashboardProps> = ({
  userType,
  data,
  loading = false,
  error,
  onRefresh,
  onWidgetClick
}) => {
  const entrepreneurData = data as EntrepreneurDashboardData;

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
          <h1 className="text-3xl font-bold">Entrepreneur Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your startup progress, funding opportunities, and business growth
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Plan
          </Button>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" size="sm">
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold">{entrepreneurData.businessMetrics.totalPlans}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{entrepreneurData.businessMetrics.monthlyGrowth}% this month
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Funding Raised</p>
                <p className="text-2xl font-bold">
                  ${entrepreneurData.businessMetrics.fundingRaised.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {entrepreneurData.businessMetrics.activePlans} active plans
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
                <p className="text-sm font-medium text-gray-600">Team Size</p>
                <p className="text-2xl font-bold">{entrepreneurData.businessMetrics.teamSize}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {entrepreneurData.businessMetrics.revenue > 0 ? 'Revenue generating' : 'Pre-revenue'}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Runway</p>
                <p className="text-2xl font-bold">{entrepreneurData.businessMetrics.runway} months</p>
                <p className="text-sm text-gray-500 mt-1">
                  Burn rate: ${entrepreneurData.businessMetrics.burnRate.toLocaleString()}/month
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
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
                <Target className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entrepreneurData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {activity.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {activity.status === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                      {activity.status === 'info' && <Clock className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entrepreneurData.upcomingTasks.map((task) => (
                  <div key={task.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          task.priority === 'critical' ? 'destructive' :
                          task.priority === 'high' ? 'default' :
                          task.priority === 'medium' ? 'secondary' : 'outline'
                        }
                        className="ml-2"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {task.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Funding Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Funding Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entrepreneurData.fundingOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{opportunity.name}</h3>
                  <Badge 
                    variant={
                      opportunity.status === 'available' ? 'default' :
                      opportunity.status === 'applied' ? 'secondary' :
                      opportunity.status === 'reviewed' ? 'outline' : 'destructive'
                    }
                  >
                    {opportunity.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Amount: ${opportunity.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Type: {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Match Score:</span>
                      <Progress value={opportunity.matchScore} className="w-16 h-2" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {opportunity.matchScore}%
                    </span>
                  </div>
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

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entrepreneurData.aiInsights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'recommendation' ? 'border-blue-500 bg-blue-50' :
                insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
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
                  {insight.actionRequired && (
                    <Badge variant="destructive" className="ml-2">
                      Action Required
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
