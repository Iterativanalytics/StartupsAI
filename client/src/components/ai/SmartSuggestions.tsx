import { Lightbulb, TrendingUp, FileText, DollarSign, Users, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

interface SmartSuggestionsProps {
  onSuggestionClick?: (suggestion: string) => void;
}

export function SmartSuggestions({ onSuggestionClick }: SmartSuggestionsProps) {
  const { user } = useAuth();

  const suggestions = getSuggestionsForUserType(user?.userType || 'entrepreneur');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {suggestions.map((suggestion, index) => (
        <Card
          key={index}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-purple-300"
          onClick={() => onSuggestionClick?.(suggestion.prompt)}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${suggestion.color}`}>
              {suggestion.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
              <p className="text-xs text-gray-600">{suggestion.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function getSuggestionsForUserType(userType: string) {
  const suggestionMap: Record<string, any[]> = {
    entrepreneur: [
      {
        icon: <FileText className="w-4 h-4 text-purple-600" />,
        color: 'bg-purple-100',
        title: 'Review Business Plan',
        description: 'Get AI feedback on your business plan',
        prompt: 'Can you review my business plan and provide feedback?'
      },
      {
        icon: <DollarSign className="w-4 h-4 text-green-600" />,
        color: 'bg-green-100',
        title: 'Calculate Runway',
        description: 'Analyze your cash runway',
        prompt: 'Calculate my runway based on current burn rate'
      },
      {
        icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
        color: 'bg-blue-100',
        title: 'Growth Strategy',
        description: 'Get strategic growth advice',
        prompt: 'What growth strategies should I focus on?'
      },
      {
        icon: <Target className="w-4 h-4 text-orange-600" />,
        color: 'bg-orange-100',
        title: 'Market Analysis',
        description: 'Analyze your target market',
        prompt: 'Help me analyze my target market and competition'
      }
    ],
    investor: [
      {
        icon: <FileText className="w-4 h-4 text-purple-600" />,
        color: 'bg-purple-100',
        title: 'Evaluate Deal',
        description: 'Analyze investment opportunity',
        prompt: 'Help me evaluate this investment deal'
      },
      {
        icon: <DollarSign className="w-4 h-4 text-green-600" />,
        color: 'bg-green-100',
        title: 'Valuation Analysis',
        description: 'Check valuation metrics',
        prompt: 'Analyze the valuation of this company'
      },
      {
        icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
        color: 'bg-blue-100',
        title: 'Portfolio Review',
        description: 'Review portfolio performance',
        prompt: 'Review my investment portfolio'
      },
      {
        icon: <Target className="w-4 h-4 text-red-600" />,
        color: 'bg-red-100',
        title: 'Risk Assessment',
        description: 'Identify investment risks',
        prompt: 'What are the key risks in this investment?'
      }
    ],
    lender: [
      {
        icon: <FileText className="w-4 h-4 text-purple-600" />,
        color: 'bg-purple-100',
        title: 'Credit Assessment',
        description: 'Evaluate creditworthiness',
        prompt: 'Assess the credit risk of this application'
      },
      {
        icon: <DollarSign className="w-4 h-4 text-green-600" />,
        color: 'bg-green-100',
        title: 'Cash Flow Analysis',
        description: 'Analyze cash flows',
        prompt: 'Analyze the cash flow and DSCR'
      },
      {
        icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
        color: 'bg-blue-100',
        title: 'Portfolio Risk',
        description: 'Review loan portfolio',
        prompt: 'Review my loan portfolio risk exposure'
      },
      {
        icon: <Target className="w-4 h-4 text-orange-600" />,
        color: 'bg-orange-100',
        title: 'Collateral Evaluation',
        description: 'Assess collateral value',
        prompt: 'Evaluate the collateral for this loan'
      }
    ],
    grantor: [
      {
        icon: <FileText className="w-4 h-4 text-purple-600" />,
        color: 'bg-purple-100',
        title: 'Impact Evaluation',
        description: 'Assess social impact',
        prompt: 'Evaluate the impact potential of this grant application'
      },
      {
        icon: <Lightbulb className="w-4 h-4 text-yellow-600" />,
        color: 'bg-yellow-100',
        title: 'ESG Analysis',
        description: 'Review sustainability',
        prompt: 'Analyze the ESG score of this program'
      },
      {
        icon: <TrendingUp className="w-4 h-4 text-green-600" />,
        color: 'bg-green-100',
        title: 'Outcome Prediction',
        description: 'Forecast program outcomes',
        prompt: 'Predict the outcomes of this grant program'
      },
      {
        icon: <Users className="w-4 h-4 text-blue-600" />,
        color: 'bg-blue-100',
        title: 'Beneficiary Impact',
        description: 'Assess reach and impact',
        prompt: 'How many people will this program impact?'
      }
    ],
    partner: [
      {
        icon: <Users className="w-4 h-4 text-purple-600" />,
        color: 'bg-purple-100',
        title: 'Startup Matching',
        description: 'Find compatible startups',
        prompt: 'Find startups that match our program criteria'
      },
      {
        icon: <Target className="w-4 h-4 text-blue-600" />,
        color: 'bg-blue-100',
        title: 'Program Optimization',
        description: 'Improve program performance',
        prompt: 'How can we optimize our partnership program?'
      },
      {
        icon: <TrendingUp className="w-4 h-4 text-green-600" />,
        color: 'bg-green-100',
        title: 'Success Prediction',
        description: 'Forecast partnership success',
        prompt: 'What is the success probability of this partnership?'
      },
      {
        icon: <Lightbulb className="w-4 h-4 text-orange-600" />,
        color: 'bg-orange-100',
        title: 'Resource Allocation',
        description: 'Optimize resource use',
        prompt: 'How should we allocate our partnership resources?'
      }
    ]
  };

  return suggestionMap[userType] || suggestionMap.entrepreneur;
}