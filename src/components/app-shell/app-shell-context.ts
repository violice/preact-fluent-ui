import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import defaultStyles from './app-shell.styles';
export const AppShellContext = /* @__PURE__ */ createContext(defaultStyles);
export function useAppShellStyles() {
  return useContext(AppShellContext);
}
