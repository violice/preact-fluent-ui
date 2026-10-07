import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { sidebarStyles } from './sidebar.styles';
export type SidebarLayout = 'expanded' | 'rail' | 'horizontal';
export const SidebarContext = /* @__PURE__ */ createContext({
  layout: 'expanded' as SidebarLayout,
  styles: sidebarStyles,
});
export function useSidebarStyles() {
  return useContext(SidebarContext).styles;
}
export function sidebarValue<T>(value: T | { value: T }): T {
  return value !== null && typeof value === 'object' && 'value' in value ? value.value : value;
}
