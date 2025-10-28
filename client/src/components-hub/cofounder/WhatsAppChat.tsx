import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { ToastType, ChatMessage, User, CoFounderPersonality, ConversationMode } from '@/types-hub';
import { useGeminiGenerator } from '@/hooks-hub/useGeminiGenerator';
// FIX: Changed GenerateContentRequest to GenerateContentParameters as it is deprecated.
import { GenerateContentParameters } from '@google/genai';
import { agentConfigs, getSystemPrompt } from './CoFounderHub';

interface WhatsAppChatProps {
    isOpen: boolean;
    onClose: () => void;
    addToast: (message: string, type: ToastType) => void;
    user: User;
    personality: CoFounderPersonality;
    vestedInterest: number;
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ 
    isOpen, onClose, addToast, user, personality, vestedInterest, messages, setMessages 
}) => {
    const agentConfig = agentConfigs[user.persona || 'entrepreneur'];
    const AgentIcon = agentConfig.icon;
    
    const [input, setInput] = useState('');
    const { isLoading, generateContent } = useGeminiGenerator(addToast);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [activeMode] = useState<ConversationMode>('strategic'); // Default mode for WhatsApp

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if(isOpen) {
            scrollToBottom();
        }
    }, [isOpen, messages]);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-slate-200 rounded-2xl shadow-2xl w-full max-w-sm h-[80vh] flex flex-col animate-pop-in overflow-hidden border-4 border-slate-800">
                {/* Phone Header */}
                <header className="bg-slate-800 text-white p-3 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <button onClick={onClose} className="text-white"><ArrowLeft className="w-5 h-5"/></button>
                        <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                            <AgentIcon className="w-5 h-5 text-purple-700" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{agentConfig.name}</p>
                            <p className="text-xs text-slate-300">online</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white"><X className="w-5 h-5" /></button>
                </header>

                {/* Chat Background */}
                <div className="flex-1 overflow-y-auto p-4 bg-green-50/50" style={{ backgroundImage: 'url(https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg)'}}>
                    <div className="space-y-2">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg px-3 py-1.5 text-sm shadow ${msg.role === 'user' ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                    <div className="text-right text-xs text-slate-400 mt-1 flex justify-end items-center gap-1">
                                        <span>10:30 AM</span>
                                        {msg.role === 'user' && <CheckCheck className="w-4 h-4 text-blue-500" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-lg px-3 py-1.5 text-sm shadow bg-white">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-0"></div>
                                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-300"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Footer */}
                <footer className="p-2 bg-slate-100">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message"
                            className="flex-1 pl-4 pr-4 py-2 border-none bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button onClick={handleSend} disabled={isLoading} className="bg-green-500 text-white rounded-full p-2.5 hover:bg-green-600 disabled:opacity-50 transition-colors">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default WhatsAppChat;