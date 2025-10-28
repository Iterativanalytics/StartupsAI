import { useState, useCallback, useEffect } from 'react';
import HubHeader from '@/components-hub/HubHeader';
import Footer from '@/components-hub/Footer';
import PlansApp from '@/modules/plans/PlansApp';
import DecksApp from '@/modules/decks/DecksApp';
import ProposalsApp from '@/modules/proposals/ProposalsApp';
import FormsApp from '@/modules/forms/FormsApp';
import { Toaster } from '@/components-hub/Toaster';
import OnboardingModal from '@/components-hub/OnboardingModal';
import CoFounderHub from '@/components-hub/cofounder/CoFounderHub';
import WhatsAppChat from '@/components-hub/cofounder/WhatsAppChat';
import { 
  ToastMessage, 
  ToastType, 
  HubModule, 
  User, 
  Persona, 
  EntrepreneurStage, 
  CompositeProfile, 
  CoFounderPersonality, 
  WhatsAppSettings, 
  Goal, 
  ChatMessage 
} from '@/types-hub';

export default function DocumentsHub() {
  const [activeHub, setActiveHub] = useState<HubModule>('plans');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [user, setUser] = useState<User>({ loggedIn: false, persona: null, name: 'Guest' });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  
  const [isCoFounderOpen, setIsCoFounderOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [agentPersonality, setAgentPersonality] = useState<CoFounderPersonality | null>(null);
  const [whatsAppSettings, setWhatsAppSettings] = useState<WhatsAppSettings>({
    enabled: false,
    phoneNumber: '',
    sendHighPriority: true,
    sendGoalUpdates: true,
    sendWeeklySummary: false,
  });
  const [vestedInterest, setVestedInterest] = useState(0.1);

  useEffect(() => {
    if (user.loggedIn) {
      const timer = setInterval(() => {
        setVestedInterest(prev => prev + 0.001);
      }, 1000 * 60);
      return () => clearInterval(timer);
    }
  }, [user.loggedIn]);

  const addToast = useCallback((message: string, type: ToastType, onClick?: () => void) => {
    const id = Date.now();
    const toast: ToastMessage = { message, type, id, ...(onClick && { onClick }) };
    setToasts(prev => [...prev, toast]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleStartFree = () => {
    setIsOnboardingOpen(true);
  };

  const handleOnboardingComplete = (
    persona: Persona, 
    stage: EntrepreneurStage | undefined,
    profile: CompositeProfile,
    proposedPersonality: CoFounderPersonality
  ) => {
    setUser({ 
      loggedIn: true, 
      persona, 
      name: 'Valued User', 
      ...(stage && { entrepreneurStage: stage }),
      ...(profile && { compositeProfile: profile })
    });
    setAgentPersonality(proposedPersonality);
    setIsOnboardingOpen(false);
    setIsCoFounderOpen(true);
    
    addToast(`Welcome! Your '${profile.founderArchetype.name}' profile is ready.`, 'success');
  };
  
  const handleMilestoneComplete = (milestone: Goal) => {
    const multiplier = milestone.multiplier || 1.2;
    setVestedInterest(prev => prev * multiplier);
    addToast(`Milestone Complete! Your Co-Founder's vested interest increased by ${((multiplier - 1) * 100).toFixed(0)}%!`, 'success');
  };

  const renderActiveHub = () => {
    switch (activeHub) {
      case 'plans':
        return <PlansApp user={user} addToast={addToast} agentPersonality={agentPersonality} vestedInterest={vestedInterest} />;
      case 'decks':
        return <DecksApp user={user} showToast={addToast} />;
      case 'proposals':
        return <ProposalsApp user={user} addToast={addToast} />;
      case 'forms':
        return <FormsApp user={user} addToast={addToast} />;
      default:
        return <PlansApp user={user} addToast={addToast} agentPersonality={agentPersonality} vestedInterest={vestedInterest}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 flex flex-col">
      <HubHeader 
        activeHub={activeHub} 
        setActiveHub={setActiveHub} 
        user={user}
        onStartFree={handleStartFree}
      />
      <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
        {renderActiveHub()}
      </main>
      <Toaster toasts={toasts} removeToast={removeToast} />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />
      {user.loggedIn && agentPersonality && (
        <>
            <CoFounderHub 
                isOpen={isCoFounderOpen}
                setIsOpen={setIsCoFounderOpen}
                addToast={addToast} 
                user={user} 
                personality={agentPersonality}
                setPersonality={setAgentPersonality}
                whatsAppSettings={whatsAppSettings}
                setWhatsAppSettings={setWhatsAppSettings}
                vestedInterest={vestedInterest}
                onMilestoneComplete={handleMilestoneComplete}
                messages={messages}
                setMessages={setMessages}
                openWhatsApp={() => setIsWhatsAppOpen(true)}
            />
            <WhatsAppChat
                isOpen={isWhatsAppOpen}
                onClose={() => setIsWhatsAppOpen(false)}
                addToast={addToast} 
                user={user} 
                personality={agentPersonality}
                vestedInterest={vestedInterest}
                messages={messages}
                setMessages={setMessages}
            />
        </>
      )}
      <Footer />
    </div>
  );
}
