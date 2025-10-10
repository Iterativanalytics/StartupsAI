import { BaseDocument, DocumentType } from './document.types';

/**
 * Search Types - Comprehensive type definitions for search functionality
 */

export interface SearchQuery {
  text: string;
  filters?: DocumentFilters;
  options?: SearchOptions;
}

export interface SearchOptions {
  limit?: number;
  fields?: string[];
  fuzzy?: boolean;
  highlight?: boolean;
  similarityThreshold?: number;
  includeMetadata?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  documents: BaseDocument[];
  total: number;
  facets: SearchFacets;
  suggestions: SearchSuggestion[];
  query: string;
  processingTime: number;
  metadata: SearchMetadata;
}

export interface SearchFacets {
  documentTypes: Record<string, number>;
  dateRanges: Record<string, number>;
  authors: Record<string, number>;
  tags: Record<string, number>;
  categories: Record<string, number>;
  status: Record<string, number>;
  visibility: Record<string, number>;
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'filter' | 'facet' | 'entity';
  confidence: number;
  metadata?: SuggestionMetadata;
}

export interface SuggestionMetadata {
  category?: string;
  entityType?: string;
  popularity?: number;
  lastUsed?: Date;
}

export interface DocumentFilters {
  documentTypes?: DocumentType[];
  dateRange?: DateRange;
  content?: ContentFilter;
  metadata?: MetadataFilter;
  permissions?: PermissionFilter;
  aiGenerated?: boolean;
  collaboration?: CollaborationFilter;
  custom?: CustomFilter[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ContentFilter {
  contains?: string;
  notContains?: string;
  minLength?: number;
  maxLength?: number;
  language?: string;
  format?: string;
}

export interface MetadataFilter {
  category?: string;
  tags?: string[];
  status?: string;
  visibility?: string;
  priority?: string;
  department?: string;
}

export interface PermissionFilter {
  userId?: string;
  role?: string;
  permission?: string;
  group?: string;
}

export interface CollaborationFilter {
  hasComments?: boolean;
  hasSuggestions?: boolean;
  activeUsers?: string[];
  lastActivity?: DateRange;
  commentCount?: NumberRange;
}

export interface NumberRange {
  min: number;
  max: number;
}

export interface CustomFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  caseSensitive?: boolean;
}

export type FilterOperator = 
  | 'equals' 
  | 'notEquals'
  | 'contains' 
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan' 
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'in'
  | 'notIn'
  | 'exists'
  | 'notExists';

export interface SearchMetadata {
  vectorResults: number;
  textResults: number;
  queryAnalysis: QueryAnalysis;
  searchStrategy: string;
  cacheHit?: boolean;
  indexVersion?: string;
}

export interface QueryAnalysis {
  intent: string;
  entities: string[];
  synonyms: string[];
  confidence: number;
  language?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  complexity?: 'simple' | 'moderate' | 'complex';
}

export interface SearchInsight {
  type: InsightType;
  description: string;
  confidence: number;
  metadata?: InsightMetadata;
}

export type InsightType = 
  | 'trend'
  | 'pattern'
  | 'anomaly'
  | 'recommendation'
  | 'warning'
  | 'opportunity';

export interface InsightMetadata {
  category?: string;
  severity?: 'low' | 'medium' | 'high';
  actionable?: boolean;
  relatedQueries?: string[];
}

export interface SearchRecommendation {
  type: RecommendationType;
  suggestion: string;
  confidence: number;
  metadata?: RecommendationMetadata;
}

export type RecommendationType = 
  | 'query_refinement'
  | 'filter_suggestion'
  | 'related_search'
  | 'content_suggestion'
  | 'workflow_suggestion';

export interface RecommendationMetadata {
  category?: string;
  priority?: number;
  relatedQueries?: string[];
  userHistory?: boolean;
}

export interface SearchAnalytics {
  totalSearches: number;
  averageResponseTime: number;
  popularQueries: PopularQuery[];
  searchTrends: SearchTrend[];
  userBehavior: UserBehavior;
  performanceMetrics: PerformanceMetrics;
  recommendations: string[];
}

export interface PopularQuery {
  query: string;
  count: number;
  lastUsed: Date;
  successRate: number;
  averageResponseTime: number;
}

export interface SearchTrend {
  date: Date;
  searches: number;
  uniqueUsers: number;
  averageResponseTime: number;
  topQueries: string[];
}

export interface UserBehavior {
  searchFrequency: number;
  averageSessionLength: number;
  preferredFilters: string[];
  commonQueries: string[];
  searchPatterns: SearchPattern[];
}

export interface SearchPattern {
  pattern: string;
  frequency: number;
  successRate: number;
  userCount: number;
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  cacheHitRate: number;
  indexSize: number;
  queryComplexity: QueryComplexity;
  optimizationOpportunities: OptimizationOpportunity[];
}

export interface QueryComplexity {
  simple: number;
  moderate: number;
  complex: number;
  averageComplexity: number;
}

export interface OptimizationOpportunity {
  type: OptimizationType;
  description: string;
  potentialImprovement: number;
  effort: 'low' | 'medium' | 'high';
}

export type OptimizationType = 
  | 'index_optimization'
  | 'cache_optimization'
  | 'query_optimization'
  | 'result_ranking'
  | 'facet_optimization';

export interface SearchIndex {
  id: string;
  name: string;
  type: IndexType;
  status: IndexStatus;
  createdAt: Date;
  updatedAt: Date;
  documentCount: number;
  size: number;
  metadata: IndexMetadata;
}

export type IndexType = 
  | 'vector'
  | 'text'
  | 'hybrid'
  | 'semantic'
  | 'fulltext';

export type IndexStatus = 
  | 'active'
  | 'building'
  | 'paused'
  | 'error'
  | 'maintenance';

export interface IndexMetadata {
  version: string;
  configuration: IndexConfiguration;
  statistics: IndexStatistics;
  health: IndexHealth;
}

export interface IndexConfiguration {
  fields: IndexField[];
  analyzers: AnalyzerConfiguration[];
  filters: FilterConfiguration[];
  boost: BoostConfiguration;
}

export interface IndexField {
  name: string;
  type: FieldType;
  indexed: boolean;
  stored: boolean;
  analyzed: boolean;
  boost: number;
}

export type FieldType = 
  | 'text'
  | 'keyword'
  | 'number'
  | 'date'
  | 'boolean'
  | 'geo'
  | 'vector';

export interface AnalyzerConfiguration {
  name: string;
  type: AnalyzerType;
  configuration: any;
}

export type AnalyzerType = 
  | 'standard'
  | 'keyword'
  | 'whitespace'
  | 'stop'
  | 'stemmer'
  | 'custom';

export interface FilterConfiguration {
  name: string;
  type: FilterType;
  configuration: any;
}

export type FilterType = 
  | 'lowercase'
  | 'uppercase'
  | 'trim'
  | 'stop'
  | 'stemmer'
  | 'synonym'
  | 'custom';

export interface BoostConfiguration {
  fieldBoosts: Record<string, number>;
  queryBoosts: Record<string, number>;
  functionBoosts: FunctionBoost[];
}

export interface FunctionBoost {
  function: BoostFunction;
  weight: number;
  parameters: any;
}

export type BoostFunction = 
  | 'recency'
  | 'popularity'
  | 'relevance'
  | 'custom';

export interface IndexStatistics {
  documentCount: number;
  fieldCount: number;
  termCount: number;
  size: number;
  lastUpdated: Date;
  updateFrequency: number;
}

export interface IndexHealth {
  status: HealthStatus;
  score: number;
  issues: HealthIssue[];
  recommendations: string[];
}

export type HealthStatus = 
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'unknown';

export interface HealthIssue {
  type: IssueType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  resolution: string;
}

export type IssueType = 
  | 'performance'
  | 'storage'
  | 'configuration'
  | 'data_quality'
  | 'security';

export interface SearchConfiguration {
  defaultLimit: number;
  maxLimit: number;
  defaultFields: string[];
  highlightFields: string[];
  suggestFields: string[];
  facetFields: string[];
  sortOptions: SortOption[];
  filterOptions: FilterOption[];
}

export interface SortOption {
  field: string;
  label: string;
  direction: 'asc' | 'desc';
  default?: boolean;
}

export interface FilterOption {
  field: string;
  label: string;
  type: FilterOptionType;
  options?: any;
}

export type FilterOptionType = 
  | 'text'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'daterange'
  | 'number'
  | 'boolean'
  | 'custom';

export interface SearchSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  queries: SearchQuery[];
  results: SearchResult[];
  filters: DocumentFilters;
  analytics: SessionAnalytics;
}

