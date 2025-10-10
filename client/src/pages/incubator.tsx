
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Lightbulb, 
  Building2, 
  Users, 
  Calendar, 
  MapPin,
  Coffee,
  BookOpen,
  Handshake,
  DollarSign,
  Clock,
  Target,
  Network
} from "lucide-react";

const incubatorSpaces = [
  {
    id: 1,
    name: "Main Campus",
    location: "Downtown Tech District",
    capacity: 50,
    currentOccupancy: 38,
    amenities: ["High-speed WiFi", "Meeting Rooms", "Coffee Bar", "Event Space"],
    type: "Co-working Hub"
  },
  {
    id: 2,
    name: "University Lab",
    location: "University Research Park",
    capacity: 25,
    currentOccupancy: 18,
    amenities: ["Research Lab Access", "University Library", "Student Interns", "Academic Mentors"],
    type: "Academic Incubator"
  },
  {
    id: 3,
    name: "Corporate Innovation Center",
    location: "Business District",
    capacity: 30,
    currentOccupancy: 22,
    amenities: ["Corporate Mentors", "Pilot Program Access", "B2B Connections", "Industry Expertise"],
    type: "Corporate Incubator"
  }
];

const incubatorPrograms = [
  {
    id: 1,
    name: "Early Stage Program",
    duration: "6-12 months",
    stage: "Idea to Prototype",
    participants: 15,
    equity: "0-5%",
    investment: "Up to $50K",
    focus: "Product development and market validation"
  },
  {
    id: 2,
    name: "Growth Track",
    duration: "12-24 months", 
    stage: "Prototype to Market",
    participants: 12,
    equity: "5-10%",
    investment: "$50K-200K",
    focus: "Scaling and business development"
  },
  {
    id: 3,
    name: "University Spin-off",
    duration: "18+ months",
    stage: "Research to Commercialization",
    participants: 8,
    equity: "Varies",
    investment: "Grant-based",
    focus: "Technology transfer and IP commercialization"
  }
];

const supportServices = [
  {
    icon: Building2,
    title: "Flexible Workspace",
    description: "Dedicated desks, meeting rooms, and collaborative spaces",
    included: true
  },
  {
    icon: Users,
    title: "Mentorship Program",
    description: "Industry experts and successful entrepreneurs",
    included: true
  },
  {
    icon: BookOpen,
    title: "Educational Workshops",
    description: "Regular workshops on business fundamentals",
    included: true
  },
  {
    icon: Network,
    title: "Networking Events",
    description: "Monthly pitch nights and investor meetups",
    included: true
  },
  {
    icon: Handshake,
    title: "Legal & Accounting",
    description: "Basic legal setup and accounting guidance",
    included: true
  },
  {
    icon: DollarSign,
    title: "Funding Connections",
    description: "Access to angel investors and VC networks",
    included: false
  }
];

const currentStartups = [
  {
    id: 1,
    name: "GreenTech Solutions",
    founder: "Sarah Kim",
    industry: "CleanTech",
    stage: "Product Development",
    joinDate: "2023-08-15",
    program: "Growth Track",
    progress: 60,
    description: "Renewable energy storage solutions for residential use"
  },
  {
    id: 2,
    name: "MedAI Diagnostics", 
    founder: "Dr. James Wilson",
    industry: "HealthTech",
    stage: "Market Validation",
    joinDate: "2024-01-20",
    program: "University Spin-off",
    progress: 35,
    description: "AI-powered diagnostic tool for early disease detection"
  },
  {
    id: 3,
    name: "EduPlatform",
    founder: "Maria Rodriguez",
    industry: "EdTech",
    stage: "Early Development",
    joinDate: "2024-03-10",
    program: "Early Stage Program",
    progress: 25,
    description: "Personalized learning platform for K-12 students"
  }
];

function IncubatorDashboard() {
  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Startup Incubator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Nurturing early-stage startups with flexible, long-term support, workspace, 
          and guidance to help founders build sustainable businesses.
        </p>
      </div>

      {/* Incubator Spaces */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Incubator Locations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {incubatorSpaces.map((space) => (
            <Card key={space.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{space.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {space.location}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{space.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Occupancy</span>
                    <span>{space.currentOccupancy}/{space.capacity}</span>
                  </div>
                  <Progress value={(space.currentOccupancy / space.capacity) * 100} className="h-2" />
                </div>
                
                <div>
                  <p className="font-medium text-sm mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {space.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Request Tour
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Programs */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            Incubator Programs
          </CardTitle>
          <CardDescription>
            Flexible programs tailored to different startup stages and needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {incubatorPrograms.map((program) => (
              <div key={program.id} className="p-4 rounded-lg border bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">{program.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">{program.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stage:</span>
                    <span className="font-medium">{program.stage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Participants:</span>
                    <span className="font-medium">{program.participants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Equity:</span>
                    <span className="font-medium">{program.equity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Investment:</span>
                    <span className="font-medium">{program.investment}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">{program.focus}</p>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support Services */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="h-6 w-6" />
            Support Services
          </CardTitle>
          <CardDescription>
            Comprehensive support ecosystem for startup development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {supportServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${service.included ? 'bg-orange-100' : 'bg-gray-100'}`}>
                    <IconComponent className={`h-5 w-5 ${service.included ? 'text-orange-600' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{service.title}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    <Badge 
                      variant={service.included ? "default" : "secondary"} 
                      className="mt-2 text-xs"
                    >
                      {service.included ? "Included" : "Optional"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Startups */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Current Startups</h2>
        <div className="space-y-4">
          {currentStartups.map((startup) => (
            <Card key={startup.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{startup.name}</h3>
                      <Badge variant="outline">{startup.industry}</Badge>
                      <Badge className="bg-orange-100 text-orange-800">{startup.program}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{startup.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Founder: {startup.founder}</span>
                      <span>Joined: {new Date(startup.joinDate).toLocaleDateString()}</span>
                      <span>Stage: {startup.stage}</span>
                    </div>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">Progress</span>
                      <div className="text-2xl font-bold text-orange-600">{startup.progress}%</div>
                    </div>
                    <Progress value={startup.progress} className="h-2 w-24 ml-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Building2 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-gray-600">Locations</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">78</div>
            <div className="text-sm text-gray-600">Active Startups</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">18</div>
            <div className="text-sm text-gray-600">Avg. Months</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Incubator() {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <div className="container mx-auto py-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="dashboard">
        <IncubatorDashboard />
      </TabsContent>
      
      <TabsContent value="workspace">
        <div className="container mx-auto py-8">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Workspace Management</h3>
            <p className="text-gray-500 mb-4">Desk booking and facility management coming soon.</p>
            <Button>Book Workspace</Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="community">
        <div className="container mx-auto py-8">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Community Hub</h3>
            <p className="text-gray-500 mb-4">Community events and networking tools coming soon.</p>
            <Button>Join Community</Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="resources">
        <div className="container mx-auto py-8">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Resource Library</h3>
            <p className="text-gray-500 mb-4">Educational resources and tools coming soon.</p>
            <Button>Browse Resources</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
