
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAccountability } from '@/hooks/co-founder/useAccountability';
import { useToast } from '@/hooks/use-toast';
import { getStatusBadgeVariant } from '@/utils/statusUtils';

export function GoalTracker() {
  const { goals, isLoadingGoals, addGoal, isAddingGoal } = useAccountability();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });

  const handleAddGoal = () => {
    if (!newGoal.description || !newGoal.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    addGoal(newGoal, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Goal added successfully"
        });
        setIsDialogOpen(false);
        setNewGoal({ description: '', dueDate: '', priority: 'medium' });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to add goal",
          variant: "destructive"
        });
      }
    });
  };

  const activeGoals = goals.filter(g => g.status !== 'completed');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoadingGoals) {
    return (
      <Card>
        <CardContent className="p-6" data-testid="goal-tracker-loading">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="goal-tracker">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Goal Tracker
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" data-testid="button-add-goal">
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    data-testid="input-goal-description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Enter goal description"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    data-testid="input-goal-duedate"
                    value={newGoal.dueDate}
                    onChange={(e) => setNewGoal({ ...newGoal, dueDate: new Date(e.target.value).toISOString() })}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newGoal.priority}
                    onValueChange={(value: any) => setNewGoal({ ...newGoal, priority: value })}
                  >
                    <SelectTrigger data-testid="select-goal-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddGoal}
                  disabled={isAddingGoal}
                  className="w-full"
                  data-testid="button-submit-goal"
                >
                  {isAddingGoal ? 'Adding...' : 'Add Goal'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg" data-testid="goal-summary">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600" data-testid="text-active-goals">{activeGoals.length}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600" data-testid="text-completed-goals">{completedGoals.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600" data-testid="text-success-rate">
              {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Active Goals */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700">Active Goals</h4>
          {activeGoals.length > 0 ? (
            activeGoals.map((goal) => (
              <div key={goal.id} className="p-3 border rounded-lg space-y-2" data-testid={`goal-item-${goal.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    {getStatusIcon(goal.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" data-testid={`text-goal-description-${goal.id}`}>{goal.description}</p>
                      <p className="text-xs text-gray-500 mt-1" data-testid={`text-goal-duedate-${goal.id}`}>
                        Due: {new Date(goal.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={goal.status === 'completed' ? 'default' : goal.status === 'in_progress' ? 'secondary' : 'outline'} className="text-xs" data-testid={`badge-goal-status-${goal.id}`}>
                    {goal.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium" data-testid={`text-goal-progress-${goal.id}`}>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" data-testid={`progress-goal-${goal.id}`} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4" data-testid="text-no-goals">
              No active goals. Set some goals to track your progress!
            </p>
          )}
        </div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-700">Recently Completed</h4>
            {completedGoals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <p className="font-medium text-sm text-gray-900">{goal.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
