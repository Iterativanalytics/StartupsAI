import { z } from 'zod';

// Base schemas
export const UserTypeSchema = z.enum(['entrepreneur', 'investor', 'mentor', 'advisor']);
export const PrioritySchema = z.enum(['low', 'medium', 'high']);
export const StatusSchema = z.enum(['pending', 'in-progress', 'completed', 'cancelled']);

// User schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  userType: UserTypeSchema,
  avatar: z.string().url().optional(),
  preferences: z.record(z.unknown()).optional()
});

export const CreateUserSchema = UserSchema.omit({ id: true });
export const UpdateUserSchema = UserSchema.partial().omit({ id: true });

// Agent schemas
export const AgentInsightSchema = z.object({
  type: z.enum(['recommendation', 'warning', 'info', 'success']),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  priority: PrioritySchema,
  actionable: z.boolean()
});

export const AgentResponseSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1),
  agentType: z.string().min(1),
  timestamp: z.date(),
  suggestions: z.array(z.string()).optional(),
  insights: z.array(AgentInsightSchema).optional(),
  metadata: z.record(z.unknown()).optional()
});

export const AgentRequestSchema = z.object({
  message: z.string().min(1).max(10000),
  userType: UserTypeSchema.optional(),
  streaming: z.boolean().optional(),
  context: z.record(z.unknown()).optional()
});

// Document schemas
export const DocumentAttachmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  type: z.string().min(1),
  size: z.number().positive(),
  url: z.string().url()
});

export const DocumentAnalysisSchema = z.object({
  type: z.string().min(1),
  data: z.record(z.unknown()),
  results: z.record(z.unknown())
});

// Assessment schemas
export const AssessmentResponseSchema = z.object({
  questionId: z.string().min(1),
  value: z.union([z.number(), z.string()]),
  timestamp: z.date()
});

export const AssessmentResultSchema = z.object({
  score: z.number().min(0).max(100),
  percentiles: z.record(z.number().min(0).max(100)),
  recommendations: z.array(z.string())
});

// Lean Design Thinking™ schemas
export const LLDTPhaseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  status: StatusSchema,
  tools: z.array(z.string()),
  deliverables: z.array(z.string())
});

export const LLDTCollaborationSchema = z.object({
  participants: z.array(z.string().uuid()),
  sessionId: z.string().uuid(),
  phase: z.string().min(1),
  sharedContext: z.record(z.unknown())
});

// Analytics schemas
export const AnalyticsMetricSchema = z.object({
  name: z.string().min(1),
  value: z.number(),
  trend: z.enum(['up', 'down', 'stable']),
  change: z.number(),
  unit: z.string().min(1)
});

export const DashboardWidgetSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['chart', 'metric', 'table', 'list']),
  title: z.string().min(1).max(100),
  data: z.record(z.unknown()),
  position: z.object({
    x: z.number().int().min(0),
    y: z.number().int().min(0),
    w: z.number().int().positive(),
    h: z.number().int().positive()
  })
});

// API schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

// Validation error schema
export const ValidationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string()
});

export const ValidationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(ValidationErrorSchema)
});

// Utility functions
export function createValidationSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return {
    validate: (data: unknown) => schema.parse(data),
    safeParse: (data: unknown) => schema.safeParse(data),
    isValid: (data: unknown) => schema.safeParse(data).success
  };
}

export function validatePaginationParams(params: unknown) {
  const PaginationSchema = z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().max(100).optional().default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
  });

  return PaginationSchema.parse(params);
}

export function validateIdParam(id: unknown): string {
  const IdSchema = z.string().uuid();
  return IdSchema.parse(id);
}

export function validateEmail(email: unknown): string {
  const EmailSchema = z.string().email();
  return EmailSchema.parse(email);
}

export function validateUrl(url: unknown): string {
  const UrlSchema = z.string().url();
  return UrlSchema.parse(url);
}

// Type exports
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type AgentInsight = z.infer<typeof AgentInsightSchema>;
export type AgentResponse = z.infer<typeof AgentResponseSchema>;
export type AgentRequest = z.infer<typeof AgentRequestSchema>;
export type DocumentAttachment = z.infer<typeof DocumentAttachmentSchema>;
export type DocumentAnalysis = z.infer<typeof DocumentAnalysisSchema>;
export type AssessmentResponse = z.infer<typeof AssessmentResponseSchema>;
export type AssessmentResult = z.infer<typeof AssessmentResultSchema>;
export type LLDTPhase = z.infer<typeof LLDTPhaseSchema>;
export type LLDTCollaboration = z.infer<typeof LLDTCollaborationSchema>;
export type AnalyticsMetric = z.infer<typeof AnalyticsMetricSchema>;
export type DashboardWidget = z.infer<typeof DashboardWidgetSchema>;
export type ApiResponse<T = unknown> = z.infer<typeof ApiResponseSchema> & { data?: T };
export type ValidationError = z.infer<typeof ValidationErrorSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
