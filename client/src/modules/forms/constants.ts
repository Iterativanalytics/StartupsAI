import { ApplicationForm, SimpleBusinessPlanData } from '@/types-hub';

export const MOCK_BUSINESS_PLAN: SimpleBusinessPlanData = {
  companyName: 'IterativStartups Inc.',
  description: 'IterativStartups is a comprehensive AI-powered business innovation platform that connects entrepreneurs, investors, and partners. Our hub unifies planning, pitching, proposals, and forms into a central workspace for strategic documents, guided by a Lean Design Thinking methodology.',
  problem: 'Early-stage startups often fail due to a lack of rigorous validation. They build products nobody wants because they rely on unverified assumptions instead of evidence. Traditional business planning is static and quickly becomes outdated, while existing tools fail to integrate planning with continuous, validated learning.',
  solution: 'Our platform provides a dynamic, iterative workflow based on a hybrid Lean Design Thinking methodology. We guide founders from problem discovery through to scaling, with AI tools to design experiments, track assumptions, and make data-driven pivot decisions. We turn business plans from static documents into living, evidence-backed strategies.',
  targetMarket: 'Our primary target market is early-stage tech startups (pre-seed to Series A), globally. We segment this into B2B SaaS, Fintech, and Climate Tech. Our secondary market is accelerators, incubators, and university entrepreneurship programs that need a structured methodology to guide their cohorts.',
  businessModel: 'We operate on a tiered SaaS subscription model (Free, Founder, Team, Enterprise). Additional revenue streams include a marketplace for certified advisors (20% commission) and methodology certification programs.',
  traction: 'We currently have over 2,500 startups on our platform, with a 67% success rate in pivoting towards a validated model. Over 15,000 experiments have been successfully designed and run through our system. Our user base is growing at 15% month-over-month. We have signed pilot programs with 3 major university accelerators.',
  team: 'Our team consists of seasoned entrepreneurs, lean startup coaches, and AI experts. CEO Jane Doe successfully exited her last startup for $50M and is a recognized expert in Lean methodologies. CTO John Smith is a former Google AI engineer with 10 years of experience in machine learning applications and holds 3 patents in NLP.',
  financials: 'We are seeking $2M in seed funding to expand our AI capabilities and scale our go-to-market efforts. We project to reach $4M ARR by Year 2, driven primarily by SaaS subscriptions and our advisor marketplace. Our current burn rate is $30k/month with a 12-month runway from our pre-seed round.'
};

export const MOCK_APPLICATIONS: ApplicationForm[] = [
  {
    id: 'yc-w25',
    name: 'Y Combinator W25',
    type: 'accelerator',
    organization: 'Y Combinator',
    deadline: '2024-10-15',
    sections: [
      {
        id: 'overview',
        title: 'Company Overview',
        fields: [
          { id: 'company_desc', label: 'Describe what your company does in one sentence.', type: 'textarea', required: true, maxLength: 250 },
          { id: 'problem', label: 'What problem are you solving?', type: 'textarea', required: true, maxLength: 500 },
          { id: 'solution', label: 'What is your solution?', type: 'textarea', required: true, maxLength: 500 },
        ],
      },
      {
        id: 'team',
        title: 'Founder Details',
        fields: [
          { id: 'team_background', label: 'Who are the founders and what makes you the right team to build this?', type: 'textarea', required: true, maxLength: 1000 },
        ],
      },
       {
        id: 'progress',
        title: 'Progress',
        fields: [
          { id: 'traction', label: 'What is your progress so far? (e.g., users, revenue, product development)', type: 'textarea', required: true, maxLength: 500 },
        ],
      },
    ],
  },
  {
    id: 'techstars-london-24',
    name: 'Techstars London',
    type: 'accelerator',
    organization: 'Techstars',
    deadline: '2024-11-01',
    sections: [
      {
        id: 'pitch',
        title: 'Your Pitch',
        fields: [
          { id: 'elevator_pitch', label: 'Elevator Pitch', type: 'textarea', required: true, maxLength: 300 },
          { id: 'target_customer', label: 'Who is your target customer and what is the market size?', type: 'textarea', required: true },
        ],
      },
      {
        id: 'team',
        title: 'Your Team',
        fields: [
          { id: 'team_summary', label: 'Tell us about your team\'s relevant experience.', type: 'textarea', required: true },
        ],
      },
    ],
  },
   {
    id: 'arch-grant-24',
    name: 'Arch Grant 2024',
    type: 'grant',
    organization: 'Arch Grants',
    deadline: '2024-09-30',
    sections: [
      {
        id: 'company_info',
        title: 'Company Information',
        fields: [
          { id: 'company_name', label: 'Company Name', type: 'text', required: true },
          { id: 'company_summary', label: 'Provide a brief summary of your business.', type: 'textarea', required: true, maxLength: 1000 },
        ],
      },
      {
        id: 'market',
        title: 'Market Opportunity',
        fields: [
          { id: 'market_size', label: 'What is your target market and its size?', type: 'textarea', required: true },
        ],
      },
       {
        id: 'financials',
        title: 'Financials',
        fields: [
          { id: 'funding_ask', label: 'What is your funding ask and how will you use it?', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    id: 'ai-for-good-25',
    name: 'AI for Good Prize',
    type: 'competition',
    organization: 'Global Impact Fund',
    deadline: '2025-01-20',
    sections: [
      {
        id: 'impact',
        title: 'Impact Statement',
        fields: [
          { id: 'problem_impact', label: 'Describe the social or environmental problem your AI solution addresses.', type: 'textarea', required: true },
          { id: 'solution_impact', label: 'How does your solution create a measurable positive impact?', type: 'textarea', required: true, maxLength: 2000 },
        ],
      },
      {
        id: 'tech',
        title: 'Technology',
        fields: [
          { id: 'ai_novelty', label: 'What is novel about your use of AI?', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    id: 'fintech-incubator-25',
    name: 'Fintech Incubator 2025',
    type: 'investment',
    organization: 'Innovate Finance',
    deadline: '2024-12-15',
    sections: [
      {
        id: 'business_model',
        title: 'Business Model',
        fields: [
          { id: 'revenue_model', label: 'How does your business make money?', type: 'textarea', required: true, placeholder: 'Describe your revenue streams (e.g., SaaS, transaction fees).' },
          { id: 'g2m', label: 'What is your go-to-market strategy?', type: 'textarea', required: true },
        ],
      },
      {
        id: 'compliance',
        title: 'Regulatory & Compliance',
        fields: [
          { id: 'regulatory_landscape', label: 'Describe the regulatory landscape for your solution and your compliance strategy.', type: 'textarea', required: true },
        ],
      },
       {
        id: 'financials_fintech',
        title: 'Financial Projections',
        fields: [
          { id: 'y3_projection', label: 'What is your 3-year revenue projection?', type: 'textarea', required: true },
        ],
      },
    ],
  },
];