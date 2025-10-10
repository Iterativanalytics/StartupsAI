
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Rocket, 
  TrendingUp, 
  DollarSign, 
  Heart, 
  Handshake, 
  Users,
  Building2,
  Target,
  Lightbulb,
  Shield,
  Award,
  Crown
} from 'lucide-react';
import { UserType } from '@shared/schema';

interface UserTypeDefinition {
  type: UserType;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  subtypes: Array<{
    value: string;
    label: string;
    description: string;
  }>;
  features: string[];
  examples: string[];
}

const userTypeDefinitions: UserTypeDefinition[] = [
  {
    type: UserType.ENTREPRENEUR,
    title: "I'm an Entrepreneur",
    subtitle: "Build and grow your startup",
    description: "Founders and business builders looking to launch, scale, or improve their ventures",
    icon: Rocket,
    color: "text-purple-600",
    gradient: "from-purple-500 to-indigo-600",
    subtypes: [
      { value: 'first-time-founder', label: 'First-time Founder', description: 'New to entrepreneurship' },
      { value: 'serial-entrepreneur', label: 'Serial Entrepreneur', description: 'Multiple ventures under belt' },
      { value: 'corporate-innovator', label: 'Corporate Innovator', description: 'Innovation within corporations' }
    ],
    features: [
      'Business plan builder with AI assistance',
      'Funding opportunity matching',
      'Growth metrics and KPI tracking',
      'Team management tools',
      'Mentor connection system',
      'Educational resource library'
    ],
    examples: ['Startup founders', 'Business owners', 'Innovation managers', 'Product creators']
  },
  {
    type: UserType.INVESTOR,
    title: "I'm an Investor",
    subtitle: "Discover and fund promising startups",
    description: "Angels, VCs, and institutional investors seeking quality deal flow and portfolio management",
    icon: TrendingUp,
    color: "text-teal-600",
    gradient: "from-teal-500 to-blue-600",
    subtypes: [
      { value: 'angel-investor', label: 'Angel Investor', description: 'Individual high-net-worth investors' },
      { value: 'vc-fund', label: 'VC Fund', description: 'Venture capital firms and partners' },
      { value: 'pe-fund', label: 'PE Fund', description: 'Private equity investment firms' },
      { value: 'family-office', label: 'Family Office', description: 'Wealth management for families' },
      { value: 'strategic-investor', label: 'Strategic Investor', description: 'Corporate venture arms' }
    ],
    features: [
      'Curated deal flow management',
      'Portfolio performance tracking',
      'Comprehensive due diligence tools',
      'ROI calculators and projections',
      'Risk assessment frameworks',
      'Market research and analysis'
    ],
    examples: ['Angel investors', 'VC partners', 'Fund managers', 'Corporate VCs', 'Family offices']
  },
  {
    type: UserType.LENDER,
    title: "I'm a Lender",
    subtitle: "Provide debt financing solutions",
    description: "Banks, credit institutions, and alternative lenders offering startup financing",
    icon: DollarSign,
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-600",
    subtypes: [
      { value: 'commercial-bank', label: 'Commercial Bank', description: 'Traditional banking institutions' },
      { value: 'credit-union', label: 'Credit Union', description: 'Member-owned financial cooperatives' },
      { value: 'online-lender', label: 'Online Lender', description: 'Digital-first lending platforms' },
      { value: 'sba-lender', label: 'SBA Lender', description: 'Small Business Administration lenders' },
      { value: 'alternative-lender', label: 'Alternative Lender', description: 'Non-traditional financing sources' }
    ],
    features: [
      'Automated credit analysis tools',
      'Loan application processing',
      'DSCR calculators and metrics',
      'Collateral evaluation systems',
      'Risk scoring algorithms',
      'Regulatory compliance tools'
    ],
    examples: ['Banks', 'Credit unions', 'Online lenders', 'SBA partners', 'Fintech companies']
  },
  {
    type: UserType.GRANTOR,
    title: "I'm a Grantor",
    subtitle: "Award grants and support innovation",
    description: "Foundations, government agencies, and organizations providing non-dilutive funding",
    icon: Heart,
    color: "text-red-600",
    gradient: "from-orange-500 to-red-600",
    subtypes: [
      { value: 'government-agency', label: 'Government Agency', description: 'Federal, state, and local agencies' },
      { value: 'foundation', label: 'Foundation', description: 'Private charitable foundations' },
      { value: 'corporate-foundation', label: 'Corporate Foundation', description: 'Corporate social responsibility arms' },
      { value: 'research-grant', label: 'Research Grant Provider', description: 'Academic and research institutions' }
    ],
    features: [
      'Social impact measurement tools',
      'Grant application evaluation',
      'Sustainability and ESG tracking',
      'Compliance monitoring dashboards',
      'Beneficiary impact analysis',
      'Outcome reporting systems'
    ],
    examples: ['Foundations', 'Government programs', 'NGOs', 'Research institutions', 'Corporate CSR']
  },
  {
    type: UserType.PARTNER,
    title: "I'm a Partner",
    subtitle: "Support and accelerate startups",
    description: "Service providers, mentors, and ecosystem partners helping startups succeed",
    icon: Handshake,
    color: "text-blue-600",
    gradient: "from-blue-500 to-cyan-600",
    subtypes: [
      { value: 'accelerator', label: 'Accelerator', description: 'Intensive startup programs' },
      { value: 'incubator', label: 'Incubator', description: 'Long-term startup support' },
      { value: 'consultant', label: 'Consultant', description: 'Professional advisory services' },
      { value: 'advisor', label: 'Advisor', description: 'Strategic guidance and mentorship' },
      { value: 'mentor', label: 'Mentor', description: 'Experienced entrepreneurs helping others' },
      { value: 'service-provider', label: 'Service Provider', description: 'Professional services for startups' }
    ],
    features: [
      'AI-powered startup matching',
      'Partnership program management',
      'Resource sharing platforms',
      'Success metrics tracking',
      'Collaboration workflow tools',
      'Network analysis insights'
    ],
    examples: ['Accelerators', 'Incubators', 'Consultants', 'Mentors', 'Service providers', 'Advisors']
  },
  {
    type: UserType.TEAM_MEMBER,
    title: "I'm a Team Member",
    subtitle: "Collaborate within organizations",
    description: "Team members, employees, and collaborators working within startup ecosystems",
    icon: Users,
    color: "text-gray-600",
    gradient: "from-gray-500 to-slate-600",
    subtypes: [
      { value: 'admin', label: 'Admin', description: 'Full administrative access' },
      { value: 'member', label: 'Member', description: 'Standard team member access' },
      { value: 'viewer', label: 'Viewer', description: 'Read-only access to information' },
      { value: 'contributor', label: 'Contributor', description: 'Can contribute content and insights' },
      { value: 'stakeholder', label: 'Stakeholder', description: 'Has stake in outcomes and decisions' }
    ],
    features: [
      'Team collaboration tools',
      'Role-based access control',
      'Document sharing and editing',
      'Task and project management',
      'Communication platforms',
      'Progress tracking dashboards'
    ],
    examples: ['Team members', 'Employees', 'Contractors', 'Stakeholders', 'Collaborators']
  }
];

