import type { ThemeDefinition } from '../types.ts';
export const fluentSemanticTokens = {
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
} satisfies NonNullable<ThemeDefinition['semanticTokens']>;
