import React, { useState, useRef, useEffect } from 'react';
import { Eye, ChevronRight, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { sections } from './editorConstants';
import { Project, BusinessPlan, User, CoFounderPersonality, ToastType } from '../../../types';
import { useGeminiGenerator } from '../../../hooks/useGeminiGenerator';
import { getSystemPrompt } from '../../../components/cofounder/CoFounderHub';

interface PlanEditorProps {
    project: Project<BusinessPlan>;
    currentSection: typeof sections[0];
    onSectionChange: (section: typeof sections[0]) => void;
    onContentUpdate: (sectionId: string, newContent: { text: string }) => void;
    onViewClick: () => void;
    user: User;
    agentPersonality: CoFounderPersonality;
    vestedInterest: number;
    addToast: (message: string, type: ToastType) => void;
}

const SaveStatus: React.FC<{ isSaved: boolean; lastSaved: Date | null }> = ({ isSaved, lastSaved }) => (
    <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className={`w-2 h-2 rounded-full ${isSaved ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <span>{isSaved ? 'All changes saved' : 'Saving...'}</span>
        {lastSaved && <span className="text-gray-400">• Last saved {lastSaved.toLocaleTimeString()}</span>}
    </div>
);

const SectionNavigation: React.FC<{
    currentSection: any;
    onSectionChange: (section: any) => void;
    content: BusinessPlan;
}> = ({ currentSection, onSectionChange, content }) => {
    const activeItemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeItemRef.current) {
            activeItemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [currentSection]);
    
    const getCompletionStatus = (sectionId: string) => {
        const sectionContent = content[sectionId];
        if (!sectionContent || !sectionContent.text) return 0;
        return Math.min((sectionContent.text.length / 500) * 100, 100);
    };

    const overallCompletion = Math.round(
        sections.reduce((acc, section) => acc + getCompletionStatus(section.id), 0) / sections.length
    );

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">IterativPlan Sections</h3>
                <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium text-blue-600">{overallCompletion}%</span> Complete
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${overallCompletion}%` }}
                    />
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto p-2">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const completion = getCompletionStatus(section.id);
                    const isActive = currentSection.id === section.id;
                    const hasContent = content[section.id] && content[section.id]?.text?.trim().length > 0;

                    return (
                        <div
                            key={section.id}
                            ref={isActive ? activeItemRef : null}
                            onClick={() => onSectionChange(section)}
                            className={`p-3 mb-2 rounded-lg cursor-pointer transition-all ${isActive
                                ? 'bg-blue-50 border-2 border-blue-500'
                                : 'border-2 border-transparent hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2 flex-1">
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                                    <span className={`font-medium text-sm ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
                                        {section.title}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasContent && <Check size={16} className="text-green-500" />}
                                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-2 ml-6">{section.description}</p>
                            <div className="ml-6">
                                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-300"
                                        style={{ width: `${completion}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </nav>
        </div>
    );
};

const RichTextEditor: React.FC<{
    content: string;
    onChange: (value: string) => void;
    placeholder: string;
}> = ({ content, onChange, placeholder }) => {
    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden h-full flex flex-col bg-white">
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-1 flex-wrap">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100 font-bold">B</button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100 italic">I</button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100 underline">U</button>
            </div>
            <textarea
                value={content}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full flex-1 p-6 text-base leading-relaxed focus:outline-none resize-none"
            />
        </div>
    );
};

const ContentEditor: React.FC<{
    section: any;
    content: { text?: string };
    onContentUpdate: (newContent: { text: string }) => void;
}> = ({ section, content, onContentUpdate }) => {
    
    const handleTextChange = (newText: string) => {
        onContentUpdate({
            text: newText,
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6 pb-6 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{section.title}</h2>
                <p className="text-base text-slate-500 mt-2">{section.description}</p>
            </div>

            {section.subsections && section.subsections.length > 0 && (
                <div className="mb-6 bg-slate-100 border border-slate-200 rounded-xl p-5">
                    <h3 className="text-base font-semibold text-slate-700 mb-3">Key topics in this section:</h3>
                    <div className="flex flex-wrap gap-2">
                        {section.subsections.map((subsection: any) => (
                            <span key={subsection.id} className="text-sm bg-white px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 font-medium">
                                {subsection.title}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto h-full">
                     <RichTextEditor
                        content={content.text || ''}
                        onChange={handleTextChange}
                        placeholder={section.placeholder}
                    />
                </div>
            </div>
        </div>
    );
};

const AIAssistant: React.FC<{
    currentSection: any;
    user: User;
    agentPersonality: CoFounderPersonality;
    vestedInterest: number;
    addToast: (message: string, type: ToastType) => void;
}> = ({ currentSection, user, agentPersonality, vestedInterest, addToast }) => {
    const { isLoading, generateContent } = useGeminiGenerator(addToast);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleGenerateSuggestions = async () => {
        setSuggestions([]);
        const systemPrompt = getSystemPrompt(
            `You are Co-Founder™, a strategic business partner.`, 
            'strategic', 
            agentPersonality, 
            user, 
            vestedInterest
        );

        const prompt = `
            ${systemPrompt}

            You are currently assisting the founder in writing their business plan. 
            They are working on the **"${currentSection.title}"** section.
            
            Your task is to provide 3-5 concise, actionable suggestions, writing prompts, or key questions they should consider for this specific section. Frame your suggestions to help them think critically and write compelling content.

            **Output Format:**
            Provide a simple list of suggestions.
        `;

        const responseText = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        if (responseText) {
            const generatedSuggestions = responseText
                .split('\n')
                .map(s => s.replace(/^[*-]\s*/, '').trim())
                .filter(s => s.length > 0);
            setSuggestions(generatedSuggestions);
        }
    };
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        addToast('Suggestion copied to clipboard!', 'success');
    }

    return (
         <div className="w-80 border-l border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Co-Founder™ Assistant</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-gray-700 mb-4">
                    Get help writing your '{currentSection.title}' section.
                </p>
                <button 
                    onClick={handleGenerateSuggestions}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                   {isLoading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><Sparkles size={16} /> Generate Suggestions</>}
                </button>
            </div>
            
            {suggestions.length > 0 && (
                 <div className="mt-6 space-y-3">
                    <h4 className="text-base font-semibold text-gray-800">Suggestions:</h4>
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="bg-slate-100 p-3 rounded-md relative group">
                            <p className="text-sm text-slate-700">{suggestion}</p>
                            <button onClick={() => copyToClipboard(suggestion)} className="absolute top-2 right-2 p-1 bg-white/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <Copy size={14} className="text-slate-600"/>
                            </button>
                        </div>
                    ))}
                 </div>
            )}
        </div>
    );
};


const PlanEditor: React.FC<PlanEditorProps> = ({ project, currentSection, onSectionChange, onContentUpdate, onViewClick, user, agentPersonality, vestedInterest, addToast }) => {
    const [isSaved, setIsSaved] = useState(true);
    const [lastSaved, setLastSaved] = useState<Date | null>(new Date());
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleContentUpdateForSection = (newSectionContent: { text?: string }) => {
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }
        setIsSaved(false);

        onContentUpdate(currentSection.id, { text: newSectionContent.text || '' });

        saveTimerRef.current = setTimeout(() => {
            setIsSaved(true);
            setLastSaved(new Date());
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[80vh] overflow-hidden bg-white rounded-xl shadow-lg border">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">IterativPlan Editor</h1>
                        <p className="text-sm text-gray-600 mt-1">{project.name} • {project.year}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <SaveStatus isSaved={isSaved} lastSaved={lastSaved} />
                         <button
                            onClick={onViewClick}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            <Eye size={18} />
                            View Plan
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-80 border-r border-gray-200 overflow-y-auto">
                    <SectionNavigation
                        currentSection={currentSection}
                        onSectionChange={onSectionChange}
                        content={project.content}
                    />
                </div>
                
                <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
                    <ContentEditor
                        section={currentSection}
                        content={project.content[currentSection.id] || {}}
                        onContentUpdate={handleContentUpdateForSection}
                    />
                </div>
                
                <AIAssistant 
                    currentSection={currentSection}
                    user={user}
                    agentPersonality={agentPersonality}
                    vestedInterest={vestedInterest}
                    addToast={addToast}
                />
            </div>
        </div>
    );
};

export default PlanEditor;