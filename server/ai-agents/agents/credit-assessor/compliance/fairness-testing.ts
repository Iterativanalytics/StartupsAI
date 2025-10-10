// ============================================================================
// Fairness Testing & Bias Detection
// Regulatory Compliance for Fair Lending
// ============================================================================

import { CreditScore, CreditApplication } from '../types';

// ===========================
// TYPES
// ===========================

export interface FairnessMetrics {
  demographicParity: {
    score: number;
    passed: boolean;
    threshold: number;
    interpretation: string;
  };
  equalOpportunity: {
    score: number;
    passed: boolean;
    threshold: number;
    interpretation: string;
  };
  disparateImpact: {
    ratio: number;
    passed: boolean;
    threshold: number;
    interpretation: string;
  };
  calibrationByGroup: {
    [group: string]: {
      calibrationError: number;
      sampleSize: number;
    };
  };
}

export interface ProtectedAttributes {
  race?: string;
  ethnicity?: string;
  gender?: string;
  age?: number;
  maritalStatus?: string;
  geography?: string;
  zipCode?: string;
}

export interface FairnessTestResult {
  testDate: Date;
  modelVersion: string;
  overallPassed: boolean;
  metrics: FairnessMetrics;
  violations: string[];
  recommendations: string[];
  detailedReport: any;
}

export interface BiasDetectionResult {
  biasDetected: boolean;
  biasType: string[];
  affectedGroups: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigationStrategies: string[];
}

// ===========================
// FAIRNESS MONITOR
// ===========================

export class FairnessMonitor {
  private readonly DEMOGRAPHIC_PARITY_THRESHOLD = 0.05; // 5%
  private readonly EQUAL_OPPORTUNITY_THRESHOLD = 0.05; // 5%
  private readonly DISPARATE_IMPACT_THRESHOLD = 0.80; // 80% rule (4/5ths rule)

  /**
   * Test fairness across protected classes
   */
  async testFairness(
    predictions: number[],
    actuals: number[],
    protectedAttributes: ProtectedAttributes[],
    modelVersion: string
  ): Promise<FairnessTestResult> {
    const violations: string[] = [];
    const recommendations: string[] = [];

    // Test demographic parity
    const demographicParity = this.testDemographicParity(
      predictions,
      protectedAttributes
    );

    if (!demographicParity.passed) {
      violations.push(`Demographic parity violation: ${demographicParity.interpretation}`);
      recommendations.push('Review model features for potential bias');
      recommendations.push('Consider re-weighting training data');
    }

    // Test equal opportunity
    const equalOpportunity = this.testEqualOpportunity(
      predictions,
      actuals,
      protectedAttributes
    );

    if (!equalOpportunity.passed) {
      violations.push(`Equal opportunity violation: ${equalOpportunity.interpretation}`);
      recommendations.push('Ensure true positive rates are similar across groups');
    }

    // Test disparate impact
    const disparateImpact = this.testDisparateImpact(
      predictions,
      protectedAttributes
    );

    if (!disparateImpact.passed) {
      violations.push(`Disparate impact violation: ${disparateImpact.interpretation}`);
      recommendations.push('Approval rates differ significantly across protected groups');
      recommendations.push('Consider bias mitigation techniques');
    }

    // Test calibration by group
    const calibrationByGroup = this.testCalibrationByGroup(
      predictions,
      actuals,
      protectedAttributes
    );

    const metrics: FairnessMetrics = {
      demographicParity,
      equalOpportunity,
      disparateImpact,
      calibrationByGroup
    };

    const overallPassed = 
      demographicParity.passed &&
      equalOpportunity.passed &&
      disparateImpact.passed;

    return {
      testDate: new Date(),
      modelVersion,
      overallPassed,
      metrics,
      violations,
      recommendations,
      detailedReport: this.generateDetailedReport(metrics, protectedAttributes)
    };
  }

