import { useCallback } from 'react';
import { useGridStore } from '@/store/grid-store';
import type { CellPosition, UseGridReturn } from '@/types';

export function useGrid(): UseGridReturn {
  const store = useGridStore();
  
  const selectCell = useCallback((position: CellPosition) => {
    store.selectCells([position]);
  }, [store]);
  
  const selectCells = useCallback((positions: CellPosition[]) => {
    store.selectCells(positions);
  }, [store]);
  
  const selectRow = useCallback((rowId: string) => {
    store.selectRows([rowId]);
  }, [store]);
  
  const selectRows = useCallback((rowIds: string[]) => {
    store.selectRows(rowIds);
  }, [store]);
  
  const editCell = useCallback((position: CellPosition) => {
    store.setEditingCell(position);
  }, [store]);
  
  const commitEdit = useCallback((value: any) => {
    const editingCell = store.editingCell;
    if (editingCell) {
      store.setCellValue(editingCell.row, editingCell.column, value);
      store.setEditingCell(null);
    }
  }, [store]);
  
  const cancelEdit = useCallback(() => {
    store.setEditingCell(null);
  }, [store]);
  
  const setCellValue = useCallback((row: string, column: string, value: any) => {
    store.setCellValue(row, column, value);
  }, [store]);

  return {
    rows: store.rows,
    columns: store.columns,
    selectedCells: store.selectedCells,
    selectedRows: store.selectedRows,
    editingCell: store.editingCell,
    loading: store.loading,
    actions: {
      selectCell,
      selectCells,
      selectRow,
      selectRows,
      editCell,
      commitEdit,
      cancelEdit,
      setCellValue,
    },
  };
}