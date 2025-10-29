import React, { useState } from 'react';
import { Users, Target, Lightbulb, TestTube, TrendingUp, RefreshCw, CheckCircle, Circle, Sparkles, Brain, FileText, ArrowRight, Play, GitBranch, BookOpen, Award, AlertTriangle, X } from 'lucide-react';
import { PLAN_PHASES, PLAN_TOOLS, PLAN_COMPETITOR_COMPARISON, PLAN_PRICING_TIERS, PLAN_REVENUE_STREAMS } from '../constants';
import { PIVOT_TYPES, NAV_TABS } from '../../../constants';
import { PlatformTab, Assumption } from '../../../types';
import PivotModal from '../../../components/PivotModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ValidatedModeProps {
  assumptions: Assumption[];
  onClearAssumptions: () => void;
}

const AssumptionDashboard: React.FC<{assumptions: Assumption[], onClear: () => void}> = ({ assumptions, onClear }) => {
    const riskColorMap = {
        high: 'border-red-500 bg-red-50 text-red-800',
        medium: 'border-yellow-500 bg-yellow-50 text-yellow-800',
        low: 'border-blue-500 bg-blue-50 text-blue-800',
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 mb-8 border-2 border-purple-200 relative">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">Assumption Dashboard</h3>
                    <p className="text-slate-600 mt-1">
                        Your Fast Track plan generated <span className="font-bold text-purple-600">{assumptions.length} assumptions</span>. It's time to validate the riskiest ones.
                    </p>
                </div>
                <button 
                    onClick={onClear} 
                    className="text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full p-2 transition-colors"
                    aria-label="Clear assumptions and start fresh"
                >
                    <X className="w-5 h-5"/>
                </button>
            </div>
            <div className="space-y-3">
                {assumptions.filter(a => a.risk === 'high').map(assumption => (
                    <div key={assumption.id} className={`p-4 rounded-lg border-l-4 flex items-start gap-4 ${riskColorMap[assumption.risk]}`}>
                        <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-semibold">{assumption.text}</p>
                            <p className="text-xs opacity-80 mt-1">Source: {assumption.sourceSection} • Risk: High</p>
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Design Experiment
                        </Button>
                    </div>
                ))}
            </div>
             <p className="text-sm text-slate-500 mt-4 text-center">Proceed with the <span className="font-semibold">Problem Discovery</span> phase below to start validating these assumptions.</p>
        </div>
    );
};

