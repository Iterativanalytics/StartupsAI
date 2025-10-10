import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Square, 
  Users, 
  Lightbulb, 
  Target, 
  Zap, 
  BarChart3,
  Brain,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

import { EmpathyMapBuilder } from './EmpathyMapBuilder';
import { POVStatementBuilder } from './POVStatementBuilder';
import { IdeationCanvas } from './IdeationCanvas';
import { PrototypePlanner } from './PrototypePlanner';
import { TestSessionManager } from './TestSessionManager';
import { DTAnalyticsDashboard } from './DTAnalyticsDashboard';
import { AIFacilitationPanel } from './AIFacilitationPanel';
import { CollaborationPanel } from './CollaborationPanel';

interface DTWorkflow {
  id: string;
  name: string;
  description: string;
  currentPhase: DTPhase;
  status: 'active' | 'paused' | 'completed';
  participants: Participant[];
  aiFacilitationEnabled: boolean;
  collaborationMode: 'real-time' | 'async' | 'hybrid';
  createdAt: Date;
  updatedAt: Date;
}

interface Participant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  lastActive: Date;
}

interface DTPhase {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType;
  color: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  activities: Activity[];
  deliverables: Deliverable[];
}

interface Activity {
  id: string;
  name: string;
  description: string;
  type: string;
  duration: number;
  completed: boolean;
  participants: string[];
}

interface Deliverable {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'draft' | 'review' | 'approved';
  createdBy: string;
  createdAt: Date;
}

interface AIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'celebration' | 'recommendation';
  content: string;
  confidence: number;
  actionable: boolean;
  timestamp: Date;
}

interface CollaborationUpdate {
  id: string;
  type: 'participant_joined' | 'participant_left' | 'activity_completed' | 'deliverable_created';
  participant: string;
  content: string;
  timestamp: Date;
}

interface DTWorkflowOrchestratorProps {
  workflowId: string;
  onWorkflowUpdate?: (workflow: DTWorkflow) => void;
  onPhaseTransition?: (from: string, to: string) => void;
}

