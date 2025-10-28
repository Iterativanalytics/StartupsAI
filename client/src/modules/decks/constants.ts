import {
  Phases,
  Tools,
  DeckCompetitorRow,
  PricingTier,
  RevenueStream,
  DeckStyle,
} from '@/types-hub';
import {
  Users,
  Target,
  Lightbulb,
  TestTube,
  TrendingUp,
  RefreshCw,
  Rocket,
  Building2,
} from 'lucide-react';

export const DECK_STYLES: DeckStyle[] = [
  {
    id: 'seed-stage',
    name: 'Seed Stage Pitch',
    description: 'For early-stage startups seeking initial funding. Focus on problem, solution, and team.',
    icon: Rocket,
    instruction: 'Focus heavily on the problem, the uniqueness of the solution, the team\'s expertise, and the market opportunity. Keep financial projections high-level. The tone should be visionary and passionate.'
  },
  {
    id: 'growth-stage',
    name: 'Growth Stage (Series A+)',
    description: 'For companies with traction seeking to scale. Focus on metrics, unit economics, and growth strategy.',
    icon: TrendingUp,
    instruction: 'Emphasize traction, key metrics (MRR, CAC, LTV), unit economics, and a clear, scalable growth strategy. Financial projections should be detailed. The tone should be confident and data-driven.'
  },
  {
    id: 'internal-pitch',
    name: 'Internal Pitch',
    description: 'For proposing a new project or initiative within a larger company. Focus on alignment with company goals.',
    icon: Building2,
    instruction: 'Focus on how the project aligns with strategic company objectives, resource requirements, potential ROI, and risk mitigation. The tone should be professional, collaborative, and aligned with corporate language.'
  }
];

export const DECK_PHASES: Phases = {
  discover: {
    name: 'Problem Discovery',
    icon: Users,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    description:
      'Deeply understand your target audience and the problems they face.',
    methodology: 'Design Thinking',
    steps: [
      {
        id: 'd1',
        title: 'Define Target Persona',
        description:
          'Create detailed user personas for your primary audience segments.',
        tool: 'personaGenerator',
      },
      {
        id: 'd2',
        title: 'Conduct Ethnographic Interviews',
        description:
          'Run structured interviews to uncover pains, gains, and jobs-to-be-done.',
        tool: 'interviewScriptGenerator',
      },
      {
        id: 'd3',
        title: 'Synthesize Findings into Insights',
        description:
          'Analyze interview data to identify patterns and actionable insights.',
        tool: 'insightsSynthesizer',
      },
    ],
  },
  define: {
    name: 'Solution Definition',
    icon: Target,
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    description:
      'Clearly articulate the problem and frame your unique value proposition.',
    methodology: 'Jobs-to-be-Done',
    steps: [
      {
        id: 'def1',
        title: 'Craft Problem Statement',
        description:
          'Write a concise, human-centered problem statement based on your research.',
        tool: 'problemStyler',
      },
      {
        id: 'def2',
        title: 'Develop Value Proposition Canvas',
        description:
          "Map customer pains and gains to your solution's features and benefits.",
        tool: 'vpcGenerator',
      },
      {
        id: 'def3',
        title: 'Formulate Key Hypotheses',
        description:
          'List the riskiest assumptions about your problem and solution.',
        tool: 'hypothesisCreator',
      },
    ],
  },
  ideate: {
    name: 'Creative Ideation',
    icon: Lightbulb,
    color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    description:
      'Generate a wide range of potential solutions to the defined problem.',
    methodology: 'Divergent Thinking',
    steps: [
      {
        id: 'i1',
        title: 'Run "How Might We" Session',
        description:
          'Brainstorm creative solutions framed as "How Might We..." questions.',
        tool: 'hmwGenerator',
      },
      {
        id: 'i2',
        title: 'Sketch Solution Concepts',
        description: 'Create low-fidelity sketches of different solution approaches.',
        tool: 'storyboarder',
      },
      {
        id: 'i3',
        title: 'Prioritize Ideas with Impact/Effort Matrix',
        description:
          'Plot ideas on a 2x2 matrix to identify quick wins and strategic initiatives.',
        tool: 'matrixPlotter',
      },
    ],
  },
  prototype: {
    name: 'Rapid Prototyping',
    icon: TestTube,
    color: 'bg-gradient-to-br from-green-500 to-teal-500',
    description:
      'Build minimum viable experiments to test your core hypotheses.',
    methodology: 'Lean Prototyping',
    steps: [
      {
        id: 'p1',
        title: 'Design Minimum Viable Experiment',
        description:
          'Define the simplest thing you can build to get validated learning.',
        tool: 'mveDesigner',
      },
      {
        id: 'p2',
        title: 'Create Interactive Prototype',
        description:
          'Build a clickable prototype or landing page for user testing.',
        tool: 'prototypeBuilder',
      },
      {
        id: 'p3',
        title: 'Define Success Metrics',
        description:
          'Set clear, measurable goals to determine if your hypothesis is valid.',
        tool: 'metricsDefiner',
      },
    ],
  },
  test: {
    name: 'User Validation',
    icon: TrendingUp,
    color: 'bg-gradient-to-br from-red-500 to-orange-500',
    description:
      'Test your prototypes with real users to gather qualitative and quantitative data.',
    methodology: 'Build-Measure-Learn',
    steps: [
      {
        id: 't1',
        title: 'Conduct Usability Testing',
        description:
          'Observe users interacting with your prototype to identify friction points.',
        tool: 'usabilityTestPlanner',
      },
      {
        id: 't2',
        title: 'Run A/B Tests on Value Prop',
        description:
          'Test different versions of your messaging to see what resonates.',
        tool: 'abTestDesigner',
      },
      {
        id: 't3',
        title: 'Analyze Results & Iterate',
        description:
          'Synthesize feedback and data to decide whether to persevere or pivot.',
        tool: 'dataAnalyzer',
      },
    ],
  },
  scale: {
    name: 'Product-Market Fit',
    icon: RefreshCw,
    color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    description:
      'Iterate based on feedback until you achieve strong product-market fit.',
    methodology: 'Growth Hacking',
    steps: [
      {
        id: 's1',
        title: 'Measure Product-Market Fit Score',
        description: 'Use surveys (e.g., Sean Ellis test) to quantify PMF.',
        tool: 'pmfSurvey',
      },
      {
        id: 's2',
        title: 'Identify Growth Levers',
        description:
          'Analyze your validated model to find key drivers for growth.',
        tool: 'growthModeler',
      },
      {
        id: 's3',
        title: 'Develop Go-to-Market Strategy',
        description:
          'Create a scalable plan for user acquisition based on validated channels.',
        tool: 'gtmStrategist',
      },
    ],
  },
};

export const DECK_TOOLS: Tools = {
  personaGenerator: {
    name: 'AI Persona Generator',
    description: 'Generates user personas from interview transcripts.',
    outputs: ['User Persona Docs'],
  },
  interviewScriptGenerator: {
    name: 'Interview Script Generator',
    description: 'Creates structured user interview scripts.',
    outputs: ['Interview Guide'],
  },
  insightsSynthesizer: {
    name: 'Insights Synthesizer',
    description: 'Finds patterns in qualitative data.',
    outputs: ['Key Insights Report'],
  },
  problemStyler: {
    name: 'Problem Statement Styler',
    description: 'Reframes insights into powerful problem statements.',
    outputs: ['Problem Statement'],
  },
  vpcGenerator: {
    name: 'Value Prop Canvas Generator',
    description: 'Builds a VPC from problem/solution data.',
    outputs: ['Value Proposition Canvas'],
  },
  hypothesisCreator: {
    name: 'Hypothesis Creator',
    description: 'Turns assumptions into testable hypotheses.',
    outputs: ['Hypothesis Backlog'],
  },
  hmwGenerator: {
    name: 'How Might We Generator',
    description: 'Turns problems into brainstorming prompts.',
    outputs: ['HMW Statements'],
  },
  storyboarder: {
    name: 'AI Storyboarder',
    description: 'Creates visual storyboards for solution concepts.',
    outputs: ['Solution Storyboard'],
  },
  matrixPlotter: {
    name: 'Impact/Effort Matrix Plotter',
    description: 'Visualizes idea priority.',
    outputs: ['Prioritization Matrix'],
  },
  mveDesigner: {
    name: 'MVE Designer',
    description: 'Designs the smallest possible experiment.',
    outputs: ['Experiment Design Doc'],
  },
  prototypeBuilder: {
    name: 'No-Code Prototype Builder',
    description: 'Creates interactive prototypes.',
    outputs: ['Clickable Prototype URL'],
  },
  metricsDefiner: {
    name: 'Success Metrics Definer',
    description: 'Identifies KPIs for experiments.',
    outputs: ['Metrics Dashboard'],
  },
  usabilityTestPlanner: {
    name: 'Usability Test Planner',
    description: 'Generates tasks and questions for tests.',
    outputs: ['Test Plan'],
  },
  abTestDesigner: {
    name: 'A/B Test Designer',
    description: 'Structures A/B tests for messaging.',
    outputs: ['A/B Test Spec'],
  },
  dataAnalyzer: {
    name: 'Data Analyzer',
    description: 'Summarizes test results.',
    outputs: ['Learning Summary'],
  },
  pmfSurvey: {
    name: 'PMF Survey Tool',
    description: 'Deploys and analyzes the Sean Ellis test.',
    outputs: ['PMF Score Report'],
  },
  growthModeler: {
    name: 'Growth Modeler',
    description: 'Forecasts growth based on key inputs.',
    outputs: ['Growth Model Spreadsheet'],
  },
  gtmStrategist: {
    name: 'GTM Strategist',
    description: 'Outlines a go-to-market strategy.',
    outputs: ['GTM Plan'],
  },
};

