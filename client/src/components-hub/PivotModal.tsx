
import React from 'react';
import { GitBranch } from 'lucide-react';
import { PivotType } from '@/types-hub';

interface PivotModalProps {
  isOpen: boolean;
  onClose: () => void;
  pivotTypes: PivotType[];
}

const PivotModal: React.FC<PivotModalProps> = ({ isOpen, onClose, pivotTypes }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitBranch className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">Pivot Intelligence</h3>
                <p className="text-white/90 text-sm">10 structured pivot types based on validated learning</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pivotTypes.map(pivot => (
              <button
                key={pivot.id}
                className="text-left p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-slate-200 hover:border-purple-400 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <div className="font-semibold text-slate-800 mb-1">{pivot.name}</div>
                <div className="text-sm text-slate-600">{pivot.description}</div>
                <div className="mt-2 text-xs text-purple-600 font-medium">→ Analyze fit</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PivotModal;
