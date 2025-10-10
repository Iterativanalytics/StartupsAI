import { useMemo } from 'react';
import { useBusinessPlan } from '@/contexts/BusinessPlanContext';
import { BUSINESS_PLAN_STRUCTURE } from '@/constants/businessPlanStructure';

export interface ProgressStats {
  totalSections: number;
  completedSections: number;
  inProgressSections: number;
  notStartedSections: number;
  overallProgress: number;
  totalWords: number;
  estimatedTotalWords: number;
  completionRate: number;
}

export interface ChapterProgressInfo {
  chapterId: string;
  title: string;
  completed: number;
  total: number;
  percentage: number;
  status: 'not_started' | 'in_progress' | 'complete';
}

export const useBusinessPlanProgress = () => {
  const { getSectionStatus, getSectionWordCount, completedSections } = useBusinessPlan();

  const progressStats = useMemo((): ProgressStats => {
    let totalSections = 0;
    let completedCount = 0;
    let inProgressCount = 0;
    let notStartedCount = 0;
    let totalWords = 0;
    let estimatedTotalWords = 0;

    BUSINESS_PLAN_STRUCTURE.forEach(chapter => {
      chapter.sections.forEach(section => {
        totalSections++;
        const status = getSectionStatus(section.id);
        const wordCount = getSectionWordCount(section.id);
        
        totalWords += wordCount;
        estimatedTotalWords += section.estimatedWords;

        if (status === 'complete') completedCount++;
        else if (status === 'in_progress') inProgressCount++;
        else notStartedCount++;
      });
    });

    const overallProgress = totalSections > 0 
      ? Math.round((completedCount / totalSections) * 100) 
      : 0;

    const completionRate = estimatedTotalWords > 0
      ? Math.round((totalWords / estimatedTotalWords) * 100)
      : 0;

    return {
      totalSections,
      completedSections: completedCount,
      inProgressSections: inProgressCount,
      notStartedSections: notStartedCount,
      overallProgress,
      totalWords,
      estimatedTotalWords,
      completionRate
    };
  }, [getSectionStatus, getSectionWordCount]);

  const chapterProgress = useMemo((): ChapterProgressInfo[] => {
    return BUSINESS_PLAN_STRUCTURE.map(chapter => {
      const total = chapter.sections.length;
      const completed = chapter.sections.filter(s => 
        getSectionStatus(s.id) === 'complete'
      ).length;
      const inProgress = chapter.sections.filter(s => 
        getSectionStatus(s.id) === 'in_progress'
      ).length;

      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      let status: 'not_started' | 'in_progress' | 'complete' = 'not_started';
      if (completed === total) status = 'complete';
      else if (completed > 0 || inProgress > 0) status = 'in_progress';

      return {
        chapterId: chapter.id,
        title: chapter.title + (chapter.subtitle ? ' ' + chapter.subtitle : ''),
        completed,
        total,
        percentage,
        status
      };
    });
  }, [getSectionStatus]);

  const getNextSection = useMemo(() => {
    return () => {
      for (const chapter of BUSINESS_PLAN_STRUCTURE) {
        for (const section of chapter.sections) {
          const status = getSectionStatus(section.id);
          if (status === 'not_started' || status === 'in_progress') {
            return {
              chapterId: chapter.id,
              sectionId: section.id,
              title: section.title,
              chapterTitle: chapter.title
            };
          }
        }
      }
      return null;
    };
  }, [getSectionStatus]);

  const getRecommendedSections = useMemo(() => {
    return (limit = 3) => {
      const recommended: Array<{
        chapterId: string;
        sectionId: string;
        title: string;
        reason: string;
        priority: 'high' | 'medium' | 'low';
      }> = [];

      // First priority: Required sections not started
      BUSINESS_PLAN_STRUCTURE.forEach(chapter => {
        chapter.sections.forEach(section => {
          if (section.required && getSectionStatus(section.id) === 'not_started') {
            recommended.push({
              chapterId: chapter.id,
              sectionId: section.id,
              title: section.title,
              reason: 'Required section',
              priority: 'high'
            });
          }
        });
      });

      // Second priority: In-progress sections
      BUSINESS_PLAN_STRUCTURE.forEach(chapter => {
        chapter.sections.forEach(section => {
          if (getSectionStatus(section.id) === 'in_progress') {
            recommended.push({
              chapterId: chapter.id,
              sectionId: section.id,
              title: section.title,
              reason: 'Continue working',
              priority: 'medium'
            });
          }
        });
      });

      // Third priority: Optional sections not started
      BUSINESS_PLAN_STRUCTURE.forEach(chapter => {
        chapter.sections.forEach(section => {
          if (!section.required && getSectionStatus(section.id) === 'not_started') {
            recommended.push({
              chapterId: chapter.id,
              sectionId: section.id,
              title: section.title,
              reason: 'Enhance your plan',
              priority: 'low'
            });
          }
        });
      });

      return recommended.slice(0, limit);
    };
  }, [getSectionStatus]);

  const isChapterComplete = useMemo(() => {
    return (chapterId: string): boolean => {
      const chapter = BUSINESS_PLAN_STRUCTURE.find(c => c.id === chapterId);
      if (!chapter) return false;

      return chapter.sections.every(section => 
        getSectionStatus(section.id) === 'complete'
      );
    };
  }, [getSectionStatus]);

  const getEstimatedTimeRemaining = useMemo(() => {
    return (): number => {
      // Estimate 5 minutes per 100 words
      const remainingWords = progressStats.estimatedTotalWords - progressStats.totalWords;
      return Math.ceil((remainingWords / 100) * 5);
    };
  }, [progressStats]);

  return {
    progressStats,
    chapterProgress,
    getNextSection,
    getRecommendedSections,
    isChapterComplete,
    getEstimatedTimeRemaining
  };
};
