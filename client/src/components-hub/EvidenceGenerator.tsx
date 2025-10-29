import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  DollarSign,
  BarChart3,
  Target,
  Shield,
  Award,
  Clock,
  Eye,
  Share2
} from 'lucide-react';

interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  type: 'validation' | 'financial' | 'market' | 'team' | 'product' | 'legal';
  status: 'complete' | 'partial' | 'missing';
  confidence: number;
  source: string;
  date: Date;
  files?: string[];
}

interface EvidencePackage {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  items: EvidenceItem[];
  overallConfidence: number;
  investorReadiness: number;
  missingItems: string[];
}

interface EvidenceGeneratorProps {
  assumptions: any[];
  experiments: any[];
  financials: any;
  team: any[];
  onGeneratePackage: (evidencePackage: EvidencePackage) => void;
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const EVIDENCE_TEMPLATES = [
  {
    type: 'validation',
    title: 'Assumption Validation',
    description: 'Evidence that key business assumptions have been tested',
    icon: Target,
    required: true
  },
  {
    type: 'financial',
    title: 'Financial Validation',
    description: 'Proof of financial model accuracy and unit economics',
    icon: DollarSign,
    required: true
  },
  {
    type: 'market',
    title: 'Market Validation',
    description: 'Evidence of market size, demand, and competitive position',
    icon: TrendingUp,
    required: true
  },
  {
    type: 'team',
    title: 'Team Capability',
    description: 'Proof of team expertise and execution capability',
    icon: Users,
    required: true
  },
  {
    type: 'product',
    title: 'Product Validation',
    description: 'Evidence of product-market fit and user adoption',
    icon: Award,
    required: true
  },
  {
    type: 'legal',
    title: 'Legal & Compliance',
    description: 'Legal structure, IP protection, and regulatory compliance',
    icon: Shield,
    required: false
  }
];

const EvidenceGenerator: React.FC<EvidenceGeneratorProps> = ({
  assumptions,
  experiments,
  financials,
  team,
  onGeneratePackage,
  addToast
}) => {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(['validation', 'financial', 'market', 'team', 'product']);
  const [packageTitle, setPackageTitle] = useState('Investor Evidence Package');
  const [packageDescription, setPackageDescription] = useState('Comprehensive evidence package for due diligence');
  const [showGenerator, setShowGenerator] = useState(false);

  const generateEvidenceItems = (): EvidenceItem[] => {
    const items: EvidenceItem[] = [];

    // Validation Evidence
    if (selectedTemplates.includes('validation')) {
      const validatedAssumptions = assumptions.filter(a => a.status === 'validated');
      const validationRate = assumptions.length > 0 ? (validatedAssumptions.length / assumptions.length) * 100 : 0;
      
      items.push({
        id: 'val_1',
        title: 'Assumption Validation Summary',
        description: `${validatedAssumptions.length}/${assumptions.length} assumptions validated (${Math.round(validationRate)}%)`,
        type: 'validation',
        status: validationRate > 70 ? 'complete' : validationRate > 30 ? 'partial' : 'missing',
        confidence: Math.round(validationRate),
        source: 'Assumption Tracker',
        date: new Date(),
        files: ['assumption_validation_report.pdf']
      });

      if (experiments.length > 0) {
        const completedExperiments = experiments.filter(e => e.status === 'completed');
        items.push({
          id: 'val_2',
          title: 'Experiment Results',
          description: `${completedExperiments.length} completed experiments with documented results`,
          type: 'validation',
          status: completedExperiments.length > 0 ? 'complete' : 'missing',
          confidence: Math.min(100, completedExperiments.length * 20),
          source: 'Experiment Tracker',
          date: new Date(),
          files: ['experiment_results.pdf', 'user_feedback.pdf']
        });
      }
    }

    // Financial Evidence
    if (selectedTemplates.includes('financial')) {
      items.push({
        id: 'fin_1',
        title: 'Unit Economics Validation',
        description: 'Validated customer acquisition cost, lifetime value, and payback period',
        type: 'financial',
        status: 'complete',
        confidence: 85,
        source: 'Financial Model',
        date: new Date(),
        files: ['unit_economics_report.pdf', 'financial_model.xlsx']
      });

      items.push({
        id: 'fin_2',
        title: 'Revenue Validation',
        description: 'Proof of revenue generation and growth trajectory',
        type: 'financial',
        status: 'complete',
        confidence: 90,
        source: 'Revenue Analytics',
        date: new Date(),
        files: ['revenue_analysis.pdf', 'growth_metrics.pdf']
      });
    }

    // Market Evidence
    if (selectedTemplates.includes('market')) {
      items.push({
        id: 'mkt_1',
        title: 'Market Size Validation',
        description: 'Third-party market research and TAM/SAM/SOM analysis',
        type: 'market',
        status: 'complete',
        confidence: 80,
        source: 'Market Research',
        date: new Date(),
        files: ['market_research.pdf', 'tam_analysis.pdf']
      });

      items.push({
        id: 'mkt_2',
        title: 'Competitive Analysis',
        description: 'Comprehensive competitive landscape and positioning analysis',
        type: 'market',
        status: 'complete',
        confidence: 75,
        source: 'Competitive Intelligence',
        date: new Date(),
        files: ['competitive_analysis.pdf', 'positioning_study.pdf']
      });
    }

    // Team Evidence
    if (selectedTemplates.includes('team')) {
      items.push({
        id: 'team_1',
        title: 'Team Capability Matrix',
        description: 'Detailed team expertise and execution track record',
        type: 'team',
        status: 'complete',
        confidence: 85,
        source: 'Team Profiles',
        date: new Date(),
        files: ['team_profiles.pdf', 'execution_track_record.pdf']
      });

      items.push({
        id: 'team_2',
        title: 'Advisory Board',
        description: 'Industry experts and advisors supporting the venture',
        type: 'team',
        status: 'partial',
        confidence: 60,
        source: 'Advisory Network',
        date: new Date(),
        files: ['advisory_board.pdf']
      });
    }

    // Product Evidence
    if (selectedTemplates.includes('product')) {
      items.push({
        id: 'prod_1',
        title: 'Product-Market Fit Evidence',
        description: 'User adoption metrics and product-market fit indicators',
        type: 'product',
        status: 'complete',
        confidence: 80,
        source: 'Product Analytics',
        date: new Date(),
        files: ['pmf_analysis.pdf', 'user_metrics.pdf']
      });

      items.push({
        id: 'prod_2',
        title: 'Technical Validation',
        description: 'Proof of technical feasibility and scalability',
        type: 'product',
        status: 'complete',
        confidence: 90,
        source: 'Technical Team',
        date: new Date(),
        files: ['technical_architecture.pdf', 'scalability_analysis.pdf']
      });
    }

    // Legal Evidence
    if (selectedTemplates.includes('legal')) {
      items.push({
        id: 'legal_1',
        title: 'Legal Structure',
        description: 'Corporate structure, IP protection, and regulatory compliance',
        type: 'legal',
        status: 'complete',
        confidence: 95,
        source: 'Legal Team',
        date: new Date(),
        files: ['legal_structure.pdf', 'ip_portfolio.pdf', 'compliance_cert.pdf']
      });
    }

    return items;
  };

  const calculateOverallConfidence = (items: EvidenceItem[]): number => {
    if (items.length === 0) return 0;
    const totalConfidence = items.reduce((sum, item) => sum + item.confidence, 0);
    return Math.round(totalConfidence / items.length);
  };

  const calculateInvestorReadiness = (items: EvidenceItem[]): number => {
    const requiredItems = items.filter(item => 
      EVIDENCE_TEMPLATES.find(t => t.type === item.type)?.required
    );
    const completeRequired = requiredItems.filter(item => item.status === 'complete').length;
    const totalRequired = requiredItems.length;
    
    if (totalRequired === 0) return 0;
    return Math.round((completeRequired / totalRequired) * 100);
  };

  const generatePackage = () => {
    const items = generateEvidenceItems();
    const overallConfidence = calculateOverallConfidence(items);
    const investorReadiness = calculateInvestorReadiness(items);
    
    const missingItems = items
      .filter(item => item.status === 'missing')
      .map(item => item.title);

    const evidencePackage: EvidencePackage = {
      id: `evid_${Date.now()}`,
      title: packageTitle,
      description: packageDescription,
      createdAt: new Date(),
      items,
      overallConfidence,
      investorReadiness,
      missingItems
    };

    onGeneratePackage(evidencePackage);
    addToast('Evidence package generated successfully', 'success');
    setShowGenerator(false);
  };

  const getTypeIcon = (type: string) => {
    const template = EVIDENCE_TEMPLATES.find(t => t.type === type);
    return template ? template.icon : FileText;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'validation': return 'text-blue-600 bg-blue-50';
      case 'financial': return 'text-green-600 bg-green-50';
      case 'market': return 'text-purple-600 bg-purple-50';
      case 'team': return 'text-orange-600 bg-orange-50';
      case 'product': return 'text-pink-600 bg-pink-50';
      case 'legal': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'missing': return <Clock className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Evidence Generator</h2>
            <p className="text-gray-600">Create comprehensive evidence packages for investors</p>
          </div>
        </div>
        <button
          onClick={() => setShowGenerator(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Generate Package
        </button>
      </div>

      {/* Evidence Templates */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {EVIDENCE_TEMPLATES.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplates.includes(template.type);
          return (
            <div
              key={template.type}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                if (isSelected) {
                  setSelectedTemplates(prev => prev.filter(t => t !== template.type));
                } else {
                  setSelectedTemplates(prev => [...prev, template.type]);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-100' : 'bg-gray-100'}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-purple-600' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{template.title}</h3>
                    {template.required && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Evidence Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Generate Evidence Package</h3>
            
            <div className="space-y-6">
              {/* Package Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Title</label>
                  <input
                    type="text"
                    value={packageTitle}
                    onChange={(e) => setPackageTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={packageDescription}
                    onChange={(e) => setPackageDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Preview Evidence Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Evidence Items Preview</h4>
                <div className="space-y-3">
                  {generateEvidenceItems().map((item) => {
                    const Icon = getTypeIcon(item.type);
                    return (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-gray-900">{item.title}</h5>
                              {getStatusIcon(item.status)}
                              <span className="text-sm text-gray-500">
                                {item.confidence}% confidence
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Source: {item.source}</span>
                              <span>Date: {item.date.toLocaleDateString()}</span>
                              {item.files && (
                                <span>Files: {item.files.length}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Package Summary</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {calculateOverallConfidence(generateEvidenceItems())}%
                    </div>
                    <div className="text-sm text-gray-600">Overall Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {calculateInvestorReadiness(generateEvidenceItems())}%
                    </div>
                    <div className="text-sm text-gray-600">Investor Readiness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {generateEvidenceItems().length}
                    </div>
                    <div className="text-sm text-gray-600">Evidence Items</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowGenerator(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={generatePackage}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Generate Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceGenerator;
