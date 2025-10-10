import { AIService } from './ai-service';
import { AzureOpenAIAdvanced } from './ai-agents/core/azure-openai-advanced';

export interface InfographicData {
  id: string;
  title: string;
  description: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'radar' | 'funnel' | 'sankey' | 'treemap' | 'heatmap' | 'gauge' | 'waterfall';
  data: any[];
  config: {
    colors?: string[];
    theme?: 'light' | 'dark' | 'corporate' | 'creative' | 'minimal' | 'vibrant';
    layout?: 'vertical' | 'horizontal' | 'grid' | 'flow' | 'circular';
    annotations?: string[];
    insights?: string[];
    title?: string;
    subtitle?: string;
    footer?: string;
    legend?: boolean;
    grid?: boolean;
    tooltips?: boolean;
    animations?: boolean;
  };
  metadata: {
    source: string;
    generatedAt: Date;
    aiConfidence: number;
    version: string;
    userId: string;
    category: string;
    tags: string[];
    usage: {
      views: number;
      exports: number;
      shares: number;
    };
  };
}

export interface InfographicTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'marketing' | 'financial' | 'analytics' | 'social' | 'presentation' | 'report';
  preview: string;
  config: Partial<InfographicData['config']>;
  dataStructure: any;
  sampleData: any[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  industry: string[];
}

export interface InfographicEnhancement {
  type: 'visual' | 'data' | 'layout' | 'insights' | 'accessibility';
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

export class AIInfographicService {
  private aiService: AIService;
  private azureClient: AzureOpenAIAdvanced;

  constructor() {
    this.aiService = new AIService();
    this.azureClient = new AzureOpenAIAdvanced({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
      azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
      azureOpenAIKey: process.env.AZURE_OPENAI_KEY || '',
      azureOpenAIVersion: process.env.AZURE_OPENAI_VERSION || '2024-02-15-preview'
    });
  }

