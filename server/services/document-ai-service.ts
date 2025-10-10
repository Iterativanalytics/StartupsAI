import { aiApplicationFiller, ApplicationForm, BusinessPlanData, FilledApplication } from '../ai-application-filler';

/**
 * Document AI Service
 * Bridges the AI Application Filler with the Document System
 * Provides intelligent document processing and application filling capabilities
 */
export class DocumentAIService {
  /**
   * Extract business plan data from a document
   */
  async extractBusinessPlanFromDocument(document: any): Promise<BusinessPlanData> {
    // Extract structured data from document content
    const content = document.content || {};
    
    return {
      companyName: content.companyName || document.title || 'Unknown Company',
      description: content.executiveSummary || content.description || '',
      problem: content.problemStatement || content.problem || '',
      solution: content.solution || content.productDescription || '',
      targetMarket: content.targetMarket || content.marketAnalysis || '',
      businessModel: content.businessModel || content.revenueModel || '',
      competitors: content.competitors || [],
      uniqueValueProposition: content.valueProposition || content.uniqueSellingPoint || '',
      founders: content.founders || content.team?.founders || [],
      traction: {
        users: content.traction?.users || content.metrics?.users,
        revenue: content.traction?.revenue || content.financials?.revenue,
        growth: content.traction?.growth || content.metrics?.growth,
        milestones: content.traction?.milestones || content.achievements || []
      },
      financials: {
        fundingHistory: content.financials?.fundingHistory || '',
        currentRunway: content.financials?.runway || '',
        projections: content.financials?.projections || '',
        useOfFunds: content.financials?.useOfFunds || ''
      },
      team: {
        size: content.team?.size || content.teamSize || 0,
        keyMembers: content.team?.keyMembers || [],
        advisors: content.team?.advisors || []
      }
    };
  }

  /**
   * Fill an application using a document as the source
   */
  async fillApplicationFromDocument(
    documentId: string,
    document: any,
    form: ApplicationForm
  ): Promise<FilledApplication> {
    if (!aiApplicationFiller || !(aiApplicationFiller as any).client) {
      throw new Error('AI Application Filler is not configured. Please set up OpenAI API keys.');
    }

    const businessPlan = await this.extractBusinessPlanFromDocument(document);
    return await aiApplicationFiller.fillApplication(form, businessPlan);
  }

  /**
   * Generate document-specific suggestions for application improvement
   */
  async generateDocumentSuggestions(
    document: any,
    form: ApplicationForm,
    currentResponses: Record<string, any>
  ): Promise<Array<{ fieldId: string; suggestion: string; reason: string }>> {
    if (!aiApplicationFiller || !(aiApplicationFiller as any).client) {
      return [];
    }

    const businessPlan = await this.extractBusinessPlanFromDocument(document);
    return await aiApplicationFiller.generateSuggestions(form, currentResponses, businessPlan);
  }

  /**
   * Analyze document for application readiness
   */
  async analyzeDocumentForApplication(
    document: any,
    applicationType: 'accelerator' | 'grant' | 'competition' | 'investment'
  ): Promise<{
    readinessScore: number;
    missingFields: string[];
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  }> {
    const businessPlan = await this.extractBusinessPlanFromDocument(document);
    
    const missingFields: string[] = [];
    const strengths: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];

    // Analyze completeness
    if (!businessPlan.companyName) missingFields.push('Company Name');
    if (!businessPlan.description) missingFields.push('Company Description');
    if (!businessPlan.problem) missingFields.push('Problem Statement');
    if (!businessPlan.solution) missingFields.push('Solution Description');
    if (!businessPlan.targetMarket) missingFields.push('Target Market');
    if (!businessPlan.businessModel) missingFields.push('Business Model');
    if (!businessPlan.uniqueValueProposition) missingFields.push('Value Proposition');

    // Identify strengths
    if (businessPlan.traction?.users && businessPlan.traction.users > 0) {
      strengths.push(`Strong user traction: ${businessPlan.traction.users} users`);
    }
    if (businessPlan.traction?.revenue && businessPlan.traction.revenue > 0) {
      strengths.push(`Revenue generation: $${businessPlan.traction.revenue}`);
    }
    if (businessPlan.founders && businessPlan.founders.length > 0) {
      strengths.push(`Experienced founding team: ${businessPlan.founders.length} founders`);
    }
    if (businessPlan.competitors && businessPlan.competitors.length > 0) {
      strengths.push('Competitive analysis completed');
    }

    // Generate improvements
    if (!businessPlan.traction?.milestones || businessPlan.traction.milestones.length === 0) {
      improvements.push('Add key milestones and achievements');
    }
    if (!businessPlan.financials?.projections) {
      improvements.push('Include financial projections');
    }
    if (!businessPlan.team?.advisors || businessPlan.team.advisors.length === 0) {
      improvements.push('List advisory board members');
    }

    // Type-specific recommendations
    switch (applicationType) {
      case 'accelerator':
        recommendations.push('Emphasize growth potential and scalability');
        recommendations.push('Highlight team\'s ability to execute quickly');
        recommendations.push('Show clear product-market fit');
        break;
      case 'grant':
        recommendations.push('Focus on social impact and innovation');
        recommendations.push('Demonstrate alignment with grant objectives');
        recommendations.push('Provide detailed budget breakdown');
        break;
      case 'competition':
        recommendations.push('Create compelling pitch narrative');
        recommendations.push('Highlight unique differentiators');
        recommendations.push('Show traction and validation');
        break;
      case 'investment':
        recommendations.push('Emphasize market opportunity size');
        recommendations.push('Show clear path to profitability');
        recommendations.push('Demonstrate competitive advantages');
        break;
    }

    // Calculate readiness score
    const totalFields = 15; // Total expected fields
    const completedFields = totalFields - missingFields.length;
    const readinessScore = Math.round((completedFields / totalFields) * 100);

    return {
      readinessScore,
      missingFields,
      strengths,
      improvements,
      recommendations
    };
  }

  /**
   * Convert document to application-ready format
   */
  async prepareDocumentForApplication(
    document: any,
    targetFormat: 'pdf' | 'docx' | 'json'
  ): Promise<{
    format: string;
    content: any;
    metadata: {
      generatedAt: string;
      documentId: string;
      version: string;
    };
  }> {
    const businessPlan = await this.extractBusinessPlanFromDocument(document);
    
    return {
      format: targetFormat,
      content: businessPlan,
      metadata: {
        generatedAt: new Date().toISOString(),
        documentId: document.id || document._id,
        version: '1.0'
      }
    };
  }

  /**
   * Batch process multiple documents for applications
   */
  async batchProcessDocuments(
    documents: any[],
    form: ApplicationForm
  ): Promise<Array<{
    documentId: string;
    status: 'success' | 'error';
    result?: FilledApplication;
    error?: string;
  }>> {
    const results = [];

    for (const document of documents) {
      try {
        const result = await this.fillApplicationFromDocument(
          document.id || document._id,
          document,
          form
        );
        results.push({
          documentId: document.id || document._id,
          status: 'success' as const,
          result
        });
      } catch (error) {
        results.push({
          documentId: document.id || document._id,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Check if AI services are available
   */
  isAIAvailable(): boolean {
    return !!(aiApplicationFiller && (aiApplicationFiller as any).client);
  }
}

export const documentAIService = new DocumentAIService();
