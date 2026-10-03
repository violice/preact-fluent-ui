import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { CodeBlock } from './code-block';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it('copies the original source without HTML markup or entities', async () => {
  const user = userEvent.setup();
  const source = '<Button disabled>Save & close</Button>';
  const { container } = render(<CodeBlock code={source} />);
  expect(container.querySelector('code')?.textContent).toBe(source);
  expect(container.querySelector('code button')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Copy code' }));
  expect(await navigator.clipboard.readText()).toBe(source);
  expect(screen.getByRole('status').textContent).toBe('Copied');
});
it('reports clipboard refusal without claiming that copying succeeded', async () => {
  const user = userEvent.setup();
  vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Denied'));
  render(<CodeBlock code="const value = 1;" />);
  await user.click(screen.getByRole('button', { name: 'Copy code' }));
  expect(screen.getByRole('status').textContent).toContain('Could not copy');
});
