import { createRef } from 'preact';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { Disclosure, DisclosureContent, DisclosureSummary } from '../../index';

afterEach(cleanup);

it('renders native disclosure parts with exact ref targets', () => {
  const root = createRef<HTMLDetailsElement>();
  const summary = createRef<HTMLElement>();
  const content = createRef<HTMLDivElement>();
  const { unmount } = render(
    <Disclosure ref={root}>
      <DisclosureSummary ref={summary}>Error details</DisclosureSummary>
      <DisclosureContent ref={content}>Connection failed</DisclosureContent>
    </Disclosure>,
  );
  expect(root.current?.tagName).toBe('DETAILS');
  expect(summary.current?.tagName).toBe('SUMMARY');
  expect(content.current?.tagName).toBe('DIV');
  expect(root.current?.firstElementChild).toBe(summary.current);
  expect(summary.current?.nextElementSibling).toBe(content.current);
  expect(content.current?.textContent).toBe('Connection failed');
  unmount();
  expect(root.current).toBe(null);
  expect(summary.current).toBe(null);
  expect(content.current).toBe(null);
});

it('forwards open, native grouping and toggle events and updates open on rerender', () => {
  const ref = createRef<HTMLDetailsElement>();
  const states: boolean[] = [];
  const onToggle = (event: Event & { currentTarget: HTMLDetailsElement }) => {
    states.push(event.currentTarget.open);
  };
  const { rerender } = render(<Disclosure ref={ref} open name="previews" onToggle={onToggle} />);
  expect(ref.current?.open).toBe(true);
  expect(ref.current?.getAttribute('name')).toBe('previews');
  fireEvent(ref.current!, new Event('toggle'));
  expect(states).toEqual([true]);
  rerender(<Disclosure ref={ref} open={false} name="previews" onToggle={onToggle} />);
  expect(ref.current?.open).toBe(false);
  fireEvent(ref.current!, new Event('toggle'));
  expect(states).toEqual([true, false]);
});

it('keeps native attributes and class precedence on every part', () => {
  const { container } = render(
    <Disclosure appearance="card" hidden class="root" className="ignored-root" data-kind="preview">
      <DisclosureSummary hidden class="summary" className="ignored-summary" title="Show file" />
      <DisclosureContent
        hidden
        class="content"
        className="ignored-content"
        style={{ color: 'red' }}
      />
    </Disclosure>,
  );
  const parts = Array.from(container.querySelectorAll('details, summary, div'));
  expect(parts).toHaveLength(3);
  for (const [index, part] of parts.entries()) {
    expect((part as HTMLElement).hidden).toBe(true);
    expect(part.classList.contains(['root', 'summary', 'content'][index]!)).toBe(true);
    expect(part.className).not.toContain('ignored');
  }
  expect(parts[0]?.hasAttribute('appearance')).toBe(false);
  expect((parts[0] as HTMLElement).dataset.kind).toBe('preview');
  expect(parts[1]?.getAttribute('title')).toBe('Show file');
  expect((parts[2] as HTMLElement).style.color).toBe('red');
});

it('uses className as fallback and preserves long nested content without imposing scrolling', () => {
  const text = '127.0.0.1 example.test\n'.repeat(200);
  const { container } = render(
    <Disclosure open className="root-fallback">
      <DisclosureSummary className="summary-fallback">Proposed file</DisclosureSummary>
      <DisclosureContent className="content-fallback">
        <pre>
          <code>{text}</code>
        </pre>
      </DisclosureContent>
    </Disclosure>,
  );
  expect(container.querySelector('details')?.classList.contains('root-fallback')).toBe(true);
  expect(container.querySelector('summary')?.classList.contains('summary-fallback')).toBe(true);
  const content = container.querySelector('.content-fallback') as HTMLDivElement;
  expect(content.querySelector('code')?.textContent).toBe(text);
  expect(content.style.maxHeight).toBe('');
  expect(content.style.overflow).toBe('');
});

it('leaves the summary available for native keyboard focus', async () => {
  const user = userEvent.setup();
  render(
    <Disclosure>
      <DisclosureSummary>Diagnostics</DisclosureSummary>
      <DisclosureContent>Log</DisclosureContent>
    </Disclosure>,
  );
  const summary = screen.getByText('Diagnostics');
  await user.tab();
  expect(document.activeElement).toBe(summary);
  await user.keyboard('{Enter}');
  // jsdom does not implement keyboard activation of summary. Browser acceptance verifies toggling.
  expect(document.activeElement).toBe(summary);
});
