import OpenAI from "openai";

export interface ApplicationFormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'date';
  required: boolean;
  maxLength?: number;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

export interface ApplicationFormSection {
  id: string;
  title: string;
  description?: string;
  fields: ApplicationFormField[];
}

export interface ApplicationForm {
  id: string;
  name: string;
  type: 'accelerator' | 'grant' | 'competition' | 'investment';
  organization: string;
  sections: ApplicationFormSection[];
}

export interface BusinessPlanData {
  companyName: string;
  description: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  competitors: string[];
  uniqueValueProposition: string;
  founders: Array<{
    name: string;
    role: string;
    bio: string;
    experience: string;
  }>;
  traction: {
    users?: number;
    revenue?: number;
    growth?: string;
    milestones?: string[];
  };
  financials: {
    fundingHistory?: string;
    currentRunway?: string;
    projections?: string;
    useOfFunds?: string;
  };
  team: {
    size: number;
    keyMembers: string[];
    advisors?: string[];
  };
}

export interface FilledApplication {
  formId: string;
  responses: Record<string, any>;
  completeness: number;
  suggestions: Array<{
    fieldId: string;
    suggestion: string;
    reason: string;
  }>;
  matchScore: number;
}

/**
 * AI Application Filler Service
 * Automatically fills application forms using business plan data and AI
 */
export class AIApplicationFiller {
  private client: OpenAI | null;

  constructor() {
    const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    
    if (!apiKey) {
      console.warn('OpenAI API key not configured. AI Application Filler will not be available.');
      this.client = null;
      return;
    }

    if (endpoint) {
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4';
      const normalizedEndpoint = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
      
      this.client = new OpenAI({
        apiKey,
        baseURL: `${normalizedEndpoint}openai/deployments/${deployment}`,
        defaultQuery: { "api-version": "2024-08-01-preview" },
        defaultHeaders: { "api-key": apiKey },
      });
    } else {
      this.client = new OpenAI({ apiKey });
    }
  }

