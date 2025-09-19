import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GridProvider } from './GridProvider';
import { VirtualGrid } from './VirtualGrid';
import type { GridOptions } from '@/types/index';
import '@/styles/globals.css';

export interface GridProps extends GridOptions {
  className?: string;
  style?: React.CSSProperties;
  onCellClick?: (row: string, column: string) => void;
  onCellDoubleClick?: (row: string, column: string) => void;
  onRowSelect?: (rowIds: string[]) => void;
  onCellValueChange?: (row: string, column: string, value: any, oldValue: any) => void;
}

export function Grid({ 
  className, 
  style, 
  onCellClick,
  onCellDoubleClick,
  onRowSelect,
  onCellValueChange,
  ...options 
}: GridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          e.preventDefault();
          // TODO: Implement keyboard navigation
          break;
        case 'Enter':
          e.preventDefault();
          // TODO: Start editing
          break;
        case 'Escape':
          e.preventDefault();
          // TODO: Cancel editing or clear selection
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          // TODO: Clear cell content
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const gridClasses = cn(
    'visual-grid w-full h-full',
    'border border-border rounded-lg overflow-hidden',
    'focus-within:ring-1 focus-within:ring-ring',
    className
  );

  const gridStyles = {
    width: options.width || '100%',
    height: options.height || '100%',
    ...style,
  };

  return (
    <GridProvider options={options}>
      <div 
        ref={containerRef}
        className={gridClasses}
        style={gridStyles}
        role="grid"
        tabIndex={0}
      >
        <VirtualGrid 
          containerRef={containerRef}
          className="h-full w-full"
        />
      </div>
    </GridProvider>
  );
}

// Export the main Grid component as default
export default Grid;