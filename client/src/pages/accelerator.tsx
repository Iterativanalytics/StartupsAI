import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Users,
  Calendar,
  Trophy,
  Clock,
  BookOpen,
  Presentation,
  Network,
  DollarSign,
  TrendingUp,
  Building2
} from "lucide-react";

const currentCohorts = [
  {
    id: 1,
    name: "Summer 2024 Cohort",
    status: "Active",
    startDate: "2024-06-01",
    demoDay: "2024-08-15",
    progress: 75,
    companies: 12,
    weeklyMeetings: "Tuesdays 2PM PST",
    focus: "AI & Deep Tech"
  },
  {
    id: 2,
    name: "Fall 2024 Cohort",
    status: "Applications Open",
    startDate: "2024-09-15",
    demoDay: "2024-12-10",
    progress: 0,
    companies: 0,
    applications: 89,
    focus: "Climate Tech & Sustainability"
  }
];

const acceleratorFeatures = [
  {
    icon: Users,
    title: "Cohort-Based Learning",
    description: "Learn alongside peer startups in structured cohorts",
    details: "12-15 startups per cohort with weekly group sessions"
  },
  {
    icon: BookOpen,
    title: "Structured Curriculum",
    description: "Proven framework covering all aspects of startup building",
    details: "12-week program with weekly modules and assignments"
  },
  {
    icon: Network,
    title: "Mentor Network",
    description: "Access to 200+ mentors across industries",
    details: "1:1 mentor matching and weekly mentor office hours"
  },
  {
    icon: Presentation,
    title: "Demo Day",
    description: "Present to 500+ investors and industry leaders",
    details: "Professional pitch coaching and investor matching"
  },
  {
    icon: DollarSign,
    title: "Initial Investment",
    description: "$150K for 8% equity upon acceptance",
    details: "Follow-on funding connections and investor introductions"
  },
  {
    icon: Trophy,
    title: "Alumni Network",
    description: "Join 1,200+ successful alumni companies",
    details: "Ongoing support and cross-portfolio collaboration"
  }
];

const programSchedule = [
  {
    week: "Week 1-2",
    title: "Foundation & Vision",
    topics: ["Product-Market Fit", "Customer Discovery", "Team Building"],
    deliverable: "Customer Interview Summary"
  },
  {
    week: "Week 3-4",
    title: "Product Development",
    topics: ["MVP Design", "Technical Architecture", "User Experience"],
    deliverable: "Product Roadmap"
  },
  {
    week: "Week 5-6",
    title: "Go-to-Market",
    topics: ["Marketing Strategy", "Sales Process", "Pricing Strategy"],
    deliverable: "GTM Plan"
  },
  {
    week: "Week 7-8",
    title: "Business Model",
    topics: ["Revenue Streams", "Unit Economics", "Financial Modeling"],
    deliverable: "Financial Projections"
  },
  {
    week: "Week 9-10",
    title: "Fundraising Prep",
    topics: ["Pitch Deck", "Due Diligence", "Term Sheets"],
    deliverable: "Investor Deck"
  },
  {
    week: "Week 11-12",
    title: "Demo Day Prep",
    topics: ["Pitch Practice", "Investor Meetings", "Next Steps"],
    deliverable: "Demo Day Presentation"
  }
];

const successMetrics = [
  { label: "Companies Accelerated", value: "450+", icon: Building2 },
  { label: "Total Funding Raised", value: "$2.8B", icon: DollarSign },
  { label: "Active Mentors", value: "200+", icon: Users },
  { label: "Demo Day Investors", value: "500+", icon: TrendingUp }
];

function AcceleratorDashboard() {
  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Startup Accelerator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Intensive 12-week programs designed to accelerate your startup's growth through
          structured curriculum, mentorship, and investor connections.
        </p>
      </div>

      {/* Current Cohorts */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Current Cohorts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {currentCohorts.map((cohort) => (
            <Card key={cohort.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{cohort.name}</CardTitle>
                    <CardDescription>Focus: {cohort.focus}</CardDescription>
                  </div>
                  <Badge variant={cohort.status === 'Active' ? 'default' : 'outline'}>
                    {cohort.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cohort.status === 'Active' && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Program Progress</span>
                      <span>{cohort.progress}%</span>
                    </div>
                    <Progress value={cohort.progress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Start Date</p>
                      <p className="text-gray-600">{new Date(cohort.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Presentation className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Demo Day</p>
                      <p className="text-gray-600">{new Date(cohort.demoDay).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Companies</p>
                      <p className="text-gray-600">
                        {cohort.status === 'Active' ? cohort.companies : `${cohort.applications} applications`}
                      </p>
                    </div>
                  </div>
                  {cohort.status === 'Active' && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Meetings</p>
                        <p className="text-gray-600">{cohort.weeklyMeetings}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Button variant="outline" className="w-full">
                  {cohort.status === 'Active' ? 'View Cohort' : 'Apply Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Program Features */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            Accelerator Program Features
          </CardTitle>
          <CardDescription>
            Comprehensive support system designed to accelerate startup growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {acceleratorFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="p-4 rounded-lg border bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="bg-teal-100 p-2 rounded-lg">
                      <IconComponent className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                      <p className="text-xs text-gray-500">{feature.details}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Success Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        {successMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProgramSchedule() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">12-Week Program Schedule</h2>
        <p className="text-gray-600">Structured curriculum designed to cover all critical aspects of startup development</p>
      </div>

      <div className="space-y-6">
        {programSchedule.map((week, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">{week.week}</Badge>
                    <h3 className="text-xl font-semibold">{week.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {week.topics.map((topic, topicIndex) => (
                      <Badge key={topicIndex} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Deliverable</p>
                  <p className="font-medium">{week.deliverable}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Accelerator() {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <div className="container mx-auto py-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="schedule">Program</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
          <TabsTrigger value="alumni">Alumni</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="dashboard">
        <AcceleratorDashboard />
      </TabsContent>

      <TabsContent value="schedule">
        <ProgramSchedule />
      </TabsContent>

      <TabsContent value="mentors">
        <div className="container mx-auto py-8">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Mentor Network</h3>
            <p className="text-gray-500 mb-4">Mentor directory and matching system coming soon.</p>
            <Button>Browse Mentors</Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="alumni">
        <div className="container mx-auto py-8">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Alumni Network</h3>
            <p className="text-gray-500 mb-4">Alumni directory and success stories coming soon.</p>
            <Button>View Alumni</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}