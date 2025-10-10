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
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart,
  ArrowRight,
  Lightbulb,
  Settings,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Zap,
  Users,
  DollarSign
} from 'lucide-react';

export interface Hypothesis {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assumption: string;
  experiment: string;
  successCriteria: string[];
  status: 'draft' | 'active' | 'validated' | 'invalidated' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  validatedAt?: Date;
}

export interface Experiment {
  id: string;
  hypothesisId: string;
  title: string;
  description: string;
  type: 'mvp' | 'landing-page' | 'survey' | 'interview' | 'a-b-test' | 'prototype-test';
  status: 'planning' | 'running' | 'completed' | 'cancelled';
  startDate?: Date;
  endDate?: Date;
  participants?: number;
  results: any;
  insights: string[];
  nextActions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Metric {
  id: string;
  hypothesisId: string;
  name: string;
  description: string;
  type: 'quantitative' | 'qualitative';
  unit: string;
  target: number;
  actual?: number;
  status: 'baseline' | 'improving' | 'declining' | 'stable';
  trend: number; // percentage change
  lastUpdated: Date;
}

export interface BMLCycle {
  id: string;
  projectId: string;
  hypothesisId: string;
  buildPhase: {
    description: string;
    duration: number; // days
    completed: boolean;
    completedAt?: Date;
  };
  measurePhase: {
    metrics: string[];
    duration: number; // days
    completed: boolean;
    completedAt?: Date;
  };
  learnPhase: {
    insights: string[];
    decisions: string[];
    nextSteps: string[];
    completed: boolean;
    completedAt?: Date;
  };
  status: 'build' | 'measure' | 'learn' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

interface BMLDashboardProps {
  projectId: string;
  initialData?: {
    hypotheses: Hypothesis[];
    experiments: Experiment[];
    metrics: Metric[];
    cycles: BMLCycle[];
  };
  onSave: (data: any) => void;
  onExport?: (data: any) => void;
}

const hypothesisTemplates = [
  {
    title: 'User Demand Hypothesis',
    assumption: 'Users have a problem that needs solving',
    experiment: 'Create landing page and measure sign-ups'
  },
  {
    title: 'Value Proposition Hypothesis',
    assumption: 'Users find our solution valuable',
    experiment: 'Test with target users and measure satisfaction'
  },
  {
    title: 'Business Model Hypothesis',
    assumption: 'Users will pay for our solution',
    experiment: 'Test pricing and measure conversion'
  },
  {
    title: 'Channel Hypothesis',
    assumption: 'We can reach users through specific channels',
    experiment: 'Test marketing channels and measure acquisition cost'
  }
];

const experimentTypes = {
  'mvp': { name: 'MVP', description: 'Minimum Viable Product' },
  'landing-page': { name: 'Landing Page', description: 'Marketing page test' },
  'survey': { name: 'Survey', description: 'User feedback collection' },
  'interview': { name: 'Interview', description: 'In-depth user research' },
  'a-b-test': { name: 'A/B Test', description: 'Controlled experiment' },
  'prototype-test': { name: 'Prototype Test', description: 'Usability testing' }
};

export function BMLDashboard({ 
  projectId, 
  initialData, 
  onSave, 
  onExport 
}: BMLDashboardProps) {
  const [data, setData] = useState({
    hypotheses: initialData?.hypotheses || [],
    experiments: initialData?.experiments || [],
    metrics: initialData?.metrics || [],
    cycles: initialData?.cycles || []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [newHypothesis, setNewHypothesis] = useState<Partial<Hypothesis>>({
    title: '',
    description: '',
    assumption: '',
    experiment: '',
    successCriteria: [],
    status: 'draft',
    priority: 'medium'
  });
  const [newExperiment, setNewExperiment] = useState<Partial<Experiment>>({
    title: '',
    description: '',
    type: 'mvp',
    status: 'planning',
    results: {},
    insights: [],
    nextActions: []
  });
  const [selectedHypothesis, setSelectedHypothesis] = useState<string | null>(null);
  const [activeCycle, setActiveCycle] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const updateData = (field: keyof typeof data, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addHypothesis = () => {
    if (newHypothesis.title?.trim() && newHypothesis.assumption?.trim()) {
      const hypothesis: Hypothesis = {
        id: `hypothesis-${Date.now()}`,
        projectId,
        title: newHypothesis.title,
        description: newHypothesis.description || '',
        assumption: newHypothesis.assumption,
        experiment: newHypothesis.experiment || '',
        successCriteria: newHypothesis.successCriteria || [],
        status: 'draft',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setData(prev => ({
        ...prev,
        hypotheses: [...prev.hypotheses, hypothesis]
      }));
      
      setNewHypothesis({
        title: '',
        description: '',
        assumption: '',
        experiment: '',
        successCriteria: [],
        status: 'draft',
        priority: 'medium'
      });
    }
  };

  const updateHypothesis = (hypothesisId: string, field: keyof Hypothesis, value: any) => {
    setData(prev => ({
      ...prev,
      hypotheses: prev.hypotheses.map(h => 
        h.id === hypothesisId ? { ...h, [field]: value, updatedAt: new Date() } : h
      )
    }));
  };

  const removeHypothesis = (hypothesisId: string) => {
    setData(prev => ({
      ...prev,
      hypotheses: prev.hypotheses.filter(h => h.id !== hypothesisId),
      experiments: prev.experiments.filter(e => e.hypothesisId !== hypothesisId),
      metrics: prev.metrics.filter(m => m.hypothesisId !== hypothesisId),
      cycles: prev.cycles.filter(c => c.hypothesisId !== hypothesisId)
    }));
  };

  const addExperiment = () => {
    if (newExperiment.title?.trim() && selectedHypothesis) {
      const experiment: Experiment = {
        id: `experiment-${Date.now()}`,
        hypothesisId: selectedHypothesis,
        title: newExperiment.title,
        description: newExperiment.description || '',
        type: newExperiment.type || 'mvp',
        status: 'planning',
        results: {},
        insights: [],
        nextActions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setData(prev => ({
        ...prev,
        experiments: [...prev.experiments, experiment]
      }));
      
      setNewExperiment({
        title: '',
        description: '',
        type: 'mvp',
        status: 'planning',
        results: {},
        insights: [],
        nextActions: []
      });
    }
  };

  const startBMLCycle = (hypothesisId: string) => {
    const cycle: BMLCycle = {
      id: `cycle-${Date.now()}`,
      projectId,
      hypothesisId,
      buildPhase: {
        description: '',
        duration: 7,
        completed: false
      },
      measurePhase: {
        metrics: [],
        duration: 7,
        completed: false
      },
      learnPhase: {
        insights: [],
        decisions: [],
        nextSteps: [],
        completed: false
      },
      status: 'build',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setData(prev => ({
      ...prev,
      cycles: [...prev.cycles, cycle]
    }));
    setActiveCycle(cycle.id);
  };

  const updateCyclePhase = (cycleId: string, phase: 'build' | 'measure' | 'learn', field: string, value: any) => {
    setData(prev => ({
      ...prev,
      cycles: prev.cycles.map(c => 
        c.id === cycleId ? { 
          ...c, 
          [phase]: { ...c[phase], [field]: value },
          updatedAt: new Date()
        } : c
      )
    }));
  };

  const completeCyclePhase = (cycleId: string, phase: 'build' | 'measure' | 'learn') => {
    setData(prev => ({
      ...prev,
      cycles: prev.cycles.map(c => {
        if (c.id === cycleId) {
          const updated = { ...c, updatedAt: new Date() };
          updated[phase] = { ...updated[phase], completed: true, completedAt: new Date() };
          
          // Move to next phase
          if (phase === 'build') updated.status = 'measure';
          else if (phase === 'measure') updated.status = 'learn';
          else if (phase === 'learn') updated.status = 'completed';
          
          return updated;
        }
        return c;
      })
    }));
  };

  const getHypothesisStats = () => {
    const total = data.hypotheses.length;
    const validated = data.hypotheses.filter(h => h.status === 'validated').length;
    const invalidated = data.hypotheses.filter(h => h.status === 'invalidated').length;
    const active = data.hypotheses.filter(h => h.status === 'active').length;
    
    return { total, validated, invalidated, active };
  };

  const getActiveCycle = () => {
    return data.cycles.find(c => c.id === activeCycle);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving BML data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(data);
    }
  };

  const stats = getHypothesisStats();
  const currentCycle = getActiveCycle();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Build-Measure-Learn Dashboard</h2>
          <p className="text-gray-600 mt-1">Track hypotheses, experiments, and learning cycles</p>
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

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium">Total Hypotheses</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium">Validated</p>
                <p className="text-2xl font-bold text-green-600">{stats.validated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div className="ml-2">
                <p className="text-sm font-medium">Invalidated</p>
                <p className="text-2xl font-bold text-red-600">{stats.invalidated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Play className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hypotheses Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Hypotheses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Hypothesis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={newHypothesis.title || ''}
                onChange={(e) => setNewHypothesis(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., User Demand Hypothesis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={newHypothesis.priority || 'medium'}
                onChange={(e) => setNewHypothesis(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Assumption</label>
            <Textarea
              value={newHypothesis.assumption || ''}
              onChange={(e) => setNewHypothesis(prev => ({ ...prev, assumption: e.target.value }))}
              placeholder="We believe that..."
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Experiment</label>
            <Textarea
              value={newHypothesis.experiment || ''}
              onChange={(e) => setNewHypothesis(prev => ({ ...prev, experiment: e.target.value }))}
              placeholder="We will test this by..."
              rows={2}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={addHypothesis} disabled={!newHypothesis.title?.trim() || !newHypothesis.assumption?.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hypothesis
            </Button>
            <div className="flex gap-1">
              {hypothesisTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewHypothesis(prev => ({
                    ...prev,
                    title: template.title,
                    assumption: template.assumption,
                    experiment: template.experiment
                  }))}
                >
                  {template.title}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hypotheses List */}
      <Card>
        <CardHeader>
          <CardTitle>Hypotheses List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.hypotheses.map((hypothesis) => (
              <div key={hypothesis.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{hypothesis.title}</h3>
                    <Badge 
                      variant={hypothesis.status === 'validated' ? 'default' : hypothesis.status === 'invalidated' ? 'destructive' : 'outline'}
                    >
                      {hypothesis.status}
                    </Badge>
                    <Badge variant="outline">{hypothesis.priority}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startBMLCycle(hypothesis.id)}
                      className="flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      Start BML
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeHypothesis(hypothesis.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Assumption:</span> {hypothesis.assumption}
                  </div>
                  <div>
                    <span className="font-medium">Experiment:</span> {hypothesis.experiment}
                  </div>
                  {hypothesis.description && (
                    <div>
                      <span className="font-medium">Description:</span> {hypothesis.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active BML Cycle */}
      {currentCycle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Active BML Cycle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Build Phase */}
            <div className={`p-4 rounded-lg border-2 ${currentCycle.status === 'build' ? 'border-blue-500 bg-blue-50' : currentCycle.buildPhase.completed ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Build Phase
                </h3>
                {currentCycle.buildPhase.completed ? (
                  <Badge variant="default">Completed</Badge>
                ) : currentCycle.status === 'build' ? (
                  <Badge variant="secondary">Active</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </div>
              
              {currentCycle.status === 'build' && (
                <div className="space-y-2">
                  <Textarea
                    value={currentCycle.buildPhase.description}
                    onChange={(e) => updateCyclePhase(currentCycle.id, 'build', 'description', e.target.value)}
                    placeholder="What are you building?"
                    rows={2}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={currentCycle.buildPhase.duration}
                      onChange={(e) => updateCyclePhase(currentCycle.id, 'build', 'duration', parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <span className="text-sm">days</span>
                    <Button
                      size="sm"
                      onClick={() => completeCyclePhase(currentCycle.id, 'build')}
                      disabled={!currentCycle.buildPhase.description.trim()}
                    >
                      Complete Build
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Measure Phase */}
            <div className={`p-4 rounded-lg border-2 ${currentCycle.status === 'measure' ? 'border-blue-500 bg-blue-50' : currentCycle.measurePhase.completed ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <BarChart className="w-4 h-4" />
                  Measure Phase
                </h3>
                {currentCycle.measurePhase.completed ? (
                  <Badge variant="default">Completed</Badge>
                ) : currentCycle.status === 'measure' ? (
                  <Badge variant="secondary">Active</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </div>
              
              {currentCycle.status === 'measure' && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Metrics to Track</label>
                    <Textarea
                      value={currentCycle.measurePhase.metrics.join('\n')}
                      onChange={(e) => updateCyclePhase(currentCycle.id, 'measure', 'metrics', e.target.value.split('\n').filter(m => m.trim()))}
                      placeholder="List metrics to measure..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={currentCycle.measurePhase.duration}
                      onChange={(e) => updateCyclePhase(currentCycle.id, 'measure', 'duration', parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <span className="text-sm">days</span>
                    <Button
                      size="sm"
                      onClick={() => completeCyclePhase(currentCycle.id, 'measure')}
                      disabled={currentCycle.measurePhase.metrics.length === 0}
                    >
                      Complete Measure
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Learn Phase */}
            <div className={`p-4 rounded-lg border-2 ${currentCycle.status === 'learn' ? 'border-blue-500 bg-blue-50' : currentCycle.learnPhase.completed ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Learn Phase
                </h3>
                {currentCycle.learnPhase.completed ? (
                  <Badge variant="default">Completed</Badge>
                ) : currentCycle.status === 'learn' ? (
                  <Badge variant="secondary">Active</Badge>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </div>
              
              {currentCycle.status === 'learn' && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Key Insights</label>
                    <Textarea
                      value={currentCycle.learnPhase.insights.join('\n')}
                      onChange={(e) => updateCyclePhase(currentCycle.id, 'learn', 'insights', e.target.value.split('\n').filter(i => i.trim()))}
                      placeholder="What did you learn?"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Decisions Made</label>
                    <Textarea
                      value={currentCycle.learnPhase.decisions.join('\n')}
                      onChange={(e) => updateCyclePhase(currentCycle.id, 'learn', 'decisions', e.target.value.split('\n').filter(d => d.trim()))}
                      placeholder="What decisions did you make?"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Next Steps</label>
                    <Textarea
                      value={currentCycle.learnPhase.nextSteps.join('\n')}
                      onChange={(e) => updateCyclePhase(currentCycle.id, 'learn', 'nextSteps', e.target.value.split('\n').filter(s => s.trim()))}
                      placeholder="What are your next steps?"
                      rows={2}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => completeCyclePhase(currentCycle.id, 'learn')}
                    disabled={currentCycle.learnPhase.insights.length === 0}
                  >
                    Complete Learn & Start New Cycle
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips and Guidance */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">🔄 BML Cycle Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Keep build cycles short (1-2 weeks maximum)</li>
            <li>• Focus on learning, not building perfect features</li>
            <li>• Measure what matters most to your hypothesis</li>
            <li>• Be honest about what the data tells you</li>
            <li>• Pivot or persevere based on evidence</li>
            <li>• Document learnings for future reference</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
