import React, { useState } from 'react';
import { Zap, Sparkles, ArrowRight, Loader2, PenLine, Globe, FileText } from 'lucide-react';
import { Assumption, ToastType } from '../../../types';
import { DECK_STYLES } from '../constants';

interface FastTrackModeProps {
  onGenerateDeck: (deckContent: string, assumptions: Assumption[]) => void;
  showToast: (message: string, type: ToastType) => void;
}

type InputMethod = 'scratch' | 'url' | 'doc';

const FastTrackMode: React.FC<FastTrackModeProps> = ({ onGenerateDeck, showToast }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeInputMethod, setActiveInputMethod] = useState<InputMethod>('scratch');
    const [selectedStyleId, setSelectedStyleId] = useState<string>(DECK_STYLES[0].id);
    
    const [formInputs, setFormInputs] = useState({
        problem: '',
        solution: '',
        market: '',
        advantage: ''
    });
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleComingSoon = () => {
        showToast('This feature is coming soon!', 'info');
    };

    const handleGenerateDeck = async () => {
        if (activeInputMethod !== 'scratch') {
            handleComingSoon();
            return;
        }

        const selectedStyle = DECK_STYLES.find(s => s.id === selectedStyleId);
        if (!selectedStyle) {
            showToast('Please select a deck style.', 'error');
            return;
        }

        if (!formInputs.problem || !formInputs.solution) {
            showToast('Please describe the problem and your solution.', 'error');
            return;
        }

        setIsLoading(true);
        
        try {
            // Simulate AI generation
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const mockDeckContent = `# Slide 1: Problem\n${formInputs.problem}\n\n# Slide 2: Solution\n${formInputs.solution}`;
            const mockAssumptions: Assumption[] = [
                { id: `ft-${Date.now()}-1`, text: 'Customers will pay for this solution', risk: 'high', status: 'untested', sourceSection: 'Solution' },
                { id: `ft-${Date.now()}-2`, text: 'The problem is frequent enough to justify a solution', risk: 'high', status: 'untested', sourceSection: 'Problem' },
                { id: `ft-${Date.now()}-3`, text: 'Target market size is accurately estimated', risk: 'medium', status: 'untested', sourceSection: 'Market' }
            ];

            onGenerateDeck(mockDeckContent, mockAssumptions);
            showToast('Successfully generated your deck and assumptions!', 'success');

        } catch(e) {
            console.error(e);
            showToast(`Deck generation failed: ${(e as Error).message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputMethods = [
        { id: 'scratch' as InputMethod, label: 'From Scratch', icon: PenLine },
        { id: 'url' as InputMethod, label: 'From Web URL', icon: Globe },
        { id: 'doc' as InputMethod, label: 'From Document', icon: FileText },
    ];

    const isSubmittable = activeInputMethod === 'scratch' && formInputs.problem.trim() !== '' && formInputs.solution.trim() !== '';

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-center">
                <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full mb-4">
                    <Zap className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-4xl font-bold text-slate-800 mb-2">Fast Track Your First Draft</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                    Generate an investor-ready deck and a validation plan in minutes.
                </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto space-y-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Step 1: Choose your starting point</h3>
                     <div className="flex justify-center mb-6 border-b border-slate-200">
                        {inputMethods.map(tab => {
                            const TabIcon = tab.icon;
                            const isActive = activeInputMethod === tab.id;
                            return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveInputMethod(tab.id)}
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
                </div>

                <div className="min-h-[220px]">
                    {activeInputMethod === 'scratch' && (
                        <div className="space-y-4">
                             <textarea name="problem" value={formInputs.problem} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="What problem are you solving?"></textarea>
                             <textarea name="solution" value={formInputs.solution} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="What is your proposed solution?"></textarea>
                             <input type="text" name="market" value={formInputs.market} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Who is your target market?" />
                             <input type="text" name="advantage" value={formInputs.advantage} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="What is your unique advantage?" />
                        </div>
                    )}
                     {activeInputMethod === 'url' && (
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1">Enter a URL to analyze</label>
                            <input type="url" id="url" disabled className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-slate-50 cursor-not-allowed" placeholder="https://your-landing-page.com" />
                            <p className="text-xs text-slate-500 mt-2">Feature coming soon. We'll analyze the content of the page to generate your deck.</p>
                        </div>
                    )}
                    {activeInputMethod === 'doc' && (
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Upload a Document</label>
                            <div onClick={handleComingSoon} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer bg-slate-50">
                                <div className="space-y-1 text-center">
                                    <FileText className="mx-auto h-12 w-12 text-slate-400" />
                                    <p className="text-sm text-slate-500">Feature coming soon</p>
                                    <p className="text-xs text-slate-500">PDF, DOCX, TXT up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-200 pt-8">
                     <h3 className="text-xl font-bold text-slate-800 mb-4">Step 2: Select your deck style</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {DECK_STYLES.map(style => {
                            const StyleIcon = style.icon;
                            return (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyleId(style.id)}
                                    className={`text-left p-4 rounded-lg border-2 transition-all ${selectedStyleId === style.id ? 'bg-purple-50 border-purple-500' : 'bg-slate-50 border-slate-200 hover:border-slate-400'}` }
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <StyleIcon className={`w-6 h-6 ${selectedStyleId === style.id ? 'text-purple-600' : 'text-slate-500'}` } />
                                        <h4 className="font-bold text-slate-800">{style.name}</h4>
                                    </div>
                                    <p className="text-sm text-slate-600">{style.description}</p>
                                </button>
                            );
                        })}
                     </div>
                </div>

                 <div className="border-t border-slate-200 pt-8">
                     <button 
                      onClick={handleGenerateDeck}
                      disabled={isLoading || !isSubmittable}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isLoading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Generating Your Deck...
                        </>
                      ) : (
                        <>
                            <Sparkles className="w-6 h-6" />
                            Generate Deck & Extract Assumptions
                            <ArrowRight className="w-6 h-6" />
                        </>
                      )}
                    </button>
                    <p className="text-sm text-slate-500 mt-4 text-center">
                        This process generates your "fiction" deck. The real work starts in Validated Mode.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FastTrackMode;
