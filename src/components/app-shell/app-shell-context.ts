import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { appShellStyles } from './app-shell.styles';
export const AppShellContext = /* @__PURE__ */ createContext(appShellStyles);
export function useAppShellStyles() {
  return useContext(AppShellContext);
}
