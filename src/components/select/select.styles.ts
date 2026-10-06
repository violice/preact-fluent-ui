import { sva } from '../../styling';
export const selectClasses = sva({
  slots: ['control', 'select', 'chevron'],
  base: {
    control: {
      boxSizing: 'border-box',
      position: 'relative',
      display: 'flex',
      minWidth: '0',
      color: 'var(--color-text-muted)',
      '&:focus-within $chevron': {
        color: 'var(--color-accent)',
      },
      '&:has(select:disabled) $chevron': {
        color: 'var(--color-disabled)',
      },
      '& option': {
        color: 'var(--color-text)',
        background: 'var(--color-surface-raised)',
      },
      '&:has(> $select[hidden])': {
        display: 'none',
      },
    },
    select: {
      boxSizing: 'border-box',
      fontFamily: 'var(--font-body)',
      fontSynthesis: 'none',
      appearance: 'none',
      width: '100%',
      minWidth: '0',
      minHeight: '38px',
      padding: '8px 36px 8px 12px',
      fontSize: 'var(--type-body)',
      fontWeight: '400',
      lineHeight: '20px',
      color: 'var(--color-text)',
      background: 'var(--color-control)',
      border: '1px solid var(--color-control-border)',
      borderBottomColor: 'var(--color-control-bottom)',
      borderRadius: 'var(--radius-sm)',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-control)',
      transition:
        'background-color 120ms ease,\n    border-color 120ms ease,\n    box-shadow 120ms ease',
      '&:hover:not(:disabled)': {
        background: 'var(--color-control-hover)',
        borderBottomColor: 'var(--color-text-subtle)',
      },
      '&:focus-visible': {
        borderBottomColor: 'var(--color-accent)',
        boxShadow: 'inset 0 -1px 0 var(--color-accent)',
        background: 'var(--color-control-pressed)',
        outline: '2px solid var(--color-focus)',
        outlineOffset: '2px',
      },
      '&:disabled': {
        color: 'var(--color-disabled)',
        background: 'var(--color-surface-muted)',
        borderBottomColor: 'var(--color-control-border)',
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
export default selectClasses();
