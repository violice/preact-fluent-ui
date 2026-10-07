import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/preact';
import { Gallery } from '../../app/gallery';

afterEach(() => {
  cleanup();
  history.replaceState(null, '', '/');
});

it('renders the root changelog on its canonical route with one page heading', () => {
  history.replaceState(null, '', '/preact-fluent-ui/changelog?reset=false&native=false&theme=dark');
  const { container } = render(<Gallery base="/preact-fluent-ui/" />);
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Changelog');
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(screen.getByRole('heading', { name: '0.4.0 (2026-10-05)', level: 2 }).id).toBe(
    '0-4-0-2026-10-05',
  );
  expect(container.querySelectorAll('li').length).toBeGreaterThan(10);
  expect(container.querySelector('main code')).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Changelog' }).getAttribute('href')).toBe(
    '/preact-fluent-ui/changelog?reset=false&native=false&theme=dark',
  );
});

it('escapes HTML, blocks executable links and maps repository links without changing anchors', async () => {
  const { parseMarkdown } = await import('@tanstack/markdown/parser');
  const { ChangelogContent } = await import('.');
  const { container } = render(
    <ChangelogContent
      document={parseMarkdown(
        '<script>alert(1)</script>\n\nInline <b>literal</b>.\n\n[bad](javascript:alert) [data](data:text/html,test) [readme](README.md) [local](#version) [website](https://example.org)',
        { allowHtml: true, urlTransform: (url) => url },
      )}
    />,
  );
  expect(container.textContent).toContain('<script>alert(1)</script>');
  expect(container.textContent).toContain('<b>literal</b>');
  expect(container.querySelector('script, b')).toBeNull();
  expect(screen.queryByRole('link', { name: 'bad' })).toBeNull();
  expect(screen.queryByRole('link', { name: 'data' })).toBeNull();
  expect(screen.getByRole('link', { name: 'readme' }).getAttribute('href')).toBe(
    'https://github.com/violice/preact-fluent-ui/blob/main/README.md',
  );
  expect(screen.getByRole('link', { name: 'local' }).getAttribute('href')).toBe('#version');
  expect(screen.getByRole('link', { name: 'website' }).getAttribute('href')).toBe(
    'https://example.org',
  );
});

it('renders common prose and fenced code through the library CodeBlock with plain fallback', async () => {
  const { parseMarkdown } = await import('@tanstack/markdown/parser');
  const { ChangelogContent } = await import('.');
  const { container } = render(
    <ChangelogContent
      document={parseMarkdown(
        '## Version\n\n**Strong** and *emphasis*.\n\n> Quote\n\n```tsx\nconst value = 1;\n```\n\n```unknown\n<raw>\n```',
      )}
    />,
  );
  expect(container.querySelector('strong')?.textContent).toBe('Strong');
  expect(container.querySelector('em')?.textContent).toBe('emphasis');
  expect(container.querySelector('blockquote')?.textContent).toContain('Quote');
  expect(screen.getAllByRole('button', { name: 'Copy code' })).toHaveLength(2);
  expect(container.querySelectorAll('pre')).toHaveLength(2);
  expect(container.textContent).toContain('<raw>');
  expect(container.querySelector('raw')).toBeNull();
});
