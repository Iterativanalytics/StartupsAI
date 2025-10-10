import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Download, 
  Plus,
  X,
  Calendar,
  Clock,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Settings,
  BarChart,
  FileText,
  Zap,
  Eye,
  MessageSquare,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

export interface SprintParticipant {
  id: string;
  name: string;
  role: string;
  email?: string;
  availability: 'full-time' | 'part-time';
  expertise: string[];
}

export interface SprintActivity {
  id: string;
  day: number;
  title: string;
  description: string;
  duration: number; // minutes
  type: 'workshop' | 'individual' | 'group' | 'presentation' | 'break';
  participants: string[]; // participant IDs
  materials: string[];
  outcomes: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  startTime?: string;
  endTime?: string;
  notes: string;
}

export interface SprintDecision {
  id: string;
  title: string;
  description: string;
  rationale: string;
  impact: 'low' | 'medium' | 'high';
  status: 'proposed' | 'approved' | 'rejected' | 'deferred';
  proposedBy: string;
  decidedAt?: Date;
  decidedBy?: string;
}

export interface SprintOutcome {
  id: string;
  type: 'prototype' | 'insight' | 'decision' | 'next-step';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  owner?: string;
  dueDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface DesignSprint {
  id: string;
  projectId: string;
  title: string;
  description: string;
  challenge: string;
  participants: SprintParticipant[];
  activities: SprintActivity[];
  decisions: SprintDecision[];
  outcomes: SprintOutcome[];
  status: 'planning' | 'active' | 'completed' | 'paused';
  startDate?: Date;
  endDate?: Date;
  currentDay: number;
  currentActivity?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DesignSprintOrchestratorProps {
  projectId: string;
  initialData?: DesignSprint;
  onSave: (data: DesignSprint) => void;
  onExport?: (data: DesignSprint) => void;
}

const sprintDays = [
  { day: 1, name: 'Monday', focus: 'Map & Sketch', color: 'bg-blue-100 text-blue-800' },
  { day: 2, name: 'Tuesday', focus: 'Decide & Storyboard', color: 'bg-green-100 text-green-800' },
  { day: 3, name: 'Wednesday', focus: 'Prototype', color: 'bg-yellow-100 text-yellow-800' },
  { day: 4, name: 'Thursday', focus: 'Test', color: 'bg-purple-100 text-purple-800' },
  { day: 5, name: 'Friday', focus: 'Decide & Plan', color: 'bg-red-100 text-red-800' }
];

const activityTemplates = {
  1: [ // Monday
    { title: 'Sprint Kickoff', duration: 60, type: 'workshop' },
    { title: 'Problem Definition', duration: 120, type: 'workshop' },
    { title: 'User Journey Mapping', duration: 90, type: 'workshop' },
    { title: 'Lightning Demos', duration: 60, type: 'presentation' },
    { title: 'Four-Step Sketching', duration: 120, type: 'individual' }
  ],
  2: [ // Tuesday
    { title: 'Solution Critique', duration: 60, type: 'group' },
    { title: 'Solution Selection', duration: 90, type: 'group' },
    { title: 'Storyboarding', duration: 120, type: 'workshop' },
    { title: 'Expert Review', duration: 60, type: 'workshop' }
  ],
  3: [ // Wednesday
    { title: 'Prototype Planning', duration: 60, type: 'workshop' },
    { title: 'Prototype Creation', duration: 300, type: 'individual' },
    { title: 'Prototype Review', duration: 60, type: 'group' }
  ],
  4: [ // Thursday
    { title: 'Test Preparation', duration: 60, type: 'workshop' },
    { title: 'User Testing', duration: 240, type: 'workshop' },
    { title: 'Results Analysis', duration: 90, type: 'workshop' }
  ],
  5: [ // Friday
    { title: 'Insights Review', duration: 60, type: 'workshop' },
    { title: 'Decision Making', duration: 90, type: 'workshop' },
    { title: 'Next Steps Planning', duration: 90, type: 'workshop' },
    { title: 'Sprint Retrospective', duration: 60, type: 'workshop' }
  ]
};

export function DesignSprintOrchestrator({ 
  projectId, 
  initialData, 
  onSave, 
  onExport 
}: DesignSprintOrchestratorProps) {
  const [data, setData] = useState<DesignSprint>(
    initialData || {
      id: '',
      projectId,
      title: '',
      description: '',
      challenge: '',
      participants: [],
      activities: [],
      decisions: [],
      outcomes: [],
      status: 'planning',
      currentDay: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [newParticipant, setNewParticipant] = useState<Partial<SprintParticipant>>({
    name: '',
    role: '',
    availability: 'full-time',
    expertise: []
  });
  const [newDecision, setNewDecision] = useState<Partial<SprintDecision>>({
    title: '',
    description: '',
    rationale: '',
    impact: 'medium',
    status: 'proposed',
    proposedBy: ''
  });
  const [newOutcome, setNewOutcome] = useState<Partial<SprintOutcome>>({
    type: 'next-step',
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending'
  });

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const updateData = (field: keyof DesignSprint, value: any) => {
    setData(prev => ({ ...prev, [field]: value, updatedAt: new Date() }));
  };

  const addParticipant = () => {
    if (newParticipant.name?.trim() && newParticipant.role?.trim()) {
      const participant: SprintParticipant = {
        id: `participant-${Date.now()}`,
        name: newParticipant.name,
        role: newParticipant.role,
        email: newParticipant.email,
        availability: newParticipant.availability || 'full-time',
        expertise: newParticipant.expertise || []
      };
      
      setData(prev => ({
        ...prev,
        participants: [...prev.participants, participant]
      }));
      
      setNewParticipant({
        name: '',
        role: '',
        availability: 'full-time',
        expertise: []
      });
    }
  };

  const removeParticipant = (participantId: string) => {
    setData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== participantId),
      activities: prev.activities.map(a => ({
        ...a,
        participants: a.participants.filter(id => id !== participantId)
      }))
    }));
  };

