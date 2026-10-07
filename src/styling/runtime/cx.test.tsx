import { signal } from '@preact/signals';
import { act, cleanup, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import { cx } from './cx';
afterEach(cleanup);
it('tracks signal classes during renders and handles nested values', () => {
  const value = signal('second');
  function Panel() {
    return <div class={cx('first', [false, value, undefined])}>Panel</div>;
  }
  render(<Panel />);
  expect(screen.getByText('Panel').className).toBe('first second');
  act(() => {
    value.value = 'updated';
  });
  expect(screen.getByText('Panel').className).toBe('first updated');
});
