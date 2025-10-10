import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { 
  Target, Shield, Zap, TrendingUp, Award, Users, Building, Globe,
  BarChart3, PieChart, ArrowUp, ArrowDown, CheckCircle, XCircle,
  AlertCircle, Info, Star, Trophy, Crown, Diamond
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CompetitiveFactor {
  id: string;
  name: string;
  category: 'technology' | 'market' | 'operational' | 'financial';
  score: number;
  weight: number;
  description: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface Competitor {
  id: string;
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  threatLevel: 'low' | 'medium' | 'high';
  recentMoves: string[];
}

function CompetitiveAdvantage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Mock data for competitive factors
  const competitiveFactors: CompetitiveFactor[] = [
    {
      id: 'tech-innovation',
      name: 'Technology Innovation',
      category: 'technology',
      score: 85,
      weight: 25,
      description: 'Your technological capabilities and innovation pipeline',
      strengths: ['AI/ML expertise', 'Cloud-native architecture', 'API-first design'],
      weaknesses: ['Limited R&D budget', 'Small tech team'],
      opportunities: ['Open source adoption', 'Partnership with tech giants'],
      threats: ['Rapid tech changes', 'Big tech competition']
    },
    {
      id: 'market-position',
      name: 'Market Position',
      category: 'market',
      score: 72,
      weight: 30,
      description: 'Your position in the target market',
      strengths: ['First-mover advantage', 'Strong brand recognition', 'Customer loyalty'],
      weaknesses: ['Limited market share', 'High customer acquisition cost'],
      opportunities: ['Market expansion', 'International growth'],
      threats: ['New entrants', 'Market saturation']
    },
    {
      id: 'operational-efficiency',
      name: 'Operational Efficiency',
      category: 'operational',
      score: 68,
      weight: 20,
      description: 'Your operational processes and efficiency',
      strengths: ['Lean operations', 'Automated processes', 'Remote-first culture'],
      weaknesses: ['Limited scale', 'Manual processes in some areas'],
      opportunities: ['Process automation', 'Outsourcing partnerships'],
      threats: ['Rising operational costs', 'Talent shortage']
    },
    {
      id: 'financial-strength',
      name: 'Financial Strength',
      category: 'financial',
      score: 78,
      weight: 25,
      description: 'Your financial position and resources',
      strengths: ['Strong cash flow', 'Low debt', 'High margins'],
      weaknesses: ['Limited funding', 'High burn rate'],
      opportunities: ['Additional funding', 'Revenue diversification'],
      threats: ['Economic downturn', 'Increased competition']
    }
  ];

  const competitors: Competitor[] = [
    {
      id: 'competitor-1',
      name: 'TechCorp Inc.',
      marketShare: 35,
      strengths: ['Large R&D budget', 'Global presence', 'Strong partnerships'],
      weaknesses: ['Slow innovation', 'High costs', 'Complex bureaucracy'],
      threatLevel: 'high',
      recentMoves: ['Launched new AI product', 'Acquired smaller competitor', 'Expanded to Europe']
    },
    {
      id: 'competitor-2',
      name: 'StartupXYZ',
      marketShare: 15,
      strengths: ['Agile development', 'Innovative features', 'Strong community'],
      weaknesses: ['Limited resources', 'Small team', 'Unproven business model'],
      threatLevel: 'medium',
      recentMoves: ['Raised Series A funding', 'Hired key executives', 'Launched mobile app']
    },
    {
      id: 'competitor-3',
      name: 'Enterprise Solutions',
      marketShare: 25,
      strengths: ['Enterprise focus', 'Established relationships', 'Compliance expertise'],
      weaknesses: ['Legacy systems', 'Slow to adapt', 'High prices'],
      threatLevel: 'low',
      recentMoves: ['Updated pricing model', 'Partnership with cloud provider', 'New compliance features']
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technology': return Zap;
      case 'market': return Globe;
      case 'operational': return Building;
      case 'financial': return TrendingUp;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technology': return 'blue';
      case 'market': return 'green';
      case 'operational': return 'purple';
      case 'financial': return 'orange';
      default: return 'gray';
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallScore = Math.round(
    competitiveFactors.reduce((sum, factor) => sum + (factor.score * factor.weight / 100), 0)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Competitive Analysis
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Analyze your competitive positioning and identify key advantages in the market.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Trophy className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{overallScore}%</p>
                  <p className="text-sm text-gray-600">Overall Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                  <p className="text-sm text-gray-600">Key Advantages</p>
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
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600">Main Competitors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">+12%</p>
                  <p className="text-sm text-gray-600">Market Position</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="factors">Competitive Factors</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Competitive Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {competitiveFactors.map(factor => {
                    const Icon = getCategoryIcon(factor.category);
                    const color = getCategoryColor(factor.category);
                    return (
                      <div key={factor.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 text-${color}-600`} />
                            <span className="font-medium">{factor.name}</span>
                          </div>
                          <span className={`font-bold ${getScoreColor(factor.score)}`}>
                            {factor.score}%
                          </span>
                        </div>
                        <Progress value={factor.score} className="h-2" />
                        <p className="text-sm text-gray-600">{factor.description}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Market Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">25%</div>
                      <p className="text-sm text-gray-600">Your Market Share</p>
                    </div>
                    <div className="space-y-2">
                      {competitors.map(competitor => (
                        <div key={competitor.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{competitor.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${competitor.marketShare}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{competitor.marketShare}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Competitive Factors Tab */}
          <TabsContent value="factors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {competitiveFactors.map(factor => {
                const Icon = getCategoryIcon(factor.category);
                const color = getCategoryColor(factor.category);
                return (
                  <Card key={factor.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-5 w-5 text-${color}-600`} />
                          <CardTitle>{factor.name}</CardTitle>
                        </div>
                        <Badge className={`bg-${color}-100 text-${color}-700`}>
                          {factor.score}%
                        </Badge>
                      </div>
                      <CardDescription>{factor.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                        <div className="space-y-1">
                          {factor.strengths.map((strength, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>{strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-700 mb-2">Weaknesses</h4>
                        <div className="space-y-1">
                          {factor.weaknesses.map((weakness, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span>{weakness}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {competitors.map(competitor => (
                <Card key={competitor.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{competitor.name}</CardTitle>
                      <Badge className={getThreatColor(competitor.threatLevel)}>
                        {competitor.threatLevel} threat
                      </Badge>
                    </div>
                    <CardDescription>{competitor.marketShare}% market share</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                      <ul className="space-y-1 text-sm">
                        {competitor.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">Weaknesses</h4>
                      <ul className="space-y-1 text-sm">
                        {competitor.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <XCircle className="h-3 w-3 text-red-600" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">Recent Moves</h4>
                      <ul className="space-y-1 text-sm">
                        {competitor.recentMoves.map((move, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <ArrowUp className="h-3 w-3 text-blue-600" />
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

          {/* SWOT Analysis Tab */}
          <TabsContent value="swot" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Strong technology foundation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Experienced founding team</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>First-mover advantage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Strong customer relationships</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Limited financial resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Small team size</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Limited market presence</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Dependency on key customers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span>Market expansion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span>Technology partnerships</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span>New product development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span>International markets</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span>Increased competition</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span>Economic downturn</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span>Technology disruption</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span>Regulatory changes</span>
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

export default CompetitiveAdvantage;
