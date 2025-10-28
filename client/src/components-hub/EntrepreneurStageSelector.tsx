import React from 'react';
import { Lightbulb, Rocket, BarChart } from 'lucide-react';
import { EntrepreneurStage } from '@/types-hub';

interface EntrepreneurStageSelectorProps {
    onSelect: (stage: EntrepreneurStage) => void;
}

const EntrepreneurStageSelector: React.FC<EntrepreneurStageSelectorProps> = ({ onSelect }) => {
    
    const stages = [
        { id: 'ideation' as EntrepreneurStage, icon: Lightbulb, title: "Ideation Stage", description: "You have an idea or are exploring problems to solve." },
        { id: 'pre-seed' as EntrepreneurStage, icon: Rocket, title: "Pre-Seed / Seed Stage", description: "You have a clear concept, maybe an early prototype, and are preparing to raise funding." },
        { id: 'growth' as EntrepreneurStage, icon: BarChart, title: "Growth Stage", description: "You have a product in market with traction and are focused on scaling." },
    ];

    return (
        <div>
            <h3 className="text-lg font-semibold text-center text-slate-700 mb-6">What stage is your venture at?</h3>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                {stages.map(stage => {
                    const Icon = stage.icon;
                    return (
                        <button 
                            key={stage.id} 
                            onClick={() => onSelect(stage.id)}
                            className="text-left bg-slate-50 rounded-xl p-6 border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 flex flex-col items-start group"
                        >
                            <div className="bg-white p-3 rounded-lg border border-slate-200 mb-3 group-hover:border-purple-200">
                                <Icon className="w-6 h-6 text-purple-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">{stage.title}</h4>
                            <p className="text-sm text-slate-500 mt-1 flex-grow">{stage.description}</p>
                            <div className="mt-4 text-xs font-bold text-purple-600 group-hover:underline">Select Stage →</div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default EntrepreneurStageSelector;