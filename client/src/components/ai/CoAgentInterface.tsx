import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Heart, 
  Brain, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Target,
  Clock,
  Star,
  Zap,
  Shield
} from 'lucide-react';

interface CoAgentInterfaceProps {
  agentType: 'CO_FOUNDER' | 'CO_INVESTOR' | 'CO_BUILDER';
  agentName: string;
  agentDescription: string;
  personalityTraits: {
    warmth: number;
    expertise: number;
    directness: number;
    creativity: number;
  };
  relationshipMetrics: {
    trust: number;
    communication: number;
    collaboration: number;
    satisfaction: number;
  };
  conversationModes: string[];
  capabilities: string[];
  onSendMessage: (message: string, mode?: string) => void;
  onSwitchMode: (mode: string) => void;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    mode?: string;
  }>;
  isTyping: boolean;
  currentMode: string;
}

export const CoAgentInterface: React.FC<CoAgentInterfaceProps> = ({
  agentType,
  agentName,
  agentDescription,
  personalityTraits,
  relationshipMetrics,
  conversationModes,
  capabilities,
  onSendMessage,
  onSwitchMode,
  messages,
  isTyping,
  currentMode
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState(currentMode);

  const getAgentIcon = () => {
    switch (agentType) {
      case 'CO_FOUNDER':
        return <Target className="h-6 w-6" />;
      case 'CO_INVESTOR':
        return <TrendingUp className="h-6 w-6" />;
      case 'CO_BUILDER':
        return <Users className="h-6 w-6" />;
      default:
        return <Brain className="h-6 w-6" />;
    }
  };

  const getAgentColor = () => {
    switch (agentType) {
      case 'CO_FOUNDER':
        return 'bg-blue-500';
      case 'CO_INVESTOR':
        return 'bg-green-500';
      case 'CO_BUILDER':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPersonalityDescription = () => {
    const traits = [];
    if (personalityTraits.warmth > 0.7) traits.push('Warm & Supportive');
    if (personalityTraits.expertise > 0.7) traits.push('Highly Expert');
    if (personalityTraits.directness > 0.7) traits.push('Direct & Clear');
    if (personalityTraits.creativity > 0.7) traits.push('Creative & Innovative');
    return traits.join(', ');
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage, selectedMode);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'strategic':
        return <Target className="h-4 w-4" />;
      case 'daily':
        return <Clock className="h-4 w-4" />;
      case 'crisis':
        return <Shield className="h-4 w-4" />;
      case 'brainstorming':
        return <Zap className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Agent Profile & Controls */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Agent Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/avatars/${agentType.toLowerCase()}.png`} />
              <AvatarFallback className={getAgentColor()}>
                {getAgentIcon()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{agentName}</h2>
              <p className="text-sm text-gray-600">{agentDescription}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Personality</span>
                <span className="text-gray-900">{getPersonalityDescription()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(relationshipMetrics.trust * 100)}
                </div>
                <div className="text-xs text-gray-600">Trust</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(relationshipMetrics.satisfaction * 100)}
                </div>
                <div className="text-xs text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation Modes */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Conversation Modes</h3>
          <div className="space-y-2">
            {conversationModes.map((mode) => (
              <Button
                key={mode}
                variant={selectedMode === mode ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setSelectedMode(mode);
                  onSwitchMode(mode);
                }}
              >
                {getModeIcon(mode)}
                <span className="ml-2 capitalize">{mode}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <div className="p-4 flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Capabilities</h3>
          <div className="space-y-2">
            {capabilities.map((capability) => (
              <Badge key={capability} variant="secondary" className="w-full justify-start">
                {capability}
              </Badge>
            ))}
          </div>
        </div>

        {/* Relationship Metrics */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Relationship Health</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Communication</span>
                <span>{Math.round(relationshipMetrics.communication * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${relationshipMetrics.communication * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Collaboration</span>
                <span>{Math.round(relationshipMetrics.collaboration * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${relationshipMetrics.collaboration * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${getAgentColor()} text-white`}>
                {getAgentIcon()}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{agentName}</h3>
                <p className="text-sm text-gray-600">
                  {selectedMode} Mode • {messages.length} messages
                </p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Star className="h-3 w-3" />
              <span>Partnership Agent</span>
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === 'agent' && (
                    <div className={`p-1 rounded-full ${getAgentColor()} text-white`}>
                      {getAgentIcon()}
                    </div>
                  )}
                  {message.mode && (
                    <Badge variant="outline" className="text-xs">
                      {message.mode}
                    </Badge>
                  )}
                </div>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
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
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${agentName}...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};
