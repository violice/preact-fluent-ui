import { useSignal } from '@preact/signals';
import { Checkbox } from '../../../../../../dist/components.js';
import { css } from '../../../../../../.artifacts/gallery-styled-system/css';

export const sampleStyles = css({
  display: 'grid',
  gap: '2',
  padding: '4',
  backgroundColor: 'surface',
  borderRadius: 8,
  '& > button': {
    padding: '8px 16px',
    backgroundColor: 'primary',
    color: 'on-primary',
    border: '0',
    borderRadius: 4,
    _hover: { backgroundColor: 'primary-hover' },
    _focusVisible: { outline: '2px solid {colors.focus}', outlineOffset: 2 },
    _active: { backgroundColor: 'primary-pressed' },
    _disabled: { opacity: 0.5 },
  },
  '@media (max-width: 640px)': { padding: '2' },
});

export function CssDemo() {
  const disabled = useSignal(false);
  return (
    <div class={sampleStyles}>
      <Checkbox
        label="Disable styled button"
        checked={disabled}
        onChange={(event) => {
          disabled.value = event.currentTarget.checked;
        }}
      />
      <button type="button" disabled={disabled}>
        Hover or focus me
      </button>
      <p>Static token values, nested selectors and interaction conditions.</p>
    </div>
  );
}
