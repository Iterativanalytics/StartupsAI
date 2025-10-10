// ============================================================================
// AI Credit Scoring System - Usage Examples
// ============================================================================

import { CreditAnalystAgentIntegration } from './integration';
import { RealTimeCreditDecisionEngine } from './real-time-decision';
import { CreditScoringAdvancedFeatures } from './advanced-features';
import { CreditApplication } from './types';

// ===========================
// SAMPLE DATA
// ===========================

export const sampleApplications = {
  // Excellent credit profile
  excellentCredit: {
    applicantId: 'APP-2025-001',
    businessInfo: {
      businessName: 'Tech Solutions LLC',
      industry: 'technology',
      yearsInBusiness: 5,
      businessStructure: 'llc' as const,
      numberOfEmployees: 25,
      locations: 3,
      ownershipPercentage: 80
    },
    financialData: {
      monthlyRevenue: 200000,
      annualRevenue: 2400000,
      monthlyExpenses: 140000,
      netIncome: 720000,
      cashReserves: 600000,
      accountsReceivable: 150000,
      accountsPayable: 80000,
      inventory: 50000,
      assets: 1200000,
      liabilities: 300000,
      revenueGrowthRate: 0.45,
      profitMargin: 0.30
    },
    traditionalCredit: {
      personalCreditScore: 780,
      businessCreditScore: 85,
      paymentHistory: [
        { creditor: 'Bank A', accountType: 'credit_card', balance: 5000, paymentStatus: 'current' as const, monthsHistory: 36 },
        { creditor: 'Bank B', accountType: 'term_loan', balance: 50000, paymentStatus: 'current' as const, monthsHistory: 24 }
      ],
      creditUtilization: 25,
      totalDebt: 200000,
      bankruptcies: 0,
      foreclosures: 0,
      collections: 0,
      inquiries: 1,
      accountsOpen: 6,
      oldestAccountAge: 72
    },
    alternativeData: {
      bankingBehavior: {
        averageDailyBalance: 150000,
        minimumBalance: 80000,
        overdrafts: 0,
        nsf: 0,
        depositFrequency: 25,
        depositConsistency: 0.92,
        cashFlowVolatility: 0.12
      },
      businessMetrics: {
        onlineReviews: { averageRating: 4.7, totalReviews: 250, responseRate: 0.95 },
        socialMediaPresence: { followers: 15000, engagementRate: 0.08, activeChannels: 5 },
        websiteTraffic: 85000,
        conversionRate: 0.05
      },
      digitalFootprint: {
        domainAge: 6,
        websiteQuality: 0.92,
        sslCertificate: true,
        businessListings: 18,
        mediaPresence: 8
      },
      supplierRelationships: {
        numberOfSuppliers: 12,
        paymentTermsNegotiated: true,
        tradeReferences: 6,
        averagePaymentDays: 25
      },
      customerBehavior: {
        repeatCustomerRate: 0.72,
        averageTransactionValue: 3500,
        customerLifetimeValue: 25000,
        churnRate: 0.08
      }
    },
    loanRequest: {
      amount: 300000,
      term: 60,
      purpose: 'Business expansion - new location',
      collateral: {
        type: 'Equipment and real estate',
        value: 250000,
        description: 'Office equipment and leasehold improvements'
      }
    }
  } as CreditApplication,

  // Moderate credit profile
  moderateCredit: {
    applicantId: 'APP-2025-002',
    businessInfo: {
      businessName: 'Main Street Retail',
      industry: 'retail',
      yearsInBusiness: 3,
      businessStructure: 'llc' as const,
      numberOfEmployees: 8,
      locations: 1,
      ownershipPercentage: 100
    },
    financialData: {
      monthlyRevenue: 80000,
      annualRevenue: 960000,
      monthlyExpenses: 68000,
      netIncome: 144000,
      cashReserves: 120000,
      accountsReceivable: 40000,
      accountsPayable: 35000,
      inventory: 80000,
      assets: 400000,
      liabilities: 180000,
      revenueGrowthRate: 0.15,
      profitMargin: 0.15
    },
    traditionalCredit: {
      personalCreditScore: 680,
      businessCreditScore: 65,
      paymentHistory: [
        { creditor: 'Bank A', accountType: 'credit_card', balance: 8000, paymentStatus: 'current' as const, monthsHistory: 24 },
        { creditor: 'Supplier B', accountType: 'trade', balance: 15000, paymentStatus: 'late_30' as const, monthsHistory: 12 }
      ],
      creditUtilization: 45,
      totalDebt: 120000,
      bankruptcies: 0,
      foreclosures: 0,
      collections: 0,
      inquiries: 3,
      accountsOpen: 4,
      oldestAccountAge: 36
    },
    alternativeData: {
      bankingBehavior: {
        averageDailyBalance: 45000,
        minimumBalance: 15000,
        overdrafts: 2,
        nsf: 0,
        depositFrequency: 20,
        depositConsistency: 0.75,
        cashFlowVolatility: 0.28
      },
      businessMetrics: {
        onlineReviews: { averageRating: 4.2, totalReviews: 85, responseRate: 0.70 },
        socialMediaPresence: { followers: 3500, engagementRate: 0.04, activeChannels: 3 },
        websiteTraffic: 12000,
        conversionRate: 0.02
      },
      digitalFootprint: {
        domainAge: 3,
        websiteQuality: 0.70,
        sslCertificate: true,
        businessListings: 8,
        mediaPresence: 3
      },
      supplierRelationships: {
        numberOfSuppliers: 6,
        paymentTermsNegotiated: true,
        tradeReferences: 3,
        averagePaymentDays: 35
      },
      customerBehavior: {
        repeatCustomerRate: 0.45,
        averageTransactionValue: 1200,
        customerLifetimeValue: 5400,
        churnRate: 0.22
      }
    },
    loanRequest: {
      amount: 100000,
      term: 48,
      purpose: 'Inventory expansion',
      collateral: {
        type: 'Inventory and equipment',
        value: 80000,
        description: 'Retail inventory and fixtures'
      }
    }
  } as CreditApplication,

  // High-risk profile
  highRisk: {
    applicantId: 'APP-2025-003',
    businessInfo: {
      businessName: 'New Ventures Restaurant',
      industry: 'food_service',
      yearsInBusiness: 1.5,
      businessStructure: 'sole_proprietorship' as const,
      numberOfEmployees: 5,
      locations: 1,
      ownershipPercentage: 100
    },
    financialData: {
      monthlyRevenue: 35000,
      annualRevenue: 420000,
      monthlyExpenses: 32000,
      netIncome: 36000,
      cashReserves: 25000,
      accountsReceivable: 5000,
      accountsPayable: 15000,
      inventory: 10000,
      assets: 120000,
      liabilities: 85000,
      revenueGrowthRate: -0.05,
      profitMargin: 0.09
    },
    traditionalCredit: {
      personalCreditScore: 590,
      businessCreditScore: 45,
      paymentHistory: [
        { creditor: 'Bank A', accountType: 'credit_card', balance: 12000, paymentStatus: 'late_60' as const, monthsHistory: 18 },
        { creditor: 'Supplier B', accountType: 'trade', balance: 8000, paymentStatus: 'late_30' as const, monthsHistory: 12 }
      ],
      creditUtilization: 75,
      totalDebt: 65000,
      bankruptcies: 0,
      foreclosures: 0,
      collections: 1,
      inquiries: 6,
      accountsOpen: 3,
      oldestAccountAge: 24
    },
    alternativeData: {
      bankingBehavior: {
        averageDailyBalance: 12000,
        minimumBalance: 2000,
        overdrafts: 5,
        nsf: 2,
        depositFrequency: 18,
        depositConsistency: 0.55,
        cashFlowVolatility: 0.48
      },
      businessMetrics: {
        onlineReviews: { averageRating: 3.8, totalReviews: 42, responseRate: 0.50 },
        socialMediaPresence: { followers: 800, engagementRate: 0.02, activeChannels: 2 },
        websiteTraffic: 3500,
        conversionRate: 0.01
      },
      digitalFootprint: {
        domainAge: 1.5,
        websiteQuality: 0.55,
        sslCertificate: false,
        businessListings: 4,
        mediaPresence: 1
      },
      supplierRelationships: {
        numberOfSuppliers: 4,
        paymentTermsNegotiated: false,
        tradeReferences: 1,
        averagePaymentDays: 45
      },
      customerBehavior: {
        repeatCustomerRate: 0.28,
        averageTransactionValue: 450,
        customerLifetimeValue: 1260,
        churnRate: 0.38
      }
    },
    loanRequest: {
      amount: 50000,
      term: 36,
      purpose: 'Working capital',
      collateral: {
        type: 'Equipment',
        value: 30000,
        description: 'Kitchen equipment'
      }
    }
  } as CreditApplication
};

