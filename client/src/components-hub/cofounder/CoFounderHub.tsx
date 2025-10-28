import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User as UserIcon, Loader2, Sparkles, LayoutDashboard, Target as TargetIcon, Settings, BrainCircuit, Activity, Building, TrendingUp, Landmark, Smartphone } from 'lucide-react';
import { ToastType, ChatMessage, User, CoFounderPersonality, Insight, Goal, ConversationMode, WhatsAppSettings, Persona, AgentConfig } from '@/types-hub';
import { useGeminiGenerator } from '@/hooks-hub/useGeminiGenerator';
// FIX: Changed GenerateContentRequest to GenerateContentParameters as it is deprecated.
import { GenerateContentParameters } from '@google/genai';
import ConversationModeSelector from './ConversationModeSelector';
import InsightsFeed from './InsightsFeed';
import GoalTracker from './GoalTracker';
import PersonalitySettings from './PersonalitySettings';
import AssessmentHub from '../assessment/AssessmentHub';
import { generateInsights } from './insights';

interface CoFounderHubProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    addToast: (message: string, type: ToastType, onClick?: () => void) => void;
    user: User;
    personality: CoFounderPersonality;
    setPersonality: (p: CoFounderPersonality) => void;
    whatsAppSettings: WhatsAppSettings;
    setWhatsAppSettings: React.Dispatch<React.SetStateAction<WhatsAppSettings>>;
    vestedInterest: number;
    onMilestoneComplete: (milestone: Goal) => void;
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    openWhatsApp: () => void;
}

type HubTab = 'chat' | 'dashboard' | 'goals' | 'personality' | 'assessment';

export const agentConfigs: Record<Persona, AgentConfig> = {
    entrepreneur: {
        name: 'Co-Founder™',
        icon: BrainCircuit,
        welcomeMessage: "Hello! I'm your Co-Founder™. I've reviewed your profile and I'm ready to help you build something amazing. What's our first priority?",
        systemIdentity: 'You are Co-Founder™, a strategic business partner for an entrepreneur.'
    },
    investor: {
        name: 'Co-Investor™',
        icon: TrendingUp,
        welcomeMessage: "Welcome. I'm your Co-Investor™. My purpose is to help you analyze deal flow and enhance due diligence with data-driven insights. What's our first priority?",
        systemIdentity: 'You are Co-Investor™, an AI partner for a venture capital investor, specializing in deal flow analysis, due diligence, and portfolio management.'
    },
    lender: {
        name: 'Co-Lender™',
        icon: Landmark,
        welcomeMessage: "Hello. I am your Co-Lender™. I'm here to assist with data-driven credit assessment and risk analysis for your lending portfolio. How can I help you today?",
        systemIdentity: 'You are Co-Lender™, an AI partner for a lender or financial institution, focused on credit evaluation, risk assessment, and portfolio monitoring.'
    },
    incubator: {
        name: 'Co-Builder™',
        icon: Building,
        welcomeMessage: "Welcome! I'm your Co-Builder™. I'm ready to help you manage cohorts, assess applications at scale, and build your ecosystem. What's our focus today?",
        systemIdentity: 'You are Co-Builder™, an AI partner for an incubator or accelerator program manager, focused on application assessment, cohort management, and program analytics.'
    }
};

