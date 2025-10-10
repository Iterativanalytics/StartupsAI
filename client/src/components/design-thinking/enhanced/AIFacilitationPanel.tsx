import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  TrendingUp,
  Clock,
  Users,
  Target,
  Zap,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'celebration' | 'recommendation';
  content: string;
  confidence: number;
  actionable: boolean;
  timestamp: Date;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  relatedPhase?: string;
  participants?: string[];
}

interface AIFacilitationPanelProps {
  insights: AIInsight[];
  onInsightAction: (insightId: string, action: string) => void;
  className?: string;
}

export function AIFacilitationPanel({ 
  insights, 
  onInsightAction, 
  className 
}: AIFacilitationPanelProps) {
  const [filteredInsights, setFilteredInsights] = useState<AIInsight[]>([]);
  const [filter, setFilter] = useState<'all' | 'suggestion' | 'warning' | 'celebration' | 'recommendation'>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'confidence' | 'priority'>('timestamp');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    let filtered = insights;

    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(insight => insight.type === filter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'confidence':
          return b.confidence - a.confidence;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || 'low'] || 0) - (priorityOrder[a.priority || 'low'] || 0);
        default:
          return 0;
      }
    });

    setFilteredInsights(filtered);
  }, [insights, filter, sortBy]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'celebration':
        return <CheckCircle className="w-4 h-4" />;
      case 'recommendation':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'suggestion':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'celebration':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'recommendation':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
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

  const handleInsightAction = (insightId: string, action: string) => {
    onInsightAction(insightId, action);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getInsightStats = () => {
    const total = insights.length;
    const suggestions = insights.filter(i => i.type === 'suggestion').length;
    const warnings = insights.filter(i => i.type === 'warning').length;
    const celebrations = insights.filter(i => i.type === 'celebration').length;
    const recommendations = insights.filter(i => i.type === 'recommendation').length;

    return { total, suggestions, warnings, celebrations, recommendations };
  };

  const stats = getInsightStats();

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5" />
            AI Facilitation
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? '−' : '+'}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{stats.total} insights</span>
            <span>•</span>
            <span className="text-blue-600">{stats.suggestions} suggestions</span>
            <span>•</span>
            <span className="text-yellow-600">{stats.warnings} warnings</span>
            <span>•</span>
            <span className="text-green-600">{stats.celebrations} celebrations</span>
          </div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Filters and Controls */}
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="all">All Types</option>
              <option value="suggestion">Suggestions</option>
              <option value="warning">Warnings</option>
              <option value="celebration">Celebrations</option>
              <option value="recommendation">Recommendations</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="timestamp">Recent</option>
              <option value="confidence">Confidence</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          {/* Insights List */}
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredInsights.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No insights available</p>
                </div>
              ) : (
                filteredInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <span className="text-sm font-medium capitalize">
                          {insight.type}
                        </span>
                        {insight.priority && (
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getPriorityColor(insight.priority)}`}
                          >
                            {insight.priority}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs ${getConfidenceColor(insight.confidence)}`}>
                          {Math.round(insight.confidence * 100)}%
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleInsightAction(insight.id, 'more')}
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm mb-2">{insight.content}</p>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(insight.timestamp)}</span>
                        {insight.relatedPhase && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{insight.relatedPhase}</span>
                          </>
                        )}
                      </div>
                      
                      {insight.actionable && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleInsightAction(insight.id, 'apply')}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleInsightAction(insight.id, 'dismiss')}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {insight.participants && insight.participants.length > 0 && (
                      <div className="mt-2 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span className="text-xs">
                          {insight.participants.length} participant{insight.participants.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleInsightAction('all', 'refresh')}
                className="flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleInsightAction('all', 'clear')}
                className="flex items-center gap-1"
              >
                <MessageSquare className="w-3 h-3" />
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
