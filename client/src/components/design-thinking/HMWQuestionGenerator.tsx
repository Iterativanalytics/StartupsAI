// ============================================================================
// HOW MIGHT WE QUESTION GENERATOR
// Generate and reframe HMW questions from POV statements
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Sparkles, ThumbsUp, Lightbulb, RefreshCw } from 'lucide-react';

interface POVStatement {
  id: string;
  userPersona: string;
  need: string;
  insight: string;
}

interface HMWQuestion {
  id: string;
  povStatementId: string;
  question: string;
  reframingType: string | null;
  voteCount: number;
  ideaCount: number;
  desirabilityScore?: number;
  feasibilityScore?: number;
  viabilityScore?: number;
}

export function HMWQuestionGenerator({ workflowId }: { workflowId: string }) {
  const [povStatements, setPOVStatements] = useState<POVStatement[]>([]);
  const [selectedPOV, setSelectedPOV] = useState<POVStatement | null>(null);
  const [hmwQuestions, setHMWQuestions] = useState<HMWQuestion[]>([]);
  const [generating, setGenerating] = useState(false);

  const reframingTechniques = [
    { type: 'amplify', label: 'Amplify', description: 'Make it bigger or more ambitious' },
    { type: 'remove_constraint', label: 'Remove Constraint', description: 'Remove a key limitation' },
    { type: 'opposite', label: 'Flip It', description: 'Reverse the problem' },
    { type: 'question_assumption', label: 'Question Assumption', description: 'Challenge core beliefs' },
    { type: 'resource_change', label: 'Change Resources', description: 'Different context or resources' }
  ];

  useEffect(() => {
    loadPOVStatements();
    loadHMWQuestions();
  }, [workflowId]);

  const loadPOVStatements = async () => {
    try {
      const response = await fetch(`/api/dt/workflows/${workflowId}/pov-statements`);
      const result = await response.json();
      if (result.success) {
        setPOVStatements(result.data);
        if (result.data.length > 0 && !selectedPOV) {
          setSelectedPOV(result.data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading POV statements:', error);
    }
  };

  const loadHMWQuestions = async () => {
    try {
      const response = await fetch(`/api/dt/workflows/${workflowId}/hmw-questions`);
      const result = await response.json();
      if (result.success) {
        setHMWQuestions(result.data);
      }
    } catch (error) {
      console.error('Error loading HMW questions:', error);
    }
  };

  const generateHMWQuestions = async () => {
    if (!selectedPOV) return;

    setGenerating(true);
    try {
      const response = await fetch(`/api/dt/pov-statements/${selectedPOV.id}/hmw-questions/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      if (result.success) {
        setHMWQuestions([...hmwQuestions, ...result.data]);
      }
    } catch (error) {
      console.error('Error generating HMW questions:', error);
      alert('Failed to generate HMW questions');
    } finally {
      setGenerating(false);
    }
  };

  const voteHMW = async (hmwId: string) => {
    try {
      const response = await fetch(`/api/dt/hmw-questions/${hmwId}/vote`, {
        method: 'POST'
      });
      
      const result = await response.json();
      if (result.success) {
        setHMWQuestions(hmwQuestions.map(hmw => 
          hmw.id === hmwId ? result.data : hmw
        ));
      }
    } catch (error) {
      console.error('Error voting HMW question:', error);
    }
  };

  const getReframingBadgeColor = (type: string | null) => {
    const colors: Record<string, string> = {
      amplify: 'bg-purple-100 text-purple-700',
      remove_constraint: 'bg-blue-100 text-blue-700',
      opposite: 'bg-green-100 text-green-700',
      question_assumption: 'bg-yellow-100 text-yellow-700',
      resource_change: 'bg-pink-100 text-pink-700'
    };
    return type ? colors[type] || 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">How Might We Questions</h1>
        <p className="text-gray-600">
          Transform POV statements into actionable "How Might We" questions
        </p>
      </div>

      {/* POV Selection */}
      {povStatements.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            No POV statements available. Please create POV statements first in the Define phase.
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select POV Statement</label>
          <select
            value={selectedPOV?.id || ''}
            onChange={(e) => {
              const pov = povStatements.find(p => p.id === e.target.value);
              setSelectedPOV(pov || null);
            }}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {povStatements.map(pov => (
              <option key={pov.id} value={pov.id}>
                {pov.userPersona} needs {pov.need}
              </option>
            ))}
          </select>

          {selectedPOV && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm">
                <span className="font-semibold">{selectedPOV.userPersona}</span>
                {' '}needs{' '}
                <span className="font-semibold">{selectedPOV.need}</span>
                {' '}because{' '}
                <span className="font-semibold">{selectedPOV.insight}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Generate Button */}
      {selectedPOV && (
        <div className="mb-6">
          <button
            onClick={generateHMWQuestions}
            disabled={generating}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            {generating ? 'Generating...' : 'Generate HMW Questions'}
          </button>
        </div>
      )}

      {/* Reframing Techniques Info */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-500" />
          Reframing Techniques
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {reframingTechniques.map(technique => (
            <div key={technique.type} className="bg-white rounded p-3">
              <h4 className="font-medium text-sm mb-1">{technique.label}</h4>
              <p className="text-xs text-gray-600">{technique.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HMW Questions List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          Generated HMW Questions ({hmwQuestions.length})
        </h2>
        
        {hmwQuestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No HMW questions yet. Select a POV statement and generate questions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {hmwQuestions
              .sort((a, b) => b.voteCount - a.voteCount)
              .map((hmw, index) => (
                <div
                  key={hmw.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                        {hmw.reframingType && (
                          <span className={`text-xs px-2 py-1 rounded ${getReframingBadgeColor(hmw.reframingType)}`}>
                            {hmw.reframingType.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-medium mb-2">{hmw.question}</p>
                      
                      {/* DVF Scores */}
                      {(hmw.desirabilityScore || hmw.feasibilityScore || hmw.viabilityScore) && (
                        <div className="flex gap-4 text-sm">
                          {hmw.desirabilityScore && (
                            <span className="text-green-600">
                              Desirability: {(hmw.desirabilityScore * 5).toFixed(1)}/5
                            </span>
                          )}
                          {hmw.feasibilityScore && (
                            <span className="text-blue-600">
                              Feasibility: {(hmw.feasibilityScore * 5).toFixed(1)}/5
                            </span>
                          )}
                          {hmw.viabilityScore && (
                            <span className="text-purple-600">
                              Viability: {(hmw.viabilityScore * 5).toFixed(1)}/5
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Vote Button */}
                    <button
                      onClick={() => voteHMW(hmw.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="font-semibold">{hmw.voteCount}</span>
                    </button>
                  </div>
                  
                  {hmw.ideaCount > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      💡 {hmw.ideaCount} ideas generated from this question
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold mb-2">💡 Tips for Great HMW Questions</h4>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• Start with "How might we..." to invite creative solutions</li>
          <li>• Be broad enough to allow multiple solutions</li>
          <li>• Be specific enough to be actionable</li>
          <li>• Don't prescribe a solution in the question</li>
          <li>• Use reframing to explore different angles</li>
          <li>• Vote on the most promising questions to focus ideation</li>
        </ul>
      </div>
    </div>
  );
}
