import React, { useRef, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';
import type { SimpleColumn } from '../SimpleGrid/SimpleGrid';

export interface VirtualGridProps {
  columns: SimpleColumn[];
  data: any[];
  className?: string;
  height?: number;
  rowHeight?: number;
  headerHeight?: number;
  overscan?: number;
  onRowClick?: ((row: any, index: number) => void) | undefined;
  // Optional interaction hooks for header cells
  renderHeaderCell?: (column: SimpleColumn, index: number) => React.ReactNode | undefined;
}

export function VirtualGrid({
  columns,
  data,
  className,
  height = 400,
  rowHeight = 40,
  headerHeight = 40,
  overscan = 5,
  onRowClick,
  renderHeaderCell,
}: VirtualGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  const totalWidth = useMemo(() => {
    return columns.reduce((total, col) => total + (col.width || 150), 0);
  }, [columns]);

  const renderRow = useCallback((virtualRow: any) => {
    const row = data[virtualRow.index];
    if (!row) return null;

    return (
      <div
        key={virtualRow.key}
        className={cn(
          'absolute top-0 left-0 w-full flex border-b border-border/50 hover:bg-muted/40 cursor-pointer',
          virtualRow.index % 2 === 0 && 'bg-muted/20'
        )}
        style={{
          height: `${virtualRow.size}px`,
          transform: `translateY(${virtualRow.start}px)`,
        }}
        onClick={() => onRowClick?.(row, virtualRow.index)}
      >
        {columns.map((column) => (
          <div
            key={column.field}
            className="px-3 py-2 text-sm border-r border-border/50 last:border-r-0 truncate flex items-center"
            style={{ width: column.width || 150, minWidth: column.width || 150 }}
          >
            {column.render 
              ? column.render(row[column.field], row, virtualRow.index)
              : String(row[column.field] || '-')
            }
          </div>
        ))}
      </div>
    );
  }, [columns, data, onRowClick]);

  return (
    <div 
      className={cn(
        "border border-border rounded-lg overflow-hidden bg-background",
        className
      )}
      style={{ height }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-10 bg-muted/50 border-b border-border"
        style={{ height: headerHeight }}
      >
        <div className="flex h-full">
          {columns.map((column) => (
            <div
              key={column.field}
              className="px-3 py-2 font-medium text-muted-foreground border-r border-border/50 last:border-r-0 flex items-center"
              style={{ width: column.width || 150, minWidth: column.width || 150 }}
            >
              {renderHeaderCell ? renderHeaderCell(column, columns.findIndex(c => c.field === column.field)) : (column.headerName || column.field)}
            </div>
          ))}
        </div>
      </div>

      {/* Virtual Body */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ 
          height: height - headerHeight,
          width: '100%',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `${totalWidth}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(renderRow)}
        </div>
      </div>
    </div>
  );
}