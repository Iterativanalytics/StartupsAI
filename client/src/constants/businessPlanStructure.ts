/**
 * Business Plan Structure Constants
 * Based on VenturePlanner documentation and industry best practices
 */

export interface PlanSection {
  id: string;
  title: string;
  description?: string;
  aiPrompt?: string;
  required: boolean;
  estimatedWords: number;
  tips: string[];
}

export interface PlanChapter {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  sections: PlanSection[];
  tools?: string[];
  order: number;
}

export const BUSINESS_PLAN_STRUCTURE: PlanChapter[] = [
  {
    id: 'executive-summary',
    title: 'Executive',
    subtitle: 'Summary',
    description: 'A concise overview of your business plan highlighting key points',
    icon: 'FileText',
    order: 0,
    sections: [
      {
        id: 'summary',
        title: 'Summary',
        description: 'Brief overview of your entire business plan',
        aiPrompt: 'Write a compelling executive summary that captures the essence of your business, highlighting the problem you solve, your solution, target market, competitive advantage, and financial projections.',
        required: true,
        estimatedWords: 300,
        tips: [
          'Keep it concise - aim for 1-2 pages maximum',
          'Write this section last after completing other sections',
          'Focus on the most compelling aspects of your business',
          'Include key financial highlights and projections'
        ]
      },
      {
        id: 'our-mission',
        title: 'Our Mission',
        description: 'Your company\'s mission statement and core values',
        aiPrompt: 'Craft a powerful mission statement that defines your company\'s purpose, core values, and long-term vision. Make it inspiring and memorable.',
        required: true,
        estimatedWords: 150,
        tips: [
          'Make it clear and memorable',
          'Focus on your purpose and impact',
          'Align with your target audience values',
          'Keep it authentic and achievable'
        ]
      },
      {
        id: 'company-management',
        title: 'The Company & Management',
        description: 'Overview of company structure and leadership team',
        aiPrompt: 'Describe your company structure, legal entity, ownership, and introduce your management team highlighting their relevant experience and expertise.',
        required: true,
        estimatedWords: 400,
        tips: [
          'Highlight key team members and their expertise',
          'Include relevant past achievements',
          'Show how the team complements each other',
          'Mention advisors and board members if applicable'
        ]
      },
      {
        id: 'products-services',
        title: 'Our Products / Services',
        description: 'Description of your offerings and value proposition',
        aiPrompt: 'Detail your products or services, their unique features, benefits to customers, and how they solve specific problems better than alternatives.',
        required: true,
        estimatedWords: 350,
        tips: [
          'Focus on benefits, not just features',
          'Explain your unique value proposition',
          'Include pricing strategy overview',
          'Mention intellectual property if applicable'
        ]
      },
      {
        id: 'opportunity',
        title: 'The Opportunity',
        description: 'Market opportunity and growth potential',
        aiPrompt: 'Explain the market opportunity, why now is the right time, market size, growth trends, and how your business is positioned to capitalize on this opportunity.',
        required: true,
        estimatedWords: 300,
        tips: [
          'Use data to support market size claims',
          'Explain market trends favoring your business',
          'Show why timing is right',
          'Demonstrate scalability potential'
        ]
      },
      {
        id: 'financial-highlights',
        title: 'Financial Highlights',
        description: 'Key financial metrics and projections',
        aiPrompt: 'Summarize key financial projections including revenue forecasts, profitability timeline, funding requirements, and expected ROI for investors.',
        required: true,
        estimatedWords: 250,
        tips: [
          'Include 3-5 year revenue projections',
          'Show path to profitability',
          'Highlight key financial metrics',
          'Be realistic and data-driven'
        ]
      }
    ]
  },
  {
    id: 'the-business',
    title: 'The',
    subtitle: 'Business',
    description: 'Detailed information about your business foundation and operations',
    icon: 'Building2',
    order: 1,
    sections: [
      {
        id: 'description',
        title: 'Description',
        description: 'Comprehensive business description',
        aiPrompt: 'Provide a detailed description of your business including what you do, how you do it, who you serve, and what makes your business unique.',
        required: true,
        estimatedWords: 400,
        tips: [
          'Be specific about your business model',
          'Explain your competitive advantages',
          'Describe your target customers',
          'Include your business location and facilities'
        ]
      },
      {
        id: 'background',
        title: 'Background',
        description: 'Company history and founding story',
        aiPrompt: 'Share your company\'s origin story, key milestones achieved, and the journey that led to where you are today.',
        required: false,
        estimatedWords: 300,
        tips: [
          'Tell a compelling founding story',
          'Highlight key milestones and achievements',
          'Show traction and progress',
          'Include any notable partnerships or customers'
        ]
      },
      {
        id: 'problem-solution',
        title: 'Problem & Solution',
        description: 'The problem you solve and your solution',
        aiPrompt: 'Clearly articulate the problem your target market faces, why existing solutions are inadequate, and how your solution uniquely addresses this problem.',
        required: true,
        estimatedWords: 450,
        tips: [
          'Quantify the problem with data',
          'Show you deeply understand customer pain points',
          'Explain why your solution is superior',
          'Include customer testimonials if available'
        ]
      },
      {
        id: 'mission-values',
        title: 'Mission & Values',
        description: 'Core mission, vision, and company values',
        aiPrompt: 'Define your mission statement, long-term vision, and core values that guide your business decisions and culture.',
        required: true,
        estimatedWords: 300,
        tips: [
          'Make values actionable and specific',
          'Align with target customer values',
          'Show how values influence decisions',
          'Include vision for 5-10 years ahead'
        ]
      },
      {
        id: 'structure-ownership',
        title: 'Structure & Ownership',
        description: 'Legal structure and ownership details',
        aiPrompt: 'Describe your legal business structure, ownership breakdown, equity distribution, and any relevant governance information.',
        required: true,
        estimatedWords: 250,
        tips: [
          'Specify legal entity type',
          'Include ownership percentages',
          'Mention any investor rights or restrictions',
          'Describe decision-making structure'
        ]
      }
    ]
  },
  {
    id: 'products-services',
    title: 'Products /',
    subtitle: 'Services',
    description: 'Detailed information about your offerings',
    icon: 'Package',
    order: 2,
    sections: [
      {
        id: 'descriptions-features',
        title: 'Descriptions & Features',
        description: 'Detailed product/service descriptions and features',
        aiPrompt: 'Provide comprehensive descriptions of your products or services, their key features, technical specifications, and how they deliver value to customers.',
        required: true,
        estimatedWords: 500,
        tips: [
          'Organize by product/service line',
          'Focus on customer benefits',
          'Include technical specifications if relevant',
          'Use visuals and diagrams where helpful'
        ]
      },
      {
        id: 'market-readiness',
        title: 'Market Readiness',
        description: 'Product development stage and readiness',
        aiPrompt: 'Explain your product development stage, testing completed, customer feedback received, and timeline for market launch or expansion.',
        required: true,
        estimatedWords: 300,
        tips: [
          'Be honest about development stage',
          'Include testing and validation results',
          'Show customer feedback and iterations',
          'Provide realistic timeline'
        ]
      },
      {
        id: 'pricing-margins',
        title: 'Pricing & Margins',
        description: 'Pricing strategy and profit margins',
        aiPrompt: 'Detail your pricing strategy, how prices compare to competitors, profit margins, and the rationale behind your pricing decisions.',
        required: true,
        estimatedWords: 350,
        tips: [
          'Justify your pricing strategy',
          'Compare to competitor pricing',
          'Show profit margin calculations',
          'Explain any tiered pricing models'
        ]
      },
      {
        id: 'guarantees-warranties',
        title: 'Guarantees & Warranties',
        description: 'Product guarantees and customer support',
        aiPrompt: 'Describe any guarantees, warranties, or service level agreements you offer, and how you handle customer support and satisfaction.',
        required: false,
        estimatedWords: 200,
        tips: [
          'Detail warranty terms and conditions',
          'Explain customer support processes',
          'Include return and refund policies',
          'Mention quality assurance measures'
        ]
      },
      {
        id: 'future-development',
        title: 'Future Development',
        description: 'Product roadmap and future plans',
        aiPrompt: 'Outline your product development roadmap, planned features, new products or services, and innovation strategy for the next 2-3 years.',
        required: false,
        estimatedWords: 300,
        tips: [
          'Show clear product roadmap',
          'Prioritize based on customer needs',
          'Include innovation strategy',
          'Mention R&D investments'
        ]
      }
    ]
  },
  {
    id: 'market-analysis',
    title: 'Market',
    subtitle: 'Analysis',
    description: 'Comprehensive market research and competitive analysis',
    icon: 'TrendingUp',
    order: 3,
    sections: [
      {
        id: 'swot-analysis',
        title: 'SWOT Analysis',
        description: 'Strengths, Weaknesses, Opportunities, and Threats',
        aiPrompt: 'Conduct a thorough SWOT analysis identifying your internal strengths and weaknesses, and external opportunities and threats in the market.',
        required: true,
        estimatedWords: 400,
        tips: [
          'Be honest about weaknesses',
          'Focus on actionable insights',
          'Link to strategic decisions',
          'Update regularly as market changes'
        ]
      },
      {
        id: 'market-segments',
        title: 'Market Segments',
        description: 'Target market segments and sizing',
        aiPrompt: 'Define your target market segments, their characteristics, size, growth potential, and why they are attractive opportunities for your business.',
        required: true,
        estimatedWords: 450,
        tips: [
          'Use TAM, SAM, SOM framework',
          'Provide data-backed market sizing',
          'Explain segmentation criteria',
          'Show addressable market calculation'
        ]
      },
      {
        id: 'buyer-personas',
        title: 'Buyer Personas',
        description: 'Detailed customer personas and profiles',
        aiPrompt: 'Create detailed buyer personas including demographics, psychographics, pain points, buying behavior, and decision-making criteria.',
        required: true,
        estimatedWords: 400,
        tips: [
          'Create 2-3 detailed personas',
          'Include demographics and psychographics',
          'Describe pain points and motivations',
          'Show buying journey and decision process'
        ]
      },
      {
        id: 'competitor-analysis',
        title: 'Competitor Analysis',
        description: 'Competitive landscape and positioning',
        aiPrompt: 'Analyze your main competitors, their strengths and weaknesses, market positioning, and how you differentiate from them.',
        required: true,
        estimatedWords: 500,
        tips: [
          'Identify direct and indirect competitors',
          'Use competitive matrix or comparison table',
          'Highlight your competitive advantages',
          'Include market share data if available'
        ]
      }
    ]
  },
  {
    id: 'strategy',
    title: 'Strategy',
    subtitle: '',
    description: 'Business and marketing strategy',
    icon: 'Target',
    order: 4,
    sections: [
      {
        id: 'objectives',
        title: 'Objectives',
        description: 'Business objectives and goals',
        aiPrompt: 'Define clear, measurable business objectives for the next 1-3 years using SMART goal framework (Specific, Measurable, Achievable, Relevant, Time-bound).',
        required: true,
        estimatedWords: 350,
        tips: [
          'Use SMART goal framework',
          'Include short and long-term objectives',
          'Make goals measurable and time-bound',
          'Align with overall business strategy'
        ]
      },
      {
        id: 'promotional-strategy',
        title: 'Promotional Strategy',
        description: 'Marketing and promotional plans',
        aiPrompt: 'Outline your marketing and promotional strategy including channels, tactics, messaging, budget allocation, and expected ROI.',
        required: true,
        estimatedWords: 450,
        tips: [
          'Detail marketing channels and tactics',
          'Include content marketing strategy',
          'Show budget allocation',
          'Provide metrics for success'
        ]
      },
      {
        id: 'pricing-strategy',
        title: 'Pricing Strategy',
        description: 'Pricing approach and rationale',
        aiPrompt: 'Explain your pricing strategy, whether cost-based, value-based, or competitive, and how it supports your market positioning and profitability goals.',
        required: true,
        estimatedWords: 300,
        tips: [
          'Explain pricing methodology',
          'Compare to competitor pricing',
          'Show impact on margins',
          'Include any dynamic pricing plans'
        ]
      },
      {
        id: 'distribution-strategy',
        title: 'Distribution Strategy',
        description: 'Sales channels and distribution approach',
        aiPrompt: 'Describe how you will distribute your products or services, including sales channels, partnerships, logistics, and customer acquisition strategy.',
        required: true,
        estimatedWords: 350,
        tips: [
          'Detail all distribution channels',
          'Explain sales process',
          'Include partnership strategy',
          'Describe logistics and fulfillment'
        ]
      },
      {
        id: 'exit-strategy',
        title: 'Exit Strategy',
        description: 'Long-term exit or succession plans',
        aiPrompt: 'Outline potential exit strategies such as acquisition, IPO, merger, or succession planning, and the timeline for these scenarios.',
        required: false,
        estimatedWords: 250,
        tips: [
          'Consider multiple exit scenarios',
          'Include realistic timeline',
          'Show potential acquirers or IPO path',
          'Discuss succession planning if applicable'
        ]
      }
    ]
  },
  {
    id: 'operations',
    title: 'Operations',
    subtitle: '',
    description: 'Operational plans and processes',
    icon: 'Settings',
    order: 5,
    sections: [
      {
        id: 'operations-plan',
        title: 'Operations Plan',
        description: 'Day-to-day operations and processes',
        aiPrompt: 'Describe your operational processes, workflow, key activities, and how you deliver your products or services efficiently.',
        required: true,
        estimatedWords: 450,
        tips: [
          'Detail key operational processes',
          'Include workflow diagrams',
          'Show scalability plans',
          'Mention technology and systems used'
        ]
      },
      {
        id: 'facilities-equipment',
        title: 'Facilities & Equipment',
        description: 'Physical infrastructure and equipment needs',
        aiPrompt: 'Describe your facilities, location, equipment, technology infrastructure, and any capital expenditure requirements.',
        required: true,
        estimatedWords: 300,
        tips: [
          'List key facilities and locations',
          'Detail equipment and technology',
          'Include capacity and utilization',
          'Mention any expansion plans'
        ]
      },
      {
        id: 'supply-chain',
        title: 'Supply Chain',
        description: 'Supply chain and vendor management',
        aiPrompt: 'Explain your supply chain strategy, key suppliers, inventory management, and how you ensure reliable and cost-effective operations.',
        required: true,
        estimatedWords: 350,
        tips: [
          'Identify key suppliers and partners',
          'Explain inventory management',
          'Describe quality control processes',
          'Include contingency plans'
        ]
      },
      {
        id: 'quality-control',
        title: 'Quality Control',
        description: 'Quality assurance and control measures',
        aiPrompt: 'Detail your quality control processes, standards, certifications, and how you ensure consistent quality in your products or services.',
        required: false,
        estimatedWords: 250,
        tips: [
          'Describe QA/QC processes',
          'Include relevant certifications',
          'Show metrics for quality',
          'Explain continuous improvement approach'
        ]
      }
    ]
  },
  {
    id: 'financials',
    title: 'Financials',
    subtitle: '',
    description: 'Financial projections and analysis',
    icon: 'DollarSign',
    order: 6,
    sections: [
      {
        id: 'financial-data',
        title: 'Financial Data',
        description: 'Key financial metrics and assumptions',
        aiPrompt: 'Present your key financial assumptions, metrics, and data that underpin your financial projections and business model.',
        required: true,
        estimatedWords: 400,
        tips: [
          'State all key assumptions clearly',
          'Include unit economics',
          'Show customer acquisition costs',
          'Detail revenue model'
        ]
      },
      {
        id: 'profit-loss',
        title: 'Profit & Loss',
        description: 'Income statement projections',
        aiPrompt: 'Provide detailed profit and loss projections for 3-5 years including revenue, cost of goods sold, operating expenses, and net income.',
        required: true,
        estimatedWords: 300,
        tips: [
          'Project 3-5 years monthly/quarterly',
          'Break down revenue streams',
          'Detail all expense categories',
          'Show path to profitability'
        ]
      },
      {
        id: 'balance-sheet',
        title: 'Balance Sheet',
        description: 'Assets, liabilities, and equity projections',
        aiPrompt: 'Create projected balance sheets showing assets, liabilities, and equity over time, demonstrating financial health and capital requirements.',
        required: true,
        estimatedWords: 250,
        tips: [
          'Show assets and liabilities',
          'Include working capital needs',
          'Detail equity structure',
          'Show financial ratios'
        ]
      },
      {
        id: 'cash-flow',
        title: 'Cash Flow',
        description: 'Cash flow projections and analysis',
        aiPrompt: 'Present cash flow projections showing operating, investing, and financing activities, demonstrating liquidity and funding needs.',
        required: true,
        estimatedWords: 300,
        tips: [
          'Show monthly cash flow for first year',
          'Include burn rate and runway',
          'Detail funding requirements',
          'Show break-even analysis'
        ]
      }
    ],
    tools: ['Financial Setup Assistant', 'Update Financials', 'Break-even Calculator']
  },
  {
    id: 'appendix',
    title: 'Appendix',
    subtitle: '',
    description: 'Supporting documents and additional information',
    icon: 'Paperclip',
    order: 7,
    sections: [
      {
        id: 'supporting-documents',
        title: 'Supporting Documents',
        description: 'Additional documentation and materials',
        aiPrompt: 'List and organize supporting documents such as market research, legal documents, product specifications, and other relevant materials.',
        required: false,
        estimatedWords: 200,
        tips: [
          'Include market research data',
          'Add product specifications',
          'Attach legal documents',
          'Include team resumes'
        ]
      },
      {
        id: 'references',
        title: 'References',
        description: 'Citations and sources',
        aiPrompt: 'Provide references for all data, statistics, and research cited in your business plan to establish credibility.',
        required: false,
        estimatedWords: 150,
        tips: [
          'Cite all data sources',
          'Use credible sources',
          'Include URLs and dates',
          'Follow consistent citation format'
        ]
      }
    ]
  }
];

// Helper functions
export const getChapterById = (id: string): PlanChapter | undefined => {
  return BUSINESS_PLAN_STRUCTURE.find(chapter => chapter.id === id);
};

export const getSectionById = (chapterId: string, sectionId: string): PlanSection | undefined => {
  const chapter = getChapterById(chapterId);
  return chapter?.sections.find(section => section.id === sectionId);
};

export const getAllSections = (): PlanSection[] => {
  return BUSINESS_PLAN_STRUCTURE.flatMap(chapter => chapter.sections);
};

export const getTotalSections = (): number => {
  return getAllSections().length;
};

export const getRequiredSections = (): PlanSection[] => {
  return getAllSections().filter(section => section.required);
};

export const getChapterProgress = (chapterId: string, completedSections: string[]): number => {
  const chapter = getChapterById(chapterId);
  if (!chapter) return 0;
  
  const totalSections = chapter.sections.length;
  const completed = chapter.sections.filter(s => completedSections.includes(s.id)).length;
  
  return totalSections > 0 ? Math.round((completed / totalSections) * 100) : 0;
};

export const getOverallProgress = (completedSections: string[]): number => {
  const total = getTotalSections();
  const completed = completedSections.length;
  
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};
