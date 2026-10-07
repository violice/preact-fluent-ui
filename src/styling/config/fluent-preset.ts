import { definePreset } from './define-config.ts';

// Public CSS variable names retained for existing components and consumers.
export const fluentLegacyVariables: Record<string, string> = {
  'fonts.body': '--font-body',
  'fonts.display': '--font-display',
  'fonts.mono': '--font-mono',
  'fontSizes.caption': '--type-caption',
  'fontSizes.body': '--type-body',
  'fontSizes.subtitle': '--type-subtitle',
  'fontSizes.title': '--type-title',
  'fontWeights.semibold': '--weight-semibold',
  'colors.canvas': '--color-canvas',
  'colors.surface': '--color-surface',
  'colors.card': '--color-card',
  'colors.surface-raised': '--color-surface-raised',
  'colors.surface-muted': '--color-surface-muted',
  'colors.surface-hover': '--color-surface-hover',
  'colors.surface-pressed': '--color-surface-pressed',
  'colors.border': '--color-border',
  'colors.border-strong': '--color-border-strong',
  'colors.control': '--color-control',
  'colors.control-hover': '--color-control-hover',
  'colors.control-pressed': '--color-control-pressed',
  'colors.control-border': '--color-control-border',
  'colors.control-bottom': '--color-control-bottom',
  'colors.text': '--color-text',
  'colors.text-muted': '--color-text-muted',
  'colors.text-subtle': '--color-text-subtle',
  'codeColors.keyword': '--code-color-keyword',
  'codeColors.tag': '--code-color-tag',
  'codeColors.string': '--code-color-string',
  'codeColors.comment': '--code-color-comment',
  'codeColors.function': '--code-color-function',
  'codeColors.type': '--code-color-type',
  'codeColors.attribute': '--code-color-attribute',
  'codeColors.property': '--code-color-property',
  'codeColors.number': '--code-color-number',
  'codeColors.literal': '--code-color-literal',
  'codeColors.command': '--code-color-command',
  'codeColors.operator': '--code-color-operator',
  'codeColors.punctuation': '--code-color-punctuation',
  'colors.accent': '--color-accent',
  'colors.accent-hover': '--color-accent-hover',
  'colors.accent-pressed': '--color-accent-pressed',
  'colors.on-accent': '--color-on-accent',
  'colors.accent-subtle': '--color-accent-subtle',
  'colors.primary': '--color-primary',
  'colors.primary-hover': '--color-primary-hover',
  'colors.primary-pressed': '--color-primary-pressed',
  'colors.on-primary': '--color-on-primary',
  'colors.focus': '--color-focus',
  'colors.success': '--color-success',
  'colors.warning': '--color-warning',
  'colors.danger': '--color-danger',
  'colors.info-bg': '--color-info-bg',
  'colors.success-bg': '--color-success-bg',
  'colors.warning-bg': '--color-warning-bg',
  'colors.danger-bg': '--color-danger-bg',
  'shadows.card': '--shadow-card',
  'shadows.dialog': '--shadow-dialog',
  'shadows.control': '--shadow-control',
  'shadows.primary': '--shadow-primary',
  'colors.disabled': '--color-disabled',
  'radii.sm': '--radius-sm',
  'radii.md': '--radius-md',
  'radii.lg': '--radius-lg',
  'spacing.1': '--space-1',
  'spacing.2': '--space-2',
  'spacing.3': '--space-3',
  'spacing.4': '--space-4',
  'spacing.5': '--space-5',
  'spacing.6': '--space-6',
  'spacing.8': '--space-8',
};

