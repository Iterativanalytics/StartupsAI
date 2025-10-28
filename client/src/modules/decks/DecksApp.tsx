import React, { useState, useEffect } from 'react';
import FastTrackMode from './pages/FastTrackMode';
import ValidatedMode from './pages/ValidatedMode';
import ModeToggle from './components/ModeToggle';
import { Mode, ToastType, User } from '../../types';
import { createProjectContext } from '../../contexts/ProjectContext';

// Create a specific context for Decks, where the project content is a string (Markdown)
export const { ProjectProvider: DeckProjectProvider, useProject: useDeckProject } = createProjectContext<string>();

interface DecksAppProps {
  showToast: (message: string, type: ToastType) => void;
  user: User;
}

const DecksAppContent: React.FC<DecksAppProps> = ({ showToast, user }) => {
  const [mode, setMode] = useState<Mode>('fast-track');
  const { project, clearProject } = useDeckProject();

  useEffect(() => {
    // Automatically switch to validated mode when a project is generated
    if (project) {
      setMode('validated');
    }
  }, [project]);

  const handleSetMode = (newMode: Mode) => {
    if (newMode === 'fast-track' && project) {
      if (window.confirm('Starting a new deck will clear your current validated session. Are you sure?')) {
        clearProject();
        setMode('fast-track');
      }
    } else if (newMode === 'validated' && !project) {
        showToast("Generate a deck in Fast Track mode first!", "info");
    } else {
      setMode(newMode);
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-8">
        <ModeToggle mode={mode} setMode={handleSetMode} />
      </div>

      {mode === 'fast-track' ? (
        <FastTrackMode showToast={showToast} user={user} />
      ) : (
        <ValidatedMode addToast={showToast} />
      )}
    </div>
  );
};


const DecksApp: React.FC<DecksAppProps> = (props) => (
  <DeckProjectProvider>
    <DecksAppContent {...props} />
  </DeckProjectProvider>
);

export default DecksApp;