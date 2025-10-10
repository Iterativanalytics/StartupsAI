import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Download, 
  Target, 
  Clock, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Settings,
  FileText,
  Image,
  Video,
  Link,
  Code
} from 'lucide-react';

export interface PrototypeAsset {
  type: 'image' | 'video' | 'pdf' | 'figma-link' | 'code';
  url: string;
  description: string;
}

export interface TestPlan {
  objectives: string[];
  methods: string[];
  participants: number;
  scenarios: string[];
  successCriteria: string[];
}

export interface PrototypeData {
  id: string;
  ideaId: string;
  learningGoals: string[];
  successMetrics: string[];
  fidelity: 'lo-fi' | 'mid-fi' | 'hi-fi' | 'experience';
  method: 'sketch' | 'paper' | 'wireframe' | 'storyboard' | 'wizard-of-oz' | 'role-play' | 'functional';
  effortEstimate: number; // hours
  realismLevel: number; // 1-10
  disposability: number; // 1-10
  assets: PrototypeAsset[];
  testPlan: TestPlan;
  testResults: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface PrototypePlannerProps {
  projectId: string;
  ideaId: string;
  ideaDescription: string;
  initialData?: PrototypeData;
  onSave: (data: PrototypeData) => void;
  onExport?: (data: PrototypeData) => void;
}

const fidelityOptions = {
  'lo-fi': {
    name: 'Low Fidelity',
    description: 'Quick sketches, paper prototypes',
    methods: ['sketch', 'paper', 'wireframe'],
    effort: '1-4 hours',
    realism: '2-4',
    disposability: '8-10'
  },
  'mid-fi': {
    name: 'Medium Fidelity',
    description: 'Digital wireframes, clickable prototypes',
    methods: ['wireframe', 'storyboard'],
    effort: '4-12 hours',
    realism: '5-7',
    disposability: '5-7'
  },
  'hi-fi': {
    name: 'High Fidelity',
    description: 'Detailed, polished prototypes',
    methods: ['functional', 'wizard-of-oz'],
    effort: '12-40 hours',
    realism: '8-10',
    disposability: '2-4'
  },
  'experience': {
    name: 'Experience Prototype',
    description: 'Full service or experience simulation',
    methods: ['role-play', 'wizard-of-oz', 'functional'],
    effort: '20-80 hours',
    realism: '9-10',
    disposability: '1-3'
  }
};

const methodOptions = {
  'sketch': { name: 'Sketch', icon: FileText, description: 'Hand-drawn concepts' },
  'paper': { name: 'Paper Prototype', icon: FileText, description: 'Physical paper mockups' },
  'wireframe': { name: 'Wireframe', icon: Settings, description: 'Digital wireframes' },
  'storyboard': { name: 'Storyboard', icon: Image, description: 'Visual story sequence' },
  'wizard-of-oz': { name: 'Wizard of Oz', icon: Zap, description: 'Human-powered simulation' },
  'role-play': { name: 'Role Play', icon: Target, description: 'Act out the experience' },
  'functional': { name: 'Functional', icon: Code, description: 'Working prototype' }
};

const learningGoalTemplates = [
  'Validate user understanding of the concept',
  'Test usability of the interface',
  'Measure desirability of the solution',
  'Assess technical feasibility',
  'Evaluate business model viability',
  'Understand user emotional response',
  'Test specific user flows',
  'Validate pricing assumptions',
  'Test accessibility features',
  'Measure performance metrics'
];

export function PrototypePlanner({ 
  projectId, 
  ideaId,
  ideaDescription,
  initialData, 
  onSave, 
  onExport 
}: PrototypePlannerProps) {
  const [data, setData] = useState<PrototypeData>(
    initialData || {
      id: '',
      ideaId,
      learningGoals: [],
      successMetrics: [],
      fidelity: 'lo-fi',
      method: 'sketch',
      effortEstimate: 2,
      realismLevel: 5,
      disposability: 8,
      assets: [],
      testPlan: {
        objectives: [],
        methods: [],
        participants: 5,
        scenarios: [],
        successCriteria: []
      },
      testResults: []
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [newLearningGoal, setNewLearningGoal] = useState('');
  const [newSuccessMetric, setNewSuccessMetric] = useState('');
  const [newAsset, setNewAsset] = useState<Partial<PrototypeAsset>>({
    type: 'image',
    url: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const updateData = (field: keyof PrototypeData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addLearningGoal = () => {
    if (newLearningGoal.trim()) {
      setData(prev => ({
        ...prev,
        learningGoals: [...prev.learningGoals, newLearningGoal.trim()]
      }));
      setNewLearningGoal('');
    }
  };

  const removeLearningGoal = (index: number) => {
    setData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.filter((_, i) => i !== index)
    }));
  };

  const addSuccessMetric = () => {
    if (newSuccessMetric.trim()) {
      setData(prev => ({
        ...prev,
        successMetrics: [...prev.successMetrics, newSuccessMetric.trim()]
      }));
      setNewSuccessMetric('');
    }
  };

  const removeSuccessMetric = (index: number) => {
    setData(prev => ({
      ...prev,
      successMetrics: prev.successMetrics.filter((_, i) => i !== index)
    }));
  };

  const addAsset = () => {
    if (newAsset.url?.trim() && newAsset.description?.trim()) {
      setData(prev => ({
        ...prev,
        assets: [...prev.assets, newAsset as PrototypeAsset]
      }));
      setNewAsset({ type: 'image', url: '', description: '' });
    }
  };

  const removeAsset = (index: number) => {
    setData(prev => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index)
    }));
  };