export function DTWorkflowOrchestrator({ 
  workflowId, 
  onWorkflowUpdate, 
  onPhaseTransition 
}: DTWorkflowOrchestratorProps) {
  const [workflow, setWorkflow] = useState<DTWorkflow | null>(null);
  const [currentPhase, setCurrentPhase] = useState<DTPhase | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [collaborationUpdates, setCollaborationUpdates] = useState<CollaborationUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load workflow data
  useEffect(() => {
    loadWorkflow();
  }, [workflowId]);

  // Setup real-time collaboration
  useEffect(() => {
    if (workflow) {
      setupRealTimeCollaboration();
    }
  }, [workflow]);

  // AI insights polling
  useEffect(() => {
    if (workflow?.aiFacilitationEnabled) {
      const interval = setInterval(fetchAIInsights, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [workflow]);

  const loadWorkflow = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/dt/workflows/${workflowId}`);
      if (!response.ok) throw new Error('Failed to load workflow');
      
      const data = await response.json();
      setWorkflow(data);
      setCurrentPhase(getPhaseData(data.currentPhase));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflow');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeCollaboration = () => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket(`ws://localhost:3001/dt/workflows/${workflowId}`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      handleCollaborationUpdate(update);
    };

    return () => ws.close();
  };

  const handleCollaborationUpdate = (update: CollaborationUpdate) => {
    setCollaborationUpdates(prev => [update, ...prev.slice(0, 9)]); // Keep last 10 updates
  };

  const fetchAIInsights = async () => {
    try {
      const response = await fetch(`/api/dt/workflows/${workflowId}/ai-insights`);
      if (response.ok) {
        const insights = await response.json();
        setAiInsights(insights);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    }
  };

  const transitionToPhase = async (phaseId: string) => {
    try {
      const response = await fetch(`/api/dt/workflows/${workflowId}/phase`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: phaseId })
      });

      if (response.ok) {
        const updatedWorkflow = await response.json();
        setWorkflow(updatedWorkflow);
        setCurrentPhase(getPhaseData(String(phaseId)));
        onWorkflowUpdate?.(updatedWorkflow);
        onPhaseTransition?.(workflow?.currentPhase || '', String(phaseId));
      }
    } catch (error) {
      console.error('Error transitioning phase:', error);
    }
  };

  const getPhaseData = (phaseId: string): DTPhase => {
    const phases: Record<string, DTPhase> = {
      empathize: {
        id: 'empathize',
        name: 'Empathize',
        description: 'Understand your users deeply',
        icon: Users,
        color: 'bg-blue-500',
        progress: 0,
        status: 'not_started',
        activities: [],
        deliverables: []
      },
      define: {
        id: 'define',
        name: 'Define',
        description: 'Frame the right problem',
        icon: Target,
        color: 'bg-green-500',
        progress: 0,
        status: 'not_started',
        activities: [],
        deliverables: []
      },
      ideate: {
        id: 'ideate',
        name: 'Ideate',
        description: 'Generate many solutions',
        icon: Lightbulb,
        color: 'bg-yellow-500',
        progress: 0,
        status: 'not_started',
        activities: [],
        deliverables: []
      },
      prototype: {
        id: 'prototype',
        name: 'Prototype',
        description: 'Build to learn',
        icon: Zap,
        color: 'bg-purple-500',
        progress: 0,
        status: 'not_started',
        activities: [],
        deliverables: []
      },
      test: {
        id: 'test',
        name: 'Test',
        description: 'Validate with users',
        icon: CheckCircle,
        color: 'bg-red-500',
        progress: 0,
        status: 'not_started',
        activities: [],
        deliverables: []
      }
    };

    return phases[phaseId] || phases.empathize;
  };

  const getPhaseComponent = () => {
    if (!currentPhase) return null;

    switch (currentPhase.id) {
      case 'empathize':
        return <EmpathyMapBuilder workflowId={workflowId} />;
      case 'define':
        return <POVStatementBuilder workflowId={workflowId} />;
      case 'ideate':
        return <IdeationCanvas workflowId={workflowId} />;
      case 'prototype':
        return <PrototypePlanner workflowId={workflowId} />;
      case 'test':
        return <TestSessionManager workflowId={workflowId} />;
      default:
        return null;
    }
  };

  const getWorkflowStatus = () => {
    if (!workflow) return 'loading';
    return workflow.status;
  };

  const getOverallProgress = () => {
    if (!workflow) return 0;
    // Calculate overall progress based on completed phases
    const phases = ['empathize', 'define', 'ideate', 'prototype', 'test'];
    const currentIndex = phases.indexOf(workflow.currentPhase);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button onClick={loadWorkflow} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Workflow not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{workflow.name}</h1>
          <p className="text-gray-600 mt-1">{workflow.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={getWorkflowStatus() === 'active' ? 'default' : 'secondary'}>
            {getWorkflowStatus()}
          </Badge>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{workflow.participants.length} participants</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{Math.round(getOverallProgress())}%</span>
            </div>
            <Progress value={getOverallProgress()} className="w-full" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Current Phase: {currentPhase?.name}</span>
              <span>Started: {new Date(workflow.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Phase Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue={currentPhase?.id} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="empathize" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Empathize
              </TabsTrigger>
              <TabsTrigger value="define" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Define
              </TabsTrigger>
              <TabsTrigger value="ideate" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Ideate
              </TabsTrigger>
              <TabsTrigger value="prototype" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Prototype
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Test
              </TabsTrigger>
            </TabsList>

            <TabsContent value={currentPhase?.id || ''} className="space-y-4">
              {getPhaseComponent()}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* AI Facilitation Panel */}
          {workflow.aiFacilitationEnabled && (
            <AIFacilitationPanel 
              insights={aiInsights}
              onInsightAction={(insightId, action) => {
                // Handle insight actions
                console.log('Insight action:', insightId, action);
              }}
            />
          )}

          {/* Collaboration Panel */}
          <CollaborationPanel 
            participants={workflow.participants}
            updates={collaborationUpdates}
            onParticipantAction={(participantId, action) => {
              // Handle participant actions
              console.log('Participant action:', participantId, action);
            }}
          />

          {/* Analytics Dashboard */}
          <DTAnalyticsDashboard workflowId={workflowId} />
        </div>
      </div>
    </div>
  );
}
