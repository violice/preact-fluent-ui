import { useSignal } from '@preact/signals';
import { Checkbox } from '../../../../../../dist/components.js';
import { css, cx } from '../../../../../../.artifacts/gallery-styled-system/css';

export const baseStyles = css({ padding: '2', backgroundColor: 'surface', color: 'text' });
export const spaciousStyles = css({ padding: '6', backgroundColor: 'accent-subtle' });
export const cxDemoStyles = css({ display: 'grid', gap: '3' });

export function CxDemo() {
  const spacious = useSignal(false);
  return (
    <div class={cxDemoStyles}>
      <Checkbox
        label="Apply spacious styles"
        checked={spacious}
        onChange={(event) => {
          spacious.value = event.currentTarget.checked;
        }}
      />
      <div class={cx(baseStyles, [spacious.value ? spaciousStyles : undefined, 'custom-panel'])}>
        Later engine classes replace equivalent earlier declarations.
      </div>
    </div>
  );
}
