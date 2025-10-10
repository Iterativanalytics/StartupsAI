import React, { useState, useEffect, useCallback } from 'react';
import { BaseDocument } from '../types/document.types';

/**
 * Mobile Responsive UI - Advanced mobile-responsive interface with focus mode
 * 
 * This component provides:
 * - Mobile-responsive design with adaptive layouts
 * - Focus mode for distraction-free editing
 * - Customizable views and themes
 * - Touch-optimized interactions
 * - Progressive web app features
 */
interface MobileResponsiveUIProps {
  document: BaseDocument;
  onDocumentUpdate?: (document: BaseDocument) => void;
  onViewChange?: (view: ViewMode) => void;
  onThemeChange?: (theme: Theme) => void;
  onFocusModeToggle?: (enabled: boolean) => void;
  initialView?: ViewMode;
  initialTheme?: Theme;
  enableFocusMode?: boolean;
  enableCustomization?: boolean;
}

export const MobileResponsiveUI: React.FC<MobileResponsiveUIProps> = ({
  document,
  onDocumentUpdate,
  onViewChange,
  onThemeChange,
  onFocusModeToggle,
  initialView = 'desktop',
  initialTheme = 'light',
  enableFocusMode = true,
  enableCustomization = true
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [focusMode, setFocusMode] = useState(false);
  const [customization, setCustomization] = useState<UICustomization>({
    fontSize: 'medium',
    lineHeight: 'normal',
    spacing: 'normal',
    colors: 'default'
  });
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // Detect mobile device and orientation
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768;
      const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      
      setIsMobile(mobile);
      setOrientation(newOrientation);
      
      // Auto-adjust view mode for mobile
      if (mobile && viewMode === 'desktop') {
        setViewMode('mobile');
        onViewChange?.('mobile');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, [viewMode, onViewChange]);

  // Handle view mode change
  const handleViewModeChange = useCallback((newView: ViewMode) => {
    setViewMode(newView);
    onViewChange?.(newView);
  }, [onViewChange]);

  // Handle theme change
  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    onThemeChange?.(newTheme);
  }, [onThemeChange]);

  // Handle focus mode toggle
  const handleFocusModeToggle = useCallback(() => {
    const newFocusMode = !focusMode;
    setFocusMode(newFocusMode);
    onFocusModeToggle?.(newFocusMode);
  }, [focusMode, onFocusModeToggle]);

  // Handle customization change
  const handleCustomizationChange = useCallback((newCustomization: Partial<UICustomization>) => {
    setCustomization(prev => ({ ...prev, ...newCustomization }));
  }, []);

  return (
    <div className={`mobile-responsive-ui ${viewMode} ${theme} ${focusMode ? 'focus-mode' : ''}`}>
      {/* Header */}
      <ResponsiveHeader
        document={document}
        viewMode={viewMode}
        theme={theme}
        focusMode={focusMode}
        onViewModeChange={handleViewModeChange}
        onThemeChange={handleThemeChange}
        onFocusModeToggle={handleFocusModeToggle}
        enableFocusMode={enableFocusMode}
        enableCustomization={enableCustomization}
      />

      {/* Main Content */}
      <div className="main-content">
        {focusMode ? (
          <FocusModeEditor
            document={document}
            customization={customization}
            onDocumentUpdate={onDocumentUpdate}
          />
        ) : (
          <ResponsiveEditor
            document={document}
            viewMode={viewMode}
            theme={theme}
            customization={customization}
            onDocumentUpdate={onDocumentUpdate}
            onCustomizationChange={handleCustomizationChange}
            enableCustomization={enableCustomization}
          />
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNavigation
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      )}

      {/* Customization Panel */}
      {enableCustomization && !focusMode && (
        <CustomizationPanel
          customization={customization}
          onCustomizationChange={handleCustomizationChange}
          theme={theme}
          onThemeChange={handleThemeChange}
        />
      )}
    </div>
  );
};

