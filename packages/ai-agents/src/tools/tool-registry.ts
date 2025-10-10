import { Tool, UserType } from '../types';
import { FinancialCalculator } from './calculator';
import { DataAnalyzer } from './data-analyzer';
import { DocumentProcessor } from './document-processor';
import { ChartGenerator } from './chart-generator';

export class ToolRegistry {
  private tools: Map<string, Tool>;
  private userTypeTools: Map<UserType, string[]>;

  constructor() {
    this.tools = new Map();
    this.userTypeTools = new Map();
    this.registerTools();
  }

  private registerTools(): void {
    const calculator = new FinancialCalculator();
    const analyzer = new DataAnalyzer();
    const docProcessor = new DocumentProcessor();
    const chartGen = new ChartGenerator();

    // Register all tools
    this.registerTool(calculator.getTool());
    this.registerTool(analyzer.getTool());
    this.registerTool(docProcessor.getTool());
    this.registerTool(chartGen.getTool());

    // Map tools to user types
    this.userTypeTools.set(UserType.ENTREPRENEUR, [
      'financial_calculator',
      'data_analyzer',
      'document_processor',
      'chart_generator'
    ]);

    this.userTypeTools.set(UserType.INVESTOR, [
      'financial_calculator',
      'data_analyzer',
      'document_processor',
      'chart_generator'
    ]);

    this.userTypeTools.set(UserType.LENDER, [
      'financial_calculator',
      'data_analyzer',
      'document_processor'
    ]);

    this.userTypeTools.set(UserType.GRANTOR, [
      'data_analyzer',
      'document_processor',
      'chart_generator'
    ]);

    this.userTypeTools.set(UserType.PARTNER, [
      'data_analyzer',
      'chart_generator'
    ]);
  }

  registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getToolsForUserType(userType: UserType): Tool[] {
    const toolNames = this.userTypeTools.get(userType) || [];
    return toolNames
      .map(name => this.tools.get(name))
      .filter(tool => tool !== undefined) as Tool[];
  }

  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }
}