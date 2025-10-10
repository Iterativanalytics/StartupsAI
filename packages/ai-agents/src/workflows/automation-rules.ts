export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  enabled: boolean;
  priority: number;
}

export interface AutomationTrigger {
  type: 'event' | 'schedule' | 'manual';
  event?: string;
  schedule?: string; // cron expression
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_equals';
  value: any;
}

export interface AutomationAction {
  type: 'notify' | 'execute_agent' | 'update_status' | 'create_task' | 'send_email';
  parameters: Record<string, any>;
}

export class AutomationEngine {
  private rules: Map<string, AutomationRule> = new Map();

  registerRule(rule: AutomationRule): void {
    this.rules.set(rule.id, rule);
  }

  async processEvent(event: any): Promise<void> {
    const applicableRules = Array.from(this.rules.values())
      .filter(rule => rule.enabled)
      .filter(rule => this.matchesTrigger(rule, event))
      .filter(rule => this.matchesConditions(rule, event))
      .sort((a, b) => b.priority - a.priority);

    for (const rule of applicableRules) {
      await this.executeRule(rule, event);
    }
  }

  private matchesTrigger(rule: AutomationRule, event: any): boolean {
    if (rule.trigger.type === 'event') {
      return rule.trigger.event === event.type;
    }
    return false;
  }

  private matchesConditions(rule: AutomationRule, event: any): boolean {
    return rule.conditions.every(condition => {
      const value = this.getFieldValue(event, condition.field);
      return this.evaluateCondition(value, condition.operator, condition.value);
    });
  }

  private evaluateCondition(actualValue: any, operator: string, expectedValue: any): boolean {
    switch (operator) {
      case 'equals':
        return actualValue === expectedValue;
      case 'not_equals':
        return actualValue !== expectedValue;
      case 'greater_than':
        return actualValue > expectedValue;
      case 'less_than':
        return actualValue < expectedValue;
      case 'contains':
        return String(actualValue).includes(String(expectedValue));
      default:
        return false;
    }
  }

  private getFieldValue(obj: any, field: string): any {
    return field.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  private async executeRule(rule: AutomationRule, event: any): Promise<void> {
    console.log(`Executing rule: ${rule.name}`);
    
    for (const action of rule.actions) {
      await this.executeAction(action, event);
    }
  }

  private async executeAction(action: AutomationAction, event: any): Promise<void> {
    switch (action.type) {
      case 'notify':
        console.log('Sending notification:', action.parameters);
        break;
      case 'execute_agent':
        console.log('Executing agent:', action.parameters);
        break;
      case 'update_status':
        console.log('Updating status:', action.parameters);
        break;
      case 'create_task':
        console.log('Creating task:', action.parameters);
        break;
      case 'send_email':
        console.log('Sending email:', action.parameters);
        break;
    }
  }
}

// Example automation rules
export const DEFAULT_RULES: AutomationRule[] = [
  {
    id: 'low-runway-alert',
    name: 'Low Runway Alert',
    description: 'Alert entrepreneur when runway drops below 6 months',
    trigger: {
      type: 'event',
      event: 'financial_update'
    },
    conditions: [
      {
        field: 'runway',
        operator: 'less_than',
        value: 6
      }
    ],
    actions: [
      {
        type: 'notify',
        parameters: {
          message: 'Your runway is below 6 months. Consider fundraising.',
          priority: 'high'
        }
      },
      {
        type: 'execute_agent',
        parameters: {
          agentType: 'business_advisor',
          task: 'fundraising_strategy'
        }
      }
    ],
    enabled: true,
    priority: 10
  },
  {
    id: 'high-valuation-alert',
    name: 'High Valuation Alert',
    description: 'Alert investor when deal valuation seems high',
    trigger: {
      type: 'event',
      event: 'deal_submitted'
    },
    conditions: [
      {
        field: 'revenueMultiple',
        operator: 'greater_than',
        value: 10
      }
    ],
    actions: [
      {
        type: 'notify',
        parameters: {
          message: 'This deal has a high valuation multiple. Review carefully.',
          priority: 'medium'
        }
      }
    ],
    enabled: true,
    priority: 8
  },
  {
    id: 'low-credit-score',
    name: 'Low Credit Score Alert',
    description: 'Flag loan applications with low credit scores',
    trigger: {
      type: 'event',
      event: 'loan_application'
    },
    conditions: [
      {
        field: 'creditScore',
        operator: 'less_than',
        value: 650
      }
    ],
    actions: [
      {
        type: 'update_status',
        parameters: {
          status: 'requires_review',
          reason: 'Low credit score'
        }
      },
      {
        type: 'create_task',
        parameters: {
          title: 'Review high-risk application',
          assignee: 'senior_underwriter'
        }
      }
    ],
    enabled: true,
    priority: 9
  }
];