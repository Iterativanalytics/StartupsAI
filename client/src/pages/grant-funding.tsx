import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { 
  ArrowRight, Search, Filter, DollarSign, Building2, Globe, PieChart, Clock, Shield,
  TrendingUp, Users, Award, CheckCircle, AlertCircle, CreditCard, History, Info,
  BarChart2, HelpCircle, Wallet, Target, Star, ExternalLink, Building, Zap, Gift, Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Grant {
  id: number;
  name: string;
  provider: string;
  type: 'government' | 'foundation' | 'corporate' | 'research';
  amount: number;
  deadline: string;
  eligibility: string[];
  sectors: string[];
  matchScore: number;
  description: string;
  website: string;
  requirements: string[];
  applicationProcess: string[];
  successRate: number;
  avgProcessingTime: string;
}

function GrantFunding() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState([1000, 1000000]);
  const [deadlineFilter, setDeadlineFilter] = useState<string>('all');

  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
    enabled: !!id
  });

  // Mock data for grants
  const grants: Grant[] = [
    {
      id: 1,
      name: "SBIR Phase I",
      provider: "National Science Foundation",
      type: "government",
      amount: 150000,
      deadline: "2024-06-15",
      eligibility: ["Small business", "US-based", "Technology focus"],
      sectors: ["Technology", "Research", "Innovation"],
      matchScore: 95,
      description: "Small Business Innovation Research program for early-stage technology development.",
      website: "https://nsf.gov/sbir",
      requirements: ["Research proposal", "Technical feasibility", "Commercial potential"],
      applicationProcess: ["Pre-application", "Full proposal", "Review process"],
      successRate: 0.15,
      avgProcessingTime: "6-8 months"
    },
    {
      id: 2,
      name: "Gates Foundation Global Health",
      provider: "Bill & Melinda Gates Foundation",
      type: "foundation",
      amount: 500000,
      deadline: "2024-08-30",
      eligibility: ["Non-profit", "Global health focus", "Innovation"],
      sectors: ["Healthcare", "Global Health", "Technology"],
      matchScore: 88,
      description: "Funding for innovative solutions to global health challenges.",
      website: "https://gatesfoundation.org",
      requirements: ["Health impact", "Innovation", "Scalability"],
      applicationProcess: ["Letter of inquiry", "Full proposal", "Review"],
      successRate: 0.08,
      avgProcessingTime: "4-6 months"
    },
    {
      id: 3,
      name: "Google for Startups",
      provider: "Google",
      type: "corporate",
      amount: 100000,
      deadline: "2024-07-20",
      eligibility: ["Tech startup", "Early stage", "Global"],
      sectors: ["Technology", "AI", "Cloud Computing"],
      matchScore: 92,
      description: "Google's startup accelerator program with funding and mentorship.",
      website: "https://startup.google.com",
      requirements: ["Tech focus", "Scalable business", "Innovation"],
      applicationProcess: ["Application", "Interview", "Selection"],
      successRate: 0.12,
      avgProcessingTime: "2-3 months"
    },
    {
      id: 4,
      name: "NIH Small Business Grant",
      provider: "National Institutes of Health",
      type: "government",
      amount: 300000,
      deadline: "2024-09-15",
      eligibility: ["Healthcare", "Biotech", "US-based"],
      sectors: ["Healthcare", "Biotechnology", "Research"],
      matchScore: 85,
      description: "NIH funding for small businesses developing healthcare technologies.",
      website: "https://grants.nih.gov",
      requirements: ["Health focus", "Scientific merit", "Commercial potential"],
      applicationProcess: ["Pre-application", "Full proposal", "Peer review"],
      successRate: 0.20,
      avgProcessingTime: "8-10 months"
    },
    {
      id: 5,
      name: "Microsoft for Startups",
      provider: "Microsoft",
      type: "corporate",
      amount: 120000,
      deadline: "2024-08-10",
      eligibility: ["B2B startup", "Cloud technology", "Global"],
      sectors: ["Technology", "Cloud", "Enterprise"],
      matchScore: 90,
      description: "Microsoft's startup program offering funding and Azure credits.",
      website: "https://startups.microsoft.com",
      requirements: ["B2B focus", "Cloud integration", "Innovation"],
      applicationProcess: ["Application", "Demo day", "Selection"],
      successRate: 0.15,
      avgProcessingTime: "3-4 months"
    },
    {
      id: 6,
      name: "Ford Foundation Innovation",
      provider: "Ford Foundation",
      type: "foundation",
      amount: 200000,
      deadline: "2024-10-01",
      eligibility: ["Social impact", "Non-profit", "Global"],
      sectors: ["Social Impact", "Education", "Sustainability"],
      matchScore: 82,
      description: "Funding for organizations creating social impact and positive change.",
      website: "https://fordfoundation.org",
      requirements: ["Social mission", "Impact measurement", "Sustainability"],
      applicationProcess: ["Concept note", "Full proposal", "Site visit"],
      successRate: 0.10,
      avgProcessingTime: "6-8 months"
    }
  ];

  const filteredGrants = grants.filter(grant => {
    const matchesSearch = grant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grant.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSectors.length === 0 || 
                          selectedSectors.some(sector => grant.sectors.includes(sector));
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(grant.type);
    const matchesAmount = grant.amount >= amountRange[0] && grant.amount <= amountRange[1];
    const matchesDeadline = deadlineFilter === 'all' || 
                           (deadlineFilter === 'soon' && new Date(grant.deadline) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) ||
                           (deadlineFilter === 'later' && new Date(grant.deadline) > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesSector && matchesType && matchesAmount && matchesDeadline;
  });

  const sectors = ["Technology", "Healthcare", "Research", "Innovation", "Global Health", "AI", "Cloud Computing", "Biotechnology", "Social Impact", "Education", "Sustainability", "Enterprise"];

  const grantTypes = [
    { value: 'government', label: 'Government', icon: Building, color: 'blue' },
    { value: 'foundation', label: 'Foundation', icon: Gift, color: 'purple' },
    { value: 'corporate', label: 'Corporate', icon: Building2, color: 'green' },
    { value: 'research', label: 'Research', icon: Award, color: 'orange' }
  ];

  const deadlineFilters = [
    { value: 'all', label: 'All Deadlines' },
    { value: 'soon', label: 'Within 30 Days' },
    { value: 'later', label: 'More than 30 Days' }
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
    const typeConfig = grantTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : Gift;
  };

  const getTypeLabel = (type: string) => {
    const typeConfig = grantTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.label : type;
  };

  const getTypeColor = (type: string) => {
    const typeConfig = grantTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.color : 'gray';
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days left`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks left`;
    return `${Math.ceil(diffDays / 30)} months left`;
  };

  const getDeadlineColor = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 bg-red-50';
    if (diffDays <= 7) return 'text-orange-600 bg-orange-50';
    if (diffDays <= 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Gift className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Grant Funding
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Discover non-dilutive funding opportunities from government agencies, foundations, and corporations to support your mission.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">$3.2B</p>
                  <p className="text-sm text-gray-600">Available Grants</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Gift className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-gray-600">Active Programs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">14%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                  <p className="text-sm text-gray-600">Deadlines This Month</p>
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
              Find Your Perfect Grant
            </CardTitle>
            <CardDescription>
              Use filters to find grants that align with your organization's mission and capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Grants
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, provider, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline Filter
                </label>
                <select
                  value={deadlineFilter}
                  onChange={(e) => setDeadlineFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {deadlineFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grant Amount: {formatCurrency(amountRange[0])} - {formatCurrency(amountRange[1])}
              </label>
              <Slider
                value={amountRange}
                onValueChange={setAmountRange}
                min={1000}
                max={2000000}
                step={1000}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grant Types
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {grantTypes.map(type => {
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
                          ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sectors
              </label>
              <div className="flex flex-wrap gap-2">
                {sectors.map(sector => (
                  <Badge
                    key={sector}
                    variant={selectedSectors.includes(sector) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedSectors(prev => 
                        prev.includes(sector) 
                          ? prev.filter(s => s !== sector)
                          : [...prev, sector]
                      );
                    }}
                  >
                    {sector}
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
              {filteredGrants.length} Grants Found
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Sorted by Match Score</span>
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGrants.map(grant => {
              const TypeIcon = getTypeIcon(grant.type);
              const typeColor = getTypeColor(grant.type);
              return (
                <Card key={grant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${typeColor}-100 rounded-lg`}>
                          <TypeIcon className={`h-6 w-6 text-${typeColor}-600`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{grant.name}</CardTitle>
                          <CardDescription>{grant.provider}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{grant.matchScore}% Match</span>
                        </div>
                        <Progress value={grant.matchScore} className="w-20 h-2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{grant.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Grant Amount</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(grant.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Success Rate</p>
                        <p className="text-sm text-gray-600">{(grant.successRate * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Processing Time</p>
                        <p className="text-sm text-gray-600">{grant.avgProcessingTime}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Deadline</p>
                        <Badge className={`text-xs ${getDeadlineColor(grant.deadline)}`}>
                          {formatDeadline(grant.deadline)}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Sectors</p>
                      <div className="flex flex-wrap gap-1">
                        {grant.sectors.map(sector => (
                          <Badge key={sector} variant="secondary" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Eligibility</p>
                      <div className="flex flex-wrap gap-1">
                        {grant.eligibility.slice(0, 3).map(requirement => (
                          <Badge key={requirement} variant="outline" className="text-xs">
                            {requirement}
                          </Badge>
                        ))}
                        {grant.eligibility.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{grant.eligibility.length - 3} more
                          </Badge>
                        )}
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
        <Card className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Secure Grant Funding?</h3>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Get matched with grants that align with your mission. Our platform analyzes 
                your organization and connects you with funding opportunities that are 
                perfect for your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Gift className="h-5 w-5 mr-2" />
                  Find My Grants
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
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

export default GrantFunding;
