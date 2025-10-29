import React from 'react';
import { useLocation } from 'wouter';
import { DollarSign, CreditCard, Gift, Search, Sparkles } from 'lucide-react';

interface FundingHubHeaderProps {}

const fundingModules = [
  { id: 'equity' as const, label: 'Equity Funding', icon: DollarSign, path: '/funding/equity' },
  { id: 'debt' as const, label: 'Debt Funding', icon: CreditCard, path: '/funding/debt' },
  { id: 'grants' as const, label: 'Grant Funding', icon: Gift, path: '/funding/grants' },
  { id: 'matcher' as const, label: 'Match Funding', icon: Search, path: '/funding/matcher' },
];

const FundingHubHeader: React.FC<FundingHubHeaderProps> = () => {
  const [location, setLocation] = useLocation();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 border-b border-slate-200 dark:border-gray-700 shadow-sm sticky top-0 z-40 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                Funding Hub
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-gray-800 p-1.5 rounded-full">
            {fundingModules.map(mod => {
              const isActive = location === mod.path;
              const Icon = mod.icon;
              return (
                <button
                  key={mod.id}
                  onClick={() => setLocation(mod.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 shadow-md' 
                      : 'bg-transparent text-slate-600 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {mod.label}
                </button>
              );
            })}
          </nav>
          

        </div>
      </div>
    </header>
  );
};

export default FundingHubHeader;
