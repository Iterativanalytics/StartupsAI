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
  Play,
  Pause,
  Stop,
  Users,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  FileText,
  BarChart,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
  Settings
} from 'lucide-react';

export interface TestParticipant {
  id: string;
  name: string;
  email?: string;
  demographics: string[];
  notes: string;
  status: 'pending' | 'completed' | 'no-show';
}

export interface TestTask {
  id: string;
  title: string;
  description: string;
  successCriteria: string[];
  timeLimit?: number; // minutes
  order: number;
}

export interface TestObservation {
  id: string;
  participantId: string;
  taskId: string;
  timestamp: number;
  type: 'success' | 'failure' | 'confusion' | 'feedback' | 'timeout';
  description: string;
  severity: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface TestSession {
  id: string;
  projectId: string;
  prototypeId: string;
  title: string;
  description: string;
  participants: TestParticipant[];
  tasks: TestTask[];
  observations: TestObservation[];
  status: 'planning' | 'active' | 'completed';
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TestSessionManagerProps {
  projectId: string;
  prototypeId: string;
  initialData?: TestSession;
  onSave: (data: TestSession) => void;
  onExport?: (data: TestSession) => void;
}

const severityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const typeColors = {
  success: 'bg-green-100 text-green-800',
  failure: 'bg-red-100 text-red-800',
  confusion: 'bg-yellow-100 text-yellow-800',
  feedback: 'bg-blue-100 text-blue-800',
  timeout: 'bg-gray-100 text-gray-800'
};

const commonTags = [
  'Navigation', 'Content', 'Performance', 'Usability', 'Accessibility',
  'Mobile', 'Desktop', 'Error Handling', 'Onboarding', 'Checkout'
];

export function TestSessionManager({ 
  projectId, 
  prototypeId,
  initialData, 
  onSave, 
  onExport 
}: TestSessionManagerProps) {
  const [data, setData] = useState<TestSession>(
    initialData || {
      id: '',
      projectId,
      prototypeId,
      title: '',
      description: '',
      participants: [],
      tasks: [],
      observations: [],
      status: 'planning'
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [newParticipant, setNewParticipant] = useState<Partial<TestParticipant>>({
    name: '',
    email: '',
    demographics: [],
    notes: '',
    status: 'pending'
  });
  const [newTask, setNewTask] = useState<Partial<TestTask>>({
    title: '',
    description: '',
    successCriteria: [],
    order: 0
  });
  const [newObservation, setNewObservation] = useState<Partial<TestObservation>>({
    participantId: '',
    taskId: '',
    type: 'feedback',
    description: '',
    severity: 'medium',
    tags: []
  });
  const [activeSession, setActiveSession] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const updateData = (field: keyof TestSession, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addParticipant = () => {
    if (newParticipant.name?.trim()) {
      const participant: TestParticipant = {
        id: `participant-${Date.now()}`,
        name: newParticipant.name,
        email: newParticipant.email,
        demographics: newParticipant.demographics || [],
        notes: newParticipant.notes || '',
        status: 'pending'
      };
      
      setData(prev => ({
        ...prev,
        participants: [...prev.participants, participant]
      }));
      
      setNewParticipant({
        name: '',
        email: '',
        demographics: [],
        notes: '',
        status: 'pending'
      });
    }
  };

  const removeParticipant = (participantId: string) => {
    setData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== participantId),
      observations: prev.observations.filter(o => o.participantId !== participantId)
    }));
  };

  const addTask = () => {
    if (newTask.title?.trim()) {
      const task: TestTask = {
        id: `task-${Date.now()}`,
        title: newTask.title,
        description: newTask.description || '',
        successCriteria: newTask.successCriteria || [],
        timeLimit: newTask.timeLimit,
        order: data.tasks.length
      };
      
      setData(prev => ({
        ...prev,
        tasks: [...prev.tasks, task]
      }));
      
      setNewTask({
        title: '',
        description: '',
        successCriteria: [],
        order: 0
      });
    }
  };

  const removeTask = (taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId),
      observations: prev.observations.filter(o => o.taskId !== taskId)
    }));
  };

  const addObservation = () => {
    if (newObservation.description?.trim() && newObservation.participantId && newObservation.taskId) {
      const observation: TestObservation = {
        id: `observation-${Date.now()}`,
        participantId: newObservation.participantId,
        taskId: newObservation.taskId,
        timestamp: Date.now(),
        type: newObservation.type || 'feedback',
        description: newObservation.description,
        severity: newObservation.severity || 'medium',
        tags: newObservation.tags || []
      };
      
      setData(prev => ({
        ...prev,
        observations: [...prev.observations, observation]
      }));
      
      setNewObservation({
        participantId: '',
        taskId: '',
        type: 'feedback',
        description: '',
        severity: 'medium',
        tags: []
      });
    }
  };

  const removeObservation = (observationId: string) => {
    setData(prev => ({
      ...prev,
      observations: prev.observations.filter(o => o.id !== observationId)
    }));
  };

  const startSession = () => {
    setData(prev => ({ ...prev, status: 'active', startDate: new Date() }));
    setActiveSession(true);
    setCurrentTaskIndex(0);
  };

  const endSession = () => {
    setData(prev => ({ ...prev, status: 'completed', endDate: new Date() }));
    setActiveSession(false);
  };

  const getSessionStats = () => {
    const totalParticipants = data.participants.length;
    const completedParticipants = data.participants.filter(p => p.status === 'completed').length;
    const totalObservations = data.observations.length;
    const successObservations = data.observations.filter(o => o.type === 'success').length;
    const failureObservations = data.observations.filter(o => o.type === 'failure').length;
    
    return {
      totalParticipants,
      completedParticipants,
      totalObservations,
      successObservations,
      failureObservations,
      completionRate: totalParticipants > 0 ? (completedParticipants / totalParticipants) * 100 : 0,
      successRate: totalObservations > 0 ? (successObservations / totalObservations) * 100 : 0
    };
  };

  const getTaskObservations = (taskId: string) => {
    return data.observations.filter(o => o.taskId === taskId);
  };

  const getParticipantObservations = (participantId: string) => {
    return data.observations.filter(o => o.participantId === participantId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving test session:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(data);
    }
  };

  const stats = getSessionStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Test Session Manager</h2>
          <p className="text-gray-600 mt-1">Plan, conduct, and analyze usability tests</p>
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

      {/* Session Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Test Session Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Session Title</label>
              <Input
                value={data.title}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="Enter session title..."
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
                  <Button onClick={startSession} className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Session
                  </Button>
                )}
                {data.status === 'active' && (
                  <Button onClick={endSession} variant="outline" className="flex items-center gap-2">
                    <Stop className="w-4 h-4" />
                    End Session
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={data.description}
              onChange={(e) => updateData('description', e.target.value)}
              placeholder="Describe the test session..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Session Stats */}
      {data.status !== 'planning' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Session Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalParticipants}</div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedParticipants}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalObservations}</div>
                <div className="text-sm text-gray-600">Observations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{Math.round(stats.successRate)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Participants ({data.participants.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {data.participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{participant.name}</div>
                    {participant.email && (
                      <div className="text-sm text-gray-600">{participant.email}</div>
                    )}
                    {participant.demographics.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {participant.demographics.map((demo, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {demo}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={participant.status === 'completed' ? 'default' : participant.status === 'no-show' ? 'destructive' : 'outline'}
                  >
                    {participant.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeParticipant(participant.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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
              placeholder="Email (optional)..."
              value={newParticipant.email || ''}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <Button onClick={addParticipant} disabled={!newParticipant.name?.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Participant
          </Button>
        </CardContent>
      </Card>

      {/* Test Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Test Tasks ({data.tasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {data.tasks.map((task, index) => (
              <div key={task.id} className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{index + 1}. {task.title}</span>
                    {task.timeLimit && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.timeLimit}m
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeTask(task.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600 mb-2">{task.description}</div>
                {task.successCriteria.length > 0 && (
                  <div className="text-xs">
                    <span className="font-medium">Success Criteria:</span>
                    <ul className="list-disc list-inside ml-2">
                      {task.successCriteria.map((criteria, i) => (
                        <li key={i}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder="Task title..."
              value={newTask.title || ''}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Task description..."
              value={newTask.description || ''}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
            <Input
              type="number"
              placeholder="Time limit (minutes, optional)..."
              value={newTask.timeLimit || ''}
              onChange={(e) => setNewTask(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || undefined }))}
            />
          </div>
          <Button onClick={addTask} disabled={!newTask.title?.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </CardContent>
      </Card>

      {/* Observations */}
      {data.status === 'active' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Live Observations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <select
                value={newObservation.participantId || ''}
                onChange={(e) => setNewObservation(prev => ({ ...prev, participantId: e.target.value }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Select participant...</option>
                {data.participants.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={newObservation.taskId || ''}
                onChange={(e) => setNewObservation(prev => ({ ...prev, taskId: e.target.value }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Select task...</option>
                {data.tasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
              <select
                value={newObservation.type || 'feedback'}
                onChange={(e) => setNewObservation(prev => ({ ...prev, type: e.target.value as any }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="success">Success</option>
                <option value="failure">Failure</option>
                <option value="confusion">Confusion</option>
                <option value="feedback">Feedback</option>
                <option value="timeout">Timeout</option>
              </select>
            </div>
            
            <Textarea
              placeholder="Observation details..."
              value={newObservation.description || ''}
              onChange={(e) => setNewObservation(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
            
            <div className="flex gap-2">
              <select
                value={newObservation.severity || 'medium'}
                onChange={(e) => setNewObservation(prev => ({ ...prev, severity: e.target.value as any }))}
                className="px-3 py-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <Button onClick={addObservation} disabled={!newObservation.description?.trim() || !newObservation.participantId || !newObservation.taskId}>
                <Plus className="w-4 h-4 mr-2" />
                Add Observation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Observations List */}
      {data.observations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              All Observations ({data.observations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.observations.map((observation) => {
                const participant = data.participants.find(p => p.id === observation.participantId);
                const task = data.tasks.find(t => t.id === observation.taskId);
                
                return (
                  <div key={observation.id} className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={typeColors[observation.type]}>
                          {observation.type}
                        </Badge>
                        <Badge className={severityColors[observation.severity]}>
                          {observation.severity}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {participant?.name} • {task?.title}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeObservation(observation.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-sm">{observation.description}</div>
                    {observation.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {observation.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips and Guidance */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">🧪 Testing Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Test with 5-8 participants for rapid learning</li>
            <li>• Focus on realistic scenarios and tasks</li>
            <li>• Observe behavior, don't just ask opinions</li>
            <li>• Document everything in real-time</li>
            <li>• Look for patterns across participants</li>
            <li>• Prioritize fixes based on severity and frequency</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
