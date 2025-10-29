import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HubHeader from "@/components-hub/HubHeader";
import { HubModule, User } from "@/types-hub";
import { 
  Rocket, 
  Target, 
  Lightbulb, 
  ArrowRight, 
  Building2, 
  Users, 
  Clock,
  DollarSign,
  Zap,
  Handshake,
  TrendingUp,
  CheckCircle2,
  Trophy,
  Award,
  MapPin,
  ExternalLink,
  Sparkles
} from "lucide-react";

const ecosystemModels = [
  {
    name: "Venture Studio",
    icon: Rocket,
    href: "/venture-studio",
    stage: "Pre-idea to Early Stage",
    equity: "20-50%",
    timeline: "6 months - 2+ years",
    investment: "Co-founder equity",
    description: "Build companies from scratch internally with full-service company building support.",
    approach: "Generate ideas, provide co-founders, and build companies using internal resources",
    features: [
      "Full-service company building",
      "Strategy & product development", 
      "Engineering & marketing",
      "Fundraising support",
      "Co-founder model"
    ],
    examples: ["Rocket Internet", "Idealab", "Science Inc."],
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-50"
  },
  {
    name: "Accelerator",
    icon: Target,
    href: "/accelerator",
    stage: "Early Stage with Traction",
    equity: "6-10%",
    timeline: "3-6 months",
    investment: "$100K-250K",
    description: "Intensive short-term programs for existing startups with structured curriculum.",
    approach: "Cohort-based programs with mentorship, education, and networking",
    features: [
      "Cohort-based programs",
      "Intensive mentorship",
      "Demo day finale",
      "Network access",
      "Structured curriculum"
    ],
    examples: ["Y Combinator", "Techstars", "500 Startups"],
    color: "from-teal-500 to-blue-600",
    bgColor: "bg-teal-50"
  },
  {
    name: "Incubator",
    icon: Lightbulb,
    href: "/incubator",
    stage: "Idea to Early Stage",
    equity: "Varies (sometimes 0%)",
    timeline: "6 months - 2+ years",
    investment: "Flexible",
    description: "Longer-term nurturing of early-stage companies with flexible support.",
    approach: "Provide resources, workspace, and guidance over extended periods",
    features: [
      "Office space & resources",
      "Long-term support",
      "Flexible programs",
      "Basic services",
      "Sometimes funding"
    ],
    examples: ["University incubators", "Corporate incubators", "Government programs"],
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50"
  },
  {
    name: "Competitions",
    icon: Trophy,
    href: "/applications",
    stage: "All Stages",
    equity: "0% (Prize-based)",
    timeline: "1-3 days",
    investment: "Prize money + exposure",
    description: "Competitive events where startups pitch for prizes, recognition, and networking opportunities.",
    approach: "Time-limited competitive events with judging panels and prize distribution",
    features: [
      "Prize money & recognition",
      "Media exposure",
      "Investor networking",
      "Validation opportunity",
      "Quick feedback"
    ],
    examples: ["TechCrunch Disrupt", "Startup Grind", "Pitch competitions"],
    color: "from-yellow-500 to-orange-600",
    bgColor: "bg-yellow-50"
  }
];

