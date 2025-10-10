import { BaseAgent } from '../core/base-agent';
import { AgentRequest, AgentResponse, AgentContext } from '../core/types';
import { AIInfographicService } from '../../ai-infographic-service';

export class InfographicAgent extends BaseAgent {
  private infographicService: AIInfographicService;

  constructor(config: any) {
    super(config);
    this.infographicService = new AIInfographicService();
  }

  async execute(context: AgentContext, options: any): Promise<AgentResponse> {
    try {
      const { query, userType, userId } = context;
      
      // Analyze the query to determine the infographic request
      const analysis = await this.analyzeInfographicRequest(query);
      
      if (!analysis.isInfographicRequest) {
        return {
          id: `infographic-${Date.now()}`,
          content: "I can help you create infographics! Please describe what kind of data visualization you'd like to create.",
          suggestions: [
            "Create a revenue growth chart",
            "Show customer segmentation data",
            "Visualize market share analysis",
            "Generate a sales funnel diagram"
          ],
          actions: [
            {
              type: 'create_infographic',
              label: 'Start Creating',
              data: { prompt: query }
            }
          ],
          metadata: {
            agentType: 'infographic',
            confidence: 0.7,
            timestamp: new Date()
          },
          timestamp: new Date()
        };
      }

      // Generate the infographic
      const infographic = await this.infographicService.generateInfographic(
        analysis.prompt,
        analysis.data,
        {
          template: analysis.template,
          customization: analysis.customization
        },
        userId
      );

      // Get enhancement suggestions
      const suggestions = await this.infographicService.getEnhancementSuggestions(infographic);

      return {
        id: `infographic-${Date.now()}`,
        content: `I've created your infographic: "${infographic.title}". ${infographic.description}`,
        suggestions: [
          "Enhance the visual design",
          "Add more insights",
          "Change the chart type",
          "Export in different formats"
        ],
        actions: [
          {
            type: 'view_infographic',
            label: 'View Infographic',
            data: { infographic }
          },
          {
            type: 'enhance_infographic',
            label: 'Enhance Design',
            data: { infographic, suggestions }
          },
          {
            type: 'export_infographic',
            label: 'Export',
            data: { infographic, formats: ['png', 'pdf', 'svg'] }
          }
        ],
        metadata: {
          agentType: 'infographic',
          confidence: infographic.metadata.aiConfidence,
          infographic: infographic,
          suggestions: suggestions,
          timestamp: new Date()
        },
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Infographic agent error:', error);
      return {
        id: `infographic-error-${Date.now()}`,
        content: "I encountered an error while creating your infographic. Please try again with a more specific description.",
        suggestions: [
          "Try describing your data more clearly",
          "Specify the type of chart you want",
          "Provide sample data if available"
        ],
        actions: [],
        metadata: {
          agentType: 'infographic',
          confidence: 0.1,
          error: error.message,
          timestamp: new Date()
        },
        timestamp: new Date()
      };
    }
  }

  private async analyzeInfographicRequest(query: string): Promise<{
    isInfographicRequest: boolean;
    prompt: string;
    data?: any[];
    template?: string;
    customization?: any;
  }> {
    const infographicKeywords = [
      'chart', 'graph', 'infographic', 'visualization', 'diagram',
      'bar chart', 'line chart', 'pie chart', 'scatter plot',
      'revenue', 'sales', 'growth', 'trend', 'analysis',
      'market share', 'customer', 'data', 'metrics', 'kpi'
    ];

    const hasInfographicKeywords = infographicKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );

    if (!hasInfographicKeywords) {
      return { isInfographicRequest: false, prompt: query };
    }

    // Extract data from the query if mentioned
    const dataMatch = query.match(/data[:\s]+(\[.*\])/i);
    let data;
    if (dataMatch) {
      try {
        data = JSON.parse(dataMatch[1]);
      } catch (e) {
        // If JSON parsing fails, ignore
      }
    }

    // Determine template based on keywords
    let template;
    if (query.toLowerCase().includes('revenue') || query.toLowerCase().includes('growth')) {
      template = 'revenue-trends';
    } else if (query.toLowerCase().includes('market share') || query.toLowerCase().includes('competition')) {
      template = 'market-share-analysis';
    } else if (query.toLowerCase().includes('customer') || query.toLowerCase().includes('segment')) {
      template = 'customer-segmentation';
    } else if (query.toLowerCase().includes('sales') || query.toLowerCase().includes('funnel')) {
      template = 'sales-funnel';
    } else if (query.toLowerCase().includes('kpi') || query.toLowerCase().includes('performance')) {
      template = 'kpi-dashboard';
    }

    return {
      isInfographicRequest: true,
      prompt: query,
      data,
      template,
      customization: {
        theme: 'corporate',
        layout: 'vertical',
        showLegend: true,
        showGrid: true,
        showTooltips: true,
        enableAnimations: true
      }
    };
  }

  getCapabilities(): string[] {
    return [
      'Create data visualizations',
      'Generate business charts',
      'Design infographics',
      'Analyze data patterns',
      'Suggest chart improvements',
      'Export in multiple formats'
    ];
  }

  getSupportedChartTypes(): string[] {
    return [
      'bar', 'line', 'pie', 'area', 'scatter', 'radar', 
      'funnel', 'sankey', 'treemap', 'heatmap', 'gauge', 'waterfall'
    ];
  }

  getBusinessTemplates(): string[] {
    return [
      'revenue-trends',
      'market-share-analysis', 
      'customer-segmentation',
      'sales-funnel',
      'kpi-dashboard'
    ];
  }
}
