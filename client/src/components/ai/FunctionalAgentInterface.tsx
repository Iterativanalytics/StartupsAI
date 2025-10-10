import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Brain, 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Target, 
  Users,
  MessageSquare,
  Settings,
  Zap,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface FunctionalAgentInterfaceProps {
  agentType: 'BUSINESS_ADVISOR' | 'INVESTMENT_ANALYST' | 'CREDIT_ANALYST' | 'IMPACT_ANALYST' | 'PROGRAM_MANAGER' | 'PLATFORM_ORCHESTRATOR';
  agentName: string;
  agentDescription: string;
  expertise: string[];
  capabilities: string[];
  onExecuteTask: (taskType: string, context: any) => void;
  onGetInsights: (data: any) => void;
  onAnalyzeData: (data: any) => void;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    taskType?: string;
    insights?: any[];
  }>;
  isProcessing: boolean;
  currentTask?: string;
  insights: any[];
}

export const FunctionalAgentInterface: React.FC<FunctionalAgentInterfaceProps> = ({
  agentType,
  agentName,
  agentDescription,
  expertise,
  capabilities,
  onExecuteTask,
  onGetInsights,
  onAnalyzeData,
  messages,
  isProcessing,
  currentTask,
  insights
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [analysisData, setAnalysisData] = useState<any>(null);

  const getAgentIcon = () => {
    switch (agentType) {
      case 'BUSINESS_ADVISOR':
        return <BarChart3 className="h-6 w-6" />;
      case 'INVESTMENT_ANALYST':
        return <TrendingUp className="h-6 w-6" />;
      case 'CREDIT_ANALYST':
        return <Shield className="h-6 w-6" />;
      case 'IMPACT_ANALYST':
        return <Target className="h-6 w-6" />;
      case 'PROGRAM_MANAGER':
        return <Users className="h-6 w-6" />;
      case 'PLATFORM_ORCHESTRATOR':
        return <Settings className="h-6 w-6" />;
      default:
        return <Brain className="h-6 w-6" />;
    }
  };

  const getAgentColor = () => {
    switch (agentType) {
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

  const getTaskTypes = () => {
    switch (agentType) {
      case 'BUSINESS_ADVISOR':
        return [
          'Business Plan Analysis',
          'Financial Analysis',
          'Market Analysis',
          'Strategy Development',
          'Operational Optimization'
        ];
      case 'INVESTMENT_ANALYST':
        return [
          'Deal Analysis',
          'Portfolio Analysis',
          'Risk Assessment',
          'Valuation Analysis',
          'Due Diligence'
        ];
      case 'CREDIT_ANALYST':
        return [
          'Credit Assessment',
          'Risk Analysis',
          'Loan Underwriting',
          'Financial Analysis',
          'Compliance Review'
        ];
      case 'IMPACT_ANALYST':
        return [
          'Impact Assessment',
          'Social Impact Analysis',
          'Environmental Impact',
          'Sustainability Analysis',
          'Impact Measurement'
        ];
      case 'PROGRAM_MANAGER':
        return [
          'Program Analysis',
          'Program Optimization',
          'Resource Management',
          'Stakeholder Coordination',
          'Performance Monitoring'
        ];
      case 'PLATFORM_ORCHESTRATOR':
        return [
          'Platform Analysis',
          'Ecosystem Coordination',
          'System Integration',
          'Platform Optimization',
          'Stakeholder Management'
        ];
      default:
        return [];
    }
  };

  const handleExecuteTask = () => {
    if (selectedTask && analysisData) {
      onExecuteTask(selectedTask, analysisData);
    }
  };

  const handleGetInsights = () => {
    if (analysisData) {
      onGetInsights(analysisData);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Simulate sending message to agent
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInsightIcon = (insight: any) => {
    switch (insight.type) {
      case 'recommendation':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightColor = (insight: any) => {
    switch (insight.type) {
      case 'recommendation':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
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
              <div className="text-sm text-gray-600 mb-2">Expertise Areas</div>
              <div className="flex flex-wrap gap-1">
                {expertise.slice(0, 3).map((area) => (
                  <Badge key={area} variant="secondary" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Task Selection */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Available Tasks</h3>
          <div className="space-y-2">
            {getTaskTypes().map((task) => (
              <Button
                key={task}
                variant={selectedTask === task ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedTask(task)}
              >
                <Zap className="h-4 w-4 mr-2" />
                {task}
              </Button>
            ))}
          </div>
        </div>

        {/* Data Input */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Analysis Data</h3>
          <textarea
            value={analysisData ? JSON.stringify(analysisData, null, 2) : ''}
            onChange={(e) => {
              try {
                setAnalysisData(JSON.parse(e.target.value));
              } catch {
                // Invalid JSON, keep as string
              }
            }}
            placeholder="Paste your data here (JSON format)"
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2">
          <Button 
            onClick={handleExecuteTask}
            disabled={!selectedTask || !analysisData || isProcessing}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            Execute Task
          </Button>
          <Button 
            onClick={handleGetInsights}
            disabled={!analysisData || isProcessing}
            variant="outline"
            className="w-full"
          >
            <Brain className="h-4 w-4 mr-2" />
            Get Insights
          </Button>
        </div>

        {/* Capabilities */}
        <div className="p-4 flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Capabilities</h3>
          <div className="space-y-2">
            {capabilities.map((capability) => (
              <Badge key={capability} variant="secondary" className="w-full justify-start text-xs">
                {capability}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${getAgentColor()} text-white`}>
                {getAgentIcon()}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{agentName}</h3>
                <p className="text-sm text-gray-600">
                  {currentTask ? `Executing: ${currentTask}` : 'Ready for tasks'} • {messages.length} interactions
                </p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>Functional Agent</span>
            </Badge>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="conversation" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          {/* Conversation Tab */}
          <TabsContent value="conversation" className="flex-1 flex flex-col">
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
                      {message.taskType && (
                        <Badge variant="outline" className="text-xs">
                          {message.taskType}
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
              
              {isProcessing && (
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
                  placeholder={`Ask ${agentName}...`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isProcessing}
                  className="px-4"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Generated Insights</h3>
              {insights.length > 0 ? (
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <Card key={index} className={`border-l-4 ${getInsightColor(insight)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          {getInsightIcon(insight)}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{insight.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                            {insight.priority && (
                              <Badge variant="outline" className="mt-2">
                                Priority: {insight.priority}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No insights generated yet. Execute a task to get insights.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Data Analysis</h3>
              {analysisData ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Input Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                        {JSON.stringify(analysisData, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600">
                        Analysis will appear here after task execution.
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No data provided. Add data in the sidebar to begin analysis.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
