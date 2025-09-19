import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import type { CellEditor } from '@/types';

export interface CheckboxEditorProps {
  value: any;
  onChange: (value: any) => void;
  onCommit: () => void;
  onCancel: () => void;
  row: any;
  column: any;
  params?: {
    label?: string;
  };
}

export const CheckboxEditor: CellEditor<CheckboxEditorProps['params']> = ({
  value,
  onChange,
  onCommit,
  onCancel,
  params = {},
}) => {
  const [editValue, setEditValue] = useState(Boolean(value));

  useEffect(() => {
    // Auto-commit after a short delay when value changes
    const timer = setTimeout(() => {
      onChange(editValue);
      onCommit();
    }, 100);

    return () => clearTimeout(timer);
  }, [editValue, onChange, onCommit]);

  const handleCheckedChange = (checked: boolean) => {
    setEditValue(checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setEditValue(!editValue);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Checkbox
        checked={editValue}
        onCheckedChange={handleCheckedChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      {params.label && (
        <span className="ml-2 text-sm">{params.label}</span>
      )}
    </div>
  );
};