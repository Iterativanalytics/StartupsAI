import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, ScatterChart, Scatter, ZAxis, ComposedChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Building2, DollarSign, Calendar, Users, Shield, Database, Cpu, FileText, Eye, Activity, Download, Upload, RefreshCw, Filter, Search, BarChart3, PieChart as PieChartIcon, Settings, Info, ChevronDown, ChevronUp, X, Plus, Zap, Brain, Target, Star, Award, Clock, Globe, Lock, Unlock, Lightbulb, Rocket } from 'lucide-react';
import { getIndustryMultiplier, getIndustryRiskAdjustment, getIndustryRateAdjustment } from '@/utils/creditScoringUtils';

// Enhanced interfaces for better type safety
interface EnhancedCreditData {
  companyName: string;
  ein: string;
  industry: string;
  yearsInBusiness: number;
  employeeCount: number;
  annualRevenue: number;
  totalDebt: number;
  currentAssets: number;
  currentLiabilities: number;
  accountsReceivable: number;
  accountsPayable: number;
  cashBalance: number;
  avgDailyBalance3mo: number;
  overdrafts12mo: number;
  nsfIncidents: number;
  depositConsistency: number;
  personalFicoScore: number;
  businessCreditScore: number;
  paymentHistoryScore: number;
  creditUtilization: number;
  hardInquiries: number;
  derogatoryMarks: number;
  monthlyTraffic: number;
  socialFollowers: number;
  onlineReviewScore: number;
  customerCount: number;
  customerRetention: number;
  churnRate: number;
  ltvCacRatio: number;
  revenueGrowthRate: number;
  requestedAmount: number;
  requestedTerm: number;
  loanPurpose: string;
}

interface EnhancedScoreResult {
  finalScore: number;
  defaultProbability: number;
  confidence: number;
  components: {
    creditScore: number;
    financialHealth: number;
    bankingBehavior: number;
    businessStability: number;
    alternativeData: number;
    marketConditions: number;
    industryRisk: number;
  };
  featureImportance: Record<string, number>;
  contributions: Record<string, number>;
  metrics: Record<string, string>;
  riskFactors: RiskFactor[];
  strengths: Strength[];
  decision: LendingDecision;
  modelVersion: string;
  assessmentDate: string;
  processingTime: number;
}

interface RiskFactor {
  severity: 'low' | 'medium' | 'high' | 'critical';
  factor: string;
  impact: number;
  category: string;
  mitigation?: string;
}

interface Strength {
  factor: string;
  impact: number;
  category: string;
  description?: string;
}

interface LendingDecision {
  decision: 'APPROVED' | 'CONDITIONAL_APPROVAL' | 'MANUAL_REVIEW' | 'DECLINED';
  approvedAmount: number;
  interestRate: number;
  monthlyPayment: number;
  conditions: string[];
  reasoning: string;
  recommendedActions: string[];
  riskTier: number;
  confidence: number;
}

// Enhanced ML-based scoring algorithm with advanced features
class EnhancedCreditScorer {
  private static readonly MODEL_VERSION = 'v4.0.0-enhanced';
  private static readonly FEATURE_WEIGHTS = {
    creditScore: 0.20,
    financialHealth: 0.25,
    bankingBehavior: 0.18,
    businessStability: 0.15,
    alternativeData: 0.12,
    marketConditions: 0.05,
    industryRisk: 0.05
  };

