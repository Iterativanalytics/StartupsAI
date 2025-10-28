import { FileText, Building2, TrendingUp, Target, DollarSign, Paperclip, Users, Grid3x3 } from 'lucide-react';

export const sections = [
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    icon: FileText,
    description: 'High-level business overview',
    placeholder: 'Write your executive summary here...',
    subsections: [
      { id: 'company-overview', title: 'Company Overview' },
      { id: 'mission-statement', title: 'Mission Statement' },
      { id: 'key-highlights', title: 'Key Highlights' },
      { id: 'financial-summary', title: 'Financial Summary' }
    ]
  },
  {
    id: 'the-business',
    title: 'The Business',
    icon: Building2,
    description: 'Company description and structure',
    placeholder: 'Describe your business...',
    subsections: [
      { id: 'description', title: 'Description' },
      { id: 'background', title: 'Background' },
      { id: 'key-achievements', title: 'Key Achievements' },
      { id: 'problem-solution', title: 'Problem & Solution' },
      { id: 'mission-values', title: 'Our Mission & Values' },
      { id: 'my-story', title: 'My Story' },
      { id: 'mission-statement-2', title: 'Mission Statement' },
      { id: 'our-values', title: 'Our Values' },
      { id: 'structure-ownership', title: 'Structure & Ownership' },
      { id: 'shareholders', title: 'Shareholders' }
    ]
  },
  {
    id: 'products-services',
    title: 'Products / Services',
    icon: Grid3x3,
    description: 'Product and service offerings',
    placeholder: 'Describe your products and services...',
    subsections: [
      { id: 'business-strategy-materials', title: 'Business Strategy Materials (5% revenue)' },
      { id: 'entrepreneurship-resources', title: 'Entrepreneurship Resources (7%)' },
      { id: 'management-tools', title: 'Management Tools (10%)' },
      { id: 'business-dev-books', title: 'Business Development Books (1%)' },
      { id: 'strategic-planning', title: 'Strategic Planning Services (15%)' },
      { id: 'operational-improvement', title: 'Operational Improvement Services (7%)' },
      { id: 'financial-management', title: 'Financial Management Services (20%)' },
      { id: 'hr-consulting', title: 'Human Resource Consulting (10%)' },
      { id: 'enterprise-dev', title: 'Enterprise & Supplier Development (25%)' },
      { id: 'pricing', title: 'Pricing' },
      { id: 'targets', title: 'Targets' },
      { id: 'delivery', title: 'Delivery' }
    ]
  },
  {
    id: 'market-analysis',
    title: 'Market Analysis',
    icon: TrendingUp,
    description: 'Industry and target market analysis',
    placeholder: 'Analyze your market...',
    subsections: [
      { id: 'industry-overview', title: 'Industry Overview' },
      { id: 'target-market', title: 'Target Market' },
      { id: 'market-trends', title: 'Market Trends' },
      { id: 'competitive-analysis', title: 'Competitive Analysis' },
      { id: 'market-size', title: 'Market Size & Growth' }
    ]
  },
  {
    id: 'strategy',
    title: 'Strategy',
    icon: Target,
    description: 'Business objectives and growth plans',
    placeholder: 'Outline your strategy...',
    subsections: [
      { id: 'business-strategy', title: 'Business Strategy' },
      { id: 'marketing-plan', title: 'Marketing Plan' },
      { id: 'sales-strategy', title: 'Sales Strategy' },
      { id: 'growth-plan', title: 'Growth Plan' },
      { id: 'swot-analysis', title: 'SWOT Analysis' }
    ]
  },
  {
    id: 'operations',
    title: 'Operations',
    icon: Users,
    description: 'Operational processes and management',
    placeholder: 'Describe your operations...',
    subsections: [
      { id: 'operations-plan', title: 'Operations Plan' },
      { id: 'management-team', title: 'Management Team' },
      { id: 'key-personnel', title: 'Key Personnel' },
      { id: 'facilities', title: 'Facilities & Equipment' },
      { id: 'processes', title: 'Key Processes' }
    ]
  },
  {
    id: 'financials',
    title: 'Financials',
    icon: DollarSign,
    description: 'Financial projections and statements',
    placeholder: 'Add financial data...',
    subsections: [
      { id: 'financial-summary-2', title: 'Financial Summary' },
      { id: 'profit-loss', title: 'Profit & Loss Statement' },
      { id: 'cash-flow', title: 'Cash Flow Statement' },
      { id: 'balance-sheet', title: 'Balance Sheet' },
      { id: 'break-even', title: 'Break-even Analysis' },
      { id: 'funding-requirements', title: 'Funding Requirements' }
    ]
  },
  {
    id: 'appendix',
    title: 'Appendix',
    icon: Paperclip,
    description: 'Supporting documents',
    placeholder: 'Add supporting materials...',
    subsections: [
      { id: 'supporting-docs', title: 'Supporting Documents' },
      { id: 'charts-graphs', title: 'Charts & Graphs' },
      { id: 'legal-docs', title: 'Legal Documents' },
      { id: 'additional-info', title: 'Additional Information' }
    ]
  }
];
