import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { 
  FileText, 
  ArrowLeft, 
  Home,
  Eye,
  Download,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { IterativePlanProvider } from '@/contexts/IterativePlanContext';
import { BUSINESS_PLAN_STRUCTURE } from '@/constants/businessPlanStructure';
import { ChapterNavigation } from '@/components/business-plan/ChapterNavigation';
import { SectionEditor } from '@/components/business-plan/SectionEditor';
import { ProgressDashboard } from '@/components/business-plan/ProgressDashboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function EditPlanContent() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const [activeChapter, setActiveChapter] = useState('executive-summary');
  const [activeSection, setActiveSection] = useState('summary');
  const [activeTab, setActiveTab] = useState('editor');

  // Parse URL for chapter and section if they exist
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const chapter = params.get('chapter');
    const section = params.get('section');
    
    if (chapter) {
      setActiveChapter(chapter);
    }
    if (section) {
      setActiveSection(section);
    }
  }, [location]);

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
  });

  // Update URL when chapter/section changes
  useEffect(() => {
    const basePath = location.split('?')[0] || '';
    const params = new URLSearchParams();
    params.set('chapter', activeChapter);
    params.set('section', activeSection);
    setLocation(`${basePath}?${params.toString()}`, { replace: true });
  }, [activeChapter, activeSection, setLocation]);

  const activeChapterData = BUSINESS_PLAN_STRUCTURE.find(c => c.id === activeChapter);
  const activeSectionData = activeChapterData?.sections.find(s => s.id === activeSection);

  const handleChapterSelect = (chapterId: string) => {
    setActiveChapter(chapterId);
    const chapter = BUSINESS_PLAN_STRUCTURE.find(c => c.id === chapterId);
    if (chapter && chapter.sections.length > 0) {
      setActiveSection(chapter.sections[0].id);
    }
  };

  const handleSectionSelect = (chapterId: string, sectionId: string) => {
    setActiveChapter(chapterId);
    setActiveSection(sectionId);
    setActiveTab('editor');
  };

  const handleBack = () => {
    setLocation('/dashboard');
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    toast({
      title: 'Preview',
      description: 'Preview functionality coming soon',
    });
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast({
      title: 'Export',
      description: 'Export functionality coming soon',
    });
  };

  if (isLoadingPlan) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {businessPlan && typeof businessPlan === 'object' && 'name' in businessPlan
                    ? String(businessPlan.name)
                    : 'Business Plan'}
                </h1>
                <p className="text-sm text-gray-500">
                  {activeChapterData?.title} {activeChapterData?.subtitle && activeChapterData.subtitle} · {activeSectionData?.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setLocation('/dashboard')}>
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="editor">
              <FileText className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="progress">
              <BarChart3 className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-0">
            <div className="grid grid-cols-12 gap-6">
              {/* Navigation */}
              <div className="col-span-3">
                <ChapterNavigation
                  chapters={BUSINESS_PLAN_STRUCTURE}
                  activeChapterId={activeChapter}
                  activeSectionId={activeSection}
                  onChapterSelect={handleChapterSelect}
                  onSectionSelect={handleSectionSelect}
                />
              </div>

              {/* Editor */}
              <div className="col-span-9">
                <SectionEditor
                  chapterId={activeChapter}
                  sectionId={activeSection}
                  onSave={() => {
                    toast({
                      title: 'Saved',
                      description: 'Section saved successfully',
                    });
                  }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3">
                <ChapterNavigation
                  chapters={BUSINESS_PLAN_STRUCTURE}
                  activeChapterId={activeChapter}
                  activeSectionId={activeSection}
                  onChapterSelect={handleChapterSelect}
                  onSectionSelect={handleSectionSelect}
                />
              </div>
              <div className="col-span-9">
                <ProgressDashboard />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EditPlan() {
  const { id } = useParams();
  
  return (
    <IterativePlanProvider planId={id}>
      <EditPlanContent />
    </IterativePlanProvider>
  );
}

export default EditPlan;