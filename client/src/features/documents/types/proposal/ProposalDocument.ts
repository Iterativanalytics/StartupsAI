import { BaseDocument, DocumentType, DocumentContent, DocumentMetadata } from '../document.types';

/**
 * Proposal Document Type with Subtypes
 * 
 * This document type handles various proposal types including:
 * - RFP (Request for Proposal) responses
 * - RFI (Request for Information) responses  
 * - RFQ (Request for Quote) responses
 * - Grant proposals
 * - Investment proposals
 * - Partnership proposals
 */
export interface ProposalDocument extends BaseDocument {
  type: 'proposal';
  content: ProposalContent;
  metadata: ProposalMetadata;
  subtype?: ProposalSubtype;
}

export type ProposalSubtype = 'rfp' | 'rfi' | 'rfq' | 'grant' | 'investment' | 'partnership';

export interface ProposalContent extends DocumentContent {
  format: 'structured';
  data: {
    sections: ProposalSection[];
    requirements: ProposalRequirement[];
    responses: ProposalResponse[];
    attachments: ProposalAttachment[];
    compliance: ComplianceCheck[];
  };
}

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  order: number;
  required: boolean;
  completed: boolean;
  wordCount: number;
  lastModified: Date;
  aiGenerated: boolean;
  aiScore?: number;
  suggestions?: string[];
  requirements?: string[];
}

export interface ProposalRequirement {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  required: boolean;
  response?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'reviewed';
  dueDate?: Date;
  assignee?: string;
  aiGenerated?: boolean;
  confidence?: number;
}

export interface ProposalResponse {
  id: string;
  requirementId: string;
  content: string;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  quality: number;
  completeness: number;
  compliance: number;
  aiGenerated: boolean;
  lastModified: Date;
  reviewer?: string;
  feedback?: string;
}

export interface ProposalAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  category: string;
  required: boolean;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
}

export interface ComplianceCheck {
  id: string;
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';
  evidence: string;
  notes?: string;
  checkedBy?: string;
  checkedAt?: Date;
  confidence: number;
}

export interface ProposalMetadata extends DocumentMetadata {
  proposalType: ProposalSubtype;
  organization: string;
  deadline: Date;
  budget?: number;
  currency?: string;
  status: ProposalStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  winProbability: number;
  competitionLevel: 'low' | 'medium' | 'high';
  keyStakeholders: Stakeholder[];
  evaluationCriteria: EvaluationCriteria[];
  submissionRequirements: SubmissionRequirement[];
}

export type ProposalStatus = 
  | 'draft' 
  | 'in-progress' 
  | 'under-review' 
  | 'submitted' 
  | 'under-evaluation' 
  | 'shortlisted' 
  | 'won' 
  | 'lost' 
  | 'cancelled';

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
  influence: 'low' | 'medium' | 'high';
  attitude: 'supportive' | 'neutral' | 'opposed';
  notes?: string;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  score?: number;
  maxScore: number;
  notes?: string;
}

export interface SubmissionRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  format?: string;
  maxSize?: number;
  deadline?: Date;
  submitted: boolean;
  submittedAt?: Date;
}

// RFP-specific interfaces
export interface RFPProposal extends ProposalDocument {
  subtype: 'rfp';
  content: RFPProposalContent;
  metadata: RFPProposalMetadata;
}

export interface RFPProposalContent extends ProposalContent {
  data: ProposalContent['data'] & {
    technicalProposal: TechnicalProposal;
    commercialProposal: CommercialProposal;
    managementProposal: ManagementProposal;
    pastPerformance: PastPerformance[];
  };
}

export interface TechnicalProposal {
  approach: string;
  methodology: string;
  timeline: ProjectTimeline;
  deliverables: Deliverable[];
  risks: Risk[];
  mitigation: string[];
}

export interface CommercialProposal {
  pricing: PricingStructure;
  paymentTerms: string;
  warranties: string[];
  support: SupportStructure;
  terms: string[];
}

export interface ManagementProposal {
  team: TeamMember[];
  organization: OrganizationStructure;
  communication: CommunicationPlan;
  quality: QualityAssurance;
}

