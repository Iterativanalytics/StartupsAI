import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { 
  ArrowRight, Search, Filter, DollarSign, Building2, Globe, PieChart, Clock, Shield,
  TrendingUp, Users, Award, CheckCircle, AlertCircle, CreditCard, History, Info,
  BarChart2, HelpCircle, Wallet, Target, Gift, FileText, ExternalLink, BarChart, 
  TrendingDown, AlertTriangle, Star, Bell, Settings, Download, RefreshCw, Plus,
  Eye, Lock, Zap, ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Helper functions for the enhanced credit score meter
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number): string => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  return d;
};

// Helper to generate a lighter shade of a color
const shadeColor = (color: string, percent: number) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.round(R * (100 + percent) / 100);
  G = Math.round(G * (100 + percent) / 100);
  B = Math.round(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
};

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

function Funding() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [fundingRange, setFundingRange] = useState([50000, 500000]);
  const [selectedBureau, setSelectedBureau] = useState("transunion");

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Fetch user data for credit monitoring
  interface UserData {
    username: string;
    id: number;
    role: string;
  }
  
  const { data: userData } = useQuery<UserData>({
    queryKey: ['/api/user'],
  });

  const userName = userData?.username || "User";

  // Mock data for demonstrations
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
      regions: ["North America"],
      portfolio: 289,
      successRate: 0.82,
      matchScore: 87
    },
    {
      id: 3,
      name: "Angel Investor Network",
      type: "angel",
      logo: "https://via.placeholder.com/40",
      minInvestment: 25000,
      maxInvestment: 250000,
      industries: ["Software", "E-commerce", "Mobile"],
      stages: ["Pre-seed", "Seed"],
      regions: ["North America", "Europe"],
      portfolio: 45,
      successRate: 0.65,
      matchScore: 94
    }
  ];

  const lenders: Lender[] = [
    {
      id: 1,
      name: "Business Capital Corp",
      type: "online",
      logo: "https://via.placeholder.com/40",
      minLoan: 10000,
      maxLoan: 500000,
      interestRate: 8.5,
      term: 36,
      requirements: {
        minCreditScore: 650,
        minTimeInBusiness: 12,
        minAnnualRevenue: 100000
      },
      matchScore: 89
    },
    {
      id: 2,
      name: "FirstBank Business Lending",
      type: "bank",
      logo: "https://via.placeholder.com/40",
      minLoan: 25000,
      maxLoan: 1000000,
      interestRate: 6.2,
      term: 60,
      requirements: {
        minCreditScore: 700,
        minTimeInBusiness: 24,
        minAnnualRevenue: 250000
      },
      matchScore: 76
    },
    {
      id: 3,
      name: "Community Credit Union",
      type: "credit-union",
      logo: "https://via.placeholder.com/40",
      minLoan: 5000,
      maxLoan: 150000,
      interestRate: 7.8,
      term: 48,
      requirements: {
        minCreditScore: 600,
        minTimeInBusiness: 6,
        minAnnualRevenue: 50000
      },
      matchScore: 82
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
    }
  ];

  // Enhanced credit monitoring data
  const creditScore = 803;
  const creditMaxScore = 850;
  const scoreChange = +12; // Points changed this month
  const previousScore = creditScore - scoreChange;
  const scorePercentage = (creditScore / creditMaxScore) * 100;
  const needleRotation = -90 + (scorePercentage * 180 / 100);
  
  // Enhanced credit factors
  const creditFactors = [
    {
      name: "Payment History",
    percentage: 100,
    status: "excellent",
      impact: "Most Impact",
      description: "You've made 100% of payments on time",
      trend: "stable",
      weight: 35
    },
    {
      name: "Credit Utilization",
    percentage: 2,
    status: "excellent",
      impact: "High Impact",
      description: "$1,508 of $84,301 total credit used",
      trend: "improving",
      weight: 30
    },
    {
      name: "Credit Age",
      years: 7,
      months: 3,
      status: "good",
      impact: "Medium Impact", 
      description: "Average age of your credit accounts",
      trend: "improving",
      weight: 15
    },
    {
      name: "Credit Mix",
      accounts: 5,
      types: 3,
      status: "good",
      impact: "Low Impact",
      description: "Good variety of credit types",
      trend: "stable",
      weight: 10
    },
    {
      name: "New Credit",
      inquiries: 1,
      status: "excellent",
      impact: "Low Impact", 
      description: "1 hard inquiry in the last 2 years",
      trend: "stable",
      weight: 10
    }
  ];

  // Credit goals and achievements
  const creditGoals = [
    {
      title: "Reach 820 Credit Score",
      current: 803,
      target: 820,
      progress: 94,
      timeframe: "3 months",
      status: "in_progress"
    },
    {
      title: "Reduce Utilization to 1%",
      current: 2,
      target: 1,
      progress: 50,
      timeframe: "1 month", 
      status: "in_progress"
    },
    {
      title: "Maintain Perfect Payment History",
      current: 100,
      target: 100,
      progress: 100,
      timeframe: "Ongoing",
      status: "achieved"
    }
  ];

  // Credit monitoring alerts
  const creditAlerts = [
    {
      type: "positive",
      title: "Credit Score Increased",
      description: "Your TransUnion score increased by 12 points",
      date: "2 days ago",
      icon: TrendingUp,
      action: "View Details"
    },
    {
      type: "info", 
      title: "Monthly Report Available",
      description: "Your December credit report is ready to view",
      date: "1 week ago",
      icon: Bell,
      action: "Download"
    }
  ];

  // Account data with enhanced details
  const creditAccounts = [
    {
      name: "Capital One Venture",
      type: "Credit Card",
      balance: 2500,
      limit: 10000,
      utilization: 25,
      payment: 125,
      status: "Current",
      opened: "Jan 2019",
      lastPayment: "Dec 15, 2023",
      paymentHistory: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      name: "Chase Freedom Unlimited", 
      type: "Credit Card",
      balance: 0,
      limit: 15000,
      utilization: 0,
      payment: 0,
      status: "Current",
      opened: "Mar 2020",
      lastPayment: "Dec 10, 2023",
      paymentHistory: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {
      name: "Auto Loan - Honda",
      type: "Installment Loan", 
      balance: 12000,
      originalAmount: 25000,
      payment: 450,
      status: "Current",
      opened: "Jun 2021",
      lastPayment: "Dec 20, 2023",
      paymentHistory: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }
  ];

  // Credit score tiers
  const creditTiers = [
    { name: "Poor", min: 300, max: 579, color: "bg-red-500" },
    { name: "Fair", min: 580, max: 669, color: "bg-yellow-500" }, 
    { name: "Good", min: 670, max: 739, color: "bg-blue-500" },
    { name: "Very Good", min: 740, max: 799, color: "bg-green-500" },
    { name: "Exceptional", min: 800, max: 850, color: "bg-purple-500" }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 800) return "text-purple-600";
    if (score >= 740) return "text-green-600";
    if (score >= 670) return "text-blue-600";
    if (score >= 580) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent": return "text-green-600";
      case "good": return "text-blue-600";
      case "fair": return "text-yellow-600";
      case "poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "declining": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const filteredInvestors = investors.filter(investor =>
    investor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedIndustries.length === 0 || investor.industries.some(industry => 
      selectedIndustries.includes(industry)
    )) &&
    investor.maxInvestment >= fundingRange[0] &&
    investor.minInvestment <= fundingRange[1]
  );

  const filteredLenders = lenders.filter(lender =>
    lender.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    lender.maxLoan >= fundingRange[0] &&
    lender.minLoan <= fundingRange[1]
  );

  const filteredGrants = grants.filter(grant =>
    grant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grant.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grant.sectors.some(sector => sector.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <DollarSign className="h-10 w-10 text-indigo-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Funding Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore comprehensive funding options for your business across equity, debt, and grant opportunities
          </p>
        </div>

        <Tabs defaultValue="equity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit">
            <TabsTrigger value="equity" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Equity Funding
            </TabsTrigger>
            <TabsTrigger value="debt" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Debt Funding
            </TabsTrigger>
            <TabsTrigger value="grants" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Grant Funding
            </TabsTrigger>
          </TabsList>

          {/* Equity Funding Tab */}
          <TabsContent value="equity" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Equity Funding Overview
                </CardTitle>
                <CardDescription>
                  Selling a portion of your company's ownership in exchange for capital.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Pros</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• No obligation to repay the funds</li>
                      <li>• No additional financial burden</li>
                      <li>• Access to investor expertise and networks</li>
                      <li>• Shared risk with investors</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Cons</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Give up ownership and control</li>
                      <li>• Dilution of founder equity</li>
                      <li>• Investor involvement in decisions</li>
                      <li>• Complex legal agreements</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Best for:</strong> Startups and high-growth businesses that need significant capital 
                    but may not qualify for large loans, or companies seeking strategic partnerships.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filters */}
            <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Find Investors</CardTitle>
                <CardDescription>
                  Discover investors that match your business profile and funding needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search investors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Investment Range: {formatCurrency(fundingRange[0])} - {formatCurrency(fundingRange[1])}
                    </label>
                    <Slider
                      value={fundingRange}
                      onValueChange={setFundingRange}
                      max={10000000}
                      min={10000}
                      step={10000}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investor Results */}
            <div className="grid gap-6">
              {filteredInvestors.map((investor) => (
                <Card key={investor.id} className="backdrop-blur-sm bg-white/70 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={investor.logo}
                          alt={investor.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{investor.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {investor.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{investor.matchScore}%</div>
                        <div className="text-sm text-gray-500">Match Score</div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                      <div>
                        <div className="text-sm text-gray-500">Investment Range</div>
                        <div className="font-semibold">
                          {formatCurrency(investor.minInvestment)} - {formatCurrency(investor.maxInvestment)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Portfolio Size</div>
                        <div className="font-semibold">{investor.portfolio} companies</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Success Rate</div>
                        <div className="font-semibold">{(investor.successRate * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm text-gray-500 mb-2">Focus Areas</div>
                      <div className="flex flex-wrap gap-2">
                        {investor.industries.map((industry) => (
                          <Badge key={industry} variant="secondary" className="text-xs">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex gap-2">
                        {investor.stages.map((stage) => (
                          <Badge key={stage} variant="outline" className="text-xs">
                            {stage}
                          </Badge>
                        ))}
                      </div>
                      <Button className="ml-auto">
                        Connect
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Debt Funding Tab */}
          <TabsContent value="debt" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Debt Funding Overview
                </CardTitle>
                <CardDescription>
                  Borrowing money that must be paid back, usually with interest, over a set period.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Pros</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Owners retain full control of the business</li>
                      <li>• No dilution of ownership</li>
                      <li>• Interest payments are tax deductible</li>
                      <li>• Predictable payment schedule</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Cons</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Creates financial obligation and burden</li>
                      <li>• Regular payments required regardless of performance</li>
                      <li>• Personal guarantees often required</li>
                      <li>• Strict qualification requirements</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Best for:</strong> Established businesses with steady cash flow, 
                    good credit history, and predictable revenue streams.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Credit Bureau Tabs */}
            <Tabs value={selectedBureau} onValueChange={setSelectedBureau} className="mb-6">
              <TabsList className="grid grid-cols-3 bg-white/70 backdrop-blur-sm">
                <TabsTrigger value="transunion" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  TransUnion
                </TabsTrigger>
                <TabsTrigger value="equifax" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Equifax
                </TabsTrigger>
                <TabsTrigger value="experian" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Experian
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Credit Score</p>
                      <p className={`text-2xl font-bold ${getScoreColorClass(creditScore)}`}>
                        {creditScore}
                      </p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">+{scoreChange} points</span>
                      </div>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Utilization</p>
                      <p className="text-2xl font-bold text-green-600">2%</p>
                      <p className="text-xs text-gray-500">$1,508 / $84,301</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Payment History</p>
                      <p className="text-2xl font-bold text-green-600">100%</p>
                      <p className="text-xs text-gray-500">Always on time</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Accounts</p>
                      <p className="text-2xl font-bold text-blue-600">28</p>
                      <p className="text-xs text-gray-500">Open & closed</p>
                    </div>
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Wallet className="h-6 w-6 text-teal-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Credit Score & Factors */}
              <div className="lg:col-span-2 space-y-6">
                {/* Enhanced Credit Score Overview */}
                <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-green-50/50 pointer-events-none" />
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          <Award className="h-5 w-5" />
                        </div>
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Credit Score Overview
                        </span>
                      </CardTitle>
                      <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 shadow-sm">
                        <Star className="h-3 w-3 mr-1" />
                        Exceptional
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                      {/* Enhanced Credit Score Meter */}
                      <div className="flex-shrink-0 w-full lg:w-auto">
                        <div className="relative w-full max-w-sm mx-auto lg:mx-0 lg:w-80 h-44 group">
                          <svg className="w-full h-full drop-shadow-lg" viewBox="0 0 400 220" role="img" aria-label="Credit score meter gauge">
                            <defs>
                              {creditTiers.map((tier, index) => {
                                const tierAngle = 180 / creditTiers.length;
                                const startAngle = -90 + index * tierAngle;
                                const endAngle = startAngle + tierAngle;
                                const textPath = describeArc(200, 200, 150, startAngle, endAngle);
                            return (
                              <path
                                    key={`text-path-${index}`}
                                    id={`text-path-${index}`}
                                    d={textPath}
                                fill="none"
                              />
                            );
                          })}
                            
                              <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.15)" />
                              </filter>
                            </defs>

                            {creditTiers.map((tier, index) => {
                              const tierAngle = 180 / creditTiers.length;
                              const startAngle = -90 + index * tierAngle;
                              const endAngle = startAngle + tierAngle;
                              const angleGap = 2;
                              const arcPath = describeArc(200, 200, 150, startAngle + angleGap, endAngle - angleGap);

                              const colors = {
                                "Poor": "#f85959",
                                "Fair": "#ff934c", 
                                "Good": "#f9d14b",
                                "Very Good": "#93d25b",
                                "Exceptional": "#4acb6d"
                              };

                              const tierColor = colors[tier.name as keyof typeof colors] || "#f85959";

                              return (
                                <g key={tier.name}>
                                  <path d={arcPath} fill="none" stroke={tierColor} strokeWidth="48" strokeLinecap="butt"/>
                                  <path d={arcPath} fill="none" stroke={shadeColor(tierColor, 10)} strokeWidth="38" strokeLinecap="butt"/>
                                  <path d={arcPath} fill="none" stroke={shadeColor(tierColor, 20)} strokeWidth="28" strokeLinecap="butt"/>
                                </g>
                              );
                            })}

                            {creditTiers.map((tier, index) => {
                              return (
                                <text key={`label-${tier.name}`} fill="#0d233a" fontSize="17" fontWeight="bold" dominantBaseline="middle">
                                  <textPath href={`#text-path-${index}`} startOffset="15%" textAnchor="start">
                                    {tier.name.toUpperCase()}
                                  </textPath>
                            </text>
                              );
                            })}

                            <g transform={`rotate(${needleRotation} 200 200)`} style={{ transition: 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)' }}>
                              <path 
                                d={`M 196 200 C 196 140, 200 85, 200 65 C 200 85, 204 140, 204 200 Z`} 
                                fill="#0d233a" 
                              />
                            </g>
                            
                            <g filter="url(#drop-shadow)">
                              <circle cx="200" cy="200" r="16" fill="#0d233a" />
                              <circle cx="200" cy="200" r="13" fill="none" stroke="white" strokeWidth="2" />
                            </g>
                        </svg>

                        <div className="absolute top-[185px] left-1/2 -translate-x-1/2 w-full">
                          <div className="w-20 h-0.5 mx-auto" style={{backgroundColor: '#0d233a'}} />
                          <p className="text-xl font-medium tracking-[0.2em] mt-2" style={{color: '#0d233a'}}>CREDIT SCORE</p>
                        </div>
                      </div>
                    </div>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                          <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Exceptional Credit
                          </span>
                          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            <TrendingUp className="h-4 w-4" />
                            +{scoreChange}
                          </div>
                        </div>
                        <p className="text-gray-600 text-lg">
                          Your score increased by <span className="font-semibold text-green-600">{scoreChange} points</span> this month
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          You're in the top 20% of credit scores nationwide
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Credit Factors */}
              <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-blue-600" />
                      Credit Score Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {creditFactors.map((factor, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{factor.name}</span>
                                {getTrendIcon(factor.trend)}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {factor.impact}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <span className={`font-semibold text-lg ${getStatusColorClass(factor.status)}`}>
                                {factor.percentage !== undefined ? `${factor.percentage}%` : 
                                 factor.years !== undefined ? `${factor.years}y ${factor.months}m` :
                                 factor.accounts !== undefined ? `${factor.accounts} accounts` :
                                 factor.inquiries !== undefined ? `${factor.inquiries} inquiry` : ''}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{factor.description}</span>
                              <span className="text-gray-500">{factor.weight}% of score</span>
                            </div>
                            
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  factor.status === "excellent" ? "bg-green-500" :
                                  factor.status === "good" ? "bg-blue-500" :
                                  factor.status === "fair" ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ width: `${factor.percentage || 80}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - AI Scoring, Goals, Alerts */}
              <div className="space-y-6">
                {/* AI Credit Scoring */}
                <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        <Zap className="h-5 w-5" />
                      </div>
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        AI Credit Scoring
                      </span>
                  </CardTitle>
                  <CardDescription>
                      Advanced AI analysis of your credit profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#f3f4f6"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="url(#aiScoreGradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.95)}`}
                            className="transition-all duration-2000 ease-out"
                            style={{
                              strokeDasharray: `${2 * Math.PI * 40}`,
                              strokeDashoffset: `${2 * Math.PI * 40 * (1 - 0.95)}`
                            }}
                          />
                          <defs>
                            <linearGradient id="aiScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            95
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">AI Credit Score</h3>
                      <p className="text-sm text-gray-600">Exceptional AI Analysis</p>
                  </div>

                  <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                      <div>
                            <h4 className="font-semibold text-green-800 text-sm mb-1">Payment Pattern Analysis</h4>
                            <p className="text-xs text-green-700">AI detected consistent on-time payments across all accounts</p>
                      </div>
                      </div>
                    </div>

                      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                          </div>
                      <div>
                            <h4 className="font-semibold text-blue-800 text-sm mb-1">Credit Utilization Optimization</h4>
                            <p className="text-xs text-blue-700">AI recommends maintaining current low utilization for maximum score</p>
                      </div>
                        </div>
                        </div>
                      </div>
                  </CardContent>
                </Card>

                {/* Credit Goals */}
                <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-600" />
                      Credit Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {creditGoals.map((goal, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{goal.title}</h4>
                            <Badge variant={goal.status === "achieved" ? "default" : "outline"}>
                              {goal.status === "achieved" ? "✓" : `${goal.progress}%`}
                            </Badge>
                    </div>
                          <Progress value={goal.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{goal.current} / {goal.target}</span>
                            <span>{goal.timeframe}</span>
                  </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Credit Alerts */}
                <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-blue-600" />
                      Recent Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {creditAlerts.map((alert, index) => {
                        const IconComponent = alert.icon;
                        return (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                            <div className={`p-1 rounded-full ${
                              alert.type === "positive" ? "bg-green-100" : "bg-blue-100"
                            }`}>
                              <IconComponent className={`h-4 w-4 ${
                                alert.type === "positive" ? "text-green-600" : "text-blue-600"
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{alert.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                              <p className="text-xs text-gray-500 mt-1">{alert.date}</p>
                            </div>
                            <Button size="sm" variant="ghost" className="text-xs">
                              {alert.action}
                  </Button>
                          </div>
                        );
                      })}
                    </div>
                </CardContent>
              </Card>
              </div>
              
              {/* Right Column - Lender Matching */}
              <div className="lg:col-span-1">
              {/* Lender Matching */}
              <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Find Lenders</CardTitle>
                  <CardDescription>
                    Discover lending options that match your credit profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Loan Amount: {formatCurrency(fundingRange[0])} - {formatCurrency(fundingRange[1])}
                      </label>
                      <Slider
                        value={fundingRange}
                        onValueChange={setFundingRange}
                        max={2000000}
                        min={5000}
                        step={5000}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      {filteredLenders.slice(0, 2).map((lender) => (
                        <div key={lender.id} className="p-4 border rounded-lg bg-white/50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{lender.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {lender.type}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">{lender.matchScore}%</div>
                              <div className="text-xs text-gray-500">Match</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Rate:</span> {lender.interestRate}%
                            </div>
                            <div>
                              <span className="text-gray-500">Term:</span> {lender.term} months
                            </div>
                            <div>
                              <span className="text-gray-500">Min Credit:</span> {lender.requirements.minCreditScore}
                            </div>
                            <div>
                              <span className="text-gray-500">Max Loan:</span> {formatCurrency(lender.maxLoan)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full">
                      View All Lenders
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>
          </TabsContent>

          {/* Grant Funding Tab */}
          <TabsContent value="grants" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-600" />
                  Grant Funding Overview
                </CardTitle>
                <CardDescription>
                  Non-repayable funds provided for projects with social or economic benefits.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Pros</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• No repayment required</li>
                      <li>• No loss of ownership or control</li>
                      <li>• Ideal for non-profits and social impact projects</li>
                      <li>• Often includes additional support and resources</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Cons</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Highly competitive application process</li>
                      <li>• Specific project or demographic requirements</li>
                      <li>• Extensive reporting and compliance obligations</li>
                      <li>• Limited funding amounts and strict deadlines</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Best for:</strong> Non-profits, social enterprises, research projects, 
                    and businesses focused on community impact or specific demographics like youth entrepreneurs.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Grant Search */}
            <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Find Grant Opportunities</CardTitle>
                <CardDescription>
                  Discover grants that align with your business mission and demographics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Search grants by name, provider, or sector..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Grant Results */}
            <div className="grid gap-6">
              {filteredGrants.map((grant) => (
                <Card key={grant.id} className="backdrop-blur-sm bg-white/70 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{grant.name}</h3>
                        <p className="text-gray-600 mb-2">{grant.provider}</p>
                        <Badge variant="outline" className="mr-2">
                          {grant.type}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {grant.matchScore}% Match
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCurrency(grant.amount)}
                        </div>
                        <div className="text-sm text-gray-500">Grant Amount</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{grant.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-2">Deadline</div>
                        <div className="font-semibold flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          {new Date(grant.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-2">Focus Sectors</div>
                        <div className="flex flex-wrap gap-1">
                          {grant.sectors.map((sector) => (
                            <Badge key={sector} variant="secondary" className="text-xs">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-2">Eligibility Requirements</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {grant.eligibility.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Guidelines
                      </Button>
                      <Button>
                        Apply Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Funding;