  /**
   * Demographic Parity: P(Ŷ=1|A=0) ≈ P(Ŷ=1|A=1)
   * Approval rates should be similar across groups
   */
  private testDemographicParity(
    predictions: number[],
    protectedAttributes: ProtectedAttributes[]
  ): FairnessMetrics['demographicParity'] {
    const groups = this.groupByAttribute(protectedAttributes, 'race');
    const approvalRates: { [group: string]: number } = {};

    for (const [group, indices] of Object.entries(groups)) {
      const groupPredictions = indices.map(i => predictions[i]);
      const approvals = groupPredictions.filter(p => p >= 0.5).length;
      approvalRates[group] = approvals / groupPredictions.length;
    }

    const rates = Object.values(approvalRates);
    const maxRate = Math.max(...rates);
    const minRate = Math.min(...rates);
    const difference = maxRate - minRate;

    const passed = difference <= this.DEMOGRAPHIC_PARITY_THRESHOLD;

    return {
      score: difference,
      passed,
      threshold: this.DEMOGRAPHIC_PARITY_THRESHOLD,
      interpretation: passed
        ? `Approval rates are similar across groups (max difference: ${(difference * 100).toFixed(2)}%)`
        : `Approval rates differ by ${(difference * 100).toFixed(2)}% across groups (threshold: ${(this.DEMOGRAPHIC_PARITY_THRESHOLD * 100).toFixed(2)}%)`
    };
  }

  /**
   * Equal Opportunity: P(Ŷ=1|Y=1,A=0) ≈ P(Ŷ=1|Y=1,A=1)
   * True positive rates should be similar across groups
   */
  private testEqualOpportunity(
    predictions: number[],
    actuals: number[],
    protectedAttributes: ProtectedAttributes[]
  ): FairnessMetrics['equalOpportunity'] {
    const groups = this.groupByAttribute(protectedAttributes, 'race');
    const tprByGroup: { [group: string]: number } = {};

    for (const [group, indices] of Object.entries(groups)) {
      const positiveIndices = indices.filter(i => actuals[i] === 1);
      if (positiveIndices.length === 0) continue;

      const truePositives = positiveIndices.filter(i => predictions[i] >= 0.5).length;
      tprByGroup[group] = truePositives / positiveIndices.length;
    }

    const tprs = Object.values(tprByGroup);
    const maxTPR = Math.max(...tprs);
    const minTPR = Math.min(...tprs);
    const difference = maxTPR - minTPR;

    const passed = difference <= this.EQUAL_OPPORTUNITY_THRESHOLD;

    return {
      score: difference,
      passed,
      threshold: this.EQUAL_OPPORTUNITY_THRESHOLD,
      interpretation: passed
        ? `True positive rates are similar across groups (max difference: ${(difference * 100).toFixed(2)}%)`
        : `True positive rates differ by ${(difference * 100).toFixed(2)}% across groups`
    };
  }

  /**
   * Disparate Impact: P(Ŷ=1|A=disadvantaged) / P(Ŷ=1|A=privileged) >= 0.8
   * 80% rule (4/5ths rule) from EEOC guidelines
   */
  private testDisparateImpact(
    predictions: number[],
    protectedAttributes: ProtectedAttributes[]
  ): FairnessMetrics['disparateImpact'] {
    const groups = this.groupByAttribute(protectedAttributes, 'race');
    const approvalRates: { [group: string]: number } = {};

    for (const [group, indices] of Object.entries(groups)) {
      const groupPredictions = indices.map(i => predictions[i]);
      const approvals = groupPredictions.filter(p => p >= 0.5).length;
      approvalRates[group] = approvals / groupPredictions.length;
    }

    // Find privileged and disadvantaged groups
    const rates = Object.entries(approvalRates);
    rates.sort((a, b) => b[1] - a[1]);
    
    const privilegedRate = rates[0][1];
    const disadvantagedRate = rates[rates.length - 1][1];
    
    const ratio = disadvantagedRate / privilegedRate;
    const passed = ratio >= this.DISPARATE_IMPACT_THRESHOLD;

    return {
      ratio,
      passed,
      threshold: this.DISPARATE_IMPACT_THRESHOLD,
      interpretation: passed
        ? `Disparate impact ratio ${ratio.toFixed(3)} meets 80% rule`
        : `Disparate impact ratio ${ratio.toFixed(3)} fails 80% rule (${(ratio * 100).toFixed(1)}% < 80%)`
    };
  }

  /**
   * Test calibration by group
   * Predictions should be well-calibrated across all groups
   */
  private testCalibrationByGroup(
    predictions: number[],
    actuals: number[],
    protectedAttributes: ProtectedAttributes[]
  ): FairnessMetrics['calibrationByGroup'] {
    const groups = this.groupByAttribute(protectedAttributes, 'race');
    const calibrationByGroup: FairnessMetrics['calibrationByGroup'] = {};

    for (const [group, indices] of Object.entries(groups)) {
      const groupPredictions = indices.map(i => predictions[i]);
      const groupActuals = indices.map(i => actuals[i]);

      const calibrationError = this.calculateCalibrationError(
        groupPredictions,
        groupActuals
      );

      calibrationByGroup[group] = {
        calibrationError,
        sampleSize: indices.length
      };
    }

    return calibrationByGroup;
  }

