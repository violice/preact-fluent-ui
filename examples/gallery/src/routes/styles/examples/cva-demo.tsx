import { useSignal } from '@preact/signals';
import { Field, Select, Checkbox } from '../../../../../../dist/components.js';
import { css, cva } from '../../../../../../.artifacts/gallery-styled-system/css';
import type {
  RecipeVariantProps,
  RecipeVariant,
} from '../../../../../../.artifacts/gallery-styled-system/css';

export const actionStyles = cva({
  base: { backgroundColor: 'primary', color: 'on-primary', border: '0' },
  variants: {
    size: { small: { padding: '8px 12px' }, large: { padding: '16px 24px' } },
    rounded: { true: { borderRadius: 16 }, false: { borderRadius: 0 } },
  },
  defaultVariants: { size: 'small', rounded: false },
  compoundVariants: [{ size: ['small', 'large'], rounded: true, css: { fontWeight: '700' } }],
});
export const cvaDemoStyles = css({ display: 'grid', justifyItems: 'start', gap: '3' });
type ActionVariants = RecipeVariantProps<typeof actionStyles>;
type RequiredActionVariants = RecipeVariant<typeof actionStyles>;
const initialVariants: RequiredActionVariants = { size: 'small', rounded: false };

export function CvaDemo() {
  const size = useSignal<'default' | 'none' | 'small' | 'large'>('default');
  const rounded = useSignal(initialVariants.rounded);
  const selection = (): ActionVariants => ({
    size: size.value === 'default' ? undefined : size.value === 'none' ? null : size.value,
    rounded: rounded.value,
  });
  return (
    <div class={cvaDemoStyles}>
      <Field label="Recipe size">
        {(control) => (
          <Select
            {...control}
            value={size}
            onChange={(event) => {
              size.value = event.currentTarget.value as typeof size.value;
            }}
          >
            <option value="default">Default (undefined)</option>
            <option value="none">No size variant (null)</option>
            <option value="small">Small</option>
            <option value="large">Large</option>
          </Select>
        )}
      </Field>
      <Checkbox
        label="Rounded recipe"
        checked={rounded}
        onChange={(event) => {
          rounded.value = event.currentTarget.checked;
        }}
      />
      <button type="button" class={actionStyles(selection())}>
        Recipe action
      </button>
    </div>
  );
}
