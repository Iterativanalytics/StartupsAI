import React, { useState } from 'react';
import { ApplicationForm, AISuggestion, ToastType } from '@/types-hub';
import { MOCK_BUSINESS_PLAN } from '../constants';
import { ArrowLeft, Sparkles, Loader2, Lightbulb, Clipboard } from 'lucide-react';

interface ApplicationFillerPageProps {
  application: ApplicationForm;
  onBack: () => void;
  addToast: (message: string, type: ToastType) => void;
}

const ApplicationFillerPage: React.FC<ApplicationFillerPageProps> = ({ application, onBack, addToast }) => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [completeness, setCompleteness] = useState(0);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  const handleResponseChange = (fieldId: string, value: string) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to clipboard!', 'success');
  }

  const handleFillWithAI = () => {
    setIsLoading(true);
    addToast('Filling application with AI...', 'info');
    
    // Simulate AI processing
    setTimeout(() => {
      const newResponses: Record<string, string> = {};
      const newSuggestions: AISuggestion[] = [];
      
      application.sections.forEach(section => {
        section.fields.forEach(field => {
          let content = '';
          if (field.label.toLowerCase().includes('company') && field.label.toLowerCase().includes('desc')) {
            content = MOCK_BUSINESS_PLAN.description;
          } else if (field.label.toLowerCase().includes('problem')) {
            content = MOCK_BUSINESS_PLAN.problem;
          } else if (field.label.toLowerCase().includes('solution')) {
            content = MOCK_BUSINESS_PLAN.solution;
          } else if (field.label.toLowerCase().includes('team') || field.label.toLowerCase().includes('founder')) {
            content = MOCK_BUSINESS_PLAN.team;
          } else if (field.label.toLowerCase().includes('traction') || field.label.toLowerCase().includes('progress')) {
            content = MOCK_BUSINESS_PLAN.traction;
            newSuggestions.push({ fieldId: field.id, suggestion: 'Consider adding specific metrics to demonstrate traction.' });
          } else if (field.label.toLowerCase().includes('customer') || field.label.toLowerCase().includes('market')) {
             content = MOCK_BUSINESS_PLAN.targetMarket;
          } else if (field.label.toLowerCase().includes('name')) {
             content = MOCK_BUSINESS_PLAN.companyName;
          } else {
             content = `AI-generated response for "${field.label}" based on business plan.`;
          }
          
          if(field.maxLength && content.length > field.maxLength){
            content = content.substring(0, field.maxLength - 3) + '...';
          }
          
          newResponses[field.id] = content;
        });
      });
      
      setResponses(newResponses);
      setMatchScore(87);
      setCompleteness(95);
      setSuggestions(newSuggestions);
      setIsLoading(false);
      addToast('Application filled successfully!', 'success');
    }, 2000);
  };
  
  return (
    <div className="animate-fade-in-up">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-semibold mb-6">
        <ArrowLeft className="w-5 h-5" />
        Back to Applications
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">{application.name}</h1>
            {application.sections.map(section => (
                <div key={section.id}>
                    <h2 className="text-2xl font-semibold text-slate-700 border-b pb-2 mb-4">{section.title}</h2>
                    <div className="space-y-6">
                        {section.fields.map(field => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className="block text-sm font-medium text-slate-700 mb-1">{field.label} {field.required && <span className="text-red-500">*</span>}</label>
                                <div className="relative">
                                    <textarea
                                        id={field.id}
                                        value={responses[field.id] || ''}
                                        onChange={(e) => handleResponseChange(field.id, e.target.value)}
                                        rows={field.type === 'textarea' ? 5 : 1}
                                        maxLength={field.maxLength}
                                        placeholder={field.placeholder || `Your answer for ${field.label}...`}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 pr-10"
                                    />
                                     <button 
                                        onClick={() => copyToClipboard(responses[field.id] || '')}
                                        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-purple-600 rounded-md hover:bg-slate-100 transition-colors"
                                        aria-label="Copy to clipboard"
                                    >
                                        <Clipboard className="w-4 h-4" />
                                    </button>
                                </div>
                                {field.maxLength && <p className="text-xs text-slate-500 text-right mt-1">{`${(responses[field.id] || '').length}/${field.maxLength}`}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        
        <div className="sticky top-28 h-fit space-y-6">
           <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">AI Control Panel</h3>
                <button 
                  onClick={handleFillWithAI}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Fill with AI
                    </>
                  )}
                </button>
           </div>
           
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
                 <div>
                    <h4 className="text-sm font-bold text-slate-600 mb-1">Match Score</h4>
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 relative">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" strokeWidth="3"></path>
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={matchScore && matchScore > 75 ? "#10b981" : "#f59e0b"} strokeWidth="3" strokeDasharray={`${matchScore || 0}, 100`} strokeLinecap="round"></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-700">{matchScore ? `${matchScore}%` : 'N/A'}</div>
                        </div>
                        <p className="text-xs text-slate-500 flex-1">Realistic assessment of success probability based on your business plan.</p>
                    </div>
                </div>
                 <div>
                    <h4 className="text-sm font-bold text-slate-600 mb-1">Completeness</h4>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{width: `${completeness}%`}}></div>
                    </div>
                     <p className="text-xs text-slate-500 text-right mt-1">{completeness}%</p>
                </div>
           </div>

           {suggestions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-500" /> AI Suggestions</h3>
                <div className="space-y-3">
                    {suggestions.map((s, i) => (
                        <div key={i} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                            <p className="text-sm text-yellow-800">{s.suggestion}</p>
                            <button onClick={() => {
                                const field = application.sections.flatMap(sec => sec.fields).find(f => f.id === s.fieldId);
                                addToast(`Suggestion for field: "${field?.label}"`, 'info')
                            }} className="text-xs font-semibold text-yellow-900 mt-2 hover:underline">View Field</button>
                        </div>
                    ))}
                </div>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationFillerPage;