import { cx } from '../../../../../.artifacts/gallery-styled-system/css';
import { resolveClass } from '../../../../../dist/utils.js';
import { useSignal } from '@preact/signals';
import { Button, Checkbox } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function ClassesDemo({ resolve = false }: { resolve?: boolean }) {
  const enabled = useSignal(false);
  const classValue = useSignal<string | undefined>(undefined);
  const selected = resolve
    ? resolveClass(classValue, galleryStyles.signalAccent)
    : cx('local-base', classValue);
  return (
    <div class={galleryStyles.stack}>
      <Checkbox
        label={resolve ? 'Use an empty primary class' : 'Add the signal class'}
        checked={enabled}
        onChange={(e) => {
          enabled.value = e.currentTarget.checked;
          classValue.value = enabled.value
            ? resolve
              ? ''
              : galleryStyles.signalAccent
            : undefined;
        }}
      />
      <Button class={selected}>Class demonstration</Button>
      <output>{selected === '' ? '(empty class)' : (selected ?? '(undefined)')}</output>
    </div>
  );
}