// ===========================
// EXAMPLE 1: BASIC CREDIT SCORING
// ===========================

export async function example1_BasicCreditScoring() {
  console.log('\n=== EXAMPLE 1: Basic Credit Scoring ===\n');

  const integration = new CreditAnalystAgentIntegration();
  const application = sampleApplications.excellentCredit;

  const report = await integration.analyzeApplication(application);

  console.log('Business:', report.applicant.businessName);
  console.log('Credit Score:', Math.round(report.scoring.overallScore), '/', 850);
  console.log('Rating:', report.scoring.rating);
  console.log('Default Probability:', (report.scoring.defaultProbability * 100).toFixed(2), '%');
  console.log('Risk Category:', report.scoring.riskCategory);
  console.log('\nDecision:', report.recommendation.decision.toUpperCase());
  console.log('Max Loan Amount: $', report.recommendation.maxLoanAmount.toLocaleString());
  console.log('Suggested Rate:', report.recommendation.suggestedInterestRate.toFixed(2), '%');

  console.log('\nKey Strengths:');
  report.keyFactors.positive.forEach(f => {
    console.log(`  • ${f.factor}: ${f.description}`);
  });

  console.log('\nKey Concerns:');
  report.keyFactors.negative.forEach(f => {
    console.log(`  • ${f.factor}: ${f.description}`);
  });
}