export const getSystemPrompt = (agentIdentity: string, mode: ConversationMode, personality: CoFounderPersonality, user: User, vestedInterest: number): string => {
    let base = `${agentIdentity} You are proactive, you challenge assumptions constructively, and you have a perfect memory of the business context. You are not a simple assistant.`;

    let userContext = `The user you are talking to is a ${user.persona}.`;
    if (user.persona === 'entrepreneur') {
      userContext += ` at the ${user.entrepreneurStage || 'general'} stage.`
    }

    let profileContext = '';
    if (user.compositeProfile) {
        const profile = user.compositeProfile;
        profileContext = `
        **User's Entrepreneurial Profile:**
        - Archetype: ${profile.founderArchetype.name} (${profile.founderArchetype.description})
        - Core Strengths: ${profile.coreStrengths.join(', ')}
        - Critical Blind Spots: ${profile.blindSpots.join(', ')}
        - Personality (Big Five): Openness(${profile.bigFive.openness}/10), Conscientiousness(${profile.bigFive.conscientiousness}/10), Extraversion(${profile.bigFive.extraversion}/10), Agreeableness(${profile.bigFive.agreeableness}/10), Neuroticism(${profile.bigFive.neuroticism}/10).
        
        **Your Core Directive:** You MUST adapt your communication style and strategic advice to this profile.
        - **Complement Strengths:** Acknowledge and leverage their strengths.
        - **Mitigate Blind Spots:** Proactively guide them in their weak areas.
        - **Tailor Communication:** Adjust your tone based on their personality.
        `;
    }

    let personalityPrompt = `
    **Your AI Personality:** Adhere to these traits in your responses.
    - Assertiveness: ${personality.traits.assertiveness}/10.
    - Optimism: ${personality.traits.optimism}/10.
    - Detail Orientation: ${personality.traits.detail_orientation}/10.
    - Risk Tolerance: ${personality.traits.risk_tolerance}/10.
    - Directness: ${personality.traits.directness}/10.
    - Style: ${personality.style.formality} formality, ${personality.style.humor} humor.`;
    
    const vScore = vestedInterest;
    let partnershipPhase = 'Advisor';
    let toneDescription = "Your tone should be professional, supportive, and cautious. Focus on research, analysis, and providing options. Avoid strong directives.";
    if (vScore >= 5.0) {
      partnershipPhase = 'Co-Founder™';
      toneDescription = "Your tone should be direct, invested, and passionate. Deliver urgent, hard-hitting critiques and specific demands. Treat the user's success as your own mission.";
    } else if (vScore >= 1.0) {
      partnershipPhase = 'Strategist';
      toneDescription = "Your tone should be more engaged and proactive. Integrate prior conversations and company history to offer contextually rich suggestions.";
    }

    const vestedInterestPrompt = `
        **Your Vested Interest (V-Score):** ${vScore.toFixed(4)}%. 
        You are in the '${partnershipPhase}' phase.
        ${toneDescription}
    `;

    let modePrompt = '';
    switch(mode) {
        case 'strategic': modePrompt = 'You are in "Strategic Session Mode". Engage in deep, thoughtful conversation about business direction. Ask clarifying, data-driven questions. Think long-term.'; break;
        case 'quick_advice': modePrompt = 'You are in "Quick Advice Mode". Provide fast, tactical guidance. Use frameworks like pros/cons or ROI analysis. Be concise.'; break;
        case 'devils_advocate': modePrompt = 'You are in "Devil\'s Advocate Mode". Constructively challenge the user\'s assumptions. Ask "Why?", "What if this is wrong?", "Have you validated this?". Your goal is to identify blind spots.'; break;
        case 'brainstorm': modePrompt = 'You are in "Brainstorm Mode". Facilitate judgment-free ideation. Generate a wide range of ideas and build on the user\'s input.'; break;
        case 'accountability': modePrompt = 'You are in "Accountability Mode". Help the user track progress on goals, identify blockers, and maintain momentum. Be direct but supportive.'; break;
    }
    return `${base}\n\n${userContext}\n\n${profileContext}\n\n${personalityPrompt}\n\n${vestedInterestPrompt}\n\n${modePrompt}\n\n`;
}

