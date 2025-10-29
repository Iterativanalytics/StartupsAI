import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useFeature } from '@/contexts/FeatureFlagsContext';
import { UserType } from '@shared/schema';
import { Sparkles, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Persona, EntrepreneurStage, CompositeProfile, CoFounderPersonality } from '@/types-hub';
import PersonaSelector from '@/components-hub/PersonaSelector';
import EntrepreneurStageSelector from '@/components-hub/EntrepreneurStageSelector';
import AssessmentRunner from '@/components-hub/assessment/AssessmentRunner';
import AssessmentResults from '@/components-hub/assessment/AssessmentResults';
import { synthesizeProfile, proposePersonality } from '@/components-hub/assessment/utils';

type OnboardingData = {
  role: UserType | '';
  companyStage: 'idea' | 'prototype' | 'mvp' | 'growth' | 'scale' | '';
  fundingGoals: string;
  teamSize: number | '';
  primaryChallenges: string;
  industry: string;
};

const initialData: OnboardingData = {
  role: '',
  companyStage: '',
  fundingGoals: '',
  teamSize: '',
  primaryChallenges: '',
  industry: '',
};

type UnifiedOnboardingProps = {
  onComplete: (data: {
    basicData: OnboardingData;
    persona?: Persona;
    stage?: EntrepreneurStage;
    profile?: CompositeProfile;
    personality?: CoFounderPersonality;
  }) => void;
  onSkip?: () => void;
  mode?: 'basic' | 'enhanced' | 'auto';
};

