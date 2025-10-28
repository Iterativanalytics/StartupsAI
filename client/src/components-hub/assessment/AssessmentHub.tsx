import React from 'react';
import { CompositeProfile } from '@/types-hub';
import AssessmentResults from './AssessmentResults';
import { Activity } from 'lucide-react';

interface AssessmentHubProps {
    profile?: CompositeProfile | null;
}

const AssessmentHub: React.FC<AssessmentHubProps> = ({ profile }) => {
    if (!profile) {
        return (
            <div className="p-6 text-center">
                <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="font-bold text-slate-700">Assessment Not Found</h3>
                <p className="text-sm text-slate-500">Complete the onboarding process to generate your founder profile.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <AssessmentResults profile={profile} />
        </div>
    );
};

export default AssessmentHub;