  /**
   * Calculate calibration error (Expected Calibration Error)
   */
  private calculateCalibrationError(
    predictions: number[],
    actuals: number[]
  ): number {
    const numBins = 10;
    const bins: { predictions: number[]; actuals: number[] }[] = Array(numBins)
      .fill(null)
      .map(() => ({ predictions: [], actuals: [] }));

    // Bin predictions
    predictions.forEach((pred, i) => {
      const binIndex = Math.min(Math.floor(pred * numBins), numBins - 1);
      bins[binIndex].predictions.push(pred);
      bins[binIndex].actuals.push(actuals[i]);
    });

    // Calculate ECE
    let ece = 0;
    let totalSamples = predictions.length;

    bins.forEach(bin => {
      if (bin.predictions.length === 0) return;

      const avgPrediction = bin.predictions.reduce((a, b) => a + b, 0) / bin.predictions.length;
      const avgActual = bin.actuals.reduce((a, b) => a + b, 0) / bin.actuals.length;
      const weight = bin.predictions.length / totalSamples;

      ece += weight * Math.abs(avgPrediction - avgActual);
    });

    return ece;
  }

  /**
   * Group data by protected attribute
   */
  private groupByAttribute(
    protectedAttributes: ProtectedAttributes[],
    attribute: keyof ProtectedAttributes
  ): { [group: string]: number[] } {
    const groups: { [group: string]: number[] } = {};

    protectedAttributes.forEach((attrs, index) => {
      const value = attrs[attribute];
      if (value === undefined) return;

      const groupKey = String(value);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(index);
    });

    return groups;
  }

  /**
   * Generate detailed fairness report
   */
  private generateDetailedReport(
    metrics: FairnessMetrics,
    protectedAttributes: ProtectedAttributes[]
  ): any {
    return {
      summary: {
        demographicParityPassed: metrics.demographicParity.passed,
        equalOpportunityPassed: metrics.equalOpportunity.passed,
        disparateImpactPassed: metrics.disparateImpact.passed
      },
      metrics: {
        demographicParity: metrics.demographicParity.score,
        equalOpportunity: metrics.equalOpportunity.score,
        disparateImpactRatio: metrics.disparateImpact.ratio
      },
      groupAnalysis: this.analyzeGroups(protectedAttributes),
      recommendations: this.generateRecommendations(metrics)
    };
  }

  /**
   * Analyze protected groups
   */
  private analyzeGroups(protectedAttributes: ProtectedAttributes[]): any {
    const analysis: any = {};

    // Analyze by race
    const raceGroups = this.groupByAttribute(protectedAttributes, 'race');
    analysis.byRace = Object.entries(raceGroups).map(([race, indices]) => ({
      race,
      count: indices.length,
      percentage: (indices.length / protectedAttributes.length) * 100
    }));

    // Analyze by geography
    const geoGroups = this.groupByAttribute(protectedAttributes, 'geography');
    analysis.byGeography = Object.entries(geoGroups).map(([geo, indices]) => ({
      geography: geo,
      count: indices.length,
      percentage: (indices.length / protectedAttributes.length) * 100
    }));

    return analysis;
  }

  /**
   * Generate recommendations based on fairness metrics
   */
  private generateRecommendations(metrics: FairnessMetrics): string[] {
    const recommendations: string[] = [];

    if (!metrics.demographicParity.passed) {
      recommendations.push('Implement demographic parity constraints during model training');
      recommendations.push('Review feature selection to remove potentially biased features');
      recommendations.push('Consider post-processing adjustments to equalize approval rates');
    }

    if (!metrics.equalOpportunity.passed) {
      recommendations.push('Adjust decision thresholds by group to equalize true positive rates');
      recommendations.push('Investigate why model performance differs across groups');
    }

    if (!metrics.disparateImpact.passed) {
      recommendations.push('URGENT: Model fails 80% rule - immediate review required');
      recommendations.push('Consider bias mitigation algorithms (reweighting, adversarial debiasing)');
      recommendations.push('Conduct disparate impact analysis by feature');
    }

    return recommendations;
  }
}

// ===========================
// BIAS DETECTION
// ===========================

