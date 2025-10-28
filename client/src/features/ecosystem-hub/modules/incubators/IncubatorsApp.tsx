import React from 'react';
import { Building2, Users, Briefcase, FileText, DollarSign, Brain, MapPin, Wifi } from 'lucide-react';
import { ToastType } from '../../types';

interface IncubatorsAppProps {
  addToast: (message: string, type: ToastType) => void;
}

const IncubatorsApp: React.FC<IncubatorsAppProps> = ({ addToast }) => {
  const services = [
    { icon: Building2, title: "Flexible Workspace", description: "Dedicated desks, meeting rooms, and collaborative spaces", included: true },
    { icon: Users, title: "Mentorship Program", description: "Industry experts and successful entrepreneurs", included: true },
    { icon: Briefcase, title: "Business Support", description: "Legal, accounting, and HR services", included: true },
    { icon: FileText, title: "Grant Writing", description: "Assistance with finding and applying for grants", included: false },
    { icon: DollarSign, title: "Investor Network", description: "Introductions to our network of angel investors and VCs", included: false },
    { icon: Brain, title: "Workshops & Training", description: "Regular workshops on various business topics", included: true },
  ];

  const spaces = [
    {
      name: "Main Campus",
      location: "Downtown Tech District",
      capacity: 50,
      currentOccupancy: 38,
      amenities: ["High-speed WiFi", "Meeting Rooms", "Coffee Bar", "Event Space"],
      type: "Co-working Hub"
    },
    {
      name: "BioTech Labs",
      location: "University Research Park",
      capacity: 20,
      currentOccupancy: 15,
      amenities: ["Wet Labs", "Specialized Equipment", "Clean Rooms", "Shared Office"],
      type: "Specialized Lab"
    }
  ];

  const pricingTiers = [
    {
      name: 'Community',
      price: '$99/mo',
      description: 'For individuals needing network and event access',
      features: ['Virtual membership', 'Access to workshops', 'Community Slack channel', 'Event discounts']
    },
    {
      name: 'Resident',
      price: '$499/mo',
      description: 'For startups needing space and core resources',
      features: ['Everything in Community', '24/7 Workspace access', 'Meeting room credits', 'Basic mentorship'],
      highlighted: true
    },
    {
      name: 'Incubate',
      price: 'Custom Equity',
      description: 'For high-potential startups seeking deep support',
      features: ['Everything in Resident', 'Dedicated lead mentor', 'Business support services', 'Investor introductions']
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl p-12 text-white text-center">
        <h2 className="text-5xl font-bold mb-4">Long-Term Support for Early-Stage Startups</h2>
        <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
          Our incubators provide flexible workspace, mentorship, and business support services to help you build sustainable foundations for growth.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
            <div className="text-sm text-white/80">Duration</div>
            <div className="text-3xl font-bold">6-24 mo</div>
            <div className="text-sm">Flexible Terms</div>
          </div>
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
            <div className="text-sm text-white/80">Members</div>
            <div className="text-3xl font-bold">180+</div>
            <div className="text-sm">Active Startups</div>
          </div>
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
            <div className="text-sm text-white/80">Success</div>
            <div className="text-3xl font-bold">68%</div>
            <div className="text-sm">Still Operating</div>
          </div>
        </div>
        <button 
          onClick={() => addToast('Membership applications opening soon!', 'info')}
          className="bg-white text-emerald-600 font-bold py-4 px-8 rounded-xl hover:bg-slate-50 transition-all text-lg shadow-lg"
        >
          Become a Member
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-6">Support Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map(service => {
            const Icon = service.icon;
            return (
              <div 
                key={service.title} 
                className={`p-6 rounded-lg border-2 ${service.included ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-6 h-6 ${service.included ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <h4 className="font-bold text-slate-800">{service.title}</h4>
                </div>
                <p className="text-sm text-slate-600">{service.description}</p>
                {service.included && (
                  <div className="mt-2 text-xs font-semibold text-emerald-600">✓ Included</div>
                )}
                {!service.included && (
                  <div className="mt-2 text-xs font-semibold text-slate-500">Available in Premium</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-6">Our Spaces</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spaces.map(space => (
            <div key={space.name} className="border-2 border-slate-200 rounded-lg p-6 hover:border-emerald-400 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-slate-800">{space.name}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {space.location}
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {space.type}
                </span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Occupancy</span>
                  <span className="font-semibold">{space.currentOccupancy} / {space.capacity}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all" 
                    style={{ width: `${(space.currentOccupancy / space.capacity) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {space.amenities.map(amenity => (
                    <span key={amenity} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full flex items-center gap-1">
                      {amenity === "High-speed WiFi" && <Wifi className="w-3 h-3" />}
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-6 text-center">Membership Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`rounded-xl p-6 border-2 transition-all ${tier.highlighted ? 'border-emerald-500 shadow-lg scale-105' : 'border-slate-200'}`}
            >
              {tier.highlighted && (
                <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">
                  MOST POPULAR
                </div>
              )}
              <h4 className="text-2xl font-bold text-slate-800 mb-2">{tier.name}</h4>
              <div className="text-3xl font-bold text-emerald-600 mb-2">{tier.price}</div>
              <p className="text-sm text-slate-600 mb-4">{tier.description}</p>
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => addToast(`${tier.name} membership inquiry submitted!`, 'success')}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${tier.highlighted ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {tier.name === 'Community' ? 'Join Now' : tier.name === 'Resident' ? 'Apply' : 'Contact Us'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncubatorsApp;
