import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { CoFounderHub } from '@/components/co-founder/CoFounderHub';
import { 
  Rocket, 
  ArrowRight, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Lightbulb,
  Building2,
  Briefcase,
  GraduationCap,
  Handshake,
  ChevronRight,
  Globe,
  BarChart3,
  PieChart,
  FileText,
  Calendar,
  Bell,
  Plus,
  MessageSquare,
  Zap,
  Award,
  Bot,
  Sparkles,
  Brain
} from "lucide-react";

const quickStats = [
  { label: "Business Plans", value: "3", icon: FileText, color: "text-purple-600", href: "/business-plans" },
  { label: "Funding Goal", value: "$500K", icon: DollarSign, color: "text-green-600", href: "/funding" },
  { label: "Team Size", value: "8", icon: Users, color: "text-blue-600", href: "/team" },
  { label: "Monthly Growth", value: "23%", icon: TrendingUp, color: "text-orange-600", href: "/analytics" }
];

const fundingOpportunities = [
  {
    name: "Tech Accelerator Program",
    type: "Accelerator",
    amount: "$100K + Mentorship",
    deadline: "2024-02-15",
    match: 94,
    tags: ["SaaS", "Early Stage", "B2B"]
  },
  {
    name: "Innovation Grant",
    type: "Grant",
    amount: "$50K",
    deadline: "2024-01-30",
    match: 89,
    tags: ["Technology", "Non-dilutive"]
  },
  {
    name: "Angel Investor Network",
    type: "Investment",
    amount: "$250K",
    deadline: "Ongoing",
    match: 87,
    tags: ["Seed", "Angel", "Mentorship"]
  }
];

const mentorRecommendations = [
  {
    name: "Sarah Chen",
    expertise: "Product Strategy",
    company: "Former VP at Stripe",
    rating: 4.9,
    sessions: 127,
    price: "$200/hr"
  },
  {
    name: "Marcus Rodriguez", 
    expertise: "Fundraising",
    company: "3x Founder",
    rating: 4.8,
    sessions: 203,
    price: "$300/hr"
  },
  {
    name: "Dr. Emily Foster",
    expertise: "Operations",
    company: "Former McKinsey Partner",
    rating: 4.9,
    sessions: 156,
    price: "$250/hr"
  }
];

const recentActivity = [
  {
    type: "milestone",
    title: "Completed Market Research Chapter",
    time: "2 hours ago",
    icon: Target,
    color: "text-green-600"
  },
  {
    type: "connection",
    title: "New investor match: Alex Chen",
    time: "5 hours ago",
    icon: Handshake,
    color: "text-blue-600"
  },
  {
    type: "learning",
    title: "Completed 'Fundraising 101' module",
    time: "1 day ago",
    icon: GraduationCap,
    color: "text-purple-600"
  }
];

export default function EntrepreneurDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
      <div className="container mx-auto py-8 px-4">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                Good morning, Entrepreneur! 🚀
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your startup journey today
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications (3)
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-teal-600">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Link key={index} href={stat.href}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <IconComponent className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* AI Business Plan Generator - Featured Card */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">AI Business Plan Generator</h3>
                      <p className="text-gray-600 mb-2">Create professional business plans in minutes with AI</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Brain className="h-4 w-4" />
                          <span>No typing required</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>Automated financials</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>Investor-ready</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href="/ai-business-plan">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start AI Generator
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 text-xs md:text-sm overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="business-plan">Business Plan</TabsTrigger>
            <TabsTrigger value="funding">Funding</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="co-founder">🤝 Co-Founder</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Business Plan Progress */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Business Plan Progress
                  </CardTitle>
                  <CardDescription>Complete your business plan to improve funding readiness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Executive Summary</span>
                      <span className="text-green-600 font-medium">Complete</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Market Analysis</span>
                      <span className="text-blue-600 font-medium">In Progress (75%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Financial Projections</span>
                      <span className="text-gray-500">Pending</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Marketing Strategy</span>
                      <span className="text-gray-500">Pending</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <Link href="/business-plans">
                    <Button className="w-full mt-4">
                      Continue Working
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="mr-2 h-4 w-4" />
                    Update Company Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Invite Team Members
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Schedule Mentor Call
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Stay updated on your latest progress and connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <IconComponent className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Funding Opportunities
                </CardTitle>
                <CardDescription>Personalized funding matches based on your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {fundingOpportunities.map((opportunity, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{opportunity.name}</h3>
                          <p className="text-sm text-gray-600">{opportunity.type}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-2">
                            {opportunity.match}% Match
                          </Badge>
                          <p className="text-sm font-medium text-green-600">{opportunity.amount}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {opportunity.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          Deadline: {opportunity.deadline}
                        </p>
                        <Button size="sm">
                          Apply Now
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentorship" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recommended Mentors
                </CardTitle>
                <CardDescription>Connect with experienced entrepreneurs and industry experts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mentorRecommendations.map((mentor, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-semibold">{mentor.name}</h4>
                          <p className="text-sm text-gray-600">{mentor.expertise}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{mentor.company}</p>
                      <div className="flex justify-between items-center text-sm mb-3">
                        <span className="flex items-center">
                          <Award className="h-4 w-4 text-yellow-500 mr-1" />
                          {mentor.rating} ({mentor.sessions} sessions)
                        </span>
                        <span className="font-medium text-green-600">{mentor.price}</span>
                      </div>
                      <Button size="sm" className="w-full">
                        Book Session
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Recommended Learning
                </CardTitle>
                <CardDescription>Personalized educational content for entrepreneurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Educational content coming soon</p>
                  <Link href="/education">
                    <Button className="mt-4">
                      Browse Learning Modules
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Your Network
                </CardTitle>
                <CardDescription>Connect with investors, partners, and other entrepreneurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Network features coming soon</p>
                  <Button className="mt-4">
                    Explore Network
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="co-founder" className="space-y-6">
          <CoFounderHub />
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-6">
          <Card className="h-[600px]">
            <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-purple-600" />
                    Your AI Business Advisor
                  </CardTitle>
                  <CardDescription>
                    Get personalized advice, analyze your business plan, and make data-driven decisions
                  </CardDescription>
                </CardHeader>
            <CardContent className="p-0 h-full">
              <ChatInterface taskType="business_advisor" context={{
                      userType: "entrepreneur",
                      businessStage: "early-stage",
                      industry: "technology"
                    }}
                    className="h-full"/>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}