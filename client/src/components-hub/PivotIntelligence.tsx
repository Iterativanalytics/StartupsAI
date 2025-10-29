import React, { useState } from 'react';
import { 
  GitBranch, 
  Target, 
  Users, 
  DollarSign, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Settings,
  Globe,
  Heart,
  Shield,
  Lightbulb,
  BarChart3
} from 'lucide-react';

interface PivotType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  whenToUse: string[];
  examples: string[];
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  risk: 'low' | 'medium' | 'high';
}

interface PivotRecommendation {
  type: PivotType;
  confidence: number;
  reasoning: string;
  nextSteps: string[];
  timeline: string;
  resources: string[];
}

const PIVOT_TYPES: PivotType[] = [
  {
    id: 'zoom-in',
    name: 'Zoom-In Pivot',
    description: 'Take a single feature and make it the whole product',
    icon: Target,
    color: 'bg-blue-500',
    whenToUse: ['One feature is getting all the traction', 'Product is too complex', 'Users only use one part'],
    examples: ['Instagram (from Burbn)', 'Twitter (from Odeo)', 'Flickr (from Game Neverending)'],
    impact: 'high',
    effort: 'medium',
    risk: 'low'
  },
  {
    id: 'zoom-out',
    name: 'Zoom-Out Pivot',
    description: 'The product becomes a feature of a larger product',
    icon: Globe,
    color: 'bg-green-500',
    whenToUse: ['Current product is too narrow', 'Need broader market', 'Feature works but needs context'],
    examples: ['PayPal (from Confinity)', 'YouTube (from dating site)', 'Slack (from game)'],
    impact: 'high',
    effort: 'high',
    risk: 'medium'
  },
  {
    id: 'customer-segment',
    name: 'Customer Segment Pivot',
    description: 'Keep the product, change the target customer',
    icon: Users,
    color: 'bg-purple-500',
    whenToUse: ['Wrong target market', 'Better fit elsewhere', 'Current segment too small'],
    examples: ['Facebook (from Harvard to everyone)', 'LinkedIn (from professionals to B2B)', 'Airbnb (from conferences to travelers)'],
    impact: 'high',
    effort: 'medium',
    risk: 'medium'
  },
  {
    id: 'customer-need',
    name: 'Customer Need Pivot',
    description: 'Keep the customer, solve a different problem',
    icon: Heart,
    color: 'bg-red-500',
    whenToUse: ['Wrong problem solved', 'Customer has bigger pain', 'Current solution not needed'],
    examples: ['Twitter (from SMS to social media)', 'Instagram (from check-ins to photos)', 'WhatsApp (from status to messaging)'],
    impact: 'high',
    effort: 'high',
    risk: 'high'
  },
  {
    id: 'platform',
    name: 'Platform Pivot',
    description: 'Change from application to platform or vice versa',
    icon: Settings,
    color: 'bg-yellow-500',
    whenToUse: ['Need to scale differently', 'Want to enable others', 'Platform model fits better'],
    examples: ['Apple App Store', 'Salesforce (from CRM to platform)', 'Facebook (from social to platform)'],
    impact: 'high',
    effort: 'high',
    risk: 'high'
  },
  {
    id: 'business-architecture',
    name: 'Business Architecture Pivot',
    description: 'Change from high margin/low volume to low margin/high volume or vice versa',
    icon: BarChart3,
    color: 'bg-indigo-500',
    whenToUse: ['Wrong pricing model', 'Need different scale', 'Market demands different approach'],
    examples: ['Netflix (from DVD to streaming)', 'Spotify (from purchase to subscription)', 'Adobe (from license to subscription)'],
    impact: 'high',
    effort: 'high',
    risk: 'high'
  },
  {
    id: 'value-capture',
    name: 'Value Capture Pivot',
    description: 'Change how you capture value from customers',
    icon: DollarSign,
    color: 'bg-emerald-500',
    whenToUse: ['Wrong monetization', 'Customers won\'t pay current way', 'Better model exists'],
    examples: ['Freemium models', 'Marketplace fees', 'Subscription vs one-time'],
    impact: 'medium',
    effort: 'medium',
    risk: 'medium'
  },
  {
    id: 'engine-of-growth',
    name: 'Engine of Growth Pivot',
    description: 'Change how you acquire customers',
    icon: TrendingUp,
    color: 'bg-pink-500',
    whenToUse: ['Current growth not working', 'Need viral component', 'Acquisition too expensive'],
    examples: ['Viral growth', 'Paid acquisition', 'Sticky growth', 'Referral programs'],
    impact: 'high',
    effort: 'medium',
    risk: 'medium'
  },
  {
    id: 'channel',
    name: 'Channel Pivot',
    description: 'Change how you reach customers',
    icon: Zap,
    color: 'bg-orange-500',
    whenToUse: ['Current channel not working', 'Better channel exists', 'Need different approach'],
    examples: ['Online to offline', 'Direct to indirect', 'B2B to B2C'],
    impact: 'medium',
    effort: 'medium',
    risk: 'medium'
  },
  {
    id: 'technology',
    name: 'Technology Pivot',
    description: 'Use different technology to solve the same problem',
    icon: Lightbulb,
    color: 'bg-teal-500',
    whenToUse: ['Current tech not working', 'Better tech available', 'Need different approach'],
    examples: ['Mobile-first', 'AI-powered', 'Cloud-native', 'Blockchain-based'],
    impact: 'medium',
    effort: 'high',
    risk: 'high'
  }
];

