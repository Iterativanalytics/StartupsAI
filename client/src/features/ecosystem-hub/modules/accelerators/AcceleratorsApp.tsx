import React from 'react';
import { Users, BookOpen, Mic, Wallet, TrendingUp, Rocket } from 'lucide-react';
import { ToastType } from '../../types';

interface AcceleratorsAppProps {
  addToast: (message: string, type: ToastType) => void;
}

const AcceleratorsApp: React.FC<AcceleratorsAppProps> = ({ addToast }) => {
  const features = [
    {
      icon: Users,
      title: "Cohort-Based Learning",
      description: "Learn alongside peer startups in structured cohorts.",
      details: "12-15 startups per cohort with weekly group sessions."
    },
    {
      icon: BookOpen,
      title: "Structured Curriculum",
      description: "Proven framework covering all aspects of startup building.",
      details: "12-week program with weekly modules and assignments."
    },
    {
      icon: Mic,
      title: "World-Class Mentorship",
      description: "Access to a network of successful founders and industry experts.",
      details: "Weekly 1-on-1s and office hours with dedicated mentors."
    },
    {
      icon: Wallet,
      title: "Seed Funding",
      description: "Initial capital to fuel your growth and extend your runway.",
      details: "$150k investment for 7% equity."
    },
    {
      icon: TrendingUp,
      title: "Investor Network",
      description: "Connections to top-tier VCs and angel investors at Demo Day.",
      details: "Curated investor list and post-program fundraising support."
    }
  ];

  const schedule = [
    { week: "Week 1-2", title: "Foundation & Vision", deliverable: "Customer Interview Summary" },
    { week: "Week 3-4", title: "Product Development", deliverable: "Product Roadmap" },
    { week: "Week 5-6", title: "Go-to-Market", deliverable: "Initial GTM Plan" },
    { week: "Week 7-8", title: "Metrics & Growth", deliverable: "Growth Dashboard" },
    { week: "Week 9-10", title: "Fundraising Prep", deliverable: "Final Pitch Deck" },
    { week: "Week 11-12", title: "Demo Day & Beyond", deliverable: "Demo Day Pitch" },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-12 text-white text-center">
        <h2 className="text-5xl font-bold mb-4">Build, Grow, and Scale Faster</h2>
        <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
          Our accelerator provides the capital, mentorship, and network to help early-stage startups achieve rapid growth and secure follow-on funding.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
            <div className="text-sm text-white/80">Investment</div>
            <div className="text-3xl font-bold">$150K</div>
            <div className="text-sm">For 7% Equity</div>
          </div>
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
            <div className="text-sm text-white/80">Duration</div>
            <div className="text-3xl font-bold">12 Weeks</div>
            <div className="text-sm">Intensive Program</div>
          </div>
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
            <div className="text-sm text-white/80">Success Rate</div>
            <div className="text-3xl font-bold">85%</div>
            <div className="text-sm">Raise Follow-On</div>
          </div>
        </div>
        <button 
          onClick={() => addToast('Applications opening soon!', 'info')}
          className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-50 transition-all text-lg shadow-lg inline-flex items-center gap-2"
        >
          <Rocket className="w-6 h-6" />
          Apply Now
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-6">12-Week Program Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schedule.map((phase) => (
            <div key={phase.week} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm font-semibold text-purple-600">{phase.week}</p>
              <h4 className="font-bold text-slate-800 mt-1">{phase.title}</h4>
              <p className="text-xs font-semibold text-slate-700 mt-3 pt-3 border-t border-slate-200">
                DELIVERABLE: {phase.deliverable}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-6">What We Provide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(feature => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-white p-6 rounded-lg border-2 border-slate-200 hover:border-purple-400 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                </div>
                <p className="text-slate-600 mb-2">{feature.description}</p>
                <p className="text-sm text-slate-500">{feature.details}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AcceleratorsApp;
