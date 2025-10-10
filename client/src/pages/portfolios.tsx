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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  BarChart2,
  TrendingUp,
  TrendingDown,
  PieChart,
  DollarSign,
  ArrowRight,
  Plus,
  Building,
  Calendar,
  Briefcase
} from "lucide-react";

// Portfolio schema
const portfolioSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  organizationId: z.number(),
  totalValue: z.string().optional(),
});

type Portfolio = {
  id: number;
  name: string;
  description: string | null;
  organizationId: number;
  metrics: any;
  totalValue: string | null;
  createdAt: string;
};

// Portfolio Company schema
const portfolioCompanySchema = z.object({
  portfolioId: z.number(),
  businessPlanId: z.number(),
  status: z.string().min(1, { message: "Status is required" }),
  investmentAmount: z.string().optional(),
  equityPercentage: z.string().transform(val => val ? parseFloat(val) : null).optional(),
  cohortId: z.number().nullable().optional(),
});

type PortfolioCompany = {
  id: number;
  portfolioId: number;
  businessPlanId: number;
  cohortId: number | null;
  investmentAmount: string | null;
  equityPercentage: number | null;
  status: string;
  performance: any;
  valuationHistory: any;
  createdAt: string;
  updatedAt: string;
};

function PortfoliosList() {
  // State for selected organization (for demo we'll use a fixed value)
  const organizationId = 2; // Assuming ID 2 is for an investor organization
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Query portfolios
  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['/api/portfolios/organization', organizationId],
    queryFn: () => apiRequest(`/api/portfolios/organization/${organizationId}`),
  });

  // Create portfolio form
  const form = useForm<z.infer<typeof portfolioSchema>>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      name: "",
      description: "",
      organizationId: organizationId,
      totalValue: "",
    },
  });

  // Mutation to create portfolio
  const createPortfolio = useMutation({
    mutationFn: (values: z.infer<typeof portfolioSchema>) => apiRequest('/api/portfolios', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolios/organization', organizationId] });
      toast({
        title: "Portfolio created",
        description: "The portfolio has been created successfully.",
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create portfolio. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof portfolioSchema>) {
    const portfolioData = {
      ...values,
      metrics: {
        totalCompanies: 0,
        averageROI: 0,
        totalInvested: "$0",
        sectorAllocation: {},
        performanceByStage: {},
      }
    };
    createPortfolio.mutate(portfolioData);
  }

  // Get portfolio metrics for display
  const getPortfolioMetrics = (portfolio: Portfolio) => {
    // In a real app, this would come from the API
    if (!portfolio.metrics) {
      return {
        totalCompanies: 0,
        averageROI: "0%",
        totalInvested: "$0",
        sectors: [],
        totalValue: portfolio.totalValue || "$0",
      };
    }

    return {
      totalCompanies: portfolio.metrics.totalCompanies || 0,
      averageROI: portfolio.metrics.averageROI ? `${portfolio.metrics.averageROI}%` : "0%",
      totalInvested: portfolio.metrics.totalInvested || "$0",
      sectors: Object.keys(portfolio.metrics.sectorAllocation || {}),
      totalValue: portfolio.totalValue || "$0",
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
        <h1 className="text-4xl font-bold">Investment Portfolios</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
              <DialogDescription>
                Create a new investment portfolio to manage your investments.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portfolio Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Early Stage SaaS" {...field} />
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
                          placeholder="A portfolio focused on early-stage SaaS companies..."
                          className="min-h-24"
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
                  name="totalValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Value (USD)</FormLabel>
                      <FormControl>
                        <Input placeholder="1000000" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>
                        Enter the initial value of your portfolio in USD.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createPortfolio.isPending}>
                    {createPortfolio.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Portfolio
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {portfolios && portfolios.length > 0 ? (
          portfolios.map((portfolio: Portfolio) => {
            const metrics = getPortfolioMetrics(portfolio);
            return (
              <Card key={portfolio.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{portfolio.name}</CardTitle>
                    <Badge variant="outline" className="font-medium">
                      {metrics.totalCompanies} Companies
                    </Badge>
                  </div>
                  <CardDescription className="text-sm line-clamp-2">
                    {portfolio.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Total Value</p>
                        <p className="text-sm font-medium">{metrics.totalValue}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Total Invested</p>
                        <p className="text-sm font-medium">{metrics.totalInvested}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500">Average ROI</p>
                          <p className="text-sm font-medium">{metrics.averageROI}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                      <p className="text-sm font-medium mb-1">Top Sectors</p>
                      <div className="flex flex-wrap gap-1">
                        {metrics.sectors.length > 0 ? (
                          metrics.sectors.slice(0, 3).map((sector, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {sector}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500">No sectors defined</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-3 pt-3">
                  <Button variant="outline" size="sm">
                    <PieChart className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                  <Button size="sm">
                    Manage
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No portfolios found. Create your first portfolio to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CompanyAnalytics() {
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>
                Overall performance of your portfolio companies over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Analytics visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sector Allocation</CardTitle>
          </CardHeader>
          <CardContent className="h-56 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Sector chart coming soon</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-56 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Stage chart coming soon</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>ROI by Investment Year</CardTitle>
          </CardHeader>
          <CardContent className="h-56 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>ROI chart coming soon</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Top Performing Companies</CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-gray-500">
                <Building className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Company performance metrics coming soon</p>
                <p className="text-sm mt-2">This feature will display your top performing investments</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PortfoliosPage() {
  const tabs = ["Portfolios", "Companies", "Analytics", "Reports"];
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Portfolio Management</h1>
      <Tabs defaultValue="Portfolios" className="w-full">
        <TabsList className="grid w-[500px] grid-cols-4 mb-8">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="Portfolios" className="space-y-4">
          <PortfoliosList />
        </TabsContent>
        <TabsContent value="Companies" className="space-y-4">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Portfolio Companies</h3>
            <p className="text-gray-500 mb-4">This feature is coming soon.</p>
            <Button>Go to Portfolios</Button>
          </div>
        </TabsContent>
        <TabsContent value="Analytics" className="space-y-4">
          <CompanyAnalytics />
        </TabsContent>
        <TabsContent value="Reports" className="space-y-4">
          <div className="text-center py-20">
            <h3 className="text-xl font-medium mb-2">Portfolio Reports</h3>
            <p className="text-gray-500 mb-4">This feature is coming soon.</p>
            <Button>Go to Analytics</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}