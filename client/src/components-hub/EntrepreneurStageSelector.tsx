import React from 'react';
import { EntrepreneurStage } from '@/types-hub';
import { Lightbulb, Rocket, TrendingUp } from 'lucide-react';

interface EntrepreneurStageSelectorProps {
    onSelect: (stage: EntrepreneurStage) => void;
}

const EntrepreneurStageSelector: React.FC<EntrepreneurStageSelectorProps> = ({ onSelect }) => {
    const stages = [
        { 
            id: 'ideation' as EntrepreneurStage, 
            icon: Lightbulb, 
            title: "Ideation", 
            description: "Just starting with an idea and exploring possibilities",
            details: "You're in the early stages of conceptualizing your business idea and validating the market opportunity."
        },
        { 
            id: 'pre-seed' as EntrepreneurStage, 
            icon: Rocket, 
            title: "Pre-Seed / Seed", 
            description: "Have a concept/prototype and are preparing for funding",
            details: "You have a working concept or prototype and are ready to seek initial funding to build and validate your product."
        },
        { 
            id: 'growth' as EntrepreneurStage, 
            icon: TrendingUp, 
            title: "Growth", 
            description: "Have a product with market traction and are focused on scaling",
            details: "You have a proven product with market traction and are focused on scaling operations, team, and market reach."
        },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">What's your current venture stage?</h2>
                <p className="text-slate-600 text-lg">This helps us tailor your AI co-founder's advice to your specific challenges.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stages.map(stage => {
                    const Icon = stage.icon;
                    return (
                        <div 
                            key={stage.id} 
                            className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 flex flex-col items-start hover:shadow-2xl hover:border-purple-300 transition-all duration-300 cursor-pointer group"
                            onClick={() => onSelect(stage.id)}
                        >
                            <div className="bg-purple-100 p-4 rounded-xl mb-6 group-hover:bg-purple-200 transition-colors">
                                <Icon className="w-10 h-10 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">{stage.title}</h3>
                            <p className="text-slate-600 mb-4 text-sm font-medium">{stage.description}</p>
                            <p className="text-slate-500 text-sm mb-6 flex-grow">{stage.details}</p>
                            <button className="w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition-all shadow-md group-hover:shadow-lg">
                                Select This Stage
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default EntrepreneurStageSelector;