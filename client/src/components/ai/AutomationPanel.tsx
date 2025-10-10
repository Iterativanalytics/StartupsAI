import { useState } from 'react';
import { Zap, Play, Pause, Settings, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: string;
  actions: number;
  lastRun?: Date;
}

export function AutomationPanel() {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Low Runway Alert',
      description: 'Alert when runway drops below 6 months',
      enabled: true,
      trigger: 'financial_update',
      actions: 2,
      lastRun: new Date()
    },
    {
      id: '2',
      name: 'High Valuation Alert',
      description: 'Flag deals with high valuation multiples',
      enabled: true,
      trigger: 'deal_submitted',
      actions: 1
    },
    {
      id: '3',
      name: 'Weekly Portfolio Review',
      description: 'Generate weekly portfolio insights',
      enabled: false,
      trigger: 'schedule',
      actions: 3
    }
  ]);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-teal-500 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Automation Rules</h2>
            <p className="text-sm text-gray-600">
              Automate workflows and get intelligent alerts
            </p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {rules.filter(r => r.enabled).length}
          </div>
          <div className="text-sm text-gray-600">Active Rules</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-teal-600">
            {rules.length}
          </div>
          <div className="text-sm text-gray-600">Total Rules</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            12
          </div>
          <div className="text-sm text-gray-600">Runs Today</div>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <Card key={rule.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{rule.name}</h3>
                  <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                    {rule.enabled ? 'Active' : 'Paused'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Trigger: {rule.trigger}</span>
                  <span>•</span>
                  <span>{rule.actions} action{rule.actions !== 1 ? 's' : ''}</span>
                  {rule.lastRun && (
                    <>
                      <span>•</span>
                      <span>Last run: {rule.lastRun.toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule.id)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}