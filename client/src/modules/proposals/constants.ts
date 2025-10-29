import { Search, Target, Lightbulb, TestTube, BarChart3, TrendingUp } from 'lucide-react';
import { Phases, Tools, PlanCompetitorRow, PricingTier, Assumption } from '@/types-hub';

export const PROPOSAL_PHASES: Phases = {
  discover: {
    name: 'Client Discovery',
    icon: Search,
    color: 'bg-purple-500',
    description: 'Deep research to uncover the client\'s real, underlying problems. This phase embodies the core of Design Thinking - before proposing any solution, we must deeply understand the client and their authentic needs.',
    methodology: 'Lean Design Thinking™ - Design Thinking Foundation',
    steps: [
      { id: 'd1', title: 'Stakeholder Mapping', description: 'Identify all decision-makers, influencers, and users.', tool: 'ai-stakeholder-mapper' },
      { id: 'd2', title: 'RFP & Document Analysis', description: 'Go beyond the text to find unstated needs and goals.', tool: 'document-analyzer' },
      { id: 'd3', title: 'Deep Problem Interviews', description: 'Conduct interviews to understand their "why".', tool: 'interview-generator' },
      { id: 'd4', title: 'Insight Synthesis', description: 'Extract patterns and insights from your research.', tool: 'insight-synthesizer' }
    ]
  },
  define: {
    name: 'Define',
    icon: Target,
    color: 'bg-blue-500',
    description: 'Frame the problem and develop a core proposal narrative. This phase completes the Design Thinking foundation by ensuring we\'ve identified the right problem before moving to solution development.',
    methodology: 'Lean Design Thinking™ - Design Thinking Foundation',
    steps: [
      { id: 'df1', title: 'Problem Statement Framing', description: 'Craft a human-centered problem frame.', tool: 'problem-framer' },
      { id: 'df2', title: 'Hypothesis Formation', description: 'Convert insights to testable assumptions.', tool: 'hypothesis-builder' },
      { id: 'df3', title: 'Core Narrative Development', description: 'Build the central story your proposal will tell.', tool: 'narrative-builder' },
      { id: 'df4', title: 'Success Metrics', description: 'Define what success looks like for the client.', tool: 'metrics-framework' }
    ]
  },
  ideate: {
    name: 'Ideate',
    icon: Lightbulb,
    color: 'bg-yellow-500',
    description: 'Generate and prioritize testable solution concepts. This is the critical handoff from Design Thinking to Lean Startup - transforming creative ideas into a backlog of testable hypotheses through assumption mapping.',
    methodology: 'Lean Design Thinking™ - Methodology Bridge',
    steps: [
      { id: 'i1', title: 'Solution Brainstorming', description: 'Generate 10+ solution concepts.', tool: 'ai-idea-multiplier' },
      { id: 'i2', title: 'Assumption Mapping', description: 'Identify the riskiest assumption for each solution.', tool: 'assumption-mapper' },
      { id: 'i3', title: 'Win Theme Generation', description: 'Develop compelling themes that resonate.', tool: 'theme-generator' },
      { id: 'i4', title: 'Prioritization Matrix', description: 'Rank ideas by impact vs. effort.', tool: 'priority-matrix' }
    ]
  },
  experiment: {
    name: 'Experiment',
    icon: TestTube,
    color: 'bg-green-500',
    description: 'Test proposal concepts with minimum viable experiments. This is the "Build" phase of the Lean Startup loop - creating the minimum viable experiment to validate our riskiest assumptions efficiently.',
    methodology: 'Lean Design Thinking™ - Lean Startup Core',
    steps: [
      { id: 'e1', title: 'Executive Summary Test', description: 'Validate the core narrative with a one-pager.', tool: 'summary-writer' },
      { id: 'e2', title: 'Solution Mock-up Test', description: 'Get feedback on a visual representation of the solution.', tool: 'visual-creator' },
      { id: 'e3', title: 'Pricing Model Test', description: 'Test different pricing structures for value alignment.', tool: 'pricing-modeler' },
      { id: 'e4', title: 'Internal Red Team Review', description: 'Pressure test the proposal with an internal team.', tool: 'review-protocol' }
    ]
  },
  measure: {
    name: 'Learn & Refine',
    icon: BarChart3,
    color: 'bg-orange-500',
    description: 'Analyze feedback and make data-driven pivot decisions.',
    methodology: 'Lean Startup',
    steps: [
      { id: 'm1', title: 'Feedback Synthesis', description: 'Gather qualitative + quantitative feedback.', tool: 'feedback-collector' },
      { id: 'm2', title: 'Learning Documentation', description: 'Record validated/invalidated hypotheses.', tool: 'learning-log' },
      { id: 'm3', title: 'Pivot Decision Analysis', description: 'Use the 10-type framework to decide on changes.', tool: 'pivot-intelligence' },
      { id: 'm4', title: 'Refine Narrative & Solution', description: 'Update the proposal based on learning.', tool: 'narrative-builder' }
    ]
  },
  scale: {
    name: 'Finalize & Scale',
    icon: TrendingUp,
    color: 'bg-red-500',
    description: 'Assemble the final proposal and create reusable assets.',
    methodology: 'Process Improvement',
    steps: [
      { id: 's1', title: 'Final Proposal Assembly', description: 'Build the full proposal from validated components.', tool: 'outline-builder' },
      { id: 's2', title: 'Compliance & Polish', description: 'Ensure 100% compliance and professional polish.', tool: 'compliance-checker' },
      { id: 's3', title: 'Create Reusable Assets', description: 'Turn validated sections into templates.', tool: 'template-creator' },
      { id: 's4', title: 'Post-Mortem & Improvement', description: 'Hold a retrospective to improve the process.', tool: 'kaizen-framework' }
    ]
  }
};

