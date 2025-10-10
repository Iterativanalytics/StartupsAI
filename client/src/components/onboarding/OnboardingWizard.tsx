import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useFeature } from '@/contexts/FeatureFlagsContext';
import { UserType } from '@shared/schema';

type OnboardingData = {
  role: UserType | '';
  companyStage: 'idea' | 'prototype' | 'mvp' | 'growth' | 'scale' | '';
  fundingGoals: string;
  teamSize: number | '';
  primaryChallenges: string;
  industry: string;
};

const initialData: OnboardingData = {
  role: '',
  companyStage: '',
  fundingGoals: '',
  teamSize: '',
  primaryChallenges: '',
  industry: '',
};

type OnboardingWizardProps = {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onSkip }) => {
  const enabled = useFeature('onboarding_v2');
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);

  const steps = useMemo(() => (
    [
      { key: 'role', title: 'Your role', description: 'Tell us who you are' },
      { key: 'companyStage', title: 'Company stage', description: 'Where are you in your journey?' },
      { key: 'industry', title: 'Industry', description: 'What space are you in?' },
      { key: 'fundingGoals', title: 'Funding goals', description: 'What are you aiming to raise?' },
      { key: 'teamSize', title: 'Team size & challenges', description: 'Your team and primary challenges' },
    ] as const
  ), []);

  if (!enabled) return null;

  const progress = (step - 1) / (steps.length - 1) * 100;

  const next = () => setStep(s => Math.min(s + 1, steps.length));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const handleComplete = async () => {
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: data.role,
          preferences: { onboarding_v2: true },
        }),
      });
    } catch {}
    onComplete(data);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Getting started</span>
            <div className="w-40">
              <Progress value={progress} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-3">
              <Label>Your role</Label>
              <Select value={data.role} onValueChange={(v) => setData(d => ({ ...d, role: v as UserType }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserType).map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Label>Company stage</Label>
              <Select value={data.companyStage} onValueChange={(v) => setData(d => ({ ...d, companyStage: v as OnboardingData['companyStage'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  {['idea','prototype','mvp','growth','scale'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <Label>Industry</Label>
              <Input value={data.industry} onChange={(e) => setData(d => ({ ...d, industry: e.target.value }))} placeholder="e.g., B2B SaaS" />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <Label>Funding goals</Label>
              <Input value={data.fundingGoals} onChange={(e) => setData(d => ({ ...d, fundingGoals: e.target.value }))} placeholder="e.g., $500k seed round" />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <Label>Team size</Label>
              <Input type="number" value={data.teamSize as any} onChange={(e) => setData(d => ({ ...d, teamSize: e.target.valueAsNumber || '' }))} placeholder="e.g., 5" />
              <Label>Primary challenges</Label>
              <Input value={data.primaryChallenges} onChange={(e) => setData(d => ({ ...d, primaryChallenges: e.target.value }))} placeholder="e.g., GTM focus, fundraising narrative" />
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={back} disabled={step === 1}>Back</Button>
            <div className="flex items-center gap-2">
              {onSkip && <Button variant="ghost" onClick={onSkip}>Skip</Button>}
              {step < steps.length ? (
                <Button onClick={next}>Continue</Button>
              ) : (
                <Button onClick={handleComplete}>Finish</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
