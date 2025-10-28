import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import { Project, Assumption } from '../types';

// This is a factory function to create a typed Project context, provider, and hook.
export function createProjectContext<T>() {
  // Create a context with a specific shape.
  const ProjectContext = createContext<{
    project: Project<T> | null;
    setProject: React.Dispatch<React.SetStateAction<Project<T> | null>>;
  } | undefined>(undefined);

  // The Provider component that will wrap the part of the app that needs this context.
  const ProjectProvider = ({ children }: PropsWithChildren<{}>) => {
    const [project, setProject] = useState<Project<T> | null>(null);
    return (
      <ProjectContext.Provider value={{ project, setProject }}>
        {children}
      </ProjectContext.Provider>
    );
  };
  
  // A custom hook to easily access the context's value.
  const useProject = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
      throw new Error('useProject must be used within a ProjectProvider');
    }
    
    const { project, setProject } = context;

    // Abstracted logic to update the context
    const generateProject = (content: T, assumptions: Assumption[], name: string, year?: number) => {
      setProject({ content, assumptions, name, year });
    };

    const clearProject = () => {
      setProject(null);
    };

    const updateProjectContent = (newContent: T) => {
        setProject(prev => {
            if (!prev) return null;
            return { ...prev, content: newContent };
        });
    };
    
    const updateSectionContent = (sectionId: string, sectionContent: any) => {
        setProject(prev => {
            if (!prev) return null;
            const newContent = {
                ...(prev.content as object),
                [sectionId]: sectionContent,
            };
            return { ...prev, content: newContent as T };
        });
    };

    return { project, generateProject, clearProject, updateProjectContent, updateSectionContent };
  };

  // Return the provider and hook to be used in the application.
  return { ProjectProvider, useProject };
}