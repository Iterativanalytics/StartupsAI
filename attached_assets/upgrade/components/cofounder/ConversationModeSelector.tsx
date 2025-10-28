import React from 'react';
import { BrainCircuit, Zap, Scale, Lightbulb, CheckSquare } from 'lucide-react';
import { ConversationMode } from '../../types';

interface ConversationModeSelectorProps {
    activeMode: ConversationMode;
    onSelectMode: (mode: ConversationMode) => void;
}

const modes: { id: ConversationMode; label: string; icon: React.ElementType; description: string }[] = [
    { id: 'strategic', label: 'Strategic', icon: BrainCircuit, description: 'Deep, long-term thinking' },
    { id: 'quick_advice', label: 'Quick Advice', icon: Zap, description: 'Fast, tactical answers' },
    { id: 'devils_advocate', label: 'Devil\'s Advocate', icon: Scale, description: 'Challenge assumptions' },
    { id: 'brainstorm', label: 'Brainstorm', icon: Lightbulb, description: 'Judgment-free ideation' },
    { id: 'accountability', label: 'Accountability', icon: CheckSquare, description: 'Track goals and progress' },
];

const ConversationModeSelector: React.FC<ConversationModeSelectorProps> = ({ activeMode, onSelectMode }) => {
    return (
        <div className="p-2 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {modes.map(mode => {
                    const Icon = mode.icon;
                    const isActive = activeMode === mode.id;
                    return (
                        <button
                            key={mode.id}
                            onClick={() => onSelectMode(mode.id)}
                            title={mode.description}
                            className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                isActive ? 'bg-purple-600 text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-600'}`} />
                            {mode.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ConversationModeSelector;