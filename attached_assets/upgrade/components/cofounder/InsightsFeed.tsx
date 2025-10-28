import React from 'react';
import { Insight } from '../../types';
import { AlertTriangle, TrendingUp, ShieldAlert, Badge, Sparkles } from 'lucide-react';

interface InsightsFeedProps {
    insights: Insight[];
    agentName: string;
}

const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
    const config = {
        risk: { icon: ShieldAlert, color: 'red' },
        warning: { icon: AlertTriangle, color: 'yellow' },
        opportunity: { icon: TrendingUp, color: 'green' },
        celebration: { icon: Sparkles, color: 'purple' },
        accountability: { icon: Badge, color: 'blue' },
    };

    const Icon = config[insight.type].icon;
    const color = config[insight.type].color;

    return (
        <div className={`border-l-4 border-${color}-500 bg-${color}-50 p-4 rounded-r-lg`}>
            <div className="flex items-start gap-3">
                <Icon className={`w-6 h-6 text-${color}-600 mt-1 flex-shrink-0`} />
                <div>
                    <div className="flex items-center justify-between">
                        <h4 className={`font-bold text-slate-800`}>{insight.title}</h4>
                         <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-${color}-200 text-${color}-800 capitalize`}>{insight.priority}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{insight.message}</p>
                    <button className={`mt-3 text-xs font-bold text-purple-600 hover:underline`}>Discuss this →</button>
                </div>
            </div>
        </div>
    );
};

const InsightsFeed: React.FC<InsightsFeedProps> = ({ insights, agentName }) => {
    return (
        <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Proactive Insights from your {agentName}</h3>
            {insights.length > 0 ? (
                <div className="space-y-4">
                    {insights.map(insight => (
                        <InsightCard key={insight.id} insight={insight} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-slate-50 rounded-lg">
                    <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h4 className="font-semibold text-slate-700">No new insights right now</h4>
                    <p className="text-sm text-slate-500">Your {agentName} is analyzing your progress. Insights will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default InsightsFeed;