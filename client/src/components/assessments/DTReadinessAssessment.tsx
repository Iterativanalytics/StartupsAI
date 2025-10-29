// ============================================================================
// LEAN DESIGN THINKING™ READINESS ASSESSMENT
// Assess user's LLDT mindset and capabilities
// ============================================================================

import React, { useState } from 'react';
import { Brain, Users, Zap, Wrench, Target, CheckCircle } from 'lucide-react';

interface AssessmentQuestion {
  id: string;
  question: string;
  dimension: string;
}

interface AssessmentResult {
  empathyScore: number;
  problemFramingAbility: number;
  iterationComfort: number;
  prototypingMindset: number;
  userCentricityIndex: number;
  overallReadiness: number;
  readinessLevel: string;
  strengths: string[];
  developmentAreas: string[];
  recommendations: string[];
}

export function LLDTReadinessAssessment({ onComplete }: { onComplete?: (result: AssessmentResult) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const questions: AssessmentQuestion[] = [
    // Empathy Questions
    { id: 'emp1', question: 'I enjoy learning about other people\'s experiences and perspectives', dimension: 'empathy' },
    { id: 'emp2', question: 'I can easily put myself in someone else\'s shoes', dimension: 'empathy' },
    { id: 'emp3', question: 'I actively seek to understand user needs before proposing solutions', dimension: 'empathy' },
    { id: 'emp4', question: 'I find it valuable to observe people in their natural environment', dimension: 'empathy' },
    
    // Problem Framing Questions
    { id: 'pf1', question: 'I can clearly articulate problems without jumping to solutions', dimension: 'problem_framing' },
    { id: 'pf2', question: 'I enjoy exploring different ways to frame a challenge', dimension: 'problem_framing' },
    { id: 'pf3', question: 'I question assumptions before accepting them as facts', dimension: 'problem_framing' },
    { id: 'pf4', question: 'I can identify the root cause of problems', dimension: 'problem_framing' },
    
    // Iteration Comfort Questions
    { id: 'ic1', question: 'I\'m comfortable with ambiguity and uncertainty', dimension: 'iteration' },
    { id: 'ic2', question: 'I see failure as a learning opportunity', dimension: 'iteration' },
    { id: 'ic3', question: 'I prefer to test ideas quickly rather than perfect them first', dimension: 'iteration' },
    { id: 'ic4', question: 'I\'m willing to pivot based on user feedback', dimension: 'iteration' },
    
    // Prototyping Mindset Questions
    { id: 'pm1', question: 'I enjoy building quick mockups to test ideas', dimension: 'prototyping' },
    { id: 'pm2', question: 'I believe in "show, don\'t tell" when communicating ideas', dimension: 'prototyping' },
    { id: 'pm3', question: 'I\'m comfortable with low-fidelity prototypes', dimension: 'prototyping' },
    { id: 'pm4', question: 'I see prototyping as a thinking tool, not just a deliverable', dimension: 'prototyping' },
    
    // User-Centricity Questions
    { id: 'uc1', question: 'I regularly interact with end users', dimension: 'user_centricity' },
    { id: 'uc2', question: 'I make decisions based on user data rather than assumptions', dimension: 'user_centricity' },
    { id: 'uc3', question: 'I involve users throughout the development process', dimension: 'user_centricity' },
    { id: 'uc4', question: 'I prioritize user needs over technical elegance', dimension: 'user_centricity' }
  ];

  const handleAnswer = (value: number) => {
    const question = questions[currentQuestion];
    setAnswers({ ...answers, [question.id]: value });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult({ ...answers, [question.id]: value });
    }
  };

  const calculateResult = (finalAnswers: Record<string, number>) => {
    // Calculate dimension scores
    const empathyScore = calculateDimensionScore(finalAnswers, 'empathy');
    const problemFramingAbility = calculateDimensionScore(finalAnswers, 'problem_framing');
    const iterationComfort = calculateDimensionScore(finalAnswers, 'iteration');
    const prototypingMindset = calculateDimensionScore(finalAnswers, 'prototyping');
    const userCentricityIndex = calculateDimensionScore(finalAnswers, 'user_centricity');
    
    // Calculate overall readiness
    const overallReadiness = (
      empathyScore * 0.3 +
      problemFramingAbility * 0.2 +
      iterationComfort * 0.2 +
      prototypingMindset * 0.15 +
      userCentricityIndex * 0.15
    );
    
    // Determine readiness level
    let readinessLevel = 'beginner';
    if (overallReadiness >= 80) readinessLevel = 'expert';
    else if (overallReadiness >= 65) readinessLevel = 'advanced';
    else if (overallReadiness >= 50) readinessLevel = 'intermediate';
    
    // Identify strengths and development areas
    const dimensions = [
      { name: 'Empathy', score: empathyScore },
      { name: 'Problem Framing', score: problemFramingAbility },
      { name: 'Iteration Comfort', score: iterationComfort },
      { name: 'Prototyping Mindset', score: prototypingMindset },
      { name: 'User-Centricity', score: userCentricityIndex }
    ];
    
    const strengths = dimensions.filter(d => d.score >= 70).map(d => d.name);
    const developmentAreas = dimensions.filter(d => d.score < 60).map(d => d.name);
    
    // Generate recommendations
    const recommendations = generateRecommendations(dimensions);
    
    const assessmentResult: AssessmentResult = {
      empathyScore,
      problemFramingAbility,
      iterationComfort,
      prototypingMindset,
      userCentricityIndex,
      overallReadiness,
      readinessLevel,
      strengths,
      developmentAreas,
      recommendations
    };
    
    setResult(assessmentResult);
    if (onComplete) {
      onComplete(assessmentResult);
    }
  };

  const calculateDimensionScore = (answers: Record<string, number>, dimension: string): number => {
    const dimensionQuestions = questions.filter(q => q.dimension === dimension);
    const total = dimensionQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    return (total / (dimensionQuestions.length * 5)) * 100;
  };

  const generateRecommendations = (dimensions: any[]): string[] => {
    const recs: string[] = [];
    
    dimensions.forEach(dim => {
      if (dim.score < 60) {
        if (dim.name === 'Empathy') {
          recs.push('Focus on conducting user interviews and building empathy maps');
        } else if (dim.name === 'Problem Framing') {
          recs.push('Practice creating POV statements and HMW questions');
        } else if (dim.name === 'Iteration Comfort') {
          recs.push('Start with rapid prototyping and embrace learning from failures');
        } else if (dim.name === 'Prototyping Mindset') {
          recs.push('Build low-fidelity prototypes to test ideas quickly');
        } else if (dim.name === 'User-Centricity') {
          recs.push('Involve users early and often in your development process');
        }
      }
    });
    
    return recs;
  };

  if (result) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Assessment Complete!</h1>
            <p className="text-gray-600">Your Lean Lean Design Thinking™™ Readiness Profile</p>
          </div>

          {/* Overall Score */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {result.overallReadiness.toFixed(0)}
            </div>
            <div className="text-xl text-gray-600 mb-4">Overall Readiness Score</div>
            <span className={`inline-block px-6 py-2 rounded-full font-semibold ${
              result.readinessLevel === 'expert' ? 'bg-green-100 text-green-700' :
              result.readinessLevel === 'advanced' ? 'bg-blue-100 text-blue-700' :
              result.readinessLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {result.readinessLevel.toUpperCase()}
            </span>
          </div>

          {/* Dimension Scores */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Scores by Dimension</h2>
            <div className="space-y-4">
              <ScoreBar label="Empathy" score={result.empathyScore} icon={Brain} />
              <ScoreBar label="Problem Framing" score={result.problemFramingAbility} icon={Target} />
              <ScoreBar label="Iteration Comfort" score={result.iterationComfort} icon={Zap} />
              <ScoreBar label="Prototyping Mindset" score={result.prototypingMindset} icon={Wrench} />
              <ScoreBar label="User-Centricity" score={result.userCentricityIndex} icon={Users} />
            </div>
          </div>

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-green-700">✨ Your Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {result.strengths.map((strength, index) => (
                  <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Development Areas */}
          {result.developmentAreas.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-blue-700">📈 Areas for Development</h3>
              <div className="flex flex-wrap gap-2">
                {result.developmentAreas.map((area, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-purple-700">💡 Personalized Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8 text-center">
            <a
              href="/design-thinking"
              className="inline-block px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Start Your Lean Lean Design Thinking™™ Journey
            </a>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {question.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {[
              { value: 5, label: 'Strongly Agree' },
              { value: 4, label: 'Agree' },
              { value: 3, label: 'Neutral' },
              { value: 2, label: 'Disagree' },
              { value: 1, label: 'Strongly Disagree' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dimension Indicator */}
        <div className="text-center text-sm text-gray-500">
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Assessing: {question.dimension.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, icon: Icon }: { label: string; score: number; icon: any }) {
  const getColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 65) return 'bg-blue-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <span className="font-medium">{label}</span>
        </div>
        <span className="font-semibold text-gray-700">{score.toFixed(0)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${getColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
