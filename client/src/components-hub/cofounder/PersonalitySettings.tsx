import React from 'react';
import { CoFounderPersonality, WhatsAppSettings, ToastType } from '@/types-hub';
import { SlidersHorizontal, Smartphone } from 'lucide-react';

interface PersonalitySettingsProps {
    agentName: string;
    personality: CoFounderPersonality;
    setPersonality: (p: CoFounderPersonality) => void;
    whatsAppSettings: WhatsAppSettings;
    setWhatsAppSettings: React.Dispatch<React.SetStateAction<WhatsAppSettings>>;
    addToast: (message: string, type: ToastType) => void;
}

const personalityPresets = {
  'supportive-mentor': {
    traits: { assertiveness: 5, optimism: 8, detail_orientation: 6, risk_tolerance: 5, directness: 6 },
    style: { 
      formality: 'casual' as const, 
      humor: 'occasional' as const,
      storytelling: true,
      questioning: 'socratic' as const
    },
    expertise: {
      primary: ['mentoring', 'support'],
      secondary: ['guidance', 'coaching'],
      learning: ['personal-development']
    },
    interaction: {
      proactivity: 'medium' as const,
      checkInFrequency: 'weekly' as const,
      challengeLevel: 'supportive' as const
    }
  },
  'challenging-advisor': {
    traits: { assertiveness: 8, optimism: 5, detail_orientation: 8, risk_tolerance: 4, directness: 9 },
    style: { 
      formality: 'professional' as const, 
      humor: 'rare' as const,
      storytelling: false,
      questioning: 'direct' as const
    },
    expertise: {
      primary: ['analysis', 'strategy'],
      secondary: ['critical-thinking', 'evaluation'],
      learning: ['advanced-concepts']
    },
    interaction: {
      proactivity: 'high' as const,
      checkInFrequency: 'daily' as const,
      challengeLevel: 'challenging' as const
    }
  },
  'growth-partner': {
    traits: { assertiveness: 7, optimism: 7, detail_orientation: 5, risk_tolerance: 7, directness: 7 },
    style: { 
      formality: 'adaptive' as const, 
      humor: 'frequent' as const,
      storytelling: true,
      questioning: 'exploratory' as const
    },
    expertise: {
      primary: ['growth', 'innovation'],
      secondary: ['scaling', 'expansion'],
      learning: ['emerging-trends']
    },
    interaction: {
      proactivity: 'high' as const,
      checkInFrequency: 'weekly' as const,
      challengeLevel: 'balanced' as const
    }
  }
};

const TraitSlider: React.FC<{
    label: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 flex justify-between">
            <span>{label}</span>
            <span className="font-bold text-purple-600">{value}</span>
        </label>
        <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
    </div>
);


