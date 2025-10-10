import { Tool, AgentContext } from '../types';

export class ChartGenerator {
  getTool(): Tool {
    return {
      name: 'chart_generator',
      description: 'Generates charts and visualizations from data.',
      parameters: {
        data: {
          type: 'array',
          description: 'Data to visualize'
        },
        chartType: {
          type: 'string',
          enum: ['line', 'bar', 'pie', 'scatter', 'area'],
          description: 'Type of chart to generate'
        },
        options: {
          type: 'object',
          description: 'Chart configuration options'
        }
      },
      execute: this.execute.bind(this)
    };
  }

  async execute(params: any, context: AgentContext): Promise<any> {
    const { data, chartType, options } = params;

    // In production, would generate actual chart specifications
    // for libraries like Chart.js, Recharts, etc.
    
    return {
      chartType,
      chartSpec: this.generateChartSpec(data, chartType, options),
      status: 'success'
    };
  }

  private generateChartSpec(data: any[], chartType: string, options: any): any {
    const baseSpec = {
      type: chartType,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options
      }
    };

    switch (chartType) {
      case 'line':
        return {
          ...baseSpec,
          options: {
            ...baseSpec.options,
            scales: {
              x: { type: 'linear' },
              y: { beginAtZero: true }
            }
          }
        };
      case 'bar':
        return {
          ...baseSpec,
          options: {
            ...baseSpec.options,
            scales: {
              y: { beginAtZero: true }
            }
          }
        };
      case 'pie':
        return {
          ...baseSpec,
          options: {
            ...baseSpec.options,
            plugins: {
              legend: { position: 'bottom' }
            }
          }
        };
      default:
        return baseSpec;
    }
  }
}