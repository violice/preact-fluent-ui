import { mergeProps } from '../../../../../dist/utils.js';
import type { JSX } from 'preact';
import { useSignal } from '@preact/signals';
import { Checkbox } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function PropsDemo() {
  const cancel = useSignal(false);
  const result = useSignal('Click the composed button.');
  const props = mergeProps<JSX.IntrinsicElements['button']>(
    {
      onClick: () => {
        result.value += ' → internal';
      },
      style: { padding: '8px' },
    },
    {
      onClick: (event) => {
        result.value = 'consumer';
        if (cancel.value) {
          event.preventDefault();
          result.value += ' (cancelled)';
        }
      },
      style: { borderRadius: '8px' },
    },
  );
  return (
    <div class={galleryStyles.stack}>
      <Checkbox
        label="Cancel the internal handler"
        checked={cancel}
        onChange={(e) => {
          cancel.value = e.currentTarget.checked;
        }}
      />
      <button {...props}>Run composed handlers</button>
      <output>{result}</output>
    </div>
  );
}
