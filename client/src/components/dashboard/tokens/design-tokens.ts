import { DesignTokens, GridConfig } from '../types/dashboard.types';

// Design tokens for dashboards
export const dashboardTokens: DesignTokens = {
  // Spacing
  spacing: {
    widget: {
      padding: '1.5rem',
      gap: '1rem',
      margin: '0.75rem',
    },
    grid: {
      columns: 12,
      gutter: '1.5rem',
      rowHeight: '80px',
    },
  },
  
  // Typography
  typography: {
    header: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    widgetTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    metric: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1,
    },
  },
  
  // Colors
  colors: {
    widget: {
      background: 'white',
      border: 'gray-200',
      hover: 'gray-50',
    },
    metrics: {
      positive: 'green-600',
      negative: 'red-600',
      neutral: 'gray-600',
    },
    status: {
      success: 'green-500',
      warning: 'yellow-500',
      error: 'red-500',
      info: 'blue-500',
    },
  },
  
  // Shadows
  shadows: {
    widget: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    widgetHover: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    widgetActive: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  
  // Animations
  animations: {
    widgetEntry: 'fadeInUp 0.3s ease-out',
    widgetExit: 'fadeOut 0.2s ease-in',
    dataUpdate: 'pulse 0.5s ease-in-out',
  },
};

// Grid configuration
export const gridConfig: GridConfig = {
  // Breakpoint-aware grid
  breakpoints: {
    xs: { cols: 1, width: 0 },      // Mobile
    sm: { cols: 2, width: 640 },    // Tablet portrait
    md: { cols: 4, width: 768 },    // Tablet landscape
    lg: { cols: 6, width: 1024 },   // Desktop
    xl: { cols: 12, width: 1280 },  // Large desktop
  },
  
  // Widget size mapping
  widgetSizes: {
    small: { w: 2, h: 2 },   // 2x2 grid cells
    medium: { w: 4, h: 3 },  // 4x3 grid cells
    large: { w: 6, h: 4 },   // 6x4 grid cells
    full: { w: 12, h: 5 },   // Full width
  },
};

// CSS Custom Properties for dynamic theming
export const cssVariables = {
  // Spacing
  '--widget-padding': dashboardTokens.spacing.widget.padding,
  '--widget-gap': dashboardTokens.spacing.widget.gap,
  '--widget-margin': dashboardTokens.spacing.widget.margin,
  '--grid-gutter': dashboardTokens.spacing.grid.gutter,
  '--grid-row-height': dashboardTokens.spacing.grid.rowHeight,
  
  // Typography
  '--header-font-size': dashboardTokens.typography.header.fontSize,
  '--header-font-weight': dashboardTokens.typography.header.fontWeight,
  '--header-line-height': dashboardTokens.typography.header.lineHeight,
  '--widget-title-font-size': dashboardTokens.typography.widgetTitle.fontSize,
  '--widget-title-font-weight': dashboardTokens.typography.widgetTitle.fontWeight,
  '--widget-title-line-height': dashboardTokens.typography.widgetTitle.lineHeight,
  '--metric-font-size': dashboardTokens.typography.metric.fontSize,
  '--metric-font-weight': dashboardTokens.typography.metric.fontWeight,
  '--metric-line-height': dashboardTokens.typography.metric.lineHeight,
  
  // Colors
  '--widget-bg': dashboardTokens.colors.widget.background,
  '--widget-border': dashboardTokens.colors.widget.border,
  '--widget-hover': dashboardTokens.colors.widget.hover,
  '--metric-positive': dashboardTokens.colors.metrics.positive,
  '--metric-negative': dashboardTokens.colors.metrics.negative,
  '--metric-neutral': dashboardTokens.colors.metrics.neutral,
  '--status-success': dashboardTokens.colors.status.success,
  '--status-warning': dashboardTokens.colors.status.warning,
  '--status-error': dashboardTokens.colors.status.error,
  '--status-info': dashboardTokens.colors.status.info,
  
  // Shadows
  '--widget-shadow': dashboardTokens.shadows.widget,
  '--widget-shadow-hover': dashboardTokens.shadows.widgetHover,
  '--widget-shadow-active': dashboardTokens.shadows.widgetActive,
  
  // Animations
  '--widget-entry-animation': dashboardTokens.animations.widgetEntry,
  '--widget-exit-animation': dashboardTokens.animations.widgetExit,
  '--data-update-animation': dashboardTokens.animations.dataUpdate,
};

// Utility functions for design tokens
export const getSpacing = (key: keyof typeof dashboardTokens.spacing) => {
  return dashboardTokens.spacing[key];
};

export const getTypography = (key: keyof typeof dashboardTokens.typography) => {
  return dashboardTokens.typography[key];
};

export const getColors = (key: keyof typeof dashboardTokens.colors) => {
  return dashboardTokens.colors[key];
};

export const getShadows = (key: keyof typeof dashboardTokens.shadows) => {
  return dashboardTokens.shadows[key];
};

export const getAnimations = (key: keyof typeof dashboardTokens.animations) => {
  return dashboardTokens.animations[key];
};

// Breakpoint utilities
export const getBreakpoint = (key: keyof typeof gridConfig.breakpoints) => {
  return gridConfig.breakpoints[key];
};

export const getWidgetSize = (size: keyof typeof gridConfig.widgetSizes) => {
  return gridConfig.widgetSizes[size];
};

// CSS-in-JS helpers
export const createWidgetStyles = (variant: 'default' | 'compact' | 'comfortable') => {
  const densityMultiplier = {
    compact: 0.75,
    default: 1,
    comfortable: 1.25,
  }[variant];

  return {
    padding: `calc(${dashboardTokens.spacing.widget.padding} * ${densityMultiplier})`,
    gap: `calc(${dashboardTokens.spacing.widget.gap} * ${densityMultiplier})`,
    margin: `calc(${dashboardTokens.spacing.widget.margin} * ${densityMultiplier})`,
    borderRadius: '0.5rem',
    backgroundColor: dashboardTokens.colors.widget.background,
    border: `1px solid var(--${dashboardTokens.colors.widget.border})`,
    boxShadow: dashboardTokens.shadows.widget,
    transition: 'all 0.2s ease-in-out',
    
    '&:hover': {
      boxShadow: dashboardTokens.shadows.widgetHover,
      backgroundColor: dashboardTokens.colors.widget.hover,
    },
    
    '&:active': {
      boxShadow: dashboardTokens.shadows.widgetActive,
    },
  };
};

// Animation keyframes
export const keyframes = {
  fadeInUp: {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  fadeOut: {
    from: {
      opacity: 1,
      transform: 'scale(1)',
    },
    to: {
      opacity: 0,
      transform: 'scale(0.95)',
    },
  },
  pulse: {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.7,
    },
  },
};

// Theme variants
export const themeVariants = {
  light: {
    ...cssVariables,
    '--widget-bg': '#ffffff',
    '--widget-border': '#e5e7eb',
    '--widget-hover': '#f9fafb',
  },
  dark: {
    ...cssVariables,
    '--widget-bg': '#1f2937',
    '--widget-border': '#374151',
    '--widget-hover': '#111827',
  },
  system: {
    ...cssVariables,
    // Will be determined by system preference
  },
};
