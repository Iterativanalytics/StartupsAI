
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload as UploadIcon, 
  Edit3, 
  Save, 
  Rocket, 
  Award, 
  Trophy, 
  Building2, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Star,
  ExternalLink,
  Bookmark,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IterativFormSection {
  id: string;
  title: string;
  subsections: {
    id: string;
    title: string;
    content: string;
    required: boolean;
  }[];
}

interface OpenIterativForm {
  id: string;
  title: string;
  organization: string;
  type: 'accelerator' | 'grant' | 'competition' | 'investment';
  category: string;
  description: string;
  requirements: string[];
  benefits: string[];
  funding: {
    amount?: number;
    equity?: number;
    type: 'grant' | 'equity' | 'loan' | 'prize';
  };
  eligibility: {
    stage: string[];
    industry: string[];
    location: string[];
    teamSize: { min: number; max: number };
    revenue: { min: number; max: number };
  };
  timeline: {
    openDate: string;
    deadline: string;
    duration: string;
    startDate?: string;
  };
  status: 'open' | 'closing-soon' | 'closed' | 'upcoming';
  difficulty: 'easy' | 'medium' | 'hard';
  popularity: number;
  successRate: number;
  tags: string[];
  website: string;
  contact: {
    email: string;
    phone?: string;
  };
  featured: boolean;
  deadline: string;
  location: string;
}

