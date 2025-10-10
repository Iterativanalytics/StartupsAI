
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  Building2, 
  BarChart3,
  Crown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { UserType } from '@shared/schema';

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  userType: UserType;
  userSubtype?: string;
  verified: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalBusinessPlans: number;
  totalOrganizations: number;
  usersByType: Record<UserType, number>;
  verifiedUsers: number;
  completedOnboarding: number;
}

export default function AdminDashboard() {
  const [superUsers, setSuperUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [superUsersRes, usersRes, statsRes] = await Promise.all([
        fetch('/api/super-users'),
        fetch('/api/users'),
        fetch('/api/stats')
      ]);

      const superUsersData = await superUsersRes.json();
      const usersData = await usersRes.json();
      const statsData = await statsRes.json();

      setSuperUsers(superUsersData);
      setAllUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeColor = (userType: UserType) => {
    const colors = {
      [UserType.ENTREPRENEUR]: 'bg-purple-100 text-purple-800',
      [UserType.INVESTOR]: 'bg-teal-100 text-teal-800',
      [UserType.LENDER]: 'bg-green-100 text-green-800',
      [UserType.GRANTOR]: 'bg-red-100 text-red-800',
      [UserType.PARTNER]: 'bg-blue-100 text-blue-800',
      [UserType.TEAM_MEMBER]: 'bg-gray-100 text-gray-800',
      [UserType.ADMIN]: 'bg-yellow-100 text-yellow-800'
    };
    return colors[userType] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Crown className="h-8 w-8 text-yellow-600" />
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage super users and platform data</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.verifiedUsers} verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Plans</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBusinessPlans}</div>
            <p className="text-xs text-muted-foreground">
              Active plans in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">
              Registered organizations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onboarding</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedOnboarding}</div>
            <p className="text-xs text-muted-foreground">
              Completed onboarding
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="super-users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="super-users">Super Users</TabsTrigger>
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="user-types">User Type Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="super-users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                Super Users
              </CardTitle>
              <CardDescription>
                Pre-configured super users for each user type with sample data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {superUsers.map((user) => (
                  <Card key={user.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getUserTypeColor(user.userType)}>
                          {user.userType}
                        </Badge>
                        <div className="flex gap-1">
                          {user.verified && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          {user.onboardingCompleted && (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg">
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {user.email}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Subtype:</span> {user.userSubtype}
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Complete list of users in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allUsers.slice(0, 20).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getUserTypeColor(user.userType)}>
                        {user.userType}
                      </Badge>
                      {user.verified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
                {allUsers.length > 20 && (
                  <div className="text-center py-4">
                    <Button variant="outline">Load More</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-types" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Type Distribution</CardTitle>
              <CardDescription>
                Breakdown of users by type across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {stats && Object.entries(stats.usersByType).map(([type, count]) => (
                  <Card key={type}>
                    <CardContent className="p-4 text-center">
                      <Badge className={getUserTypeColor(type as UserType)}>
                        {type}
                      </Badge>
                      <div className="text-2xl font-bold mt-2">{count}</div>
                      <div className="text-sm text-gray-500">users</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
