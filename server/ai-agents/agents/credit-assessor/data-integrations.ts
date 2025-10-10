// ============================================================================
// Data Integration Services
// Credit Bureaus, Banking, Accounting Software Integrations
// ============================================================================

import axios, { AxiosInstance } from 'axios';
import { CreditApplication, TraditionalCreditData, FinancialData, AlternativeData } from './types';

// ===========================
// CREDIT BUREAU INTEGRATIONS
// ===========================

export class ExperianBusinessAPI {
  private client: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, sandbox: boolean = false) {
    this.apiKey = apiKey;
    this.baseUrl = sandbox 
      ? 'https://sandbox.experian.com/businessinformation/businesses/v1'
      : 'https://api.experian.com/businessinformation/businesses/v1';
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getBusinessCredit(bin: string): Promise<any> {
    try {
      const response = await this.client.get(`/search`, {
        params: {
          bin: bin,
          subcode: '0563736',
          modelCode: 'INTELLISCORE_PLUS'
        }
      });

      return this.parseExperianResponse(response.data);
    } catch (error) {
      console.error('Experian API Error:', error);
      throw new Error('Failed to fetch Experian business credit data');
    }
  }

  async getPersonalCredit(ssn: string, permissiblePurpose: string): Promise<any> {
    try {
      const response = await this.client.post('/credit-profile', {
        ssn: this.encryptSSN(ssn),
        permissiblePurpose: permissiblePurpose,
        includeScores: true,
        includeTradelines: true
      });

      return this.parsePersonalCreditResponse(response.data);
    } catch (error) {
      console.error('Experian Personal Credit API Error:', error);
      throw new Error('Failed to fetch personal credit data');
    }
  }

  private parseExperianResponse(data: any): any {
    return {
      businessCreditScore: data.businessHeader?.intelliscorePlus?.score || 0,
      paydexScore: data.businessHeader?.paydex || 0,
      tradelines: data.tradelines?.map((t: any) => ({
        creditor: t.businessName,
        accountType: t.accountType,
        balance: t.currentBalance,
        highCredit: t.highCredit,
        paymentStatus: t.paymentStatus,
        monthsHistory: t.monthsReviewed
      })) || [],
      publicRecords: {
        bankruptcies: data.publicRecords?.bankruptcies?.length || 0,
        liens: data.publicRecords?.liens?.length || 0,
        judgments: data.publicRecords?.judgments?.length || 0,
        uccFilings: data.publicRecords?.uccFilings?.length || 0
      },
      inquiries: data.inquiries?.length || 0
    };
  }

  private parsePersonalCreditResponse(data: any): any {
    return {
      ficoScore: data.scores?.fico8 || 0,
      vantageScore: data.scores?.vantageScore3 || 0,
      paymentHistory: data.tradelines || [],
      creditUtilization: data.utilization?.percentage || 0,
      derogatoryMarks: data.derogatory?.count || 0,
      inquiries: data.inquiries?.hard?.length || 0
    };
  }

  private encryptSSN(ssn: string): string {
    // Implement proper encryption
    return Buffer.from(ssn).toString('base64');
  }
}

export class DunBradstreetAPI {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string, sandbox: boolean = false) {
    this.apiKey = apiKey;
    const baseUrl = sandbox
      ? 'https://plus.sandbox.dnb.com/v1'
      : 'https://plus.dnb.com/v1';

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getBusinessCredit(dunsNumber: string): Promise<any> {
    try {
      const response = await this.client.get(`/data/duns/${dunsNumber}`, {
        params: {
          productId: 'cmpelk',
          versionId: 'v1',
          tradeUp: 'hq'
        }
      });

      return this.parseDnBResponse(response.data);
    } catch (error) {
      console.error('D&B API Error:', error);
      throw new Error('Failed to fetch D&B business data');
    }
  }

  async getPaydexScore(dunsNumber: string): Promise<number> {
    try {
      const response = await this.client.get(`/data/duns/${dunsNumber}`, {
        params: {
          productId: 'paydex',
          versionId: 'v1'
        }
      });

      return response.data.organization?.paydexScore || 0;
    } catch (error) {
      console.error('D&B Paydex API Error:', error);
      return 0;
    }
  }

