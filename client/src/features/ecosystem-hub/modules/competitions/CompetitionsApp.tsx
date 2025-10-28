import React from 'react';
import { Trophy, DollarSign, Users, Award, Target, CheckCircle } from 'lucide-react';
import { ToastType } from '../../types';

interface CompetitionsAppProps {
  addToast: (message: string, type: ToastType) => void;
}

const CompetitionsApp: React.FC<CompetitionsAppProps> = ({ addToast }) => {
  const activeCompetitions = [
    {
      id: 1,
      name: "AI Innovation Challenge 2025",
      prize: "$100,000",
      deadline: "2025-06-30",
      category: "Artificial Intelligence",
      participants: 247,
      status: "Open",
      requirements: ["Working MVP", "AI/ML Focus", "Pitch Deck"],
      benefits: ["Cash Prize", "Mentorship", "Investor Introductions"]
    },
    {
      id: 2,
      name: "Sustainable Tech Grand Prix",
      prize: "$75,000",
      deadline: "2025-05-15",
      category: "Climate Tech",
      participants: 189,
      status: "Open",
      requirements: ["Pre-seed Stage", "Climate Impact", "Team of 2+"],
      benefits: ["Cash Prize", "Accelerator Spot", "Media Coverage"]
    },
    {
      id: 3,
      name: "HealthTech Innovators Cup",
      prize: "$50,000",
      deadline: "2025-07-20",
      category: "Healthcare",
      participants: 156,
      status: "Open",
      requirements: ["Healthcare Focus", "Prototype Ready", "Business Model"],
      benefits: ["Cash Prize", "Pilot Partners", "Regulatory Guidance"]
    }
  ];

  const pastWinners = [
    { year: 2024, company: "NeuralFlow AI", category: "AI/ML", outcome: "Raised $5M Series A" },
    { year: 2024, company: "GreenGrid Energy", category: "Climate", outcome: "Acquired by Tesla" },
    { year: 2023, company: "HealthSync", category: "Healthcare", outcome: "$3M Seed Round" },
  ];

  const benefits = [
    { icon: DollarSign, title: "Cash Prizes", description: "Win up to $100,000 in non-dilutive capital" },
    { icon: Users, title: "Expert Judging", description: "Get feedback from top VCs and industry leaders" },
    { icon: Target, title: "Exposure", description: "Showcase your startup to investors and media" },
    { icon: Award, title: "Accelerator Access", description: "Fast-track admission to our accelerator program" },
  ];

  const formatDeadline = (deadline: string) => {
    const diffDays = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Closed';
    if (diffDays <= 30) return `${diffDays} days left`;
    return `${Math.ceil(diffDays / 30)} months left`;
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-2xl shadow-2xl p-12 text-white text-center">
        <h2 className="text-5xl font-bold mb-4">Compete, Win, and Get Discovered</h2>
        <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
          Participate in startup competitions to win cash prizes, gain exposure, and connect with investors and industry leaders.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
            <div className="text-sm text-white/80">Total Prizes</div>
            <div className="text-3xl font-bold">$500K+</div>
            <div className="text-sm">Annually</div>
          </div>
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
            <div className="text-sm text-white/80">Active Competitions</div>
            <div className="text-3xl font-bold">12</div>
            <div className="text-sm">This Year</div>
          </div>
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
            <div className="text-sm text-white/80">Success Rate</div>
            <div className="text-3xl font-bold">45%</div>
            <div className="text-sm">Raise Capital</div>
          </div>
        </div>
        <button 
          onClick={() => addToast('Browse all competitions!', 'info')}
          className="bg-white text-orange-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-50 transition-all text-lg shadow-lg inline-flex items-center gap-2"
        >
          <Trophy className="w-6 h-6" />
          View All Competitions
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-6">Active Competitions</h3>
        <div className="space-y-4">
          {activeCompetitions.map(comp => (
            <div key={comp.id} className="border-2 border-slate-200 rounded-lg p-6 hover:border-orange-400 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-bold text-slate-800">{comp.name}</h4>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {comp.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{comp.category}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Prize Pool</p>
                      <p className="text-xl font-bold text-orange-600">{comp.prize}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Deadline</p>
                      <p className="text-sm text-slate-600">{formatDeadline(comp.deadline)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Participants</p>
                      <p className="text-sm text-slate-600">{comp.participants} teams</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Status</p>
                      <p className="text-sm text-green-600 font-semibold">Applications Open</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Requirements:</p>
                      <div className="flex flex-wrap gap-1">
                        {comp.requirements.map(req => (
                          <span key={req} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {comp.benefits.map(benefit => (
                          <span key={benefit} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => addToast(`Application submitted for ${comp.name}!`, 'success')}
                className="w-full bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-6">Why Compete?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(benefit => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="text-center p-6 bg-slate-50 rounded-lg hover:shadow-md transition-all">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{benefit.title}</h4>
                <p className="text-sm text-slate-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-6">Past Winners</h3>
        <div className="space-y-3">
          {pastWinners.map((winner, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{winner.company}</h4>
                  <p className="text-sm text-slate-500">{winner.year} • {winner.category}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-green-600">{winner.outcome}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompetitionsApp;
