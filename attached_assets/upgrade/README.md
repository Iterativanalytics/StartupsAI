# IterativStartups - Documents Hub: Full Codebase

This document contains the complete source code for the IterativStartups Documents Hub application.

---

## `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IterativStartups - Documents Hub</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="importmap">
      {
        "imports": {
          "react/": "https://aistudiocdn.com/react@^19.2.0/",
          "react": "https://aistudiocdn.com/react@^19.2.0",
          "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
          "lucide-react": "https://aistudiocdn.com/lucide-react@^0.545.0",
          "@google/genai": "https://aistudiocdn.com/@google/genai@^1.25.0"
        }
      }
    </script>
    <style>
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in-up {
        animation: fade-in-up 0.5s ease-out forwards;
      }
      @keyframes pop-in {
        0% {
          transform: scale(0.5);
          opacity: 0;
        }
        75% {
          transform: scale(1.1);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .animate-pop-in {
        animation: pop-in 0.3s ease-out forwards;
      }
      .toggle-checkbox { appearance: none; width: 40px; height: 20px; background-color: #d1d5db; border-radius: 9999px; position: relative; cursor: pointer; transition: background-color 0.2s ease-in-out; }
      .toggle-checkbox:checked { background-color: #4f46e5; }
      .toggle-checkbox::before { content: ''; position: absolute; width: 16px; height: 16px; background-color: white; border-radius: 9999px; top: 2px; left: 2px; transition: transform 0.2s ease-in-out; }
      .toggle-checkbox:checked::before { transform: translateX(20px); }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
```

---

## `metadata.json`

```json
{
  "name": "IterativStartups 1.0",
  "description": "A comprehensive AI-powered business innovation platform that connects entrepreneurs, investors, lenders and partners. This hub unifies IterativePlans, IterativProposals, IterativForms, and IterativDecks into a central workspace for strategic documents.",
  "requestFramePermissions": []
}
```

---

## `index.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## `App.tsx`

```tsx
import React, { useState, useCallback, useEffect } from 'react';
import HubHeader from './components/HubHeader';
import Footer from './components/Footer';
import PlansApp from './modules/plans/PlansApp';
import DecksApp from './modules/decks/DecksApp';
import ProposalsApp from './modules/proposals/ProposalsApp';
import FormsApp from './modules/forms/FormsApp';
import { Toaster } from './components/Toaster';
import OnboardingModal from './components/OnboardingModal';
import CoFounderHub from './components/cofounder/CoFounderHub';
import WhatsAppChat from './components/cofounder/WhatsAppChat';
import { ToastMessage, ToastType, HubModule, User, Persona, EntrepreneurStage, CompositeProfile, CoFounderPersonality, WhatsAppSettings, Goal, ChatMessage } from './types';

const App: React.FC = () => {
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
    setToasts(prev => [...prev, { message, type, id, onClick }]);
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
      entrepreneurStage: stage,
      compositeProfile: profile 
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
};

export default App;
```

---

## `types.ts`

```typescript
import React from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  onClick?: () => void;
}

export interface PivotType {
  id: string;
  name: string;
  description: string;
}

export type PlatformTab = 'platform' | 'methodology' | 'competitors' | 'pricing';

export type Mode = 'fast-track' | 'validated';

export type HubModule = 'plans' | 'decks' | 'proposals' | 'forms';

export type Persona = 'entrepreneur' | 'incubator' | 'investor' | 'lender';

export type EntrepreneurStage = 'ideation' | 'pre-seed' | 'growth';

export interface User {
  loggedIn: boolean;
  persona: Persona | null;
  name: string;
  entrepreneurStage?: EntrepreneurStage;
  compositeProfile?: CompositeProfile;
}

export interface Assumption {
  id: string;
  text: string;
  risk: 'high' | 'medium' | 'low';
  status: 'untested' | 'validated' | 'invalidated';
  sourceSection: string;
}

export interface PhaseStep {
  id: string;
  title: string;
  description: string;
  tool: string;
}

export interface Phase {
  name:string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  methodology: string;
  steps: PhaseStep[];
}

export type Phases = Record<string, Phase>;

export interface Tool {
  name: string;
  description: string;
  outputs: string[];
}

export type Tools = Record<string, Tool>;

export type ActivePhase = 'discover' | 'define' | 'ideate' | 'experiment' | 'measure' | 'scale' | 'prototype' | 'test';

export interface PlanCompetitorRow {
  feature: string;
  iterativePlans: string;
  growthWheel: string;
  venturePlanner: string;
  livePlan: string;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface RevenueStream {
  stream: string;
  year1: string;
  year2: string;
  year3: string;
  percentage: string;
}

export interface DeckCompetitorRow {
  feature: string;
  iterativDecks: string;
  growthWheel: string;
  venturePlanner: string;
  livePlan: string;
}

export interface DeckStyle {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  instruction: string;
}

export interface ApplicationFormField {
  id: string;
  label: string;
  type: 'textarea' | 'text';
  required: boolean;
  maxLength?: number;
  placeholder?: string;
}

export interface ApplicationFormSection {
  id: string;
  title: string;
  fields: ApplicationFormField[];
}

export interface ApplicationForm {
  id: string;
  name: string;
  type: 'accelerator' | 'grant' | 'competition' | 'investment';
  organization: string;
  deadline: string;
  sections: ApplicationFormSection[];
}

export interface AISuggestion {
  fieldId: string;
  suggestion: string;
}

export type BusinessPlan = Record<string, {
  text?: string;
  visuals?: { chartType: string; title: string }[];
}>;

export interface SimpleBusinessPlanData {
  companyName: string;
  description: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  traction: string;
  team: string;
  financials: string;
}

// Project Context Types
export interface Project<T> {
  content: T;
  assumptions: Assumption[];
  name: string;
  year?: number;
}

// Co-Founder Agent Types
export type ConversationMode = 'strategic' | 'quick_advice' | 'devils_advocate' | 'brainstorm' | 'accountability';

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    mode?: ConversationMode;
}

export interface CoFounderPersonality {
  traits: {
    assertiveness: number;
    optimism: number;
    detail_orientation: number;
    risk_tolerance: number;
    directness: number;
  };
  style: {
    formality: 'casual' | 'professional' | 'adaptive';
    humor: 'frequent' | 'occasional' | 'rare';
  };
}

export interface Insight {
    id: string;
    type: 'risk' | 'warning' | 'opportunity' | 'celebration' | 'accountability';
    priority: 'high' | 'medium' | 'low';
    title: string;
    message: string;
    delivery?: ('dashboard' | 'whatsapp')[];
}

export interface Goal {
    id: string;
    text: string;
    status: 'on-track' | 'at-risk' | 'off-track' | 'complete';
    isMilestone?: boolean;
    milestoneType?: string;
    multiplier?: number;
}

export interface WhatsAppSettings {
    enabled: boolean;
    phoneNumber: string;
    sendHighPriority: boolean;
    sendGoalUpdates: boolean;
    sendWeeklySummary: boolean;
}

export interface AgentConfig {
  name: string;
  icon: React.ElementType;
  welcomeMessage: string;
  systemIdentity: string;
}

// Assessment System Types
export interface RIASECScore {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

export interface BigFiveScore {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface AIReadinessScore {
  awareness: number;
  adoption: number;
  implementation: number;
  strategy: number;
  overall: number;
}

export interface FounderArchetype {
    name: string;
    code: string;
    description: string;
    strengths: string[];
    challenges: string[];
}

export interface CompositeProfile {
  riasec: RIASECScore;
  bigFive: BigFiveScore;
  aiReadiness: AIReadinessScore;
  founderArchetype: FounderArchetype;
  coreStrengths: string[];
  blindSpots: string[];
}
```

---

## `constants.ts`

```typescript
import { PivotType } from './types';
import { Target, Brain, Settings, DollarSign } from 'lucide-react';
import { PlatformTab } from './types';

export const PIVOT_TYPES: PivotType[] = [
  { id: 'zoom-in', name: 'Zoom-In Pivot', description: 'Single feature becomes the product' },
  { id: 'zoom-out', name: 'Zoom-Out Pivot', description: 'Product becomes single feature of larger product' },
  { id: 'customer-segment', name: 'Customer Segment Pivot', description: 'Solve same problem for different customer' },
  { id: 'customer-need', name: 'Customer Need Pivot', description: 'Solve different problem for same customer' },
  { id: 'platform', name: 'Platform Pivot', description: 'Application becomes platform or vice versa' },
  { id: 'business-architecture', name: 'Business Architecture Pivot', description: 'High margin/low volume ↔ Low margin/high volume' },
  { id: 'value-capture', name: 'Value Capture Pivot', description: 'Monetization model change' },
  { id: 'engine-of-growth', name: 'Engine of Growth Pivot', description: 'Change growth strategy (viral, sticky, paid)' },
  { id: 'channel', name: 'Channel Pivot', description: 'Same solution, different distribution' },
  { id: 'technology', name: 'Technology Pivot', description: 'Same solution, different technology' }
];

export const NAV_TABS: {id: PlatformTab, label: string, icon: React.ComponentType<any>}[] = [
  { id: 'platform', label: 'Platform', icon: Settings },
  { id: 'methodology', label: 'Methodology', icon: Brain },
  { id: 'competitors', label: 'vs Competitors', icon: Target },
  { id: 'pricing', label: 'Pricing', icon: DollarSign }
];
```

---

## `contexts/ProjectContext.tsx`

```tsx
import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import { Project, Assumption } from '../types';

// This is a factory function to create a typed Project context, provider, and hook.
export function createProjectContext<T>() {
  // Create a context with a specific shape.
  const ProjectContext = createContext<{
    project: Project<T> | null;
    setProject: React.Dispatch<React.SetStateAction<Project<T> | null>>;
  } | undefined>(undefined);

  // The Provider component that will wrap the part of the app that needs this context.
  const ProjectProvider = ({ children }: PropsWithChildren<{}>) => {
    const [project, setProject] = useState<Project<T> | null>(null);
    return (
      <ProjectContext.Provider value={{ project, setProject }}>
        {children}
      </ProjectContext.Provider>
    );
  };
  
  // A custom hook to easily access the context's value.
  const useProject = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
      throw new Error('useProject must be used within a ProjectProvider');
    }
    
    const { project, setProject } = context;

    // Abstracted logic to update the context
    const generateProject = (content: T, assumptions: Assumption[], name: string, year?: number) => {
      setProject({ content, assumptions, name, year });
    };

    const clearProject = () => {
      setProject(null);
    };

    const updateProjectContent = (newContent: T) => {
        setProject(prev => {
            if (!prev) return null;
            return { ...prev, content: newContent };
        });
    };
    
    const updateSectionContent = (sectionId: string, sectionContent: any) => {
        setProject(prev => {
            if (!prev) return null;
            const newContent = {
                ...(prev.content as object),
                [sectionId]: sectionContent,
            };
            return { ...prev, content: newContent as T };
        });
    };

    return { project, generateProject, clearProject, updateProjectContent, updateSectionContent };
  };

  // Return the provider and hook to be used in the application.
  return { ProjectProvider, useProject };
}
```

---

## `hooks/useGeminiGenerator.ts`

```tsx
import { useState } from 'react';
// FIX: Changed GenerateContentRequest to GenerateContentParameters as it is deprecated.
import { GoogleGenAI, GenerateContentParameters } from '@google/genai';
import { ToastType } from '../types';

interface UseGeminiGeneratorReturn {
  isLoading: boolean;
  error: Error | null;
  generateContent: (request: GenerateContentParameters) => Promise<string | null>;
}

export const useGeminiGenerator = (
    addToast: (message: string, type: ToastType) => void
): UseGeminiGeneratorReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateContent = async (request: GenerateContentParameters): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent(request);
      addToast('AI generation successful!', 'success');
      return response.text;
    } catch (e) {
      console.error('AI Generation Error:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(e as Error);
      addToast(`AI generation failed: ${errorMessage}`, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, generateContent };
};
```

---

## Components

### `components/Footer.tsx`

```tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white mt-16 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">IterativStartups</h3>
            <p className="text-sm text-slate-400">The comprehensive AI-powered business innovation platform.</p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">IterativePlans</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Methodology</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Certification</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-sm text-slate-400">© 2025 IterativStartups Inc. • "Where uncertainty becomes strategy."</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

### `components/HubHeader.tsx`

```tsx
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
```

### `components/PivotModal.tsx`

```tsx
import React from 'react';
import { GitBranch } from 'lucide-react';
import { PivotType } from '../types';

interface PivotModalProps {
  isOpen: boolean;
  onClose: () => void;
  pivotTypes: PivotType[];
}

const PivotModal: React.FC<PivotModalProps> = ({ isOpen, onClose, pivotTypes }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitBranch className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">Pivot Intelligence</h3>
                <p className="text-white/90 text-sm">10 structured pivot types based on validated learning</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pivotTypes.map(pivot => (
              <button
                key={pivot.id}
                className="text-left p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-slate-200 hover:border-purple-400 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <div className="font-semibold text-slate-800 mb-1">{pivot.name}</div>
                <div className="text-sm text-slate-600">{pivot.description}</div>
                <div className="mt-2 text-xs text-purple-600 font-medium">→ Analyze fit</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PivotModal;
```

### `components/Toast.tsx`

```tsx
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { ToastMessage, ToastType } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-6 h-6 text-green-500" />,
  error: <AlertTriangle className="w-6 h-6 text-red-500" />,
  info: <Info className="w-6 h-6 text-blue-500" />,
};

const TOAST_STYLES: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000); // Auto-close after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose, toast.id]);

  const Wrapper = toast.onClick ? 'button' : 'div';

  return (
    <Wrapper 
        onClick={toast.onClick}
        className={`w-full text-left rounded-lg shadow-lg animate-fade-in-up border ${TOAST_STYLES[toast.type]} ${toast.onClick ? 'cursor-pointer hover:shadow-xl' : ''}`}
        role={Wrapper === 'div' ? "alert" : undefined}
        aria-live={Wrapper === 'div' ? "assertive" : undefined}
    >
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0">{ICONS[toast.type]}</div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={(e) => {
                e.stopPropagation(); // prevent wrapper onClick if it exists
                onClose(toast.id);
            }}
            className="inline-flex rounded-md p-1.5 text-current/70 hover:bg-current/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-current/10 focus:ring-current/50"
            aria-label="Close notification"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Toast;
```

### `components/Toaster.tsx`

```tsx
import React from 'react';
import Toast from './Toast';
import { ToastMessage } from '../types';

interface ToasterProps {
    toasts: ToastMessage[];
    removeToast: (id: number) => void;
}

export const Toaster: React.FC<ToasterProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-24 right-5 z-50 w-full max-w-sm space-y-3">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={removeToast} />
            ))}
        </div>
    );
};
```

### `components/AssumptionDashboard.tsx`

```tsx
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Assumption } from '../types';