  private parseDnBResponse(data: any): any {
    const org = data.organization;
    return {
      dunsNumber: org.duns,
      businessName: org.primaryName,
      paydexScore: org.paydexScore || 0,
      creditScore: org.dnbRating?.rating || 0,
      yearsInBusiness: org.startDate ? this.calculateYears(org.startDate) : 0,
      employeeCount: org.numberOfEmployees?.[0]?.value || 0,
      annualRevenue: org.financials?.[0]?.yearlyRevenue?.[0]?.value || 0,
      tradelines: org.tradePaymentExperiences || []
    };
  }

  private calculateYears(startDate: string): number {
    const start = new Date(startDate);
    const now = new Date();
    return (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
  }
}

export class EquifaxBusinessAPI {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string, sandbox: boolean = false) {
    this.apiKey = apiKey;
    const baseUrl = sandbox
      ? 'https://api-sandbox.equifax.com/business/commercial-credit/v1'
      : 'https://api.equifax.com/business/commercial-credit/v1';

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getBusinessCredit(ein: string): Promise<any> {
    try {
      const response = await this.client.post('/reports', {
        taxId: ein,
        reportType: 'BUSINESS_CREDIT_REPORT'
      });

      return this.parseEquifaxResponse(response.data);
    } catch (error) {
      console.error('Equifax API Error:', error);
      throw new Error('Failed to fetch Equifax business data');
    }
  }

  private parseEquifaxResponse(data: any): any {
    return {
      businessCreditScore: data.creditScore?.score || 0,
      paymentIndex: data.paymentIndex || 0,
      tradelines: data.tradelines || [],
      publicRecords: data.publicRecords || [],
      inquiries: data.inquiries || []
    };
  }
}

// ===========================
// BANKING DATA INTEGRATIONS
// ===========================

export class PlaidBankingAPI {
  private client: AxiosInstance;
  private clientId: string;
  private secret: string;

