import React from 'react';

interface TestSessionManagerProps {
  workflowId: string;
}

export function TestSessionManager({ workflowId }: TestSessionManagerProps) {
  return (
    <div className="p-4">
      <h3>Test Session Manager</h3>
      <p>Component coming soon... Workflow ID: {workflowId}</p>
    </div>
  );
}
