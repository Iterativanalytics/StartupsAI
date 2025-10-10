
import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  MessageCircle, 
  History, 
  Eye, 
  Edit3, 
  Save, 
  UserPlus,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
  isOnline: boolean;
  lastSeen: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  sectionId: string;
  timestamp: string;
  resolved: boolean;
}

interface VersionHistory {
  id: string;
  userId: string;
  userName: string;
  changes: string;
  timestamp: string;
  version: string;
}

function Collaboration() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('executive-summary');
  const [content, setContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  // Mock data for demonstration
  const collaborators: Collaborator[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@startup.com',
      avatar: '👩‍💼',
      role: 'owner',
      isOnline: true,
      lastSeen: 'now'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@advisor.com',
      avatar: '👨‍💼',
      role: 'editor',
      isOnline: true,
      lastSeen: '2 minutes ago'
    },
    {
      id: '3',
      name: 'Lisa Rodriguez',
      email: 'lisa@investor.com',
      avatar: '👩‍💻',
      role: 'viewer',
      isOnline: false,
      lastSeen: '1 hour ago'
    }
  ];

  const comments: Comment[] = [
    {
      id: '1',
      userId: '2',
      userName: 'Mike Chen',
      content: 'The market size estimation seems conservative. Consider expanding the TAM analysis.',
      sectionId: 'market-analysis',
      timestamp: '2024-01-15T10:30:00Z',
      resolved: false
    },
    {
      id: '2',
      userId: '3',
      userName: 'Lisa Rodriguez',
      content: 'Revenue projections look solid. What about customer acquisition costs?',
      sectionId: 'financial-projections',
      timestamp: '2024-01-15T09:15:00Z',
      resolved: true
    }
  ];

  const versionHistory: VersionHistory[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      changes: 'Updated financial projections for Q1-Q2',
      timestamp: '2024-01-15T14:30:00Z',
      version: 'v2.3'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Mike Chen',
      changes: 'Enhanced market analysis section with competitor data',
      timestamp: '2024-01-15T11:45:00Z',
      version: 'v2.2'
    }
  ];

  const handleSave = () => {
    toast({
      title: "Changes saved",
      description: "Your edits have been saved and synced with collaborators",
    });
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      toast({
        title: "Comment added",
        description: "Your comment has been added and collaborators have been notified",
      });
      setNewComment('');
    }
  };

  const handleInviteCollaborator = () => {
    if (inviteEmail.trim()) {
      toast({
        title: "Invitation sent",
        description: `Collaboration invitation sent to ${inviteEmail}`,
      });
      setInviteEmail('');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Collaborators */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Business Plan Collaboration</h1>
            <p className="text-gray-600">Real-time editing with your team</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Online Collaborators */}
            <div className="flex -space-x-2">
              {collaborators.filter(c => c.isOnline).map(collaborator => (
                <div key={collaborator.id} className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-medium border-2 border-white">
                    {collaborator.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              ))}
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Collaborator</DialogTitle>
                  <DialogDescription>
                    Invite team members to collaborate on this business plan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option value="viewer">Viewer - Can view and comment</option>
                    <option value="editor">Editor - Can edit and comment</option>
                  </select>
                </div>
                <DialogFooter>
                  <Button onClick={handleInviteCollaborator}>Send Invitation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live sync enabled • Auto-saved 2 seconds ago</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Executive Summary</CardTitle>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your executive summary..."
                  className="min-h-64"
                />
              ) : (
                <div className="min-h-64 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    Our company revolutionizes the startup ecosystem by providing comprehensive 
                    business planning tools that leverage AI and collaborative features to help 
                    entrepreneurs succeed. We're targeting a $50B market with our innovative 
                    platform that connects startups with investors, accelerators, and mentors.
                  </p>
                </div>
              )}
              
              {/* Live editing indicators */}
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>Mike Chen is viewing</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Edit3 className="h-4 w-4" />
                  <span>Last edited by Sarah Johnson • 2 minutes ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="collaborators" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="collaborators" className="text-xs">
                <Users className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="comments" className="text-xs">
                <MessageCircle className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs">
                <History className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collaborators" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Team Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {collaborators.map(collaborator => (
                    <div key={collaborator.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm">
                          {collaborator.avatar}
                        </div>
                        {collaborator.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {collaborator.name}
                        </p>
                        <p className="text-xs text-gray-500">{collaborator.lastSeen}</p>
                      </div>
                      <Badge className={`text-xs ${getRoleColor(collaborator.role)}`}>
                        {collaborator.role}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Comments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-20"
                    />
                    <Button size="sm" onClick={handleAddComment}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                  </div>

                  {comments.map(comment => (
                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{comment.userName}</span>
                        {comment.resolved ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{comment.content}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Version History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {versionHistory.map(version => (
                    <div key={version.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {version.version}
                        </Badge>
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-900 mb-1">{version.changes}</p>
                      <p className="text-xs text-gray-500">
                        by {version.userName} • {new Date(version.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Collaboration;
