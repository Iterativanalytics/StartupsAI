import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Menu, 
  Settings, 
  Layout, 
  Palette,
  Bell,
  User,
  Search,
  Grid3X3,
  List,
  Maximize2,
  Minimize2,
  Save,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';
import { useDashboard, useDashboardUI } from '../providers/DashboardProvider';
import { useWidgetRegistry, useWidgetsByCategory } from '../providers/WidgetRegistry';
import { WidgetCategory } from '../types/dashboard.types';
import DashboardGrid from './DashboardGrid';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showSidebar?: boolean;
  editable?: boolean;
  onSave?: () => void;
  onExport?: () => void;
  onImport?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  className,
  title = "Dashboard",
  subtitle,
  showHeader = true,
  showSidebar = true,
  editable = false,
  onSave,
  onExport,
  onImport,
}) => {
  const { state } = useDashboard();
  const { sidebarOpen, editMode, toggleSidebar, setEditMode } = useDashboardUI();
  const { registry } = useWidgetRegistry();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarContent, setSidebarContent] = useState<'widgets' | 'settings' | 'layouts'>('widgets');

  // Widget categories for sidebar
  const analyticsWidgets = useWidgetsByCategory(WidgetCategory.ANALYTICS);
  const activityWidgets = useWidgetsByCategory(WidgetCategory.ACTIVITY);
  const aiWidgets = useWidgetsByCategory(WidgetCategory.AI);
  const goalWidgets = useWidgetsByCategory(WidgetCategory.GOALS);
  const fundingWidgets = useWidgetsByCategory(WidgetCategory.FUNDING);
  const creditWidgets = useWidgetsByCategory(WidgetCategory.CREDIT);

  const handleAddWidget = useCallback((widgetId: string) => {
    // TODO: Implement add widget logic
    console.log('Add widget:', widgetId);
  }, []);

  const handleSave = useCallback(() => {
    onSave?.();
  }, [onSave]);

  const handleExport = useCallback(() => {
    onExport?.();
  }, [onExport]);

  const handleImport = useCallback(() => {
    onImport?.();
  }, [onImport]);

  const renderSidebar = () => {
    if (!showSidebar) return null;

    return (
      <Sheet open={sidebarOpen} onOpenChange={toggleSidebar}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Dashboard Tools</SheetTitle>
            <SheetDescription>
              Manage your dashboard widgets and settings
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* Sidebar Navigation */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <Button
                variant={sidebarContent === 'widgets' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSidebarContent('widgets')}
                className="flex-1"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Widgets
              </Button>
              <Button
                variant={sidebarContent === 'settings' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSidebarContent('settings')}
                className="flex-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant={sidebarContent === 'layouts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSidebarContent('layouts')}
                className="flex-1"
              >
                <Layout className="h-4 w-4 mr-2" />
                Layouts
              </Button>
            </div>

            {/* Widget Library */}
            {sidebarContent === 'widgets' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Analytics</h3>
                  <div className="space-y-1">
                    {analyticsWidgets.map(widget => (
                      <Button
                        key={widget.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleAddWidget(widget.id)}
                      >
                        {widget.icon && <widget.icon className="h-4 w-4 mr-2" />}
                        {widget.title}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Activity</h3>
                  <div className="space-y-1">
                    {activityWidgets.map(widget => (
                      <Button
                        key={widget.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleAddWidget(widget.id)}
                      >
                        {widget.icon && <widget.icon className="h-4 w-4 mr-2" />}
                        {widget.title}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">AI & Insights</h3>
                  <div className="space-y-1">
                    {aiWidgets.map(widget => (
                      <Button
                        key={widget.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleAddWidget(widget.id)}
                      >
                        {widget.icon && <widget.icon className="h-4 w-4 mr-2" />}
                        {widget.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings */}
            {sidebarContent === 'settings' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Display</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Theme
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Grid Density
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notification Settings
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Layouts */}
            {sidebarContent === 'layouts' && (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Layout
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Saved Layouts</h3>
                  <div className="space-y-1">
                    {state.customizations.savedLayouts.map(layout => (
                      <Button
                        key={layout.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Layout className="h-4 w-4 mr-2" />
                        {layout.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div className={cn('flex h-screen bg-background', className)}>
      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {showHeader && (
          <header className="border-b bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {subtitle && (
                  <p className="text-muted-foreground">{subtitle}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Edit Mode Toggle */}
                {editable && (
                  <Button
                    variant={editMode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? (
                      <>
                        <Minimize2 className="h-4 w-4 mr-2" />
                        Exit Edit
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-4 w-4 mr-2" />
                        Edit Layout
                      </>
                    )}
                  </Button>
                )}

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Layout
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExport}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleImport}>
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sidebar Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSidebar}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>
        )}

        {/* Dashboard Grid */}
        <main className="flex-1 overflow-hidden">
          <DashboardGrid
            editable={editMode}
            onWidgetClick={(widgetId) => {
              console.log('Widget clicked:', widgetId);
            }}
            onWidgetDrop={(widgetId, position) => {
              console.log('Widget dropped:', widgetId, position);
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
