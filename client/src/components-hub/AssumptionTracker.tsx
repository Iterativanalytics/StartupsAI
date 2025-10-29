import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Target, TrendingUp, BarChart3, FileText } from 'lucide-react';
import { Assumption } from '@/types-hub';

interface AssumptionTrackerProps {
  assumptions: Assumption[];
  onUpdateAssumption: (id: string, updates: Partial<Assumption>) => void;
  onAddAssumption: (assumption: Omit<Assumption, 'id'>) => void;
  onDeleteAssumption: (id: string) => void;
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

interface ValidationExperiment {
  id: string;
  assumptionId: string;
  title: string;
  description: string;
  status: 'planned' | 'running' | 'completed' | 'failed';
  startDate: Date;
  endDate?: Date;
  results?: string;
  confidence: number; // 0-100
  evidence: string[];
}

const AssumptionTracker: React.FC<AssumptionTrackerProps> = ({
  assumptions,
  onUpdateAssumption,
  onAddAssumption,
  onDeleteAssumption,
  addToast
}) => {
  const [activeTab, setActiveTab] = useState<'assumptions' | 'experiments' | 'insights'>('assumptions');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAssumption, setEditingAssumption] = useState<Assumption | null>(null);
  const [experiments, setExperiments] = useState<ValidationExperiment[]>([]);
  const [newAssumption, setNewAssumption] = useState({
    text: '',
    risk: 'medium' as 'high' | 'medium' | 'low',
    sourceSection: ''
  });

  // Calculate validation statistics
  const validationStats = {
    total: assumptions.length,
    validated: assumptions.filter(a => a.status === 'validated').length,
    invalidated: assumptions.filter(a => a.status === 'invalidated').length,
    untested: assumptions.filter(a => a.status === 'untested').length,
    highRisk: assumptions.filter(a => a.risk === 'high').length,
    validationRate: assumptions.length > 0 ? 
      (assumptions.filter(a => a.status !== 'untested').length / assumptions.length) * 100 : 0
  };

  const handleAddAssumption = () => {
    if (!newAssumption.text.trim()) {
      addToast('Please enter assumption text', 'error');
      return;
    }
    
    const assumption: Omit<Assumption, 'id'> = {
      ...newAssumption,
      status: 'untested'
    };
    
    onAddAssumption(assumption);
    setNewAssumption({ text: '', risk: 'medium', sourceSection: '' });
    setShowAddModal(false);
    addToast('Assumption added successfully', 'success');
  };

  const handleUpdateStatus = (id: string, status: 'validated' | 'invalidated' | 'untested') => {
    onUpdateAssumption(id, { status });
    addToast(`Assumption marked as ${status}`, 'success');
  };

  const handleCreateExperiment = (assumption: Assumption) => {
    const experiment: ValidationExperiment = {
      id: `exp_${Date.now()}`,
      assumptionId: assumption.id,
      title: `Validate: ${assumption.text.substring(0, 50)}...`,
      description: `Test the assumption: ${assumption.text}`,
      status: 'planned',
      startDate: new Date(),
      confidence: 0,
      evidence: []
    };
    
    setExperiments(prev => [...prev, experiment]);
    addToast('Experiment created successfully', 'success');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'invalidated': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'untested': return <Clock className="w-5 h-5 text-gray-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assumption Tracker</h2>
            <p className="text-gray-600">Track and validate your business assumptions in real-time</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Add Assumption
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{validationStats.total}</div>
          <div className="text-sm text-blue-800">Total Assumptions</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{validationStats.validated}</div>
          <div className="text-sm text-green-800">Validated</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{validationStats.invalidated}</div>
          <div className="text-sm text-red-800">Invalidated</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{validationStats.untested}</div>
          <div className="text-sm text-yellow-800">Untested</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{Math.round(validationStats.validationRate)}%</div>
          <div className="text-sm text-purple-800">Validation Rate</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('assumptions')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'assumptions'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Assumptions
        </button>
        <button
          onClick={() => setActiveTab('experiments')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'experiments'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Experiments
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'insights'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Insights
        </button>
      </div>

      {/* Assumptions Tab */}
      {activeTab === 'assumptions' && (
        <div className="space-y-4">
          {assumptions.map((assumption) => (
            <div key={assumption.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(assumption.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(assumption.risk)}`}>
                      {assumption.risk.toUpperCase()} RISK
                    </span>
                    <span className="text-sm text-gray-500">from {assumption.sourceSection}</span>
                  </div>
                  <p className="text-gray-900 mb-3">{assumption.text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(assumption.id, 'validated')}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Mark Validated
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(assumption.id, 'invalidated')}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Mark Invalidated
                    </button>
                    <button
                      onClick={() => handleCreateExperiment(assumption)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      Create Experiment
                    </button>
                    <button
                      onClick={() => onDeleteAssumption(assumption.id)}
                      className="text-gray-500 hover:text-red-600 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {assumptions.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assumptions yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first business assumption</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add First Assumption
              </button>
            </div>
          )}
        </div>
      )}

      {/* Experiments Tab */}
      {activeTab === 'experiments' && (
        <div className="space-y-4">
          {experiments.map((experiment) => (
            <div key={experiment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900">{experiment.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  experiment.status === 'completed' ? 'bg-green-100 text-green-800' :
                  experiment.status === 'running' ? 'bg-blue-100 text-blue-800' :
                  experiment.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {experiment.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{experiment.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Confidence: {experiment.confidence}%</span>
                <span>Started: {experiment.startDate.toLocaleDateString()}</span>
                {experiment.endDate && <span>Ended: {experiment.endDate.toLocaleDateString()}</span>}
              </div>
            </div>
          ))}
          
          {experiments.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No experiments yet</h3>
              <p className="text-gray-500">Create experiments to validate your assumptions</p>
            </div>
          )}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Validation Insights</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">High-Risk Assumptions</h4>
                <p className="text-sm text-gray-600">
                  {validationStats.highRisk} high-risk assumptions need immediate validation
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Validation Progress</h4>
                <p className="text-sm text-gray-600">
                  {Math.round(validationStats.validationRate)}% of assumptions have been tested
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {assumptions.filter(a => a.risk === 'high' && a.status === 'untested').length > 0 && (
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Validate {assumptions.filter(a => a.risk === 'high' && a.status === 'untested').length} high-risk assumptions
                </li>
              )}
              {validationStats.validated > 0 && (
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Update business plan with {validationStats.validated} validated assumptions
                </li>
              )}
              {validationStats.invalidated > 0 && (
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Pivot strategy based on {validationStats.invalidated} invalidated assumptions
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Add Assumption Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Assumption</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assumption Text</label>
                <textarea
                  value={newAssumption.text}
                  onChange={(e) => setNewAssumption(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Describe your business assumption..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                <select
                  value={newAssumption.risk}
                  onChange={(e) => setNewAssumption(prev => ({ ...prev, risk: e.target.value as 'high' | 'medium' | 'low' }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Section</label>
                <input
                  type="text"
                  value={newAssumption.sourceSection}
                  onChange={(e) => setNewAssumption(prev => ({ ...prev, sourceSection: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Financial Projections, Market Analysis"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAssumption}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add Assumption
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssumptionTracker;
