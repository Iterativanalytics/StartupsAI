import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Zap, 
  Shield,
  Heart,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

export default function AppleDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    users: 0,
    growth: 0,
    satisfaction: 0
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        revenue: Math.min(100, prev.revenue + Math.random() * 2),
        users: Math.min(100, prev.users + Math.random() * 1.5),
        growth: Math.min(100, prev.growth + Math.random() * 3),
        satisfaction: Math.min(100, prev.satisfaction + Math.random() * 1)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      title: 'Revenue Growth',
      value: `$${(stats.revenue * 125000).toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Active Users',
      value: `${(stats.users * 1250).toLocaleString()}`,
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Growth Rate',
      value: `${stats.growth.toFixed(1)}%`,
      change: '+5.3%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-500'
    },
    {
      title: 'Satisfaction',
      value: `${stats.satisfaction.toFixed(1)}%`,
      change: '+2.1%',
      trend: 'up',
      icon: Heart,
      color: 'text-pink-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'success',
      title: 'New user registration',
      description: 'Sarah Johnson joined the platform',
      time: '2 minutes ago',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'info',
      title: 'System update',
      description: 'Safari 26.0 features deployed',
      time: '15 minutes ago',
      icon: Zap
    },
    {
      id: 3,
      type: 'warning',
      title: 'Performance alert',
      description: 'High memory usage detected',
      time: '1 hour ago',
      icon: AlertCircle
    },
    {
      id: 4,
      type: 'success',
      title: 'Payment processed',
      description: 'Monthly subscription renewed',
      time: '2 hours ago',
      icon: DollarSign
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      {/* Header Section - Emotional Connection */}
      <section className="mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Welcome to Safari 26.0
              </h1>
              <p className="text-xl text-muted-foreground">
                Experience the future of web browsing with Apple design principles
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-0">
              <Button className="safari-button">
                <Play className="w-4 h-4 mr-2" />
                Start Tour
              </Button>
              <Button variant="glass">
                <Shield className="w-4 h-4 mr-2" />
                Security Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics - Usability & Communication */}
      <section className="mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="glass-card hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-white/50 ${metric.color}`}>
                      <metric.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold">
                      {metric.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid - Functionality */}
      <section className="mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Performance Overview */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold flex items-center">
                    <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
                    Performance Overview
                  </CardTitle>
                  <CardDescription>
                    Real-time performance metrics and system health
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">CPU Usage</span>
                        <span className="text-sm text-muted-foreground">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Memory</span>
                        <span className="text-sm text-muted-foreground">62%</span>
                      </div>
                      <Progress value={62} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Network</span>
                        <span className="text-sm text-muted-foreground">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Storage</span>
                        <span className="text-sm text-muted-foreground">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity - Attention to Detail */}
            <div>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-purple-500" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest system events and user actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/30 hover:bg-white/50 transition-colors">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'success' ? 'bg-green-100 text-green-600' :
                          activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase - Aesthetics */}
      <section className="mb-8">
        <div className="max-w-7xl mx-auto">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                Safari 26.0 Features
              </CardTitle>
              <CardDescription className="text-center">
                Experience the next generation of web browsing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Enhanced Performance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    40% faster JavaScript execution with Nitro 2.0 engine
                  </p>
                  <Button variant="glass" size="sm">
                    Learn More
                  </Button>
                </div>

                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Advanced Security</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Intelligent tracking prevention and privacy protection
                  </p>
                  <Button variant="glass" size="sm">
                    Learn More
                  </Button>
                </div>

                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Beautiful Design</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Apple design principles for intuitive user experience
                  </p>
                  <Button variant="glass" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action - Emotional Connection */}
      <section>
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass-card">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Experience Safari 26.0?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover the future of web browsing with enhanced performance, 
                security, and the beautiful design you expect from Apple.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="safari-button">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
                <Button variant="glass" size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
