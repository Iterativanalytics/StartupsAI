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