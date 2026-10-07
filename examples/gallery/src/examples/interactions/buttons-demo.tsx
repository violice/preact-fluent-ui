import { useSignal } from '@preact/signals';
import { Button, Icon, InfoBar } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';
import { variants } from './dialog-scenarios';

export function ButtonsDemo() {
  const message = useSignal('Choose a button.');
  return (
    <>
      {' '}
      <div data-gallery-preview class={galleryStyles.preview}>
        <div class={galleryStyles.stack}>
          {variants.map((variant) => (
            <div class={galleryStyles.row} key={variant}>
              <Button
                variant={variant}
                onClick={() => (message.value = `${variant} button selected.`)}
              >
                {variant}
              </Button>
              <Button variant={variant} size="compact">
                Compact {variant}
              </Button>
              <Button variant={variant} size="icon" aria-label={`Refresh ${variant}`}>
                <Icon name="refresh" size={16} />
              </Button>
              <Button variant={variant} disabled>
                Disabled {variant}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <InfoBar title="Sample result">{message.value}</InfoBar>
    </>
  );
}
