import { FounderArchetype } from '@/types-hub';

export const ASSESSMENT_QUESTIONS = [
  // RIASEC Questions (Sample - 1 per category for brevity)
  { id: 'r1', category: 'RIASEC', text: 'I enjoy working with my hands or with tools.' },
  { id: 'i1', category: 'RIASEC', text: 'I like to analyze data and solve complex problems.' },
  { id: 'a1', category: 'RIASEC', text: 'I am creative and enjoy expressing myself through art, music, or writing.' },
  { id: 's1', category: 'RIASEC', text: 'I enjoy helping, teaching, or counseling others.' },
  { id: 'e1', category: 'RIASEC', text: 'I am persuasive and enjoy leading teams or selling ideas.' },
  { id: 'c1', category: 'RIASEC', text: 'I am organized, detail-oriented, and enjoy working with structured data.' },

  // Big Five Questions (Sample - 1 per category)
  { id: 'o1', category: 'Big Five', text: 'I am full of new ideas.' },
  { id: 'c2', category: 'Big Five', text: 'I am always prepared and organized.' },
  { id: 'e2', category: 'Big Five', text: 'I am the life of the party.' },
  { id: 'a2', category: 'Big Five', text: 'I sympathize with others\' feelings.' },
  { id: 'n1', category: 'Big Five', text: 'I get stressed out easily.' },

  // AI Readiness Questions (Sample - 1 per category)
  { id: 'ai_aw1', category: 'AI Readiness', text: 'I can clearly explain what Generative AI is and how it differs from traditional AI.' },
  { id: 'ai_ad1', category: 'AI Readiness', text: 'I regularly use AI tools like ChatGPT or GitHub Copilot in my daily work.' },
  { id: 'ai_im1', category: 'AI Readiness', text: 'I am confident in my ability to identify and implement AI solutions for business problems.' },
  { id: 'ai_st1', category: 'AI Readiness', text: 'I think about how AI can create a long-term competitive advantage for my business.' },
];

export const FOUNDER_ARCHETYPES: Record<string, FounderArchetype> = {
    'visionary-innovator': {
        name: 'Visionary Innovator',
        code: 'EIA',
        description: 'A bold, creative leader who sees possibilities others miss and inspires teams to build the future.',
        strengths: ['Visionary Thinking', 'Innovation & Creativity', 'Persuasion & Storytelling', 'High Risk Tolerance'],
        challenges: ['Detail Orientation', 'Operational Execution', 'Patience & Pacing', 'Objective Decision-Making'],
    },
    'execution-machine': {
        name: 'Execution Machine',
        code: 'CES',
        description: 'A disciplined, operations-focused leader who excels at building scalable systems and processes.',
        strengths: ['Operational Excellence', 'Scalable Systems', 'Discipline & Focus', 'Data-Driven Management'],
        challenges: ['Radical Innovation', 'Adapting to Sudden Change', 'Creative Brainstorming', 'Embracing Ambiguity'],
    },
    'thoughtful-builder': {
        name: 'Thoughtful Builder',
        code: 'ISA',
        description: 'A deep thinker and product-focused leader who builds meaningful, high-quality products with a strong user empathy.',
        strengths: ['Product Quality & Craftsmanship', 'Deep User Empathy', 'Technical Depth', 'Long-Term Thinking'],
        challenges: ['Aggressive Sales & Marketing', 'Networking & Fundraising', 'Making "Good Enough" Decisions', 'Delegation'],
    },
    'collaborative-innovator': {
        name: 'Collaborative Innovator',
        code: 'SEA',
        description: 'A people-focused leader who builds through partnerships, team-building, and creating a strong culture.',
        strengths: ['Team Building & Culture', 'Networking & Partnerships', 'Collaborative Ideation', 'Inspiring Loyalty'],
        challenges: ['Making Unpopular Decisions', 'Managing Conflict Directly', 'Prioritizing Performance over Harmony', 'Deep Technical Work'],
    },
    'default': {
        name: 'Balanced Founder',
        code: 'N/A',
        description: 'A founder with a balanced profile across multiple dimensions.',
        strengths: ['Adaptability', 'Versatility', 'Well-Rounded Perspective'],
        challenges: ['Lacking a "Superpower"', 'Can be a jack-of-all-trades, master-of-none'],
    }
};