// ===========================
// EXAMPLE 2: INSTANT DECISION
// ===========================

export async function example2_InstantDecision() {
  console.log('\n=== EXAMPLE 2: Instant Decision ===\n');

  const decisionEngine = new RealTimeCreditDecisionEngine();
  const application = sampleApplications.excellentCredit;

  const decision = await decisionEngine.instantDecision(application);

  console.log('Decision:', decision.decision.toUpperCase());
  console.log('Processing Time:', decision.processingTime, 'ms');
  console.log('Credit Score:', decision.score);

  if (decision.decision === 'approve') {
    console.log('\n✅ APPROVED');
    console.log('Approved Amount: $', decision.approvedAmount?.toLocaleString());
    console.log('Interest Rate:', decision.interestRate?.toFixed(2), '%');
    console.log('Term:', decision.terms?.term, 'months');
    console.log('Monthly Payment: $', decision.terms?.monthlyPayment.toFixed(2));
  }
}

// ===========================
// EXAMPLE 3: FRAUD DETECTION
// ===========================

export async function example3_FraudDetection() {
  console.log('\n=== EXAMPLE 3: Fraud Detection ===\n');

  const advancedFeatures = new CreditScoringAdvancedFeatures();
  const application = sampleApplications.moderateCredit;

  const fraudAssessment = await advancedFeatures.detectFraud(application);

  console.log('Fraud Risk Score:', fraudAssessment.riskScore, '/ 100');
  console.log('Is Fraudulent:', fraudAssessment.isFraudulent);
  console.log('Recommendation:', fraudAssessment.recommendation.toUpperCase());

  if (fraudAssessment.flags.length > 0) {
    console.log('\n🚩 Red Flags:');
    fraudAssessment.flags.forEach(flag => {
      console.log(`  • ${flag}`);
    });
  } else {
    console.log('\n✅ No fraud indicators detected');
  }
}

// ===========================
// EXAMPLE 4: PORTFOLIO ANALYSIS
// ===========================

