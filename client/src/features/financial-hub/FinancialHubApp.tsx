import React, { useState, useCallback } from 'react';
import HubHeader from './components/HubHeader';
import Footer from './components/Footer';
import EquityApp from './modules/equity/EquityApp';
import DebtApp from './modules/debt/DebtApp';
import GrantsApp from './modules/grants/GrantsApp';
import MatcherApp from './modules/matcher/MatcherApp';
import { Toaster } from './components/Toaster';
import { ToastMessage, ToastType, HubModule } from './types';

const FinancialHubApp: React.FC = () => {
  const [activeHub, setActiveHub] = useState<HubModule>('equity');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prev => [...prev, { message, type, id }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const renderActiveHub = () => {
    switch (activeHub) {
      case 'equity':
        return <EquityApp addToast={addToast} />;
      case 'debt':
        return <DebtApp addToast={addToast} />;
      case 'grants':
        return <GrantsApp addToast={addToast} />;
      case 'match':
        return <MatcherApp addToast={addToast} />;
      default:
        return <EquityApp addToast={addToast} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 flex flex-col">
      <HubHeader activeHub={activeHub} setActiveHub={setActiveHub} />
      <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
        {renderActiveHub()}
      </main>
      <Toaster toasts={toasts} removeToast={removeToast} />
      <Footer />
    </div>
  );
};

export default FinancialHubApp;
