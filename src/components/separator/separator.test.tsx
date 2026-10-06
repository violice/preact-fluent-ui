import { createRef } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import { Separator } from '../../index';

afterEach(cleanup);

it('defaults to an unfocusable decorative horizontal divider', () => {
  const ref = createRef<HTMLDivElement>();
  render(<Separator ref={ref} />);
  expect(ref.current?.tagName).toBe('DIV');
  expect(ref.current?.getAttribute('role')).toBe('none');
  expect(ref.current?.getAttribute('aria-hidden')).toBe('true');
  expect(ref.current?.hasAttribute('aria-orientation')).toBe(false);
  expect(ref.current?.hasAttribute('tabindex')).toBe(false);
  expect(screen.queryByRole('separator')).toBe(null);
});

it('exposes semantic orientation and names without decorative hiding', () => {
  const { rerender } = render(<Separator decorative={false} aria-label="Sections" />);
  const divider = screen.getByRole('separator', { name: 'Sections' });
  expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
  expect(divider.hasAttribute('aria-hidden')).toBe(false);
  rerender(
    <>
      <span id="actions">Actions</span>
      <Separator decorative={false} orientation="vertical" aria-labelledby="actions" />
    </>,
  );
  const vertical = screen.getByRole('separator', { name: 'Actions' });
  expect(vertical.getAttribute('aria-orientation')).toBe('vertical');
  expect(vertical.hasAttribute('orientation')).toBe(false);
  expect(vertical.hasAttribute('decorative')).toBe(false);
});

it('updates decorative semantics while forwarding native styling and refs', () => {
  const ref = createRef<HTMLDivElement>();
  const { rerender, unmount } = render(<Separator ref={ref} decorative={false} />);
  rerender(
    <Separator
      ref={ref}
      orientation="vertical"
      hidden
      class="primary"
      className="fallback"
      style={{ height: '40px' }}
      data-kind="divider"
    />,
  );
  expect(ref.current?.getAttribute('role')).toBe('none');
  expect(ref.current?.getAttribute('aria-hidden')).toBe('true');
  expect(ref.current?.hasAttribute('aria-orientation')).toBe(false);
  expect(ref.current?.hidden).toBe(true);
  expect(ref.current?.style.height).toBe('40px');
  expect(ref.current?.dataset.kind).toBe('divider');
  expect(ref.current?.classList.contains('primary')).toBe(true);
  expect(ref.current?.classList.contains('fallback')).toBe(false);
  unmount();
  expect(ref.current).toBe(null);
});
