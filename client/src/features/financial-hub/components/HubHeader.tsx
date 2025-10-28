import React from 'react';
import { PieChart, CreditCard, Gift, Zap, Sparkles } from 'lucide-react';
import { HubModule } from '../types';

interface HubHeaderProps {
  activeHub: HubModule;
  setActiveHub: (hub: HubModule) => void;
}

const hubModules = [
  { id: 'equity' as HubModule, label: 'IterativEquity', icon: PieChart },
  { id: 'debt' as HubModule, label: 'IterativDebt', icon: CreditCard },
  { id: 'grants' as HubModule, label: 'IterativGrants', icon: Gift },
  { id: 'match' as HubModule, label: 'IterativMatch', icon: Zap },
];

const HubHeader: React.FC<HubHeaderProps> = ({ activeHub, setActiveHub }) => {
  return (
    <header className="bg-white/80 border-b border-slate-200 shadow-sm sticky top-0 z-40 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Financial Hub
              </h1>
              <p className="text-sm text-slate-500">The Funding Workspace of IterativStartups</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-2 bg-slate-100 p-1.5 rounded-full">
            {hubModules.map(mod => {
              const isActive = activeHub === mod.id;
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveHub(mod.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive ? 'bg-white text-purple-700 shadow-md' : 'bg-transparent text-slate-600 hover:bg-white/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {mod.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button className="text-slate-600 hover:text-slate-800 font-medium px-4 py-2 rounded-lg transition-colors">
              Sign In
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
              Start Free
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HubHeader;
