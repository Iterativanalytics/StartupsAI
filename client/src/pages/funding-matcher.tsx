import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { 
  ArrowRight, Search, Filter, DollarSign, Building2, Globe, PieChart, Clock, Shield, 
  Gift, CheckCircle, Users, Award, TrendingUp, Star, ExternalLink, Zap, Target,
  Building, CreditCard, Gift as GiftIcon, HelpCircle, BarChart3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

interface Investor {
  id: number;
  name: string;
  type: 'angel' | 'vc' | 'pe';
  logo: string;
  minInvestment: number;
  maxInvestment: number;
  industries: string[];
  stages: string[];
  regions: string[];
  portfolio: number;
  successRate: number;
  matchScore: number;
}

interface Lender {
  id: number;
  name: string;
  type: 'bank' | 'credit-union' | 'online';
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
}

interface Grant {
  id: number;
  name: string;
  provider: string;
  type: 'government' | 'foundation' | 'corporate';
  amount: number;
  deadline: string;
  eligibility: string[];
  sectors: string[];
  matchScore: number;
  description: string;
}

function FundingMatcher() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [fundingRange, setFundingRange] = useState([50000, 500000]);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Simulated investors and lenders data
  const investors: Investor[] = [
    {
      id: 1,
      name: "Sequoia Capital",
      type: "vc",
      logo: "https://via.placeholder.com/40",
      minInvestment: 500000,
      maxInvestment: 10000000,
      industries: ["Software", "FinTech", "Healthcare"],
      stages: ["Seed", "Series A", "Series B"],
      regions: ["North America", "Europe", "Asia"],
      portfolio: 156,
      successRate: 0.78,
      matchScore: 92
    },
    {
      id: 2,
      name: "Andreessen Horowitz",
      type: "vc",
      logo: "https://via.placeholder.com/40",
      minInvestment: 1000000,
      maxInvestment: 20000000,
      industries: ["AI", "Blockchain", "Enterprise"],
      stages: ["Series A", "Series B", "Series C"],
      regions: ["North America", "Europe"],
      portfolio: 208,
      successRate: 0.82,
      matchScore: 88
    },
    {
      id: 3,
      name: "Angel Ventures",
      type: "angel",
      logo: "https://via.placeholder.com/40",
      minInvestment: 100000,
      maxInvestment: 1000000,
      industries: ["E-commerce", "SaaS", "FinTech"],
      stages: ["Pre-seed", "Seed"],
      regions: ["North America", "Latin America"],
      portfolio: 32,
      successRate: 0.62,
      matchScore: 95
    },
    {
      id: 4,
      name: "Early Bird VC",
      type: "vc",
      logo: "https://via.placeholder.com/40",
      minInvestment: 250000,
      maxInvestment: 5000000,
      industries: ["Healthcare", "CleanTech", "Education"],
      stages: ["Seed", "Series A"],
      regions: ["Europe", "Middle East"],
      portfolio: 87,
      successRate: 0.71,
      matchScore: 79
    },
    {
      id: 5,
      name: "Growth Partners",
      type: "pe",
      logo: "https://via.placeholder.com/40",
      minInvestment: 5000000,
      maxInvestment: 50000000,
      industries: ["Manufacturing", "Retail", "Healthcare"],
      stages: ["Series C", "Series D", "Growth"],
      regions: ["North America", "Europe", "Asia"],
      portfolio: 42,
      successRate: 0.89,
      matchScore: 71
    }
  ];

  const lenders: Lender[] = [
    {
      id: 1,
      name: "First National Bank",
      type: "bank",
      logo: "https://via.placeholder.com/40",
      minLoan: 100000,
      maxLoan: 5000000,
      interestRate: 0.065,
      term: 60,
      requirements: {
        minCreditScore: 680,
        minTimeInBusiness: 2,
        minAnnualRevenue: 250000
      },
      matchScore: 88
    },
    {
      id: 2,
      name: "Business Growth Loans",
      type: "online",
      logo: "https://via.placeholder.com/40",
      minLoan: 50000,
      maxLoan: 2000000,
      interestRate: 0.082,
      term: 36,
      requirements: {
        minCreditScore: 650,
        minTimeInBusiness: 1,
        minAnnualRevenue: 100000
      },
      matchScore: 94
    },
    {
      id: 3,
      name: "Community Credit Union",
      type: "credit-union",
      logo: "https://via.placeholder.com/40",
      minLoan: 25000,
      maxLoan: 1000000,
      interestRate: 0.068,
      term: 48,
      requirements: {
        minCreditScore: 660,
        minTimeInBusiness: 1.5,
        minAnnualRevenue: 150000
      },
      matchScore: 91
    },
    {
      id: 4,
      name: "Capital Express",
      type: "online",
      logo: "https://via.placeholder.com/40",
      minLoan: 75000,
      maxLoan: 3000000,
      interestRate: 0.095,
      term: 24,
      requirements: {
        minCreditScore: 620,
        minTimeInBusiness: 0.5,
        minAnnualRevenue: 75000
      },
      matchScore: 82
    },
    {
      id: 5,
      name: "Enterprise Bank",
      type: "bank",
      logo: "https://via.placeholder.com/40",
      minLoan: 250000,
      maxLoan: 10000000,
      interestRate: 0.059,
      term: 84,
      requirements: {
        minCreditScore: 720,
        minTimeInBusiness: 3,
        minAnnualRevenue: 500000
      },
      matchScore: 76
    }
  ];

  const grants: Grant[] = [
    {
      id: 1,
      name: "NYDA Grant Programme",
      provider: "National Youth Development Agency",
      type: "government",
      amount: 100000,
      deadline: "2024-03-31",
      eligibility: ["Youth entrepreneurs (18-35)", "South African citizens", "Viable business plan"],
      sectors: ["Technology", "Agriculture", "Manufacturing"],
      matchScore: 95,
      description: "Supports youth entrepreneurs with non-repayable grants for business development and job creation."
    },
    {
      id: 2,
      name: "Small Business Innovation Research (SBIR)",
      provider: "National Science Foundation",
      type: "government",
      amount: 250000,
      deadline: "2024-06-15",
      eligibility: ["Small businesses", "Research-focused", "Technology innovation"],
      sectors: ["Technology", "Healthcare", "Energy"],
      matchScore: 78,
      description: "Federal funding for small businesses engaged in research and development with commercialization potential."
    },
    {
      id: 3,
      name: "Gates Foundation Innovation Grant",
      provider: "Bill & Melinda Gates Foundation",
      type: "foundation",
      amount: 500000,
      deadline: "2024-08-30",
      eligibility: ["Global health focus", "Poverty alleviation", "Educational impact"],
      sectors: ["Healthcare", "Education", "Agriculture"],
      matchScore: 65,
      description: "Supports innovative solutions addressing global challenges in health, education, and poverty reduction."
    },
    {
      id: 4,
      name: "Tech Startup Grant",
      provider: "Innovation Foundation",
      type: "foundation",
      amount: 150000,
      deadline: "2024-05-20",
      eligibility: ["Tech startups", "Under 2 years old", "Innovation focus"],
      sectors: ["Technology", "AI", "Blockchain"],
      matchScore: 88,
      description: "Supporting early-stage technology companies with innovative solutions and growth potential."
    },
    {
      id: 5,
      name: "Green Business Initiative",
      provider: "Environmental Protection Agency",
      type: "government",
      amount: 300000,
      deadline: "2024-07-10",
      eligibility: ["Environmental focus", "Sustainability goals", "Clean technology"],
      sectors: ["CleanTech", "Renewable Energy", "Sustainability"],
      matchScore: 72,
      description: "Funding for businesses developing environmentally sustainable solutions and clean technologies."
    }
  ];

  const industries = [
    "Software", "FinTech", "Healthcare", "E-commerce", "SaaS", 
    "AI", "Blockchain", "Enterprise", "CleanTech", "Education", 
    "Manufacturing", "Retail"
  ];

  // Apply filter to investors
  const filteredInvestors = investors
    .filter(investor => 
      (searchQuery === '' || 
       investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       investor.industries.some(industry => 
         industry.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .filter(investor => 
      (selectedIndustries.length === 0 || 
       investor.industries.some(industry => 
         selectedIndustries.includes(industry)))
    )
    .filter(investor => 
      (investor.minInvestment <= fundingRange[1] && 
       investor.maxInvestment >= fundingRange[0])
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  // Apply filter to lenders
  const filteredLenders = lenders
    .filter(lender => 
      (searchQuery === '' || 
       lender.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(lender => 
      (lender.minLoan <= fundingRange[1] && 
       lender.maxLoan >= fundingRange[0])
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  // Apply filter to grants
  const filteredGrants = grants
    .filter(grant => 
      (searchQuery === '' || 
       grant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       grant.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
       grant.sectors.some(sector => sector.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .filter(grant => 
      (grant.amount <= fundingRange[1] && 
       grant.amount >= fundingRange[0])
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  if (isLoadingPlan) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Target className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Funding Matcher
              {businessPlan && typeof businessPlan === 'object' && 'name' in businessPlan ? 
                ` for ${businessPlan.name}` : ''}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Get matched with the perfect funding opportunities for your business. Our AI-powered platform 
            analyzes your profile and connects you with investors, lenders, and grant providers.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">2,847</p>
                  <p className="text-sm text-gray-600">Active Funders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">$8.2B</p>
                  <p className="text-sm text-gray-600">Available Funding</p>
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
                  <p className="text-2xl font-bold text-gray-900">89%</p>
                  <p className="text-sm text-gray-600">Match Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                  <p className="text-sm text-gray-600">Successful Matches</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or industry..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Funding Range:</span>
              <span className="text-sm font-medium">{formatCurrency(fundingRange[0])} - {formatCurrency(fundingRange[1])}</span>
            </div>
            <Slider
              defaultValue={fundingRange}
              min={10000}
              max={10000000}
              step={10000}
              onValueChange={(value) => setFundingRange(value as number[])}
              className="mt-2"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Filter by industry:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {industries.map(industry => (
              <Badge
                key={industry}
                variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  if (selectedIndustries.includes(industry)) {
                    setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
                  } else {
                    setSelectedIndustries([...selectedIndustries, industry]);
                  }
                }}
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="investors" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="investors">Equity Funding</TabsTrigger>
            <TabsTrigger value="lenders">Debt Funding</TabsTrigger>
            <TabsTrigger value="grants">Grant Funding</TabsTrigger>
          </TabsList>
          <TabsContent value="investors" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInvestors.map(investor => (
                <Card key={investor.id} className={`border-l-4 ${investor.matchScore >= 90 ? 'border-l-green-500' : investor.matchScore >= 80 ? 'border-l-blue-500' : 'border-l-gray-300'}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{investor.name}</CardTitle>
                        <CardDescription>
                          {investor.type === 'vc' ? 'Venture Capital' : 
                           investor.type === 'angel' ? 'Angel Investor' : 'Private Equity'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{investor.matchScore}%</div>
                      <div className="text-xs text-gray-500">Match Score</div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Investment:</span>
                        <span className="font-medium">{formatCurrency(investor.minInvestment)} - {formatCurrency(investor.maxInvestment)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Regions:</span>
                        <span className="font-medium">{investor.regions.slice(0, 2).join(', ')}{investor.regions.length > 2 ? '...' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Portfolio:</span>
                        <span className="font-medium">{investor.portfolio} companies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="font-medium">{Math.round(investor.successRate * 100)}%</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {investor.industries.map(industry => (
                          <Badge key={industry} variant="secondary" className="text-xs">{industry}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Connect <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="lenders" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLenders.map(lender => (
                <Card key={lender.id} className={`border-l-4 ${lender.matchScore >= 90 ? 'border-l-green-500' : lender.matchScore >= 80 ? 'border-l-blue-500' : 'border-l-gray-300'}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{lender.name}</CardTitle>
                        <CardDescription>
                          {lender.type === 'bank' ? 'Bank' : 
                           lender.type === 'credit-union' ? 'Credit Union' : 'Online Lender'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{lender.matchScore}%</div>
                      <div className="text-xs text-gray-500">Match Score</div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Loan Range:</span>
                        <span className="font-medium">{formatCurrency(lender.minLoan)} - {formatCurrency(lender.maxLoan)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-medium">{(lender.interestRate * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Term:</span>
                        <span className="font-medium">{lender.term} months</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Credit Score:</span>
                        <span className="font-medium">Min {lender.requirements.minCreditScore}</span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      <div>Requires {lender.requirements.minTimeInBusiness} {lender.requirements.minTimeInBusiness === 1 ? 'year' : 'years'} in business</div>
                      <div>Min Annual Revenue: {formatCurrency(lender.requirements.minAnnualRevenue)}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Apply Now <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="grants" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGrants.map(grant => (
                <Card key={grant.id} className={`border-l-4 ${grant.matchScore >= 90 ? 'border-l-green-500' : grant.matchScore >= 80 ? 'border-l-blue-500' : 'border-l-gray-300'}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Gift className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{grant.name}</CardTitle>
                        <CardDescription>{grant.provider}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{grant.matchScore}%</div>
                      <div className="text-xs text-gray-500">Match Score</div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">{formatCurrency(grant.amount)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Deadline:</span>
                        <span className="font-medium">{new Date(grant.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{grant.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Sectors:</span>
                        <span className="font-medium">{grant.sectors.slice(0, 2).join(', ')}{grant.sectors.length > 2 ? '...' : ''}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">{grant.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {grant.sectors.map(sector => (
                          <Badge key={sector} variant="secondary" className="text-xs">{sector}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Eligibility Requirements:</div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {grant.eligibility.slice(0, 3).map((req, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                        {grant.eligibility.length > 3 && (
                          <li className="text-gray-400">+{grant.eligibility.length - 3} more requirements</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Apply Now <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
}

export default FundingMatcher;