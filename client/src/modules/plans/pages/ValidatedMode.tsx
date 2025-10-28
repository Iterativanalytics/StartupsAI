import React, { useState } from 'react';
import { Sparkles, Brain, X, FileBadge, LayoutDashboard, Edit, Eye, ShieldCheck, CheckCircle, Circle, GitBranch, RefreshCw } from 'lucide-react';
import { PLAN_PHASES, PLAN_TOOLS } from '../constants';
import { PIVOT_TYPES } from '@/constants-hub';
import { Tool, ToastType, Assumption, User, CoFounderPersonality } from '@/types-hub';
import PivotModal from '@/components-hub/PivotModal';
import ToolModal from '@/components-hub/ToolModal';
import AssumptionDashboard from '@/components-hub/AssumptionDashboard';
import { usePlanProject } from '../PlansApp';
import PlanEditor from '../components/PlanEditor';
import PlanViewer from '../components/PlanViewer';
import { sections } from '../components/editorConstants';

interface ValidatedModeProps {
  addToast: (message: string, type: ToastType) => void;
  user: User;
  agentPersonality: CoFounderPersonality;
  vestedInterest: number;
}

type ValidatedView = 'dashboard' | 'editor' | 'viewer';

const ValidatedMode: React.FC<ValidatedModeProps> = ({ addToast, user, agentPersonality, vestedInterest }) => {
  const { project, clearProject, updateSectionContent } = usePlanProject();
  const [activePhase, setActivePhase] = useState<keyof typeof PLAN_PHASES>('discover');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [showPivotModal, setShowPivotModal] = useState(false);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<{ tool: Tool, stepId: string } | null>(null);
  const [currentView, setCurrentView] = useState<ValidatedView>('dashboard');
  const [currentSection, setCurrentSection] = useState(sections[0]);
  const [currentIteration] = useState(1);
  const [pivotHistory] = useState([]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleStepClick = (stepId: string, toolKey: string) => {
    const tool = PLAN_TOOLS[toolKey];
    if (tool) {
        setActiveTool({ tool, stepId });
        setIsToolModalOpen(true);
    } else {
        addToast(`Tool "${toolKey}" not found. Step marked as complete.`, 'info');
        toggleStep(stepId);
    }
  };

  const handleDesignExperiment = (assumption: any) => {
    setActivePhase('experiment');
    addToast(`Navigated to 'Rapid Experiments' to validate: "${assumption.text}"`, 'info');
     if (currentView !== 'dashboard') {
      setCurrentView('dashboard');
    }
  };
  
  const handleClearProject = () => {
    if (window.confirm('Are you sure you want to clear the dashboard and start over?')) {
        clearProject();
    }
  }
  
  if (!project) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold">No project loaded</h2>
            <p>Please go to Fast Track mode to generate a plan first.</p>
        </div>
    )
  }

  const SubNavButton: React.FC<{
    view: ValidatedView,
    label: string,
    icon: React.ElementType
  }> = ({ view, label, icon: Icon }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
        currentView === view
          ? 'bg-purple-600 text-white'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
  
  const currentPhase = PLAN_PHASES[activePhase];
  const CurrentIcon = currentPhase?.icon;

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
      
      <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex items-center justify-between border border-slate-200">
          <div className="flex items-center gap-3">
              <FileBadge className="w-8 h-8 text-purple-600" />
              <div>
                  <p className="text-sm text-slate-500">Current Project</p>
                  <h3 className="font-bold text-slate-800">{project.name}</h3>
              </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <SubNavButton view="dashboard" label="Dashboard" icon={LayoutDashboard} />
            <SubNavButton view="editor" label="Editor" icon={Edit} />
            <SubNavButton view="viewer" label="Viewer" icon={Eye} />
          </div>
          <div className="text-right">
              <p className="text-sm text-slate-500">High-Risk Assumptions</p>
              <p className="font-bold text-lg text-red-600">{project.assumptions.filter(a => a.risk === 'high').length}</p>
          </div>
      </div>

      {currentView === 'dashboard' && (
          <>
            <AssumptionDashboard 
                assumptions={project.assumptions} 
                onClear={handleClearProject}
                onDesignExperiment={handleDesignExperiment}
                noun="plan"
            />
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Lean Design Thinking Process</h3>
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {Object.entries(PLAN_PHASES).map(([key, phase]) => {
                  const PhaseIcon = phase.icon;
                  const isActive = activePhase === key;
                  const allStepsComplete = phase.steps.every(step => completedSteps[step.id]);
                  return (
                    <button
                      key={key}
                      onClick={() => setActivePhase(key as keyof typeof PLAN_PHASES)}
                      className={`p-4 rounded-lg transition-all ${isActive ? `${phase.color} text-white shadow-lg scale-105` : allStepsComplete ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
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
                  <div className={`${currentPhase.color} rounded-xl p-6 text-white`}>
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
                                <div className="text-xs text-purple-600 font-medium mt-2">Tool: {PLAN_TOOLS[step.tool]?.name}</div>
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
                      {Object.entries(PLAN_PHASES).map(([key, phase]) => {
                        const completed = phase.steps.filter(s => completedSteps[s.id]).length;
                        const total = phase.steps.length;
                        const percentage = total > 0 ? (completed / total) * 100 : 0;
                        return (
                          <div key={key}><div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-700">{phase.name}</span><span className="text-slate-500">{completed}/{total}</span></div><div className="w-full bg-slate-200 rounded-full h-2"><div className={`h-2 rounded-full transition-all duration-500 ${phase.color}`} style={{ width: `${percentage}%` }} /></div></div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
      )}
      
      {currentView === 'editor' && (
          <PlanEditor
            project={project}
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
            onContentUpdate={updateSectionContent}
            onViewClick={() => setCurrentView('viewer')}
            user={user}
            agentPersonality={agentPersonality}
            vestedInterest={vestedInterest}
            addToast={addToast}
          />
      )}

      {currentView === 'viewer' && (
          <PlanViewer 
            project={project}
            onEditClick={() => setCurrentView('editor')}
          />
      )}
    </>
  );
};

export default ValidatedMode;