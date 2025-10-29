import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useFeature } from '@/contexts/FeatureFlagsContext';
import { UserType } from '@shared/schema';
import { Sparkles, X, ArrowLeft, Loader2, User, Building, Target, Users, Brain, Zap } from 'lucide-react';
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

type ConsolidatedOnboardingProps = {
  onComplete: (data: {
    basicData: OnboardingData;
    persona?: Persona;
    stage?: EntrepreneurStage;
    profile?: CompositeProfile;
    personality?: CoFounderPersonality;
  }) => void;
  onSkip?: () => void;
  showAssessment?: boolean;
};

export const ConsolidatedOnboarding: React.FC<ConsolidatedOnboardingProps> = ({ 
  onComplete, 
  onSkip,
  showAssessment = true
}) => {
  const onboardingV2Enabled = useFeature('onboarding_v2');
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  
  // Enhanced flow states
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [selectedStage, setSelectedStage] = useState<EntrepreneurStage | undefined>(undefined);
  const [compositeProfile, setCompositeProfile] = useState<CompositeProfile | null>(null);
  const [proposedPersonality, setProposedPersonality] = useState<CoFounderPersonality | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Determine if we should show the assessment
  const shouldShowAssessment = showAssessment && onboardingV2Enabled;

  const steps = [
    { key: 'persona', title: 'Your Role', description: 'Tell us who you are', icon: User },
    { key: 'stage', title: 'Venture Stage', description: 'Where are you in your journey?', icon: Building },
    { key: 'details', title: 'Business Details', description: 'Tell us about your business', icon: Target },
    { key: 'team', title: 'Team & Goals', description: 'Your team and objectives', icon: Users },
    ...(shouldShowAssessment ? [{ key: 'assessment', title: 'Assessment', description: 'Discover your profile', icon: Brain }] : []),
    ...(shouldShowAssessment ? [{ key: 'results', title: 'AI Partner', description: 'Your personalized AI co-founder', icon: Zap }] : []),
  ];

  const progress = (step - 1) / (steps.length - 1) * 100;

  const next = () => setStep(s => Math.min(s + 1, steps.length));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
    // Map persona to UserType for basic data
    const userTypeMap: Record<Persona, UserType> = {
      'entrepreneur': UserType.ENTREPRENEUR,
      'investor': UserType.INVESTOR,
      'incubator': UserType.INCUBATOR,
      'lender': UserType.LENDER
    };
    setData(prev => ({ ...prev, role: userTypeMap[persona] }));
    next();
  };

  const handleStageSelect = (stage: EntrepreneurStage) => {
    setSelectedStage(stage);
    // Map stage to company stage
    const stageMap: Record<EntrepreneurStage, OnboardingData['companyStage']> = {
      'ideation': 'idea',
      'pre-seed': 'prototype',
      'growth': 'growth'
    };
    setData(prev => ({ ...prev, companyStage: stageMap[stage] }));
    next();
  };

  const handleAssessmentComplete = (answers: Record<string, number>) => {
    setIsSynthesizing(true);
    setTimeout(() => {
        const profile = synthesizeProfile(answers);
        const personality = proposePersonality(profile);
        setCompositeProfile(profile);
        setProposedPersonality(personality);
        setIsSynthesizing(false);
        next();
    }, 1500);
  };

  const handleComplete = async () => {
    try {
      // Always save basic data
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: data.role,
          preferences: { onboarding_v2: true },
        }),
      });

      // Complete with all available data
      onComplete({
        basicData: data,
        persona: selectedPersona,
        stage: selectedStage,
        profile: compositeProfile,
        personality: proposedPersonality
      });
    } catch (error) {
      console.error('Onboarding completion error:', error);
      onComplete({
        basicData: data,
        persona: selectedPersona,
        stage: selectedStage,
        profile: compositeProfile,
        personality: proposedPersonality
      });
    }
  };

  const getSubtitle = () => {
    return steps[step - 1]?.description || "Welcome to IterativStartups!";
  };

  const getStepIcon = () => {
    const IconComponent = steps[step - 1]?.icon || User;
    return <IconComponent className="w-6 h-6" />;
  };

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getStepIcon()}
              <span className="text-sm font-medium text-slate-600">
                Step {step} of {steps.length}
              </span>
            </div>
            <button
              onClick={onSkip}
              className="text-slate-500 hover:bg-slate-200 rounded-full p-2 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Persona Selection */}
          {step === 1 && <PersonaSelector onSelect={handlePersonaSelect} />}

          {/* Step 2: Stage Selection (for entrepreneurs) */}
          {step === 2 && selectedPersona === 'entrepreneur' && (
            <EntrepreneurStageSelector onSelect={handleStageSelect} />
          )}

          {/* Step 2: Skip stage for non-entrepreneurs */}
          {step === 2 && selectedPersona !== 'entrepreneur' && (
            <div className="text-center py-8">
              <Building className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Great choice!</h3>
              <p className="text-slate-600 mb-6">Let's learn more about your business details.</p>
              <Button onClick={next} className="bg-purple-600 hover:bg-purple-700">
                Continue
              </Button>
            </div>
          )}

          {/* Step 3: Business Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Target className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-slate-800">Tell us about your business</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={data.industry}
                    onChange={(e) => setData(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., B2B SaaS, E-commerce, Healthcare"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fundingGoals">Funding Goals</Label>
                  <Input
                    id="fundingGoals"
                    value={data.fundingGoals}
                    onChange={(e) => setData(prev => ({ ...prev, fundingGoals: e.target.value }))}
                    placeholder="e.g., $500k seed round, $2M Series A"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={next} className="bg-purple-600 hover:bg-purple-700">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Team & Goals */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-slate-800">Team & Challenges</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    value={data.teamSize as any}
                    onChange={(e) => setData(prev => ({ ...prev, teamSize: e.target.valueAsNumber || '' }))}
                    placeholder="e.g., 5"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="primaryChallenges">Primary Challenges</Label>
                  <Input
                    id="primaryChallenges"
                    value={data.primaryChallenges}
                    onChange={(e) => setData(prev => ({ ...prev, primaryChallenges: e.target.value }))}
                    placeholder="e.g., GTM strategy, fundraising narrative, product-market fit"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={next} className="bg-purple-600 hover:bg-purple-700">
                  {shouldShowAssessment ? 'Continue to Assessment' : 'Complete Setup'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Assessment (if enabled) */}
          {step === 5 && shouldShowAssessment && (isSynthesizing ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
              <p className="mt-4 text-slate-600 font-semibold">Synthesizing your profile...</p>
            </div>
          ) : (
            <AssessmentRunner onComplete={handleAssessmentComplete} />
          ))}

          {/* Step 6: Results (if assessment enabled) */}
          {step === 6 && shouldShowAssessment && compositeProfile && proposedPersonality && (
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
                <Button onClick={handleComplete} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
                  Get Started
                </Button>
              </div>
            </div>
          )}

          {/* Final step for non-assessment flow */}
          {step === 5 && !shouldShowAssessment && (
            <div className="text-center py-8">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Setup Complete!</h3>
                <p className="text-slate-600">Your profile has been configured and you're ready to start using IterativStartups.</p>
              </div>
              <Button onClick={handleComplete} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
