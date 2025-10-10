import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Lightbulb, 
  RefreshCw, 
  Target, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface DTScores {
  empathy: number;
  problemFraming: number;
  iterationComfort: number;
  prototypingMindset: number;
  userCentricity: number;
}

interface DTRecommendation {
  category: string;
  score: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

interface DTReadinessWidgetProps {
  scores: DTScores;
  recommendations: DTRecommendation[];
  onRetakeAssessment?: () => void;
  onViewDetails?: () => void;
}

export function DTReadinessWidget({ 
  scores, 
  recommendations, 
  onRetakeAssessment,
  onViewDetails 
}: DTReadinessWidgetProps) {
  const overallScore = Math.round(
    (scores.empathy + scores.problemFraming + scores.iterationComfort + 
     scores.prototypingMindset + scores.userCentricity) / 5
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return 'Expert';
    if (score >= 60) return 'Advanced';
    if (score >= 40) return 'Intermediate';
    return 'Beginner';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <TrendingUp className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  const criticalGaps = recommendations.filter(r => r.score < 50);
  const strengths = recommendations.filter(r => r.score >= 70);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Design Thinking Readiness
          <Badge variant={overallScore >= 60 ? 'default' : 'secondary'}>
            {getReadinessLevel(overallScore)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{overallScore}/100</div>
          <div className="text-sm text-gray-600">Overall DT Readiness</div>
        </div>

        {/* Individual Scores */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getScoreIcon(scores.empathy)}
              <span className="text-sm font-medium">Empathy</span>
            </div>
            <span className={`text-sm font-medium ${getScoreColor(scores.empathy)}`}>
              {scores.empathy}/100
            </span>
          </div>
          <Progress value={scores.empathy} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getScoreIcon(scores.problemFraming)}
              <span className="text-sm font-medium">Problem Framing</span>
            </div>
            <span className={`text-sm font-medium ${getScoreColor(scores.problemFraming)}`}>
              {scores.problemFraming}/100
            </span>
          </div>
          <Progress value={scores.problemFraming} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getScoreIcon(scores.iterationComfort)}
              <span className="text-sm font-medium">Iteration Comfort</span>
            </div>
            <span className={`text-sm font-medium ${getScoreColor(scores.iterationComfort)}`}>
              {scores.iterationComfort}/100
            </span>
          </div>
          <Progress value={scores.iterationComfort} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getScoreIcon(scores.prototypingMindset)}
              <span className="text-sm font-medium">Prototyping</span>
            </div>
            <span className={`text-sm font-medium ${getScoreColor(scores.prototypingMindset)}`}>
              {scores.prototypingMindset}/100
            </span>
          </div>
          <Progress value={scores.prototypingMindset} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getScoreIcon(scores.userCentricity)}
              <span className="text-sm font-medium">User Centricity</span>
            </div>
            <span className={`text-sm font-medium ${getScoreColor(scores.userCentricity)}`}>
              {scores.userCentricity}/100
            </span>
          </div>
          <Progress value={scores.userCentricity} className="h-2" />
        </div>

        {/* Critical Gaps */}
        {criticalGaps.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Critical Gaps
            </h4>
            <ul className="text-sm text-red-600 space-y-1">
              {criticalGaps.slice(0, 2).map((gap, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-red-500">•</span>
                  <span>{gap.category}: {gap.gaps[0]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Strengths
            </h4>
            <ul className="text-sm text-green-600 space-y-1">
              {strengths.slice(0, 2).map((strength, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-500">•</span>
                  <span>{strength.category}: {strength.strengths[0]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          {onRetakeAssessment && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetakeAssessment}
              className="flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Retake Assessment
            </Button>
          )}
          {onViewDetails && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewDetails}
              className="flex items-center gap-1"
            >
              <Target className="w-3 h-3" />
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
