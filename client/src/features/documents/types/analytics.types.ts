export interface UsagePattern {
  id: string;
  userId: string;
  documentId: string;
  action: string;
  timestamp: Date;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface CollaborationMetrics {
  activeCollaborators: number;
  commentsPerDocument: number;
  suggestionsPerDocument: number;
  averageSessionTime: number;
  realTimeEdits: number;
  mentionsPerDocument: number;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  cachePerformance: number;
  apiResponseTime: number;
  errorRate: number;
}

export interface MetricValue {
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface DocumentAnalytics {
  documentId: string;
  views: number;
  edits: number;
  comments: number;
  shares: number;
  lastAccessed: Date;
  averageSessionTime: number;
  userEngagement: number;
}

export interface UserAnalytics {
  userId: string;
  documentsCreated: number;
  documentsEdited: number;
  commentsMade: number;
  timeSpent: number;
  lastActive: Date;
  preferredFeatures: string[];
}

export interface AnalyticsDashboard {
  usagePatterns: UsagePattern[];
  collaborationMetrics: CollaborationMetrics;
  performanceMetrics: PerformanceMetrics;
  documentAnalytics: DocumentAnalytics[];
  userAnalytics: UserAnalytics[];
  totalUsers: number;
  totalDocuments: number;
  averageSessionTime: number;
  topFeatures: string[];
}
