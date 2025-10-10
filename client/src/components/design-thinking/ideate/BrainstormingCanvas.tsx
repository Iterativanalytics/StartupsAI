import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Download, 
  Lightbulb, 
  Users, 
  Clock, 
  Vote,
  Plus,
  X,
  RefreshCw,
  Target,
  Zap,
  Brain,
  Timer
} from 'lucide-react';

export interface Idea {
  id: string;
  content: string;
  authorId: string;
  parentIdeaId?: string;
  votes: number;
  category?: string;
  feasibilityScore?: number;
  createdAt: Date;
}

export interface BrainstormSession {
  id: string;
  hmwQuestionId: string;
  facilitatorId: string;
  participants: string[];
  duration: number; // minutes
  method: 'crazy-8s' | 'brainwriting' | 'scamper' | 'reverse-brainstorming';
  ideas: Idea[];
  rules: {
    deferJudgment: boolean;
    encourageWildIdeas: boolean;
    buildOnOthers: boolean;
    quantityOverQuality: boolean;
  };
  status: 'preparing' | 'active' | 'voting' | 'completed';
  startTime?: Date;
  endTime?: Date;
}

interface BrainstormingCanvasProps {
  projectId: string;
  hmwQuestion: string;
  initialData?: BrainstormSession;
  onSave: (data: BrainstormSession) => void;
  onExport?: (data: BrainstormSession) => void;
  participants?: Array<{ id: string; name: string; avatar?: string }>;
}

const brainstormingMethods = {
  'crazy-8s': {
    name: 'Crazy 8s',
    description: 'Generate 8 ideas in 8 minutes',
    duration: 8,
    instructions: 'Sketch 8 different ideas quickly. Don\'t overthink - go for quantity!'
  },
  'brainwriting': {
    name: 'Brainwriting',
    description: 'Silent idea generation and building',
    duration: 15,
    instructions: 'Write ideas silently, then pass to others to build upon them.'
  },
  'scamper': {
    name: 'SCAMPER',
    description: 'Systematic idea generation using SCAMPER technique',
    duration: 20,
    instructions: 'Apply SCAMPER: Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse.'
  },
  'reverse-brainstorming': {
    name: 'Reverse Brainstorming',
    description: 'Generate ideas by thinking about the opposite',
    duration: 15,
    instructions: 'Think about how to make the problem worse, then reverse those ideas.'
  }
};

const scamperPrompts = [
  'Substitute: What can we substitute or swap?',
  'Combine: What can we combine or merge?',
  'Adapt: What can we adapt from other contexts?',
  'Modify: What can we modify or change?',
  'Put to other uses: What other uses can we find?',
  'Eliminate: What can we remove or eliminate?',
  'Reverse: What if we did the opposite?'
];

export function BrainstormingCanvas({ 
  projectId, 
  hmwQuestion,
  initialData, 
  onSave, 
  onExport,
  participants = []
}: BrainstormingCanvasProps) {
  const [session, setSession] = useState<BrainstormSession>(
    initialData || {
      id: '',
      hmwQuestionId: '',
      facilitatorId: '',
      participants: [],
      duration: 15,
      method: 'crazy-8s',
      ideas: [],
      rules: {
        deferJudgment: true,
        encourageWildIdeas: true,
        buildOnOthers: true,
        quantityOverQuality: true
      },
      status: 'preparing'
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [newIdea, setNewIdea] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showVoting, setShowVoting] = useState(false);
  const [currentScamperPrompt, setCurrentScamperPrompt] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef<Date | null>(null);

  useEffect(() => {
    if (initialData) {
      setSession(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (session.status === 'active' && sessionStartTime.current) {
      const elapsed = Math.floor((Date.now() - sessionStartTime.current.getTime()) / 1000 / 60);
      const remaining = session.duration - elapsed;
      setTimeRemaining(Math.max(0, remaining));

      if (remaining <= 0) {
        endSession();
      }
    }
  }, [session.status, session.duration]);

  const startSession = () => {
    setSession(prev => ({ ...prev, status: 'active', startTime: new Date() }));
    sessionStartTime.current = new Date();
    
    // Set up timer
    timerRef.current = setInterval(() => {
      if (sessionStartTime.current) {
        const elapsed = Math.floor((Date.now() - sessionStartTime.current.getTime()) / 1000 / 60);
        const remaining = session.duration - elapsed;
        setTimeRemaining(Math.max(0, remaining));
        
        if (remaining <= 0) {
          endSession();
        }
      }
    }, 1000);
  };

  const endSession = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setSession(prev => ({ 
      ...prev, 
      status: 'voting', 
      endTime: new Date() 
    }));
    setShowVoting(true);
  };

  const addIdea = () => {
    if (newIdea.trim()) {
      const idea: Idea = {
        id: `idea-${Date.now()}`,
        content: newIdea.trim(),
        authorId: 'current-user', // In real app, get from auth context
        votes: 0,
        category: selectedCategory,
        createdAt: new Date()
      };
      
      setSession(prev => ({
        ...prev,
        ideas: [...prev.ideas, idea]
      }));
      
      setNewIdea('');
      setSelectedCategory('');
    }
  };

  const voteOnIdea = (ideaId: string) => {
    setSession(prev => ({
      ...prev,
      ideas: prev.ideas.map(idea => 
        idea.id === ideaId 
          ? { ...idea, votes: idea.votes + 1 }
          : idea
      )
    }));
  };

  const buildOnIdea = (parentIdeaId: string) => {
    const parentIdea = session.ideas.find(i => i.id === parentIdeaId);
    if (parentIdea) {
      setNewIdea(`Building on: ${parentIdea.content} - `);
      setSelectedCategory(parentIdea.category);
    }
  };

  const nextScamperPrompt = () => {
    setCurrentScamperPrompt(prev => (prev + 1) % scamperPrompts.length);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(session);
    } catch (error) {
      console.error('Error saving brainstorm session:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(session);
    }
  };

  const getMethodInfo = () => brainstormingMethods[session.method];
  const sortedIdeas = [...session.ideas].sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Brainstorming Canvas</h2>
          <p className="text-gray-600 mt-1">
            Generate innovative ideas for: {hmwQuestion}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          {onExport && (
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Session Setup */}
      {session.status === 'preparing' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Session Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Brainstorming Method</label>
                <select
                  value={session.method}
                  onChange={(e) => setSession(prev => ({ 
                    ...prev, 
                    method: e.target.value as keyof typeof brainstormingMethods,
                    duration: brainstormingMethods[e.target.value as keyof typeof brainstormingMethods].duration
                  }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {Object.entries(brainstormingMethods).map(([key, method]) => (
                    <option key={key} value={key}>{method.name}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-600 mt-1">
                  {getMethodInfo().description} ({getMethodInfo().duration} minutes)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                <Input
                  type="number"
                  value={session.duration}
                  onChange={(e) => setSession(prev => ({ ...prev, duration: parseInt(e.target.value) || 15 }))}
                  min="5"
                  max="60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Session Rules</label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(session.rules).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setSession(prev => ({
                        ...prev,
                        rules: { ...prev.rules, [key]: e.target.checked }
                      }))}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button onClick={startSession} className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Start Brainstorming Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Session */}
      {session.status === 'active' && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Active Session - {getMethodInfo().name}
              </CardTitle>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeRemaining} min remaining
                </Badge>
                <Button onClick={endSession} variant="outline">
                  End Session
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-medium text-blue-900 mb-2">Instructions</h4>
              <p className="text-blue-800">{getMethodInfo().instructions}</p>
            </div>

            {/* SCAMPER Prompts */}
            {session.method === 'scamper' && (
              <div className="bg-yellow-50 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-yellow-900">Current SCAMPER Prompt</h4>
                  <Button size="sm" onClick={nextScamperPrompt}>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Next
                  </Button>
                </div>
                <p className="text-yellow-800">{scamperPrompts[currentScamperPrompt]}</p>
              </div>
            )}

            {/* Add New Idea */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Add New Idea</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your idea..."
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addIdea()}
                  className="flex-1"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">Category</option>
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                  <option value="process">Process</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business Model</option>
                </select>
                <Button onClick={addIdea} disabled={!newIdea.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Ideas Count */}
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                {session.ideas.length} ideas
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {session.participants.length} participants
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ideas Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {session.ideas.map((idea, index) => (
          <Card key={idea.id} className="border-2 border-gray-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    {idea.category && (
                      <Badge variant="secondary">{idea.category}</Badge>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Vote className="w-3 h-3" />
                      {idea.votes}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{idea.content}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => voteOnIdea(idea.id)}
                  className="flex items-center gap-1"
                >
                  <Vote className="w-3 h-3" />
                  Vote
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => buildOnIdea(idea.id)}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Build On
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Voting Phase */}
      {session.status === 'voting' && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="w-5 h-5" />
              Voting Phase
            </CardTitle>
            <p className="text-sm text-gray-600">
              Vote on the ideas you think are most promising. The top ideas will be prioritized.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-medium">Top Ideas by Votes</h4>
              {sortedIdeas.slice(0, 10).map((idea, index) => (
                <div key={idea.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Vote className="w-3 h-3" />
                        {idea.votes} votes
                      </Badge>
                    </div>
                    <p className="text-sm">{idea.content}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => voteOnIdea(idea.id)}
                    className="ml-2"
                  >
                    <Vote className="w-3 h-3 mr-1" />
                    Vote
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Summary */}
      {session.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Session Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{session.ideas.length}</div>
                <div className="text-sm text-gray-600">Ideas Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{session.participants.length}</div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{session.duration}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(session.ideas.length / session.duration * 60)}
                </div>
                <div className="text-sm text-gray-600">Ideas/Hour</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips and Guidance */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Brainstorming Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Defer judgment - all ideas are welcome during ideation</li>
            <li>• Encourage wild ideas - the crazier, the better</li>
            <li>• Build on others' ideas - combine and improve</li>
            <li>• Focus on quantity over quality initially</li>
            <li>• Use different methods to explore various angles</li>
            <li>• Take breaks to maintain energy and creativity</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
