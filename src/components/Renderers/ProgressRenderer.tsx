import React from 'react';
import { cn } from '@/lib/utils';
import type { CellRenderer } from '@/types';

export interface ProgressRendererProps {
  value: any;
  row: any;
  column: any;
  params?: {
    max?: number;
    min?: number;
    showText?: boolean;
    format?: 'percentage' | 'fraction' | 'value';
    color?: string;
    backgroundColor?: string;
    height?: number;
    className?: string;
  };
}

export const ProgressRenderer: CellRenderer<ProgressRendererProps['params']> = ({
  value,
  params = {},
}) => {
  const {
    max = 100,
    min = 0,
    showText = true,
    format = 'percentage',
    color = 'hsl(var(--primary))',
    backgroundColor = 'hsl(var(--muted))',
    height = 8,
    className,
  } = params;
  
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">-</span>;
  }
  
  const numValue = Number(value);
  const percentage = Math.max(0, Math.min(100, ((numValue - min) / (max - min)) * 100));
  
  const formatText = () => {
    switch (format) {
      case 'percentage':
        return `${Math.round(percentage)}%`;
      case 'fraction':
        return `${numValue}/${max}`;
      case 'value':
        return String(numValue);
      default:
        return `${Math.round(percentage)}%`;
    }
  };
  
  return (
    <div className={cn('flex items-center h-full space-x-2', className)}>
      <div 
        className="flex-1 rounded-full overflow-hidden"
        style={{ 
          backgroundColor,
          height: `${height}px`,
        }}
      >
        <div
          className="h-full transition-all duration-300 ease-in-out rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showText && (
        <span className="text-xs font-medium text-muted-foreground min-w-fit">
          {formatText()}
        </span>
      )}
    </div>
  );
};