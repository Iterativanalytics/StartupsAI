import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Download, 
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  Image,
  Video,
  FileText,
  Edit,
  Trash2,
  Copy,
  Move,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Settings
} from 'lucide-react';

export interface StoryboardFrame {
  id: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
  notes: string;
  emotions: string[];
  actions: string[];
  thoughts: string[];
  painPoints: string[];
  opportunities: string[];
  duration: number; // seconds
  order: number;
}

export interface StoryboardData {
  id: string;
  projectId: string;
  title: string;
  description: string;
  frames: StoryboardFrame[];
  persona: string;
  scenario: string;
  goals: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface StoryboardBuilderProps {
  projectId: string;
  initialData?: StoryboardData;
  onSave: (data: StoryboardData) => void;
  onExport?: (data: StoryboardData) => void;
}

const emotionOptions = [
  'Excited', 'Confused', 'Frustrated', 'Satisfied', 'Anxious', 
  'Relieved', 'Curious', 'Overwhelmed', 'Confident', 'Disappointed'
];

const actionTemplates = [
  'User opens the app',
  'User searches for information',
  'User encounters an error',
  'User completes a task',
  'User shares content',
  'User navigates to a new section',
  'User provides feedback',
  'User abandons the process'
];

const thoughtTemplates = [
  'This looks interesting',
  'I\'m not sure what to do next',
  'This is taking too long',
  'I like this feature',
  'I wish I could...',
  'This is confusing',
  'I need help',
  'This is exactly what I needed'
];

const painPointTemplates = [
  'Too many steps',
  'Unclear instructions',
  'Slow loading',
  'Hard to find information',
  'Confusing interface',
  'Missing features',
  'Technical errors',
  'Poor mobile experience'
];

const opportunityTemplates = [
  'Simplify the process',
  'Add clear guidance',
  'Improve performance',
  'Better organization',
  'Intuitive design',
  'New functionality',
  'Error prevention',
  'Mobile optimization'
];

export function StoryboardBuilder({ 
  projectId, 
  initialData, 
  onSave, 
  onExport 
}: StoryboardBuilderProps) {
  const [data, setData] = useState<StoryboardData>(
    initialData || {
      id: '',
      projectId,
      title: '',
      description: '',
      frames: [],
      persona: '',
      scenario: '',
      goals: []
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const updateData = (field: keyof StoryboardData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addFrame = () => {
    const newFrame: StoryboardFrame = {
      id: `frame-${Date.now()}`,
      title: `Frame ${data.frames.length + 1}`,
      description: '',
      notes: '',
      emotions: [],
      actions: [],
      thoughts: [],
      painPoints: [],
      opportunities: [],
      duration: 5,
      order: data.frames.length
    };
    
    setData(prev => ({
      ...prev,
      frames: [...prev.frames, newFrame]
    }));
    setSelectedFrame(newFrame.id);
  };

  const updateFrame = (frameId: string, field: keyof StoryboardFrame, value: any) => {
    setData(prev => ({
      ...prev,
      frames: prev.frames.map(frame => 
        frame.id === frameId ? { ...frame, [field]: value } : frame
      )
    }));
  };

  const removeFrame = (frameId: string) => {
    setData(prev => ({
      ...prev,
      frames: prev.frames.filter(frame => frame.id !== frameId)
    }));
    if (selectedFrame === frameId) {
      setSelectedFrame(null);
    }
  };

  const duplicateFrame = (frameId: string) => {
    const frame = data.frames.find(f => f.id === frameId);
    if (frame) {
      const newFrame: StoryboardFrame = {
        ...frame,
        id: `frame-${Date.now()}`,
        title: `${frame.title} (Copy)`,
        order: frame.order + 1
      };
      
      setData(prev => ({
        ...prev,
        frames: [...prev.frames, newFrame].sort((a, b) => a.order - b.order)
      }));
    }
  };

  const moveFrame = (frameId: string, direction: 'up' | 'down') => {
    setData(prev => {
      const frames = [...prev.frames];
      const index = frames.findIndex(f => f.id === frameId);
      
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= frames.length) return prev;
      
      [frames[index], frames[newIndex]] = [frames[newIndex], frames[index]];
      frames[index].order = index;
      frames[newIndex].order = newIndex;
      
      return { ...prev, frames };
    });
  };

  const addToArray = (frameId: string, field: keyof StoryboardFrame, value: string) => {
    if (value.trim()) {
      updateFrame(frameId, field, [...(data.frames.find(f => f.id === frameId)?.[field] as string[] || []), value.trim()]);
    }
  };

  const removeFromArray = (frameId: string, field: keyof StoryboardFrame, index: number) => {
    const frame = data.frames.find(f => f.id === frameId);
    if (frame) {
      const array = frame[field] as string[];
      updateFrame(frameId, field, array.filter((_, i) => i !== index));
    }
  };

  const selectedFrameData = data.frames.find(f => f.id === selectedFrame);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving storyboard:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(data);
    }
  };

  const playStoryboard = () => {
    setIsPlaying(true);
    setCurrentFrameIndex(0);
    
    const playNextFrame = (index: number) => {
      if (index < data.frames.length) {
        setCurrentFrameIndex(index);
        const frame = data.frames[index];
        setTimeout(() => playNextFrame(index + 1), frame.duration * 1000);
      } else {
        setIsPlaying(false);
      }
    };
    
    playNextFrame(0);
  };

  const stopStoryboard = () => {
    setIsPlaying(false);
    setCurrentFrameIndex(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Storyboard Builder</h2>
          <p className="text-gray-600 mt-1">Create visual stories of user experiences</p>
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

      {/* Storyboard Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Storyboard Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={data.title}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="Enter storyboard title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Persona</label>
              <Input
                value={data.persona}
                onChange={(e) => updateData('persona', e.target.value)}
                placeholder="Who is the user?"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={data.description}
              onChange={(e) => updateData('description', e.target.value)}
              placeholder="Describe the user journey..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Scenario</label>
            <Textarea
              value={data.scenario}
              onChange={(e) => updateData('scenario', e.target.value)}
              placeholder="What situation is the user in?"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Frames List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Frames ({data.frames.length})</CardTitle>
            <div className="flex gap-2">
              {data.frames.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isPlaying ? stopStoryboard : playStoryboard}
                    className="flex items-center gap-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Stop' : 'Play'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setData(prev => ({ ...prev, frames: [] }))}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear All
                  </Button>
                </>
              )}
              <Button onClick={addFrame} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Frame
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {data.frames.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No frames yet. Click "Add Frame" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.frames.map((frame, index) => (
                <div
                  key={frame.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedFrame === frame.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isPlaying && currentFrameIndex === index ? 'ring-2 ring-green-500' : ''}`}
                  onClick={() => setSelectedFrame(frame.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{frame.title}</h3>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveFrame(frame.id, 'up');
                        }}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveFrame(frame.id, 'down');
                        }}
                        disabled={index === data.frames.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      {frame.description || 'No description'}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {frame.emotions.slice(0, 2).map((emotion, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {emotion}
                        </Badge>
                      ))}
                      {frame.emotions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{frame.emotions.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{frame.duration}s</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateFrame(frame.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFrame(frame.id);
                          }}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Frame Editor */}
      {selectedFrameData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Frame: {selectedFrameData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={selectedFrameData.title}
                  onChange={(e) => updateFrame(selectedFrameData.id, 'title', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
                <Input
                  type="number"
                  value={selectedFrameData.duration}
                  onChange={(e) => updateFrame(selectedFrameData.id, 'duration', parseInt(e.target.value) || 0)}
                  min="1"
                  max="60"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={selectedFrameData.description}
                onChange={(e) => updateFrame(selectedFrameData.id, 'description', e.target.value)}
                placeholder="What happens in this frame?"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <Textarea
                value={selectedFrameData.notes}
                onChange={(e) => updateFrame(selectedFrameData.id, 'notes', e.target.value)}
                placeholder="Additional notes or observations..."
                rows={2}
              />
            </div>

            {/* Emotions */}
            <div>
              <label className="block text-sm font-medium mb-2">Emotions</label>
              <div className="space-y-2">
                {selectedFrameData.emotions.map((emotion, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                    <span className="text-sm">{emotion}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromArray(selectedFrameData.id, 'emotions', index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addToArray(selectedFrameData.id, 'emotions', e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select emotion...</option>
                    {emotionOptions.map(emotion => (
                      <option key={emotion} value={emotion}>{emotion}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <label className="block text-sm font-medium mb-2">Actions</label>
              <div className="space-y-2">
                {selectedFrameData.actions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm">{action}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromArray(selectedFrameData.id, 'actions', index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addToArray(selectedFrameData.id, 'actions', e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select action...</option>
                    {actionTemplates.map(action => (
                      <option key={action} value={action}>{action}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Thoughts */}
            <div>
              <label className="block text-sm font-medium mb-2">Thoughts</label>
              <div className="space-y-2">
                {selectedFrameData.thoughts.map((thought, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm">{thought}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromArray(selectedFrameData.id, 'thoughts', index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addToArray(selectedFrameData.id, 'thoughts', e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select thought...</option>
                    {thoughtTemplates.map(thought => (
                      <option key={thought} value={thought}>{thought}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pain Points */}
            <div>
              <label className="block text-sm font-medium mb-2">Pain Points</label>
              <div className="space-y-2">
                {selectedFrameData.painPoints.map((painPoint, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-sm">{painPoint}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromArray(selectedFrameData.id, 'painPoints', index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addToArray(selectedFrameData.id, 'painPoints', e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select pain point...</option>
                    {painPointTemplates.map(painPoint => (
                      <option key={painPoint} value={painPoint}>{painPoint}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Opportunities */}
            <div>
              <label className="block text-sm font-medium mb-2">Opportunities</label>
              <div className="space-y-2">
                {selectedFrameData.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                    <span className="text-sm">{opportunity}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromArray(selectedFrameData.id, 'opportunities', index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addToArray(selectedFrameData.id, 'opportunities', e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select opportunity...</option>
                    {opportunityTemplates.map(opportunity => (
                      <option key={opportunity} value={opportunity}>{opportunity}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips and Guidance */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">🎬 Storyboarding Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Start with the user's current state and end with their desired outcome</li>
            <li>• Include emotional highs and lows to show the full experience</li>
            <li>• Focus on key moments that matter most to the user</li>
            <li>• Use realistic scenarios and personas</li>
            <li>• Keep frames simple and focused on one key interaction</li>
            <li>• Test your storyboard with real users for feedback</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
