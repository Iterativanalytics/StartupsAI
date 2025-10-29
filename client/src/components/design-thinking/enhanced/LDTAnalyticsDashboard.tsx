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

interface DTAnalyticsDashboardProps {
  workflowId: string;
  className?: string;
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

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100';
    if (score >= 0.6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
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