export async function example4_PortfolioAnalysis() {
  console.log('\n=== EXAMPLE 4: Portfolio Analysis ===\n');

  const integration = new CreditAnalystAgentIntegration();
  const applications = [
    sampleApplications.excellentCredit,
    sampleApplications.moderateCredit,
    sampleApplications.highRisk
  ];

  const portfolioReport = await integration.scorePortfolio(applications);

  console.log('Total Applications:', portfolioReport.totalApplications);
  console.log('Average Score:', Math.round(portfolioReport.portfolioMetrics.averageScore));
  console.log('Average Default Probability:', (portfolioReport.portfolioMetrics.averageDefaultProbability * 100).toFixed(2), '%');
  console.log('Approval Rate:', (portfolioReport.portfolioMetrics.approvalRate * 100).toFixed(1), '%');

  console.log('\nRisk Distribution:');
  Object.entries(portfolioReport.riskDistribution).forEach(([risk, count]) => {
    console.log(`  ${risk}: ${count}`);
  });

  console.log('\nPortfolio Risk Rating:', portfolioReport.portfolioRisk.riskRating);
  console.log('Total Exposure: $', portfolioReport.portfolioRisk.totalExposure.toLocaleString());
  console.log('Expected Loss: $', portfolioReport.portfolioRisk.expectedLoss.toLocaleString());
  console.log('Expected Loss Rate:', (portfolioReport.portfolioRisk.expectedLossRate * 100).toFixed(2), '%');

  console.log('\nTop Risks:');
  portfolioReport.topRisks.forEach((risk, i) => {
    console.log(`  ${i + 1}. ${risk.businessName} - Score: ${Math.round(risk.score)}, Risk: ${(risk.defaultProbability * 100).toFixed(1)}%`);
  });

  console.log('\nRecommendations:');
  portfolioReport.recommendations.forEach(rec => {
    console.log(`  • ${rec}`);
  });
}

// ===========================
// EXAMPLE 5: LOAN MONITORING
// ===========================

export async function example5_LoanMonitoring() {
  console.log('\n=== EXAMPLE 5: Loan Monitoring ===\n');

  const integration = new CreditAnalystAgentIntegration();
  const originalApplication = sampleApplications.moderateCredit;

  // Simulate deteriorating financials
  const currentFinancials = {
    ...originalApplication.financialData,
    monthlyRevenue: 65000, // Down from 80000
    revenueGrowthRate: -0.10, // Negative growth
    profitMargin: 0.08, // Down from 0.15
    cashReserves: 60000 // Down from 120000
  };

  const currentAlternativeData = {
    ...originalApplication.alternativeData,
    bankingBehavior: {
      ...originalApplication.alternativeData.bankingBehavior,
      overdrafts: 4, // Increased
      cashFlowVolatility: 0.42 // Increased
    }
  };

  const monitoringReport = await integration.monitorExistingLoan(
    originalApplication,
    currentFinancials,
    currentAlternativeData
  );

  console.log('Loan ID:', monitoringReport.loanId);
  console.log('\nScore Changes:');
  console.log('  Original:', Math.round(monitoringReport.originalScore));
  console.log('  Current:', Math.round(monitoringReport.currentScore));
  console.log('  Delta:', monitoringReport.scoreDelta > 0 ? '+' : '', Math.round(monitoringReport.scoreDelta));

  console.log('\nRisk Changes:');
  console.log('  Original:', (monitoringReport.originalRisk * 100).toFixed(2), '%');
  console.log('  Current:', (monitoringReport.currentRisk * 100).toFixed(2), '%');
  console.log('  Delta:', monitoringReport.riskDelta > 0 ? '+' : '', (monitoringReport.riskDelta * 100).toFixed(2), '%');

  console.log('\nAction Required:', monitoringReport.actionRequired.toUpperCase());

  if (monitoringReport.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    monitoringReport.warnings.forEach(w => {
      console.log(`  • ${w}`);
    });
  }

  console.log('\nRecommendations:');
  monitoringReport.recommendations.forEach(rec => {
    console.log(`  ${rec}`);
  });
}

// ===========================
// EXAMPLE 6: CREDIT LIMIT OPTIMIZATION
// ===========================

