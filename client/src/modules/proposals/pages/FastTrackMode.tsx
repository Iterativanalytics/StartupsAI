import React, { useState, useRef } from 'react';
import { Zap, Bot, Lightbulb, TrendingUp, BarChart2, CheckCircle, ArrowRight, Loader2, UploadCloud, File, Trash2 } from 'lucide-react';
import { ToastType, User, EntrepreneurStage, Assumption } from '@/types-hub';
import { useProposalProject } from '../ProposalsApp';
import { useGeminiGenerator } from '@/hooks-hub/useGeminiGenerator';
import { Type } from '@google/genai';

interface FastTrackModeProps {
  addToast: (message: string, type: ToastType) => void;
  user: User;
}

const getStageInstructionForProposal = (stage?: EntrepreneurStage): string => {
    switch(stage) {
        case 'ideation':
            return 'The user is at the Ideation Stage. Focus on helping them structure a compelling narrative around the client\'s core problem and the proposed solution\'s unique value. The tone should be visionary and problem-oriented.';
        case 'growth':
            return 'The user is at the Growth Stage and likely creating proposals for larger clients. Focus on generating content that emphasizes ROI, scalability, case studies, and a clear implementation plan. The AI should prompt for metrics if possible.';
        case 'pre-seed':
        default:
            return 'The user is at the Pre-Seed/Seed Stage. They are formalizing their offerings. The AI should generate a standard, professional proposal structure that clearly articulates the problem, solution, deliverables, and value proposition.';
    }
}


