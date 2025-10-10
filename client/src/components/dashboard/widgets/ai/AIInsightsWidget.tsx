import React, { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  MoreHorizontal,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { WidgetProps } from '../../types/dashboard.types';
import DashboardWidget from '../../core/DashboardWidget';

interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'recommendation' | 'prediction' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  category: string;
  suggestedActions: string[];
  metadata?: {
    affectedMetrics?: string[];
    timeframe?: string;
    probability?: number;
  };
}

interface AIInsightsWidgetProps extends WidgetProps {
  data?: {
    insights: AIInsight[];
    lastUpdated: Date;
    modelVersion?: string;
  };
}

const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = memo(({
  widgetId,
  data,
  loading,
  error,
  onRefresh,
}) => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-yellow-600" />;
      case 'prediction':
        return <Brain className="h-4 w-4 text-purple-600" />;
      case 'optimization':
        return <Zap className="h-4 w-4 text-blue-600" />;
      default:
        return <Brain className="h-4 w-4 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatConfidence = (confidence: number) => {
    return `${confidence.toFixed(0)}%`;
  };

  if (!data) {
    return (
      <DashboardWidget
        widgetId={widgetId}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        variant="insight"
      >
        <CardContent>
          <div className="text-center text-muted-foreground">
            No AI insights available
          </div>
        </CardContent>
      </DashboardWidget>
    );
  }

  const highImpactInsights = data.insights.filter(insight => insight.impact === 'high');
  const recentInsights = data.insights.slice(0, 3);

  return (
    <DashboardWidget
      widgetId={widgetId}
      loading={loading}
      error={error}
      onRefresh={onRefresh}
      variant="insight"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                AI Insights
                <Sparkles className="h-4 w-4 text-purple-500" />
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {data.insights.length} insights • {highImpactInsights.length} high impact
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {data.modelVersion && (
              <Badge variant="outline" className="text-xs">
                v{data.modelVersion}
              </Badge>
            )}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {recentInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                selectedInsight === insight.id 
                  ? 'border-purple-200 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedInsight(
                selectedInsight === insight.id ? null : insight.id
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getInsightIcon(insight.type)}
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getImpactColor(insight.impact)}`}
                  >
                    {insight.impact}
                  </Badge>
                  <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                    {formatConfidence(insight.confidence)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {insight.description}
              </p>

              {selectedInsight === insight.id && (
                <div className="space-y-3 pt-3 border-t">
                  {/* Suggested Actions */}
                  {insight.suggestedActions.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Suggested Actions
                      </h5>
                      <div className="space-y-1">
                        {insight.suggestedActions.map((action, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs text-gray-600"
                          >
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  {insight.metadata && (
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {insight.metadata.timeframe && (
                        <span>Timeline: {insight.metadata.timeframe}</span>
                      )}
                      {insight.metadata.probability && (
                        <span>Probability: {(insight.metadata.probability * 100).toFixed(0)}%</span>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <Button size="sm" className="w-full">
                    Take Action
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <RefreshCw className="h-3 w-3" />
            <span>Updated {data.lastUpdated.toLocaleTimeString()}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            View All Insights
          </Button>
        </div>
      </CardContent>
    </DashboardWidget>
  );
});

AIInsightsWidget.displayName = 'AIInsightsWidget';

export default AIInsightsWidget;
