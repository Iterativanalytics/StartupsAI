import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Centralized loading spinner component
 * Eliminates duplication of loading UI patterns across the application
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  variant?: 'default' | 'card' | 'page' | 'inline';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  text, 
  variant = 'default' 
}: LoadingSpinnerProps) {
  const spinnerClasses = cn(
    'animate-spin',
    sizeClasses[size],
    className
  );

  const spinner = <Loader2 className={spinnerClasses} />;

  switch (variant) {
    case 'card':
      return (
        <div className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            {spinner}
            {text && <p className="text-sm text-muted-foreground">{text}</p>}
          </div>
        </div>
      );

    case 'page':
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            {spinner}
            {text && <span className="text-lg">{text}</span>}
          </div>
        </div>
      );

    case 'inline':
      return (
        <div className="flex items-center gap-2">
          {spinner}
          {text && <span className="text-sm">{text}</span>}
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            {spinner}
            {text && <span>{text}</span>}
          </div>
        </div>
      );
  }
}

/**
 * Specialized loading components for common use cases
 */

export function PageLoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return <LoadingSpinner variant="page" size="lg" text={text} />;
}

export function CardLoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return <LoadingSpinner variant="card" size="md" text={text} />;
}

export function InlineLoadingSpinner({ text }: { text?: string }) {
  return <LoadingSpinner variant="inline" size="sm" text={text} />;
}

export function ButtonLoadingSpinner() {
  return <LoadingSpinner size="sm" className="mr-2" />;
}
