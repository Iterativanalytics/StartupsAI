import React, { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Calendar,
  TrendingUp,
  Award,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import { WidgetProps } from '../../types/dashboard.types';
import DashboardWidget from '../../core/DashboardWidget';

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  category: string;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
}

interface GoalsTrackerWidgetProps extends WidgetProps {
  data?: {
    goals: Goal[];
    totalGoals: number;
    completedGoals: number;
    overdueGoals: number;
  };
}

const GoalsTrackerWidget: React.FC<GoalsTrackerWidgetProps> = memo(({
  widgetId,
  data,
  loading,
  error,
  onRefresh,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'in-progress':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'not-started':
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'not-started':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateProgress = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  if (!data) {
    return (
      <DashboardWidget
        widgetId={widgetId}
        loading={loading}
        error={error}
        onRefresh={onRefresh}
        variant="list"
      >
        <CardContent>
          <div className="text-center text-muted-foreground">
            No goals data available
          </div>
        </CardContent>
      </DashboardWidget>
    );
  }

  const completionRate = data.totalGoals > 0 
    ? (data.completedGoals / data.totalGoals) * 100 
    : 0;

  const activeGoals = data.goals.filter(goal => 
    goal.status === 'in-progress' || goal.status === 'not-started'
  );

  return (
    <DashboardWidget
      widgetId={widgetId}
      loading={loading}
      error={error}
      onRefresh={onRefresh}
      variant="list"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Goals Tracker</CardTitle>
              <p className="text-sm text-muted-foreground">
                {data.completedGoals}/{data.totalGoals} completed
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {data.overdueGoals > 0 && (
              <Badge variant="destructive" className="text-xs">
                {data.overdueGoals} overdue
              </Badge>
            )}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {completionRate.toFixed(0)}%
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Goals List */}
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {activeGoals.map((goal) => {
            const progress = calculateProgress(goal);
            const daysLeft = getDaysUntilDeadline(goal.deadline);
            const isOverdue = daysLeft < 0 && goal.status !== 'completed';

            return (
              <div
                key={goal.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedGoal === goal.id 
                    ? 'border-orange-200 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedGoal(
                  selectedGoal === goal.id ? null : goal.id
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(goal.status)}
                    <h4 className="font-medium text-sm">{goal.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getPriorityColor(goal.priority)}`}
                    >
                      {goal.priority}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(goal.status)}`}
                    >
                      {goal.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {goal.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                    <span className="text-xs font-medium">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>

                {/* Deadline and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {isOverdue ? (
                        <span className="text-red-600">
                          {Math.abs(daysLeft)} days overdue
                        </span>
                      ) : (
                        <span>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Due today'}
                        </span>
                      )}
                    </span>
                  </div>

                  {selectedGoal === goal.id && (
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Milestones */}
                {selectedGoal === goal.id && goal.milestones.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="text-xs font-medium text-gray-700 mb-2">
                      Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                    </h5>
                    <div className="space-y-1">
                      {goal.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center space-x-2 text-xs"
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                            {milestone.title}
                          </span>
                          <span className="text-gray-400">
                            ({formatDate(milestone.dueDate)})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <Button variant="ghost" size="sm" className="text-xs">
            View All Goals
          </Button>
          <Button size="sm" className="text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Goal
          </Button>
        </div>
      </CardContent>
    </DashboardWidget>
  );
});

GoalsTrackerWidget.displayName = 'GoalsTrackerWidget';

export default GoalsTrackerWidget;
