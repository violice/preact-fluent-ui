import { createRef } from 'preact';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import * as library from '../../index';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it('exposes escaped semantic code with safe generic tokens and plain unknown tokens', () => {
  expect(library).toHaveProperty('CodeBlock');
  const ref = createRef<HTMLDivElement>();
  const { container } = render(
    <library.CodeBlock
      ref={ref}
      code={'<x> &\n'}
      tokens={[
        { text: '<x>', kind: 'tag' },
        { text: ' &' },
        { text: '\n', kind: 'unknown' as library.CodeBlockTokenKind },
      ]}
      aria-label="Root"
      codeLabel="Source"
      hidden
    />,
  );
  expect(ref.current?.hidden).toBe(true);
  expect(container.querySelector('pre')?.getAttribute('aria-label')).toBe('Source');
  expect(container.querySelector('pre')?.style.whiteSpace).toBe('pre');
  expect(container.querySelector('code')?.textContent).toBe('<x> &\n');
  expect(container.querySelector('x')).toBeNull();
  expect(container.querySelectorAll('code span')).toHaveLength(1);
  expect(screen.queryByRole('button')).toBeNull();
});
it('copies exact raw source and retains status on unrelated rerenders', async () => {
  const user = userEvent.setup();
  const { container, rerender } = render(
    <library.CodeBlock code={' \n<&>\t'} copy language="tsx" />,
  );
  expect(container.querySelector('code')?.textContent).toBe(' \n<&>\t');
  await user.click(screen.getByRole('button', { name: 'Copy code' }));
  expect(await navigator.clipboard.readText()).toBe(' \n<&>\t');
  expect(screen.getByRole('status').textContent).toBe('Copied');
  rerender(<library.CodeBlock code={' \n<&>\t'} copy language="css" />);
  expect(screen.getByRole('status').textContent).toBe('Copied');
});
it('announces rejected and missing clipboard through localized labels', async () => {
  const user = userEvent.setup();
  vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Denied'));
  render(<library.CodeBlock code="x" copy labels={{ copy: 'Kopieren', failure: 'Fehler' }} />);
  await user.click(screen.getByRole('button', { name: 'Kopieren' }));
  expect(screen.getByRole('status').textContent).toBe('Fehler');
  vi.spyOn(navigator, 'clipboard', 'get').mockReturnValue(undefined as unknown as Clipboard);
  await user.click(screen.getByRole('button', { name: 'Kopieren' }));
  expect(screen.getByRole('status').textContent).toBe('Fehler');
});
it('ignores stale requests after code change, repeated clicks and unmount', async () => {
  userEvent.setup();
  const completions: Array<() => void> = [];
  vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(
    () => new Promise<void>((resolve) => completions.push(resolve)),
  );
  const { rerender, unmount } = render(<library.CodeBlock code="first" copy />);
  fireEvent.click(screen.getByRole('button'));
  rerender(<library.CodeBlock code="second" copy />);
  completions[0]!();
  await waitFor(() => expect(screen.getByRole('status').textContent).toBe(''));
  fireEvent.click(screen.getByRole('button'));
  fireEvent.click(screen.getByRole('button'));
  completions[1]!();
  await waitFor(() => expect(screen.getByRole('status').textContent).toBe(''));
  completions[2]!();
  await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Copied'));
  fireEvent.click(screen.getByRole('button'));
  unmount();
  completions[3]!();
});
