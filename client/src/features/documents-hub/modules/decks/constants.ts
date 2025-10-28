import { Search, Target, Lightbulb, TestTube, BarChart3, TrendingUp, Briefcase, Palette, TrendingUpIcon } from 'lucide-react';
import { Phases, Tools, DeckCompetitorRow, PricingTier, RevenueStream, DeckStyle } from '../../types';

export const DECK_PHASES: Phases = {
  discover: {
    name: 'Problem Discovery',
    icon: Search,
    color: 'bg-purple-500',
    description: 'Deep ethnographic research to uncover real user problems',
    methodology: 'Design Thinking',
    steps: [
      { id: 'd1', title: 'Stakeholder Mapping', description: 'Identify all actors in the problem space', tool: 'ai-stakeholder-mapper' },
      { id: 'd2', title: 'Ethnographic Research', description: 'Observe users in natural contexts', tool: 'observation-framework' },
      { id: 'd3', title: 'Deep Interviews', description: 'Conduct 15-20 problem-focused interviews', tool: 'interview-generator' },
      { id: 'd4', title: 'Synthesis Workshop', description: 'Extract patterns and insights', tool: 'insight-synthesizer' }
    ]
  },
  define: {
    name: 'Problem Definition',
    icon: Target,
    color: 'bg-blue-500',
    description: 'Frame validated problem as testable hypotheses',
    methodology: 'Lean + Design Thinking',
    steps: [
      { id: 'df1', title: 'Problem Statement', description: 'Craft human-centered problem frame', tool: 'problem-framer' },
      { id: 'df2', title: 'Hypothesis Formation', description: 'Convert insights to testable assumptions', tool: 'hypothesis-builder' },
      { id: 'df3', title: 'Persona Validation', description: 'Build evidence-based personas', tool: 'persona-validator' },
      { id: 'df4', title: 'Success Metrics', description: 'Define quantitative learning goals', tool: 'metrics-framework' }
    ]
  },
  ideate: {
    name: 'Solution Ideation',
    icon: Lightbulb,
    color: 'bg-yellow-500',
    description: 'Generate testable solution concepts rapidly',
    methodology: 'Design Thinking',
    steps: [
      { id: 'i1', title: 'Divergent Generation', description: 'Create 100+ solution concepts', tool: 'ai-idea-multiplier' },
      { id: 'i2', title: 'Assumption Mapping', description: 'Identify riskiest assumptions per solution', tool: 'assumption-mapper' },
      { id: 'i3', title: 'Test Design', description: 'Plan minimum experiments', tool: 'experiment-designer' },
      { id: 'i4', title: 'Prioritization', description: 'Rank by learning/cost ratio', tool: 'priority-matrix' }
    ]
  },
  experiment: {
    name: 'Rapid Experiments',
    icon: TestTube,
    color: 'bg-green-500',
    description: 'Test solutions with minimum viable experiments',
    methodology: 'Lean Startup',
    steps: [
      { id: 'e1', title: 'MVP Definition', description: 'Design minimum testable version', tool: 'mvp-canvas' },
      { id: 'e2', title: 'Landing Page Test', description: 'Validate demand before building', tool: 'landing-builder' },
      { id: 'e3', title: 'Concierge/Wizard', description: 'Manual delivery to test value prop', tool: 'concierge-planner' },
      { id: 'e4', title: 'Prototype Testing', description: 'Test with 5-7 users minimum', tool: 'test-protocol' }
    ]
  },
  measure: {
    name: 'Learn & Measure',
    icon: BarChart3,
    color: 'bg-orange-500',
    description: 'Analyze results and make pivot decisions',
    methodology: 'Lean Startup',
    steps: [
      { id: 'm1', title: 'Data Collection', description: 'Gather qualitative + quantitative data', tool: 'data-dashboard' },
      { id: 'm2', title: 'Cohort Analysis', description: 'Segment by user behavior patterns', tool: 'cohort-analyzer' },
      { id: 'm3', title: 'Learning Documentation', description: 'Record validated/invalidated hypotheses', tool: 'learning-log' },
      { id: 'm4', title: 'Pivot Decision', description: 'Use 10-type framework to decide', tool: 'pivot-intelligence' }
    ]
  },
  scale: {
    name: 'Scale Strategy',
    icon: TrendingUp,
    color: 'bg-red-500',
    description: 'Plan growth with validated business model',
    methodology: 'Business Model Canvas',
    steps: [
      { id: 's1', title: 'Model Validation', description: 'Confirm all 9 canvas blocks', tool: 'bmc-validator' },
      { id: 's2', title: 'Unit Economics', description: 'Calculate validated CAC, LTV, margins', tool: 'economics-calculator' },
      { id: 's3', title: 'Growth Plan', description: 'Design scalable acquisition channels', tool: 'growth-planner' },
      { id: 's4', title: 'Financial Model', description: 'Build projections from real data', tool: 'financial-modeler' }
    ]
  }
};