  static calculateAdvancedScore(data: EnhancedCreditData): EnhancedScoreResult {
    const startTime = performance.now();
    
    // 1. ENHANCED CREDIT SCORING (20%)
    const creditScore = this.calculateCreditScore(data);
    
    // 2. FINANCIAL HEALTH ANALYSIS (25%)
    const financialHealth = this.calculateFinancialHealth(data);
    
    // 3. BANKING BEHAVIOR ANALYSIS (18%)
    const bankingBehavior = this.calculateBankingBehavior(data);
    
    // 4. BUSINESS STABILITY ASSESSMENT (15%)
    const businessStability = this.calculateBusinessStability(data);
    
    // 5. ALTERNATIVE DATA INTEGRATION (12%)
    const alternativeData = this.calculateAlternativeData(data);
    
    // 6. MARKET CONDITIONS (5%)
    const marketConditions = this.calculateMarketConditions(data);
    
    // 7. INDUSTRY RISK ASSESSMENT (5%)
    const industryRisk = this.calculateIndustryRisk(data);
    
    // Weighted ensemble score
    const components = {
      creditScore,
      financialHealth,
      bankingBehavior,
      businessStability,
      alternativeData,
      marketConditions,
      industryRisk
    };
    
    const weightedScore = Object.keys(this.FEATURE_WEIGHTS).reduce((sum, key) => 
      sum + (components[key as keyof typeof components] * this.FEATURE_WEIGHTS[key as keyof typeof this.FEATURE_WEIGHTS]), 0
    );
    
    // Convert to 300-850 scale with enhanced normalization
    const finalScore = Math.round(300 + (weightedScore / 100) * 550);
    
    // Enhanced default probability calculation using logistic regression
    const defaultProb = this.calculateDefaultProbability(finalScore, data);
    
    // Calculate confidence based on data completeness and quality
    const confidence = this.calculateConfidence(data, components);
    
    // Generate feature importance and contributions
    const featureImportance = { ...this.FEATURE_WEIGHTS };
    const contributions = this.calculateContributions(components, this.FEATURE_WEIGHTS);
    
    // Calculate key financial metrics
    const metrics = this.calculateFinancialMetrics(data);
    
    // Identify risk factors and strengths
    const riskFactors = this.identifyRiskFactors(data, components);
    const strengths = this.identifyStrengths(data, components);
    
    // Make lending decision
    const decision = this.makeLendingDecision(finalScore, defaultProb, data, confidence);
    
    const processingTime = performance.now() - startTime;
    
    return {
      finalScore: Math.min(Math.max(finalScore, 300), 850),
      defaultProbability: defaultProb,
      confidence,
      components,
      featureImportance,
      contributions,
      metrics: this.calculateFinancialMetrics(data),
      riskFactors,
      strengths,
      decision,
      modelVersion: this.MODEL_VERSION,
      assessmentDate: new Date().toISOString().split('T')[0],
      processingTime
    };
  }

  private static calculateCreditScore(data: EnhancedCreditData): number {
    const personalFico = data.personalFicoScore || 0;
    const businessCredit = data.businessCreditScore || 0;
    const paymentHistory = data.paymentHistoryScore || 0;
    const utilization = data.creditUtilization || 0;
    const derogatory = data.derogatoryMarks || 0;
    const inquiries = data.hardInquiries || 0;
    
    // Enhanced credit scoring with non-linear relationships
    const ficoScore = Math.min(100, (personalFico / 850) * 100);
    const businessScore = Math.min(100, (businessCredit / 100) * 100);
    const paymentScore = paymentHistory;
    const utilizationScore = Math.max(0, 100 - (utilization * 1.5));
    const derogatoryPenalty = derogatory * 8;
    const inquiryPenalty = Math.min(inquiries * 2, 10);
    
    return Math.max(0, Math.min(100,
      ficoScore * 0.35 +
      businessScore * 0.25 +
      paymentScore * 0.25 +
      utilizationScore * 0.10 -
      derogatoryPenalty -
      inquiryPenalty
    ));
  }

  private static calculateFinancialHealth(data: EnhancedCreditData): number {
    const revenue = data.annualRevenue || 0;
    const assets = data.currentAssets || 0;
    const liabilities = data.currentLiabilities || 0;
    const debt = data.totalDebt || 0;
    const cash = data.cashBalance || 0;
    const ar = data.accountsReceivable || 0;
    
    // Enhanced financial ratios
    const currentRatio = liabilities > 0 ? assets / liabilities : 1;
    const quickRatio = liabilities > 0 ? (assets - ar) / liabilities : 1;
    const debtToRevenue = revenue > 0 ? debt / revenue : 1;
    const cashToLiabilities = liabilities > 0 ? cash / liabilities : 0.5;
    const debtToAssets = assets > 0 ? debt / assets : 1;
    
    // Non-linear scoring for better risk differentiation
    const currentRatioScore = Math.min(100, (currentRatio / 2.5) * 100);
    const quickRatioScore = Math.min(100, (quickRatio / 1.5) * 100);
    const debtScore = Math.max(0, 100 - (debtToRevenue * 50));
    const cashScore = Math.min(100, cashToLiabilities * 100);
    const leverageScore = Math.max(0, 100 - (debtToAssets * 100));
    
    return Math.max(0, Math.min(100,
      currentRatioScore * 0.25 +
      quickRatioScore * 0.20 +
      debtScore * 0.25 +
      cashScore * 0.20 +
      leverageScore * 0.10
    ));
  }

