import React, { createContext, useContext, useMemo } from 'react';
import type { GridOptions, GridContextValue, ColumnOptions } from '@/types/index';
import { useGridStore } from '@/store/grid-store';

const GridContext = createContext<GridContextValue | null>(null);

export interface GridProviderProps {
  children: React.ReactNode;
  options: GridOptions;
  gridId?: string;
}

export function GridProvider({ children, options, gridId = 'default' }: GridProviderProps) {
  const store = useGridStore();
  
  // Initialize grid with options
  React.useEffect(() => {
    store.setRows(options.rows);
    try {
      store.setColumns(((options as any).columns as any[]).filter((c: any) => (c as any).field) as unknown as ColumnOptions[]);
    } catch {
      store.setColumns([] as unknown as ColumnOptions[]);
    }
    
    // Set other options
    if (options.headerHeight) {
      // store.setHeaderHeight(options.headerHeight);
    }
    if (options.rowHeight) {
      // store.setRowHeight(options.rowHeight);
    }
    if (options.overscanRowCount) {
      // store.setOverscanRowCount(options.overscanRowCount);
    }
    if (options.overscanColumnCount) {
      // store.setOverscanColumnCount(options.overscanColumnCount);
    }
  }, [options, store]);

  const contextValue = useMemo<GridContextValue>(
    () => ({
      gridId,
      options: options as any,
      store: store as any,
    }),
    [gridId, options, store]
  );

  return <GridContext.Provider value={contextValue}>{children}</GridContext.Provider>;
}

export function useGridContext() {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error('useGridContext must be used within a GridProvider');
  }
  return context;
}

export { GridContext };