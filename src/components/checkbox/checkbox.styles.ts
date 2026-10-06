import { sva } from '../../styling';
export const checkboxClasses = sva({
  slots: ['wrapper', 'input', 'indicator', 'label'],
  base: {
    wrapper: {
      display: 'inline-grid',
      gridTemplateColumns: '18px minmax(0, 1fr)',
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
      width: '18px',
      height: '18px',
      margin: '0',
      padding: '0',
      border: '1px solid var(--color-control-border)',
      borderRadius: 'var(--radius-sm)',
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
      '&:indeterminate': {
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
      '&:checked + $indicator': {
        borderLeft: '2px solid var(--color-on-accent)',
        borderBottom: '2px solid var(--color-on-accent)',
        transform: 'translateY(-1px) rotate(-45deg)',
      },
      '&:indeterminate + $indicator': {
        height: '2px',
        border: '0',
        background: 'var(--color-on-accent)',
        transform: 'none',
      },
      '&:disabled': {
        borderColor: 'var(--color-disabled)',
        background: 'var(--color-surface-muted)',
        cursor: 'not-allowed',
      },
      '&:disabled ~ $label': {
        color: 'var(--color-disabled)',
        cursor: 'not-allowed',
      },
      '&:disabled + $indicator': {
        borderColor: 'var(--color-disabled)',
      },
      '&:disabled:indeterminate + $indicator': {
        background: 'var(--color-disabled)',
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
        '&:indeterminate': {
          background: 'Highlight',
          borderColor: 'Highlight',
        },
        '&:checked + $indicator': {
          forcedColorAdjust: 'none',
          borderColor: 'HighlightText',
        },
        '&:indeterminate + $indicator': {
          forcedColorAdjust: 'none',
          background: 'HighlightText',
        },
        '&:disabled': {
          background: 'Field',
          borderColor: 'GrayText',
        },
        '&:disabled ~ $label': {
          color: 'GrayText',
        },
        '&:disabled + $indicator': {
          borderColor: 'GrayText',
        },
        '&:disabled:indeterminate + $indicator': {
          background: 'GrayText',
        },
        '&:focus-visible': {
          outlineColor: 'Highlight',
        },
      },
    },
    indicator: {
      gridArea: '1 / 1',
      justifySelf: 'center',
      width: '9px',
      height: '5px',
      boxSizing: 'border-box',
      pointerEvents: 'none',
    },
    label: {
      gridArea: '1 / 2',
      minWidth: '0',
      overflowWrap: 'anywhere',
    },
  },
});
export default checkboxClasses();