// Responsive Header Component
interface ResponsiveHeaderProps {
  document: BaseDocument;
  viewMode: ViewMode;
  theme: Theme;
  focusMode: boolean;
  onViewModeChange: (view: ViewMode) => void;
  onThemeChange: (theme: Theme) => void;
  onFocusModeToggle: () => void;
  enableFocusMode: boolean;
  enableCustomization: boolean;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  document,
  viewMode,
  theme,
  focusMode,
  onViewModeChange,
  onThemeChange,
  onFocusModeToggle,
  enableFocusMode,
  enableCustomization
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="responsive-header">
      <div className="header-content">
        {/* Document Title */}
        <div className="document-title">
          <h1>{document.title}</h1>
          <span className="document-type">{document.type}</span>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* View Mode Selector */}
          <ViewModeSelector
            currentView={viewMode}
            onViewChange={onViewModeChange}
          />

          {/* Theme Selector */}
          <ThemeSelector
            currentTheme={theme}
            onThemeChange={onThemeChange}
          />

          {/* Focus Mode Toggle */}
          {enableFocusMode && (
            <button
              className={`focus-mode-toggle ${focusMode ? 'active' : ''}`}
              onClick={onFocusModeToggle}
              title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
            >
              {focusMode ? '🔍' : '📝'}
            </button>
          )}

          {/* Mobile Menu */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <MobileMenu
          onClose={() => setIsMenuOpen(false)}
          onViewModeChange={onViewModeChange}
          onThemeChange={onThemeChange}
          onFocusModeToggle={onFocusModeToggle}
          enableFocusMode={enableFocusMode}
          enableCustomization={enableCustomization}
        />
      )}
    </header>
  );
};

