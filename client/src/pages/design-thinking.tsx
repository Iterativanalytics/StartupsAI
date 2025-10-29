import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Lightbulb, 
  Target, 
  Wrench, 
  TestTube,
  Plus,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
// LDTReadinessWidget removed with unified dashboard
import { useEmpathyMaps } from '@/hooks/use-empathy-maps';

interface LLDTProject {
  id: string;
  name: string;
  currentPhase: 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

interface LLDTStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  empathyMapsCreated: number;
  prototypesBuilt: number;
  testSessionsCompleted: number;
}

export function DesignThinkingPage() {
  const [projects, setProjects] = useState<LDTProject[]>([]);
  const [stats, setStats] = useState<LDTStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    empathyMapsCreated: 0,
    prototypesBuilt: 0,
    testSessionsCompleted: 0
  });
  const [loading, setLoading] = useState(true);

  // LLDT scores and recommendations removed with unified dashboard

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          name: 'E-commerce App Redesign',
          currentPhase: 'prototype',
          progress: 75,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: '2',
          name: 'Healthcare Platform',
          currentPhase: 'test',
          progress: 90,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-22')
        }
      ]);
      
      setStats({
        totalProjects: 5,
        activeProjects: 3,
        completedProjects: 2,
        empathyMapsCreated: 12,
        prototypesBuilt: 8,
        testSessionsCompleted: 15
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  const phases = [
    {
      name: 'Empathize',
      icon: Users,
      description: 'Understand your users deeply',
      color: 'bg-blue-50 border-blue-200',
      progress: 80,
      tools: ['Empathy Maps', 'User Journey Maps', 'Interview Guide']
    },
    {
      name: 'Define',
      icon: Target,
      description: 'Frame the right problem',
      color: 'bg-green-50 border-green-200',
      progress: 60,
      tools: ['POV Statements', 'HMW Questions', 'Problem Framing']
    },
    {
      name: 'Ideate',
      icon: Lightbulb,
      description: 'Generate creative solutions',
      color: 'bg-yellow-50 border-yellow-200',
      progress: 40,
      tools: ['Brainstorming', 'Idea Management', 'Solution Sketching']
    },
    {
      name: 'Prototype',
      icon: Wrench,
      description: 'Build to learn',
      color: 'bg-purple-50 border-purple-200',
      progress: 30,
      tools: ['Prototype Planner', 'Storyboard Builder', 'Rapid Prototyping']
    },
    {
      name: 'Test',
      icon: TestTube,
      description: 'Validate with users',
      color: 'bg-red-50 border-red-200',
      progress: 20,
      tools: ['Test Sessions', 'Validation Dashboard', 'User Testing']
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lean Design Thinking™</h1>
          <p className="text-gray-600 mt-1">
            Human-centered innovation for better products and services
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold">{stats.activeProjects}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Empathy Maps</p>
                  <p className="text-2xl font-bold">{stats.empathyMapsCreated}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prototypes</p>
                  <p className="text-2xl font-bold">{stats.prototypesBuilt}</p>
                </div>
                <Wrench className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Test Sessions</p>
                  <p className="text-2xl font-bold">{stats.testSessionsCompleted}</p>
                </div>
                <TestTube className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* LLDT Process Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Lean Design Thinking™ Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <div key={phase.name} className="relative">
                  <Card className={`${phase.color} border-2`}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Icon className="w-8 h-8 mx-auto mb-2" />
                        <h3 className="font-semibold text-sm mb-1">{phase.name}</h3>
                        <p className="text-xs text-gray-600 mb-3">{phase.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{phase.progress}%</span>
                          </div>
                          <Progress value={phase.progress} className="h-2" />
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">Tools:</p>
                          <div className="space-y-1">
                            {phase.tools.map((tool, toolIndex) => (
                              <Badge key={toolIndex} variant="outline" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow between phases */}
                  {index < phases.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-gray-600">
                      Phase: <Badge variant="outline">{project.currentPhase}</Badge>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{project.progress}% Complete</p>
                    <Progress value={project.progress} className="w-24 h-2" />
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Continue
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Users className="w-6 h-6" />
              <span>Create Empathy Map</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Target className="w-6 h-6" />
              <span>Define POV Statement</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <TestTube className="w-6 h-6" />
              <span>Start Design Sprint</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
