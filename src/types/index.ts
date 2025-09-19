export type Unsubscribe = () => void;

export interface MenuItem {
  separator?: boolean;
  disabled?: boolean;
  name?: string;
  icon?: string;
  action?: () => void;
  subMenus?: MenuItem[];
}

export interface GetColumnMenuItemsParams {
  column: string;
  grid: any; // Will be properly typed later
}

export interface GetContextMenuItemsParams {
  row: string;
  column: string;
  grid: any; // Will be properly typed later
}

export interface RowParams {
  row: string;
  grid: any;
}

export interface ColumnParams {
  column: string;
  grid: any;
}

export interface CellParams {
  row: string;
  column: string;
  grid: any;
}

export interface Styles {
  [key: string]: string;
}

export interface CellPosition {
  row: string;
  column: string;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Boundary {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

export interface RowData {
  id: string;
  [key: string]: any;
}

export type RowPinned = 'top' | 'bottom' | undefined;
export type ColumnPinned = 'left' | 'right' | undefined;
export type Pinned = ColumnPinned;

export interface GroupData {
  id: string;
  headerName: string;
  columns: string[];
  groups: string[];
  collapsed?: boolean;
  collapsible?: boolean;
}

export interface ColumnSelectorParams {
  row: string;
  grid: any;
}

import * as React from 'react';

export type CellRenderer<T = any> = React.ComponentType<{
  value: any;
  row: RowData;
  column: ColumnOptions;
  params?: T;
}>;

export type CellEditor<T = any> = React.ComponentType<{
  value: any;
  onChange: (value: any) => void;
  onCommit: () => void;
  onCancel: () => void;
  row: RowData;
  column: ColumnOptions;
  params?: T;
}>;

export interface OverridableColumnOptions {
  readonly?: boolean;
  sortable?: boolean;
  cellRender?: CellRenderer;
  cellEditor?: CellEditor;
  cellParams?: any;
  cellStyle?: React.CSSProperties;
  getCellStyle?: (params: CellParams) => React.CSSProperties;
  cellClass?: string[];
  getCellClass?: (params: CellParams) => string[];
  headerStyle?: React.CSSProperties;
  getHeaderStyle?: (params: ColumnParams) => React.CSSProperties;
  headerClass?: string[];
  getHeaderClass?: (params: ColumnParams) => string[];
}

export interface BaseColumnOptions extends OverridableColumnOptions {
  width?: number;
  minWidth?: number;
  flex?: number;
  resizable?: boolean;
  visible?: boolean;
  pinned?: Pinned;
  rowDragable?: boolean | ((param: CellParams) => boolean);
  columnOptionsSelector?: (params: ColumnSelectorParams) => OverridableColumnOptions;
}

export interface ColumnOptions extends BaseColumnOptions {
  field: string;
  headerName?: string;
}

export interface ColumnGroupOptions {
  id?: string;
  headerName?: string;
  isPadding?: boolean;
  collapsed?: boolean;
  collapsible?: boolean;
  children: (ColumnGroupOptions | ColumnOptions)[];
}

export type ColumnDef = ColumnGroupOptions | ColumnOptions;
export type ColumnsDef = ColumnDef[];

export type Fillable = 'x' | 'y' | 'xy' | undefined;

export interface GridOptions {
  width?: string;
  height?: string;
  columns: ColumnsDef;
  defaultColumnOption?: BaseColumnOptions;
  getColumnMenuItems?: (params: GetColumnMenuItemsParams) => MenuItem[] | undefined;
  rows: RowData[];
  headerHeight?: number;
  rowHeight?: number | ((id: string) => number);
  minRowHeight?: number;
  rowResizable?: boolean | ((id: string) => boolean);
  rowStyle?: React.CSSProperties;
  getRowStyle?: (params: RowParams) => React.CSSProperties;
  rowClass?: string[];
  getRowClass?: (params: RowParams) => string[];
  overscanRowCount?: number;
  overscanColumnCount?: number;
  scrollThrottleRate?: number;
  fillable?: Fillable;
  getContextMenuItems?: (params: GetContextMenuItemsParams) => MenuItem[];
}

// Virtual scrolling types
export interface ItemSize {
  [key: string]: number;
}

export interface VirtualItem {
  key: string | number;
  index: number;
  start: number;
  end: number;
  size: number;
}

export interface VirtualizerOptions<T> {
  count: number;
  getScrollElement: () => T | null;
  estimateSize: (index: number) => number;
  overscan?: number;
  horizontal?: boolean;
  paddingStart?: number;
  paddingEnd?: number;
  scrollMargin?: number;
  gap?: number;
  initialRect?: { width: number; height: number };
  onChange?: (instance: any) => void;
  measureElement?: (element: Element, entry: ResizeObserverEntry) => void;
  initialOffset?: number;
  getItemKey?: (index: number) => string | number;
}

// Modern React patterns
export interface GridContextValue {
  gridId: string;
  options: GridOptions;
  store: any; // Will be properly typed with Zustand store
}

export interface UseGridReturn {
  rows: RowData[];
  columns: ColumnOptions[];
  selectedCells: CellPosition[];
  selectedRows: string[];
  editingCell: CellPosition | null;
  loading: boolean;
  actions: {
    selectCell: (position: CellPosition) => void;
    selectCells: (positions: CellPosition[]) => void;
    selectRow: (rowId: string) => void;
    selectRows: (rowIds: string[]) => void;
    editCell: (position: CellPosition) => void;
    commitEdit: (value: any) => void;
    cancelEdit: () => void;
    setCellValue: (row: string, column: string, value: any) => void;
  };
}