export interface SessionAnalytics {
  queryCount: number;
  resultCount: number;
  averageResponseTime: number;
  clickThroughRate: number;
  bounceRate: number;
  sessionDuration: number;
}

export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  timestamp: Date;
  results: number;
  clicked: boolean;
  filters: DocumentFilters;
  responseTime: number;
}

export interface SearchSuggestion {
  text: string;
  type: SuggestionType;
  confidence: number;
  metadata?: SuggestionMetadata;
}

export type SuggestionType = 
  | 'query'
  | 'filter'
  | 'facet'
  | 'entity'
  | 'spelling'
  | 'autocomplete';

export interface SearchError {
  code: ErrorCode;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  query?: string;
}

export type ErrorCode = 
  | 'INVALID_QUERY'
  | 'INVALID_FILTER'
  | 'INVALID_SORT'
  | 'INDEX_ERROR'
  | 'TIMEOUT'
  | 'RATE_LIMIT'
  | 'PERMISSION_DENIED'
  | 'SYSTEM_ERROR';

export interface SearchMetrics {
  totalQueries: number;
  successfulQueries: number;
  failedQueries: number;
  averageResponseTime: number;
  cacheHitRate: number;
  indexSize: number;
  documentCount: number;
  lastUpdated: Date;
}

export interface SearchOptimization {
  type: OptimizationType;
  description: string;
  impact: OptimizationImpact;
  effort: OptimizationEffort;
  status: OptimizationStatus;
}

export interface OptimizationImpact {
  performance: number;
  accuracy: number;
  userExperience: number;
  cost: number;
}

export interface OptimizationEffort {
  development: number;
  testing: number;
  deployment: number;
  maintenance: number;
}

export type OptimizationStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface SearchBenchmark {
  name: string;
  description: string;
  queries: BenchmarkQuery[];
  metrics: BenchmarkMetrics;
  results: BenchmarkResult[];
}

export interface BenchmarkQuery {
  id: string;
  query: string;
  expectedResults: number;
  filters?: DocumentFilters;
  options?: SearchOptions;
}

export interface BenchmarkMetrics {
  responseTime: number;
  accuracy: number;
  recall: number;
  precision: number;
  f1Score: number;
}

export interface BenchmarkResult {
  queryId: string;
  actualResults: number;
  responseTime: number;
  accuracy: number;
  passed: boolean;
  details?: any;
}