export interface ProjectTimeline {
  phases: ProjectPhase[];
  milestones: Milestone[];
  dependencies: Dependency[];
  criticalPath: string[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  deliverables: string[];
  resources: string[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  date: Date;
  deliverables: string[];
  acceptance: string[];
}

export interface Dependency {
  id: string;
  name: string;
  type: 'internal' | 'external';
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export interface Deliverable {
  id: string;
  name: string;
  description: string;
  format: string;
  dueDate: Date;
  acceptance: string[];
}

export interface Risk {
  id: string;
  category: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  contingency: string;
}

export interface PricingStructure {
  basePrice: number;
  currency: string;
  breakdown: PricingBreakdown[];
  assumptions: string[];
  exclusions: string[];
}

export interface PricingBreakdown {
  category: string;
  description: string;
  amount: number;
  unit: string;
  quantity: number;
  total: number;
}

export interface SupportStructure {
  level: string;
  description: string;
  hours: number;
  responseTime: string;
  availability: string;
  cost: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: number;
  qualifications: string[];
  availability: number;
  cost: number;
}

export interface OrganizationStructure {
  hierarchy: string;
  reporting: string;
  governance: string;
  escalation: string;
}

export interface CommunicationPlan {
  frequency: string;
  format: string;
  participants: string[];
  agenda: string[];
  reporting: string;
}

export interface QualityAssurance {
  standards: string[];
  processes: string[];
  reviews: string[];
  testing: string[];
  metrics: string[];
}

export interface PastPerformance {
  id: string;
  project: string;
  client: string;
  value: number;
  duration: number;
  outcome: string;
  reference: string;
  lessons: string[];
}

export interface RFPProposalMetadata extends ProposalMetadata {
  proposalType: 'rfp';
  rfpNumber: string;
  rfpTitle: string;
  issuingOrganization: string;
  contractValue?: number;
  contractDuration?: number;
  evaluationMethod: string;
  evaluationCriteria: EvaluationCriteria[];
  submissionFormat: string;
  pageLimit?: number;
  wordLimit?: number;
}

// RFI-specific interfaces
export interface RFIProposal extends ProposalDocument {
  subtype: 'rfi';
  content: RFIProposalContent;
  metadata: RFIProposalMetadata;
}

export interface RFIProposalContent extends ProposalContent {
  data: ProposalContent['data'] & {
    informationResponses: InformationResponse[];
    capabilities: Capability[];
    qualifications: Qualification[];
  };
}

export interface InformationResponse {
  id: string;
  question: string;
  answer: string;
  category: string;
  confidence: number;
  sources: string[];
  attachments: string[];
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  evidence: string[];
  certifications: string[];
}

export interface Qualification {
  id: string;
  type: string;
  description: string;
  level: string;
  issuer: string;
  date: Date;
  expiry?: Date;
  verification: string;
}

export interface RFIProposalMetadata extends ProposalMetadata {
  proposalType: 'rfi';
  rfiNumber: string;
  rfiTitle: string;
  issuingOrganization: string;
  informationType: string;
  responseFormat: string;
  confidentiality: string;
}

// RFQ-specific interfaces
export interface RFQProposal extends ProposalDocument {
  subtype: 'rfq';
  content: RFQProposalContent;
  metadata: RFQProposalMetadata;
}

export interface RFQProposalContent extends ProposalContent {
  data: ProposalContent['data'] & {
    quote: QuoteDetails;
    specifications: Specification[];
    terms: TermsAndConditions;
  };
}

export interface QuoteDetails {
  totalPrice: number;
  currency: string;
  validUntil: Date;
  breakdown: QuoteBreakdown[];
  assumptions: string[];
  exclusions: string[];
}

export interface QuoteBreakdown {
  item: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
}

export interface Specification {
  id: string;
  name: string;
  description: string;
  value: string;
  unit?: string;
  tolerance?: string;
  compliance: boolean;
}

export interface TermsAndConditions {
  payment: string;
  delivery: string;
  warranty: string;
  liability: string;
  termination: string;
  dispute: string;
}

export interface RFQProposalMetadata extends ProposalMetadata {
  proposalType: 'rfq';
  rfqNumber: string;
  rfqTitle: string;
  issuingOrganization: string;
  quoteType: string;
  currency: string;
  validUntil: Date;
  terms: string[];
}

// Factory functions
export function createProposal(data: Partial<ProposalDocument>): ProposalDocument {
  const now = new Date();
  
  return {
    id: data.id || `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'proposal',
    title: data.title || 'Proposal',
    description: data.description || 'Proposal document',
    content: data.content || createDefaultProposalContent(),
    metadata: {
      category: 'proposal',
      tags: ['proposal', 'response'],
      status: 'draft',
      visibility: 'private',
      language: 'en',
      wordCount: 0,
      pageCount: 0,
      readingTime: 0,
      complexity: 'medium',
      proposalType: 'rfp',
      organization: '',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'draft',
      priority: 'medium',
      winProbability: 0,
      competitionLevel: 'medium',
      keyStakeholders: [],
      evaluationCriteria: [],
      submissionRequirements: [],
      creationMethod: 'manual',
      ...data.metadata
    },
    version: {
      current: '1.0.0',
      history: [],
      locked: false
    },
    permissions: {
      owner: data.permissions?.owner || '',
      editors: data.permissions?.editors || [],
      viewers: data.permissions?.viewers || [],
      commenters: data.permissions?.commenters || [],
      public: false
    },
    collaboration: {
      activeUsers: [],
      comments: [],
      suggestions: [],
      mentions: [],
      lastActivity: now
    },
    ai: {
      analyzed: false,
      overallScore: 0,
      qualityScore: 0,
      completenessScore: 0,
      readabilityScore: 0,
      insights: [],
      suggestions: [],
      autoGenerated: false,
      aiAssisted: false,
      confidence: 0
    },
    createdAt: now,
    updatedAt: now,
    createdBy: data.createdBy || '',
    lastModifiedBy: data.createdBy || ''
  };
}

export function createRFPProposal(data: Partial<RFPProposal>): RFPProposal {
  const baseProposal = createProposal(data);
  
  return {
    ...baseProposal,
    subtype: 'rfp',
    content: data.content || createDefaultRFPContent(),
    metadata: {
      ...baseProposal.metadata,
      proposalType: 'rfp',
      rfpNumber: '',
      rfpTitle: '',
      issuingOrganization: '',
      evaluationMethod: '',
      evaluationCriteria: [],
      submissionFormat: 'pdf',
      ...data.metadata
    }
  };
}

export function createRFIProposal(data: Partial<RFIProposal>): RFIProposal {
  const baseProposal = createProposal(data);
  
  return {
    ...baseProposal,
    subtype: 'rfi',
    content: data.content || createDefaultRFIContent(),
    metadata: {
      ...baseProposal.metadata,
      proposalType: 'rfi',
      rfiNumber: '',
      rfiTitle: '',
      issuingOrganization: '',
      informationType: '',
      responseFormat: 'pdf',
      confidentiality: 'standard',
      ...data.metadata
    }
  };
}

export function createRFQProposal(data: Partial<RFQProposal>): RFQProposal {
  const baseProposal = createProposal(data);
  
  return {
    ...baseProposal,
    subtype: 'rfq',
    content: data.content || createDefaultRFQContent(),
    metadata: {
      ...baseProposal.metadata,
      proposalType: 'rfq',
      rfqNumber: '',
      rfqTitle: '',
      issuingOrganization: '',
      quoteType: 'fixed-price',
      currency: 'USD',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      terms: [],
      ...data.metadata
    }
  };
}

// Default content creators
function createDefaultProposalContent(): ProposalContent {
  return {
    format: 'structured',
    data: {
      sections: [
        {
          id: 'executive-summary',
          title: 'Executive Summary',
          content: '',
          order: 1,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'understanding',
          title: 'Understanding of Requirements',
          content: '',
          order: 2,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'approach',
          title: 'Proposed Approach',
          content: '',
          order: 3,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'team',
          title: 'Team & Resources',
          content: '',
          order: 4,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'timeline',
          title: 'Project Timeline',
          content: '',
          order: 5,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        },
        {
          id: 'pricing',
          title: 'Pricing & Commercial Terms',
          content: '',
          order: 6,
          required: true,
          completed: false,
          wordCount: 0,
          lastModified: new Date(),
          aiGenerated: false
        }
      ],
      requirements: [],
      responses: [],
      attachments: [],
      compliance: []
    }
  };
}

function createDefaultRFPContent(): RFPProposalContent {
  return {
    ...createDefaultProposalContent(),
    data: {
      ...createDefaultProposalContent().data,
      technicalProposal: {
        approach: '',
        methodology: '',
        timeline: {
          phases: [],
          milestones: [],
          dependencies: [],
          criticalPath: []
        },
        deliverables: [],
        risks: [],
        mitigation: []
      },
      commercialProposal: {
        pricing: {
          basePrice: 0,
          currency: 'USD',
          breakdown: [],
          assumptions: [],
          exclusions: []
        },
        paymentTerms: '',
        warranties: [],
        support: {
          level: '',
          description: '',
          hours: 0,
          responseTime: '',
          availability: '',
          cost: 0
        },
        terms: []
      },
      managementProposal: {
        team: [],
        organization: {
          hierarchy: '',
          reporting: '',
          governance: '',
          escalation: ''
        },
        communication: {
          frequency: '',
          format: '',
          participants: [],
          agenda: [],
          reporting: ''
        },
        quality: {
          standards: [],
          processes: [],
          reviews: [],
          testing: [],
          metrics: []
        }
      },
      pastPerformance: []
    }
  };
}

function createDefaultRFIContent(): RFIProposalContent {
  return {
    ...createDefaultProposalContent(),
    data: {
      ...createDefaultProposalContent().data,
      informationResponses: [],
      capabilities: [],
      qualifications: []
    }
  };
}

function createDefaultRFQContent(): RFQProposalContent {
  return {
    ...createDefaultProposalContent(),
    data: {
      ...createDefaultProposalContent().data,
      quote: {
        totalPrice: 0,
        currency: 'USD',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        breakdown: [],
        assumptions: [],
        exclusions: []
      },
      specifications: [],
      terms: {
        payment: '',
        delivery: '',
        warranty: '',
        liability: '',
        termination: '',
        dispute: ''
      }
    }
  };
}