export const DECK_TOOLS: Tools = {
  'ai-stakeholder-mapper': {
    name: 'AI Stakeholder Mapper',
    description: 'Answer questions about your market—AI identifies all ecosystem players',
    outputs: ['Stakeholder Map', 'Influence Matrix', 'Interview Priority List']
  },
  'observation-framework': {
    name: 'Ethnographic Observation Kit',
    description: 'Structured frameworks for shadowing users in context',
    outputs: ['Observation Protocol', 'Field Notes Template', 'Photo Documentation Guide']
  },
  'interview-generator': {
    name: 'Problem Interview Generator',
    description: 'AI creates custom interview guides focused on problem discovery',
    outputs: ['Interview Script', '5 Whys Framework', 'Pattern Recognition Prompts']
  },
  'insight-synthesizer': {
    name: 'AI Insight Synthesizer',
    description: 'Upload interview notes—AI extracts patterns and themes',
    outputs: ['Affinity Map', 'Key Insights Report', 'Problem Hypotheses']
  },
  'problem-framer': {
    name: 'Smart Problem Framer',
    description: 'Convert research into clear problem statements',
    outputs: ['Problem Statement', 'Jobs-to-be-Done Frame', 'Point of View Statement']
  },
  'hypothesis-builder': {
    name: 'Hypothesis Builder',
    description: 'Transform assumptions into testable hypotheses',
    outputs: ['Hypothesis Canvas', 'Assumption Priority Matrix', 'Test Plan']
  },
  'pivot-intelligence': {
    name: 'Pivot Intelligence Engine',
    description: 'Analyze data and recommend structured pivot options',
    outputs: ['Pivot Type Recommendation', 'Evidence Summary', 'Impact Forecast']
  },
  'persona-validator': { name: 'Persona Validator', description: 'Validate personas with data.', outputs: ['Validated Persona'] },
  'metrics-framework': { name: 'Success Metrics Framework', description: 'Define success metrics.', outputs: ['Metrics Dashboard'] },
  'ai-idea-multiplier': { name: 'AI Idea Multiplier', description: 'Generate solution ideas.', outputs: ['Idea List'] },
  'assumption-mapper': { name: 'Assumption Mapper', description: 'Map out risky assumptions.', outputs: ['Assumption Map'] },
  'experiment-designer': { name: 'Experiment Designer', description: 'Design validation experiments.', outputs: ['Experiment Plan'] },
  'priority-matrix': { name: 'Prioritization Matrix', description: 'Prioritize ideas.', outputs: ['Priority Matrix'] },
  'mvp-canvas': { name: 'MVP Canvas', description: 'Define the minimum viable product.', outputs: ['MVP Canvas'] },
  'landing-builder': { name: 'Landing Page Builder', description: 'Build test landing pages.', outputs: ['Landing Page'] },
  'concierge-planner': { name: 'Concierge Planner', description: 'Plan a concierge test.', outputs: ['Concierge Plan'] },
  'test-protocol': { name: 'Test Protocol', description: 'Define user testing protocols.', outputs: ['Test Protocol'] },
  'data-dashboard': { name: 'Data Dashboard', description: 'Collect experiment data.', outputs: ['Data Dashboard'] },
  'cohort-analyzer': { name: 'Cohort Analyzer', description: 'Analyze user cohorts.', outputs: ['Cohort Analysis'] },
  'learning-log': { name: 'Learning Log', description: 'Log validated learnings.', outputs: ['Learning Log'] },
  'bmc-validator': { name: 'BMC Validator', description: 'Validate the business model canvas.', outputs: ['Validated BMC'] },
  'economics-calculator': { name: 'Unit Economics Calculator', description: 'Calculate unit economics.', outputs: ['Economics Report'] },
  'growth-planner': { name: 'Growth Planner', description: 'Plan growth channels.', outputs: ['Growth Plan'] },
  'financial-modeler': { name: 'Financial Modeler', description: 'Build financial models.', outputs: ['Financial Model'] },
};