const PersonalitySettings: React.FC<PersonalitySettingsProps> = ({ agentName, personality, setPersonality, whatsAppSettings, setWhatsAppSettings, addToast }) => {
    
    const handleTraitChange = (trait: keyof CoFounderPersonality['traits']) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setPersonality({
            ...personality,
            traits: { ...personality.traits, [trait]: Number(e.target.value) }
        });
    };

    const handleStyleChange = (style: keyof CoFounderPersonality['style'], value: string) => {
       setPersonality({
            ...personality,
            style: { ...personality.style, [style]: value }
        });
    }
    
    const handleConnectWhatsApp = () => {
        const phone = whatsAppSettings.phoneNumber.replace(/\D/g, '');
        if (phone.length < 10) { 
            addToast('Please enter a valid phone number.', 'error');
            return;
        }
        setWhatsAppSettings(prev => ({ ...prev, enabled: true }));
        addToast(`WhatsApp connected to ${whatsAppSettings.phoneNumber}!`, 'success');
    }

    const handleDisconnectWhatsApp = () => {
        setWhatsAppSettings(prev => ({ ...prev, enabled: false, phoneNumber: '' }));
        addToast('WhatsApp disconnected.', 'info');
    }

    return (
        <div className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-purple-600" />
                {agentName} Personality
            </h3>

            <div>
                <h4 className="font-semibold text-slate-800 mb-2">Presets</h4>
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setPersonality(personalityPresets['supportive-mentor'])} className="text-xs p-2 bg-slate-100 hover:bg-slate-200 rounded-md">Supportive Mentor</button>
                    <button onClick={() => setPersonality(personalityPresets['challenging-advisor'])} className="text-xs p-2 bg-slate-100 hover:bg-slate-200 rounded-md">Challenging Advisor</button>
                    <button onClick={() => setPersonality(personalityPresets['growth-partner'])} className="text-xs p-2 bg-slate-100 hover:bg-slate-200 rounded-md">Growth Partner</button>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-slate-800 mb-3">Core Traits</h4>
                <div className="space-y-4">
                    <TraitSlider label="Assertiveness" value={personality.traits.assertiveness} onChange={handleTraitChange('assertiveness')} />
                    <TraitSlider label="Optimism" value={personality.traits.optimism} onChange={handleTraitChange('optimism')} />
                    <TraitSlider label="Detail Orientation" value={personality.traits.detail_orientation} onChange={handleTraitChange('detail_orientation')} />
                    <TraitSlider label="Risk Tolerance" value={personality.traits.risk_tolerance} onChange={handleTraitChange('risk_tolerance')} />
                    <TraitSlider label="Directness" value={personality.traits.directness} onChange={handleTraitChange('directness')} />
                </div>
            </div>
            
            <div>
                 <h4 className="font-semibold text-slate-800 mb-3">Communication Style</h4>
                 <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Formality</label>
                        <div className="flex gap-2 mt-1">
                           {(['casual', 'professional', 'adaptive'] as const).map(f => (
                               <button key={f} onClick={() => handleStyleChange('formality', f)} className={`text-xs p-2 rounded-md flex-1 ${personality.style.formality === f ? 'bg-purple-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>{f}</button>
                           ))}
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-700">Humor</label>
                        <div className="flex gap-2 mt-1">
                            {(['frequent', 'occasional', 'rare'] as const).map(h => (
                               <button key={h} onClick={() => handleStyleChange('humor', h)} className={`text-xs p-2 rounded-md flex-1 ${personality.style.humor === h ? 'bg-purple-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>{h}</button>
                           ))}
                        </div>
                    </div>
                 </div>
            </div>
            
            <div>
                 <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Proactive Messaging</h4>
                 <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                    {!whatsAppSettings.enabled ? (
                        <div className="space-y-3">
                            <p className="text-sm text-slate-600">Connect your WhatsApp for two-way chat with your {agentName} and to receive proactive insights, even when you're offline.</p>
                            <input 
                                type="tel" 
                                placeholder="Your WhatsApp Number"
                                value={whatsAppSettings.phoneNumber}
                                onChange={(e) => setWhatsAppSettings(p => ({...p, phoneNumber: e.target.value}))}
                                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md"
                            />
                            <button onClick={handleConnectWhatsApp} className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg">Connect WhatsApp</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-green-700">WhatsApp Connected</p>
                                    <p className="text-sm text-slate-600">{whatsAppSettings.phoneNumber}</p>
                                </div>
                                <button onClick={handleDisconnectWhatsApp} className="text-sm text-red-600 font-semibold">Disconnect</button>
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold mb-2">Notification Settings</h5>
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between text-sm">
                                        <span>High-Priority Alerts</span>
                                        <input type="checkbox" className="toggle-checkbox" checked={whatsAppSettings.sendHighPriority} onChange={e => setWhatsAppSettings(p => ({...p, sendHighPriority: e.target.checked}))} />
                                    </label>
                                    <label className="flex items-center justify-between text-sm">
                                        <span>Goal Updates & Nudges</span>
                                        <input type="checkbox" className="toggle-checkbox" checked={whatsAppSettings.sendGoalUpdates} onChange={e => setWhatsAppSettings(p => ({...p, sendGoalUpdates: e.target.checked}))} />
                                    </label>
                                    <label className="flex items-center justify-between text-sm">
                                        <span>Weekly Summary</span>
                                        <input type="checkbox" className="toggle-checkbox" checked={whatsAppSettings.sendWeeklySummary} onChange={e => setWhatsAppSettings(p => ({...p, sendWeeklySummary: e.target.checked}))} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default PersonalitySettings;