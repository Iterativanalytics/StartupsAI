import React from 'react';
import { Brain, Zap } from 'lucide-react';
import { Mode } from '../../../types';

interface ModeToggleProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, setMode }) => {
  return (
    <div className="relative bg-slate-100 p-1 rounded-full flex items-center gap-1 w-[324px]">
      <span
        className="absolute top-1 left-1 h-[calc(100%-8px)] w-[160px] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out"
        style={{ transform: mode === 'validated' ? 'translateX(calc(100% + 4px))' : 'translateX(0)' }}
      />
      <button
        onClick={() => setMode('fast-track')}
        className={`relative z-10 flex items-center justify-center gap-2 w-[160px] py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${mode === 'fast-track' ? 'text-purple-700' : 'text-slate-600'}` }
        aria-pressed={mode === 'fast-track'}
      >
        <Zap className="w-4 h-4" />
        Fast Track Mode
      </button>
      <button
        onClick={() => setMode('validated')}
        className={`relative z-10 flex items-center justify-center gap-2 w-[160px] py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${mode === 'validated' ? 'text-purple-700' : 'text-slate-600'}` }
        aria-pressed={mode === 'validated'}
      >
        <Brain className="w-4 h-4" />
        Validated Mode
      </button>
    </div>
  );
};

export default ModeToggle;
