import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { 
  Trophy, Award, Star, Crown, Diamond, Target, TrendingUp, Users, 
  Building, DollarSign, Zap, Shield, Globe, BarChart3, PieChart,
  ArrowUp, ArrowDown, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StartupRanking {
  id: string;
  name: string;
  rank: number;
  score: number;
  category: string;
  metrics: {
    revenue: number;
    growth: number;
    funding: number;
    team: number;
    innovation: number;
  };
  badges: string[];
  description: string;
  logo: string;
}

interface LeagueCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  startups: number;
}

interface Benchmark {
  metric: string;
  yourValue: number;
  industryAverage: number;
  topPerformer: number;
  percentile: number;
}

function StartupLeague() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('rankings');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Mock data for startup rankings
  const startupRankings: StartupRanking[] = [
    {
      id: 'startup-1',
      name: 'TechFlow Solutions',
      rank: 1,
      score: 95,
      category: 'SaaS',
      metrics: {
        revenue: 2500000,
        growth: 45.2,
        funding: 15000000,
        team: 45,
        innovation: 92
      },
      badges: ['Series A', 'Fast Growing', 'Innovation Leader'],
      description: 'Leading SaaS platform for workflow automation',
      logo: 'https://via.placeholder.com/40'
    },
    {
      id: 'startup-2',
      name: 'DataVault Inc.',
      rank: 2,
      score: 88,
      category: 'Data Analytics',
      metrics: {
        revenue: 1800000,
        growth: 38.7,
        funding: 12000000,
        team: 32,
        innovation: 85
      },
      badges: ['Seed', 'Data Leader', 'AI Focus'],
      description: 'Advanced data analytics and AI solutions',
      logo: 'https://via.placeholder.com/40'
    },
    {
      id: 'startup-3',
      name: 'CloudScale Systems',
      rank: 3,
      score: 82,
      category: 'Cloud Infrastructure',
      metrics: {
        revenue: 3200000,
        growth: 28.4,
        funding: 25000000,
        team: 67,
        innovation: 78
      },
      badges: ['Series B', 'Enterprise', 'Scalable'],
      description: 'Enterprise cloud infrastructure solutions',
      logo: 'https://via.placeholder.com/40'
    },
    {
      id: 'your-startup',
      name: 'Your Startup',
      rank: 15,
      score: 72,
      category: 'Technology',
      metrics: {
        revenue: 850000,
        growth: 65.3,
        funding: 5000000,
        team: 18,
        innovation: 88
      },
      badges: ['Seed', 'High Growth', 'Innovation'],
      description: 'Your innovative technology solution',
      logo: 'https://via.placeholder.com/40'
    }
  ];

  const leagueCategories: LeagueCategory[] = [
    {
      id: 'all',
      name: 'All Startups',
      description: 'Complete ranking across all categories',
      icon: Trophy,
      color: 'gold',
      startups: 127
    },
    {
      id: 'saas',
      name: 'SaaS',
      description: 'Software as a Service companies',
      icon: Building,
      color: 'blue',
      startups: 45
    },
    {
      id: 'fintech',
      name: 'FinTech',
      description: 'Financial technology startups',
      icon: DollarSign,
      color: 'green',
      startups: 32
    },
    {
      id: 'healthtech',
      name: 'HealthTech',
      description: 'Healthcare technology companies',
      icon: Shield,
      color: 'red',
      startups: 28
    },
    {
      id: 'edtech',
      name: 'EdTech',
      description: 'Education technology startups',
      icon: Users,
      color: 'purple',
      startups: 22
    }
  ];

  const benchmarks: Benchmark[] = [
    {
      metric: 'Revenue Growth',
      yourValue: 65.3,
      industryAverage: 25.4,
      topPerformer: 85.7,
      percentile: 78
    },
    {
      metric: 'Team Size',
      yourValue: 18,
      industryAverage: 24,
      topPerformer: 45,
      percentile: 45
    },
    {
      metric: 'Funding Raised',
      yourValue: 5000000,
      industryAverage: 3200000,
      topPerformer: 15000000,
      percentile: 62
    },
    {
      metric: 'Innovation Score',
      yourValue: 88,
      industryAverage: 72,
      topPerformer: 95,
      percentile: 82
    }
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank <= 3) return <Trophy className="h-5 w-5 text-yellow-600" />;
    if (rank <= 10) return <Award className="h-5 w-5 text-blue-600" />;
    return <Star className="h-5 w-5 text-gray-400" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 bg-yellow-50';
    if (rank <= 3) return 'text-yellow-600 bg-yellow-50';
    if (rank <= 10) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = leagueCategories.find(c => c.id === categoryId);
    return category ? category.icon : Trophy;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = leagueCategories.find(c => c.id === categoryId);
    return category ? category.color : 'gray';
  };

  const filteredRankings = selectedCategory === 'all' 
    ? startupRankings 
    : startupRankings.filter(startup => startup.category.toLowerCase() === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Startup League
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Compare your startup against industry benchmarks and see how you rank among your peers.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">#15</p>
                  <p className="text-sm text-gray-600">Your Ranking</p>
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
                  <p className="text-2xl font-bold text-gray-900">72%</p>
                  <p className="text-sm text-gray-600">Overall Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">127</p>
                  <p className="text-sm text-gray-600">Total Startups</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">78%</p>
                  <p className="text-sm text-gray-600">Percentile</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Rankings Tab */}
          <TabsContent value="rankings" className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {leagueCategories.map(category => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.name} ({category.startups})
                  </Button>
                );
              })}
            </div>

            <div className="space-y-4">
              {filteredRankings.map((startup, index) => (
                <Card key={startup.id} className={startup.id === 'your-startup' ? 'ring-2 ring-blue-500' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(startup.rank)}
                          <span className="text-2xl font-bold">#{startup.rank}</span>
                        </div>
                        <img
                          src={startup.logo}
                          alt={startup.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-bold">{startup.name}</h3>
                          <p className="text-sm text-gray-600">{startup.description}</p>
                          <div className="flex gap-1 mt-1">
                            {startup.badges.map((badge, badgeIndex) => (
                              <Badge key={badgeIndex} variant="secondary" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold">{startup.score}%</span>
                          <Badge className={getRankColor(startup.rank)}>
                            Score
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Revenue</p>
                            <p className="font-bold">{formatCurrency(startup.metrics.revenue)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Growth</p>
                            <p className="font-bold text-green-600">+{startup.metrics.growth}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Funding</p>
                            <p className="font-bold">{formatCurrency(startup.metrics.funding)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Team</p>
                            <p className="font-bold">{startup.metrics.team}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Benchmarks Tab */}
          <TabsContent value="benchmarks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {benchmarks.map((benchmark, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{benchmark.metric}</CardTitle>
                    <CardDescription>
                      Your performance vs industry benchmarks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Your Value</span>
                        <span className="font-bold text-blue-600">
                          {benchmark.metric === 'Funding Raised' 
                            ? formatCurrency(benchmark.yourValue)
                            : benchmark.yourValue + (benchmark.metric === 'Revenue Growth' ? '%' : '')
                          }
                        </span>
                      </div>
                      <Progress value={(benchmark.yourValue / benchmark.topPerformer) * 100} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Industry Average</span>
                        <span className="text-sm">
                          {benchmark.metric === 'Funding Raised' 
                            ? formatCurrency(benchmark.industryAverage)
                            : benchmark.industryAverage + (benchmark.metric === 'Revenue Growth' ? '%' : '')
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Top Performer</span>
                        <span className="text-sm">
                          {benchmark.metric === 'Funding Raised' 
                            ? formatCurrency(benchmark.topPerformer)
                            : benchmark.topPerformer + (benchmark.metric === 'Revenue Growth' ? '%' : '')
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Percentile</span>
                        <Badge className="bg-green-100 text-green-700">
                          {benchmark.percentile}th percentile
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leagueCategories.slice(1).map(category => {
                const Icon = category.icon;
                return (
                  <Card key={category.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                          <Icon className={`h-5 w-5 text-${category.color}-600`} />
                        </div>
                        <div>
                          <CardTitle>{category.name}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">{category.startups}</div>
                        <p className="text-sm text-gray-600">Startups in this category</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        View Rankings
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Your Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">High Growth Rate</p>
                        <p className="text-sm text-gray-600">65.3% growth rate achieved</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Innovation Leader</p>
                        <p className="text-sm text-gray-600">88% innovation score</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Seed Stage Success</p>
                        <p className="text-sm text-gray-600">Successfully raised seed funding</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    Next Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">Top 10 Ranking</p>
                        <p className="text-sm text-gray-600">Need 15+ points to reach top 10</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Series A Funding</p>
                        <p className="text-sm text-gray-600">Target $10M+ funding round</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">Team Expansion</p>
                        <p className="text-sm text-gray-600">Grow team to 30+ members</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default StartupLeague;
