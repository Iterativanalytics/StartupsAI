import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { UserType } from '@shared/schema';
import { DashboardWidget, WidgetRegistry as IWidgetRegistry, WidgetCategory } from '../types/dashboard.types';

interface WidgetRegistryContextType {
  registry: IWidgetRegistry;
}

const WidgetRegistryContext = createContext<WidgetRegistryContextType | null>(null);

export const useWidgetRegistry = () => {
  const context = useContext(WidgetRegistryContext);
  if (!context) {
    throw new Error('useWidgetRegistry must be used within a WidgetRegistryProvider');
  }
  return context;
};

interface WidgetRegistryProviderProps {
  children: React.ReactNode;
}

export const WidgetRegistryProvider: React.FC<WidgetRegistryProviderProps> = ({ children }) => {
  const widgetMap = useMemo(() => new Map<string, DashboardWidget>(), []);

  const register = useCallback((widget: DashboardWidget) => {
    widgetMap.set(widget.id, widget);
  }, [widgetMap]);

  const unregister = useCallback((widgetId: string) => {
    widgetMap.delete(widgetId);
  }, [widgetMap]);

  const get = useCallback((widgetId: string) => {
    return widgetMap.get(widgetId);
  }, [widgetMap]);

  const getAll = useCallback(() => {
    return Array.from(widgetMap.values());
  }, [widgetMap]);

  const getByCategory = useCallback((category: string) => {
    return Array.from(widgetMap.values()).filter(widget => widget.category === category);
  }, [widgetMap]);

  const getByUserType = useCallback((userType: UserType) => {
    return Array.from(widgetMap.values()).filter(widget => 
      widget.userTypes.includes(userType)
    );
  }, [widgetMap]);

  const registry: IWidgetRegistry = useMemo(() => ({
    widgets: widgetMap,
    register,
    unregister,
    get,
    getAll,
    getByCategory,
    getByUserType,
  }), [widgetMap, register, unregister, get, getAll, getByCategory, getByUserType]);

  return (
    <WidgetRegistryContext.Provider value={{ registry }}>
      {children}
    </WidgetRegistryContext.Provider>
  );
};

// Widget registration hook
export const useRegisterWidget = () => {
  const { registry } = useWidgetRegistry();
  
  return useCallback((widget: DashboardWidget) => {
    registry.register(widget);
  }, [registry]);
};

// Widget discovery hooks
export const useWidgets = () => {
  const { registry } = useWidgetRegistry();
  return registry.getAll();
};

export const useWidgetsByCategory = (category: WidgetCategory) => {
  const { registry } = useWidgetRegistry();
  return registry.getByCategory(category);
};

export const useWidgetsByUserType = (userType: UserType) => {
  const { registry } = useWidgetRegistry();
  return registry.getByUserType(userType);
};

export const useWidget = (widgetId: string) => {
  const { registry } = useWidgetRegistry();
  return registry.get(widgetId);
};

// Widget categories helper
export const getWidgetCategories = () => {
  return Object.values(WidgetCategory);
};

// Default widget configurations for different user types
export const getDefaultWidgetsForUserType = (userType: UserType): string[] => {
  const defaultWidgets: Partial<Record<UserType, string[]>> = {
    [UserType.ENTREPRENEUR]: [
      'revenue-overview',
      'growth-metrics',
      'funding-opportunities',
      'goals-tracker',
      'activity-feed',
      'ai-insights',
      'credit-score',
    ],
    [UserType.INVESTOR]: [
      'portfolio-overview',
      'deal-pipeline',
      'market-insights',
      'activity-feed',
      'ai-insights',
      'performance-metrics',
    ],
    [UserType.LENDER]: [
      'credit-monitoring',
      'loan-portfolio',
      'risk-assessment',
      'activity-feed',
      'ai-insights',
      'payment-tracking',
    ],
    [UserType.GRANTOR]: [
      'grant-portfolio',
      'application-pipeline',
      'impact-metrics',
      'activity-feed',
      'ai-insights',
      'compliance-tracking',
    ],
    [UserType.PARTNER]: [
      'partnership-pipeline',
      'collaboration-metrics',
      'activity-feed',
      'ai-insights',
      'performance-dashboard',
    ],
    [UserType.TEAM_MEMBER]: [
      'task-overview',
      'team-activity',
      'goals-tracker',
      'activity-feed',
      'ai-insights',
    ],
  };

  return defaultWidgets[userType] || [];
};

// Widget priority ordering
export const sortWidgetsByPriority = (widgets: DashboardWidget[]): DashboardWidget[] => {
  return [...widgets].sort((a, b) => b.priority - a.priority);
};

// Widget filtering utilities
export const filterWidgetsByPermissions = (widgets: DashboardWidget[], userPermissions: string[]): DashboardWidget[] => {
  return widgets.filter(widget => 
    widget.permissions.length === 0 || 
    widget.permissions.some(permission => userPermissions.includes(permission))
  );
};

export const filterEnabledWidgets = (widgets: DashboardWidget[]): DashboardWidget[] => {
  return widgets.filter(widget => widget.defaultEnabled);
};
