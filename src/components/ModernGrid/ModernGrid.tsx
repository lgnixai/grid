import React, { useState, useMemo, useCallback } from 'react';
import { VirtualGrid } from '../VirtualGrid';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  Search, 
  Download, 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Settings,
  MoreVertical 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SimpleColumn } from '../SimpleGrid/SimpleGrid';

export interface ModernGridColumn extends SimpleColumn {
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
}

export interface ModernGridProps {
  columns: ModernGridColumn[];
  data: any[];
  className?: string;
  height?: number;
  searchable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  onRowClick?: (row: any, index: number) => void;
  onRowSelect?: (selectedRows: any[]) => void;
  onExport?: (data: any[]) => void;
}

type SortDirection = 'asc' | 'desc' | null;

export function ModernGrid({
  columns,
  data,
  className,
  height = 600,
  searchable = true,
  exportable = true,
  selectable = false,
  onRowClick,
  onRowSelect,
  onExport,
}: ModernGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(row =>
        columns.some(col => {
          const value = row[col.field];
          return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortField && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (aVal === bVal) return 0;
        
        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchTerm, sortField, sortDirection, columns]);

  const handleSort = useCallback((field: string) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const handleRowSelect = useCallback((index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
    
    const selectedData = Array.from(newSelected).map(idx => processedData[idx]);
    onRowSelect?.(selectedData);
  }, [selectedRows, processedData, onRowSelect]);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === processedData.length) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      const allIndexes = new Set(processedData.map((_, idx) => idx));
      setSelectedRows(allIndexes);
      onRowSelect?.(processedData);
    }
  }, [selectedRows.size, processedData, onRowSelect]);

  const handleExport = useCallback(() => {
    onExport?.(processedData);
  }, [processedData, onExport]);

  const getSortIcon = useCallback((field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    if (sortDirection === 'asc') return <ArrowUp className="h-3 w-3" />;
    if (sortDirection === 'desc') return <ArrowDown className="h-3 w-3" />;
    return <ArrowUpDown className="h-3 w-3 opacity-50" />;
  }, [sortField, sortDirection]);

  // Enhanced columns with selection and sorting
  const enhancedColumns: ModernGridColumn[] = useMemo(() => {
    const cols = [...columns];

    // Add selection column if selectable
    if (selectable) {
      cols.unshift({
        field: '__select',
        headerName: '',
        width: 50,
        render: (_, row, index) => (
          <div className="flex justify-center">
            <Checkbox
              checked={selectedRows.has(index as number)}
              onCheckedChange={() => handleRowSelect(index as number)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ),
      });
    }

    return cols;
  }, [columns, selectable, selectedRows, handleRowSelect]);

  // Enhanced header with sorting
  const enhancedHeaderColumns = useMemo(() => {
    return enhancedColumns.map(col => ({
      ...col,
      headerName: col.field === '__select' ? (
        <div className="flex justify-center">
          <Checkbox
            checked={selectedRows.size === processedData.length && processedData.length > 0}
            indeterminate={selectedRows.size > 0 && selectedRows.size < processedData.length}
            onCheckedChange={handleSelectAll}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <span>{col.headerName || col.field}</span>
          {col.sortable && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={() => handleSort(col.field)}
            >
              {getSortIcon(col.field)}
            </Button>
          )}
        </div>
      ),
    }));
  }, [enhancedColumns, selectedRows, processedData.length, handleSelectAll, handleSort, getSortIcon]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            {processedData.length} {processedData.length === 1 ? 'row' : 'rows'}
            {selectedRows.size > 0 && ` (${selectedRows.size} selected)`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          {exportable && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Column Settings</DropdownMenuItem>
              <DropdownMenuItem>Density</DropdownMenuItem>
              <DropdownMenuItem>Reset View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Grid */}
      <VirtualGrid
        columns={enhancedHeaderColumns}
        data={processedData}
        height={height}
        onRowClick={onRowClick}
      />

      {/* Status Bar */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
        <div>
          Showing {processedData.length} of {data.length} rows
        </div>
        <div className="flex items-center gap-4">
          <span>Rows per page: 100</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <span>Page 1 of 1</span>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}