import type { ComponentDoc } from '../../routes/components/types';
import { TableExample } from './table-example';
import { PaginationExample } from './pagination-example';
import { ToolbarExample } from './toolbar-example';
import { DataListExample } from './data-list-example';
import { SeparatorExample } from './separator-example';

export const tableCode = `import { css } from './styled-system/css';
import { Table, TableContainer, TableCaption, TableHeader, TableBody,
  TableRow, TableHeaderCell, TableCell } from '@violice/preact-fluent-ui/components';

<TableContainer role="region" aria-label="Scrollable profiles" tabIndex={0}>
  <Table density="regular" class={css({ minWidth: '480px' })}>
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

export const paginationCode = `import { useSignal } from '@preact/signals';
import { Pagination } from '@violice/preact-fluent-ui/components';

export function ProfilePagination() {
  const page = useSignal(1);
  return (
    <Pagination page={page.value} pageCount={4}
      onPageChange={nextPage => { page.value = nextPage; }}
      aria-label="Profile pages" previousLabel="Previous" nextLabel="Next" />
  );
}`;

export const toolbarCode = `<Toolbar>
  <ToolbarGroup>
    <Input type="search" aria-label="Search profiles" />
    <Select aria-label="Status"><option>All profiles</option></Select>
  </ToolbarGroup>
  <ToolbarGroup align="end"><Button>Add profile</Button></ToolbarGroup>
</Toolbar>
{/* Below the data view, reuse the same layout. */}
<Toolbar>
  <ToolbarGroup>24 profiles</ToolbarGroup>
  <ToolbarGroup align="end">
    <Pagination page={page} pageCount={4} onPageChange={nextPage => { page.value = nextPage; }}
      aria-label="Profile pages" previousLabel="Previous" nextLabel="Next" />
  </ToolbarGroup>
</Toolbar>`;

export const listCode = `<DataList direction="horizontal">
  <DataListItem>
    <DataListLabel>Profile</DataListLabel>
    <DataListValue>Office connection</DataListValue>
  </DataListItem>
</DataList>`;

export const separatorCode = `<Separator />
<Separator decorative={false} aria-label="Section boundary" />
<ToolbarGroup>
  <Button>First action</Button>
  <Separator orientation="vertical" />
  <Button>Second action</Button>
</ToolbarGroup>`;

export const tableParts = [
  [
    'Table',
    'table',
    'Native table without an implicit wrapper.',
    [
      ['density', 'regular | compact', 'Cell spacing; regular by default.'],
      [
        'dividers',
        'all | between',
        'Default all. between draws separators between rows and leaves the outer table edges clear.',
      ],
    ],
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

export const listParts = [
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
    title: 'Toolbar',
    slug: 'toolbar',
    purpose: 'Compose wrapping controls above or below any data view.',
    example: ToolbarExample,
    code: toolbarCode,
    props: [],
    accessibility:
      'No composite toolbar role or keyboard behavior is added. Each control needs its own accessible name.',
  },
  {
    title: 'ToolbarGroup',
    slug: 'toolbar-group',
    purpose: 'Keep related controls together and align secondary actions logically.',
    example: ToolbarExample,
    code: '<ToolbarGroup align="end"><Button>Add profile</Button></ToolbarGroup>',
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
