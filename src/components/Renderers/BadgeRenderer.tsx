import React from 'react';
import { cn } from '@/lib/utils';
import type { CellRenderer } from '@/types';

export interface BadgeRendererProps {
  value: any;
  row: any;
  column: any;
  params?: {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    colorMap?: Record<string, string>;
    className?: string;
  };
}

export const BadgeRenderer: CellRenderer<BadgeRendererProps['params']> = ({
  value,
  params = {},
}) => {
  if (!value) return <span className="text-muted-foreground">-</span>;
  
  const { variant = 'default', colorMap, className } = params;
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
      case 'destructive':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/80';
      case 'outline':
        return 'text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/80';
    }
  };
  
  const customColor = colorMap?.[String(value)];
  const badgeClasses = cn(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    !customColor && getVariantClasses(),
    className
  );
  
  const badgeStyle = customColor ? {
    backgroundColor: customColor,
    color: getContrastColor(customColor),
  } : undefined;
  
  return (
    <div className="flex items-center justify-center h-full">
      <span className={badgeClasses} style={badgeStyle}>
        {String(value)}
      </span>
    </div>
  );
};

// Helper function to determine text color based on background
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}