import React from 'react';
import { ToastType } from '../../types';
import { Presentation, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DecksAppProps {
  showToast: (message: string, type: ToastType) => void;
}

const DecksApp: React.FC<DecksAppProps> = ({ showToast }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full mb-4">
          <Presentation className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-4xl font-bold text-slate-800 mb-2">IterativDecks</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          AI-powered pitch deck creation with validation and iteration built-in
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Generation
            </CardTitle>
            <CardDescription>
              Generate pitch decks from your business plan with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              onClick={() => showToast('AI deck generation coming soon!', 'info')}
            >
              Start Generation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validated Templates</CardTitle>
            <CardDescription>
              Templates based on successful funding rounds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => showToast('Template library coming soon!', 'info')}
            >
              Browse Templates
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investor Intelligence</CardTitle>
            <CardDescription>
              Tailor your deck to specific investor preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => showToast('Investor matching coming soon!', 'info')}
            >
              Match Investors
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DecksApp;