import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { 
  Target, Play, Clock, Users, Award, CheckCircle, Star, ArrowRight,
  Zap, Building, DollarSign, TrendingUp, Globe, Shield, FileText, Presentation
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductModule {
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

interface ProductFramework {
  id: string;
  name: string;
  description: string;
  steps: number;
  duration: string;
  icon: any;
  color: string;
  useCase: string;
}

function EducationProduct() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Mock data for product modules
  const productModules: ProductModule[] = [
    {
      id: 'product-market-fit',
      title: 'Product-Market Fit',
      description: 'Discover how to identify, achieve, and measure product-market fit for sustainable growth.',
      duration: 85,
      lessons: 8,
      completed: false,
      progress: 40,
      difficulty: 'Intermediate',
      topics: ['Customer Discovery', 'Market Validation', 'Metrics', 'Iteration'],
      type: 'workshop'
    },
    {
      id: 'user-research',
      title: 'User Research & Discovery',
      description: 'Learn comprehensive user research methods to understand your customers deeply.',
      duration: 70,
      lessons: 9,
      completed: false,
      progress: 20,
      difficulty: 'Beginner',
      topics: ['User Interviews', 'Surveys', 'Personas', 'Journey Mapping'],
      type: 'video'
    },
    {
      id: 'mvp-development',
      title: 'MVP Development',
      description: 'Build your Minimum Viable Product using lean startup principles and rapid prototyping.',
      duration: 95,
      lessons: 10,
      completed: false,
      progress: 0,
      difficulty: 'Intermediate',
      topics: ['Prototyping', 'User Testing', 'Feature Prioritization', 'Technical Architecture'],
      type: 'workshop'
    },
    {
      id: 'product-strategy',
      title: 'Product Strategy & Roadmapping',
      description: 'Develop a comprehensive product strategy and create effective roadmaps.',
      duration: 60,
      lessons: 6,
      completed: false,
      progress: 0,
      difficulty: 'Advanced',
      topics: ['Strategic Planning', 'Roadmapping', 'Feature Planning', 'Stakeholder Alignment'],
      type: 'case-study'
    },
    {
      id: 'user-experience',
      title: 'User Experience Design',
      description: 'Master UX design principles to create intuitive and engaging user experiences.',
      duration: 80,
      lessons: 8,
      completed: false,
      progress: 0,
      difficulty: 'Intermediate',
      topics: ['Wireframing', 'Prototyping', 'Usability Testing', 'Design Systems'],
      type: 'template'
    },
    {
      id: 'analytics-metrics',
      title: 'Product Analytics & Metrics',
      description: 'Learn to measure and analyze product performance using key metrics and analytics.',
      duration: 55,
      lessons: 7,
      completed: false,
      progress: 0,
      difficulty: 'Intermediate',
      topics: ['KPI Definition', 'Analytics Tools', 'A/B Testing', 'Data Interpretation'],
      type: 'video'
    }
  ];

  const productFrameworks: ProductFramework[] = [
    {
      id: 'lean-startup',
      name: 'Lean Startup',
      description: 'Build-Measure-Learn cycle for rapid product iteration',
      steps: 3,
      duration: '2-4 weeks',
      icon: Zap,
      color: 'blue',
      useCase: 'Early-stage product development'
    },
    {
      id: 'design-thinking',
      name: 'Design Thinking',
      description: 'Human-centered approach to innovation and problem-solving',
      steps: 5,
      duration: '4-6 weeks',
      icon: Target,
      color: 'purple',
      useCase: 'Complex problem solving'
    },
    {
      id: 'agile-development',
      name: 'Agile Development',
      description: 'Iterative development methodology for software products',
      steps: 4,
      duration: '2-3 weeks per sprint',
      icon: Building,
      color: 'green',
      useCase: 'Software development'
    },
    {
      id: 'jobs-to-be-done',
      name: 'Jobs to be Done',
      description: 'Focus on customer jobs and outcomes rather than features',
      steps: 4,
      duration: '3-4 weeks',
      icon: Users,
      color: 'orange',
      useCase: 'Feature prioritization'
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

  const completedModules = productModules.filter(module => module.completed).length;
  const totalProgress = Math.round(
    productModules.reduce((sum, module) => sum + module.progress, 0) / productModules.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Product Development
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Learn product-market fit and development strategies to build products that customers love.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                  <p className="text-sm text-gray-600">Product Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">7.5h</p>
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
            <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
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
                      <p className="font-bold">{completedModules} / {productModules.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time Invested</p>
                      <p className="font-bold">2.0 hours</p>
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
                        <p className="font-medium">Achieve Product-Market Fit</p>
                        <p className="text-sm text-gray-600">Build products customers love</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Star className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Master User Research</p>
                        <p className="text-sm text-gray-600">Understand your customers deeply</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Build Better MVPs</p>
                        <p className="text-sm text-gray-600">Rapid prototyping and validation</p>
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
              {productModules.map(module => {
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

          {/* Frameworks Tab */}
          <TabsContent value="frameworks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productFrameworks.map(framework => {
                const Icon = framework.icon;
                return (
                  <Card key={framework.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${framework.color}-100 rounded-lg`}>
                          <Icon className={`h-5 w-5 text-${framework.color}-600`} />
                        </div>
                        <div>
                          <CardTitle>{framework.name}</CardTitle>
                          <CardDescription>{framework.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Steps</p>
                          <p className="font-bold">{framework.steps}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-bold">{framework.duration}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Best For</p>
                        <p className="text-sm text-gray-600">{framework.useCase}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Learn Framework
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default EducationProduct;
