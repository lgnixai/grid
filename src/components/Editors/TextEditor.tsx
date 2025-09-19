import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import type { CellEditor } from '@/types';

export interface TextEditorProps {
  value: any;
  onChange: (value: any) => void;
  onCommit: () => void;
  onCancel: () => void;
  row: any;
  column: any;
  params?: {
    type?: 'text' | 'number' | 'email' | 'url' | 'password';
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
  };
}

export const TextEditor: CellEditor<TextEditorProps['params']> = ({
  value,
  onChange,
  onCommit,
  onCancel,
  params = {},
}) => {
  const [editValue, setEditValue] = useState(String(value || ''));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const finalValue = params.type === 'number' ? Number(editValue) : editValue;
      onChange(finalValue);
      onCommit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const finalValue = params.type === 'number' ? Number(editValue) : editValue;
      onChange(finalValue);
      onCommit();
    }
  };

  const handleBlur = () => {
    const finalValue = params.type === 'number' ? Number(editValue) : editValue;
    onChange(finalValue);
    onCommit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  return (
    <Input
      ref={inputRef}
      type={params.type || 'text'}
      value={editValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={params.placeholder}
      maxLength={params.maxLength}
      pattern={params.pattern}
      className="h-full border-none shadow-none focus-visible:ring-0 p-2"
    />
  );
};