import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import { UserType } from '@shared/schema';
import { 
  DashboardState, 
  DashboardAction, 
  DashboardConfig, 
  WidgetLayout, 
  UserPreferences,
  DashboardCustomizations,
  SavedLayout
} from '../types/dashboard.types';
import { getDefaultWidgetsForUserType } from './WidgetRegistry';

interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  // Actions
  addWidget: (widgetId: string) => void;
  removeWidget: (widgetId: string) => void;
  updateLayout: (layout: WidgetLayout[]) => void;
  toggleWidget: (widgetId: string) => void;
  setWidgetData: (widgetId: string, data: any) => void;
  setWidgetLoading: (widgetId: string, loading: boolean) => void;
  setWidgetError: (widgetId: string, error: Error | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  toggleSidebar: () => void;
  setEditMode: (editMode: boolean) => void;
  saveLayout: (layout: SavedLayout) => void;
  loadLayout: (layoutId: string) => void;
  resetToDefaults: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Initial state
const createInitialState = (userType: UserType): DashboardState => {
  const defaultWidgets = getDefaultWidgetsForUserType(userType);
  
  return {
    layout: defaultWidgets.map((widgetId, index) => ({
      widgetId,
      position: { x: (index % 3) * 4, y: Math.floor(index / 3) * 3 },
      size: { w: 4, h: 3 },
      visible: true,
      locked: false,
    })),
    activeWidgets: defaultWidgets,
    collapsedWidgets: [],
    widgetData: {},
    loadingStates: {},
    errors: {},
    sidebarOpen: true,
    selectedWidget: null,
    editMode: false,
    preferences: {
      sidebarCollapsed: false,
      showWidgetTitles: true,
      enableAnimations: true,
      gridDensity: 'normal',
      defaultTimeRange: '30d',
      notifications: {
        email: true,
        push: true,
        inApp: true,
        frequency: 'instant',
      },
    },
    customizations: {
      customWidgets: [],
      savedLayouts: [],
      widgetOrder: defaultWidgets,
    },
  };
};

// Reducer
const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'ADD_WIDGET': {
      const newWidgetId = action.payload.id;
      const newLayout: WidgetLayout = {
        widgetId: newWidgetId,
        position: { x: 0, y: 0 },
        size: { w: 4, h: 3 },
        visible: true,
        locked: false,
      };

      return {
        ...state,
        layout: [...state.layout, newLayout],
        activeWidgets: [...state.activeWidgets, newWidgetId],
      };
    }

    case 'REMOVE_WIDGET': {
      const widgetId = action.payload;
      return {
        ...state,
        layout: state.layout.filter(item => item.widgetId !== widgetId),
        activeWidgets: state.activeWidgets.filter(id => id !== widgetId),
        widgetData: { ...state.widgetData, [widgetId]: undefined },
        loadingStates: { ...state.loadingStates, [widgetId]: false },
        errors: { ...state.errors, [widgetId]: null },
      };
    }

    case 'UPDATE_LAYOUT':
      return {
        ...state,
        layout: action.payload,
      };

    case 'TOGGLE_WIDGET': {
      const widgetId = action.payload;
      const isActive = state.activeWidgets.includes(widgetId);
      
      if (isActive) {
        return {
          ...state,
          activeWidgets: state.activeWidgets.filter(id => id !== widgetId),
          layout: state.layout.map(item =>
            item.widgetId === widgetId ? { ...item, visible: false } : item
          ),
        };
      } else {
        return {
          ...state,
          activeWidgets: [...state.activeWidgets, widgetId],
          layout: state.layout.map(item =>
            item.widgetId === widgetId ? { ...item, visible: true } : item
          ),
        };
      }
    }

    case 'SET_WIDGET_DATA':
      return {
        ...state,
        widgetData: {
          ...state.widgetData,
          [action.payload.id]: action.payload.data,
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          [action.payload.id]: action.payload.loading,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.id]: action.payload.error,
        },
      };

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    case 'SET_EDIT_MODE':
      return {
        ...state,
        editMode: action.payload,
      };

    case 'SAVE_LAYOUT': {
      const newLayout = action.payload;
      return {
        ...state,
        customizations: {
          ...state.customizations,
          savedLayouts: [...state.customizations.savedLayouts, newLayout],
        },
      };
    }

    case 'LOAD_LAYOUT': {
      const layoutId = action.payload;
      const savedLayout = state.customizations.savedLayouts.find(l => l.id === layoutId);
      
      if (savedLayout) {
        return {
          ...state,
          layout: savedLayout.layout,
          activeWidgets: savedLayout.layout
            .filter(item => item.visible)
            .map(item => item.widgetId),
        };
      }
      
      return state;
    }

    default:
      return state;
  }
};

