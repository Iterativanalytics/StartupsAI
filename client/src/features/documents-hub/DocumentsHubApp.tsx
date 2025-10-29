import React, { useState, useCallback, lazy, Suspense } from 'react';
import HubHeader, { HubModule } from './components/HubHeader';
import Footer from './components/Footer';
import { Toaster } from './components/Toaster';
import { ToastMessage, ToastType } from './types';
import { Loader2 } from 'lucide-react';

// Lazy load modules for better performance
const PlansApp = lazy(() => import('./modules/plans/PlansApp'));
const DecksApp = lazy(() => import('./modules/decks/DecksApp'));
const IterativProposalsApp = lazy(() => import('./modules/proposals/IterativProposalsApp'));
const IterativFormsApp = lazy(() => import('./modules/forms/IterativFormsApp'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
  </div>
);

const DocumentsHubApp: React.FC = () => {
  const [activeHub, setActiveHub] = useState<HubModule>('plans');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prev => [...prev, { message, type, id }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const renderActiveHub = () => {
    const moduleProps = { addToast };
    
    return (
      <Suspense fallback={<LoadingFallback />}>
        {activeHub === 'plans' && <PlansApp {...moduleProps} />}
        {activeHub === 'decks' && <DecksApp showToast={addToast} />}
        {activeHub === 'proposals' && <IterativProposalsApp {...moduleProps} />}
        {activeHub === 'forms' && <IterativFormsApp {...moduleProps} />}
      </Suspense>
    );
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

export default DocumentsHubApp;