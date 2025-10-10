import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  X, 
  Save, 
  Download, 
  MapPin, 
  Heart, 
  AlertTriangle, 
  Target,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface JourneyStage {
  name: string;
  touchpoints: string[];
  userActions: string[];
  emotions: EmotionPoint[];
  painPoints: string[];
  opportunities: string[];
  empathyMapLinks: string[];
}

export interface EmotionPoint {
  timestamp: number; // Position in stage (0-100)
  emotion: 'frustrated' | 'confused' | 'satisfied' | 'delighted' | 'neutral';
  intensity: number; // 1-5
  notes: string;
}

export interface UserJourneyMapData {
  id: string;
  journeyName: string;
  stages: JourneyStage[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserJourneyMapBuilderProps {
  projectId: string;
  initialData?: UserJourneyMapData;
  onSave: (data: UserJourneyMapData) => void;
  onExport?: (data: UserJourneyMapData) => void;
}

const emotionColors = {
  frustrated: '#ef4444',
  confused: '#f59e0b',
  neutral: '#6b7280',
  satisfied: '#10b981',
  delighted: '#8b5cf6'
};

const emotionIcons = {
  frustrated: AlertTriangle,
  confused: Minus,
  neutral: Target,
  satisfied: TrendingUp,
  delighted: Heart
};

export function UserJourneyMapBuilder({ 
  projectId, 
  initialData, 
  onSave, 
  onExport 
}: UserJourneyMapBuilderProps) {
  const [data, setData] = useState<UserJourneyMapData>(
    initialData || {
      id: '',
      journeyName: '',
      stages: []
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const addStage = () => {
    const newStage: JourneyStage = {
      name: '',
      touchpoints: [],
      userActions: [],
      emotions: [],
      painPoints: [],
      opportunities: [],
      empathyMapLinks: []
    };
    
    setData(prev => ({
      ...prev,
      stages: [...prev.stages, newStage]
    }));
  };

  const updateStage = (index: number, field: keyof JourneyStage, value: any) => {
    setData(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => 
        i === index ? { ...stage, [field]: value } : stage
      )
    }));
  };

  const removeStage = (index: number) => {
    setData(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index)
    }));
  };

  const addArrayItem = (stageIndex: number, field: keyof JourneyStage, item: string) => {
    if (item.trim()) {
      setData(prev => ({
        ...prev,
        stages: prev.stages.map((stage, i) => 
          i === stageIndex 
            ? { ...stage, [field]: [...(stage[field] as string[]), item.trim()] }
            : stage
        )
      }));
    }
  };

  const removeArrayItem = (stageIndex: number, field: keyof JourneyStage, itemIndex: number) => {
    setData(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => 
        i === stageIndex 
          ? { 
              ...stage, 
              [field]: (stage[field] as string[]).filter((_, idx) => idx !== itemIndex)
            }
          : stage
      )
    }));
  };

  const addEmotionPoint = (stageIndex: number, emotion: EmotionPoint) => {
    setData(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => 
        i === stageIndex 
          ? { ...stage, emotions: [...stage.emotions, emotion] }
          : stage
      )
    }));
  };

  const removeEmotionPoint = (stageIndex: number, emotionIndex: number) => {
    setData(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => 
        i === stageIndex 
          ? { 
              ...stage, 
              emotions: stage.emotions.filter((_, idx) => idx !== emotionIndex)
            }
          : stage
      )
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving journey map:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(data);
    }
  };

  const getEmotionChartData = () => {
    const chartData: any[] = [];
    
    data.stages.forEach((stage, stageIndex) => {
      stage.emotions.forEach(emotion => {
        chartData.push({
          stage: stage.name || `Stage ${stageIndex + 1}`,
          timestamp: emotion.timestamp,
          emotion: emotion.emotion,
          intensity: emotion.intensity,
          notes: emotion.notes
        });
      });
    });
    
    return chartData;
  };

  const getTotalItems = () => {
    return data.stages.reduce((total, stage) => {
      return total + 
        stage.touchpoints.length + 
        stage.userActions.length + 
        stage.painPoints.length + 
        stage.opportunities.length +
        stage.emotions.length;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Journey Map Builder</h2>
          <p className="text-gray-600 mt-1">
            Map your user's experience from start to finish to identify pain points and opportunities
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

      {/* Journey Name Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Journey Name
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Describe the user journey (e.g., 'New customer onboarding', 'Product purchase flow')"
            value={data.journeyName}
            onChange={(e) => setData(prev => ({ ...prev, journeyName: e.target.value }))}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          {getTotalItems()} items
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {data.stages.length} stages
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          {data.journeyName ? 'Named' : 'Unnamed'}
        </Badge>
      </div>

      {/* Emotion Curve Visualization */}
      {data.stages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Emotion Curve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getEmotionChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Intensity']}
                    labelFormatter={(label) => `Stage: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journey Stages */}
      <div className="space-y-4">
        {data.stages.map((stage, stageIndex) => (
          <Card key={stageIndex} className="border-2 border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Stage {stageIndex + 1}</Badge>
                  <Input
                    placeholder="Stage name (e.g., 'Awareness', 'Consideration', 'Purchase')"
                    value={stage.name}
                    onChange={(e) => updateStage(stageIndex, 'name', e.target.value)}
                    className="font-semibold"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStage(stageIndex)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Touchpoints */}
              <div>
                <h4 className="font-medium mb-2">Touchpoints</h4>
                <div className="space-y-2">
                  {stage.touchpoints.map((touchpoint, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm bg-blue-100 px-2 py-1 rounded">{touchpoint}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeArrayItem(stageIndex, 'touchpoints', idx)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add touchpoint..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem(stageIndex, 'touchpoints', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addArrayItem(stageIndex, 'touchpoints', input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* User Actions */}
              <div>
                <h4 className="font-medium mb-2">User Actions</h4>
                <div className="space-y-2">
                  {stage.userActions.map((action, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm bg-green-100 px-2 py-1 rounded">{action}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeArrayItem(stageIndex, 'userActions', idx)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add user action..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem(stageIndex, 'userActions', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addArrayItem(stageIndex, 'userActions', input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Emotions */}
              <div>
                <h4 className="font-medium mb-2">Emotions</h4>
                <div className="space-y-2">
                  {stage.emotions.map((emotion, idx) => {
                    const Icon = emotionIcons[emotion.emotion];
                    return (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Icon className="w-4 h-4" style={{ color: emotionColors[emotion.emotion] }} />
                        <span className="text-sm font-medium">{emotion.emotion}</span>
                        <span className="text-sm text-gray-600">Intensity: {emotion.intensity}/5</span>
                        <span className="text-sm text-gray-500">{emotion.notes}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeEmotionPoint(stageIndex, idx)}
                          className="h-6 w-6 p-0 ml-auto"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })}
                  <div className="flex gap-2">
                    <select 
                      className="px-3 py-2 border rounded"
                      onChange={(e) => {
                        const emotion = e.target.value as EmotionPoint['emotion'];
                        if (emotion) {
                          addEmotionPoint(stageIndex, {
                            timestamp: 50,
                            emotion,
                            intensity: 3,
                            notes: ''
                          });
                        }
                      }}
                    >
                      <option value="">Select emotion...</option>
                      <option value="frustrated">Frustrated</option>
                      <option value="confused">Confused</option>
                      <option value="neutral">Neutral</option>
                      <option value="satisfied">Satisfied</option>
                      <option value="delighted">Delighted</option>
                    </select>
                    <Button
                      size="sm"
                      onClick={() => {
                        const select = document.querySelector('select') as HTMLSelectElement;
                        const emotion = select.value as EmotionPoint['emotion'];
                        if (emotion) {
                          addEmotionPoint(stageIndex, {
                            timestamp: 50,
                            emotion,
                            intensity: 3,
                            notes: ''
                          });
                        }
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Pain Points */}
              <div>
                <h4 className="font-medium mb-2">Pain Points</h4>
                <div className="space-y-2">
                  {stage.painPoints.map((pain, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm bg-red-100 px-2 py-1 rounded">{pain}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeArrayItem(stageIndex, 'painPoints', idx)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add pain point..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem(stageIndex, 'painPoints', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addArrayItem(stageIndex, 'painPoints', input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Opportunities */}
              <div>
                <h4 className="font-medium mb-2">Opportunities</h4>
                <div className="space-y-2">
                  {stage.opportunities.map((opportunity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-sm bg-emerald-100 px-2 py-1 rounded">{opportunity}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeArrayItem(stageIndex, 'opportunities', idx)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add opportunity..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem(stageIndex, 'opportunities', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addArrayItem(stageIndex, 'opportunities', input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Stage Button */}
      <Button onClick={addStage} className="w-full" variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Add Journey Stage
      </Button>

      {/* Tips and Guidance */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Better Journey Maps</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Start with the user's perspective, not your product</li>
            <li>• Include both digital and physical touchpoints</li>
            <li>• Focus on emotions and feelings, not just actions</li>
            <li>• Identify the most critical pain points for improvement</li>
            <li>• Look for opportunities to delight users</li>
            <li>• Base insights on real user research, not assumptions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
