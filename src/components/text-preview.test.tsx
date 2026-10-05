import { createRef } from 'preact';
import { cleanup, render } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import * as library from '../index';

afterEach(cleanup);
it('exposes a selectable text preview preserving literal source and native accessibility', () => {
  expect(library).toHaveProperty('TextPreview');
  const ref = createRef<HTMLPreElement>();
  const { container, rerender } = render(
    <library.TextPreview
      ref={ref}
      text={'  <script>&\nnext\t'}
      aria-label="Diagnostics"
      class="chosen"
      className="ignored"
    />,
  );
  const pre = container.querySelector('pre')!;
  expect(pre.textContent).toBe('  <script>&\nnext\t');
  expect(pre.querySelector('script')).toBeNull();
  expect(ref.current).toBe(pre);
  expect(pre.tabIndex).toBe(0);
  expect(pre.classList.contains('chosen')).toBe(true);
  expect(pre.classList.contains('ignored')).toBe(false);
  expect(pre.style.whiteSpace).toBe('pre-wrap');
  rerender(
    <library.TextPreview
      text="next"
      wrap={false}
      hidden
      tabIndex={-1}
      style={{ maxHeight: '220px' }}
    />,
  );
  expect(pre.hidden).toBe(true);
  expect(pre.tabIndex).toBe(-1);
  expect(pre.style.whiteSpace).toBe('pre');
  expect(pre.style.maxHeight).toBe('220px');
});
