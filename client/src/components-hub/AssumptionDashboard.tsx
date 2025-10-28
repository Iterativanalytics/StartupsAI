import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Assumption } from '@/types-hub';

interface AssumptionDashboardProps {
    assumptions: Assumption[];
    onClear: () => void;
    onDesignExperiment: (assumption: Assumption) => void;
    noun?: string;
}

const AssumptionDashboard: React.FC<AssumptionDashboardProps> = ({ assumptions, onClear, onDesignExperiment, noun = 'plan' }) => {
    const riskColorMap = {
        high: 'border-red-500 bg-red-50 text-red-800',
        medium: 'border-yellow-500 bg-yellow-50 text-yellow-800',
        low: 'border-blue-500 bg-blue-50 text-blue-800',
    };

    const highRiskAssumptions = assumptions.filter(a => a.risk === 'high');

    return (
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 mb-8 border-2 border-purple-200 relative animate-fade-in-up">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">Assumption Dashboard</h3>
                    <p className="text-slate-600 mt-1">
                        Your Fast Track {noun} generated <span className="font-bold text-purple-600">{assumptions.length} assumptions</span>. It's time to validate the riskiest ones.
                    </p>
                </div>
                <button 
                    onClick={onClear} 
                    className="text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full p-2 transition-colors"
                    aria-label="Clear assumptions and start fresh"
                >
                    <X className="w-5 h-5"/>
                </button>
            </div>
            {highRiskAssumptions.length > 0 ? (
                <div className="space-y-3">
                    {highRiskAssumptions.map(assumption => (
                        <div key={assumption.id} className={`p-4 rounded-lg border-l-4 flex items-center md:items-start gap-4 ${riskColorMap[assumption.risk]}`}>
                            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold">{assumption.text}</p>
                                <p className="text-xs opacity-80 mt-1">Source: {assumption.sourceSection} • Risk: High</p>
                            </div>
                            <button onClick={() => onDesignExperiment(assumption)} className="bg-purple-600 text-white text-xs font-semibold py-1 px-3 rounded-full hover:bg-purple-700 transition-colors flex-shrink-0">
                                Design Experiment
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                 <p className="text-sm text-slate-500 mt-4 text-center">No high-risk assumptions were generated. You can proceed with the workflow or generate a new {noun}.</p>
            )}
             <p className="text-sm text-slate-500 mt-4 text-center">Proceed with the workflow below to start validating these assumptions.</p>
        </div>
    );
};

export default AssumptionDashboard;