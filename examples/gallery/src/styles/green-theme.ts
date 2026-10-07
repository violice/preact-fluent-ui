import { defineConfig } from '../../../../src/styles/config/define-config.ts';

export const greenThemeConfig = defineConfig({
  conditions: { forcedColors: '@media (forced-colors: active)' },
  theme: {
    semanticTokens: {
      colors: {
        canvas: {
          value: {
            base: '#eef1ee',
            _dark: '#1c201c',
            _forcedColors: 'Canvas',
          },
        },
        border: {
          value: {
            base: '#e2e7df',
            _dark: '#3b3d44',
            _forcedColors: 'CanvasText',
          },
        },
        'text-muted': {
          value: {
            base: '#576153',
            _dark: '#bec2cb',
            _forcedColors: 'CanvasText',
          },
        },
        'text-subtle': {
          value: {
            base: '#65705f',
            _dark: '#a0a6b2',
            _forcedColors: 'CanvasText',
          },
        },
        accent: {
          value: {
            base: '#107c10',
            _dark: '#91d981',
            _forcedColors: 'Highlight',
          },
        },
        'accent-hover': {
          value: {
            base: '#0d6b0d',
            _dark: '#ace79e',
            _forcedColors: 'Highlight',
          },
        },
        'accent-pressed': {
          value: {
            base: '#095509',
            _dark: '#79c869',
            _forcedColors: 'Highlight',
          },
        },
        'on-accent': {
          value: {
            base: '#ffffff',
            _dark: '#142d10',
            _forcedColors: 'HighlightText',
          },
        },
        'accent-subtle': {
          value: {
            base: '#e8f4e4',
            _dark: '#2d422b',
            _forcedColors: 'Canvas',
          },
        },
        primary: {
          value: {
            base: '{colors.accent}',
            _dark: '#3d6b47',
            _forcedColors: 'Highlight',
          },
        },
        'primary-hover': {
          value: {
            base: '{colors.accent-hover}',
            _dark: '#497a54',
            _forcedColors: 'Highlight',
          },
        },
        'primary-pressed': {
          value: {
            base: '{colors.accent-pressed}',
            _dark: '#345c3d',
            _forcedColors: 'Highlight',
          },
        },
        'on-primary': {
          value: {
            base: '#ffffff',
            _dark: '#ffffff',
            _forcedColors: 'HighlightText',
          },
        },
        'info-bg': {
          value: {
            base: '#f0f6ed',
            _dark: '#2c392c',
            _forcedColors: 'Canvas',
          },
        },
        card: {
          value: {
            _dark: '#2d332e',
            _forcedColors: 'Canvas',
            base: '#ffffff',
          },
        },
        focus: {
          value: {
            _dark: '#e1f5db',
            _forcedColors: 'Highlight',
            base: '#000000',
          },
        },
      },
    },
  },
});