// View Mode Selector Component
interface ViewModeSelectorProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  currentView,
  onViewChange
}) => {
  const viewModes: ViewMode[] = ['desktop', 'tablet', 'mobile'];

  return (
    <div className="view-mode-selector">
      <label>View:</label>
      <select
        value={currentView}
        onChange={(e) => onViewChange(e.target.value as ViewMode)}
      >
        {viewModes.map(view => (
          <option key={view} value={view}>
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

// Theme Selector Component
interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange
}) => {
  const themes: Theme[] = ['light', 'dark', 'auto'];

  return (
    <div className="theme-selector">
      <label>Theme:</label>
      <select
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value as Theme)}
      >
        {themes.map(theme => (
          <option key={theme} value={theme}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

// Mobile Menu Component
interface MobileMenuProps {
  onClose: () => void;
  onViewModeChange: (view: ViewMode) => void;
  onThemeChange: (theme: Theme) => void;
  onFocusModeToggle: () => void;
  enableFocusMode: boolean;
  enableCustomization: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  onClose,
  onViewModeChange,
  onThemeChange,
  onFocusModeToggle,
  enableFocusMode,
  enableCustomization
}) => {
  return (
    <div className="mobile-menu">
      <div className="mobile-menu-content">
        <button className="close-button" onClick={onClose}>✕</button>
        
        <div className="menu-section">
          <h3>View Mode</h3>
          <ViewModeSelector currentView="desktop" onViewChange={onViewModeChange} />
        </div>

        <div className="menu-section">
          <h3>Theme</h3>
          <ThemeSelector currentTheme="light" onThemeChange={onThemeChange} />
        </div>

        {enableFocusMode && (
          <div className="menu-section">
            <h3>Focus Mode</h3>
            <button onClick={onFocusModeToggle}>Toggle Focus Mode</button>
          </div>
        )}

        {enableCustomization && (
          <div className="menu-section">
            <h3>Customization</h3>
            <p>Customization options available</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Responsive Editor Component
interface ResponsiveEditorProps {
  document: BaseDocument;
  viewMode: ViewMode;
  theme: Theme;
  customization: UICustomization;
  onDocumentUpdate: (document: BaseDocument) => void;
  onCustomizationChange: (customization: Partial<UICustomization>) => void;
  enableCustomization: boolean;
}

const ResponsiveEditor: React.FC<ResponsiveEditorProps> = ({
  document,
  viewMode,
  theme,
  customization,
  onDocumentUpdate,
  onCustomizationChange,
  enableCustomization
}) => {
  return (
    <div className={`responsive-editor ${viewMode} ${theme}`}>
      {/* Editor Toolbar */}
      <EditorToolbar
        document={document}
        onDocumentUpdate={onDocumentUpdate}
        customization={customization}
        onCustomizationChange={onCustomizationChange}
        enableCustomization={enableCustomization}
      />

      {/* Editor Content */}
      <div className="editor-content" style={getCustomizationStyles(customization)}>
        <DocumentEditor
          document={document}
          onDocumentUpdate={onDocumentUpdate}
          viewMode={viewMode}
        />
      </div>

      {/* Sidebar */}
      {viewMode !== 'mobile' && (
        <EditorSidebar
          document={document}
          viewMode={viewMode}
        />
      )}
    </div>
  );
};

// Focus Mode Editor Component
interface FocusModeEditorProps {
  document: BaseDocument;
  customization: UICustomization;
  onDocumentUpdate: (document: BaseDocument) => void;
}

const FocusModeEditor: React.FC<FocusModeEditorProps> = ({
  document,
  customization,
  onDocumentUpdate
}) => {
  return (
    <div className="focus-mode-editor" style={getCustomizationStyles(customization)}>
      <div className="focus-mode-header">
        <h2>{document.title}</h2>
        <div className="focus-mode-stats">
          <span>Words: {getWordCount(document)}</span>
          <span>Characters: {getCharacterCount(document)}</span>
        </div>
      </div>

      <div className="focus-mode-content">
        <DocumentEditor
          document={document}
          onDocumentUpdate={onDocumentUpdate}
          viewMode="focus"
        />
      </div>
    </div>
  );
};

// Editor Toolbar Component
interface EditorToolbarProps {
  document: BaseDocument;
  onDocumentUpdate: (document: BaseDocument) => void;
  customization: UICustomization;
  onCustomizationChange: (customization: Partial<UICustomization>) => void;
  enableCustomization: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  document,
  onDocumentUpdate,
  customization,
  onCustomizationChange,
  enableCustomization
}) => {
  return (
    <div className="editor-toolbar">
      <div className="toolbar-section">
        <button>Bold</button>
        <button>Italic</button>
        <button>Underline</button>
      </div>

      <div className="toolbar-section">
        <button>Heading 1</button>
        <button>Heading 2</button>
        <button>Paragraph</button>
      </div>

      {enableCustomization && (
        <div className="toolbar-section">
          <CustomizationControls
            customization={customization}
            onCustomizationChange={onCustomizationChange}
          />
        </div>
      )}
    </div>
  );
};

// Customization Controls Component
interface CustomizationControlsProps {
  customization: UICustomization;
  onCustomizationChange: (customization: Partial<UICustomization>) => void;
}

const CustomizationControls: React.FC<CustomizationControlsProps> = ({
  customization,
  onCustomizationChange
}) => {
  return (
    <div className="customization-controls">
      <label>
        Font Size:
        <select
          value={customization.fontSize}
          onChange={(e) => onCustomizationChange({ fontSize: e.target.value as FontSize })}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </label>

      <label>
        Line Height:
        <select
          value={customization.lineHeight}
          onChange={(e) => onCustomizationChange({ lineHeight: e.target.value as LineHeight })}
        >
          <option value="tight">Tight</option>
          <option value="normal">Normal</option>
          <option value="loose">Loose</option>
        </select>
      </label>
    </div>
  );
};

// Document Editor Component
interface DocumentEditorProps {
  document: BaseDocument;
  onDocumentUpdate: (document: BaseDocument) => void;
  viewMode: ViewMode;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  onDocumentUpdate,
  viewMode
}) => {
  const handleContentChange = (content: any) => {
    onDocumentUpdate({
      ...document,
      content,
      updatedAt: new Date()
    });
  };

  return (
    <div className="document-editor">
      <textarea
        value={document.content.data?.content || ''}
        onChange={(e) => handleContentChange({ data: { content: e.target.value } })}
        className={`editor-textarea ${viewMode}`}
        placeholder="Start writing..."
      />
    </div>
  );
};

// Editor Sidebar Component
interface EditorSidebarProps {
  document: BaseDocument;
  viewMode: ViewMode;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  document,
  viewMode
}) => {
  return (
    <div className="editor-sidebar">
      <div className="sidebar-section">
        <h3>Document Info</h3>
        <p>Type: {document.type}</p>
        <p>Status: {document.metadata.status}</p>
        <p>Created: {new Date(document.createdAt).toLocaleDateString()}</p>
        <p>Updated: {new Date(document.updatedAt).toLocaleDateString()}</p>
      </div>

      <div className="sidebar-section">
        <h3>Collaboration</h3>
        <p>Active Users: {document.collaboration.activeUsers.length}</p>
        <p>Comments: {document.collaboration.comments.length}</p>
        <p>Suggestions: {document.collaboration.suggestions.length}</p>
      </div>
    </div>
  );
};

// Mobile Navigation Component
interface MobileNavigationProps {
  viewMode: ViewMode;
  onViewModeChange: (view: ViewMode) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="mobile-navigation">
      <button>📝 Edit</button>
      <button>💬 Comments</button>
      <button>👥 Share</button>
      <button>⚙️ Settings</button>
    </div>
  );
};

// Customization Panel Component
interface CustomizationPanelProps {
  customization: UICustomization;
  onCustomizationChange: (customization: Partial<UICustomization>) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customization,
  onCustomizationChange,
  theme,
  onThemeChange
}) => {
  return (
    <div className="customization-panel">
      <h3>Customization</h3>
      
      <div className="customization-group">
        <label>Font Size</label>
        <select
          value={customization.fontSize}
          onChange={(e) => onCustomizationChange({ fontSize: e.target.value as FontSize })}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="customization-group">
        <label>Line Height</label>
        <select
          value={customization.lineHeight}
          onChange={(e) => onCustomizationChange({ lineHeight: e.target.value as LineHeight })}
        >
          <option value="tight">Tight</option>
          <option value="normal">Normal</option>
          <option value="loose">Loose</option>
        </select>
      </div>

      <div className="customization-group">
        <label>Spacing</label>
        <select
          value={customization.spacing}
          onChange={(e) => onCustomizationChange({ spacing: e.target.value as Spacing })}
        >
          <option value="compact">Compact</option>
          <option value="normal">Normal</option>
          <option value="spacious">Spacious</option>
        </select>
      </div>

      <div className="customization-group">
        <label>Colors</label>
        <select
          value={customization.colors}
          onChange={(e) => onCustomizationChange({ colors: e.target.value as ColorScheme })}
        >
          <option value="default">Default</option>
          <option value="high-contrast">High Contrast</option>
          <option value="sepia">Sepia</option>
        </select>
      </div>
    </div>
  );
};

// Helper functions
const getCustomizationStyles = (customization: UICustomization): React.CSSProperties => {
  return {
    fontSize: customization.fontSize === 'small' ? '14px' : 
              customization.fontSize === 'large' ? '18px' : '16px',
    lineHeight: customization.lineHeight === 'tight' ? '1.2' :
                customization.lineHeight === 'loose' ? '1.8' : '1.5',
    padding: customization.spacing === 'compact' ? '8px' :
             customization.spacing === 'spacious' ? '24px' : '16px'
  };
};

const getWordCount = (document: BaseDocument): number => {
  const content = document.content.data?.content || '';
  return content.split(/\s+/).filter(word => word.length > 0).length;
};

const getCharacterCount = (document: BaseDocument): number => {
  const content = document.content.data?.content || '';
  return content.length;
};

// Type definitions
type ViewMode = 'desktop' | 'tablet' | 'mobile' | 'focus';
type Theme = 'light' | 'dark' | 'auto';
type FontSize = 'small' | 'medium' | 'large';
type LineHeight = 'tight' | 'normal' | 'loose';
type Spacing = 'compact' | 'normal' | 'spacious';
type ColorScheme = 'default' | 'high-contrast' | 'sepia';

interface UICustomization {
  fontSize: FontSize;
  lineHeight: LineHeight;
  spacing: Spacing;
  colors: ColorScheme;
}

export default MobileResponsiveUI;
