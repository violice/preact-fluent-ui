import { sva } from '../../styles';
export const switchClasses = sva({
  slots: ['wrapper', 'input', 'track', 'thumb', 'label'],
  base: {
    wrapper: {
      display: 'inline-grid',
      gridTemplateColumns: '36px minmax(0, 1fr)',
      alignItems: 'center',
      columnGap: '8px',
      minWidth: '0',
      minHeight: '32px',
      font: 'var(--pfui-fontSizes-body) / 20px var(--pfui-fonts-body)',
      color: 'var(--pfui-colors-text)',
      cursor: 'pointer',
      '&[hidden]': {
        display: 'none',
      },
    },
    input: {
      appearance: 'none',
      boxSizing: 'border-box',
      gridArea: '1 / 1',
      width: '36px',
      height: '20px',
      margin: '0',
      padding: '0',
      border: '1px solid var(--pfui-colors-control-border)',
      borderRadius: '10px',
      background: 'var(--pfui-colors-control)',
      cursor: 'inherit',
      '&:hover:where(:not(:disabled))': {
        background: 'var(--pfui-colors-control-hover)',
        borderColor: 'var(--pfui-colors-text-subtle)',
      },
      '&:checked': {
        background: 'var(--pfui-colors-accent)',
        borderColor: 'var(--pfui-colors-accent)',
      },
      '&:focus-visible': {
        outline: '2px solid var(--pfui-colors-focus)',
        outlineOffset: '2px',
      },
      "&[aria-invalid='true']": {
        borderColor: 'var(--pfui-colors-danger)',
      },
      '&:checked + $track $thumb': {
        insetInlineStart: '19px',
        background: 'var(--pfui-colors-on-accent)',
      },
      '&:disabled': {
        borderColor: 'var(--pfui-colors-disabled)',
        background: 'var(--pfui-colors-surface-muted)',
        cursor: 'not-allowed',
      },
      '&:disabled + $track $thumb': {
        background: 'var(--pfui-colors-disabled)',
      },
      '&:disabled ~ $label': {
        color: 'var(--pfui-colors-disabled)',
        cursor: 'not-allowed',
      },
      '&[hidden]': {
        display: 'none',
      },
      '@media (forced-colors: active)': {
        forcedColorAdjust: 'none',
        background: 'Field',
        borderColor: 'FieldText',
        '&:hover:where(:not(:disabled))': {
          forcedColorAdjust: 'none',
          background: 'Field',
          borderColor: 'FieldText',
        },
        "&[aria-invalid='true']": {
          forcedColorAdjust: 'none',
          background: 'Field',
          borderColor: 'FieldText',
          borderStyle: 'dashed',
        },
        '&:checked': {
          background: 'Highlight',
          borderColor: 'Highlight',
        },
        '&:checked + $track $thumb': {
          background: 'HighlightText',
        },
        '&:disabled': {
          background: 'Field',
          borderColor: 'GrayText',
        },
        '&:disabled + $track $thumb': {
          background: 'GrayText',
        },
        '&:disabled ~ $label': {
          color: 'GrayText',
        },
        '&:focus-visible': {
          outlineColor: 'Highlight',
        },
      },
    },
    track: {
      position: 'relative',
      gridArea: '1 / 1',
      width: '36px',
      height: '20px',
      pointerEvents: 'none',
    },
    thumb: {
      position: 'absolute',
      insetBlockStart: '3px',
      insetInlineStart: '3px',
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      background: 'var(--pfui-colors-text-subtle)',
      transition: 'inset-inline-start 120ms ease',
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
      '@media (forced-colors: active)': {
        forcedColorAdjust: 'none',
        background: 'FieldText',
      },
    },
    label: {
      gridArea: '1 / 2',
      minWidth: '0',
      overflowWrap: 'anywhere',
    },
  },
});
export const switchStyles = switchClasses();
