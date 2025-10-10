import React from 'react';

interface IdeationCanvasProps {
  workflowId: string;
}

export function IdeationCanvas({ workflowId }: IdeationCanvasProps) {
  return (
    <div className="p-4">
      <h3>Ideation Canvas</h3>
      <p>Component coming soon... Workflow ID: {workflowId}</p>
    </div>
  );
}
