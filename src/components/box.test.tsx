import { createRef } from 'preact';
import { signal } from '@preact/signals';
import { act, cleanup, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import { Box, Card } from '../index';

afterEach(cleanup);

it('uses pixels for numeric grid track sizes and unitless numbers for placement', () => {
  render(
    <Box
      display="grid"
      gridTemplateColumns={80}
      gridTemplateRows={40}
      gridAutoColumns={60}
      gridAutoRows={30}
      gridColumn={2}
      gridRow={3}
    >
      Numeric grid
    </Box>,
  );
  const element = screen.getByText('Numeric grid');
  expect(element.style.gridTemplateColumns).toBe('80px');
  expect(element.style.gridTemplateRows).toBe('40px');
  expect(element.style.gridAutoColumns).toBe('60px');
  expect(element.style.gridAutoRows).toBe('30px');
  expect(element.style.gridColumn).toBe('2');
  expect(element.style.gridRow).toBe('3');
});

it('resolves spacing tokens and reactive layout without forwarding layout attributes', () => {
  const gap = signal('space-2');
  const { rerender } = render(
    <Box display="flex" gap={gap} padding="space-4" paddingInlineStart={0} marginInline="auto">
      Layout
    </Box>,
  );
  const element = screen.getByText('Layout');
  expect(element.style.gap).toBe('var(--space-2)');
  expect(element.style.padding).toBe('var(--space-4)');
  expect(element.style.paddingInlineStart).toBe('0px');
  expect(element.style.marginInline).toBe('auto');
  expect(element.hasAttribute('gap')).toBe(false);
  expect(element.hasAttribute('display')).toBe(false);
  act(() => {
    gap.value = 'space-6';
  });
  expect(element.style.gap).toBe('var(--space-6)');
  rerender(<Box>Layout</Box>);
  expect(element.style.gap).toBe('');
  expect(element.style.display).toBe('');
});

it('composes a Card root, styles and refs without an extra wrapper', () => {
  const source = createRef<HTMLElement>();
  const template = createRef<HTMLElement>();
  const { container, unmount } = render(
    <Box
      display="grid"
      gap="space-3"
      padding={12}
      ref={source}
      style={{ padding: 16 }}
      render={<Card ref={template} style={{ padding: 20 }} aria-label="Details" />}
    >
      Details
    </Box>,
  );
  const card = screen.getByRole('region', { name: 'Details' });
  expect(container.firstElementChild).toBe(card);
  expect(card.tagName).toBe('SECTION');
  expect(card.style.display).toBe('grid');
  expect(card.style.gap).toBe('var(--space-3)');
  expect(card.style.padding).toBe('20px');
  expect(source.current).toBe(card);
  expect(template.current).toBe(card);
  unmount();
  expect(source.current).toBeNull();
  expect(template.current).toBeNull();
});

it('preserves layout when native string styles override one property', () => {
  render(
    <Box display="flex" flexGrow={1} width={80} gap="space-2" style="gap: 12px; color: red">
      String styles
    </Box>,
  );
  const element = screen.getByText('String styles');
  expect(element.style.display).toBe('flex');
  expect(element.style.flexGrow).toBe('1');
  expect(element.style.width).toBe('80px');
  expect(element.style.gap).toBe('12px');
  expect(element.style.color).toBe('red');
});

it('forwards callback props to a semantic root and supplies resolved layout', () => {
  render(
    <Box
      display="grid"
      gap="space-4"
      render={(props, state) => (
        <section {...props} aria-label="Callback" data-layout={state.layout.display} />
      )}
    >
      Callback layout
    </Box>,
  );
  const section = screen.getByRole('region', { name: 'Callback' });
  expect(section.dataset.layout).toBe('grid');
  expect(section.style.gap).toBe('var(--space-4)');
  expect(section.hasAttribute('render')).toBe(false);
});

it('honors hidden even when layout requests flex display', () => {
  render(
    <Box display="flex" hidden>
      Hidden layout
    </Box>,
  );
  expect(getComputedStyle(screen.getByText('Hidden layout')).display).toBe('none');
});
