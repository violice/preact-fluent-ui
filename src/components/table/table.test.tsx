import { createRef } from 'preact';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableCaption,
} from '../../index';

afterEach(cleanup);

it('composes a named native table with scoped and spanning cells', () => {
  let clicks = 0;
  render(
    <TableContainer>
      <Table density="compact">
        <TableCaption>Routes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHeaderCell id="address" aria-sort="ascending">
              Address
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow onClick={() => clicks++}>
            <TableHeaderCell scope="row" id="route">
              Office
            </TableHeaderCell>
            <TableCell headers="address route" colSpan={2} rowSpan={3} align="end">
              10.0.0.0
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total: 1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>,
  );
  const table = screen.getByRole('table', { name: 'Routes' });
  expect(table.tagName).toBe('TABLE');
  expect(table.querySelector('caption')?.textContent).toBe('Routes');
  expect(screen.getByRole('columnheader').getAttribute('scope')).toBe('col');
  expect(screen.getByRole('columnheader').getAttribute('aria-sort')).toBe('ascending');
  expect(screen.getByRole('rowheader').getAttribute('scope')).toBe('row');
  const cell = screen.getByText('10.0.0.0') as HTMLTableCellElement;
  expect(cell.headers).toBe('address route');
  expect(cell.colSpan).toBe(2);
  expect(cell.rowSpan).toBe(3);
  expect(cell.hasAttribute('align')).toBe(false);
  expect(table.querySelector('tfoot')?.textContent).toBe('Total: 1');
  expect(table.hasAttribute('density')).toBe(false);
  expect(table.parentElement?.hasAttribute('tabindex')).toBe(false);
  fireEvent.click(cell);
  expect(clicks).toBe(1);
});

it('forwards refs to every native part and clears them on unmount', () => {
  const container = createRef<HTMLDivElement>();
  const table = createRef<HTMLTableElement>();
  const header = createRef<HTMLTableSectionElement>();
  const body = createRef<HTMLTableSectionElement>();
  const footer = createRef<HTMLTableSectionElement>();
  const row = createRef<HTMLTableRowElement>();
  const heading = createRef<HTMLTableCellElement>();
  const cell = createRef<HTMLTableCellElement>();
  const caption = createRef<HTMLTableCaptionElement>();
  const { unmount } = render(
    <TableContainer ref={container} tabIndex={0} aria-label="Scroll routes">
      <Table ref={table}>
        <TableCaption ref={caption}>Routes</TableCaption>
        <TableHeader ref={header}>
          <TableRow ref={row}>
            <TableHeaderCell ref={heading}>Address</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody ref={body}>
          <TableRow>
            <TableCell ref={cell}>Value</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter ref={footer} />
      </Table>
    </TableContainer>,
  );
  const refs = [container, table, header, body, footer, row, heading, cell, caption];
  expect(refs.map((ref) => ref.current?.tagName)).toEqual([
    'DIV',
    'TABLE',
    'THEAD',
    'TBODY',
    'TFOOT',
    'TR',
    'TH',
    'TD',
    'CAPTION',
  ]);
  expect(table.current?.parentElement).toBe(container.current);
  expect(container.current?.tabIndex).toBe(0);
  unmount();
  expect(refs.map((ref) => ref.current)).toEqual(Array(9).fill(null));
});

it('preserves hidden and native attributes with primary class precedence', () => {
  const ref = createRef<HTMLTableElement>();
  render(
    <Table
      ref={ref}
      hidden
      id="routes"
      class="primary"
      className="fallback"
      data-kind="routes"
      dir="rtl"
    />,
  );
  expect(ref.current?.hidden).toBe(true);
  expect(ref.current?.id).toBe('routes');
  expect(ref.current?.dataset.kind).toBe('routes');
  expect(ref.current?.dir).toBe('rtl');
  expect(ref.current?.classList.contains('primary')).toBe(true);
  expect(ref.current?.classList.contains('fallback')).toBe(false);
});