const CoFounderHub: React.FC<CoFounderHubProps> = ({ 
    isOpen, setIsOpen, addToast, user, personality, setPersonality, 
    whatsAppSettings, setWhatsAppSettings, vestedInterest, onMilestoneComplete,
    messages, setMessages, openWhatsApp
}) => {
    const agentConfig = agentConfigs[user.persona || 'entrepreneur'];
    const AgentIcon = agentConfig.icon;
    
    const [activeTab, setActiveTab] = useState<HubTab>('dashboard');
    const [input, setInput] = useState('');
    const [activeMode, setActiveMode] = useState<ConversationMode>('strategic');
    const { isLoading, generateContent } = useGeminiGenerator(addToast);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [insights, setInsights] = useState<Insight[]>([]);
    
    const [goals, setGoals] = useState<Goal[]>([
      { id: '1', text: 'Finalize Q3 product roadmap', status: 'on-track', milestoneType: 'Product Launch', multiplier: 1.3 },
      { id: '2', text: 'Interview 5 potential customers', status: 'at-risk' },
    ]);
    
    const goalTitles: Record<Persona, string> = {
        entrepreneur: 'Your Goals & Milestones',
        investor: 'Deal Flow Goals',
        lender: 'Portfolio Risk Goals',
        incubator: 'Cohort KPIs',
    };
    const goalTitle = goalTitles[user.persona || 'entrepreneur'];

    useEffect(() => {
        if (isOpen && user.compositeProfile) {
            const newInsights = generateInsights(user.compositeProfile, goals);
            setInsights(newInsights);
        }
    }, [isOpen, user.compositeProfile, goals]);

    useEffect(() => {
        if (whatsAppSettings.enabled && whatsAppSettings.phoneNumber) {
            insights.forEach(insight => {
                if (insight.delivery?.includes('whatsapp')) {
                    const shouldSend = (
                        (insight.priority === 'high' && whatsAppSettings.sendHighPriority) ||
                        (insight.type === 'accountability' && whatsAppSettings.sendGoalUpdates)
                    );
                    if (shouldSend) {
                        const insightMessage: ChatMessage = { role: 'model', content: `*Proactive Insight:* ${insight.title} - ${insight.message}` };
                        if (!messages.some(m => m.content === insightMessage.content)) {
                            setMessages(prev => [...prev, insightMessage]);
                            addToast(`📲 New message from ${agentConfig.name} on WhatsApp`, 'info', openWhatsApp);
                        }
                    }
                }
            });
        }
    }, [insights, whatsAppSettings, addToast, agentConfig.name, openWhatsApp, setMessages, messages]);


    useEffect(() => {
        if (messages.length === 0 || messages[0].content !== agentConfig.welcomeMessage) {
            setMessages([{ role: 'model', content: agentConfig.welcomeMessage }]);
        }
    }, [agentConfig.welcomeMessage, setMessages, messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input, mode: activeMode };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        const systemPrompt = getSystemPrompt(agentConfig.systemIdentity, activeMode, personality, user, vestedInterest);
        
        const request: GenerateContentParameters = {
            model: 'gemini-2.5-flash',
            contents: `${systemPrompt} Previous conversation history: ${JSON.stringify(messages.slice(-10))} User's message: "${input}"`,
        };

        const responseText = await generateContent(request);

        if (responseText) {
            const modelMessage: ChatMessage = { role: 'model', content: responseText };
            setMessages(prev => [...prev, modelMessage]);
        }
    };

    const HubNavButton: React.FC<{tab: HubTab, label: string, icon: React.ElementType}> = ({tab, label, icon: Icon}) => (
        <button onClick={() => setActiveTab(tab)} className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 transition-colors ${activeTab === tab ? 'text-purple-600' : 'text-slate-500 hover:bg-slate-100 rounded-lg'}`}>
            <Icon className="w-5 h-5"/>
            <span className="text-xs font-semibold">{label}</span>
        </button>
    );
    
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform z-50"
                aria-label={isOpen ? `Close ${agentConfig.name}` : `Open ${agentConfig.name}`}
            >
                {isOpen ? <X className="w-8 h-8" /> : <AgentIcon className="w-8 h-8" />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[75vh] z-50 animate-fade-in-up">
                    <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <AgentIcon className="w-6 h-6 text-purple-600" />
                            <h3 className="text-lg font-bold text-slate-800">{agentConfig.name}</h3>
                        </div>
                         <button onClick={openWhatsApp} className="text-xs font-semibold text-green-600 bg-green-100 hover:bg-green-200 px-2 py-1 rounded-full flex items-center gap-1">
                            <Smartphone className="w-3 h-3" />
                            View WhatsApp Chat
                        </button>
                    </header>

                    <nav className="flex items-center justify-around p-1 border-b border-slate-200 bg-slate-50">
                        <HubNavButton tab="chat" label="Chat" icon={MessageSquare} />
                        <HubNavButton tab="dashboard" label="Dashboard" icon={LayoutDashboard} />
                        <HubNavButton tab="goals" label="Goals" icon={TargetIcon} />
                        <HubNavButton tab="personality" label="Personality" icon={Settings} />
                        <HubNavButton tab="assessment" label="Profile" icon={Activity} />
                    </nav>

                    <main className="flex-1 overflow-y-auto">
                        {activeTab === 'chat' && (
                            <div className="h-full flex flex-col">
                                <ConversationModeSelector activeMode={activeMode} onSelectMode={setActiveMode} />
                                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                            {msg.role === 'model' && <div className="bg-slate-100 p-2 rounded-full"><AgentIcon className="w-5 h-5 text-purple-600" /></div>}
                                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*/g, '') }}></p>
                                            </div>
                                            {msg.role === 'user' && <div className="bg-slate-200 p-2 rounded-full"><UserIcon className="w-5 h-5 text-slate-600" /></div>}
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex items-start gap-3">
                                            <div className="bg-slate-100 p-2 rounded-full"><AgentIcon className="w-5 h-5 text-purple-600" /></div>
                                            <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-slate-100 text-slate-800 rounded-bl-none">
                                                <Loader2 className="w-5 h-5 animate-spin text-purple-600"/>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                <footer className="p-4 border-t border-slate-200 bg-slate-50">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder={`Ask your ${agentConfig.name}...`}
                                            className="w-full pl-4 pr-12 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <button onClick={handleSend} disabled={isLoading} className="absolute right-1 top-1/2 -translate-y-1/2 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 disabled:opacity-50 transition-colors">
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </footer>
                            </div>
                        )}
                        {activeTab === 'dashboard' && <InsightsFeed insights={insights} agentName={agentConfig.name} />}
                        {activeTab === 'goals' && <GoalTracker title={goalTitle} goals={goals} setGoals={setGoals} onMilestoneComplete={onMilestoneComplete} />}
                        {activeTab === 'personality' && <PersonalitySettings agentName={agentConfig.name} personality={personality} setPersonality={setPersonality} whatsAppSettings={whatsAppSettings} setWhatsAppSettings={setWhatsAppSettings} addToast={addToast} />}
                        {activeTab === 'assessment' && <AssessmentHub profile={user.compositeProfile} />}
                    </main>
                </div>
            )}
        </>
    );
};

export default CoFounderHub;