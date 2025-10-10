import { UserType } from "@shared/schema";

// Widget Definition
export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  component: React.ComponentType<WidgetProps>;
  size: 'small' | 'medium' | 'large' | 'full';
  minSize?: { w: number; h: number };
  maxSize?: { w: number; h: number };
  permissions: string[];
  userTypes: UserType[];
  category: 'analytics' | 'activity' | 'ai' | 'goals' | 'funding' | 'credit' | 'general';
  refreshInterval?: number;
  priority: number;
  defaultEnabled: boolean;
  description?: string;
  icon?: React.ComponentType<any>;
}

// Widget Props
export interface WidgetProps {
  widgetId: string;
  config?: WidgetConfig;
  data?: any;
  loading?: boolean;
  error?: Error | null;
  onConfigChange?: (config: WidgetConfig) => void;
  onRefresh?: () => void;
}

// Widget Configuration
export interface WidgetConfig {
  enabled: boolean;
  refreshInterval?: number;
  autoRefresh?: boolean;
  customSettings?: Record<string, any>;
  position?: { x: number; y: number };
  size?: { w: number; h: number };
  visible?: boolean;
  locked?: boolean;
}

// Dashboard Configuration
export interface DashboardConfig {
  userType: UserType;
  layout: WidgetLayout[];
  widgets: DashboardWidget[];
  theme: DashboardTheme;
  preferences: UserPreferences;
}

// Widget Layout
export interface WidgetLayout {
  widgetId: string;
  position: { x: number; y: number };
  size: { w: number; h: number };
  visible: boolean;
  locked: boolean;
}

// Dashboard Theme
export interface DashboardTheme {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  density: 'compact' | 'normal' | 'comfortable';
}

// User Preferences
export interface UserPreferences {
  sidebarCollapsed: boolean;
  showWidgetTitles: boolean;
  enableAnimations: boolean;
  gridDensity: 'compact' | 'normal' | 'comfortable';
  defaultTimeRange: string;
  notifications: NotificationPreferences;
}

// Notification Preferences
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'instant' | 'hourly' | 'daily';
}

// Dashboard State
export interface DashboardState {
  // Layout state
  layout: WidgetLayout[];
  activeWidgets: string[];
  collapsedWidgets: string[];
  
  // Data state
  widgetData: Record<string, any>;
  loadingStates: Record<string, boolean>;
  errors: Record<string, Error | null>;
  
  // UI state
  sidebarOpen: boolean;
  selectedWidget: string | null;
  editMode: boolean;
  
  // User preferences
  preferences: UserPreferences;
  customizations: DashboardCustomizations;
}

// Dashboard Customizations
export interface DashboardCustomizations {
  customWidgets: DashboardWidget[];
  savedLayouts: SavedLayout[];
  widgetOrder: string[];
}

// Saved Layout
export interface SavedLayout {
  id: string;
  name: string;
  description?: string;
  layout: WidgetLayout[];
  isDefault?: boolean;
  createdAt: Date;
}

// Dashboard Actions
export type DashboardAction =
  | { type: 'ADD_WIDGET'; payload: DashboardWidget }
  | { type: 'REMOVE_WIDGET'; payload: string }
  | { type: 'UPDATE_LAYOUT'; payload: WidgetLayout[] }
  | { type: 'TOGGLE_WIDGET'; payload: string }
  | { type: 'SET_WIDGET_DATA'; payload: { id: string; data: any } }
  | { type: 'SET_LOADING'; payload: { id: string; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { id: string; error: Error | null } }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SAVE_LAYOUT'; payload: SavedLayout }
  | { type: 'LOAD_LAYOUT'; payload: string };

// Widget Registry
export interface WidgetRegistry {
  widgets: Map<string, DashboardWidget>;
  register: (widget: DashboardWidget) => void;
  unregister: (widgetId: string) => void;
  get: (widgetId: string) => DashboardWidget | undefined;
  getAll: () => DashboardWidget[];
  getByCategory: (category: string) => DashboardWidget[];
  getByUserType: (userType: UserType) => DashboardWidget[];
}

// Design Tokens
export interface DesignTokens {
  spacing: {
    widget: {
      padding: string;
      gap: string;
      margin: string;
    };
    grid: {
      columns: number;
      gutter: string;
      rowHeight: string;
    };
  };
  typography: {
    header: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
    };
    widgetTitle: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
    };
    metric: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
    };
  };
  colors: {
    widget: {
      background: string;
      border: string;
      hover: string;
    };
    metrics: {
      positive: string;
      negative: string;
      neutral: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  shadows: {
    widget: string;
    widgetHover: string;
    widgetActive: string;
  };
  animations: {
    widgetEntry: string;
    widgetExit: string;
    dataUpdate: string;
  };
}

// Grid Configuration
export interface GridConfig {
  breakpoints: {
    xs: { cols: number; width: number };
    sm: { cols: number; width: number };
    md: { cols: number; width: number };
    lg: { cols: number; width: number };
    xl: { cols: number; width: number };
  };
  widgetSizes: {
    small: { w: number; h: number };
    medium: { w: number; h: number };
    large: { w: number; h: number };
    full: { w: number; h: number };
  };
}

// Widget Categories
export enum WidgetCategory {
  ANALYTICS = 'analytics',
  ACTIVITY = 'activity',
  AI = 'ai',
  GOALS = 'goals',
  FUNDING = 'funding',
  CREDIT = 'credit',
  GENERAL = 'general'
}

// Widget Variants
export type WidgetVariant = 'metric' | 'chart' | 'list' | 'action' | 'insight' | 'feed' | 'custom';
