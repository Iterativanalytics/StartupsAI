import React, { useState } from 'react';
import { FileText, MessageSquare, Save, RefreshCw } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  content: string;
  aiPrompt?: string;
}

interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

function EditPlan() {
  const [activeChapter, setActiveChapter] = useState('executive-summary');
  const [activeSection, setActiveSection] = useState('mission');
  const [isGenerating, setIsGenerating] = useState(false);

  const chapters: Chapter[] = [
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      sections: [
        {
          id: 'mission',
          title: 'Our Mission',
          content: '',
          aiPrompt: 'Write a compelling mission statement that captures our core purpose and values.'
        },
        {
          id: 'company',
          title: 'The Company & Management',
          content: '',
          aiPrompt: 'Describe the company structure and key management team members.'
        },
        {
          id: 'products',
          title: 'Our Products/Services',
          content: '',
          aiPrompt: 'Outline our main products/services and their unique value propositions.'
        },
        {
          id: 'opportunity',
          title: 'The Opportunity',
          content: '',
          aiPrompt: 'Explain the market opportunity and how we plan to capitalize on it.'
        },
        {
          id: 'highlights',
          title: 'Financial Highlights',
          content: '',
          aiPrompt: 'Summarize key financial metrics and projections.'
        }
      ]
    },
    {
      id: 'financials',
      title: 'Financials',
      sections: [
        {
          id: 'financial-data',
          title: 'Financial Data',
          content: '',
          aiPrompt: 'Present key financial data and metrics.'
        },
        {
          id: 'profit-loss',
          title: 'Profit & Loss',
          content: '',
          aiPrompt: 'Detail the profit and loss statement with projections.'
        },
        {
          id: 'balance-sheet',
          title: 'Balance Sheet',
          content: '',
          aiPrompt: 'Create a comprehensive balance sheet.'
        },
        {
          id: 'cash-flow',
          title: 'Cash Flow',
          content: '',
          aiPrompt: 'Outline cash flow projections and analysis.'
        }
      ]
    }
  ];

  const activeChapterData = chapters.find(c => c.id === activeChapter);
  const activeSectionData = activeChapterData?.sections.find(s => s.id === activeSection);

  const handleGenerateContent = async () => {
    if (!activeSectionData?.aiPrompt) return;
    
    setIsGenerating(true);
    // Simulate AI generation - replace with actual AI integration
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving changes...');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Business Plan</h1>
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="col-span-3 bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-700">Chapters</h2>
          </div>
          <div className="divide-y">
            {chapters.map(chapter => (
              <div key={chapter.id} className="p-2">
                <button
                  onClick={() => setActiveChapter(chapter.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeChapter === chapter.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-4 w-4 inline-block mr-2" />
                  {chapter.title}
                </button>
                {activeChapter === chapter.id && (
                  <div className="ml-6 mt-2 space-y-1">
                    {chapter.sections.map(section => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {section.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="col-span-9 bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeSectionData?.title}
              </h2>
              {activeSectionData?.aiPrompt && (
                <button
                  onClick={handleGenerateContent}
                  disabled={isGenerating}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isGenerating
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {isGenerating ? (
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <MessageSquare className="h-5 w-5 mr-2" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
              )}
            </div>

            {/* AI Prompt */}
            {activeSectionData?.aiPrompt && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>AI Assistant:</strong> {activeSectionData.aiPrompt}
                </p>
              </div>
            )}

            {/* Editor */}
            <div className="space-y-4">
              <textarea
                className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Start writing your content here..."
                value={activeSectionData?.content}
                onChange={(e) => {
                  // Implement content update logic
                  console.log('Content updated:', e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPlan;