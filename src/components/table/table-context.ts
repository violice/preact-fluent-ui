import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { tableStyles } from './table.styles';
export const TableContext = /* @__PURE__ */ createContext(tableStyles);
export function useTableStyles() {
  return useContext(TableContext);
}