export const PROPOSAL_TOOLS: Tools = {
  'ai-stakeholder-mapper': {
    name: 'AI Stakeholder Mapper',
    description: 'Answer questions about the client—AI identifies all ecosystem players.',
    outputs: ['Stakeholder Map', 'Influence Matrix', 'Interview Priority List']
  },
  'document-analyzer': {
    name: 'AI RFP Analyzer',
    description: 'Upload an RFP or client document to extract key requirements, stakeholders, and implicit needs.',
    outputs: ['Requirement Matrix', 'Stakeholder List', 'Keyword Analysis']
  },
  'interview-generator': {
    name: 'Problem Interview Generator',
    description: 'AI creates custom interview guides focused on discovering client pains and goals.',
    outputs: ['Interview Script', '5 Whys Framework', 'Pattern Recognition Prompts']
  },
  'insight-synthesizer': {
    name: 'AI Insight Synthesizer',
    description: 'Upload interview notes—AI extracts patterns and themes.',
    outputs: ['Affinity Map', 'Key Insights Report', 'Problem Hypotheses']
  },
  'problem-framer': {
    name: 'Smart Problem Framer',
    description: 'Convert research into clear, human-centered problem statements.',
    outputs: ['Problem Statement', 'Jobs-to-be-Done Frame', 'Point of View Statement']
  },
  'hypothesis-builder': {
    name: 'Hypothesis Builder',
    description: 'Transform assumptions into testable hypotheses.',
    outputs: ['Hypothesis Canvas', 'Assumption Priority Matrix', 'Test Plan']
  },
  'narrative-builder': { name: 'Narrative Builder', description: 'Structure your proposal story.', outputs: ['Story Arc', 'Executive Summary Draft'] },
  'metrics-framework': { name: 'Success Metrics Framework', description: 'Define success metrics.', outputs: ['KPI List', 'Measurement Plan'] },
  'ai-idea-multiplier': { name: 'AI Idea Multiplier', description: 'Generate solution ideas.', outputs: ['Solution Concepts', 'Feature List'] },
  'assumption-mapper': { name: 'Assumption Mapper', description: 'Map out risky assumptions for each idea.', outputs: ['Assumption Map'] },
  'theme-generator': { name: 'Win Theme Generator', description: 'Develop compelling win themes.', outputs: ['Win Theme Statements'] },
  'priority-matrix': { name: 'Prioritization Matrix', description: 'Prioritize ideas by impact vs. effort.', outputs: ['Priority Matrix'] },
  'summary-writer': { name: 'Executive Summary Writer', description: 'Draft a compelling summary for testing.', outputs: ['Draft Summary'] },
  'visual-creator': { name: 'Visual Concept Creator', description: 'Create solution mock-ups for feedback.', outputs: ['Concept Sketch', 'Flowchart'] },
  'pricing-modeler': { name: 'Pricing Modeler', description: 'Develop and test pricing strategies.', outputs: ['Pricing Table', 'Value Proposition'] },
  'review-protocol': { name: 'Red Team Review Protocol', description: 'Structure internal reviews to find weaknesses.', outputs: ['Review Checklist'] },
  'feedback-collector': { name: 'Feedback Collector', description: 'Gather and synthesize stakeholder feedback.', outputs: ['Feedback Summary'] },
  'learning-log': { name: 'Learning Log', description: 'Log validated and invalidated learnings.', outputs: ['Learning Log'] },
  'pivot-intelligence': { name: 'Pivot Intelligence Engine', description: 'Analyze feedback and suggest strategic pivots for your proposal approach.', outputs: ['Pivot Recommendation', 'Rationale Summary'] },
  'outline-builder': { name: 'Outline Builder', description: 'Structure your final proposal.', outputs: ['Proposal Outline'] },
  'compliance-checker': { name: 'Compliance Checker', description: 'Check against RFP requirements.', outputs: ['Compliance Matrix'] },
  'template-creator': { name: 'Template Creator', description: 'Save winning sections as reusable assets.', outputs: ['Content Snippets', 'Section Templates'] },
  'kaizen-framework': { name: 'Kaizen Framework', description: 'Run a structured retrospective on the proposal process.', outputs: ['Action Items for Improvement'] },
};

