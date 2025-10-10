import React, { useState } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, ArrowDown, ArrowUp, Building2, DollarSign, 
  TrendingUp, Users, AlertTriangle, Check, ChevronUp,
  Award, LineChart, Target, BarChart2, Clock
} from 'lucide-react';

function Analysis() {
  const { id } = useParams();
  
  // Fetch business plan
  const { data: businessPlan, isLoading: isLoadingPlan } = useQuery({
    queryKey: [`/api/business-plans/${id}`],
  });

  // Fetch analysis for this plan
  const { data: analysis, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: [`/api/business-plans/${id}/analysis`],
    enabled: !!id
  });
  
  if (isLoadingPlan || isLoadingAnalysis) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Default data if API doesn't return anything yet
  const analysisData = {
    totalScore: 92.22,
    ranking: 13,
    companyValue: "$2.5M",
    planScores: {
      spelling: 94.38,
      structure: 79.50,
      deckLength: 92.80,
      clarity: 74.49
    },
    businessScores: {
      foundingTeam: 100,
      market: 100,
      product: 75,
      traction: 80
    },
    financialMetrics: {
      grossProfitMargin: 40.83,
      operatingExpenseRatio: 25.01,
      netProfitMargin: 15.82,
      revenueGrowth: 127.4,
      customerAcquisitionCost: 218,
      lifeTimeValue: 1450,
      burnRate: 132000,
      runway: 18.5
    },
    investmentMetrics: {
      roi: 87.5,
      breakEvenTime: 2.3,
      fundingRounds: 1,
      equityDilution: 15,
      discountedCashFlow: 4.8,
      capTable: {
        founders: 85,
        investors: 15,
        esop: 0
      }
    },
    riskProfile: {
      marketRisk: 35,
      executionRisk: 22,
      financialRisk: 28,
      teamRisk: 14,
      competitiveRisk: 42,
      regulatoryRisk: 19
    },
    industryComparison: {
      valuationMultiple: 3.8,
      avgGrowthRate: 62.4,
      marketSharePotential: 1.8,
      innovationScore: 72.1
    },
    founderTeam: {
      roles: ["CEO", "CFO", "CIO", "CTO"],
      experience: "10 years",
      connections: 1700,
      previousExits: 1,
      domainExpertise: 78,
      teamCompleteness: 92
    }
  };

  // Additional metrics for different user perspectives
  const investorPerspective = {
    dealAttractiveness: 87,
    potentialMultiple: "4.2x",
    timeToExit: "5-7 years",
    investmentReadiness: 92,
    competitiveAnalysis: [
      { competitor: "Market Leader", valuation: "$65M", growth: 48, marketShare: 32 },
      { competitor: "This Business", valuation: "$2.5M", growth: 127, marketShare: 1.8 },
      { competitor: "Emerging Player", valuation: "$12M", growth: 89, marketShare: 7.2 }
    ],
    swotAnalysis: {
      strengths: ["Strong founding team", "Innovative product", "Growing market"],
      weaknesses: ["Limited track record", "Cash burn rate", "Customer acquisition cost"],
      opportunities: ["International expansion", "New product lines", "Strategic partnerships"],
      threats: ["Increasing competition", "Regulatory changes", "Economic downturn"]
    }
  };

  const lenderPerspective = {
    creditworthiness: 83,
    debtServiceCoverageRatio: 2.4,
    collateralValue: "$1.2M",
    debtEquityRatio: 0.35,
    cashflowStability: 78,
    repaymentCapacity: 91,
    riskRating: "B+",
    recommendedLoanTerms: {
      maxAmount: "$800K",
      interestRate: "8.5-9.5%",
      term: "60 months",
      type: "Term loan with monthly payments"
    }
  };

  const partnerPerspective = {
    strategicFit: 92,
    revenueOpportunity: "$350K annually",
    resourceRequirements: "Moderate",
    collaborationModel: "Co-marketing and integration",
    timeToValue: "3-4 months",
    partnershipReadiness: 87,
    recommendedNextSteps: [
      "Technical integration planning",
      "Joint marketing strategy",
      "Contract negotiation",
      "Partner enablement program"
    ]
  };
  
  const renderScoreBar = (score: number, color: string = "bg-blue-600") => (
    <div className="flex items-center">
      <div className="w-48 h-2 bg-gray-200 rounded-full mr-3">
        <div className={`h-2 ${color} rounded-full`} style={{ width: `${score}%` }}></div>
      </div>
      <span className="text-gray-800 font-medium">{score.toFixed(2)}</span>
    </div>
  );
  
  const renderGauge = (value: number, color: string = "text-blue-600") => (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="48"
          cy="48"
        />
        <circle
          className={color}
          strokeWidth="8"
          strokeDasharray={251.2}
          strokeDashoffset={251.2 - (value / 100) * 251.2}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="40"
          cx="48"
          cy="48"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-xl font-bold">{value}%</span>
      </div>
    </div>
  );

  const renderRiskIndicator = (risk: number) => {
    let color = "text-green-500";
    if (risk > 60) color = "text-red-500";
    else if (risk > 30) color = "text-amber-500";
    
    return (
      <div className="flex items-center">
        <Progress value={risk} className="w-24 h-2 mr-2" />
        <span className={`text-sm font-medium ${color}`}>{risk}%</span>
      </div>
    );
  };

  const getComparativeIndicator = (value: number, benchmark: number) => {
    const diff = value - benchmark;
    if (diff > 0) {
      return <ChevronUp className="h-4 w-4 text-green-500" />;
    } else if (diff < 0) {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Scoring & Ranking{businessPlan && typeof businessPlan === 'object' && 'name' in businessPlan ? ` for ${businessPlan.name}` : ''}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Score</span>
              <span className="text-3xl font-bold text-blue-600">{analysisData.totalScore}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Your Ranking</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-blue-600">#{analysisData.ranking}</span>
                <p className="text-sm text-gray-500">(top 5% of startups)</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Company Value</span>
              <span className="text-3xl font-bold text-blue-600">{analysisData.companyValue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Analysis Tabs */}
      <Tabs defaultValue="entrepreneur" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entrepreneur">Entrepreneur</TabsTrigger>
          <TabsTrigger value="investor">Investor</TabsTrigger>
          <TabsTrigger value="lender">Lender</TabsTrigger>
          <TabsTrigger value="partner">Partner</TabsTrigger>
        </TabsList>

        {/* Entrepreneur Perspective */}
        <TabsContent value="entrepreneur" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Business Plan Analysis</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Spelling</span>
                  {renderScoreBar(analysisData.planScores.spelling)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Structure</span>
                  {renderScoreBar(analysisData.planScores.structure)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Deck Length</span>
                  {renderScoreBar(analysisData.planScores.deckLength)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Clarity</span>
                  {renderScoreBar(analysisData.planScores.clarity)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Business Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Founding Team</span>
                  {renderScoreBar(analysisData.businessScores.foundingTeam, "bg-green-600")}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Market</span>
                  {renderScoreBar(analysisData.businessScores.market, "bg-green-600")}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Product</span>
                  {renderScoreBar(analysisData.businessScores.product, "bg-green-600")}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Traction</span>
                  {renderScoreBar(analysisData.businessScores.traction, "bg-green-600")}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Founding Team</h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {analysisData.founderTeam.roles.map((role, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{role}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{analysisData.founderTeam.experience}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Network</p>
                    <p className="font-medium">{analysisData.founderTeam.connections} connections</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Domain Expertise</p>
                    <p className="font-medium">{analysisData.founderTeam.domainExpertise}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Previous Exits</p>
                    <p className="font-medium">{analysisData.founderTeam.previousExits}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Metrics</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  {renderGauge(analysisData.financialMetrics.grossProfitMargin)}
                  <span className="mt-2 text-sm text-gray-600">Gross Profit Margin</span>
                </div>
                <div className="flex flex-col items-center">
                  {renderGauge(analysisData.financialMetrics.operatingExpenseRatio)}
                  <span className="mt-2 text-sm text-gray-600">Operating Expense Ratio</span>
                </div>
                <div className="flex flex-col items-center">
                  {renderGauge(analysisData.financialMetrics.netProfitMargin)}
                  <span className="mt-2 text-sm text-gray-600">Net Profit Margin</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Extended Financial Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Revenue Growth</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-green-600 mr-2">{analysisData.financialMetrics.revenueGrowth}%</span>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Year-over-Year</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Customer Acquisition Cost</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-800 mr-2">${analysisData.financialMetrics.customerAcquisitionCost}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Per customer</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Customer Lifetime Value</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-800 mr-2">${analysisData.financialMetrics.lifeTimeValue}</span>
                </div>
                <p className="text-xs text-green-600 mt-1">LTV:CAC Ratio: 6.7x</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Runway</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-800 mr-2">{analysisData.financialMetrics.runway}</span>
                  <span className="text-lg font-medium text-gray-600">months</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">At current burn rate: ${analysisData.financialMetrics.burnRate}/mo</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Risk Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Risk Profile</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Market Risk</span>
                    {renderRiskIndicator(analysisData.riskProfile.marketRisk)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Execution Risk</span>
                    {renderRiskIndicator(analysisData.riskProfile.executionRisk)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Financial Risk</span>
                    {renderRiskIndicator(analysisData.riskProfile.financialRisk)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Team Risk</span>
                    {renderRiskIndicator(analysisData.riskProfile.teamRisk)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Competitive Risk</span>
                    {renderRiskIndicator(analysisData.riskProfile.competitiveRisk)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Regulatory Risk</span>
                    {renderRiskIndicator(analysisData.riskProfile.regulatoryRisk)}
                  </div>
                </div>
              </div>
              
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Areas for Improvement</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Competitive Positioning</p>
                      <p className="text-sm text-amber-700">Your product differentiation score is below industry average. Consider refining your unique value proposition.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Cash Burn Rate</p>
                      <p className="text-sm text-amber-700">Your burn rate is 28% above the benchmark for similar stage companies. Review your cost structure.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Team Composition</p>
                      <p className="text-sm text-green-700">Your founding team skill coverage is excellent, with complementary expertise across key areas.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Market Opportunity</p>
                      <p className="text-sm text-green-700">Your target market is growing at 23% annually, presenting significant expansion opportunities.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Investor Perspective */}
        <TabsContent value="investor" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Investment Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Target className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-600">Deal Attractiveness</span>
                      </div>
                      <div className="font-medium">{investorPerspective.dealAttractiveness}%</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm text-gray-600">Potential Multiple</span>
                      </div>
                      <div className="font-medium">{investorPerspective.potentialMultiple}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-amber-600 mr-2" />
                        <span className="text-sm text-gray-600">Time to Exit</span>
                      </div>
                      <div className="font-medium">{investorPerspective.timeToExit}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-indigo-600 mr-2" />
                        <span className="text-sm text-gray-600">Investment Readiness</span>
                      </div>
                      <div className="font-medium">{investorPerspective.investmentReadiness}%</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Cap Table</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Founders</span>
                        <div className="flex items-center">
                          <Progress value={analysisData.investmentMetrics.capTable.founders} className="w-24 h-2 mr-2" />
                          <span className="text-sm">{analysisData.investmentMetrics.capTable.founders}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Investors</span>
                        <div className="flex items-center">
                          <Progress value={analysisData.investmentMetrics.capTable.investors} className="w-24 h-2 mr-2" />
                          <span className="text-sm">{analysisData.investmentMetrics.capTable.investors}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">ESOP</span>
                        <div className="flex items-center">
                          <Progress value={analysisData.investmentMetrics.capTable.esop} className="w-24 h-2 mr-2" />
                          <span className="text-sm">{analysisData.investmentMetrics.capTable.esop}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">SWOT Analysis</CardTitle>
                  <CardDescription>Key strengths, weaknesses, opportunities, and threats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-base font-medium text-green-800 mb-2">Strengths</h3>
                      <ul className="space-y-1">
                        {investorPerspective.swotAnalysis.strengths.map((item, index) => (
                          <li key={index} className="text-sm text-green-700 flex items-start">
                            <Check className="h-4 w-4 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="text-base font-medium text-red-800 mb-2">Weaknesses</h3>
                      <ul className="space-y-1">
                        {investorPerspective.swotAnalysis.weaknesses.map((item, index) => (
                          <li key={index} className="text-sm text-red-700 flex items-start">
                            <AlertCircle className="h-4 w-4 text-red-600 mr-1 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-base font-medium text-blue-800 mb-2">Opportunities</h3>
                      <ul className="space-y-1">
                        {investorPerspective.swotAnalysis.opportunities.map((item, index) => (
                          <li key={index} className="text-sm text-blue-700 flex items-start">
                            <TrendingUp className="h-4 w-4 text-blue-600 mr-1 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h3 className="text-base font-medium text-amber-800 mb-2">Threats</h3>
                      <ul className="space-y-1">
                        {investorPerspective.swotAnalysis.threats.map((item, index) => (
                          <li key={index} className="text-sm text-amber-700 flex items-start">
                            <AlertTriangle className="h-4 w-4 text-amber-600 mr-1 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Competitive Analysis</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Company</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Valuation</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Growth (%)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Market Share (%)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Competitive Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investorPerspective.competitiveAnalysis.map((competitor, index) => (
                      <tr key={index} className={`border-b ${competitor.competitor === "This Business" ? "bg-blue-50" : ""}`}>
                        <td className="py-3 px-4 text-sm font-medium">
                          {competitor.competitor}
                          {competitor.competitor === "This Business" && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800">You</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm">{competitor.valuation}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={competitor.growth > 100 ? "text-green-600 font-medium" : ""}>{competitor.growth}%</span>
                        </td>
                        <td className="py-3 px-4 text-sm">{competitor.marketShare}%</td>
                        <td className="py-3 px-4 text-sm">
                          {competitor.competitor === "Market Leader" && (
                            <Badge className="bg-amber-100 text-amber-800">Incumbent</Badge>
                          )}
                          {competitor.competitor === "This Business" && (
                            <Badge className="bg-green-100 text-green-800">Disruptor</Badge>
                          )}
                          {competitor.competitor === "Emerging Player" && (
                            <Badge className="bg-purple-100 text-purple-800">Challenger</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>ROI Potential</CardTitle>
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600 mb-2">{analysisData.investmentMetrics.roi}%</div>
                  <p className="text-sm text-gray-600">Projected 5-year ROI based on market growth and execution metrics</p>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Break-even time:</span>
                      <span className="font-medium">{analysisData.investmentMetrics.breakEvenTime} years</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">DCF multiple:</span>
                      <span className="font-medium">{analysisData.investmentMetrics.discountedCashFlow}x</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Market Metrics</CardTitle>
                    <LineChart className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Valuation Multiple</div>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-800 mr-2">{analysisData.industryComparison.valuationMultiple}x</span>
                        <span className="text-xs text-amber-600">(Industry avg: 3.2x)</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Average Growth Rate</div>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-800 mr-2">{analysisData.industryComparison.avgGrowthRate}%</span>
                        <span className="text-xs text-green-600">(Industry avg: 38.5%)</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Market Share Potential</div>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-800 mr-2">{analysisData.industryComparison.marketSharePotential}%</span>
                        <span className="text-xs text-gray-600">(5-year projection)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Team Assessment</CardTitle>
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Team Completeness</div>
                      <div className="flex items-center">
                        <Progress value={analysisData.founderTeam.teamCompleteness} className="w-full h-2 mr-2" />
                        <span className="text-sm font-medium">{analysisData.founderTeam.teamCompleteness}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Domain Expertise</div>
                      <div className="flex items-center">
                        <Progress value={analysisData.founderTeam.domainExpertise} className="w-full h-2 mr-2" />
                        <span className="text-sm font-medium">{analysisData.founderTeam.domainExpertise}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Previous Exits</div>
                      <div className="flex items-center">
                        <span className="text-xl font-bold text-gray-800">{analysisData.founderTeam.previousExits}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Network Strength</div>
                      <div className="flex items-center">
                        <span className="text-xl font-bold text-gray-800">{analysisData.founderTeam.connections}</span>
                        <span className="text-sm text-gray-600 ml-1">connections</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Lender Perspective */}
        <TabsContent value="lender" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Credit Analysis</CardTitle>
                  <CardDescription>Detailed credit assessment for lending decisions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Creditworthiness Score</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-blue-600">{lenderPerspective.creditworthiness}</span>
                        <Badge className={`
                          ${lenderPerspective.creditworthiness >= 80 ? 'bg-green-100 text-green-800' : 
                          lenderPerspective.creditworthiness >= 70 ? 'bg-blue-100 text-blue-800' :
                          lenderPerspective.creditworthiness >= 60 ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'}
                        `}>
                          {lenderPerspective.creditworthiness >= 80 ? 'Excellent' : 
                          lenderPerspective.creditworthiness >= 70 ? 'Good' :
                          lenderPerspective.creditworthiness >= 60 ? 'Fair' : 
                          'Poor'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Based on financial history and projections</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Risk Rating</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-blue-600">{lenderPerspective.riskRating}</span>
                        <Badge className="bg-amber-100 text-amber-800">Medium Risk</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Internal risk classification</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Debt Service Coverage Ratio</h3>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-800 mr-2">{lenderPerspective.debtServiceCoverageRatio}</span>
                        {lenderPerspective.debtServiceCoverageRatio >= 1.5 ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Minimum threshold: 1.5</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Debt-to-Equity Ratio</h3>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-800 mr-2">{lenderPerspective.debtEquityRatio}</span>
                        {lenderPerspective.debtEquityRatio <= 0.5 ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Target threshold: less than 0.5</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-base font-medium text-gray-700 mb-3">Cash Flow Stability</h3>
                      <div className="flex items-center mb-3">
                        <Progress 
                          value={lenderPerspective.cashflowStability} 
                          className="w-full h-2 mr-2" 
                        />
                        <span className="text-sm font-medium">{lenderPerspective.cashflowStability}%</span>
                      </div>
                      <p className="text-sm text-gray-600">Based on 24-month revenue history and volatility analysis</p>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium text-gray-700 mb-3">Repayment Capacity</h3>
                      <div className="flex items-center mb-3">
                        <Progress 
                          value={lenderPerspective.repaymentCapacity} 
                          className="w-full h-2 mr-2"
                        />
                        <span className="text-sm font-medium">{lenderPerspective.repaymentCapacity}%</span>
                      </div>
                      <p className="text-sm text-gray-600">Based on financial projections and stress testing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recommended Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Maximum Loan Amount</h3>
                    <div className="text-2xl font-bold text-blue-600">{lenderPerspective.recommendedLoanTerms.maxAmount}</div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Interest Rate Range</h3>
                    <div className="text-2xl font-bold text-gray-800">{lenderPerspective.recommendedLoanTerms.interestRate}</div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Term Length</h3>
                    <div className="text-2xl font-bold text-gray-800">{lenderPerspective.recommendedLoanTerms.term}</div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Loan Type</h3>
                    <div className="text-base text-gray-800">{lenderPerspective.recommendedLoanTerms.type}</div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Collateral Value</h3>
                    <div className="text-xl font-bold text-gray-800">{lenderPerspective.collateralValue}</div>
                    <p className="text-xs text-gray-500 mt-1">Based on asset valuation</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Health Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-base font-medium text-gray-700 mb-3">Revenue Trend</h3>
                <div className="flex items-center">
                  <BarChart2 className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">+{analysisData.financialMetrics.revenueGrowth}%</div>
                    <div className="text-sm text-gray-600">Year-over-Year</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-700 mb-3">Gross Margin</h3>
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{analysisData.financialMetrics.grossProfitMargin}%</div>
                    <div className="text-sm text-gray-600">Industry Avg: 34.5%</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-700 mb-3">Operating Expense</h3>
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-amber-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{analysisData.financialMetrics.operatingExpenseRatio}%</div>
                    <div className="text-sm text-gray-600">Industry Avg: 27.8%</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-700 mb-3">Cash Runway</h3>
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{analysisData.financialMetrics.runway} mo</div>
                    <div className="text-sm text-gray-600">Based on current burn</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Partner Perspective */}
        <TabsContent value="partner" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Partnership Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Strategic Fit</h3>
                    <div className="flex items-center">
                      <Progress 
                        value={partnerPerspective.strategicFit} 
                        className="w-full h-2 mr-2"
                      />
                      <span className="text-sm font-medium">{partnerPerspective.strategicFit}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Revenue Opportunity</h3>
                    <div className="text-xl font-bold text-blue-600">{partnerPerspective.revenueOpportunity}</div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Resource Requirements</h3>
                    <Badge className="bg-amber-100 text-amber-800">{partnerPerspective.resourceRequirements}</Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Time to Value</h3>
                    <div className="text-xl font-bold text-gray-800">{partnerPerspective.timeToValue}</div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Partnership Readiness</h3>
                    <div className="flex items-center">
                      <Progress 
                        value={partnerPerspective.partnershipReadiness} 
                        className="w-full h-2 mr-2"
                      />
                      <span className="text-sm font-medium">{partnerPerspective.partnershipReadiness}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Collaboration Model</CardTitle>
                  <CardDescription>Recommended approach for partnership</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Recommended Model</h3>
                    <p className="text-base text-blue-700">{partnerPerspective.collaborationModel}</p>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Next Steps</h3>
                  <div className="space-y-2">
                    {partnerPerspective.recommendedNextSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="text-gray-700">{step}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Market Opportunity Assessment</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-gray-700 mb-2">Target Market Growth</h3>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Progress value={82} className="h-2" />
                    </div>
                    <span className="ml-2 font-medium text-green-600">+23% CAGR</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Market growing faster than industry average (15%)</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-700 mb-2">Customer Alignment</h3>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Progress value={78} className="h-2" />
                    </div>
                    <span className="ml-2 font-medium">78%</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Shared customer profile with high cross-selling potential</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-700 mb-2">Competitive Differentiation</h3>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Progress value={65} className="h-2" />
                    </div>
                    <span className="ml-2 font-medium">65%</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Products offer complementary features with limited overlap</p>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-700 mb-2">International Expansion Potential</h3>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Progress value={72} className="h-2" />
                    </div>
                    <span className="ml-2 font-medium">72%</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Good alignment with global expansion strategy</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Technology Assessment</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-700">Product Maturity</h3>
                    <p className="text-sm text-gray-600">MVP with core features implemented</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">Beta</Badge>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-700">Technical Stack</h3>
                    <p className="text-sm text-gray-600">React, Node.js, PostgreSQL</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Compatible</Badge>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-700">API Readiness</h3>
                    <p className="text-sm text-gray-600">RESTful APIs with documentation</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Ready</Badge>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-700">Security & Compliance</h3>
                    <p className="text-sm text-gray-600">Basic security measures in place</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-700">Scalability</h3>
                    <p className="text-sm text-gray-600">Architecture can support moderate growth</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Scalable</Badge>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Analysis;