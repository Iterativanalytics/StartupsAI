import React, { useState, useEffect } from 'react';
import { Mode, ToastType, User } from '../../types';
import ProposalsPage from './pages/ValidatedMode';
import FastTrackMode from './pages/FastTrackMode';
import ModeToggle from './components/ModeToggle';
import { createProjectContext } from '../../contexts/ProjectContext';

// Create a specific context for Proposals, where the content is a string (Markdown)
export const { ProjectProvider: ProposalProjectProvider, useProject: useProposalProject } = createProjectContext<string>();


interface ProposalsAppProps {
  addToast: (message: string, type: ToastType) => void;
  user: User;
}

const ProposalsAppContent: React.FC<ProposalsAppProps> = ({ addToast, user }) => {
  const [mode, setMode] = useState<Mode>('fast-track');
  const { project, clearProject } = useProposalProject();
  
  useEffect(() => {
    if (project) {
        setMode('validated');
    }
  }, [project]);
  

  const handleSetMode = (newMode: Mode) => {
      if (newMode === 'fast-track' && project) {
          if (window.confirm('This will clear your current proposal project. Are you sure?')) {
              clearProject();
              setMode('fast-track');
          }
      } else if (newMode === 'validated' && !project) {
          addToast('Generate a proposal plan in Fast Track mode first!', 'info');
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

const ProposalsApp: React.FC<ProposalsAppProps> = (props) => (
    <ProposalProjectProvider>
        <ProposalsAppContent {...props} />
    </ProposalProjectProvider>
);

export default ProposalsApp;