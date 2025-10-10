# Unified Dashboard System

This is a comprehensive dashboard system implementation based on the DASHBOARD_IMPROVEMENT_PROPOSAL. It provides a unified, scalable, and customizable dashboard experience across all user types in the startup ecosystem platform.

## 🏗️ Architecture Overview

The dashboard system is built with a modular architecture that includes:

- **Core Framework**: Base components for layout, widgets, and state management
- **Widget System**: Reusable, configurable widgets with registry system
- **Design System**: Consistent tokens and styling
- **Provider System**: Context-based state management
- **Type System**: Comprehensive TypeScript definitions

## 📁 File Structure

```
/components/dashboard/
├── core/                    # Core dashboard components
│   ├── DashboardLayout.tsx  # Main layout wrapper
│   ├── DashboardGrid.tsx    # Responsive grid system
│   └── DashboardWidget.tsx  # Base widget component
├── providers/               # Context providers
│   ├── DashboardProvider.tsx    # Main state management
│   └── WidgetRegistry.tsx       # Widget registration system
├── widgets/                 # Widget implementations
│   ├── analytics/           # Analytics widgets
│   ├── activity/            # Activity feed widgets
│   ├── ai/                  # AI-powered widgets
│   ├── goals/               # Goals and milestones
│   ├── funding/             # Funding-related widgets
│   └── credit/              # Credit monitoring widgets
├── tokens/                  # Design system
│   └── design-tokens.ts     # Design tokens and utilities
├── types/                   # TypeScript definitions
│   └── dashboard.types.ts   # All type definitions
├── UnifiedDashboard.tsx     # Main dashboard component
├── index.ts                 # Public API exports
└── README.md               # This file
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { UnifiedDashboard } from '@/components/dashboard';
import { UserType } from '@shared/schema';

function MyDashboard() {
  return (
    <UnifiedDashboard
      userType={UserType.ENTREPRENEUR}
      title="My Dashboard"
      subtitle="Track your startup progress"
      editable={true}
    />
  );
}
```

### Custom Dashboard

```tsx
import { 
  DashboardProvider, 
  WidgetRegistryProvider, 
  DashboardLayout,
  useRegisterWidget 
} from '@/components/dashboard';

function CustomDashboard() {
  return (
    <WidgetRegistryProvider>
      <DashboardProvider userType={UserType.ENTREPRENEUR}>
        <DashboardLayout
          title="Custom Dashboard"
          editable={true}
        />
      </DashboardProvider>
    </WidgetRegistryProvider>
  );
}
```

## 🧩 Widget System

### Creating a Widget

```tsx
import React from 'react';
import { WidgetProps } from '@/components/dashboard';
import DashboardWidget from '@/components/dashboard/core/DashboardWidget';

const MyWidget: React.FC<WidgetProps> = ({ widgetId, data, loading, error }) => {
  return (
    <DashboardWidget
      widgetId={widgetId}
      loading={loading}
      error={error}
      variant="metric"
    >
      <div className="p-4">
        <h3>My Widget</h3>
        <p>{data?.message || 'No data available'}</p>
      </div>
    </DashboardWidget>
  );
};

export default MyWidget;
```

### Registering a Widget

```tsx
import { useRegisterWidget } from '@/components/dashboard';
import { UserType } from '@shared/schema';

function WidgetRegistration() {
  const registerWidget = useRegisterWidget();

  useEffect(() => {
    registerWidget({
      id: 'my-widget',
      type: 'custom',
      title: 'My Custom Widget',
      component: MyWidget,
      size: 'medium',
      permissions: [],
      userTypes: [UserType.ENTREPRENEUR],
      category: 'general',
      priority: 5,
      defaultEnabled: true,
      description: 'A custom widget example',
    });
  }, [registerWidget]);

  return null;
}
```

## 🎨 Design System

### Using Design Tokens

```tsx
import { dashboardTokens, createWidgetStyles } from '@/components/dashboard';

// Use design tokens directly
const styles = {
  padding: dashboardTokens.spacing.widget.padding,
  fontSize: dashboardTokens.typography.widgetTitle.fontSize,
};

// Or use utility functions
const widgetStyles = createWidgetStyles('default');
```

### Custom Styling

```tsx
import { cn } from '@/lib/utils';

<DashboardWidget
  className={cn(
    'custom-widget',
    'hover:shadow-lg',
    'transition-all'
  )}
>
  {/* Widget content */}
</DashboardWidget>
```

## 🔧 State Management

### Using Dashboard State

```tsx
import { useDashboard, useWidgetState } from '@/components/dashboard';

function MyComponent() {
  const { state, addWidget, removeWidget } = useDashboard();
  const widgetState = useWidgetState('my-widget');

  const handleAddWidget = () => {
    addWidget('new-widget-id');
  };

  return (
    <div>
      <p>Active widgets: {state.activeWidgets.length}</p>
      <button onClick={handleAddWidget}>Add Widget</button>
      
      {widgetState.loading && <p>Loading...</p>}
      {widgetState.error && <p>Error: {widgetState.error.message}</p>}
      {widgetState.data && <p>Data: {JSON.stringify(widgetState.data)}</p>}
    </div>
  );
}
```

### Custom Hooks

```tsx
import { 
  useDashboardLayout,
  useDashboardPreferences,
  useDashboardUI 
} from '@/components/dashboard';

function LayoutControls() {
  const { layout, updateLayout } = useDashboardLayout();
  const { preferences, updatePreferences } = useDashboardPreferences();
  const { sidebarOpen, toggleSidebar } = useDashboardUI();

  return (
    <div>
      <button onClick={toggleSidebar}>
        {sidebarOpen ? 'Hide' : 'Show'} Sidebar
      </button>
      <button onClick={() => updatePreferences({ enableAnimations: false })}>
        Disable Animations
      </button>
    </div>
  );
}
```

