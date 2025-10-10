import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AIApplicationFiller from './AIApplicationFiller';
import { 
  Brain, 
  Zap, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  FileText, 
  Sparkles, 
  Wand2, 
  Bot, 
  ArrowRight, 
  Copy, 
  Download, 
  Share2, 
  Eye, 
  Edit, 
  Plus, 
  Search, 
  BarChart3, 
  MessageSquare, 
  RefreshCw, 
  Settings, 
  ExternalLink,
  Globe,
  Lock,
  Unlock,
  Star,
  Award,
  Clock,
  Users,
  DollarSign,
  PieChart,
  LineChart
} from 'lucide-react';

interface DocumentAnalysis {
  id: string;
  documentId: string;
  overallScore: number;
  sections: AnalysisSection[];
  insights: DocumentInsight[];
  recommendations: Recommendation[];
  compliance: ComplianceCheck[];
  lastAnalyzed: string;
  aiConfidence: number;
}

interface AnalysisSection {
  id: string;
  title: string;
  score: number;
  wordCount: number;
  readabilityScore: number;
  completenessScore: number;
  suggestions: string[];
  aiGenerated: boolean;
}

interface DocumentInsight {
  id: string;
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  confidence: number;
}

interface Recommendation {
  id: string;
  type: 'content' | 'structure' | 'style' | 'compliance';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

interface ComplianceCheck {
  id: string;
  requirement: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  suggestion?: string;
}

// Mock data
const mockAnalysis: DocumentAnalysis = {
  id: '1',
  documentId: '1',
  overallScore: 87,
  sections: [
    {
      id: '1',
      title: 'Executive Summary',
      score: 92,
      wordCount: 250,
      readabilityScore: 85,
      completenessScore: 95,
      suggestions: ['Add more specific metrics', 'Include key differentiators'],
      aiGenerated: true
    },
    {
      id: '2',
      title: 'Market Analysis',
      score: 78,
      wordCount: 800,
      readabilityScore: 72,
      completenessScore: 85,
      suggestions: ['Add competitor analysis', 'Include market size data'],
      aiGenerated: false
    }
  ],
  insights: [
    {
      id: '1',
      type: 'strength',
      title: 'Strong Value Proposition',
      description: 'Clear articulation of unique value proposition',
      impact: 'high',
      actionable: false,
      confidence: 95
    },
    {
      id: '2',
      type: 'weakness',
      title: 'Missing Financial Projections',
      description: 'Financial section lacks detailed projections',
      impact: 'medium',
      actionable: true,
      confidence: 88
    }
  ],
  recommendations: [
    {
      id: '1',
      type: 'content',
      title: 'Add Financial Projections',
      description: 'Include 3-year financial projections with assumptions',
      priority: 'high',
      effort: 'medium',
      impact: 'high'
    }
  ],
  compliance: [
    {
      id: '1',
      requirement: 'Executive Summary Required',
      status: 'pass',
      description: 'Executive summary is present and comprehensive'
    },
    {
      id: '2',
      requirement: 'Financial Projections Required',
      status: 'fail',
      description: 'Financial projections are missing',
      suggestion: 'Add detailed financial projections for the next 3 years'
    }
  ],
  lastAnalyzed: '2024-01-15',
  aiConfidence: 92
};

export default function DocumentIntelligence() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis>(mockAnalysis);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return CheckCircle;
      case 'weakness': return AlertCircle;
      case 'opportunity': return TrendingUp;
      case 'threat': return AlertCircle;
      default: return Target;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'strength': return 'text-green-600';
      case 'weakness': return 'text-red-600';
      case 'opportunity': return 'text-blue-600';
      case 'threat': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Document Intelligence 🧠
          </h2>
          <p className="text-gray-600">
            AI-powered document analysis, insights, and optimization
          </p>
        </div>
        <Button onClick={handleAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Analyze Document
            </>
          )}
        </Button>
      </div>

      {/* Overall Score */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Overall Document Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold text-blue-600">{analysis.overallScore}%</div>
            <div className="text-right">
              <p className="text-sm text-gray-600">AI Confidence</p>
              <p className="text-lg font-semibold">{analysis.aiConfidence}%</p>
            </div>
          </div>
          <Progress value={analysis.overallScore} className="h-3 mb-2" />
          <p className="text-sm text-gray-600">
            Last analyzed: {analysis.lastAnalyzed}
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="ai-filler">AI Application Filler</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Readability Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">85</div>
                <p className="text-sm text-gray-600">Good readability</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Completeness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">92%</div>
                <p className="text-sm text-gray-600">Well structured</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Enhancement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">78%</div>
                <p className="text-sm text-gray-600">AI optimized</p>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.insights.slice(0, 3).map((insight) => {
                  const IconComponent = getInsightIcon(insight.type);
                  return (
                    <div key={insight.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <IconComponent className={`h-5 w-5 mt-0.5 ${getInsightColor(insight.type)}`} />
                      <div className="flex-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact} impact
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-4">
          {analysis.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getScoreColor(section.score)}`}>
                      {section.score}%
                    </span>
                    {section.aiGenerated && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        <Bot className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Word Count</p>
                    <p className="text-lg font-semibold">{section.wordCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Readability</p>
                    <p className="text-lg font-semibold">{section.readabilityScore}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completeness</p>
                    <p className="text-lg font-semibold">{section.completenessScore}%</p>
                  </div>
                </div>
                
                <Progress value={section.score} className="h-2" />
                
                {section.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">AI Suggestions:</h4>
                    <ul className="space-y-1">
                      {section.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.insights.map((insight) => {
              const IconComponent = getInsightIcon(insight.type);
              return (
                <Card key={insight.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <IconComponent className={`h-6 w-6 mt-1 ${getInsightColor(insight.type)}`} />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <CardDescription>{insight.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                      <div className="text-sm text-gray-500">
                        {insight.confidence}% confidence
                      </div>
                    </div>
                    {insight.actionable && (
                      <Button size="sm" className="mt-3 w-full">
                        <Wand2 className="h-4 w-4 mr-2" />
                        Take Action
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          {analysis.recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                    <CardDescription>{recommendation.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getImpactColor(recommendation.priority)}>
                      {recommendation.priority} priority
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Effort Required</p>
                    <p className="text-lg font-semibold capitalize">{recommendation.effort}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expected Impact</p>
                    <p className="text-lg font-semibold capitalize">{recommendation.impact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="text-lg font-semibold capitalize">{recommendation.type}</p>
                  </div>
                </div>
                <Button size="sm" className="w-full">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Implement Recommendation
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* AI Application Filler Tab */}
        <TabsContent value="ai-filler">
          <AIApplicationFiller 
            documentId={analysis.documentId}
            documentContent={mockAnalysis}
          />
        </TabsContent>
      </Tabs>

      {/* Compliance Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Compliance Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.compliance.map((check) => (
              <div key={check.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {check.status === 'pass' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : check.status === 'fail' ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  <div>
                    <p className="font-medium">{check.requirement}</p>
                    <p className="text-sm text-gray-600">{check.description}</p>
                    {check.suggestion && (
                      <p className="text-sm text-blue-600 mt-1">{check.suggestion}</p>
                    )}
                  </div>
                </div>
                <Badge className={
                  check.status === 'pass' ? 'bg-green-100 text-green-800' :
                  check.status === 'fail' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {check.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
