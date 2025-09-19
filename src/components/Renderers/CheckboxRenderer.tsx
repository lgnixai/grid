import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import type { CellRenderer } from '@/types/index';

export interface CheckboxRendererProps {
  value: any;
  row: any;
  column: any;
  params?: {
    label?: string;
    showLabel?: boolean;
  };
}

export const CheckboxRenderer: CellRenderer<CheckboxRendererProps['params']> = ({
  value,
  params = {},
}) => {
  const isChecked = Boolean(value);
  
  return (
    <div className="flex items-center justify-center h-full">
      <Checkbox 
        checked={isChecked} 
        disabled 
        className="pointer-events-none"
      />
      {params.showLabel && params.label && (
        <span className="ml-2 text-sm">{params.label}</span>
      )}
    </div>
  );
};