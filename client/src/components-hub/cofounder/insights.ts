import { CompositeProfile, Insight, Goal } from '@/types-hub';

export const generateInsights = (profile: CompositeProfile, goals: Goal[]): Insight[] => {
    const insights: Insight[] = [];

    // --- Profile-based insights ---
    if (profile.bigFive.conscientiousness < 4) {
        insights.push({
            id: 'low-conscientiousness',
            type: 'risk',
            priority: 'high',
            title: 'Blind Spot: Execution',
            message: 'Your profile suggests a talent for ideas, but a potential challenge with disciplined execution. Should we set up a more rigorous goal-tracking system together?',
            delivery: ['dashboard', 'whatsapp'],
        });
    }

    if (profile.bigFive.neuroticism > 7) {
        insights.push({
            id: 'high-neuroticism',
            type: 'warning',
            priority: 'high',
            title: 'Burnout Risk Detected',
            message: 'Your personality is prone to stress. Remember to prioritize well-being to maintain long-term performance. Have you taken a break recently?',
            delivery: ['dashboard', 'whatsapp'],
        });
    }
    
    if (profile.founderArchetype.name === 'Visionary Innovator') {
        insights.push({
            id: 'arch-visionary',
            type: 'opportunity',
            priority: 'medium',
            title: 'Strength: Vision',
            message: 'As a Visionary Innovator, your strength is seeing the future. Let\'s ensure we\'re validating that vision with small, concrete experiments to de-risk it.',
            delivery: ['dashboard'],
        });
    }
    
    if (profile.aiReadiness.overall < 40) {
        insights.push({
            id: 'low-ai-readiness',
            type: 'opportunity',
            priority: 'medium',
            title: 'AI Adoption Opportunity',
            message: 'There are simple AI tools that could save you hours each week. Want to explore some no-code options to boost productivity?',
            delivery: ['dashboard'],
        });
    }

    // --- Goal-based insights ---
    goals.forEach(goal => {
        if (goal.status === 'at-risk') {
             insights.push({
                id: `goal-at-risk-${goal.id}`,
                type: 'accountability',
                priority: 'medium',
                title: `Goal At Risk: "${goal.text}"`,
                message: 'This goal is marked as "at-risk". What are the current blockers? Let\'s break them down and create a plan to get back on track.',
                delivery: ['dashboard', 'whatsapp'],
            });
        }
        if (goal.status === 'off-track') {
             insights.push({
                id: `goal-off-track-${goal.id}`,
                type: 'accountability',
                priority: 'high',
                title: `Goal Off Track: "${goal.text}"`,
                message: 'This crucial goal is off-track. We need to address this urgently. Let\'s spend 15 minutes right now to create a recovery plan.',
                delivery: ['dashboard', 'whatsapp'],
            });
        }
    });

    return insights;
};
