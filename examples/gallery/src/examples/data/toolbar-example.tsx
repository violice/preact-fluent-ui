import { css, cx } from '../../../../../.artifacts/gallery-styled-system/css';
import { useSignal } from '@preact/signals';
import {
  Button,
  Toolbar,
  ToolbarGroup,
  Input,
  Pagination,
  Select,
  Separator,
} from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function ToolbarExample() {
  const page = useSignal(1);
  return (
    <div class={cx(galleryStyles.sections, css({ width: '100%' }))}>
      <Toolbar>
        <ToolbarGroup>
          <Input type="search" aria-label="Search records" placeholder="Search records" />
          <Select aria-label="Status">
            <option>All records</option>
            <option>Enabled</option>
          </Select>
        </ToolbarGroup>
        <ToolbarGroup align="end">
          <Button variant="primary">Add record</Button>
        </ToolbarGroup>
      </Toolbar>
      <Separator />
      <Toolbar>
        <ToolbarGroup>
          <span>24 records</span>
        </ToolbarGroup>
        <ToolbarGroup align="end">
          <Pagination
            aria-label="Record pages"
            page={page.value}
            pageCount={3}
            onPageChange={(nextPage) => {
              page.value = nextPage;
            }}
            previousLabel="Previous"
            nextLabel="Next"
          />
        </ToolbarGroup>
      </Toolbar>
      <div>
        <Toolbar>
          <ToolbarGroup>
            <span>Reading order</span>
          </ToolbarGroup>
          <ToolbarGroup align="end">
            <Button>Action</Button>
          </ToolbarGroup>
        </Toolbar>
      </div>
    </div>
  );
}
