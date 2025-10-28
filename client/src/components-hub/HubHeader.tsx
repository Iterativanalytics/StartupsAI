import React from 'react';
import { FileText, Presentation, FileSignature, FormInput, Sparkles, User as UserIcon } from 'lucide-react';
import { HubModule, User } from '../types';

interface HubHeaderProps {
  activeHub: HubModule;
  setActiveHub: (hub: HubModule) => void;
  user: User;
  onStartFree: () => void;
}

const hubModules = [
  { id: 'plans' as HubModule, label: 'IterativePlans', icon: FileText },
  { id: 'decks' as HubModule, label: 'IterativDecks', icon: Presentation },
  { id: 'proposals' as HubModule, label: 'IterativProposals', icon: FileSignature },
  { id: 'forms' as HubModule, label: 'IterativForms', icon: FormInput },
];

const HubHeader: React.FC<HubHeaderProps> = ({ activeHub, setActiveHub, user, onStartFree }) => {
  return (
    <header className="bg-white/80 border-b border-slate-200 shadow-sm sticky top-0 z-40 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Sparkles className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Documents Hub
              </h1>
              <p className="text-sm text-slate-500">The Strategic Workspace of IterativStartups</p>
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
          
          <div className="flex items-center gap-4">
            {user.loggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">Welcome, {user.name}!</span>
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <UserIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            ) : (
                <>
                    <button className="text-slate-600 hover:text-slate-800 font-medium px-4 py-2 rounded-lg transition-colors">Sign In</button>
                    <button onClick={onStartFree} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">Start Free</button>
                </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default HubHeader;