import React, { useState } from 'react';
import { ApplicationForm } from '@/types-hub';
import { Search, Filter, Briefcase, Award, Rocket, Trophy, ArrowRight, Calendar } from 'lucide-react';

interface FastTrackModeProps {
  applications: ApplicationForm[];
  onSelectApplication: (app: ApplicationForm) => void;
}

const TYPE_ICONS: Record<ApplicationForm['type'], React.ElementType> = {
  accelerator: Rocket,
  grant: Award,
  competition: Trophy,
  investment: Briefcase,
};

const FastTrackMode: React.FC<FastTrackModeProps> = ({ applications, onSelectApplication }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || app.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filters = ['all', 'accelerator', 'grant', 'competition'];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full mb-4">
          <Rocket className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">AI Application Filler</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Save hours. Fill applications for accelerators, grants, and competitions automatically using your business plan data.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <Filter className="w-5 h-5 text-slate-500 mx-2" />
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                  activeFilter === filter ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map(app => {
            const Icon = TYPE_ICONS[app.type];
            return (
              <div key={app.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col hover:shadow-lg hover:border-purple-300 transition-all">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg border">
                            <Icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{app.name}</h3>
                            <p className="text-sm text-slate-500">{app.organization}</p>
                        </div>
                    </div>
                     <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded-full capitalize">{app.type}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {new Date(app.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                
                <div className="mt-auto">
                    <button
                        onClick={() => onSelectApplication(app)}
                        className="w-full bg-white border-2 border-purple-500 text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        View & Fill with AI <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FastTrackMode;