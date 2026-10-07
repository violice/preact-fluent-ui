import { css, cx } from '../../../../../.artifacts/gallery-styled-system/css';
import { useComputed, useSignal } from '@preact/signals';
import {
  Button,
  Toolbar,
  ToolbarGroup,
  Input,
  Pagination,
  Select,
  StatusBadge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';
import { profiles } from './profiles';

export function TableExample() {
  const query = useSignal('');
  const filter = useSignal('all');
  const page = useSignal(1);
  const compact = useSignal(false);
  const between = useSignal(false);
  const filtered = useComputed(() =>
    profiles.filter(
      (profile) =>
        profile.name.toLowerCase().includes(query.value.toLowerCase()) &&
        (filter.value === 'all' || profile.enabled === (filter.value === 'enabled')),
    ),
  );
  const pageCount = useComputed(() => Math.ceil(filtered.value.length / 2));
  const currentPage = useComputed(() =>
    pageCount.value === 0 ? 0 : Math.min(page.value, pageCount.value),
  );
  return (
    <div class={cx(galleryStyles.sections, css({ width: '100%' }))}>
      <Toolbar>
        <ToolbarGroup>
          <Input
            type="search"
            aria-label="Search profiles"
            placeholder="Search profiles"
            value={query.value}
            onInput={(event) => {
              query.value = event.currentTarget.value;
              page.value = 1;
            }}
          />
          <Select
            aria-label="Profile status"
            value={filter.value}
            onChange={(event) => {
              filter.value = event.currentTarget.value;
              page.value = 1;
            }}
          >
            <option value="all">All profiles</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </Select>
        </ToolbarGroup>
        <ToolbarGroup align="end">
          <Button aria-pressed={compact.value} onClick={() => (compact.value = !compact.value)}>
            Compact rows
          </Button>
          <Button aria-pressed={between.value} onClick={() => (between.value = !between.value)}>
            Between row dividers
          </Button>
        </ToolbarGroup>
      </Toolbar>
      <TableContainer tabIndex={0} role="region" aria-label="Scrollable connection profiles">
        <Table
          density={compact.value ? 'compact' : 'regular'}
          dividers={between.value ? 'between' : 'all'}
          class={css({ minWidth: '480px' })}
        >
          <TableCaption>Connection profiles</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Profile</TableHeaderCell>
              <TableHeaderCell>Address</TableHeaderCell>
              <TableHeaderCell align="end">Status</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.value
              .slice(Math.max(0, currentPage.value - 1) * 2, currentPage.value * 2)
              .map((profile) => (
                <TableRow key={profile.name}>
                  <TableHeaderCell scope="row">{profile.name}</TableHeaderCell>
                  <TableCell>
                    <code>{profile.address}</code>
                  </TableCell>
                  <TableCell align="end">
                    <StatusBadge tone={profile.enabled ? 'success' : 'neutral'}>
                      {profile.enabled ? 'Enabled' : 'Disabled'}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            {!filtered.value.length && (
              <TableRow>
                <TableCell colSpan={3}>No matching profiles.</TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>{filtered.value.length} matching profiles</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Toolbar>
        <ToolbarGroup>
          <span>
            {filtered.value.length} of {profiles.length} profiles
          </span>
        </ToolbarGroup>
        <ToolbarGroup align="end">
          <Pagination
            aria-label="Profile pages"
            page={page.value}
            pageCount={pageCount.value}
            onPageChange={(nextPage) => {
              page.value = nextPage;
            }}
            previousLabel="Previous"
            nextLabel="Next"
          />
        </ToolbarGroup>
      </Toolbar>
    </div>
  );
}