interface PivotIntelligenceProps {
  currentMetrics: {
    userGrowth: number;
    revenue: number;
    engagement: number;
    retention: number;
  };
  assumptions: any[];
  onRecommendPivot: (recommendation: PivotRecommendation) => void;
  addToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const PivotIntelligence: React.FC<PivotIntelligenceProps> = ({
  currentMetrics,
  assumptions,
  onRecommendPivot,
  addToast
}) => {
  const [selectedPivot, setSelectedPivot] = useState<PivotType | null>(null);
  const [analysisData, setAnalysisData] = useState({
    problemFit: 0,
    solutionFit: 0,
    marketFit: 0,
    businessModelFit: 0
  });

  const analyzePivotNeed = () => {
    // Simple analysis based on metrics and assumptions
    const invalidatedAssumptions = assumptions.filter(a => a.status === 'invalidated').length;
    const totalAssumptions = assumptions.length;
    const invalidationRate = totalAssumptions > 0 ? (invalidatedAssumptions / totalAssumptions) * 100 : 0;

    const scores = {
      problemFit: Math.max(0, 100 - (invalidationRate * 2)),
      solutionFit: Math.max(0, 100 - (currentMetrics.engagement * 10)),
      marketFit: Math.max(0, 100 - (currentMetrics.userGrowth * 5)),
      businessModelFit: Math.max(0, 100 - (currentMetrics.revenue * 2))
    };

    setAnalysisData(scores);
    return scores;
  };

  const getPivotRecommendation = (): PivotRecommendation | null => {
    const scores = analyzePivotNeed();
    const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;

    if (avgScore > 70) {
      return null; // No pivot needed
    }

    // Determine best pivot type based on lowest scores
    const lowestScore = Math.min(...Object.values(scores));
    let recommendedType: PivotType;

    if (scores.problemFit === lowestScore) {
      recommendedType = PIVOT_TYPES.find(p => p.id === 'customer-need')!;
    } else if (scores.solutionFit === lowestScore) {
      recommendedType = PIVOT_TYPES.find(p => p.id === 'zoom-in')!;
    } else if (scores.marketFit === lowestScore) {
      recommendedType = PIVOT_TYPES.find(p => p.id === 'customer-segment')!;
    } else {
      recommendedType = PIVOT_TYPES.find(p => p.id === 'business-architecture')!;
    }

    return {
      type: recommendedType,
      confidence: Math.round(100 - avgScore),
      reasoning: `Based on your metrics, ${recommendedType.name.toLowerCase()} is recommended because your ${Object.keys(scores).find(key => scores[key as keyof typeof scores] === lowestScore)} score is ${Math.round(lowestScore)}%.`,
      nextSteps: [
        'Define specific pivot strategy',
        'Create minimum viable pivot',
        'Test with small user group',
        'Measure key metrics',
        'Scale if successful'
      ],
      timeline: '4-8 weeks',
      resources: [
        'User research tools',
        'A/B testing platform',
        'Analytics dashboard',
        'Customer feedback system'
      ]
    };
  };

  const recommendation = getPivotRecommendation();

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <GitBranch className="w-8 h-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pivot Intelligence</h2>
          <p className="text-gray-600">
            <span className="font-semibold text-purple-600">Lean Design Thinking™ Core:</span> Structured pivot decisions based on evidence from your experiments
          </p>
          <p className="text-sm text-gray-500 mt-1">
            💡 When assumptions are invalidated, learning isn't failure—it's progress. Use these 10 structured pivot types to make strategic changes based on what you've learned.
          </p>
        </div>
      </div>

      {/* Current Analysis */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Fit Analysis</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {Object.entries(analysisData).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{Math.round(value)}%</div>
              <div className="text-sm text-gray-600 capitalize">{key.replace('Fit', ' Fit')}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${value > 70 ? 'bg-green-500' : value > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pivot Recommendation */}
      {recommendation && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-6 rounded-lg mb-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Pivot Recommended</h3>
              <p className="text-red-800 mb-4">{recommendation.reasoning}</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-red-700">Confidence: {recommendation.confidence}%</span>
                <span className="text-sm text-red-700">Timeline: {recommendation.timeline}</span>
              </div>
              <button
                onClick={() => onRecommendPivot(recommendation)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                View Recommendation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pivot Types Grid */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">10 Types of Pivots</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PIVOT_TYPES.map((pivot) => {
            const Icon = pivot.icon;
            return (
              <div
                key={pivot.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedPivot?.id === pivot.id ? 'ring-2 ring-purple-500 bg-purple-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPivot(pivot)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${pivot.color} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{pivot.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{pivot.description}</p>
                    <div className="flex gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getImpactColor(pivot.impact)}`}>
                        {pivot.impact} impact
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getEffortColor(pivot.effort)}`}>
                        {pivot.effort} effort
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Examples: {pivot.examples.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Pivot Details */}
      {selectedPivot && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-lg ${selectedPivot.color} text-white`}>
              <selectedPivot.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedPivot.name}</h3>
              <p className="text-gray-600">{selectedPivot.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">When to Use</h4>
              <ul className="space-y-2">
                {selectedPivot.whenToUse.map((use, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {use}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Examples</h4>
              <ul className="space-y-2">
                {selectedPivot.examples.map((example, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {example}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                const rec: PivotRecommendation = {
                  type: selectedPivot,
                  confidence: 85,
                  reasoning: `Manual selection of ${selectedPivot.name.toLowerCase()}`,
                  nextSteps: ['Define specific strategy', 'Create implementation plan', 'Test with users'],
                  timeline: '4-6 weeks',
                  resources: ['User research', 'A/B testing', 'Analytics']
                };
                onRecommendPivot(rec);
                addToast('Pivot recommendation created', 'success');
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Recommend This Pivot
            </button>
            <button
              onClick={() => setSelectedPivot(null)}
              className="text-gray-600 hover:text-gray-800 px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PivotIntelligence;
