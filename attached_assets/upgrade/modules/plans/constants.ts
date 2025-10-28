import { Search, Target, Lightbulb, TestTube, BarChart3, TrendingUp } from 'lucide-react';
import { Phases, Tools, PlanCompetitorRow, PricingTier, RevenueStream, Assumption } from '../../types';

export const PLAN_PHASES: Phases = {
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

export const PLAN_TOOLS: Tools = {
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

export const PLAN_COMPETITOR_COMPARISON: PlanCompetitorRow[] = [
  {
    feature: 'Methodology',
    iterativePlans: 'Lean Design Thinking (hybrid)',
    growthWheel: 'Structured business planning',
    venturePlanner: 'AI-generated projections',
    livePlan: 'Traditional business plan'
  },
  {
    feature: 'Starting Point',
    iterativePlans: 'Problem discovery with users',
    growthWheel: 'Business concept definition',
    venturePlanner: 'Vision/goals questions',
    livePlan: 'Executive summary'
  },
  {
    feature: 'Validation Approach',
    iterativePlans: 'Built-in experiment framework',
    growthWheel: 'Advisor-dependent',
    venturePlanner: 'None (assumptions only)',
    livePlan: 'None (projections only)'
  },
  {
    feature: 'Pivot Support',
    iterativePlans: '10-type pivot framework + tracking',
    growthWheel: 'Manual worksheet updates',
    venturePlanner: 'Regenerate from scratch',
    livePlan: 'Rewrite document'
  },
  {
    feature: 'Learning Documentation',
    iterativePlans: 'Automated hypothesis tracking',
    growthWheel: 'Manual notes',
    venturePlanner: 'Not supported',
    livePlan: 'Not supported'
  },
  {
    feature: 'AI Integration',
    iterativePlans: 'Research synthesis + experiment design',
    growthWheel: 'None',
    venturePlanner: 'Plan generation only',
    livePlan: 'Basic text assistance'
  }
];

export const PLAN_PRICING_TIERS: PricingTier[] = [
  {
    name: 'Explorer',
    price: 'Free',
    description: 'For validating your first idea',
    features: [
      '1 active project',
      'Problem discovery tools',
      'Basic AI assistance',
      'Community access',
      'Learning resources'
    ],
    cta: 'Start Free',
    highlighted: false
  },
  {
    name: 'Founder',
    price: '$49/mo',
    description: 'For serious entrepreneurs',
    features: [
      'Unlimited projects',
      'Full AI tools suite',
      'Pivot Intelligence',
      'Experiment tracking',
      'Advisor marketplace access',
      'Priority support'
    ],
    cta: 'Start Building',
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
      'Custom integrations',
      'Dedicated success manager',
      'White-label reports'
    ],
    cta: 'Scale Together',
    highlighted: false
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For accelerators & universities',
    features: [
      'Everything in Team',
      'Unlimited cohorts',
      'Custom branding',
      'API access',
      'On-premise option',
      'Training & certification'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

export const PLAN_REVENUE_STREAMS: RevenueStream[] = [
  { stream: 'SaaS Subscriptions', year1: '$240K', year2: '$2.4M', year3: '$12M', percentage: '60%' },
  { stream: 'Advisor Marketplace (20% commission)', year1: '$40K', year2: '$600K', year3: '$4M', percentage: '20%' },
  { stream: 'Certification Programs', year1: '$30K', year2: '$400K', year3: '$2M', percentage: '10%' },
  { stream: 'Enterprise Licenses', year1: '$50K', year2: '$600K', year3: '$2M', percentage: '10%' },
  { stream: 'Total ARR', year1: '$360K', year2: '$4M', year3: '$20M', percentage: '100%' }
];

export const PLAN_MOCK_ASSUMPTIONS: Assumption[] = [
    { id: 'a1', text: 'Small businesses will pay $99/month for this solution.', risk: 'high', status: 'untested', sourceSection: 'Financial Projections' },
    { id: 'a2', text: 'The problem occurs frequently enough to justify a dedicated solution.', risk: 'high', status: 'untested', sourceSection: 'Problem Statement' },
    { id: 'a3', text: 'Users cannot easily solve this problem with existing tools like spreadsheets.', risk: 'high', status: 'untested', sourceSection: 'Competitive Analysis' },
    { id: 'a4', text: 'The target market (SMBs) can be reached effectively through content marketing.', risk: 'medium', status: 'untested', sourceSection: 'Go-to-Market Strategy' },
    { id: 'a5', text: 'Our solution can reduce costs for clients by at least 30%.', risk: 'medium', status: 'untested', sourceSection: 'Value Proposition' },
    { id: 'a6', text: 'The core technology is feasible to build within 6 months.', risk: 'low', status: 'untested', sourceSection: 'Product Roadmap' },
];


// --- NEW DATA FOR LENDER & DIVERSE ENTREPRENEUR PERSONAS ---

export const COST_OF_GOODS_SOLD = [
    { item: 'Cloud Hosting (AWS/GCP)', year1: '$50K', year2: '$200K', year3: '$800K' },
    { item: 'Third-party API Licenses', year1: '$20K', year2: '$80K', year3: '$320K' },
    { item: 'Customer Support Software', year1: '$10K', year2: '$40K', year3: '$160K' },
    { item: 'Total COGS', year1: '$80K', year2: '$320K', year3: '$1.28M' },
];

export const OPERATING_EXPENSES = [
    { item: 'Salaries & Wages (R&D)', year1: '$150K', year2: '$400K', year3: '$1M' },
    { item: 'Salaries & Wages (S&M)', year1: '$80K', year2: '$300K', year3: '$800K' },
    { item: 'Salaries & Wages (G&A)', year1: '$50K', year2: '$150K', year3: '$400K' },
    { item: 'Marketing Spend', year1: '$60K', year2: '$500K', year3: '$2M' },
    { item: 'Office & Utilities', year1: '$20K', year2: '$50K', year3: '$100K' },
    { item: 'Total Operating Expenses', year1: '$360K', year2: '$1.4M', year3: '$4.3M' },
];


export const PLAN_REVENUE_STREAMS_D2C: RevenueStream[] = [
  { stream: 'Product Sales (E-commerce)', year1: '$500K', year2: '$2M', year3: '$8M', percentage: '80%' },
  { stream: 'Subscription Box', year1: '$100K', year2: '$600K', year3: '$1.5M', percentage: '15%' },
  { stream: 'Affiliate Marketing', year1: '$25K', year2: '$100K', year3: '$500K', percentage: '5%' },
  { stream: 'Total Revenue', year1: '$625K', year2: '$2.7M', year3: '$10M', percentage: '100%' }
];

export const PLAN_MOCK_ASSUMPTIONS_D2C: Assumption[] = [
    { id: 'd2c1', text: 'Customers are willing to pay a 20% premium for sustainably-sourced materials.', risk: 'high', status: 'untested', sourceSection: 'Value Proposition' },
    { id: 'd2c2', text: 'Our target customer (millennials, aged 25-35) can be effectively acquired through Instagram and TikTok ads.', risk: 'high', status: 'untested', sourceSection: 'Go-to-Market Strategy' },
    { id: 'd2c3', text: 'We can maintain a Customer Acquisition Cost (CAC) below $50 while scaling ad spend.', risk: 'high', status: 'untested', sourceSection: 'Financial Projections' },
    { id: 'd2c4', text: 'The average customer will make at least 2 repeat purchases per year.', risk: 'medium', status: 'untested', sourceSection: 'Business Model' },
    { id: 'd2c5', text: 'Our supply chain can handle a 4x increase in order volume without significant delays.', risk: 'medium', status: 'untested', sourceSection: 'Operations' },
    { id: 'd2c6', text: 'The brand story and mission are strong enough to build a loyal community.', risk: 'low', status: 'untested', sourceSection: 'Marketing Strategy' },
];
