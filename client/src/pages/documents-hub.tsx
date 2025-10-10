import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Download, 
  Share2, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  Tag, 
  Users, 
  MessageSquare, 
  Zap, 
  Brain, 
  Sparkles, 
  Target, 
  TrendingUp, 
  BarChart3, 
  FileSpreadsheet, 
  Presentation, 
  Image, 
  Video, 
  Archive, 
  Bookmark, 
  Calendar, 
  Globe, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Settings, 
  Bot, 
  Wand2, 
  Copy, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen
} from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import RFPAutomation from '@/components/documents/RFPAutomation';
import RFIAutomation from '@/components/documents/RFIAutomation';
import RFQAutomation from '@/components/documents/RFQAutomation';
import DocumentIntelligence from '@/components/documents/DocumentIntelligence';
import CollaborationWorkflow from '@/components/documents/CollaborationWorkflow';

// Types
interface Document {
  id: string;
  name: string;
  type: 'business-plan' | 'proposal' | 'pitch-deck' | 'application' | 'contract' | 'report' | 'other';
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  category: string;
  tags: string[];
  size: number;
  lastModified: string;
  createdBy: string;
  collaborators: string[];
  version: string;
  isPublic: boolean;
  isTemplate: boolean;
  aiGenerated: boolean;
  completionScore: number;
  insights: DocumentInsight[];
  metadata: DocumentMetadata;
}

interface DocumentInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'achievement' | 'opportunity';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  aiGenerated: boolean;
}

interface DocumentMetadata {
  wordCount: number;
  pageCount: number;
  readingTime: number;
  complexity: 'low' | 'medium' | 'high';
  language: string;
  lastAnalyzed: string;
  aiScore: number;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  fields: TemplateField[];
  aiEnabled: boolean;
  popularity: number;
  rating: number;
}

interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'file';
  required: boolean;
  placeholder: string;
  options?: string[];
  aiSuggestion?: string;
}

interface DocumentWorkflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  isActive: boolean;
  participants: string[];
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'review' | 'approval' | 'signature' | 'notification';
  assignee: string;
  dueDate: string;
  completed: boolean;
  comments: string[];
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Q4 Business Plan 2024',
    type: 'business-plan',
    status: 'review',
    category: 'Strategic Planning',
    tags: ['Q4', 'Growth', 'Strategy'],
    size: 2048576,
    lastModified: '2024-01-15',
    createdBy: 'John Doe',
    collaborators: ['Jane Smith', 'Mike Johnson'],
    version: '2.1',
    isPublic: false,
    isTemplate: false,
    aiGenerated: true,
    completionScore: 85,
    insights: [
      {
        id: '1',
        type: 'suggestion',
        title: 'Market Analysis Enhancement',
        description: 'Consider adding more detailed competitor analysis',
        priority: 'medium',
        actionable: true,
        aiGenerated: true
      }
    ],
    metadata: {
      wordCount: 15420,
      pageCount: 45,
      readingTime: 32,
      complexity: 'high',
      language: 'en',
      lastAnalyzed: '2024-01-15',
      aiScore: 87
    }
  },
  {
    id: '2',
    name: 'Series A Pitch Deck',
    type: 'pitch-deck',
    status: 'approved',
    category: 'Fundraising',
    tags: ['Series A', 'Investors', 'Presentation'],
    size: 1536000,
    lastModified: '2024-01-10',
    createdBy: 'Sarah Wilson',
    collaborators: ['Alex Chen'],
    version: '3.0',
    isPublic: true,
    isTemplate: false,
    aiGenerated: false,
    completionScore: 95,
    insights: [],
    metadata: {
      wordCount: 3200,
      pageCount: 18,
      readingTime: 8,
      complexity: 'medium',
      language: 'en',
      lastAnalyzed: '2024-01-10',
      aiScore: 92
    }
  }
];

const mockTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Business Plan Template',
    description: 'Comprehensive business plan with AI-powered sections',
    category: 'Strategic Planning',
    type: 'business-plan',
    fields: [
      { id: '1', name: 'Executive Summary', type: 'textarea', required: true, placeholder: 'Brief overview of your business' },
      { id: '2', name: 'Market Analysis', type: 'textarea', required: true, placeholder: 'Describe your target market' }
    ],
    aiEnabled: true,
    popularity: 95,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Grant Proposal Template',
    description: 'AI-optimized grant proposal with compliance checking',
    category: 'Funding',
    type: 'proposal',
    fields: [
      { id: '1', name: 'Project Title', type: 'text', required: true, placeholder: 'Enter project title' },
      { id: '2', name: 'Budget Request', type: 'number', required: true, placeholder: 'Amount requested' }
    ],
    aiEnabled: true,
    popularity: 88,
    rating: 4.6
  }
];

const mockWorkflows: DocumentWorkflow[] = [
  {
    id: '1',
    name: 'Business Plan Review Process',
    steps: [
      { id: '1', name: 'Initial Review', type: 'review', assignee: 'Jane Smith', dueDate: '2024-01-20', completed: true, comments: ['Great start!'] },
      { id: '2', name: 'Financial Review', type: 'review', assignee: 'Mike Johnson', dueDate: '2024-01-22', completed: false, comments: [] },
      { id: '3', name: 'Final Approval', type: 'approval', assignee: 'Sarah Wilson', dueDate: '2024-01-25', completed: false, comments: [] }
    ],
    isActive: true,
    participants: ['Jane Smith', 'Mike Johnson', 'Sarah Wilson']
  }
];