  private static calculateBankingBehavior(data: EnhancedCreditData): number {
    const avgBalance = data.avgDailyBalance3mo || 0;
    const overdrafts = data.overdrafts12mo || 0;
    const nsf = data.nsfIncidents || 0;
    const depositConsist = data.depositConsistency || 0;
    const revenue = data.annualRevenue || 0;
    
    // Enhanced banking behavior analysis
    const balanceScore = Math.min(100, (avgBalance / (revenue / 12)) * 100);
    const overdraftPenalty = overdrafts * 8;
    const nsfPenalty = nsf * 15;
    const consistencyScore = depositConsist;
    
    // Cash flow stability bonus
    const cashFlowStability = depositConsist > 90 ? 10 : 0;
    
    return Math.max(0, Math.min(100,
      balanceScore * 0.30 +
      consistencyScore * 0.40 -
      overdraftPenalty -
      nsfPenalty +
      cashFlowStability
    ));
  }

  private static calculateBusinessStability(data: EnhancedCreditData): number {
    const years = data.yearsInBusiness || 0;
    const employees = data.employeeCount || 0;
    const revenue = data.annualRevenue || 0;
    const revenueGrowth = data.revenueGrowthRate || 0;
    
    // Enhanced business stability scoring
    const yearsScore = Math.min(100, years * 8);
    const sizeScore = Math.min(100, Math.log(employees + 1) * 15);
    const revenuePerEmp = employees > 0 ? revenue / employees : 0;
    const efficiencyScore = revenuePerEmp > 100000 ? 30 : revenuePerEmp > 75000 ? 20 : 10;
    const growthScore = Math.min(50, revenueGrowth);
    
    return Math.max(0, Math.min(100,
      yearsScore * 0.40 +
      sizeScore * 0.25 +
      efficiencyScore * 0.25 +
      growthScore * 0.10
    ));
  }

  private static calculateAlternativeData(data: EnhancedCreditData): number {
    const traffic = data.monthlyTraffic || 0;
    const social = data.socialFollowers || 0;
    const reviews = data.onlineReviewScore || 0;
    const retention = data.customerRetention || 0;
    const ltvcac = data.ltvCacRatio || 0;
    const churn = data.churnRate || 0;
    
    // Enhanced alternative data scoring
    const digitalPresence = Math.min(100, 
      (Math.log(traffic + 1) / Math.log(100000) * 100) * 0.3 +
      (Math.log(social + 1) / Math.log(50000) * 100) * 0.2
    );
    
    const customerQuality = Math.min(100,
      (reviews / 5 * 100) * 0.3 +
      retention * 0.4 +
      (Math.min(ltvcac, 5) / 5 * 100) * 0.2 +
      (100 - churn) * 0.1
    );
    
    return Math.max(0, Math.min(100,
      digitalPresence * 0.4 +
      customerQuality * 0.6
    ));
  }

  private static calculateMarketConditions(data: EnhancedCreditData): number {
    // Simulate market conditions (in real implementation, this would use external APIs)
    const baseScore = 75; // Base market conditions
    const industryMultiplier = this.getIndustryMultiplier(data.industry);
    
    return Math.max(0, Math.min(100, baseScore * industryMultiplier));
  }

  private static calculateIndustryRisk(data: EnhancedCreditData): number {
    const industryRiskMap: Record<string, number> = {
      'technology': 0.9,
      'healthcare': 0.8,
      'manufacturing': 0.7,
      'retail': 0.6,
      'hospitality': 0.5,
      'construction': 0.4,
      'professional_services': 0.8,
      'financial_services': 0.7
    };
    
    return (industryRiskMap[data.industry] || 0.5) * 100;
  }

  private static calculateDefaultProbability(score: number, data: EnhancedCreditData): number {
    // Enhanced logistic regression for default probability
    const z = (score - 600) / 100;
    const prob = 1 / (1 + Math.exp(z));
    
    // Adjust for industry and size factors
    const industryAdjustment = this.getIndustryRiskAdjustment(data.industry);
    const sizeAdjustment = data.employeeCount > 50 ? 0.8 : 1.0;
    
    return Math.max(0.001, Math.min(0.5, prob * industryAdjustment * sizeAdjustment));
  }

