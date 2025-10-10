/**
 * Shared Types Index
 * Central export point for all shared types and schemas
 */

// Re-export domain types
export * from './domain';

// Re-export validation schemas
export * as ValidationSchemas from './validation';

// Re-export from schema.ts for backward compatibility
export * from '../schema';
