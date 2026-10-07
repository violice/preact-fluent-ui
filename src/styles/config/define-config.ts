import type { StylesConfig } from './types.ts';
export function defineConfig<const T extends StylesConfig>(config: T): T {
  return config;
}
export function definePreset<const T extends StylesConfig>(config: T): T {
  return config;
}
