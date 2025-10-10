// ============================================================================
// IDEA EVALUATION MATRIX
// DVF framework with AI-powered evaluation
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  description: string;
  userBenefit: string;
  businessValue: string;
  desirabilityScore?: number;
  feasibilityScore?: number;
  viabilityScore?: number;
  innovationScore?: number;
  impactScore?: number;
  overallScore?: number;
  status: string;
}

interface IdeaEvaluation {
  idea: Idea;
  scores: {
    desirability: number;
    feasibility: number;
    viability: number;
    innovation: number;
    impact: number;
  };
  risks: any[];
  opportunities: any[];
  recommendations: string[];
}

export function IdeaEvaluationMatrix({ workflowId }: { workflowId: string }) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [selectedView, setSelectedView] = useState<'list' | 'matrix'>('list');

  useEffect(() => {
    loadIdeas();
  }, [workflowId]);

  const loadIdeas = async () => {
    try {
      const response = await fetch(`/api/dt/workflows/${workflowId}/ideas`);
      const result = await response.json();
      if (result.success) {
        setIdeas(result.data);
      }
    } catch (error) {
      console.error('Error loading ideas:', error);
    }
  };

  const evaluateAllIdeas = async () => {
    setEvaluating(true);
    try {
      const response = await fetch(`/api/dt/workflows/${workflowId}/ideas/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      const result = await response.json();
      if (result.success) {
        await loadIdeas(); // Reload to get updated scores
        alert('Ideas evaluated successfully!');
      }
    } catch (error) {
      console.error('Error evaluating ideas:', error);
      alert('Failed to evaluate ideas');
    } finally {
      setEvaluating(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-blue-600 bg-blue-100';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getQuadrant = (idea: Idea): string => {
    const impact = ((idea.desirabilityScore || 0) + (idea.impactScore || 0)) / 2;
    const effort = 1 - (idea.feasibilityScore || 0.5);
    
    if (impact > 0.6 && effort < 0.4) return 'Quick Wins';
    if (impact > 0.6 && effort >= 0.4) return 'Major Projects';
    if (impact <= 0.6 && effort < 0.4) return 'Fill-Ins';
    return 'Hard Slogs';
  };

  const getQuadrantColor = (quadrant: string): string => {
    const colors: Record<string, string> = {
      'Quick Wins': 'bg-green-100 text-green-700 border-green-300',
      'Major Projects': 'bg-blue-100 text-blue-700 border-blue-300',
      'Fill-Ins': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Hard Slogs': 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[quadrant] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const evaluatedIdeas = ideas.filter(i => i.overallScore !== undefined);
  const unevaluatedIdeas = ideas.filter(i => i.overallScore === undefined);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Idea Evaluation Matrix</h1>
        <p className="text-gray-600">
          Evaluate ideas using the Desirability-Feasibility-Viability framework
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <button
            onClick={evaluateAllIdeas}
            disabled={evaluating || ideas.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            {evaluating ? 'Evaluating...' : 'AI Evaluate All Ideas'}
          </button>
        </div>

        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedView('list')}
            className={`px-4 py-2 rounded ${selectedView === 'list' ? 'bg-white shadow-sm' : ''}`}
          >
            List View
          </button>
          <button
            onClick={() => setSelectedView('matrix')}
            className={`px-4 py-2 rounded ${selectedView === 'matrix' ? 'bg-white shadow-sm' : ''}`}
          >
            Matrix View
          </button>
        </div>
      </div>

      {/* Statistics */}
      {evaluatedIdeas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Total Ideas</div>
            <div className="text-2xl font-bold">{ideas.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Evaluated</div>
            <div className="text-2xl font-bold text-green-600">{evaluatedIdeas.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Avg. Score</div>
            <div className="text-2xl font-bold text-blue-600">
              {(evaluatedIdeas.reduce((sum, i) => sum + (i.overallScore || 0), 0) / evaluatedIdeas.length * 100).toFixed(0)}%
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Top Scorer</div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.max(...evaluatedIdeas.map(i => (i.overallScore || 0) * 100)).toFixed(0)}%
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {selectedView === 'list' && (
        <div className="space-y-4">
          {ideas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No ideas yet. Create ideas in the Ideate phase first.</p>
            </div>
          ) : (
            ideas
              .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
              .map((idea, index) => (
                <div
                  key={idea.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                        <h3 className="text-xl font-semibold">{idea.title}</h3>
                        {idea.overallScore && (
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getQuadrantColor(getQuadrant(idea))}`}>
                            {getQuadrant(idea)}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{idea.description}</p>
                    </div>
                    
                    {idea.overallScore !== undefined && (
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {(idea.overallScore * 100).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">Overall Score</div>
                      </div>
                    )}
                  </div>

                  {/* DVF Scores */}
                  {idea.overallScore !== undefined && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                      <div className="bg-green-50 rounded p-2">
                        <div className="text-xs text-gray-600 mb-1">Desirability</div>
                        <div className={`text-lg font-semibold ${getScoreColor(idea.desirabilityScore || 0)}`}>
                          {((idea.desirabilityScore || 0) * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded p-2">
                        <div className="text-xs text-gray-600 mb-1">Feasibility</div>
                        <div className={`text-lg font-semibold ${getScoreColor(idea.feasibilityScore || 0)}`}>
                          {((idea.feasibilityScore || 0) * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded p-2">
                        <div className="text-xs text-gray-600 mb-1">Viability</div>
                        <div className={`text-lg font-semibold ${getScoreColor(idea.viabilityScore || 0)}`}>
                          {((idea.viabilityScore || 0) * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="bg-yellow-50 rounded p-2">
                        <div className="text-xs text-gray-600 mb-1">Innovation</div>
                        <div className={`text-lg font-semibold ${getScoreColor(idea.innovationScore || 0)}`}>
                          {((idea.innovationScore || 0) * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="bg-pink-50 rounded p-2">
                        <div className="text-xs text-gray-600 mb-1">Impact</div>
                        <div className={`text-lg font-semibold ${getScoreColor(idea.impactScore || 0)}`}>
                          {((idea.impactScore || 0) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">User Benefit:</span>
                      <p className="text-gray-600 mt-1">{idea.userBenefit}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Business Value:</span>
                      <p className="text-gray-600 mt-1">{idea.businessValue}</p>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Matrix View */}
      {selectedView === 'matrix' && evaluatedIdeas.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Impact-Effort Matrix</h2>
          
          <div className="grid grid-cols-2 gap-4 h-[600px]">
            {/* Quick Wins */}
            <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
              <h3 className="font-semibold text-green-700 mb-3">🎯 Quick Wins</h3>
              <p className="text-xs text-gray-600 mb-3">High Impact, Low Effort</p>
              <div className="space-y-2">
                {evaluatedIdeas
                  .filter(idea => getQuadrant(idea) === 'Quick Wins')
                  .map(idea => (
                    <div key={idea.id} className="bg-white rounded p-3 shadow-sm">
                      <div className="font-medium text-sm">{idea.title}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Score: {((idea.overallScore || 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Major Projects */}
            <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-blue-700 mb-3">🚀 Major Projects</h3>
              <p className="text-xs text-gray-600 mb-3">High Impact, High Effort</p>
              <div className="space-y-2">
                {evaluatedIdeas
                  .filter(idea => getQuadrant(idea) === 'Major Projects')
                  .map(idea => (
                    <div key={idea.id} className="bg-white rounded p-3 shadow-sm">
                      <div className="font-medium text-sm">{idea.title}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Score: {((idea.overallScore || 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Fill-Ins */}
            <div className="border-2 border-yellow-300 rounded-lg p-4 bg-yellow-50">
              <h3 className="font-semibold text-yellow-700 mb-3">📝 Fill-Ins</h3>
              <p className="text-xs text-gray-600 mb-3">Low Impact, Low Effort</p>
              <div className="space-y-2">
                {evaluatedIdeas
                  .filter(idea => getQuadrant(idea) === 'Fill-Ins')
                  .map(idea => (
                    <div key={idea.id} className="bg-white rounded p-3 shadow-sm">
                      <div className="font-medium text-sm">{idea.title}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Score: {((idea.overallScore || 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Hard Slogs */}
            <div className="border-2 border-red-300 rounded-lg p-4 bg-red-50">
              <h3 className="font-semibold text-red-700 mb-3">⚠️ Hard Slogs</h3>
              <p className="text-xs text-gray-600 mb-3">Low Impact, High Effort</p>
              <div className="space-y-2">
                {evaluatedIdeas
                  .filter(idea => getQuadrant(idea) === 'Hard Slogs')
                  .map(idea => (
                    <div key={idea.id} className="bg-white rounded p-3 shadow-sm">
                      <div className="font-medium text-sm">{idea.title}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Score: {((idea.overallScore || 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Matrix Legend */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">📊 Prioritization Guide</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="font-medium text-green-700">Quick Wins:</span>
                <p className="text-gray-600">Do first - high value, low effort</p>
              </div>
              <div>
                <span className="font-medium text-blue-700">Major Projects:</span>
                <p className="text-gray-600">Plan carefully - high value, high effort</p>
              </div>
              <div>
                <span className="font-medium text-yellow-700">Fill-Ins:</span>
                <p className="text-gray-600">Do later - low value, low effort</p>
              </div>
              <div>
                <span className="font-medium text-red-700">Hard Slogs:</span>
                <p className="text-gray-600">Avoid - low value, high effort</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Criteria */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold mb-3">📋 Evaluation Criteria (DVF Framework)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-green-700 mb-1">Desirability (30%)</h5>
            <ul className="text-gray-600 space-y-1">
              <li>• Do users want this?</li>
              <li>• Does it solve a real pain?</li>
              <li>• Would they pay for it?</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-700 mb-1">Feasibility (25%)</h5>
            <ul className="text-gray-600 space-y-1">
              <li>• Can we build it?</li>
              <li>• Do we have the skills?</li>
              <li>• What are the risks?</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-purple-700 mb-1">Viability (25%)</h5>
            <ul className="text-gray-600 space-y-1">
              <li>• Can we make money?</li>
              <li>• What are the costs?</li>
              <li>• Is it sustainable?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
