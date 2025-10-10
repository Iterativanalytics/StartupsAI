import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { 
  DollarSign, Play, Clock, Users, Award, CheckCircle, Star, ArrowRight,
  Target, Zap, Building, TrendingUp, Globe, Shield, FileText, Presentation
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FundingModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  lessons: number;
  completed: boolean;
  progress: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  type: 'video' | 'workshop' | 'template' | 'case-study';
}

interface FundingStage {
  id: string;
  name: string;
  description: string;
  amount: string;
  equity: string;
  duration: string;
  keyInvestors: string[];
  requirements: string[];
}

function EducationFunding() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Mock data for funding modules
  const fundingModules: FundingModule[] = [
    {
      id: 'pitch-deck',
      title: 'Pitch Deck Mastery',
      description: 'Create compelling pitch decks that win over investors and secure funding.',
      duration: 90,
      lessons: 12,
      completed: false,
      progress: 25,
      difficulty: 'Intermediate',
      topics: ['Storytelling', 'Financial Projections', 'Market Analysis', 'Team Slide'],
      type: 'workshop'
    },
    {
      id: 'valuation',
      title: 'Startup Valuation',
      description: 'Learn how to value your startup and negotiate fair terms with investors.',
      duration: 75,
      lessons: 8,
      completed: false,
      progress: 0,
      difficulty: 'Advanced',
      topics: ['DCF Analysis', 'Comparable Companies', 'Market Multiples', 'Risk Assessment'],
      type: 'video'
    },
    {
      id: 'term-sheets',
      title: 'Term Sheet Negotiation',
      description: 'Understand and negotiate term sheets to protect your interests.',
      duration: 60,
      lessons: 6,
      completed: false,
      progress: 0,
      difficulty: 'Advanced',
      topics: ['Liquidation Preferences', 'Anti-dilution', 'Board Rights', 'Vesting'],
      type: 'case-study'
    },
    {
      id: 'due-diligence',
      title: 'Due Diligence Process',
      description: 'Prepare for and navigate the investor due diligence process.',
      duration: 45,
      lessons: 5,
      completed: false,
      progress: 0,
      difficulty: 'Intermediate',
      topics: ['Documentation', 'Financial Records', 'Legal Structure', 'IP Protection'],
      type: 'template'
    },
    {
      id: 'investor-relations',
      title: 'Investor Relations',
      description: 'Build and maintain strong relationships with investors and stakeholders.',
      duration: 50,
      lessons: 7,
      completed: false,
      progress: 0,
      difficulty: 'Beginner',
      topics: ['Communication', 'Reporting', 'Board Meetings', 'Updates'],
      type: 'workshop'
    },
    {
      id: 'alternative-funding',
      title: 'Alternative Funding Sources',
      description: 'Explore grants, crowdfunding, and other non-equity funding options.',
      duration: 40,
      lessons: 5,
      completed: false,
      progress: 0,
      difficulty: 'Beginner',
      topics: ['Grants', 'Crowdfunding', 'Revenue-based Financing', 'SBIR'],
      type: 'video'
    }
  ];

  const fundingStages: FundingStage[] = [
    {
      id: 'pre-seed',
      name: 'Pre-Seed',
      description: 'Initial funding to validate your idea and build MVP',
      amount: '$50K - $500K',
      equity: '5-15%',
      duration: '6-12 months',
      keyInvestors: ['Friends & Family', 'Angel Investors', 'Accelerators'],
      requirements: ['Idea validation', 'Basic prototype', 'Founding team']
    },
    {
      id: 'seed',
      name: 'Seed Round',
      description: 'Funding to build product and achieve product-market fit',
      amount: '$500K - $2M',
      equity: '10-25%',
      duration: '12-18 months',
      keyInvestors: ['Angel Investors', 'Seed VCs', 'Micro VCs'],
      requirements: ['Working product', 'Early customers', 'Revenue traction']
    },
    {
      id: 'series-a',
      name: 'Series A',
      description: 'Scaling funding to grow team and expand market reach',
      amount: '$2M - $15M',
      equity: '15-30%',
      duration: '18-24 months',
      keyInvestors: ['VCs', 'Growth Investors', 'Strategic Investors'],
      requirements: ['Product-market fit', 'Strong metrics', 'Scalable business model']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'Advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'workshop': return Users;
      case 'template': return FileText;
      case 'case-study': return Presentation;
      default: return Play;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'blue';
      case 'workshop': return 'purple';
      case 'template': return 'green';
      case 'case-study': return 'orange';
      default: return 'gray';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const completedModules = fundingModules.filter(module => module.completed).length;
  const totalProgress = Math.round(
    fundingModules.reduce((sum, module) => sum + module.progress, 0) / fundingModules.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Fundraising Masterclass
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Complete guide to raising capital - from seed rounds to Series A and beyond.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                  <p className="text-sm text-gray-600">Funding Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{completedModules}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">6.5h</p>
                  <p className="text-sm text-gray-600">Total Duration</p>
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
                  <p className="text-2xl font-bold text-gray-900">{totalProgress}%</p>
                  <p className="text-sm text-gray-600">Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="stages">Funding Stages</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm font-bold">{totalProgress}%</span>
                    </div>
                    <Progress value={totalProgress} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Completed Modules</p>
                      <p className="font-bold">{completedModules} / {fundingModules.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time Invested</p>
                      <p className="font-bold">1.5 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Key Learning Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Create Winning Pitch Decks</p>
                        <p className="text-sm text-gray-600">Master the art of storytelling</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Star className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Understand Valuation Methods</p>
                        <p className="text-sm text-gray-600">Learn startup valuation techniques</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Negotiate Term Sheets</p>
                        <p className="text-sm text-gray-600">Protect your interests</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {fundingModules.map(module => {
                const TypeIcon = getTypeIcon(module.type);
                const typeColor = getTypeColor(module.type);
                return (
                  <Card key={module.id} className={module.completed ? 'ring-2 ring-green-500' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`bg-${typeColor}-100 text-${typeColor}-700`}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {module.type}
                          </Badge>
                          {module.completed && (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{formatDuration(module.duration)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span>{module.lessons} lessons</span>
                        </div>
                        <Badge className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Topics Covered</p>
                        <div className="flex flex-wrap gap-1">
                          {module.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" disabled={module.completed}>
                        {module.completed ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </>
                        ) : module.progress > 0 ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Continue
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Module
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Funding Stages Tab */}
          <TabsContent value="stages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {fundingStages.map(stage => (
                <Card key={stage.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{stage.name}</CardTitle>
                    <CardDescription>{stage.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Funding Amount</p>
                        <p className="text-lg font-bold text-green-600">{stage.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Equity Given</p>
                        <p className="text-lg font-bold">{stage.equity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Duration</p>
                        <p className="text-sm">{stage.duration}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Key Investors</p>
                      <div className="flex flex-wrap gap-1">
                        {stage.keyInvestors.map((investor, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {investor}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Requirements</p>
                      <ul className="space-y-1 text-sm">
                        {stage.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default EducationFunding;
