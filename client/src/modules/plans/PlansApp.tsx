import React, { useState, useEffect } from 'react';
import { Mode, ToastType, BusinessPlan, User, CoFounderPersonality } from '@/types-hub';
import ValidatedMode from './pages/ValidatedMode';
import FastTrackMode from './pages/FastTrackMode';
import ModeToggle from './components/ModeToggle';
import { createProjectContext } from '@/contexts-hub/ProjectContext';

// Create a specific context for Plans using the new structured BusinessPlan type
export const { ProjectProvider: PlanProjectProvider, useProject: usePlanProject } = createProjectContext<BusinessPlan>();

interface PlansAppProps {
  addToast: (message: string, type: ToastType) => void;
  user: User;
  agentPersonality: CoFounderPersonality | null;
  vestedInterest: number;
}

const PlansAppContent: React.FC<PlansAppProps> = ({ addToast, user, agentPersonality, vestedInterest }) => {
  const [mode, setMode] = useState<Mode>('fast-track');
  const { project, clearProject } = usePlanProject();
  
  useEffect(() => {
    // Automatically switch to validated mode when a project is generated
    if (project) {
      setMode('validated');
    } else {
      setMode('fast-track');
    }
  }, [project]);

  const handleSetMode = (newMode: Mode) => {
    if (newMode === 'fast-track' && project) {
        if(window.confirm('This will clear your current plan and assumptions. Are you sure?')) {
            clearProject();
            setMode('fast-track');
        }
    } else if (newMode === 'validated' && !project) {
        addToast("Generate a plan in Fast Track mode first!", "info");
    }
    else {
        setMode(newMode);
    }
  };

  return (
    <div>
        <div className="flex justify-center mb-8">
            <ModeToggle mode={mode} setMode={handleSetMode} />
        </div>
        
        {mode === 'validated' && project && agentPersonality ? (
          <ValidatedMode 
            addToast={addToast}
            user={user}
            agentPersonality={agentPersonality}
            vestedInterest={vestedInterest}
          />
        ) : (
          <FastTrackMode user={user} addToast={addToast} />
        )}
    </div>
  );
}

const PlansApp: React.FC<PlansAppProps> = (props) => (
  <PlanProjectProvider>
    <PlansAppContent {...props} />
  </PlanProjectProvider>
);

export default PlansApp;