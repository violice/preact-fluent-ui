import type { StylingConfig } from './types.ts';
export function defineConfig<const T extends StylingConfig>(config: T): T {
  return config;
}
export function definePreset<const T extends StylingConfig>(config: T): T {
  return config;
}
