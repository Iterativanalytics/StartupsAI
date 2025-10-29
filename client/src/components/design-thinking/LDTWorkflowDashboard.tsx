// ============================================================================
// LEAN DESIGN THINKING™ WORKFLOW DASHBOARD
// LLDT workflow management and insights dashboard
// ============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Brain, Users, Lightbulb, Wrench, TestTube, 
  TrendingUp, Clock, CheckCircle, AlertCircle 
} from 'lucide-react';

interface LLDTWorkflow {
  id: string;
  name: string;
  description: string;
  currentPhase: string;
  status: string;
  createdAt: string;
}

interface WorkflowSummary {
  workflow: LLDTWorkflow;
  stats: {
    empathyDataCount: number;
    povStatementCount: number;
    hmwQuestionCount: number;
    ideaCount: number;
    prototypeCount: number;
    testSessionCount: number;
    insightCount: number;
  };
  recentActivity: {
    latestInsights: any[];
    topIdeas: any[];
    recentTests: any[];
  };
}

export function LDTWorkflowDashboard({ workflowId }: { workflowId: string }) {
  const [summary, setSummary] = useState<WorkflowSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const phases = [
    { key: 'empathize', label: 'Empathize', icon: Brain, color: 'text-purple-500' },
    { key: 'define', label: 'Define', icon: Users, color: 'text-blue-500' },
    { key: 'ideate', label: 'Ideate', icon: Lightbulb, color: 'text-yellow-500' },
    { key: 'prototype', label: 'Prototype', icon: Wrench, color: 'text-green-500' },
    { key: 'test', label: 'Test', icon: TestTube, color: 'text-red-500' }
  ];

  useEffect(() => {
    loadSummary();
  }, [workflowId]);

  const loadSummary = async () => {
    try {
      const response = await fetch(`/api/dt/workflows/${workflowId}`);
      const result = await response.json();
      if (result.success) {
        setSummary(result.data);
      }
    } catch (error) {
      console.error('Error loading workflow summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const transitionPhase = async (newPhase: string) => {
    try {
      const response = await fetch(`/api/dt/workflows/${workflowId}/phase`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: newPhase })
      });
      
      const result = await response.json();
      if (result.success) {
        await loadSummary();
      }
    } catch (error) {
      console.error('Error transitioning phase:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Workflow not found</p>
      </div>
    );
  }

  const currentPhaseIndex = phases.findIndex(p => p.key === summary.workflow.currentPhase);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{summary.workflow.name}</h1>
        <p className="text-gray-600">{summary.workflow.description}</p>
      </div>

      {/* Phase Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Lean Design Thinking™ Process</h2>
        
        <div className="flex items-center justify-between">
          {phases.map((phase, index) => {
            const PhaseIcon = phase.icon;
            const isActive = phase.key === summary.workflow.currentPhase;
            const isCompleted = index < currentPhaseIndex;
            
            return (
              <React.Fragment key={phase.key}>
                <button
                  onClick={() => transitionPhase(phase.key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-blue-100 border-2 border-blue-500 scale-105' 
                      : isCompleted
                      ? 'bg-green-50 border border-green-300'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className={`p-3 rounded-full ${
                    isActive ? 'bg-blue-500 text-white' : 
                    isCompleted ? 'bg-green-500 text-white' : 
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <PhaseIcon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`font-medium text-sm ${
                    isActive ? 'text-blue-700' : 
                    isCompleted ? 'text-green-700' : 
                    'text-gray-600'
                  }`}>
                    {phase.label}
                  </span>
                </button>
                
                {index < phases.length - 1 && (
                  <div className={`flex-1 h-0.5 ${
                    index < currentPhaseIndex ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <StatCard
          label="Empathy Data"
          value={summary.stats.empathyDataCount}
          icon={Brain}
          color="purple"
        />
        <StatCard
          label="POV Statements"
          value={summary.stats.povStatementCount}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="HMW Questions"
          value={summary.stats.hmwQuestionCount}
          icon={Lightbulb}
          color="yellow"
        />
        <StatCard
          label="Ideas"
          value={summary.stats.ideaCount}
          icon={Lightbulb}
          color="green"
        />
        <StatCard
          label="Prototypes"
          value={summary.stats.prototypeCount}
          icon={Wrench}
          color="teal"
        />
        <StatCard
          label="Test Sessions"
          value={summary.stats.testSessionCount}
          icon={TestTube}
          color="red"
        />
        <StatCard
          label="AI Insights"
          value={summary.stats.insightCount}
          icon={TrendingUp}
          color="indigo"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Insights */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Latest AI Insights
          </h3>
          
          {summary.recentActivity.latestInsights.length === 0 ? (
            <p className="text-gray-500 text-sm">No insights yet</p>
          ) : (
            <div className="space-y-3">
              {summary.recentActivity.latestInsights.map((insight, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {insight.phase}
                    </span>
                    <span className="text-xs text-gray-500">
                      Confidence: {(insight.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm font-medium">{insight.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Ideas */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Top Ideas
          </h3>
          
          {summary.recentActivity.topIdeas.length === 0 ? (
            <p className="text-gray-500 text-sm">No ideas yet</p>
          ) : (
            <div className="space-y-3">
              {summary.recentActivity.topIdeas.map((idea, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{idea.title}</span>
                    {idea.overallScore && (
                      <span className="text-sm font-semibold text-blue-600">
                        {(idea.overallScore * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{idea.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold mb-4">🚀 Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ActionButton
            label="Add Empathy Data"
            description="Capture user research"
            href={`/design-thinking/${workflowId}/empathy`}
          />
          <ActionButton
            label="Create POV Statement"
            description="Frame the problem"
            href={`/design-thinking/${workflowId}/pov`}
          />
          <ActionButton
            label="Generate Ideas"
            description="Brainstorm solutions"
            href={`/design-thinking/${workflowId}/ideate`}
          />
        </div>
      </div>
    </div>
  );
}

// ===========================
// SUB-COMPONENTS
// ===========================

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color 
}: { 
  label: string; 
  value: number; 
  icon: any; 
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    teal: 'bg-teal-100 text-teal-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className={`inline-flex p-2 rounded-lg mb-2 ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function ActionButton({ 
  label, 
  description, 
  href 
}: { 
  label: string; 
  description: string; 
  href: string;
}) {
  return (
    <a
      href={href}
      className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200"
    >
      <h4 className="font-medium mb-1">{label}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
}
