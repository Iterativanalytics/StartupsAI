import React from 'react';
import { Persona } from '@/types-hub';
import { Rocket, Building2, TrendingUp, Landmark } from 'lucide-react';

interface PersonaSelectorProps {
    onSelect: (persona: Persona) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSelect }) => {

    const personas = [
        { id: 'entrepreneur' as Persona, icon: Rocket, title: "For Entrepreneurs", description: "Build, evaluate, and reiterate investor-ready business plans." },
        { id: 'incubator' as Persona, icon: Building2, title: "For Incubators & Accelerators", description: "Assess applications at scale with data-driven efficiency." },
        { id: 'investor' as Persona, icon: TrendingUp, title: "For Investors", description: "Accelerate due diligence with AI-enhanced deal intelligence." },
        { id: 'lender' as Persona, icon: Landmark, title: "For Lenders", description: "Enhance credit assessment for startup and SME lending." },
    ];

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map(p => {
                const Icon = p.icon;
                return (
                    <div key={p.id} className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 flex flex-col items-start hover:shadow-2xl hover:border-purple-300 transition-all duration-300">
                        <div className="bg-slate-100 p-3 rounded-xl mb-4">
                            <Icon className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">{p.title}</h3>
                        <p className="text-slate-600 mt-2 mb-6 flex-grow">{p.description}</p>
                        <button onClick={() => onSelect(p.id)} className="w-full bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition-all shadow-md">
                            Select
                        </button>
                    </div>
                )
            })}
        </div>
    );
};

export default PersonaSelector;