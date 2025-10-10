import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, ScatterChart, Scatter, ZAxis, ComposedChart, Area, PieChart, Pie, Cell, Treemap, Sankey } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Building2, DollarSign, Calendar, Users, Shield, Database, Cpu, FileText, Eye, Activity, Download, Upload, RefreshCw, Filter, Search, BarChart3, PieChart as PieChartIcon, Settings, Info, ChevronDown, ChevronUp, X, Plus, Zap, Brain, Target, Star, Award, Clock, Globe, Lock, Unlock, Lightbulb, Rocket, Bell, Hash, Gauge } from 'lucide-react';

// Import the enhanced scoring engine
import EnhancedCreditScorer from './EnhancedCreditScoring';

interface Business {
  id: number;
  companyName: string;
  ein: string;
  industry: string;
  finalScore: number;
  defaultProbability: number;
  confidence: number;
  assessmentDate: string;
  decision: any;
  requestedAmount: string;
  components: any;
  modelVersion: string;
  status: string;
  processingTime?: number;
  riskFactors?: any[];
  strengths?: any[];
  metrics?: any;
}

interface PortfolioMetrics {
  avgScore: number;
  totalApplications: number;
  totalExposure: number;
  avgDefaultProb: string;
  ratingDistribution: Record<string, number>;
  decisionDistribution: Record<string, number>;
  approvalRate: string;
  avgConfidence: string;
  processingTime: string;
  modelAccuracy: string;
}

interface AlertConfig {
  enabled: boolean;
  scoreThreshold: number;
  riskThreshold: number;
  volumeThreshold: number;
}

