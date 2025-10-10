import React from 'react';
import { 
  FileText, 
  Building2, 
  Package, 
  TrendingUp, 
  Target, 
  Settings, 
  DollarSign, 
  Paperclip,
  CheckCircle,
  Circle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useBusinessPlan } from '@/contexts/BusinessPlanContext';
import { useBusinessPlanProgress } from '@/hooks/useBusinessPlanProgress';
import type { PlanChapter } from '@/constants/businessPlanStructure';

interface ChapterNavigationProps {
  chapters: PlanChapter[];
  activeChapterId: string;
  activeSectionId: string;
  onChapterSelect: (chapterId: string) => void;
  onSectionSelect: (chapterId: string, sectionId: string) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  FileText,
  Building2,
  Package,
  TrendingUp,
  Target,
  Settings,
  DollarSign,
  Paperclip
};

export const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  chapters,
  activeChapterId,
  activeSectionId,
  onChapterSelect,
  onSectionSelect
}) => {
  const { getSectionStatus } = useBusinessPlan();
  const { chapterProgress } = useBusinessPlanProgress();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-700 mb-4">Business Plan Structure</h3>
          
          {chapters.map((chapter) => {
            const IconComponent = iconMap[chapter.icon] || FileText;
            const progress = chapterProgress.find(p => p.chapterId === chapter.id);
            const isActive = activeChapterId === chapter.id;

            return (
              <div key={chapter.id} className="space-y-1">
                <button
                  onClick={() => onChapterSelect(chapter.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all',
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <IconComponent className={cn(
                      'w-4 h-4',
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    )} />
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">
                        {chapter.title}
                        {chapter.subtitle && (
                          <span className="ml-1">{chapter.subtitle}</span>
                        )}
                      </div>
                      {progress && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {progress.completed}/{progress.total} sections
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {progress && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {progress.percentage}%
                      </Badge>
                    )}
                    {getStatusIcon(progress?.status || 'not_started')}
                  </div>
                </button>

                {/* Sections */}
                {isActive && (
                  <div className="ml-7 mt-2 space-y-1 border-l-2 border-blue-200 pl-3">
                    {chapter.sections.map((section) => {
                      const sectionStatus = getSectionStatus(section.id);
                      const isSectionActive = activeSectionId === section.id;

                      return (
                        <button
                          key={section.id}
                          onClick={() => onSectionSelect(chapter.id, section.id)}
                          className={cn(
                            'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                            isSectionActive
                              ? 'bg-blue-100 text-blue-800 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span>{section.title}</span>
                            <div className="flex items-center gap-1">
                              {section.required && (
                                <span className="text-xs text-red-500">*</span>
                              )}
                              {getStatusIcon(sectionStatus)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Chapter Progress Bar */}
                {isActive && progress && (
                  <div className="ml-7 mt-2 px-3">
                    <Progress value={progress.percentage} className="h-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
