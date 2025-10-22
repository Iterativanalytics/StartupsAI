import React, { useState, useCallback } from 'react';
import { FileText, Zap, Link, UploadCloud } from 'lucide-react';
import { ToastType } from '../../../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FastTrackModeProps {
  onGeneratePlan: () => void;
  addToast: (message: string, type: ToastType) => void;
}

type InputMethod = 'scratch' | 'url' | 'document';

const FastTrackMode: React.FC<FastTrackModeProps> = ({ onGeneratePlan, addToast }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputMethod, setInputMethod] = useState<InputMethod>('scratch');
  const [formData, setFormData] = useState({
    problem: '',
    solution: '',
    market: '',
    advantage: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleComingSoon = () => {
    addToast('This feature is coming soon!', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMethod !== 'scratch') {
        handleComingSoon();
        return;
    }
    setIsLoading(true);
    setTimeout(() => {
      onGeneratePlan();
    }, 2000);
  };

  const tabs = [
    { id: 'scratch' as InputMethod, label: 'From Scratch', icon: FileText },
    { id: 'url' as InputMethod, label: 'From Web URL', icon: Link },
    { id: 'document' as InputMethod, label: 'From Document', icon: UploadCloud },
  ];

  const isSubmittable = inputMethod === 'scratch' && formData.problem.trim() !== '' && formData.solution.trim() !== '';

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full mb-4">
            <Zap className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-4xl font-bold text-slate-800 mb-2">Fast Track Mode</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Generate a complete, professional business plan in minutes. Answer a few questions about your vision, and let our AI build the first draft.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Step 1: Provide Source Material</h3>

        <div className="flex justify-center mb-6 border-b border-slate-200">
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            const isActive = inputMethod === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setInputMethod(tab.id)}
                className={`flex items-center gap-2 py-3 px-6 border-b-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 min-h-[350px]">
          {inputMethod === 'scratch' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <Label htmlFor="problem">What problem are you solving?</Label>
                      <Textarea id="problem" value={formData.problem} onChange={handleInputChange} rows={3} className="mt-1" placeholder="e.g., Small businesses struggle with managing their cash flow accurately." />
                  </div>
                  <div>
                      <Label htmlFor="solution">What is your proposed solution?</Label>
                      <Textarea id="solution" value={formData.solution} onChange={handleInputChange} rows={3} className="mt-1" placeholder="e.g., An AI-powered dashboard that provides real-time cash flow projections." />
                  </div>
              </div>
              <div>
                  <Label htmlFor="market">Who experiences this problem? (Your Target Market)</Label>
                  <Input type="text" id="market" value={formData.market} onChange={handleInputChange} className="mt-1" placeholder="e.g., US-based small businesses with 5-50 employees" />
              </div>
              <div>
                  <Label htmlFor="advantage">What is your unique competitive advantage?</Label>
                  <Input type="text" id="advantage" value={formData.advantage} onChange={handleInputChange} className="mt-1" placeholder="e.g., Our predictive AI is 15% more accurate than competitors." />
              </div>
            </>
          )}

          {inputMethod === 'url' && (
            <div>
              <Label htmlFor="url">Enter a URL to analyze</Label>
              <Input type="url" id="url" disabled className="mt-1 bg-slate-50 cursor-not-allowed" placeholder="https://example.com/about" />
              <p className="text-xs text-slate-500 mt-2">Feature coming soon. We'll analyze the content of the page to generate your plan.</p>
            </div>
          )}

          {inputMethod === 'document' && (
             <div>
                <Label>Upload a Document</Label>
                <div onClick={handleComingSoon} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer bg-slate-50">
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                        <p className="text-sm text-slate-500">Feature coming soon</p>
                        <p className="text-xs text-slate-500">PDF, DOCX, TXT up to 10MB</p>
                    </div>
                </div>
            </div>
          )}

          <div className="border-t border-slate-200 pt-6">
            <Button
              type="submit"
              disabled={isLoading || !isSubmittable}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 mr-2" />
                  Generate Plan & Extract Assumptions
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FastTrackMode;