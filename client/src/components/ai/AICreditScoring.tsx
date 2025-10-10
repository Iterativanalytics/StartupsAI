import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  BarChart,
  PieChart,
  LineChart,
  Zap,
  Star,
  Award,
  Clock,
  DollarSign,
  CreditCard,
  Wallet,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info,
  Lightbulb,
  Settings,
  Download,
  RefreshCw,
  Eye,
  Lock,
  ExternalLink
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AICreditScore {
  overallScore: number;
  scoreRange: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  factors: {
    paymentHistory: number;
    creditUtilization: number;
    creditHistory: number;
    creditMix: number;
    newCredit: number;
    alternativeData: number;
    behavioralData: number;
    economicFactors: number;
  };
  recommendations: string[];
  nextSteps: string[];
  modelVersion: string;
  lastUpdated: string;
}

interface RiskPrediction {
  defaultProbability: number;
  riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  riskScore: number;
  confidence: number;
  timeHorizon: number;
  keyRiskFactors: string[];
  riskMitigationStrategies: string[];
  monitoringRecommendations: string[];
  modelVersion: string;
  lastUpdated: string;
}

export default function AICreditScoring() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock data for demonstration
  const mockAIScore: AICreditScore = {
    overallScore: 823,
    scoreRange: "Exceptional",
    confidence: 0.94,
    riskLevel: "low",
    factors: {
      paymentHistory: 95,
      creditUtilization: 88,
      creditHistory: 82,
      creditMix: 75,
      newCredit: 90,
      alternativeData: 85,
      behavioralData: 78,
      economicFactors: 72
    },
    recommendations: [
      "Maintain your excellent payment history",
      "Keep credit utilization below 10%",
      "Consider diversifying your credit mix",
      "Monitor your credit reports regularly",
      "Continue building positive credit history"
    ],
    nextSteps: [
      "Apply for premium credit products",
      "Consider investment opportunities",
      "Help others improve their credit",
      "Review financial goals quarterly",
      "Stay informed about credit best practices"
    ],
    modelVersion: "AI-Credit-Scorer-v2.1",
    lastUpdated: "2024-01-15"
  };

  const mockRiskPrediction: RiskPrediction = {
    defaultProbability: 0.08,
    riskLevel: "low",
    riskScore: 15,
    confidence: 0.91,
    timeHorizon: 36,
    keyRiskFactors: [
      "High credit utilization on one account",
      "Recent credit inquiry",
      "Economic uncertainty"
    ],
    riskMitigationStrategies: [
      "Pay down high-utilization credit cards",
      "Avoid new credit applications for 6 months",
      "Build emergency fund to 6 months expenses"
    ],
    monitoringRecommendations: [
      "Monitor credit score monthly",
      "Set up payment reminders",
      "Review spending patterns weekly"
    ],
    modelVersion: "Credit-Risk-Predictor-v2.0",
    lastUpdated: "2024-01-15"
  };

  // Fetch AI credit score
  const { data: aiScore, isLoading: scoreLoading } = useQuery<AICreditScore>({
    queryKey: ['ai-credit-score'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockAIScore;
    }
  });

  // Fetch risk prediction
  const { data: riskPrediction, isLoading: riskLoading } = useQuery<RiskPrediction>({
    queryKey: ['risk-prediction'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockRiskPrediction;
    }
  });

  const analyzeCreditMutation = useMutation({
    mutationFn: async () => {
      setIsAnalyzing(true);
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      setIsAnalyzing(false);
    }
  });

  const getScoreColor = (score: number) => {
    if (score >= 800) return "text-purple-600";
    if (score >= 740) return "text-green-600";
    if (score >= 670) return "text-blue-600";
    if (score >= 580) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'very_low': return "text-green-600";
      case 'low': return "text-blue-600";
      case 'medium': return "text-yellow-600";
      case 'high': return "text-orange-600";
      case 'very_high': return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'very_low': return "bg-green-100 text-green-700";
      case 'low': return "bg-blue-100 text-blue-700";
      case 'medium': return "bg-yellow-100 text-yellow-700";
      case 'high': return "bg-orange-100 text-orange-700";
      case 'very_high': return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (scoreLoading || riskLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your credit profile with AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
                <Brain className="h-10 w-10 text-purple-600" />
                AI Credit Scoring
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Advanced AI-powered credit assessment and risk prediction
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => analyzeCreditMutation.mutate()}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">AI Credit Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(aiScore?.overallScore || 0)}`}>
                      {aiScore?.overallScore || 0}
                    </p>
                    <p className="text-xs text-gray-500">{aiScore?.scoreRange}</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Default Risk</p>
                    <p className="text-2xl font-bold text-green-600">
                      {((riskPrediction?.defaultProbability || 0) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">Low Risk</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {((aiScore?.confidence || 0) * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500">High Confidence</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Model Version</p>
                    <p className="text-lg font-bold text-teal-600">
                      v2.1
                    </p>
                    <p className="text-xs text-gray-500">Latest AI Model</p>
                  </div>
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Award className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="factors" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Score Factors
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Risk Analysis
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Recommendations
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Credit Score Overview */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Credit Score Analysis
                  </CardTitle>
                  <CardDescription>
                    Advanced AI-powered credit assessment using 50+ data points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="relative w-48 h-48 mx-auto mb-4">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="12"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="12"
                          strokeDasharray={`${(aiScore?.overallScore || 0) * 2.51} 502`}
                          strokeDashoffset="125.6"
                          strokeLinecap="round"
                          transform="rotate(-90 100 100)"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                        <text
                          x="100"
                          y="100"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-3xl font-bold fill-gray-800"
                        >
                          {aiScore?.overallScore}
                        </text>
                        <text
                          x="100"
                          y="120"
                          textAnchor="middle"
                          className="text-sm fill-gray-600"
                        >
                          {aiScore?.scoreRange}
                        </text>
                      </svg>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Excellent
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700">
                        <Target className="h-3 w-3 mr-1" />
                        {((aiScore?.confidence || 0) * 100).toFixed(0)}% Confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your AI-enhanced credit score is in the exceptional range
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Model Version</span>
                      <Badge variant="outline">{aiScore?.modelVersion}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Updated</span>
                      <span className="text-sm text-gray-600">{aiScore?.lastUpdated}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Data Points Analyzed</span>
                      <span className="text-sm text-gray-600">50+ factors</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Prediction Overview */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Risk Prediction
                  </CardTitle>
                  <CardDescription>
                    AI-powered default risk assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {((riskPrediction?.defaultProbability || 0) * 100).toFixed(1)}%
                    </div>
                    <Badge className={`${getRiskBadgeColor(riskPrediction?.riskLevel || 'low')} mb-2`}>
                      {riskPrediction?.riskLevel?.toUpperCase().replace('_', ' ')} RISK
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Default probability over next {riskPrediction?.timeHorizon} months
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Risk Score</span>
                      <span className="text-sm font-bold text-green-600">
                        {riskPrediction?.riskScore}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Confidence</span>
                      <span className="text-sm text-gray-600">
                        {((riskPrediction?.confidence || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Time Horizon</span>
                      <span className="text-sm text-gray-600">
                        {riskPrediction?.timeHorizon} months
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Insights */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Excellent Credit Health</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      Your AI credit score of {aiScore?.overallScore} places you in the top 20% of credit scores nationwide.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Low Default Risk</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your default probability of {((riskPrediction?.defaultProbability || 0) * 100).toFixed(1)}% is well below the average.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">AI-Enhanced Analysis</h4>
                    </div>
                    <p className="text-sm text-purple-700">
                      Our AI model analyzed 50+ factors including alternative data and behavioral patterns.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Score Factors Tab */}
          <TabsContent value="factors" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-blue-600" />
                  Credit Score Factors
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of how your AI credit score was calculated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Traditional Factors */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-800">Traditional Credit Factors (70%)</h4>
                    <div className="space-y-4">
                      {[
                        { name: "Payment History", score: aiScore?.factors.paymentHistory || 0, weight: 35, description: "On-time payment record" },
                        { name: "Credit Utilization", score: aiScore?.factors.creditUtilization || 0, weight: 30, description: "Amount of credit used vs. available" },
                        { name: "Credit History", score: aiScore?.factors.creditHistory || 0, weight: 15, description: "Length of credit history" },
                        { name: "Credit Mix", score: aiScore?.factors.creditMix || 0, weight: 10, description: "Variety of credit types" },
                        { name: "New Credit", score: aiScore?.factors.newCredit || 0, weight: 10, description: "Recent credit applications" }
                      ].map((factor, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{factor.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {factor.weight}% weight
                              </Badge>
                            </div>
                            <span className="font-semibold text-lg">
                              {factor.score}/100
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{factor.description}</p>
                          <Progress value={factor.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI-Enhanced Factors */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-800">AI-Enhanced Factors (30%)</h4>
                    <div className="space-y-4">
                      {[
                        { name: "Alternative Data", score: aiScore?.factors.alternativeData || 0, weight: 20, description: "Income patterns, spending behavior, digital footprint" },
                        { name: "Behavioral Data", score: aiScore?.factors.behavioralData || 0, weight: 10, description: "Financial habits and decision patterns" }
                      ].map((factor, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{factor.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {factor.weight}% weight
                              </Badge>
                            </div>
                            <span className="font-semibold text-lg">
                              {factor.score}/100
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{factor.description}</p>
                          <Progress value={factor.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Factors */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Key Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {riskPrediction?.keyRiskFactors.map((factor, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-orange-800">{factor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Mitigation Strategies */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Risk Mitigation Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {riskPrediction?.riskMitigationStrategies.map((strategy, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-800">{strategy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monitoring Recommendations */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Monitoring Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {riskPrediction?.monitoringRecommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">{rec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Recommendations */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiScore?.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">{rec}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiScore?.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <Target className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-purple-800">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Take Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="w-full" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply for Credit
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Set Goals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
