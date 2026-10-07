import { sva } from '../../styles';
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
      width: '18px',
      height: '18px',
      margin: '0',
      padding: '0',
      border: '1px solid var(--pfui-colors-control-border)',
      borderRadius: 'var(--pfui-radii-sm)',
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
      '&:indeterminate': {
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
      '&:checked + $indicator': {
        borderLeft: '2px solid var(--pfui-colors-on-accent)',
        borderBottom: '2px solid var(--pfui-colors-on-accent)',
        transform: 'translateY(-1px) rotate(-45deg)',
      },
      '&:indeterminate + $indicator': {
        height: '2px',
        border: '0',
        background: 'var(--pfui-colors-on-accent)',
        transform: 'none',
      },
      '&:disabled': {
        borderColor: 'var(--pfui-colors-disabled)',
        background: 'var(--pfui-colors-surface-muted)',
        cursor: 'not-allowed',
      },
      '&:disabled ~ $label': {
        color: 'var(--pfui-colors-disabled)',
        cursor: 'not-allowed',
      },
      '&:disabled + $indicator': {
        borderColor: 'var(--pfui-colors-disabled)',
      },
      '&:disabled:indeterminate + $indicator': {
        background: 'var(--pfui-colors-disabled)',
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
export const checkboxStyles = checkboxClasses();