  constructor(clientId: string, secret: string, environment: 'sandbox' | 'development' | 'production' = 'sandbox') {
    this.clientId = clientId;
    this.secret = secret;

    const baseUrls = {
      sandbox: 'https://sandbox.plaid.com',
      development: 'https://development.plaid.com',
      production: 'https://production.plaid.com'
    };

    this.client = axios.create({
      baseURL: baseUrls[environment],
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getTransactions(accessToken: string, startDate: string, endDate: string): Promise<any> {
    try {
      const response = await this.client.post('/transactions/get', {
        client_id: this.clientId,
        secret: this.secret,
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate
      });

      return this.parseTransactions(response.data);
    } catch (error) {
      console.error('Plaid Transactions API Error:', error);
      throw new Error('Failed to fetch banking transactions');
    }
  }

  async getBalance(accessToken: string): Promise<any> {
    try {
      const response = await this.client.post('/accounts/balance/get', {
        client_id: this.clientId,
        secret: this.secret,
        access_token: accessToken
      });

      return this.parseBalances(response.data);
    } catch (error) {
      console.error('Plaid Balance API Error:', error);
      throw new Error('Failed to fetch account balances');
    }
  }

  async getCashFlow(accessToken: string): Promise<any> {
    try {
      const response = await this.client.post('/beta/transactions/cashflow/get', {
        client_id: this.clientId,
        secret: this.secret,
        access_token: accessToken
      });

      return this.parseCashFlow(response.data);
    } catch (error) {
      console.error('Plaid Cash Flow API Error:', error);
      throw new Error('Failed to fetch cash flow data');
    }
  }

  private parseTransactions(data: any): any {
    const transactions = data.transactions;
    
    const deposits = transactions.filter((t: any) => t.amount < 0);
    const withdrawals = transactions.filter((t: any) => t.amount > 0);

    return {
      totalTransactions: transactions.length,
      deposits: {
        count: deposits.length,
        total: Math.abs(deposits.reduce((sum: number, t: any) => sum + t.amount, 0)),
        average: deposits.length > 0 ? Math.abs(deposits.reduce((sum: number, t: any) => sum + t.amount, 0) / deposits.length) : 0
      },
      withdrawals: {
        count: withdrawals.length,
        total: withdrawals.reduce((sum: number, t: any) => sum + t.amount, 0),
        average: withdrawals.length > 0 ? withdrawals.reduce((sum: number, t: any) => sum + t.amount, 0) / withdrawals.length : 0
      },
      transactions: transactions
    };
  }

  private parseBalances(data: any): any {
    const accounts = data.accounts;
    
    return {
      accounts: accounts.map((acc: any) => ({
        accountId: acc.account_id,
        name: acc.name,
        type: acc.type,
        subtype: acc.subtype,
        currentBalance: acc.balances.current,
        availableBalance: acc.balances.available,
        limit: acc.balances.limit
      })),
      totalBalance: accounts.reduce((sum: number, acc: any) => sum + (acc.balances.current || 0), 0)
    };
  }

  private parseCashFlow(data: any): any {
    const cashFlow = data.cash_flow_insights;
    
    return {
      operatingCashFlow: cashFlow.operating_cash_flow,
      cashFlowVolatility: cashFlow.cash_flow_volatility,
      averageMonthlyInflow: cashFlow.average_monthly_inflow,
      averageMonthlyOutflow: cashFlow.average_monthly_outflow,
      netCashFlow: cashFlow.net_cash_flow,
      burnRate: cashFlow.burn_rate,
      runwayMonths: cashFlow.runway_months
    };
  }
}

export class YodleeBankingAPI {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string, sandbox: boolean = false) {
    this.apiKey = apiKey;
    const baseUrl = sandbox
      ? 'https://sandbox.api.yodlee.com/ysl'
      : 'https://production.api.yodlee.com/ysl';

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Api-Version': '1.1',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getAccounts(userToken: string): Promise<any> {
    try {
      const response = await this.client.get('/accounts', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      return response.data.account || [];
    } catch (error) {
      console.error('Yodlee Accounts API Error:', error);
      throw new Error('Failed to fetch Yodlee accounts');
    }
  }

  async getTransactions(userToken: string, fromDate: string, toDate: string): Promise<any> {
    try {
      const response = await this.client.get('/transactions', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        params: {
          fromDate,
          toDate
        }
      });

      return response.data.transaction || [];
    } catch (error) {
      console.error('Yodlee Transactions API Error:', error);
      throw new Error('Failed to fetch Yodlee transactions');
    }
  }
}

// ===========================
// ACCOUNTING SOFTWARE INTEGRATIONS
// ===========================

export class QuickBooksAPI {
  private client: AxiosInstance;
  private accessToken: string;
  private realmId: string;

  constructor(accessToken: string, realmId: string, sandbox: boolean = false) {
    this.accessToken = accessToken;
    this.realmId = realmId;

    const baseUrl = sandbox
      ? 'https://sandbox-quickbooks.api.intuit.com/v3'
      : 'https://quickbooks.api.intuit.com/v3';

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  async getProfitAndLoss(startDate: string, endDate: string): Promise<any> {
    try {
      const response = await this.client.get(`/company/${this.realmId}/reports/ProfitAndLoss`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          accounting_method: 'Accrual'
        }
      });

      return this.parseProfitAndLoss(response.data);
    } catch (error) {
      console.error('QuickBooks P&L API Error:', error);
      throw new Error('Failed to fetch Profit & Loss statement');
    }
  }

  async getBalanceSheet(asOfDate: string): Promise<any> {
    try {
      const response = await this.client.get(`/company/${this.realmId}/reports/BalanceSheet`, {
        params: {
          date: asOfDate
        }
      });

      return this.parseBalanceSheet(response.data);
    } catch (error) {
      console.error('QuickBooks Balance Sheet API Error:', error);
      throw new Error('Failed to fetch Balance Sheet');
    }
  }

  async getCashFlow(startDate: string, endDate: string): Promise<any> {
    try {
      const response = await this.client.get(`/company/${this.realmId}/reports/CashFlow`, {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });

      return this.parseCashFlow(response.data);
    } catch (error) {
      console.error('QuickBooks Cash Flow API Error:', error);
      throw new Error('Failed to fetch Cash Flow statement');
    }
  }

  private parseProfitAndLoss(data: any): any {
    const rows = data.Rows?.Row || [];
    
    return {
      revenue: this.extractValue(rows, 'Total Income'),
      cogs: this.extractValue(rows, 'Cost of Goods Sold'),
      grossProfit: this.extractValue(rows, 'Gross Profit'),
      operatingExpenses: this.extractValue(rows, 'Total Expenses'),
      netIncome: this.extractValue(rows, 'Net Income'),
      period: {
        start: data.Header?.StartPeriod,
        end: data.Header?.EndPeriod
      }
    };
  }

  private parseBalanceSheet(data: any): any {
    const rows = data.Rows?.Row || [];
    
    return {
      assets: {
        current: this.extractValue(rows, 'Total Current Assets'),
        fixed: this.extractValue(rows, 'Total Fixed Assets'),
        total: this.extractValue(rows, 'Total Assets')
      },
      liabilities: {
        current: this.extractValue(rows, 'Total Current Liabilities'),
        longTerm: this.extractValue(rows, 'Total Long-Term Liabilities'),
        total: this.extractValue(rows, 'Total Liabilities')
      },
      equity: this.extractValue(rows, 'Total Equity'),
      asOfDate: data.Header?.ReportBasis
    };
  }

  private parseCashFlow(data: any): any {
    const rows = data.Rows?.Row || [];
    
    return {
      operatingActivities: this.extractValue(rows, 'Net Cash Provided by Operating Activities'),
      investingActivities: this.extractValue(rows, 'Net Cash Provided by Investing Activities'),
      financingActivities: this.extractValue(rows, 'Net Cash Provided by Financing Activities'),
      netChange: this.extractValue(rows, 'Net Cash Increase for Period')
    };
  }

  private extractValue(rows: any[], label: string): number {
    const row = rows.find((r: any) => 
      r.Header?.ColData?.[0]?.value === label ||
      r.Summary?.ColData?.[0]?.value === label
    );
    
    return parseFloat(row?.Summary?.ColData?.[1]?.value || row?.ColData?.[1]?.value || '0');
  }
}

export class XeroAPI {
  private client: AxiosInstance;
  private accessToken: string;
  private tenantId: string;

