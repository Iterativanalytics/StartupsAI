import { useState, useCallback, useEffect } from 'react';
import HubHeader from '@/components-hub/HubHeader';
import Footer from '@/components-hub/Footer';
import PlansApp from '@/modules/plans/PlansApp';
import DecksApp from '@/modules/decks/DecksApp';
import IterativProposalsApp from '@/modules/proposals/IterativProposalsApp';
import IterativFormsApp from '@/modules/forms/IterativFormsApp';
import { Toaster } from '@/components-hub/Toaster';
import OnboardingModal from '@/components-hub/OnboardingModal';
import CoFounderHub from '@/components-hub/cofounder/CoFounderHub';
import WhatsAppChat from '@/components-hub/cofounder/WhatsAppChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
import { 
  FileText, 
  Presentation, 
  FileSignature, 
  FormInput, 
  Sun, 
  Moon, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function DocumentsHub() {
  const [activeHub, setActiveHub] = useState<HubModule>('plans');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [user, setUser] = useState<User>({ loggedIn: false, persona: null, name: 'Guest' });
  const [darkMode, setDarkMode] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  
  const [isCoFounderOpen, setIsCoFounderOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Dark mode functionality
  useEffect(() => {
    if (localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };
  
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
    if (!user.loggedIn) return;
    
    const timer = setInterval(() => {
      setVestedInterest(prev => prev + 0.001);
    }, 1000 * 60);
    return () => clearInterval(timer);
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
        return <IterativProposalsApp user={user} addToast={addToast} />;
      case 'forms':
        return <IterativFormsApp user={user} addToast={addToast} />;
      default:
        return <PlansApp user={user} addToast={addToast} agentPersonality={agentPersonality} vestedInterest={vestedInterest}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Dark mode toggle */}
      <div className="fixed top-24 right-4 z-50">
        <Card className="p-2 shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-yellow-500" />
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            <Moon className="h-4 w-4 text-purple-500" />
          </div>
        </Card>
      </div>

      <HubHeader 
        activeHub={activeHub} 
        setActiveHub={setActiveHub} 
        user={user}
        onStartFree={handleStartFree}
      />
      
      {/* Hero Section */}
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Documents Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            The Strategic Workspace of IterativStartups - Unify your business planning, pitch decks, proposals, and applications in one powerful platform
          </p>
        </div>

        {/* Module Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              id: 'plans',
              title: 'IterativPlans',
              description: 'AI-powered business planning with validated methodology',
              icon: FileText,
              color: 'from-purple-500 to-indigo-600',
              bgColor: 'bg-purple-50 dark:bg-purple-900/20',
              features: ['Fast Track Mode', 'Validated Mode', 'Pivot Intelligence']
            },
            {
              id: 'decks',
              title: 'IterativDecks',
              description: 'Create compelling pitch decks from your business plans',
              icon: Presentation,
              color: 'from-teal-500 to-blue-600',
              bgColor: 'bg-teal-50 dark:bg-teal-900/20',
              features: ['AI Generation', 'Style Templates', 'Investor Matching']
            },
            {
              id: 'proposals',
              title: 'IterativProposals',
              description: 'Automate RFP responses and proposal generation',
              icon: FileSignature,
              color: 'from-orange-500 to-red-600',
              bgColor: 'bg-orange-50 dark:bg-orange-900/20',
              features: ['RFP Automation', 'Client Discovery', 'Win Themes']
            },
            {
              id: 'forms',
              title: 'IterativForms',
              description: 'Auto-fill applications and track progress',
              icon: FormInput,
              color: 'from-green-500 to-emerald-600',
              bgColor: 'bg-green-50 dark:bg-green-900/20',
              features: ['Auto-fill', 'Progress Tracking', 'Template Library']
            }
          ].map((module) => {
            const Icon = module.icon;
            const isActive = activeHub === module.id;
            return (
              <Card 
                key={module.id} 
                className={`relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${module.bgColor} ${
                  isActive ? 'ring-2 ring-purple-500 shadow-lg' : ''
                }`}
                onClick={() => setActiveHub(module.id as HubModule)}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${module.color} opacity-10 rounded-full -mr-16 -mt-16`} />
                
                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${module.color} text-white`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    {isActive && (
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4" />
                      Key Features
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {module.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {isActive ? 'Active Module' : 'Click to activate'}
                    </span>
                    <ArrowRight className={`h-4 w-4 transition-transform ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card className="mb-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <TrendingUp className="h-7 w-7 text-green-600" />
              Platform Success Metrics
            </CardTitle>
            <CardDescription>
              Real outcomes from our document management platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">2,847</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Business Plans Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1,892</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pitch Decks Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">73%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">156</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Proposals Won</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
