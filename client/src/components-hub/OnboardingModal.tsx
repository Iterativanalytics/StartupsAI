import React, { useState } from 'react';
import { Sparkles, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Persona, EntrepreneurStage, CompositeProfile, CoFounderPersonality } from '../types';
import PersonaSelector from './PersonaSelector';
import EntrepreneurStageSelector from './EntrepreneurStageSelector';
import AssessmentRunner from './assessment/AssessmentRunner';
import AssessmentResults from './assessment/AssessmentResults';
import { synthesizeProfile, proposePersonality } from './assessment/utils';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (
    persona: Persona, 
    stage: EntrepreneurStage | undefined,
    profile: CompositeProfile,
    proposedPersonality: CoFounderPersonality
  ) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [selectedStage, setSelectedStage] = useState<EntrepreneurStage | undefined>(undefined);
  const [compositeProfile, setCompositeProfile] = useState<CompositeProfile | null>(null);
  const [proposedPersonality, setProposedPersonality] = useState<CoFounderPersonality | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  if (!isOpen) return null;

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

  const handleFinalize = () => {
    if (selectedPersona && compositeProfile && proposedPersonality) {
      onComplete(selectedPersona, selectedStage, compositeProfile, proposedPersonality);
    }
  };

  const handleBack = () => {
      if (step > 1) {
          setStep(step - 1);
      }
  };
  
  const getSubtitle = () => {
      switch(step) {
          case 1: return "Let's tailor your experience. Please select your role.";
          case 2: return "Tell us a bit more about your venture.";
          case 3: return "Discover your entrepreneurial profile (10-15 min).";
          case 4: return "Your profile is ready! Here's your archetype and a proposed AI partner.";
          default: return "Welcome to IterativStartups!";
      }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto flex flex-col">
        <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
                {step > 1 && (
                    <button onClick={handleBack} className="text-slate-500 hover:bg-slate-200 rounded-full p-2 transition-colors">
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
              onClick={onClose}
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
                        <button onClick={handleFinalize} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
