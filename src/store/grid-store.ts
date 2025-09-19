import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import type { ColumnOptions, RowData, CellPosition } from '@/types';

export interface GridState {
  // Grid configuration
  width: string;
  height: string;
  loading: boolean;
  destroyed: boolean;
  
  // Data
  rows: RowData[];
  columns: ColumnOptions[];
  
  // Selection
  selectedCells: CellPosition[];
  selectedRows: string[];
  editingCell: CellPosition | null;
  
  // Virtual scrolling
  scrollTop: number;
  scrollLeft: number;
  overscanRowCount: number;
  overscanColumnCount: number;
  
  // Performance
  rowHeight: number | ((id: string) => number);
  headerHeight: number;
  
  // Features
  fillable: 'x' | 'y' | 'xy' | undefined;
  rowResizable: boolean | ((id: string) => boolean);
  
  // Actions
  setLoading: (loading: boolean) => void;
  setRows: (rows: RowData[]) => void;
  appendRows: (rows: RowData[]) => void;
  removeRows: (rowIds: string[]) => void;
  setColumns: (columns: ColumnOptions[]) => void;
  
  // Selection actions
  selectCells: (cells: CellPosition[]) => void;
  selectRows: (rowIds: string[]) => void;
  setEditingCell: (cell: CellPosition | null) => void;
  
  // Scroll actions
  setScrollPosition: (top: number, left: number) => void;
  
  // Cell operations
  setCellValue: (row: string, column: string, value: any) => void;
  getCellValue: (row: string, column: string) => any;
  
  // Utility
  getRowById: (id: string) => RowData | undefined;
  getColumnByField: (field: string) => ColumnOptions | undefined;
  destroy: () => void;
}

export const useGridStore = create<GridState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      width: '100%',
      height: '100%',
      loading: false,
      destroyed: false,
      
      rows: [],
      columns: [],
      
      selectedCells: [],
      selectedRows: [],
      editingCell: null,
      
      scrollTop: 0,
      scrollLeft: 0,
      overscanRowCount: 5,
      overscanColumnCount: 2,
      
      rowHeight: 40,
      headerHeight: 40,
      
      fillable: undefined,
      rowResizable: false,
      
      // Actions
      setLoading: (loading) =>
        set((state) => {
          state.loading = loading;
        }),
        
      setRows: (rows) =>
        set((state) => {
          state.rows = rows;
        }),
        
      appendRows: (newRows) =>
        set((state) => {
          state.rows.push(...newRows);
        }),
        
      removeRows: (rowIds) =>
        set((state) => {
          state.rows = state.rows.filter((row) => !rowIds.includes(row.id));
          state.selectedRows = state.selectedRows.filter((id) => !rowIds.includes(id));
        }),
        
      setColumns: (columns) =>
        set((state) => {
          state.columns = columns;
        }),
        
      selectCells: (cells) =>
        set((state) => {
          state.selectedCells = cells;
        }),
        
      selectRows: (rowIds) =>
        set((state) => {
          state.selectedRows = rowIds;
        }),
        
      setEditingCell: (cell) =>
        set((state) => {
          state.editingCell = cell;
        }),
        
      setScrollPosition: (top, left) =>
        set((state) => {
          state.scrollTop = top;
          state.scrollLeft = left;
        }),
        
      setCellValue: (rowId, columnField, value) =>
        set((state) => {
          const row = state.rows.find((r) => r.id === rowId);
          if (row) {
            row[columnField] = value;
          }
        }),
        
      getCellValue: (rowId, columnField) => {
        const state = get();
        const row = state.rows.find((r) => r.id === rowId);
        return row?.[columnField];
      },
      
      getRowById: (id) => {
        const state = get();
        return state.rows.find((row) => row.id === id);
      },
      
      getColumnByField: (field) => {
        const state = get();
        return state.columns.find((col) => col.field === field);
      },
      
      destroy: () =>
        set((state) => {
          state.destroyed = true;
          state.rows = [];
          state.columns = [];
          state.selectedCells = [];
          state.selectedRows = [];
          state.editingCell = null;
        }),
    }))
  )
);