import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Download, 
  Target, 
  Users, 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Quote
} from 'lucide-react';

export interface POVStatementData {
  id: string;
  user: string;
  need: string;
  insight: string;
  supportingEvidence: {
    empathyMapIds: string[];
    journeyMapIds: string[];
    interviewQuotes: string[];
  };
  validated: boolean;
  validationNotes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface POVStatementBuilderProps {
  projectId: string;
  initialData?: POVStatementData;
  onSave: (data: POVStatementData) => void;
  onExport?: (data: POVStatementData) => void;
  empathyMaps?: Array<{ id: string; userPersona: string }>;
  journeyMaps?: Array<{ id: string; journeyName: string }>;
}

const povTemplate = {
  user: "The [specific user type]",
  need: "needs [verb-based need]",
  insight: "because [surprising insight from research]"
};

const validationRules = {
  user: {
    good: ["Specific persona", "Not generic", "Based on research"],
    bad: ["Generic terms like 'users'", "Too broad", "Not research-based"]
  },
  need: {
    good: ["Verb-based", "Emotional need", "Not a solution"],
    bad: ["Solution-focused", "Product features", "Technology-specific"]
  },
  insight: {
    good: ["Surprising", "Research-based", "Emotional", "Unexpected"],
    bad: ["Obvious", "Assumption-based", "Generic", "Not validated"]
  }
};

export function POVStatementBuilder({ 
  projectId, 
  initialData, 
  onSave, 
  onExport,
  empathyMaps = [],
  journeyMaps = []
}: POVStatementBuilderProps) {
  const [data, setData] = useState<POVStatementData>(
    initialData || {
      id: '',
      user: '',
      need: '',
      insight: '',
      supportingEvidence: {
        empathyMapIds: [],
        journeyMapIds: [],
        interviewQuotes: []
      },
      validated: false,
      validationNotes: ''
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    user: { score: number; issues: string[] };
    need: { score: number; issues: string[] };
    insight: { score: number; issues: string[] };
  }>({
    user: { score: 0, issues: [] },
    need: { score: 0, issues: [] },
    insight: { score: 0, issues: [] }
  });

  const [newQuote, setNewQuote] = useState('');

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    validatePOV();
  }, [data.user, data.need, data.insight]);

  const validatePOV = () => {
    const userValidation = validateField('user', data.user);
    const needValidation = validateField('need', data.need);
    const insightValidation = validateField('insight', data.insight);

    setValidationResults({
      user: userValidation,
      need: needValidation,
      insight: insightValidation
    });
  };

  const validateField = (field: 'user' | 'need' | 'insight', value: string) => {
    const rules = validationRules[field];
    const issues: string[] = [];
    let score = 100;

    // Check for bad patterns
    if (field === 'user') {
      if (value.toLowerCase().includes('user') || value.toLowerCase().includes('customer')) {
        issues.push('Too generic - be more specific');
        score -= 30;
      }
      if (value.length < 10) {
        issues.push('Too vague - add more detail');
        score -= 20;
      }
    }

    if (field === 'need') {
      if (value.toLowerCase().includes('app') || value.toLowerCase().includes('platform') || value.toLowerCase().includes('system')) {
        issues.push('Solution-focused - focus on the need, not the solution');
        score -= 40;
      }
      if (!value.includes(' ')) {
        issues.push('Too simple - expand on the need');
        score -= 20;
      }
    }

    if (field === 'insight') {
      if (value.length < 20) {
        issues.push('Too short - add more depth');
        score -= 30;
      }
      if (value.toLowerCase().includes('obvious') || value.toLowerCase().includes('clear')) {
        issues.push('Not surprising enough - find unexpected insights');
        score -= 25;
      }
    }

    return { score: Math.max(0, score), issues };
  };

  const addQuote = () => {
    if (newQuote.trim()) {
      setData(prev => ({
        ...prev,
        supportingEvidence: {
          ...prev.supportingEvidence,
          interviewQuotes: [...prev.supportingEvidence.interviewQuotes, newQuote.trim()]
        }
      }));
      setNewQuote('');
    }
  };

  const removeQuote = (index: number) => {
    setData(prev => ({
      ...prev,
      supportingEvidence: {
        ...prev.supportingEvidence,
        interviewQuotes: prev.supportingEvidence.interviewQuotes.filter((_, i) => i !== index)
      }
    }));
  };

  const toggleEmpathyMap = (mapId: string) => {
    setData(prev => ({
      ...prev,
      supportingEvidence: {
        ...prev.supportingEvidence,
        empathyMapIds: prev.supportingEvidence.empathyMapIds.includes(mapId)
          ? prev.supportingEvidence.empathyMapIds.filter(id => id !== mapId)
          : [...prev.supportingEvidence.empathyMapIds, mapId]
      }
    }));
  };

