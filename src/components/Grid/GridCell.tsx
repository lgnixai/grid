import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useGridStore } from '@/store/grid-store';
import type { RowData, ColumnOptions, CellPosition } from '@/types';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export interface GridCellProps {
  row: RowData;
  column: ColumnOptions;
  style?: React.CSSProperties;
  className?: string;
}

export function GridCell({ row, column, style, className }: GridCellProps) {
  const { 
    selectedCells, 
    editingCell, 
    selectCells, 
    setEditingCell, 
    setCellValue,
    getCellValue 
  } = useGridStore();

  const cellPosition: CellPosition = useMemo(
    () => ({ row: row.id, column: column.field }),
    [row.id, column.field]
  );

  const value = getCellValue(row.id, column.field);
  const isSelected = selectedCells.some(
    (cell) => cell.row === row.id && cell.column === column.field
  );
  const isEditing = editingCell?.row === row.id && editingCell?.column === column.field;

  const [editValue, setEditValue] = useState(value);

  const handleClick = useCallback(() => {
    if (!isSelected) {
      selectCells([cellPosition]);
    }
  }, [isSelected, selectCells, cellPosition]);

  const handleDoubleClick = useCallback(() => {
    if (!column.readonly) {
      setEditingCell(cellPosition);
      setEditValue(value);
    }
  }, [column.readonly, setEditingCell, cellPosition, value]);

  const handleCommit = useCallback(() => {
    setCellValue(row.id, column.field, editValue);
    setEditingCell(null);
  }, [setCellValue, row.id, column.field, editValue, setEditingCell]);

  const handleCancel = useCallback(() => {
    setEditingCell(null);
    setEditValue(value);
  }, [setEditingCell, value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleCommit, handleCancel]);

  const renderCellContent = () => {
    if (isEditing) {
      // Render editor based on column type or custom editor
      if (column.cellEditor) {
        const EditorComponent = column.cellEditor;
        return (
          <EditorComponent
            value={editValue}
            onChange={setEditValue}
            onCommit={handleCommit}
            onCancel={handleCancel}
            row={row}
            column={column}
            params={column.cellParams}
          />
        );
      }

      // Default editor
      return (
        <Input
          value={editValue || ''}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleCommit}
          autoFocus
          className="h-full border-none shadow-none focus-visible:ring-0"
        />
      );
    }

    // Render cell content based on column renderer or default
    if (column.cellRender) {
      const RendererComponent = column.cellRender;
      return (
        <RendererComponent
          value={value}
          row={row}
          column={column}
          params={column.cellParams}
        />
      );
    }

    // Default renderers based on value type
    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center justify-center">
          <Checkbox checked={value} disabled className="pointer-events-none" />
        </div>
      );
    }

    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>;
    }

    return <span className="truncate">{String(value)}</span>;
  };

  const cellClasses = cn(
    'visual-grid-cell',
    {
      'visual-grid-selected': isSelected,
      'visual-grid-editing': isEditing,
      'cursor-pointer': !isEditing,
      'cursor-text': isEditing,
    },
    column.cellClass,
    className
  );

  const cellStyles = {
    ...style,
    ...column.cellStyle,
    ...(column.getCellStyle ? column.getCellStyle({ row: row.id, column: column.field, grid: null }) : {}),
  };

  return (
    <div
      className={cellClasses}
      style={cellStyles}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      role="gridcell"
      tabIndex={isSelected ? 0 : -1}
    >
      {renderCellContent()}
    </div>
  );
}