export const PROPOSAL_COMPETITOR_COMPARISON: PlanCompetitorRow[] = [
  {
    feature: 'Methodology',
    iterativePlans: 'Lean Design Thinking™',
    growthWheel: 'Traditional Proposal Management',
    venturePlanner: 'AI Content Generation',
    livePlan: 'Template-based Writing'
  },
  {
    feature: 'Focus',
    iterativePlans: 'Solving the right problem, correctly',
    growthWheel: 'Compliance and process',
    venturePlanner: 'Content volume and speed',
    livePlan: 'Document structure'
  },
  {
    feature: 'Validation Approach',
    iterativePlans: 'Built-in experiment framework',
    growthWheel: 'Color team reviews (late-stage)',
    venturePlanner: 'None',
    livePlan: 'None'
  },
  {
    feature: 'Pivot Support',
    iterativePlans: 'Structured 10-type pivot framework',
    growthWheel: 'Manual rework',
    venturePlanner: 'Regenerate from scratch',
    livePlan: 'Rewrite document'
  },
  {
    feature: 'Learning Documentation',
    iterativePlans: 'Automated hypothesis and learning log',
    growthWheel: 'Manual notes',
    venturePlanner: 'Not supported',
    livePlan: 'Not supported'
  },
  {
    feature: 'AI Integration',
    iterativePlans: 'Research synthesis & experiment design',
    growthWheel: 'Task management & scheduling',
    venturePlanner: 'Full text generation',
    livePlan: 'Basic grammar/spell check'
  }
];

export const PROPOSAL_PRICING_TIERS: PricingTier[] = [
  {
    name: 'Solo',
    price: 'Free',
    description: 'For individuals crafting key proposals',
    features: [
      '1 active proposal',
      'Full Lean Design Thinking™ workflow',
      'Basic AI assistance',
      'Community access'
    ],
    cta: 'Start Free',
    highlighted: false
  },
  {
    name: 'Team',
    price: '$79/mo',
    description: 'For collaborative proposal teams',
    features: [
      'Unlimited proposals',
      '5 team members',
      'Full AI tools suite',
      'Pivot Intelligence',
      'Internal review tools'
    ],
    cta: 'Start Collaborating',
    highlighted: true
  },
  {
    name: 'Business',
    price: '$249/mo',
    description: 'For organizations building a proposal engine',
    features: [
      'Everything in Team',
      '20 team members',
      'Proposal template library',
      'Custom integrations (CRM)',
      'Dedicated success manager'
    ],
    cta: 'Build Your Engine',
    highlighted: false
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale operations',
    features: [
      'Everything in Business',
      'Unlimited users',
      'Custom branding',
      'API access & SSO',
      'On-premise option'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

export const PROPOSAL_MOCK_ASSUMPTIONS: Assumption[] = [
    { id: 'a1', text: 'The client values a long-term strategic partnership over a low-cost transactional provider.', risk: 'high', status: 'untested', sourceSection: 'Value Proposition' },
    { id: 'a2', text: 'The primary decision-maker is the CTO, and their main pain point is integration complexity.', risk: 'high', status: 'untested', sourceSection: 'Client Needs' },
    { id: 'a3', text: 'Our proposed technology is significantly more efficient than the incumbent solution they are currently using.', risk: 'high', status: 'untested', sourceSection: 'Solution' },
    { id: 'a4', text: 'The client has the budget allocated for a solution of this scope.', risk: 'medium', status: 'untested', sourceSection: 'Financials' },
    { id: 'a5', text: 'Our proposed timeline of 6 months is acceptable to the client.', risk: 'medium', status: 'untested', sourceSection: 'Project Plan' },
    { id: 'a6', text: 'The data required for implementation can be provided by the client in the required format.', risk: 'low', status: 'untested', sourceSection: 'Implementation' },
];


// --- NEW DATA FOR DIVERSE ENTREPRENEUR PERSONA (SERVICE-BASED) ---
export const PROPOSAL_MOCK_ASSUMPTIONS_AGENCY: Assumption[] = [
    { id: 'ag1', text: 'The client believes their low organic traffic is their biggest marketing problem, not conversion rates.', risk: 'high', status: 'untested', sourceSection: 'Problem Framing' },
    { id: 'ag2', text: 'A 3-month content marketing pilot will show enough ROI to justify a 12-month retainer.', risk: 'high', status: 'untested', sourceSection: 'Solution & Pricing' },
    { id: 'ag3', text: 'The marketing manager is our champion and can get budget approval from the CFO.', risk: 'high', status: 'untested', sourceSection: 'Stakeholder Analysis' },
    { id: 'ag4', text: 'The client\'s technical team can implement our tracking scripts within the first week.', risk: 'medium', status: 'untested', sourceSection: 'Implementation Plan' },
    { id: 'ag5', text: 'Our proposed KPIs (e.g., "increase blog traffic by 50%") align with the client\'s business goals (e.g., "increase qualified leads by 10%").', risk: 'medium', status: 'untested', sourceSection: 'Success Metrics' },
];
