/**
 * Centralized status and badge utilities
 * Eliminates duplication of status color mapping across components
 */

export type StatusType = 
  | 'draft' | 'review' | 'approved' | 'published' | 'archived'
  | 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'
  | 'open' | 'in-progress' | 'submitted' | 'under-review' | 'responded' | 'closed'
  | 'upcoming' | 'overdue' | 'not-started' | 'won' | 'lost'
  | 'excellent' | 'good' | 'fair' | 'poor'
  | 'development' | 'validation' | 'pre-launch' | 'idea' | 'prototype' | 'mvp' | 'scaling';

export type PriorityType = 'low' | 'medium' | 'high' | 'urgent';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

/**
 * Maps status values to appropriate CSS classes for badges
 * Centralizes all status color logic to avoid duplication
 */
export function getStatusColorClass(status: StatusType): string {
  const statusMap: Record<StatusType, string> = {
    // Document statuses
    'draft': 'bg-gray-100 text-gray-800',
    'review': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'published': 'bg-blue-100 text-blue-800',
    'archived': 'bg-gray-100 text-gray-600',
    
    // General statuses
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    
    // Process statuses
    'open': 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'submitted': 'bg-purple-100 text-purple-800',
    'under-review': 'bg-yellow-100 text-yellow-800',
    'responded': 'bg-gray-100 text-gray-800',
    'closed': 'bg-red-100 text-red-800',
    
    // Timeline statuses
    'upcoming': 'bg-blue-100 text-blue-800',
    'overdue': 'bg-red-100 text-red-800',
    'not-started': 'bg-gray-100 text-gray-800',
    
    // Outcome statuses
    'won': 'bg-purple-100 text-purple-800',
    'lost': 'bg-red-100 text-red-800',
    
    // Quality statuses
    'excellent': 'text-green-600',
    'good': 'text-blue-600',
    'fair': 'text-yellow-600',
    'poor': 'text-red-600',
    
    // Development stages
    'development': 'bg-blue-500 text-white',
    'validation': 'bg-yellow-500 text-white',
    'pre-launch': 'bg-green-500 text-white',
    'idea': 'bg-purple-100 text-purple-800',
    'prototype': 'bg-blue-100 text-blue-800',
    'mvp': 'bg-green-100 text-green-800',
    'scaling': 'bg-indigo-100 text-indigo-800'
  };

  return statusMap[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Maps status values to badge variants for shadcn/ui Badge component
 */
export function getStatusBadgeVariant(status: StatusType): BadgeVariant {
  const variantMap: Record<StatusType, BadgeVariant> = {
    'active': 'default',
    'completed': 'default',
    'approved': 'default',
    'published': 'default',
    'won': 'default',
    
    'upcoming': 'outline',
    'pending': 'outline',
    'draft': 'outline',
    'not-started': 'outline',
    
    'in-progress': 'secondary',
    'review': 'secondary',
    'submitted': 'secondary',
    
    'cancelled': 'destructive',
    'overdue': 'destructive',
    'lost': 'destructive',
    'closed': 'destructive',
    'archived': 'destructive'
  };

  return variantMap[status] || 'outline';
}

/**
 * Maps priority values to appropriate CSS classes
 */
export function getPriorityColorClass(priority: PriorityType): string {
  const priorityMap: Record<PriorityType, string> = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'urgent': 'bg-red-100 text-red-800'
  };

  return priorityMap[priority] || 'bg-gray-100 text-gray-800';
}

/**
 * Gets appropriate icon color class for status indicators
 */
export function getStatusIconColor(status: StatusType): string {
  const iconColorMap: Record<StatusType, string> = {
    'completed': 'text-green-500',
    'approved': 'text-green-500',
    'won': 'text-green-500',
    
    'in-progress': 'text-blue-500',
    'active': 'text-blue-500',
    'development': 'text-blue-500',
    
    'pending': 'text-yellow-500',
    'review': 'text-yellow-500',
    'validation': 'text-yellow-500',
    
    'overdue': 'text-red-500',
    'cancelled': 'text-red-500',
    'lost': 'text-red-500',
    
    'draft': 'text-gray-400',
    'not-started': 'text-gray-400',
    'archived': 'text-gray-400'
  };

  return iconColorMap[status] || 'text-gray-400';
}