  const updateTestPlan = (field: keyof TestPlan, value: any) => {
    setData(prev => ({
      ...prev,
      testPlan: { ...prev.testPlan, [field]: value }
    }));
  };

  const getFidelityInfo = () => fidelityOptions[data.fidelity];
  const getMethodInfo = () => methodOptions[data.method];

  const getGoldilocksScore = () => {
    const effortScore = data.effortEstimate <= 8 ? 10 : data.effortEstimate <= 20 ? 7 : 3;
    const realismScore = data.realismLevel >= 6 ? 10 : data.realismLevel >= 4 ? 7 : 3;
    const disposabilityScore = data.disposability >= 6 ? 10 : data.disposability >= 4 ? 7 : 3;
    
    return Math.round((effortScore + realismScore + disposabilityScore) / 3);
  };

  const getGoldilocksColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGoldilocksIcon = (score: number) => {
    if (score >= 8) return CheckCircle;
    if (score >= 6) return AlertTriangle;
    return AlertTriangle;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving prototype:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(data);
    }
  };

  const GoldilocksIcon = getGoldilocksIcon(getGoldilocksScore());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prototype Planner</h2>
          <p className="text-gray-600 mt-1">
            Plan your prototype for: {ideaDescription}
          </p>
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

      {/* Learning Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Learning Goals
          </CardTitle>
          <p className="text-sm text-gray-600">What do you need to learn from this prototype?</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {data.learningGoals.map((goal, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-sm">{goal}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeLearningGoal(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add learning goal..."
              value={newLearningGoal}
              onChange={(e) => setNewLearningGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addLearningGoal()}
              className="flex-1"
            />
            <Button onClick={addLearningGoal} disabled={!newLearningGoal.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {learningGoalTemplates.slice(0, 6).map((template, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setNewLearningGoal(template)}
                className="text-left justify-start"
              >
                {template}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fidelity Decision Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Fidelity & Method Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fidelity Level</label>
              <select
                value={data.fidelity}
                onChange={(e) => updateData('fidelity', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {Object.entries(fidelityOptions).map(([key, option]) => (
                  <option key={key} value={key}>{option.name}</option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">
                {getFidelityInfo().description}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prototyping Method</label>
              <select
                value={data.method}
                onChange={(e) => updateData('method', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {Object.entries(methodOptions).map(([key, option]) => (
                  <option key={key} value={key}>{option.name}</option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">
                {getMethodInfo().description}
              </p>
            </div>
          </div>

          {/* Goldilocks Quality Check */}
          <div className="bg-yellow-50 p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <GoldilocksIcon className={`w-4 h-4 ${getGoldilocksColor(getGoldilocksScore())}`} />
              <span className={`font-medium ${getGoldilocksColor(getGoldilocksScore())}`}>
                Goldilocks Quality Score: {getGoldilocksScore()}/10
              </span>
            </div>
            <p className="text-sm text-yellow-800">
              {getGoldilocksScore() >= 8 
                ? "Perfect! Your prototype is well-balanced for learning."
                : getGoldilocksScore() >= 6 
                ? "Good, but consider adjusting effort, realism, or disposability."
                : "Consider a different fidelity level or method for better learning."
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Effort & Quality Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Effort & Quality Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Effort Estimate (hours)</label>
              <Input
                type="number"
                value={data.effortEstimate}
                onChange={(e) => updateData('effortEstimate', parseInt(e.target.value) || 0)}
                min="1"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Realism Level (1-10)</label>
              <Input
                type="number"
                value={data.realismLevel}
                onChange={(e) => updateData('realismLevel', parseInt(e.target.value) || 1)}
                min="1"
                max="10"
              />
              <p className="text-xs text-gray-600 mt-1">
                How realistic should it be for honest feedback?
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Disposability (1-10)</label>
              <Input
                type="number"
                value={data.disposability}
                onChange={(e) => updateData('disposability', parseInt(e.target.value) || 1)}
                min="1"
                max="10"
              />
              <p className="text-xs text-gray-600 mt-1">
                How easy should it be to throw away?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Success Metrics
          </CardTitle>
          <p className="text-sm text-gray-600">How will you measure success?</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {data.successMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-sm">{metric}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeSuccessMetric(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add success metric..."
              value={newSuccessMetric}
              onChange={(e) => setNewSuccessMetric(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSuccessMetric()}
              className="flex-1"
            />
            <Button onClick={addSuccessMetric} disabled={!newSuccessMetric.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Prototype Assets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {data.assets.map((asset, index) => {
              const Icon = methodOptions[asset.type]?.icon || FileText;
              return (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{asset.type}</span>
                    <span className="text-sm text-gray-600">{asset.description}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAsset(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              );
            })}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <select
              value={newAsset.type}
              onChange={(e) => setNewAsset(prev => ({ ...prev, type: e.target.value as any }))}
              className="px-3 py-2 border rounded-md"
            >
              {Object.entries(methodOptions).map(([key, option]) => (
                <option key={key} value={key}>{option.name}</option>
              ))}
            </select>
            <Input
              placeholder="URL or file path..."
              value={newAsset.url || ''}
              onChange={(e) => setNewAsset(prev => ({ ...prev, url: e.target.value }))}
            />
            <Input
              placeholder="Description..."
              value={newAsset.description || ''}
              onChange={(e) => setNewAsset(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <Button onClick={addAsset} disabled={!newAsset.url?.trim() || !newAsset.description?.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
        </CardContent>
      </Card>

      {/* Test Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Test Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Participants</label>
              <Input
                type="number"
                value={data.testPlan.participants}
                onChange={(e) => updateTestPlan('participants', parseInt(e.target.value) || 0)}
                min="1"
                max="20"
              />
              <p className="text-xs text-gray-600 mt-1">
                Recommended: 5 users for rapid learning
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Test Methods</label>
              <select
                multiple
                value={data.testPlan.methods}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  updateTestPlan('methods', selected);
                }}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="user-interview">User Interview</option>
                <option value="usability-test">Usability Test</option>
                <option value="a-b-test">A/B Test</option>
                <option value="survey">Survey</option>
                <option value="observation">Observation</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips and Guidance */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Prototyping Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Start with low-fidelity to test concepts quickly</li>
            <li>• Choose fidelity based on what you need to learn</li>
            <li>• Balance realism with disposability</li>
            <li>• Focus on the most critical user flows</li>
            <li>• Test with real users, not just your team</li>
            <li>• Document everything for future iterations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
