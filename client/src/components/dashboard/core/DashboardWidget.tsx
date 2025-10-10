import React, { useState, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MoreHorizontal, 
  RefreshCw, 
  Settings, 
  Maximize2, 
  Minimize2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WidgetProps, WidgetVariant } from '../types/dashboard.types';
import { createWidgetStyles } from '../tokens/design-tokens';
import { cn } from '@/lib/utils';

interface DashboardWidgetProps extends WidgetProps {
  variant?: WidgetVariant;
  className?: string;
  onMaximize?: () => void;
  onMinimize?: () => void;
  onRemove?: () => void;
  onConfigure?: () => void;
  isMaximized?: boolean;
  showActions?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  children?: React.ReactNode;
}

const WidgetErrorBoundary: React.FC<{
  widgetId: string;
  children: React.ReactNode;
  onError?: (error: Error) => void;
}> = ({ widgetId, children, onError }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setHasError(true);
    setError(error);
    onError?.(error);
    console.error(`Widget ${widgetId} error:`, error);
  }, [widgetId, onError]);

  if (hasError) {
    return (
      <Card className="h-full border-red-200 bg-red-50">
        <CardContent className="flex flex-col items-center justify-center h-full p-6">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <h3 className="font-semibold text-red-800 mb-1">Widget Error</h3>
          <p className="text-sm text-red-600 text-center mb-4">
            {error?.message || 'An unexpected error occurred'}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setHasError(false);
              setError(null);
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Let the parent handle the error display
    }

    return this.props.children;
  }
}

const WidgetLoadingState: React.FC<{ variant?: WidgetVariant }> = ({ variant = 'metric' }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'chart':
        return (
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-32 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'metric':
      default:
        return (
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

const WidgetErrorState: React.FC<{
  error: Error;
  onRetry?: () => void;
}> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <h3 className="font-semibold text-red-800 mb-1">Error</h3>
      <p className="text-sm text-red-600 text-center mb-4">
        {error.message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
};

const DashboardWidget: React.FC<DashboardWidgetProps> = memo(({
  widgetId,
  config,
  data,
  loading = false,
  error,
  onConfigChange,
  onRefresh,
  onMaximize,
  onMinimize,
  onRemove,
  onConfigure,
  isMaximized = false,
  showActions = true,
  showHeader = true,
  showFooter = false,
  variant = 'metric',
  className,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleRefresh = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  const handleConfigure = useCallback(() => {
    onConfigure?.();
  }, [onConfigure]);

  const handleMaximize = useCallback(() => {
    if (isMaximized) {
      onMinimize?.();
    } else {
      onMaximize?.();
    }
  }, [isMaximized, onMaximize, onMinimize]);

  const widgetStyles = createWidgetStyles('default');

  const renderContent = () => {
    if (loading) {
      return <WidgetLoadingState variant={variant} />;
    }

    if (error) {
      return <WidgetErrorState error={error} onRetry={handleRefresh} />;
    }

    return children;
  };

  const renderActions = () => {
    if (!showActions) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleMaximize}>
            {isMaximized ? (
              <>
                <Minimize2 className="mr-2 h-4 w-4" />
                Minimize
              </>
            ) : (
              <>
                <Maximize2 className="mr-2 h-4 w-4" />
                Maximize
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleConfigure}>
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onRemove} className="text-red-600">
            <X className="mr-2 h-4 w-4" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <Card
      className={cn(
        'group relative h-full transition-all duration-200',
        'hover:shadow-md',
        isMaximized && 'fixed inset-4 z-50',
        className
      )}
      style={widgetStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">
            Widget {widgetId}
          </CardTitle>
          <div className="flex items-center space-x-1">
            {config?.autoRefresh && (
              <Badge variant="secondary" className="text-xs">
                Auto
              </Badge>
            )}
            {renderActions()}
          </div>
        </CardHeader>
      )}
      
      <CardContent className="flex-1">
        <WidgetErrorBoundary widgetId={widgetId}>
          {renderContent()}
        </WidgetErrorBoundary>
      </CardContent>
      
      {showFooter && (
        <div className="px-6 py-3 border-t bg-muted/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            {config?.refreshInterval && (
              <span>Refresh: {config.refreshInterval}s</span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
});

DashboardWidget.displayName = 'DashboardWidget';

export default DashboardWidget;
