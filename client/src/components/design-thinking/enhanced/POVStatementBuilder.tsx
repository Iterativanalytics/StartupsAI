import React from 'react';

interface POVStatementBuilderProps {
  workflowId: string;
}

export function POVStatementBuilder({ workflowId }: POVStatementBuilderProps) {
  return (
    <div className="p-4">
      <h3>POV Statement Builder</h3>
      <p>Component coming soon... Workflow ID: {workflowId}</p>
    </div>
  );
}