export const fluentPreset = definePreset({
  reset: true,
  native: true,
  conditions: {
    forcedColors: '@media (forced-colors: active)',
  },
  theme: {
    tokens: {
      fonts: {
        body: {
          value: "'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif",
        },
        display: {
          value:
            "'Segoe UI Variable Display', 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif",
        },
        mono: {
          value: "'Cascadia Code', Consolas, monospace",
        },
      },
      fontSizes: {
        caption: {
          value: '12px',
        },
        body: {
          value: '14px',
        },
        subtitle: {
          value: '16px',
        },
        title: {
          value: '28px',
        },
      },
      fontWeights: {
        semibold: {
          value: '600',
        },
      },
      palette: {
        cedf0f5: {
          value: '#edf0f5',
        },
        c1c1d20: {
          value: '#1c1d20',
        },
        cf9f9f9: {
          value: '#f9f9f9',
        },
        c232428: {
          value: '#232428',
        },
        cffffff: {
          value: '#ffffff',
        },
        c2d2e33: {
          value: '#2d2e33',
        },
        c34353b: {
          value: '#34353b',
        },
        cf7f7f7: {
          value: '#f7f7f7',
        },
        c292a2f: {
          value: '#292a2f',
        },
        cf0f0f0: {
          value: '#f0f0f0',
        },
        c35373e: {
          value: '#35373e',
        },
        ce8e8e8: {
          value: '#e8e8e8',
        },
        c2d2f35: {
          value: '#2d2f35',
        },
        ce4e7ed: {
          value: '#e4e7ed',
        },
        c3b3d44: {
          value: '#3b3d44',
        },
        cbdbdbd: {
          value: '#bdbdbd',
        },
        c626670: {
          value: '#626670',
        },
        c37393f: {
          value: '#37393f',
        },
        c40434b: {
          value: '#40434b',
        },
        cefefef: {
          value: '#efefef',
        },
        c303238: {
          value: '#303238',
        },
        cdfe2e7: {
          value: '#dfe2e7',
        },
        c484b54: {
          value: '#484b54',
        },
        cb6bbc3: {
          value: '#b6bbc3',
        },
        c656975: {
          value: '#656975',
        },
        c1b1b1b: {
          value: '#1b1b1b',
        },
        cf3f4f6: {
          value: '#f3f4f6',
        },
        c525c6c: {
          value: '#525c6c',
        },
        cbec2cb: {
          value: '#bec2cb',
        },
        c616b7b: {
          value: '#616b7b',
        },
        ca0a6b2: {
          value: '#a0a6b2',
        },
        c8b2294: {
          value: '#8b2294',
        },
        ce6a0ef: {
          value: '#e6a0ef',
        },
        c246531: {
          value: '#246531',
        },
        ca7dca8: {
          value: '#a7dca8',
        },
        c795000: {
          value: '#795000',
        },
        ceac47c: {
          value: '#eac47c',
        },
        c155a9b: {
          value: '#155a9b',
        },
        c9fc8f4: {
          value: '#9fc8f4',
        },
        c0969c6: {
          value: '#0969c6',
        },
        ca4cafe: {
          value: '#a4cafe',
        },
        c115ea3: {
          value: '#115ea3',
        },
        cbad7ff: {
          value: '#bad7ff',
        },
        c0c3b5e: {
          value: '#0c3b5e',
        },
        c8cb6ed: {
          value: '#8cb6ed',
        },
        c152b46: {
          value: '#152b46',
        },
        ce8f3fc: {
          value: '#e8f3fc',
        },
        c2a3b50: {
          value: '#2a3b50',
        },
        c000000: {
          value: '#000000',
        },
        cdceaff: {
          value: '#dceaff',
        },
        c0f6b47: {
          value: '#0f6b47',
        },
        c95d5b2: {
          value: '#95d5b2',
        },
        c8a5b00: {
          value: '#8a5b00',
        },
        ce4c28c: {
          value: '#e4c28c',
        },
        ca4262c: {
          value: '#a4262c',
        },
        cf1a3ac: {
          value: '#f1a3ac',
        },
        cf0f6fc: {
          value: '#f0f6fc',
        },
        c293544: {
          value: '#293544',
        },
        ceff8f3: {
          value: '#eff8f3',
        },
        c283c34: {
          value: '#283c34',
        },
        cfff8e9: {
          value: '#fff8e9',
        },
        c3d3529: {
          value: '#3d3529',
        },
        cfdf0f1: {
          value: '#fdf0f1',
        },
        c402e33: {
          value: '#402e33',
        },
        c8a8e96: {
          value: '#8a8e96',
        },
        c8e939e: {
          value: '#8e939e',
        },
      },
      systemColors: {
        canvas: {
          value: 'Canvas',
        },
        canvasText: {
          value: 'CanvasText',
        },
        field: {
          value: 'Field',
        },
        fieldText: {
          value: 'FieldText',
        },
        highlight: {
          value: 'Highlight',
        },
        highlightText: {
          value: 'HighlightText',
        },
        grayText: {
          value: 'GrayText',
        },
      },
      shadowValues: {
        'card-light': {
          value: '0 1px 2px rgb(20 36 62 / 4%), 0 3px 10px rgb(20 36 62 / 2%)',
        },
        'card-dark': {
          value: '0 1px 3px rgb(0 0 0 / 12%)',
        },
        none: {
          value: 'none',
        },
        'dialog-light': {
          value: '0 8px 28px rgb(0 0 0 / 18%)',
        },
        'dialog-dark': {
          value: '0 12px 40px rgb(0 0 0 / 40%)',
        },
        'control-light': {
          value: '0 1px 2px rgb(0 0 0 / 4%), inset 0 1px 0 rgb(255 255 255 / 60%)',
        },
        'control-dark': {
          value: 'inset 0 1px 0 rgb(255 255 255 / 3%), 0 1px 2px rgb(0 0 0 / 10%)',
        },
        'primary-light': {
          value: 'inset 0 1px 0 rgb(255 255 255 / 18%), 0 1px 2px rgb(0 0 0 / 8%)',
        },
        'primary-dark': {
          value: 'inset 0 1px 0 rgb(255 255 255 / 16%), 0 1px 2px rgb(0 0 0 / 12%)',
        },
      },
      radii: {
        sm: {
          value: '4px',
        },
        md: {
          value: '8px',
        },
        lg: {
          value: '8px',
        },
      },
      spacing: {
        '1': {
          value: '4px',
        },
        '2': {
          value: '8px',
        },
        '3': {
          value: '12px',
        },
        '4': {
          value: '16px',
        },
        '5': {
          value: '20px',
        },
        '6': {
          value: '24px',
        },
        '8': {
          value: '32px',
        },
      },
    },
    semanticTokens: {
      colors: {
        canvas: {
          value: {
            base: '{palette.cedf0f5}',
            _dark: '{palette.c1c1d20}',
            _forcedColors: '{systemColors.canvas}',
          },
        },
        surface: {
          value: {
            base: '{palette.cf9f9f9}',
            _dark: '{palette.c232428}',
            _forcedColors: '{systemColors.canvas}',
          },
        },
        card: {
          value: {
            base: '{palette.cffffff}',
            _dark: '{palette.c2d2e33}',
            _forcedColors: '{systemColors.canvas}',
          },
        },
        'surface-raised': {
          value: {
            base: '{palette.cffffff}',
            _dark: '{palette.c34353b}',
            _forcedColors: '{systemColors.canvas}',
          },
        },
        'surface-muted': {
          value: {
            base: '{palette.cf7f7f7}',
            _dark: '{palette.c292a2f}',
            _forcedColors: '{systemColors.canvas}',
          },
        },
        'surface-hover': {
          value: {
            base: '{palette.cf0f0f0}',
            _dark: '{palette.c35373e}',
            _forcedColors: '{systemColors.canvas}',
          },
        },
        'surface-pressed': {
          value: {
            base: '{palette.ce8e8e8}',
            _dark: '{palette.c2d2f35}',
            _forcedColors: '{systemColors.canvas}',
          },
        },
        border: {
          value: {
            base: '{palette.ce4e7ed}',
            _dark: '{palette.c3b3d44}',
            _forcedColors: '{systemColors.canvasText}',
          },
        },
        'border-strong': {
          value: {
            base: '{palette.cbdbdbd}',
            _dark: '{palette.c626670}',
            _forcedColors: '{systemColors.canvasText}',
          },
        },
        control: {
          value: {
            base: '{palette.cffffff}',
            _dark: '{palette.c37393f}',
            _forcedColors: '{systemColors.field}',
          },
        },
        'control-hover': {
          value: {
            base: '{palette.cf7f7f7}',
            _dark: '{palette.c40434b}',
            _forcedColors: '{systemColors.field}',
          },
        },
        'control-pressed': {
          value: {
            base: '{palette.cefefef}',
            _dark: '{palette.c303238}',
            _forcedColors: '{systemColors.field}',
          },
        },
        'control-border': {
          value: {
            base: '{palette.cdfe2e7}',
            _dark: '{palette.c484b54}',
            _forcedColors: '{systemColors.fieldText}',
          },
        },
        'control-bottom': {
          value: {
            base: '{palette.cb6bbc3}',
            _dark: '{palette.c656975}',
            _forcedColors: '{systemColors.fieldText}',
          },
        },
        text: {
          value: {
            base: '{palette.c1b1b1b}',
            _dark: '{palette.cf3f4f6}',
            _forcedColors: '{systemColors.canvasText}',
          },
        },
        'text-muted': {
          value: {
            base: '{palette.c525c6c}',
            _dark: '{palette.cbec2cb}',
            _forcedColors: '{systemColors.canvasText}',
          },
        },
        'text-subtle': {
          value: {
            base: '{palette.c616b7b}',
            _dark: '{palette.ca0a6b2}',
            _forcedColors: '{systemColors.canvasText}',
          },
        },
        accent: {
          value: {
            base: '{palette.c0969c6}',
            _dark: '{palette.ca4cafe}',
            _forcedColors: '{systemColors.highlight}',
          },
        },
        'accent-hover': {
          value: {
            base: '{palette.c115ea3}',
            _dark: '{palette.cbad7ff}',
            _forcedColors: '{systemColors.highlight}',
          },
        },
        'accent-pressed': {
          value: {
            base: '{palette.c0c3b5e}',
            _dark: '{palette.c8cb6ed}',
            _forcedColors: '{systemColors.highlight}',
          },
        },
        'on-accent': {
          value: {
            base: '{palette.cffffff}',
            _dark: '{palette.c152b46}',
            _forcedColors: '{systemColors.highlightText}',
          },
        },
        'accent-subtle': {
          value: {
            base: '{palette.ce8f3fc}',
            _dark: '{palette.c2a3b50}',
            _forcedColors: '{systemColors.canvas}',
          },
        },
        primary: {
          value: {
            base: '{colors.accent}',
            _forcedColors: '{systemColors.highlight}',
          },
        },
        'primary-hover': {
          value: {
            base: '{colors.accent-hover}',
            _forcedColors: '{systemColors.highlight}',
          },
        },
        'primary-pressed': {
          value: {
            base: '{colors.accent-pressed}',
            _forcedColors: '{systemColors.highlight}',
          },
        },
        'on-primary': {
          value: {
            base: '{colors.on-accent}',
            _forcedColors: '{systemColors.highlightText}',
          },
        },
        focus: {
          value: {
            base: '{palette.c000000}',
            _dark: '{palette.cdceaff}',
            _forcedColors: '{systemColors.highlight}',
          },
        },
        success: {
          value: {
            base: '{palette.c0f6b47}',
            _dark: '{palette.c95d5b2}',
            _forcedColors: '{systemColors.canvasText}',
          },
        },
        warning: {
          value: {
            base: '{palette.c8a5b00}',
            _dark: '{palette.ce4c28c}',
            _forcedColors: '{systemColors.canvasText}',
          },
        },
        danger: {
          value: {
            base: '{palette.ca4262c}',
            _dark: '{palette.cf1a3ac}',
            _forcedColors: '{systemColors.canvasText}',
          },
        },
        'info-bg': {
          value: {
            base: '{palette.cf0f6fc}',
            _dark: '{palette.c293544}',
            _forcedColors: '{systemColors.canvas}',
          },
        },
        'success-bg': {
          value: {
            base: '{palette.ceff8f3}',
            _dark: '{palette.c283c34}',
            _forcedColors: '{systemColors.canvas}',
          },
        },
        'warning-bg': {
          value: {
            base: '{palette.cfff8e9}',
            _dark: '{palette.c3d3529}',
            _forcedColors: '{systemColors.canvas}',
          },
        },
        'danger-bg': {
          value: {
            base: '{palette.cfdf0f1}',
            _dark: '{palette.c402e33}',
            _forcedColors: '{systemColors.canvas}',
          },
        },
        disabled: {
          value: {
            base: '{palette.c8a8e96}',
            _dark: '{palette.c8e939e}',
            _forcedColors: '{systemColors.grayText}',
          },
        },
      },
      codeColors: {
        keyword: {
          value: {
            base: '{palette.c8b2294}',
            _dark: '{palette.ce6a0ef}',
          },
        },
        tag: {
          value: {
            base: '{palette.c8b2294}',
            _dark: '{palette.ce6a0ef}',
          },
        },
        string: {
          value: {
            base: '{palette.c246531}',
            _dark: '{palette.ca7dca8}',
          },
        },
        comment: {
          value: {
            base: '{colors.text-subtle}',
            _dark: '{colors.text-subtle}',
          },
        },
        function: {
          value: {
            base: '{palette.c795000}',
            _dark: '{palette.ceac47c}',
          },
        },
        type: {
          value: {
            base: '{palette.c795000}',
            _dark: '{palette.ceac47c}',
          },
        },
        attribute: {
          value: {
            base: '{palette.c155a9b}',
            _dark: '{palette.c9fc8f4}',
          },
        },
        property: {
          value: {
            base: '{palette.c155a9b}',
            _dark: '{palette.c9fc8f4}',
          },
        },
        number: {
          value: {
            base: '{palette.c155a9b}',
            _dark: '{palette.c9fc8f4}',
          },
        },
        literal: {
          value: {
            base: '{palette.c155a9b}',
            _dark: '{palette.c9fc8f4}',
          },
        },
        command: {
          value: {
            base: '{palette.c155a9b}',
            _dark: '{palette.c9fc8f4}',
          },
        },
        operator: {
          value: {
            base: '{colors.text}',
            _dark: '{colors.text}',
          },
        },
        punctuation: {
          value: {
            base: '{colors.text}',
            _dark: '{colors.text}',
          },
        },
      },
      shadows: {
        card: {
          value: {
            base: '{shadowValues.card-light}',
            _dark: '{shadowValues.card-dark}',
            _forcedColors: '{shadowValues.none}',
          },
        },
        dialog: {
          value: {
            base: '{shadowValues.dialog-light}',
            _dark: '{shadowValues.dialog-dark}',
            _forcedColors: '{shadowValues.none}',
          },
        },
        control: {
          value: {
            base: '{shadowValues.control-light}',
            _dark: '{shadowValues.control-dark}',
            _forcedColors: '{shadowValues.none}',
          },
        },
        primary: {
          value: {
            base: '{shadowValues.primary-light}',
            _dark: '{shadowValues.primary-dark}',
            _forcedColors: '{shadowValues.none}',
          },
        },
      },
    },
  },
});
