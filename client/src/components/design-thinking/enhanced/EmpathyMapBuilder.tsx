import React from 'react';

interface EmpathyMapBuilderProps {
  workflowId: string;
}

export function EmpathyMapBuilder({ workflowId }: EmpathyMapBuilderProps) {
  return (
    <div className="p-4">
      <h3>Empathy Map Builder</h3>
      <p>Component coming soon... Workflow ID: {workflowId}</p>
    </div>
  );
}
