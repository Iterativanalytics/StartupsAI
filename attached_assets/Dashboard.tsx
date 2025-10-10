import React, { useState } from 'react';
import { BarChart2, TrendingUp, DollarSign, PieChart, ArrowUp, ArrowDown } from 'lucide-react';

interface FinancialMetric {
  label: string;
  value: string;
  benchmark: string;
  trend: number;
  chart: number[];
}

interface BalanceSheetItem {
  label: string;
  value: number;
  subItems?: { label: string; value: number }[];
}

function Dashboard() {
  const [timeRange, setTimeRange] = useState('2');
  const [dateRange, setDateRange] = useState('3/29/2021 - 3/29/2023');

  const metrics: FinancialMetric[] = [
    {
      label: 'Revenue',
      value: '3.62M',
      benchmark: 'Benchmark: 1.52M (+137.94%)',
      trend: 1,
      chart: [30, 40, 35, 45, 35, 55]
    },
    {
      label: 'COGS',
      value: '2.14M',
      benchmark: 'Benchmark: 1.52M (+137.94%)',
      trend: -1,
      chart: [45, 35, 40, 30, 35, 25]
    },
    {
      label: 'Gross Profit',
      value: '1.48M',
      benchmark: 'Benchmark: 0.46M (+219.4%)',
      trend: 1,
      chart: [25, 35, 45, 40, 45, 50]
    },
    {
      label: 'Net Profit',
      value: '0.57M',
      benchmark: 'Benchmark: -0.35M (+263.16%)',
      trend: 1,
      chart: [20, 25, 15, 35, 40, 45]
    }
  ];

  const balanceSheet = {
    assets: [
      {
        label: 'Current Assets',
        value: 25045853,
        subItems: [
          { label: 'Cash & Bank Balance', value: 785404 },
          { label: 'Account Receivables', value: 2721601 },
          { label: 'Deposits, Adv & Prepay', value: 2686247 },
          { label: 'Inventory', value: 221798 }
        ]
      }
    ],
    liabilities: [
      {
        label: 'Current Liabilities',
        value: 25045853,
        subItems: [
          { label: 'Wages Payable', value: 70234 },
          { label: 'Account Payables', value: 2721601 },
          { label: 'Prov & Accruals', value: 2439345 },
          { label: 'Other Payable', value: 1236240 }
        ]
      }
    ]
  };

  const insights = [
    "Between January 2022 and February 2023, Gross Profit Margin had the largest increase (17.757%) while COGS had the largest decrease (46.68%).",
    "Gross Profit Margin started trending up on November 2022, rising by 12.08% (0.04) in 3 months.",
    "OPEX jumped from 983,328.71 to 1,340,955.37 during its steepest incline between August 2022 and January 2023.",
    "We found two anomalies, a high for OPEX on December 2022 (2,395,911.48) and a low for Net Profit Margin on April 2022 (-0.851).",
    "The most recent anomaly was in December 2022, when OPEX had a high value of 2,395,911.48.",
    "Revenue experienced the longest period of growth (+626,542) between Friday, July 1, 2022 and Thursday, December 1, 2022."
  ];

  const renderSparkline = (data: number[]) => (
    <svg className="w-24 h-12" viewBox="0 0 100 50">
      <path
        d={`M ${data.map((d, i) => `${(i * 100) / (data.length - 1)},${50 - d}`).join(' L ')}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );

  const renderGauge = (value: number) => (
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="32"
          cx="40"
          cy="40"
        />
        <circle
          className="text-blue-600"
          strokeWidth="8"
          strokeDasharray={201.06}
          strokeDashoffset={201.06 - (value / 100) * 201.06}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="32"
          cx="40"
          cy="40"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-sm font-semibold">{value}%</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Last</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <select
              className="border rounded px-2 py-1"
              defaultValue="Years"
            >
              <option>Years</option>
              <option>Months</option>
            </select>
          </div>
          <span className="text-sm text-gray-600">{dateRange}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-600">{metric.label}</h3>
              {metric.trend > 0 ? (
                <ArrowUp className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                <p className="text-sm text-gray-500">{metric.benchmark}</p>
              </div>
              <div className="text-gray-400">
                {renderSparkline(metric.chart)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Ratios */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Ratios</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              {renderGauge(40.83)}
              <p className="mt-2 text-sm text-gray-600">Gross Profit Margin</p>
            </div>
            <div className="text-center">
              {renderGauge(25.01)}
              <p className="mt-2 text-sm text-gray-600">Operating Expense Ratio</p>
            </div>
            <div className="text-center">
              {renderGauge(15.82)}
              <p className="mt-2 text-sm text-gray-600">Net Profit Margin</p>
            </div>
          </div>
        </div>

        {/* Smart Insights */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Smart Insights</h2>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Balance Sheet */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Balance Sheet</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assets */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Total Assets</h3>
            {balanceSheet.assets.map((section) => (
              <div key={section.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{section.label}</span>
                  <span className="font-medium">${section.value.toLocaleString()}</span>
                </div>
                <div className="pl-4 space-y-1">
                  {section.subItems?.map((item) => (
                    <div key={item.label} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{item.label}</span>
                      <span>${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Liabilities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Total Liabilities</h3>
            {balanceSheet.liabilities.map((section) => (
              <div key={section.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{section.label}</span>
                  <span className="font-medium">${section.value.toLocaleString()}</span>
                </div>
                <div className="pl-4 space-y-1">
                  {section.subItems?.map((item) => (
                    <div key={item.label} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{item.label}</span>
                      <span>${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;