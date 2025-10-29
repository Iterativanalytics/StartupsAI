// Re-export from IterativePlanContext for backward compatibility
export { 
  IterativePlanProvider as BusinessPlanProvider,
  useIterativePlan as useBusinessPlan,
  type IterativePlanContextType as BusinessPlanContextType,
  type IterativePlanMetadata as BusinessPlanMetadata,
  type SectionContent,
  type SectionStatus
} from './IterativePlanContext';
