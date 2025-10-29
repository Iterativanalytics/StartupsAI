import { FounderArchetype } from '@/types-hub';

export const ASSESSMENT_QUESTIONS = [
  // RIASEC Questions - Realistic (3 questions)
  { id: 'r1', category: 'RIASEC', text: 'I enjoy working with my hands or with tools.' },
  { id: 'r2', category: 'RIASEC', text: 'I prefer practical, hands-on activities over theoretical discussions.' },
  { id: 'r3', category: 'RIASEC', text: 'I like to build, fix, or maintain things.' },

  // RIASEC Questions - Investigative (3 questions)
  { id: 'i1', category: 'RIASEC', text: 'I like to analyze data and solve complex problems.' },
  { id: 'i2', category: 'RIASEC', text: 'I enjoy conducting research and experiments.' },
  { id: 'i3', category: 'RIASEC', text: 'I am curious about how things work and why they happen.' },

  // RIASEC Questions - Artistic (3 questions)
  { id: 'a1', category: 'RIASEC', text: 'I am creative and enjoy expressing myself through art, music, or writing.' },
  { id: 'a2', category: 'RIASEC', text: 'I appreciate beauty and aesthetic experiences.' },
  { id: 'a3', category: 'RIASEC', text: 'I enjoy coming up with original ideas and solutions.' },

  // RIASEC Questions - Social (3 questions)
  { id: 's1', category: 'RIASEC', text: 'I enjoy helping, teaching, or counseling others.' },
  { id: 's2', category: 'RIASEC', text: 'I am good at understanding people\'s emotions and motivations.' },
  { id: 's3', category: 'RIASEC', text: 'I prefer working in teams rather than alone.' },

  // RIASEC Questions - Enterprising (3 questions)
  { id: 'e1', category: 'RIASEC', text: 'I am persuasive and enjoy leading teams or selling ideas.' },
  { id: 'e2', category: 'RIASEC', text: 'I am comfortable taking risks and making decisions under pressure.' },
  { id: 'e3', category: 'RIASEC', text: 'I enjoy competing and winning in business situations.' },

  // RIASEC Questions - Conventional (3 questions)
  { id: 'c1', category: 'RIASEC', text: 'I am organized, detail-oriented, and enjoy working with structured data.' },
  { id: 'c2', category: 'RIASEC', text: 'I prefer following established procedures and guidelines.' },
  { id: 'c3', category: 'RIASEC', text: 'I like working in environments with clear rules and expectations.' },

  // Big Five Questions - Openness (4 questions)
  { id: 'o1', category: 'Big Five', text: 'I am full of new ideas.' },
  { id: 'o2', category: 'Big Five', text: 'I enjoy exploring new concepts and theories.' },
  { id: 'o3', category: 'Big Five', text: 'I am open to trying new experiences and activities.' },
  { id: 'o4', category: 'Big Five', text: 'I appreciate art, music, and literature.' },

  // Big Five Questions - Conscientiousness (4 questions)
  { id: 'c4', category: 'Big Five', text: 'I am always prepared and organized.' },
  { id: 'c5', category: 'Big Five', text: 'I pay attention to details and rarely make mistakes.' },
  { id: 'c6', category: 'Big Five', text: 'I follow through on my commitments and responsibilities.' },
  { id: 'c7', category: 'Big Five', text: 'I prefer to plan ahead rather than improvise.' },

  // Big Five Questions - Extraversion (4 questions)
  { id: 'e4', category: 'Big Five', text: 'I am the life of the party.' },
  { id: 'e5', category: 'Big Five', text: 'I feel comfortable in large groups and social gatherings.' },
  { id: 'e6', category: 'Big Five', text: 'I am energized by being around other people.' },
  { id: 'e7', category: 'Big Five', text: 'I enjoy being the center of attention.' },

  // Big Five Questions - Agreeableness (4 questions)
  { id: 'a4', category: 'Big Five', text: 'I sympathize with others\' feelings.' },
  { id: 'a5', category: 'Big Five', text: 'I try to avoid conflicts and disagreements.' },
  { id: 'a6', category: 'Big Five', text: 'I trust people and believe in their good intentions.' },
  { id: 'a7', category: 'Big Five', text: 'I am willing to help others even when it inconveniences me.' },

  // Big Five Questions - Neuroticism (4 questions)
  { id: 'n1', category: 'Big Five', text: 'I get stressed out easily.' },
  { id: 'n2', category: 'Big Five', text: 'I worry about things that might go wrong.' },
  { id: 'n3', category: 'Big Five', text: 'I often feel anxious or nervous.' },
  { id: 'n4', category: 'Big Five', text: 'I have frequent mood swings.' },

  // AI Readiness Questions - Awareness (4 questions)
  { id: 'ai_aw1', category: 'AI Readiness', text: 'I can clearly explain what Generative AI is and how it differs from traditional AI.' },
  { id: 'ai_aw2', category: 'AI Readiness', text: 'I understand the current capabilities and limitations of AI technology.' },
  { id: 'ai_aw3', category: 'AI Readiness', text: 'I stay informed about the latest developments in AI and machine learning.' },
  { id: 'ai_aw4', category: 'AI Readiness', text: 'I can identify which business problems could potentially be solved with AI.' },

  // AI Readiness Questions - Adoption (4 questions)
  { id: 'ai_ad1', category: 'AI Readiness', text: 'I regularly use AI tools like ChatGPT or GitHub Copilot in my daily work.' },
  { id: 'ai_ad2', category: 'AI Readiness', text: 'I have integrated AI tools into my business processes and workflows.' },
  { id: 'ai_ad3', category: 'AI Readiness', text: 'I am comfortable experimenting with new AI tools and technologies.' },
  { id: 'ai_ad4', category: 'AI Readiness', text: 'I actively seek out AI solutions to improve my productivity.' },

  // AI Readiness Questions - Implementation (4 questions)
  { id: 'ai_im1', category: 'AI Readiness', text: 'I am confident in my ability to identify and implement AI solutions for business problems.' },
  { id: 'ai_im2', category: 'AI Readiness', text: 'I have the technical skills needed to work with AI tools and platforms.' },
  { id: 'ai_im3', category: 'AI Readiness', text: 'I can evaluate and select appropriate AI tools for specific business needs.' },
  { id: 'ai_im4', category: 'AI Readiness', text: 'I am able to train or fine-tune AI models for my specific use cases.' },

  // AI Readiness Questions - Strategy (4 questions)
  { id: 'ai_st1', category: 'AI Readiness', text: 'I think about how AI can create a long-term competitive advantage for my business.' },
  { id: 'ai_st2', category: 'AI Readiness', text: 'I have a clear vision for how AI will transform my industry.' },
  { id: 'ai_st3', category: 'AI Readiness', text: 'I consider the ethical implications of AI implementation in my business.' },
  { id: 'ai_st4', category: 'AI Readiness', text: 'I plan for how AI will change the skills and roles needed in my organization.' },

  // Entrepreneurial Mindset Questions (6 questions)
  { id: 'ent1', category: 'Entrepreneurial', text: 'I am comfortable with uncertainty and ambiguity in business situations.' },
  { id: 'ent2', category: 'Entrepreneurial', text: 'I enjoy taking calculated risks to pursue opportunities.' },
  { id: 'ent3', category: 'Entrepreneurial', text: 'I am persistent and don\'t give up easily when facing obstacles.' },
  { id: 'ent4', category: 'Entrepreneurial', text: 'I am good at identifying market opportunities and gaps.' },
  { id: 'ent5', category: 'Entrepreneurial', text: 'I enjoy building and leading teams to achieve common goals.' },
  { id: 'ent6', category: 'Entrepreneurial', text: 'I am comfortable with failure and see it as a learning opportunity.' },

  // Leadership Style Questions (5 questions)
  { id: 'lead1', category: 'Leadership', text: 'I prefer to lead by example rather than giving orders.' },
  { id: 'lead2', category: 'Leadership', text: 'I enjoy mentoring and developing other people\'s skills.' },
  { id: 'lead3', category: 'Leadership', text: 'I am comfortable making difficult decisions that affect many people.' },
  { id: 'lead4', category: 'Leadership', text: 'I prefer to delegate tasks and trust others to complete them.' },
  { id: 'lead5', category: 'Leadership', text: 'I am good at inspiring and motivating others to achieve their best.' },

  // Innovation & Creativity Questions (5 questions)
  { id: 'inn1', category: 'Innovation', text: 'I enjoy brainstorming and coming up with creative solutions to problems.' },
  { id: 'inn2', category: 'Innovation', text: 'I am comfortable challenging conventional wisdom and established practices.' },
  { id: 'inn3', category: 'Innovation', text: 'I enjoy experimenting with new approaches and methodologies.' },
  { id: 'inn4', category: 'Innovation', text: 'I am good at connecting ideas from different fields to create new solutions.' },
  { id: 'inn5', category: 'Innovation', text: 'I enjoy learning about emerging technologies and their potential applications.' },
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
