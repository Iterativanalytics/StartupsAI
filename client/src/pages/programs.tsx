import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useCreateMutation } from "@/hooks/useFormMutation";
import { getStatusColorClass, getStatusBadgeVariant } from "@/utils/statusUtils";
import { formatDate, formatDateRange } from "@/utils/dateUtils";
import { CardLoadingSpinner } from "@/components/ui/loading-spinner";

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
  Calendar,
  Users,
  Hourglass,
  CheckCircle2,
  Plus,
  ArrowRight,
  ListFilter,
  Search,
  BarChart
} from "lucide-react";

// Program schema
const programSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  type: z.string().min(1, { message: "Type is required" }),
  organizationId: z.number(),
  status: z.string().min(1, { message: "Status is required" }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  capacity: z.string().transform(val => val ? parseInt(val) : null).optional(),
});

type Program = {
  id: number;
  name: string;
  description: string | null;
  type: string;
  organizationId: number;
  status: string;
  startDate: string | null;
  endDate: string | null;
  capacity: number | null;
  applicationProcess: any;
  metrics: any;
  createdAt: string;
};

// Cohort schema
const cohortSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  status: z.string().min(1, { message: "Status is required" }),
  programId: z.number(),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
});

function ProgramsList() {
  // State for selected organization (for demo we'll use a fixed value)
  const organizationId = 3; // Assuming ID 3 is for an accelerator/incubator organization
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Query programs
  const { data: programs, isLoading } = useQuery({
    queryKey: ['/api/programs/organization', organizationId],
    queryFn: () => apiRequest(`/api/programs/organization/${organizationId}`),
  });

  // Create program form
  const form = useForm<z.infer<typeof programSchema>>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "accelerator",
      organizationId: organizationId,
      status: "active",
    },
  });

  // Mutation to create program
  const createProgram = useCreateMutation<Program, z.infer<typeof programSchema>>(
    '/api/programs',
    'Program',
    [`/api/programs/organization/${organizationId}`]
  );

  // Handle form submission
  function onSubmit(values: z.infer<typeof programSchema>) {
    // Add default values for fields that might be empty
    const programData = {
      ...values,
      applicationProcess: { stages: [] },
      metrics: { 
        startups: 0,
        mentors: 0,
        investors: 0,
        events: 0,
        successRate: 0,
      }
    };
    createProgram.mutate(programData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        form.reset();
      }
    });
  }

  // Helper function to get program type badge color
  const getProgramTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "accelerator":
        return "bg-blue-500";
      case "incubator":
        return "bg-green-500";
      case "mentorship":
        return "bg-purple-500";
      case "workshop":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  // Helper functions moved to utils

  if (isLoading) {
    return <CardLoadingSpinner text="Loading programs..." />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Programs</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Program
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Program</DialogTitle>
              <DialogDescription>
                Create a new program for entrepreneurs and startups.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer Founders Program" {...field} />
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
                          placeholder="A 12-week program to help early-stage founders..."
                          className="min-h-24"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select program type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="accelerator">Accelerator</SelectItem>
                            <SelectItem value="incubator">Incubator</SelectItem>
                            <SelectItem value="mentorship">Mentorship</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (max participants)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="20" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createProgram.isPending}>
                    {createProgram.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Program
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs && programs.length > 0 ? (
          programs.map((program: Program) => (
            <Card key={program.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{program.name}</CardTitle>
                  <Badge className={getProgramTypeColor(program.type)}>
                    {program.type}
                  </Badge>
                </div>
                <CardDescription className="text-sm line-clamp-2">
                  {program.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="text-sm font-medium">{formatDate(program.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="text-sm font-medium">{formatDate(program.endDate)}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="text-sm font-medium">{program.capacity || "Unlimited"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusBadgeVariant(program.status as any)}>
                      {program.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-3 pt-3">
                <Button variant="outline" size="sm">
                  View Cohorts
                </Button>
                <Button size="sm">
                  Manage
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No programs found. Create your first program to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CohortManagement() {
  const programId = 1; // For demo purposes
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Query cohorts for the selected program
  const { data: cohorts, isLoading } = useQuery({
    queryKey: ['/api/cohorts/program', programId],
    queryFn: () => apiRequest(`/api/cohorts/program/${programId}`),
  });
  
  // Create cohort form
  const form = useForm<z.infer<typeof cohortSchema>>({
    resolver: zodResolver(cohortSchema),
    defaultValues: {
      name: "",
      status: "upcoming",
      programId: programId,
      startDate: "",
      endDate: "",
    },
  });
  
  // Mutation to create cohort
  const createCohort = useMutation({
    mutationFn: (values: z.infer<typeof cohortSchema>) => {
      return apiRequest('/api/cohorts', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cohorts/program', programId] });
      toast({
        title: "Cohort created",
        description: "The cohort has been created successfully.",
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create cohort. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  function onSubmit(values: z.infer<typeof cohortSchema>) {
    // Add metrics data structure
    const cohortData = {
      ...values,
      metrics: {
        participants: 0,
        completionRate: 0,
        satisfactionScore: 0,
        outcomes: {
          raised_funding: 0,
          partnerships: 0,
          revenue_growth: 0
        }
      }
    };
    createCohort.mutate(cohortData);
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 text-white";
      case "upcoming":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  // Helper function to calculate progress percentage based on dates
  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Cohort Management</h2>
          <p className="text-gray-500">Manage program cohorts and participant tracking</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Cohort
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Cohort</DialogTitle>
              <DialogDescription>
                Create a new cohort for your program.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cohort Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createCohort.isPending}>
                    {createCohort.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Cohort
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ListFilter className="h-5 w-5 text-gray-500" />
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Search cohorts..." className="pl-8" />
        </div>
      </div>
      
      <div className="space-y-4">
        {cohorts && cohorts.length > 0 ? (
          cohorts.map((cohort: any) => {
            const progressPercent = calculateProgress(cohort.startDate, cohort.endDate);
            return (
              <Card key={cohort.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{cohort.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(cohort.startDate)} - {formatDate(cohort.endDate)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(cohort.status)}>
                        {cohort.status}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                        <Users className="h-5 w-5 text-blue-500 mb-1" />
                        <p className="text-sm font-medium">{cohort.metrics?.participants || 0}</p>
                        <p className="text-xs text-gray-500">Participants</p>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mb-1" />
                        <p className="text-sm font-medium">{cohort.metrics?.completionRate || 0}%</p>
                        <p className="text-xs text-gray-500">Completion</p>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                        <Hourglass className="h-5 w-5 text-orange-500 mb-1" />
                        <p className="text-sm font-medium">
                          {Math.floor((new Date(cohort.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                        <p className="text-xs text-gray-500">Remaining</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 flex flex-col justify-between md:w-64">
                    <div>
                      <div className="flex items-center mb-4">
                        <BarChart className="h-5 w-5 text-gray-500 mr-2" />
                        <h4 className="font-medium">Key Outcomes</h4>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>Raised Funding</span>
                          <span className="font-medium">{cohort.metrics?.outcomes?.raised_funding || 0}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Partnerships</span>
                          <span className="font-medium">{cohort.metrics?.outcomes?.partnerships || 0}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Revenue Growth</span>
                          <span className="font-medium">{cohort.metrics?.outcomes?.revenue_growth || 0}%</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <Button className="w-full">Manage Participants</Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No cohorts found. Create your first cohort to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  const tabs = ["Programs", "Cohorts", "Participants", "Outcomes"];
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Program Management</h1>
      <Tabs defaultValue="Programs" className="w-full">
        <TabsList className="grid w-[600px] grid-cols-4 mb-8">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="Programs" className="space-y-4">
          <ProgramsList />
        </TabsContent>
        <TabsContent value="Cohorts" className="space-y-4">
          <CohortManagement />
        </TabsContent>
        <TabsContent value="Participants" className="space-y-4">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Participant Management</h3>
            <p className="text-gray-500 mb-4">This feature is coming soon.</p>
            <Button>Go to Programs</Button>
          </div>
        </TabsContent>
        <TabsContent value="Outcomes" className="space-y-4">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Outcomes Tracking</h3>
            <p className="text-gray-500 mb-4">This feature is coming soon.</p>
            <Button>Go to Programs</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}