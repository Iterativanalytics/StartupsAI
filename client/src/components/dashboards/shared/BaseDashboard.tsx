import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Users,
  Target,
  Activity
} from 'lucide-react';
import { DashboardProps, WidgetProps } from '@/types/dashboard.types';

// Base dashboard layout component
export const BaseDashboard: React.FC<DashboardProps> = ({
  userType,
  data,
  loading = false,
  error,
  onRefresh,
  onWidgetClick
}) => {
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
              <RefreshCw className="w-4 h-4 mr-2" />
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
          <h1 className="text-3xl font-bold capitalize">{userType} Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your {userType} activities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Dashboard Content - to be implemented by specific dashboard components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* This will be overridden by specific dashboard implementations */}
      </div>
    </div>
  );
};

// Metric widget component
export const MetricWidget: React.FC<WidgetProps> = ({ widget, data, loading }) => {
  const { value, change, changeType, format = 'number', icon: Icon } = data || {};

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
      case 'percentage':
        return `${val}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(val);
      default:
        return val.toString();
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{widget.title}</p>
            <p className="text-2xl font-bold">{formatValue(value)}</p>
            {change !== undefined && (
              <div className="flex items-center mt-1">
                {changeType === 'increase' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : changeType === 'decrease' ? (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                ) : null}
                <span className={`text-sm ${
                  changeType === 'increase' ? 'text-green-600' : 
                  changeType === 'decrease' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          {Icon && <Icon className="w-8 h-8 text-blue-600" />}
        </div>
      </CardContent>
    </Card>
  );
};

// Activity feed widget component
export const ActivityFeedWidget: React.FC<WidgetProps> = ({ widget, data, loading }) => {
  const activities = data || [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {widget.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity: any) => (
            <div key={activity.id} className="flex items-start gap-3">
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
  );
};

// Progress widget component
export const ProgressWidget: React.FC<WidgetProps> = ({ widget, data, loading }) => {
  const { value, max, label, description } = data || {};

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{widget.title}</p>
            <span className="text-sm text-gray-500">{value}/{max}</span>
          </div>
          <Progress value={percentage} className="h-2" />
          {label && (
            <p className="text-sm text-gray-600">{label}</p>
          )}
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// List widget component
export const ListWidget: React.FC<WidgetProps> = ({ widget, data, loading, onAction }) => {
  const items = data || [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{widget.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{widget.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                {item.description && (
                  <p className="text-sm text-gray-600 truncate">{item.description}</p>
                )}
                {item.status && (
                  <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                    {item.status}
                  </Badge>
                )}
              </div>
              {onAction && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAction('view', item)}
                >
                  View
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
