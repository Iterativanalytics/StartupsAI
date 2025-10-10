import { Bot, TrendingUp, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Activity {
  id: string;
  type: 'analysis' | 'recommendation' | 'alert' | 'insight' | 'automation';
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'in_progress' | 'pending';
}

export function AgentActivity() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'analysis',
      title: 'Business Plan Analyzed',
      description: 'Reviewed your business plan and identified 3 key improvements',
      timestamp: new Date(Date.now() - 5 * 60000),
      status: 'completed'
    },
    {
      id: '2',
      type: 'alert',
      title: 'Low Runway Warning',
      description: 'Your cash runway has dropped to 5.2 months',
      timestamp: new Date(Date.now() - 15 * 60000),
      status: 'completed'
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Growth Strategy Suggestion',
      description: 'AI suggests focusing on customer retention',
      timestamp: new Date(Date.now() - 30 * 60000),
      status: 'completed'
    },
    {
      id: '4',
      type: 'automation',
      title: 'Weekly Report Generated',
      description: 'Financial metrics report created automatically',
      timestamp: new Date(Date.now() - 2 * 3600000),
      status: 'completed'
    },
    {
      id: '5',
      type: 'insight',
      title: 'Market Opportunity Identified',
      description: 'New market segment showing 25% growth',
      timestamp: new Date(Date.now() - 24 * 3600000),
      status: 'completed'
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-teal-500 rounded-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Agent Activity</h2>
          <p className="text-sm text-gray-600">Recent AI actions and insights</p>
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const config = getActivityConfig(activity.type);

  return (
    <div className="flex gap-3 pb-4 border-b last:border-0">
      <div className={`p-2 rounded-lg ${config.bgColor} h-fit`}>
        {config.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-1">
          <h4 className="font-semibold text-sm">{activity.title}</h4>
          <Badge variant="outline" className="text-xs">
            {getTimeAgo(activity.timestamp)}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-green-600" />
          <span className="text-xs text-gray-500 capitalize">{activity.status.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  );
}

function getActivityConfig(type: string) {
  const configs = {
    analysis: {
      icon: <Bot className="w-4 h-4 text-purple-600" />,
      bgColor: 'bg-purple-100'
    },
    recommendation: {
      icon: <Lightbulb className="w-4 h-4 text-blue-600" />,
      bgColor: 'bg-blue-100'
    },
    alert: {
      icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
      bgColor: 'bg-orange-100'
    },
    insight: {
      icon: <TrendingUp className="w-4 h-4 text-green-600" />,
      bgColor: 'bg-green-100'
    },
    automation: {
      icon: <Bot className="w-4 h-4 text-teal-600" />,
      bgColor: 'bg-teal-100'
    }
  };

  return configs[type as keyof typeof configs] || configs.analysis;
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}