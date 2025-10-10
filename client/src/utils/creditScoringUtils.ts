/**
 * Shared Credit Scoring Utilities
 * Centralized business logic for credit scoring operations
 */

export interface CreditRating {
  rating: string;
  color: string;
  bg: string;
  risk: string;
  riskLevel: number;
}

export interface IndustryConfig {
  multiplier: number;
  riskAdjustment: number;
  rateAdjustment: number;
}

/**
 * Get credit rating information based on score
 */
export function getCreditRating(score: number): CreditRating {
  if (score >= 800) return { rating: 'A+', color: 'text-emerald-600', bg: 'bg-emerald-100', risk: 'Minimal Risk', riskLevel: 1 };
  if (score >= 750) return { rating: 'A', color: 'text-green-600', bg: 'bg-green-100', risk: 'Very Low Risk', riskLevel: 2 };
  if (score >= 700) return { rating: 'B+', color: 'text-blue-600', bg: 'bg-blue-100', risk: 'Low Risk', riskLevel: 3 };
  if (score >= 650) return { rating: 'B', color: 'text-cyan-600', bg: 'bg-cyan-100', risk: 'Moderate Risk', riskLevel: 4 };
  if (score >= 600) return { rating: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-100', risk: 'Medium Risk', riskLevel: 5 };
  if (score >= 550) return { rating: 'C', color: 'text-orange-600', bg: 'bg-orange-100', risk: 'High Risk', riskLevel: 6 };
  if (score >= 500) return { rating: 'D', color: 'text-red-600', bg: 'bg-red-100', risk: 'Very High Risk', riskLevel: 7 };
  return { rating: 'F', color: 'text-red-800', bg: 'bg-red-200', risk: 'Extremely High Risk', riskLevel: 8 };
}

/**
 * Industry configuration for risk and rate adjustments
 */
export const INDUSTRY_CONFIG: Record<string, IndustryConfig> = {
  'technology': {
    multiplier: 1.1,
    riskAdjustment: 0.8,
    rateAdjustment: -0.5
  },
  'healthcare': {
    multiplier: 1.0,
    riskAdjustment: 0.9,
    rateAdjustment: 0.0
  },
  'manufacturing': {
    multiplier: 0.9,
    riskAdjustment: 1.0,
    rateAdjustment: 0.5
  },
  'retail': {
    multiplier: 0.8,
    riskAdjustment: 1.1,
    rateAdjustment: 1.0
  },
  'hospitality': {
    multiplier: 0.7,
    riskAdjustment: 1.2,
    rateAdjustment: 1.5
  },
  'construction': {
    multiplier: 0.8,
    riskAdjustment: 1.1,
    rateAdjustment: 1.0
  },
  'professional_services': {
    multiplier: 1.0,
    riskAdjustment: 0.9,
    rateAdjustment: 0.0
  },
  'financial_services': {
    multiplier: 0.9,
    riskAdjustment: 1.0,
    rateAdjustment: 0.5
  }
};

/**
 * Get industry multiplier for market conditions
 */
export function getIndustryMultiplier(industry: string): number {
  return INDUSTRY_CONFIG[industry]?.multiplier || 1.0;
}

/**
 * Get industry risk adjustment factor
 */
export function getIndustryRiskAdjustment(industry: string): number {
  return INDUSTRY_CONFIG[industry]?.riskAdjustment || 1.0;
}

/**
 * Get industry rate adjustment
 */
export function getIndustryRateAdjustment(industry: string): number {
  return INDUSTRY_CONFIG[industry]?.rateAdjustment || 0.0;
}

/**
 * Check if date is within specified range
 */
export function isWithinDateRange(date: Date, rangeInDays: number): boolean {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (24 * 60 * 60 * 1000);
  return diffDays <= rangeInDays;
}

/**
 * Filter by date range string ('7d', '30d', '90d', 'all')
 */
export function matchesDateRange(dateStr: string, range: string): boolean {
  if (range === 'all') return true;
  
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  switch (range) {
    case '7d':
      return diffMs <= 7 * 24 * 60 * 60 * 1000;
    case '30d':
      return diffMs <= 30 * 24 * 60 * 60 * 1000;
    case '90d':
      return diffMs <= 90 * 24 * 60 * 60 * 1000;
    default:
      return true;
  }
}

/**
 * Download file helper
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV format
 */
export function exportToCSV(
  data: any[],
  headers: string[],
  rowMapper: (item: any) => any[]
): Blob {
  const rows = data.map(rowMapper);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  return new Blob([csvContent], { type: 'text/csv' });
}

/**
 * Export data to JSON format
 */
export function exportToJSON(data: any[]): Blob {
  const dataStr = JSON.stringify(data, null, 2);
  return new Blob([dataStr], { type: 'application/json' });
}
