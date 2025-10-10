import { z } from 'zod';
import { AgentRequest, AgentType, UserType } from '../types';

// Request validation schemas
export const AgentRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  userType: z.nativeEnum(UserType),
  message: z.string().min(1, 'Message cannot be empty'),
  sessionId: z.string().min(1, 'Session ID is required'),
  taskType: z.string().optional(),
  streaming: z.boolean().optional(),
  context: z.record(z.any()).optional()
});

export const AgentConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  modelName: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  enableMemory: z.boolean().optional(),
  enableTools: z.boolean().optional(),
  vectorStoreUrl: z.string().url().optional(),
  redisUrl: z.string().url().optional()
});

export function validateAgentRequest(request: any): AgentRequest {
  try {
    return AgentRequestSchema.parse(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid request: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

export function validateAgentConfig(config: any): void {
  try {
    AgentConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid config: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

export function sanitizeMessage(message: string): string {
  // Remove potentially harmful content
  let sanitized = message.trim();
  
  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Limit length
  const MAX_LENGTH = 10000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }
  
  return sanitized;
}

export function validateUserPermission(userType: UserType, action: string): boolean {
  const permissions: Record<UserType, string[]> = {
    [UserType.ENTREPRENEUR]: ['chat', 'business_plan', 'financial_analysis', 'market_research'],
    [UserType.INVESTOR]: ['chat', 'deal_analysis', 'portfolio_management', 'valuation'],
    [UserType.LENDER]: ['chat', 'credit_assessment', 'loan_analysis', 'risk_evaluation'],
    [UserType.GRANTOR]: ['chat', 'impact_evaluation', 'grant_analysis', 'outcome_tracking'],
    [UserType.PARTNER]: ['chat', 'startup_matching', 'program_optimization', 'resource_allocation'],
    [UserType.ADMIN]: ['*']
  };

  const userPermissions = permissions[userType] || [];
  return userPermissions.includes('*') || userPermissions.includes(action);
}