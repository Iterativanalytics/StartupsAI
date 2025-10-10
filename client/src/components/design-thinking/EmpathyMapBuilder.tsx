// ============================================================================
// EMPATHY MAP BUILDER COMPONENT
// Interactive 6-quadrant canvas for capturing user empathy data
// ============================================================================

import React, { useState } from 'react';
import { Plus, Save, Download, Trash2 } from 'lucide-react';

interface EmpathyMapData {
  id: string;
  workflowId: string;
  userPersona: string;
  thinkAndFeel: string[];
  sayAndDo: string[];
  see: string[];
  hear: string[];
  pains: string[];
  gains: string[];
}

interface StickyNote {
  id: string;
  content: string;
  quadrant: string;
}

export function EmpathyMapBuilder({ workflowId }: { workflowId: string }) {
  const [persona, setPersona] = useState('');
  const [empathyMap, setEmpathyMap] = useState<EmpathyMapData>({
    id: '',
    workflowId,
    userPersona: '',
    thinkAndFeel: [],
    sayAndDo: [],
    see: [],
    hear: [],
    pains: [],
    gains: []
  });
  const [activeQuadrant, setActiveQuadrant] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');

  const quadrants = [
    { key: 'thinkAndFeel', title: 'Think & Feel', color: 'bg-purple-100', icon: '🧠' },
    { key: 'sayAndDo', title: 'Say & Do', color: 'bg-blue-100', icon: '💬' },
    { key: 'see', title: 'See', color: 'bg-green-100', icon: '👁️' },
    { key: 'hear', title: 'Hear', color: 'bg-yellow-100', icon: '👂' },
    { key: 'pains', title: 'Pains', color: 'bg-red-100', icon: '😣' },
    { key: 'gains', title: 'Gains', color: 'bg-emerald-100', icon: '✨' }
  ];

  const addNote = (quadrant: string) => {
    if (!newNote.trim()) return;

    setEmpathyMap(prev => ({
      ...prev,
      [quadrant]: [...prev[quadrant as keyof EmpathyMapData] as string[], newNote.trim()]
    }));
    setNewNote('');
    setActiveQuadrant(null);
  };

  const removeNote = (quadrant: string, index: number) => {
    setEmpathyMap(prev => ({
      ...prev,
      [quadrant]: (prev[quadrant as keyof EmpathyMapData] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/dt/workflows/${workflowId}/empathy-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataType: 'empathy_map',
          participantPersona: persona,
          insights: empathyMap.thinkAndFeel,
          painPoints: empathyMap.pains,
          needs: empathyMap.gains,
          behaviors: empathyMap.sayAndDo,
          emotions: empathyMap.thinkAndFeel,
          rawData: JSON.stringify(empathyMap)
        })
      });

      if (response.ok) {
        alert('Empathy map saved successfully!');
      }
    } catch (error) {
      console.error('Error saving empathy map:', error);
      alert('Failed to save empathy map');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(empathyMap, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `empathy-map-${persona || 'unnamed'}.json`;
    link.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Empathy Map Builder</h1>
        <p className="text-gray-600">
          Capture what your users think, feel, say, do, see, and hear to build deep empathy
        </p>
      </div>

      {/* Persona Input */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <label className="block text-sm font-medium mb-2">User Persona</label>
        <input
          type="text"
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          placeholder="e.g., Sarah, 35, busy working mom"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Empathy Map Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {quadrants.map(quadrant => (
          <div
            key={quadrant.key}
            className={`${quadrant.color} rounded-lg p-4 min-h-[300px] border-2 border-gray-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <span>{quadrant.icon}</span>
                {quadrant.title}
              </h3>
              <button
                onClick={() => setActiveQuadrant(quadrant.key)}
                className="p-1 hover:bg-white rounded-full transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Sticky Notes */}
            <div className="space-y-2">
              {(empathyMap[quadrant.key as keyof EmpathyMapData] as string[]).map((note, index) => (
                <div
                  key={index}
                  className="bg-yellow-100 p-3 rounded shadow-sm hover:shadow-md transition-shadow group relative"
                >
                  <p className="text-sm">{note}</p>
                  <button
                    onClick={() => removeNote(quadrant.key, index)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Note Input */}
            {activeQuadrant === quadrant.key && (
              <div className="mt-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      addNote(quadrant.key);
                    }
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => addNote(quadrant.key)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setActiveQuadrant(null);
                      setNewNote('');
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Empathy Map
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold mb-2">💡 Tips for Effective Empathy Mapping</h4>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• Use direct quotes from user interviews in "Say & Do"</li>
          <li>• Capture emotions and internal thoughts in "Think & Feel"</li>
          <li>• Include environmental context in "See" and "Hear"</li>
          <li>• Focus on specific, observable details</li>
          <li>• Look for contradictions between what users say and do</li>
        </ul>
      </div>
    </div>
  );
}
