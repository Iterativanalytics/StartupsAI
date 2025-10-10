import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleHelp } from 'lucide-react';
import React from 'react';

type HelpIconProps = {
  term: string;
  definition: string;
  moreLink?: string;
};

export const HelpIcon: React.FC<HelpIconProps> = ({ term, definition, moreLink }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`Help: ${term}`}
          className="inline-flex items-center justify-center h-5 w-5 rounded text-muted-foreground hover:text-foreground"
        >
          <CircleHelp className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-1">
          <div className="text-xs font-semibold">{term}</div>
          <div className="text-xs text-muted-foreground">{definition}</div>
          {moreLink && (
            <a
              href={moreLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline text-blue-600"
            >
              Learn more
            </a>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
