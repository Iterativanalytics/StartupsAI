import React from 'react';
import { Rocket, Building, Users, TrendingUp, Lightbulb, Code } from 'lucide-react';
import { ToastType } from '../../types';

interface StudioAppProps {
  addToast: (message: string, type: ToastType) => void;
}

const StudioApp: React.FC<StudioAppProps> = ({ addToast }) => {
  const phases = [
    { name: 'Ideation', icon: Lightbulb, color: 'bg-purple-500', description: 'Generate and vet high-potential venture concepts' },
    { name: 'Validation', icon: Users, color: 'bg-blue-500', description: 'Rigorously validate the problem and solution' },
    { name: 'Build', icon: Code, color: 'bg-yellow-500', description: 'Assemble the team and build the MVP' },
    { name: 'Launch', icon: Rocket, color: 'bg-green-500', description: 'Launch the product and find product-market fit' },
    { name: 'Scale', icon: TrendingUp, color: 'bg-orange-500', description: 'Grow the user base and scale operations' },
    { name: 'Spin-Out', icon: Building, color: 'bg-red-500', description: 'Graduate the company from the studio' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-12 text-white text-center">
        <h2 className="text-5xl font-bold mb-4">The Venture Studio Model</h2>
        <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
          We don't just invest in startups, we build them. Our studio provides ideas, co-founders, and a proven process to turn concepts into category-defining companies.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
            <div className="text-sm text-white/80">Ventures Built</div>
            <div className="text-3xl font-bold">45+</div>
            <div className="text-sm">Since 2020</div>
          </div>
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
            <div className="text-sm text-white/80">Total Funding</div>
            <div className="text-3xl font-bold">$2.8B+</div>
            <div className="text-sm">Raised</div>
          </div>
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
            <div className="text-sm text-white/80">Success Rate</div>
            <div className="text-3xl font-bold">73%</div>
            <div className="text-sm">Series A+</div>
          </div>
        </div>
        <button 
          onClick={() => addToast('Application process coming soon!', 'info')}
          className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-50 transition-all text-lg shadow-lg"
        >
          Apply to Build with Us
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-6">Venture Build Process</h3>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {phases.map((phase) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.name}
                className="p-4 rounded-lg bg-slate-50 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`${phase.color} p-3 rounded-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="font-semibold text-sm">{phase.name}</span>
                  <span className="text-xs text-slate-600">{phase.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-xl font-bold text-slate-800 mb-3">20-50% Equity</h4>
          <p className="text-slate-600">We become your co-founder, taking meaningful equity in exchange for capital and full-stack support.</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-xl font-bold text-slate-800 mb-3">Dedicated Teams</h4>
          <p className="text-slate-600">Access our engineering, design, product, and go-to-market teams to build faster.</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-xl font-bold text-slate-800 mb-3">Proven Process</h4>
          <p className="text-slate-600">Follow our battle-tested framework from ideation to Series A and beyond.</p>
        </div>
      </div>
    </div>
  );
};

export default StudioApp;
