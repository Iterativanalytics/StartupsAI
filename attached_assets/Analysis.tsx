import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Award,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  BarChart2,
  Briefcase,
  FileText,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface MetricScore {
  label: string;
  value: number;
}

interface FoundingTeam {
  role: string;
  experience: string;
  connections: number;
  skills: string[];
  qualifications: string[];
}

function Analysis() {
  const { id } = useParams();

  // Mock data - would come from API/database in production
  const analysis = {
    totalScore: 92.22,
    ranking: 13,
    companyValue: 2500000,
    businessPlan: {
      spelling: 94.38,
      structure: 79.50,
      deckLength: 92.80,
      clarity: 74.49,
      totalScore: 85.68
    },
    businessProfile: {
      foundingTeam: 100.00,
      market: 100.00,
      product: 75.00,
      traction: 80.00,
      totalScore: 94.50
    },
    startupSummary: {
      name: "Business Sense University",
      email: "info@bsense.co.za",
      description: "A virtual university offering interactive and collaborative online learning."
    },
    foundingTeam: {
      members: ["CEO", "CFO", "CIO", "CTO"],
      experience: "10 years",
      connections: 1700,
      skills: ["Leadership", "Finance", "Technology", "Operations"],
      qualifications: ["MBA", "CFA", "PhD", "MSc"]
    },
    metrics: {
      grossProfitMargin: 40.83,
      operatingExpenseRatio: 25.01,
      netProfitMargin: 15.82
    }
  };

  const renderMetricGauge = (value: number, label: string) => (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="48"
            cy="48"
          />
          <circle
            className="text-blue-600"
            strokeWidth="8"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (value / 100) * 251.2}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="48"
            cy="48"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-xl font-bold">{value}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm text-gray-600">{label}</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Scoring & Ranking</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Score</span>
              <span className="text-3xl font-bold text-blue-600">{analysis.totalScore}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Your Ranking</span>
              <div className="text-right">
                <span className="text-3xl font-bold text-blue-600">#{analysis.ranking}</span>
                <p className="text-sm text-gray-500">(top 5% of startups)</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Company Value</span>
              <span className="text-3xl font-bold text-blue-600">
                ${(analysis.companyValue / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Business Plan Analysis</h2>
          <div className="space-y-4">
            {Object.entries(analysis.businessPlan).map(([key, value]) => (
              key !== 'totalScore' && (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex items-center">
                    <div className="w-48 h-2 bg-gray-200 rounded-full mr-3">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-gray-800 font-medium">{value}</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Business Profile</h2>
          <div className="space-y-4">
            {Object.entries(analysis.businessProfile).map(([key, value]) => (
              key !== 'totalScore' && (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex items-center">
                    <div className="w-48 h-2 bg-gray-200 rounded-full mr-3">
                      <div
                        className="h-2 bg-green-600 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-gray-800 font-medium">{value}</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Founding Team & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Founding Team</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {analysis.foundingTeam.members.map((member) => (
                <span key={member} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {member}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-medium">{analysis.foundingTeam.experience}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">Network</p>
                <p className="font-medium">{analysis.foundingTeam.connections} connections</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Metrics</h2>
          <div className="grid grid-cols-3 gap-4">
            {renderMetricGauge(analysis.metrics.grossProfitMargin, 'Gross Profit Margin')}
            {renderMetricGauge(analysis.metrics.operatingExpenseRatio, 'Operating Expense Ratio')}
            {renderMetricGauge(analysis.metrics.netProfitMargin, 'Net Profit Margin')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analysis;