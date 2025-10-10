import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  MessageSquare, 
  Users, 
  Brain, 
  Send, 
  Paperclip, 
  Smile,
  MoreVertical,
  Phone,
  Video,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Star,
  Flag,
  Archive,
  Trash2,
  Download,
  Share
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  agentType?: string;
  agentName?: string;
  timestamp: Date;
  messageType: 'text' | 'image' | 'file' | 'insight' | 'analysis';
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  insights?: Array<{
    id: string;
    type: 'recommendation' | 'warning' | 'info' | 'success';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    actionable: boolean;
  }>;
  analysis?: {
    type: string;
    data: Record<string, unknown>;
    results: Record<string, unknown>;
  };
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  isTyping?: boolean;
  isEdited?: boolean;
  editHistory?: Array<{
    timestamp: Date;
    content: string;
  }>;
}

interface ConversationViewProps {
  conversationId: string;
  participants: Array<{
    id: string;
    name: string;
    type: 'user' | 'co-agent' | 'functional-agent';
    agentType?: string;
    status: 'online' | 'offline' | 'busy';
    avatar?: string;
  }>;
  messages: Message[];
  isTyping: boolean;
  typingParticipants: string[];
  onSendMessage: (content: string, type?: string, attachments?: File[]) => void;
  onSendReaction: (messageId: string, emoji: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onAddAttachment: (files: File[]) => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onShareScreen: () => void;
  onExportConversation: () => void;
  onArchiveConversation: () => void;
  onDeleteConversation: () => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  conversationId,
  participants,
  messages,
  isTyping,
  typingParticipants,
  onSendMessage,
  onSendReaction,
  onEditMessage,
  onDeleteMessage,
  onAddAttachment,
  onStartCall,
  onShareScreen,
  onExportConversation,
  onArchiveConversation,
  onDeleteConversation
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedTab, setSelectedTab] = useState('messages');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAgentIcon = (agentType?: string) => {
    switch (agentType) {
      case 'CO_FOUNDER':
        return '🎯';
      case 'CO_INVESTOR':
        return '📈';
      case 'CO_BUILDER':
        return '👥';
      case 'BUSINESS_ADVISOR':
        return '📊';
      case 'INVESTMENT_ANALYST':
        return '💰';
      case 'CREDIT_ANALYST':
        return '🛡️';
      case 'IMPACT_ANALYST':
        return '🌱';
      case 'PROGRAM_MANAGER':
        return '📋';
      case 'PLATFORM_ORCHESTRATOR':
        return '⚙️';
      default:
        return '🤖';
    }
  };

  const getAgentColor = (agentType?: string) => {
    switch (agentType) {
      case 'CO_FOUNDER':
        return 'bg-blue-500';
      case 'CO_INVESTOR':
        return 'bg-green-500';
      case 'CO_BUILDER':
        return 'bg-purple-500';
      case 'BUSINESS_ADVISOR':
        return 'bg-blue-500';
      case 'INVESTMENT_ANALYST':
        return 'bg-green-500';
      case 'CREDIT_ANALYST':
        return 'bg-red-500';
      case 'IMPACT_ANALYST':
        return 'bg-purple-500';
      case 'PROGRAM_MANAGER':
        return 'bg-orange-500';
      case 'PLATFORM_ORCHESTRATOR':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '🎉';
      default:
        return '💡';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'recommendation':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAddAttachment(files);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    onSendReaction(messageId, emoji);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getParticipantInfo = (agentType?: string) => {
    return participants.find(p => p.agentType === agentType) || participants[0];
  };

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                {participants.slice(0, 3).map((participant) => (
                  <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback className={getAgentColor(participant.agentType)}>
                      {participant.agentType ? getAgentIcon(participant.agentType) : '👤'}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {participants.length > 3 && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                    +{participants.length - 3}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {participants.length === 1 ? participants[0].name : `${participants.length} participants`}
                </h3>
                <p className="text-sm text-gray-600">
                  {typingParticipants.length > 0 
                    ? `${typingParticipants.join(', ')} typing...`
                    : `${participants.filter(p => p.status === 'online').length} online`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => onStartCall('audio')}>
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => onStartCall('video')}>
                <Video className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={onShareScreen}>
                <Share className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {message.sender === 'agent' && (
                  <div className="flex items-center space-x-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className={getAgentColor(message.agentType)}>
                        {getAgentIcon(message.agentType)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900">{message.agentName}</span>
                    <Badge variant="outline" className="text-xs">
                      {message.agentType?.replace('_', ' ')}
                    </Badge>
                  </div>
                )}
                
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-white bg-opacity-20 rounded">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">{attachment.name}</span>
                          <span className="text-xs opacity-70">({formatFileSize(attachment.size)})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Insights */}
                  {message.insights && message.insights.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.insights.map((insight) => (
                        <div key={insight.id} className={`p-2 rounded border ${getInsightColor(insight.type)}`}>
                          <div className="flex items-start space-x-2">
                            <span>{getInsightIcon(insight.type)}</span>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">{insight.title}</h4>
                              <p className="text-xs text-gray-600">{insight.description}</p>
                              {insight.priority && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {insight.priority} priority
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Analysis */}
                  {message.analysis && (
                    <div className="mt-2 p-2 bg-white bg-opacity-20 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <Brain className="h-4 w-4" />
                        <span className="text-sm font-medium">{message.analysis.type}</span>
                      </div>
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(message.analysis.results, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                      {message.isEdited && ' (edited)'}
                    </p>
                    
                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex space-x-1">
                        {message.reactions.map((reaction, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleReaction(message.id, reaction.emoji)}
                          >
                            {reaction.emoji} {reaction.count}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsRecording(!isRecording)}
              className={isRecording ? 'bg-red-500 text-white' : ''}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>

      {/* Right Sidebar - Participants & Info */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="participants">People</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          {/* Participants Tab */}
          <TabsContent value="participants" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Participants</h3>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className={getAgentColor(participant.agentType)}>
                        {participant.agentType ? getAgentIcon(participant.agentType) : '👤'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                      <p className="text-xs text-gray-600">{participant.type.replace('-', ' ')}</p>
                    </div>
                    <Badge 
                      className={
                        participant.status === 'online' 
                          ? 'bg-green-100 text-green-800' 
                          : participant.status === 'busy'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {participant.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Conversation Insights</h3>
              <div className="space-y-3">
                {messages
                  .filter(m => m.insights && m.insights.length > 0)
                  .flatMap(m => m.insights!)
                  .map((insight, index) => (
                    <Card key={index} className={`border-l-4 ${getInsightColor(insight.type)}`}>
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-2">
                          <span>{getInsightIcon(insight.type)}</span>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{insight.title}</h4>
                            <p className="text-xs text-gray-600">{insight.description}</p>
                            {insight.priority && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {insight.priority} priority
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Shared Files</h3>
              <div className="space-y-2">
                {messages
                  .filter(m => m.attachments && m.attachments.length > 0)
                  .flatMap(m => m.attachments!)
                  .map((attachment) => (
                    <div key={attachment.id} className="flex items-center space-x-3 p-2 border rounded">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{attachment.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Conversation Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={onExportConversation}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Conversation
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={onArchiveConversation}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={onDeleteConversation}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
