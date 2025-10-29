import React, { useState, useEffect } from 'react';
import { Mode, ApplicationForm, ToastType, User } from '@/types-hub';
import ApplicationFillerPage from './pages/ApplicationFillerPage';
import IterativFormsListPage from './pages/IterativFormsListPage';
import ModeToggle from './components/ModeToggle';
import { MOCK_APPLICATIONS } from './constants';
import { createProjectContext } from '@/contexts-hub/ProjectContext';

// The "Project" for Forms is the iterative form being filled.
export const { ProjectProvider: IterativFormProjectProvider, useProject: useIterativFormProject } = createProjectContext<ApplicationForm>();

interface IterativFormsAppProps {
  addToast: (message: string, type: ToastType) => void;
  user: User;
}

const IterativFormsAppContent: React.FC<IterativFormsAppProps> = ({ addToast, user }) => {
  const [mode, setMode] = useState<Mode>('fast-track');
  const { project, generateProject, clearProject } = useIterativFormProject();

  useEffect(() => {
    if (project) {
        setMode('validated');
    } else {
        setMode('fast-track');
    }
  }, [project]);


  const handleSelectIterativForm = (app: ApplicationForm) => {
    generateProject(app, [], app.name);
  };

  const handleBack = () => {
    clearProject();
  };

  const handleSetMode = (newMode: Mode) => {
    if (newMode === 'validated' && !project) {
      addToast("Select an iterative form to enter Validated Mode.", "info");
      return;
    }
    if (newMode === 'fast-track' && mode === 'validated') {
        clearProject();
    }
    setMode(newMode);
  };

  return (
    <div>
      <div className="flex justify-center mb-8">
        <ModeToggle mode={mode} setMode={handleSetMode} />
      </div>
      
      {mode === 'validated' && project ? (
        <ApplicationFillerPage 
          application={project.content}
          onBack={handleBack}
          addToast={addToast}
        />
      ) : (
        <IterativFormsListPage 
          applications={MOCK_APPLICATIONS} 
          onSelectApplication={handleSelectIterativForm} 
        />
      )}
    </div>
  );
};

const IterativFormsApp: React.FC<IterativFormsAppProps> = (props) => (
    <IterativFormProjectProvider>
        <IterativFormsAppContent {...props} />
    </IterativFormProjectProvider>
);

export default IterativFormsApp;