import React, { useState } from 'react';
import { 
  Search, Filter, DollarSign, Gift, Award, Calendar,
  TrendingUp, Info, HelpCircle, Star, ExternalLink, Building, Building2
} from 'lucide-react';
import { Grant, ToastType } from '../../types';

interface GrantsAppProps {
  addToast: (message: string, type: ToastType) => void;
}

const GrantsApp: React.FC<GrantsAppProps> = ({ addToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState([1000, 1000000]);
  const [deadlineFilter, setDeadlineFilter] = useState<string>('all');

  const grants: Grant[] = [
    {
      id: 1, name: "SBIR Phase I", provider: "National Science Foundation", type: "government", amount: 150000, deadline: "2024-06-15",
      eligibility: ["Small business", "US-based", "Technology focus"], sectors: ["Technology", "Research", "Innovation"], matchScore: 95,
      description: "Small Business Innovation Research program for early-stage technology development.", website: "https://nsf.gov/sbir",
      requirements: ["Research proposal", "Technical feasibility", "Commercial potential"], applicationProcess: ["Pre-application", "Full proposal", "Review process"],
      successRate: 0.15, avgProcessingTime: "6-8 months"
    },
    {
      id: 2, name: "Gates Foundation Global Health", provider: "Bill & Melinda Gates Foundation", type: "foundation", amount: 500000, deadline: "2024-08-30",
      eligibility: ["Non-profit", "Global health focus", "Innovation"], sectors: ["Healthcare", "Global Health", "Technology"], matchScore: 88,
      description: "Funding for innovative solutions to global health challenges.", website: "https://gatesfoundation.org",
      requirements: ["Health impact", "Innovation", "Scalability"], applicationProcess: ["Letter of inquiry", "Full proposal", "Review"],
      successRate: 0.08, avgProcessingTime: "4-6 months"
    },
    {
      id: 3, name: "Google for Startups", provider: "Google", type: "corporate", amount: 100000, deadline: "2024-07-20",
      eligibility: ["Tech startup", "Early stage", "Global"], sectors: ["Technology", "AI", "Cloud Computing"], matchScore: 92,
      description: "Google's startup accelerator program with funding and mentorship.", website: "https://startup.google.com",
      requirements: ["Tech focus", "Scalable business", "Innovation"], applicationProcess: ["Application", "Interview", "Selection"],
      successRate: 0.12, avgProcessingTime: "2-3 months"
    },
  ];

  const filteredGrants = grants.filter(grant => {
    const matchesSearch = grant.name.toLowerCase().includes(searchQuery.toLowerCase()) || grant.description.toLowerCase().includes(searchQuery.toLowerCase()) || grant.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSectors.length === 0 || selectedSectors.some(sector => grant.sectors.includes(sector));
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(grant.type);
    const matchesAmount = grant.amount >= amountRange[0] && grant.amount <= amountRange[1];
    const matchesDeadline = deadlineFilter === 'all' || (deadlineFilter === 'soon' && new Date(grant.deadline) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) || (deadlineFilter === 'later' && new Date(grant.deadline) > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    return matchesSearch && matchesSector && matchesType && matchesAmount && matchesDeadline;
  });

  const sectors = ["Technology", "Healthcare", "Research", "Innovation", "Global Health", "AI", "Cloud Computing", "Biotechnology", "Social Impact", "Education"];

  const grantTypes = [
    { value: 'government', label: 'Government', icon: Building, color: 'blue' },
    { value: 'foundation', label: 'Foundation', icon: Gift, color: 'purple' },
    { value: 'corporate', label: 'Corporate', icon: Building2, color: 'green' },
    { value: 'research', label: 'Research', icon: Award, color: 'orange' }
  ];

  const deadlineFilters = [{ value: 'all', label: 'All Deadlines' }, { value: 'soon', label: 'Within 30 Days' }, { value: 'later', label: 'More than 30 Days' }];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };
  
  const getTypeIcon = (type: string) => grantTypes.find(t => t.value === type)?.icon || Gift;
  const getTypeColor = (type: string) => grantTypes.find(t => t.value === type)?.color || 'gray';
  
  const formatDeadline = (deadline: string) => {
    const diffDays = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Expired';
    if (diffDays <= 30) return `${diffDays} days left`;
    return `${Math.ceil(diffDays / 30)} months left`;
  };
  
  const getDeadlineColor = (deadline: string) => {
    const diffDays = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'text-red-600 bg-red-50';
    if (diffDays <= 30) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 -m-8 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8"><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-100 rounded-lg"><Gift className="h-6 w-6 text-purple-600" /></div><h1 className="text-4xl font-bold text-gray-900">Grant Funding</h1></div><p className="text-xl text-gray-600 max-w-3xl">Discover non-dilutive funding opportunities from government agencies, foundations, and corporations to support your mission.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6"><div className="flex items-center gap-3"><div className="p-2 bg-purple-100 rounded-lg"><DollarSign className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold text-gray-900">$3.2B</p><p className="text-sm text-gray-600">Available Grants</p></div></div></div>
          <div className="bg-white rounded-lg shadow p-6"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><Gift className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold text-gray-900">156</p><p className="text-sm text-gray-600">Active Programs</p></div></div></div>
          <div className="bg-white rounded-lg shadow p-6"><div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-lg"><Award className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold text-gray-900">14%</p><p className="text-sm text-gray-600">Avg. Success Rate</p></div></div></div>
          <div className="bg-white rounded-lg shadow p-6"><div className="flex items-center gap-3"><div className="p-2 bg-orange-100 rounded-lg"><Calendar className="h-5 w-5 text-orange-600" /></div><div><p className="text-2xl font-bold text-gray-900">23</p><p className="text-sm text-gray-600">Deadlines This Month</p></div></div></div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="pb-4 border-b border-gray-200"><h3 className="text-lg font-semibold flex items-center gap-2"><Filter className="h-5 w-5" /> Find Your Perfect Grant</h3><p className="text-sm text-gray-500">Use filters to find grants that align with your organization's mission</p></div>
          <div className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Search Grants</label><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input placeholder="Search by name, provider, or description..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label><select value={deadlineFilter} onChange={(e) => setDeadlineFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">{deadlineFilters.map(filter => (<option key={filter.value} value={filter.value}>{filter.label}</option>))}</select></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Grant Amount: {formatCurrency(amountRange[0])} - {formatCurrency(amountRange[1])}</label><div className="flex items-center gap-4"><input type="number" value={amountRange[0]} onChange={e => setAmountRange([+e.target.value, amountRange[1]])} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /><span>-</span><input type="number" value={amountRange[1]} onChange={e => setAmountRange([amountRange[0], +e.target.value])} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Grant Types</label><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{grantTypes.map(type => { const Icon = type.icon; return (<button key={type.value} onClick={() => { setSelectedTypes(prev => prev.includes(type.value) ? prev.filter(t => t !== type.value) : [...prev, type.value]);}} className={`p-3 rounded-lg border-2 transition-all ${selectedTypes.includes(type.value) ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700` : 'border-gray-200 hover:border-gray-300'}`}><Icon className="h-5 w-5 mx-auto mb-2" /><p className="text-xs font-medium text-center">{type.label}</p></button>);})}</div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Sectors</label><div className="flex flex-wrap gap-2">{sectors.map(sector => (<button key={sector} onClick={() => { setSelectedSectors(prev => prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]); }} className={`cursor-pointer px-3 py-1 rounded-full text-sm border ${selectedSectors.includes(sector) ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{sector}</button>))}</div></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-gray-900">{filteredGrants.length} Grants Found</h2><div className="flex items-center gap-2 text-sm text-gray-600"><span>Sorted by Match Score</span><TrendingUp className="h-4 w-4" /></div></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{filteredGrants.map(grant => { const TypeIcon = getTypeIcon(grant.type); const typeColor = getTypeColor(grant.type); return (
              <div key={grant.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3"><div className={`p-2 bg-${typeColor}-100 rounded-lg`}><TypeIcon className={`h-6 w-6 text-${typeColor}-600`} /></div><div><h3 className="text-lg font-semibold">{grant.name}</h3><p className="text-sm text-gray-500">{grant.provider}</p></div></div>
                    <div className="text-right"><div className="flex items-center gap-1 mb-1"><Star className="h-4 w-4 text-yellow-500 fill-current" /><span className="text-sm font-medium">{grant.matchScore}% Match</span></div><div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{width: `${grant.matchScore}%`}}></div></div></div>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{grant.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><p className="text-sm font-medium text-gray-700">Grant Amount</p><p className="text-lg font-bold text-gray-900">{formatCurrency(grant.amount)}</p></div>
                    <div><p className="text-sm font-medium text-gray-700">Success Rate</p><p className="text-sm text-gray-600">{(grant.successRate * 100).toFixed(0)}%</p></div>
                    <div><p className="text-sm font-medium text-gray-700">Processing Time</p><p className="text-sm text-gray-600">{grant.avgProcessingTime}</p></div>
                    <div><p className="text-sm font-medium text-gray-700">Deadline</p><span className={`text-xs px-2 py-1 rounded-full font-medium ${getDeadlineColor(grant.deadline)}`}>{formatDeadline(grant.deadline)}</span></div>
                  </div>
                  <div className="mb-4"><p className="text-sm font-medium text-gray-700 mb-2">Sectors</p><div className="flex flex-wrap gap-1">{grant.sectors.map(sector => (<span key={sector} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{sector}</span>))}</div></div>
                </div>
                <div className="p-6 bg-gray-50 rounded-b-lg flex gap-2"><button onClick={() => addToast(`Opening application for ${grant.name}...`, 'info')} className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"><ExternalLink className="h-4 w-4 mr-2" />Apply Now</button><button onClick={() => addToast('Learn more feature coming soon!', 'info')} className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"><Info className="h-4 w-4 mr-2" />Learn More</button></div>
              </div>);})}</div>
        </div>
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow"><div className="p-8 text-center"><h3 className="text-2xl font-bold mb-4">Ready to Secure Grant Funding?</h3><p className="text-purple-100 mb-6 max-w-2xl mx-auto">Get matched with grants that align with your mission. Our platform analyzes your organization and connects you with funding opportunities that are perfect for your goals.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><button onClick={() => addToast('Finding grants...', 'info')} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-purple-600 bg-white hover:bg-purple-50"><Gift className="h-5 w-5 mr-2" />Find My Grants</button><button onClick={() => addToast('Help feature coming soon!', 'info')} className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md shadow-sm text-white hover:bg-white hover:text-purple-600"><HelpCircle className="h-5 w-5 mr-2" />Get Help</button></div></div></div>
      </div>
    </div>
  );
};

export default GrantsApp;