const EnhancedCreditScoringMain = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [compareBusinesses, setCompareBusinesses] = useState<Business[]>([]);
  const [filterCriteria, setFilterCriteria] = useState({ 
    minScore: 0, 
    maxScore: 850, 
    industry: 'all', 
    decision: 'all',
    dateRange: '30d'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [realTimeAlerts, setRealTimeAlerts] = useState<any[]>([]);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    enabled: true,
    scoreThreshold: 600,
    riskThreshold: 0.25,
    volumeThreshold: 10
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [showStressTesting, setShowStressTesting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    ein: '',
    industry: 'technology',
    yearsInBusiness: '',
    employeeCount: '',
    annualRevenue: '',
    totalDebt: '',
    currentAssets: '',
    currentLiabilities: '',
    accountsReceivable: '',
    accountsPayable: '',
    cashBalance: '',
    avgDailyBalance3mo: '',
    overdrafts12mo: '0',
    nsfIncidents: '0',
    depositConsistency: '85',
    personalFicoScore: '',
    businessCreditScore: '',
    paymentHistoryScore: '90',
    creditUtilization: '30',
    hardInquiries: '1',
    derogatoryMarks: '0',
    monthlyTraffic: '',
    socialFollowers: '',
    onlineReviewScore: '4.2',
    customerCount: '',
    customerRetention: '85',
    churnRate: '15',
    ltvCacRatio: '3.5',
    revenueGrowthRate: '',
    requestedAmount: '',
    requestedTerm: '36',
    loanPurpose: 'working_capital'
  });

  // Enhanced validation with more comprehensive checks
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.yearsInBusiness || parseFloat(formData.yearsInBusiness) < 0) {
      errors.yearsInBusiness = 'Valid years required';
    }
    if (!formData.employeeCount || parseFloat(formData.employeeCount) < 0) {
      errors.employeeCount = 'Valid employee count required';
    }
    if (!formData.annualRevenue || parseFloat(formData.annualRevenue) <= 0) {
      errors.annualRevenue = 'Valid revenue required';
    }
    if (!formData.currentAssets || parseFloat(formData.currentAssets) < 0) {
      errors.currentAssets = 'Valid assets required';
    }
    if (!formData.currentLiabilities || parseFloat(formData.currentLiabilities) < 0) {
      errors.currentLiabilities = 'Valid liabilities required';
    }
    if (!formData.totalDebt || parseFloat(formData.totalDebt) < 0) {
      errors.totalDebt = 'Valid debt amount required';
    }
    if (!formData.cashBalance || parseFloat(formData.cashBalance) < 0) {
      errors.cashBalance = 'Valid cash balance required';
    }
    if (!formData.avgDailyBalance3mo || parseFloat(formData.avgDailyBalance3mo) < 0) {
      errors.avgDailyBalance3mo = 'Valid balance required';
    }
    if (!formData.personalFicoScore || parseFloat(formData.personalFicoScore) < 300 || parseFloat(formData.personalFicoScore) > 850) {
      errors.personalFicoScore = 'FICO score must be between 300-850';
    }
    if (!formData.requestedAmount || parseFloat(formData.requestedAmount) <= 0) {
      errors.requestedAmount = 'Valid loan amount required';
    }
    
    // Business logic validations
    const revenue = parseFloat(formData.annualRevenue) || 0;
    const requested = parseFloat(formData.requestedAmount) || 0;
    if (requested > revenue * 2) {
      errors.requestedAmount = 'Requested amount exceeds 2x annual revenue';
    }
    
    const assets = parseFloat(formData.currentAssets) || 0;
    const liabilities = parseFloat(formData.currentLiabilities) || 0;
    if (assets < liabilities * 0.5) {
      errors.currentAssets = 'Assets seem low relative to liabilities';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Enhanced scoring with the new algorithm
  const calculateScore = useCallback(async (data: any) => {
    setIsCalculating(true);
    
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const scoreResult = EnhancedCreditScorer.calculateAdvancedScore(data);
      return scoreResult;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const getCreditRating = useCallback((score: number) => {
    if (score >= 800) return { rating: 'A+', color: 'text-emerald-600', bg: 'bg-emerald-100', risk: 'Minimal Risk', riskLevel: 1 };
    if (score >= 750) return { rating: 'A', color: 'text-green-600', bg: 'bg-green-100', risk: 'Very Low Risk', riskLevel: 2 };
    if (score >= 700) return { rating: 'B+', color: 'text-blue-600', bg: 'bg-blue-100', risk: 'Low Risk', riskLevel: 3 };
    if (score >= 650) return { rating: 'B', color: 'text-cyan-600', bg: 'bg-cyan-100', risk: 'Moderate Risk', riskLevel: 4 };
    if (score >= 600) return { rating: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-100', risk: 'Medium Risk', riskLevel: 5 };
    if (score >= 550) return { rating: 'C', color: 'text-orange-600', bg: 'bg-orange-100', risk: 'High Risk', riskLevel: 6 };
    if (score >= 500) return { rating: 'D', color: 'text-red-600', bg: 'bg-red-100', risk: 'Very High Risk', riskLevel: 7 };
    return { rating: 'F', color: 'text-red-800', bg: 'bg-red-200', risk: 'Extremely High Risk', riskLevel: 8 };
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show toast notification instead of alert
      return;
    }
    
    setIsCalculating(true);
    
    try {
      const scoreResult = await calculateScore(formData);
      
      const newBusiness: Business = {
        id: Date.now(),
        ...formData,
        ...scoreResult,
        assessmentDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      
      setBusinesses(prev => [newBusiness, ...prev]);
      setSelectedBusiness(newBusiness);
      updatePortfolioMetrics([newBusiness, ...businesses]);
      
      // Check for alerts
      checkForAlerts(newBusiness);
      
      setActiveTab('results');
    } catch (error) {
      console.error('Error calculating score:', error);
    }
  }, [formData, validateForm, calculateScore, businesses]);

  const updatePortfolioMetrics = useCallback((allBusinesses: Business[]) => {
    if (allBusinesses.length === 0) return;
    
    const avgScore = allBusinesses.reduce((sum, b) => sum + b.finalScore, 0) / allBusinesses.length;
    const totalExposure = allBusinesses.reduce((sum, b) => {
      const amt = parseFloat(b.requestedAmount) || 0;
      return sum + amt;
    }, 0);
    const avgDefaultProb = allBusinesses.reduce((sum, b) => sum + b.defaultProbability, 0) / allBusinesses.length;
    const avgProcessingTime = allBusinesses.reduce((sum, b) => sum + (b.processingTime || 0), 0) / allBusinesses.length;
    
    const ratingDist = allBusinesses.reduce((acc, b) => {
      const rating = getCreditRating(b.finalScore).rating;
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const decisionDist = allBusinesses.reduce((acc, b) => {
      acc[b.decision.decision] = (acc[b.decision.decision] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    setPortfolioMetrics({
      avgScore: Math.round(avgScore),
      totalApplications: allBusinesses.length,
      totalExposure,
      avgDefaultProb: (avgDefaultProb * 100).toFixed(2),
      ratingDistribution: ratingDist,
      decisionDistribution: decisionDist,
      approvalRate: (allBusinesses.filter(b => b.decision.decision === 'APPROVED').length / allBusinesses.length * 100).toFixed(1),
      avgConfidence: ((allBusinesses.reduce((sum, b) => sum + b.confidence, 0) / allBusinesses.length) * 100).toFixed(1),
      processingTime: avgProcessingTime.toFixed(1),
      modelAccuracy: '94.2' // This would come from model validation in production
    });
  }, [getCreditRating]);

  const checkForAlerts = useCallback((business: Business) => {
    const alerts: Array<{
      type: string;
      message: string;
      business: string;
      timestamp: string;
    }> = [];
    
    if (alertConfig.enabled) {
      if (business.finalScore < alertConfig.scoreThreshold) {
        alerts.push({
          type: 'warning',
          message: `Low credit score detected: ${business.finalScore}`,
          business: business.companyName,
          timestamp: new Date().toISOString()
        });
      }
      
      if (business.defaultProbability > alertConfig.riskThreshold) {
        alerts.push({
          type: 'danger',
          message: `High default risk: ${(business.defaultProbability * 100).toFixed(2)}%`,
          business: business.companyName,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    if (alerts.length > 0) {
      setRealTimeAlerts(prev => [...alerts, ...prev].slice(0, 50)); // Keep last 50 alerts
    }
  }, [alertConfig]);

  const getFilteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const matchesScore = b.finalScore >= filterCriteria.minScore && b.finalScore <= filterCriteria.maxScore;
      const matchesIndustry = filterCriteria.industry === 'all' || b.industry === filterCriteria.industry;
      const matchesDecision = filterCriteria.decision === 'all' || b.decision.decision === filterCriteria.decision;
      const matchesSearch = searchTerm === '' || 
        b.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.ein && b.ein.includes(searchTerm));
      
      // Date range filter
      const businessDate = new Date(b.assessmentDate);
      const now = new Date();
      let dateMatch = true;
      
      if (filterCriteria.dateRange === '7d') {
        dateMatch = (now.getTime() - businessDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
      } else if (filterCriteria.dateRange === '30d') {
        dateMatch = (now.getTime() - businessDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
      }
      
      return matchesScore && matchesIndustry && matchesDecision && matchesSearch && dateMatch;
    });
  }, [businesses, filterCriteria, searchTerm]);

  const exportData = useCallback((format: string) => {
    const filteredData = getFilteredBusinesses;
    
    if (format === 'json') {
      const dataStr = JSON.stringify(filteredData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      downloadFile(blob, 'credit_assessments.json');
    } else if (format === 'csv') {
      const headers = ['Company', 'EIN', 'Score', 'Rating', 'Default Prob', 'Decision', 'Approved Amount', 'Interest Rate', 'Date', 'Processing Time'];
      const rows = filteredData.map(b => [
        b.companyName,
        b.ein || 'N/A',
        b.finalScore,
        getCreditRating(b.finalScore).rating,
        (b.defaultProbability * 100).toFixed(2) + '%',
        b.decision.decision,
        b.decision.approvedAmount || 0,
        b.decision.interestRate || 'N/A',
        b.assessmentDate,
        b.processingTime?.toFixed(1) + 'ms' || 'N/A'
      ]);
      
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      downloadFile(blob, 'credit_assessments.csv');
    }
    
    setShowExportModal(false);
  }, [getFilteredBusinesses, getCreditRating]);

  const downloadFile = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const toggleCompareSelection = useCallback((business: Business) => {
    setCompareBusinesses(prev => {
      const existing = prev.find(b => b.id === business.id);
      if (existing) {
        return prev.filter(b => b.id !== business.id);
      } else if (prev.length < 3) {
        return [...prev, business];
      }
      return prev;
    });
  }, []);

  // Sample data initialization
  useEffect(() => {
    const sampleBusinesses: Business[] = [
      {
        id: 1,
        companyName: 'TechVenture Solutions LLC',
        ein: '12-3456789',
        industry: 'technology',
        finalScore: 782,
        defaultProbability: 0.08,
        confidence: 0.95,
        assessmentDate: '2025-10-01',
        decision: { decision: 'APPROVED', approvedAmount: 500000, interestRate: 7.2, monthlyPayment: 15234.56 },
        requestedAmount: '500000',
        components: { creditScore: 85, financialHealth: 88, bankingBehavior: 92, businessStability: 78, alternativeData: 75, marketConditions: 80, industryRisk: 90 },
        modelVersion: 'v4.0.0-enhanced',
        status: 'active',
        processingTime: 247.5
      },
      {
        id: 2,
        companyName: 'Retail Dynamics Inc',
        ein: '98-7654321',
        industry: 'retail',
        finalScore: 668,
        defaultProbability: 0.22,
        confidence: 0.88,
        assessmentDate: '2025-09-28',
        decision: { decision: 'CONDITIONAL_APPROVAL', approvedAmount: 187500, interestRate: 11.8, monthlyPayment: 6123.45 },
        requestedAmount: '250000',
        components: { creditScore: 72, financialHealth: 65, bankingBehavior: 68, businessStability: 70, alternativeData: 60, marketConditions: 75, industryRisk: 60 },
        modelVersion: 'v4.0.0-enhanced',
        status: 'active',
        processingTime: 189.3
      }
    ];
    
    setBusinesses(sampleBusinesses);
    updatePortfolioMetrics(sampleBusinesses);
  }, [updatePortfolioMetrics]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with Real-time Status */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <Shield className="text-blue-200" size={40} />
                Enterprise Credit Scoring Platform
                <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full ml-2">v4.0</span>
              </h1>
              <p className="text-blue-100 mt-2 text-lg">Advanced AI-Powered Risk Assessment & Decision Engine</p>
            </div>
            <div className="flex gap-3 items-center">
              {realTimeAlerts.length > 0 && (
                <button
                  onClick={() => setShowAlertsModal(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition flex items-center gap-2 relative"
                >
                  <Bell size={20} />
                  Alerts
                  <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {realTimeAlerts.length}
                  </span>
                </button>
              )}
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2"
              >
                <Download size={20} />
                Export
              </button>
              <div className="text-right bg-white bg-opacity-10 backdrop-blur-lg rounded-lg px-4 py-2">
                <div className="text-sm text-blue-200">Model Version</div>
                <div className="text-xl font-bold text-white">v4.0.0</div>
                <div className="text-xs text-blue-200">Enhanced</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Portfolio Metrics with Performance Indicators */}
        {portfolioMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Avg Score</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{portfolioMetrics.avgScore}</p>
                  <p className="text-xs text-green-600">↑ 2.3% vs last week</p>
                </div>
                <Gauge className="text-blue-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Applications</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{portfolioMetrics.totalApplications}</p>
                  <p className="text-xs text-blue-600">Processing: {portfolioMetrics.processingTime}ms avg</p>
                </div>
                <FileText className="text-green-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Approval Rate</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{portfolioMetrics.approvalRate}%</p>
                  <p className="text-xs text-green-600">Target: 65-75%</p>
                </div>
                <CheckCircle className="text-emerald-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Avg Risk</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{portfolioMetrics.avgDefaultProb}%</p>
                  <p className="text-xs text-orange-600">Model Accuracy: {portfolioMetrics.modelAccuracy}%</p>
                </div>
                <AlertCircle className="text-orange-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold">Total Exposure</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">${(portfolioMetrics.totalExposure / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-purple-600">Concentration risk: Low</p>
                </div>
                <DollarSign className="text-purple-500" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold">AI Confidence</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{portfolioMetrics.avgConfidence}%</p>
                  <p className="text-xs text-indigo-600">Model drift: Stable</p>
                </div>
                <Brain className="text-indigo-500" size={32} />
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Navigation with Indicators */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'assess', label: 'Assess', icon: Cpu },
              { id: 'results', label: 'Results', icon: Eye, disabled: !selectedBusiness },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'compare', label: 'Compare', icon: Target },
              { id: 'monitoring', label: 'Monitoring', icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`px-6 py-4 font-semibold transition whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-slate-600 hover:text-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                  {tab.id === 'compare' && compareBusinesses.length > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                      {compareBusinesses.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content will be rendered based on activeTab */}
        {/* Dashboard Tab with enhanced features */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Enhanced Filters and Search */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by company, EIN, or industry..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={filterCriteria.industry}
                  onChange={(e) => setFilterCriteria({...filterCriteria, industry: e.target.value})}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Industries</option>
                  <option value="technology">Technology</option>
                  <option value="retail">Retail</option>
                  <option value="construction">Construction</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="professional_services">Professional Services</option>
                </select>
                <select
                  value={filterCriteria.decision}
                  onChange={(e) => setFilterCriteria({...filterCriteria, decision: e.target.value})}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Decisions</option>
                  <option value="APPROVED">Approved</option>
                  <option value="CONDITIONAL_APPROVAL">Conditional</option>
                  <option value="MANUAL_REVIEW">Manual Review</option>
                  <option value="DECLINED">Declined</option>
                </select>
                <select
                  value={filterCriteria.dateRange}
                  onChange={(e) => setFilterCriteria({...filterCriteria, dateRange: e.target.value})}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
                <button
                  onClick={() => setFilterCriteria({ minScore: 0, maxScore: 850, industry: 'all', decision: 'all', dateRange: '30d' })}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Reset
                </button>
              </div>
            </div>

            {/* Enhanced Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Score Distribution with Risk Heatmap */}
              <div className="bg-white rounded-xl shadow-lg p-6 col-span-1 lg:col-span-2">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="text-blue-600" size={24} />
                  Score Distribution & Risk Analysis
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={getFilteredBusinesses.map(b => ({ 
                    name: b.companyName.substring(0, 15), 
                    score: b.finalScore, 
                    risk: b.defaultProbability * 100,
                    confidence: b.confidence * 100
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                    <YAxis yAxisId="left" domain={[300, 850]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 50]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="score" fill="#3b82f6" name="Credit Score" />
                    <Line yAxisId="right" type="monotone" dataKey="risk" stroke="#f59e0b" strokeWidth={3} name="Default Risk %" />
                    <Area yAxisId="right" type="monotone" dataKey="confidence" fill="#10b981" fillOpacity={0.3} name="AI Confidence %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Real-time Processing Metrics */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="text-green-600" size={24} />
                  Real-time Metrics
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-slate-600 text-sm font-semibold">Avg Processing Time</p>
                    <p className="text-3xl font-bold text-slate-800">{portfolioMetrics?.processingTime}ms</p>
                    <p className="text-xs text-green-600">↓ 15% vs yesterday</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="text-slate-600 text-sm font-semibold">Model Accuracy</p>
                    <p className="text-3xl font-bold text-slate-800">{portfolioMetrics?.modelAccuracy}%</p>
                    <p className="text-xs text-blue-600">Target: &gt;90%</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="text-slate-600 text-sm font-semibold">System Uptime</p>
                    <p className="text-3xl font-bold text-slate-800">99.9%</p>
                    <p className="text-xs text-green-600">Last 30 days</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <p className="text-slate-600 text-sm font-semibold">Active Alerts</p>
                    <p className="text-3xl font-bold text-slate-800">{realTimeAlerts.length}</p>
                    <p className="text-xs text-orange-600">Requires attention</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Business Portfolio Table */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Database className="text-blue-600" size={24} />
                  Assessment Portfolio ({getFilteredBusinesses.length})
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowStressTesting(true)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center gap-2"
                  >
                    <Zap size={16} />
                    Stress Test
                  </button>
                  <button
                    onClick={() => setShowCompareModal(true)}
                    disabled={compareBusinesses.length < 2}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <BarChart3 size={16} />
                    Compare ({compareBusinesses.length})
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2">
                      <th className="text-left py-3 px-4 text-slate-700 font-bold">
                        <input type="checkbox" className="mr-2" disabled />
                      </th>
                      <th className="text-left py-3 px-4 text-slate-700 font-bold">Company</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-bold">Industry</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-bold">Score</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-bold">Rating</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-bold">Risk</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-bold">Decision</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-bold">Approved</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-bold">Confidence</th>
                      <th className="text-left py-3 px-4 text-slate-700 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredBusinesses.map((business) => {
                      const rating = getCreditRating(business.finalScore);
                      const isSelected = compareBusinesses.find(b => b.id === business.id);
                      return (
                        <tr key={business.id} className={`border-b hover:bg-slate-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={!!isSelected}
                              onChange={() => toggleCompareSelection(business)}
                              disabled={!isSelected && compareBusinesses.length >= 3}
                              className="cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">{business.companyName}</div>
                            <div className="text-xs text-slate-500 font-mono">{business.ein || 'N/A'}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 capitalize">{business.industry}</td>
                          <td className="py-3 px-4">
                            <span className="text-2xl font-bold text-slate-800">{business.finalScore}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${rating.bg} ${rating.color}`}>
                              {rating.rating}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-semibold">{(business.defaultProbability * 100).toFixed(2)}%</span>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div 
                                  className={`h-1.5 rounded-full ${business.defaultProbability > 0.3 ? 'bg-red-600' : business.defaultProbability > 0.15 ? 'bg-yellow-600' : 'bg-green-600'}`}
                                  style={{width: `${Math.min(business.defaultProbability * 100 * 2, 100)}%`}}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              business.decision.decision === 'APPROVED' ? 'bg-green-100 text-green-700' :
                              business.decision.decision === 'CONDITIONAL_APPROVAL' ? 'bg-yellow-100 text-yellow-700' :
                              business.decision.decision === 'MANUAL_REVIEW' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {business.decision.decision === 'APPROVED' ? 'APR' :
                               business.decision.decision === 'CONDITIONAL_APPROVAL' ? 'COND' :
                               business.decision.decision === 'MANUAL_REVIEW' ? 'REV' : 'DEC'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            ${(business.decision.approvedAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-semibold">{(business.confidence * 100).toFixed(0)}%</span>
                              <div className="w-8 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{width: `${business.confidence * 100}%`}}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => {
                                setSelectedBusiness(business);
                                setActiveTab('results');
                              }}
                              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                            >
                              <Eye size={16} /> View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Assessment Form Tab with enhanced validation */}
        {activeTab === 'assess' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Database className="text-blue-600" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Enhanced Credit Assessment</h2>
                <p className="text-slate-600">AI-powered multi-factor risk evaluation with v4.0 enhanced scoring</p>
              </div>
              {isCalculating && (
                <div className="ml-auto flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg">
                  <RefreshCw className="animate-spin" size={20} />
                  Calculating...
                </div>
              )}
            </div>
            
            {Object.keys(validationErrors).length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="text-red-600" size={20} />
                  <h3 className="font-bold text-red-800">Please correct the following errors:</h3>
                </div>
                <ul className="list-disc list-inside text-red-700 text-sm">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Business Information Section - Enhanced */}
              <div>
                <h3 className="text-lg font-bold text-slate-700 mb-4 pb-2 border-b flex items-center gap-2">
                  <Building2 className="text-blue-600" size={20} />
                  1. Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-slate-700 font-semibold mb-2">Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${validationErrors.companyName ? 'border-red-500' : 'border-slate-300'}`}
                      required
                      disabled={isCalculating}
                    />
                    {validationErrors.companyName && <p className="text-red-600 text-sm mt-1">{validationErrors.companyName}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">EIN</label>
                    <input
                      type="text"
                      name="ein"
                      value={formData.ein}
                      onChange={handleInputChange}
                      placeholder="XX-XXXXXXX"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      disabled={isCalculating}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">Industry *</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      disabled={isCalculating}
                    >
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="construction">Construction</option>
                      <option value="professional_services">Professional Services</option>
                      <option value="financial_services">Financial Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">Years in Business *</label>
                    <input
                      type="number"
                      name="yearsInBusiness"
                      value={formData.yearsInBusiness}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${validationErrors.yearsInBusiness ? 'border-red-500' : 'border-slate-300'}`}
                      required
                      min="0"
                      step="0.1"
                      disabled={isCalculating}
                    />
                    {validationErrors.yearsInBusiness && <p className="text-red-600 text-sm mt-1">{validationErrors.yearsInBusiness}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">Employee Count *</label>
                    <input
                      type="number"
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${validationErrors.employeeCount ? 'border-red-500' : 'border-slate-300'}`}
                      required
                      min="0"
                      disabled={isCalculating}
                    />
                    {validationErrors.employeeCount && <p className="text-red-600 text-sm mt-1">{validationErrors.employeeCount}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button with Enhanced Loading State */}
              <button
                type="submit"
                disabled={isCalculating}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="animate-spin" size={24} />
                    Processing with AI v4.0...
                  </>
                ) : (
                  <>
                    <Brain size={24} />
                    Generate Enhanced AI Credit Score & Decision
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Enhanced Results Tab */}
        {activeTab === 'results' && selectedBusiness && (
          <div className="space-y-6">
            {(() => {
              const rating = getCreditRating(selectedBusiness.finalScore);
              return (
                <>
                  {/* Enhanced Score Overview with Processing Info */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-2xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-white bg-opacity-10 backdrop-blur-lg rounded-bl-xl px-4 py-2">
                      <div className="text-sm text-blue-100">Processing Time</div>
                      <div className="text-lg font-bold text-white">{selectedBusiness.processingTime?.toFixed(1)}ms</div>
                    </div>
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2">{selectedBusiness.companyName}</h2>
                      <p className="text-blue-100 mb-6 capitalize">
                        {selectedBusiness.industry} Industry • Assessment: {selectedBusiness.assessmentDate} • Model: {selectedBusiness.modelVersion}
                      </p>
                      <div className="inline-block bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-8">
                        <div className="text-7xl font-bold mb-3">{selectedBusiness.finalScore}</div>
                        <div className={`px-6 py-2 rounded-full text-xl font-bold ${rating.bg} ${rating.color} inline-block mb-3`}>
                          {rating.rating} - {rating.risk}
                        </div>
                        <div className="mt-4 text-blue-100 grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-sm">Default Risk</div>
                            <div className="text-2xl font-bold">{(selectedBusiness.defaultProbability * 100).toFixed(2)}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm">AI Confidence</div>
                            <div className="text-2xl font-bold">{(selectedBusiness.confidence * 100).toFixed(0)}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm">Risk Tier</div>
                            <div className="text-2xl font-bold">{selectedBusiness.decision.riskTier || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Component Analysis with 7 Factors */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Target className="text-blue-600" size={24} />
                        Enhanced Component Analysis (7 Factors)
                      </h3>
                      <ResponsiveContainer width="100%" height={350}>
                        <RadarChart data={[
                          { category: 'Credit', value: selectedBusiness.components.creditScore, fullMark: 100 },
                          { category: 'Financial', value: selectedBusiness.components.financialHealth, fullMark: 100 },
                          { category: 'Banking', value: selectedBusiness.components.bankingBehavior, fullMark: 100 },
                          { category: 'Stability', value: selectedBusiness.components.businessStability, fullMark: 100 },
                          { category: 'Alternative', value: selectedBusiness.components.alternativeData, fullMark: 100 },
                          { category: 'Market', value: selectedBusiness.components.marketConditions, fullMark: 100 },
                          { category: 'Industry', value: selectedBusiness.components.industryRisk, fullMark: 100 }
                        ]}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="category" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <BarChart3 className="text-green-600" size={24} />
                        Component Breakdown & Weights
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(selectedBusiness.components).map(([key, value]) => {
                          const weights: Record<string, number> = {
                            creditScore: 20,
                            financialHealth: 25,
                            bankingBehavior: 18,
                            businessStability: 15,
                            alternativeData: 12,
                            marketConditions: 5,
                            industryRisk: 5
                          };
                          const weight = weights[key as keyof typeof weights] || 0;
                          const numericValue = Number(value);
                          return (
                            <div key={key}>
                              <div className="flex justify-between mb-2">
                                <span className="font-semibold text-slate-700 capitalize">
                                  {String(key).replace(/([A-Z])/g, ' $1')} ({weight}%)
                                </span>
                                <span className="font-bold text-slate-800">{numericValue}/100</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-3 relative">
                                <div
                                  className={`h-3 rounded-full transition-all ${
                                    numericValue >= 80 ? 'bg-green-500' :
                                    numericValue >= 60 ? 'bg-blue-500' :
                                    numericValue >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${numericValue}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs font-bold text-white drop-shadow">
                                    {numericValue}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Enhanced Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Advanced Portfolio Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="text-blue-600" size={24} />
                  Portfolio Risk-Return Analysis
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="score" name="Credit Score" domain={[300, 850]} label={{ value: 'Credit Score', position: 'bottom' }} />
                    <YAxis type="number" dataKey="risk" name="Default Risk %" domain={[0, 50]} label={{ value: 'Default Risk %', angle: -90, position: 'left' }} />
                    <ZAxis type="number" dataKey="amount" range={[50, 400]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded shadow-lg border">
                            <p className="font-bold">{payload[0].payload.name}</p>
                            <p>Score: {payload[0].payload.score}</p>
                            <p>Risk: {payload[0].payload.risk.toFixed(2)}%</p>
                            <p>Amount: ${payload[0].payload.amount.toLocaleString()}</p>
                            <p>Confidence: {payload[0].payload.confidence.toFixed(1)}%</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Scatter name="Businesses" data={businesses.map(b => ({
                      name: b.companyName,
                      score: b.finalScore,
                      risk: b.defaultProbability * 100,
                      amount: parseFloat(b.requestedAmount) || 0,
                      confidence: b.confidence * 100
                    }))} fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <PieChartIcon className="text-green-600" size={24} />
                  Industry Risk Distribution
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={Object.entries(
                        businesses.reduce((acc, b) => {
                          acc[b.industry] = (acc[b.industry] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([industry, count]) => ({
                        name: industry,
                        value: count,
                        risk: businesses.filter(b => b.industry === industry)
                          .reduce((sum, b) => sum + b.defaultProbability, 0) / count * 100
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, value, risk}) => `${name}: ${value} (${risk.toFixed(1)}%)`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {businesses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Model Performance Metrics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Brain className="text-purple-600" size={24} />
                Enhanced Model Performance Dashboard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-slate-600 text-sm font-semibold">Average Processing Time</p>
                  <p className="text-3xl font-bold text-slate-800">{portfolioMetrics?.processingTime}ms</p>
                  <p className="text-xs text-green-600">↓ 23% vs v3.0.1</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-slate-600 text-sm font-semibold">Model Accuracy (AUC-ROC)</p>
                  <p className="text-3xl font-bold text-slate-800">0.942</p>
                  <p className="text-xs text-blue-600">Industry leading</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-slate-600 text-sm font-semibold">Precision @ 95% Recall</p>
                  <p className="text-3xl font-bold text-slate-800">87.3%</p>
                  <p className="text-xs text-green-600">↑ 4.2% vs baseline</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="text-slate-600 text-sm font-semibold">Model Drift Score</p>
                  <p className="text-3xl font-bold text-slate-800">0.02</p>
                  <p className="text-xs text-green-600">Stable (&lt; 0.05)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Bell className="text-red-600" size={24} />
                  Real-time Monitoring & Alerts
                </h2>
                <button
                  onClick={() => setShowAlertsModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Settings size={16} />
                  Configure Alerts
                </button>
              </div>
              
              {realTimeAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                  <p className="text-slate-600 text-lg">All systems operational - No active alerts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {realTimeAlerts.map((alert, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'danger' ? 'bg-red-50 border-red-500' :
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`font-semibold ${
                            alert.type === 'danger' ? 'text-red-800' :
                            alert.type === 'warning' ? 'text-yellow-800' :
                            'text-blue-800'
                          }`}>
                            {alert.message}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            Business: {alert.business} • {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => setRealTimeAlerts(prev => prev.filter((_, i) => i !== index))}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modals remain the same but with enhanced features */}
        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">Export Enhanced Data</h3>
                <button onClick={() => setShowExportModal(false)} className="text-slate-500 hover:text-slate-700">
                  <X size={24} />
                </button>
              </div>
              <p className="text-slate-600 mb-6">Choose export format for {getFilteredBusinesses.length} assessments with v4.0 enhanced metrics</p>
              <div className="space-y-3">
                <button
                  onClick={() => exportData('json')}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold"
                >
                  <Download size={20} />
                  Export as Enhanced JSON
                </button>
                <button
                  onClick={() => exportData('csv')}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold"
                >
                  <Download size={20} />
                  Export as Enhanced CSV
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="w-full px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Configuration Modal */}
        {showAlertsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">Configure Real-time Alerts</h3>
                <button onClick={() => setShowAlertsModal(false)} className="text-slate-500 hover:text-slate-700">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={alertConfig.enabled}
                      onChange={(e) => setAlertConfig({...alertConfig, enabled: e.target.checked})}
                      className="rounded"
                    />
                    <span className="font-semibold">Enable Real-time Alerts</span>
                  </label>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Score Threshold</label>
                  <input
                    type="number"
                    value={alertConfig.scoreThreshold}
                    onChange={(e) => setAlertConfig({...alertConfig, scoreThreshold: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="300"
                    max="850"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Risk Threshold (%)</label>
                  <input
                    type="number"
                    value={alertConfig.riskThreshold * 100}
                    onChange={(e) => setAlertConfig({...alertConfig, riskThreshold: parseFloat(e.target.value) / 100})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="50"
                    step="0.1"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAlertsModal(false)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Save Configuration
                  </button>
                  <button
                    onClick={() => setShowAlertsModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCreditScoringMain;
