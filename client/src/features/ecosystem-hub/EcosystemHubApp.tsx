import React, { useState, useCallback } from 'react';
import HubHeader from './components/HubHeader';
import Footer from './components/Footer';
import StudioApp from './modules/studio/StudioApp';
import AcceleratorsApp from './modules/accelerators/AcceleratorsApp';
import IncubatorsApp from './modules/incubators/IncubatorsApp';
import CompetitionsApp from './modules/competitions/CompetitionsApp';
import { Toaster } from './components/Toaster';
import { ToastMessage, ToastType, HubModule } from './types';

const EcosystemHubApp: React.FC = () => {
  const [activeHub, setActiveHub] = useState<HubModule>('studio');
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
      case 'studio':
        return <StudioApp addToast={addToast} />;
      case 'accelerators':
        return <AcceleratorsApp addToast={addToast} />;
      case 'incubators':
        return <IncubatorsApp addToast={addToast} />;
      case 'competitions':
        return <CompetitionsApp addToast={addToast} />;
      default:
        return <StudioApp addToast={addToast} />;
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

export default EcosystemHubApp;
