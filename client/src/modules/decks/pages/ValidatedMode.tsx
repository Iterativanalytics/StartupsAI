import React, { useState } from 'react';
import { Users, Target, Lightbulb, TestTube, TrendingUp, RefreshCw, CheckCircle, Circle, Sparkles, Brain, FileText, ArrowRight, Play, GitBranch, BookOpen, Award, AlertTriangle, X, Eye, LayoutGrid, BarChart2, Tag, FileBadge } from 'lucide-react';
import { DECK_PHASES, DECK_TOOLS, DECK_COMPETITOR_COMPARISON, DECK_PRICING_TIERS, DECK_REVENUE_STREAMS } from '../constants';
import { PIVOT_TYPES } from '@/constants-hub';
import { PlatformTab, Assumption, Tool, ToastType } from '@/types-hub';
import PivotModal from '@/components-hub/PivotModal';
import ToolModal from '@/components-hub/ToolModal';
import AssumptionDashboard from '@/components-hub/AssumptionDashboard';
import { useDeckProject } from '../DecksApp';

interface ValidatedModeProps {
  addToast: (message: string, type: ToastType) => void;
}

const ValidatedMode: React.FC<ValidatedModeProps> = ({ addToast }) => {
  const { project, clearProject } = useDeckProject();
  const [activeTab, setActiveTab] = useState<PlatformTab>('platform');
  const [activePhase, setActivePhase] = useState<keyof typeof DECK_PHASES>('discover');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [currentIteration] = useState(1);
  const [pivotHistory] = useState([]);
  const [showPivotModal, setShowPivotModal] = useState(false);

  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<{ tool: Tool, stepId: string } | null>(null);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };
  
  const handleStepClick = (stepId: string, toolKey: string) => {
    const tool = DECK_TOOLS[toolKey];
    if (tool) {
        setActiveTool({ tool, stepId });
        setIsToolModalOpen(true);
    } else {
        addToast(`Tool "${toolKey}" not found. Step marked as complete.`, 'info');
        toggleStep(stepId);
    }
  };

  const handleDesignExperiment = (assumption: Assumption) => {
    setActivePhase('prototype');
    addToast(`Navigated to 'Rapid Prototyping' to validate: "${assumption.text}"`, 'info');
  };

  const onClearAssumptions = () => {
    if (window.confirm('Are you sure you want to clear the dashboard and start over?')) {
        clearProject();
    }
  }

  const currentPhase = DECK_PHASES[activePhase];
  const CurrentIcon = currentPhase?.icon;
  
  const NAV_TABS_DECKS: {id: PlatformTab, label: string, icon: React.ComponentType<any>}[] = [
    { id: 'platform', label: 'Platform', icon: LayoutGrid },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
    { id: 'competitors', label: 'Competitors', icon: BarChart2 },
    { id: 'pricing', label: 'Pricing', icon: Tag },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'platform':
        return (
          <div>
             {project && (
               <>
                <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex items-center justify-between border border-slate-200">
                    <div className="flex items-center gap-3">
                        <FileBadge className="w-8 h-8 text-purple-600" />
                        <div>
                            <p className="text-sm text-slate-500">Current Project</p>
                            <h3 className="font-bold text-slate-800">{project.name}</h3>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500">High-Risk Assumptions</p>
                        <p className="font-bold text-lg text-red-600">{project.assumptions.filter(a => a.risk === 'high').length}</p>
                    </div>
                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm">
                        <Eye className="w-4 h-4"/>
                        View Deck
                    </button>
                </div>
                <AssumptionDashboard 
                    assumptions={project.assumptions} 
                    onClear={onClearAssumptions}
                    onDesignExperiment={handleDesignExperiment}
                    noun="deck"
                />
               </>
            )}
            
            {!project && (
                 <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-12 text-white text-center mb-12">
                    <h2 className="text-5xl font-bold mb-4">Presentations Meet Reality</h2>
                    <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
                        Stop pitching fiction. Start with real problems, validate with real users, pivot with real data.
                        The only platform for building evidence-backed pitch decks.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                        <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg"><div className="text-sm text-white/80">Trusted by</div><div className="text-2xl font-bold">2,500+</div><div className="text-sm">Startups</div></div>
                        <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg"><div className="text-sm text-white/80">Experiments Run</div><div className="text-2xl font-bold">15,000+</div><div className="text-sm">Validated</div></div>
                        <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg"><div className="text-sm text-white/80">Pivot Rate</div><div className="text-2xl font-bold">67%</div><div className="text-sm">Success</div></div>
                    </div>
                    <button onClick={() => setActivePhase('discover')} className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-50 transition-all inline-flex items-center gap-3 text-lg shadow-lg">
                        <Play className="w-6 h-6" /> Start Problem Discovery <ArrowRight className="w-6 h-6" />
                    </button>
                 </div>
            )}
           
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Lean Design Thinking™ Process</h3>
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {Object.entries(DECK_PHASES).map(([key, phase]) => {
                  const PhaseIcon = phase.icon;
                  const isActive = activePhase === key;
                  const allStepsComplete = phase.steps.every(step => completedSteps[step.id]);
                  return (
                    <button
                      key={key}
                      onClick={() => setActivePhase(key as keyof typeof DECK_PHASES)}
                      className={`p-4 rounded-lg transition-all duration-300 ${isActive ? `text-white shadow-lg scale-105 ${phase.color}` : allStepsComplete ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <PhaseIcon className="w-8 h-8" />
                        <span className="font-semibold text-sm text-center">{phase.name}</span>
                        <span className="text-xs opacity-80">{phase.methodology}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {currentPhase && (
              <div key={activePhase} className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className={`rounded-xl p-6 text-white ${currentPhase.color}`}>
                    <div className="flex items-center gap-4 mb-3">
                      {CurrentIcon && <CurrentIcon className="w-12 h-12" />}
                      <div>
                        <div className="text-sm opacity-90 mb-1">{currentPhase.methodology}</div>
                        <h2 className="text-3xl font-bold">{currentPhase.name}</h2>
                        <p className="text-white/90 mt-1">{currentPhase.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Action Steps</h3>
                    <div className="space-y-3">
                      {currentPhase.steps.map((step) => {
                        const isComplete = completedSteps[step.id];
                        return (
                          <button key={step.id} onClick={() => handleStepClick(step.id, step.tool)} className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${isComplete ? 'bg-green-50 border-green-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                            <div className="flex items-start gap-3">
                              {isComplete ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5 animate-pop-in" /> : <Circle className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" />}
                              <div className="flex-1">
                                <div className={`font-semibold flex items-center gap-2 ${isComplete ? 'text-green-900' : 'text-slate-800'}`}>
                                  {step.title}
                                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> AI
                                  </span>
                                </div>
                                <div className={`text-sm mt-1 ${isComplete ? 'text-green-700' : 'text-slate-600'}`}>{step.description}</div>
                                <div className="text-xs text-purple-600 font-medium mt-2">Tool: {DECK_TOOLS[step.tool]?.name}</div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center gap-2 mb-4"><GitBranch className="w-6 h-6" /><h3 className="text-lg font-bold">Pivot Intelligence</h3></div>
                    <p className="text-sm text-white/90 mb-4">Track all learning. When data suggests a pivot, we help you choose the right type.</p>
                    <button onClick={() => setShowPivotModal(true)} className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-all">Explore 10 Pivot Types</button>
                    <div className="mt-4 text-xs text-white/80">{pivotHistory.length} pivots documented this iteration</div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4"><RefreshCw className="w-5 h-5 text-purple-600" /><h3 className="text-lg font-bold text-slate-800">Iteration {currentIteration}</h3></div>
                    <div className="space-y-4">
                      {Object.entries(DECK_PHASES).map(([key, phase]) => {
                        const completed = phase.steps.filter(s => completedSteps[s.id]).length;
                        const total = phase.steps.length;
                        const percentage = total > 0 ? (completed / total) * 100 : 0;
                        return (
                          <div key={key}><div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-700">{phase.name}</span><span className="text-slate-500">{completed}/{total}</span></div><div className="w-full bg-slate-200 rounded-full h-2"><div className={`h-2 rounded-full transition-all duration-500 ${phase.color}`} style={{ width: `${percentage}%` }} /></div></div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-bold mb-3">Core Philosophy</h3>
                    <div className="space-y-2 text-sm text-white/90">
                      <p>🎯 <strong>Problem-First:</strong> Deep discovery before solutions</p>
                      <p>🧪 <strong>Hypothesis-Driven:</strong> Test assumptions systematically</p>
                      <p>📊 <strong>Qual + Quant:</strong> Ethnography meets metrics</p>
                      <p>🔄 <strong>Pivot-Ready:</strong> Change is learning, not failure</p>
                      <p>🚀 <strong>Scale on Evidence:</strong> Grow only what's validated</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'methodology':
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Lean Design Thinking™ for Decks</h2>
              <p className="text-lg text-slate-600 mb-8">Your pitch deck is a story. Our methodology ensures that story is built on a foundation of evidence, not fiction. Each step helps you validate a key part of your narrative.</p>
              
              <div className="space-y-10">
                {Object.values(DECK_PHASES).map((phase) => {
                  const PhaseIcon = phase.icon;
                  return (
                    <div key={phase.name} className="flex items-start gap-6">
                       <div className={`p-3 rounded-full text-white mt-1 ${phase.color}`}>
                         <PhaseIcon className="w-8 h-8" />
                       </div>
                      <div className="flex-1 border-b border-slate-200 pb-10 last:border-b-0">
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">{phase.name} <span className="text-base font-normal text-slate-500">({phase.methodology})</span></h3>
                        <p className="text-slate-600 mb-6">{phase.description}</p>
                        
                        <div className="space-y-4">
                          {phase.steps.map(step => {
                            const tool = DECK_TOOLS[step.tool];
                            return (
                              <div key={step.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <p className="font-semibold text-slate-800">{step.title}</p>
                                <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                                {tool && (
                                  <div className="mt-2 p-3 bg-white rounded-md border border-slate-200">
                                    <p className="text-xs font-semibold text-purple-700 flex items-center gap-2"><Sparkles className="w-3 h-3"/> AI Tool: {tool.name}</p>
                                    <p className="text-xs text-slate-500 mt-1">{tool.description}</p>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        );
      case 'competitors':
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-md p-8"><h2 className="text-3xl font-bold text-slate-800 mb-6">How We're Different</h2><div className="overflow-x-auto"><table className="w-full min-w-[800px]"><thead><tr className="border-b-2 border-slate-300"><th className="text-left py-4 px-4 font-bold text-slate-800">Feature</th><th className="text-left py-4 px-4 font-bold text-purple-600 bg-purple-50">IterativDecks</th><th className="text-left py-4 px-4 font-bold text-slate-600">Growth Wheel</th><th className="text-left py-4 px-4 font-bold text-slate-600">Venture Planner</th><th className="text-left py-4 px-4 font-bold text-slate-600">LivePlan</th></tr></thead><tbody>{DECK_COMPETITOR_COMPARISON.map((row, idx) => (<tr key={idx} className="border-b border-slate-200 hover:bg-slate-50"><td className="py-4 px-4 font-semibold text-slate-700">{row.feature}</td><td className="py-4 px-4 bg-purple-50 text-purple-900 font-medium">{row.iterativDecks}</td><td className="py-4 px-4 text-slate-600">{row.growthWheel}</td><td className="py-4 px-4 text-slate-600">{row.venturePlanner}</td><td className="py-4 px-4 text-slate-600">{row.livePlan}</td></tr>))}</tbody></table></div></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="bg-white rounded-xl shadow-md p-6"><div className="flex items-center gap-3 mb-4"><div className="bg-purple-100 rounded-lg p-2"><Target className="w-6 h-6 text-purple-600" /></div><h3 className="text-xl font-bold text-slate-800">vs Template Tools</h3></div><div className="space-y-3 text-sm text-slate-700"><p><strong>Their Approach:</strong> Beautiful, pre-filled templates for fast creation.</p><p><strong>Our Edge:</strong> We validate the story *behind* the slides. A great design with flawed assumptions is still a flawed pitch.</p><p className="text-purple-600 font-semibold">→ We're for founders who want to build a real business, not just a pretty deck.</p></div></div><div className="bg-white rounded-xl shadow-md p-6"><div className="flex items-center gap-3 mb-4"><div className="bg-blue-100 rounded-lg p-2"><Brain className="w-6 h-6 text-blue-600" /></div><h3 className="text-xl font-bold text-slate-800">vs AI Storytellers</h3></div><div className="space-y-3 text-sm text-slate-700"><p><strong>Their Approach:</strong> Generate an entire presentation from a single prompt.</p><p><strong>Our Edge:</strong> Our AI helps synthesize real research and validate assumptions. We replace guesswork with evidence.</p><p className="text-blue-600 font-semibold">→ We generate decks that stand up to due diligence.</p></div></div><div className="bg-white rounded-xl shadow-md p-6"><div className="flex items-center gap-3 mb-4"><div className="bg-green-100 rounded-lg p-2"><FileText className="w-6 h-6 text-green-600" /></div><h3 className="text-xl font-bold text-slate-800">vs Manual Tools</h3></div><div className="space-y-3 text-sm text-slate-700"><p><strong>Their Approach:</strong> Blank canvases that require you to have all the answers.</p><p><strong>Our Edge:</strong> We provide a structured process for *finding* the answers. We guide you from uncertainty to a validated pitch.</p><p className="text-green-600 font-semibold">→ We're a strategic partner, not just a design tool.</p></div></div></div>
          </div>
        );
      case 'pricing':
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="text-center mb-12"><h2 className="text-4xl font-bold text-slate-800 mb-4">Pricing That Scales With You</h2><p className="text-xl text-slate-600 max-w-3xl mx-auto">Start free. Upgrade when you're ready to scale. Enterprise solutions for accelerators and universities.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start mb-12">{DECK_PRICING_TIERS.map((tier, idx) => (<div key={idx} className={`bg-white rounded-xl shadow-md p-6 transition-transform transform ${tier.highlighted ? 'ring-4 ring-purple-600 scale-105' : ''}`}>{tier.highlighted && (<div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">MOST POPULAR</div>)}<h3 className="text-2xl font-bold text-slate-800 mb-2">{tier.name}</h3><div className="text-4xl font-bold text-purple-600 mb-2">{tier.price}</div><p className="text-sm text-slate-600 mb-6 h-10">{tier.description}</p><ul className="space-y-3 mb-6">{tier.features.map((feature, i) => (<li key={i} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /><span>{feature}</span></li>))}</ul><button className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${tier.highlighted ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{tier.cta}</button></div>))}</div>
            <div className="bg-white rounded-xl shadow-md p-8"><h2 className="text-3xl font-bold text-slate-800 mb-6">Multiple Revenue Streams</h2><div className="overflow-x-auto mb-6"><table className="w-full min-w-[700px]"><thead><tr className="border-b-2 border-slate-300"><th className="text-left py-3 px-4 font-bold text-slate-800">Revenue Stream</th><th className="text-right py-3 px-4 font-bold text-slate-800">Year 1</th><th className="text-right py-3 px-4 font-bold text-slate-800">Year 2</th><th className="text-right py-3 px-4 font-bold text-slate-800">Year 3</th><th className="text-right py-3 px-4 font-bold text-slate-800">% of Total</th></tr></thead><tbody>{DECK_REVENUE_STREAMS.map((row, idx) => (<tr key={idx} className={`border-b border-slate-200 ${row.stream === 'Total ARR' ? 'bg-purple-50 font-bold' : ''}`}><td className="py-3 px-4 text-slate-700">{row.stream}</td><td className="py-3 px-4 text-right text-slate-700">{row.year1}</td><td className="py-3 px-4 text-right text-slate-700">{row.year2}</td><td className="py-3 px-4 text-right text-purple-600 font-semibold">{row.year3}</td><td className="py-3 px-4 text-right text-slate-700">{row.percentage}</td></tr>))}</tbody></table></div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="bg-white rounded-xl shadow-md p-6"><h3 className="text-xl font-bold text-slate-800 mb-4">Freemium Strategy</h3><div className="space-y-3 text-sm text-slate-700"><div className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><div><strong>Viral Mechanics:</strong> Founders share validated experiments in community</div></div><div className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><div><strong>Value Before Paywall:</strong> Complete first discovery phase free</div></div><div className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><div><strong>Upgrade Triggers:</strong> When users need advanced AI tools or multiple projects</div></div></div></div><div className="bg-white rounded-xl shadow-md p-6"><h3 className="text-xl font-bold text-slate-800 mb-4">Content-Led Growth</h3><div className="space-y-3 text-sm text-slate-700"><div className="flex items-start gap-2"><BookOpen className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" /><div><strong>Authority Building:</strong> Become THE source for Lean Design Thinking</div></div><div className="flex items-start gap-2"><Award className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" /><div><strong>Certification Programs:</strong> Train advisors and educators</div></div><div className="flex items-start gap-2"><Users className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" /><div><strong>Community:</strong> Learning hub for methodology discussions</div></div></div></div></div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <>
      <PivotModal isOpen={showPivotModal} onClose={() => setShowPivotModal(false)} pivotTypes={PIVOT_TYPES} />
      <ToolModal
          isOpen={isToolModalOpen}
          onClose={() => {
              setIsToolModalOpen(false);
              setActiveTool(null);
          }}
          tool={activeTool?.tool || null}
          onComplete={() => {
              if (activeTool) {
                  toggleStep(activeTool.stepId);
              }
          }}
          addToast={addToast}
      />
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            {NAV_TABS_DECKS.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all ${activeTab === tab.id ? 'border-purple-600 text-purple-600 font-semibold' : 'border-transparent text-slate-600 hover:text-slate-800'}`}
                >
                  <TabIcon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-8">
        {renderContent()}
      </div>
    </>
  );
};

export default ValidatedMode;
