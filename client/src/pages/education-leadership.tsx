import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { 
  Users, Play, Clock, Award, CheckCircle, Star, ArrowRight,
  Target, Zap, Building, DollarSign, TrendingUp, Globe, Shield, FileText, Presentation
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeadershipModule {
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

interface LeadershipSkill {
  id: string;
  name: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  importance: 'High' | 'Medium' | 'Low';
  icon: any;
  color: string;
}

function EducationLeadership() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Mock data for leadership modules
  const leadershipModules: LeadershipModule[] = [
    {
      id: 'team-building',
      title: 'Building High-Performing Teams',
      description: 'Learn how to recruit, hire, and build teams that drive startup success.',
      duration: 75,
      lessons: 7,
      completed: false,
      progress: 30,
      difficulty: 'Intermediate',
      topics: ['Hiring', 'Team Culture', 'Remote Teams', 'Performance Management'],
      type: 'workshop'
    },
    {
      id: 'leadership-styles',
      title: 'Leadership Styles & Approaches',
      description: 'Discover different leadership styles and when to apply them effectively.',
      duration: 60,
      lessons: 6,
      completed: false,
      progress: 15,
      difficulty: 'Beginner',
      topics: ['Leadership Styles', 'Situational Leadership', 'Emotional Intelligence', 'Decision Making'],
      type: 'video'
    },
    {
      id: 'communication',
      title: 'Effective Communication',
      description: 'Master communication skills for leading teams and managing stakeholders.',
      duration: 50,
      lessons: 5,
      completed: false,
      progress: 0,
      difficulty: 'Beginner',
      topics: ['Active Listening', 'Feedback', 'Presentations', 'Conflict Resolution'],
      type: 'workshop'
    },
    {
      id: 'culture-building',
      title: 'Building Company Culture',
      description: 'Create and maintain a strong company culture that attracts and retains talent.',
      duration: 65,
      lessons: 6,
      completed: false,
      progress: 0,
      difficulty: 'Intermediate',
      topics: ['Values Definition', 'Culture Implementation', 'Employee Engagement', 'Remote Culture'],
      type: 'case-study'
    },
    {
      id: 'performance-management',
      title: 'Performance Management',
      description: 'Learn to set goals, provide feedback, and manage team performance effectively.',
      duration: 55,
      lessons: 5,
      completed: false,
      progress: 0,
      difficulty: 'Intermediate',
      topics: ['Goal Setting', 'Performance Reviews', 'Coaching', 'Career Development'],
      type: 'template'
    },
    {
      id: 'change-management',
      title: 'Leading Change & Transformation',
      description: 'Guide your organization through change and transformation initiatives.',
      duration: 70,
      lessons: 7,
      completed: false,
      progress: 0,
      difficulty: 'Advanced',
      topics: ['Change Strategy', 'Stakeholder Management', 'Resistance Handling', 'Transformation'],
      type: 'video'
    }
  ];

  const leadershipSkills: LeadershipSkill[] = [
    {
      id: 'emotional-intelligence',
      name: 'Emotional Intelligence',
      description: 'Understanding and managing emotions in yourself and others',
      level: 'Intermediate',
      importance: 'High',
      icon: Shield,
      color: 'blue'
    },
    {
      id: 'decision-making',
      name: 'Decision Making',
      description: 'Making effective decisions under pressure and uncertainty',
      level: 'Advanced',
      importance: 'High',
      icon: Target,
      color: 'green'
    },
    {
      id: 'communication',
      name: 'Communication',
      description: 'Clear and effective communication with teams and stakeholders',
      level: 'Beginner',
      importance: 'High',
      icon: Users,
      color: 'purple'
    },
    {
      id: 'strategic-thinking',
      name: 'Strategic Thinking',
      description: 'Long-term planning and strategic vision for the organization',
      level: 'Advanced',
      importance: 'High',
      icon: Globe,
      color: 'orange'
    },
    {
      id: 'delegation',
      name: 'Delegation',
      description: 'Effectively delegating tasks and responsibilities to team members',
      level: 'Intermediate',
      importance: 'Medium',
      icon: Building,
      color: 'red'
    },
    {
      id: 'coaching',
      name: 'Coaching & Mentoring',
      description: 'Developing and mentoring team members for growth',
      level: 'Intermediate',
      importance: 'Medium',
      icon: Award,
      color: 'yellow'
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

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
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

  const completedModules = leadershipModules.filter(module => module.completed).length;
  const totalProgress = Math.round(
    leadershipModules.reduce((sum, module) => sum + module.progress, 0) / leadershipModules.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Leadership & Team
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Develop leadership skills and build high-performing teams that drive startup success.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                  <p className="text-sm text-gray-600">Leadership Modules</p>
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
                  <p className="text-2xl font-bold text-gray-900">6.5h</p>
                  <p className="text-sm text-gray-600">Total Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
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
            <TabsTrigger value="skills">Leadership Skills</TabsTrigger>
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
                      <p className="font-bold">{completedModules} / {leadershipModules.length}</p>
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
                        <p className="font-medium">Build High-Performing Teams</p>
                        <p className="text-sm text-gray-600">Recruit and manage top talent</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Star className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Develop Leadership Skills</p>
                        <p className="text-sm text-gray-600">Master essential leadership competencies</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Create Strong Culture</p>
                        <p className="text-sm text-gray-600">Build culture that attracts talent</p>
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
              {leadershipModules.map(module => {
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

          {/* Leadership Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadershipSkills.map(skill => {
                const Icon = skill.icon;
                return (
                  <Card key={skill.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${skill.color}-100 rounded-lg`}>
                          <Icon className={`h-5 w-5 text-${skill.color}-600`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{skill.name}</CardTitle>
                          <CardDescription>{skill.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(skill.level)}>
                          {skill.level}
                        </Badge>
                        <Badge className={getImportanceColor(skill.importance)}>
                          {skill.importance} Priority
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Your Level</span>
                          <span className="font-medium">Beginner</span>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Develop Skill
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

export default EducationLeadership;
