import { useSignal } from '@preact/signals';
import { Field, Input } from '../../../../../../dist/components.js';
import { css } from '../../../../../../.artifacts/gallery-styled-system/css';

export const dynamicDemoStyles = css({ display: 'grid', gap: '3' });

export function DynamicDemo() {
  const width = useSignal(220);
  return (
    <div class={dynamicDemoStyles}>
      <Field label="Width in pixels">
        {(control) => (
          <Input
            {...control}
            type="number"
            min="80"
            max="360"
            value={width}
            onInput={(event) => {
              width.value = Number(event.currentTarget.value);
            }}
          />
        )}
      </Field>
      <div
        aria-label="Dynamic width preview"
        {...css.dynamic({
          width,
          maxWidth: '100%',
          padding: '3',
          backgroundColor: 'primary',
          color: 'on-primary',
          borderRadius: 8,
        })}
      >
        Width: {width} px
      </div>
    </div>
  );
}
