
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Award, 
  FileText, 
  BarChart3,
  CheckCircle,
  Clock,
  Users,
  Target,
  Leaf,
  Globe
} from "lucide-react";

const impactMetrics = [
  { label: "Active Grants", value: "45", icon: Award, color: "text-orange-600" },
  { label: "Total Disbursed", value: "$2.8M", icon: Heart, color: "text-red-600" },
  { label: "Success Rate", value: "84%", icon: CheckCircle, color: "text-green-600" },
  { label: "Impact Score", value: "9.2", icon: Target, color: "text-blue-600" }
];

const pendingApplications = [
  {
    organization: "Clean Ocean Initiative",
    program: "Environmental Impact Grant",
    amount: "$75,000",
    category: "Environmental",
    score: 92,
    days: 14
  },
  {
    organization: "Tech for Education",
    program: "Education Innovation Grant",
    amount: "$120,000",
    category: "Education",
    score: 87,
    days: 8
  }
];

export default function GrantorDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Grantor Dashboard ❤️
          </h1>
          <p className="text-gray-600">
            Manage grants and measure social impact across your programs
          </p>
        </div>

        {/* Impact Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {impactMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{metric.label}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <IconComponent className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="impact">Impact Tracking</TabsTrigger>
            <TabsTrigger value="reports">Reporting</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pending Applications
                </CardTitle>
                <CardDescription>Review grant applications and assess impact potential</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApplications.map((app, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{app.organization}</h3>
                          <p className="text-sm text-gray-600">{app.program}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-orange-600">{app.amount}</p>
                          <Badge variant="secondary">{app.category}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Impact Score:</span>
                          <span className="font-medium ml-2">{app.score}/100</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Days Pending:</span>
                          <span className="font-medium ml-2">{app.days} days</span>
                        </div>
                      </div>
                      <Progress value={app.score} className="h-2 mb-4" />
                      <div className="flex gap-2">
                        <Button size="sm">Review Application</Button>
                        <Button size="sm" variant="outline">View Impact Plan</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Grant Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Program management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Environmental Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-green-600 mb-2">156</div>
                    <p className="text-sm text-gray-600">Projects Funded</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Social Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-blue-600 mb-2">42K</div>
                    <p className="text-sm text-gray-600">Lives Impacted</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Global Reach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-purple-600 mb-2">23</div>
                    <p className="text-sm text-gray-600">Countries Reached</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Impact Reporting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Impact reporting tools coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
