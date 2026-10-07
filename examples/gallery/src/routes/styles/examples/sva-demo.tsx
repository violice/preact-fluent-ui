import { useSignal } from '@preact/signals';
import { Checkbox } from '../../../../../../dist/components.js';
import { css, sva } from '../../../../../../.artifacts/gallery-styled-system/css';

export const cardStyles = sva({
  slots: ['root', 'label', 'content'],
  base: {
    root: {
      padding: '4',
      border: '1px solid {colors.border}',
      borderRadius: 8,
      '&:hover $label': { textDecoration: 'underline' },
    },
    label: { fontWeight: '600' },
    content: { color: 'text-muted' },
  },
  variants: {
    compact: {
      true: { root: { padding: '2' } },
      false: { root: { padding: '4' } },
    },
    highlighted: {
      true: { root: { backgroundColor: 'accent-subtle' } },
    },
  },
  compoundVariants: [{ compact: true, highlighted: true, css: { label: { color: 'primary' } } }],
});
export const svaDemoStyles = css({ display: 'grid', gap: '3' });

export function SvaDemo() {
  const compact = useSignal(false);
  const highlighted = useSignal(false);
  const classes = cardStyles({ compact: compact.value, highlighted: highlighted.value });
  return (
    <div class={svaDemoStyles}>
      <Checkbox
        label="Compact slots"
        checked={compact}
        onChange={(event) => {
          compact.value = event.currentTarget.checked;
        }}
      />
      <Checkbox
        label="Highlight slots"
        checked={highlighted}
        onChange={(event) => {
          highlighted.value = event.currentTarget.checked;
        }}
      />
      <div class={classes.root}>
        <p class={classes.label}>Slot recipe</p>
        <p class={classes.content}>Enable both options to apply the compound label color.</p>
      </div>
    </div>
  );
}
