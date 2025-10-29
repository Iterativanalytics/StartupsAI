import React from 'react';
import { FileText, Presentation, FileSignature, FormInput, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { HubModule } from '../types';

interface HubHeaderProps {
  activeHub: HubModule;
  setActiveHub: (hub: HubModule) => void;
}

const hubModules = [
  { id: 'plans' as HubModule, label: 'IterativPlans', icon: FileText },
  { id: 'decks' as HubModule, label: 'IterativDecks', icon: Presentation },
  { id: 'proposals' as HubModule, label: 'IterativProposals', icon: FileSignature },
  { id: 'forms' as HubModule, label: 'IterativForms', icon: FormInput },
];

const HubHeader: React.FC<HubHeaderProps> = ({ activeHub, setActiveHub }) => {
  return (
    <header className="bg-white/80 border-b border-slate-200 shadow-sm sticky top-0 z-40 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            <Link href="/login">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800 font-medium">
                Sign In
              </Button>
            </Link>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
              Start Free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HubHeader;
export { HubModule };