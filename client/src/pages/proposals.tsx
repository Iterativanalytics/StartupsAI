
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload as UploadIcon, Edit3, Save, FileText, DollarSign, Handshake, Building } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ProposalSection {
  id: string;
  title: string;
  subsections: {
    id: string;
    title: string;
    content: string;
  }[];
}

function Proposals() {
  const [proposalName, setProposalName] = useState('');
  const [proposalType, setProposalType] = useState('grant');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [sectionScores, setSectionScores] = useState<Record<string, any>>({});
  
  const proposalTypes = [
    { id: 'grant', title: 'Grant Proposal', icon: DollarSign, color: 'bg-green-100 text-green-700' },
    { id: 'partnership', title: 'Partnership Proposal', icon: Handshake, color: 'bg-blue-100 text-blue-700' },
    { id: 'service', title: 'Service Proposal', icon: Building, color: 'bg-purple-100 text-purple-700' },
    { id: 'rfp', title: 'RFP Response', icon: FileText, color: 'bg-orange-100 text-orange-700' }
  ];

  const sections: Record<string, ProposalSection[]> = {
    grant: [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        subsections: [
          { id: 'overview', title: 'Project Overview', content: '' },
          { id: 'objectives', title: 'Goals & Objectives', content: '' },
          { id: 'impact', title: 'Expected Impact', content: '' },
          { id: 'funding-request', title: 'Funding Request', content: '' }
        ]
      },
      {
        id: 'project-description',
        title: 'Project Description',
        subsections: [
          { id: 'problem-statement', title: 'Problem Statement', content: '' },
          { id: 'solution-approach', title: 'Solution Approach', content: '' },
          { id: 'methodology', title: 'Methodology', content: '' },
          { id: 'timeline', title: 'Project Timeline', content: '' }
        ]
      },
      {
        id: 'budget',
        title: 'Budget & Financials',
        subsections: [
          { id: 'budget-breakdown', title: 'Budget Breakdown', content: '' },
          { id: 'cost-justification', title: 'Cost Justification', content: '' },
          { id: 'sustainability', title: 'Financial Sustainability', content: '' }
        ]
      }
    ],
    partnership: [
      {
        id: 'partnership-overview',
        title: 'Partnership Overview',
        subsections: [
          { id: 'opportunity', title: 'Partnership Opportunity', content: '' },
          { id: 'mutual-benefits', title: 'Mutual Benefits', content: '' },
          { id: 'strategic-alignment', title: 'Strategic Alignment', content: '' }
        ]
      },
      {
        id: 'collaboration-framework',
        title: 'Collaboration Framework',
        subsections: [
          { id: 'roles-responsibilities', title: 'Roles & Responsibilities', content: '' },
          { id: 'governance', title: 'Governance Structure', content: '' },
          { id: 'success-metrics', title: 'Success Metrics', content: '' }
        ]
      }
    ]
  };

  const currentSections = sections[proposalType] || sections.grant;

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
      if (proposalName.trim() === '') {
        setProposalName(file.name.split('.')[0]);
      }

      toast({
        title: "Analyzing proposal",
        description: "Processing sections for evaluation...",
      });

      // Simulate analysis
      setTimeout(() => {
        const newScores: Record<string, any> = {};
        currentSections.forEach(section => {
          const subsectionScores: Record<string, any> = {};
          section.subsections.forEach(subsection => {
            subsectionScores[subsection.id] = {
              score: Math.floor(Math.random() * 30) + 70,
              status: 'scored'
            };
          });
          
          const avgScore = Object.values(subsectionScores)
            .reduce((sum: number, sub: any) => sum + sub.score, 0) / section.subsections.length;
          
          newScores[section.id] = {
            score: Math.round(avgScore),
            status: 'scored',
            subsections: subsectionScores
          };
        });
        setSectionScores(newScores);
        
        toast({
          title: "Analysis complete",
          description: "Proposal sections have been evaluated",
        });
      }, 2000);
    } catch (error) {
      console.error('Error handling file upload:', error);
      toast({
        title: "Error",
        description: "Failed to upload the proposal",
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
    if (proposalName.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter a proposal name",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Proposal saved successfully",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Proposals & RFPs</h1>
        <div className="flex items-center space-x-4">
          <select
            value={proposalType}
            onChange={(e) => setProposalType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {proposalTypes.map(type => (
              <option key={type.id} value={type.id}>{type.title}</option>
            ))}
          </select>
          <input
            type="text"
            value={proposalName}
            onChange={(e) => setProposalName(e.target.value)}
            placeholder="Proposal Name"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Proposal
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
          <p className="text-lg font-medium text-gray-600">Upload Proposal</p>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Drop a proposal file or click to select
          </p>
        </div>

        {currentSections.map((section) => (
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
                    <button className="p-1 text-gray-400 hover:text-blue-600">
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

export default Proposals;