export async function example6_CreditLimitOptimization() {
  console.log('\n=== EXAMPLE 6: Credit Limit Optimization ===\n');

  const integration = new CreditAnalystAgentIntegration();
  const advancedFeatures = new CreditScoringAdvancedFeatures();
  const application = sampleApplications.excellentCredit;

  const report = await integration.analyzeApplication(application);
  
  // Construct full CreditScore object
  const creditScore = {
    overallScore: report.scoring.overallScore,
    rating: report.scoring.rating as any,
    defaultProbability: report.scoring.defaultProbability,
    riskCategory: report.scoring.riskCategory as any,
    confidenceLevel: report.scoring.confidenceLevel,
    componentScores: report.components,
    keyFactors: report.keyFactors,
    recommendation: report.recommendation,
    explainability: report.explainability
  };
  
  const creditLimit = advancedFeatures.calculateOptimalCreditLimit(application, creditScore);

  console.log('Business:', report.applicant.businessName);
  console.log('Credit Score:', Math.round(report.scoring.overallScore));
  console.log('\nCredit Limit Recommendation:');
  console.log('  Recommended: $', creditLimit.recommendedLimit.toLocaleString());
  console.log('  Minimum: $', creditLimit.minimumLimit.toLocaleString());
  console.log('  Maximum: $', creditLimit.maximumLimit.toLocaleString());
  console.log('  Review Period:', creditLimit.reviewPeriod, 'months');
  console.log('\nReasoning:', creditLimit.reasoning);
}

// ===========================
// EXAMPLE 7: WHAT-IF SCENARIOS
// ===========================

export async function example7_WhatIfScenarios() {
  console.log('\n=== EXAMPLE 7: What-If Scenarios ===\n');

  const integration = new CreditAnalystAgentIntegration();
  const application = sampleApplications.moderateCredit;

  const report = await integration.analyzeApplication(application);

  console.log('Business:', report.applicant.businessName);
  console.log('Current Score:', Math.round(report.scoring.overallScore));
  console.log('\nImprovement Opportunities:\n');

  report.explainability.whatIfScenarios.forEach((scenario, i) => {
    console.log(`${i + 1}. ${scenario.change}`);
    console.log(`   Current: ${scenario.currentValue}`);
    console.log(`   Target: ${scenario.suggestedValue}`);
    console.log(`   Score Impact: +${scenario.scoreImpact} points`);
    console.log(`   New Score: ${Math.round(report.scoring.overallScore + scenario.scoreImpact)}\n`);
  });
}

// ===========================
// EXAMPLE 8: COMPARISON ANALYSIS
// ===========================

export async function example8_ComparisonAnalysis() {
  console.log('\n=== EXAMPLE 8: Comparison Analysis ===\n');

  const integration = new CreditAnalystAgentIntegration();
  const applications = [
    sampleApplications.excellentCredit,
    sampleApplications.moderateCredit,
    sampleApplications.highRisk
  ];

  const comparison = await integration.compareApplications(applications);

  console.log('Application Rankings:\n');
  comparison.rankings.forEach(rank => {
    console.log(`${rank.rank}. ${rank.businessName}`);
    console.log(`   Score: ${Math.round(rank.score)}`);
    console.log(`   Recommendation: ${rank.recommendation.toUpperCase()}\n`);
  });

  console.log('Analysis:', comparison.analysis);
}

// ===========================
// EXAMPLE 9: BATCH INSTANT DECISIONS
// ===========================

export async function example9_BatchInstantDecisions() {
  console.log('\n=== EXAMPLE 9: Batch Instant Decisions ===\n');

  const decisionEngine = new RealTimeCreditDecisionEngine();
  const applications = [
    sampleApplications.excellentCredit,
    sampleApplications.moderateCredit,
    sampleApplications.highRisk
  ];

  const decisions = await decisionEngine.batchInstantDecisions(applications);
  const stats = decisionEngine.getDecisionStatistics(decisions);

  console.log('Batch Processing Results:');
  console.log('  Total Applications:', stats.totalApplications);
  console.log('  Approved:', stats.approved);
  console.log('  Declined:', stats.declined);
  console.log('  Requires Review:', stats.requiresReview);
  console.log('  Approval Rate:', (stats.approvalRate * 100).toFixed(1), '%');
  console.log('  Avg Processing Time:', stats.averageProcessingTime.toFixed(0), 'ms');
  console.log('  Avg Approved Amount: $', stats.averageApprovedAmount.toLocaleString());

  console.log('\nIndividual Decisions:');
  applications.forEach(app => {
    const decision = decisions.get(app.applicantId);
    if (decision) {
      console.log(`\n${app.businessInfo.businessName}:`);
      console.log(`  Decision: ${decision.decision.toUpperCase()}`);
      console.log(`  Score: ${decision.score ? Math.round(decision.score) : 'N/A'}`);
      console.log(`  Processing Time: ${decision.processingTime}ms`);
    }
  });
}