## 📱 Responsive Design

The dashboard system is fully responsive with breakpoint-aware grid layouts:

- **Mobile (xs)**: 1 column
- **Tablet Portrait (sm)**: 2 columns  
- **Tablet Landscape (md)**: 4 columns
- **Desktop (lg)**: 6 columns
- **Large Desktop (xl)**: 12 columns

### Widget Sizes

- **Small**: 2×2 grid cells
- **Medium**: 4×3 grid cells
- **Large**: 6×4 grid cells
- **Full**: 12×5 grid cells (full width)

## 🎯 Widget Categories

### Analytics Widgets
- Revenue tracking and forecasting
- Growth metrics and KPIs
- Performance analytics
- Financial health monitoring

### Activity Widgets
- Activity feeds
- Notifications
- Recent actions
- Team collaboration

### AI Widgets
- AI insights and recommendations
- Predictive analytics
- Automated insights
- Smart suggestions

### Goals Widgets
- Goal tracking
- Milestone management
- Progress visualization
- Achievement tracking

### Funding Widgets
- Funding opportunities
- Investor matching
- Application tracking
- Portfolio management

### Credit Widgets
- Credit score monitoring
- Credit factors analysis
- Payment tracking
- Risk assessment

## 🔌 Integration

### With Existing Dashboards

The unified dashboard system can be gradually integrated with existing dashboards:

```tsx
// Old dashboard
function OldDashboard() {
  return <div>Old dashboard content</div>;
}

// New unified dashboard
function NewDashboard() {
  return <UnifiedDashboard userType={UserType.ENTREPRENEUR} />;
}

// Gradual migration
function MigratedDashboard() {
  const [useNewDashboard, setUseNewDashboard] = useState(false);
  
  return useNewDashboard ? <NewDashboard /> : <OldDashboard />;
}
```

### With External Data

```tsx
import { useWidgetState } from '@/components/dashboard';

function DataDrivenWidget() {
  const { data, setData, setLoading, setError } = useWidgetState('my-widget');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/my-data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setData, setLoading, setError]);

  return <div>{/* Render data */}</div>;
}
```

## 🧪 Testing

### Testing Widgets

```tsx
import { render } from '@testing-library/react';
import { UnifiedDashboard } from '@/components/dashboard';
import { UserType } from '@shared/schema';

test('renders dashboard with default widgets', () => {
  render(<UnifiedDashboard userType={UserType.ENTREPRENEUR} />);
  // Test assertions
});
```

### Testing with Mock Data

```tsx
import { 
  getMockRevenueData, 
  getMockActivityData 
} from '@/components/dashboard';

test('widget displays mock data correctly', () => {
  const mockData = getMockRevenueData();
  // Test with mock data
});
```

## 🚀 Performance

### Code Splitting

Widgets are automatically code-split using React.lazy:

```tsx
const RevenueWidget = lazy(() => import('./widgets/analytics/RevenueWidget'));
```

### Memoization

Components are memoized for optimal performance:

```tsx
const MyWidget = memo(({ data }) => {
  const processedData = useMemo(() => 
    processData(data), [data]
  );
  
  return <div>{/* Render */}</div>;
});
```

### Virtual Scrolling

Long lists use virtual scrolling for performance:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedList = ({ items }) => {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });
  
  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      {virtualizer.getVirtualItems().map((item) => (
        <Item key={item.key} data={items[item.index]} />
      ))}
    </div>
  );
};
```

## 🔒 Security

### Permissions

Widgets support permission-based access:

```tsx
const secureWidget = {
  id: 'admin-widget',
  permissions: ['admin', 'super-user'],
  userTypes: [UserType.ADMIN],
  // ... other config
};
```

### Data Validation

All widget data is validated using TypeScript types and runtime validation where needed.

## 📈 Analytics

The dashboard system includes built-in analytics capabilities:

- Widget usage tracking
- User interaction metrics
- Performance monitoring
- Error tracking

## 🛠️ Development

### Adding New Widgets

1. Create widget component in appropriate category folder
2. Register widget in WidgetRegistry
3. Add to default widgets for relevant user types
4. Test with mock data
5. Add to documentation

### Customizing Layouts

1. Use the layout editor in edit mode
2. Save custom layouts
3. Share layouts with team members
4. Create layout templates

## 📚 API Reference

### Components

- `UnifiedDashboard`: Main dashboard component
- `DashboardLayout`: Layout wrapper with sidebar and header
- `DashboardGrid`: Responsive grid system
- `DashboardWidget`: Base widget component

### Hooks

- `useDashboard`: Main dashboard state and actions
- `useWidgetState`: Individual widget state management
- `useDashboardLayout`: Layout management
- `useDashboardPreferences`: User preferences
- `useWidgetRegistry`: Widget registration and discovery

### Types

- `DashboardWidget`: Widget definition interface
- `WidgetProps`: Widget component props
- `DashboardState`: Dashboard state structure
- `WidgetLayout`: Widget positioning and sizing

## 🤝 Contributing

1. Follow the existing code patterns
2. Add comprehensive TypeScript types
3. Include unit tests for new components
4. Update documentation
5. Test with multiple user types

## 📄 License

This dashboard system is part of the IterativeStartups platform and follows the same licensing terms.

---

For more detailed information, see the original [DASHBOARD_IMPROVEMENT_PROPOSAL.md](../../../docs/DASHBOARD_IMPROVEMENT_PROPOSAL.md).
