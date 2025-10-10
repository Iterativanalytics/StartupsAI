
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Rocket, 
  Lightbulb, 
  Users, 
  Building2, 
  Target, 
  TrendingUp,
  Loader2,
  Plus,
  Code,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle2
} from "lucide-react";

const ventureIdeaSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().min(1, "Industry is required"),
  targetMarket: z.string().min(1, "Target market is required"),
  estimatedBudget: z.string().transform(val => parseInt(val)),
  timeline: z.string().min(1, "Timeline is required"),
});

const studioCapabilities = [
  {
    icon: Lightbulb,
    title: "Idea Generation",
    description: "Market research and opportunity identification",
    status: "active"
  },
  {
    icon: Users,
    title: "Co-founder Matching",
    description: "Find the right team for your venture",
    status: "active"
  },
  {
    icon: Code,
    title: "Product Development",
    description: "Full-stack engineering and design",
    status: "active"
  },
  {
    icon: TrendingUp,
    title: "Growth Marketing",
    description: "Marketing strategy and execution",
    status: "active"
  },
  {
    icon: DollarSign,
    title: "Fundraising",
    description: "Investor connections and pitch preparation",
    status: "active"
  },
  {
    icon: Briefcase,
    title: "Operations",
    description: "Legal, finance, and business operations",
    status: "active"
  }
];

const currentVentures = [
  {
    id: 1,
    name: "EcoLogistics AI",
    industry: "Supply Chain",
    stage: "Development",
    progress: 65,
    team: ["Sarah Chen", "Mike Rodriguez", "Lisa Park"],
    investment: 850000,
    timeline: "Q2 2024 Launch",
    description: "AI-powered sustainable logistics optimization platform"
  },
  {
    id: 2,
    name: "HealthSync",
    industry: "Healthcare",
    stage: "Validation", 
    progress: 40,
    team: ["Dr. James Wilson", "Anna Kumar"],
    investment: 450000,
    timeline: "Q3 2024 Beta",
    description: "Unified patient data platform for healthcare providers"
  },
  {
    id: 3,
    name: "FinBridge",
    industry: "FinTech",
    stage: "Pre-launch",
    progress: 85,
    team: ["Tom Anderson", "Maya Patel", "Alex Kim", "Rachel Green"],
    investment: 1200000,
    timeline: "Q1 2024 Launch",
    description: "Cross-border payments for emerging markets"
  }
];

function VentureStudioDashboard() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof ventureIdeaSchema>>({
    resolver: zodResolver(ventureIdeaSchema),
    defaultValues: {
      title: "",
      description: "",
      industry: "",
      targetMarket: "",
      timeline: "",
    },
  });

  function onSubmit(values: z.infer<typeof ventureIdeaSchema>) {
    toast({
      title: "Venture Idea Submitted",
      description: "Your idea has been submitted for evaluation by our studio team.",
    });
    setIsCreateDialogOpen(false);
    form.reset();
  }

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "development": return "bg-blue-500";
      case "validation": return "bg-yellow-500";
      case "pre-launch": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Venture Studio
          </h1>
          <p className="text-xl text-gray-600">Building companies from scratch with full-service support</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
              <Plus className="mr-2 h-4 w-4" />
              Submit Venture Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Submit New Venture Idea</DialogTitle>
              <DialogDescription>
                Share your venture idea with our studio team for evaluation and potential development.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venture Title</FormLabel>
                      <FormControl>
                        <Input placeholder="AI-Powered Supply Chain Platform" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the problem, solution, and market opportunity..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input placeholder="FinTech, HealthTech, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetMarket"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Market</FormLabel>
                        <FormControl>
                          <Input placeholder="SMBs, Enterprises, Consumers" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="estimatedBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Budget (USD)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="500000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Timeline</FormLabel>
                        <FormControl>
                          <Input placeholder="12-18 months" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Submit for Evaluation</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Studio Capabilities */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Studio Capabilities
          </CardTitle>
          <CardDescription>
            Full-service company building with integrated expertise across all functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {studioCapabilities.map((capability, index) => {
              const IconComponent = capability.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <IconComponent className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{capability.title}</h3>
                    <p className="text-sm text-gray-600">{capability.description}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {capability.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Ventures */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Current Ventures in Development</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentVentures.map((venture) => (
            <Card key={venture.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{venture.name}</CardTitle>
                    <CardDescription className="text-sm">{venture.industry}</CardDescription>
                  </div>
                  <Badge className={getStageColor(venture.stage)}>
                    {venture.stage}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{venture.description}</p>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{venture.progress}%</span>
                  </div>
                  <Progress value={venture.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-500">Investment</p>
                    <p className="font-semibold">${(venture.investment / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Timeline</p>
                    <p className="font-semibold">{venture.timeline}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-500 text-sm mb-2">Team</p>
                  <div className="flex -space-x-2">
                    {venture.team.map((member, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                        title={member}
                      >
                        {member.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Studio Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Active Ventures</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-600">Successful Exits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">$45M</p>
                <p className="text-sm text-gray-600">Total Invested</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">150+</p>
                <p className="text-sm text-gray-600">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VentureStudio() {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <div className="container mx-auto py-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="ventures">Ventures</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="dashboard">
        <VentureStudioDashboard />
      </TabsContent>
      
      <TabsContent value="ventures">
        <div className="container mx-auto py-8">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Venture Portfolio</h3>
            <p className="text-gray-500 mb-4">Detailed venture tracking and management coming soon.</p>
            <Button>View All Ventures</Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="resources">
        <div className="container mx-auto py-8">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Studio Resources</h3>
            <p className="text-gray-500 mb-4">Resource allocation and management tools coming soon.</p>
            <Button>Manage Resources</Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="team">
        <div className="container mx-auto py-8">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Studio Team</h3>
            <p className="text-gray-500 mb-4">Team management and co-founder matching coming soon.</p>
            <Button>View Team</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
