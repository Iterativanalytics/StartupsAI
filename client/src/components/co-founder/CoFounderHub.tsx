
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MessageCircle, 
  Target, 
  TrendingUp, 
  Zap, 
  Brain, 
  Users, 
  Calendar,
  Settings,
  Heart,
  Lightbulb
} from 'lucide-react';
import { ChatInterface } from '@/components/ai/ChatInterface';
import { useAgent } from '@/hooks/ai/useAgent';

interface ConversationMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
}

const conversationModes: ConversationMode[] = [
  {
    id: 'daily_standup',
    name: 'Daily Check-in',
    description: 'Quick morning sync on priorities and blockers',
    icon: Calendar,
    color: 'bg-blue-500'
  },
  {
    id: 'strategic_session',
    name: 'Strategic Session',
    description: 'Deep dive into business strategy and direction',
    icon: Brain,
    color: 'bg-purple-500'
  },
  {
    id: 'devils_advocate',
    name: 'Challenge Mode',
    description: 'Get pushback and counter-arguments on your ideas',
    icon: Zap,
    color: 'bg-red-500'
  },
  {
    id: 'brainstorm',
    name: 'Brainstorming',
    description: 'Creative ideation and problem-solving session',
    icon: Lightbulb,
    color: 'bg-yellow-500'
  },
  {
    id: 'decision_support',
    name: 'Decision Help',
    description: 'Framework-driven decision making support',
    icon: Target,
    color: 'bg-green-500'
  },
  {
    id: 'accountability_check',
    name: 'Accountability',
    description: 'Review goals, commitments, and progress',
    icon: Users,
    color: 'bg-indigo-500'
  }
];

export function CoFounderHub() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [partnershipHealth, setPartnershipHealth] = useState(87);
  const [activeGoals, setActiveGoals] = useState(5);
  const [completedGoals, setCompletedGoals] = useState(4);
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { sendMessage } = useAgent();

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setIsLoading(true);
      const result = await sendMessage('Get my current insights and recommendations', {
        userType: 'entrepreneur'
      });
      setInsights(result?.insights || []);
    } catch (error) {
      console.error('Failed to load insights:', error);
      setInsights([]);
    } finally {
      setIsLoading(false);
    }
  };

  const startConversationMode = (mode: string) => {
    setSelectedMode(mode);
  };

  if (selectedMode) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedMode(null)}
            >
              ← Back to Hub
            </Button>
            <Badge variant="secondary">
              {conversationModes.find(m => m.id === selectedMode)?.name}
            </Badge>
          </div>
        </div>
        
        <div className="flex-1">
          <ChatInterface />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 flex-wrap">
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 flex-shrink-0">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <span className="break-words">Your Co-Founder AI</span>
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Your AI business partner - always available, always thinking strategically
          </p>
        </div>
        <Button variant="outline" size="sm" className="flex-shrink-0 w-full sm:w-auto">
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Customize Personality</span>
          <span className="sm:hidden">Settings</span>
        </Button>
      </div>

      {/* Partnership Health Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Partnership Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{partnershipHealth}/100</span>
                <Badge variant={partnershipHealth > 80 ? 'default' : 'secondary'}>
                  {partnershipHealth > 80 ? 'Excellent' : 'Good'}
                </Badge>
              </div>
              <Progress value={partnershipHealth} className="h-2" />
              <p className="text-sm text-gray-600">
                Strong collaboration and trust building
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{completedGoals}/{activeGoals}</span>
                <Badge variant="secondary">On Track</Badge>
              </div>
              <Progress value={(completedGoals / activeGoals) * 100} className="h-2" />
              <p className="text-sm text-gray-600">
                Goals completed this quarter
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Impact Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">94</span>
                <Badge variant="default">High Impact</Badge>
              </div>
              <Progress value={94} className="h-2" />
              <p className="text-sm text-gray-600">
                Decisions influenced and problems solved
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Insights from Your Co-Founder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.slice(0, 4).map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{insight.type || 'Business Insight'}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {insight.value || insight.message || 'New opportunity detected in your data'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation Modes */}
      <Card>
        <CardHeader>
          <CardTitle>How would you like to work together today?</CardTitle>
          <p className="text-sm text-gray-600">
            Choose a conversation mode that fits your current needs
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {conversationModes.map((mode) => (
              <Card 
                key={mode.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-purple-200"
                onClick={() => startConversationMode(mode.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${mode.color}`}>
                      <mode.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{mode.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {mode.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 md:gap-3">
            <Button 
              variant="outline"
              onClick={() => startConversationMode('daily_standup')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Start Daily Check-in
            </Button>
            <Button 
              variant="outline"
              onClick={() => startConversationMode('decision_support')}
            >
              <Target className="h-4 w-4 mr-2" />
              Get Decision Help
            </Button>
            <Button 
              variant="outline"
              onClick={() => startConversationMode('brainstorm')}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Brainstorm Ideas
            </Button>
            <Button 
              variant="outline"
              onClick={() => startConversationMode('strategic_session')}
            >
              <Brain className="h-4 w-4 mr-2" />
              Strategic Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
