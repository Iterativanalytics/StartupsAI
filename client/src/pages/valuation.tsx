import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  TrendingUp,
  DollarSign,
  Activity,
  Users,
  Target,
  Zap,
  Calendar,
  PieChart,
  BarChart2,
  Share2,
  Download,
  Info,
  Briefcase,
  Award,
  LineChart,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  ReceiptText,
  Network,
  LifeBuoy,
} from "lucide-react";

interface ValuationMetric {
  label: string;
  value: string;
  benchmark?: string;
  trend: number;
  change: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
}

interface ValuationMethod {
  method: string;
  applicability: string;
  description: string;
  result?: string;
}

interface SummaryMetric {
  label: string;
  value: string;
  trend: number;
  change: string;
  description: string;
  icon: React.ReactNode;
}

interface TeamMember {
  name: string;
  role: string;
  experience: string;
  prior_exits: string;
  expertise: string[];
}

// Function to get appropriate icon for each metric based on label
const getIconForMetric = (label: string) => {
  switch (label) {
    case "Valuation":
      return <DollarSign className="h-5 w-5 text-green-500" />;
    case "Revenue Multiple":
      return <BarChart className="h-5 w-5 text-blue-500" />;
    case "Runway":
      return <Activity className="h-5 w-5 text-orange-500" />;
    case "Burn Rate":
      return <TrendingUp className="h-5 w-5 text-red-500" />;
    case "Revenue":
      return <DollarSign className="h-5 w-5 text-green-500" />;
    case "Growth Rate":
      return <TrendingUp className="h-5 w-5 text-blue-500" />;
    case "EBITDA Margin":
      return <ReceiptText className="h-5 w-5 text-purple-500" />;
    case "Active Users":
      return <Users className="h-5 w-5 text-blue-500" />;
    case "Retention Rate":
      return <LifeBuoy className="h-5 w-5 text-green-500" />;
    case "Customer LTV":
      return <PieChart className="h-5 w-5 text-orange-500" />;
    case "CAC":
      return <Target className="h-5 w-5 text-purple-500" />;
    case "Market Size":
      return <Network className="h-5 w-5 text-blue-500" />;
    case "Market Share":
      return <PieChart className="h-5 w-5 text-green-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

export default function ValuationDashboard() {
  const [industry, setIndustry] = useState("saas");
  const [stage, setStage] = useState("seed");
  const [timeframe, setTimeframe] = useState("quarterly");
  const [dateRange, setDateRange] = useState("Q1 2023 - Q4 2023");
  const [planId, setPlanId] = useState(1); // Default to first business plan

  // Define valuation data type
  interface ValuationDataType {
    valuationSummary: {
      summaryMetrics: SummaryMetric[];
      financialMetrics: ValuationMetric[];
      nonFinancialMetrics: ValuationMetric[];
      marketMetrics: ValuationMetric[];
      teamMetrics: TeamMember[];
      valuationMethods: ValuationMethod[];
    }
  }

  // Fetch valuation data from API
  const { data: valuationData, isLoading } = useQuery<ValuationDataType>({
    queryKey: [`/api/valuation/${planId}`],
    staleTime: 30000 // 30 seconds
  });

  // Extract data from API response or use defaults
  const summaryMetrics: SummaryMetric[] = valuationData?.valuationSummary?.summaryMetrics
    ? valuationData.valuationSummary.summaryMetrics.map((metric: any) => ({
      ...metric,
      icon: getIconForMetric(metric.label)
    }))
    : [
    {
      label: "Valuation",
      value: "$4.7M",
      trend: 1,
      change: "+14.2%",
      description: "Estimated company valuation based on multiple methods",
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
    },
    {
      label: "Revenue Multiple",
      value: "6.5x",
      trend: 1,
      change: "+0.8x",
      description: "Revenue multiple compared to industry average",
      icon: <BarChart className="h-5 w-5 text-blue-500" />,
    },
    {
      label: "Runway",
      value: "18 months",
      trend: -1,
      change: "-2 months",
      description: "Cash runway at current burn rate",
      icon: <Activity className="h-5 w-5 text-orange-500" />,
    },
    {
      label: "Burn Rate",
      value: "$85K/mo",
      trend: 1,
      change: "+5.2%",
      description: "Monthly cash burn rate",
      icon: <TrendingUp className="h-5 w-5 text-red-500" />,
    },
  ];

  // Financial metrics
  const financialMetrics: ValuationMetric[] = valuationData?.valuationSummary?.financialMetrics
    ? valuationData.valuationSummary.financialMetrics.map((metric: any) => ({
      ...metric,
      icon: getIconForMetric(metric.label)
    }))
    : [
    {
      label: "Revenue",
      value: "$720K",
      benchmark: "Benchmark: $650K",
      trend: 1,
      change: "+18.5%",
      description: "Annual recurring revenue",
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
    },
    {
      label: "Growth Rate",
      value: "27.8%",
      benchmark: "Benchmark: 25%",
      trend: 1,
      change: "+3.2pts",
      description: "Year-over-year revenue growth",
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
    },
    {
      label: "EBITDA Margin",
      value: "-15%",
      benchmark: "Benchmark: -20%",
      trend: 1,
      change: "+5pts",
      description: "Earnings before interest, taxes, depreciation, and amortization",
      icon: <ReceiptText className="h-5 w-5 text-purple-500" />,
    },
  ];

  // Non-financial metrics
  const nonFinancialMetrics: ValuationMetric[] = valuationData?.valuationSummary?.nonFinancialMetrics 
    ? valuationData.valuationSummary.nonFinancialMetrics.map((metric: any) => ({
      ...metric,
      icon: getIconForMetric(metric.label)
    }))
    : [
    {
      label: "Active Users",
      value: "5,820",
      benchmark: "Benchmark: 4,500",
      trend: 1,
      change: "+28.5%",
      description: "Monthly active users",
      icon: <Users className="h-5 w-5 text-blue-500" />,
    },
    {
      label: "Retention Rate",
      value: "78%",
      benchmark: "Benchmark: 70%",
      trend: 1,
      change: "+8pts",
      description: "Customer retention rate",
      icon: <LifeBuoy className="h-5 w-5 text-green-500" />,
    },
    {
      label: "Customer LTV",
      value: "$4,005",
      benchmark: "Benchmark: $3,500",
      trend: 1,
      change: "+14.4%",
      description: "Customer lifetime value",
      icon: <PieChart className="h-5 w-5 text-orange-500" />,
    },
    {
      label: "CAC",
      value: "$890",
      benchmark: "Benchmark: $950",
      trend: -1,
      change: "-6.3%",
      description: "Customer acquisition cost",
      icon: <Target className="h-5 w-5 text-purple-500" />,
    },
  ];

  // Market metrics
  const marketMetrics: ValuationMetric[] = valuationData?.valuationSummary?.marketMetrics
    ? valuationData.valuationSummary.marketMetrics.map((metric: any) => ({
      ...metric,
      icon: getIconForMetric(metric.label)
    }))
    : [
    {
      label: "Market Size",
      value: "$48B",
      benchmark: "CAGR: 14.2%",
      trend: 1,
      change: "+3.5B",
      description: "Total addressable market size",
      icon: <Network className="h-5 w-5 text-blue-500" />,
    },
    {
      label: "Market Share",
      value: "0.05%",
      benchmark: "Top 10%: 2.5%",
      trend: 1,
      change: "+0.02pts",
      description: "Current market share percentage",
      icon: <PieChart className="h-5 w-5 text-green-500" />,
    },
  ];

  // Team metrics
  const teamMetrics: TeamMember[] = valuationData?.valuationSummary?.teamMetrics
    ? valuationData.valuationSummary.teamMetrics
    : [
    {
      name: "Sarah Johnson",
      role: "CEO",
      experience: "15 years",
      prior_exits: "2",
      expertise: ["Strategy", "Leadership", "Fundraising"]
    },
    {
      name: "Michael Chen",
      role: "CTO",
      experience: "12 years",
      prior_exits: "1",
      expertise: ["Software Architecture", "AI", "DevOps"]
    },
    {
      name: "David Rodriguez",
      role: "CFO",
      experience: "18 years",
      prior_exits: "1",
      expertise: ["Finance", "Venture Capital", "M&A"]
    },
    {
      name: "Emma Williams",
      role: "CMO",
      experience: "10 years",
      prior_exits: "0",
      expertise: ["Digital Marketing", "Brand Strategy", "Growth"]
    }
  ];

  // Valuation methods
  const valuationMethods: ValuationMethod[] = valuationData?.valuationSummary?.valuationMethods
    ? valuationData.valuationSummary.valuationMethods
    : [
    {
      method: "Discounted Cash Flow (DCF)",
      applicability: "High",
      description: "Based on projected cash flows discounted to present value",
      result: "$5.2M",
    },
    {
      method: "Comparable Company Analysis",
      applicability: "High",
      description: "Based on valuation multiples of similar public companies",
      result: "$4.8M",
    },
    {
      method: "Venture Capital Method",
      applicability: "High",
      description: "Based on exit value and expected ROI for investors",
      result: "$4.5M",
    },
    {
      method: "First Chicago Method",
      applicability: "Medium",
      description: "Probability-weighted scenarios (success, sideways, failure)",
      result: "$4.3M",
    },
    {
      method: "Berkus Method",
      applicability: "Medium",
      description: "Assigns value to qualitative aspects of early-stage startups",
      result: "$4.6M",
    },
    {
      method: "Risk Factor Summation",
      applicability: "Medium",
      description: "Adjusts base value according to various risk factors",
      result: "$4.9M",
    }
  ];

  // Render metric card component
  const renderMetricCard = (metric: ValuationMetric) => (
    <Card key={metric.label} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {metric.icon}
            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{metric.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {metric.trend !== 0 && (
            <Badge variant={metric.trend > 0 ? "default" : "destructive"} className="text-xs">
              {metric.trend > 0 ? "↑" : "↓"} {metric.change}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
            {metric.benchmark && (
              <p className="text-xs text-gray-500">{metric.benchmark}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render gauge component
  const renderGauge = (value: number, threshold1: number, threshold2: number) => {
    const getColor = () => {
      if (value >= threshold2) return "text-green-500";
      if (value >= threshold1) return "text-yellow-500";
      return "text-red-500";
    };

    return (
      <div className="relative w-28 h-28 mx-auto">
        <svg className="w-28 h-28 transform -rotate-90">
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="56"
            cy="56"
          />
          <circle
            className={getColor()}
            strokeWidth="8"
            strokeDasharray={282.74}
            strokeDashoffset={282.74 - (value / 100) * 282.74}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="56"
            cy="56"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-lg font-semibold">{value}%</span>
        </div>
      </div>
    );
  };

  // Handle industry change
  const handleIndustryChange = (value: string) => {
    setIndustry(value);
    // Would update metrics based on industry
  };

  // Handle stage change
  const handleStageChange = (value: string) => {
    setStage(value);
    // Would update metrics based on stage
  };

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    // Would update date range and metrics
    if (value === 'monthly') {
      setDateRange('Jan 2023 - Dec 2023');
    } else if (value === 'quarterly') {
      setDateRange('Q1 2023 - Q4 2023');
    } else {
      setDateRange('2021 - 2023');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Valuation Dashboard</h1>
          <p className="text-gray-500">Interactive tool to monitor key valuation metrics</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <Select value={industry} onValueChange={handleIndustryChange}>
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="biotech">Biotech</SelectItem>
                <SelectItem value="fintech">Fintech</SelectItem>
                <SelectItem value="hardware">Hardware</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={stage} onValueChange={handleStageChange}>
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre_seed">Pre-seed</SelectItem>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="series_a">Series A</SelectItem>
                <SelectItem value="series_b">Series B</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">{dateRange}</div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((metric) => (
          <Card key={metric.label} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {metric.icon}
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{metric.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Badge variant={metric.trend > 0 ? (metric.label === 'Burn Rate' ? "destructive" : "default") : (metric.label === 'Burn Rate' ? "default" : "destructive")} className="text-xs">
                  {metric.trend > 0 ? "↑" : "↓"} {metric.change}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-800">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="financial">Financial Metrics</TabsTrigger>
          <TabsTrigger value="non-financial">User Metrics</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="team">Team Assessment</TabsTrigger>
          <TabsTrigger value="valuation">Valuation Methods</TabsTrigger>
        </TabsList>
        
        {/* Financial Metrics Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {financialMetrics.map(metric => renderMetricCard(metric))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gross Margin</CardTitle>
                <CardDescription>Current gross margin percentage vs. targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  {renderGauge(72, 40, 60)}
                  <div className="w-full mt-4 flex justify-between text-xs text-gray-500">
                    <span>Poor (&lt;40%)</span>
                    <span>Average (40-60%)</span>
                    <span>Good (&gt;60%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>CAC vs. LTV</CardTitle>
                <CardDescription>Customer acquisition cost vs. lifetime value</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center pt-4">
                <div className="w-full max-w-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium">CAC</span>
                    <span className="text-xs font-medium">$890</span>
                  </div>
                  <Progress value={22.2} className="h-8 mb-4" />
                  
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium">LTV</span>
                    <span className="text-xs font-medium">$4,005</span>
                  </div>
                  <Progress value={100} className="h-8" />
                  
                  <div className="mt-6 text-center">
                    <Badge className="px-3 py-1 text-sm">LTV/CAC Ratio: 4.5x</Badge>
                    <p className="text-xs text-gray-500 mt-2">Goal: LTV/CAC ratio &gt; 3x</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Non-Financial Metrics Tab */}
        <TabsContent value="non-financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {nonFinancialMetrics.map(metric => renderMetricCard(metric))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Churn Rate</CardTitle>
                <CardDescription>Monthly customer churn percentage</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-48 h-48 relative">
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">5%</span>
                    <span className="text-xs text-green-500">3pts below industry avg</span>
                  </div>
                  {/* This would be a donut chart in a real implementation */}
                  <div className="absolute inset-0 border-8 border-blue-500 rounded-full opacity-20"></div>
                  <div className="absolute inset-0 border-8 border-blue-500 rounded-full" style={{ clip: 'rect(0, 48px, 96px, 0)' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Conversion Funnel</CardTitle>
                <CardDescription>User journey conversion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Visitors</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-6" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Sign-ups</span>
                      <span>18%</span>
                    </div>
                    <Progress value={18} className="h-6" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Trial Users</span>
                      <span>10.8%</span>
                    </div>
                    <Progress value={10.8} className="h-6" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Paying Customers</span>
                      <span>2.8%</span>
                    </div>
                    <Progress value={2.8} className="h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Market Analysis Tab */}
        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {marketMetrics.map(metric => renderMetricCard(metric))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Size Breakdown</CardTitle>
              <CardDescription>Total Addressable Market, Serviceable Addressable Market, and Serviceable Obtainable Market</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
                <div className="relative w-64 h-64">
                  {/* This would be a treemap visualization in a real implementation */}
                  <div className="absolute inset-0 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-500">TAM</p>
                      <p className="text-3xl font-bold text-blue-700">$48B</p>
                    </div>
                  </div>
                  <div className="absolute top-1/4 left-1/4 w-3/4 h-3/4 bg-blue-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-500">SAM</p>
                      <p className="text-2xl font-bold text-blue-700">$12B</p>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-blue-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-base font-bold text-blue-500">SOM</p>
                      <p className="text-xl font-bold text-blue-700">$1.2B</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-100 mr-2"></div>
                      <span className="font-medium">TAM: Total Addressable Market</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">Total market demand for your product or service</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-200 mr-2"></div>
                      <span className="font-medium">SAM: Serviceable Addressable Market</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">Segment of TAM targeted by your products and services</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-300 mr-2"></div>
                      <span className="font-medium">SOM: Serviceable Obtainable Market</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">Portion of SAM that you can realistically capture</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Team Assessment Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Founding Team Assessment</CardTitle>
              <CardDescription>Experience, expertise, and prior exit history of key team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Name</th>
                      <th className="text-left py-2 px-3">Role</th>
                      <th className="text-left py-2 px-3">Experience</th>
                      <th className="text-left py-2 px-3">Prior Exits</th>
                      <th className="text-left py-2 px-3">Key Expertise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMetrics.map((member, index) => (
                      <tr key={index} className={index !== teamMetrics.length - 1 ? "border-b" : ""}>
                        <td className="py-3 px-3">{member.name}</td>
                        <td className="py-3 px-3">{member.role}</td>
                        <td className="py-3 px-3">{member.experience}</td>
                        <td className="py-3 px-3">{member.prior_exits}</td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {member.expertise.map((skill, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Experience</CardTitle>
                <CardDescription>Total years of industry experience</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-blue-600">45</div>
                <p className="text-gray-500 mt-2">Combined years</p>
                <div className="w-full mt-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Executive Team</span>
                    <span>45 years</span>
                  </div>
                  <Progress value={100} className="h-3 mb-4" />
                  
                  <div className="flex justify-between text-sm mb-1">
                    <span>Technical Team</span>
                    <span>38 years</span>
                  </div>
                  <Progress value={84} className="h-3 mb-4" />
                  
                  <div className="flex justify-between text-sm mb-1">
                    <span>Business/Operations</span>
                    <span>27 years</span>
                  </div>
                  <Progress value={60} className="h-3" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Prior Exits</CardTitle>
                <CardDescription>Team's historical success with previous ventures</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[240px]">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-600">4</div>
                    <p className="text-gray-500">Prior successful exits</p>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">2</div>
                        <p className="text-xs text-gray-500">Acquisitions</p>
                      </div>
                      
                      <div>
                        <div className="text-2xl font-bold text-purple-600">1</div>
                        <p className="text-xs text-gray-500">IPO</p>
                      </div>
                      
                      <div>
                        <div className="text-2xl font-bold text-orange-600">1</div>
                        <p className="text-xs text-gray-500">Merger</p>
                      </div>
                      
                      <div>
                        <div className="text-2xl font-bold text-green-600">$85M</div>
                        <p className="text-xs text-gray-500">Total Value</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Valuation Methods Tab */}
        <TabsContent value="valuation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Valuation Methods Comparison</CardTitle>
              <CardDescription>Analysis of different valuation approaches based on stage and industry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Method</th>
                      <th className="text-left py-2 px-3">Applicability</th>
                      <th className="text-left py-2 px-3">Description</th>
                      <th className="text-right py-2 px-3">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {valuationMethods.map((method, index) => (
                      <tr key={index} className={index !== valuationMethods.length - 1 ? "border-b" : ""}>
                        <td className="py-3 px-3 font-medium">{method.method}</td>
                        <td className="py-3 px-3">
                          <Badge variant={method.applicability === "High" ? "default" : "outline"} className="text-xs">
                            {method.applicability}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">{method.description}</td>
                        <td className="py-3 px-3 text-right font-medium">{method.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Valuation Distribution</CardTitle>
                <CardDescription>Range of valuations across different methods</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center pt-4">
                <div className="w-full max-w-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium">Min: $4.3M</span>
                    <span className="text-xs font-medium">Avg: $4.7M</span>
                    <span className="text-xs font-medium">Max: $5.2M</span>
                  </div>
                  <div className="relative h-16 w-full mt-2">
                    {/* This would be a box plot in a real implementation */}
                    <div className="absolute w-full h-4 bg-blue-100 rounded-full top-6"></div>
                    <div className="absolute h-10 bg-blue-300 rounded-lg" style={{ left: '20%', width: '60%', top: '3px' }}></div>
                    <div className="absolute w-2 h-12 bg-blue-500 rounded-full" style={{ left: '45%', top: '0px' }}></div>
                    <div className="absolute w-1 h-14 bg-blue-700" style={{ left: '10%', top: '1px' }}></div>
                    <div className="absolute w-1 h-14 bg-blue-700" style={{ left: '90%', top: '1px' }}></div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <div className="text-center">
                      <div className="text-sm font-semibold">$4.3M - $4.7M</div>
                      <div className="text-xs text-gray-500">Conservative</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold">$4.7M - $5.2M</div>
                      <div className="text-xs text-gray-500">Optimistic</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommendation</CardTitle>
                <CardDescription>Expert valuation guidance based on market conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-xl font-bold text-blue-700">$4.7 Million</p>
                    <p className="text-sm text-blue-600">Recommended valuation</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm">Consistent with SaaS company averages at seed stage (5-7x ARR)</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm">Accounts for strong team experience and prior exits</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm">Reflects above-average growth rate and customer metrics</p>
                    </div>
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm">Consider negotiation buffer for investor discussions (±10%)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <ArrowDown className="mr-2 h-4 w-4" />
                  Download Valuation Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}