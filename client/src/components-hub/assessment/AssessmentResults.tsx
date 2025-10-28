import React from 'react';
import { CompositeProfile } from '../../types';
import RadarChart from '../charts/RadarChart';
import { Sparkles, Check, AlertTriangle } from 'lucide-react';

interface AssessmentResultsProps {
  profile: CompositeProfile;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ profile }) => {
  const riasecData = [
    { label: 'R', value: profile.riasec.realistic },
    { label: 'I', value: profile.riasec.investigative },
    { label: 'A', value: profile.riasec.artistic },
    { label: 'S', value: profile.riasec.social },
    { label: 'E', value: profile.riasec.enterprising },
    { label: 'C', value: profile.riasec.conventional },
  ];
  const bigFiveData = [
    { label: 'O', value: profile.bigFive.openness },
    { label: 'C', value: profile.bigFive.conscientiousness },
    { label: 'E', value: profile.bigFive.extraversion },
    { label: 'A', value: profile.bigFive.agreeableness },
    { label: 'N', value: profile.bigFive.neuroticism },
  ];
  const aiReadinessLevel = profile.aiReadiness.overall > 85 ? 'AI Native' : profile.aiReadiness.overall > 65 ? 'Advanced' : profile.aiReadiness.overall > 40 ? 'Intermediate' : 'Beginner';

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl p-8 text-center">
        <Sparkles className="w-12 h-12 mx-auto mb-3" />
        <h2 className="text-3xl font-bold">Your Founder Archetype</h2>
        <p className="text-4xl font-bold my-2">{profile.founderArchetype.name}</p>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">{profile.founderArchetype.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h3 className="font-bold text-lg mb-2">RIASEC Profile</h3>
            <div className="flex items-center justify-center">
                <RadarChart data={riasecData} size={220} />
            </div>
            <p className="text-xs text-center text-slate-500 mt-2">R: Realistic, I: Investigative, A: Artistic, S: Social, E: Enterprising, C: Conventional</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h3 className="font-bold text-lg mb-2">Big Five (OCEAN) Profile</h3>
            <div className="flex items-center justify-center">
                <RadarChart data={bigFiveData} size={220} />
            </div>
            <p className="text-xs text-center text-slate-500 mt-2">O: Openness, C: Conscientiousness, E: Extraversion, A: Agreeableness, N: Neuroticism</p>
        </div>
      </div>
      
       <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h3 className="font-bold text-lg mb-3">AI Readiness</h3>
            <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-purple-600">{aiReadinessLevel}</div>
                <div className="flex-1">
                    <div className="w-full bg-slate-200 rounded-full h-4">
                        <div className="bg-purple-600 h-4 rounded-full" style={{width: `${profile.aiReadiness.overall}%`}}></div>
                    </div>
                    <p className="text-sm text-right mt-1 font-semibold">{profile.aiReadiness.overall}/100</p>
                </div>
            </div>
        </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="font-bold text-lg text-green-800 mb-3 flex items-center gap-2"><Check className="w-5 h-5"/> Core Strengths</h3>
            <ul className="space-y-2">
                {profile.coreStrengths.map((s, i) => (
                    <li key={i} className="text-sm text-green-700">{s}</li>
                ))}
            </ul>
        </div>
         <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="font-bold text-lg text-red-800 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Critical Blind Spots</h3>
            <ul className="space-y-2">
                {profile.blindSpots.map((s, i) => (
                    <li key={i} className="text-sm text-red-700">{s}</li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
