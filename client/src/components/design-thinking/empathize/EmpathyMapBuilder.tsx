import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, Download, Users, Lightbulb, Eye, Ear, AlertTriangle, Target } from 'lucide-react';

export interface EmpathyMapData {
  id: string;
  userPersona: string;
  thinkAndFeel: string[];
  sayAndDo: string[];
  see: string[];
  hear: string[];
  pains: string[];
  gains: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmpathyMapBuilderProps {
  projectId: string;
  initialData?: EmpathyMapData;
  onSave: (data: EmpathyMapData) => void;
  onExport?: (data: EmpathyMapData) => void;
}

const quadrants = [
  { 
    key: 'thinkAndFeel', 
    title: 'Think & Feel', 
    icon: Lightbulb,
    color: 'bg-blue-50', 
    borderColor: 'border-blue-200',
    description: 'Internal thoughts and emotions'
  },
  { 
    key: 'sayAndDo', 
    title: 'Say & Do', 
    icon: Users,
    color: 'bg-green-50', 
    borderColor: 'border-green-200',
    description: 'Observable behaviors'
  },
  { 
    key: 'see', 
    title: 'See', 
    icon: Eye,
    color: 'bg-yellow-50', 
    borderColor: 'border-yellow-200',
    description: 'Environmental context'
  },
  { 
    key: 'hear', 
    title: 'Hear', 
    icon: Ear,
    color: 'bg-purple-50', 
    borderColor: 'border-purple-200',
    description: 'Influencers and information sources'
  },
  { 
    key: 'pains', 
    title: 'Pains', 
    icon: AlertTriangle,
    color: 'bg-red-50', 
    borderColor: 'border-red-200',
    description: 'Frustrations and obstacles'
  },
  { 
    key: 'gains', 
    title: 'Gains', 
    icon: Target,
    color: 'bg-emerald-50', 
    borderColor: 'border-emerald-200',
    description: 'Goals and desired outcomes'
  }
];

export function EmpathyMapBuilder({ 
  projectId, 
  initialData, 
  onSave, 
  onExport 
}: EmpathyMapBuilderProps) {
  const [data, setData] = useState<EmpathyMapData>(
    initialData || {
      id: '',
      userPersona: '',
      thinkAndFeel: [],
      sayAndDo: [],
      see: [],
      hear: [],
      pains: [],
      gains: []
    }
  );

  const [newItem, setNewItem] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const addItem = (quadrant: string) => {
    const item = newItem[quadrant]?.trim();
    if (item) {
      setData(prev => {
        const currentQuadrant = prev[quadrant as keyof EmpathyMapData];
        if (Array.isArray(currentQuadrant)) {
          return {
            ...prev,
            [quadrant]: [...(currentQuadrant as string[]), item]
          };
        }
        return prev;
      });
      setNewItem(prev => ({ ...prev, [quadrant]: '' }));
    }
  };

  const removeItem = (quadrant: string, index: number) => {
    setData(prev => ({
      ...prev,
      [quadrant]: (prev[quadrant as keyof EmpathyMapData] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving empathy map:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(data);
    }
  };

  const getTotalItems = () => {
    return Object.values(data).reduce((total, items) => {
      return total + (Array.isArray(items) ? items.length : 0);
    }, 0);
  };

  const getQuadrantItems = (quadrant: string) => {
    return data[quadrant as keyof EmpathyMapData] as string[];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Empathy Map Builder</h2>
          <p className="text-gray-600 mt-1">
            Understand your users deeply by mapping their thoughts, feelings, and experiences
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

      {/* User Persona Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Persona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Describe your target user (e.g., 'Busy working parent', 'Tech-savvy student')"
            value={data.userPersona}
            onChange={(e) => setData(prev => ({ ...prev, userPersona: e.target.value }))}
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
          <Users className="w-3 h-3" />
          {data.userPersona ? 'Persona defined' : 'No persona'}
        </Badge>
      </div>

      {/* Empathy Map Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quadrants.map(quadrant => {
          const Icon = quadrant.icon;
          const items = getQuadrantItems(quadrant.key);
          
          return (
            <Card key={quadrant.key} className={`${quadrant.color} ${quadrant.borderColor}`}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {quadrant.title}
                </CardTitle>
                <p className="text-sm text-gray-600">{quadrant.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Existing Items */}
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <span className="text-sm flex-1">{item}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(quadrant.key, index)}
                        className="h-6 w-6 p-0 hover:bg-red-100"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Add New Item */}
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Add ${quadrant.title.toLowerCase()}...`}
                      value={newItem[quadrant.key] || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, [quadrant.key]: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && addItem(quadrant.key)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => addItem(quadrant.key)}
                      className="flex items-center gap-1"
                      disabled={!newItem[quadrant.key]?.trim()}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips and Guidance */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Better Empathy Maps</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Base your insights on real user research, not assumptions</li>
            <li>• Be specific and concrete rather than generic</li>
            <li>• Include both positive and negative emotions</li>
            <li>• Consider the user's environment and context</li>
            <li>• Focus on what the user actually does, not what you want them to do</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