export const UnifiedOnboarding: React.FC<UnifiedOnboardingProps> = ({ 
  onComplete, 
  onSkip, 
  mode = 'auto' 
}) => {
  const onboardingV2Enabled = useFeature('onboarding_v2');
  const [currentFlow, setCurrentFlow] = useState<'basic' | 'enhanced'>('basic');
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  
  // Enhanced flow states
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [selectedStage, setSelectedStage] = useState<EntrepreneurStage | undefined>(undefined);
  const [compositeProfile, setCompositeProfile] = useState<CompositeProfile | null>(null);
  const [proposedPersonality, setProposedPersonality] = useState<CoFounderPersonality | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Determine which flow to use
  const useEnhancedFlow = mode === 'enhanced' || (mode === 'auto' && onboardingV2Enabled);

  const basicSteps = [
    { key: 'role', title: 'Your role', description: 'Tell us who you are' },
    { key: 'companyStage', title: 'Company stage', description: 'Where are you in your journey?' },
    { key: 'industry', title: 'Industry', description: 'What space are you in?' },
    { key: 'fundingGoals', title: 'Funding goals', description: 'What are you aiming to raise?' },
    { key: 'teamSize', title: 'Team size & challenges', description: 'Your team and primary challenges' },
  ] as const;

  const enhancedSteps = [
    { key: 'persona', title: 'Your persona', description: 'Select your primary role' },
    { key: 'stage', title: 'Venture stage', description: 'Tell us about your venture stage' },
    { key: 'assessment', title: 'Assessment', description: 'Discover your entrepreneurial profile' },
    { key: 'results', title: 'Profile ready', description: 'Your personalized AI partner' },
  ] as const;

  const steps = useEnhancedFlow ? enhancedSteps : basicSteps;
  const progress = (step - 1) / (steps.length - 1) * 100;

  const next = () => setStep(s => Math.min(s + 1, steps.length));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
    if (persona === 'entrepreneur') {
      setStep(2);
    } else {
      setStep(3); // Skip stage selection
    }
  };

  const handleStageSelect = (stage: EntrepreneurStage) => {
    setSelectedStage(stage);
    setStep(3);
  };
  
  const handleAssessmentComplete = (answers: Record<string, number>) => {
    setIsSynthesizing(true);
    // Simulate processing delay
    setTimeout(() => {
        const profile = synthesizeProfile(answers);
        const personality = proposePersonality(profile);
        setCompositeProfile(profile);
        setProposedPersonality(personality);
        setIsSynthesizing(false);
        setStep(4);
    }, 1500);
  };

  const handleComplete = async () => {
    try {
      if (useEnhancedFlow) {
        // Enhanced flow completion
        if (selectedPersona && compositeProfile && proposedPersonality) {
          onComplete({
            basicData: data,
            persona: selectedPersona,
            stage: selectedStage,
            profile: compositeProfile,
            personality: proposedPersonality
          });
        }
      } else {
        // Basic flow completion
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: data.role,
            preferences: { onboarding_v2: true },
          }),
        });
        onComplete({ basicData: data });
      }
    } catch (error) {
      console.error('Onboarding completion error:', error);
      onComplete({ basicData: data });
    }
  };

  const getSubtitle = () => {
    if (useEnhancedFlow) {
      switch(step) {
        case 1: return "Let's tailor your experience. Please select your role.";
        case 2: return "Tell us a bit more about your venture.";
        case 3: return "Discover your entrepreneurial profile (10-15 min).";
        case 4: return "Your profile is ready! Here's your archetype and a proposed AI partner.";
        default: return "Welcome to IterativStartups!";
      }
    } else {
      return steps[step - 1]?.description || "Getting started";
    }
  };

  if (useEnhancedFlow) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto flex flex-col">
          <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button onClick={back} className="text-slate-500 hover:bg-slate-200 rounded-full p-2 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <Sparkles className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Welcome to IterativStartups!</h3>
                <p className="text-slate-500">{getSubtitle()}</p>
              </div>
            </div>
            <button
              onClick={onSkip}
              className="text-slate-500 hover:bg-slate-200 rounded-full p-2 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-8">
            {step === 1 && <PersonaSelector onSelect={handlePersonaSelect} />}
            {step === 2 && <EntrepreneurStageSelector onSelect={handleStageSelect} />}
            {step === 3 && (isSynthesizing ? (
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                <p className="mt-4 text-slate-600 font-semibold">Synthesizing your profile...</p>
              </div>
            ) : (
              <AssessmentRunner onComplete={handleAssessmentComplete} />
            ))}
            {step === 4 && compositeProfile && proposedPersonality && (
              <div>
                <AssessmentResults profile={compositeProfile} />
                <div className="mt-8 bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
                  <h3 className="text-xl font-bold text-slate-800">Your Proposed Co-Founder™ Personality</h3>
                  <p className="text-slate-600 mt-2 mb-4">Based on your profile, we've configured an AI partner to complement your strengths and support your blind spots. You can adjust this anytime.</p>
                  <div className="inline-block bg-white p-4 rounded-lg border">
                    <p>Assertiveness: <strong>{proposedPersonality.traits.assertiveness}/10</strong> | Optimism: <strong>{proposedPersonality.traits.optimism}/10</strong></p>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <button onClick={handleComplete} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Get Started
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Basic flow
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Getting started</span>
            <div className="w-40">
              <Progress value={progress} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-3">
              <Label>Your role</Label>
              <Select value={data.role} onValueChange={(v) => setData(d => ({ ...d, role: v as UserType }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserType).map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Label>Company stage</Label>
              <Select value={data.companyStage} onValueChange={(v) => setData(d => ({ ...d, companyStage: v as OnboardingData['companyStage'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  {['idea','prototype','mvp','growth','scale'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <Label>Industry</Label>
              <Input value={data.industry} onChange={(e) => setData(d => ({ ...d, industry: e.target.value }))} placeholder="e.g., B2B SaaS" />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <Label>Funding goals</Label>
              <Input value={data.fundingGoals} onChange={(e) => setData(d => ({ ...d, fundingGoals: e.target.value }))} placeholder="e.g., $500k seed round" />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <Label>Team size</Label>
              <Input type="number" value={data.teamSize as any} onChange={(e) => setData(d => ({ ...d, teamSize: e.target.valueAsNumber || '' }))} placeholder="e.g., 5" />
              <Label>Primary challenges</Label>
              <Input value={data.primaryChallenges} onChange={(e) => setData(d => ({ ...d, primaryChallenges: e.target.value }))} placeholder="e.g., GTM focus, fundraising narrative" />
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={back} disabled={step === 1}>Back</Button>
            <div className="flex items-center gap-2">
              {onSkip && <Button variant="ghost" onClick={onSkip}>Skip</Button>}
              {step < steps.length ? (
                <Button onClick={next}>Continue</Button>
              ) : (
                <Button onClick={handleComplete}>Finish</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
