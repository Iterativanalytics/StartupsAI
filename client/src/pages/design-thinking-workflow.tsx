// ============================================================================
// DESIGN THINKING WORKFLOW PAGE
// Main page for DT workflow management
// ============================================================================

import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { DTWorkflowDashboard } from '../components/design-thinking/DTWorkflowDashboard';
import { EmpathyMapBuilder } from '../components/design-thinking/EmpathyMapBuilder';
import { POVStatementBuilder } from '../components/design-thinking/POVStatementBuilder';
import { HMWQuestionGenerator } from '../components/design-thinking/HMWQuestionGenerator';
import { IdeaEvaluationMatrix } from '../components/design-thinking/IdeaEvaluationMatrix';

export function DesignThinkingWorkflowPage() {
  const [, params] = useRoute('/design-thinking/:workflowId/:view?');
  const workflowId = params?.workflowId || '';
  const view = params?.view || 'dashboard';

  const renderView = () => {
    switch (view) {
      case 'empathy':
        return <EmpathyMapBuilder workflowId={workflowId} />;
      case 'pov':
        return <POVStatementBuilder workflowId={workflowId} />;
      case 'hmw':
        return <HMWQuestionGenerator workflowId={workflowId} />;
      case 'ideate':
        return <IdeaEvaluationMatrix workflowId={workflowId} />;
      case 'dashboard':
      default:
        return <DTWorkflowDashboard workflowId={workflowId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-6">
            <NavTab 
              label="Dashboard" 
              href={`/design-thinking/${workflowId}/dashboard`}
              active={view === 'dashboard'}
            />
            <NavTab 
              label="Empathy" 
              href={`/design-thinking/${workflowId}/empathy`}
              active={view === 'empathy'}
            />
            <NavTab 
              label="POV Statements" 
              href={`/design-thinking/${workflowId}/pov`}
              active={view === 'pov'}
            />
            <NavTab 
              label="HMW Questions" 
              href={`/design-thinking/${workflowId}/hmw`}
              active={view === 'hmw'}
            />
            <NavTab 
              label="Ideas" 
              href={`/design-thinking/${workflowId}/ideate`}
              active={view === 'ideate'}
            />
          </nav>
        </div>
      </div>

      {/* Content */}
      {renderView()}
    </div>
  );
}

function NavTab({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
        active
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
      }`}
    >
      {label}
    </a>
  );
}
