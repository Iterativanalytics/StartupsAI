import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WidgetProps } from '../../types/dashboard.types';
import DashboardWidget from '../../core/DashboardWidget';

interface RevenueData {
  month: string;
  revenue: number;
  target: number;
  growth: number;
}

interface RevenueWidgetProps extends WidgetProps {
  data?: {
    current: number;
    previous: number;
    target: number;
    chartData: RevenueData[];
    currency?: string;
  };
}

const RevenueWidget: React.FC<RevenueWidgetProps> = memo(({
  widgetId,
  data,
  loading,
  error,
  onRefresh,
}) => {
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (!data) {
    return (
      <DashboardWidget
        widgetId={widgetId}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        variant="chart"
      >
        <CardContent>
          <div className="text-center text-muted-foreground">
            No revenue data available
          </div>
        </CardContent>
      </DashboardWidget>
    );
  }

  const growth = data.previous > 0 
    ? ((data.current - data.previous) / data.previous) * 100 
    : 0;

  const targetProgress = data.target > 0 
    ? (data.current / data.target) * 100 
    : 0;

  return (
    <DashboardWidget
      widgetId={widgetId}
      loading={loading}
      error={error}
      onRefresh={onRefresh}
      variant="chart"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Revenue</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(data.current, data.currency)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getGrowthIcon(growth)}
            <span className={`text-sm font-medium ${getGrowthColor(growth)}`}>
              {formatPercentage(growth)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Target</p>
            <p className="text-lg font-semibold">
              {formatCurrency(data.target, data.currency)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Progress</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(targetProgress, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {targetProgress.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        {data.chartData && data.chartData.length > 0 && (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#6b7280"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {targetProgress >= 100 ? 'Target Met' : 'In Progress'}
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </DashboardWidget>
  );
});

RevenueWidget.displayName = 'RevenueWidget';

export default RevenueWidget;
