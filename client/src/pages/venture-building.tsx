import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  Lightbulb, 
  Beaker, 
  Rocket, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  XCircle,
  FileCheck
} from "lucide-react";

// Venture Project Schema
const ventureProjectSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  organizationId: z.number(),
  stage: z.enum(["idea", "validation", "prototype", "mvp", "scaling"]),
  businessPlanId: z.number().optional(),
});

type VentureProject = {
  id: number;
  name: string;
  description: string | null;
  organizationId: number;
  stage: string;
  businessPlanId: number | null;
  team: any;
  resources: any;
  roadmap: any;
  validationResults: any;
  createdAt: string;
  updatedAt: string;
};

function VentureProjectsList() {
  // State for selected organization (for demo we'll use a fixed value)
  const organizationId = 4; // Assuming ID 4 is for a venture builder organization
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Query venture projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/venture-projects/organization', organizationId],
    queryFn: () => apiRequest(`/api/venture-projects/organization/${organizationId}`),
  });

  // Create venture project form
  const form = useForm<z.infer<typeof ventureProjectSchema>>({
    resolver: zodResolver(ventureProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      organizationId: organizationId,
      stage: "idea",
    },
  });

  // Mutation to create venture project
  const createProject = useMutation({
    mutationFn: (values: z.infer<typeof ventureProjectSchema>) => apiRequest('/api/venture-projects', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/venture-projects/organization', organizationId] });
      toast({
        title: "Project created",
        description: "The venture project has been created successfully.",
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create venture project. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof ventureProjectSchema>) {
    const projectData = {
      ...values,
      team: { members: [] },
      resources: { allocated: {}, required: {} },
      roadmap: { milestones: [] },
      validationResults: { interviews: [], surveys: [], experiments: [] }
    };
    createProject.mutate(projectData);
  }

  // Helper function to get stage icon
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "idea":
        return <Lightbulb className="h-5 w-5" />;
      case "validation":
        return <FileCheck className="h-5 w-5" />;
      case "prototype":
        return <Beaker className="h-5 w-5" />;
      case "mvp":
        return <Rocket className="h-5 w-5" />;
      case "scaling":
        return <BarChart3 className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  // Helper function to get stage color
  const getStageColor = (stage: string) => {
    switch (stage) {
      case "idea":
        return "bg-violet-500";
      case "validation":
        return "bg-blue-500";
      case "prototype":
        return "bg-teal-500";
      case "mvp":
        return "bg-orange-500";
      case "scaling":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Mock project data for demo
  const getProjectData = (project: VentureProject) => {
    // In a real app, this would come from the API
    const stageMap: { [key: string]: number } = {
      "idea": 1,
      "validation": 2,
      "prototype": 3,
      "mvp": 4,
      "scaling": 5
    };
    
    const stageValue = stageMap[project.stage] || 1;
    const progress = (stageValue / 5) * 100;
    
    return {
      teamSize: Math.floor(Math.random() * 5) + 2,
      progress,
      tasks: {
        total: Math.floor(Math.random() * 30) + 10,
        completed: Math.floor(Math.random() * 20) + 5
      },
      nextMilestone: ["Market Research", "Customer Interviews", "MVP Development", "Beta Launch", "Seed Funding"][Math.floor(Math.random() * 5)],
      daysRemaining: Math.floor(Math.random() * 30) + 5
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Venture Projects</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Venture Project</DialogTitle>
              <DialogDescription>
                Start a new venture building project from scratch or based on an existing business plan.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="EcoSolutions Marketplace" {...field} />
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
                          placeholder="A B2B marketplace connecting eco-friendly suppliers with sustainable businesses..."
                          className="min-h-32"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stage</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="idea">Idea</SelectItem>
                          <SelectItem value="validation">Validation</SelectItem>
                          <SelectItem value="prototype">Prototype</SelectItem>
                          <SelectItem value="mvp">MVP</SelectItem>
                          <SelectItem value="scaling">Scaling</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createProject.isPending}>
                    {createProject.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Project
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects && projects.length > 0 ? (
          projects.map((project: VentureProject) => {
            const projectData = getProjectData(project);
            return (
              <Card key={project.id} className="overflow-hidden shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <Badge className={getStageColor(project.stage)}>
                      <span className="flex items-center gap-1">
                        {getStageIcon(project.stage)}
                        {project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}
                      </span>
                    </Badge>
                  </div>
                  <CardDescription className="text-sm truncate">
                    {project.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Project Progress</p>
                    <div className="flex items-center gap-2">
                      <Progress value={projectData.progress} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{Math.round(projectData.progress)}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Team Size</p>
                        <p className="text-gray-600">{projectData.teamSize} members</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Tasks</p>
                        <p className="text-gray-600">{projectData.tasks.completed}/{projectData.tasks.total} complete</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium">Next Milestone</p>
                      <Badge variant="outline" className="font-normal">
                        <Clock className="h-3 w-3 mr-1" />
                        {projectData.daysRemaining} days
                      </Badge>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{projectData.nextMilestone}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-3 pt-3">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">
                    Manage <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-10">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No venture projects found. Create your first project to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ValidationFramework() {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center py-20">
        <h3 className="text-xl font-medium mb-2">Idea Validation Framework</h3>
        <p className="text-gray-500 mb-4">This feature is coming soon.</p>
        <Button>Go to Venture Projects</Button>
      </div>
    </div>
  );
}

function ResourceAllocation() {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center py-20">
        <h3 className="text-xl font-medium mb-2">Resource Allocation</h3>
        <p className="text-gray-500 mb-4">This feature is coming soon.</p>
        <Button>Go to Venture Projects</Button>
      </div>
    </div>
  );
}

export default function VentureBuildingPage() {
  const tabs = ["Projects", "Validation", "Resources"];
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Venture Building</h1>
      <Tabs defaultValue="Projects" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-3 mb-8">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="Projects" className="space-y-4">
          <VentureProjectsList />
        </TabsContent>
        <TabsContent value="Validation" className="space-y-4">
          <ValidationFramework />
        </TabsContent>
        <TabsContent value="Resources" className="space-y-4">
          <ResourceAllocation />
        </TabsContent>
      </Tabs>
    </div>
  );
}