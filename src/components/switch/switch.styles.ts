import { sva } from '../../styling';
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
      font: 'var(--type-body) / 20px var(--font-body)',
      color: 'var(--color-text)',
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
      border: '1px solid var(--color-control-border)',
      borderRadius: '10px',
      background: 'var(--color-control)',
      cursor: 'inherit',
      '&:hover:where(:not(:disabled))': {
        background: 'var(--color-control-hover)',
        borderColor: 'var(--color-text-subtle)',
      },
      '&:checked': {
        background: 'var(--color-accent)',
        borderColor: 'var(--color-accent)',
      },
      '&:focus-visible': {
        outline: '2px solid var(--color-focus)',
        outlineOffset: '2px',
      },
      "&[aria-invalid='true']": {
        borderColor: 'var(--color-danger)',
      },
      '&:checked + $track $thumb': {
        insetInlineStart: '19px',
        background: 'var(--color-on-accent)',
      },
      '&:disabled': {
        borderColor: 'var(--color-disabled)',
        background: 'var(--color-surface-muted)',
        cursor: 'not-allowed',
      },
      '&:disabled + $track $thumb': {
        background: 'var(--color-disabled)',
      },
      '&:disabled ~ $label': {
        color: 'var(--color-disabled)',
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
      background: 'var(--color-text-subtle)',
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
export default switchClasses();
