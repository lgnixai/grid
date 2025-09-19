import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { VirtualGrid } from '../VirtualGrid';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GuideOverlay } from '@/components/Guide/GuideOverlay';
import type { SimpleColumn } from '../SimpleGrid/SimpleGrid';

export interface ModernGridColumn extends SimpleColumn {
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  pinned?: 'left' | 'right' | undefined;
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
  const [columnsState, setColumnsState] = useState<ModernGridColumn[]>(columns);
  const [internalData, setInternalData] = useState<any[]>(data);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const resizeRef = useRef<{ index: number; startX: number; startWidth: number } | null>(null);
  const [newColCounter, setNewColCounter] = useState(1);
  const [showGuide, setShowGuide] = useState(false);

  // Sync with props if they change
  useEffect(() => {
    setColumnsState(columns);
  }, [columns]);

  useEffect(() => {
    setInternalData(data);
  }, [data]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...internalData];

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
  }, [internalData, searchTerm, sortField, sortDirection, columnsState]);

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

  const setExplicitSort = useCallback((field: string, dir: Exclude<SortDirection, null>) => {
    setSortField(field);
    setSortDirection(dir);
  }, []);

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
    const cols = [...columnsState];

    // Add selection column if selectable
    if (selectable) {
      cols.unshift({
        field: '__select',
        headerName: '',
        width: 50,
        render: (_, _row, index) => (
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
  }, [columnsState, selectable, selectedRows, handleRowSelect]);

  // Enhanced header with sorting
  const columnsForRender = useMemo(() => {
    // Keep pinned left columns first
    const left = enhancedColumns.filter(c => c.pinned === 'left');
    const middle = enhancedColumns.filter(c => !c.pinned);
    const right = enhancedColumns.filter(c => c.pinned === 'right');
    return [...left, ...middle, ...right];
  }, [enhancedColumns]);

  const renderHeaderCell = useCallback((col: ModernGridColumn, index: number) => {
    if (col.field === '__select') {
      return (
        <div className="flex justify-center w-full" data-testid="header-__select">
          <Checkbox
            checked={selectedRows.size === processedData.length && processedData.length > 0}
            data-state={selectedRows.size > 0 && selectedRows.size < processedData.length ? 'indeterminate' as any : undefined}
            onCheckedChange={handleSelectAll}
          />
        </div>
      );
    }

    const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startWidth = col.width || 150;
      resizeRef.current = { index, startX, startWidth };
      const onMove = (ev: MouseEvent) => {
        if (!resizeRef.current) return;
        const delta = ev.clientX - resizeRef.current.startX;
        const newWidth = Math.max(80, resizeRef.current.startWidth + delta);
        setColumnsState(prev => {
          const next = [...prev];
          const idx = next.findIndex(c => c.field === col.field);
          if (idx >= 0) next[idx] = { ...next[idx], width: newWidth };
          return next;
        });
      };
      const onUp = () => {
        resizeRef.current = null;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    };

    const handleInsert = (where: 'left' | 'right') => {
      setColumnsState(prev => {
        const next = [...prev];
        const insertIndex = next.findIndex(c => c.field === col.field);
        const newField = `new_${newColCounter}`;
        setNewColCounter(c => c + 1);
        const newCol: any = { field: newField, headerName: 'New Field', width: 150, resizable: true, sortable: true };
        next.splice(insertIndex + (where === 'right' ? 1 : 0), 0, newCol);
        return next;
      });
      setInternalData(prev => prev.map(r => ({ ...r, [`new_${newColCounter}`]: '' })));
    };

    const handleDelete = () => {
      setColumnsState(prev => prev.filter(c => c.field !== col.field));
      setInternalData(prev => prev.map(r => {
        const { [col.field]: _omit, ...rest } = r;
        return rest;
      }));
    };

    const handleFreezeToHere = () => {
      setColumnsState(prev => {
        // Pin all columns up to this header to left
        const idx = prev.findIndex(c => c.field === col.field);
        return prev.map((c, i) => ({ ...c, pinned: i <= idx ? 'left' : undefined }));
      });
    };

    const onDragStart = () => setDragIndex(index);
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const onDrop = () => {
      setColumnsState(prev => {
        if (dragIndex === null) return prev;
        const next = [...prev];
        const fromField = columnsForRender[dragIndex as number]?.field;
        if (!fromField) return prev;
        const fromIdx = next.findIndex(c => c.field === fromField);
        const toIdx = next.findIndex(c => c.field === col.field);
        if (fromIdx < 0 || toIdx < 0) return prev;
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        return next;
      });
      setDragIndex(null);
    };

    return (
      <DropdownMenu open={openMenuIndex === index} onOpenChange={(o) => !o && setOpenMenuIndex(null)}>
        <DropdownMenuTrigger asChild>
          <div
            className="flex items-center justify-between w-full select-none"
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onContextMenu={(e) => { e.preventDefault(); setOpenMenuIndex(index); }}
            data-testid={`header-${col.field}`}
            data-pinned={col.pinned === 'left' ? 'true' : undefined}
          >
            <span className="truncate">{col.headerName || col.field}</span>
            {col.sortable && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={(ev) => { ev.stopPropagation(); handleSort(col.field); }}
              >
                {getSortIcon(col.field)}
              </Button>
            )}

            {col.resizable !== false && (
              <div
                className="absolute right-0 top-0 h-full w-1 cursor-col-resize opacity-0 hover:opacity-100 bg-primary/30"
                onMouseDown={startResize}
                data-testid={`resizer-${col.field}`}
              />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {col.sortable && (
            <>
              <DropdownMenuItem onClick={() => setExplicitSort(col.field, 'asc')}>Sort Ascending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setExplicitSort(col.field, 'desc')}>Sort Descending</DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => handleInsert('left')}>Insert Left</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleInsert('right')}>Insert Right</DropdownMenuItem>
          <DropdownMenuItem onClick={handleFreezeToHere}>Freeze to Here</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete}>Delete Column</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [selectedRows.size, processedData.length, handleSelectAll, getSortIcon, handleSort, openMenuIndex, dragIndex, columnsForRender, newColCounter]);

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
              <DropdownMenuItem onClick={() => setShowGuide(true)}>操作指南</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Column Settings</DropdownMenuItem>
              <DropdownMenuItem>Density</DropdownMenuItem>
              <DropdownMenuItem>Reset View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Grid */}
      <VirtualGrid
        columns={columnsForRender}
        data={processedData}
        height={height}
        onRowClick={onRowClick}
        renderHeaderCell={renderHeaderCell}
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

      {/* Guide */}
      <GuideOverlay open={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
}