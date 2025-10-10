/**
 * Assessment Flow Component
 * 
 * Complete assessment experience with:
 * - Assessment type selection
 * - Question-by-question flow
 * - Progress tracking
 * - Results display
 * - Agent adaptation trigger
 */

import React, { useState } from 'react';
import { useAssessment, useAssessmentResults } from '../../hooks/useAssessment';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

// ============================================================================
// ASSESSMENT TYPE SELECTOR
// ============================================================================

function AssessmentTypeSelector({ 
  assessmentTypes, 
  onSelect 
}: { 
  assessmentTypes: any[]; 
  onSelect: (type: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Choose Your Assessment</h2>
        <p className="text-muted-foreground">
          Select an assessment to get personalized insights and optimize your AI agents
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {assessmentTypes?.map((type) => (
          <Card 
            key={type.id} 
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelect(type.id)}
          >
            <CardHeader>
              <CardTitle>{type.name}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{type.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Questions:</span>
                  <span className="font-medium">{type.questions}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium mb-2">Benefits:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {type.benefits.slice(0, 3).map((benefit: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full mt-4">
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// QUESTION DISPLAY
// ============================================================================

function QuestionDisplay({
  question,
  onAnswer,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
  isSubmitting
}: {
  question: any;
  onAnswer: (value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
}) {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const handleAnswer = (value: number) => {
    setSelectedValue(value);
    onAnswer(value);
  };

  const handleNext = () => {
    if (selectedValue !== null) {
      onNext();
      setSelectedValue(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.text}</CardTitle>
          {question.category && (
            <CardDescription>Category: {question.category}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedValue?.toString()}
            onValueChange={(value) => handleAnswer(parseInt(value))}
            className="space-y-3"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                <RadioGroupItem value={value.toString()} id={`option-${value}`} />
                <Label 
                  htmlFor={`option-${value}`} 
                  className="flex-1 cursor-pointer font-normal"
                >
                  {value === 1 && 'Strongly Disagree'}
                  {value === 2 && 'Disagree'}
                  {value === 3 && 'Neutral'}
                  {value === 4 && 'Agree'}
                  {value === 5 && 'Strongly Agree'}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={selectedValue === null || isSubmitting}
        >
          {isLastQuestion ? 'Complete Assessment' : 'Next Question'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// RESULTS DISPLAY
// ============================================================================

function ResultsDisplay({ 
  results, 
  onAdaptAgents,
  isAdapting 
}: { 
  results: any;
  onAdaptAgents: () => void;
  isAdapting: boolean;
}) {
  return (
    <div className="space-y-6">
      <Card className="border-green-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <CardTitle>Assessment Complete!</CardTitle>
          </div>
          <CardDescription>
            Your results are ready. Review your profile below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.results?.scores && (
              <div>
                <h3 className="font-semibold mb-3">Your Scores:</h3>
                <div className="grid gap-3">
                  {Object.entries(results.results.scores).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                      <div className="flex items-center gap-3">
                        <Progress value={value} className="w-32" />
                        <span className="font-medium w-12 text-right">{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.results?.interpretation && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Interpretation:</h3>
                <p className="text-muted-foreground">{results.results.interpretation}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button 
                onClick={onAdaptAgents} 
                disabled={isAdapting}
                className="w-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isAdapting ? 'Adapting Agents...' : 'Optimize My AI Agents'}
              </Button>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Your AI agents will adapt their personality and communication style based on your assessment
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN ASSESSMENT FLOW
// ============================================================================

export function AssessmentFlow() {
  const [showResults, setShowResults] = useState(false);
  const [completedAssessmentType, setCompletedAssessmentType] = useState<string | null>(null);

  const {
    assessmentTypes,
    currentSession,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progressPercentage,
    isLoadingTypes,
    isStarting,
    isSubmitting,
    isCompleting,
    isAdaptingAgents,
    isLastQuestion,
    canGoPrevious,
    startNewAssessment,
    answerQuestion,
    finishAssessment,
    cancelAssessment,
    goToNextQuestion,
    goToPreviousQuestion,
    adaptAgents
  } = useAssessment();

  const { results } = useAssessmentResults(completedAssessmentType || undefined);

  const handleSelectAssessment = async (assessmentType: string) => {
    try {
      await startNewAssessment(assessmentType);
      setShowResults(false);
    } catch (error) {
      console.error('Failed to start assessment:', error);
    }
  };

  const handleAnswerQuestion = async (value: number) => {
    try {
      if (!currentQuestion) return;
      await answerQuestion(currentQuestion.id, value);
      
      if (isLastQuestion) {
        // Complete assessment
        await finishAssessment();
        setCompletedAssessmentType(currentSession?.assessmentType || null);
        setShowResults(true);
      } else {
        goToNextQuestion();
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleAdaptAgents = async () => {
    try {
      await adaptAgents();
      alert('Your AI agents have been optimized based on your assessment!');
    } catch (error) {
      console.error('Failed to adapt agents:', error);
      alert('Failed to adapt agents. Please try again.');
    }
  };

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this assessment? Your progress will be lost.')) {
      try {
        await cancelAssessment();
      } catch (error) {
        console.error('Failed to cancel assessment:', error);
      }
    }
  };

  // Show loading state
  if (isLoadingTypes) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assessments...</p>
        </div>
      </div>
    );
  }

  // Show results
  if (showResults && results) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <ResultsDisplay 
          results={results}
          onAdaptAgents={handleAdaptAgents}
          isAdapting={isAdaptingAgents}
        />
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => {
            setShowResults(false);
            setCompletedAssessmentType(null);
          }}>
            Take Another Assessment
          </Button>
        </div>
      </div>
    );
  }

  // Show assessment in progress
  if (currentSession && currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">
              {assessmentTypes?.find(t => t.id === currentSession.assessmentType)?.name}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        <QuestionDisplay
          question={currentQuestion}
          onAnswer={handleAnswerQuestion}
          onNext={goToNextQuestion}
          onPrevious={goToPreviousQuestion}
          canGoNext={true}
          canGoPrevious={canGoPrevious}
          isLastQuestion={isLastQuestion}
          isSubmitting={isSubmitting || isCompleting}
        />
      </div>
    );
  }

  // Show assessment type selector
  return (
    <div className="max-w-5xl mx-auto py-8">
      <AssessmentTypeSelector
        assessmentTypes={assessmentTypes || []}
        onSelect={handleSelectAssessment}
      />
    </div>
  );
}
