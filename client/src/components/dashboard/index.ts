// Main dashboard component
export { default as UnifiedDashboard } from './UnifiedDashboard';

// Core components
export { default as DashboardLayout } from './core/DashboardLayout';
export { default as DashboardGrid } from './core/DashboardGrid';
export { default as DashboardWidget } from './core/DashboardWidget';

// Providers
export { DashboardProvider, useDashboard, useDashboardState, useDashboardLayout, useDashboardPreferences, useDashboardUI, useWidgetState } from './providers/DashboardProvider';
export { WidgetRegistryProvider, useWidgetRegistry, useRegisterWidget, useWidgets, useWidgetsByCategory, useWidgetsByUserType, useWidget } from './providers/WidgetRegistry';

// Widgets
export { default as RevenueWidget } from './widgets/analytics/RevenueWidget';
export { default as ActivityFeedWidget } from './widgets/activity/ActivityFeedWidget';
export { default as AIInsightsWidget } from './widgets/ai/AIInsightsWidget';
export { default as GoalsTrackerWidget } from './widgets/goals/GoalsTrackerWidget';

// Types
export type {
  WidgetProps,
  WidgetConfig,
  DashboardConfig,
  WidgetLayout,
  DashboardTheme,
  UserPreferences,
  NotificationPreferences,
  DashboardState,
  DashboardCustomizations,
  SavedLayout,
  DashboardAction,
  WidgetRegistry,
  DesignTokens,
  GridConfig,
} from './types/dashboard.types';

// Design tokens
export {
  dashboardTokens,
  gridConfig,
  cssVariables,
  getSpacing,
  getTypography,
  getColors,
  getShadows,
  getAnimations,
  getBreakpoint,
  getWidgetSize,
  createWidgetStyles,
  keyframes,
  themeVariants,
} from './tokens/design-tokens';

// Utility functions
export {
  getDefaultWidgetsForUserType,
  sortWidgetsByPriority,
  filterWidgetsByPermissions,
  filterEnabledWidgets,
  getWidgetCategories,
} from './providers/WidgetRegistry';

// Performance hooks
export {
  useWidgetData,
  useBatchWidgetData,
  usePrefetchCriticalWidgets,
  useRealtimeWidget,
  useOptimisticWidgetUpdate,
  useWidgetCache,
} from './hooks/useDashboardData';

export {
  useDashboardPerformance,
  useWidgetPerformance,
  useBundleSizeMonitoring,
  usePerformanceOptimizations,
  usePerformanceReporting,
} from './hooks/useDashboardPerformance';

// Mock data for testing
export {
  getMockRevenueData,
  getMockActivityData,
  getMockAIInsightsData,
  getMockGoalsData,
} from './UnifiedDashboard';
