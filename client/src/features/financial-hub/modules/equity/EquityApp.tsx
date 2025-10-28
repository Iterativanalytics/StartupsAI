import React, { useState } from 'react';
import { 
  Search, Filter, DollarSign, Users, Award, Clock,
  TrendingUp, Star, ExternalLink, Building, Zap, HelpCircle
} from 'lucide-react';
import { Investor, ToastType } from '../../types';

interface EquityAppProps {
  addToast: (message: string, type: ToastType) => void;
}

const EquityApp: React.FC<EquityAppProps> = ({ addToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [fundingRange, setFundingRange] = useState([50000, 5000000]);
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const investors: Investor[] = [
    {
      id: 1,
      name: "Sequoia Capital",
      type: "vc",
      logo: "https://logo.clearbit.com/sequoiacap.com",
      minInvestment: 500000,
      maxInvestment: 10000000,
      industries: ["Software", "FinTech", "Healthcare"],
      stages: ["Seed", "Series A", "Series B"],
      regions: ["North America", "Europe", "Asia"],
      portfolio: 156,
      successRate: 0.78,
      matchScore: 92,
      description: "Leading venture capital firm focused on technology companies from seed to growth stage.",
      website: "https://sequoiacap.com",
      recentInvestments: ["Airbnb", "WhatsApp", "Stripe"]
    },
    {
      id: 2,
      name: "Andreessen Horowitz",
      type: "vc",
      logo: "https://logo.clearbit.com/a16z.com",
      minInvestment: 1000000,
      maxInvestment: 20000000,
      industries: ["AI", "Blockchain", "Enterprise"],
      stages: ["Series A", "Series B", "Series C"],
      regions: ["North America", "Europe"],
      portfolio: 208,
      successRate: 0.82,
      matchScore: 88,
      description: "Technology-focused venture capital firm investing in software and internet companies.",
      website: "https://a16z.com",
      recentInvestments: ["Coinbase", "GitHub", "Oculus"]
    },
    {
      id: 3,
      name: "Y Combinator",
      type: "vc",
      logo: "https://logo.clearbit.com/ycombinator.com",
      minInvestment: 125000,
      maxInvestment: 2000000,
      industries: ["All Industries"],
      stages: ["Pre-seed", "Seed"],
      regions: ["Global"],
      portfolio: 3000,
      successRate: 0.65,
      matchScore: 95,
      description: "Startup accelerator and seed fund providing funding and mentorship to early-stage companies.",
      website: "https://ycombinator.com",
      recentInvestments: ["Airbnb", "Stripe", "DoorDash"]
    },
  ];

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         investor.industries.some(industry => 
                           industry.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesIndustry = selectedIndustries.length === 0 || 
                           selectedIndustries.some(industry => 
                             investor.industries.includes(industry)
                           );
    const matchesStage = selectedStage === 'all' || investor.stages.includes(selectedStage);
    const matchesRange = investor.minInvestment <= fundingRange[1] && 
                        investor.maxInvestment >= fundingRange[0];
    
    return matchesSearch && matchesIndustry && matchesStage && matchesRange;
  });

  const industries = ["Software", "FinTech", "Healthcare", "AI", "Blockchain", "Enterprise", "SaaS", "E-commerce"];

  const stages = [
    { value: 'all', label: 'All Stages' },
    { value: 'Pre-seed', label: 'Pre-seed' },
    { value: 'Seed', label: 'Seed' },
    { value: 'Series A', label: 'Series A' },
    { value: 'Series B', label: 'Series B' },
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 -m-8 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Equity Funding</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Connect with venture capitalists, angel investors, and equity partners to fuel your company's growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg"><TrendingUp className="h-5 w-5 text-green-600" /></div>
              <div><p className="text-2xl font-bold text-gray-900">$2.4B</p><p className="text-sm text-gray-600">Total Funding Available</p></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><Users className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-2xl font-bold text-gray-900">127</p><p className="text-sm text-gray-600">Active Investors</p></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg"><Award className="h-5 w-5 text-purple-600" /></div>
              <div><p className="text-2xl font-bold text-gray-900">73%</p><p className="text-sm text-gray-600">Success Rate</p></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg"><Clock className="h-5 w-5 text-orange-600" /></div>
              <div><p className="text-2xl font-bold text-gray-900">45</p><p className="text-sm text-gray-600">Days Avg. Close</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Filter className="h-5 w-5" /> Find Your Perfect Match</h3>
            <p className="text-sm text-gray-500">Use filters to find investors that align with your business needs</p>
          </div>
          <div className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Investors</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    placeholder="Search by name or industry..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Funding Stage</label>
                <select 
                  value={selectedStage} 
                  onChange={(e) => setSelectedStage(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {stages.map(stage => (<option key={stage.value} value={stage.value}>{stage.label}</option>))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Range: {formatCurrency(fundingRange[0])} - {formatCurrency(fundingRange[1])}
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  value={fundingRange[0]} 
                  onChange={e => setFundingRange([+e.target.value, fundingRange[1]])} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span>-</span>
                <input 
                  type="number" 
                  value={fundingRange[1]} 
                  onChange={e => setFundingRange([fundingRange[0], +e.target.value])} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industries</label>
              <div className="flex flex-wrap gap-2">
                {industries.map(industry => (
                  <button 
                    key={industry} 
                    onClick={() => {
                      setSelectedIndustries(prev => 
                        prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
                      );
                    }} 
                    className={`cursor-pointer px-3 py-1 rounded-full text-sm border transition-colors ${
                      selectedIndustries.includes(industry) 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{filteredInvestors.length} Investors Found</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Sorted by Match Score</span>
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInvestors.map(investor => (
              <div key={investor.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={investor.logo} alt={investor.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h3 className="text-lg font-semibold">{investor.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {investor.type === 'vc' ? 'Venture Capital' : investor.type === 'angel' ? 'Angel Investor' : 'Private Equity'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{investor.matchScore}% Match</span>
                      </div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{width: `${investor.matchScore}%`}}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{investor.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Investment Range</p>
                      <p className="text-sm text-gray-600">{formatCurrency(investor.minInvestment)} - {formatCurrency(investor.maxInvestment)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Portfolio Size</p>
                      <p className="text-sm text-gray-600">{investor.portfolio} companies</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Industries</p>
                    <div className="flex flex-wrap gap-1">
                      {investor.industries.slice(0, 3).map(industry => (
                        <span key={industry} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{industry}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-b-lg flex gap-2">
                  <button 
                    onClick={() => addToast(`Opening ${investor.name} profile...`, 'info')}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />View Profile
                  </button>
                  <button 
                    onClick={() => addToast(`Connection request sent to ${investor.name}!`, 'success')}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Users className="h-4 w-4 mr-2" />Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow">
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Raise Equity?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get matched with the right investors for your startup. Our AI-powered platform analyzes your business and connects you with investors who are actively looking for companies like yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => addToast('Starting matching process...', 'info')}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50"
              >
                <Zap className="h-5 w-5 mr-2" />Start Matching
              </button>
              <button 
                onClick={() => addToast('Learn more feature coming soon!', 'info')}
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md shadow-sm text-white hover:bg-white hover:text-blue-600"
              >
                <HelpCircle className="h-5 w-5 mr-2" />Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquityApp;
