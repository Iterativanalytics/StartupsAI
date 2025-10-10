// Centralized type definitions for the application

// Base types
export type UserType = 'entrepreneur' | 'investor' | 'mentor' | 'advisor';
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in-progress' | 'completed' | 'cancelled';

// Agent types
export interface AgentInsight {
  type: 'recommendation' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  priority: Priority;
  actionable: boolean;
}

export interface AgentResponse {
  id: string;
  content: string;
  agentType: string;
  timestamp: Date;
  suggestions?: string[];
  insights?: AgentInsight[];
  metadata?: Record<string, unknown>;
}

export interface AgentRequest {
  message: string;
  userType?: UserType;
  streaming?: boolean;
  context?: Record<string, unknown>;
}

// Document types
export interface DocumentAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface DocumentAnalysis {
  type: string;
  data: Record<string, unknown>;
  results: Record<string, unknown>;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  avatar?: string;
  preferences?: Record<string, unknown>;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Assessment types
export interface AssessmentResponse {
  questionId: string;
  value: number | string;
  timestamp: Date;
}

export interface AssessmentResult {
  score: number;
  percentiles: Record<string, number>;
  recommendations: string[];
}

// Design Thinking types
export interface DTPhase {
  id: string;
  name: string;
  description: string;
  status: Status;
  tools: string[];
  deliverables: string[];
}

export interface DTCollaboration {
  participants: string[];
  sessionId: string;
  phase: string;
  sharedContext: Record<string, unknown>;
}

// Analytics types
export interface AnalyticsMetric {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  unit: string;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'list';
  title: string;
  data: Record<string, unknown>;
  position: { x: number; y: number; w: number; h: number };
}

// Validation schemas
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
