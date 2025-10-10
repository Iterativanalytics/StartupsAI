import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { 
  Book, Play, Clock, Users, Award, CheckCircle, Star, ArrowRight,
  Target, Zap, Building, DollarSign, TrendingUp, Globe, Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  lessons: number;
  completed: boolean;
  progress: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  modules: number;
  duration: number;
  level: string;
  icon: any;
  color: string;
}

function EducationFundamentals() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Mock data for course modules
  const courseModules: CourseModule[] = [
    {
      id: 'business-model',
      title: 'Business Model Canvas',
      description: 'Learn how to design and validate your business model using proven frameworks.',
      duration: 45,
      lessons: 6,
      completed: true,
      progress: 100,
      difficulty: 'Beginner',
      topics: ['Value Proposition', 'Customer Segments', 'Revenue Streams', 'Key Partnerships']
    },
    {
      id: 'market-research',
      title: 'Market Research & Validation',
      description: 'Master the art of market research and customer validation techniques.',
      duration: 60,
      lessons: 8,
      completed: false,
      progress: 75,
      difficulty: 'Beginner',
      topics: ['Customer Interviews', 'Market Sizing', 'Competitive Analysis', 'User Personas']
    },
    {
      id: 'mvp-development',
      title: 'MVP Development',
      description: 'Build your Minimum Viable Product and learn rapid prototyping techniques.',
      duration: 90,
      lessons: 10,
      completed: false,
      progress: 30,
      difficulty: 'Intermediate',
      topics: ['Prototyping', 'User Testing', 'Feature Prioritization', 'Technical Architecture']
    },
    {
      id: 'team-building',
      title: 'Team Building & Culture',
      description: 'Learn how to build and manage high-performing startup teams.',
      duration: 75,
      lessons: 7,
      completed: false,
      progress: 0,
      difficulty: 'Intermediate',
      topics: ['Hiring', 'Culture', 'Remote Teams', 'Performance Management']
    },
    {
      id: 'legal-basics',
      title: 'Legal & Compliance Basics',
      description: 'Understand essential legal requirements for startups and founders.',
      duration: 50,
      lessons: 5,
      completed: false,
      progress: 0,
      difficulty: 'Beginner',
      topics: ['Entity Formation', 'IP Protection', 'Contracts', 'Regulatory Compliance']
    },
    {
      id: 'financial-basics',
      title: 'Financial Planning',
      description: 'Learn startup financial fundamentals and key metrics.',
      duration: 65,
      lessons: 8,
      completed: false,
      progress: 0,
      difficulty: 'Intermediate',
      topics: ['Unit Economics', 'Cash Flow', 'Financial Modeling', 'Key Metrics']
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: 'founder-track',
      name: 'Founder Track',
      description: 'Complete journey from idea to launch',
      modules: 12,
      duration: 480,
      level: 'Beginner',
      icon: Target,
      color: 'blue'
    },
    {
      id: 'product-track',
      name: 'Product Track',
      description: 'Focus on product development and user experience',
      modules: 8,
      duration: 320,
      level: 'Intermediate',
      icon: Zap,
      color: 'purple'
    },
    {
      id: 'business-track',
      name: 'Business Track',
      description: 'Business strategy and operations',
      modules: 10,
      duration: 400,
      level: 'Intermediate',
      icon: Building,
      color: 'green'
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

  const getPathIcon = (pathId: string) => {
    const path = learningPaths.find(p => p.id === pathId);
    return path ? path.icon : Target;
  };

  const getPathColor = (pathId: string) => {
    const path = learningPaths.find(p => p.id === pathId);
    return path ? path.color : 'gray';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const completedModules = courseModules.filter(module => module.completed).length;
  const totalProgress = Math.round(
    courseModules.reduce((sum, module) => sum + module.progress, 0) / courseModules.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Book className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Startup Fundamentals
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Master the essential building blocks of launching a successful startup from idea to execution.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Book className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                  <p className="text-sm text-gray-600">Core Modules</p>
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
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
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
                      <p className="font-bold">{completedModules} / {courseModules.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time Invested</p>
                      <p className="font-bold">2.5 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Business Model Canvas</p>
                        <p className="text-sm text-gray-600">Completed successfully</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Star className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Market Research</p>
                        <p className="text-sm text-gray-600">75% complete</p>
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
              {courseModules.map(module => (
                <Card key={module.id} className={module.completed ? 'ring-2 ring-green-500' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                      {module.completed && (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{formatDuration(module.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Book className="h-4 w-4 text-gray-500" />
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
              ))}
            </div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value="paths" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {learningPaths.map(path => {
                const Icon = path.icon;
                return (
                  <Card key={path.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${path.color}-100 rounded-lg`}>
                          <Icon className={`h-5 w-5 text-${path.color}-600`} />
                        </div>
                        <div>
                          <CardTitle>{path.name}</CardTitle>
                          <CardDescription>{path.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Modules</p>
                          <p className="font-bold">{path.modules}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-bold">{formatDuration(path.duration)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Level</p>
                          <p className="font-bold">{path.level}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Progress</p>
                          <p className="font-bold">0%</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Start Path
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

export default EducationFundamentals;
