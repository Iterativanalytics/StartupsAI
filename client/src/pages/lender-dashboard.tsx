
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  FileText,
  Calculator
} from "lucide-react";

const portfolioStats = [
  { label: "Active Loans", value: "127", icon: FileText, color: "text-blue-600" },
  { label: "Portfolio Value", value: "$12.4M", icon: DollarSign, color: "text-green-600" },
  { label: "Default Rate", value: "2.3%", icon: AlertTriangle, color: "text-red-600" },
  { label: "Avg Interest", value: "8.5%", icon: TrendingUp, color: "text-purple-600" }
];

const pendingApplications = [
  {
    company: "TechFlow Solutions",
    amount: "$250,000",
    type: "Term Loan",
    creditScore: 720,
    dscr: 1.8,
    status: "Under Review",
    days: 5
  },
  {
    company: "Green Energy Co",
    amount: "$500,000", 
    type: "Equipment Financing",
    creditScore: 680,
    dscr: 2.1,
    status: "Pending Approval",
    days: 12
  }
];

export default function LenderDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Lender Dashboard 🏦
          </h1>
          <p className="text-gray-600">
            Manage your loan portfolio and evaluate new applications
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {portfolioStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="tools">Lending Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pending Applications
                </CardTitle>
                <CardDescription>Review and process loan applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApplications.map((app, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{app.company}</h3>
                          <p className="text-sm text-gray-600">{app.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{app.amount}</p>
                          <Badge variant="outline">{app.status}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Credit Score:</span>
                          <span className="font-medium ml-2">{app.creditScore}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">DSCR:</span>
                          <span className="font-medium ml-2">{app.dscr}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Days Pending:</span>
                          <span className="font-medium ml-2">{app.days}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm">Review Application</Button>
                        <Button size="sm" variant="outline">View Documents</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Loan Portfolio Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Portfolio analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Analysis Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Risk analysis tools coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    DSCR Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Calculate debt service coverage ratios for loan applications
                  </p>
                  <Button className="w-full">Open Calculator</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Credit Analyzer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Automated credit scoring and risk assessment
                  </p>
                  <Button className="w-full">Analyze Credit</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Compliance Checker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Ensure regulatory compliance for all loans
                  </p>
                  <Button className="w-full">Check Compliance</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
