import React from 'react';

interface PrototypePlannerProps {
  workflowId: string;
}

export function PrototypePlanner({ workflowId }: PrototypePlannerProps) {
  return (
    <div className="p-4">
      <h3>Prototype Planner</h3>
      <p>Component coming soon... Workflow ID: {workflowId}</p>
    </div>
  );
}
