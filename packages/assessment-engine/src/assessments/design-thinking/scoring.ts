import { dtQuestions } from './questions.ts';

export interface AssessmentResponse {
  questionId: string;
  value: number;
}

export interface DTScores {
  empathy: number;
  problemFraming: number;
  iterationComfort: number;
  prototypingMindset: number;
  userCentricity: number;
}

export interface DTRecommendation {
  category: string;
  score: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

export interface DTReadinessProfile {
  scores: DTScores;
  overallScore: number;
  readinessLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  criticalGaps: string[];
  recommendations: DTRecommendation[];
  crossAssessmentPatterns: string[];
}

export function calculateDTScores(responses: AssessmentResponse[]): DTScores {
  const scores: DTScores = {
    empathy: 0,
    problemFraming: 0,
    iterationComfort: 0,
    prototypingMindset: 0,
    userCentricity: 0
  };

  // Calculate weighted scores for each category
  const categoryTotals: { [key: string]: number } = {};
  const categoryWeights: { [key: string]: number } = {};

  responses.forEach(response => {
    const question = dtQuestions.find(q => q.id === response.questionId);
    if (question) {
      const category = question.category;
      const weightedScore = response.value * question.weight;
      
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
        categoryWeights[category] = 0;
      }
      
      categoryTotals[category] += weightedScore;
      categoryWeights[category] += question.weight;
    }
  });

  // Normalize scores to 0-100
  Object.keys(categoryTotals).forEach(category => {
    const totalWeight = categoryWeights[category];
    if (totalWeight > 0) {
      const normalizedScore = (categoryTotals[category] / totalWeight) * 20; // Scale to 0-100
      scores[category as keyof DTScores] = Math.round(normalizedScore);
    }
  });

  return scores;
}

export function generateDTRecommendations(scores: DTScores): DTRecommendation[] {
  const recommendations: DTRecommendation[] = [];
  
  Object.entries(scores).forEach(([category, score]) => {
    const level = getScoreLevel(score);
    const strengths = getStrengths(category, score);
    const gaps = getGaps(category, score);
    const categoryRecommendations = getRecommendations(category, score);
    
    recommendations.push({
      category,
      score,
      level,
      strengths,
      gaps,
      recommendations: categoryRecommendations
    });
  });
  
  return recommendations;
}

export function detectCrossAssessmentPatterns(
  dtScores: DTScores,
  existingScores?: { [key: string]: number }
): string[] {
  const patterns: string[] = [];
  
  // Technology-First Trap: High AI Readiness + Low Empathy
  if (existingScores?.aiReadiness && existingScores.aiReadiness > 70 && dtScores.empathy < 50) {
    patterns.push('Technology-First Trap: High technical skills but low empathy may lead to building wrong products');
  }
  
  // Analysis Paralysis: High Conscientiousness + Low Iteration Comfort
  if (existingScores?.conscientiousness && existingScores.conscientiousness > 70 && dtScores.iterationComfort < 50) {
    patterns.push('Analysis Paralysis: High planning tendency but low iteration comfort may lead to over-planning');
  }
  
  // Empathy Without Execution: High Empathy + Low RIASEC-C
  if (dtScores.empathy > 70 && existingScores?.riasecC && existingScores.riasecC < 50) {
    patterns.push('Empathy Without Execution: High empathy but low execution focus may lead to endless research');
  }
  
  // Solution-First Bias: Low Problem Framing + High Prototyping
  if (dtScores.problemFraming < 50 && dtScores.prototypingMindset > 70) {
    patterns.push('Solution-First Bias: Tendency to jump to solutions without proper problem framing');
  }
  
  // Perfectionist Trap: High User Centricity + Low Iteration Comfort
  if (dtScores.userCentricity > 70 && dtScores.iterationComfort < 50) {
    patterns.push('Perfectionist Trap: High user focus but low iteration comfort may lead to delayed launches');
  }
  
  return patterns;
}

export function generateDTReadinessProfile(
  responses: AssessmentResponse[],
  existingScores?: { [key: string]: number }
): DTReadinessProfile {
  const scores = calculateDTScores(responses);
  const overallScore = Math.round(
    (scores.empathy + scores.problemFraming + scores.iterationComfort + 
     scores.prototypingMindset + scores.userCentricity) / 5
  );
  
  const readinessLevel = getOverallReadinessLevel(overallScore);
  const recommendations = generateDTRecommendations(scores);
  const criticalGaps = recommendations
    .filter(r => r.score < 50)
    .map(r => `${r.category}: ${r.gaps.join(', ')}`);
  
  const crossAssessmentPatterns = detectCrossAssessmentPatterns(scores, existingScores);
  
  return {
    scores,
    overallScore,
    readinessLevel,
    criticalGaps,
    recommendations,
    crossAssessmentPatterns
  };
}

