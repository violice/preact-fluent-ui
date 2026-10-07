import { css } from '../../../../../../../.artifacts/gallery-styled-system/css';
import { TextPreview } from '../../../../../../../dist/components.js';
import { galleryStyles } from '../../../../styles/gallery.styles.ts';

export function DocTextPreviewExample() {
  return (
    <div class={galleryStyles.form}>
      <TextPreview
        text={
          'Connection: office\nAddress: 192.168.10.24\nGateway: 192.168.10.1\nAttempt 1: DNS lookup completed\nAttempt 2: request timed out after 30000ms while resolving the configured gateway and retrying the connection.\nAttempt 3: gateway unreachable\nRoute: 192.168.10.0/24\nInterface: ethernet\nResult: reconnect required'
        }
        aria-label="Connection diagnostics"
        class={css({ maxHeight: '100px' })}
      />
      <TextPreview
        text={
          '[network]\ngateway = 192.168.10.1\nroute = 192.168.10.0/24 via 192.168.10.1 dev ethernet'
        }
        wrap={false}
        aria-label="Network configuration"
        class={css({ maxHeight: '120px' })}
      />
    </div>
  );
}