  const generateActivities = () => {
    const activities: SprintActivity[] = [];
    
    for (let day = 1; day <= 5; day++) {
      const dayTemplates = activityTemplates[day as keyof typeof activityTemplates] || [];
      
      dayTemplates.forEach((template, index) => {
        activities.push({
          id: `activity-${day}-${index}`,
          day,
          title: template.title,
          description: '',
          duration: template.duration,
          type: template.type as any,
          participants: [],
          materials: [],
          outcomes: [],
          status: 'pending',
          notes: ''
        });
      });
    }
    
    setData(prev => ({
      ...prev,
      activities
    }));
  };

  const updateActivity = (activityId: string, field: keyof SprintActivity, value: any) => {
    setData(prev => ({
      ...prev,
      activities: prev.activities.map(a => 
        a.id === activityId ? { ...a, [field]: value } : a
      )
    }));
  };

  const startSprint = () => {
    setData(prev => ({
      ...prev,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      currentDay: 1
    }));
  };

  const completeSprint = () => {
    setData(prev => ({
      ...prev,
      status: 'completed',
      endDate: new Date()
    }));
  };

  const nextDay = () => {
    if (data.currentDay < 5) {
      setData(prev => ({
        ...prev,
        currentDay: prev.currentDay + 1
      }));
    }
  };

  const previousDay = () => {
    if (data.currentDay > 1) {
      setData(prev => ({
        ...prev,
        currentDay: prev.currentDay - 1
      }));
    }
  };

  const addDecision = () => {
    if (newDecision.title?.trim()) {
      const decision: SprintDecision = {
        id: `decision-${Date.now()}`,
        title: newDecision.title,
        description: newDecision.description || '',
        rationale: newDecision.rationale || '',
        impact: newDecision.impact || 'medium',
        status: 'proposed',
        proposedBy: newDecision.proposedBy || 'Unknown'
      };
      
      setData(prev => ({
        ...prev,
        decisions: [...prev.decisions, decision]
      }));
      
      setNewDecision({
        title: '',
        description: '',
        rationale: '',
        impact: 'medium',
        status: 'proposed',
        proposedBy: ''
      });
    }
  };

  const addOutcome = () => {
    if (newOutcome.title?.trim()) {
      const outcome: SprintOutcome = {
        id: `outcome-${Date.now()}`,
        type: newOutcome.type || 'next-step',
        title: newOutcome.title,
        description: newOutcome.description || '',
        priority: newOutcome.priority || 'medium',
        owner: newOutcome.owner,
        dueDate: newOutcome.dueDate,
        status: 'pending'
      };
      
      setData(prev => ({
        ...prev,
        outcomes: [...prev.outcomes, outcome]
      }));
      
      setNewOutcome({
        type: 'next-step',
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending'
      });
    }
  };

  const getDayActivities = (day: number) => {
    return data.activities.filter(a => a.day === day);
  };

