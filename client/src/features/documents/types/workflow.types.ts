// Workflow-specific types for document system

export interface WorkflowEngine {
  createWorkflow(workflow: Workflow): Promise<Workflow>;
  updateWorkflow(workflowId: string, updates: Partial<Workflow>): Promise<Workflow>;
  deleteWorkflow(workflowId: string): Promise<void>;
  startWorkflow(workflowId: string, documentId: string, userId: string): Promise<WorkflowInstance>;
  completeStep(instanceId: string, stepId: string, userId: string, data?: any): Promise<void>;
  skipStep(instanceId: string, stepId: string, userId: string, reason?: string): Promise<void>;
  cancelWorkflow(instanceId: string, userId: string, reason?: string): Promise<void>;
  getWorkflow(workflowId: string): Promise<Workflow>;
  getWorkflowInstance(instanceId: string): Promise<WorkflowInstance>;
  getUserWorkflows(userId: string): Promise<Workflow[]>;
  getActiveInstances(documentId: string): Promise<WorkflowInstance[]>;
  getWorkflowTemplates(): Promise<WorkflowTemplate[]>;
  createWorkflowTemplate(template: WorkflowTemplate): Promise<WorkflowTemplate>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  type: WorkflowType;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  settings: WorkflowSettings;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: StepType;
  assignee: StepAssignee;
  dueDate: Date | null;
  required: boolean;
  parallel: boolean;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  notifications: NotificationConfig[];
  settings: StepSettings;
  order: number;
}

export type WorkflowType = 
  | 'approval' 
  | 'review' 
  | 'signature' 
  | 'notification' 
  | 'ai-analysis' 
  | 'custom';

export type StepType = 
  | 'review' 
  | 'approval' 
  | 'signature' 
  | 'notification' 
  | 'ai-analysis' 
  | 'data-collection' 
  | 'decision' 
  | 'parallel' 
  | 'merge';

export interface StepAssignee {
  type: 'user' | 'role' | 'group' | 'dynamic';
  value: string;
  fallback?: string;
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export type ConditionOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'greater_than' 
  | 'less_than' 
  | 'greater_than_or_equal' 
  | 'less_than_or_equal' 
  | 'in' 
  | 'not_in' 
  | 'is_empty' 
  | 'is_not_empty';

export interface WorkflowAction {
  id: string;
  type: ActionType;
  name: string;
  description: string;
  parameters: Record<string, any>;
  conditions?: WorkflowCondition[];
}

export type ActionType = 
  | 'update_field' 
  | 'send_notification' 
  | 'create_task' 
  | 'update_status' 
  | 'assign_user' 
  | 'send_email' 
  | 'webhook' 
  | 'ai_analysis' 
  | 'approval' 
  | 'rejection';

export interface NotificationConfig {
  type: 'email' | 'push' | 'in-app';
  template: string;
  recipients: string[];
  conditions?: WorkflowCondition[];
}

export interface StepSettings {
  allowDelegation: boolean;
  allowComments: boolean;
  allowAttachments: boolean;
  requireJustification: boolean;
  autoAdvance: boolean;
  timeout?: number;
  retryCount?: number;
}

export interface WorkflowTrigger {
  id: string;
  type: TriggerType;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
}

export type TriggerType = 
  | 'manual' 
  | 'automatic' 
  | 'scheduled' 
  | 'event' 
  | 'webhook';

export interface WorkflowSettings {
  allowParallel: boolean;
  allowSkipping: boolean;
  allowCancellation: boolean;
  timeout: number;
  retryCount: number;
  escalation: EscalationConfig;
  notifications: NotificationSettings;
  permissions: WorkflowPermissions;
}

export interface EscalationConfig {
  enabled: boolean;
  delay: number;
  action: 'reassign' | 'notify' | 'escalate' | 'cancel';
  recipients: string[];
}

export interface NotificationSettings {
  enabled: boolean;
  types: NotificationType[];
  frequency: 'immediate' | 'hourly' | 'daily';
  templates: Record<string, string>;
}

export interface WorkflowPermissions {
  canStart: string[];
  canApprove: string[];
  canReject: string[];
  canDelegate: string[];
  canCancel: string[];
  canView: string[];
}

export type NotificationType = 
  | 'workflow_started' 
  | 'step_assigned' 
  | 'step_completed' 
  | 'workflow_completed' 
  | 'workflow_cancelled' 
  | 'step_overdue' 
  | 'escalation';

// Workflow instances
export interface WorkflowInstance {
  id: string;
  workflowId: string;
  documentId: string;
  status: WorkflowStatus;
  currentStep: string;
  startedBy: string;
  startedAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
  steps: WorkflowStepInstance[];
  data: Record<string, any>;
  history: WorkflowHistory[];
}

export type WorkflowStatus = 
  | 'pending' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled' 
  | 'failed' 
  | 'paused';

export interface WorkflowStepInstance {
  id: string;
  stepId: string;
  status: StepStatus;
  assignee: string;
  assignedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  dueDate?: Date;
  data: Record<string, any>;
  comments: StepComment[];
  attachments: string[];
  actions: StepAction[];
}

export type StepStatus = 
  | 'pending' 
  | 'in-progress' 
  | 'completed' 
  | 'skipped' 
  | 'overdue' 
  | 'failed';

export interface StepComment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  type: 'comment' | 'approval' | 'rejection' | 'delegation';
}