  /**
   * Fill an entire application form using business plan data
   */
  async fillApplication(
    form: ApplicationForm,
    businessPlan: BusinessPlanData
  ): Promise<FilledApplication> {
    if (!this.client) {
      throw new Error('AI Application Filler is not configured. Please set OpenAI API key.');
    }

    const responses: Record<string, any> = {};
    const suggestions: Array<{ fieldId: string; suggestion: string; reason: string }> = [];

    // Process each section
    for (const section of form.sections) {
      for (const field of section.fields) {
        try {
          const response = await this.fillField(field, section, form, businessPlan);
          responses[field.id] = response.value;

          if (response.suggestion) {
            suggestions.push({
              fieldId: field.id,
              suggestion: response.suggestion,
              reason: response.reason || 'AI-generated improvement suggestion'
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`Error filling field ${field.id}:`, errorMessage);
          responses[field.id] = '';
        }
      }
    }

    // Calculate completeness
    const totalFields = form.sections.reduce((sum, s) => sum + s.fields.length, 0);
    const filledFields = Object.values(responses).filter(v => v && v.toString().trim() !== '').length;
    const completeness = Math.round((filledFields / totalFields) * 100);

    // Calculate match score
    const matchScore = await this.calculateMatchScore(form, businessPlan, responses);

    return {
      formId: form.id,
      responses,
      completeness,
      suggestions,
      matchScore
    };
  }

  /**
   * Fill a single form field using AI
   */
  private async fillField(
    field: ApplicationFormField,
    section: ApplicationFormSection,
    form: ApplicationForm,
    businessPlan: BusinessPlanData
  ): Promise<{ value: any; suggestion?: string; reason?: string }> {
    if (!this.client) {
      return this.fillFieldWithTemplate(field, businessPlan);
    }

    const prompt = this.buildFieldPrompt(field, section, form, businessPlan);

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert application writer helping startups fill out ${form.type} applications. 
Generate compelling, accurate, and tailored responses based on the business plan data provided.
Keep responses concise, professional, and aligned with the application requirements.
For text fields, provide the response directly without quotes or formatting.
For suggestions, provide actionable improvements.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: field.type === 'textarea' ? 500 : 150
      });

      const content = response.choices[0]?.message?.content?.trim() || '';
      
      // Parse response
      if (content.includes('SUGGESTION:')) {
        const [value, suggestionPart] = content.split('SUGGESTION:');
        return {
          value: value.trim(),
          suggestion: suggestionPart.trim(),
          reason: 'AI-generated enhancement'
        };
      }

      return { value: content };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error calling OpenAI API:', errorMessage);
      return this.fillFieldWithTemplate(field, businessPlan);
    }
  }

  /**
   * Build a context-aware prompt for filling a field
   */
  private buildFieldPrompt(
    field: ApplicationFormField,
    section: ApplicationFormSection,
    form: ApplicationForm,
    businessPlan: BusinessPlanData
  ): string {
    let prompt = `Fill out the following field for a ${form.type} application to ${form.organization}:\n\n`;
    prompt += `Section: ${section.title}\n`;
    prompt += `Field: ${field.label}\n`;
    if (field.helpText) prompt += `Help Text: ${field.helpText}\n`;
    if (field.maxLength) prompt += `Max Length: ${field.maxLength} characters\n`;
    prompt += `\nBusiness Plan Data:\n`;
    prompt += `Company: ${businessPlan.companyName}\n`;
    prompt += `Description: ${businessPlan.description}\n`;
    
    // Add relevant context based on field label
    const fieldLower = field.label.toLowerCase();
    
    if (fieldLower.includes('problem')) {
      prompt += `Problem: ${businessPlan.problem}\n`;
    }
    if (fieldLower.includes('solution')) {
      prompt += `Solution: ${businessPlan.solution}\n`;
    }
    if (fieldLower.includes('market') || fieldLower.includes('target')) {
      prompt += `Target Market: ${businessPlan.targetMarket}\n`;
    }
    if (fieldLower.includes('business model') || fieldLower.includes('revenue')) {
      prompt += `Business Model: ${businessPlan.businessModel}\n`;
    }
    if (fieldLower.includes('team') || fieldLower.includes('founder')) {
      prompt += `Founders: ${JSON.stringify(businessPlan.founders, null, 2)}\n`;
      prompt += `Team Size: ${businessPlan.team.size}\n`;
    }
    if (fieldLower.includes('traction') || fieldLower.includes('metric') || fieldLower.includes('growth')) {
      prompt += `Traction: ${JSON.stringify(businessPlan.traction, null, 2)}\n`;
    }
    if (fieldLower.includes('financial') || fieldLower.includes('funding')) {
      prompt += `Financials: ${JSON.stringify(businessPlan.financials, null, 2)}\n`;
    }
    if (fieldLower.includes('competitive') || fieldLower.includes('advantage')) {
      prompt += `Unique Value Proposition: ${businessPlan.uniqueValueProposition}\n`;
      prompt += `Competitors: ${businessPlan.competitors.join(', ')}\n`;
    }

    prompt += `\nGenerate a compelling response for this field. `;
    if (field.maxLength) {
      prompt += `Keep it under ${field.maxLength} characters. `;
    }
    prompt += `If you have a suggestion to improve the response, add it after "SUGGESTION:" on a new line.`;

    return prompt;
  }

  /**
   * Template-based fallback for filling fields
   */
  private fillFieldWithTemplate(
    field: ApplicationFormField,
    businessPlan: BusinessPlanData
  ): { value: any } {
    const fieldLower = field.label.toLowerCase();

    // Company name fields
    if (fieldLower.includes('company name') || fieldLower.includes('startup name')) {
      return { value: businessPlan.companyName };
    }

    // Description fields
    if (fieldLower.includes('description') || fieldLower.includes('overview')) {
      return { value: businessPlan.description };
    }

    // Problem fields
    if (fieldLower.includes('problem')) {
      return { value: businessPlan.problem };
    }

    // Solution fields
    if (fieldLower.includes('solution')) {
      return { value: businessPlan.solution };
    }

    // Market fields
    if (fieldLower.includes('market') || fieldLower.includes('target')) {
      return { value: businessPlan.targetMarket };
    }

    // Business model fields
    if (fieldLower.includes('business model') || fieldLower.includes('revenue model')) {
      return { value: businessPlan.businessModel };
    }

    // Team fields
    if (fieldLower.includes('team size')) {
      return { value: businessPlan.team.size.toString() };
    }

    // Founder fields
    if (fieldLower.includes('founder')) {
      const founderInfo = businessPlan.founders
        .map(f => `${f.name} (${f.role}): ${f.bio}`)
        .join('\n\n');
      return { value: founderInfo };
    }

    // Traction fields
    if (fieldLower.includes('traction') || fieldLower.includes('metric')) {
      let traction = '';
      if (businessPlan.traction.users) traction += `Users: ${businessPlan.traction.users}\n`;
      if (businessPlan.traction.revenue) traction += `Revenue: $${businessPlan.traction.revenue}\n`;
      if (businessPlan.traction.growth) traction += `Growth: ${businessPlan.traction.growth}\n`;
      return { value: traction };
    }

    return { value: '' };
  }

  /**
   * Calculate how well the business plan matches the application requirements
   */
  private async calculateMatchScore(
    form: ApplicationForm,
    businessPlan: BusinessPlanData,
    responses: Record<string, any>
  ): Promise<number> {
    if (!this.client) {
      return 50;
    }

    try {
      const prompt = `Analyze how well this startup matches the ${form.type} application requirements for ${form.organization}.

Business Plan:
- Company: ${businessPlan.companyName}
- Description: ${businessPlan.description}
- Stage: ${businessPlan.traction.users ? 'Has traction' : 'Pre-traction'}
- Team Size: ${businessPlan.team.size}
- Revenue: ${businessPlan.traction.revenue || 'Pre-revenue'}

Application Type: ${form.type}
Organization: ${form.organization}

Rate the match on a scale of 0-100, considering:
1. Stage alignment
2. Team strength
3. Traction/metrics
4. Market opportunity
5. Overall fit

Respond with just a number between 0-100.`;

      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert at evaluating startup-program fit. Provide only a numeric score."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 10
      });

      const score = parseInt(response.choices[0]?.message?.content?.trim() || '50');
      return Math.min(100, Math.max(0, score));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error calculating match score:', errorMessage);
      return 50;
    }
  }

  /**
   * Generate improvement suggestions for a filled application
   */
  async generateSuggestions(
    form: ApplicationForm,
    responses: Record<string, any>,
    businessPlan: BusinessPlanData
  ): Promise<Array<{ fieldId: string; suggestion: string; reason: string }>> {
    if (!this.client) {
      return [];
    }

    const suggestions: Array<{ fieldId: string; suggestion: string; reason: string }> = [];

    for (const section of form.sections) {
      for (const field of section.fields) {
        const response = responses[field.id];
        if (!response || response.toString().trim() === '') continue;

        try {
          const prompt = `Review this application response and suggest improvements:

Field: ${field.label}
Current Response: ${response}

Provide a specific, actionable suggestion to make this response more compelling for a ${form.type} application.
Keep the suggestion concise (1-2 sentences).`;

          const aiResponse = await this.client.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are an expert application reviewer. Provide concise, actionable feedback."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 150
          });

          const suggestion = aiResponse.choices[0]?.message?.content?.trim();
          if (suggestion && suggestion.length > 10) {
            suggestions.push({
              fieldId: field.id,
              suggestion,
              reason: 'AI-generated improvement'
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`Error generating suggestion for field ${field.id}:`, errorMessage);
        }
      }
    }

    return suggestions;
  }
}

export const aiApplicationFiller = new AIApplicationFiller();