export const DECK_COMPETITOR_COMPARISON: DeckCompetitorRow[] = [
  {
    feature: 'Lean/Validation Framework',
    iterativDecks: 'Core Feature',
    growthWheel: 'No',
    venturePlanner: 'No',
    livePlan: 'No',
  },
  {
    feature: 'AI-Generated Content',
    iterativDecks: 'Evidence-based Synthesis',
    growthWheel: 'Yes (Narrative)',
    venturePlanner: 'Yes (Full Deck)',
    livePlan: 'No',
  },
  {
    feature: 'Assumption Tracking',
    iterativDecks: 'Yes (Dashboard)',
    growthWheel: 'No',
    venturePlanner: 'No',
    livePlan: 'Partial (Financials)',
  },
  {
    feature: 'Experiment Design Tools',
    iterativDecks: 'Yes',
    growthWheel: 'No',
    venturePlanner: 'No',
    livePlan: 'No',
  },
  {
    feature: 'Pivot Intelligence',
    iterativDecks: 'Yes (Structured)',
    growthWheel: 'No',
    venturePlanner: 'No',
    livePlan: 'No',
  },
  {
    feature: 'Slide Design & Aesthetics',
    iterativDecks: 'Good',
    growthWheel: 'Excellent',
    venturePlanner: 'Excellent',
    livePlan: 'Basic',
  },
  {
    feature: 'Collaboration Tools',
    iterativDecks: 'Yes',
    growthWheel: 'Yes',
    venturePlanner: 'Yes',
    livePlan: 'Yes',
  },
  {
    feature: 'Financial Projections',
    iterativDecks: 'Integrated with Validation',
    growthWheel: 'No',
    venturePlanner: 'No',
    livePlan: 'Core Feature',
  },
];

export const DECK_PRICING_TIERS: PricingTier[] = [
  {
    name: 'Founder',
    price: '$0',
    description: 'For individuals validating their initial idea.',
    features: [
      '1 Project',
      'Fast Track Mode',
      'Problem Discovery Phase',
      'Community Access',
    ],
    cta: 'Start for Free',
    highlighted: false,
  },
  {
    name: 'Startup',
    price: '$49/mo',
    description: 'For teams actively building and iterating.',
    features: [
      '5 Projects',
      'Full Validation Workflow',
      'AI Experiment Designer',
      'Pivot Intelligence',
      'Team Collaboration',
    ],
    cta: 'Choose Startup',
    highlighted: true,
  },
  {
    name: 'Scaleup',
    price: '$199/mo',
    description: 'For companies scaling a validated product.',
    features: [
      'Unlimited Projects',
      'Advanced Growth Tools',
      'Investor Reporting',
      'API Access',
      'Priority Support',
    ],
    cta: 'Choose Scaleup',
    highlighted: false,
  },
  {
    name: 'Accelerator',
    price: 'Custom',
    description: 'For incubators, VCs, and universities.',
    features: [
      'Cohort Management',
      'Portfolio Dashboard',
      'Custom Branding',
      'Methodology Training',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export const DECK_REVENUE_STREAMS: RevenueStream[] = [
  {
    stream: 'Startup Plan (SaaS)',
    year1: '$120k',
    year2: '$600k',
    year3: '$2.4M',
    percentage: '75%',
  },
  {
    stream: 'Scaleup Plan (SaaS)',
    year1: '$40k',
    year2: '$250k',
    year3: '$1.0M',
    percentage: '20%',
  },
  {
    stream: 'Accelerator Deals (B2B)',
    year1: '$50k',
    year2: '$150k',
    year3: '$400k',
    percentage: '5%',
  },
  {
    stream: 'Certification Programs',
    year1: '$10k',
    year2: '$50k',
    year3: '$200k',
    percentage: '2%',
  },
  {
    stream: 'Total ARR',
    year1: '$220k',
    year2: '$1.05M',
    year3: '$4.0M',
    percentage: '100%',
  },
];

// --- NEW DATA FOR DIVERSE INVESTOR PERSONA ---

export const DECK_REVENUE_STREAMS_HARDWARE: RevenueStream[] = [
  {
    stream: 'Unit Sales (Smart Device)',
    year1: '$500k',
    year2: '$3M',
    year3: '$15M',
    percentage: '85%',
  },
  {
    stream: 'Subscription Service (Premium Features)',
    year1: '$50k',
    year2: '$500k',
    year3: '$2M',
    percentage: '10%',
  },
  {
    stream: 'Extended Warranty & Support',
    year1: '$25k',
    year2: '$200k',
    year3: '$1M',
    percentage: '5%',
  },
  {
    stream: 'Total Revenue',
    year1: '$575k',
    year2: '$3.7M',
    year3: '$18M',
    percentage: '100%',
  },
];
