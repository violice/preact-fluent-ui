import { sva } from '../../styles';
export const selectClasses = sva({
  slots: ['control', 'select', 'chevron'],
  base: {
    control: {
      boxSizing: 'border-box',
      position: 'relative',
      display: 'flex',
      minWidth: '0',
      color: 'var(--pfui-colors-text-muted)',
      '&:focus-within $chevron': {
        color: 'var(--pfui-colors-accent)',
      },
      '&:has(select:disabled) $chevron': {
        color: 'var(--pfui-colors-disabled)',
      },
      '& option': {
        color: 'var(--pfui-colors-text)',
        background: 'var(--pfui-colors-surface-raised)',
      },
      '&:has(> $select[hidden])': {
        display: 'none',
      },
    },
    select: {
      boxSizing: 'border-box',
      fontFamily: 'var(--pfui-fonts-body)',
      fontSynthesis: 'none',
      appearance: 'none',
      width: '100%',
      minWidth: '0',
      minHeight: '38px',
      padding: '8px 36px 8px 12px',
      fontSize: 'var(--pfui-fontSizes-body)',
      fontWeight: '400',
      lineHeight: '20px',
      color: 'var(--pfui-colors-text)',
      background: 'var(--pfui-colors-control)',
      border: '1px solid var(--pfui-colors-control-border)',
      borderBottomColor: 'var(--pfui-colors-control-bottom)',
      borderRadius: 'var(--pfui-radii-sm)',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
      boxShadow: 'var(--pfui-shadows-control)',
      transition:
        'background-color 120ms ease,\n    border-color 120ms ease,\n    box-shadow 120ms ease',
      '&:hover:not(:disabled)': {
        background: 'var(--pfui-colors-control-hover)',
        borderBottomColor: 'var(--pfui-colors-text-subtle)',
      },
      '&:focus-visible': {
        borderBottomColor: 'var(--pfui-colors-accent)',
        boxShadow: 'inset 0 -1px 0 var(--pfui-colors-accent)',
        background: 'var(--pfui-colors-control-pressed)',
        outline: '2px solid var(--pfui-colors-focus)',
        outlineOffset: '2px',
      },
      '&:disabled': {
        color: 'var(--pfui-colors-disabled)',
        background: 'var(--pfui-colors-surface-muted)',
        borderBottomColor: 'var(--pfui-colors-control-border)',
        cursor: 'not-allowed',
      },
      '@media (forced-colors: active)': {
        appearance: 'auto',
        paddingRight: '8px',
        '&:disabled': {
          color: 'GrayText',
          background: 'Field',
          borderColor: 'GrayText',
        },
      },
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
    chevron: {
      position: 'absolute',
      top: '50%',
      right: '12px',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      '@media (forced-colors: active)': {
        display: 'none',
      },
    },
  },
});
export const selectStyles = selectClasses();
