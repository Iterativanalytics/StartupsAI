import React, { useState } from 'react';
import { 
  Search, Filter, DollarSign, Users, Award, TrendingUp, Target, Star, ArrowRight
} from 'lucide-react';
import { Investor, Lender, Grant, ToastType } from '../../types';

interface MatcherAppProps {
  addToast: (message: string, type: ToastType) => void;
}

type FundingType = 'equity' | 'debt' | 'grants';

const MatcherApp: React.FC<MatcherAppProps> = ({ addToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [fundingRange, setFundingRange] = useState([50000, 500000]);
  const [activeTab, setActiveTab] = useState<FundingType>('equity');

  const investors: Investor[] = [
    { id: 1, name: "Sequoia Capital", type: "vc", logo: "https://logo.clearbit.com/sequoiacap.com", minInvestment: 500000, maxInvestment: 10000000, industries: ["Software", "FinTech", "Healthcare"], stages: ["Seed", "Series A"], regions: ["North America"], portfolio: 156, successRate: 0.78, matchScore: 92, description: "Leading VC firm", website: "https://sequoiacap.com", recentInvestments: ["Airbnb", "Stripe"] }
  ];
  
  const lenders: Lender[] = [
    { id: 1, name: "First National Bank", type: "bank", logo: "https://logo.clearbit.com/fnb.co.za", minLoan: 100000, maxLoan: 5000000, interestRate: 6.5, term: 60, requirements: { minCreditScore: 680, minTimeInBusiness: 2, minAnnualRevenue: 250000 }, matchScore: 88, description: "Traditional banking", website: "https://fnb.co.za", features: ["Low rates", "Flexible terms"], approvalTime: "7-14 days" }
  ];
  
  const grants: Grant[] = [
    { id: 1, name: "SBIR Phase I", provider: "NSF", type: "government", amount: 150000, deadline: "2024-03-31", eligibility: ["Small business"], sectors: ["Technology"], matchScore: 95, description: "Innovation research program", website: "https://nsf.gov", requirements: ["Research proposal"], applicationProcess: ["Pre-application", "Full proposal"], successRate: 0.15, avgProcessingTime: "6-8 months" }
  ];

  const industries = ["Software", "FinTech", "Healthcare", "E-commerce", "SaaS", "AI", "Blockchain"];

  const filteredInvestors = investors.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (selectedIndustries.length === 0 || i.industries.some(ind => selectedIndustries.includes(ind))) && 
    i.minInvestment <= fundingRange[1] && i.maxInvestment >= fundingRange[0]
  ).sort((a,b) => b.matchScore - a.matchScore);
  
  const filteredLenders = lenders.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    l.minLoan <= fundingRange[1] && l.maxLoan >= fundingRange[0]
  ).sort((a,b) => b.matchScore - a.matchScore);
  
  const filteredGrants = grants.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    g.amount >= fundingRange[0] && g.amount <= fundingRange[1]
  ).sort((a,b) => b.matchScore - a.matchScore);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const FundingTabs = () => (
    <div className="mb-6 border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <button onClick={() => setActiveTab('equity')} className={`${activeTab === 'equity' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Equity Funding</button>
        <button onClick={() => setActiveTab('debt')} className={`${activeTab === 'debt' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Debt Funding</button>
        <button onClick={() => setActiveTab('grants')} className={`${activeTab === 'grants' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Grant Funding</button>
      </nav>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 -m-8 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg"><Target className="h-6 w-6 text-indigo-600" /></div>
            <h1 className="text-4xl font-bold text-gray-900">Funding Matcher</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">Get matched with the perfect funding opportunities for your business. Our AI-powered platform analyzes your profile and connects you with investors, lenders, and grant providers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><Users className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold text-gray-900">2,847</p><p className="text-sm text-gray-600">Active Funders</p></div></div></div>
          <div className="bg-white rounded-lg shadow p-6"><div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-lg"><DollarSign className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold text-gray-900">$8.2B</p><p className="text-sm text-gray-600">Available Funding</p></div></div></div>
          <div className="bg-white rounded-lg shadow p-6"><div className="flex items-center gap-3"><div className="p-2 bg-purple-100 rounded-lg"><Award className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold text-gray-900">89%</p><p className="text-sm text-gray-600">Match Accuracy</p></div></div></div>
          <div className="bg-white rounded-lg shadow p-6"><div className="flex items-center gap-3"><div className="p-2 bg-orange-100 rounded-lg"><TrendingUp className="h-5 w-5 text-orange-600" /></div><div><p className="text-2xl font-bold text-gray-900">1,234</p><p className="text-sm text-gray-600">Successful Matches</p></div></div></div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input placeholder="Search by name or industry..." className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Funding Range: {formatCurrency(fundingRange[0])} - {formatCurrency(fundingRange[1])}</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="number" value={fundingRange[0]} onChange={e => setFundingRange([+e.target.value, fundingRange[1]])} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <span>-</span>
                <input type="number" value={fundingRange[1]} onChange={e => setFundingRange([fundingRange[0], +e.target.value])} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Filter by industry:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <button 
                  key={industry} 
                  onClick={() => {
                    setSelectedIndustries(prev => 
                      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
                    );
                  }} 
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm border ${selectedIndustries.includes(industry) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
          
          <FundingTabs />
          
          {activeTab === 'equity' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInvestors.map(investor => (
                <div key={investor.id} className={`bg-white rounded-lg shadow border-l-4 ${investor.matchScore >= 90 ? 'border-l-green-500' : 'border-l-blue-500'}`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <img src={investor.logo} className="h-10 w-10 rounded-full" alt={investor.name}/>
                        <div>
                          <h4 className="text-lg font-semibold">{investor.name}</h4>
                          <p className="text-sm text-gray-500">{investor.type.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-xl font-bold text-blue-600">{investor.matchScore}%</span>
                        </div>
                        <div className="text-xs text-gray-500">Match Score</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button 
                        onClick={() => addToast(`Connecting with ${investor.name}...`, 'success')}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2"
                      >
                        Connect <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'debt' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLenders.map(lender => (
                <div key={lender.id} className={`bg-white rounded-lg shadow border-l-4 ${lender.matchScore >= 90 ? 'border-l-green-500' : 'border-l-blue-500'}`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <img src={lender.logo} className="h-10 w-10 rounded-full" alt={lender.name}/>
                        <div>
                          <h4 className="text-lg font-semibold">{lender.name}</h4>
                          <p className="text-sm text-gray-500 capitalize">{lender.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-xl font-bold text-blue-600">{lender.matchScore}%</span>
                        </div>
                        <div className="text-xs text-gray-500">Match Score</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button 
                        onClick={() => addToast(`Applying to ${lender.name}...`, 'success')}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2"
                      >
                        Apply Now <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'grants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGrants.map(grant => (
                <div key={grant.id} className={`bg-white rounded-lg shadow border-l-4 ${grant.matchScore >= 90 ? 'border-l-green-500' : 'border-l-blue-500'}`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Award className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">{grant.name}</h4>
                          <p className="text-sm text-gray-500">{grant.provider}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-xl font-bold text-purple-600">{grant.matchScore}%</span>
                        </div>
                        <div className="text-xs text-gray-500">Match Score</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button 
                        onClick={() => addToast(`Applying for ${grant.name}...`, 'success')}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2"
                      >
                        Apply Now <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatcherApp;
