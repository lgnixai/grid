import React, { useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';
import { useGridStore } from '@/store/grid-store';
import { GridCell } from './GridCell';
import { GridHeader } from './GridHeader';

export interface VirtualGridProps {
  className?: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function VirtualGrid({ className, containerRef }: VirtualGridProps) {
  const { rows, columns, rowHeight, headerHeight, overscanRowCount, overscanColumnCount } = useGridStore();

  // Row virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: useCallback(
      (index: number) => {
        if (typeof rowHeight === 'function') {
          return rowHeight(rows[index]?.id || '');
        }
        return rowHeight;
      },
      [rowHeight, rows]
    ),
    overscan: overscanRowCount,
  });

  // Column virtualizer
  const columnVirtualizer = useVirtualizer({
    count: columns.length,
    getScrollElement: () => containerRef.current,
    estimateSize: useCallback(
      (index: number) => {
        const column = columns[index];
        return column?.width || 150;
      },
      [columns]
    ),
    overscan: overscanColumnCount,
    horizontal: true,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const virtualColumns = columnVirtualizer.getVirtualItems();

  const totalWidth = columnVirtualizer.getTotalSize();
  const totalHeight = rowVirtualizer.getTotalSize();

  return (
    <div className={cn('visual-grid relative overflow-auto', className)}>
      {/* Header */}
      <div 
        className="sticky top-0 z-20 visual-grid-header"
        style={{ height: headerHeight }}
      >
        <div
          style={{
            width: totalWidth,
            height: headerHeight,
            position: 'relative',
          }}
        >
          {virtualColumns.map((virtualColumn) => {
        const column = columns[virtualColumn.index] as any;
            if (!column) return null;

            return (
              <GridHeader
                key={column.field}
                column={column}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: virtualColumn.start,
                  width: virtualColumn.size,
                  height: headerHeight,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          height: totalHeight,
          width: totalWidth,
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const row = rows[virtualRow.index];
          if (!row) return null;

          return (
            <div
              key={row.id}
              className="visual-grid-row absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                height: virtualRow.size,
              }}
            >
              {virtualColumns.map((virtualColumn) => {
                const column = columns[virtualColumn.index] as any;
                if (!column) return null;

                return (
                  <GridCell
                    key={`${row.id}-${column.field}`}
                    row={row}
                    column={column}
                    style={{
                      position: 'absolute',
                      left: virtualColumn.start,
                      width: virtualColumn.size,
                      height: virtualRow.size,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}