/**
 * IterativPlans Widget
 * Dashboard widget for quick access to iterative plans
 */

import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Plus, 
  TrendingUp, 
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';

interface IterativePlan {
  id: string;
  name: string;
  completionPercentage: number;
  lastModified: string;
  status: 'draft' | 'in-progress' | 'complete';
  wordCount: number;
}

export const IterativPlansWidget: React.FC = () => {
  // Fetch recent iterative plans
  const { data: plans, isLoading } = useQuery({
    queryKey: ['/api/business-plans/recent'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // For now, return mock data
      return [
        {
          id: '1',
          name: 'Tech Startup Business Plan',
          completionPercentage: 75,
          lastModified: '2 hours ago',
          status: 'in-progress' as const,
          wordCount: 4500
        },
        {
          id: '2',
          name: 'E-commerce Venture Plan',
          completionPercentage: 45,
          lastModified: '1 day ago',
          status: 'draft' as const,
          wordCount: 2800
        },
        {
          id: '3',
          name: 'SaaS Product Plan',
          completionPercentage: 100,
          lastModified: '3 days ago',
          status: 'complete' as const,
          wordCount: 8200
        }
      ] as IterativePlan[];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-3 h-3" />;
      case 'in-progress':
        return <Clock className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            IterativPlans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              IterativPlans
            </CardTitle>
            <CardDescription>
              Your recent iterative plans and progress
            </CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/ai-business-plan">
              <Plus className="w-4 h-4 mr-2" />
              New Plan
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!plans || plans.length === 0 ? (
          // Empty State
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No IterativPlans Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first iterative plan with AI assistance
            </p>
            <Button asChild>
              <Link href="/ai-business-plan">
                <Sparkles className="w-4 h-4 mr-2" />
                Create with AI
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Plans List */}
            {plans.slice(0, 3).map((plan) => (
              <Link key={plan.id} href={`/edit-plan/${plan.id}`}>
                <div className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {plan.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Last edited {plan.lastModified}
                      </p>
                    </div>
                    <Badge className={getStatusColor(plan.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(plan.status)}
                        {plan.status}
                      </span>
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">
                        {plan.completionPercentage}%
                      </span>
                    </div>
                    <Progress value={plan.completionPercentage} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {plan.wordCount.toLocaleString()} words
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}

            {/* View All Link */}
            {plans.length > 3 && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/documents?filter=business-plan">
                  View All Plans ({plans.length})
                </Link>
              </Button>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {plans.length}
                </div>
                <div className="text-xs text-gray-600">Total Plans</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {plans.filter(p => p.status === 'complete').length}
                </div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {plans.filter(p => p.status === 'in-progress').length}
                </div>
                <div className="text-xs text-gray-600">In Progress</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/documents?filter=business-plan">
                  <FileText className="w-4 h-4 mr-2" />
                  All Plans
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/ai-business-plan">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generator
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
