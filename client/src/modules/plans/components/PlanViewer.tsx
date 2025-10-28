import React, { useState, useRef } from 'react';
import { 
  FileText, Home, Edit3, 
  Printer, FileDown, Check, ChevronLeft, ChevronRight, Grid3x3
} from 'lucide-react';
import { sections } from './editorConstants';
import { Project, BusinessPlan } from '@/types-hub';

interface PlanViewerProps {
    project: Project<BusinessPlan>;
    onEditClick: () => void;
}

const PlanCover: React.FC<{ companyName: string; year: number }> = ({ companyName, year }) => (
    <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white rounded-2xl shadow-2xl p-12">
        <div className="text-center max-w-2xl">
            <div className="mb-8">
                <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl font-bold border-4 border-white/30">
                    {companyName.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)}
                </div>
            </div>
            <h1 className="text-6xl font-light mb-4 tracking-tight">{companyName}</h1>
            <div className="text-3xl font-light mb-6 opacity-90">{year}</div>
            <div className="text-4xl font-light mb-12 border-t border-b border-white/30 py-4">Business Plan</div>
        </div>
    </div>
);

const TableOfContents: React.FC<{ sections: any[], content: BusinessPlan }> = ({ sections, content }) => {
    const getPageNumber = (index: number) => index + 3;
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Table of Contents</h1>
            <div className="space-y-6">
                {sections.map((section, index) => {
                    const hasContent = content[section.id] && content[section.id]?.text;
                    return (
                        <div key={section.id} className="border-l-4 border-emerald-600 pl-6 py-2">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-emerald-700">{index + 1}</span>
                                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                                    {hasContent && <Check size={18} className="text-green-600" />}
                                </div>
                                <span className="text-lg font-semibold text-gray-700">{getPageNumber(index)}</span>
                             </div>
                             {section.subsections && (
                                 <ul className="ml-10 space-y-1 text-sm text-gray-600">
                                     {section.subsections.map((sub: any, subIndex: number) => <li key={sub.id}>{index+1}.{subIndex+1} {sub.title}</li>)}
                                 </ul>
                             )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ChapterView: React.FC<{ section: any; content: BusinessPlan }> = ({ section, content }) => {
    const sectionContent = content[section.id];
    const hasContent = sectionContent && sectionContent.text;

    if (!hasContent) {
        return <div className="text-center py-16 text-gray-500">This section is empty. Please go to the editor to add content.</div>;
    }

    const Icon = section.icon;
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 pb-6 border-b-2 border-emerald-600">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-emerald-100 rounded-lg"><Icon size={32} className="text-emerald-700" /></div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{section.title}</h1>
                        <p className="text-gray-600 mt-1">{section.description}</p>
                    </div>
                </div>
            </div>
            <div className="prose max-w-none">
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{sectionContent.text}</div>
                </div>
            </div>
        </div>
    );
};

const FinancialsView: React.FC<{ content: BusinessPlan }> = ({ content }) => {
    const financialsContent = content['financials'];
    if (!financialsContent || !financialsContent.text) {
        return <div className="text-center py-16 text-gray-500">Financial section is empty. Please go to the editor to add content.</div>;
    }
    const financialsSection = sections.find(s => s.id === 'financials');
    if (!financialsSection) return null;
    return <ChapterView section={financialsSection} content={content} />;
};


const PlanViewer: React.FC<PlanViewerProps> = ({ project, onEditClick }) => {
    const [currentView, setCurrentView] = useState('cover');
    const contentRef = useRef<HTMLDivElement>(null);
    const { content, name: companyName, year = new Date().getFullYear() } = project;

    const views = [
        { id: 'cover', title: 'Cover Page', icon: Home },
        { id: 'contents', title: 'Table of Contents', icon: Grid3x3 },
        ...sections
    ];

    const currentIndex = views.findIndex(v => v.id === currentView);

    const handleNext = () => {
        if (currentIndex < views.length - 1) {
            setCurrentView(views[currentIndex + 1].id);
            if (contentRef.current) contentRef.current.scrollTop = 0;
        }
    };
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentView(views[currentIndex - 1].id);
            if (contentRef.current) contentRef.current.scrollTop = 0;
        }
    };
    
    const handlePrint = () => window.print();
    const handleExportPDF = () => console.log('PDF export functionality would be implemented here');

    const renderContent = () => {
        if (currentView === 'cover') return <PlanCover companyName={companyName} year={year} />;
        if (currentView === 'contents') return <TableOfContents sections={sections} content={content} />;
        const section = sections.find(s => s.id === currentView);
        if (section) {
            if (section.id === 'financials') return <FinancialsView content={content} />;
            return <ChapterView section={section} content={content} />;
        }
        return null;
    };
    
    const getCompletionStatus = () => {
        const completed = sections.filter(s => content[s.id] && content[s.id]?.text).length;
        return Math.round((completed / sections.length) * 100);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden h-[80vh] bg-white rounded-xl shadow-lg border">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">IterativPlan Viewer</h1>
                        <p className="text-sm text-gray-600 mt-1">{companyName} • {year} • {getCompletionStatus()}% Complete</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onEditClick} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Edit3 size={18} /> Edit Plan</button>
                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"><Printer size={18} /> Print</button>
                        <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"><FileDown size={18} /> Export PDF</button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto p-4">
                  <nav className="space-y-1">
                      {views.map(view => {
                          const isActive = currentView === view.id;
                          const Icon = view.icon;
                          const hasContent = view.id !== 'cover' && view.id !== 'contents' && content[view.id] && content[view.id]?.text;
                          return (
                              <div key={view.id} onClick={() => setCurrentView(view.id)}
                                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${isActive ? 'bg-emerald-50 border-2 border-emerald-500' : 'border-2 border-transparent hover:bg-gray-50'}`}>
                                  <div className="flex items-center gap-3 flex-1">
                                      {Icon && <Icon size={18} className={isActive ? 'text-emerald-700' : 'text-gray-500'} />}
                                      <span className={`text-sm font-medium ${isActive ? 'text-emerald-900' : 'text-gray-700'}`}>{view.title}</span>
                                  </div>
                                  {hasContent && <Check size={16} className="text-green-600" />}
                              </div>
                          );
                      })}
                  </nav>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50" ref={contentRef}>
                        {renderContent()}
                    </div>
                    <div className="bg-white border-t border-gray-200 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <button onClick={handlePrevious} disabled={currentIndex === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                <ChevronLeft size={18} /> Previous
                            </button>
                            <div className="text-center">
                                <div className="text-sm font-medium text-gray-900">{currentIndex + 1} of {views.length}</div>
                                <div className="text-xs text-gray-600 mt-1">{views[currentIndex].title}</div>
                            </div>
                            <button onClick={handleNext} disabled={currentIndex === views.length - 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentIndex === views.length - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                                Next <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanViewer;