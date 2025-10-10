/**
 * RIASEC Career Interest Questionnaire
 * 60 questions (10 per dimension)
 */

import { RIASECQuestion, RIASECCategory } from '../../models/riasec.model';

export const RIASEC_QUESTIONS: RIASECQuestion[] = [
  // Realistic (R) - Hands-on, practical, technical (10 questions)
  {
    id: 'R1',
    category: 'R',
    question: 'I enjoy working with tools, machinery, or building physical products',
    scenario: 'Prototyping hardware, setting up physical infrastructure'
  },
  {
    id: 'R2',
    category: 'R',
    question: 'I prefer solving concrete, tangible problems over abstract concepts',
    scenario: 'Fixing technical issues, optimizing production processes'
  },
  {
    id: 'R3',
    category: 'R',
    question: 'I learn best by doing hands-on work rather than reading or discussing',
    scenario: 'Building MVPs, hands-on product development'
  },
  {
    id: 'R4',
    category: 'R',
    question: 'I enjoy outdoor activities and physical work',
    scenario: 'Field research, on-site installations, physical product testing'
  },
  {
    id: 'R5',
    category: 'R',
    question: 'I\'m good at understanding how things work mechanically or technically',
    scenario: 'Technical architecture, system design, troubleshooting'
  },
  {
    id: 'R6',
    category: 'R',
    question: 'I prefer working with objects and equipment over working with people',
    scenario: 'Solo technical work, lab research, product engineering'
  },
  {
    id: 'R7',
    category: 'R',
    question: 'I enjoy taking things apart and putting them back together',
    scenario: 'Reverse engineering, technical debugging, system optimization'
  },
  {
    id: 'R8',
    category: 'R',
    question: 'I\'m comfortable with physical risk and hands-on challenges',
    scenario: 'Hardware prototyping, field testing, physical product launches'
  },
  {
    id: 'R9',
    category: 'R',
    question: 'I value practical results over theoretical elegance',
    scenario: 'Shipping functional MVPs, pragmatic technical decisions'
  },
  {
    id: 'R10',
    category: 'R',
    question: 'I enjoy working in labs, workshops, or technical environments',
    scenario: 'R&D facilities, maker spaces, technical co-working'
  },

  // Investigative (I) - Analytical, research-oriented, problem-solving (10 questions)
  {
    id: 'I1',
    category: 'I',
    question: 'I love analyzing data and discovering patterns to solve complex problems',
    scenario: 'Running experiments, analyzing market data, technical research'
  },
  {
    id: 'I2',
    category: 'I',
    question: 'I enjoy deep diving into research before making decisions',
    scenario: 'Market research, competitive analysis, technical due diligence'
  },
  {
    id: 'I3',
    category: 'I',
    question: 'I\'m naturally curious and love learning new concepts and theories',
    scenario: 'Exploring new technologies, academic research, continuous learning'
  },
  {
    id: 'I4',
    category: 'I',
    question: 'I prefer working independently on complex intellectual challenges',
    scenario: 'Deep technical work, research projects, strategic analysis'
  },
  {
    id: 'I5',
    category: 'I',
    question: 'I enjoy abstract thinking and theoretical problem-solving',
    scenario: 'Algorithm design, mathematical modeling, system architecture'
  },
  {
    id: 'I6',
    category: 'I',
    question: 'I like to understand the "why" behind everything',
    scenario: 'Root cause analysis, first principles thinking, scientific method'
  },
  {
    id: 'I7',
    category: 'I',
    question: 'I\'m skilled at identifying patterns and making logical connections',
    scenario: 'Market trend analysis, user behavior insights, system optimization'
  },
  {
    id: 'I8',
    category: 'I',
    question: 'I enjoy scientific or technical reading and staying current with research',
    scenario: 'Reading papers, following research, technical blogs'
  },
  {
    id: 'I9',
    category: 'I',
    question: 'I prefer precision and accuracy over speed in my work',
    scenario: 'Careful analysis, rigorous testing, quality over velocity'
  },
  {
    id: 'I10',
    category: 'I',
    question: 'I like solving puzzles and intellectual games',
    scenario: 'Technical challenges, strategic puzzles, optimization problems'
  },

  // Artistic (A) - Creative, innovative, visionary (10 questions)
  {
    id: 'A1',
    category: 'A',
    question: 'I thrive when creating something new and innovative',
    scenario: 'Product design, branding, creative problem-solving'
  },
  {
    id: 'A2',
    category: 'A',
    question: 'I often think outside the box and challenge conventional approaches',
    scenario: 'Disrupting industries, innovative business models'
  },
  {
    id: 'A3',
    category: 'A',
    question: 'I express myself best through creative work rather than conventional means',
    scenario: 'Brand building, product vision, creative storytelling'
  },
  {
    id: 'A4',
    category: 'A',
    question: 'I appreciate aesthetics and good design in products and experiences',
    scenario: 'UI/UX focus, brand identity, product design'
  },
  {
    id: 'A5',
    category: 'A',
    question: 'I enjoy brainstorming and ideation sessions',
    scenario: 'Innovation workshops, product ideation, creative strategy'
  },
  {
    id: 'A6',
    category: 'A',
    question: 'I\'m comfortable with ambiguity and unstructured situations',
    scenario: 'Early-stage exploration, pivoting, creative problem-solving'
  },
  {
    id: 'A7',
    category: 'A',
    question: 'I prefer flexible, creative environments over rigid structures',
    scenario: 'Startup culture, creative agencies, innovation labs'
  },
  {
    id: 'A8',
    category: 'A',
    question: 'I often see connections and possibilities others miss',
    scenario: 'Market opportunities, product differentiation, unique positioning'
  },
  {
    id: 'A9',
    category: 'A',
    question: 'I value originality and uniqueness highly',
    scenario: 'Unique value propositions, differentiated products, novel approaches'
  },
  {
    id: 'A10',
    category: 'A',
    question: 'I enjoy working on projects that allow creative freedom',
    scenario: 'Product innovation, brand development, creative strategy'
  },

  // Social (S) - People-oriented, collaborative, team-building (10 questions)
  {
    id: 'S1',
    category: 'S',
    question: 'I gain energy from collaborating with others and building relationships',
    scenario: 'Team building, networking, mentoring'
  },
  {
    id: 'S2',
    category: 'S',
    question: 'I naturally understand and empathize with others\' perspectives',
    scenario: 'Customer research, team management, partnership building'
  },
  {
    id: 'S3',
    category: 'S',
    question: 'I enjoy helping others grow and develop their potential',
    scenario: 'Mentoring, coaching, talent development'
  },
  {
    id: 'S4',
    category: 'S',
    question: 'I\'m skilled at facilitating group discussions and finding common ground',
    scenario: 'Team meetings, conflict resolution, stakeholder alignment'
  },
  {
    id: 'S5',
    category: 'S',
    question: 'I prefer working in teams over working alone',
    scenario: 'Collaborative projects, team-based work, partnership models'
  },
  {
    id: 'S6',
    category: 'S',
    question: 'I\'m good at reading people and understanding their motivations',
    scenario: 'Hiring, customer development, relationship management'
  },
  {
    id: 'S7',
    category: 'S',
    question: 'I enjoy teaching, training, or explaining concepts to others',
    scenario: 'Team training, customer education, thought leadership'
  },
  {
    id: 'S8',
    category: 'S',
    question: 'I care deeply about creating positive team culture and morale',
    scenario: 'Culture building, employee engagement, team well-being'
  },
  {
    id: 'S9',
    category: 'S',
    question: 'I\'m naturally drawn to roles that involve helping or serving others',
    scenario: 'Customer success, social impact, community building'
  },
  {
    id: 'S10',
    category: 'S',
    question: 'I build strong, lasting relationships easily',
    scenario: 'Network building, partnerships, long-term customer relationships'
  },

  // Enterprising (E) - Leadership, persuasion, opportunity-seeking (10 questions)
  {
    id: 'E1',
    category: 'E',
    question: 'I enjoy taking charge and leading teams toward ambitious goals',
    scenario: 'Leading projects, pitching investors, driving growth'
  },
  {
    id: 'E2',
    category: 'E',
    question: 'I\'m skilled at persuading others and selling ideas',
    scenario: 'Fundraising, sales, partnership negotiations'
  },
  {
    id: 'E3',
    category: 'E',
    question: 'I naturally spot business opportunities others overlook',
    scenario: 'Market gaps, growth opportunities, new ventures'
  },
  {
    id: 'E4',
    category: 'E',
    question: 'I\'m comfortable taking calculated risks for potential rewards',
    scenario: 'Strategic decisions, market entry, bold moves'
  },
  {
    id: 'E5',
    category: 'E',
    question: 'I enjoy competitive situations and challenges',
    scenario: 'Competitive markets, sales competitions, growth challenges'
  },
  {
    id: 'E6',
    category: 'E',
    question: 'I\'m motivated by achieving goals and seeing measurable results',
    scenario: 'KPI achievement, revenue growth, milestone completion'
  },
  {
    id: 'E7',
    category: 'E',
    question: 'I enjoy influencing and inspiring others toward a vision',
    scenario: 'Pitching, team motivation, stakeholder alignment'
  },
  {
    id: 'E8',
    category: 'E',
    question: 'I\'m energized by fast-paced, high-stakes environments',
    scenario: 'Fundraising sprints, product launches, rapid growth'
  },
  {
    id: 'E9',
    category: 'E',
    question: 'I like being in positions of authority and decision-making',
    scenario: 'Leadership roles, strategic decisions, company direction'
  },
  {
    id: 'E10',
    category: 'E',
    question: 'I\'m skilled at negotiation and deal-making',
    scenario: 'Partnership deals, fundraising, M&A, contract negotiations'
  },

  // Conventional (C) - Organized, systematic, detail-oriented (10 questions)
  {
    id: 'C1',
    category: 'C',
    question: 'I excel at creating systems, processes, and maintaining organization',
    scenario: 'Operations, financial management, compliance'
  },
  {
    id: 'C2',
    category: 'C',
    question: 'I prefer structured environments with clear procedures',
    scenario: 'Process optimization, quality control, regulatory compliance'
  },
  {
    id: 'C3',
    category: 'C',
    question: 'I\'m detail-oriented and catch errors others miss',
    scenario: 'Quality assurance, financial accuracy, compliance review'
  },
  {
    id: 'C4',
    category: 'C',
    question: 'I enjoy working with numbers, data, and precise information',
    scenario: 'Financial modeling, metrics tracking, data management'
  },
  {
    id: 'C5',
    category: 'C',
    question: 'I prefer following proven methods over experimenting with new approaches',
    scenario: 'Best practices, established frameworks, validated processes'
  },
  {
    id: 'C6',
    category: 'C',
    question: 'I\'m good at organizing information and maintaining accurate records',
    scenario: 'Documentation, record-keeping, data organization'
  },
  {
    id: 'C7',
    category: 'C',
    question: 'I value efficiency, accuracy, and consistency in work',
    scenario: 'Process optimization, quality standards, operational excellence'
  },
  {
    id: 'C8',
    category: 'C',
    question: 'I enjoy planning, scheduling, and coordinating activities',
    scenario: 'Project management, resource allocation, timeline planning'
  },
  {
    id: 'C9',
    category: 'C',
    question: 'I\'m comfortable following rules, regulations, and established guidelines',
    scenario: 'Compliance, legal requirements, industry standards'
  },
  {
    id: 'C10',
    category: 'C',
    question: 'I prefer tasks with clear expectations and measurable outcomes',
    scenario: 'Goal setting, KPI tracking, performance management'
  }
];

export const RIASEC_CATEGORY_NAMES: Record<RIASECCategory, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional'
};

export const RIASEC_CATEGORY_DESCRIPTIONS: Record<RIASECCategory, string> = {
  R: 'Hands-on, practical, technical - enjoys working with tools, machines, and physical products',
  I: 'Analytical, research-oriented, problem-solving - enjoys data analysis and intellectual challenges',
  A: 'Creative, innovative, visionary - enjoys creating new things and thinking outside the box',
  S: 'People-oriented, collaborative, team-building - enjoys working with and helping others',
  E: 'Leadership, persuasion, opportunity-seeking - enjoys leading, selling, and taking risks',
  C: 'Organized, systematic, detail-oriented - enjoys structure, processes, and accuracy'
};