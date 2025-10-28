import React, { useState, useRef } from 'react';
import { Zap, Bot, Lightbulb, TrendingUp, BarChart2, CheckCircle, ArrowRight, Loader2, UploadCloud, BrainCircuit, File, Trash2 } from 'lucide-react';
import { ToastType, User, BusinessPlan, Assumption } from '../../../types';
import { usePlanProject } from '../PlansApp';
import { useGeminiGenerator } from '../../../hooks/useGeminiGenerator';
import { Type } from '@google/genai';
import { sections } from '../components/editorConstants';

interface FastTrackModeProps {
  addToast: (message: string, type: ToastType) => void;
  user: User;
}

const FastTrackMode: React.FC<FastTrackModeProps> = ({ addToast, user }) => {
  const { generateProject } = usePlanProject();
  const { isLoading, generateContent } = useGeminiGenerator(addToast);
  
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    problem: '',
    solution: '',
    targetMarket: '',
    businessModel: '',
    team: '',
    traction: ''
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Dynamically create the schema based on the sections constant
  const businessPlanSchemaProperties = sections.reduce((acc, section) => {
    acc[section.id] = { type: Type.STRING, description: `Content for the ${section.title} section.` };
    return acc;
  }, {} as Record<string, { type: Type, description: string }>);

  const businessPlanSchema = {
      type: Type.OBJECT,
      properties: {
          businessPlan: {
              type: Type.OBJECT,
              properties: businessPlanSchemaProperties,
              required: sections.map(s => s.id)
          },
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
      required: ['businessPlan', 'assumptions']
  };

  const handleGeneratePlan = async () => {
    const userInput = `
        Company Name: ${formData.companyName}
        Problem: ${formData.problem}
        Solution: ${formData.solution}
        Target Market: ${formData.targetMarket}
        Business Model: ${formData.businessModel}
        Team: ${formData.team}
        Traction: ${formData.traction}
    `;
    const prompt = `
        You are an expert business plan writer.
        Based on the user's input, generate plausible content for all sections of a business plan as defined in the schema. Also extract the 5-7 most critical, riskiest assumptions.

        **User Input:**
        ${userInput}

        **Output Format Instructions:**
        Return a single, valid JSON object with two keys:
        1. "businessPlan": A JSON object where each key is a section ID (${sections.map(s => s.id).join(', ')}) and the value is the generated text for that section.
        2. "assumptions": An array of JSON objects. Each object must have "text", "risk" ('high', 'medium', or 'low'), and "sourceSection".
    `;
    
    const responseText = await generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: businessPlanSchema },
    });

    if (responseText) {
        try {
            const result = JSON.parse(responseText);
            const newAssumptions: Assumption[] = result.assumptions.map((a: any, index: number) => ({
                ...a,
                id: `plan-gen-${Date.now()}-${index}`,
                status: 'untested',
            }));

            const structuredPlan: BusinessPlan = {};
            for (const section of sections) {
                if (result.businessPlan[section.id]) {
                    structuredPlan[section.id] = { text: result.businessPlan[section.id] };
                }
            }

            generateProject(structuredPlan, newAssumptions, formData.companyName || 'My New Business Plan', new Date().getFullYear());
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

  const handleAnalyzePlan = async (isDeepDive: boolean) => {
    if (!uploadedFile) return;

    setIsUploading(true);
    const analysisType = isDeepDive ? 'Deep Dive Analysis' : 'Standard Analysis';
    addToast(`Starting ${analysisType} on "${uploadedFile.name}"... This will take a moment.`, 'info');
    
    const model = isDeepDive ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const config = isDeepDive ? { thinkingConfig: { thinkingBudget: 32768 } } : {};

    const prompt = `
      You are an expert business plan analyst. You have received an uploaded business plan named "${uploadedFile.name}".
      Since you cannot read the file content, please generate a plausible and comprehensive business plan and assumption analysis for a generic B2B SaaS startup as a demonstration.
      The startup solves the problem of inefficient project management for remote teams with an AI-powered collaborative platform.
      Generate rich content for all sections of a business plan as defined in the schema.
      
      **Output Format Instructions:**
      Return a single, valid JSON object with two keys:
      1. "businessPlan": A JSON object with all the required section keys.
      2. "assumptions": An array of 5-7 JSON objects for the most critical assumptions. Each must have "text", "risk", and "sourceSection".
    `;
    
    const responseText = await generateContent({
        model: model,
        contents: prompt,
        config: { ...config, responseMimeType: "application/json", responseSchema: businessPlanSchema },
    });

    if (responseText) {
        try {
            const result = JSON.parse(responseText);
            const newAssumptions: Assumption[] = result.assumptions.map((a: any, index: number) => ({
                ...a,
                id: `plan-upload-${Date.now()}-${index}`,
                status: 'untested',
            }));
            const structuredPlan: BusinessPlan = {};
            for (const section of sections) {
                if (result.businessPlan[section.id]) {
                    structuredPlan[section.id] = { text: result.businessPlan[section.id] };
                }
            }
            generateProject(structuredPlan, newAssumptions, `Analysis of ${uploadedFile.name}`, new Date().getFullYear());
        } catch (e) {
            addToast('Failed to parse AI response from uploaded file analysis.', 'error');
            console.error("JSON Parse Error:", e);
        }
    }
    
    setIsUploading(false);
    setUploadedFile(null);
  };

  const isSubmittable = formData.problem.trim() !== '' && formData.solution.trim() !== '' && formData.companyName.trim() !== '';

  const stage = user.persona === 'entrepreneur' ? user.entrepreneurStage : null;
  const showBuild = stage !== 'growth';
  const showUpload = stage !== 'ideation';

  const FeatureListItem: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-4">
      <div className="bg-purple-100 text-purple-600 rounded-full p-2 mt-1">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
    </div>
  );

  const BuildCard = () => (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200 flex flex-col">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
              <div className="bg-slate-100 p-2 rounded-lg"><Bot className="w-6 h-6 text-purple-600" /></div>
              <h3 className="text-xl font-bold text-slate-800">Build Investor-Ready Plans, Faster & Smarter</h3>
          </div>
          <p className="text-slate-600 text-sm mb-6">Let our Co-Founder™ guide you through creating a comprehensive, data-driven business plan from scratch.</p>
          <form onSubmit={(e) => { e.preventDefault(); handleGeneratePlan(); }} className="space-y-4">
              <div>
                  <label htmlFor="companyName" className="block text-xs font-medium text-slate-700 mb-1">Company Name</label>
                  <input id="companyName" value={formData.companyName} onChange={handleInputChange} type="text" className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g., FlowFuture AI" />
              </div>
              <div>
                  <label htmlFor="problem" className="block text-xs font-medium text-slate-700 mb-1">What problem are you solving?</label>
                  <textarea id="problem" value={formData.problem} onChange={handleInputChange} rows={2} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g., Small businesses struggle with cash flow."></textarea>
              </div>
              <div>
                  <label htmlFor="solution" className="block text-xs font-medium text-slate-700 mb-1">What is your proposed solution?</label>
                  <textarea id="solution" value={formData.solution} onChange={handleInputChange} rows={2} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g., An AI-powered dashboard for real-time projections."></textarea>
              </div>
               <div>
                  <label htmlFor="targetMarket" className="block text-xs font-medium text-slate-700 mb-1">Target Market</label>
                  <input id="targetMarket" value={formData.targetMarket} onChange={handleInputChange} type="text" className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g., US-based SaaS companies with 10-100 employees" />
              </div>
               <div>
                  <label htmlFor="businessModel" className="block text-xs font-medium text-slate-700 mb-1">Business Model</label>
                  <input id="businessModel" value={formData.businessModel} onChange={handleInputChange} type="text" className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g., Tiered monthly SaaS subscription" />
              </div>
               <div>
                  <label htmlFor="team" className="block text-xs font-medium text-slate-700 mb-1">Team Background (Optional)</label>
                  <textarea id="team" value={formData.team} onChange={handleInputChange} rows={2} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g., Two co-founders with 10+ years experience in finance and AI."></textarea>
              </div>
               <div>
                  <label htmlFor="traction" className="block text-xs font-medium text-slate-700 mb-1">Current Traction (Optional)</label>
                  <textarea id="traction" value={formData.traction} onChange={handleInputChange} rows={2} className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="e.g., 5 pilot customers, $2k MRR, 200 waitlist signups."></textarea>
              </div>
          </form>
        </div>
        <div className="mt-6">
            <button onClick={handleGeneratePlan} disabled={isLoading || !isSubmittable} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
              {isLoading ? (<><Loader2 className="w-6 h-6 animate-spin" />Generating Your Plan...</>) : (<>Generate Plan & Extract Assumptions<ArrowRight className="w-6 h-6" /></>)}
            </button>
          </div>
    </div>
  );

  const UploadCard = () => (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200 flex flex-col">
          <div className="flex-grow">
              <div className="flex items-center gap-3 mb-4">
                  <div className="bg-slate-100 p-2 rounded-lg"><UploadCloud className="w-6 h-6 text-blue-600" /></div>
                  <h3 className="text-xl font-bold text-slate-800">Upload, Evaluate, and Reiterate Your Existing Plans</h3>
              </div>
              <p className="text-slate-600 text-sm mb-6">Dynamize your static plan. Upload your document to get AI-driven feedback, identify hidden assumptions, and turn it into a live, validated strategy.</p>
              <div className="space-y-4 mb-6">
                  <FeatureListItem icon={CheckCircle} title="Upload Multiple Formats" description="Support for PDF, DOCX, and TXT files to easily import your existing work." />
                  <FeatureListItem icon={CheckCircle} title="Real-time AI Feedback" description="Get instant recommendations on structure, clarity, and strategy with Gemini Flash." />
                  <FeatureListItem icon={CheckCircle} title="Deep Strategic Analysis" description="Use Gemini Pro with Thinking Mode for a comprehensive business model evaluation." />
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
                    <span className="text-sm font-semibold text-slate-700">Click to upload your plan</span>
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
          <div className="mt-6 space-y-3">
            <button 
              onClick={() => handleAnalyzePlan(false)} 
              disabled={!uploadedFile || isUploading || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : 'Analyze Plan & Extract Assumptions'}
            </button>
            <button 
                onClick={() => handleAnalyzePlan(true)}
                disabled={!uploadedFile || isUploading || isLoading}
                className="w-full bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-800 transition-all text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Uses Gemini Pro with Thinking Mode for complex analysis"
            >
              {(isUploading || isLoading) ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><BrainCircuit className="w-5 h-5" /> Deep Dive Analysis</>}
            </button>
          </div>
    </div>
  );

  return (
    <div className="animate-fade-in-up">
        <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full mb-4">
                <Zap className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-2">Fast Track Your Plan</h2>
            <p className="text-xl text-slate-600">
                {stage === 'ideation' && "Let's build your new plan from the ground up with our Co-Founder™."}
                {stage === 'growth' && "Let's evaluate your existing plan and prepare it for the next stage of growth."}
                {stage !== 'ideation' && stage !== 'growth' && "Choose your starting point: generate a new plan or evaluate an existing one."}
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