const competitions = [
  {
    id: 'techcrunch-disrupt',
    name: 'TechCrunch Disrupt Startup Battlefield',
    organizer: 'TechCrunch',
    category: 'Pitch Competition',
    prize: '$100K',
    deadline: '2024-08-31',
    location: 'San Francisco, CA',
    status: 'closing-soon',
    difficulty: 'hard',
    popularity: 95,
    description: 'The world\'s premier startup conference. Pitch to global investors and win $100K.',
    requirements: ['Early-stage startup', 'Pitch presentation', 'Demo ready'],
    benefits: ['$100K prize', 'Global exposure', 'Media coverage', 'Investor access'],
    eligibility: {
      stage: ['pre-seed', 'seed'],
      industry: ['technology'],
      teamSize: { min: 1, max: 10 }
    },
    featured: true,
    website: 'https://techcrunch.com',
    tags: ['prestigious', 'media', 'global', 'tech']
  },
  {
    id: 'startup-grind-global',
    name: 'Startup Grind Global Conference',
    organizer: 'Startup Grind',
    category: 'Pitch Competition',
    prize: '$50K',
    deadline: '2024-09-30',
    location: 'Redwood City, CA',
    status: 'open',
    difficulty: 'medium',
    popularity: 70,
    description: 'Pitch your startup to global investors and win $50K in prizes.',
    requirements: ['Working product', 'Pitch deck', 'Team presentation'],
    benefits: ['$50K prize', 'Investor exposure', 'Media coverage', 'Networking'],
    eligibility: {
      stage: ['pre-seed', 'seed', 'series-a'],
      industry: ['all'],
      teamSize: { min: 1, max: 20 }
    },
    featured: false,
    website: 'https://startupgrind.com',
    tags: ['pitch', 'competition', 'networking']
  },
  {
    id: 'sxsw-pitch',
    name: 'SXSW Pitch Competition',
    organizer: 'SXSW',
    category: 'Tech Innovation',
    prize: '$25K',
    deadline: '2024-10-15',
    location: 'Austin, TX',
    status: 'open',
    difficulty: 'medium',
    popularity: 80,
    description: 'Showcase your startup at the world\'s most influential tech conference.',
    requirements: ['Tech startup', 'Innovation focus', 'Market potential'],
    benefits: ['$25K prize', 'SXSW exposure', 'Media coverage', 'Networking'],
    eligibility: {
      stage: ['pre-seed', 'seed'],
      industry: ['technology', 'innovation'],
      teamSize: { min: 1, max: 15 }
    },
    featured: true,
    website: 'https://sxsw.com',
    tags: ['tech', 'innovation', 'media', 'networking']
  },
  {
    id: 'web-summit-pitch',
    name: 'Web Summit PITCH Competition',
    organizer: 'Web Summit',
    category: 'Global Startup',
    prize: '$30K',
    deadline: '2024-11-01',
    location: 'Lisbon, Portugal',
    status: 'open',
    difficulty: 'hard',
    popularity: 85,
    description: 'Europe\'s largest tech conference startup competition.',
    requirements: ['Global startup', 'Tech focus', 'Growth potential'],
    benefits: ['$30K prize', 'European exposure', 'Investor network', 'Media coverage'],
    eligibility: {
      stage: ['pre-seed', 'seed', 'series-a'],
      industry: ['technology'],
      teamSize: { min: 1, max: 25 }
    },
    featured: true,
    website: 'https://websummit.com',
    tags: ['europe', 'global', 'tech', 'networking']
  },
  {
    id: 'ces-innovation-awards',
    name: 'CES Innovation Awards',
    organizer: 'Consumer Technology Association',
    category: 'Innovation Recognition',
    prize: 'Award + Exposure',
    deadline: '2024-09-15',
    location: 'Las Vegas, NV',
    status: 'open',
    difficulty: 'medium',
    popularity: 75,
    description: 'Recognize the most innovative products and startups at CES.',
    requirements: ['Consumer tech product', 'Innovation demonstration', 'Market readiness'],
    benefits: ['CES recognition', 'Media exposure', 'Industry validation', 'Networking'],
    eligibility: {
      stage: ['pre-seed', 'seed', 'series-a'],
      industry: ['consumer-technology', 'hardware', 'software'],
      teamSize: { min: 1, max: 50 }
    },
    featured: false,
    website: 'https://ces.tech',
    tags: ['innovation', 'consumer-tech', 'hardware', 'recognition']
  },
  {
    id: 'slush-pitch',
    name: 'Slush 100 Pitching Competition',
    organizer: 'Slush',
    category: 'Nordic Startup',
    prize: '$50K',
    deadline: '2024-11-15',
    location: 'Helsinki, Finland',
    status: 'open',
    difficulty: 'hard',
    popularity: 78,
    description: 'Northern Europe\'s leading startup and tech event competition.',
    requirements: ['Nordic startup', 'Tech focus', 'Growth potential'],
    benefits: ['$50K prize', 'Nordic exposure', 'Investor network', 'Media coverage'],
    eligibility: {
      stage: ['pre-seed', 'seed'],
      industry: ['technology'],
      teamSize: { min: 1, max: 20 }
    },
    featured: false,
    website: 'https://slush.org',
    tags: ['nordic', 'europe', 'tech', 'networking']
  }
];

const comparisons = [
  {
    aspect: "Hands-on Involvement",
    studio: "Most hands-on - Co-building",
    accelerator: "Structured guidance",
    incubator: "Light touch support",
    competitions: "Minimal - Pitch focused"
  },
  {
    aspect: "Time Commitment", 
    studio: "Intensive & long-term",
    accelerator: "Intensive but time-limited",
    incubator: "Flexible timeline",
    competitions: "Very short-term (1-3 days)"
  },
  {
    aspect: "Program Structure",
    studio: "Custom company building",
    accelerator: "Structured curriculum",
    incubator: "Flexible resources",
    competitions: "Competitive events"
  },
  {
    aspect: "Equity Requirement",
    studio: "20-50% equity",
    accelerator: "6-10% equity",
    incubator: "Varies (sometimes 0%)",
    competitions: "0% equity (prize-based)"
  },
  {
    aspect: "Primary Benefit",
    studio: "Full company building",
    accelerator: "Mentorship & network",
    incubator: "Resources & space",
    competitions: "Recognition & exposure"
  }
];

