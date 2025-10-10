import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { 
  TrendingUp, BarChart3, PieChart, Globe, Building, Users, DollarSign,
  ArrowUp, ArrowDown, Target, Zap, Shield, Award, Clock, Star, AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MarketTrend {
  id: string;
  name: string;
  impact: 'high' | 'medium' | 'low';
  direction: 'up' | 'down' | 'stable';
  description: string;
  timeframe: string;
  confidence: number;
}

interface IndustryMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  benchmark: number;
}

interface CompetitorAnalysis {
  id: string;
  name: string;
  marketShare: number;
  revenue: number;
  growth: number;
  strengths: string[];
  recentMoves: string[];
}

function IndustryAnalysis() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Mock data for market trends
  const marketTrends: MarketTrend[] = [
    {
      id: 'ai-adoption',
      name: 'AI & Machine Learning Adoption',
      impact: 'high',
      direction: 'up',
      description: 'Rapid adoption of AI technologies across industries',
      timeframe: '2024-2026',
      confidence: 85
    },
    {
      id: 'remote-work',
      name: 'Remote Work Revolution',
      impact: 'medium',
      direction: 'up',
      description: 'Permanent shift to hybrid and remote work models',
      timeframe: '2024-2025',
      confidence: 92
    },
    {
      id: 'sustainability',
      name: 'Sustainability Focus',
      impact: 'high',
      direction: 'up',
      description: 'Increased emphasis on ESG and sustainable practices',
      timeframe: '2024-2027',
      confidence: 78
    },
    {
      id: 'cybersecurity',
      name: 'Cybersecurity Concerns',
      impact: 'high',
      direction: 'up',
      description: 'Growing cybersecurity threats and regulations',
      timeframe: '2024-2026',
      confidence: 88
    }
  ];

  const industryMetrics: IndustryMetric[] = [
    {
      id: 'market-size',
      name: 'Total Addressable Market',
      value: 45.2,
      unit: 'Billion USD',
      change: 12.5,
      trend: 'up',
      benchmark: 50.0
    },
    {
      id: 'growth-rate',
      name: 'Annual Growth Rate',
      value: 8.7,
      unit: '%',
      change: 2.1,
      trend: 'up',
      benchmark: 6.5
    },
    {
      id: 'competition',
      name: 'Competition Level',
      value: 7.2,
      unit: '/10',
      change: -0.5,
      trend: 'down',
      benchmark: 6.0
    },
    {
      id: 'barriers',
      name: 'Entry Barriers',
      value: 6.8,
      unit: '/10',
      change: 1.2,
      trend: 'up',
      benchmark: 5.5
    }
  ];

  const competitors: CompetitorAnalysis[] = [
    {
      id: 'competitor-1',
      name: 'Industry Leader A',
      marketShare: 25,
      revenue: 1200000000,
      growth: 15.2,
      strengths: ['Brand recognition', 'Global presence', 'R&D investment'],
      recentMoves: ['Acquired 3 companies', 'Launched AI platform', 'Expanded to Asia']
    },
    {
      id: 'competitor-2',
      name: 'Fast Growing B',
      marketShare: 18,
      revenue: 850000000,
      growth: 28.7,
      strengths: ['Innovation', 'Agile development', 'Customer focus'],
      recentMoves: ['Raised $200M Series C', 'Hired 200 engineers', 'New product launch']
    },
    {
      id: 'competitor-3',
      name: 'Established C',
      marketShare: 22,
      revenue: 950000000,
      growth: 8.3,
      strengths: ['Market experience', 'Customer relationships', 'Stable operations'],
      recentMoves: ['Partnership with Microsoft', 'Digital transformation', 'Sustainability initiative']
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M`;
    }
    return `$${amount}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Industry Analysis
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Deep dive into industry trends, market dynamics, and competitive landscape to inform strategic decisions.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">$45.2B</p>
                  <p className="text-sm text-gray-600">Market Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">8.7%</p>
                  <p className="text-sm text-gray-600">Growth Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">127</p>
                  <p className="text-sm text-gray-600">Key Players</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">7.2/10</p>
                  <p className="text-sm text-gray-600">Competition Level</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Industry Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {industryMetrics.map(metric => (
                    <div key={metric.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{metric.name}</span>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(metric.trend)}
                          <span className="font-bold">{metric.value} {metric.unit}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Benchmark: {metric.benchmark} {metric.unit}</span>
                        <span className={metric.change > 0 ? 'text-green-600' : 'text-red-600'}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                      <Progress 
                        value={(metric.value / metric.benchmark) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Market Share Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitors.map(competitor => (
                      <div key={competitor.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{competitor.name}</span>
                          <span className="font-bold">{competitor.marketShare}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${competitor.marketShare}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Revenue: {formatCurrency(competitor.revenue)}</span>
                          <span className="text-green-600">+{competitor.growth}% growth</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Market Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {marketTrends.map(trend => (
                <Card key={trend.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{trend.name}</CardTitle>
                      <Badge className={getImpactColor(trend.impact)}>
                        {trend.impact} impact
                      </Badge>
                    </div>
                    <CardDescription>{trend.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Timeframe:</span>
                      <span className="font-medium">{trend.timeframe}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={trend.confidence} className="w-20 h-2" />
                        <span className="font-medium">{trend.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Direction:</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(trend.direction)}
                        <span className="font-medium capitalize">{trend.direction}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {competitors.map(competitor => (
                <Card key={competitor.id}>
                  <CardHeader>
                    <CardTitle>{competitor.name}</CardTitle>
                    <CardDescription>{competitor.marketShare}% market share</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Revenue</p>
                        <p className="font-bold">{formatCurrency(competitor.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Growth</p>
                        <p className="font-bold text-green-600">+{competitor.growth}%</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Key Strengths</h4>
                      <ul className="space-y-1 text-sm">
                        {competitor.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Recent Moves</h4>
                      <ul className="space-y-1 text-sm">
                        {competitor.recentMoves.map((move, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-blue-500" />
                            <span>{move}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Market Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="p-1 bg-green-100 rounded-full mt-0.5">
                        <ArrowUp className="h-3 w-3 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Emerging Markets</p>
                        <p className="text-sm text-gray-600">Untapped markets in developing regions</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                        <Zap className="h-3 w-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Technology Integration</p>
                        <p className="text-sm text-gray-600">AI and automation opportunities</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-1 bg-purple-100 rounded-full mt-0.5">
                        <Users className="h-3 w-3 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Customer Segments</p>
                        <p className="text-sm text-gray-600">New customer segments to target</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="p-1 bg-red-100 rounded-full mt-0.5">
                        <ArrowDown className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Economic Downturn</p>
                        <p className="text-sm text-gray-600">Potential recession impact</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-1 bg-yellow-100 rounded-full mt-0.5">
                        <AlertCircle className="h-3 w-3 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Regulatory Changes</p>
                        <p className="text-sm text-gray-600">New compliance requirements</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-1 bg-orange-100 rounded-full mt-0.5">
                        <Building className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Competition</p>
                        <p className="text-sm text-gray-600">Increased competitive pressure</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default IndustryAnalysis;
