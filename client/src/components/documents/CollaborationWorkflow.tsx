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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Edit, 
  Eye, 
  Share2, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Bell, 
  Settings, 
  MoreVertical, 
  ArrowRight, 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  FileText, 
  Bot, 
  Zap, 
  Target, 
  TrendingUp, 
  BarChart3, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Flag, 
  Star, 
  Award, 
  Globe, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Download, 
  Upload, 
  Copy, 
  ExternalLink
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'review' | 'approval' | 'signature' | 'notification' | 'ai-analysis';
  assignee: User;
  dueDate: string;
  completed: boolean;
  comments: Comment[];
  attachments: Attachment[];
  aiInsights?: AIInsight[];
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isOnline: boolean;
}

interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  type: 'comment' | 'suggestion' | 'approval' | 'rejection';
  isResolved: boolean;
  replies: Comment[];
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: User;
  uploadedAt: string;
}

interface AIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'achievement' | 'opportunity';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  confidence: number;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  documentId: string;
  steps: WorkflowStep[];
  participants: User[];
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  aiEnabled: boolean;
}

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Project Manager', isOnline: true },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Content Writer', isOnline: true },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Reviewer', isOnline: false },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Approver', isOnline: true }
];

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Business Plan Review Process',
    description: 'Comprehensive review and approval workflow for business plans',
    documentId: '1',
    steps: [
      {
        id: '1',
        name: 'Initial Review',
        type: 'review',
        assignee: mockUsers[1],
        dueDate: '2024-01-20',
        completed: true,
        comments: [
          {
            id: '1',
            author: mockUsers[1],
            content: 'Great start! The executive summary is well-written.',
            timestamp: '2024-01-18T10:30:00Z',
            type: 'comment',
            isResolved: false,
            replies: []
          }
        ],
        attachments: [],
        status: 'completed',
        priority: 'high'
      },
      {
        id: '2',
        name: 'Financial Review',
        type: 'review',
        assignee: mockUsers[2],
        dueDate: '2024-01-22',
        completed: false,
        comments: [],
        attachments: [],
        aiInsights: [
          {
            id: '1',
            type: 'suggestion',
            title: 'Financial Projections Need Detail',
            description: 'Consider adding more detailed financial projections with assumptions',
            priority: 'high',
            actionable: true,
            confidence: 92
          }
        ],
        status: 'in-progress',
        priority: 'high'
      },
      {
        id: '3',
        name: 'Final Approval',
        type: 'approval',
        assignee: mockUsers[3],
        dueDate: '2024-01-25',
        completed: false,
        comments: [],
        attachments: [],
        status: 'pending',
        priority: 'medium'
      }
    ],
    participants: mockUsers,
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-18',
    createdBy: mockUsers[0],
    aiEnabled: true
  }
];

