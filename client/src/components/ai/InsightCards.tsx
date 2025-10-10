import { AlertTriangle, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Insight {
  type: 'warning' | 'recommendation' | 'opportunity' | 'risk';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
}

interface InsightCardsProps {
  insights: Insight[];
}

export function InsightCards({ insights }: InsightCardsProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-700">AI Insights</p>
      <div className="grid gap-3">
        {insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} />
        ))}
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const config = getInsightConfig(insight.type);
  const priorityColor = getPriorityColor(insight.priority);

  return (
    <Card className={`p-4 border-l-4 ${config.borderColor}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bgColor} flex-shrink-0`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm">{insight.title}</h4>
            <Badge variant="outline" className={`text-xs ${priorityColor}`}>
              {insight.priority}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
          {insight.actionable && (
            <Badge variant="secondary" className="text-xs">
              Actionable
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

function getInsightConfig(type: string) {
  const configs = {
    warning: {
      icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-500'
    },
    recommendation: {
      icon: <Lightbulb className="w-4 h-4 text-blue-600" />,
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-500'
    },
    opportunity: {
      icon: <TrendingUp className="w-4 h-4 text-green-600" />,
      bgColor: 'bg-green-100',
      borderColor: 'border-green-500'
    },
    risk: {
      icon: <AlertCircle className="w-4 h-4 text-red-600" />,
      bgColor: 'bg-red-100',
      borderColor: 'border-red-500'
    }
  };

  return configs[type as keyof typeof configs] || configs.recommendation;
}

function getPriorityColor(priority: string) {
  const colors = {
    low: 'text-gray-600 border-gray-300',
    medium: 'text-orange-600 border-orange-300',
    high: 'text-red-600 border-red-300'
  };

  return colors[priority as keyof typeof colors] || colors.medium;
}