function getScoreLevel(score: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  if (score >= 80) return 'expert';
  if (score >= 60) return 'advanced';
  if (score >= 40) return 'intermediate';
  return 'beginner';
}

function getOverallReadinessLevel(score: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  if (score >= 80) return 'expert';
  if (score >= 60) return 'advanced';
  if (score >= 40) return 'intermediate';
  return 'beginner';
}

function getStrengths(category: string, score: number): string[] {
  if (score < 60) return [];
  
  const strengthsMap: { [key: string]: string[] } = {
    empathy: [
      'Strong ability to understand user needs',
      'Excellent at building user relationships',
      'Natural talent for user research'
    ],
    problemFraming: [
      'Skilled at identifying root causes',
      'Excellent at reframing problems',
      'Strong analytical thinking'
    ],
    iterationComfort: [
      'Comfortable with rapid experimentation',
      'Embraces failure as learning',
      'Adaptable to change'
    ],
    prototypingMindset: [
      'Quick to build and test ideas',
      'Skilled at rapid prototyping',
      'Effective at communicating through prototypes'
    ],
    userCentricity: [
      'Always considers user perspective',
      'Balances user needs with business goals',
      'Strong user advocacy skills'
    ]
  };
  
  return strengthsMap[category] || [];
}

function getGaps(category: string, score: number): string[] {
  if (score >= 60) return [];
  
  const gapsMap: { [key: string]: string[] } = {
    empathy: [
      'Limited user research experience',
      'Difficulty understanding user perspectives',
      'Tendency to make assumptions about users'
    ],
    problemFraming: [
      'Jumps to solutions without proper problem analysis',
      'Difficulty identifying root causes',
      'Limited experience with problem reframing'
    ],
    iterationComfort: [
      'Uncomfortable with failure and uncertainty',
      'Prefers planning over experimentation',
      'Resistant to change and pivots'
    ],
    prototypingMindset: [
      'Tends to over-engineer solutions',
      'Limited prototyping experience',
      'Difficulty with rapid iteration'
    ],
    userCentricity: [
      'Focuses more on technical solutions than user needs',
      'Limited user validation experience',
      'Difficulty balancing user and business needs'
    ]
  };
  
  return gapsMap[category] || [];
}

function getRecommendations(category: string, score: number): string[] {
  const recommendationsMap: { [key: string]: { [key: string]: string[] } } = {
    empathy: {
      low: [
        'Conduct user interviews to understand pain points',
        'Use empathy mapping techniques',
        'Observe users in their natural environment',
        'Practice active listening skills'
      ],
      medium: [
        'Expand user research methods',
        'Develop deeper user personas',
        'Create user journey maps'
      ],
      high: [
        'Mentor others in empathy techniques',
        'Lead user research initiatives',
        'Share empathy best practices'
      ]
    },
    problemFraming: {
      low: [
        'Learn problem reframing techniques',
        'Practice the "5 Whys" method',
        'Use structured problem-solving frameworks',
        'Challenge assumptions regularly'
      ],
      medium: [
        'Develop advanced problem-framing skills',
        'Teach problem-framing to others',
        'Create problem-framing templates'
      ],
      high: [
        'Lead problem-framing workshops',
        'Develop organizational problem-framing processes',
        'Mentor others in problem-framing'
      ]
    },
    iterationComfort: {
      low: [
        'Start with small, low-risk experiments',
        'Practice rapid prototyping',
        'Learn to embrace failure as learning',
        'Set up regular feedback loops'
      ],
      medium: [
        'Increase experiment frequency',
        'Develop faster iteration cycles',
        'Create experimentation frameworks'
      ],
      high: [
        'Lead experimentation initiatives',
        'Mentor others in iteration techniques',
        'Develop organizational experimentation culture'
      ]
    },
    prototypingMindset: {
      low: [
        'Start with paper prototypes',
        'Learn rapid prototyping techniques',
        'Practice building quick mockups',
        'Use prototyping tools and templates'
      ],
      medium: [
        'Develop advanced prototyping skills',
        'Create prototyping toolkits',
        'Teach prototyping to others'
      ],
      high: [
        'Lead prototyping workshops',
        'Develop organizational prototyping standards',
        'Mentor others in prototyping'
      ]
    },
    userCentricity: {
      low: [
        'Regularly validate with real users',
        'Develop user personas and journey maps',
        'Practice user advocacy',
        'Learn user research methods'
      ],
      medium: [
        'Expand user validation techniques',
        'Develop user feedback systems',
        'Create user-centric processes'
      ],
      high: [
        'Lead user-centric initiatives',
        'Develop organizational user-centric culture',
        'Mentor others in user-centricity'
      ]
    }
  };
  
  const level = score < 40 ? 'low' : score < 70 ? 'medium' : 'high';
  return recommendationsMap[category]?.[level] || [];
}
