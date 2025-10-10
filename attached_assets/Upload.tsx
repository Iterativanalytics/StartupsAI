import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, Edit3, Save } from 'lucide-react';

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

  const onDrop = (acceptedFiles: File[]) => {
    // Handle file upload here
    console.log(acceptedFiles);
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
    // Handle saving the business plan
    console.log('Saving business plan...');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Business Plan Editor</h1>
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
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Plan
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
          <p className="text-lg font-medium text-gray-600">Upload Plan</p>
          <p className="mt-2 text-sm text-gray-500">
            Drop a file or click to select
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.id} className="col-span-1 bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-lg font-medium text-gray-800">{section.title}</h2>
            </div>
            <div className="p-4 space-y-3">
              {section.subsections.map((subsection) => (
                <div key={subsection.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{subsection.title}</span>
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Edit3 className="h-4 w-4" />
                  </button>
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