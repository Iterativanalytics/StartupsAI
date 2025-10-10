import { Tool, AgentContext } from '../types';

export class DataAnalyzer {
  getTool(): Tool {
    return {
      name: 'data_analyzer',
      description: 'Analyzes datasets to extract insights, trends, and patterns.',
      parameters: {
        data: {
          type: 'array',
          description: 'Array of data points to analyze'
        },
        analysisType: {
          type: 'string',
          enum: ['trend', 'distribution', 'correlation', 'summary', 'outliers'],
          description: 'Type of analysis to perform'
        }
      },
      execute: this.execute.bind(this)
    };
  }

  async execute(params: any, context: AgentContext): Promise<any> {
    const { data, analysisType } = params;

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    switch (analysisType) {
      case 'trend':
        return this.analyzeTrend(data);
      case 'distribution':
        return this.analyzeDistribution(data);
      case 'correlation':
        return this.analyzeCorrelation(data);
      case 'summary':
        return this.generateSummary(data);
      case 'outliers':
        return this.detectOutliers(data);
      default:
        return this.generateSummary(data);
    }
  }

  private analyzeTrend(data: any[]): any {
    if (data.length < 2) {
      return { trend: 'insufficient_data' };
    }

    const values = data.map(d => typeof d === 'number' ? d : d.value);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = this.average(firstHalf);
    const secondAvg = this.average(secondHalf);
    const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;

    return {
      trend: percentChange > 5 ? 'increasing' : percentChange < -5 ? 'decreasing' : 'stable',
      percentChange: percentChange.toFixed(2),
      firstPeriodAvg: firstAvg.toFixed(2),
      secondPeriodAvg: secondAvg.toFixed(2),
      dataPoints: values.length
    };
  }

  private analyzeDistribution(data: any[]): any {
    const values = data.map(d => typeof d === 'number' ? d : d.value);
    
    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = this.median(sorted);
    const mean = this.average(values);
    const stdDev = this.standardDeviation(values);

    return {
      min,
      max,
      median: median.toFixed(2),
      mean: mean.toFixed(2),
      standardDeviation: stdDev.toFixed(2),
      range: max - min,
      quartiles: {
        q1: this.percentile(sorted, 25).toFixed(2),
        q2: median.toFixed(2),
        q3: this.percentile(sorted, 75).toFixed(2)
      }
    };
  }

  private analyzeCorrelation(data: any[]): any {
    // Expects data in format [{ x, y }, ...]
    if (data.length < 2 || !data[0].x || !data[0].y) {
      return { error: 'Invalid data format for correlation' };
    }

    const xValues = data.map(d => d.x);
    const yValues = data.map(d => d.y);
    
    const correlation = this.pearsonCorrelation(xValues, yValues);

    return {
      correlation: correlation.toFixed(3),
      strength: Math.abs(correlation) > 0.7 ? 'strong' : 
               Math.abs(correlation) > 0.4 ? 'moderate' : 'weak',
      direction: correlation > 0 ? 'positive' : 'negative'
    };
  }

  private generateSummary(data: any[]): any {
    const values = data.map(d => typeof d === 'number' ? d : d.value);
    
    return {
      count: values.length,
      sum: values.reduce((a, b) => a + b, 0),
      average: this.average(values).toFixed(2),
      min: Math.min(...values),
      max: Math.max(...values),
      median: this.median(values).toFixed(2)
    };
  }

  private detectOutliers(data: any[]): any {
    const values = data.map(d => typeof d === 'number' ? d : d.value);
    const sorted = [...values].sort((a, b) => a - b);
    
    const q1 = this.percentile(sorted, 25);
    const q3 = this.percentile(sorted, 75);
    const iqr = q3 - q1;
    
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    const outliers = values.filter(v => v < lowerBound || v > upperBound);

    return {
      outliers,
      outlierCount: outliers.length,
      outlierPercentage: ((outliers.length / values.length) * 100).toFixed(2),
      lowerBound: lowerBound.toFixed(2),
      upperBound: upperBound.toFixed(2)
    };
  }

  private average(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private median(sorted: number[]): number {
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private percentile(sorted: number[], p: number): number {
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  private standardDeviation(values: number[]): number {
    const avg = this.average(values);
    const squareDiffs = values.map(v => Math.pow(v - avg, 2));
    return Math.sqrt(this.average(squareDiffs));
  }

  private pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sum_x = x.reduce((a, b) => a + b, 0);
    const sum_y = y.reduce((a, b) => a + b, 0);
    const sum_xy = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sum_x2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sum_y2 = y.reduce((acc, yi) => acc + yi * yi, 0);

    const numerator = n * sum_xy - sum_x * sum_y;
    const denominator = Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y));

    return denominator === 0 ? 0 : numerator / denominator;
  }
}