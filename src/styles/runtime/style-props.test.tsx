import { signal } from '@preact/signals';
import { act, cleanup, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import { styleProps } from './style-props';
afterEach(cleanup);
it('updates local variables from signals during component renders', () => {
  const width = signal(80);
  function Panel() {
    return (
      <div
        {...styleProps('test', [
          ['--width', width, 'width'],
          ['--opacity', 0.5, 'opacity'],
        ])}
      >
        Panel
      </div>
    );
  }
  render(<Panel />);
  const element = screen.getByText('Panel');
  expect(element.style.getPropertyValue('--width')).toBe('80px');
  expect(element.style.getPropertyValue('--opacity')).toBe('0.5');
  act(() => {
    width.value = 120;
  });
  expect(element.style.getPropertyValue('--width')).toBe('120px');
});
it('removes null values and resolves configured spacing tokens', () => {
  expect(
    styleProps(
      'test',
      [
        ['--gap', '{spacing.4}', 'gap'],
        ['--width', null, 'width'],
      ],
      { 'spacing.4': 'var(--pfui-spacing-4)' },
    ).style,
  ).toEqual({
    '--gap-rowGap': 'var(--pfui-spacing-4)',
    '--gap-columnGap': 'var(--pfui-spacing-4)',
  });
});
