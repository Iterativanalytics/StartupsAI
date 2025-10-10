import React, { useState } from 'react';
import { useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { 
  Presentation, Layers, PenTool, Maximize, ArrowRightLeft, 
  Trash2, Save, Plus, MessageSquare, LineChart, Layout,
  Upload, FileText, Globe, Sparkles, Wand2, Download,
  Share2, Eye, Copy, RefreshCw, Zap, Target, TrendingUp,
  Users, DollarSign, BarChart3, Lightbulb, Rocket,
  CheckCircle, Star, Award, Clock, Filter, Search,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Slide {
  id: string;
  type: 'title' | 'problem' | 'solution' | 'market' | 'business-model' | 'traction' | 'team' | 'financials' | 'ask';
  title: string;
  content: string;
  template: 'minimal' | 'corporate' | 'bold' | 'modern' | 'creative' | 'professional';
  layout: 'left' | 'right' | 'center';
  aiGenerated?: boolean;
  design?: {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    fontFamily?: string;
  };
}

interface AITemplate {
  id: string;
  name: string;
  description: string;
  category: 'startup' | 'corporate' | 'creative' | 'minimal';
  icon: React.ComponentType<any>;
  color: string;
  slides: Partial<Slide>[];
}

interface DocumentUpload {
  file: File;
  type: 'pdf' | 'doc' | 'docx' | 'txt';
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
}

function PitchDeck() {
  const { id } = useParams();
  const { toast } = useToast();

  // States
  const [activeSlide, setActiveSlide] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAITemplates, setShowAITemplates] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessingURL, setIsProcessingURL] = useState(false);
  const [documentUploads, setDocumentUploads] = useState<DocumentUpload[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  // AI Templates
  const aiTemplates: AITemplate[] = [
    {
      id: 'startup-pitch',
      name: 'Startup Pitch Deck',
      description: 'Professional startup pitch with modern design',
      category: 'startup',
      icon: Rocket,
      color: 'from-blue-500 to-purple-600',
      slides: [
        { type: 'title', title: 'Company Name', content: 'Revolutionary solution for [target market]', template: 'modern' },
        { type: 'problem', title: 'The Problem', content: 'Current solutions fail to address [specific pain point]', template: 'modern' },
        { type: 'solution', title: 'Our Solution', content: 'Innovative approach that solves the problem', template: 'modern' },
        { type: 'market', title: 'Market Opportunity', content: 'Large and growing market with clear need', template: 'modern' },
        { type: 'business-model', title: 'Business Model', content: 'Sustainable revenue streams and pricing', template: 'modern' },
        { type: 'traction', title: 'Traction', content: 'Key metrics and growth indicators', template: 'modern' },
        { type: 'team', title: 'Team', content: 'Experienced founders and advisors', template: 'modern' },
        { type: 'financials', title: 'Financial Projections', content: 'Revenue forecasts and key assumptions', template: 'modern' },
        { type: 'ask', title: 'The Ask', content: 'Funding requirements and use of funds', template: 'modern' }
      ]
    },
    {
      id: 'corporate-presentation',
      name: 'Corporate Presentation',
      description: 'Professional corporate deck with clean design',
      category: 'corporate',
      icon: Building2,
      color: 'from-gray-600 to-blue-600',
      slides: [
        { type: 'title', title: 'Executive Summary', content: 'Key highlights and strategic overview', template: 'corporate' },
        { type: 'problem', title: 'Business Challenge', content: 'Current challenges and opportunities', template: 'corporate' },
        { type: 'solution', title: 'Proposed Solution', content: 'Strategic approach and implementation', template: 'corporate' },
        { type: 'market', title: 'Market Analysis', content: 'Market size, trends, and competitive landscape', template: 'corporate' },
        { type: 'business-model', title: 'Implementation Plan', content: 'Timeline, resources, and milestones', template: 'corporate' },
        { type: 'traction', title: 'Results & Metrics', content: 'Performance indicators and achievements', template: 'corporate' },
        { type: 'team', title: 'Team & Resources', content: 'Key personnel and organizational structure', template: 'corporate' },
        { type: 'financials', title: 'Financial Impact', content: 'ROI projections and cost-benefit analysis', template: 'corporate' },
        { type: 'ask', title: 'Next Steps', content: 'Recommendations and action items', template: 'corporate' }
      ]
    },
    {
      id: 'creative-pitch',
      name: 'Creative Pitch',
      description: 'Bold and engaging presentation design',
      category: 'creative',
      icon: Sparkles,
      color: 'from-pink-500 to-orange-500',
      slides: [
        { type: 'title', title: 'Innovation Showcase', content: 'Bold vision and creative approach', template: 'creative' },
        { type: 'problem', title: 'The Challenge', content: 'Creative problem identification', template: 'creative' },
        { type: 'solution', title: 'Creative Solution', content: 'Innovative and unique approach', template: 'creative' },
        { type: 'market', title: 'Market Vision', content: 'Creative market positioning', template: 'creative' },
        { type: 'business-model', title: 'Innovation Model', content: 'Creative business approach', template: 'creative' },
        { type: 'traction', title: 'Creative Impact', content: 'Unique metrics and achievements', template: 'creative' },
        { type: 'team', title: 'Creative Team', content: 'Talented and innovative team', template: 'creative' },
        { type: 'financials', title: 'Creative Economics', content: 'Innovative financial model', template: 'creative' },
        { type: 'ask', title: 'Creative Partnership', content: 'Unique collaboration opportunity', template: 'creative' }
      ]
    }
  ];

  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      type: 'title',
      title: 'Company Name',
      content: 'Tagline: Solving X for Y',
      template: 'minimal',
      layout: 'center'
    },
    {
      id: '2',
      type: 'problem',
      title: 'The Problem',
      content: 'Describe the problem your company is solving',
      template: 'minimal',
      layout: 'left'
    },
    {
      id: '3',
      type: 'solution',
      title: 'Our Solution',
      content: 'Explain how your product/service solves the problem',
      template: 'minimal',
      layout: 'right'
    },
    {
      id: '4',
      type: 'market',
      title: 'Market Opportunity',
      content: 'Market size, TAM/SAM/SOM, growth rate',
      template: 'minimal',
      layout: 'left'
    },
    {
      id: '5',
      type: 'business-model',
      title: 'Business Model',
      content: 'Revenue streams, pricing, customer acquisition',
      template: 'minimal',
      layout: 'center'
    },
    {
      id: '6',
      type: 'traction',
      title: 'Traction & Milestones',
      content: 'Key metrics, growth, achievements',
      template: 'minimal',
      layout: 'left'
    },
    {
      id: '7',
      type: 'team',
      title: 'Team',
      content: 'Founders and key team members',
      template: 'minimal',
      layout: 'center'
    },
    {
      id: '8',
      type: 'financials',
      title: 'Financials',
      content: 'Projections, key metrics, unit economics',
      template: 'minimal',
      layout: 'right'
    },
    {
      id: '9',
      type: 'ask',
      title: 'The Ask',
      content: 'Funding amount, use of funds, timeline',
      template: 'minimal',
      layout: 'center'
    }
  ]);

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Fetch pitch deck
  const { data: pitchDeck, isLoading: isLoadingDeck } = useQuery({
    queryKey: [`/api/business-plans/${id}/pitch-deck`],
    enabled: !!id
  });

  // Handle pitch deck data when it loads
  React.useEffect(() => {
    if (pitchDeck && (pitchDeck as any).slides) {
      setSlides((pitchDeck as any).slides);
      if ((pitchDeck as any).slides.length > 0 && !activeSlide) {
        setActiveSlide((pitchDeck as any).slides[0].id);
      }
    } else if (slides.length > 0 && !activeSlide) {
      setActiveSlide(slides[0].id);
    }
  }, [pitchDeck, slides.length, activeSlide]);

  // Save pitch deck mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        planId: parseInt(id as string),
        slides: slides,
        metrics: {
          slidesCount: slides.length,
          wordsCount: slides.reduce((count, slide) => {
            return count + (slide.content.split(' ').length || 0);
          }, 0)
        }
      };

      if (pitchDeck && (pitchDeck as any).id) {
        const response = await apiRequest(
          'PATCH',
          `/api/business-plans/${id}/pitch-deck/${(pitchDeck as any).id}`,
          payload
        );
        return response.json();
      } else {
        const response = await apiRequest(
          'POST',
          `/api/business-plans/${id}/pitch-deck`,
          payload
        );
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/business-plans/${id}/pitch-deck`] });
      toast({
        title: "Success",
        description: "Pitch deck saved successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save pitch deck",
        variant: "destructive"
      });
    }
  });

  // Enhanced AI content generation
  const handleGenerateContent = () => {
    if (!aiPrompt) {
      toast({
        title: "Input Required",
        description: "Please enter a prompt for the AI",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulated AI generation with enhanced content
    setTimeout(() => {
      const currentSlide = slides.find(s => s.id === activeSlide);
      if (currentSlide) {
        let generatedContent = '';
        
        switch(currentSlide.type) {
          case 'problem':
            generatedContent = `Problem Statement:\n\n1. Current market solutions fail to address [specific pain point]\n2. Users struggle with [limitation of existing solutions]\n3. This costs businesses an estimated $X million annually\n\nValidated through interviews with 50+ potential customers who confirmed they're actively seeking better solutions.`;
            break;
          case 'solution':
            generatedContent = `Our Solution:\n\n• Proprietary [technology/method] that increases efficiency by 35%\n• Intuitive interface reducing learning curve by 60%\n• Seamless integration with existing workflows\n• AI-powered analytics providing actionable insights\n\nKey differentiator: We're the only solution that combines [unique feature 1] with [unique feature 2].`;
            break;
          case 'market':
            generatedContent = `Market Size & Opportunity:\n\nTAM: $12B (Total enterprises that could use our solution)\nSAM: $3.2B (Enterprises in our target segments)\nSOM: $180M (Realistic capture in first 3 years)\n\nMarket growing at 23% CAGR with increasing demand from [specific sectors]. Current competitors only serve 15% of potential customers effectively.`;
            break;
          default:
            generatedContent = `Generated content for "${currentSlide.title}" slide based on your prompt: "${aiPrompt}".\n\nThis content includes:\n• Key messaging points\n• Data-driven insights\n• Persuasive elements to engage investors\n• Clear call to action`;
        }
        
        const updatedSlides = slides.map(slide => 
          slide.id === activeSlide ? {...slide, content: generatedContent, aiGenerated: true} : slide
        );
        
        setSlides(updatedSlides);
      }
      
      setIsGenerating(false);
      
      toast({
        title: "Content Generated",
        description: "AI has generated content for this slide"
      });
    }, 2000);
  };

  // AI Template Application
  const handleApplyTemplate = (template: AITemplate) => {
    const newSlides = template.slides.map((slideTemplate, index) => ({
      id: String(slides.length + index + 1),
      type: slideTemplate.type || 'title',
      title: slideTemplate.title || 'New Slide',
      content: slideTemplate.content || 'Enter content here...',
      template: slideTemplate.template || 'minimal',
      layout: 'center' as const,
      aiGenerated: true
    }));

    setSlides([...slides, ...newSlides]);
    setSelectedTemplate(template.id);
    setShowAITemplates(false);
    
    toast({
      title: "Template Applied",
      description: `${template.name} template has been added to your presentation`
    });
  };

  // URL Processing
  const handleProcessURL = async () => {
    if (!urlInput) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingURL(true);
    
    // Simulate URL processing
    setTimeout(() => {
      const newSlides = [
        {
          id: String(slides.length + 1),
          type: 'title' as const,
          title: 'Web Content Analysis',
          content: `Content extracted from: ${urlInput}\n\nKey insights and data points from the webpage have been analyzed and structured into presentation format.`,
          template: 'modern' as const,
          layout: 'center' as const,
          aiGenerated: true
        }
      ];

      setSlides([...slides, ...newSlides]);
      setUrlInput('');
      setIsProcessingURL(false);
      
      toast({
        title: "URL Processed",
        description: "Content from the webpage has been converted to slides"
      });
    }, 3000);
  };

  // Document Upload Handling
  const onDrop = (acceptedFiles: File[]) => {
    const newUploads = acceptedFiles.map(file => ({
      file,
      type: file.name.split('.').pop()?.toLowerCase() as 'pdf' | 'doc' | 'docx' | 'txt',
      status: 'uploading' as const,
      progress: 0
    }));

    setDocumentUploads([...documentUploads, ...newUploads]);

    // Simulate document processing
    newUploads.forEach((upload, index) => {
      setTimeout(() => {
        setDocumentUploads(prev => 
          prev.map((u, i) => 
            u.file === upload.file 
              ? { ...u, status: 'processing', progress: 50 }
              : u
          )
        );
      }, 1000 + index * 500);

      setTimeout(() => {
        setDocumentUploads(prev => 
          prev.map(u => 
            u.file === upload.file 
              ? { ...u, status: 'completed', progress: 100 }
              : u
          )
        );

        // Add slides from document
        const newSlides = [
          {
            id: String(slides.length + 1),
            type: 'title' as const,
            title: `Document: ${upload.file.name}`,
            content: `Content extracted from ${upload.file.name}\n\nKey information and insights have been structured into presentation format.`,
            template: 'modern' as const,
            layout: 'center' as const,
            aiGenerated: true
          }
        ];

        setSlides(prev => [...prev, ...newSlides]);
        
        toast({
          title: "Document Processed",
          description: `${upload.file.name} has been converted to slides`
        });
      }, 3000 + index * 1000);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  const handleAddSlide = () => {
    const newId = String(slides.length + 1);
    const newSlide: Slide = {
      id: newId,
      type: 'market',
      title: 'New Slide',
      content: 'Enter content here...',
      template: 'minimal',
      layout: 'left'
    };
    
    setSlides([...slides, newSlide]);
    setActiveSlide(newId);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (slides.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one slide",
        variant: "destructive"
      });
      return;
    }
    
    const updatedSlides = slides.filter(slide => slide.id !== slideId);
    setSlides(updatedSlides);
    
    if (activeSlide === slideId) {
      setActiveSlide(updatedSlides[0].id);
    }
  };

  const handleSlideUpdate = (field: keyof Slide, value: string) => {
    const updatedSlides = slides.map(slide => 
      slide.id === activeSlide ? {...slide, [field]: value} : slide
    );
    setSlides(updatedSlides);
  };

  const currentSlide = slides.find(slide => slide.id === activeSlide);

  if (isLoadingPlan || isLoadingDeck) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getSlideTypeIcon = (type: string) => {
    switch(type) {
      case 'title': return <Presentation />;
      case 'problem': return <MessageSquare />;
      case 'solution': return <Layers />;
      case 'market': return <LineChart />;
      case 'business-model': return <ArrowRightLeft />;
      case 'traction': return <LineChart />;
      case 'team': return <Layout />;
      case 'financials': return <LineChart />;
      case 'ask': return <Maximize />;
      default: return <Layers />;
    }
  };

  // Slide templates
  const renderSlidePreview = (slide: Slide) => {
    const isActive = slide.id === activeSlide;
    
    const getLayoutClass = (layout: string) => {
      switch(layout) {
        case 'left': return 'text-left';
        case 'right': return 'text-right';
        case 'center': return 'text-center';
        default: return 'text-left';
      }
    };
    
    const getTemplateClass = (template: string) => {
      switch(template) {
        case 'minimal': return 'bg-white';
        case 'corporate': return 'bg-gray-50';
        case 'bold': return 'bg-gradient-to-r from-blue-50 to-indigo-50';
        default: return 'bg-white';
      }
    };
    
    return (
      <div 
        className={`${getTemplateClass(slide.template)} rounded-lg shadow-sm p-6 ${getLayoutClass(slide.layout)} cursor-pointer border-2 transition-all ${isActive ? 'border-blue-500 scale-100' : 'border-transparent hover:border-gray-200 scale-95'}`}
        style={{ minHeight: '250px', aspectRatio: '16/9' }}
        onClick={() => setActiveSlide(slide.id)}
      >
        <div className="flex justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Slide {slides.indexOf(slide) + 1}</span>
            {slide.aiGenerated && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Sparkles className="h-3 w-3" />
                <span>AI</span>
              </div>
            )}
          </div>
          {isActive && !previewMode && (
            <button onClick={() => handleDeleteSlide(slide.id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <h2 className={`text-xl font-semibold mb-4 ${slide.template === 'bold' ? 'text-indigo-700' : 'text-gray-800'}`}>
          {slide.title}
        </h2>
        
        <div className="text-sm text-gray-600 whitespace-pre-line h-32 overflow-hidden">
          {slide.content.substring(0, 120)}
          {slide.content.length > 120 && '...'}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with AI Features */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-500" />
              AI Pitch Deck Studio
              {businessPlan && typeof businessPlan === 'object' && 'name' in businessPlan ? 
                ` for ${businessPlan.name}` : ''}
            </h1>
            <p className="text-gray-600">
              Create stunning presentations with AI-powered content generation and professional templates
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowAITemplates(!showAITemplates)}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              AI Templates
            </Button>
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Exit Preview' : 'Preview'} <Maximize className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Simulate export functionality
                toast({
                  title: "Export Started",
                  description: "Your presentation is being prepared for download"
                });
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Simulate sharing functionality
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Link Copied",
                  description: "Presentation link copied to clipboard"
                });
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Deck
            </Button>
          </div>
        </div>

        {/* AI Creation Options */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Upload className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Upload Documents</h3>
                  <p className="text-sm text-gray-600">Convert PDFs, Word docs, and text files</p>
                </div>
              </div>
              <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />
                <div className={`text-center py-4 rounded-lg border-2 border-dashed transition-colors ${
                  isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {isDragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-green-200 hover:border-green-400 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Convert Web URLs</h3>
                  <p className="text-sm text-gray-600">Transform webpages into presentations</p>
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Enter website URL..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <Button
                  onClick={handleProcessURL}
                  disabled={isProcessingURL || !urlInput}
                  className="w-full"
                  size="sm"
                >
                  {isProcessingURL ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Convert URL
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">AI Generation</h3>
                  <p className="text-sm text-gray-600">Generate content with AI prompts</p>
                </div>
              </div>
              <Button
                onClick={() => setShowAITemplates(true)}
                className="w-full"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Start with AI
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Document Upload Progress */}
        {documentUploads.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Processing Documents</h4>
            {documentUploads.map((upload, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{upload.file.name}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {upload.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : upload.status === 'error' ? (
                    <span className="text-red-500">Error</span>
                  ) : (
                    `${upload.progress}%`
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Templates Modal */}
      {showAITemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">AI Templates</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowAITemplates(false)}
                >
                  Close
                </Button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {aiTemplates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleApplyTemplate(template)}
                    >
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center mb-4`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{template.slides.length} slides</span>
                          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slide Thumbnails */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Slides</h2>
            {!previewMode && (
              <Button variant="outline" size="sm" onClick={handleAddSlide}>
                <Plus className="h-4 w-4 mr-1" /> Add Slide
              </Button>
            )}
          </div>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {slides.map(slide => (
              <div key={slide.id} className="relative">
                {renderSlidePreview(slide)}
              </div>
            ))}
          </div>
        </div>

        {/* Slide Editor or Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          {previewMode ? (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Preview Mode</h2>
              <div className="aspect-video bg-white rounded-lg shadow-lg p-8 flex items-center justify-center">
                {currentSlide && (
                  <div className="w-full max-w-3xl">
                    <h2 className="text-3xl font-bold mb-6">{currentSlide.title}</h2>
                    <div className="text-lg text-gray-700 whitespace-pre-line">
                      {currentSlide.content}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-4">
                {slides.map((slide, index) => (
                  <div 
                    key={slide.id}
                    className={`h-2 w-2 rounded-full mx-1 cursor-pointer ${slide.id === activeSlide ? 'bg-blue-500' : 'bg-gray-300'}`}
                    onClick={() => setActiveSlide(slide.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              {currentSlide ? (
                <Tabs defaultValue="content">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slide Title
                      </label>
                      <Input 
                        value={currentSlide.title}
                        onChange={(e) => handleSlideUpdate('title', e.target.value)}
                        placeholder="Enter slide title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slide Type
                      </label>
                      <select 
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={currentSlide.type}
                        onChange={(e) => handleSlideUpdate('type', e.target.value)}
                      >
                        <option value="title">Title Slide</option>
                        <option value="problem">Problem</option>
                        <option value="solution">Solution</option>
                        <option value="market">Market Size</option>
                        <option value="business-model">Business Model</option>
                        <option value="traction">Traction</option>
                        <option value="team">Team</option>
                        <option value="financials">Financials</option>
                        <option value="ask">Ask</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <Textarea 
                        value={currentSlide.content}
                        onChange={(e) => handleSlideUpdate('content', e.target.value)}
                        placeholder="Enter slide content"
                        className="min-h-[200px]"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="design" className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template
                      </label>
                      <ToggleGroup 
                        type="single" 
                        value={currentSlide.template}
                        onValueChange={(value) => {
                          if (value) handleSlideUpdate('template', value);
                        }}
                      >
                        <ToggleGroupItem value="minimal">Minimal</ToggleGroupItem>
                        <ToggleGroupItem value="corporate">Corporate</ToggleGroupItem>
                        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Layout
                      </label>
                      <ToggleGroup 
                        type="single" 
                        value={currentSlide.layout}
                        onValueChange={(value) => {
                          if (value) handleSlideUpdate('layout', value);
                        }}
                      >
                        <ToggleGroupItem value="left">Left</ToggleGroupItem>
                        <ToggleGroupItem value="center">Center</ToggleGroupItem>
                        <ToggleGroupItem value="right">Right</ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 text-sm">
                      <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        AI Assistant
                      </h3>
                      <p className="text-blue-700">
                        Describe what you want for this slide, and our AI will generate professionally-written content.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Prompt
                        </label>
                        <Textarea 
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="e.g., Generate a compelling problem statement with key market statistics"
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quick Prompts
                          </label>
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAiPrompt("Generate a compelling problem statement with market statistics and customer pain points")}
                              className="w-full text-left justify-start"
                            >
                              <Target className="h-4 w-4 mr-2" />
                              Problem Statement
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAiPrompt("Create a solution overview with key features and competitive advantages")}
                              className="w-full text-left justify-start"
                            >
                              <Lightbulb className="h-4 w-4 mr-2" />
                              Solution Overview
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAiPrompt("Generate market analysis with TAM, SAM, SOM and growth projections")}
                              className="w-full text-left justify-start"
                            >
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Market Analysis
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAiPrompt("Create financial projections with revenue forecasts and key metrics")}
                              className="w-full text-left justify-start"
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Financial Projections
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleGenerateContent}
                      disabled={isGenerating || !aiPrompt}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Tips for Great Results:</h3>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                          <li>Be specific about what metrics or data points to include</li>
                          <li>Mention your target audience (e.g., "for Series A investors")</li>
                          <li>Specify tone (professional, conversational, bold)</li>
                          <li>Include any specific terminology from your industry</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">AI Features:</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Industry-specific content</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Data-driven insights</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Investor-ready language</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Professional formatting</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <Presentation className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">Select a slide to edit or create a new one</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Export and Sharing Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-500" />
          Export & Share
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">PDF Export</h3>
              <p className="text-sm text-gray-600 mb-3">Download as PDF for offline viewing</p>
              <Button size="sm" className="w-full">
                Export PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-green-200 hover:border-green-400 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                <Presentation className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">PowerPoint</h3>
              <p className="text-sm text-gray-600 mb-3">Export as editable PowerPoint file</p>
              <Button size="sm" variant="outline" className="w-full">
                Export PPTX
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
                <Share2 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Share Link</h3>
              <p className="text-sm text-gray-600 mb-3">Create shareable presentation link</p>
              <Button size="sm" variant="outline" className="w-full">
                Generate Link
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-orange-200 hover:border-orange-400 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-orange-100 rounded-lg w-fit mx-auto mb-3">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Live Present</h3>
              <p className="text-sm text-gray-600 mb-3">Present directly from browser</p>
              <Button size="sm" variant="outline" className="w-full">
                Start Presenting
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Presentation Statistics */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Presentation Analytics</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{slides.length}</div>
              <div className="text-sm text-gray-600">Total Slides</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {slides.filter(s => s.aiGenerated).length}
              </div>
              <div className="text-sm text-gray-600">AI Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {slides.reduce((count, slide) => count + slide.content.split(' ').length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {new Set(slides.map(s => s.template)).size}
              </div>
              <div className="text-sm text-gray-600">Templates Used</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PitchDeck;