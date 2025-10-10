import { BaseDocument, DocumentType, DocumentContent, DocumentMetadata, DocumentSection } from '../document.types';

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

export interface InfographicDocument extends BaseDocument {
  type: 'infographic';
  content: InfographicContent;
  metadata: InfographicMetadata;
}

export interface InfographicContent extends DocumentContent {
  format: 'json';
  data: {
    infographic: InfographicData;
    templates?: InfographicTemplate[];
    customizations?: {
      theme: string;
      layout: string;
      colors: string[];
      showLegend: boolean;
      showGrid: boolean;
      showTooltips: boolean;
      enableAnimations: boolean;
      title: string;
      subtitle: string;
      footer: string;
    };
    exportSettings?: {
      formats: string[];
      quality: number;
      dimensions: { width: number; height: number };
    };
  };
  sections?: InfographicSection[];
}

export interface InfographicSection extends DocumentSection {
  type: 'chart' | 'insights' | 'data' | 'customization';
  chartType?: string;
  data?: any[];
  config?: any;
  insights?: string[];
}

export interface InfographicMetadata extends DocumentMetadata {
  category: 'infographic';
  chartType: string;
  dataPoints: number;
  complexity: 'low' | 'medium' | 'high';
  aiGenerated: boolean;
  template?: string;
  exportFormats: string[];
  lastExported?: Date;
  exportCount: number;
  shareCount: number;
  viewCount: number;
}

export interface InfographicAnalytics {
  views: number;
  exports: number;
  shares: number;
  lastViewed?: Date;
  lastExported?: Date;
  lastShared?: Date;
  popularFormats: Array<{ format: string; count: number }>;
  userEngagement: {
    averageViewDuration: number;
    bounceRate: number;
    returnRate: number;
  };
}

export interface InfographicEnhancement {
  type: 'visual' | 'data' | 'layout' | 'insights' | 'accessibility';
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  applied: boolean;
  appliedAt?: Date;
  appliedBy?: string;
}

export interface InfographicExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'jpg';
  quality?: number;
  width?: number;
  height?: number;
  dpi?: number;
  backgroundColor?: string;
  includeMetadata?: boolean;
}

export interface InfographicExportResult {
  success: boolean;
  filePath?: string;
  buffer?: Buffer;
  error?: string;
  metadata?: {
    size: number;
    format: string;
    dimensions: { width: number; height: number };
    generatedAt: Date;
  };
}

// Factory function for creating infographic documents
export function createInfographicDocument(data: Partial<InfographicDocument>): InfographicDocument {
  const now = new Date();
  
  return {
    id: data.id || `infographic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'infographic',
    title: data.title || 'Untitled Infographic',
    description: data.description || '',
    content: {
      format: 'json',
      data: {
        infographic: data.content?.data?.infographic || {
          id: '',
          title: '',
          description: '',
          type: 'bar',
          data: [],
          config: {
            theme: 'corporate',
            layout: 'vertical',
            colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            showLegend: true,
            showGrid: true,
            showTooltips: true,
            enableAnimations: true
          },
          metadata: {
            source: 'manual',
            generatedAt: now,
            aiConfidence: 0.85,
            version: '1.0.0',
            userId: '',
            category: 'general',
            tags: [],
            usage: { views: 0, exports: 0, shares: 0 }
          }
        },
        customizations: {
          theme: 'corporate',
          layout: 'vertical',
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
          showLegend: true,
          showGrid: true,
          showTooltips: true,
          enableAnimations: true,
          title: '',
          subtitle: '',
          footer: ''
        }
      },
      sections: data.content?.sections || []
    },
    metadata: {
      category: 'infographic',
      tags: data.metadata?.tags || [],
      status: 'draft',
      visibility: 'private',
      language: 'en',
      wordCount: 0,
      pageCount: 1,
      readingTime: 1,
      complexity: 'low',
      creationMethod: 'manual',
      chartType: 'bar',
      dataPoints: 0,
      aiGenerated: false,
      exportFormats: ['png'],
      exportCount: 0,
      shareCount: 0,
      viewCount: 0,
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

// Validation function for infographic documents
export function validateInfographicDocument(document: InfographicDocument): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!document.title || document.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!document.content.data.infographic) {
    errors.push('Infographic data is required');
  } else {
    const infographic = document.content.data.infographic;
    
    if (!infographic.type) {
      errors.push('Chart type is required');
    }

    if (!infographic.data || infographic.data.length === 0) {
      warnings.push('No data points provided');
    }

    if (!infographic.config) {
      warnings.push('No configuration provided');
    }
  }

  // Check metadata
  if (!document.metadata.chartType) {
    warnings.push('Chart type not specified in metadata');
  }

  if (document.metadata.dataPoints === 0) {
    warnings.push('No data points in metadata');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