  private static calculateConfidence(data: EnhancedCreditData, components: any): number {
    let completeness = 0;
    let totalFields = 0;
    
    // Check data completeness
    const requiredFields = ['companyName', 'annualRevenue', 'currentAssets', 'currentLiabilities', 'personalFicoScore'];
    const optionalFields = ['monthlyTraffic', 'socialFollowers', 'customerCount'];
    
    requiredFields.forEach(field => {
      totalFields++;
      if (data[field as keyof EnhancedCreditData]) completeness++;
    });
    
    optionalFields.forEach(field => {
      totalFields++;
      if (data[field as keyof EnhancedCreditData]) completeness++;
    });
    
    const dataCompleteness = completeness / totalFields;
    
    // Check component consistency
    const componentVariance = this.calculateComponentVariance(components);
    const consistencyScore = Math.max(0, 1 - componentVariance);
    
    return Math.max(0.5, Math.min(1.0, (dataCompleteness * 0.7 + consistencyScore * 0.3)));
  }

  private static calculateContributions(components: any, weights: any): Record<string, number> {
    const contributions: Record<string, number> = {};
    Object.keys(components).forEach(key => {
      contributions[key] = ((components[key] - 50) / 50) * weights[key] * 100;
    });
    return contributions;
  }

  private static calculateFinancialMetrics(data: EnhancedCreditData): Record<string, string> {
    const assets = data.currentAssets || 0;
    const liabilities = data.currentLiabilities || 0;
    const revenue = data.annualRevenue || 0;
    const debt = data.totalDebt || 0;
    const employees = data.employeeCount || 1;
    
    return {
      currentRatio: (assets / Math.max(liabilities, 1)).toFixed(2),
      debtToRevenue: ((debt / Math.max(revenue, 1)) * 100).toFixed(1) + '%',
      revenuePerEmployee: Math.round(revenue / employees).toLocaleString(),
      cashRunway: Math.round((data.cashBalance || 0) / Math.max(revenue / 12, 1)).toString(),
      workingCapital: (assets - liabilities).toLocaleString()
    };
  }

  private static identifyRiskFactors(data: EnhancedCreditData, components: any): RiskFactor[] {
    const risks: RiskFactor[] = [];
    
    if (components.creditScore < 60) {
      risks.push({
        severity: 'high',
        factor: 'Poor credit history',
        impact: -20,
        category: 'Credit',
        mitigation: 'Improve payment history and reduce credit utilization'
      });
    }
    
    if (data.creditUtilization > 70) {
      risks.push({
        severity: 'high',
        factor: 'High credit utilization',
        impact: -15,
        category: 'Credit',
        mitigation: 'Pay down credit balances to below 30%'
      });
    }
    
    if (components.financialHealth < 50) {
      risks.push({
        severity: 'high',
        factor: 'Weak financial position',
        impact: -25,
        category: 'Financial',
        mitigation: 'Improve cash flow and reduce debt burden'
      });
    }
    
    if (data.yearsInBusiness < 2) {
      risks.push({
        severity: 'medium',
        factor: 'Limited operating history',
        impact: -12,
        category: 'Stability',
        mitigation: 'Build longer track record of operations'
      });
    }
    
    return risks.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  }

  private static identifyStrengths(data: EnhancedCreditData, components: any): Strength[] {
    const strengths: Strength[] = [];
    
    if (components.creditScore > 80) {
      strengths.push({
        factor: 'Excellent credit history',
        impact: +20,
        category: 'Credit',
        description: 'Strong payment history and credit management'
      });
    }
    
    if (data.yearsInBusiness > 5) {
      strengths.push({
        factor: 'Established business',
        impact: +15,
        category: 'Stability',
        description: 'Proven track record of operations'
      });
    }
    
    if (components.financialHealth > 80) {
      strengths.push({
        factor: 'Strong financial position',
        impact: +25,
        category: 'Financial',
        description: 'Healthy financial ratios and cash flow'
      });
    }
    
    if (data.customerRetention > 90) {
      strengths.push({
        factor: 'High customer loyalty',
        impact: +10,
        category: 'Business',
        description: 'Strong customer relationships and retention'
      });
    }
    
    return strengths.sort((a, b) => b.impact - a.impact);
  }

