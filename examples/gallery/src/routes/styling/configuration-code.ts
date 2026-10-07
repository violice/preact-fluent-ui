export const configurationOverviewCode = `import { fluentStyles } from '@violice/preact-fluent-ui/vite';
import { fluentPreset } from '@violice/preact-fluent-ui/config';

fluentStyles({
  config: {
    presets: [fluentPreset],
    reset: true,
    native: true,
    globalStyles: {
      body: { margin: '0', backgroundColor: '{colors.canvas}' },
    },
    conditions: {
      compact: '@media (max-width: 640px)',
    },
    theme: {
      // Direct groups replace groups with the same name.
      tokens: {
        brand: { blue: { value: '#1456b8' } },
      },
      semanticTokens: {
        app: { heading: { value: '{brand.blue}' } },
      },
      // Extend merges into existing preset groups.
      extend: {
        tokens: { spacing: { page: { value: '24px' } } },
      },
    },
    themes: {
      compact: {
        tokens: { spacing: { page: { value: '16px' } } },
      },
    },
  },
  outdir: 'styled-system',
  components: true,
  sources: [], // Add custom import sources only when needed.
  // Alternative to inline config, not an additional configuration:
  // configFile: './fluent.config.ts',
});`;

export const configurationHelpersCode = `// fluent.config.ts
import { defineConfig, definePreset, fluentPreset } from '@violice/preact-fluent-ui/config';
import type { TokenLeaf } from '@violice/preact-fluent-ui/config';

const pageSpacing: TokenLeaf = { value: '24px', description: 'Application page padding' };
export const appPreset = definePreset({
  theme: { extend: { tokens: { spacing: { page: pageSpacing } } } },
});

export default defineConfig({
  presets: [fluentPreset, appPreset],
  reset: true,
  native: true,
});

// vite.config.ts: fluentStyles({ configFile: './fluent.config.ts' });`;