interface DashboardProviderProps {
  children: React.ReactNode;
  userType: UserType;
  initialConfig?: Partial<DashboardConfig>;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
  userType,
  initialConfig,
}) => {
  const [state, dispatch] = useReducer(dashboardReducer, createInitialState(userType));

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(`dashboard-state-${userType}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Only restore certain parts of the state
        if (parsed.layout) {
          dispatch({ type: 'UPDATE_LAYOUT', payload: parsed.layout });
        }
        if (parsed.preferences) {
          dispatch({ type: 'UPDATE_PREFERENCES', payload: parsed.preferences });
        }
        if (parsed.customizations?.savedLayouts) {
          dispatch({ 
            type: 'SAVE_LAYOUT', 
            payload: parsed.customizations.savedLayouts[0] 
          });
        }
      } catch (error) {
        console.warn('Failed to restore dashboard state:', error);
      }
    }
  }, [userType]);

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      layout: state.layout,
      preferences: state.preferences,
      customizations: state.customizations,
    };
    
    localStorage.setItem(`dashboard-state-${userType}`, JSON.stringify(stateToSave));
  }, [state.layout, state.preferences, state.customizations, userType]);

  // Action creators
  const addWidget = useCallback((widgetId: string) => {
    dispatch({ type: 'ADD_WIDGET', payload: { id: widgetId } as any });
  }, []);

  const removeWidget = useCallback((widgetId: string) => {
    dispatch({ type: 'REMOVE_WIDGET', payload: widgetId });
  }, []);

  const updateLayout = useCallback((layout: WidgetLayout[]) => {
    dispatch({ type: 'UPDATE_LAYOUT', payload: layout });
  }, []);

  const toggleWidget = useCallback((widgetId: string) => {
    dispatch({ type: 'TOGGLE_WIDGET', payload: widgetId });
  }, []);

  const setWidgetData = useCallback((widgetId: string, data: any) => {
    dispatch({ type: 'SET_WIDGET_DATA', payload: { id: widgetId, data } });
  }, []);

  const setWidgetLoading = useCallback((widgetId: string, loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { id: widgetId, loading } });
  }, []);

  const setWidgetError = useCallback((widgetId: string, error: Error | null) => {
    dispatch({ type: 'SET_ERROR', payload: { id: widgetId, error } });
  }, []);

  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const setEditMode = useCallback((editMode: boolean) => {
    dispatch({ type: 'SET_EDIT_MODE', payload: editMode });
  }, []);

  const saveLayout = useCallback((layout: SavedLayout) => {
    dispatch({ type: 'SAVE_LAYOUT', payload: layout });
  }, []);

  const loadLayout = useCallback((layoutId: string) => {
    dispatch({ type: 'LOAD_LAYOUT', payload: layoutId });
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaultState = createInitialState(userType);
    dispatch({ type: 'UPDATE_LAYOUT', payload: defaultState.layout });
    dispatch({ type: 'UPDATE_PREFERENCES', payload: defaultState.preferences });
  }, [userType]);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    addWidget,
    removeWidget,
    updateLayout,
    toggleWidget,
    setWidgetData,
    setWidgetLoading,
    setWidgetError,
    updatePreferences,
    toggleSidebar,
    setEditMode,
    saveLayout,
    loadLayout,
    resetToDefaults,
  }), [
    state,
    addWidget,
    removeWidget,
    updateLayout,
    toggleWidget,
    setWidgetData,
    setWidgetLoading,
    setWidgetError,
    updatePreferences,
    toggleSidebar,
    setEditMode,
    saveLayout,
    loadLayout,
    resetToDefaults,
  ]);

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

// Hooks for specific state slices
export const useDashboardState = () => {
  const { state } = useDashboard();
  return state;
};

export const useDashboardLayout = () => {
  const { state, updateLayout } = useDashboard();
  return {
    layout: state.layout,
    updateLayout,
  };
};

export const useDashboardPreferences = () => {
  const { state, updatePreferences } = useDashboard();
  return {
    preferences: state.preferences,
    updatePreferences,
  };
};

export const useDashboardUI = () => {
  const { state, toggleSidebar, setEditMode } = useDashboard();
  return {
    sidebarOpen: state.sidebarOpen,
    editMode: state.editMode,
    toggleSidebar,
    setEditMode,
  };
};

export const useWidgetState = (widgetId: string) => {
  const { state, setWidgetData, setWidgetLoading, setWidgetError } = useDashboard();
  
  return {
    data: state.widgetData[widgetId],
    loading: state.loadingStates[widgetId] || false,
    error: state.errors[widgetId] || null,
    setData: (data: any) => setWidgetData(widgetId, data),
    setLoading: (loading: boolean) => setWidgetLoading(widgetId, loading),
    setError: (error: Error | null) => setWidgetError(widgetId, error),
  };
};
