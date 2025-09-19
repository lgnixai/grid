import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CellEditor } from '@/types';

export interface SelectEditorProps {
  value: any;
  onChange: (value: any) => void;
  onCommit: () => void;
  onCancel: () => void;
  row: any;
  column: any;
  params?: {
    options: Array<{ value: string; label: string }> | string[];
    placeholder?: string;
    allowClear?: boolean;
  };
}

export const SelectEditor: CellEditor<SelectEditorProps['params']> = ({
  value,
  onChange,
  onCommit,
  onCancel,
  params = { options: [] },
}) => {
  const [editValue, setEditValue] = useState(String(value || ''));
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Auto-focus when mounted
    setTimeout(() => {
      const trigger = document.querySelector('[role="combobox"]') as HTMLElement;
      trigger?.focus();
    }, 100);
  }, []);

  const options = Array.isArray(params.options) 
    ? params.options.map(opt => 
        typeof opt === 'string' 
          ? { value: opt, label: opt }
          : opt
      )
    : [];

  const handleValueChange = (newValue: string) => {
    setEditValue(newValue);
    onChange(newValue);
    onCommit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // If closed without selection, commit current value
      setTimeout(() => {
        onCommit();
      }, 100);
    }
  };

  return (
    <Select
      value={editValue}
      onValueChange={handleValueChange}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger 
        className="h-full border-none shadow-none focus:ring-0"
        onKeyDown={handleKeyDown}
      >
        <SelectValue placeholder={params.placeholder || 'Select...'} />
      </SelectTrigger>
      <SelectContent>
        {params.allowClear && (
          <SelectItem value="">
            <span className="text-muted-foreground">Clear</span>
          </SelectItem>
        )}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};