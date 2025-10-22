import React from 'react';
import { ToastType } from '../../types';
import { FormInput, Zap, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FormsAppProps {
  addToast: (message: string, type: ToastType) => void;
}

const FormsApp: React.FC<FormsAppProps> = ({ addToast }) => {
  const mockApplications = [
    {
      name: 'Y Combinator',
      type: 'Accelerator',
      deadline: '2025-03-15',
      progress: 75,
    },
    {
      name: 'TechStars',
      type: 'Accelerator',
      deadline: '2025-04-01',
      progress: 30,
    },
    {
      name: 'NSF SBIR',
      type: 'Grant',
      deadline: '2025-05-15',
      progress: 0,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full mb-4">
          <FormInput className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-4xl font-bold text-slate-800 mb-2">IterativForms</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          AI-powered application filling for accelerators, grants, and competitions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-2xl font-bold text-slate-800">Active Applications</h3>
          {mockApplications.map((app, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{app.name}</CardTitle>
                    <CardDescription>{app.type} • Deadline: {app.deadline}</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addToast(`Opening ${app.name} application...`, 'info')}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    AI Fill
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{app.progress}%</span>
                  </div>
                  <Progress value={app.progress} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Business Plan Sync
              </CardTitle>
              <CardDescription>
                Auto-fill applications using your business plan data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Plan Connected</span>
              </div>
              <Button 
                className="w-full"
                onClick={() => addToast('Business plan sync active', 'success')}
              >
                Manage Sync
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Templates</CardTitle>
              <CardDescription>
                Browse common application types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addToast('Accelerator templates coming soon!', 'info')}
                >
                  Accelerators
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addToast('Grant templates coming soon!', 'info')}
                >
                  Grants
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addToast('Competition templates coming soon!', 'info')}
                >
                  Competitions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormsApp;