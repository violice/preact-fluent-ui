import { useSignal } from '@preact/signals';
import { Button, LoadingState, Icon } from '../../../../../dist/components.js';
import { ButtonsDemo } from '../interactions';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function BusyButtonsExample() {
  const busy = useSignal(false);
  const complete = useSignal(false);
  return (
    <div class={galleryStyles.stack}>
      <ButtonsDemo />
      <div class={galleryStyles.row}>
        <Button
          loading={busy.value}
          loadingLabel="Refreshing profiles"
          onClick={() => {
            busy.value = true;
            complete.value = false;
          }}
        >
          Refresh profiles
        </Button>
        {busy.value && (
          <Button
            onClick={() => {
              busy.value = false;
              complete.value = true;
            }}
          >
            Complete refresh
          </Button>
        )}
      </div>
      {busy.value && <LoadingState appearance="inline" label="Reading profiles" />}
      {complete.value && <p role="status">Profiles refreshed.</p>}
      <div class={galleryStyles.row}>
        {(['default', 'primary', 'subtle', 'danger'] as const).map((variant) => (
          <Button key={variant} variant={variant} loading>
            {variant} action
          </Button>
        ))}
        <Button size="compact" loading loadingLabel="Applying">
          Apply configuration
        </Button>
        <Button size="icon" loading aria-label="Refresh connection">
          <Icon name="refresh" size={16} />
        </Button>
        <Button disabled loading>
          Unavailable action
        </Button>
      </div>
    </div>
  );
}