const ValidatedMode: React.FC<ValidatedModeProps> = ({ assumptions, onClearAssumptions }) => {
  const [activeTab, setActiveTab] = useState<PlatformTab>('platform');
  const [activePhase, setActivePhase] = useState<keyof typeof PLAN_PHASES>('discover');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [currentIteration] = useState(1);
  const [pivotHistory] = useState([]);
  const [showPivotModal, setShowPivotModal] = useState(false);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const currentPhase = PLAN_PHASES[activePhase];
  const CurrentIcon = currentPhase?.icon;

  const renderPlatformContent = () => (
    <div>
      {assumptions && assumptions.length > 0 && (
        <AssumptionDashboard assumptions={assumptions} onClear={onClearAssumptions} />
      )}
      
      {(!assumptions || assumptions.length === 0) && (
        <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-12 text-white text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Planning Meets Reality</h2>
          <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
            Stop writing fiction. Start with real problems, validate with real users, pivot with real data.
            The only platform built on Lean Design Thinking methodology.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
              <div className="text-sm text-white/80">Trusted by</div>
              <div className="text-2xl font-bold">2,500+</div>
              <div className="text-sm">Startups</div>
            </div>
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
              <div className="text-sm text-white/80">Experiments Run</div>
              <div className="text-2xl font-bold">15,000+</div>
              <div className="text-sm">Validated</div>
            </div>
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
              <div className="text-sm text-white/80">Pivot Rate</div>
              <div className="text-2xl font-bold">67%</div>
              <div className="text-sm">Success</div>
            </div>
          </div>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-slate-50">
            <Play className="w-6 h-6 mr-2" /> Start Problem Discovery <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      )}
      
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className={`${currentPhase.color} rounded-xl p-6 text-white`}>
              <div className="flex items-center gap-4 mb-3">
                <CurrentIcon className="w-12 h-12" />
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
                    <button key={step.id} onClick={() => toggleStep(step.id)} className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isComplete ? 'bg-green-50 border-green-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-start gap-3">
                        {isComplete ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" /> : <Circle className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" />}
                        <div className="flex-1">
                          <div className={`font-semibold flex items-center gap-2 ${isComplete ? 'text-green-900' : 'text-slate-800'}`}>
                            {step.title}
                            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                              <Sparkles className="w-3 h-3 mr-1" /> AI
                            </Badge>
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
              <div className="flex items-center gap-2 mb-4">
                <GitBranch className="w-6 h-6" />
                <h3 className="text-lg font-bold">Pivot Intelligence</h3>
              </div>
              <p className="text-sm text-white/90 mb-4">Track all learning. When data suggests a pivot, we help you choose the right type.</p>
              <Button onClick={() => setShowPivotModal(true)} variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white">
                Explore 10 Pivot Types
              </Button>
              <div className="mt-4 text-xs text-white/80">{pivotHistory.length} pivots documented this iteration</div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-800">Iteration {currentIteration}</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(PLAN_PHASES).map(([key, phase]) => {
                  const completed = phase.steps.filter(s => completedSteps[s.id]).length;
                  const total = phase.steps.length;
                  const percentage = total > 0 ? (completed / total) * 100 : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{phase.name}</span>
                        <span className="text-slate-500">{completed}/{total}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
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

  const renderContent = () => {
    switch (activeTab) {
      case 'platform':
        return renderPlatformContent();
      case 'methodology':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Lean Design Thinking Framework</h2>
              <p className="text-lg text-slate-600 mb-6">We combine the empathy and creativity of Design Thinking with the rigor and validation of Lean Startup. This hybrid methodology addresses critical gaps in both approaches.</p>
              {/* Methodology content */}
            </div>
          </div>
        );
      case 'competitors':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">How We're Different</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b-2 border-slate-300">
                      <th className="text-left py-4 px-4 font-bold text-slate-800">Feature</th>
                      <th className="text-left py-4 px-4 font-bold text-purple-600 bg-purple-50">IterativPlans</th>
                      <th className="text-left py-4 px-4 font-bold text-slate-600">Advisor Platforms</th>
                      <th className="text-left py-4 px-4 font-bold text-slate-600">AI Plan Generators</th>
                      <th className="text-left py-4 px-4 font-bold text-slate-600">Traditional Tools</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLAN_COMPETITOR_COMPARISON.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="py-4 px-4 font-semibold text-slate-700">{row.feature}</td>
                        <td className="py-4 px-4 bg-purple-50 text-purple-900 font-medium">{row.iterativePlans}</td>
                        <td className="py-4 px-4 text-slate-600">{row.growthWheel}</td>
                        <td className="py-4 px-4 text-slate-600">{row.venturePlanner}</td>
                        <td className="py-4 px-4 text-slate-600">{row.livePlan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Pricing That Scales With You</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">Start free. Upgrade when you're ready to scale. Enterprise solutions for accelerators and universities.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start mb-12">
              {PLAN_PRICING_TIERS.map((tier, idx) => (
                <div key={idx} className={`bg-white rounded-xl shadow-md p-6 transition-transform transform ${tier.highlighted ? 'ring-4 ring-purple-600 scale-105' : ''}`}>
                  {tier.highlighted && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-4">MOST POPULAR</Badge>
                  )}
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold text-purple-600 mb-2">{tier.price}</div>
                  <p className="text-sm text-slate-600 mb-6 h-10">{tier.description}</p>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${tier.highlighted ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}`} variant={tier.highlighted ? 'default' : 'outline'}>
                    {tier.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      default: 
        return null;
    }
  };

  return (
    <>
      <PivotModal isOpen={showPivotModal} onClose={() => setShowPivotModal(false)} pivotTypes={PIVOT_TYPES} />
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            {NAV_TABS.map(tab => {
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