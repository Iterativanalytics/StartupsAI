import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Activity, 
  User, 
  FileText, 
  DollarSign,
  TrendingUp,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { WidgetProps } from '../../types/dashboard.types';
import DashboardWidget from '../../core/DashboardWidget';

interface ActivityItem {
  id: string;
  type: 'user' | 'system' | 'financial' | 'milestone' | 'notification';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  status?: 'pending' | 'completed' | 'failed' | 'warning';
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

interface ActivityFeedWidgetProps extends WidgetProps {
  data?: {
    activities: ActivityItem[];
    unreadCount: number;
    showFilters?: boolean;
  };
}

const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = memo(({
  widgetId,
  data,
  loading,
  error,
  onRefresh,
}) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'system':
        return <Activity className="h-4 w-4" />;
      case 'financial':
        return <DollarSign className="h-4 w-4" />;
      case 'milestone':
        return <TrendingUp className="h-4 w-4" />;
      case 'notification':
        return <Bell className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: ActivityItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: ActivityItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  if (!data) {
    return (
      <DashboardWidget
        widgetId={widgetId}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        variant="feed"
      >
        <CardContent>
          <div className="text-center text-muted-foreground">
            No activity data available
          </div>
        </CardContent>
      </DashboardWidget>
    );
  }

  return (
    <DashboardWidget
      widgetId={widgetId}
      loading={loading}
      error={error}
      onRefresh={onRefresh}
      variant="feed"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Activity Feed</CardTitle>
              <p className="text-sm text-muted-foreground">
                Recent updates and events
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {data.unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {data.unreadCount}
              </Badge>
            )}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {data.activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Avatar/Icon */}
              <div className="flex-shrink-0">
                {activity.user ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback>
                      {activity.user.initials || activity.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    {activity.status && getStatusIcon(activity.status)}
                    {activity.priority && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(activity.priority)}`}
                      >
                        {activity.priority}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                  
                  {activity.metadata && (
                    <div className="flex items-center space-x-1">
                      {activity.metadata.amount && (
                        <Badge variant="secondary" className="text-xs">
                          ${activity.metadata.amount.toLocaleString()}
                        </Badge>
                      )}
                      {activity.metadata.category && (
                        <Badge variant="outline" className="text-xs">
                          {activity.metadata.category}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" size="sm" className="text-xs">
            View All Activity
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Mark All Read
          </Button>
        </div>
      </CardContent>
    </DashboardWidget>
  );
});

ActivityFeedWidget.displayName = 'ActivityFeedWidget';

export default ActivityFeedWidget;
