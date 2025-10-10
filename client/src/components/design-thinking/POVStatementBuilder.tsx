// ============================================================================
// POV STATEMENT BUILDER COMPONENT
// Mad Libs-style interface for creating Point of View statements
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

interface POVStatement {
  id: string;
  userPersona: string;
  need: string;
  insight: string;
  evidenceStrength: number;
  solutionBiasDetected: boolean;
  priorityScore: number;
}

export function POVStatementBuilder({ workflowId }: { workflowId: string }) {
  const [povStatements, setPOVStatements] = useState<POVStatement[]>([]);
  const [currentPOV, setCurrentPOV] = useState({
    userPersona: '',
    need: '',
    insight: ''
  });
  const [generating, setGenerating] = useState(false);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    loadPOVStatements();
  }, [workflowId]);

  const loadPOVStatements = async () => {
    try {
      const response = await fetch(`/api/dt/workflows/${workflowId}/pov-statements`);
      const result = await response.json();
      if (result.success) {
        setPOVStatements(result.data);
      }
    } catch (error) {
      console.error('Error loading POV statements:', error);
    }
  };

  const generateFromEmpathy = async () => {
    setGenerating(true);
    try {
      const response = await fetch(`/api/dt/workflows/${workflowId}/pov-statements/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      if (result.success) {
        setPOVStatements(result.data);
      } else {
        alert(result.error || 'Failed to generate POV statements');
      }
    } catch (error) {
      console.error('Error generating POV statements:', error);
      alert('Failed to generate POV statements');
    } finally {
      setGenerating(false);
    }
  };

  const savePOV = async () => {
    if (!currentPOV.userPersona || !currentPOV.need || !currentPOV.insight) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`/api/dt/workflows/${workflowId}/pov-statements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPOV)
      });
      
      const result = await response.json();
      if (result.success) {
        setPOVStatements([...povStatements, result.data]);
        setCurrentPOV({ userPersona: '', need: '', insight: '' });
      }
    } catch (error) {
      console.error('Error saving POV statement:', error);
      alert('Failed to save POV statement');
    }
  };

  const checkSolutionBias = (text: string): boolean => {
    const solutionWords = ['app', 'website', 'platform', 'tool', 'system', 'software', 'feature'];
    return solutionWords.some(word => text.toLowerCase().includes(word));
  };

  const hasSolutionBias = checkSolutionBias(currentPOV.need);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Point of View Statement Builder</h1>
        <p className="text-gray-600">
          Frame your problem using the format: [User] needs [Need] because [Insight]
        </p>
      </div>

      {/* AI Generation */}
      <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI-Powered Generation
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Generate POV statements automatically from your empathy data
            </p>
          </div>
          <button
            onClick={generateFromEmpathy}
            disabled={generating}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? 'Generating...' : 'Generate POV Statements'}
          </button>
        </div>
      </div>

      {/* Manual POV Builder */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create POV Statement</h2>
        
        <div className="space-y-4">
          {/* User Persona */}
          <div>
            <label className="block text-sm font-medium mb-2">
              User (Be specific)
            </label>
            <input
              type="text"
              value={currentPOV.userPersona}
              onChange={(e) => setCurrentPOV({ ...currentPOV, userPersona: e.target.value })}
              placeholder="e.g., Sarah, a 35-year-old working mom with two kids"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              ✓ Good: Specific persona with context | ✗ Bad: "Users" or "People"
            </p>
          </div>

          {/* Need */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Need (Verb-based, not a solution)
            </label>
            <input
              type="text"
              value={currentPOV.need}
              onChange={(e) => setCurrentPOV({ ...currentPOV, need: e.target.value })}
              placeholder="e.g., to quickly prepare healthy meals for her family"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                hasSolutionBias ? 'border-red-300 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            />
            {hasSolutionBias && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Warning: This sounds like a solution, not a need. Focus on the underlying need.</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              ✓ Good: "to feel confident about..." | ✗ Bad: "needs an app to..."
            </p>
          </div>

          {/* Insight */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Insight (Surprising learning from research)
            </label>
            <textarea
              value={currentPOV.insight}
              onChange={(e) => setCurrentPOV({ ...currentPOV, insight: e.target.value })}
              placeholder="e.g., she feels guilty when ordering takeout but lacks time to cook"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              ✓ Good: Unexpected finding from research | ✗ Bad: Obvious statement
            </p>
          </div>

          {/* Preview */}
          {currentPOV.userPersona && currentPOV.need && currentPOV.insight && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Preview:</h4>
              <p className="text-lg">
                <span className="font-semibold text-blue-600">{currentPOV.userPersona}</span>
                {' '}needs{' '}
                <span className="font-semibold text-green-600">{currentPOV.need}</span>
                {' '}because{' '}
                <span className="font-semibold text-purple-600">{currentPOV.insight}</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={savePOV}
              disabled={!currentPOV.userPersona || !currentPOV.need || !currentPOV.insight || hasSolutionBias}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add POV Statement
            </button>
          </div>
        </div>
      </div>

      {/* Saved POV Statements */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          POV Statements ({povStatements.length})
        </h2>
        
        {povStatements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No POV statements yet. Create one above or generate from empathy data.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {povStatements.map((pov, index) => (
              <div
                key={pov.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-500">POV #{index + 1}</span>
                  <div className="flex items-center gap-2">
                    {pov.solutionBiasDetected && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Solution Bias Detected
                      </span>
                    )}
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Priority: {pov.priorityScore}
                    </span>
                  </div>
                </div>
                
                <p className="text-lg mb-2">
                  <span className="font-semibold text-blue-600">{pov.userPersona}</span>
                  {' '}needs{' '}
                  <span className="font-semibold text-green-600">{pov.need}</span>
                  {' '}because{' '}
                  <span className="font-semibold text-purple-600">{pov.insight}</span>
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Evidence Strength: {(pov.evidenceStrength * 100).toFixed(0)}%</span>
                  {!pov.solutionBiasDetected && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      No solution bias
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
