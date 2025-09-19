import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ColumnOptions } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface GridHeaderProps {
  column: ColumnOptions;
  style?: React.CSSProperties;
  className?: string;
}

export function GridHeader({ column, style, className }: GridHeaderProps) {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const handleSort = (direction: 'asc' | 'desc') => {
    setSortDirection(direction);
    // TODO: Implement sorting logic
    console.log(`Sorting ${column.field} ${direction}`);
  };

  const handleResize = () => {
    // TODO: Implement column resize
    console.log(`Resizing column ${column.field}`);
  };

  const getSortIcon = () => {
    if (sortDirection === 'asc') return <ArrowUp className="h-3 w-3" />;
    if (sortDirection === 'desc') return <ArrowDown className="h-3 w-3" />;
    return <ArrowUpDown className="h-3 w-3" />;
  };

  const headerClasses = cn(
    'visual-grid-cell visual-grid-header flex items-center justify-between group',
    'border-r border-b border-border bg-muted/50 font-medium text-muted-foreground',
    column.headerClass,
    className
  );

  const headerStyles = {
    ...style,
    ...column.headerStyle,
    ...(column.getHeaderStyle ? column.getHeaderStyle({ column: column.field, grid: null }) : {}),
  };

  return (
    <div className={headerClasses} style={headerStyles}>
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <span className="truncate text-sm font-medium">
          {column.headerName || column.field}
        </span>
        {column.sortable && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleSort(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {getSortIcon()}
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {column.sortable && (
              <>
                <DropdownMenuItem onClick={() => handleSort('asc')}>
                  <ArrowUp className="mr-2 h-3 w-3" />
                  Sort Ascending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('desc')}>
                  <ArrowDown className="mr-2 h-3 w-3" />
                  Sort Descending
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem>
              Pin Left
            </DropdownMenuItem>
            <DropdownMenuItem>
              Pin Right
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Hide Column
            </DropdownMenuItem>
            {column.resizable && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleResize}>
                  Auto-size Column
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {column.resizable && (
          <div 
            className="w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors"
            onMouseDown={(e) => {
              // TODO: Implement resize drag logic
              console.log('Start resize', e);
            }}
          />
        )}
      </div>
    </div>
  );
}