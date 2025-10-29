import React, { useState } from 'react';
import { 
  TestTube, 
  Target, 
  Calendar, 
  Users, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Play,
  Pause,
  Square,
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';

interface Experiment {
  id: string;
  title: string;
  description: string;
  hypothesis: string;
  assumptionId: string;
  type: 'landing-page' | 'concierge' | 'prototype' | 'ab-test' | 'survey' | 'interview';
  status: 'planned' | 'running' | 'completed' | 'failed';
  startDate: Date;
  endDate?: Date;
  targetUsers: number;
  actualUsers?: number;
  successCriteria: {
    metric: string;
    target: number;
    actual?: number;
  }[];
  results?: {
    validated: boolean;
    confidence: number;
    keyFindings: string[];
    nextSteps: string[];
  };
  resources: string[];
  timeline: string;
}

interface ExperimentDesignerProps {
  assumptions: any[];
  onSaveExperiment: (experiment: Experiment) => void;
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const EXPERIMENT_TYPES = [
  {
    id: 'landing-page',
    name: 'Landing Page Test',
    description: 'Test demand with a simple landing page',
    icon: Target,
    duration: '1-2 weeks',
    effort: 'Low',
    cost: 'Low'
  },
  {
    id: 'concierge',
    name: 'Concierge Test',
    description: 'Manually deliver the service to test value',
    icon: Users,
    duration: '2-4 weeks',
    effort: 'Medium',
    cost: 'Low'
  },
  {
    id: 'prototype',
    name: 'Prototype Test',
    description: 'Test with a working prototype',
    icon: TestTube,
    duration: '2-6 weeks',
    effort: 'High',
    cost: 'Medium'
  },
  {
    id: 'ab-test',
    name: 'A/B Test',
    description: 'Compare two versions of a feature',
    icon: BarChart3,
    duration: '1-4 weeks',
    effort: 'Medium',
    cost: 'Low'
  },
  {
    id: 'survey',
    name: 'Survey',
    description: 'Gather quantitative feedback',
    icon: FileText,
    duration: '1-2 weeks',
    effort: 'Low',
    cost: 'Low'
  },
  {
    id: 'interview',
    name: 'User Interview',
    description: 'Deep qualitative research',
    icon: Users,
    duration: '1-3 weeks',
    effort: 'Medium',
    cost: 'Low'
  }
];

const ExperimentDesigner: React.FC<ExperimentDesignerProps> = ({
  assumptions,
  onSaveExperiment,
  addToast
}) => {
  const [showDesigner, setShowDesigner] = useState(false);
  const [selectedAssumption, setSelectedAssumption] = useState<any>(null);
  const [experimentType, setExperimentType] = useState<string>('');
  const [experiment, setExperiment] = useState<Partial<Experiment>>({
    title: '',
    description: '',
    hypothesis: '',
    targetUsers: 100,
    successCriteria: [],
    resources: [],
    timeline: '2 weeks'
  });

  const handleCreateExperiment = () => {
    if (!selectedAssumption || !experimentType) {
      addToast('Please select an assumption and experiment type', 'error');
      return;
    }

    const newExperiment: Experiment = {
      id: `exp_${Date.now()}`,
      title: experiment.title || `Test: ${selectedAssumption.text.substring(0, 50)}...`,
      description: experiment.description || `Validate: ${selectedAssumption.text}`,
      hypothesis: experiment.hypothesis || `We believe that ${selectedAssumption.text}`,
      assumptionId: selectedAssumption.id,
      type: experimentType as any,
      status: 'planned',
      startDate: new Date(),
      targetUsers: experiment.targetUsers || 100,
      successCriteria: experiment.successCriteria || [],
      resources: experiment.resources || [],
      timeline: experiment.timeline || '2 weeks'
    };

    onSaveExperiment(newExperiment);
    addToast('Experiment created successfully', 'success');
    setShowDesigner(false);
    setSelectedAssumption(null);
    setExperimentType('');
    setExperiment({});
  };

  const addSuccessCriteria = () => {
    setExperiment(prev => ({
      ...prev,
      successCriteria: [...(prev.successCriteria || []), { metric: '', target: 0 }]
    }));
  };

  const updateSuccessCriteria = (index: number, field: string, value: string | number) => {
    setExperiment(prev => ({
      ...prev,
      successCriteria: prev.successCriteria?.map((criteria, i) => 
        i === index ? { ...criteria, [field]: value } : criteria
      ) || []
    }));
  };

  const removeSuccessCriteria = (index: number) => {
    setExperiment(prev => ({
      ...prev,
      successCriteria: prev.successCriteria?.filter((_, i) => i !== index) || []
    }));
  };

  const addResource = () => {
    setExperiment(prev => ({
      ...prev,
      resources: [...(prev.resources || []), '']
    }));
  };

  const updateResource = (index: number, value: string) => {
    setExperiment(prev => ({
      ...prev,
      resources: prev.resources?.map((resource, i) => i === index ? value : resource) || []
    }));
  };

  const removeResource = (index: number) => {
    setExperiment(prev => ({
      ...prev,
      resources: prev.resources?.filter((_, i) => i !== index) || []
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'running': return <Play className="w-5 h-5 text-blue-600" />;
      case 'failed': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TestTube className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Experiment Designer</h2>
            <p className="text-gray-600">Design and track validation experiments</p>
          </div>
        </div>
        <button
          onClick={() => setShowDesigner(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Design Experiment
        </button>
      </div>

      {/* Experiment Types Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {EXPERIMENT_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <div key={type.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Icon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>{type.duration}</span>
                    <span>•</span>
                    <span>{type.effort} effort</span>
                    <span>•</span>
                    <span>{type.cost} cost</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Experiment Designer Modal */}
      {showDesigner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Design New Experiment</h3>
            
            <div className="space-y-6">
              {/* Step 1: Select Assumption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Assumption to Test</label>
                <select
                  value={selectedAssumption?.id || ''}
                  onChange={(e) => {
                    const assumption = assumptions.find(a => a.id === e.target.value);
                    setSelectedAssumption(assumption);
                    if (assumption) {
                      setExperiment(prev => ({
                        ...prev,
                        hypothesis: `We believe that ${assumption.text}`,
                        title: `Test: ${assumption.text.substring(0, 50)}...`
                      }));
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose an assumption...</option>
                  {assumptions.map((assumption) => (
                    <option key={assumption.id} value={assumption.id}>
                      {assumption.text.substring(0, 100)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Select Experiment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experiment Type</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {EXPERIMENT_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setExperimentType(type.id)}
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          experimentType === type.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{type.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Experiment Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experiment Title</label>
                <input
                  type="text"
                  value={experiment.title || ''}
                  onChange={(e) => setExperiment(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter experiment title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={experiment.description || ''}
                  onChange={(e) => setExperiment(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Describe what you'll test..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hypothesis</label>
                <textarea
                  value={experiment.hypothesis || ''}
                  onChange={(e) => setExperiment(prev => ({ ...prev, hypothesis: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={2}
                  placeholder="We believe that..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Users</label>
                  <input
                    type="number"
                    value={experiment.targetUsers || 100}
                    onChange={(e) => setExperiment(prev => ({ ...prev, targetUsers: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                  <select
                    value={experiment.timeline || '2 weeks'}
                    onChange={(e) => setExperiment(prev => ({ ...prev, timeline: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                  </select>
                </div>
              </div>

              {/* Success Criteria */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Success Criteria</label>
                  <button
                    onClick={addSuccessCriteria}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    + Add Criteria
                  </button>
                </div>
                <div className="space-y-2">
                  {experiment.successCriteria?.map((criteria, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={criteria.metric}
                        onChange={(e) => updateSuccessCriteria(index, 'metric', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Metric (e.g., conversion rate, engagement)"
                      />
                      <input
                        type="number"
                        value={criteria.target}
                        onChange={(e) => updateSuccessCriteria(index, 'target', parseFloat(e.target.value))}
                        className="w-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Target"
                      />
                      <button
                        onClick={() => removeSuccessCriteria(index)}
                        className="text-red-600 hover:text-red-700 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Resources Needed</label>
                  <button
                    onClick={addResource}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    + Add Resource
                  </button>
                </div>
                <div className="space-y-2">
                  {experiment.resources?.map((resource, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={resource}
                        onChange={(e) => updateResource(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Resource needed (e.g., landing page builder, survey tool)"
                      />
                      <button
                        onClick={() => removeResource(index)}
                        className="text-red-600 hover:text-red-700 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDesigner(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateExperiment}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Create Experiment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentDesigner;