  private static makeLendingDecision(score: number, defaultProb: number, data: EnhancedCreditData, confidence: number): LendingDecision {
    const amount = data.requestedAmount || 0;
    const revenue = data.annualRevenue || 0;
    
    // Enhanced decision logic with confidence weighting
    const confidenceAdjustedScore = score * confidence;
    
    if (confidenceAdjustedScore >= 750 && defaultProb < 0.08 && amount <= revenue * 0.6) {
      return {
        decision: 'APPROVED',
        approvedAmount: amount,
        interestRate: this.calculateInterestRate(defaultProb, data),
        monthlyPayment: this.calculateMonthlyPayment(amount, this.calculateInterestRate(defaultProb, data), data.requestedTerm),
        conditions: ['Standard terms apply', 'Quarterly financial reporting'],
        reasoning: 'Excellent credit profile with low default risk and high confidence',
        recommendedActions: ['Consider higher loan amount if needed', 'Eligible for premium benefits'],
        riskTier: 1,
        confidence
      };
    } else if (confidenceAdjustedScore >= 650 && defaultProb < 0.20 && amount <= revenue * 0.4) {
      return {
        decision: 'CONDITIONAL_APPROVAL',
        approvedAmount: amount * 0.8,
        interestRate: this.calculateInterestRate(defaultProb, data) + 2,
        monthlyPayment: this.calculateMonthlyPayment(amount * 0.8, this.calculateInterestRate(defaultProb, data) + 2, data.requestedTerm),
        conditions: ['Personal guarantee required', 'Monthly financial reporting', 'Maintain minimum cash balance'],
        reasoning: 'Acceptable risk profile with enhanced monitoring requirements',
        recommendedActions: ['Improve credit utilization', 'Build stronger cash reserves'],
        riskTier: 2,
        confidence
      };
    } else if (confidenceAdjustedScore >= 550 && defaultProb < 0.35) {
      return {
        decision: 'MANUAL_REVIEW',
        approvedAmount: 0,
        interestRate: 0,
        monthlyPayment: 0,
        conditions: ['Underwriter review required', 'Additional documentation needed'],
        reasoning: 'Outside automated decision parameters - human review needed',
        recommendedActions: ['Prepare detailed business plan', 'Gather additional financial statements'],
        riskTier: 3,
        confidence
      };
    } else {
      return {
        decision: 'DECLINED',
        approvedAmount: 0,
        interestRate: 0,
        monthlyPayment: 0,
        conditions: this.generateImprovementPlan(score, data),
        reasoning: 'Does not meet minimum lending criteria at this time',
        recommendedActions: ['Focus on improvement plan', 'Reapply in 6-12 months'],
        riskTier: 4,
        confidence
      };
    }
  }

  private static calculateInterestRate(defaultProb: number, data: EnhancedCreditData): number {
    const baseRate = 5.5;
    const riskPremium = defaultProb * 200;
    const termPremium = (data.requestedTerm - 36) / 12 * 0.5;
    const industryAdjustment = this.getIndustryRateAdjustment(data.industry);
    
    return Math.max(6.0, baseRate + riskPremium + termPremium + industryAdjustment);
  }

  private static calculateMonthlyPayment(principal: number, annualRate: number, months: number): number {
    const monthlyRate = annualRate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  }

  private static generateImprovementPlan(score: number, data: EnhancedCreditData): string[] {
    const plan = [];
    
    if (score < 600) {
      plan.push('Priority 1: Improve credit score - pay all bills on time for 6+ months');
      plan.push('Priority 1: Reduce credit utilization below 30%');
    }
    
    if (data.currentAssets < data.currentLiabilities) {
      plan.push('Priority 2: Improve working capital position');
    }
    
    if (data.yearsInBusiness < 2) {
      plan.push('Timeline: Build additional operating history');
    }
    
    return plan.length > 0 ? plan : ['Continue building credit history and financial stability'];
  }

  // Industry adjustment methods now use shared utilities
  private static getIndustryMultiplier = getIndustryMultiplier;
  private static getIndustryRiskAdjustment = getIndustryRiskAdjustment;
  private static getIndustryRateAdjustment = getIndustryRateAdjustment;

  private static calculateComponentVariance(components: any): number {
    const values = Object.values(components) as number[];
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance) / 100;
  }
}

// Export interfaces for use in other components
export type {
  EnhancedCreditData,
  EnhancedScoreResult,
  RiskFactor,
  Strength,
  LendingDecision
};

export default EnhancedCreditScorer;