interface UserTypeSelectorProps {
  onUserTypeSelect: (userType: UserType, subtype: string) => void;
}

export default function UserTypeSelector({ onUserTypeSelect }: UserTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');

  const selectedDefinition = userTypeDefinitions.find(def => def.type === selectedType);

  const handleTypeSelect = (type: UserType) => {
    setSelectedType(type);
    setSelectedSubtype('');
  };

  const handleSubtypeSelect = (subtype: string) => {
    setSelectedSubtype(subtype);
  };

  const handleContinue = () => {
    if (selectedType && selectedSubtype) {
      onUserTypeSelect(selectedType, selectedSubtype);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
          Welcome to IterativStartups
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's personalize your experience by understanding your role in the startup ecosystem
        </p>
      </div>

      {!selectedType ? (
        <div>
          <h2 className="text-xl font-semibold text-center mb-6">What describes you best?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTypeDefinitions.map((userType) => {
              const IconComponent = userType.icon;
              return (
                <Card 
                  key={userType.type}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-purple-200"
                  onClick={() => handleTypeSelect(userType.type)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto p-4 rounded-full bg-gradient-to-br ${userType.gradient} text-white mb-4`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-lg">{userType.title}</CardTitle>
                    <CardDescription className="text-sm">{userType.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 text-center mb-4">
                      {userType.description}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {userType.examples.slice(0, 2).map((example, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedType(null)}
              className="px-3 py-2"
            >
              ← Back
            </Button>
            <div className="flex items-center gap-3">
              {selectedDefinition && (
                <>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedDefinition.gradient} text-white`}>
                    <selectedDefinition.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedDefinition.title}</h2>
                    <p className="text-gray-600">{selectedDefinition.subtitle}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {selectedDefinition && (
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Choose your specific role</CardTitle>
                  <CardDescription>
                    Select the option that best describes your current situation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedSubtype} onValueChange={handleSubtypeSelect}>
                    {selectedDefinition.subtypes.map((subtype) => (
                      <div key={subtype.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={subtype.value} id={subtype.value} className="mt-1" />
                        <Label htmlFor={subtype.value} className="flex-1 cursor-pointer">
                          <div className="font-medium">{subtype.label}</div>
                          <div className="text-sm text-gray-600">{subtype.description}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      What you'll get access to
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedDefinition.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Join others like you
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedDefinition.examples.map((example, index) => (
                        <Badge key={index} variant="outline">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-6">
            <Button
              onClick={handleContinue}
              disabled={!selectedSubtype}
              size="lg"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700"
            >
              Continue to Setup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