  async generateInfographic(
    prompt: string,
    data?: any[],
    context?: any,
    userId?: string
  ): Promise<InfographicData> {
    try {
      const systemPrompt = `You are an expert data visualization and infographic designer with deep knowledge of business analytics, design principles, and data storytelling. 
      
      Create compelling, professional infographics that tell a clear story with data. Focus on:
      - Clear data visualization
      - Professional design aesthetics
      - - Effective data storytelling narrative
      - - Accessibility and readability
      - - Business context and insights
      
      Available chart types: bar, line, pie, area, scatter, radar, funnel, sankey, treemap, heatmap, gauge, waterfall
      Available themes: light, dark, corporate, creative, minimal, vibrant
      Available layouts: vertical, horizontal, grid, flow, circular
      
      Generate JSON response with:
      - id: Unique identifier
      - title: Clear, descriptive title that tells the story
      - description: Brief description of what the infographic shows
      - type: Most appropriate chart type for the data
      - data: Structured data array with proper formatting
      - config: Visual configuration including colors, theme, layout
      - metadata: Generation details including confidence score`;

      const enhancedPrompt = `Create an infographic for: ${prompt}
      
      Data provided: ${JSON.stringify(data || [])}
      Context: ${JSON.stringify(context || {})}
      
      Requirements:
      - Make it business-focused and professional
      - Include actionable insights
      - Ensure data accuracy and clarity
      - Use appropriate visual hierarchy
      - Consider accessibility (color contrast, readability)
      - Add meaningful annotations and insights`;

      const response = await this.azureClient.generateStructuredResponse<InfographicData>(
        systemPrompt,
        enhancedPrompt,
        [],
        {},
        { temperature: 0.7, maxTokens: 3000 }
      );

      return {
        ...response,
        id: response.id || `infographic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          ...response.metadata,
          generatedAt: new Date(),
          aiConfidence: response.metadata?.aiConfidence || 0.85,
          version: '2.0.0',
          userId: userId || 'anonymous',
          category: context?.category || 'general',
          tags: this.extractTags(prompt, response),
          usage: {
            views: 0,
            exports: 0,
            shares: 0
          }
        }
      };
    } catch (error) {
      console.error('Infographic generation error:', error);
      throw new Error(`Failed to generate infographic: ${error.message}`);
    }
  }

  async getInfographicTemplates(): Promise<InfographicTemplate[]> {
    return [
      {
        id: 'revenue-trends',
        name: 'Revenue Growth Trends',
        description: 'Track revenue growth over time with trend analysis and forecasting',
        category: 'financial',
        preview: '/templates/revenue-trends.png',
        config: {
          type: 'line',
          theme: 'corporate',
          layout: 'vertical',
          legend: true,
          grid: true,
          tooltips: true,
          animations: true
        },
        dataStructure: {
          period: 'string',
          revenue: 'number',
          target: 'number',
          growth: 'number'
        },
        sampleData: [
          { period: 'Q1 2023', revenue: 120000, target: 100000, growth: 20 },
          { period: 'Q2 2023', revenue: 135000, target: 120000, growth: 12.5 },
          { period: 'Q3 2023', revenue: 150000, target: 140000, growth: 11.1 },
          { period: 'Q4 2023', revenue: 175000, target: 160000, growth: 16.7 }
        ],
        difficulty: 'beginner',
        estimatedTime: 5,
        industry: ['technology', 'finance', 'retail', 'saas']
      },
      {
        id: 'market-share-analysis',
        name: 'Market Share Analysis',
        description: 'Visualize market share distribution with competitive positioning',
        category: 'business',
        preview: '/templates/market-share.png',
        config: {
          type: 'pie',
          theme: 'corporate',
          layout: 'grid',
          legend: true,
          tooltips: true
        },
        dataStructure: {
          company: 'string',
          marketShare: 'number',
          revenue: 'number',
          growth: 'number'
        },
        sampleData: [
          { company: 'Our Company', marketShare: 35, revenue: 2500000, growth: 15 },
          { company: 'Competitor A', marketShare: 25, revenue: 1800000, growth: 8 },
          { company: 'Competitor B', marketShare: 20, revenue: 1400000, growth: 5 },
          { company: 'Others', marketShare: 20, revenue: 1000000, growth: 2 }
        ],
        difficulty: 'beginner',
        estimatedTime: 3,
        industry: ['technology', 'finance', 'retail', 'manufacturing']
      },
      {
        id: 'customer-segmentation',
        name: 'Customer Segmentation Analysis',
        description: 'Analyze customer demographics and behavior patterns',
        category: 'marketing',
        preview: '/templates/customer-segments.png',
        config: {
          type: 'scatter',
          theme: 'creative',
          layout: 'grid',
          legend: true,
          tooltips: true
        },
        dataStructure: {
          segment: 'string',
          value: 'number',
          frequency: 'number',
          satisfaction: 'number'
        },
        sampleData: [
          { segment: 'Enterprise', value: 50000, frequency: 12, satisfaction: 4.5 },
          { segment: 'SMB', value: 15000, frequency: 24, satisfaction: 4.2 },
          { segment: 'Startup', value: 5000, frequency: 36, satisfaction: 4.0 },
          { segment: 'Individual', value: 1000, frequency: 48, satisfaction: 3.8 }
        ],
        difficulty: 'intermediate',
        estimatedTime: 8,
        industry: ['saas', 'ecommerce', 'technology', 'services']
      },
      {
        id: 'sales-funnel',
        name: 'Sales Funnel Analysis',
        description: 'Track conversion rates through the sales pipeline',
        category: 'analytics',
        preview: '/templates/sales-funnel.png',
        config: {
          type: 'funnel',
          theme: 'corporate',
          layout: 'vertical',
          legend: false,
          tooltips: true
        },
        dataStructure: {
          stage: 'string',
          count: 'number',
          conversion: 'number'
        },
        sampleData: [
          { stage: 'Leads', count: 1000, conversion: 100 },
          { stage: 'Qualified', count: 400, conversion: 40 },
          { stage: 'Proposal', count: 200, conversion: 20 },
          { stage: 'Negotiation', count: 100, conversion: 10 },
          { stage: 'Closed Won', count: 50, conversion: 5 }
        ],
        difficulty: 'intermediate',
        estimatedTime: 6,
        industry: ['saas', 'technology', 'services', 'consulting']
      },
      {
        id: 'kpi-dashboard',
        name: 'KPI Performance Dashboard',
        description: 'Comprehensive KPI tracking with multiple metrics',
        category: 'analytics',
        preview: '/templates/kpi-dashboard.png',
        config: {
          type: 'gauge',
          theme: 'corporate',
          layout: 'grid',
          legend: true,
          tooltips: true
        },
        dataStructure: {
          metric: 'string',
          value: 'number',
          target: 'number',
          trend: 'string'
        },
        sampleData: [
          { metric: 'Revenue Growth', value: 15.2, target: 12, trend: 'up' },
          { metric: 'Customer Satisfaction', value: 4.3, target: 4.5, trend: 'up' },
          { metric: 'Churn Rate', value: 3.1, target: 5, trend: 'down' },
          { metric: 'NPS Score', value: 42, target: 40, trend: 'up' }
        ],
        difficulty: 'advanced',
        estimatedTime: 12,
        industry: ['technology', 'saas', 'finance', 'retail']
      }
    ];
  }

  async enhanceInfographic(
    infographic: InfographicData,
    enhancements: string[],
    userId?: string
  ): Promise<InfographicData> {
    try {
      const systemPrompt = `You are an expert infographic designer and data visualization specialist. Enhance the provided infographic based on user requests.
      
      Focus on:
      - Improving visual design and aesthetics
      - Enhancing data clarity and insights
      - Optimizing layout and composition
      - Adding meaningful annotations and context
      - Ensuring accessibility and readability
      - Maintaining data accuracy and integrity`;

      const enhancementPrompt = `Enhance this infographic based on the following requests: ${enhancements.join(', ')}
      
      Current infographic: ${JSON.stringify(infographic)}
      
      Requirements:
      - Maintain data integrity
      - Improve visual appeal
      - Add actionable insights
      - Enhance accessibility
      - Optimize for the target audience`;

      const response = await this.azureClient.generateStructuredResponse<InfographicData>(
        systemPrompt,
        enhancementPrompt,
        [],
        {},
        { temperature: 0.6, maxTokens: 3000 }
      );

      return {
        ...response,
        id: infographic.id,
        metadata: {
          ...response.metadata,
          generatedAt: new Date(),
          aiConfidence: response.metadata?.aiConfidence || 0.9,
          version: '2.0.0',
          userId: userId || infographic.metadata.userId,
          category: infographic.metadata.category,
          tags: [...infographic.metadata.tags, ...this.extractTags(enhancements.join(' '), response)],
          usage: infographic.metadata.usage
        }
      };
    } catch (error) {
      console.error('Infographic enhancement error:', error);
      throw new Error(`Failed to enhance infographic: ${error.message}`);
    }
  }

  async getEnhancementSuggestions(infographic: InfographicData): Promise<InfographicEnhancement[]> {
    const suggestions: InfographicEnhancement[] = [];

    // Analyze the infographic and suggest improvements
    if (!infographic.config.insights || infographic.config.insights.length === 0) {
      suggestions.push({
        type: 'insights',
        description: 'Add key insights and data annotations',
        impact: 'high',
        effort: 'low'
      });
    }

    if (infographic.config.colors && infographic.config.colors.length < 3) {
      suggestions.push({
        type: 'visual',
        description: 'Enhance color palette for better visual appeal',
        impact: 'medium',
        effort: 'low'
      });
    }

    if (infographic.type === 'pie' && infographic.data.length > 5) {
      suggestions.push({
        type: 'layout',
        description: 'Consider grouping smaller segments for better readability',
        impact: 'medium',
        effort: 'medium'
      });
    }

    if (!infographic.config.title || infographic.config.title.length < 10) {
      suggestions.push({
        type: 'visual',
        description: 'Add a more descriptive title and subtitle',
        impact: 'high',
        effort: 'low'
      });
    }

    return suggestions;
  }

  async analyzeDataQuality(data: any[]): Promise<{
    score: number;
    issues: string[];
    suggestions: string[];
  }> {
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (!data || data.length === 0) {
      issues.push('No data provided');
      return { score: 0, issues, suggestions: ['Provide data to create the infographic'] };
    }

    if (data.length < 3) {
      issues.push('Insufficient data points');
      suggestions.push('Add more data points for better visualization');
    }

    // Check for missing values
    const missingValues = data.filter(item => 
      Object.values(item).some(value => value === null || value === undefined || value === '')
    );

    if (missingValues.length > 0) {
      issues.push(`${missingValues.length} data points have missing values`);
      suggestions.push('Clean data by removing or filling missing values');
    }

    // Check for data consistency
    const numericFields = Object.keys(data[0]).filter(key => 
      typeof data[0][key] === 'number'
    );

    for (const field of numericFields) {
      const values = data.map(item => item[field]).filter(val => typeof val === 'number');
      if (values.length > 0) {
        const min = Math.min(...values);
        const max = Math.max(...values);
        if (max - min === 0) {
          issues.push(`Field '${field}' has no variation`);
          suggestions.push(`Consider using a different visualization or adding more varied data`);
        }
      }
    }

    const score = Math.max(0, 100 - (issues.length * 20));
    return { score, issues, suggestions };
  }

  private extractTags(prompt: string, response: any): string[] {
    const tags: string[] = [];
    
    // Extract common business terms
    const businessTerms = ['revenue', 'profit', 'growth', 'sales', 'marketing', 'customer', 'analytics', 'kpi', 'performance'];
    const foundTerms = businessTerms.filter(term => 
      prompt.toLowerCase().includes(term) || 
      (response.title && response.title.toLowerCase().includes(term))
    );
    
    tags.push(...foundTerms);
    
    // Add chart type as tag
    if (response.type) {
      tags.push(response.type);
    }
    
    // Add category as tag
    if (response.metadata?.category) {
      tags.push(response.metadata.category);
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }
}