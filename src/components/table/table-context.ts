import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import defaultStyles from './table.styles';
export const TableContext = /* @__PURE__ */ createContext(defaultStyles);
export function useTableStyles() {
  return useContext(TableContext);
}
