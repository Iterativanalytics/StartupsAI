import { Tool, AgentContext } from '../types';

export class FinancialCalculator {
  getTool(): Tool {
    return {
      name: 'financial_calculator',
      description: 'Performs financial calculations including valuation, runway, burn rate, ROI, DSCR, and more.',
      parameters: {
        calculation: {
          type: 'string',
          enum: ['valuation', 'runway', 'burn_rate', 'roi', 'dscr', 'ltv', 'cac', 'clv'],
          description: 'Type of calculation to perform'
        },
        inputs: {
          type: 'object',
          description: 'Input parameters for the calculation'
        }
      },
      execute: this.execute.bind(this)
    };
  }

  async execute(params: any, context: AgentContext): Promise<any> {
    const { calculation, inputs } = params;

    switch (calculation) {
      case 'valuation':
        return this.calculateValuation(inputs);
      case 'runway':
        return this.calculateRunway(inputs);
      case 'burn_rate':
        return this.calculateBurnRate(inputs);
      case 'roi':
        return this.calculateROI(inputs);
      case 'dscr':
        return this.calculateDSCR(inputs);
      case 'ltv':
        return this.calculateLTV(inputs);
      case 'cac':
        return this.calculateCAC(inputs);
      case 'clv':
        return this.calculateCLV(inputs);
      default:
        throw new Error(`Unknown calculation type: ${calculation}`);
    }
  }

  private calculateValuation(inputs: any): any {
    const { revenue, multiple, method } = inputs;

    if (method === 'revenue_multiple') {
      return {
        valuation: revenue * multiple,
        method: 'Revenue Multiple',
        assumptions: `${multiple}x revenue multiple`,
        result: `$${(revenue * multiple).toLocaleString()}`
      };
    }

    // Add other valuation methods (DCF, comparables, etc.)
    return { error: 'Valuation method not implemented' };
  }

  private calculateRunway(inputs: any): any {
    const { cash, monthlyBurn } = inputs;
    const runway = cash / monthlyBurn;

    return {
      runway: runway,
      runwayMonths: Math.floor(runway),
      status: runway < 6 ? 'critical' : runway < 12 ? 'warning' : 'healthy',
      recommendation: runway < 6 
        ? 'Start fundraising immediately'
        : runway < 12
        ? 'Begin fundraising conversations'
        : 'Good runway, focus on growth',
      result: `${Math.floor(runway)} months`
    };
  }

  private calculateBurnRate(inputs: any): any {
    const { expenses, revenue, period } = inputs;
    const burn = (expenses - revenue) / (period || 1);

    return {
      burnRate: burn,
      monthlyBurn: burn,
      annualBurn: burn * 12,
      status: burn > 100000 ? 'high' : burn > 50000 ? 'moderate' : 'low',
      result: `$${burn.toLocaleString()}/month`
    };
  }

  private calculateROI(inputs: any): any {
    const { investment, returns } = inputs;
    const roi = ((returns - investment) / investment) * 100;

    return {
      roi: roi,
      multiple: returns / investment,
      status: roi > 100 ? 'excellent' : roi > 50 ? 'good' : roi > 0 ? 'positive' : 'negative',
      result: `${roi.toFixed(2)}%`
    };
  }

  private calculateDSCR(inputs: any): any {
    const { operatingIncome, debtService } = inputs;
    const dscr = operatingIncome / debtService;

    return {
      dscr: dscr,
      status: dscr > 1.25 ? 'healthy' : dscr > 1.0 ? 'acceptable' : 'risky',
      recommendation: dscr < 1.25
        ? 'Consider restructuring debt or increasing income'
        : 'Debt coverage is adequate',
      result: dscr.toFixed(2)
    };
  }

  private calculateLTV(inputs: any): any {
    const { loanAmount, collateralValue } = inputs;
    const ltv = (loanAmount / collateralValue) * 100;

    return {
      ltv: ltv,
      status: ltv > 80 ? 'high_risk' : ltv > 60 ? 'moderate' : 'low_risk',
      recommendation: ltv > 80
        ? 'Consider reducing loan amount or increasing collateral'
        : 'LTV within acceptable range',
      result: `${ltv.toFixed(1)}%`
    };
  }

  private calculateCAC(inputs: any): any {
    const { marketingSpend, customersAcquired } = inputs;
    const cac = marketingSpend / customersAcquired;

    return {
      cac: cac,
      annualCAC: cac * 12,
      result: `$${cac.toFixed(2)}`
    };
  }

  private calculateCLV(inputs: any): any {
    const { avgRevenue, avgLifetime, grossMargin } = inputs;
    const clv = avgRevenue * avgLifetime * (grossMargin || 0.7);

    return {
      clv: clv,
      clvCacRatio: inputs.cac ? clv / inputs.cac : null,
      status: inputs.cac && (clv / inputs.cac) > 3 ? 'healthy' : 'needs_improvement',
      result: `$${clv.toFixed(2)}`
    };
  }
}