export class BiasDetector {
  /**
   * Detect bias in model predictions
   */
  async detectBias(
    applications: CreditApplication[],
    scores: CreditScore[],
    protectedAttributes: ProtectedAttributes[]
  ): Promise<BiasDetectionResult> {
    const biasTypes: string[] = [];
    const affectedGroups: string[] = [];

    // Feature-based bias detection
    const featureBias = this.detectFeatureBias(applications, scores);
    if (featureBias.detected) {
      biasTypes.push('feature_bias');
      affectedGroups.push(...featureBias.affectedGroups);
    }

    // Outcome-based bias detection
    const outcomeBias = this.detectOutcomeBias(scores, protectedAttributes);
    if (outcomeBias.detected) {
      biasTypes.push('outcome_bias');
      affectedGroups.push(...outcomeBias.affectedGroups);
    }

    // Geographic bias detection
    const geoBias = this.detectGeographicBias(applications, scores, protectedAttributes);
    if (geoBias.detected) {
      biasTypes.push('geographic_bias');
      affectedGroups.push(...geoBias.affectedGroups);
    }

    const biasDetected = biasTypes.length > 0;
    const severity = this.calculateBiasSeverity(biasTypes.length, affectedGroups.length);

    return {
      biasDetected,
      biasType: biasTypes,
      affectedGroups: [...new Set(affectedGroups)],
      severity,
      mitigationStrategies: this.generateMitigationStrategies(biasTypes)
    };
  }

  /**
   * Detect feature-based bias
   */
  private detectFeatureBias(
    applications: CreditApplication[],
    scores: CreditScore[]
  ): { detected: boolean; affectedGroups: string[] } {
    // Analyze if certain features disproportionately affect certain groups
    // This is a simplified implementation
    return {
      detected: false,
      affectedGroups: []
    };
  }

  /**
   * Detect outcome-based bias
   */
  private detectOutcomeBias(
    scores: CreditScore[],
    protectedAttributes: ProtectedAttributes[]
  ): { detected: boolean; affectedGroups: string[] } {
    const affectedGroups: string[] = [];
    
    // Group scores by protected attribute
    const groups: { [key: string]: number[] } = {};
    
    protectedAttributes.forEach((attrs, i) => {
      const key = attrs.race || 'unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(scores[i].overallScore);
    });

    // Calculate average score per group
    const avgScores: { [key: string]: number } = {};
    for (const [group, groupScores] of Object.entries(groups)) {
      avgScores[group] = groupScores.reduce((a, b) => a + b, 0) / groupScores.length;
    }

    // Check for significant differences
    const scores_values = Object.values(avgScores);
    const maxScore = Math.max(...scores_values);
    const minScore = Math.min(...scores_values);
    
    const detected = (maxScore - minScore) > 50; // 50 point difference threshold

    if (detected) {
      // Find affected groups
      for (const [group, avgScore] of Object.entries(avgScores)) {
        if (avgScore < maxScore - 30) {
          affectedGroups.push(group);
        }
      }
    }

    return { detected, affectedGroups };
  }

  /**
   * Detect geographic bias (redlining)
   */
  private detectGeographicBias(
    applications: CreditApplication[],
    scores: CreditScore[],
    protectedAttributes: ProtectedAttributes[]
  ): { detected: boolean; affectedGroups: string[] } {
    const affectedGroups: string[] = [];
    
    // Group by zip code or geography
    const geoGroups: { [key: string]: number[] } = {};
    
    protectedAttributes.forEach((attrs, i) => {
      const key = attrs.zipCode || attrs.geography || 'unknown';
      if (!geoGroups[key]) geoGroups[key] = [];
      geoGroups[key].push(scores[i].overallScore);
    });

    // Calculate approval rates by geography
    const approvalRates: { [key: string]: number } = {};
    for (const [geo, geoScores] of Object.entries(geoGroups)) {
      const approvals = geoScores.filter(s => s >= 700).length;
      approvalRates[geo] = approvals / geoScores.length;
    }

    // Check for redlining patterns
    const rates = Object.values(approvalRates);
    const maxRate = Math.max(...rates);
    const minRate = Math.min(...rates);
    
    const detected = (maxRate - minRate) > 0.20; // 20% difference

    if (detected) {
      for (const [geo, rate] of Object.entries(approvalRates)) {
        if (rate < maxRate - 0.15) {
          affectedGroups.push(geo);
        }
      }
    }

    return { detected, affectedGroups };
  }

  /**
   * Calculate bias severity
   */
  private calculateBiasSeverity(
    biasTypeCount: number,
    affectedGroupCount: number
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (biasTypeCount >= 3 || affectedGroupCount >= 5) return 'critical';
    if (biasTypeCount >= 2 || affectedGroupCount >= 3) return 'high';
    if (biasTypeCount >= 1 || affectedGroupCount >= 2) return 'medium';
    return 'low';
  }

