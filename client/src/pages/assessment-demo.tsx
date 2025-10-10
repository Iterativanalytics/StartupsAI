import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Brain, Target, Users, Lightbulb, Settings, BarChart } from 'lucide-react';

// Demo data from our RIASEC assessment
const sampleQuestions = [
  {
    id: 'R1',
    category: 'R' as const,
    question: 'I enjoy working with tools, machinery, or building physical products',
    scenario: 'Prototyping hardware, setting up physical infrastructure'
  },
  {
    id: 'E1',
    category: 'E' as const,
    question: 'I enjoy taking charge and leading teams toward ambitious goals',
    scenario: 'Leading projects, pitching investors, driving growth'
  },
  {
    id: 'I1',
    category: 'I' as const,
    question: 'I love analyzing data and discovering patterns to solve complex problems',
    scenario: 'Running experiments, analyzing market data, technical research'
  },
  {
    id: 'A1',
    category: 'A' as const,
    question: 'I thrive when creating something new and innovative',
    scenario: 'Product design, branding, creative problem-solving'
  },
  {
    id: 'S1',
    category: 'S' as const,
    question: 'I gain energy from collaborating with others and building relationships',
    scenario: 'Team building, networking, mentoring'
  },
  {
    id: 'C1',
    category: 'C' as const,
    question: 'I excel at creating systems, processes, and maintaining organization',
    scenario: 'Operations, financial management, compliance'
  }
];

const riasecCategories = {
  R: { name: 'Realistic', icon: Settings, color: 'bg-blue-500', description: 'Hands-on, practical, technical' },
  I: { name: 'Investigative', icon: Brain, color: 'bg-purple-500', description: 'Analytical, research-oriented' },
  A: { name: 'Artistic', icon: Lightbulb, color: 'bg-yellow-500', description: 'Creative, innovative, visionary' },
  S: { name: 'Social', icon: Users, color: 'bg-green-500', description: 'People-oriented, collaborative' },
  E: { name: 'Enterprising', icon: Target, color: 'bg-red-500', description: 'Leadership, persuasion, opportunity-seeking' },
  C: { name: 'Conventional', icon: BarChart, color: 'bg-gray-500', description: 'Organized, systematic, detail-oriented' }
};

const startupRoles = {
  'EIA': {
    role: 'Visionary Founder',
    description: 'Bold, creative leader who sees possibilities others miss',
    examples: ['Steve Jobs', 'Elon Musk']
  },
  'CES': {
    role: 'Execution Machine', 
    description: 'Disciplined leader who builds scalable, efficient operations',
    examples: ['Sheryl Sandberg', 'Tim Cook']
  },
  'ISA': {
    role: 'Thoughtful Builder',
    description: 'Deep thinker who builds meaningful products with strong user empathy',
    examples: ['DHH (Basecamp)', 'Mitchell Hashimoto']
  }
};

export default function AssessmentDemo() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponse = (questionId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const scores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    Object.entries(responses).forEach(([questionId, response]) => {
      const question = sampleQuestions.find(q => q.id === questionId);
      if (question) {
        scores[question.category] += response;
      }
    });

    // Normalize to percentages
    const maxScore = Math.max(...Object.values(scores));
    const normalizedScores = Object.entries(scores).map(([category, score]) => ({
      category,
      score: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
      ...riasecCategories[category as keyof typeof riasecCategories]
    }));

    // Get top 3 for primary code
    const topThree = normalizedScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    const primaryCode = topThree.map(t => t.category).join('');
    
    return { normalizedScores, primaryCode, topThree };
  };

  if (showResults) {
    const { normalizedScores, primaryCode, topThree } = calculateResults();
    const matchedRole = startupRoles[primaryCode as keyof typeof startupRoles] || {
      role: 'Unique Profile',
      description: 'Your combination represents a unique founder profile',
      examples: ['Your own path to create!']
    };

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            </div>
            <CardDescription>
              Here's your entrepreneur profile based on the RIASEC assessment
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* RIASEC Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Your RIASEC Profile</CardTitle>
              <CardDescription>Primary Code: <Badge variant="outline" className="font-mono">{primaryCode}</Badge></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {normalizedScores.map(({ category, name, score, color, icon: Icon }) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Startup Role Match */}
          <Card>
            <CardHeader>
              <CardTitle>Your Startup Role</CardTitle>
              <CardDescription>Based on your top traits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600">{matchedRole.role}</h3>
                  <p className="text-gray-600 mt-1">{matchedRole.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Similar Successful Founders:</h4>
                  <div className="flex flex-wrap gap-2">
                    {matchedRole.examples.map((example, index) => (
                      <Badge key={index} variant="secondary">{example}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Your Dominant Traits:</h4>
                  <div className="space-y-2">
                    {topThree.map(({ category, name, description, icon: Icon }, index) => (
                      <div key={category} className="flex items-start gap-2">
                        <Badge className="min-w-fit">{index + 1}</Badge>
                        <div>
                          <div className="flex items-center gap-1">
                            <Icon className="h-4 w-4" />
                            <span className="font-medium">{name}</span>
                          </div>
                          <p className="text-sm text-gray-600">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>This is just a demo of the RIASEC assessment - one part of our comprehensive system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h4 className="font-medium">Big Five Assessment</h4>
                <p className="text-sm text-gray-600">Personality traits analysis</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Settings className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h4 className="font-medium">AI Readiness</h4>
                <p className="text-sm text-gray-600">Digital competence evaluation</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Target className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <h4 className="font-medium">Composite Analysis</h4>
                <p className="text-sm text-gray-600">Complete founder profile</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button onClick={() => {
                setCurrentQuestion(0);
                setResponses({});
                setShowResults(false);
              }}>
                Try Assessment Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;
  const question = sampleQuestions[currentQuestion];
  const category = riasecCategories[question.category];
  const Icon = category.icon;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-6 w-6" />
              <CardTitle>RIASEC Assessment Demo</CardTitle>
            </div>
            <Badge variant="outline">
              {currentQuestion + 1} of {sampleQuestions.length}
            </Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${category.color}`} />
              <span className="text-sm font-medium text-gray-600">
                {category.name} - {category.description}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
            <p className="text-sm text-gray-600 italic">
              Startup context: {question.scenario}
            </p>
          </div>

          <div>
            <Label className="text-base font-medium">How much do you agree?</Label>
            <RadioGroup
              value={responses[question.id]?.toString() || ''}
              onValueChange={(value) => handleResponse(question.id, parseInt(value))}
              className="mt-3"
            >
              {[
                { value: 1, label: 'Strongly Disagree' },
                { value: 2, label: 'Disagree' },
                { value: 3, label: 'Neutral' },
                { value: 4, label: 'Agree' },
                { value: 5, label: 'Strongly Agree' }
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value.toString()} id={`q${question.id}-${value}`} />
                  <Label htmlFor={`q${question.id}-${value}`} className="flex-1 cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              Previous
            </Button>
            <Button 
              onClick={nextQuestion}
              disabled={!responses[question.id]}
            >
              {currentQuestion === sampleQuestions.length - 1 ? 'See Results' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

