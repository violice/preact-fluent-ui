import { css, cx } from '../../../../../.artifacts/gallery-styled-system/css';
import { useSignal } from '@preact/signals';
import {
  Disclosure,
  DisclosureSummary,
  DisclosureContent,
  InfoBar,
} from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function DisclosureExample() {
  const opened = useSignal(false);
  return (
    <div class={cx(galleryStyles.stack, css({ width: '100%' }))}>
      <InfoBar tone="error" title="Connection failed">
        <Disclosure onToggle={(event) => (opened.value = event.currentTarget.open)}>
          <DisclosureSummary>Error details</DisclosureSummary>
          <DisclosureContent>
            <pre class={galleryStyles.longText}>
              The remote endpoint refused the connection. Retry after checking the address.
            </pre>
          </DisclosureContent>
        </Disclosure>
      </InfoBar>
      <p>Details {opened.value ? 'open' : 'closed'}.</p>
      <Disclosure appearance="card">
        <DisclosureSummary>Current hosts file</DisclosureSummary>
        <DisclosureContent>
          <pre>127.0.0.1 localhost</pre>
        </DisclosureContent>
      </Disclosure>
      <Disclosure appearance="card" open>
        <DisclosureSummary>Proposed hosts file</DisclosureSummary>
        <DisclosureContent>
          <pre>127.0.0.1 localhost{'\n'}192.168.1.20 office</pre>
        </DisclosureContent>
      </Disclosure>
    </div>
  );
}