export default function CollaborationWorkflow() {
  const [selectedTab, setSelectedTab] = useState('workflows');
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreateWorkflowDialogOpen, setIsCreateWorkflowDialogOpen] = useState(false);
  const [isAddCommentDialogOpen, setIsAddCommentDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'review': return Eye;
      case 'approval': return CheckCircle;
      case 'signature': return Edit;
      case 'notification': return Bell;
      case 'ai-analysis': return Bot;
      default: return Target;
    }
  };

  const filteredWorkflows = mockWorkflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || workflow.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getWorkflowProgress = (workflow: Workflow) => {
    const completedSteps = workflow.steps.filter(step => step.completed).length;
    return (completedSteps / workflow.steps.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Collaboration Workflow 🤝
          </h2>
          <p className="text-gray-600">
            Streamlined document review, approval, and collaboration processes
          </p>
        </div>
        <Button onClick={() => setIsCreateWorkflowDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search workflows, documents, or participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWorkflows.map((workflow) => (
              <Card key={workflow.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                      {workflow.aiEnabled && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          <Bot className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-600">
                        {workflow.steps.filter(step => step.completed).length}/{workflow.steps.length} steps
                      </span>
                    </div>
                    <Progress value={getWorkflowProgress(workflow)} className="h-2" />
                  </div>

                  {/* Participants */}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div className="flex -space-x-2">
                      {workflow.participants.slice(0, 4).map((participant) => (
                        <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      ))}
                      {workflow.participants.length > 4 && (
                        <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                          +{workflow.participants.length - 4}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {workflow.participants.length} participant{workflow.participants.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Steps Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Workflow Steps</h4>
                    {workflow.steps.slice(0, 3).map((step) => {
                      const StepIcon = getStepIcon(step.type);
                      return (
                        <div key={step.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <StepIcon className="h-4 w-4 text-gray-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{step.name}</p>
                            <p className="text-xs text-gray-600">{step.assignee.name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(step.status)}>
                              {step.status}
                            </Badge>
                            <Badge className={getPriorityColor(step.priority)}>
                              {step.priority}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                    {workflow.steps.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{workflow.steps.length - 3} more steps
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedWorkflow(workflow)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="space-y-4">
            {mockWorkflows.flatMap(workflow => 
              workflow.steps.filter(step => step.assignee.id === '1' && !step.completed)
            ).map((step) => (
              <Card key={step.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{step.name}</CardTitle>
                      <CardDescription>
                        From: {mockWorkflows.find(w => w.steps.includes(step))?.name}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(step.status)}>
                        {step.status}
                      </Badge>
                      <Badge className={getPriorityColor(step.priority)}>
                        {step.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Due Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {step.dueDate}</span>
                  </div>

                  {/* AI Insights */}
                  {step.aiInsights && step.aiInsights.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">AI Insights</h4>
                      {step.aiInsights.map((insight) => (
                        <div key={insight.id} className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Bot className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-yellow-800">{insight.title}</p>
                              <p className="text-xs text-yellow-700">{insight.description}</p>
                            </div>
                            <Badge className={getPriorityColor(insight.priority)}>
                              {insight.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comments */}
                  {step.comments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Comments</h4>
                      {step.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={comment.author.avatar} />
                              <AvatarFallback>{comment.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{comment.author.name}</p>
                              <p className="text-sm text-gray-600">{comment.content}</p>
                              <p className="text-xs text-gray-500">{comment.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {step.comments.length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{step.comments.length - 2} more comments
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Start Review
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: '1',
                    type: 'comment',
                    user: mockUsers[1],
                    action: 'commented on',
                    target: 'Business Plan Review Process',
                    timestamp: '2 hours ago',
                    content: 'Great work on the financial projections!'
                  },
                  {
                    id: '2',
                    type: 'approval',
                    user: mockUsers[3],
                    action: 'approved',
                    target: 'Marketing Strategy Document',
                    timestamp: '4 hours ago',
                    content: null
                  },
                  {
                    id: '3',
                    type: 'ai-insight',
                    user: { id: 'ai', name: 'AI Assistant', email: 'ai@example.com', role: 'AI', isOnline: true },
                    action: 'suggested improvements for',
                    target: 'Executive Summary',
                    timestamp: '6 hours ago',
                    content: 'Consider adding more specific metrics to strengthen the value proposition.'
                  }
                ].map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatar} />
                      <AvatarFallback>
                        {activity.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user.name}</span>{' '}
                        <span className="text-gray-600">{activity.action}</span>{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      {activity.content && (
                        <p className="text-sm text-gray-600 mt-1">{activity.content}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                    {activity.type === 'ai-insight' && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        <Bot className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Workflow Dialog */}
      <Dialog open={isCreateWorkflowDialogOpen} onOpenChange={setIsCreateWorkflowDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Set up a new collaboration workflow for document review and approval
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input id="workflow-name" placeholder="Enter workflow name" />
            </div>
            <div>
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea id="workflow-description" placeholder="Describe the workflow purpose" />
            </div>
            <div>
              <Label htmlFor="document">Select Document</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Business Plan 2024</SelectItem>
                  <SelectItem value="2">Marketing Strategy</SelectItem>
                  <SelectItem value="3">Financial Projections</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="participants">Add Participants</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select participants" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
