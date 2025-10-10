import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { 
  ArrowRight, Search, Filter, DollarSign, Building2, Globe, PieChart, Clock, Shield,
  TrendingUp, Users, Award, CheckCircle, AlertCircle, CreditCard, History, Info,
  BarChart2, HelpCircle, Wallet, Target, Star, ExternalLink, Building, Zap, Banknote
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Lender {
  id: number;
  name: string;
  type: 'bank' | 'credit-union' | 'online' | 'sba' | 'alternative';
  logo: string;
  minLoan: number;
  maxLoan: number;
  interestRate: number;
  term: number;
  requirements: {
    minCreditScore: number;
    minTimeInBusiness: number;
    minAnnualRevenue: number;
  };
  matchScore: number;
  description: string;
  website: string;
  features: string[];
  approvalTime: string;
}

function DebtFunding() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loanRange, setLoanRange] = useState([10000, 1000000]);
  const [selectedTerm, setSelectedTerm] = useState<string>('all');

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Mock data for lenders
  const lenders: Lender[] = [
    {
      id: 1,
      name: "Wells Fargo Business",
      type: "bank",
      logo: "https://via.placeholder.com/40",
      minLoan: 10000,
      maxLoan: 1000000,
      interestRate: 4.5,
      term: 60,
      requirements: {
        minCreditScore: 680,
        minTimeInBusiness: 2,
        minAnnualRevenue: 100000
      },
      matchScore: 92,
      description: "Traditional bank offering comprehensive business lending solutions with competitive rates.",
      website: "https://wellsfargo.com",
      features: ["Low interest rates", "Flexible terms", "Relationship banking"],
      approvalTime: "7-14 days"
    },
    {
      id: 2,
      name: "Kabbage (American Express)",
      type: "online",
      logo: "https://via.placeholder.com/40",
      minLoan: 2000,
      maxLoan: 250000,
      interestRate: 6.5,
      term: 24,
      requirements: {
        minCreditScore: 600,
        minTimeInBusiness: 1,
        minAnnualRevenue: 50000
      },
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
      logo: "https://via.placeholder.com/40",
      minLoan: 5000,
      maxLoan: 500000,
      interestRate: 3.5,
      term: 84,
      requirements: {
        minCreditScore: 650,
        minTimeInBusiness: 2,
        minAnnualRevenue: 75000
      },
      matchScore: 85,
      description: "SBA-backed loans with government guarantee, offering lower rates and longer terms.",
      website: "https://sba.gov",
      features: ["Government backed", "Low rates", "Long terms"],
      approvalTime: "14-21 days"
    },
    {
      id: 4,
      name: "OnDeck",
      type: "alternative",
      logo: "https://via.placeholder.com/40",
      minLoan: 5000,
      maxLoan: 500000,
      interestRate: 7.5,
      term: 36,
      requirements: {
        minCreditScore: 550,
        minTimeInBusiness: 1,
        minAnnualRevenue: 100000
      },
      matchScore: 82,
      description: "Alternative lender focused on small business loans with quick funding.",
      website: "https://ondeck.com",
      features: ["Quick funding", "Flexible requirements", "Online platform"],
      approvalTime: "1-3 days"
    },
    {
      id: 5,
      name: "Chase Business Banking",
      type: "bank",
      logo: "https://via.placeholder.com/40",
      minLoan: 25000,
      maxLoan: 2000000,
      interestRate: 4.0,
      term: 84,
      requirements: {
        minCreditScore: 700,
        minTimeInBusiness: 3,
        minAnnualRevenue: 250000
      },
      matchScore: 90,
      description: "Full-service bank offering comprehensive business lending and banking solutions.",
      website: "https://chase.com",
      features: ["Full banking services", "Relationship management", "Competitive rates"],
      approvalTime: "10-21 days"
    },
    {
      id: 6,
      name: "Funding Circle",
      type: "alternative",
      logo: "https://via.placeholder.com/40",
      minLoan: 25000,
      maxLoan: 500000,
      interestRate: 5.5,
      term: 60,
      requirements: {
        minCreditScore: 620,
        minTimeInBusiness: 2,
        minAnnualRevenue: 150000
      },
      matchScore: 87,
      description: "Peer-to-peer lending platform connecting businesses with investors for competitive rates.",
      website: "https://fundingcircle.com",
      features: ["Peer-to-peer", "Competitive rates", "Transparent process"],
      approvalTime: "3-7 days"
    }
  ];

  const filteredLenders = lenders.filter(lender => {
    const matchesSearch = lender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lender.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(lender.type);
    const matchesRange = lender.minLoan <= loanRange[1] && lender.maxLoan >= loanRange[0];
    const matchesTerm = selectedTerm === 'all' || 
                       (selectedTerm === 'short' && lender.term <= 24) ||
                       (selectedTerm === 'medium' && lender.term > 24 && lender.term <= 60) ||
                       (selectedTerm === 'long' && lender.term > 60);
    
    return matchesSearch && matchesType && matchesRange && matchesTerm;
  });

  const lenderTypes = [
    { value: 'bank', label: 'Traditional Banks', icon: Building },
    { value: 'online', label: 'Online Lenders', icon: Globe },
    { value: 'sba', label: 'SBA Loans', icon: Shield },
    { value: 'alternative', label: 'Alternative Lenders', icon: Zap },
    { value: 'credit-union', label: 'Credit Unions', icon: Users }
  ];

  const terms = [
    { value: 'all', label: 'All Terms' },
    { value: 'short', label: 'Short Term (≤24 months)' },
    { value: 'medium', label: 'Medium Term (25-60 months)' },
    { value: 'long', label: 'Long Term (>60 months)' }
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Debt Funding
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Access business loans, lines of credit, and debt financing options to fuel your growth without giving up equity.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">$1.8B</p>
                  <p className="text-sm text-gray-600">Available Credit</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                  <p className="text-sm text-gray-600">Lending Partners</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.2%</p>
                  <p className="text-sm text-gray-600">Avg. Interest Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">7</p>
                  <p className="text-sm text-gray-600">Days Avg. Approval</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Find Your Perfect Lender
            </CardTitle>
            <CardDescription>
              Use filters to find lenders that match your business needs and credit profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Lenders
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term
                </label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {terms.map(term => (
                    <option key={term.value} value={term.value}>
                      {term.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount: {formatCurrency(loanRange[0])} - {formatCurrency(loanRange[1])}
              </label>
              <Slider
                value={loanRange}
                onValueChange={setLoanRange}
                min={1000}
                max={2000000}
                step={1000}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lender Types
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {lenderTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => {
                        setSelectedTypes(prev => 
                          prev.includes(type.value) 
                            ? prev.filter(t => t !== type.value)
                            : [...prev, type.value]
                        );
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedTypes.includes(type.value)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5 mx-auto mb-2" />
                      <p className="text-xs font-medium text-center">{type.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredLenders.length} Lenders Found
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Sorted by Match Score</span>
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLenders.map(lender => {
              const TypeIcon = getTypeIcon(lender.type);
              return (
                <Card key={lender.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={lender.logo}
                          alt={lender.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <CardTitle className="text-lg">{lender.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <TypeIcon className="h-4 w-4" />
                            {getTypeLabel(lender.type)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{lender.matchScore}% Match</span>
                        </div>
                        <Progress value={lender.matchScore} className="w-20 h-2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{lender.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Loan Range</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(lender.minLoan)} - {formatCurrency(lender.maxLoan)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Interest Rate</p>
                        <p className="text-sm text-gray-600">{lender.interestRate}% APR</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Term Length</p>
                        <p className="text-sm text-gray-600">{lender.term} months</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Approval Time</p>
                        <p className="text-sm text-gray-600">{lender.approvalTime}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Requirements</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="font-medium">Credit Score</p>
                          <p className="text-gray-600">{lender.requirements.minCreditScore}+</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="font-medium">Time in Business</p>
                          <p className="text-gray-600">{lender.requirements.minTimeInBusiness}+ years</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="font-medium">Annual Revenue</p>
                          <p className="text-gray-600">{formatCurrency(lender.requirements.minAnnualRevenue)}+</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Key Features</p>
                      <div className="flex flex-wrap gap-1">
                        {lender.features.map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Info className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Secure Debt Funding?</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Get matched with lenders who understand your business needs. Our platform 
                analyzes your credit profile and connects you with the best loan options 
                available in the market.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Banknote className="h-5 w-5 mr-2" />
                  Find My Loan
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Get Help
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DebtFunding;
