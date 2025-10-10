import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bot, 
  Zap, 
  Target, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Sparkles, 
  Wand2, 
  Brain, 
  ArrowRight, 
  Copy, 
  Download, 
  Share2, 
  Eye, 
  Edit, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  DollarSign, 
  Award, 
  Star, 
  BarChart3, 
  MessageSquare, 
  RefreshCw, 
  Settings, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Folder,
  Globe,
  Lock,
  Unlock,
  FileSpreadsheet,
  Presentation,
  FileText,
  Building2,
  Shield,
  Lightbulb,
  Rocket,
  Target as TargetIcon
} from 'lucide-react';

interface RFIRequest {
  id: string;
  title: string;
  organization: string;
  description: string;
  deadline: string;
  category: 'technical' | 'commercial' | 'security' | 'compliance' | 'operational';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'submitted' | 'under-review' | 'responded' | 'closed';
  questions: RFIQuestion[];
  aiInsights: AIInsight[];
  matchScore: number;
  responseTime: string;
  complexity: 'low' | 'medium' | 'high';
  aiGenerated: boolean;
  lastUpdated: string;
}

interface RFIQuestion {
  id: string;
  question: string;
  category: string;
  type: 'text' | 'multiple-choice' | 'yes-no' | 'file-upload' | 'table';
  required: boolean;
  wordLimit?: number;
  options?: string[];
  aiSuggestion?: string;
  confidence?: number;
}

interface AIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'opportunity' | 'compliance';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  confidence: number;
  category: string;
}

interface RFIResponse {
  id: string;
  rfiId: string;
  title: string;
  status: 'draft' | 'review' | 'submitted' | 'approved';
  completionScore: number;
  responses: QuestionResponse[];
  aiGenerated: boolean;
  lastModified: string;
  collaborators: string[];
  qualityScore: number;
}

interface QuestionResponse {
  id: string;
  questionId: string;
  response: string;
  aiGenerated: boolean;
  qualityScore: number;
  wordCount: number;
  lastModified: string;
  suggestions: string[];
}

// Mock data
const mockRFIRequests: RFIRequest[] = [
  {
    id: '1',
    title: 'Cybersecurity Assessment RFI',
    organization: 'TechCorp Solutions',
    description: 'Comprehensive cybersecurity assessment and compliance evaluation',
    deadline: '2024-02-10',
    category: 'security',
    priority: 'high',
    status: 'open',
    questions: [
      {
        id: '1',
        question: 'Describe your cybersecurity framework and compliance certifications',
        category: 'Security',
        type: 'text',
        required: true,
        wordLimit: 500,
        aiSuggestion: 'Include SOC 2, ISO 27001, and any industry-specific certifications',
        confidence: 92
      },
      {
        id: '2',
        question: 'What is your incident response procedure?',
        category: 'Security',
        type: 'text',
        required: true,
        wordLimit: 300,
        aiSuggestion: 'Detail your 24/7 incident response team and escalation procedures',
        confidence: 88
      }
    ],
    aiInsights: [
      {
        id: '1',
        type: 'opportunity',
        title: 'High Match Score',
        description: 'Your security framework matches 94% of their requirements',
        priority: 'high',
        actionable: true,
        confidence: 95,
        category: 'Security'
      }
    ],
    matchScore: 94,
    responseTime: '5 days',
    complexity: 'high',
    aiGenerated: true,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Technical Capabilities RFI',
    organization: 'InnovateCorp',
    description: 'Technical capabilities and infrastructure assessment',
    deadline: '2024-01-25',
    category: 'technical',
    priority: 'medium',
    status: 'in-progress',
    questions: [
      {
        id: '3',
        question: 'Describe your cloud infrastructure and scalability',
        category: 'Technical',
        type: 'text',
        required: true,
        wordLimit: 400,
        aiSuggestion: 'Highlight AWS/Azure architecture, auto-scaling, and disaster recovery',
        confidence: 85
      }
    ],
    aiInsights: [
      {
        id: '2',
        type: 'suggestion',
        title: 'Emphasize Scalability',
        description: 'Focus on your ability to handle 10x traffic spikes',
        priority: 'medium',
        actionable: true,
        confidence: 87,
        category: 'Technical'
      }
    ],
    matchScore: 78,
    responseTime: '3 days',
    complexity: 'medium',
    aiGenerated: false,
    lastUpdated: '2024-01-12'
  }
];

