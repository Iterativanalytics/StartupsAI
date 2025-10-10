import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Users,
  Target,
  Lightbulb,
  Rocket,
  Building2,
  Globe,
  Zap,
  Download,
  Share2,
  Eye,
  Clock,
  Star,
  Award,
  Brain,
  Calculator,
  PieChart,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BusinessPlanQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'number' | 'textarea' | 'multi-select';
  options?: string[];
  required: boolean;
  category: string;
  aiPrompt?: string;
}

interface BusinessPlanSection {
  id: string;
  title: string;
  content: string;
  aiGenerated: boolean;
  completeness: number;
}

interface BusinessPlanTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  icon: React.ComponentType<any>;
  color: string;
  questions: BusinessPlanQuestion[];
  sections: BusinessPlanSection[];
}

function AIBusinessPlan() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<BusinessPlanSection[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Business Plan Templates inspired by VenturePlanner.ai
  const businessPlanTemplates: BusinessPlanTemplate[] = [
    {
      id: 'tech-startup',
      name: 'Tech Startup',
      description: 'AI-powered business plan for technology startups',
      industry: 'Technology',
      icon: Rocket,
      color: 'from-blue-500 to-purple-600',
      questions: [
        {
          id: 'company-name',
          question: 'What is your company name?',
          type: 'text',
          required: true,
          category: 'basic'
        },
        {
          id: 'problem-solving',
          question: 'What problem does your product/service solve?',
          type: 'textarea',
          required: true,
          category: 'problem',
          aiPrompt: 'Describe the core problem your startup addresses and why existing solutions are inadequate.'
        },
        {
          id: 'target-market',
          question: 'Who is your target market?',
          type: 'textarea',
          required: true,
          category: 'market',
          aiPrompt: 'Define your target customer segments, their characteristics, and market size.'
        },
        {
          id: 'revenue-model',
          question: 'How will you make money?',
          type: 'select',
          options: ['Subscription', 'One-time purchase', 'Freemium', 'Marketplace', 'Advertising'],
          required: true,
          category: 'business-model'
        },
        {
          id: 'funding-amount',
          question: 'How much funding are you seeking?',
          type: 'number',
          required: true,
          category: 'financials'
        }
      ],
      sections: [
        { id: 'executive-summary', title: 'Executive Summary', content: '', aiGenerated: false, completeness: 0 },
        { id: 'company-description', title: 'Company Description', content: '', aiGenerated: false, completeness: 0 },
        { id: 'market-analysis', title: 'Market Analysis', content: '', aiGenerated: false, completeness: 0 },
        { id: 'business-model', title: 'Business Model', content: '', aiGenerated: false, completeness: 0 },
        { id: 'financial-projections', title: 'Financial Projections', content: '', aiGenerated: false, completeness: 0 }
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Business',
      description: 'Comprehensive plan for online retail businesses',
      industry: 'E-commerce',
      icon: Globe,
      color: 'from-green-500 to-teal-600',
      questions: [
        {
          id: 'company-name',
          question: 'What is your company name?',
          type: 'text',
          required: true,
          category: 'basic'
        },
        {
          id: 'products',
          question: 'What products will you sell?',
          type: 'textarea',
          required: true,
          category: 'products',
          aiPrompt: 'Describe your product catalog, categories, and unique selling propositions.'
        },
        {
          id: 'target-customers',
          question: 'Who are your target customers?',
          type: 'textarea',
          required: true,
          category: 'market',
          aiPrompt: 'Define your customer personas, demographics, and buying behavior.'
        },
        {
          id: 'competition',
          question: 'Who are your main competitors?',
          type: 'textarea',
          required: true,
          category: 'competition',
          aiPrompt: 'Analyze your competitive landscape and differentiation strategy.'
        }
      ],
      sections: [
        { id: 'executive-summary', title: 'Executive Summary', content: '', aiGenerated: false, completeness: 0 },
        { id: 'market-research', title: 'Market Research', content: '', aiGenerated: false, completeness: 0 },
        { id: 'marketing-strategy', title: 'Marketing Strategy', content: '', aiGenerated: false, completeness: 0 },
        { id: 'operations', title: 'Operations Plan', content: '', aiGenerated: false, completeness: 0 },
        { id: 'financial-projections', title: 'Financial Projections', content: '', aiGenerated: false, completeness: 0 }
      ]
    },
    {
      id: 'service-business',
      name: 'Service Business',
      description: 'Professional service business planning',
      industry: 'Services',
      icon: Building2,
      color: 'from-orange-500 to-red-600',
      questions: [
        {
          id: 'company-name',
          question: 'What is your company name?',
          type: 'text',
          required: true,
          category: 'basic'
        },
        {
          id: 'services',
          question: 'What services do you offer?',
          type: 'textarea',
          required: true,
          category: 'services',
          aiPrompt: 'Detail your service offerings, pricing structure, and value proposition.'
        },
        {
          id: 'target-clients',
          question: 'Who are your target clients?',
          type: 'textarea',
          required: true,
          category: 'market',
          aiPrompt: 'Define your ideal client profile and market segments.'
        }
      ],
      sections: [
        { id: 'executive-summary', title: 'Executive Summary', content: '', aiGenerated: false, completeness: 0 },
        { id: 'service-description', title: 'Service Description', content: '', aiGenerated: false, completeness: 0 },
        { id: 'market-analysis', title: 'Market Analysis', content: '', aiGenerated: false, completeness: 0 },
        { id: 'operations', title: 'Operations Plan', content: '', aiGenerated: false, completeness: 0 },
        { id: 'financial-projections', title: 'Financial Projections', content: '', aiGenerated: false, completeness: 0 }
      ]
    }
  ];

  const currentTemplate = businessPlanTemplates.find(t => t.id === selectedTemplate);
  const currentQuestion = currentTemplate?.questions[currentStep];
  const totalSteps = currentTemplate?.questions.length || 0;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  // AI Generation Mutation
  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generatedSections = currentTemplate?.sections.map(section => ({
        ...section,
        content: generateAIContent(section.id, answers),
        aiGenerated: true,
        completeness: 100
      })) || [];
      
      setGeneratedPlan(generatedSections);
      setIsGenerating(false);
      
      return generatedSections;
    },
    onSuccess: () => {
      toast({
        title: "Business Plan Generated",
        description: "Your AI-powered business plan is ready!"
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate business plan. Please try again.",
        variant: "destructive"
      });
    }
  });

  const generateAIContent = (sectionId: string, answers: Record<string, any>) => {
    const companyName = answers['company-name'] || 'Your Company';
    
    switch (sectionId) {
      case 'executive-summary':
        return `# Executive Summary

**${companyName}** is positioned to revolutionize the market with our innovative solution. 

## Key Highlights:
- **Market Opportunity**: Large and growing market with significant unmet needs
- **Competitive Advantage**: Unique technology and approach that sets us apart
- **Financial Projections**: Strong revenue growth projected over the next 3 years
- **Team**: Experienced leadership with proven track record

## Mission Statement:
To deliver exceptional value to our customers while building a sustainable and profitable business.

## Financial Summary:
- **Year 1 Revenue**: $500K projected
- **Year 2 Revenue**: $1.2M projected  
- **Year 3 Revenue**: $2.5M projected
- **Break-even**: Month 18
- **Funding Required**: $${answers['funding-amount'] || '500K'} for initial growth`;

      case 'market-analysis':
        return `# Market Analysis

## Market Size & Opportunity
- **Total Addressable Market (TAM)**: $12B
- **Serviceable Addressable Market (SAM)**: $3.2B
- **Serviceable Obtainable Market (SOM)**: $180M

## Target Market
${answers['target-market'] || 'Our target market consists of...'}

## Market Trends
- Growing demand for innovative solutions
- Digital transformation driving adoption
- Increasing customer expectations
- Regulatory changes creating opportunities

## Competitive Landscape
- **Direct Competitors**: 3-5 major players
- **Indirect Competitors**: Traditional solutions
- **Competitive Advantage**: ${answers['problem-solving'] || 'Our unique approach...'}`;

      case 'financial-projections':
        return `# Financial Projections

## Revenue Projections
| Year | Revenue | Growth Rate |
|------|---------|-------------|
| Year 1 | $500K | - |
| Year 2 | $1.2M | 140% |
| Year 3 | $2.5M | 108% |

## Key Financial Metrics
- **Gross Margin**: 75%
- **Operating Margin**: 25%
- **Customer Acquisition Cost**: $150
- **Lifetime Value**: $2,500
- **Payback Period**: 6 months

## Funding Requirements
- **Total Funding Needed**: $${answers['funding-amount'] || '500K'}
- **Use of Funds**:
  - Product Development: 40%
  - Marketing & Sales: 35%
  - Operations: 15%
  - Working Capital: 10%

## Break-even Analysis
- **Break-even Point**: Month 18
- **Monthly Burn Rate**: $25K
- **Runway**: 20 months`;

      default:
        return `# ${currentTemplate?.sections.find(s => s.id === sectionId)?.title || 'Section'}

This section has been generated using AI based on your responses to our questionnaire.

**Key Points:**
- Generated content tailored to your specific business
- Industry best practices incorporated
- Professional formatting and structure
- Ready for investor presentations

**Customization:**
You can edit this content to better reflect your specific situation and requirements.`;

    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // All questions answered, generate plan
      generatePlanMutation.mutate();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep(0);
    setAnswers({});
    setGeneratedPlan([]);
  };

  const renderQuestion = (question: BusinessPlanQuestion) => {
    const value = answers[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            className="w-full"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            className="min-h-[120px]"
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option...</option>
            {question.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter amount..."
            className="w-full"
          />
        );
      
      default:
        return null;
    }
  };

  if (!selectedTemplate) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Business Plan Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create professional business plans in minutes with AI. No typing required - just answer our smart questions and we'll generate everything you need.
          </p>
        </div>

        {/* Template Selection */}
        <div className="grid md:grid-cols-3 gap-6">
          {businessPlanTemplates.map((template) => {
            const IconComponent = template.icon;
            return (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{template.questions.length} smart questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{template.sections.length} comprehensive sections</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>AI-powered generation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Our AI Business Plan Generator?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Typing Required</h3>
              <p className="text-gray-600">Answer smart questions, AI generates professional content</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Automated Financials</h3>
              <p className="text-gray-600">AI creates accurate projections and financial forecasts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Quality</h3>
              <p className="text-gray-600">Investor-ready plans created by business experts</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="h-12 w-12 text-white animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Generating Your Business Plan</h2>
        <p className="text-gray-600 mb-8">Our AI is analyzing your responses and creating a comprehensive business plan...</p>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full animate-pulse" style={{ width: '75%' }}></div>
        </div>
        <p className="text-sm text-gray-500">This usually takes 30-60 seconds</p>
      </div>
    );
  }

  if (generatedPlan.length > 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your AI-Generated Business Plan</h1>
            <p className="text-gray-600">Professional business plan ready for investors</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Business Plan Sections */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plan Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {generatedPlan.map((section, index) => (
                  <div key={section.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      {section.aiGenerated && <Sparkles className="h-4 w-4 text-blue-500" />}
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                    <div className="ml-auto">
                      <Badge variant="secondary" className="text-xs">
                        {section.completeness}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                {showPreview ? (
                  <div className="prose max-w-none">
                    {generatedPlan.map((section) => (
                      <div key={section.id} className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <h2 className="text-2xl font-bold">{section.title}</h2>
                          {section.aiGenerated && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI Generated
                            </Badge>
                          )}
                        </div>
                        <div className="whitespace-pre-line text-gray-700">
                          {section.content}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Tabs defaultValue={generatedPlan[0]?.id} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
                      {generatedPlan.map((section) => (
                        <TabsTrigger key={section.id} value={section.id}>
                          {section.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {generatedPlan.map((section) => (
                      <TabsContent key={section.id} value={section.id} className="mt-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold">{section.title}</h3>
                            {section.aiGenerated && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI Generated
                              </Badge>
                            )}
                          </div>
                          <Textarea
                            value={section.content}
                            onChange={(e) => {
                              const updatedPlan = generatedPlan.map(s => 
                                s.id === section.id ? { ...s, content: e.target.value } : s
                              );
                              setGeneratedPlan(updatedPlan);
                            }}
                            className="min-h-[400px]"
                          />
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {currentTemplate?.name} Business Plan
            </h2>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Estimated time: {Math.max(1, totalSteps - currentStep)} minutes remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                {currentQuestion?.question}
              </h3>
              {currentQuestion?.aiPrompt && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">AI Tip</span>
                  </div>
                  <p className="text-sm text-blue-700">{currentQuestion.aiPrompt}</p>
                </div>
              )}
            </div>

            <div>
              {currentQuestion && renderQuestion(currentQuestion)}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion?.id || ''] && currentQuestion?.required}
              >
                {currentStep === totalSteps - 1 ? 'Generate Plan' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIBusinessPlan;
