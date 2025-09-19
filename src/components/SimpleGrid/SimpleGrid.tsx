import React from 'react';
import { cn } from '@/lib/utils';

export interface SimpleColumn {
  field: string;
  headerName?: string;
  width?: number;
  render?: (value: any, row: any, rowIndex?: number) => React.ReactNode;
}

export interface SimpleGridProps {
  columns: SimpleColumn[];
  data: any[];
  className?: string;
  height?: number;
}

export function SimpleGrid({ columns, data, className, height = 400 }: SimpleGridProps) {
  return (
    <div 
      className={cn(
        "border border-border rounded-lg overflow-hidden bg-background",
        className
      )}
      style={{ height }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-muted/50 border-b border-border">
        <div className="flex">
          {columns.map((column) => (
            <div
              key={column.field}
              className="px-3 py-2 font-medium text-muted-foreground border-r border-border/50 last:border-r-0"
              style={{ width: column.width || 150, minWidth: column.width || 150 }}
            >
              {column.headerName || column.field}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="overflow-auto" style={{ height: height - 40 }}>
        {data.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className={cn(
              "flex border-b border-border/50 last:border-b-0 hover:bg-muted/40",
              rowIndex % 2 === 0 && "bg-muted/20"
            )}
          >
            {columns.map((column) => (
              <div
                key={column.field}
                className="px-3 py-2 text-sm border-r border-border/50 last:border-r-0 truncate"
                style={{ width: column.width || 150, minWidth: column.width || 150 }}
              >
                {column.render 
                  ? column.render(row[column.field], row)
                  : String(row[column.field] || '-')
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}