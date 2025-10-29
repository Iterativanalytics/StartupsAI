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
  Eye,
  Calendar,
  ArrowRight,
  Plus,
  Handshake,
  Award,
  Building
} from 'lucide-react';
import { BaseDashboard, MetricWidget, ActivityFeedWidget, ProgressWidget, ListWidget } from './shared/BaseDashboard';
import { PartnerDashboardData, DashboardProps } from '@/types/dashboard.types';

export const PartnerDashboard: React.FC<DashboardProps> = ({
  userType,
  data,
  loading = false,
  error,
  onRefresh,
  onWidgetClick
}) => {
  const partnerData = data as PartnerDashboardData;

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
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your programs and track startup success
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Program
          </Button>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" size="sm">
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Program Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Programs</p>
                <p className="text-2xl font-bold">{partnerData.programMetrics.totalPrograms}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {partnerData.programMetrics.activePrograms} active
                </p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold">{partnerData.programMetrics.totalParticipants}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Success Rate: {partnerData.programMetrics.successRate}%
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{partnerData.programMetrics.successRate}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  Avg Duration: {partnerData.programMetrics.averageProgramDuration} weeks
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
                <p className="text-sm font-medium text-gray-600">Satisfaction Score</p>
                <p className="text-2xl font-bold">{partnerData.programMetrics.satisfactionScore}/10</p>
                <p className="text-sm text-gray-500 mt-1">
                  Participant rating
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Companies</p>
              <p className="text-3xl font-bold text-blue-600">{partnerData.portfolio.totalCompanies}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Active Companies</p>
              <p className="text-3xl font-bold text-green-600">{partnerData.portfolio.activeCompanies}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Graduated</p>
              <p className="text-3xl font-bold text-purple-600">{partnerData.portfolio.graduatedCompanies}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Funding Raised</p>
              <p className="text-3xl font-bold text-orange-600">
                ${partnerData.portfolio.totalFundingRaised.toLocaleString()}
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
                {partnerData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {activity.type === 'graduation' && <Award className="w-5 h-5 text-green-500" />}
                      {activity.type === 'milestone_reached' && <Target className="w-5 h-5 text-blue-500" />}
                      {activity.type === 'company_joined' && <Users className="w-5 h-5 text-purple-500" />}
                      {activity.type === 'partnership_formed' && <Handshake className="w-5 h-5 text-orange-500" />}
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

        {/* Program Performance */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Program Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {partnerData.programMetrics.successRate}%
                  </p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {partnerData.programMetrics.satisfactionScore}/10
                  </p>
                  <p className="text-sm text-gray-600">Satisfaction Score</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {partnerData.portfolio.graduatedCompanies}
                  </p>
                  <p className="text-sm text-gray-600">Graduated Companies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Active Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partnerData.activeCompanies.map((company) => (
              <div key={company.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{company.name}</h3>
                  <Badge 
                    variant={
                      company.status === 'on_track' ? 'default' :
                      company.status === 'needs_support' ? 'destructive' : 'secondary'
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
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progress:</span>
                      <span className="text-sm font-medium">{company.progress}%</span>
                    </div>
                    <Progress value={company.progress} className="h-2" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Next: {company.nextMilestone}
                  </p>
                  <p className="text-xs text-gray-500">
                    Joined: {new Date(company.joinDate).toLocaleDateString()}
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

      {/* Collaboration Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="w-5 h-5" />
            Collaboration Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partnerData.collaborationOpportunities.map((opportunity) => (
              <div key={opportunity.id} className={`p-4 rounded-lg border-l-4 ${
                opportunity.priority === 'high' ? 'border-red-500 bg-red-50' :
                opportunity.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">
                        {opportunity.type}
                      </Badge>
                      <Badge 
                        variant={
                          opportunity.priority === 'high' ? 'destructive' :
                          opportunity.priority === 'medium' ? 'default' : 'secondary'
                        }
                      >
                        {opportunity.priority}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900">{opportunity.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">Participants:</p>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.participants.map((participant, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {participant}
                          </Badge>
                        ))}
                      </div>
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