export default function DocumentsHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('lastModified');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false);
  
  const { toast } = useToast();

  // Document queries
  const { data: documents = mockDocuments, isLoading: documentsLoading } = useQuery({
    queryKey: ['documents', searchQuery, selectedCategory, selectedStatus, sortBy],
    queryFn: () => apiRequest('/api/documents', {
      search: searchQuery,
      category: selectedCategory,
      status: selectedStatus,
      sort: sortBy
    })
  });

  const { data: templates = mockTemplates } = useQuery({
    queryKey: ['document-templates'],
    queryFn: () => apiRequest('/api/document-templates')
  });

  const { data: workflows = mockWorkflows } = useQuery({
    queryKey: ['document-workflows'],
    queryFn: () => apiRequest('/api/document-workflows')
  });

  // Document mutations
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: string) => apiRequest(`/api/documents/${documentId}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: 'Document deleted successfully' });
    }
  });

  const archiveDocumentMutation = useMutation({
    mutationFn: (documentId: string) => apiRequest(`/api/documents/${documentId}/archive`, { method: 'POST' }),
    onSuccess: () => {
      toast({ title: 'Document archived successfully' });
    }
  });

  // File upload handling
  const onDrop = (acceptedFiles: File[]) => {
    // Handle file uploads
    toast({ title: 'Files uploaded successfully' });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    multiple: true
  });

  // Filter and sort documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'business-plan': return FileText;
      case 'proposal': return FileText;
      case 'pitch-deck': return Presentation;
      case 'application': return FileSpreadsheet;
      case 'contract': return FileText;
      case 'report': return BarChart3;
      default: return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Document Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            AI-powered document management, collaboration, and automation
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => setIsTemplateDialogOpen(true)} variant="outline" size="lg">
              <Wand2 className="h-4 w-4 mr-2" />
              AI Templates
            </Button>
            <Button onClick={() => setIsUploadDialogOpen(true)} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        <div className="mb-8">

          {/* AI Insights Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="ai-insights"
                checked={showAIInsights}
                onCheckedChange={setShowAIInsights}
              />
              <Label htmlFor="ai-insights" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Insights & Automation
              </Label>
            </div>
            {showAIInsights && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents, tags, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Strategic Planning">Strategic Planning</SelectItem>
                  <SelectItem value="Fundraising">Fundraising</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastModified">Last Modified</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        {showAIInsights && (
          <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Brain className="h-5 w-5" />
                AI Document Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Auto-completion</p>
                    <p className="text-sm text-gray-600">AI suggests content</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Smart Templates</p>
                    <p className="text-sm text-gray-600">Context-aware templates</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Quality Scoring</p>
                    <p className="text-sm text-gray-600">AI-powered document analysis</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Features Tabs */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="rfp-automation">RFP</TabsTrigger>
            <TabsTrigger value="rfi-automation">RFI</TabsTrigger>
            <TabsTrigger value="rfq-automation">RFQ</TabsTrigger>
            <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => {
            const TypeIcon = getTypeIcon(document.type);
            return (
              <Card key={document.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TypeIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{document.name}</CardTitle>
                        <p className="text-sm text-gray-600">{document.category}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/edit-plan/${document.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => archiveDocumentMutation.mutate(document.id)}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteDocumentMutation.mutate(document.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Status and Version */}
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(document.status)}>
                        {document.status}
                      </Badge>
                      <span className="text-sm text-gray-500">v{document.version}</span>
                    </div>

                    {/* AI Insights */}
                    {showAIInsights && document.insights.length > 0 && (
                      <div className="space-y-2">
                        {document.insights.slice(0, 2).map((insight) => (
                          <div key={insight.id} className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-yellow-800">{insight.title}</p>
                                <p className="text-xs text-yellow-700">{insight.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Completion Score */}
                    {showAIInsights && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">AI Score</span>
                          <span className="text-sm text-gray-600">{document.metadata.aiScore}%</span>
                        </div>
                        <Progress value={document.metadata.aiScore} className="h-2" />
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatFileSize(document.size)}</span>
                      <span>{document.metadata.pageCount} pages</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {document.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {document.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{document.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Collaborators */}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {document.collaborators.length} collaborator{document.collaborators.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Last Modified */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Modified {document.lastModified}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
            </div>
          </TabsContent>

          <TabsContent value="rfp-automation">
            <RFPAutomation />
          </TabsContent>

          <TabsContent value="rfi-automation">
            <RFIAutomation />
          </TabsContent>

          <TabsContent value="rfq-automation">
            <RFQAutomation />
          </TabsContent>

          <TabsContent value="intelligence">
            <DocumentIntelligence />
          </TabsContent>

          <TabsContent value="collaboration">
            <CollaborationWorkflow />
          </TabsContent>
        </Tabs>

        {/* Upload Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Documents</DialogTitle>
              <DialogDescription>
                Upload files or create new documents with AI assistance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-gray-600 mb-4">
                  or click to select files (PDF, DOC, DOCX, PPT, TXT)
                </p>
                <Button variant="outline">Choose Files</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Template Dialog */}
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>AI-Powered Document Templates</DialogTitle>
              <DialogDescription>
                Choose from intelligent templates that adapt to your needs
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.aiEnabled && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Brain className="h-3 w-3 mr-1" />
                          AI Enhanced
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Popularity: {template.popularity}%</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{template.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
