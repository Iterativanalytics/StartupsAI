import React, { useState, useEffect } from 'react';
import { Mode, ApplicationForm, ToastType, User } from '../../types';
import ApplicationFillerPage from './pages/ApplicationFillerPage';
import ApplicationsListPage from './pages/ApplicationsListPage';
import ModeToggle from './components/ModeToggle';
import { MOCK_APPLICATIONS } from './constants';
import { createProjectContext } from '../../contexts/ProjectContext';

// The "Project" for Forms is the application being filled.
export const { ProjectProvider: FormProjectProvider, useProject: useFormProject } = createProjectContext<ApplicationForm>();

interface FormsAppProps {
  addToast: (message: string, type: ToastType) => void;
  user: User;
}

const FormsAppContent: React.FC<FormsAppProps> = ({ addToast, user }) => {
  const [mode, setMode] = useState<Mode>('fast-track');
  const { project, generateProject, clearProject } = useFormProject();

  useEffect(() => {
    if (project) {
        setMode('validated');
    } else {
        setMode('fast-track');
    }
  }, [project]);


  const handleSelectApplication = (app: ApplicationForm) => {
    generateProject(app, [], app.name);
  };

  const handleBack = () => {
    clearProject();
  };

  const handleSetMode = (newMode: Mode) => {
    if (newMode === 'validated' && !project) {
      addToast("Select an application to enter Validated Mode.", "info");
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
        <ApplicationsListPage 
          applications={MOCK_APPLICATIONS} 
          onSelectApplication={handleSelectApplication} 
        />
      )}
    </div>
  );
};

const FormsApp: React.FC<FormsAppProps> = (props) => (
    <FormProjectProvider>
        <FormsAppContent {...props} />
    </FormProjectProvider>
);

export default FormsApp;