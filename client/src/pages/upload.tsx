import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload as UploadIcon, Edit3, Save } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Section {
  id: string;
  title: string;
  subsections: {
    id: string;
    title: string;
    content: string;
  }[];
}

function Upload() {
  const [businessName, setBusinessName] = useState('');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  interface SubsectionScore {
    score: number;
    status: 'pending' | 'scored';
  }

  interface SectionScore {
    score: number;
    status: 'pending' | 'scored';
    subsections: Record<string, SubsectionScore>;
  }

  const [sectionScores, setSectionScores] = useState<Record<string, SectionScore>>({});
  const [sections] = useState<Section[]>([
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      subsections: [
        { id: 'mission', title: 'Our Mission', content: '' },
        { id: 'management', title: 'The Company & Management', content: '' },
        { id: 'products', title: 'Our Products/Services', content: '' },
        { id: 'opportunity', title: 'The Opportunity', content: '' },
        { id: 'financial', title: 'Financial Highlights', content: '' },
      ]
    },
    {
      id: 'business',
      title: 'The Business',
      subsections: [
        { id: 'description', title: 'Description', content: '' },
        { id: 'problem', title: 'Problem & Solution', content: '' },
        { id: 'mission-values', title: 'Our Mission & Values', content: '' },
        { id: 'structure', title: 'Structure & Ownership', content: '' },
      ]
    },
    {
      id: 'products',
      title: 'Products/Services',
      subsections: [
        { id: 'features', title: 'Descriptions & Features', content: '' },
        { id: 'pricing', title: 'Pricing & Margins', content: '' },
        { id: 'warranties', title: 'Guarantees & Warranties', content: '' },
        { id: 'development', title: 'Product Development', content: '' },
      ]
    },
    {
      id: 'market',
      title: 'Market Analysis',
      subsections: [
        { id: 'swot', title: 'SWOT Analysis', content: '' },
        { id: 'segments', title: 'Market Segments & Trends', content: '' },
        { id: 'personas', title: 'Buyer Personas', content: '' },
        { id: 'barriers', title: 'Barriers To Entry', content: '' },
        { id: 'competitors', title: 'Competitor Analysis', content: '' },
      ]
    },
    {
      id: 'strategy',
      title: 'Strategy Plan',
      subsections: [
        { id: 'objectives', title: 'Objectives', content: '' },
        { id: 'promotion', title: 'Promotional Strategy', content: '' },
        { id: 'pricing-strategy', title: 'Pricing Strategy', content: '' },
        { id: 'distribution', title: 'Distribution', content: '' },
        { id: 'branding', title: 'Branding', content: '' },
        { id: 'success', title: 'Success Factors', content: '' },
        { id: 'exit', title: 'Exit Strategy', content: '' },
      ]
    },
    {
      id: 'operations',
      title: 'Operation Plan',
      subsections: [
        { id: 'staffing', title: 'Staffing & Training', content: '' },
        { id: 'management-structure', title: 'Management Structure', content: '' },
        { id: 'advisors', title: 'Professional Advisors', content: '' },
        { id: 'premises', title: 'Premises', content: '' },
        { id: 'legal', title: 'Legal Considerations', content: '' },
      ]
    },
    {
      id: 'financial',
      title: 'Financial Plan',
      subsections: [
        { id: 'data', title: 'Financial Data', content: '' },
        { id: 'profit-loss', title: 'Profit & Loss', content: '' },
        { id: 'balance', title: 'Balance Sheet', content: '' },
        { id: 'cashflow', title: 'Cash Flow', content: '' },
      ]
    },
  ]);

  const createBusinessPlanMutation = useMutation({
    mutationFn: async (data: { name: string, userId: number }) => {
      const response = await apiRequest('POST', '/api/business-plans', data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/business-plans'] });
      toast({
        title: "Success",
        description: "Business plan created successfully",
      });
      setLocation(`/edit/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create business plan",
        variant: "destructive",
      });
    }
  });

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      if (acceptedFiles.length === 0) {
        toast({
          title: "Error",
          description: "No file was uploaded",
          variant: "destructive",
        });
        return;
      }

      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Error",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }

      if (businessName.trim() === '') {
        setBusinessName(file.name.split('.')[0]);
      }

      // Show processing state for all sections
      const initialScores: Record<string, SectionScore> = {};
      sections.forEach(section => {
        initialScores[section.id] = {
          score: 0,
          status: 'pending',
          subsections: {}
        };
        section.subsections.forEach(subsection => {
          initialScores[section.id].subsections[subsection.id] = {
            score: 0,
            status: 'pending'
          };
        });
      });
      setSectionScores(initialScores);
      
      toast({
        title: "Analyzing plan",
        description: "Processing sections for scoring...",
      });

    // Simulate section scoring with random scores
    try {
      // Simulate file processing
      setTimeout(() => {
        const newScores: Record<string, SectionScore> = {};
        sections.forEach(section => {
          const subsectionScores: Record<string, SubsectionScore> = {};
          section.subsections.forEach(subsection => {
            subsectionScores[subsection.id] = {
              score: Math.floor(Math.random() * 30) + 70,
              status: 'scored'
            };
          });
          
          // Calculate section score as average of subsection scores
          const avgScore = Object.values(subsectionScores)
            .reduce((sum, sub) => sum + sub.score, 0) / section.subsections.length;
          
          newScores[section.id] = {
            score: Math.round(avgScore),
            status: 'scored',
            subsections: subsectionScores
          };
        });
        setSectionScores(newScores);
        
        toast({
          title: "Analysis complete",
          description: "Plan sections and subsections have been scored",
        });
      }, 2000);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: "Failed to process the business plan",
        variant: "destructive",
      });
      // Reset scores on error
      setSectionScores({});
    }
  } catch (error) {
    console.error('Error handling file upload:', error);
    toast({
      title: "Error",
      description: "Failed to upload the business plan",
      variant: "destructive",
    });
  }
};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const handleSave = () => {
    if (businessName.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter a business name",
        variant: "destructive",
      });
      return;
    }

    createBusinessPlanMutation.mutate({
      name: businessName,
      userId: 1 // For demo, using userId 1
    });
  };

  const handleEditSection = (sectionId: string, subsectionId: string) => {
    // Create a new plan first if needed
    if (!createBusinessPlanMutation.data) {
      handleSave();
    } else {
      setLocation(`/edit/${createBusinessPlanMutation.data.id}?section=${sectionId}&subsection=${subsectionId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Document Editor</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Business Name"
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={createBusinessPlanMutation.isPending}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {createBusinessPlanMutation.isPending ? (
              <div className="animate-spin h-5 w-5 mr-2 border-b-2 border-white rounded-full"></div>
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            Save Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          {...getRootProps()}
          className={`col-span-1 aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
        >
          <input {...getInputProps()} />
          <UploadIcon className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-600">Upload Document</p>
          <p className="mt-2 text-sm text-gray-500">
            Drop a business plan, proposal, or application file
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.id} className="col-span-1 bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">{section.title}</h2>
              {sectionScores[section.id] && (
                <div className={`flex items-center ${
                  sectionScores[section.id].status === 'pending' ? 'text-gray-400' : 
                  sectionScores[section.id].score >= 80 ? 'text-green-600' :
                  sectionScores[section.id].score >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {sectionScores[section.id].status === 'pending' ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
                  ) : (
                    <span className="font-semibold">{sectionScores[section.id].score}</span>
                  )}
                </div>
              )}
            </div>
            <div className="p-4 space-y-3">
              {section.subsections.map((subsection) => (
                <div key={subsection.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{subsection.title}</span>
                  <div className="flex items-center gap-2">
                    {sectionScores[section.id]?.subsections[subsection.id] && (
                      <span className={`text-sm font-medium ${
                        sectionScores[section.id].subsections[subsection.id].status === 'pending' ? 'text-gray-400' :
                        sectionScores[section.id].subsections[subsection.id].score >= 80 ? 'text-green-600' :
                        sectionScores[section.id].subsections[subsection.id].score >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {sectionScores[section.id].subsections[subsection.id].status === 'pending' ? (
                          <div className="animate-spin h-3 w-3 border-2 border-current rounded-full border-t-transparent" />
                        ) : (
                          sectionScores[section.id].subsections[subsection.id].score
                        )}
                      </span>
                    )}
                    <button 
                      className="p-1 text-gray-400 hover:text-blue-600"
                      onClick={() => handleEditSection(section.id, subsection.id)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Upload;