interface AssumptionDashboardProps {
    assumptions: Assumption[];
    onClear: () => void;
    onDesignExperiment: (assumption: Assumption) => void;
    noun?: string;
}

const AssumptionDashboard: React.FC<AssumptionDashboardProps> = ({ assumptions, onClear, onDesignExperiment, noun = 'plan' }) => {
    const riskColorMap = {
        high: 'border-red-500 bg-red-50 text-red-800',
        medium: 'border-yellow-500 bg-yellow-50 text-yellow-800',
        low: 'border-blue-500 bg-blue-50 text-blue-800',
    };

    const highRiskAssumptions = assumptions.filter(a => a.risk === 'high');

    return (
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 mb-8 border-2 border-purple-200 relative animate-fade-in-up">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">Assumption Dashboard</h3>
                    <p className="text-slate-600 mt-1">
                        Your Fast Track {noun} generated <span className="font-bold text-purple-600">{assumptions.length} assumptions</span>. It's time to validate the riskiest ones.
                    </p>
                </div>
                <button 
                    onClick={onClear} 
                    className="text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full p-2 transition-colors"
                    aria-label="Clear assumptions and start fresh"
                >
                    <X className="w-5 h-5"/>
                </button>
            </div>
            {highRiskAssumptions.length > 0 ? (
                <div className="space-y-3">
                    {highRiskAssumptions.map(assumption => (
                        <div key={assumption.id} className={`p-4 rounded-lg border-l-4 flex items-center md:items-start gap-4 ${riskColorMap[assumption.risk]}`}>
                            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold">{assumption.text}</p>
                                <p className="text-xs opacity-80 mt-1">Source: {assumption.sourceSection} • Risk: High</p>
                            </div>
                            <button onClick={() => onDesignExperiment(assumption)} className="bg-purple-600 text-white text-xs font-semibold py-1 px-3 rounded-full hover:bg-purple-700 transition-colors flex-shrink-0">
                                Design Experiment
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                 <p className="text-sm text-slate-500 mt-4 text-center">No high-risk assumptions were generated. You can proceed with the workflow or generate a new {noun}.</p>
            )}
             <p className="text-sm text-slate-500 mt-4 text-center">Proceed with the workflow below to start validating these assumptions.</p>
        </div>
    );
};

export default AssumptionDashboard;
```

### `components/ToolModal.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { Sparkles, X, Loader2, Globe } from 'lucide-react';
import { Tool, ToastType } from '../types';
import { useGeminiGenerator } from '../hooks/useGeminiGenerator';
// FIX: Changed GenerateContentRequest to GenerateContentParameters as it is deprecated.
import { GenerateContentParameters } from '@google/genai';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool | null;
  onComplete: () => void;
  addToast: (message: string, type: ToastType) => void;
}

const ToolModal: React.FC<ToolModalProps> = ({ isOpen, onClose, tool, onComplete, addToast }) => {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [useWebSearch, setUseWebSearch] = useState(false);
  const { isLoading, generateContent } = useGeminiGenerator(addToast);


  useEffect(() => {
    if (isOpen) {
      setUserInput('');
      setAiResponse('');
      setUseWebSearch(false);
    }
  }, [isOpen, tool]);


  if (!isOpen || !tool) return null;

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      addToast('Please provide some input for the AI.', 'error');
      return;
    }
    setAiResponse('');
    
    const prompt = `
        You are an expert business advisor AI. Your current role is to act as the "${tool.name}".
        Your purpose is: "${tool.description}".
        Based on the following user input, generate the expected outputs. The expected outputs are: ${tool.outputs.join(', ')}.
        Format your response clearly in Markdown, using headings and lists where appropriate.

        User Input:
        ---
        ${userInput}
        ---
    `;

    const request: GenerateContentParameters = {
        model: 'gemini-2.5-flash',
        contents: prompt,
    };

    if (useWebSearch) {
        request.config = { tools: [{googleSearch: {}}] };
        addToast("Using Web Search to ground response...", "info");
    }

    const responseText = await generateContent(request);
    if (responseText) {
        setAiResponse(responseText);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-pop-in">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-2 rounded-lg">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">{tool.name}</h3>
                    <p className="text-sm text-slate-500">{tool.description}</p>
                </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:bg-slate-200 rounded-lg p-2 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
            <div>
                <label htmlFor="userInput" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Input (e.g., research notes, ideas, data)
                </label>
                <textarea
                    id="userInput"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Provide context for the AI..."
                />
            </div>

            {aiResponse && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mt-4">
                    <h4 className="text-md font-semibold text-slate-800 mb-2">AI Generated Output</h4>
                    <div className="prose prose-sm max-w-none bg-white p-3 rounded-md border border-slate-200 max-h-60 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">{aiResponse}</pre>
                    </div>
                </div>
            )}
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center gap-4 sticky bottom-0 z-10">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="web-search-toggle"
                    className="toggle-checkbox"
                    checked={useWebSearch}
                    onChange={(e) => setUseWebSearch(e.target.checked)}
                />
                <label htmlFor="web-search-toggle" className="flex items-center gap-1 text-xs font-medium text-slate-600 cursor-pointer">
                    <Globe className="w-4 h-4" />
                    Enable Web Search
                </label>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Generate with AI
                        </>
                    )}
                </button>
                <button
                    onClick={handleComplete}
                    disabled={!aiResponse || isLoading}
                    className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Mark as Complete
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ToolModal;
```

### `components/OnboardingModal.tsx`

```tsx
import React, { useState } from 'react';
import { Sparkles, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Persona, EntrepreneurStage, CompositeProfile, CoFounderPersonality } from '../types';
import PersonaSelector from './PersonaSelector';
import EntrepreneurStageSelector from './EntrepreneurStageSelector';
import AssessmentRunner from './assessment/AssessmentRunner';
import AssessmentResults from './assessment/AssessmentResults';
import { synthesizeProfile, proposePersonality } from './assessment/utils';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (
    persona: Persona, 
    stage: EntrepreneurStage | undefined,
    profile: CompositeProfile,
    proposedPersonality: CoFounderPersonality
  ) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [selectedStage, setSelectedStage] = useState<EntrepreneurStage | undefined>(undefined);
  const [compositeProfile, setCompositeProfile] = useState<CompositeProfile | null>(null);
  const [proposedPersonality, setProposedPersonality] = useState<CoFounderPersonality | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  if (!isOpen) return null;

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
    if (persona === 'entrepreneur') {
      setStep(2);
    } else {
      setStep(3); // Skip stage selection
    }
  };

  const handleStageSelect = (stage: EntrepreneurStage) => {
    setSelectedStage(stage);
    setStep(3);
  };
  
  const handleAssessmentComplete = (answers: Record<string, number>) => {
    setIsSynthesizing(true);
    // Simulate processing delay
    setTimeout(() => {
        const profile = synthesizeProfile(answers);
        const personality = proposePersonality(profile);
        setCompositeProfile(profile);
        setProposedPersonality(personality);
        setIsSynthesizing(false);
        setStep(4);
    }, 1500);
  };

  const handleFinalize = () => {
    if (selectedPersona && compositeProfile && proposedPersonality) {
      onComplete(selectedPersona, selectedStage, compositeProfile, proposedPersonality);
    }
  };

  const handleBack = () => {
      if (step > 1) {
          setStep(step - 1);
      }
  };
  
  const getSubtitle = () => {
      switch(step) {
          case 1: return "Let's tailor your experience. Please select your role.";
          case 2: return "Tell us a bit more about your venture.";
          case 3: return "Discover your entrepreneurial profile (10-15 min).";
          case 4: return "Your profile is ready! Here's your archetype and a proposed AI partner.";
          default: return "Welcome to IterativStartups!";
      }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto flex flex-col">
        <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
                {step > 1 && (
                    <button onClick={handleBack} className="text-slate-500 hover:bg-slate-200 rounded-full p-2 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <Sparkles className="w-8 h-8 text-purple-600" />
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">Welcome to IterativStartups!</h3>
                    <p className="text-slate-500">{getSubtitle()}</p>
                </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:bg-slate-200 rounded-full p-2 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
        </div>
        <div className="p-8">
            {step === 1 && <PersonaSelector onSelect={handlePersonaSelect} />}
            {step === 2 && <EntrepreneurStageSelector onSelect={handleStageSelect} />}
            {step === 3 && (isSynthesizing ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                    <p className="mt-4 text-slate-600 font-semibold">Synthesizing your profile...</p>
                </div>
            ) : (
                <AssessmentRunner onComplete={handleAssessmentComplete} />
            ))}
            {step === 4 && compositeProfile && proposedPersonality && (
                <div>
                    <AssessmentResults profile={compositeProfile} />
                    <div className="mt-8 bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
                        <h3 className="text-xl font-bold text-slate-800">Your Proposed Co-Founder™ Personality</h3>
                        <p className="text-slate-600 mt-2 mb-4">Based on your profile, we've configured an AI partner to complement your strengths and support your blind spots. You can adjust this anytime.</p>
                        <div className="inline-block bg-white p-4 rounded-lg border">
                          <p>Assertiveness: <strong>{proposedPersonality.traits.assertiveness}/10</strong> | Optimism: <strong>{proposedPersonality.traits.optimism}/10</strong></p>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <button onClick={handleFinalize} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
```

### `components/PersonaSelector.tsx`

```tsx
import React from 'react';
import { Persona } from '../types';
import { Rocket, Building2, TrendingUp, Landmark } from 'lucide-react';

interface PersonaSelectorProps {
    onSelect: (persona: Persona) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSelect }) => {

    const personas = [
        { id: 'entrepreneur' as Persona, icon: Rocket, title: "For Entrepreneurs", description: "Build, evaluate, and reiterate investor-ready business plans." },
        { id: 'incubator' as Persona, icon: Building2, title: "For Incubators & Accelerators", description: "Assess applications at scale with data-driven efficiency." },
        { id: 'investor' as Persona, icon: TrendingUp, title: "For Investors", description: "Accelerate due diligence with AI-enhanced deal intelligence." },
        { id: 'lender' as Persona, icon: Landmark, title: "For Lenders", description: "Enhance credit assessment for startup and SME lending." },
    ];

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map(p => {
                const Icon = p.icon;
                return (
                    <div key={p.id} className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 flex flex-col items-start hover:shadow-2xl hover:border-purple-300 transition-all duration-300">
                        <div className="bg-slate-100 p-3 rounded-xl mb-4">
                            <Icon className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">{p.title}</h3>
                        <p className="text-slate-600 mt-2 mb-6 flex-grow">{p.description}</p>
                        <button onClick={() => onSelect(p.id)} className="w-full bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition-all shadow-md">
                            Select
                        </button>
                    </div>
                )
            })}
        </div>
    );
};

export default PersonaSelector;
```

### `components/EntrepreneurStageSelector.tsx`

```tsx
import React from 'react';
import { Lightbulb, Rocket, BarChart } from 'lucide-react';
import { EntrepreneurStage } from '../types';

interface EntrepreneurStageSelectorProps {
    onSelect: (stage: EntrepreneurStage) => void;
}

const EntrepreneurStageSelector: React.FC<EntrepreneurStageSelectorProps> = ({ onSelect }) => {
    
    const stages = [
        { id: 'ideation' as EntrepreneurStage, icon: Lightbulb, title: "Ideation Stage", description: "You have an idea or are exploring problems to solve." },
        { id: 'pre-seed' as EntrepreneurStage, icon: Rocket, title: "Pre-Seed / Seed Stage", description: "You have a clear concept, maybe an early prototype, and are preparing to raise funding." },
        { id: 'growth' as EntrepreneurStage, icon: BarChart, title: "Growth Stage", description: "You have a product in market with traction and are focused on scaling." },
    ];

    return (
        <div>
            <h3 className="text-lg font-semibold text-center text-slate-700 mb-6">What stage is your venture at?</h3>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                {stages.map(stage => {
                    const Icon = stage.icon;
                    return (
                        <button 
                            key={stage.id} 
                            onClick={() => onSelect(stage.id)}
                            className="text-left bg-slate-50 rounded-xl p-6 border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 flex flex-col items-start group"
                        >
                            <div className="bg-white p-3 rounded-lg border border-slate-200 mb-3 group-hover:border-purple-200">
                                <Icon className="w-6 h-6 text-purple-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">{stage.title}</h4>
                            <p className="text-sm text-slate-500 mt-1 flex-grow">{stage.description}</p>
                            <div className="mt-4 text-xs font-bold text-purple-600 group-hover:underline">Select Stage →</div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default EntrepreneurStageSelector;
```

### `components/ChatBot.tsx`
This file is empty.

### `components/cofounder/*`
This folder contains files for the Co-Founder Agent. The contents are extensive and are included in other sections of the prompt.

### `components/charts/RadarChart.tsx`

```tsx
import React from 'react';

interface RadarChartProps {
  data: { label: string; value: number }[];
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 200 }) => {
  const center = size / 2;
  const numLevels = 5;
  const angleSlice = (Math.PI * 2) / data.length;
  const radius = center * 0.8;

  const points = data.map((d, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * (d.value / 10) * Math.cos(angle);
    const y = center + radius * (d.value / 10) * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const axes = data.map((_, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x1: center, y1: center, x2: x, y2: y };
  });

  const labels = data.map((d, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * 1.15 * Math.cos(angle);
    const y = center + radius * 1.15 * Math.sin(angle);
    return { x, y, label: d.label };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g>
        {/* Concentric circles */}
        {[...Array(numLevels)].map((_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(radius / numLevels) * (i + 1)}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        {axes.map((axis, i) => (
          <line key={i} {...axis} stroke="#cbd5e1" strokeWidth="1" />
        ))}

        {/* Data shape */}
        <polygon
          points={points}
          fill="rgba(79, 70, 229, 0.4)"
          stroke="#4f46e5"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const x = center + radius * (d.value / 10) * Math.cos(angle);
            const y = center + radius * (d.value / 10) * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r="3" fill="#4f46e5" />
        })}

        {/* Labels */}
        {labels.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={l.y}
            fontSize="10"
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="#475569"
            fontWeight="600"
          >
            {l.label}
          </text>
        ))}
      </g>
    </svg>
  );
};

export default RadarChart;
```

### `components/assessment/*`
This folder contains files for the assessment system. The contents are extensive and are included in other sections of the prompt.

---

## Modules
The full code for each module (`plans`, `decks`, `proposals`, `forms`) is provided in the collapsible sections above.
