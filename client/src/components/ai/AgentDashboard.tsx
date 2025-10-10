import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Brain, 
  Users, 
  Settings, 
  MessageSquare, 
  TrendingUp, 
  Target,
  BarChart3,
  Shield,
  Zap,
  Activity,
  Clock,
  Star,
  Plus,
  Search,
  Filter
} from 'lucide-react';

interface AgentDashboardProps {
  userType: 'ENTREPRENEUR' | 'INVESTOR' | 'PARTNER';
  primaryAgent?: {
    type: string;
    name: string;
    status: 'active' | 'inactive';
    relationshipScore: number;
  };
  functionalAgents: Array<{
    type: string;
    name: string;
    status: 'active' | 'inactive' | 'busy';
    lastUsed: Date;
    usageCount: number;
  }>;
  recentInteractions: Array<{
    id: string;
    agentType: string;
    agentName: string;
    message: string;
    timestamp: Date;
    status: 'completed' | 'processing' | 'pending';
  }>;
  onSelectAgent: (agentType: string) => void;
  onStartConversation: (agentType: string) => void;
  onViewAnalytics: () => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  userType,
  primaryAgent,
  functionalAgents,
  recentInteractions,
  onSelectAgent,
  onStartConversation,
  onViewAnalytics
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'busy'>('all');
  const [selectedTab, setSelectedTab] = useState('overview');

  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case 'CO_FOUNDER':
        return <Target className="h-5 w-5" />;
      case 'CO_INVESTOR':
        return <TrendingUp className="h-5 w-5" />;
      case 'CO_BUILDER':
        return <Users className="h-5 w-5" />;
      case 'BUSINESS_ADVISOR':
        return <BarChart3 className="h-5 w-5" />;
      case 'INVESTMENT_ANALYST':
        return <TrendingUp className="h-5 w-5" />;
      case 'CREDIT_ANALYST':
        return <Shield className="h-5 w-5" />;
      case 'IMPACT_ANALYST':
        return <Target className="h-5 w-5" />;
      case 'PROGRAM_MANAGER':
        return <Users className="h-5 w-5" />;
      case 'PLATFORM_ORCHESTRATOR':
        return <Settings className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getAgentColor = (agentType: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrimaryAgentForUserType = () => {
    switch (userType) {
      case 'ENTREPRENEUR':
        return 'CO_FOUNDER';
      case 'INVESTOR':
        return 'CO_INVESTOR';
      case 'PARTNER':
        return 'CO_BUILDER';
      default:
        return 'CO_FOUNDER';
    }
  };

  const filteredFunctionalAgents = functionalAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || agent.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getAgentTier = (agentType: string) => {
    if (['CO_FOUNDER', 'CO_INVESTOR', 'CO_BUILDER'].includes(agentType)) {
      return 'Partnership Agent';
    }
    return 'Functional Agent';
  };

  const getAgentDescription = (agentType: string) => {
    const descriptions: Record<string, string> = {
      'CO_FOUNDER': 'Your strategic business partner for growth and development',
      'CO_INVESTOR': 'Your investment partner for portfolio and deal strategy',
      'CO_BUILDER': 'Your ecosystem partner for program and partnership development',
      'BUSINESS_ADVISOR': 'Specialized business analysis and strategy development',
      'INVESTMENT_ANALYST': 'Investment analysis and portfolio management',
      'CREDIT_ANALYST': 'Credit analysis and risk assessment',
      'IMPACT_ANALYST': 'Impact analysis and sustainability evaluation',
      'PROGRAM_MANAGER': 'Program management and optimization',
      'PLATFORM_ORCHESTRATOR': 'Platform orchestration and ecosystem coordination'
    };
    return descriptions[agentType] || 'AI Agent';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Agent Dashboard</h1>
            <p className="text-gray-600">Manage your AI agent ecosystem</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={onViewAnalytics} variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Agent List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('active')}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === 'busy' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('busy')}
                >
                  Busy
                </Button>
              </div>
            </div>
          </div>

          {/* Primary Agent */}
          {primaryAgent && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Primary Agent</h3>
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  primaryAgent.status === 'active' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => onSelectAgent(primaryAgent.type)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={getAgentColor(primaryAgent.type)}>
                        {getAgentIcon(primaryAgent.type)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{primaryAgent.name}</h4>
                        <Badge className={getStatusColor(primaryAgent.status)}>
                          {primaryAgent.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{getAgentDescription(primaryAgent.type)}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">
                          {Math.round(primaryAgent.relationshipScore * 100)}% relationship
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Functional Agents */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Functional Agents</h3>
              <div className="space-y-3">
                {filteredFunctionalAgents.map((agent) => (
                  <Card 
                    key={agent.type}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      agent.status === 'active' ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => onSelectAgent(agent.type)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={getAgentColor(agent.type)}>
                            {getAgentIcon(agent.type)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 text-sm">{agent.name}</h4>
                            <Badge className={getStatusColor(agent.status)}>
                              {agent.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{getAgentDescription(agent.type)}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {agent.usageCount} uses
                            </span>
                            <span className="text-xs text-gray-500">
                              {agent.lastUsed.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Brain className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Agents</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {functionalAgents.length + (primaryAgent ? 1 : 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Activity className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Active Agents</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {functionalAgents.filter(a => a.status === 'active').length + 
                             (primaryAgent?.status === 'active' ? 1 : 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <MessageSquare className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Interactions</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {recentInteractions.length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentInteractions.slice(0, 5).map((interaction) => (
                        <div key={interaction.id} className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={getAgentColor(interaction.agentType)}>
                              {getAgentIcon(interaction.agentType)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {interaction.agentName}
                              </p>
                              <Badge className={getStatusColor(interaction.status)}>
                                {interaction.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{interaction.message}</p>
                            <p className="text-xs text-gray-500">
                              {interaction.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Agents Tab */}
            <TabsContent value="agents" className="flex-1 p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">All Agents</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Agent
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[primaryAgent, ...functionalAgents].filter(Boolean).map((agent) => (
                    <Card key={agent?.type} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className={getAgentColor(agent?.type || '')}>
                              {getAgentIcon(agent?.type || '')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900">{agent?.name}</h3>
                              <Badge className={getStatusColor(agent?.status || '')}>
                                {agent?.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{getAgentDescription(agent?.type || '')}</p>
                            <p className="text-xs text-gray-500 mt-1">{getAgentTier(agent?.type || '')}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => onStartConversation(agent?.type || '')}
                            className="flex-1"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onSelectAgent(agent?.type || '')}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Conversations Tab */}
            <TabsContent value="conversations" className="flex-1 p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Recent Conversations</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Conversation
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentInteractions.map((interaction) => (
                    <Card key={interaction.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={getAgentColor(interaction.agentType)}>
                              {getAgentIcon(interaction.agentType)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900">{interaction.agentName}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(interaction.status)}>
                                  {interaction.status}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {interaction.timestamp.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{interaction.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="flex-1 p-6">
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Agent Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Agent Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {functionalAgents.map((agent) => (
                          <div key={agent.type} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{agent.name}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${Math.min(agent.usageCount * 10, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-900">{agent.usageCount}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Agent Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Active</span>
                          <Badge className="bg-green-100 text-green-800">
                            {functionalAgents.filter(a => a.status === 'active').length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Busy</span>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {functionalAgents.filter(a => a.status === 'busy').length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Inactive</span>
                          <Badge className="bg-gray-100 text-gray-800">
                            {functionalAgents.filter(a => a.status === 'inactive').length}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
