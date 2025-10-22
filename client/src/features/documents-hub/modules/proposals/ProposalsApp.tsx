import React from 'react';
import { ToastType } from '../../types';
import { FileSignature, Target, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProposalsAppProps {
  addToast: (message: string, type: ToastType) => void;
}

const ProposalsApp: React.FC<ProposalsAppProps> = ({ addToast }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full mb-4">
          <FileSignature className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-4xl font-bold text-slate-800 mb-2">IterativProposals</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Win more deals with AI-powered proposal creation and optimization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              RFP Response
            </CardTitle>
            <CardDescription>
              Automated RFP analysis and response generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              onClick={() => addToast('RFP automation coming soon!', 'info')}
            >
              Start RFP
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              RFI Management
            </CardTitle>
            <CardDescription>
              Handle information requests efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => addToast('RFI features coming soon!', 'info')}
            >
              Manage RFIs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Win Rate Analytics
            </CardTitle>
            <CardDescription>
              Track and improve your proposal success rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => addToast('Analytics coming soon!', 'info')}
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proposal Library</CardTitle>
            <CardDescription>
              Reusable content blocks and templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => addToast('Library features coming soon!', 'info')}
            >
              Browse Library
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProposalsApp;