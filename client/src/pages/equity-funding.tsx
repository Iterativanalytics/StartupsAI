import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { 
  ArrowRight, Search, Filter, DollarSign, Building2, Globe, PieChart, Clock, Shield,
  TrendingUp, Users, Award, CheckCircle, AlertCircle, CreditCard, History, Info,
  BarChart2, HelpCircle, Wallet, Target, Star, ExternalLink, Building, Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  description: string;
  website: string;
  recentInvestments: string[];
}

function EquityFunding() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [fundingRange, setFundingRange] = useState([50000, 5000000]);
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Mock data for equity investors
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
      matchScore: 92,
      description: "Leading venture capital firm focused on technology companies from seed to growth stage.",
      website: "https://sequoiacap.com",
      recentInvestments: ["Airbnb", "WhatsApp", "Stripe"]
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
      matchScore: 88,
      description: "Technology-focused venture capital firm investing in software and internet companies.",
      website: "https://a16z.com",
      recentInvestments: ["Coinbase", "GitHub", "Oculus"]
    },
    {
      id: 3,
      name: "Accel Partners",
      type: "vc",
      logo: "https://via.placeholder.com/40",
      minInvestment: 250000,
      maxInvestment: 15000000,
      industries: ["SaaS", "E-commerce", "Mobile"],
      stages: ["Seed", "Series A"],
      regions: ["North America", "Europe"],
      portfolio: 134,
      successRate: 0.75,
      matchScore: 85,
      description: "Early-stage venture capital firm with a focus on consumer and enterprise software.",
      website: "https://accel.com",
      recentInvestments: ["Facebook", "Slack", "Dropbox"]
    },
    {
      id: 4,
      name: "Y Combinator",
      type: "vc",
      logo: "https://via.placeholder.com/40",
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
    {
      id: 5,
      name: "First Round Capital",
      type: "vc",
      logo: "https://via.placeholder.com/40",
      minInvestment: 100000,
      maxInvestment: 5000000,
      industries: ["Technology", "Consumer", "Enterprise"],
      stages: ["Seed", "Series A"],
      regions: ["North America"],
      portfolio: 89,
      successRate: 0.71,
      matchScore: 82,
      description: "Early-stage venture capital firm focused on technology companies.",
      website: "https://firstround.com",
      recentInvestments: ["Uber", "Square", "Warby Parker"]
    }
  ];

  const angelInvestors: Investor[] = [
    {
      id: 6,
      name: "Jason Calacanis",
      type: "angel",
      logo: "https://via.placeholder.com/40",
      minInvestment: 10000,
      maxInvestment: 100000,
      industries: ["Technology", "Media"],
      stages: ["Pre-seed", "Seed"],
      regions: ["North America"],
      portfolio: 45,
      successRate: 0.68,
      matchScore: 78,
      description: "Angel investor and entrepreneur with investments in early-stage technology companies.",
      website: "https://calacanis.com",
      recentInvestments: ["Uber", "Thumbtack", "Robinhood"]
    },
    {
      id: 7,
      name: "Naval Ravikant",
      type: "angel",
      logo: "https://via.placeholder.com/40",
      minInvestment: 5000,
      maxInvestment: 50000,
      industries: ["Technology", "Crypto"],
      stages: ["Pre-seed", "Seed"],
      regions: ["Global"],
      portfolio: 78,
      successRate: 0.72,
      matchScore: 85,
      description: "Angel investor and founder of AngelList, focused on technology startups.",
      website: "https://nav.al",
      recentInvestments: ["Twitter", "Uber", "Snapchat"]
    }
  ];

  const allInvestors = [...investors, ...angelInvestors];

  const filteredInvestors = allInvestors.filter(investor => {
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

  const industries = ["Software", "FinTech", "Healthcare", "AI", "Blockchain", "Enterprise", "SaaS", "E-commerce", "Mobile", "Technology", "Consumer", "Media", "Crypto"];

  const stages = [
    { value: 'all', label: 'All Stages' },
    { value: 'Pre-seed', label: 'Pre-seed' },
    { value: 'Seed', label: 'Seed' },
    { value: 'Series A', label: 'Series A' },
    { value: 'Series B', label: 'Series B' },
    { value: 'Series C', label: 'Series C' }
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Equity Funding
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Connect with venture capitalists, angel investors, and equity partners to fuel your company's growth.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">$2.4B</p>
                  <p className="text-sm text-gray-600">Total Funding Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">127</p>
                  <p className="text-sm text-gray-600">Active Investors</p>
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
                  <p className="text-2xl font-bold text-gray-900">73%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
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
                  <p className="text-2xl font-bold text-gray-900">45</p>
                  <p className="text-sm text-gray-600">Days Avg. Close</p>
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
              Find Your Perfect Match
            </CardTitle>
            <CardDescription>
              Use filters to find investors that align with your business needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Investors
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or industry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {stages.map(stage => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Range: {formatCurrency(fundingRange[0])} - {formatCurrency(fundingRange[1])}
              </label>
              <Slider
                value={fundingRange}
                onValueChange={setFundingRange}
                min={10000}
                max={10000000}
                step={10000}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industries
              </label>
              <div className="flex flex-wrap gap-2">
                {industries.map(industry => (
                  <Badge
                    key={industry}
                    variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedIndustries(prev => 
                        prev.includes(industry) 
                          ? prev.filter(i => i !== industry)
                          : [...prev, industry]
                      );
                    }}
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredInvestors.length} Investors Found
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Sorted by Match Score</span>
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInvestors.map(investor => (
              <Card key={investor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={investor.logo}
                        alt={investor.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">{investor.name}</CardTitle>
                        <CardDescription className="capitalize">
                          {investor.type === 'vc' ? 'Venture Capital' : 
                           investor.type === 'angel' ? 'Angel Investor' : 'Private Equity'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{investor.matchScore}% Match</span>
                      </div>
                      <Progress value={investor.matchScore} className="w-20 h-2" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{investor.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Investment Range</p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(investor.minInvestment)} - {formatCurrency(investor.maxInvestment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Portfolio Size</p>
                      <p className="text-sm text-gray-600">{investor.portfolio} companies</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Success Rate</p>
                      <p className="text-sm text-gray-600">{(investor.successRate * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Regions</p>
                      <p className="text-sm text-gray-600">{investor.regions.join(', ')}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Industries</p>
                    <div className="flex flex-wrap gap-1">
                      {investor.industries.slice(0, 3).map(industry => (
                        <Badge key={industry} variant="secondary" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                      {investor.industries.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{investor.industries.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Recent Investments</p>
                    <div className="flex flex-wrap gap-1">
                      {investor.recentInvestments.slice(0, 3).map(company => (
                        <Badge key={company} variant="outline" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Users className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Raise Equity?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Get matched with the right investors for your startup. Our AI-powered platform 
                analyzes your business and connects you with investors who are actively looking 
                for companies like yours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Zap className="h-5 w-5 mr-2" />
                  Start Matching
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EquityFunding;
