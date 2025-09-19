import React from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import type { CellRenderer } from '@/types/index';

export interface LinkRendererProps {
  value: any;
  row: any;
  column: any;
  params?: {
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    showIcon?: boolean;
    className?: string;
  };
}

export const LinkRenderer: CellRenderer<LinkRendererProps['params']> = ({
  value,
  row,
  params = {},
}) => {
  if (!value) return <span className="text-muted-foreground">-</span>;
  
  const { 
    href, 
    target = '_blank', 
    showIcon = true, 
    className 
  } = params;
  
  // Determine the actual href
  let actualHref: string;
  if (href) {
    // Use custom href, potentially with template variables
    actualHref = href.replace(/\{(\w+)\}/g, (match, key) => {
      return row[key] || match;
    });
  } else if (typeof value === 'object' && value.href) {
    // Value is an object with href property
    actualHref = value.href;
  } else if (typeof value === 'string' && value.startsWith('http')) {
    // Value is already a URL
    actualHref = value;
  } else {
    // Treat value as relative URL
    actualHref = String(value);
  }
  
  // Determine display text
  const displayText = typeof value === 'object' && value.text 
    ? value.text 
    : String(value);
  
  const linkClasses = cn(
    'text-primary hover:text-primary/80 underline underline-offset-4',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    'inline-flex items-center gap-1',
    className
  );
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent cell selection
  };
  
  return (
    <a
      href={actualHref}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={linkClasses}
      onClick={handleClick}
      title={actualHref}
    >
      <span className="truncate">{displayText}</span>
      {showIcon && target === '_blank' && (
        <ExternalLink className="h-3 w-3 flex-shrink-0" />
      )}
    </a>
  );
};