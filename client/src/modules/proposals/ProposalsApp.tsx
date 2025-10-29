import React, { useState, useEffect } from 'react';
import { Mode, ToastType, User } from '@/types-hub';
import ProposalsPage from './pages/ValidatedMode';
import FastTrackMode from './pages/FastTrackMode';
import ModeToggle from './components/ModeToggle';
import { createProjectContext } from '@/contexts-hub/ProjectContext';

// Create a specific context for IterativProposals, where the content is a string (Markdown)
export const { ProjectProvider: IterativProposalProjectProvider, useProject: useIterativProposalProject } = createProjectContext<string>();


interface IterativProposalsAppProps {
  addToast: (message: string, type: ToastType) => void;
  user: User;
}

const IterativProposalsAppContent: React.FC<IterativProposalsAppProps> = ({ addToast, user }) => {
  const [mode, setMode] = useState<Mode>('fast-track');
  const { project, clearProject } = useIterativProposalProject();
  
  useEffect(() => {
    if (project) {
        setMode('validated');
    }
  }, [project]);
  

  const handleSetMode = (newMode: Mode) => {
      if (newMode === 'fast-track' && project) {
          if (window.confirm('This will clear your current iterative proposal project. Are you sure?')) {
              clearProject();
              setMode('fast-track');
          }
      } else if (newMode === 'validated' && !project) {
          addToast('Generate an iterative proposal plan in Fast Track mode first!', 'info');
      }
      else {
          setMode(newMode);
      }
  }

  return (
    <div>
      <div className="flex justify-center mb-8">
        <ModeToggle mode={mode} setMode={handleSetMode} />
      </div>

      {mode === 'validated' && project ? (
        <ProposalsPage 
          addToast={addToast}
        />
      ) : (
        <FastTrackMode addToast={addToast} user={user} />
      )}
    </div>
  );
}

const IterativProposalsApp: React.FC<IterativProposalsAppProps> = (props) => (
    <IterativProposalProjectProvider>
        <IterativProposalsAppContent {...props} />
    </IterativProposalProjectProvider>
);

export default IterativProposalsApp;