export interface StepAction {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  userId: string;
}

export interface WorkflowHistory {
  id: string;
  action: string;
  userId: string;
  timestamp: Date;
  data: any;
  description: string;
}

// Workflow templates
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  type: WorkflowType;
  category: string;
  steps: WorkflowStepTemplate[];
  settings: WorkflowSettings;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  rating: number;
  tags: string[];
}

export interface WorkflowStepTemplate {
  id: string;
  name: string;
  description: string;
  type: StepType;
  assigneeRole: string;
  dueDateOffset: number;
  required: boolean;
  parallel: boolean;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  notifications: NotificationConfig[];
  settings: StepSettings;
  order: number;
}

// Workflow analytics
export interface WorkflowAnalytics {
  totalWorkflows: number;
  activeInstances: number;
  completedInstances: number;
  cancelledInstances: number;
  averageCompletionTime: number;
  stepAnalytics: StepAnalytics[];
  userAnalytics: UserWorkflowAnalytics[];
  performanceMetrics: PerformanceMetrics;
}

export interface StepAnalytics {
  stepId: string;
  stepName: string;
  totalInstances: number;
  completedInstances: number;
  averageCompletionTime: number;
  overdueCount: number;
  skippedCount: number;
  failureRate: number;
}

export interface UserWorkflowAnalytics {
  userId: string;
  name: string;
  workflowsStarted: number;
  workflowsCompleted: number;
  stepsCompleted: number;
  averageCompletionTime: number;
  overdueCount: number;
  efficiencyScore: number;
}

export interface PerformanceMetrics {
  averageWorkflowTime: number;
  completionRate: number;
  overdueRate: number;
  cancellationRate: number;
  userSatisfaction: number;
  systemUptime: number;
}

// Workflow events
export interface WorkflowEvent {
  id: string;
  type: WorkflowEventType;
  workflowId: string;
  instanceId?: string;
  stepId?: string;
  userId: string;
  timestamp: Date;
  data: any;
  description: string;
}

export type WorkflowEventType = 
  | 'workflow_created' 
  | 'workflow_updated' 
  | 'workflow_deleted' 
  | 'workflow_started' 
  | 'workflow_completed' 
  | 'workflow_cancelled' 
  | 'step_started' 
  | 'step_completed' 
  | 'step_skipped' 
  | 'step_overdue' 
  | 'step_delegated' 
  | 'escalation_triggered';

// Workflow validation
export interface WorkflowValidation {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion: string;
}

// Workflow permissions
export interface WorkflowPermission {
  id: string;
  userId: string;
  workflowId: string;
  permissions: string[];
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
}

export type WorkflowPermissionType = 
  | 'view' 
  | 'edit' 
  | 'start' 
  | 'approve' 
  | 'reject' 
  | 'delegate' 
  | 'cancel' 
  | 'admin';
