import { useState } from 'preact/hooks';
import {
  Button,
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
  DataToolbar,
  DataToolbarGroup,
  Input,
  Pagination,
  Select,
  Separator,
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
} from '../../../dist/index.js';
import type { ComponentDoc } from './gallery-pages';
import styles from './gallery.module.css';

const profiles = [
  { name: 'Office', address: '10.10.0.0/16', enabled: true },
  { name: 'Home', address: '192.168.10.0/24', enabled: false },
  { name: 'Travel', address: '2001:db8:1234:5678:90ab:cdef:1234:5678', enabled: true },
  { name: 'Lab', address: '10.20.0.0/16', enabled: false },
];

function TableExample() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [compact, setCompact] = useState(false);
  const filtered = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(query.toLowerCase()) &&
      (filter === 'all' || profile.enabled === (filter === 'enabled')),
  );
  const pageCount = Math.ceil(filtered.length / 2);
  const currentPage = pageCount === 0 ? 0 : Math.min(page, pageCount);
  return (
    <div class={styles.sections} style={{ width: '100%' }}>
      <DataToolbar>
        <DataToolbarGroup>
          <Input
            type="search"
            aria-label="Search profiles"
            placeholder="Search profiles"
            value={query}
            onInput={(event) => {
              setQuery(event.currentTarget.value);
              setPage(1);
            }}
          />
          <Select
            aria-label="Profile status"
            value={filter}
            onChange={(event) => {
              setFilter(event.currentTarget.value);
              setPage(1);
            }}
          >
            <option value="all">All profiles</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </Select>
        </DataToolbarGroup>
        <DataToolbarGroup align="end">
          <Button aria-pressed={compact} onClick={() => setCompact(!compact)}>
            Compact rows
          </Button>
        </DataToolbarGroup>
      </DataToolbar>
      <TableContainer tabIndex={0} role="region" aria-label="Scrollable connection profiles">
        <Table density={compact ? 'compact' : 'regular'} style={{ minWidth: '480px' }}>
          <TableCaption>Connection profiles</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Profile</TableHeaderCell>
              <TableHeaderCell>Address</TableHeaderCell>
              <TableHeaderCell align="end">Status</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(Math.max(0, currentPage - 1) * 2, currentPage * 2).map((profile) => (
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
            {!filtered.length && (
              <TableRow>
                <TableCell colSpan={3}>No matching profiles.</TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>{filtered.length} matching profiles</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <DataToolbar>
        <DataToolbarGroup>
          <span>
            {filtered.length} of {profiles.length} profiles
          </span>
        </DataToolbarGroup>
        <DataToolbarGroup align="end">
          <Pagination
            aria-label="Profile pages"
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
            previousLabel="Previous"
            nextLabel="Next"
          />
        </DataToolbarGroup>
      </DataToolbar>
    </div>
  );
}

function PaginationExample() {
  const [page, setPage] = useState(2);
  return (
    <div class={styles.sections} style={{ width: '100%' }}>
      <Pagination
        aria-label="Example pages"
        page={page}
        pageCount={4}
        onPageChange={setPage}
        previousLabel="Previous"
        nextLabel="Next"
      />
      <Pagination
        aria-label="Localized pages"
        page={page}
        pageCount={4}
        onPageChange={setPage}
        previousLabel="Назад"
        nextLabel="Далее"
        formatPageLabel={(current, total) => `Страница ${current} из ${total}`}
      />
      <Pagination
        aria-label="Empty pages"
        page={1}
        pageCount={0}
        onPageChange={setPage}
        previousLabel="Previous"
        nextLabel="Next"
      />
      <Pagination
        aria-label="Disabled pages"
        page={2}
        pageCount={4}
        onPageChange={setPage}
        previousLabel="Previous"
        nextLabel="Next"
        disabled
      />
    </div>
  );
}

function DataToolbarExample() {
  const [page, setPage] = useState(1);
  return (
    <div class={styles.sections} style={{ width: '100%' }}>
      <DataToolbar>
        <DataToolbarGroup>
          <Input type="search" aria-label="Search records" placeholder="Search records" />
          <Select aria-label="Status">
            <option>All records</option>
            <option>Enabled</option>
          </Select>
        </DataToolbarGroup>
        <DataToolbarGroup align="end">
          <Button variant="primary">Add record</Button>
        </DataToolbarGroup>
      </DataToolbar>
      <Separator />
      <DataToolbar>
        <DataToolbarGroup>
          <span>24 records</span>
        </DataToolbarGroup>
        <DataToolbarGroup align="end">
          <Pagination
            aria-label="Record pages"
            page={page}
            pageCount={3}
            onPageChange={setPage}
            previousLabel="Previous"
            nextLabel="Next"
          />
        </DataToolbarGroup>
      </DataToolbar>
      <div dir="rtl">
        <DataToolbar>
          <DataToolbarGroup>
            <span>RTL reading order</span>
          </DataToolbarGroup>
          <DataToolbarGroup align="end">
            <Button>Action</Button>
          </DataToolbarGroup>
        </DataToolbar>
      </div>
    </div>
  );
}

function DataListExample() {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [rtl, setRtl] = useState(false);
  return (
    <div class={styles.sections} style={{ width: '100%' }}>
      <DataToolbar>
        <DataToolbarGroup>
          <label class={styles.label}>
            Direction
            <Select
              value={direction}
              onChange={(event) => setDirection(event.currentTarget.value as typeof direction)}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </Select>
          </label>
          <Button aria-pressed={rtl} onClick={() => setRtl(!rtl)}>
            RTL text direction
          </Button>
        </DataToolbarGroup>
      </DataToolbar>
      <DataList direction={direction} dir={rtl ? 'rtl' : 'ltr'} aria-label="Connection details">
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

function SeparatorExample() {
  return (
    <div class={styles.sections} style={{ width: '100%' }}>
      <span>Decorative horizontal separator</span>
      <Separator />
      <span>Semantic section boundary</span>
      <Separator decorative={false} aria-label="Section boundary" />
      <DataToolbar>
        <DataToolbarGroup>
          <Button>First action</Button>
          <Separator orientation="vertical" />
          <Button>Second action</Button>
        </DataToolbarGroup>
      </DataToolbar>
      <div dir="rtl">
        <DataToolbar>
          <DataToolbarGroup>
            <span>RTL section</span>
            <Separator
              orientation="vertical"
              decorative={false}
              aria-label="Vertical boundary"
              style={{ height: '32px' }}
            />
            <span>Next section</span>
          </DataToolbarGroup>
        </DataToolbar>
      </div>
    </div>
  );
}

const tableCode = `import { Table, TableContainer, TableCaption, TableHeader, TableBody,
  TableRow, TableHeaderCell, TableCell } from '@violice/preact-fluent-ui';

<TableContainer role="region" aria-label="Scrollable profiles" tabIndex={0}>
  <Table density="regular" style={{ minWidth: '480px' }}>
    <TableCaption>Connection profiles</TableCaption>
    <TableHeader><TableRow>
      <TableHeaderCell>Profile</TableHeaderCell>
      <TableHeaderCell align="end">Address</TableHeaderCell>
    </TableRow></TableHeader>
    <TableBody><TableRow>
      <TableHeaderCell scope="row">Office</TableHeaderCell>
      <TableCell align="end">10.10.0.0/16</TableCell>
    </TableRow></TableBody>
  </Table>
</TableContainer>`;
const paginationCode = `const [page, setPage] = useState(1);
<Pagination page={page} pageCount={4} onPageChange={setPage}
  aria-label="Profile pages" previousLabel="Previous" nextLabel="Next" />`;
const toolbarCode = `<DataToolbar>
  <DataToolbarGroup>
    <Input type="search" aria-label="Search profiles" />
    <Select aria-label="Status"><option>All profiles</option></Select>
  </DataToolbarGroup>
  <DataToolbarGroup align="end"><Button>Add profile</Button></DataToolbarGroup>
</DataToolbar>
{/* Below the data view, reuse the same layout. */}
<DataToolbar>
  <DataToolbarGroup>24 profiles</DataToolbarGroup>
  <DataToolbarGroup align="end">
    <Pagination page={page} pageCount={4} onPageChange={setPage}
      aria-label="Profile pages" previousLabel="Previous" nextLabel="Next" />
  </DataToolbarGroup>
</DataToolbar>`;
const listCode = `<DataList direction="horizontal">
  <DataListItem>
    <DataListLabel>Profile</DataListLabel>
    <DataListValue>Office connection</DataListValue>
  </DataListItem>
</DataList>`;
const separatorCode = `<Separator />
<Separator decorative={false} aria-label="Section boundary" />
<DataToolbarGroup>
  <Button>First action</Button>
  <Separator orientation="vertical" />
  <Button>Second action</Button>
</DataToolbarGroup>`;

const tableParts = [
  [
    'Table',
    'table',
    'Native table without an implicit wrapper.',
    [['density', 'regular | compact', 'Cell spacing; regular by default.']],
  ],
  [
    'TableContainer',
    'table-container',
    'Optional div with horizontal overflow and no automatic tab stop.',
    [],
  ],
  ['TableHeader', 'table-header', 'Native thead containing column header rows.', []],
  ['TableBody', 'table-body', 'Native tbody containing data rows.', []],
  [
    'TableFooter',
    'table-footer',
    'Native tfoot for summary rows, separate from external pagination.',
    [],
  ],
  ['TableRow', 'table-row', 'Native tr containing header or data cells.', []],
  [
    'TableHeaderCell',
    'table-header-cell',
    'Native th with explicit header associations.',
    [
      ['scope', 'native th scope', 'Defaults to col; use row for row headers.'],
      ['align', 'start | center | end', 'Logical text alignment; start by default.'],
    ],
  ],
  [
    'TableCell',
    'table-cell',
    'Native td supporting headers, colSpan and rowSpan.',
    [['align', 'start | center | end', 'Logical text alignment; start by default.']],
  ],
  ['TableCaption', 'table-caption', 'Visible native caption naming the table.', []],
] as const;
const listParts = [
  [
    'DataList',
    'data-list',
    'Native dl for labelled values.',
    [
      [
        'direction',
        'horizontal | vertical',
        'Label/value layout; horizontal by default, stacking below 600px. HTML dir controls text direction.',
      ],
    ],
  ],
  ['DataListItem', 'data-list-item', 'Native div grouping a label/value pair.', []],
  ['DataListLabel', 'data-list-label', 'Native dt for the term or property name.', []],
  ['DataListValue', 'data-list-value', 'Native dd supporting rich values and wrapped text.', []],
] as const;

export const dataDocs: ComponentDoc[] = [
  ...tableParts.map(
    ([title, slug, purpose, props]) =>
      ({
        title,
        slug,
        purpose,
        props: props.map((row) => [...row]),
        example: TableExample,
        code: tableCode,
        accessibility:
          'Use a caption or aria-labelledby to name the table. Preserve native row/column header associations. Add a labelled focusable scroll region when needed.',
      }) satisfies ComponentDoc,
  ),
  {
    title: 'Pagination',
    slug: 'pagination',
    purpose: 'Navigate controlled one-based pages with localized native buttons.',
    example: PaginationExample,
    code: paginationCode,
    props: [
      [
        'page',
        'number, required',
        'One-based current page; stale values are clamped for display without callbacks.',
      ],
      [
        'pageCount',
        'number, required',
        'Nonnegative integer. Zero displays 0 / 0 and disables both buttons.',
      ],
      [
        'onPageChange',
        '(page: number) => void, required',
        'Called only on a navigation action with the next valid page.',
      ],
      ['previousLabel / nextLabel', 'string, required', 'Localized button labels.'],
      ['aria-label', 'string, required', 'Accessible navigation name.'],
      ['disabled', 'boolean', 'Disable both actions; false by default.'],
      [
        'formatPageLabel',
        '(page: number, pageCount: number) => ComponentChildren',
        'Override the default page / pageCount indicator.',
      ],
    ],
    accessibility:
      'The root is a named nav. Buttons use normal Tab and Enter navigation. Keep page state and data slicing in the application.',
  },
  {
    title: 'DataToolbar',
    slug: 'data-toolbar',
    purpose: 'Compose wrapping controls above or below any data view.',
    example: DataToolbarExample,
    code: toolbarCode,
    props: [],
    accessibility:
      'No composite toolbar role or keyboard behavior is added. Each control needs its own accessible name.',
  },
  {
    title: 'DataToolbarGroup',
    slug: 'data-toolbar-group',
    purpose: 'Keep related controls together and align secondary actions logically.',
    example: DataToolbarExample,
    code: '<DataToolbarGroup align="end"><Button>Add profile</Button></DataToolbarGroup>',
    props: [
      [
        'align',
        'start | end',
        'Group alignment; start by default. end pushes the group to the logical end.',
      ],
    ],
    accessibility: 'DOM reading order is preserved in both LTR and RTL.',
  },
  ...listParts.map(
    ([title, slug, purpose, props]) =>
      ({
        title,
        slug,
        purpose,
        props: props.map((row) => [...row]),
        example: DataListExample,
        code: listCode,
        accessibility:
          'Native dl/dt/dd semantics describe each value. Layout direction is independent of HTML text direction.',
      }) satisfies ComponentDoc,
  ),
  {
    title: 'Separator',
    slug: 'separator',
    purpose: 'Separate content visually or mark a semantic section boundary.',
    example: SeparatorExample,
    code: separatorCode,
    props: [
      [
        'orientation',
        'horizontal | vertical',
        'Line orientation; horizontal by default. Vertical stretches in a flex parent or accepts explicit sizing.',
      ],
      [
        'decorative',
        'boolean',
        'true by default: role none and aria-hidden. false: role separator and explicit aria-orientation.',
      ],
    ],
    accessibility:
      'Separators are not focusable by default. role, aria-hidden and aria-orientation are derived, not public overrides. Label semantic boundaries only when useful.',
  },
];
