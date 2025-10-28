import React, { useState } from 'react';
import { Goal } from '@/types-hub';
import { Target, PlusCircle, Award } from 'lucide-react';

interface GoalTrackerProps {
    title: string;
    goals: Goal[];
    setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
    onMilestoneComplete: (milestone: Goal) => void;
}

const statusOptions: Goal['status'][] = ['on-track', 'at-risk', 'off-track', 'complete'];
const statusStyles: Record<Goal['status'], string> = {
    'on-track': 'bg-green-100 text-green-800 border-green-200',
    'at-risk': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'off-track': 'bg-red-100 text-red-800 border-red-200',
    'complete': 'bg-purple-100 text-purple-800 border-purple-200',
};

const GoalTracker: React.FC<GoalTrackerProps> = ({ title, goals, setGoals, onMilestoneComplete }) => {
    const [newGoalText, setNewGoalText] = useState('');
    const [isNewGoalMilestone, setIsNewGoalMilestone] = useState(false);

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalText.trim()) {
            const newGoal: Goal = {
                id: Date.now().toString(),
                text: newGoalText,
                status: 'on-track',
                isMilestone: isNewGoalMilestone
            };
            setGoals(prev => [...prev, newGoal]);
            setNewGoalText('');
            setIsNewGoalMilestone(false);
        }
    };
    
    const handleStatusChange = (goalId: string, newStatus: Goal['status']) => {
        setGoals(prevGoals => {
            let originalStatus: Goal['status'] | undefined;
            const newGoals = prevGoals.map(g => {
                if (g.id === goalId) {
                    originalStatus = g.status;
                    return { ...g, status: newStatus };
                }
                return g;
            });

            const updatedGoal = newGoals.find(g => g.id === goalId);
            if (updatedGoal && updatedGoal.isMilestone && newStatus === 'complete' && originalStatus !== 'complete') {
                onMilestoneComplete(updatedGoal);
            }
            return newGoals;
        });
    };

    return (
        <div className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                {title}
            </h3>
            <div className="space-y-3">
                {goals.map(goal => (
                    <div key={goal.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-grow overflow-hidden">
                            {goal.isMilestone && <span className="flex-shrink-0" title="Milestone"><Award className="w-4 h-4 text-yellow-500" /></span>}
                            <p className={`text-sm text-slate-700 truncate ${goal.status === 'complete' ? 'line-through text-slate-500' : ''}`}>
                                {goal.text}
                            </p>
                        </div>
                        <select
                            value={goal.status}
                            onChange={(e) => handleStatusChange(goal.id, e.target.value as Goal['status'])}
                            className={`text-xs font-semibold rounded-md p-1 border focus:outline-none focus:ring-2 focus:ring-purple-400 capitalize ${statusStyles[goal.status]}`}
                        >
                            {statusOptions.map(opt => <option key={opt} value={opt}>{opt.replace('-', ' ')}</option>)}
                        </select>
                    </div>
                ))}
            </div>
            <form onSubmit={handleAddGoal} className="space-y-3 pt-4 border-t border-slate-200">
                 <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        placeholder="Add a new goal or milestone..."
                        className="flex-grow w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                    <button type="submit" className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors">
                        <PlusCircle className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        id="isMilestone" 
                        checked={isNewGoalMilestone} 
                        onChange={(e) => setIsNewGoalMilestone(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="isMilestone" className="ml-2 block text-sm text-gray-900">
                        Mark as a Milestone (completing it boosts vested interest)
                    </label>
                </div>
            </form>
        </div>
    );
};

export default GoalTracker;