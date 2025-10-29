import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Sparkles, 
  RefreshCw, 
  Lightbulb, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useIterativePlan } from '@/contexts/IterativePlanContext';
import { useBusinessPlanAI } from '@/hooks/useBusinessPlanAI';
import { getSectionById } from '@/constants/businessPlanStructure';
import { useToast } from '@/hooks/use-toast';

interface SectionEditorProps {
  chapterId: string;
  sectionId: string;
  onSave?: () => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  chapterId,
  sectionId,
  onSave
}) => {
  const { toast } = useToast();
  const { 
    getSectionContent, 
    updateSectionContent, 
    getSectionStatus,
    getSectionWordCount,
    save,
    isDirty
  } = useIterativePlan();
  
  const {
    generateSectionContent,
    improveSectionContent,
    getSuggestions,
    analyzeContent,
    isGenerating
  } = useBusinessPlanAI();

  const section = getSectionById(chapterId, sectionId);
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);

  useEffect(() => {
    const initialContent = getSectionContent(sectionId);
    setContent(initialContent);
  }, [sectionId, getSectionContent]);

  useEffect(() => {
    if (content) {
      loadSuggestions();
    }
  }, [sectionId]);

  const loadSuggestions = async () => {
    try {
      const sectionSuggestions = await getSuggestions(sectionId);
      setSuggestions(sectionSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    updateSectionContent(sectionId, newContent);
  };

  const handleSave = async () => {
    try {
      await save();
      toast({
        title: 'Saved',
        description: 'Section content saved successfully',
      });
      onSave?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save section content',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateContent = async () => {
    try {
      const result = await generateSectionContent(chapterId, sectionId);
      setContent(result.content);
      toast({
        title: 'Content Generated',
        description: `AI generated ${result.wordCount} words with ${Math.round(result.confidence * 100)}% confidence`,
      });
      setSuggestions(result.suggestions);
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate content. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleImproveContent = async (type: 'clarity' | 'length' | 'tone' | 'detail') => {
    try {
      const improved = await improveSectionContent(sectionId, type);
      setContent(improved);
      toast({
        title: 'Content Improved',
        description: `Content has been improved for ${type}`,
      });
    } catch (error) {
      toast({
        title: 'Improvement Failed',
        description: 'Failed to improve content. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAnalyze = async () => {
    try {
      const result = await analyzeContent(sectionId);
      setAnalysis(result);
      setShowAIPanel(true);
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze content.',
        variant: 'destructive',
      });
    }
  };

  if (!section) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Section not found</p>
      </div>
    );
  }

  const wordCount = getSectionWordCount(sectionId);
  const status = getSectionStatus(sectionId);
  const progress = Math.min(100, Math.round((wordCount / section.estimatedWords) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
            <Badge variant={
              status === 'complete' ? 'default' : 
              status === 'in_progress' ? 'secondary' : 
              'outline'
            }>
              {status === 'complete' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
               status === 'in_progress' ? <RefreshCw className="w-3 h-3 mr-1" /> : 
               <AlertCircle className="w-3 h-3 mr-1" />}
              {status.replace('_', ' ')}
            </Badge>
          </div>
          {section.description && (
            <p className="text-gray-600">{section.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnalyze}
            disabled={!content || isGenerating}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analyze
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateContent}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'AI Generate'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty}
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">
                {wordCount} / {section.estimatedWords} words ({progress}%)
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Prompt */}
          {section.aiPrompt && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">AI Writing Tip</p>
                    <p className="text-sm text-blue-700">{section.aiPrompt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Text Editor */}
          <Card>
            <CardContent className="pt-6">
              <Textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start writing your content here..."
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* AI Improvement Options */}
          {content && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI Improvements</CardTitle>
                <CardDescription>Enhance your content with AI assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImproveContent('clarity')}
                    disabled={isGenerating}
                  >
                    Improve Clarity
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImproveContent('length')}
                    disabled={isGenerating}
                  >
                    Expand Content
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImproveContent('tone')}
                    disabled={isGenerating}
                  >
                    Adjust Tone
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImproveContent('detail')}
                    disabled={isGenerating}
                  >
                    Add Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4" />
                Writing Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analysis && showAIPanel && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Content Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Score</span>
                    <span className="text-2xl font-bold text-green-600">{analysis.score}</span>
                  </div>
                  <Progress value={analysis.score} className="h-2" />
                </div>

                {analysis.strengths.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-green-700">Strengths</p>
                    <ul className="space-y-1">
                      {analysis.strengths.map((strength: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-1" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.improvements.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-orange-700">Improvements</p>
                    <ul className="space-y-1">
                      {analysis.improvements.map((improvement: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <AlertCircle className="w-3 h-3 text-orange-500 mt-1" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