  constructor(accessToken: string, tenantId: string) {
    this.accessToken = accessToken;
    this.tenantId = tenantId;

    this.client = axios.create({
      baseURL: 'https://api.xero.com/api.xro/2.0',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'xero-tenant-id': tenantId,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  async getProfitAndLoss(fromDate: string, toDate: string): Promise<any> {
    try {
      const response = await this.client.get('/Reports/ProfitAndLoss', {
        params: {
          fromDate,
          toDate
        }
      });

      return this.parseXeroReport(response.data.Reports[0]);
    } catch (error) {
      console.error('Xero P&L API Error:', error);
      throw new Error('Failed to fetch Xero Profit & Loss');
    }
  }

  async getBalanceSheet(asOfDate: string): Promise<any> {
    try {
      const response = await this.client.get('/Reports/BalanceSheet', {
        params: {
          date: asOfDate
        }
      });

      return this.parseXeroReport(response.data.Reports[0]);
    } catch (error) {
      console.error('Xero Balance Sheet API Error:', error);
      throw new Error('Failed to fetch Xero Balance Sheet');
    }
  }

  private parseXeroReport(report: any): any {
    // Xero report parsing logic
    return {
      reportName: report.ReportName,
      reportDate: report.ReportDate,
      rows: report.Rows
    };
  }
}

// ===========================
// DATA ORCHESTRATOR
// ===========================

export class DataIntegrationOrchestrator {
  private experianAPI?: ExperianBusinessAPI;
  private dnbAPI?: DunBradstreetAPI;
  private equifaxAPI?: EquifaxBusinessAPI;
  private plaidAPI?: PlaidBankingAPI;
  private yodleeAPI?: YodleeBankingAPI;
  private quickbooksAPI?: QuickBooksAPI;
  private xeroAPI?: XeroAPI;

  constructor(config: {
    experian?: { apiKey: string; sandbox?: boolean };
    dnb?: { apiKey: string; sandbox?: boolean };
    equifax?: { apiKey: string; sandbox?: boolean };
    plaid?: { clientId: string; secret: string; environment?: 'sandbox' | 'development' | 'production' };
    yodlee?: { apiKey: string; sandbox?: boolean };
    quickbooks?: { accessToken: string; realmId: string; sandbox?: boolean };
    xero?: { accessToken: string; tenantId: string };
  }) {
    if (config.experian) {
      this.experianAPI = new ExperianBusinessAPI(config.experian.apiKey, config.experian.sandbox);
    }
    if (config.dnb) {
      this.dnbAPI = new DunBradstreetAPI(config.dnb.apiKey, config.dnb.sandbox);
    }
    if (config.equifax) {
      this.equifaxAPI = new EquifaxBusinessAPI(config.equifax.apiKey, config.equifax.sandbox);
    }
    if (config.plaid) {
      this.plaidAPI = new PlaidBankingAPI(config.plaid.clientId, config.plaid.secret, config.plaid.environment);
    }
    if (config.yodlee) {
      this.yodleeAPI = new YodleeBankingAPI(config.yodlee.apiKey, config.yodlee.sandbox);
    }
    if (config.quickbooks) {
      this.quickbooksAPI = new QuickBooksAPI(
        config.quickbooks.accessToken,
        config.quickbooks.realmId,
        config.quickbooks.sandbox
      );
    }
    if (config.xero) {
      this.xeroAPI = new XeroAPI(config.xero.accessToken, config.xero.tenantId);
    }
  }

  async collectAllData(businessId: string, tokens: {
    bin?: string;
    dunsNumber?: string;
    ein?: string;
    ssn?: string;
    plaidAccessToken?: string;
    yodleeUserToken?: string;
  }): Promise<Partial<CreditApplication>> {
    const tasks = [];

    // Collect credit bureau data
    if (this.experianAPI && tokens.bin) {
      tasks.push(
        this.experianAPI.getBusinessCredit(tokens.bin)
          .catch(err => ({ error: 'Experian failed', details: err.message }))
      );
    }

    if (this.dnbAPI && tokens.dunsNumber) {
      tasks.push(
        this.dnbAPI.getBusinessCredit(tokens.dunsNumber)
          .catch(err => ({ error: 'D&B failed', details: err.message }))
      );
    }

    if (this.equifaxAPI && tokens.ein) {
      tasks.push(
        this.equifaxAPI.getBusinessCredit(tokens.ein)
          .catch(err => ({ error: 'Equifax failed', details: err.message }))
      );
    }

    // Collect banking data
    if (this.plaidAPI && tokens.plaidAccessToken) {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      tasks.push(
        this.plaidAPI.getTransactions(tokens.plaidAccessToken, startDate, endDate)
          .catch(err => ({ error: 'Plaid failed', details: err.message }))
      );
      
      tasks.push(
        this.plaidAPI.getCashFlow(tokens.plaidAccessToken)
          .catch(err => ({ error: 'Plaid Cash Flow failed', details: err.message }))
      );
    }

    // Collect accounting data
    if (this.quickbooksAPI) {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      tasks.push(
        this.quickbooksAPI.getProfitAndLoss(startDate, endDate)
          .catch(err => ({ error: 'QuickBooks P&L failed', details: err.message }))
      );
      
      tasks.push(
        this.quickbooksAPI.getBalanceSheet(endDate)
          .catch(err => ({ error: 'QuickBooks Balance Sheet failed', details: err.message }))
      );
    }

    const results = await Promise.all(tasks);

    return this.mergeDataSources(results);
  }

  private mergeDataSources(results: any[]): Partial<CreditApplication> {
    const merged: Partial<CreditApplication> = {
      traditionalCredit: {} as TraditionalCreditData,
      financialData: {} as FinancialData,
      alternativeData: {} as AlternativeData
    };

    // Merge logic here - combine data from different sources
    // This would involve intelligent merging of overlapping data points

    return merged;
  }
}