export const DECK_STYLES: DeckStyle[] = [
  {
    id: 'classic',
    name: 'Classic Investor',
    description: 'Traditional format trusted by top VCs',
    icon: Briefcase,
    instruction: 'Create a professional, data-driven deck following the classic investor pitch format with clear problem, solution, market, traction, team, and financials slides.'
  },
  {
    id: 'story',
    name: 'Story-Driven',
    description: 'Narrative arc for emotional connection',
    icon: Palette,
    instruction: 'Build a compelling narrative that takes investors on a journey, emphasizing the human story behind the startup and creating emotional engagement.'
  },
  {
    id: 'data',
    name: 'Data-First',
    description: 'Metrics and validation for analytical investors',
    icon: TrendingUpIcon,
    instruction: 'Focus heavily on data, metrics, validation experiments, and quantitative evidence. Ideal for analytical investors who want proof points.'
  }
];

export const DECK_COMPETITOR_COMPARISON: DeckCompetitorRow[] = [
  {
    feature: 'Starting Point',
    iterativDecks: 'Validated assumptions from experiments',
    growthWheel: 'Business plan outline',
    venturePlanner: 'Template selection',
    livePlan: 'Manual slide creation'
  },
  {
    feature: 'AI Integration',
    iterativDecks: 'Context-aware generation + validation',
    growthWheel: 'None',
    venturePlanner: 'Template fill-in',
    livePlan: 'Basic suggestions'
  },
  {
    feature: 'Deck Styles',
    iterativDecks: '3 evidence-backed formats',
    growthWheel: '1 standard template',
    venturePlanner: '5+ visual templates',
    livePlan: 'Custom design'
  },
  {
    feature: 'Assumption Tracking',
    iterativDecks: 'Auto-extracted + validation workflow',
    growthWheel: 'Not supported',
    venturePlanner: 'Not supported',
    livePlan: 'Manual notes'
  },
  {
    feature: 'Iteration Support',
    iterativDecks: 'Built-in pivot framework',
    growthWheel: 'Version history only',
    venturePlanner: 'Regenerate deck',
    livePlan: 'Manual updates'
  },
  {
    feature: 'Investor Intelligence',
    iterativDecks: 'Coming Q2 2025',
    growthWheel: 'None',
    venturePlanner: 'None',
    livePlan: 'None'
  }
];

export const DECK_PRICING_TIERS: PricingTier[] = [
  {
    name: 'Explorer',
    price: 'Free',
    description: 'For validating your first deck',
    features: [
      '1 active deck',
      'All 3 deck styles',
      'Basic AI generation',
      'Assumption extraction',
      'Community access'
    ],
    cta: 'Start Free',
    highlighted: false
  },
  {
    name: 'Founder',
    price: '$49/mo',
    description: 'For serious fundraising',
    features: [
      'Unlimited decks',
      'Advanced AI tools',
      'Pitch Intelligence',
      'Iteration tracking',
      'Export to PowerPoint/PDF',
      'Priority support'
    ],
    cta: 'Start Fundraising',
    highlighted: true
  },
  {
    name: 'Team',
    price: '$199/mo',
    description: 'For startup teams',
    features: [
      'Everything in Founder',
      '5 team members',
      'Collaboration tools',
      'Version control',
      'White-label reports',
      'Dedicated success manager'
    ],
    cta: 'Scale Together',
    highlighted: false
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For accelerators & VCs',
    features: [
      'Everything in Team',
      'Unlimited portfolio companies',
      'Custom branding',
      'API access',
      'Investor matching (Q2 2025)',
      'Training & certification'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

export const DECK_REVENUE_STREAMS: RevenueStream[] = [
  { stream: 'SaaS Subscriptions', year1: '$180K', year2: '$1.8M', year3: '$9M', percentage: '55%' },
  { stream: 'Accelerator Licenses', year1: '$60K', year2: '$800K', year3: '$4M', percentage: '25%' },
  { stream: 'Investor Matching (20% fee)', year1: '$40K', year2: '$600K', year3: '$3M', percentage: '18%' },
  { stream: 'Premium Templates', year1: '$10K', year2: '$200K', year3: '$400K', percentage: '2%' },
  { stream: 'Total ARR', year1: '$290K', year2: '$3.4M', year3: '$16.4M', percentage: '100%' }
];
