import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Image, 
  Download, 
  Share2, 
  Edit, 
  Wand2, 
  Sparkles,
  Palette,
  Layout,
  Eye,
  RefreshCw,
  Settings,
  Lightbulb,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Save,
  Upload
} from 'lucide-react';
import { InfographicDocument, InfographicData, InfographicTemplate } from '../../types/infographic/InfographicDocument';
import { DocumentEditorProps } from '../../types/document.types';

interface InfographicDocumentEditorProps extends DocumentEditorProps {
  document: InfographicDocument;
}

export const InfographicDocumentEditor: React.FC<InfographicDocumentEditorProps> = ({
  document,
  onSave,
  onCancel,
  readOnly = false,
  showAI = true,
  showCollaboration = true
}) => {
  const [infographic, setInfographic] = useState<InfographicData>(document.content.data.infographic);
  const [customization, setCustomization] = useState(document.content.data.customizations || {
    theme: 'corporate',
    layout: 'vertical',
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    showLegend: true,
    showGrid: true,
    showTooltips: true,
    enableAnimations: true,
    title: '',
    subtitle: '',
    footer: ''
  });
  const [templates, setTemplates] = useState<InfographicTemplate[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{ step: string; progress: number; message: string } | null>(null);
  const [enhancementSuggestions, setEnhancementSuggestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('design');

  useEffect(() => {
    loadTemplates();
    if (showAI) {
      loadEnhancementSuggestions();
    }
  }, [showAI]);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/documents/infographic/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadEnhancementSuggestions = async () => {
    try {
      const response = await fetch('/api/documents/infographic/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ infographic })
      });
      const data = await response.json();
      setEnhancementSuggestions(data);
    } catch (error) {
      console.error('Failed to load enhancement suggestions:', error);
    }
  };

  const simulateGenerationProgress = () => {
    const steps = [
      { step: 'analyzing', progress: 20, message: 'Analyzing your prompt and data...' },
      { step: 'designing', progress: 40, message: 'Designing the optimal visualization...' },
      { step: 'processing', progress: 60, message: 'Processing data and generating insights...' },
      { step: 'optimizing', progress: 80, message: 'Optimizing layout and visual elements...' },
      { step: 'finalizing', progress: 100, message: 'Finalizing your infographic...' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setGenerationProgress(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        setGenerationProgress(null);
      }
    }, 800);

    return interval;
  };

  const generateInfographic = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    const progressInterval = simulateGenerationProgress();

    try {
      const response = await fetch('/api/documents/infographic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          template: customization.theme,
          customization,
          data: infographic.data,
          documentId: document.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate infographic');
      }

      const data = await response.json();
      setInfographic(data);
      
      // Update document content
      const updatedDocument = {
        ...document,
        content: {
          ...document.content,
          data: {
            ...document.content.data,
            infographic: data
          }
        }
      };
      
      onSave(updatedDocument);

    } catch (error) {
      console.error('Failed to generate infographic:', error);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  const enhanceInfographic = async (enhancements: string[]) => {
    if (!infographic) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/documents/infographic/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          infographic,
          enhancements,
          documentId: document.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to enhance infographic');
      }

      const data = await response.json();
      setInfographic(data);
      
      // Update document content
      const updatedDocument = {
        ...document,
        content: {
          ...document.content,
          data: {
            ...document.content.data,
            infographic: data
          }
        }
      };
      
      onSave(updatedDocument);

    } catch (error) {
      console.error('Failed to enhance infographic:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportInfographic = async (format: 'png' | 'svg' | 'pdf') => {
    try {
      const response = await fetch('/api/documents/infographic/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          infographic,
          format,
          documentId: document.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to export infographic');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `infographic_${document.id}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Failed to export infographic:', error);
    }
  };

  const updateCustomization = (key: string, value: any) => {
    const newCustomization = { ...customization, [key]: value };
    setCustomization(newCustomization);
    
    // Update document content
    const updatedDocument = {
      ...document,
      content: {
        ...document.content,
        data: {
          ...document.content.data,
          customizations: newCustomization
        }
      }
    };
    
    onSave(updatedDocument);
  };

  const renderChart = () => {
    // This would render the actual chart using Recharts or similar
    // For now, return a placeholder
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Chart will be rendered here</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{document.title}</h1>
          <p className="text-gray-600">{document.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportInfographic('png')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => exportInfographic('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Generation Progress */}
      {generationProgress && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{generationProgress.message}</span>
                <span className="text-sm text-gray-500">{generationProgress.progress}%</span>
              </div>
              <Progress value={generationProgress.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Design Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>

                <TabsContent value="design" className="space-y-4">
                  <div>
                    <Label>Chart Type</Label>
                    <Select 
                      value={infographic.type} 
                      onValueChange={(value) => setInfographic({...infographic, type: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                        <SelectItem value="scatter">Scatter Plot</SelectItem>
                        <SelectItem value="radar">Radar Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Theme</Label>
                    <Select 
                      value={customization.theme} 
                      onValueChange={(value) => updateCustomization('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="vibrant">Vibrant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Display Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="legend" className="text-sm">Show Legend</Label>
                        <Switch
                          id="legend"
                          checked={customization.showLegend}
                          onCheckedChange={(checked) => updateCustomization('showLegend', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="grid" className="text-sm">Show Grid</Label>
                        <Switch
                          id="grid"
                          checked={customization.showGrid}
                          onCheckedChange={(checked) => updateCustomization('showGrid', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="animations" className="text-sm">Enable Animations</Label>
                        <Switch
                          id="animations"
                          checked={customization.enableAnimations}
                          onCheckedChange={(checked) => updateCustomization('enableAnimations', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="data" className="space-y-4">
                  <div>
                    <Label>Data Input</Label>
                    <Textarea
                      placeholder="Enter your data as JSON or describe what you want to visualize..."
                      className="min-h-[100px]"
                      onChange={(e) => {
                        try {
                          const data = JSON.parse(e.target.value);
                          setInfographic({...infographic, data});
                        } catch (error) {
                          // Handle text input for AI generation
                        }
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* AI Enhancement Suggestions */}
          {showAI && enhancementSuggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {enhancementSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{suggestion.description}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => enhanceInfographic([suggestion.description])}
                        >
                          Apply
                        </Button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {suggestion.impact} impact
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.effort} effort
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderChart()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
