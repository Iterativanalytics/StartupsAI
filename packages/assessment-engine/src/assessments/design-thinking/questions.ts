export interface DTQuestion {
  id: string;
  category: 'empathy' | 'problem_framing' | 'iteration_comfort' | 'prototyping_mindset' | 'user_centricity';
  question: string;
  type: 'likert';
  scale: {
    min: number;
    max: number;
    labels: string[];
  };
  weight: number;
}

export const dtQuestions: DTQuestion[] = [
  // Empathy Dimension
  {
    id: 'dt_empathy_1',
    category: 'empathy',
    question: 'I regularly observe how people use products in their natural environment',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
    weight: 0.2
  },
  {
    id: 'dt_empathy_2',
    category: 'empathy',
    question: 'I can easily identify unspoken needs and frustrations',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_empathy_3',
    category: 'empathy',
    question: 'I prefer to understand the problem deeply before thinking about solutions',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_empathy_4',
    category: 'empathy',
    question: 'I actively seek feedback from users throughout the development process',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
    weight: 0.2
  },
  {
    id: 'dt_empathy_5',
    category: 'empathy',
    question: 'I can put myself in the user\'s shoes to understand their perspective',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },

  // Problem Framing Dimension
  {
    id: 'dt_problem_framing_1',
    category: 'problem_framing',
    question: 'I can reframe problems from multiple perspectives',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_problem_framing_2',
    category: 'problem_framing',
    question: 'I challenge assumptions about what the "real" problem is',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
    weight: 0.2
  },
  {
    id: 'dt_problem_framing_3',
    category: 'problem_framing',
    question: 'I use structured methods to define problems before solving them',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_problem_framing_4',
    category: 'problem_framing',
    question: 'I can distinguish between symptoms and root causes',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_problem_framing_5',
    category: 'problem_framing',
    question: 'I ask "Why?" multiple times to get to the core issue',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
    weight: 0.2
  },

  // Iteration Comfort Dimension
  {
    id: 'dt_iteration_comfort_1',
    category: 'iteration_comfort',
    question: 'I\'m comfortable throwing away work that doesn\'t test well',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_iteration_comfort_2',
    category: 'iteration_comfort',
    question: 'I view failure as valuable learning, not wasted effort',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_iteration_comfort_3',
    category: 'iteration_comfort',
    question: 'I prefer multiple small experiments over one big launch',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_iteration_comfort_4',
    category: 'iteration_comfort',
    question: 'I can quickly pivot when evidence shows a different direction',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_iteration_comfort_5',
    category: 'iteration_comfort',
    question: 'I embrace uncertainty and ambiguity in the creative process',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },

  // Prototyping Mindset Dimension
  {
    id: 'dt_prototyping_mindset_1',
    category: 'prototyping_mindset',
    question: 'I prefer to build quick prototypes to test ideas early',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_prototyping_mindset_2',
    category: 'prototyping_mindset',
    question: 'I can create effective prototypes with minimal resources',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_prototyping_mindset_3',
    category: 'prototyping_mindset',
    question: 'I use prototypes to communicate ideas to others',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
    weight: 0.2
  },
  {
    id: 'dt_prototyping_mindset_4',
    category: 'prototyping_mindset',
    question: 'I iterate on prototypes based on user feedback',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
    weight: 0.2
  },
  {
    id: 'dt_prototyping_mindset_5',
    category: 'prototyping_mindset',
    question: 'I can choose the right level of fidelity for different learning goals',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },

  // User Centricity Dimension
  {
    id: 'dt_user_centricity_1',
    category: 'user_centricity',
    question: 'I always consider the user\'s perspective when making decisions',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_user_centricity_2',
    category: 'user_centricity',
    question: 'I prioritize user needs over technical preferences',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_user_centricity_3',
    category: 'user_centricity',
    question: 'I regularly validate assumptions with real users',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
    weight: 0.2
  },
  {
    id: 'dt_user_centricity_4',
    category: 'user_centricity',
    question: 'I measure success by user satisfaction, not just technical metrics',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  },
  {
    id: 'dt_user_centricity_5',
    category: 'user_centricity',
    question: 'I can balance user needs with business constraints',
    type: 'likert',
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    weight: 0.2
  }
];

export const getQuestionsByCategory = (category: string) => {
  return dtQuestions.filter(q => q.category === category);
};

export const getAllCategories = () => {
  return [...new Set(dtQuestions.map(q => q.category))];
};
