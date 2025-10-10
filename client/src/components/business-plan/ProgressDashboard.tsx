import React from 'react';
import { 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  Clock, 
  Target,
  Award,
  Calendar,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useBusinessPlan } from '@/contexts/BusinessPlanContext';
import { useBusinessPlanProgress } from '@/hooks/useBusinessPlanProgress';

export const ProgressDashboard: React.FC = () => {
  const { metadata, lastSaved } = useBusinessPlan();
  const { 
    progressStats, 
    chapterProgress,
    getNextSection,
    getEstimatedTimeRemaining
  } = useBusinessPlanProgress();

  const nextSection = getNextSection();
  const estimatedTime = getEstimatedTimeRemaining();

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Overall Progress
          </CardTitle>
          <CardDescription>
            Track your business plan completion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Completion</span>
              <span className="text-2xl font-bold text-blue-600">
                {progressStats.overallProgress}%
              </span>
            </div>
            <Progress value={progressStats.overallProgress} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              {progressStats.completedSections} of {progressStats.totalSections} sections completed
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-green-700">
                {progressStats.completedSections}
              </div>
              <div className="text-xs text-green-600">Completed</div>
            </div>

            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-yellow-700">
                {progressStats.inProgressSections}
              </div>
              <div className="text-xs text-yellow-600">In Progress</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FileText className="w-6 h-6 text-gray-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-700">
                {progressStats.notStartedSections}
              </div>
              <div className="text-xs text-gray-600">Not Started</div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Award className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-purple-700">
                {progressStats.totalWords.toLocaleString()}
              </div>
              <div className="text-xs text-purple-600">Words Written</div>
            </div>
          </div>

          {/* Word Count Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Word Count Progress</span>
              <span className="text-sm text-gray-600">
                {progressStats.totalWords.toLocaleString()} / {progressStats.estimatedTotalWords.toLocaleString()} words
              </span>
            </div>
            <Progress value={progressStats.completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      {nextSection && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-orange-900 mb-1">
                    Continue with: {nextSection.title}
                  </p>
                  <p className="text-sm text-orange-700">
                    Chapter: {nextSection.chapterTitle}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Next
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Estimated time remaining: {estimatedTime} minutes</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chapter Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chapter Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chapterProgress.map((chapter) => (
              <div key={chapter.chapterId} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{chapter.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">
                      {chapter.completed}/{chapter.total}
                    </span>
                    <Badge 
                      variant={
                        chapter.status === 'complete' ? 'default' :
                        chapter.status === 'in_progress' ? 'secondary' :
                        'outline'
                      }
                      className="text-xs"
                    >
                      {chapter.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={chapter.percentage} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Plan Name:</span>
            <span className="font-medium">{metadata.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Industry:</span>
            <span className="font-medium">{metadata.industry}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Stage:</span>
            <Badge variant="secondary">{metadata.businessStage}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Funding Stage:</span>
            <Badge variant="secondary">{metadata.fundingStage}</Badge>
          </div>
          {lastSaved && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Saved:</span>
              <span className="font-medium">
                {new Date(lastSaved).toLocaleString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