export default function EcosystemHub() {
  const [activeHub, setActiveHub] = useState<HubModule>('plans');
  const [user] = useState<User>({ loggedIn: false, persona: null, name: 'Guest' });


  const handleStartFree = () => {
    // Handle start free action
    console.log('Start Free clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <HubHeader 
        activeHub={activeHub} 
        setActiveHub={setActiveHub} 
        user={user}
        onStartFree={handleStartFree}
      />

      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Ecosystem Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the right ecosystem model for your startup journey. Each model offers unique approaches, 
            timelines, and support structures tailored to different stages and needs
          </p>
        </div>

        {/* Success Metrics */}
        <Card className="mb-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <TrendingUp className="h-7 w-7 text-green-600" />
              Platform Success Metrics
            </CardTitle>
            <CardDescription>
              Real outcomes from our ecosystem platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">$2.8B</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Funding Raised</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Companies Launched</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">73%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">156</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Successful Exits</div>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Ecosystem Model Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {ecosystemModels.map((model) => {
          const IconComponent = model.icon;
          return (
            <Card key={model.name} className={`relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${model.bgColor} dark:bg-gray-900/50 backdrop-blur-sm`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${model.color} opacity-10 rounded-full -mr-16 -mt-16`} />

              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${model.color} text-white`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {model.stage}
                  </Badge>
                </div>
                <CardTitle className="text-2xl mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{model.name}</CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                  {model.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">Equity</p>
                      <p className="text-gray-600 dark:text-gray-400">{model.equity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">Timeline</p>
                      <p className="text-gray-600 dark:text-gray-400">{model.timeline}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <Zap className="h-4 w-4" />
                    Key Features
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {model.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <Building2 className="h-4 w-4" />
                    Examples
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {model.examples.map((example, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Link href={model.href}>
                  <Button className={`w-full bg-gradient-to-r ${model.color} hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                    Explore {model.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Table */}
      <Card className="mb-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Handshake className="h-6 w-6" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Model Comparison
            </span>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Key differences between the three ecosystem models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800 dark:text-gray-200">Aspect</th>
                  <th className="text-left py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">Venture Studio</th>
                  <th className="text-left py-3 px-4 font-semibold text-teal-600 dark:text-teal-400">Accelerator</th>
                  <th className="text-left py-3 px-4 font-semibold text-orange-600 dark:text-orange-400">Incubator</th>
                  <th className="text-left py-3 px-4 font-semibold text-yellow-600 dark:text-yellow-400">Competitions</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((comparison, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{comparison.aspect}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{comparison.studio}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{comparison.accelerator}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{comparison.incubator}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{comparison.competitions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Featured Competitions */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Trophy className="h-8 w-8" />
            </div>
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Featured Competitions
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Compete for prizes, recognition, and networking opportunities at the world's leading startup competitions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {competitions.filter(comp => comp.featured).map((competition) => (
            <Card key={competition.id} className="relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 opacity-10 rounded-full -mr-12 -mt-12" />
              
              <CardHeader className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-medium">
                      {competition.category}
                    </Badge>
                    <Badge className={`${
                      competition.status === 'open' ? 'bg-green-100 text-green-800' :
                      competition.status === 'closing-soon' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {competition.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">{competition.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600 mb-2">
                  {competition.organizer}
                </CardDescription>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {competition.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-700">Prize</p>
                      <p className="text-gray-600">{competition.prize}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{competition.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Benefits
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {competition.benefits.slice(0, 3).map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      competition.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      competition.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {competition.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">
                      {competition.popularity}% popular
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-yellow-200 hover:bg-yellow-50">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90">
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/applications">
            <Button variant="outline" className="border-yellow-200 hover:bg-yellow-50">
              View All Competitions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card className="relative overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 opacity-10 rounded-full -mr-12 -mt-12" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Users className="h-6 w-6" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Smart Ecosystem Matcher
              </span>
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              AI-powered assessment to find your perfect ecosystem fit based on stage, goals, and industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>5-minute assessment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Direct program connections</span>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
              Start Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-400 opacity-10 rounded-full -mr-12 -mt-12" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Global Program Directory
              </span>
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Discover and connect with 500+ accelerators, incubators, and venture studios worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Geographic filtering</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Industry specialization</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Application tracking</span>
              </div>
            </div>
            <Button variant="outline" className="w-full border-teal-200 hover:bg-teal-50">
              Browse Programs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Success Metrics */}
      <Card className="mb-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <TrendingUp className="h-7 w-7" />
            </div>
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Platform Success Metrics
            </span>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Real outcomes from our ecosystem participants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">$2.8B</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Funding Raised</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Companies Launched</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">73%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">156</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Successful Exits</div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-center mb-6 flex items-center justify-center gap-2">
              <div className="p-1 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Trophy className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Competition Highlights
              </span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">$2.1M</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Prize Money Won</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">89</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Competitions Entered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">23</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">First Place Wins</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}