// ===========================
// EXAMPLE 10: STRESS TESTING
// ===========================

export async function example10_StressTesting() {
  console.log('\n=== EXAMPLE 10: Stress Testing ===\n');

  const integration = new CreditAnalystAgentIntegration();
  const advancedFeatures = new CreditScoringAdvancedFeatures();

  const applications = [
    sampleApplications.excellentCredit,
    sampleApplications.moderateCredit,
    sampleApplications.highRisk
  ];

  const reports = await Promise.all(
    applications.map(app => integration.analyzeApplication(app))
  );

  const scores = reports.map((report, i) => ({
    application: applications[i],
    score: {
      overallScore: report.scoring.overallScore,
      rating: report.scoring.rating as any,
      defaultProbability: report.scoring.defaultProbability,
      riskCategory: report.scoring.riskCategory as any,
      confidenceLevel: report.scoring.confidenceLevel,
      componentScores: report.components,
      keyFactors: report.keyFactors,
      recommendation: report.recommendation,
      explainability: report.explainability
    }
  }));

  // Scenario 1: Economic Downturn
  console.log('Scenario 1: Economic Downturn');
  const downturnResults = advancedFeatures.performStressTest(scores, { economicDownturn: true });
  console.log('  Baseline Default Rate:', (downturnResults.baselineDefaultRate * 100).toFixed(2), '%');
  console.log('  Stressed Default Rate:', (downturnResults.stressedDefaultRate * 100).toFixed(2), '%');
  console.log('  Additional Losses: $', downturnResults.additionalLosses.toLocaleString());
  console.log('  Affected Loans:', downturnResults.affectedLoans);

  // Scenario 2: Interest Rate Shock
  console.log('\nScenario 2: Interest Rate Shock');
  const rateShockResults = advancedFeatures.performStressTest(scores, { interestRateShock: true });
  console.log('  Baseline Default Rate:', (rateShockResults.baselineDefaultRate * 100).toFixed(2), '%');
  console.log('  Stressed Default Rate:', (rateShockResults.stressedDefaultRate * 100).toFixed(2), '%');
  console.log('  Additional Losses: $', rateShockResults.additionalLosses.toLocaleString());

  // Scenario 3: Industry Collapse
  console.log('\nScenario 3: Retail Industry Collapse');
  const industryCollapseResults = advancedFeatures.performStressTest(scores, { industryCollapse: 'retail' });
  console.log('  Baseline Default Rate:', (industryCollapseResults.baselineDefaultRate * 100).toFixed(2), '%');
  console.log('  Stressed Default Rate:', (industryCollapseResults.stressedDefaultRate * 100).toFixed(2), '%');
  console.log('  Additional Losses: $', industryCollapseResults.additionalLosses.toLocaleString());
  console.log('  Affected Loans:', industryCollapseResults.affectedLoans);
}

// ===========================
// RUN ALL EXAMPLES
// ===========================

export async function runAllExamples() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║     AI CREDIT SCORING SYSTEM - USAGE EXAMPLES             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  await example1_BasicCreditScoring();
  await example2_InstantDecision();
  await example3_FraudDetection();
  await example4_PortfolioAnalysis();
  await example5_LoanMonitoring();
  await example6_CreditLimitOptimization();
  await example7_WhatIfScenarios();
  await example8_ComparisonAnalysis();
  await example9_BatchInstantDecisions();
  await example10_StressTesting();

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║              ALL EXAMPLES COMPLETED                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
}

// Run if executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}
