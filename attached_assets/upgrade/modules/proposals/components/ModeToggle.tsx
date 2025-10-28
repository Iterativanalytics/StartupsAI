
import React from 'react';
import { Brain, Zap } from 'lucide-react';
import { Mode } from '../../../types';

interface ModeToggleProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode }) => {
  const activeClasses = 'bg-white text-purple-700 shadow-md';
  const inactiveClasses = 'bg-transparent text-slate-700 hover:bg-slate-200';

  return (
    <div className="bg-slate-100 p-1 rounded-full flex items-center gap-1">
      <button 
        onClick={() => setMode('fast-track')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'fast-track' ? activeClasses : inactiveClasses}`}
      >
        <Zap className="w-4 h-4" />
        Fast Track Mode
      </button>
      <button 
        onClick={() => setMode('validated')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'validated' ? activeClasses : inactiveClasses}`}
      >
        <Brain className="w-4 h-4" />
        Validated Mode
      </button>
    </div>
  );
};

export default ModeToggle;
