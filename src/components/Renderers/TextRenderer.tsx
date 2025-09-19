import React from 'react';
import { cn } from '@/lib/utils';
import type { CellRenderer } from '@/types/index';

export interface TextRendererProps {
  value: any;
  row: any;
  column: any;
  params?: {
    format?: 'currency' | 'number' | 'percentage' | 'date' | 'datetime';
    prefix?: string;
    suffix?: string;
    decimals?: number;
    locale?: string;
    className?: string;
  };
}

export const TextRenderer: CellRenderer<TextRendererProps['params']> = ({
  value,
  params = {},
}) => {
  const formatValue = (val: any): string => {
    if (val === null || val === undefined) return '-';
    
    const { format, prefix = '', suffix = '', decimals, locale = 'en-US' } = params;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: decimals ?? 2,
          maximumFractionDigits: decimals ?? 2,
        }).format(Number(val));
        
      case 'number':
        return new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimals ?? 0,
          maximumFractionDigits: decimals ?? 2,
        }).format(Number(val));
        
      case 'percentage':
        return new Intl.NumberFormat(locale, {
          style: 'percent',
          minimumFractionDigits: decimals ?? 1,
          maximumFractionDigits: decimals ?? 1,
        }).format(Number(val) / 100);
        
      case 'date':
        return new Intl.DateTimeFormat(locale).format(new Date(val));
        
      case 'datetime':
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date(val));
        
      default:
        return `${prefix}${String(val)}${suffix}`;
    }
  };

  const formattedValue = formatValue(value);
  
  return (
    <span className={cn('truncate', params.className)}>
      {formattedValue}
    </span>
  );
};