  const getSprintProgress = () => {
    const totalActivities = data.activities.length;
    const completedActivities = data.activities.filter(a => a.status === 'completed').length;
    return totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving sprint:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(data);
    }
  };

  const progress = getSprintProgress();
  const currentDayData = sprintDays.find(d => d.day === data.currentDay);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Design Sprint Orchestrator</h2>
          <p className="text-gray-600 mt-1">Plan and manage 5-day design sprints</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          {onExport && (
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Sprint Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Sprint Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sprint Title</label>
              <Input
                value={data.title}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="Enter sprint title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={data.status === 'completed' ? 'default' : data.status === 'active' ? 'secondary' : 'outline'}
                >
                  {data.status}
                </Badge>
                {data.status === 'planning' && (
                  <Button onClick={startSprint} className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Sprint
                  </Button>
                )}
                {data.status === 'active' && (
                  <Button onClick={completeSprint} variant="outline" className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Complete Sprint
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Challenge Statement</label>
            <Textarea
              value={data.challenge}
              onChange={(e) => updateData('challenge', e.target.value)}
              placeholder="What problem are you trying to solve?"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={data.description}
              onChange={(e) => updateData('description', e.target.value)}
              placeholder="Describe the sprint goals and context..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sprint Progress */}
      {data.status === 'active' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Sprint Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {sprintDays.map((day) => (
                  <div
                    key={day.day}
                    className={`p-3 rounded-lg text-center ${
                      day.day === data.currentDay 
                        ? 'bg-blue-500 text-white' 
                        : day.day < data.currentDay 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className="text-xs font-medium">{day.name}</div>
                    <div className="text-xs">Day {day.day}</div>
                    <div className="text-xs opacity-75">{day.focus}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day Navigation */}
      {data.status === 'active' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Day {data.currentDay}: {currentDayData?.name} - {currentDayData?.focus}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousDay}
                  disabled={data.currentDay <= 1}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextDay}
                  disabled={data.currentDay >= 5}
                  className="flex items-center gap-1"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getDayActivities(data.currentDay).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-gray-600">
                        {activity.duration} min • {activity.type}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : activity.status === 'in-progress' ? 'secondary' : 'outline'}
                    >
                      {activity.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateActivity(activity.id, 'status', 'completed')}
                      disabled={activity.status === 'completed'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Sprint Participants ({data.participants.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {data.participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{participant.name}</div>
                  <div className="text-sm text-gray-600">{participant.role}</div>
                  {participant.expertise.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {participant.expertise.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeParticipant(participant.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              placeholder="Participant name..."
              value={newParticipant.name || ''}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Role..."
              value={newParticipant.role || ''}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, role: e.target.value }))}
            />
          </div>
          <Button onClick={addParticipant} disabled={!newParticipant.name?.trim() || !newParticipant.role?.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Participant
          </Button>
        </CardContent>
      </Card>

      {/* Activities Setup */}
      {data.status === 'planning' && data.activities.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Sprint Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-gray-600 mb-4">Generate the standard 5-day sprint activities</p>
              <Button onClick={generateActivities} className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Generate Sprint Activities
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Sprint Decisions ({data.decisions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {data.decisions.map((decision) => (
              <div key={decision.id} className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{decision.title}</h3>
                    <Badge 
                      variant={decision.status === 'approved' ? 'default' : decision.status === 'rejected' ? 'destructive' : 'outline'}
                    >
                      {decision.status}
                    </Badge>
                    <Badge variant="outline">{decision.impact}</Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">{decision.description}</div>
                <div className="text-xs text-gray-500">
                  Proposed by: {decision.proposedBy}
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder="Decision title..."
              value={newDecision.title || ''}
              onChange={(e) => setNewDecision(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Decision description..."
              value={newDecision.description || ''}
              onChange={(e) => setNewDecision(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newDecision.impact || 'medium'}
                onChange={(e) => setNewDecision(prev => ({ ...prev, impact: e.target.value as any }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="low">Low Impact</option>
                <option value="medium">Medium Impact</option>
                <option value="high">High Impact</option>
              </select>
              <Input
                placeholder="Proposed by..."
                value={newDecision.proposedBy || ''}
                onChange={(e) => setNewDecision(prev => ({ ...prev, proposedBy: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={addDecision} disabled={!newDecision.title?.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Decision
          </Button>
        </CardContent>
      </Card>

      {/* Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Sprint Outcomes ({data.outcomes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {data.outcomes.map((outcome) => (
              <div key={outcome.id} className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{outcome.title}</h3>
                    <Badge variant="outline">{outcome.type}</Badge>
                    <Badge 
                      variant={outcome.priority === 'critical' ? 'destructive' : outcome.priority === 'high' ? 'default' : 'outline'}
                    >
                      {outcome.priority}
                    </Badge>
                    <Badge 
                      variant={outcome.status === 'completed' ? 'default' : 'outline'}
                    >
                      {outcome.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{outcome.description}</div>
                {outcome.owner && (
                  <div className="text-xs text-gray-500 mt-1">
                    Owner: {outcome.owner}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                placeholder="Outcome title..."
                value={newOutcome.title || ''}
                onChange={(e) => setNewOutcome(prev => ({ ...prev, title: e.target.value }))}
              />
              <select
                value={newOutcome.type || 'next-step'}
                onChange={(e) => setNewOutcome(prev => ({ ...prev, type: e.target.value as any }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="prototype">Prototype</option>
                <option value="insight">Insight</option>
                <option value="decision">Decision</option>
                <option value="next-step">Next Step</option>
              </select>
            </div>
            <Textarea
              placeholder="Outcome description..."
              value={newOutcome.description || ''}
              onChange={(e) => setNewOutcome(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newOutcome.priority || 'medium'}
                onChange={(e) => setNewOutcome(prev => ({ ...prev, priority: e.target.value as any }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical</option>
              </select>
              <Input
                placeholder="Owner (optional)..."
                value={newOutcome.owner || ''}
                onChange={(e) => setNewOutcome(prev => ({ ...prev, owner: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={addOutcome} disabled={!newOutcome.title?.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Outcome
          </Button>
        </CardContent>
      </Card>

      {/* Tips and Guidance */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">🏃‍♂️ Design Sprint Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Keep the team small (5-7 people maximum)</li>
            <li>• Include diverse perspectives and expertise</li>
            <li>• Focus on one big challenge per sprint</li>
            <li>• Time-box everything strictly</li>
            <li>• Test with real users, not just your team</li>
            <li>• Document all decisions and outcomes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
