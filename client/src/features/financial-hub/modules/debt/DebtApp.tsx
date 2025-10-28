import React, { useState } from 'react';
import { 
  Search, Filter, DollarSign, Building, Award, Clock, Shield,
  TrendingUp, Info, Zap, CreditCard, Banknote, HelpCircle, Star, ExternalLink, Globe, Users
} from 'lucide-react';
import { Lender, ToastType } from '../../types';

interface DebtAppProps {
  addToast: (message: string, type: ToastType) => void;
}

const DebtApp: React.FC<DebtAppProps> = ({ addToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loanRange, setLoanRange] = useState([10000, 1000000]);
  const [selectedTerm, setSelectedTerm] = useState<string>('all');

  const lenders: Lender[] = [
    {
      id: 1,
      name: "Wells Fargo Business",
      type: "bank",
      logo: "https://logo.clearbit.com/wellsfargo.com",
      minLoan: 10000,
      maxLoan: 1000000,
      interestRate: 4.5,
      term: 60,
      requirements: { minCreditScore: 680, minTimeInBusiness: 2, minAnnualRevenue: 100000 },
      matchScore: 92,
      description: "Traditional bank offering comprehensive business lending solutions with competitive rates.",
      website: "https://wellsfargo.com",
      features: ["Low interest rates", "Flexible terms", "Relationship banking"],
      approvalTime: "7-14 days"
    },
    {
      id: 2,
      name: "Kabbage (Amex)",
      type: "online",
      logo: "https://logo.clearbit.com/kabbage.com",
      minLoan: 2000,
      maxLoan: 250000,
      interestRate: 6.5,
      term: 24,
      requirements: { minCreditScore: 600, minTimeInBusiness: 1, minAnnualRevenue: 50000 },
      matchScore: 88,
      description: "Online lender specializing in quick business loans with fast approval process.",
      website: "https://kabbage.com",
      features: ["Fast approval", "Online application", "Flexible repayment"],
      approvalTime: "24-48 hours"
    },
    {
      id: 3,
      name: "SBA Express",
      type: "sba",
      logo: "https://logo.clearbit.com/sba.gov",
      minLoan: 5000,
      maxLoan: 500000,
      interestRate: 3.5,
      term: 84,
      requirements: { minCreditScore: 650, minTimeInBusiness: 2, minAnnualRevenue: 75000 },
      matchScore: 85,
      description: "SBA-backed loans with government guarantee, offering lower rates and longer terms.",
      website: "https://sba.gov",
      features: ["Government backed", "Low rates", "Long terms"],
      approvalTime: "14-21 days"
    },
  ];

  const filteredLenders = lenders.filter(lender => {
    const matchesSearch = lender.name.toLowerCase().includes(searchQuery.toLowerCase()) || lender.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(lender.type);
    const matchesRange = lender.minLoan <= loanRange[1] && lender.maxLoan >= loanRange[0];
    const matchesTerm = selectedTerm === 'all' || (selectedTerm === 'short' && lender.term <= 24) || (selectedTerm === 'medium' && lender.term > 24 && lender.term <= 60) || (selectedTerm === 'long' && lender.term > 60);
    return matchesSearch && matchesType && matchesRange && matchesTerm;
  });

  const lenderTypes = [
    { value: 'bank', label: 'Banks', icon: Building },
    { value: 'online', label: 'Online', icon: Globe },
    { value: 'sba', label: 'SBA', icon: Shield },
    { value: 'alternative', label: 'Alternative', icon: Zap },
    { value: 'credit-union', label: 'Credit Unions', icon: Users }
  ];

  const terms = [
    { value: 'all', label: 'All Terms' },
    { value: 'short', label: 'Short (≤24mo)' },
    { value: 'medium', label: 'Medium (25-60mo)' },
    { value: 'long', label: 'Long (>60mo)' }
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = lenderTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : Building;
  };
  
  const getTypeLabel = (type: string) => {
    const typeConfig = lenderTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.label : type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 -m-8 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg"><CreditCard className="h-6 w-6 text-green-600" /></div>
            <h1 className="text-4xl font-bold text-gray-900">Debt Funding</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">Access business loans, lines of credit, and debt financing options to fuel your growth without giving up equity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6"><div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-lg"><DollarSign className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold text-gray-900">$1.8B</p><p className="text-sm text-gray-600">Available Credit</p></div></div></div>
          <div className="bg-white rounded-lg shadow p-6"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><Building className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold text-gray-900">89</p><p className="text-sm text-gray-600">Lending Partners</p></div></div></div>
          <div className="bg-white rounded-lg shadow p-6"><div className="flex items-center gap-3"><div className="p-2 bg-purple-100 rounded-lg"><Award className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold text-gray-900">4.2%</p><p className="text-sm text-gray-600">Avg. Interest Rate</p></div></div></div>
          <div className="bg-white rounded-lg shadow p-6"><div className="flex items-center gap-3"><div className="p-2 bg-orange-100 rounded-lg"><Clock className="h-5 w-5 text-orange-600" /></div><div><p className="text-2xl font-bold text-gray-900">7</p><p className="text-sm text-gray-600">Days Avg. Approval</p></div></div></div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="pb-4 border-b border-gray-200"><h3 className="text-lg font-semibold flex items-center gap-2"><Filter className="h-5 w-5" /> Find Your Perfect Lender</h3><p className="text-sm text-gray-500">Use filters to find lenders that match your business needs and credit profile</p></div>
          <div className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Search Lenders</label><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input placeholder="Search by name or description..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label><select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">{terms.map(term => (<option key={term.value} value={term.value}>{term.label}</option>))}</select></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount: {formatCurrency(loanRange[0])} - {formatCurrency(loanRange[1])}</label><div className="flex items-center gap-4"><input type="number" value={loanRange[0]} onChange={e => setLoanRange([+e.target.value, loanRange[1]])} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" /><span>-</span><input type="number" value={loanRange[1]} onChange={e => setLoanRange([loanRange[0], +e.target.value])} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Lender Types</label><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">{lenderTypes.map(type => { const Icon = type.icon; return (<button key={type.value} onClick={() => { setSelectedTypes(prev => prev.includes(type.value) ? prev.filter(t => t !== type.value) : [...prev, type.value]); }} className={`p-3 rounded-lg border-2 transition-all ${selectedTypes.includes(type.value) ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300'}`}><Icon className="h-5 w-5 mx-auto mb-2" /><p className="text-xs font-medium text-center">{type.label}</p></button>); })}</div></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-gray-900">{filteredLenders.length} Lenders Found</h2><div className="flex items-center gap-2 text-sm text-gray-600"><span>Sorted by Match Score</span><TrendingUp className="h-4 w-4" /></div></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{filteredLenders.map(lender => { const TypeIcon = getTypeIcon(lender.type); return (
              <div key={lender.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6"><div className="flex items-start justify-between mb-4"><div className="flex items-center gap-3"><img src={lender.logo} alt={lender.name} className="w-12 h-12 rounded-lg object-cover" /><div><h3 className="text-lg font-semibold">{lender.name}</h3><p className="text-sm text-gray-500 flex items-center gap-1"><TypeIcon className="h-4 w-4" />{getTypeLabel(lender.type)}</p></div></div><div className="text-right"><div className="flex items-center gap-1 mb-1"><Star className="h-4 w-4 text-yellow-500 fill-current" /><span className="text-sm font-medium">{lender.matchScore}% Match</span></div><div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{width: `${lender.matchScore}%`}}></div></div></div></div><p className="text-gray-600 mb-4 text-sm">{lender.description}</p><div className="grid grid-cols-2 gap-4 mb-4"><div><p className="text-sm font-medium text-gray-700">Loan Range</p><p className="text-sm text-gray-600">{formatCurrency(lender.minLoan)} - {formatCurrency(lender.maxLoan)}</p></div><div><p className="text-sm font-medium text-gray-700">Interest Rate</p><p className="text-sm text-gray-600">{lender.interestRate}% APR</p></div><div><p className="text-sm font-medium text-gray-700">Term Length</p><p className="text-sm text-gray-600">{lender.term} months</p></div><div><p className="text-sm font-medium text-gray-700">Approval Time</p><p className="text-sm text-gray-600">{lender.approvalTime}</p></div></div><div className="mb-4"><p className="text-sm font-medium text-gray-700 mb-2">Key Features</p><div className="flex flex-wrap gap-1">{lender.features.map(feature => (<span key={feature} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{feature}</span>))}</div></div></div>
                <div className="p-6 bg-gray-50 rounded-b-lg flex gap-2"><button onClick={() => addToast(`Opening application for ${lender.name}...`, 'info')} className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"><ExternalLink className="h-4 w-4 mr-2" />Apply Now</button><button onClick={() => addToast('Learn more feature coming soon!', 'info')} className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"><Info className="h-4 w-4 mr-2" />Learn More</button></div>
              </div>);})}</div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow"><div className="p-8 text-center"><h3 className="text-2xl font-bold mb-4">Ready to Secure Debt Funding?</h3><p className="text-green-100 mb-6 max-w-2xl mx-auto">Get matched with lenders who understand your business needs. Our platform analyzes your credit profile and connects you with the best loan options available in the market.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><button onClick={() => addToast('Finding your loan...', 'info')} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-green-600 bg-white hover:bg-green-50"><Banknote className="h-5 w-5 mr-2" />Find My Loan</button><button onClick={() => addToast('Help feature coming soon!', 'info')} className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md shadow-sm text-white hover:bg-white hover:text-green-600"><HelpCircle className="h-5 w-5 mr-2" />Get Help</button></div></div></div>
      </div>
    </div>
  );
};

export default DebtApp;