const mockRFIResponses: RFIResponse[] = [
  {
    id: '1',
    rfiId: '1',
    title: 'Cybersecurity Assessment Response',
    status: 'draft',
    completionScore: 65,
    responses: [
      {
        id: '1',
        questionId: '1',
        response: 'Our organization maintains SOC 2 Type II certification and ISO 27001 compliance...',
        aiGenerated: true,
        qualityScore: 88,
        wordCount: 450,
        lastModified: '2024-01-15',
        suggestions: ['Add specific certification dates', 'Include audit results']
      }
    ],
    aiGenerated: true,
    lastModified: '2024-01-15',
    collaborators: ['John Doe', 'Jane Smith'],
    qualityScore: 85
  }
];

export default function RFIAutomation() {
  const [selectedTab, setSelectedTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [isCreateRFIDialogOpen, setIsCreateRFIDialogOpen] = useState(false);
  const [isAutoGenerateDialogOpen, setIsAutoGenerateDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-purple-100 text-purple-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return Shield;
      case 'technical': return Building2;
      case 'commercial': return DollarSign;
      case 'compliance': return CheckCircle;
      case 'operational': return Settings;
      default: return FileText;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = mockRFIRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || request.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            RFI Automation 📋
          </h2>
          <p className="text-gray-600">
            AI-powered Request for Information management and response generation
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAutoGenerateDialogOpen(true)} variant="outline">
            <Wand2 className="h-4 w-4 mr-2" />
            Auto-Generate Response
          </Button>
          <Button onClick={() => setIsCreateRFIDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create RFI
          </Button>
        </div>
      </div>

      {/* AI Insights Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="ai-insights"
            checked={showAIInsights}
            onChange={(e) => setShowAIInsights(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="ai-insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Show AI Insights
          </Label>
        </div>
        {showAIInsights && (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Enhanced
          </Badge>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search RFIs, organizations, or questions..."
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
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">RFI Requests</TabsTrigger>
          <TabsTrigger value="responses">My Responses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* RFI Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRequests.map((request) => {
              const CategoryIcon = getCategoryIcon(request.category);
              return (
                <Card key={request.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {request.organization}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        {request.aiGenerated && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            <Bot className="h-3 w-3 mr-1" />
                            AI Found
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{request.description}</p>
                    
                    {/* Key Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-4 w-4 text-gray-400" />
                        <span className="capitalize">{request.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Due: {request.deadline}</span>
                      </div>
                    </div>

                    {/* Match Score and Complexity */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Match Score</span>
                          <span className="text-sm text-gray-600">{request.matchScore}%</span>
                        </div>
                        <Progress value={request.matchScore} className="h-2" />
                      </div>
                      <div className="text-right">
                        <Badge className={getComplexityColor(request.complexity)}>
                          {request.complexity} complexity
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{request.responseTime} response time</p>
                      </div>
                    </div>

                    {/* AI Insights */}
                    {showAIInsights && request.aiInsights.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">AI Insights</h4>
                        {request.aiInsights.slice(0, 2).map((insight) => (
                          <div key={insight.id} className={`p-2 rounded-lg border ${
                            insight.type === 'opportunity' ? 'bg-green-50 border-green-200' :
                            insight.type === 'warning' ? 'bg-red-50 border-red-200' :
                            'bg-yellow-50 border-yellow-200'
                          }`}>
                            <div className="flex items-start gap-2">
                              {insight.type === 'opportunity' ? (
                                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                              ) : insight.type === 'warning' ? (
                                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                              ) : (
                                <TargetIcon className="h-4 w-4 text-yellow-600 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium">{insight.title}</p>
                                <p className="text-xs text-gray-600">{insight.description}</p>
                              </div>
                              <Badge className={getPriorityColor(insight.priority)}>
                                {insight.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Questions Preview */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Questions ({request.questions.length})</h4>
                      {request.questions.slice(0, 2).map((question) => (
                        <div key={question.id} className="p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium">{question.question}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {question.category}
                              </Badge>
                              {question.aiSuggestion && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                          </div>
                          {question.aiSuggestion && (
                            <p className="text-xs text-blue-600 mt-1">{question.aiSuggestion}</p>
                          )}
                        </div>
                      ))}
                      {request.questions.length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{request.questions.length - 2} more questions
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Zap className="h-4 w-4 mr-2" />
                        Auto-Respond
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* My Responses Tab */}
        <TabsContent value="responses" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {mockRFIResponses.map((response) => (
              <Card key={response.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{response.title}</CardTitle>
                      <CardDescription>
                        RFI: {mockRFIRequests.find(req => req.id === response.rfiId)?.title}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(response.status)}>
                        {response.status}
                      </Badge>
                      {response.aiGenerated && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          <Bot className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Completion Score */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Completion Score</span>
                      <span className="text-sm text-gray-600">{response.completionScore}%</span>
                    </div>
                    <Progress value={response.completionScore} className="h-2" />
                  </div>

                  {/* Quality Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quality Score</span>
                    <span className="text-sm text-gray-600">{response.qualityScore}%</span>
                  </div>

                  {/* Responses */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Response Sections</h4>
                    {response.responses.map((questionResponse) => (
                      <div key={questionResponse.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium">Question Response</h5>
                          <div className="flex items-center gap-2">
                            {questionResponse.aiGenerated && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                                <Bot className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">{questionResponse.qualityScore}% quality</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {questionResponse.response}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{questionResponse.wordCount} words</span>
                          <span>Modified {questionResponse.lastModified}</span>
                        </div>
                        {questionResponse.suggestions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700 mb-1">AI Suggestions:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {questionResponse.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <span className="text-blue-500">•</span>
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Collaborators */}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {response.collaborators.length} collaborator{response.collaborators.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Continue Editing
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">78%</div>
                <p className="text-sm text-gray-600">+15% from last quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Time Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">32h</div>
                <p className="text-sm text-gray-600">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active RFIs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">8</div>
                <p className="text-sm text-gray-600">In progress</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create RFI Dialog */}
      <Dialog open={isCreateRFIDialogOpen} onOpenChange={setIsCreateRFIDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New RFI</DialogTitle>
            <DialogDescription>
              Set up a new Request for Information with AI assistance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">RFI Title</Label>
                <Input id="title" placeholder="Enter RFI title" />
              </div>
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input id="organization" placeholder="Organization name" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the RFI requirements" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="ai-assistance" />
              <Label htmlFor="ai-assistance">Enable AI assistance for response generation</Label>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auto-Generate Response Dialog */}
      <Dialog open={isAutoGenerateDialogOpen} onOpenChange={setIsAutoGenerateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Auto-Generate RFI Response</DialogTitle>
            <DialogDescription>
              Let AI analyze the RFI and generate comprehensive responses
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rfi-url">RFI URL or Document</Label>
              <Input id="rfi-url" placeholder="Paste RFI URL or upload document" />
            </div>
            <div>
              <Label htmlFor="company-info">Company Information</Label>
              <Textarea id="company-info" placeholder="Provide key company details, capabilities, and differentiators" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="response-tone">Response Tone</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority-areas">Priority Areas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select focus areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security">Security & Compliance</SelectItem>
                    <SelectItem value="technical">Technical Capabilities</SelectItem>
                    <SelectItem value="commercial">Commercial Terms</SelectItem>
                    <SelectItem value="operational">Operational Excellence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="include-certifications" defaultChecked />
              <Label htmlFor="include-certifications">Include relevant certifications and compliance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="compliance-check" defaultChecked />
              <Label htmlFor="compliance-check">Run compliance and requirement check</Label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

