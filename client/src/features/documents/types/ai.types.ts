// AI-specific types for document system

export interface AIService {
  analyzeDocument(document: any): Promise<AIAnalysisResult>;
  generateContent(prompt: string, context: any): Promise<AIGenerationResult>;
  suggestImprovements(document: any): Promise<AISuggestion[]>;
  checkCompliance(document: any, rules: ComplianceRule[]): Promise<ComplianceResult>;
  summarizeDocument(document: any): Promise<AISummary>;
  extractKeywords(document: any): Promise<string[]>;
  detectLanguage(document: any): Promise<string>;
  calculateReadability(document: any): Promise<ReadabilityScore>;
}

export interface AIAnalysisResult {
  overallScore: number;
  qualityScore: number;
  completenessScore: number;
  readabilityScore: number;
  insights: AIInsight[];
  suggestions: AISuggestion[];
  confidence: number;
  processingTime: number;
  timestamp: Date;
  metadata?: {
    tokens?: number;
    model?: string;
    version?: string;
    [key: string]: any;
  };
}

export interface AIGenerationResult {
  content: string;
  confidence: number;
  sections: GeneratedSection[];
  metadata: GenerationMetadata;
  suggestions: string[];
  timestamp: Date;
}

export interface GeneratedSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'table' | 'chart';
  confidence: number;
  aiGenerated: boolean;
}

export interface GenerationMetadata {
  model: string;
  prompt: string;
  context: any;
  parameters: GenerationParameters;
  tokens: number;
  cost: number;
}

export interface GenerationParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface ComplianceResult {
  compliant: boolean;
  score: number;
  violations: ComplianceViolation[];
  recommendations: string[];
  timestamp: Date;
}

export interface ComplianceViolation {
  rule: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  suggestion: string;
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  pattern: string;
  action: 'warn' | 'error' | 'block';
}

export interface AISummary {
  text: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  wordCount: number;
  timestamp: Date;
}

export interface ReadabilityScore {
  score: number;
  level: 'elementary' | 'middle' | 'high' | 'college' | 'graduate';
  metrics: ReadabilityMetrics;
  suggestions: string[];
}

export interface ReadabilityMetrics {
  averageWordsPerSentence: number;
  averageSyllablesPerWord: number;
  complexWords: number;
  totalWords: number;
  totalSentences: number;
}

export interface AIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'opportunity' | 'compliance' | 'quality';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  confidence: number;
  category: string;
  sectionId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AISuggestion {
  id: string;
  type: 'content' | 'structure' | 'style' | 'compliance' | 'grammar' | 'tone';
  title: string;
  description: string;
  content: string;
  sectionId?: string;
  priority: 'low' | 'medium' | 'high';
  accepted: boolean;
  acceptedBy?: string;
  acceptedAt?: Date;
  timestamp: Date;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface AIConfiguration {
  enabled: boolean;
  autoAnalyze: boolean;
  autoSuggest: boolean;
  qualityThreshold: number;
  customPrompts?: Record<string, string>;
  analysisDepth: 'basic' | 'standard' | 'comprehensive';
  model: string;
  parameters: GenerationParameters;
  rateLimit: number;
  costLimit: number;
}

export interface AIUsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  averageResponseTime: number;
  successRate: number;
  errorRate: number;
  lastUsed: Date;
  dailyUsage: Record<string, number>;
  monthlyUsage: Record<string, number>;
}

export interface AIError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  retryable: boolean;
}

export interface AIPrompt {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  usageCount: number;
  rating: number;
}

export interface AIPromptVariable {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  description: string;
}

export interface AIContext {
  document: any;
  user: any;
  organization: any;
  previousDocuments: any[];
  templates: any[];
  rules: ComplianceRule[];
  preferences: any;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: AIError;
  metadata: {
    model: string;
    tokens: number;
    cost: number;
    processingTime: number;
    timestamp: Date;
  };
}
