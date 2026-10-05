import { createContext } from 'preact';
export type SidebarLayout = 'expanded' | 'rail' | 'horizontal';
export const SidebarContext = /* @__PURE__ */ createContext<SidebarLayout>('expanded');
export function sidebarValue<T>(value: T | { value: T }): T {
  return value !== null && typeof value === 'object' && 'value' in value ? value.value : value;
}
