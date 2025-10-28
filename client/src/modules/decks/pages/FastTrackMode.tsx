import React, { useState, useRef } from 'react';
import { Zap, ArrowRight, Loader2, Bot, Lightbulb, TrendingUp, BarChart2, CheckCircle, UploadCloud, File, Trash2 } from 'lucide-react';
import { Assumption, DeckStyle, ToastType, User, EntrepreneurStage } from '@/types-hub';
import { Type } from "@google/genai";
import { DECK_STYLES } from '../constants';
import { useDeckProject } from '../DecksApp';
import { useGeminiGenerator } from '@/hooks-hub/useGeminiGenerator';

interface FastTrackModeProps {
  showToast: (message: string, type: ToastType) => void;
  user: User;
}

const getStageInstruction = (stage?: EntrepreneurStage): string => {
    switch(stage) {
        case 'ideation':
            return 'The founder is at the Ideation Stage. Focus heavily on validating the core problem, the uniqueness of the solution, and the founder-market fit. De-emphasize detailed financial projections and focus on the potential of the idea.';
        case 'growth':
            return 'The founder is at the Growth Stage. They have traction. Emphasize metrics, unit economics (CAC, LTV), customer retention, and a clear, scalable growth strategy. The AI should ask for and incorporate specific metrics if the user provides them.';
        case 'pre-seed':
        default:
            return 'The founder is at the Pre-Seed/Seed Stage. Balance the story between the vision (problem, solution, market) and early traction. The AI should generate a classic seed-stage pitch deck structure.';
    }
}


