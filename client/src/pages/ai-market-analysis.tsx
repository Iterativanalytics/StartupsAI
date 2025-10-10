
import React, { useState } from 'react';
import { useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Brain, TrendingUp, Target, AlertTriangle, CheckCircle, BarChart3, Globe, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface MarketTrend {
  id: string;
  trend: string;
  impact: 'high' | 'medium' | 'low';
  direction: 'growing' | 'declining' | 'stable';
  confidence: number;
  description: string;
}

interface Competitor {
  id: string;
  name: string;
  marketShare: number;
  revenue: string;
  strengths: string[];
  weaknesses: string[];
  threat: 'high' | 'medium' | 'low';
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  marketSize: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  potential: number;
}

function AIMarketAnalysis() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Mock AI analysis data
  const marketTrends: MarketTrend[] = [
    {
      id: '1',
      trend: 'AI-Driven Business Intelligence',
      impact: 'high',
      direction: 'growing',
      confidence: 94,
      description: 'Increasing demand for AI-powered analytics tools is creating new market opportunities'
    },
    {
      id: '2',
      trend: 'Remote Collaboration Tools',
      impact: 'high',
      direction: 'growing',
      confidence: 87,
      description: 'Post-pandemic shift to hybrid work models drives demand for collaboration platforms'
    },
    {
      id: '3',
      trend: 'Legacy Software Migration',
      impact: 'medium',
      direction: 'declining',
      confidence: 72,
      description: 'Traditional desktop software losing market share to cloud-based solutions'
    }
  ];

  const competitors: Competitor[] = [
    {
      id: '1',
      name: 'Microsoft Business Central',
      marketShare: 32,
      revenue: '$8.2B',
      strengths: ['Enterprise integration', 'Brand recognition', 'Global presence'],
      weaknesses: ['Complex setup', 'High cost', 'Limited customization'],
      threat: 'high'
    },
    {
      id: '2',
      name: 'Salesforce Platform',
      marketShare: 18,
      revenue: '$4.9B',
      strengths: ['CRM integration', 'Extensive ecosystem', 'Cloud-native'],
      weaknesses: ['Expensive for SMBs', 'Steep learning curve', 'Over-engineering'],
      threat: 'medium'
    },
    {
      id: '3',
      name: 'Emerging Startups',
      marketShare: 15,
      revenue: '$2.1B',
      strengths: ['Innovation', 'Agility', 'Niche focus'],
      weaknesses: ['Limited resources', 'Brand awareness', 'Market reach'],
      threat: 'low'
    }
  ];

  const opportunities: Opportunity[] = [
    {
      id: '1',
      title: 'SMB Market Penetration',
      description: 'Underserved small-medium businesses seeking affordable business intelligence',
      marketSize: '$24B',
      difficulty: 'medium',
      timeframe: '6-12 months',
      potential: 85
    },
    {
      id: '2',
      title: 'Industry-Specific Solutions',
      description: 'Vertical specialization in healthcare, manufacturing, and retail sectors',
      marketSize: '$18B',
      difficulty: 'hard',
      timeframe: '12-18 months',
      potential: 78
    },
    {
      id: '3',
      title: 'International Expansion',
      description: 'European and Asian markets with growing demand for business tools',
      marketSize: '$42B',
      difficulty: 'hard',
      timeframe: '18-24 months',
      potential: 92
    }
  ];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast({
        title: "Analysis Complete",
        description: "AI has generated comprehensive market insights for your business",
      });
    }, 3000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!analysisComplete) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center p-12">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">AI Market Analysis</CardTitle>
            <CardDescription>
              Get comprehensive market insights powered by artificial intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAnalyzing ? (
              <div className="space-y-4">
                <div className="text-lg font-medium">Analyzing Market Data...</div>
                <Progress value={66} className="w-full" />
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Market size analysis complete</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Competitor intelligence gathered</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent" />
                    <span>Trend analysis in progress</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                    <span>Opportunity identification pending</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Our AI will analyze market trends, competitive landscape, and identify 
                  opportunities specific to your business model and industry.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Globe className="h-6 w-6 text-blue-500 mb-2" />
                    <span>Market Trends</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 text-green-500 mb-2" />
                    <span>Competitor Analysis</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Target className="h-6 w-6 text-purple-500 mb-2" />
                    <span>Opportunities</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-orange-500 mb-2" />
                    <span>Market Sizing</span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  onClick={handleRunAnalysis}
                  className="bg-gradient-to-r from-purple-600 to-teal-600"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Start AI Analysis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AI Market Analysis Results</h1>
            <p className="text-gray-600">Comprehensive market insights generated by AI</p>
          </div>
          <Button onClick={handleRunAnalysis} variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6">
            {marketTrends.map(trend => (
              <Card key={trend.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{trend.trend}</h3>
                      <p className="text-gray-600">{trend.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getImpactColor(trend.impact)}>
                        {trend.impact} impact
                      </Badge>
                      <Badge variant={trend.direction === 'growing' ? 'default' : 'secondary'}>
                        {trend.direction === 'growing' ? '↗' : trend.direction === 'declining' ? '↘' : '→'} {trend.direction}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>AI Confidence</span>
                        <span>{trend.confidence}%</span>
                      </div>
                      <Progress value={trend.confidence} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <div className="grid gap-6">
            {competitors.map(competitor => (
              <Card key={competitor.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{competitor.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Market Share: {competitor.marketShare}%</span>
                        <span>Revenue: {competitor.revenue}</span>
                      </div>
                    </div>
                    <Badge className={getThreatColor(competitor.threat)}>
                      {competitor.threat} threat
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                      <ul className="space-y-1 text-sm">
                        {competitor.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-600 mb-2">Weaknesses</h4>
                      <ul className="space-y-1 text-sm">
                        {competitor.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid gap-6">
            {opportunities.map(opportunity => (
              <Card key={opportunity.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{opportunity.title}</h3>
                      <p className="text-gray-600 mb-2">{opportunity.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Market Size: {opportunity.marketSize}</span>
                        </span>
                        <span>Timeline: {opportunity.timeframe}</span>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(opportunity.difficulty)}>
                      {opportunity.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Opportunity Potential</span>
                      <span>{opportunity.potential}%</span>
                    </div>
                    <Progress value={opportunity.potential} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI Strategic Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Immediate Actions (0-3 months)</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Focus on SMB market penetration with competitive pricing</li>
                    <li>• Develop AI-powered features to differentiate from legacy competitors</li>
                    <li>• Partner with industry consultants for faster market entry</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Medium-term Strategy (3-12 months)</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Build industry-specific vertical solutions</li>
                    <li>• Establish strategic partnerships with complementary platforms</li>
                    <li>• Invest in customer success to improve retention rates</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Long-term Vision (12+ months)</h4>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li>• Expand internationally to European markets</li>
                    <li>• Develop enterprise-grade features for larger clients</li>
                    <li>• Consider strategic acquisitions of complementary technologies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AIMarketAnalysis;
