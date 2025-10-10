import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useDebounce } from './useDebounce';
import { getCreditRating, matchesDateRange, downloadFile, exportToCSV, exportToJSON } from '@/utils/creditScoringUtils';

export interface CreditAssessment {
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

export interface FilterCriteria {
  minScore: number;
  maxScore: number;
  industry: string;
  decision: string;
  dateRange: string;
}

export interface PortfolioMetrics {
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

/**
 * Enhanced hook for credit scoring operations with caching and performance optimizations
 */
export function useCreditScoring() {
  const [assessments, setAssessments] = useLocalStorage<CreditAssessment[]>('credit_assessments', []);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    minScore: 0,
    maxScore: 850,
    industry: 'all',
    decision: 'all',
    dateRange: '30d'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Debounced search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtered assessments for performance
  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      const matchesScore = assessment.finalScore >= filterCriteria.minScore && 
                          assessment.finalScore <= filterCriteria.maxScore;
      const matchesIndustry = filterCriteria.industry === 'all' || 
                             assessment.industry === filterCriteria.industry;
      const matchesDecision = filterCriteria.decision === 'all' || 
                             assessment.decision.decision === filterCriteria.decision;
      const matchesSearch = debouncedSearchTerm === '' || 
        assessment.companyName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (assessment.ein && assessment.ein.includes(debouncedSearchTerm));
      
      // Date range filter (using shared utility)
      const dateMatch = matchesDateRange(assessment.assessmentDate, filterCriteria.dateRange);
      
      return matchesScore && matchesIndustry && matchesDecision && matchesSearch && dateMatch;
    });
  }, [assessments, filterCriteria, debouncedSearchTerm]);

  // Memoized portfolio metrics
  const portfolioMetrics = useMemo((): PortfolioMetrics | null => {
    if (assessments.length === 0) return null;
    
    const avgScore = assessments.reduce((sum, a) => sum + a.finalScore, 0) / assessments.length;
    const totalExposure = assessments.reduce((sum, a) => {
      const amt = parseFloat(a.requestedAmount) || 0;
      return sum + amt;
    }, 0);
    const avgDefaultProb = assessments.reduce((sum, a) => sum + a.defaultProbability, 0) / assessments.length;
    const avgProcessingTime = assessments.reduce((sum, a) => sum + (a.processingTime || 0), 0) / assessments.length;
    
    const ratingDist = assessments.reduce((acc, a) => {
      const rating = getCreditRating(a.finalScore).rating;
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const decisionDist = assessments.reduce((acc, a) => {
      acc[a.decision.decision] = (acc[a.decision.decision] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      avgScore: Math.round(avgScore),
      totalApplications: assessments.length,
      totalExposure,
      avgDefaultProb: (avgDefaultProb * 100).toFixed(2),
      ratingDistribution: ratingDist,
      decisionDistribution: decisionDist,
      approvalRate: (assessments.filter(a => a.decision.decision === 'APPROVED').length / assessments.length * 100).toFixed(1),
      avgConfidence: ((assessments.reduce((sum, a) => sum + a.confidence, 0) / assessments.length) * 100).toFixed(1),
      processingTime: avgProcessingTime.toFixed(1),
      modelAccuracy: '94.2' // This would come from model validation in production
    };
  }, [assessments]);

  // Credit rating helper function (now using shared utility)
  // getCreditRating is imported from utils

  // Add new assessment
  const addAssessment = useCallback((assessment: CreditAssessment) => {
    setAssessments(prev => [assessment, ...prev]);
  }, [setAssessments]);

  // Update existing assessment
  const updateAssessment = useCallback((id: number, updates: Partial<CreditAssessment>) => {
    setAssessments(prev => 
      prev.map(assessment => 
        assessment.id === id ? { ...assessment, ...updates } : assessment
      )
    );
  }, [setAssessments]);

  // Delete assessment
  const deleteAssessment = useCallback((id: number) => {
    setAssessments(prev => prev.filter(assessment => assessment.id !== id));
  }, [setAssessments]);

  // Clear all assessments
  const clearAllAssessments = useCallback(() => {
    setAssessments([]);
  }, [setAssessments]);

  // Export data (using shared utilities)
  const exportData = useCallback((format: 'json' | 'csv') => {
    const data = filteredAssessments;
    
    if (format === 'json') {
      return exportToJSON(data);
    } else if (format === 'csv') {
      const headers = ['Company', 'EIN', 'Score', 'Rating', 'Default Prob', 'Decision', 'Approved Amount', 'Interest Rate', 'Date', 'Processing Time'];
      const rowMapper = (a: any) => [
        a.companyName,
        a.ein || 'N/A',
        a.finalScore,
        getCreditRating(a.finalScore).rating,
        (a.defaultProbability * 100).toFixed(2) + '%',
        a.decision.decision,
        a.decision.approvedAmount || 0,
        a.decision.interestRate || 'N/A',
        a.assessmentDate,
        a.processingTime?.toFixed(1) + 'ms' || 'N/A'
      ];
      return exportToCSV(data, headers, rowMapper);
    }
    
    throw new Error('Unsupported export format');
  }, [filteredAssessments]);

  // Download file helper (now using shared utility)
  // downloadFile is imported from utils

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilterCriteria({
      minScore: 0,
      maxScore: 850,
      industry: 'all',
      decision: 'all',
      dateRange: '30d'
    });
    setSearchTerm('');
  }, []);

  return {
    // Data
    assessments,
    filteredAssessments,
    portfolioMetrics,
    
    // Filters and search
    filterCriteria,
    setFilterCriteria,
    searchTerm,
    setSearchTerm,
    resetFilters,
    
    // State
    isProcessing,
    setIsProcessing,
    
    // Actions
    addAssessment,
    updateAssessment,
    deleteAssessment,
    clearAllAssessments,
    
    // Utilities
    getCreditRating,
    exportData,
    downloadFile
  };
}

export default useCreditScoring;