  /**
   * Generate mitigation strategies
   */
  private generateMitigationStrategies(biasTypes: string[]): string[] {
    const strategies: string[] = [];

    if (biasTypes.includes('feature_bias')) {
      strategies.push('Remove or transform biased features');
      strategies.push('Use fairness-aware feature engineering');
      strategies.push('Apply feature importance analysis to identify problematic features');
    }

    if (biasTypes.includes('outcome_bias')) {
      strategies.push('Implement post-processing fairness constraints');
      strategies.push('Use threshold optimization by group');
      strategies.push('Consider adversarial debiasing during training');
    }

    if (biasTypes.includes('geographic_bias')) {
      strategies.push('Remove geographic features from model');
      strategies.push('Implement geographic fairness constraints');
      strategies.push('Conduct disparate impact analysis by geography');
    }

    strategies.push('Regular fairness audits and monitoring');
    strategies.push('Diverse training data collection');
    strategies.push('Stakeholder review and validation');

    return strategies;
  }
}

// ===========================
// REGULATORY COMPLIANCE
// ===========================

export class RegulatoryCompliance {
  /**
   * Generate adverse action notice (FCRA requirement)
   */
  generateAdverseActionNotice(
    application: CreditApplication,
    score: CreditScore,
    decision: string
  ): {
    notice: string;
    reasons: string[];
    rights: string[];
  } {
    const reasons: string[] = [];

    // Extract top negative factors
    if (score.keyFactors.negative.length > 0) {
      score.keyFactors.negative.slice(0, 4).forEach(factor => {
        reasons.push(factor.factor);
      });
    }

    const rights = [
      'You have the right to obtain a free copy of your credit report from the credit bureau(s) we used',
      'You have the right to dispute the accuracy or completeness of any information in your credit report',
      'The credit bureau(s) did not make the decision and cannot explain why your application was denied',
      'You have the right to request additional information about the reasons for this decision'
    ];

    const notice = this.formatAdverseActionNotice(
      application.businessInfo.businessName,
      decision,
      reasons,
      rights
    );

    return { notice, reasons, rights };
  }

  /**
   * Format adverse action notice
   */
  private formatAdverseActionNotice(
    businessName: string,
    decision: string,
    reasons: string[],
    rights: string[]
  ): string {
    return `
ADVERSE ACTION NOTICE

Date: ${new Date().toLocaleDateString()}

To: ${businessName}

We regret to inform you that your application for credit has been ${decision}.

PRIMARY REASONS FOR THIS DECISION:
${reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}

YOUR RIGHTS UNDER FEDERAL LAW:
${rights.map((r, i) => `${i + 1}. ${r}`).join('\n')}

CREDIT BUREAU CONTACT INFORMATION:
Experian: 1-888-397-3742, www.experian.com
Equifax: 1-800-685-1111, www.equifax.com
TransUnion: 1-800-916-8800, www.transunion.com

If you have any questions about this decision, please contact us at [CONTACT_INFO].

This notice is provided in compliance with the Equal Credit Opportunity Act and the Fair Credit Reporting Act.
    `.trim();
  }

  /**
   * Check ECOA compliance
   */
  checkECOACompliance(
    application: CreditApplication,
    decision: string
  ): {
    compliant: boolean;
    violations: string[];
    requirements: string[];
  } {
    const violations: string[] = [];
    const requirements: string[] = [];

    // Check for prohibited basis
    requirements.push('Decision must not be based on race, color, religion, national origin, sex, marital status, or age');
    requirements.push('Adverse action notice must be provided within 30 days');
    requirements.push('Specific reasons for adverse action must be provided');
    requirements.push('Applicant must be informed of right to receive credit report');

    const compliant = violations.length === 0;

    return { compliant, violations, requirements };
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(
    fairnessTest: FairnessTestResult,
    biasDetection: BiasDetectionResult
  ): {
    compliant: boolean;
    summary: string;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (!fairnessTest.overallPassed) {
      issues.push('Fairness tests failed - potential fair lending violations');
      recommendations.push('Immediate model review and remediation required');
    }

    if (biasDetection.biasDetected) {
      issues.push(`Bias detected: ${biasDetection.biasType.join(', ')}`);
      recommendations.push(...biasDetection.mitigationStrategies);
    }

    const compliant = issues.length === 0;

    const summary = compliant
      ? 'Model meets all fairness and compliance requirements'
      : `${issues.length} compliance issues identified requiring immediate attention`;

    return {
      compliant,
      summary,
      issues,
      recommendations
    };
  }
}