function IterativForms() {
  const [applicationName, setApplicationName] = useState('');
  const [applicationType, setApplicationType] = useState('accelerator');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [showMyApplications, setShowMyApplications] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const { toast } = useToast();

  const [sectionScores, setSectionScores] = useState<Record<string, any>>({});
  
  const applicationTypes = [
    { id: 'accelerator', title: 'Accelerator Application', icon: Rocket, color: 'bg-purple-100 text-purple-700' },
    { id: 'grant', title: 'Grant Application', icon: Award, color: 'bg-green-100 text-green-700' },
    { id: 'competition', title: 'Competition Entry', icon: Trophy, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'investment', title: 'Investment Application', icon: Building2, color: 'bg-blue-100 text-blue-700' }
  ];

  // Comprehensive list of open applications
  const openIterativForms: OpenIterativForm[] = [
    {
      id: 'ycombinator-w24',
      title: 'Y Combinator Winter 2024',
      organization: 'Y Combinator',
      type: 'accelerator',
      category: 'Tech Startup Accelerator',
      description: 'The world\'s most prestigious startup accelerator. Get $500K in funding, world-class mentorship, and access to the YC network.',
      requirements: ['Working product', 'Traction', 'Strong team', 'Clear vision'],
      benefits: ['$500K funding', 'Mentorship', 'Network access', 'Demo Day exposure'],
      funding: { amount: 500000, type: 'equity', equity: 7 },
      eligibility: {
        stage: ['pre-seed', 'seed'],
        industry: ['technology', 'software', 'hardware', 'biotech'],
        location: ['global'],
        teamSize: { min: 1, max: 10 },
        revenue: { min: 0, max: 1000000 }
      },
      timeline: {
        openDate: '2024-01-15',
        deadline: '2024-10-15',
        duration: '3 months',
        startDate: '2025-01-15'
      },
      status: 'open',
      difficulty: 'hard',
      popularity: 95,
      successRate: 2.5,
      tags: ['prestigious', 'tech', 'funding', 'mentorship'],
      website: 'https://ycombinator.com',
      contact: { email: 'apply@ycombinator.com' },
      featured: true,
      deadline: '2024-10-15',
      location: 'San Francisco, CA'
    },
    {
      id: 'techstars-nyc',
      title: 'Techstars NYC',
      organization: 'Techstars',
      type: 'accelerator',
      category: 'Tech Startup Accelerator',
      description: 'Join the Techstars network with $120K funding, mentorship, and access to investors.',
      requirements: ['MVP', 'Team', 'Market validation'],
      benefits: ['$120K funding', 'Mentorship', 'Investor network', 'Office space'],
      funding: { amount: 120000, type: 'equity', equity: 6 },
      eligibility: {
        stage: ['pre-seed', 'seed'],
        industry: ['technology', 'fintech', 'healthtech'],
        location: ['north-america'],
        teamSize: { min: 2, max: 8 },
        revenue: { min: 0, max: 500000 }
      },
      timeline: {
        openDate: '2024-02-01',
        deadline: '2024-11-30',
        duration: '3 months',
        startDate: '2025-02-01'
      },
      status: 'open',
      difficulty: 'hard',
      popularity: 88,
      successRate: 8,
      tags: ['tech', 'mentorship', 'network'],
      website: 'https://techstars.com',
      contact: { email: 'nyc@techstars.com' },
      featured: true,
      deadline: '2024-11-30',
      location: 'New York, NY'
    },
    {
      id: 'nsf-sbir-phase1',
      title: 'NSF SBIR Phase I',
      organization: 'National Science Foundation',
      type: 'grant',
      category: 'Research & Development Grant',
      description: 'Up to $275K for early-stage R&D with commercial potential. No equity required.',
      requirements: ['Innovative technology', 'Commercial potential', 'Technical merit'],
      benefits: ['$275K funding', 'No equity', 'Technical support', 'Commercialization assistance'],
      funding: { amount: 275000, type: 'grant' },
      eligibility: {
        stage: ['pre-seed', 'seed'],
        industry: ['technology', 'science', 'engineering'],
        location: ['united-states'],
        teamSize: { min: 1, max: 50 },
        revenue: { min: 0, max: 1000000 }
      },
      timeline: {
        openDate: '2024-01-01',
        deadline: '2024-12-15',
        duration: '6-12 months',
        startDate: '2025-01-01'
      },
      status: 'open',
      difficulty: 'medium',
      popularity: 75,
      successRate: 15,
      tags: ['research', 'no-equity', 'government'],
      website: 'https://nsf.gov/sbir',
      contact: { email: 'sbir@nsf.gov' },
      featured: false,
      deadline: '2024-12-15',
      location: 'United States'
    },
    {
      id: 'startup-grind-global',
      title: 'Startup Grind Global Conference',
      organization: 'Startup Grind',
      type: 'competition',
      category: 'Pitch Competition',
      description: 'Pitch your startup to global investors and win $50K in prizes.',
      requirements: ['Working product', 'Pitch deck', 'Team presentation'],
      benefits: ['$50K prize', 'Investor exposure', 'Media coverage', 'Networking'],
      funding: { amount: 50000, type: 'prize' },
      eligibility: {
        stage: ['pre-seed', 'seed', 'series-a'],
        industry: ['all'],
        location: ['global'],
        teamSize: { min: 1, max: 20 },
        revenue: { min: 0, max: 5000000 }
      },
      timeline: {
        openDate: '2024-03-01',
        deadline: '2024-09-30',
        duration: '1 day',
        startDate: '2024-10-15'
      },
      status: 'open',
      difficulty: 'medium',
      popularity: 70,
      successRate: 5,
      tags: ['pitch', 'competition', 'networking'],
      website: 'https://startupgrind.com',
      contact: { email: 'global@startupgrind.com' },
      featured: false,
      deadline: '2024-09-30',
      location: 'Redwood City, CA'
    },
    {
      id: 'google-startup-accelerator',
      title: 'Google for Startups Accelerator',
      organization: 'Google',
      type: 'accelerator',
      category: 'Tech Startup Accelerator',
      description: '3-month program with Google mentorship, cloud credits, and investor connections.',
      requirements: ['Tech startup', 'Growth potential', 'Team commitment'],
      benefits: ['$100K cloud credits', 'Google mentorship', 'Investor network', 'Technical support'],
      funding: { amount: 100000, type: 'grant' },
      eligibility: {
        stage: ['seed', 'series-a'],
        industry: ['technology', 'ai', 'cloud', 'mobile'],
        location: ['global'],
        teamSize: { min: 2, max: 15 },
        revenue: { min: 10000, max: 10000000 }
      },
      timeline: {
        openDate: '2024-02-15',
        deadline: '2024-10-31',
        duration: '3 months',
        startDate: '2025-01-15'
      },
      status: 'open',
      difficulty: 'hard',
      popularity: 90,
      successRate: 12,
      tags: ['google', 'tech', 'cloud', 'ai'],
      website: 'https://startup.google.com',
      contact: { email: 'accelerator@google.com' },
      featured: true,
      deadline: '2024-10-31',
      location: 'Global'
    },
    {
      id: 'sba-small-business-grant',
      title: 'SBA Small Business Innovation Research',
      organization: 'Small Business Administration',
      type: 'grant',
      category: 'Small Business Grant',
      description: 'Up to $150K for small business innovation and research projects.',
      requirements: ['Small business', 'Innovation project', 'Research component'],
      benefits: ['$150K funding', 'No equity', 'Business support', 'Research resources'],
      funding: { amount: 150000, type: 'grant' },
      eligibility: {
        stage: ['pre-seed', 'seed'],
        industry: ['all'],
        location: ['united-states'],
        teamSize: { min: 1, max: 500 },
        revenue: { min: 0, max: 10000000 }
      },
      timeline: {
        openDate: '2024-01-01',
        deadline: '2024-11-30',
        duration: '6-18 months',
        startDate: '2025-01-01'
      },
      status: 'open',
      difficulty: 'easy',
      popularity: 60,
      successRate: 25,
      tags: ['government', 'small-business', 'innovation'],
      website: 'https://sba.gov',
      contact: { email: 'sbir@sba.gov' },
      featured: false,
      deadline: '2024-11-30',
      location: 'United States'
    },
    {
      id: 'techcrunch-disrupt',
      title: 'TechCrunch Disrupt Startup Battlefield',
      organization: 'TechCrunch',
      type: 'competition',
      category: 'Pitch Competition',
      description: 'Pitch at the world\'s premier startup conference. Win $100K and global exposure.',
      requirements: ['Early-stage startup', 'Pitch presentation', 'Demo ready'],
      benefits: ['$100K prize', 'Global exposure', 'Media coverage', 'Investor access'],
      funding: { amount: 100000, type: 'prize' },
      eligibility: {
        stage: ['pre-seed', 'seed'],
        industry: ['technology'],
        location: ['global'],
        teamSize: { min: 1, max: 10 },
        revenue: { min: 0, max: 1000000 }
      },
      timeline: {
        openDate: '2024-04-01',
        deadline: '2024-08-31',
        duration: '3 days',
        startDate: '2024-09-15'
      },
      status: 'closing-soon',
      difficulty: 'hard',
      popularity: 95,
      successRate: 1,
      tags: ['prestigious', 'media', 'global', 'tech'],
      website: 'https://techcrunch.com',
      contact: { email: 'battlefield@techcrunch.com' },
      featured: true,
      deadline: '2024-08-31',
      location: 'San Francisco, CA'
    },
    {
      id: '500-startups-batch',
      title: '500 Startups Batch Program',
      organization: '500 Global',
      type: 'accelerator',
      category: 'Global Startup Accelerator',
      description: '4-month program with $250K funding, global network, and growth support.',
      requirements: ['Traction', 'Growth potential', 'Global mindset'],
      benefits: ['$250K funding', 'Global network', 'Growth support', 'Mentorship'],
      funding: { amount: 250000, type: 'equity', equity: 5 },
      eligibility: {
        stage: ['seed', 'series-a'],
        industry: ['all'],
        location: ['global'],
        teamSize: { min: 2, max: 20 },
        revenue: { min: 10000, max: 5000000 }
      },
      timeline: {
        openDate: '2024-03-01',
        deadline: '2024-12-15',
        duration: '4 months',
        startDate: '2025-03-01'
      },
      status: 'open',
      difficulty: 'hard',
      popularity: 85,
      successRate: 10,
      tags: ['global', 'growth', 'network', 'funding'],
      website: 'https://500.co',
      contact: { email: 'batch@500.co' },
      featured: true,
      deadline: '2024-12-15',
      location: 'Global'
    }
  ];

  const sections: Record<string, IterativFormSection[]> = {
    accelerator: [
      {
        id: 'company-overview',
        title: 'Company Overview',
        subsections: [
          { id: 'company-description', title: 'Company Description', content: '', required: true },
          { id: 'problem-solution', title: 'Problem & Solution', content: '', required: true },
          { id: 'target-market', title: 'Target Market', content: '', required: true },
          { id: 'business-model', title: 'Business Model', content: '', required: true }
        ]
      },
      {
        id: 'team',
        title: 'Team & Founders',
        subsections: [
          { id: 'founder-bios', title: 'Founder Biographies', content: '', required: true },
          { id: 'team-experience', title: 'Relevant Experience', content: '', required: true },
          { id: 'advisory-board', title: 'Advisory Board', content: '', required: false },
          { id: 'equity-distribution', title: 'Equity Distribution', content: '', required: true }
        ]
      },
      {
        id: 'traction',
        title: 'Traction & Metrics',
        subsections: [
          { id: 'current-status', title: 'Current Status', content: '', required: true },
          { id: 'key-metrics', title: 'Key Metrics', content: '', required: true },
          { id: 'revenue', title: 'Revenue & Growth', content: '', required: false },
          { id: 'user-base', title: 'User Base', content: '', required: false }
        ]
      },
      {
        id: 'financials',
        title: 'Financial Information',
        subsections: [
          { id: 'funding-history', title: 'Funding History', content: '', required: true },
          { id: 'current-runway', title: 'Current Runway', content: '', required: true },
          { id: 'financial-projections', title: 'Financial Projections', content: '', required: true },
          { id: 'use-of-funds', title: 'Use of Funds', content: '', required: true }
        ]
      }
    ],
    grant: [
      {
        id: 'project-summary',
        title: 'Project Summary',
        subsections: [
          { id: 'project-title', title: 'Project Title', content: '', required: true },
          { id: 'abstract', title: 'Project Abstract', content: '', required: true },
          { id: 'objectives', title: 'Project Objectives', content: '', required: true },
          { id: 'innovation', title: 'Innovation Statement', content: '', required: true }
        ]
      },
      {
        id: 'technical-approach',
        title: 'Technical Approach',
        subsections: [
          { id: 'methodology', title: 'Methodology', content: '', required: true },
          { id: 'work-plan', title: 'Work Plan', content: '', required: true },
          { id: 'deliverables', title: 'Deliverables', content: '', required: true },
          { id: 'timeline', title: 'Timeline', content: '', required: true }
        ]
      }
    ]
  };

  const currentSections = sections[applicationType] || sections.accelerator;

  // Filter applications based on search and filters
  const filteredApplications = openApplications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || app.type === filterType;
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesDifficulty = filterDifficulty === 'all' || app.difficulty === filterDifficulty;
    
    return matchesSearch && matchesType && matchesStatus && matchesDifficulty;
  });

  const featuredApplications = filteredApplications.filter(app => app.featured);
  const regularApplications = filteredApplications.filter(app => !app.featured);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closing-soon': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
      if (applicationName.trim() === '') {
        setApplicationName(file.name.split('.')[0]);
      }

      toast({
        title: "Analyzing application",
        description: "Checking completeness and readiness...",
      });

      // Simulate analysis with focus on completeness
      setTimeout(() => {
        const newScores: Record<string, any> = {};
        currentSections.forEach(section => {
          const subsectionScores: Record<string, any> = {};
          section.subsections.forEach(subsection => {
            // Required sections get higher baseline scores
            const baseScore = subsection.required ? 60 : 70;
            subsectionScores[subsection.id] = {
              score: Math.floor(Math.random() * 30) + baseScore,
              status: 'scored',
              required: subsection.required
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
          description: "Application readiness assessment completed",
        });
      }, 2000);
    } catch (error) {
      console.error('Error handling file upload:', error);
      toast({
        title: "Error",
        description: "Failed to upload the application",
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
    if (applicationName.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter an application name",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Application saved successfully",
    });
  };

  const calculateCompleteness = () => {
    if (Object.keys(sectionScores).length === 0) return 0;
    
    let totalRequired = 0;
    let completedRequired = 0;
    
    currentSections.forEach(section => {
      section.subsections.forEach(subsection => {
        if (subsection.required) {
          totalRequired++;
          const score = sectionScores[section.id]?.subsections[subsection.id]?.score || 0;
          if (score >= 70) completedRequired++;
        }
      });
    });
    
    return totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;
  };

  const completeness = calculateCompleteness();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Open Applications</h1>
          <p className="text-gray-600 mt-1">Discover and apply to startup programs, grants, and competitions</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowMyApplications(!showMyApplications)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showMyApplications 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            My Applications
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <UploadIcon className="h-5 w-5 mr-2" />
            Upload Application
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="accelerator">Accelerators</option>
            <option value="grant">Grants</option>
            <option value="competition">Competitions</option>
            <option value="investment">Investment</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closing-soon">Closing Soon</option>
            <option value="upcoming">Upcoming</option>
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Featured Applications */}
      {featuredApplications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Featured Applications
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{app.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{app.organization}</p>
                      <p className="text-gray-700 text-sm line-clamp-2">{app.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {app.funding.amount ? formatCurrency(app.funding.amount) : 'Varies'}
                      {app.funding.equity && ` (${app.funding.equity}% equity)`}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {app.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {getDaysUntilDeadline(app.deadline)} days left
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {app.eligibility.teamSize.min}-{app.eligibility.teamSize.max} team
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(app.difficulty)}`}>
                        {app.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">
                        {app.successRate}% success rate
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Applications */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Applications ({filteredApplications.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularApplications.map((app) => (
            <div key={app.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{app.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{app.organization}</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{app.description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {app.funding.amount ? formatCurrency(app.funding.amount) : 'Varies'}
                    {app.funding.equity && ` (${app.funding.equity}% equity)`}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {app.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {getDaysUntilDeadline(app.deadline)} days left
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(app.difficulty)}`}>
                      {app.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">
                      {app.successRate}% success rate
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm">
                      View
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Application</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors p-8
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
          >
            <input {...getInputProps()} />
            <UploadIcon className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">Upload Application</p>
            <p className="text-sm text-gray-500 text-center">
              Drop an application file or click to select
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
              <input
                type="text"
                value={applicationName}
                onChange={(e) => setApplicationName(e.target.value)}
                placeholder="Enter application name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Type</label>
              <select
                value={applicationType}
                onChange={(e) => setApplicationType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {applicationTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.title}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IterativForms;
