import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { PlanChapter } from '@/constants/businessPlanStructure';
import { BUSINESS_PLAN_STRUCTURE, getAllSections } from '@/constants/businessPlanStructure';

export type SectionStatus = 'not_started' | 'in_progress' | 'complete';

export interface SectionContent {
  id: string;
  content: string;
  wordCount: number;
  lastModified: Date;
  status: SectionStatus;
  aiGenerated: boolean;
  aiScore?: number | undefined;
}

export interface IterativePlanMetadata {
  id?: string;
  name: string;
  industry: string;
  businessStage: 'idea' | 'startup' | 'growth' | 'mature';
  fundingStage: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'ipo';
  createdAt: Date;
  updatedAt: Date;
  completionPercentage: number;
}

export interface IterativePlanContextType {
  // Metadata
  metadata: IterativePlanMetadata;
  updateMetadata: (updates: Partial<IterativePlanMetadata>) => void;
  
  // Section content
  sectionContents: Record<string, SectionContent>;
  updateSectionContent: (sectionId: string, content: string, aiGenerated?: boolean) => void;
  getSectionContent: (sectionId: string) => string;
  getSectionStatus: (sectionId: string) => SectionStatus;
  getSectionWordCount: (sectionId: string) => number;
  
  // Progress tracking
  completedSections: string[];
  getOverallProgress: () => number;
  getChapterProgress: (chapterId: string) => number;
  
  // Auto-save
  isDirty: boolean;
  lastSaved: Date | null;
  save: () => Promise<void>;
  
  // Structure
  structure: PlanChapter[];
}

const IterativePlanContext = createContext<IterativePlanContextType | undefined>(undefined);

const STORAGE_KEY = 'iterative-plan-data';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

interface IterativePlanProviderProps {
  children: ReactNode;
  planId?: string | undefined;
}

export const IterativePlanProvider: React.FC<IterativePlanProviderProps> = ({ children, planId }) => {
  const [metadata, setMetadata] = useState<IterativePlanMetadata>({
    name: 'My Iterative Plan',
    industry: 'Technology',
    businessStage: 'startup',
    fundingStage: 'pre-seed',
    createdAt: new Date(),
    updatedAt: new Date(),
    completionPercentage: 0
  });

  const [sectionContents, setSectionContents] = useState<Record<string, SectionContent>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          if (data.metadata) {
            setMetadata({
              ...data.metadata,
              createdAt: new Date(data.metadata.createdAt),
              updatedAt: new Date(data.metadata.updatedAt)
            });
          }
          if (data.sectionContents) {
            const contents: Record<string, SectionContent> = {};
            Object.keys(data.sectionContents).forEach(key => {
              contents[key] = {
                ...data.sectionContents[key],
                lastModified: new Date(data.sectionContents[key].lastModified)
              };
            });
            setSectionContents(contents);
          }
          setLastSaved(new Date(data.lastSaved));
        }
      } catch (error) {
        console.error('Failed to load iterative plan data:', error);
      }
    };

    loadData();
  }, [planId]);

  // Auto-save
  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      save();
    }, AUTO_SAVE_INTERVAL);

    return () => clearTimeout(timer);
  }, [isDirty, sectionContents]);

  const save = useCallback(async () => {
    try {
      const dataToSave = {
        metadata: {
          ...metadata,
          updatedAt: new Date()
        },
        sectionContents,
        lastSaved: new Date()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      setLastSaved(new Date());
      setIsDirty(false);
      
      // TODO: Also save to backend API
      // await apiRequest('PUT', `/api/iterative-plans/${planId}`, dataToSave);
    } catch (error) {
      console.error('Failed to save iterative plan:', error);
      throw error;
    }
  }, [metadata, sectionContents, planId]);

  const updateMetadata = useCallback((updates: Partial<IterativePlanMetadata>) => {
    setMetadata(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date()
    }));
    setIsDirty(true);
  }, []);

  const calculateWordCount = (content: string): number => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const calculateStatus = (content: string, estimatedWords: number): SectionStatus => {
    const wordCount = calculateWordCount(content);
    if (wordCount === 0) return 'not_started';
    if (wordCount < estimatedWords * 0.7) return 'in_progress';
    return 'complete';
  };

  const updateSectionContent = useCallback((sectionId: string, content: string, aiGenerated = false) => {
    const section = getAllSections().find(s => s.id === sectionId);
    const estimatedWords = section?.estimatedWords || 300;
    
    const newSection: SectionContent = {
      id: sectionId,
      content,
      wordCount: calculateWordCount(content),
      lastModified: new Date(),
      status: calculateStatus(content, estimatedWords),
      aiGenerated,
      aiScore: aiGenerated ? 0.85 : undefined
    };
    
    setSectionContents(prev => ({
      ...prev,
      [sectionId]: newSection
    }));
    setIsDirty(true);
  }, []);

  const getSectionContent = useCallback((sectionId: string): string => {
    return sectionContents[sectionId]?.content || '';
  }, [sectionContents]);

  const getSectionStatus = useCallback((sectionId: string): SectionStatus => {
    return sectionContents[sectionId]?.status || 'not_started';
  }, [sectionContents]);

  const getSectionWordCount = useCallback((sectionId: string): number => {
    return sectionContents[sectionId]?.wordCount || 0;
  }, [sectionContents]);

  const completedSections = Object.values(sectionContents)
    .filter(section => section.status === 'complete')
    .map(section => section.id);

  const getOverallProgress = useCallback((): number => {
    const totalSections = getAllSections().length;
    const completed = completedSections.length;
    return totalSections > 0 ? Math.round((completed / totalSections) * 100) : 0;
  }, [completedSections]);

  const getChapterProgress = useCallback((chapterId: string): number => {
    const chapter = BUSINESS_PLAN_STRUCTURE.find(c => c.id === chapterId);
    if (!chapter) return 0;

    const totalSections = chapter.sections.length;
    const completed = chapter.sections.filter(s => 
      completedSections.includes(s.id)
    ).length;

    return totalSections > 0 ? Math.round((completed / totalSections) * 100) : 0;
  }, [completedSections]);

  // Update completion percentage in metadata
  useEffect(() => {
    const progress = getOverallProgress();
    if (progress !== metadata.completionPercentage) {
      setMetadata(prev => ({
        ...prev,
        completionPercentage: progress
      }));
    }
  }, [completedSections, getOverallProgress]);

  const value: IterativePlanContextType = {
    metadata,
    updateMetadata,
    sectionContents,
    updateSectionContent,
    getSectionContent,
    getSectionStatus,
    getSectionWordCount,
    completedSections,
    getOverallProgress,
    getChapterProgress,
    isDirty,
    lastSaved,
    save,
    structure: BUSINESS_PLAN_STRUCTURE
  };

  return (
    <IterativePlanContext.Provider value={value}>
      {children}
    </IterativePlanContext.Provider>
  );
};

export const useIterativePlan = (): IterativePlanContextType => {
  const context = useContext(IterativePlanContext);
  if (!context) {
    throw new Error('useIterativePlan must be used within an IterativePlanProvider');
  }
  return context;
};
