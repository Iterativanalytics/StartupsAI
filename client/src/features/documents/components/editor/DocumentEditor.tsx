import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BaseDocument, DocumentType, DocumentContent } from '../../types/document.types';
import { DocumentEngine } from '../../core/DocumentEngine';
import { AIDocumentService } from '../../ai/AIDocumentService';
import { CollaborationEngine } from '../../collaboration/CollaborationEngine';
import { DocumentEditorProps } from '../../types/document.types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, 
  Undo, 
  Redo, 
  Eye, 
  EyeOff, 
  Users, 
  MessageSquare, 
  Brain, 
  Wand2, 
  Settings, 
  Download, 
  Upload, 
  Share2, 
  Lock, 
  Unlock,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Image,
  Video,
  BarChart3,
  Presentation,
  Bot,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

/**
 * Universal Document Editor
 * 
 * This component provides a unified editing experience for all document types:
 * - Business plans
 * - Proposals (RFP/RFI/RFQ)
 * - Pitch decks
 * - And more
 */
export default function DocumentEditor({
  document,
  onSave,
  onCancel,
  readOnly = false,
  showAI = true,
  showCollaboration = true
}: DocumentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [documentContent, setDocumentContent] = useState<DocumentContent>(document.content);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [aiScore, setAiScore] = useState(0);
  const [completionScore, setCompletionScore] = useState(0);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize services
  const documentEngine = new DocumentEngine();
  const aiService = new AIDocumentService({
    enabled: true,
    autoAnalyze: true,
    autoSuggest: true,
    qualityThreshold: 70,
    analysisDepth: 'comprehensive',
    model: 'gpt-4',
    parameters: {
      temperature: 0.7,
      maxTokens: 2000,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1
    },
    rateLimit: 100,
    costLimit: 100
  });

  // Load document data
  useEffect(() => {
    loadDocumentData();
  }, [document.id]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && !readOnly) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasUnsavedChanges, readOnly]);

  const loadDocumentData = async () => {
    try {
      // Load AI insights
      if (showAI && document.ai.analyzed) {
        setAiInsights(document.ai.insights);
        setAiSuggestions(document.ai.suggestions);
        setAiScore(document.ai.overallScore);
        setCompletionScore(document.ai.completenessScore);
      }

      // Load collaborators
      if (showCollaboration) {
        setCollaborators(document.collaboration.activeUsers);
        setComments(document.collaboration.comments);
      }

    } catch (error) {
      console.error('Failed to load document data:', error);
    }
  };

  const handleSave = async () => {
    if (readOnly) return;

    setIsSaving(true);
    try {
      const updatedDocument = {
        ...document,
        content: documentContent,
        updatedAt: new Date(),
        lastModifiedBy: document.createdBy // Would get from auth context
      };

      await onSave(updatedDocument);
      setHasUnsavedChanges(false);
      
      toast({
        title: "Document saved",
        description: "Your changes have been saved successfully."
      });

    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoSave = async () => {
    if (readOnly || !hasUnsavedChanges) return;

    try {
      const updatedDocument = {
        ...document,
        content: documentContent,
        updatedAt: new Date(),
        lastModifiedBy: document.createdBy
      };

      await onSave(updatedDocument);
      setHasUnsavedChanges(false);

    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!showAI) return;

    setIsAnalyzing(true);
    try {
      const analysis = await aiService.analyzeDocument(document);
      
      setAiInsights(analysis.insights);
      setAiSuggestions(analysis.suggestions);
      setAiScore(analysis.overallScore);
      setCompletionScore(analysis.completenessScore);

      toast({
        title: "Analysis complete",
        description: `Document scored ${analysis.overallScore}% overall.`
      });

    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateContent = async (sectionId: string, prompt: string) => {
    if (!showAI) return;

    setIsGenerating(true);
    try {
      const result = await aiService.generateContent(document, prompt, {
        sectionId,
        context: {
          document,
          sectionId,
          user: {} // Would get from auth context
        }
      });

      // Update document content with generated content
      const updatedContent = { ...documentContent };
      // Apply generated content to specific section
      setDocumentContent(updatedContent);
      setHasUnsavedChanges(true);

      toast({
        title: "Content generated",
        description: "AI-generated content has been added to your document."
      });

    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContentChange = (newContent: DocumentContent) => {
    setDocumentContent(newContent);
    setHasUnsavedChanges(true);
  };

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case 'business-plan':
        return FileText;
      case 'proposal':
        return DocumentText;
      case 'pitch-deck':
        return Presentation;
      case 'application':
        return FileSpreadsheet;
      case 'contract':
        return FileText;
      case 'report':
        return BarChart3;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const DocumentIcon = getDocumentIcon(document.type);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <DocumentIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {document.title}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColor(document.metadata.status)}>
                    {document.metadata.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {document.metadata.wordCount} words
                  </span>
                  {document.version.locked && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      <Lock className="h-3 w-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* AI Score */}
              {showAI && aiScore > 0 && (
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    AI Score: {aiScore}%
                  </span>
                </div>
              )}

              {/* Completion Score */}
              {completionScore > 0 && (
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {completionScore}% Complete
                  </span>
                </div>
              )}

              {/* Collaborators */}
              {showCollaboration && collaborators.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">
                    {collaborators.length} active
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {!readOnly && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Brain className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Analyze
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving || !hasUnsavedChanges}
                    >
                      {isSaving ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Editor Tabs */}
          <div className="flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                {showAI && <TabsTrigger value="ai">AI Insights</TabsTrigger>}
                {showCollaboration && <TabsTrigger value="collaboration">Collaboration</TabsTrigger>}
              </TabsList>

              <TabsContent value="content" className="flex-1">
                <div className="h-full p-6">
                  <ScrollArea className="h-full">
                    <div className="max-w-4xl mx-auto">
                      {/* Document Content Editor */}
                      <DocumentContentEditor
                        document={document}
                        content={documentContent}
                        onChange={handleContentChange}
                        readOnly={readOnly}
                        showAI={showAI}
                        onGenerateContent={handleGenerateContent}
                        isGenerating={isGenerating}
                      />
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="structure" className="flex-1">
                <div className="h-full p-6">
                  <ScrollArea className="h-full">
                    <div className="max-w-4xl mx-auto">
                      {/* Document Structure Editor */}
                      <DocumentStructureEditor
                        document={document}
                        content={documentContent}
                        onChange={handleContentChange}
                        readOnly={readOnly}
                      />
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {showAI && (
                <TabsContent value="ai" className="flex-1">
                  <div className="h-full p-6">
                    <ScrollArea className="h-full">
                      <div className="max-w-4xl mx-auto">
                        {/* AI Insights Panel */}
                        <AIInsightsPanel
                          insights={aiInsights}
                          suggestions={aiSuggestions}
                          score={aiScore}
                          onApplySuggestion={(suggestion) => {
                            // Apply suggestion logic
                            console.log('Applying suggestion:', suggestion);
                          }}
                        />
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              )}

              {showCollaboration && (
                <TabsContent value="collaboration" className="flex-1">
                  <div className="h-full p-6">
                    <ScrollArea className="h-full">
                      <div className="max-w-4xl mx-auto">
                        {/* Collaboration Panel */}
                        <CollaborationPanel
                          collaborators={collaborators}
                          comments={comments}
                          onAddComment={(comment) => {
                            // Add comment logic
                            console.log('Adding comment:', comment);
                          }}
                        />
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// Document Content Editor Component
function DocumentContentEditor({
  document,
  content,
  onChange,
  readOnly,
  showAI,
  onGenerateContent,
  isGenerating
}: {
  document: BaseDocument;
  content: DocumentContent;
  onChange: (content: DocumentContent) => void;
  readOnly: boolean;
  showAI: boolean;
  onGenerateContent: (sectionId: string, prompt: string) => void;
  isGenerating: boolean;
}) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSectionChange = (sectionId: string, newContent: string) => {
    const updatedContent = { ...content };
    if (updatedContent.data.sections) {
      const sectionIndex = updatedContent.data.sections.findIndex(s => s.id === sectionId);
      if (sectionIndex !== -1) {
        updatedContent.data.sections[sectionIndex].content = newContent;
        updatedContent.data.sections[sectionIndex].lastModified = new Date();
        onChange(updatedContent);
      }
    }
  };

  return (
    <div className="space-y-6">
      {content.data.sections?.map((section, index) => (
        <Card key={section.id} className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <div className="flex items-center space-x-2">
                {section.aiGenerated && (
                  <Badge variant="outline" className="text-purple-600 border-purple-200">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                )}
                {section.required && (
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    Required
                  </Badge>
                )}
                {section.completed && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Section Content */}
              <div className="min-h-[200px] p-4 border border-gray-200 rounded-lg">
                <textarea
                  value={section.content}
                  onChange={(e) => handleSectionChange(section.id, e.target.value)}
                  placeholder={`Enter content for ${section.title}...`}
                  className="w-full h-full min-h-[150px] border-none resize-none focus:outline-none"
                  readOnly={readOnly}
                />
              </div>

              {/* AI Generation */}
              {showAI && !readOnly && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onGenerateContent(section.id, `Generate content for ${section.title}`)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Section Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{section.wordCount || 0} words</span>
                <span>Last modified: {section.lastModified?.toLocaleDateString()}</span>
                {section.aiScore && (
                  <span>AI Score: {section.aiScore}%</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Document Structure Editor Component
function DocumentStructureEditor({
  document,
  content,
  onChange,
  readOnly
}: {
  document: BaseDocument;
  content: DocumentContent;
  onChange: (content: DocumentContent) => void;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Document Structure</CardTitle>
          <CardDescription>
            Manage the structure and organization of your document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {content.data.sections?.map((section, index) => (
              <div key={section.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">
                    {index + 1}.
                  </span>
                  <span className="font-medium">{section.title}</span>
                  {section.required && (
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      Required
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {section.completed && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <span className="text-sm text-gray-500">
                    {section.wordCount || 0} words
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// AI Insights Panel Component
function AIInsightsPanel({
  insights,
  suggestions,
  score,
  onApplySuggestion
}: {
  insights: any[];
  suggestions: any[];
  score: number;
  onApplySuggestion: (suggestion: any) => void;
}) {
  return (
    <div className="space-y-6">
      {/* AI Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Score</span>
              <span className="text-2xl font-bold text-purple-600">{score}%</span>
            </div>
            <Progress value={score} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {insight.type === 'suggestion' && <Target className="h-4 w-4 text-blue-600" />}
                      {insight.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                      {insight.type === 'opportunity' && <TrendingUp className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.priority} priority
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {insight.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      <div className="mt-2">
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {suggestion.content}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApplySuggestion(suggestion)}
                      className="ml-4"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Collaboration Panel Component
function CollaborationPanel({
  collaborators,
  comments,
  onAddComment
}: {
  collaborators: any[];
  comments: any[];
  onAddComment: (comment: any) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Active Collaborators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Active Collaborators</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {collaborators.map((collaborator, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {collaborator.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{collaborator.name}</p>
                  <p className="text-xs text-gray-500">{collaborator.email}</p>
                </div>
                <div className="ml-auto">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Online
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            <span>Comments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {comment.author.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">
                        {comment.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {comment.replies.map((reply, replyIndex) => (
                          <div key={replyIndex} className="pl-4 border-l-2 border-gray-100">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-900">{reply.author}</span>
                              <span className="text-xs text-gray-500">
                                {reply.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 mt-1">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