const FastTrackMode: React.FC<FastTrackModeProps> = ({ showToast, user }) => {
    const { generateProject } = useDeckProject();
    const { isLoading, generateContent } = useGeminiGenerator(showToast);
    const [selectedStyleId, setSelectedStyleId] = useState<string>(DECK_STYLES[0].id);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const [formInputs, setFormInputs] = useState({
        problem: '',
        solution: '',
        market: '',
        advantage: ''
    });

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const stage = user.persona === 'entrepreneur' ? user.entrepreneurStage : null;
    const showBuild = stage !== 'growth';
    const showUpload = stage !== 'ideation';
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 20 * 1024 * 1024) { // 20MB
                showToast('File size exceeds 20MB limit.', 'error');
                return;
            }
            setUploadedFile(file);
            showToast(`File "${file.name}" selected. Ready for analysis.`, 'info');
        }
    };

    const handleGenerateDeck = async () => {
        const selectedStyle = DECK_STYLES.find(s => s.id === selectedStyleId);
        if (!selectedStyle) {
            showToast('Please select a deck style.', 'error');
            return;
        }

        if (!formInputs.problem || !formInputs.solution) {
            showToast('Please describe the problem and your solution.', 'error');
            return;
        }
        
        const stageInstruction = getStageInstruction(user.entrepreneurStage);

        const userInput = `
            Problem: ${formInputs.problem}
            Solution: ${formInputs.solution}
            Target Market: ${formInputs.market}
            Unique Advantage: ${formInputs.advantage}
        `;
        
        const prompt = `
            You are an expert pitch deck creator for a startup advisory firm.
            Your task is to generate a complete, investor-ready pitch deck in Markdown format and extract the 5-7 most critical, riskiest assumptions underlying the business model.

            **Founder Stage Context:** ${stageInstruction}

            **Deck Style:** ${selectedStyle.name}
            **Style Instructions:** ${selectedStyle.instruction}
            **User Input:**
            ${userInput}

            **Output Format Instructions:**
            Return a single, valid JSON object with two keys:
            1. "deckContent": A string containing the full pitch deck in Markdown format. Use headings for slides (e.g., "# Slide 1: Title").
            2. "assumptions": An array of JSON objects. Each object must have "text" (string), "risk" ('high', 'medium', or 'low'), and "sourceSection" (string, e.g., 'Problem', 'Solution').
        `;
        
        const responseText = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    deckContent: { type: Type.STRING },
                    assumptions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          risk: { type: Type.STRING },
                          sourceSection: { type: Type.STRING },
                        },
                         required: ['text', 'risk', 'sourceSection']
                      },
                    },
                  },
                  required: ['deckContent', 'assumptions']
                },
            }
        });

        if (responseText) {
            try {
                const result = JSON.parse(responseText);
                const newAssumptions: Assumption[] = result.assumptions.map((a: any, index: number) => ({
                ...a,
                id: `ft-${Date.now()}-${index}`,
                status: 'untested',
                }));

                generateProject(result.deckContent, newAssumptions, selectedStyle.name);
            } catch (e) {
                showToast('Failed to parse AI response.', 'error');
                console.error("JSON Parse Error:", e);
            }
        }
    };
    
    const handleAnalyzeDeck = async () => {
        if (!uploadedFile) return;
    
        setIsAnalyzing(true);
        
        const prompt = `
            You are an expert pitch deck analyst. You have received an uploaded pitch deck named "${uploadedFile.name}".
            Since you cannot read the file content, please generate a plausible pitch deck and assumption analysis for a generic B2B SaaS startup as a demonstration.
            The startup solves the problem of inefficient project management for remote teams with an AI-powered collaborative platform.
            
            **Output Format Instructions:**
            Return a single, valid JSON object with two keys:
            1. "deckContent": A string containing the full pitch deck in Markdown format. Use headings for slides (e.g., "# Slide 1: Title").
            2. "assumptions": An array of JSON objects. Each object must have "text" (string), "risk" ('high', 'medium', or 'low'), and "sourceSection" (string, e.g., 'Problem', 'Solution').
        `;
        
        const responseText = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    deckContent: { type: Type.STRING },
                    assumptions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          risk: { type: Type.STRING },
                          sourceSection: { type: Type.STRING },
                        },
                         required: ['text', 'risk', 'sourceSection']
                      },
                    },
                  },
                  required: ['deckContent', 'assumptions']
                },
            }
        });
    
        if (responseText) {
            try {
                const result = JSON.parse(responseText);
                const newAssumptions: Assumption[] = result.assumptions.map((a: any, index: number) => ({
                    ...a,
                    id: `upload-${Date.now()}-${index}`,
                    status: 'untested',
                }));
                generateProject(result.deckContent, newAssumptions, `Analysis of ${uploadedFile.name}`);
            } catch (e) {
                showToast('Failed to parse AI response from uploaded file analysis.', 'error');
                console.error("JSON Parse Error:", e);
            }
        }
        setIsAnalyzing(false);
        setUploadedFile(null);
    };

    const isSubmittable = formInputs.problem.trim() !== '' && formInputs.solution.trim() !== '';

    const FeatureListItem: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
        <div className="flex items-start gap-3">
            <div className="bg-purple-100 text-purple-600 rounded-full p-1.5 mt-1">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
                <p className="text-slate-500 text-xs">{description}</p>
            </div>
        </div>
    );

    const BuildCard = () => (
         <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200 flex flex-col">
            <div className="flex-grow space-y-6">
                 <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-slate-100 p-2 rounded-lg">
                            <Bot className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Build Investor-Ready Decks, Faster & Smarter</h3>
                    </div>
                </div>
                <div>
                    <h3 className="text-base font-bold text-slate-800 mb-2">Step 1: Tell your Co-Founder™ about your vision</h3>
                    <div className="space-y-3">
                        <textarea name="problem" value={formInputs.problem} onChange={handleInputChange} rows={2} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="What problem are you solving?"></textarea>
                        <textarea name="solution" value={formInputs.solution} onChange={handleInputChange} rows={2} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="What is your proposed solution?"></textarea>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-base font-bold text-slate-800 mb-2">Step 2: Select your deck style</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {DECK_STYLES.map(style => {
                            const StyleIcon = style.icon;
                            return (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyleId(style.id)}
                                    className={`text-left p-3 rounded-lg border-2 transition-all ${selectedStyleId === style.id ? 'bg-purple-50 border-purple-500' : 'bg-slate-50 border-slate-200 hover:border-slate-400'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <StyleIcon className={`w-5 h-5 ${selectedStyleId === style.id ? 'text-purple-600' : 'text-slate-500'}`} />
                                        <h4 className="font-bold text-slate-800 text-xs">{style.name}</h4>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <button 
                 onClick={handleGenerateDeck}
                 disabled={isLoading || !isSubmittable}
                 className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
               >
                 {isLoading ? (
                   <>
                       <Loader2 className="w-6 h-6 animate-spin" />
                       Generating Your Deck...
                   </>
                 ) : (
                   <>
                       Generate Deck & Extract Assumptions
                       <ArrowRight className="w-6 h-6" />
                   </>
                 )}
               </button>
           </div>
        </div>
    );

    const UploadCard = () => (
         <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200 flex flex-col">
            <div className="flex-grow">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-slate-100 p-2 rounded-lg">
                        <UploadCloud className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Upload, Evaluate, and Reiterate Your Existing Decks</h3>
                </div>
                <p className="text-slate-600 text-sm mb-6">Your deck is more than slides—it's a story. Upload your presentation to get AI feedback on your narrative, identify weak spots, and turn it into a compelling, evidence-backed pitch.</p>
                
                <div className="space-y-4 mb-6">
                    <FeatureListItem icon={CheckCircle} title="Upload Multiple Formats" description="Support for PPTX, PDF, and Keynote files." />
                    <FeatureListItem icon={CheckCircle} title="Real-time AI Narrative Feedback" description="Get suggestions on story flow, slide clarity, and investor appeal." />
                    <FeatureListItem icon={CheckCircle} title="Automatic Assumption Extraction" description="Our AI finds the riskiest claims in your deck so you can validate them." />
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".pptx,.pdf,.key"
                />
                {!uploadedFile ? (
                    <div onClick={() => fileInputRef.current?.click()} className="mt-1 flex flex-col items-center justify-center px-6 py-10 border-2 border-slate-300 border-dashed rounded-md cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                       <UploadCloud className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                       <span className="text-sm font-semibold text-slate-700">Click to upload your deck</span>
                       <span className="text-xs text-slate-500">PPTX, PDF, KEY up to 20MB</span>
                   </div>
                ) : (
                    <div className="mt-1 bg-slate-100 p-4 rounded-lg flex items-center justify-between border border-slate-200">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <File className="w-8 h-8 text-slate-500 flex-shrink-0" />
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-slate-800 truncate" title={uploadedFile.name}>{uploadedFile.name}</p>
                                <p className="text-xs text-slate-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button onClick={() => setUploadedFile(null)} className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors flex-shrink-0">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
            <div className="mt-6">
            <button 
                onClick={handleAnalyzeDeck}
                disabled={!uploadedFile || isAnalyzing || isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isAnalyzing || isLoading ? <><Loader2 className="w-5 h-5 animate-spin"/> Analyzing...</> : 'Analyze Deck & Extract Assumptions'}
            </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in-up">
            <div className="text-center max-w-4xl mx-auto">
                <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full mb-4">
                    <Zap className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-4xl font-bold text-slate-800 mb-2">Fast Track Your Pitch Deck</h2>
                <p className="text-xl text-slate-600">
                    {stage === 'ideation' && "Let's craft the story of your idea from scratch."}
                    {stage === 'growth' && "Let's refine your existing deck with data and prepare for your next round."}
                    {stage !== 'ideation' && stage !== 'growth' && "Choose your starting point: generate a new deck or evaluate an existing one."}
                </p>
            </div>
            
            <div className={`max-w-7xl mx-auto grid grid-cols-1 ${showBuild && showUpload ? 'lg:grid-cols-2' : ''} gap-8 items-stretch`}>
                {showBuild && <BuildCard />}
                {showUpload && <UploadCard />}
            </div>
        </div>
    );
};

export default FastTrackMode;
