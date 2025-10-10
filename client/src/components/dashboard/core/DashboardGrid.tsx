import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff,
  Plus,
  Settings,
  Layout
} from 'lucide-react';
import { WidgetLayout, GridConfig } from '../types/dashboard.types';
import { gridConfig, getWidgetSize } from '../tokens/design-tokens';
import { useDashboard, useDashboardLayout } from '../providers/DashboardProvider';
import { useWidgetRegistry } from '../providers/WidgetRegistry';
import DashboardWidget from './DashboardWidget';
import { cn } from '@/lib/utils';

interface DashboardGridProps {
  className?: string;
  editable?: boolean;
  onWidgetClick?: (widgetId: string) => void;
  onWidgetDrop?: (widgetId: string, position: { x: number; y: number }) => void;
}

interface GridCell {
  x: number;
  y: number;
  occupied: boolean;
  widgetId?: string;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  className,
  editable = false,
  onWidgetClick,
  onWidgetDrop,
}) => {
  const { layout, updateLayout } = useDashboardLayout();
  const { registry } = useWidgetRegistry();
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // Calculate grid dimensions based on container size
  useEffect(() => {
    if (!containerRef) return;

    const updateGridSize = () => {
      const rect = containerRef.getBoundingClientRect();
      const cols = Math.floor(rect.width / (200 + 16)); // 200px widget width + 16px gap
      const rows = Math.floor(rect.height / (150 + 16)); // 150px widget height + 16px gap
      setGridSize({ width: cols, height: rows });
    };

    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, [containerRef]);

  // Create grid cells
  const gridCells = useMemo(() => {
    const cells: GridCell[][] = [];
    for (let y = 0; y < gridSize.height; y++) {
      cells[y] = [];
      for (let x = 0; x < gridSize.width; x++) {
        cells[y][x] = { x, y, occupied: false };
      }
    }

    // Mark occupied cells
    layout.forEach(widget => {
      if (widget.visible) {
        for (let dy = 0; dy < widget.size.h; dy++) {
          for (let dx = 0; dx < widget.size.w; dx++) {
            const cellX = widget.position.x + dx;
            const cellY = widget.position.y + dy;
            if (cellX < gridSize.width && cellY < gridSize.height) {
              cells[cellY][cellX] = {
                x: cellX,
                y: cellY,
                occupied: true,
                widgetId: widget.widgetId,
              };
            }
          }
        }
      }
    });

    return cells;
  }, [layout, gridSize]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent, widgetId: string) => {
    if (!editable) return;
    
    setDraggedWidget(widgetId);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef?.getBoundingClientRect();
    
    if (containerRect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', widgetId);
  }, [editable, containerRef]);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedWidget || !containerRef) return;
    
    const containerRect = containerRef.getBoundingClientRect();
    const x = Math.floor((e.clientX - containerRect.left) / 216); // 200px + 16px gap
    const y = Math.floor((e.clientY - containerRect.top) / 166); // 150px + 16px gap
    
    const widget = layout.find(w => w.widgetId === draggedWidget);
    if (widget) {
      const newPosition = {
        x: Math.max(0, Math.min(x, gridSize.width - widget.size.w)),
        y: Math.max(0, Math.min(y, gridSize.height - widget.size.h)),
      };
      
      const newLayout = layout.map(w => 
        w.widgetId === draggedWidget 
          ? { ...w, position: newPosition }
          : w
      );
      
      updateLayout(newLayout);
      onWidgetDrop?.(draggedWidget, newPosition);
    }
    
    setDraggedWidget(null);
  }, [draggedWidget, containerRef, layout, gridSize, updateLayout, onWidgetDrop]);

  // Toggle widget visibility
  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    const newLayout = layout.map(widget =>
      widget.widgetId === widgetId
        ? { ...widget, visible: !widget.visible }
        : widget
    );
    updateLayout(newLayout);
  }, [layout, updateLayout]);

  // Toggle widget lock
  const toggleWidgetLock = useCallback((widgetId: string) => {
    const newLayout = layout.map(widget =>
      widget.widgetId === widgetId
        ? { ...widget, locked: !widget.locked }
        : widget
    );
    updateLayout(newLayout);
  }, [layout, updateLayout]);

  // Resize widget
  const resizeWidget = useCallback((widgetId: string, newSize: { w: number; h: number }) => {
    const newLayout = layout.map(widget =>
      widget.widgetId === widgetId
        ? { ...widget, size: newSize }
        : widget
    );
    updateLayout(newLayout);
  }, [layout, updateLayout]);

  // Render grid cells
  const renderGridCell = (cell: GridCell) => {
    const isDropTarget = draggedWidget && !cell.occupied;
    
    return (
      <div
        key={`${cell.x}-${cell.y}`}
        className={cn(
          'absolute border border-dashed border-gray-200 rounded transition-all',
          isDropTarget && 'border-blue-400 bg-blue-50',
          cell.occupied && 'border-transparent'
        )}
        style={{
          left: cell.x * 216,
          top: cell.y * 166,
          width: 200,
          height: 150,
        }}
      />
    );
  };

  // Render widget
  const renderWidget = (widget: WidgetLayout) => {
    const widgetDefinition = registry.get(widget.widgetId);
    if (!widgetDefinition || !widget.visible) return null;

    const style = {
      left: widget.position.x * 216,
      top: widget.position.y * 166,
      width: widget.size.w * 200 + (widget.size.w - 1) * 16,
      height: widget.size.h * 150 + (widget.size.h - 1) * 16,
    };

    return (
      <div
        key={widget.widgetId}
        className={cn(
          'absolute transition-all duration-200',
          editable && 'cursor-move',
          widget.locked && 'opacity-75'
        )}
        style={style}
        draggable={editable && !widget.locked}
        onDragStart={(e) => handleDragStart(e, widget.widgetId)}
        onClick={() => onWidgetClick?.(widget.widgetId)}
      >
        <DashboardWidget
          widgetId={widget.widgetId}
          variant={widgetDefinition.size === 'small' ? 'metric' : 'chart'}
          showActions={editable}
          onRemove={() => toggleWidgetVisibility(widget.widgetId)}
        >
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{widgetDefinition.title}</h3>
                {editable && (
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWidgetLock(widget.widgetId);
                      }}
                    >
                      {widget.locked ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        <Unlock className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWidgetVisibility(widget.widgetId);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {widgetDefinition.description || 'Widget content goes here'}
              </div>
              {editable && (
                <div className="flex items-center space-x-2 text-xs">
                  <Badge variant="outline">
                    {widget.size.w}×{widget.size.h}
                  </Badge>
                  {widget.locked && (
                    <Badge variant="secondary">Locked</Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </DashboardWidget>
      </div>
    );
  };

  return (
    <div
      ref={setContainerRef}
      className={cn(
        'relative w-full h-full overflow-auto bg-gray-50 p-4',
        className
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Grid overlay */}
      <div className="absolute inset-4 pointer-events-none">
        {gridCells.flat().map(cell => renderGridCell(cell))}
      </div>

      {/* Widgets */}
      {layout.map(widget => renderWidget(widget))}

      {/* Add widget button */}
      {editable && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 z-10"
          onClick={() => {
            // TODO: Open widget library
            console.log('Open widget library');
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      )}

      {/* Grid controls */}
      {editable && (
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2">
          <Button variant="ghost" size="sm">
            <Layout className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <div className="text-xs text-muted-foreground">
            Grid: {gridSize.width}×{gridSize.height}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardGrid;
