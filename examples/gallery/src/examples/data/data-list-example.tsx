import { css, cx } from '../../../../../.artifacts/gallery-styled-system/css';
import { useSignal } from '@preact/signals';
import {
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
  Toolbar,
  ToolbarGroup,
  Select,
  StatusBadge,
} from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function DataListExample() {
  const direction = useSignal<'horizontal' | 'vertical'>('horizontal');
  return (
    <div class={cx(galleryStyles.sections, css({ width: '100%' }))}>
      <Toolbar>
        <ToolbarGroup>
          <label class={galleryStyles.label}>
            Direction
            <Select
              value={direction.value}
              onChange={(event) =>
                (direction.value = event.currentTarget.value as 'horizontal' | 'vertical')
              }
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </Select>
          </label>
        </ToolbarGroup>
      </Toolbar>
      <DataList direction={direction.value} aria-label="Connection details">
        <DataListItem>
          <DataListLabel>Profile</DataListLabel>
          <DataListValue>Office connection</DataListValue>
        </DataListItem>
        <DataListItem>
          <DataListLabel>Connection status</DataListLabel>
          <DataListValue>
            <StatusBadge tone="success">Connected</StatusBadge>
          </DataListValue>
        </DataListItem>
        <DataListItem>
          <DataListLabel>Identifier</DataListLabel>
          <DataListValue>
            <code>adapter-2001db81234567890abcdef1234567890abcdef1234567890</code>
          </DataListValue>
        </DataListItem>
        <DataListItem>
          <DataListLabel>Documentation</DataListLabel>
          <DataListValue>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl">
              Definition list semantics
            </a>
          </DataListValue>
        </DataListItem>
      </DataList>
    </div>
  );
}