  const toggleJourneyMap = (mapId: string) => {
    setData(prev => ({
      ...prev,
      supportingEvidence: {
        ...prev.supportingEvidence,
        journeyMapIds: prev.supportingEvidence.journeyMapIds.includes(mapId)
          ? prev.supportingEvidence.journeyMapIds.filter(id => id !== mapId)
          : [...prev.supportingEvidence.journeyMapIds, mapId]
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving POV statement:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(data);
    }
  };

  const getOverallScore = () => {
    const scores = Object.values(validationResults);
    return Math.round(scores.reduce((sum, result) => sum + result.score, 0) / scores.length);
  };

  const getValidationColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getValidationIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return AlertTriangle;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">POV Statement Builder</h2>
          <p className="text-gray-600 mt-1">
            Define your problem statement using the formula: [User] needs [Need] because [Insight]
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

      {/* POV Template */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Target className="w-5 h-5" />
            POV Statement Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-medium text-blue-800">
            <span className="text-blue-600">[User]</span> needs <span className="text-blue-600">[Need]</span> because <span className="text-blue-600">[Insight]</span>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            Fill in each part with specific, research-based information from your empathy work.
          </p>
        </CardContent>
      </Card>

      {/* POV Statement Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User
            </CardTitle>
            <p className="text-sm text-gray-600">Who is your specific user?</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe your specific user persona (e.g., 'Busy working parent who struggles with meal planning')"
              value={data.user}
              onChange={(e) => setData(prev => ({ ...prev, user: e.target.value }))}
              className="min-h-[100px]"
            />
            
            {/* Validation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {React.createElement(getValidationIcon(validationResults.user.score), {
                  className: `w-4 h-4 ${getValidationColor(validationResults.user.score)}`
                })}
                <span className={`text-sm font-medium ${getValidationColor(validationResults.user.score)}`}>
                  Score: {validationResults.user.score}/100
                </span>
              </div>
              
              {validationResults.user.issues.length > 0 && (
                <div className="text-sm text-red-600">
                  <p className="font-medium">Issues:</p>
                  <ul className="list-disc list-inside">
                    {validationResults.user.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Need */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Need
            </CardTitle>
            <p className="text-sm text-gray-600">What do they need to do?</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe the user's need (e.g., 'to quickly plan healthy meals for their family')"
              value={data.need}
              onChange={(e) => setData(prev => ({ ...prev, need: e.target.value }))}
              className="min-h-[100px]"
            />
            
            {/* Validation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {React.createElement(getValidationIcon(validationResults.need.score), {
                  className: `w-4 h-4 ${getValidationColor(validationResults.need.score)}`
                })}
                <span className={`text-sm font-medium ${getValidationColor(validationResults.need.score)}`}>
                  Score: {validationResults.need.score}/100
                </span>
              </div>
              
              {validationResults.need.issues.length > 0 && (
                <div className="text-sm text-red-600">
                  <p className="font-medium">Issues:</p>
                  <ul className="list-disc list-inside">
                    {validationResults.need.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Insight */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Insight
            </CardTitle>
            <p className="text-sm text-gray-600">What surprising insight did you discover?</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe the surprising insight (e.g., 'they feel guilty about not providing healthy meals but lack time to research recipes')"
              value={data.insight}
              onChange={(e) => setData(prev => ({ ...prev, insight: e.target.value }))}
              className="min-h-[100px]"
            />
            
            {/* Validation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {React.createElement(getValidationIcon(validationResults.insight.score), {
                  className: `w-4 h-4 ${getValidationColor(validationResults.insight.score)}`
                })}
                <span className={`text-sm font-medium ${getValidationColor(validationResults.insight.score)}`}>
                  Score: {validationResults.insight.score}/100
                </span>
              </div>
              
              {validationResults.insight.issues.length > 0 && (
                <div className="text-sm text-red-600">
                  <p className="font-medium">Issues:</p>
                  <ul className="list-disc list-inside">
                    {validationResults.insight.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complete POV Statement */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Your POV Statement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-medium text-gray-800 p-4 bg-white rounded border">
            {data.user || '[User]'} needs {data.need || '[Need]'} because {data.insight || '[Insight]'}
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Overall Score: {getOverallScore()}/100
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {data.validated ? 'Validated' : 'Not Validated'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Supporting Evidence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="w-5 h-5" />
            Supporting Evidence
          </CardTitle>
          <p className="text-sm text-gray-600">Link to your research and add supporting quotes</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Empathy Maps */}
          {empathyMaps.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Empathy Maps</h4>
              <div className="space-y-2">
                {empathyMaps.map(map => (
                  <label key={map.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={data.supportingEvidence.empathyMapIds.includes(map.id)}
                      onChange={() => toggleEmpathyMap(map.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{map.userPersona}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Journey Maps */}
          {journeyMaps.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Journey Maps</h4>
              <div className="space-y-2">
                {journeyMaps.map(map => (
                  <label key={map.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={data.supportingEvidence.journeyMapIds.includes(map.id)}
                      onChange={() => toggleJourneyMap(map.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{map.journeyName}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Interview Quotes */}
          <div>
            <h4 className="font-medium mb-2">Interview Quotes</h4>
            <div className="space-y-2">
              {data.supportingEvidence.interviewQuotes.map((quote, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <Quote className="w-4 h-4 mt-1 text-gray-500" />
                  <span className="text-sm flex-1">{quote}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeQuote(idx)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a supporting quote from user research..."
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addQuote} disabled={!newQuote.trim()}>
                  Add Quote
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips and Guidance */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Better POV Statements</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about your user - avoid generic terms like "users" or "customers"</li>
            <li>• Focus on needs, not solutions - avoid mentioning apps, platforms, or technology</li>
            <li>• Include surprising insights from your research - not obvious observations</li>
            <li>• Base everything on real user research, not assumptions</li>
            <li>• Make it emotional - include feelings and motivations</li>
            <li>• Keep it concise but meaningful</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
