import React from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export type HubModule = 'equity' | 'debt' | 'grants' | 'match';

export interface Investor {
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

export interface Lender {
  id: number;
  name: string;
  type: 'bank' | 'credit-union' | 'online' | 'sba' | 'alternative';
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
  description: string;
  website: string;
  features: string[];
  approvalTime: string;
}

export interface Grant {
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
