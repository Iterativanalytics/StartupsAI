import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, TrendingUp, DollarSign, Users, Search, 
  Filter, PieChart, Map, Briefcase, Clock, ArrowRight, 
  Award, CheckCircle, AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface StartupDeal {
  id: number;
  name: string;
  logo: string;
  industry: string;
  stage: string;
  location: string;
  foundedYear: number;
  raised: number;
  targetRaise: number;
  valuation: number;
  revenue: number;
  growth: number;
  team: number;
  highlights: string[];
  riskScore: number;
  matchScore: number;
  status: 'new' | 'reviewing' | 'due-diligence' | 'negotiating' | 'invested' | 'passed';
  lastActivity: string; // ISO date string
}

interface Investment {
  id: number;
  startupId: number;
  startupName: string;
  amount: number;
  sharePercent: number;
  date: string; // ISO date string
  valuation: number;
  currentValuation: number;
  kpis: {
    revenue: number[];
    users: number[];
    growth: number[];
  }
}

function InvestorDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Fetch investor profile
  const { data: investor, isLoading: isLoadingInvestor } = useQuery({
    queryKey: ['/api/investor/profile'],
    enabled: false // Disabled for demo
  });
  
  // Fetch portfolios data
  const { data: portfolios, isLoading: isLoadingPortfolios } = useQuery({
    queryKey: ['/api/portfolios'],
    staleTime: 0
  });
  
  // Fetch investments data
  const { data: investmentData, isLoading: isLoadingInvestments } = useQuery({
    queryKey: ['/api/investments/investor/2'],
    staleTime: 0
  });
  
  // Simulated data
  const deals: StartupDeal[] = [
    {
      id: 1,
      name: "TechInnovate",
      logo: "https://via.placeholder.com/40",
      industry: "SaaS",
      stage: "Seed",
      location: "San Francisco, CA",
      foundedYear: 2021,
      raised: 250000,
      targetRaise: 2000000,
      valuation: 8000000,
      revenue: 540000,
      growth: 127,
      team: 8,
      highlights: ["3x revenue growth YoY", "Enterprise clients include Fortune 500", "Proprietary AI algorithm"],
      riskScore: 65,
      matchScore: 92,
      status: 'new',
      lastActivity: '2023-11-20T15:32:00Z'
    },
    {
      id: 2,
      name: "HealthTech Solutions",
      logo: "https://via.placeholder.com/40",
      industry: "HealthTech",
      stage: "Series A",
      location: "Boston, MA",
      foundedYear: 2020,
      raised: 1500000,
      targetRaise: 7000000,
      valuation: 25000000,
      revenue: 1800000,
      growth: 85,
      team: 15,
      highlights: ["FDA approval for main product", "75% customer retention rate", "8 pending patents"],
      riskScore: 45,
      matchScore: 87,
      status: 'reviewing',
      lastActivity: '2023-11-18T09:20:00Z'
    },
    {
      id: 3,
      name: "GreenCommerce",
      logo: "https://via.placeholder.com/40",
      industry: "E-commerce",
      stage: "Seed",
      location: "Austin, TX",
      foundedYear: 2022,
      raised: 150000,
      targetRaise: 1500000,
      valuation: 5000000,
      revenue: 320000,
      growth: 210,
      team: 6,
      highlights: ["Carbon-neutral operations", "15K monthly active users", "B Corp certified"],
      riskScore: 72,
      matchScore: 84,
      status: 'due-diligence',
      lastActivity: '2023-11-15T17:45:00Z'
    },
    {
      id: 4,
      name: "FinEdge",
      logo: "https://via.placeholder.com/40",
      industry: "FinTech",
      stage: "Series A",
      location: "New York, NY",
      foundedYear: 2019,
      raised: 3000000,
      targetRaise: 10000000,
      valuation: 40000000,
      revenue: 2500000,
      growth: 68,
      team: 23,
      highlights: ["Banking partnerships with top 5 banks", "Regulatory approvals in 18 states", "180K users"],
      riskScore: 38,
      matchScore: 91,
      status: 'negotiating',
      lastActivity: '2023-11-21T11:30:00Z'
    },
    {
      id: 5,
      name: "RoboFlow",
      logo: "https://via.placeholder.com/40",
      industry: "Robotics",
      stage: "Series B",
      location: "Seattle, WA",
      foundedYear: 2018,
      raised: 12000000,
      targetRaise: 25000000,
      valuation: 120000000,
      revenue: 8500000,
      growth: 42,
      team: 47,
      highlights: ["Industrial automation for Fortune 1000", "93% reduction in manufacturing errors", "12 patents"],
      riskScore: 32,
      matchScore: 76,
      status: 'invested',
      lastActivity: '2023-11-10T14:15:00Z'
    }
  ];

  // Sample investment data for now - will be replaced by API data
  const mockInvestments: Investment[] = [
    {
      id: 1,
      startupId: 5,
      startupName: "RoboFlow",
      amount: 2000000,
      sharePercent: 4.5,
      date: '2022-06-15T00:00:00Z',
      valuation: 44000000,
      currentValuation: 120000000,
      kpis: {
        revenue: [4200000, 5800000, 6900000, 8500000],
        users: [120, 185, 210, 260],
        growth: [52, 38, 19, 23]
      }
    },
    {
      id: 2,
      startupId: 6,
      startupName: "CloudSecure",
      amount: 500000,
      sharePercent: 8.2,
      date: '2021-09-10T00:00:00Z',
      valuation: 6100000,
      currentValuation: 22000000,
      kpis: {
        revenue: [380000, 920000, 1600000, 2400000],
        users: [1200, 5800, 9200, 13500],
        growth: [142, 74, 47, 32]
      }
    },
    {
      id: 3,
      startupId: 7,
      startupName: "EduSpark",
      amount: 750000,
      sharePercent: 12.0,
      date: '2021-03-22T00:00:00Z',
      valuation: 6250000,
      currentValuation: 15000000,
      kpis: {
        revenue: [250000, 680000, 1200000, 1750000],
        users: [5000, 12000, 28000, 42000],
        growth: [175, 132, 75, 46]
      }
    }
  ];

  // Simulated industries and stages for filtering
  const industries = ["SaaS", "HealthTech", "E-commerce", "FinTech", "Robotics", "AI", "CleanTech"];
  const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Series C", "Growth"];
  const statuses = ["new", "reviewing", "due-diligence", "negotiating", "invested", "passed"];

  // Apply filters
  const filteredDeals = deals
    .filter(deal => 
      (searchQuery === '' || 
       deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       deal.industry.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(deal => 
      (selectedIndustries.length === 0 || 
       selectedIndustries.includes(deal.industry))
    )
    .filter(deal => 
      (selectedStages.length === 0 || 
       selectedStages.includes(deal.stage))
    )
    .filter(deal => 
      (selectedStatuses.length === 0 || 
       selectedStatuses.includes(deal.status))
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  // Portfolio metrics
  const portfolioValue = mockInvestments.reduce((sum, inv) => sum + inv.currentValuation * (inv.sharePercent / 100), 0);
  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const roi = (portfolioValue - totalInvested) / totalInvested * 100;

  if (isLoadingInvestor || isLoadingPortfolios || isLoadingInvestments) {
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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">New</Badge>;
      case 'reviewing':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Reviewing</Badge>;
      case 'due-diligence':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Due Diligence</Badge>;
      case 'negotiating':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">Negotiating</Badge>;
      case 'invested':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Invested</Badge>;
      case 'passed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Passed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Investor Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your deal flow, track investments, and analyze portfolio performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(portfolioValue)}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Invested</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalInvested)}</p>
              </div>
              <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">ROI</p>
                <p className="text-2xl font-bold text-gray-800">{roi.toFixed(1)}%</p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Investments</p>
                <p className="text-2xl font-bold text-gray-800">{mockInvestments.length}</p>
              </div>
              <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dealflow">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="dealflow">Deal Flow</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="duediligence">Due Diligence</TabsTrigger>
        </TabsList>
        
        {/* Deal Flow Tab */}
        <TabsContent value="dealflow" className="pt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search startups by name or industry..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Filters:</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Industry</p>
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
              <div>
                <p className="text-sm text-gray-600 mb-2">Stage</p>
                <div className="flex flex-wrap gap-2">
                  {stages.map(stage => (
                    <Badge
                      key={stage}
                      variant={selectedStages.includes(stage) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (selectedStages.includes(stage)) {
                          setSelectedStages(selectedStages.filter(s => s !== stage));
                        } else {
                          setSelectedStages([...selectedStages, stage]);
                        }
                      }}
                    >
                      {stage}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map(status => (
                    <Badge
                      key={status}
                      variant={selectedStatuses.includes(status) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (selectedStatuses.includes(status)) {
                          setSelectedStatuses(selectedStatuses.filter(s => s !== status));
                        } else {
                          setSelectedStatuses([...selectedStatuses, status]);
                        }
                      }}
                    >
                      {status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDeals.map(deal => (
                <Card key={deal.id} className={`border-l-4 ${deal.matchScore >= 90 ? 'border-l-green-500' : deal.matchScore >= 80 ? 'border-l-blue-500' : 'border-l-gray-300'}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{deal.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="secondary">{deal.industry}</Badge>
                          <Badge variant="outline">{deal.stage}</Badge>
                          {getStatusBadge(deal.status)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{deal.matchScore}%</div>
                      <div className="text-xs text-gray-500">Match Score</div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                      <div>
                        <div className="text-gray-500">Valuation</div>
                        <div className="font-semibold">{formatCurrency(deal.valuation)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Revenue</div>
                        <div className="font-semibold">{formatCurrency(deal.revenue)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Growth</div>
                        <div className="font-semibold text-green-600">+{deal.growth}%</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Raise Progress</span>
                        <span>{formatCurrency(deal.raised)} of {formatCurrency(deal.targetRaise)}</span>
                      </div>
                      <Progress value={(deal.raised / deal.targetRaise) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      {deal.highlights.slice(0, 2).map((highlight, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center">
                      <Map className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-600">{deal.location}</span>
                    </div>
                    <Link href={`/startup/${deal.id}`}>
                      <Button>View Details <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="pt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Your Investment Portfolio
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {mockInvestments.map(investment => (
                <Card key={investment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle>{investment.startupName}</CardTitle>
                          <CardDescription>Invested: {new Date(investment.date).toLocaleDateString()}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {investment.sharePercent}% Equity
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(investment.amount)} invested
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-gray-500 text-sm">Initial Valuation</div>
                        <div className="font-semibold">{formatCurrency(investment.valuation)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-sm">Current Valuation</div>
                        <div className="font-semibold">{formatCurrency(investment.currentValuation)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-sm">Value of Your Shares</div>
                        <div className="font-semibold">
                          {formatCurrency(investment.currentValuation * (investment.sharePercent / 100))}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-sm">Return</div>
                        <div className="font-semibold text-green-600">
                          {(((investment.currentValuation * (investment.sharePercent / 100)) / investment.amount) - 1) * 100}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Key Performance Indicators</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-gray-500 text-sm mb-1">Revenue (Quarterly)</div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{formatCurrency(investment.kpis.revenue[investment.kpis.revenue.length - 1])}</span>
                            <span className="text-xs text-green-600">
                              +{Math.round((investment.kpis.revenue[investment.kpis.revenue.length - 1] / investment.kpis.revenue[investment.kpis.revenue.length - 2] - 1) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm mb-1">Customers/Users</div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{investment.kpis.users[investment.kpis.users.length - 1]}</span>
                            <span className="text-xs text-green-600">
                              +{Math.round((investment.kpis.users[investment.kpis.users.length - 1] / investment.kpis.users[investment.kpis.users.length - 2] - 1) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm mb-1">Growth Rate</div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{investment.kpis.growth[investment.kpis.growth.length - 1]}%</span>
                            <span className="text-xs text-amber-600">
                              {investment.kpis.growth[investment.kpis.growth.length - 1] > investment.kpis.growth[investment.kpis.growth.length - 2] ? '↑' : '↓'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Link href={`/portfolio/${investment.startupId}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                    <Button className="ml-2">Schedule Call</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Due Diligence Tab */}
        <TabsContent value="duediligence" className="pt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Due Diligence Tools
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                    Financial Health Scores
                  </CardTitle>
                  <CardDescription>
                    Analyze financial statements and metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Automatically evaluate burn rate, runway, unit economics, and financial projections.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Liquidity Ratio</span>
                      <span className="text-sm font-medium">83%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cash Runway</span>
                      <span className="text-sm font-medium">14 months</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CAC/LTV Ratio</span>
                      <span className="text-sm font-medium">1:4.2</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Run Analysis</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-indigo-600" />
                    Founder Background Check
                  </CardTitle>
                  <CardDescription>
                    Verify founder credentials and history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Perform comprehensive background checks on founding team members and executives.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Identity Verification</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Criminal History</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Education Verification</span>
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Request Check</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    ROI Simulator
                  </CardTitle>
                  <CardDescription>
                    Project investment returns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Run simulations on potential investments with different scenarios and exit strategies.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conservative Return</span>
                      <span className="text-sm font-medium">2.8x</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Moderate Return</span>
                      <span className="text-sm font-medium">5.2x</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Optimistic Return</span>
                      <span className="text-sm font-medium">12.4x</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Run Simulation</Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Active Due Diligence</h3>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Company</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Stage</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Started</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Completion</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="font-medium">FinEdge</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">Series A</td>
                        <td className="py-4 px-4">Nov 15, 2023</td>
                        <td className="py-4 px-4">
                          <Progress value={65} className="h-2 w-24" />
                          <span className="text-xs text-gray-500">65%</span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">In Progress</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Button variant="outline" size="sm">Continue</Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="font-medium">GreenCommerce</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">Seed</td>
                        <td className="py-4 px-4">Nov 10, 2023</td>
                        <td className="py-4 px-4">
                          <Progress value={85} className="h-2 w-24" />
                          <span className="text-xs text-gray-500">85%</span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">Near Complete</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Button variant="outline" size="sm">Continue</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default InvestorDashboard;