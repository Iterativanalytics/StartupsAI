import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  FunnelChart,
  Funnel,
  LabelList,
  Treemap
} from 'recharts';
import { 
  Eye, 
  Download, 
  Share2, 
  Maximize2, 
  TrendingUp,
  Target,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { InfographicDocument, InfographicData } from '../../types/infographic/InfographicDocument';
import { DocumentRendererProps } from '../../types/document.types';

interface InfographicDocumentRendererProps extends DocumentRendererProps {
  document: InfographicDocument;
}

export const InfographicDocumentRenderer: React.FC<InfographicDocumentRendererProps> = ({
  document,
  mode = 'view',
  onUpdate,
  onComment,
  onSuggest
}) => {
  const infographic = document.content.data.infographic;
  const customization = document.content.data.customizations;
  const colors = customization?.colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const renderChart = () => {
    const { type, data, config } = infographic;
    const chartProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    const commonProps = {
      width: '100%',
      height: 400
    };

    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart {...chartProps}>
              {customization?.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              {customization?.showTooltips && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              )}
              <Bar 
                dataKey="value" 
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
                animationDuration={customization?.enableAnimations ? 1000 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart {...chartProps}>
              {customization?.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              {customization?.showTooltips && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              )}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
                animationDuration={customization?.enableAnimations ? 1000 : 0}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                animationDuration={customization?.enableAnimations ? 1000 : 0}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {customization?.showTooltips && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart {...chartProps}>
              {customization?.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              {customization?.showTooltips && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              )}
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                fill={colors[0]} 
                fillOpacity={0.6}
                animationDuration={customization?.enableAnimations ? 1000 : 0}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart {...chartProps}>
              {customization?.showGrid && <CartesianGrid stroke="#f0f0f0" />}
              <XAxis 
                dataKey="x" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                dataKey="y" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              {customization?.showTooltips && (
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              )}
              <Scatter 
                dataKey="value" 
                fill={colors[0]}
                animationDuration={customization?.enableAnimations ? 1000 : 0}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer {...commonProps}>
            <RadarChart data={data}>
              <PolarGrid stroke="#f0f0f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fontSize: 12 }} />
              <Radar 
                name="value" 
                dataKey="value" 
                stroke={colors[0]} 
                fill={colors[0]} 
                fillOpacity={0.6}
                animationDuration={customization?.enableAnimations ? 1000 : 0}
              />
              {customization?.showTooltips && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'funnel':
        return (
          <ResponsiveContainer {...commonProps}>
            <FunnelChart>
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive={customization?.enableAnimations}
              >
                <LabelList position="center" fill="#fff" stroke="none" />
              </Funnel>
              {customization?.showTooltips && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              )}
            </FunnelChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Unsupported chart type: {type}</p>
            </div>
          </div>
        );
    }
  };

  const getInsights = () => {
    return infographic.config?.insights || [];
  };

  const getDataSummary = () => {
    if (!infographic.data || infographic.data.length === 0) return null;
    
    const data = infographic.data;
    const numericFields = Object.keys(data[0]).filter(key => 
      typeof data[0][key] === 'number'
    );
    
    if (numericFields.length === 0) return null;
    
    const summary: any = {};
    numericFields.forEach(field => {
      const values = data.map((item: any) => item[field]).filter((val: any) => typeof val === 'number');
      if (values.length > 0) {
        summary[field] = {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((a: number, b: number) => a + b, 0) / values.length,
          count: values.length
        };
      }
    });
    
    return summary;
  };

  const dataSummary = getDataSummary();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{infographic.title}</h2>
          {infographic.description && (
            <p className="text-gray-600 mt-1">{infographic.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{infographic.type}</Badge>
          <Badge variant="outline">{customization?.theme}</Badge>
          <Badge variant="outline">{customization?.layout}</Badge>
        </div>
      </div>

      {/* Chart Container */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            {renderChart()}
          </div>
        </CardContent>
      </Card>

      {/* Insights Section */}
      {getInsights().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {getInsights().map((insight: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Summary */}
      {dataSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Data Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(dataSummary).map(([field, stats]: [string, any]) => (
                <div key={field} className="space-y-1">
                  <h4 className="font-medium text-sm capitalize">{field}</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Min: {stats.min.toLocaleString()}</div>
                    <div>Max: {stats.max.toLocaleString()}</div>
                    <div>Avg: {stats.avg.toFixed(1)}</div>
                    <div>Count: {stats.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>Generated on {new Date(infographic.metadata?.generatedAt).toLocaleString()}</span>
          <span>•</span>
          <span>AI Confidence: {(infographic.metadata?.aiConfidence * 100).toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => {/* Export functionality */}}>
            <Download className="h-4 w-4 mr-1" />
            PNG
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {/* Export functionality */}}>
            <Download className="h-4 w-4 mr-1" />
            SVG
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {/* Export functionality */}}>
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {/* Share functionality */}}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};
