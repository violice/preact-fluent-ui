import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import defaultStyles from './sidebar.styles';
export type SidebarLayout = 'expanded' | 'rail' | 'horizontal';
export const SidebarContext = /* @__PURE__ */ createContext({
  layout: 'expanded' as SidebarLayout,
  styles: defaultStyles,
});
export function useSidebarStyles() {
  return useContext(SidebarContext).styles;
}
export function sidebarValue<T>(value: T | { value: T }): T {
  return value !== null && typeof value === 'object' && 'value' in value ? value.value : value;
}