const FastTrackMode: React.FC<FastTrackModeProps> = ({ addToast, user }) => {
  const { generateProject } = useProposalProject();
  const { isLoading, generateContent } = useGeminiGenerator(addToast);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    problem: '',
    solution: '',
    client: '',
    advantage: '',
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerateProposal = async () => {
    if (isLoading) return;

    const stageInstruction = getStageInstructionForProposal(user.entrepreneurStage);
     const userInput = `
        Client Problem: ${formData.problem}
        Proposed Solution: ${formData.solution}
        Target Client: ${formData.client}
        Unique Advantage: ${formData.advantage}
    `;

    const prompt = `
        You are an expert proposal writer for a B2B consultancy.
        Your task is to generate a professional proposal in Markdown format and extract the 5-7 most critical, riskiest assumptions underlying the proposal's success.

        **Founder Stage Context:** ${stageInstruction}

        **User Input:**
        ${userInput}

        **Output Format Instructions:**
        Return a single, valid JSON object with two keys:
        1. "proposalContent": A string containing the full proposal in Markdown format. Use headings for sections (e.g., "# 1. Executive Summary").
        2. "assumptions": An array of JSON objects. Each object must have "text" (string), "risk" ('high', 'medium', or 'low'), and "sourceSection" (string, e.g., 'Value Proposition', 'Client Needs').
    `;
    
    const responseText = await generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                proposalContent: { type: Type.STRING },
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
                required: ['proposalContent', 'assumptions']
            },
        }
    });

    if (responseText) {
        try {
            const result = JSON.parse(responseText);
            const newAssumptions: Assumption[] = result.assumptions.map((a: any, index: number) => ({
            ...a,
            id: `prop-${Date.now()}-${index}`,
            status: 'untested',
            }));

            generateProject(result.proposalContent, newAssumptions, `Proposal for ${formData.client || 'New Client'}`);
        } catch (e) {
            addToast('Failed to parse AI response.', 'error');
            console.error("JSON Parse Error:", e);
        }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        addToast('File size exceeds 10MB limit.', 'error');
        return;
      }
      setUploadedFile(file);
      addToast(`File "${file.name}" selected. Ready for analysis.`, 'info');
    }
  };

  const handleAnalyzeProposal = () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    addToast(`Analyzing "${uploadedFile.name}"... This will take a moment.`, 'info');

    // Simulate analysis, then call the generator with mock data for demo purposes
    // In a real app, you would pass the file content to the Gemini prompt.
    setTimeout(() => {
        handleGenerateProposal(); // This will use the mock text in the inputs
        setIsUploading(false);
        setUploadedFile(null);
    }, 3000);
  };

  const isSubmittable = formData.problem.trim() !== '' && formData.solution.trim() !== '';

  const stage = user.persona === 'entrepreneur' ? user.entrepreneurStage : null;
  const showBuild = stage !== 'growth';
  const showUpload = stage !== 'ideation';

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
        <div className="flex-grow">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-100 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Build Winning Proposals, Faster & Smarter</h3>
        </div>
        <p className="text-slate-600 text-sm mb-6">Let our Co-Founder™ guide you in drafting a persuasive, client-centric proposal from your core ideas.</p>
        
        <div className="space-y-4 mb-6">
            <FeatureListItem icon={Lightbulb} title="Intuitive Guided Creation" description="AI prompts help you articulate the client's problem and your value proposition with clarity." />
            <FeatureListItem icon={TrendingUp} title="Real-time AI-driven Content" description="Generate persuasive executive summaries, solution outlines, and win themes in seconds." />
            <FeatureListItem icon={BarChart2} title="Instant Value Modeling" description="Translate your solution into tangible client outcomes and ROI projections." />
        </div>

        <div className="space-y-4">
            <div>
                <label htmlFor="problem" className="block text-xs font-medium text-slate-700 mb-1">What problem is the client facing?</label>
                <textarea id="problem" value={formData.problem} onChange={handleInputChange} rows={2} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g., Manual procurement process causes delays."></textarea>
            </div>
            <div>
                <label htmlFor="solution" className="block text-xs font-medium text-slate-700 mb-1">What is your proposed solution?</label>
                <textarea id="solution" value={formData.solution} onChange={handleInputChange} rows={2} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g., A cloud platform to automate purchase orders."></textarea>
            </div>
        </div>
        </div>
        <div className="mt-6">
            <button 
            onClick={handleGenerateProposal}
            disabled={isLoading || !isSubmittable}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
            {isLoading ? (
                <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating Proposal Plan...
                </>
            ) : (
                <>
                Generate Plan & Extract Assumptions
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
                <h3 className="text-xl font-bold text-slate-800">Upload, Evaluate, and Reiterate Your Existing Proposal</h3>
            </div>
            <p className="text-slate-600 text-sm mb-6">Transform your existing proposal or RFP response. Upload it to get AI-driven feedback, identify unstated client needs, and align your solution for a higher win-rate.</p>
            
            <div className="space-y-4 mb-6">
                <FeatureListItem icon={CheckCircle} title="Upload RFPs & Proposals" description="Support for PDF, DOCX, and TXT files to easily import your work." />
                <FeatureListItem icon={CheckCircle} title="Automated RFP Analysis" description="AI identifies key requirements, stakeholders, and evaluation criteria." />
                <FeatureListItem icon={CheckCircle} title="Strength & Weakness Identification" description="Get an objective analysis of your proposal strategy and win themes." />
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".pdf,.docx,.txt"
            />
             {!uploadedFile ? (
                 <div onClick={() => fileInputRef.current?.click()} className="mt-1 flex flex-col items-center justify-center px-6 py-10 border-2 border-slate-300 border-dashed rounded-md cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <UploadCloud className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                    <span className="text-sm font-semibold text-slate-700">Click to upload your document</span>
                    <span className="text-xs text-slate-500">PDF, DOCX, TXT up to 10MB</span>
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
            onClick={handleAnalyzeProposal}
            disabled={!uploadedFile || isUploading || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading || isLoading ? <><Loader2 className="w-5 h-5 animate-spin"/> Analyzing...</> : 'Analyze & Extract Assumptions'}
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
        <h2 className="text-4xl font-bold text-slate-800 mb-2">Fast Track Your Proposal</h2>
        <p className="text-xl text-slate-600">
           {stage === 'ideation' && "Let's outline a winning proposal for your new idea."}
           {stage === 'growth' && "Let's refine an existing proposal to close bigger deals."}
           {stage !== 'ideation' && stage !== 'growth' && "Draft a new proposal or evaluate an existing one to increase your win-rate."}
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
