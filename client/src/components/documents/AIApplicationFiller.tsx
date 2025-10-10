import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Zap, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  FileText, 
  Sparkles, 
  Wand2, 
  ArrowRight, 
  Download, 
  Share2, 
  Eye, 
  Edit, 
  Plus, 
  RefreshCw, 
  Settings, 
  ExternalLink,
  Clock,
  Users,
  DollarSign,
  Award,
  Lightbulb,
  BarChart3
} from 'lucide-react';

interface AIApplicationFillerProps {
  documentId?: string;
  documentContent?: any;
}

export default function AIApplicationFiller({ documentId, documentContent }: AIApplicationFillerProps) {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [readinessAnalysis, setReadinessAnalysis] = useState<any>(null);
  const [filledApplication, setFilledApplication] = useState<any>(null);
  const [selectedApplicationType, setSelectedApplicationType] = useState<string>('accelerator');
  const [aiStatus, setAiStatus] = useState<{ available: boolean; message: string } | null>(null);

  // Check AI service status on mount
  React.useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const response = await fetch('/api/documents/ai/status');
      const data = await response.json();
      setAiStatus(data);
    } catch (error) {
      console.error('Error checking AI status:', error);
      setAiStatus({ available: false, message: 'Failed to check AI status' });
    }
  };

  const analyzeReadiness = async () => {
    if (!aiStatus?.available) {
      toast({
        title: 'AI Services Unavailable',
        description: aiStatus?.message || 'AI services are not configured',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch(`/api/documents/ai/${documentId}/analyze-readiness`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationType: selectedApplicationType,
          documentContent
        })
      });

      if (!response.ok) throw new Error('Failed to analyze document');

      const analysis = await response.json();
      setReadinessAnalysis(analysis);
      
      toast({
        title: 'Analysis Complete',
        description: `Readiness score: ${analysis.readinessScore}%`
      });
    } catch (error) {
      console.error('Error analyzing readiness:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze document readiness',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fillApplication = async () => {
    if (!aiStatus?.available) {
      toast({
        title: 'AI Services Unavailable',
        description: aiStatus?.message || 'AI services are not configured',
        variant: 'destructive'
      });
      return;
    }

    setIsFilling(true);
    try {
      // Mock application form for demonstration
      const mockForm = {
        id: 'demo-form',
        name: `${selectedApplicationType} Application`,
        type: selectedApplicationType,
        organization: 'Demo Organization',
        sections: [
          {
            id: 'company-info',
            title: 'Company Information',
            fields: [
              { id: 'company-name', label: 'Company Name', type: 'text' as const, required: true },
              { id: 'description', label: 'Description', type: 'textarea' as const, required: true }
            ]
          }
        ]
      };

      const response = await fetch(`/api/documents/ai/${documentId}/fill-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: mockForm,
          documentContent
        })
      });

      if (!response.ok) throw new Error('Failed to fill application');

      const filled = await response.json();
      setFilledApplication(filled);
      
      toast({
        title: 'Application Filled',
        description: `Completeness: ${filled.completeness}%, Match Score: ${filled.matchScore}%`
      });
    } catch (error) {
      console.error('Error filling application:', error);
      toast({
        title: 'Fill Failed',
        description: 'Failed to fill application',
        variant: 'destructive'
      });
    } finally {
      setIsFilling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Status Banner */}
      {aiStatus && (
        <Card className={`border-2 ${aiStatus.available ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {aiStatus.available ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <p className={`font-medium ${aiStatus.available ? 'text-green-800' : 'text-yellow-800'}`}>
                  {aiStatus.available ? 'AI Services Active' : 'AI Services Unavailable'}
                </p>
                <p className={`text-sm ${aiStatus.available ? 'text-green-600' : 'text-yellow-600'}`}>
                  {aiStatus.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            AI-Powered Application Filling
          </CardTitle>
          <CardDescription>
            Automatically fill applications using your document data with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="application-type">Application Type</Label>
            <Select value={selectedApplicationType} onValueChange={setSelectedApplicationType}>
              <SelectTrigger id="application-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accelerator">Accelerator Program</SelectItem>
                <SelectItem value="grant">Grant Application</SelectItem>
                <SelectItem value="competition">Startup Competition</SelectItem>
                <SelectItem value="investment">Investment Pitch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={analyzeReadiness} 
              disabled={isAnalyzing || !aiStatus?.available}
              variant="outline"
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyze Readiness
                </>
              )}
            </Button>
            <Button 
              onClick={fillApplication} 
              disabled={isFilling || !aiStatus?.available}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {isFilling ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Filling...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Fill Application
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Readiness Analysis Results */}
      {readinessAnalysis && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Application Readiness Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Readiness Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Readiness</span>
                <span className="text-2xl font-bold text-blue-600">{readinessAnalysis.readinessScore}%</span>
              </div>
              <Progress value={readinessAnalysis.readinessScore} className="h-3" />
            </div>

            {/* Missing Fields */}
            {readinessAnalysis.missingFields.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Missing Information ({readinessAnalysis.missingFields.length})
                </h4>
                <div className="space-y-1">
                  {readinessAnalysis.missingFields.map((field: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths */}
            {readinessAnalysis.strengths.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Strengths ({readinessAnalysis.strengths.length})
                </h4>
                <div className="space-y-1">
                  {readinessAnalysis.strengths.map((strength: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      {strength}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements */}
            {readinessAnalysis.improvements.length > 0 && (
              <div>
                <h4 className="font-semibold text-yellow-600 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Suggested Improvements ({readinessAnalysis.improvements.length})
                </h4>
                <div className="space-y-1">
                  {readinessAnalysis.improvements.map((improvement: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                      {improvement}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {readinessAnalysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Recommendations ({readinessAnalysis.recommendations.length})
                </h4>
                <div className="space-y-1">
                  {readinessAnalysis.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      {recommendation}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filled Application Results */}
      {filledApplication && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              AI-Filled Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{filledApplication.completeness}%</div>
                <div className="text-sm text-gray-600">Completeness</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{filledApplication.matchScore}%</div>
                <div className="text-sm text-gray-600">Match Score</div>
              </div>
            </div>

            {/* Suggestions */}
            {filledApplication.suggestions && filledApplication.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">AI Suggestions</h4>
                <div className="space-y-3">
                  {filledApplication.suggestions.map((suggestion: any, index: number) => (
                    <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-800">{suggestion.suggestion}</p>
                          <p className="text-xs text-yellow-700 mt-1">{suggestion.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
