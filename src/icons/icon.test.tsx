import { createRef } from 'preact';
import { cleanup, render } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import { Icon, type IconName } from '../index';

afterEach(cleanup);

const names = [
  'about',
  'adapter',
  'add',
  'chevron-down',
  'connected',
  'copy',
  'delete',
  'diagnostics',
  'disconnected',
  'edit',
  'eye',
  'info',
  'network',
  'open',
  'profile',
  'refresh',
  'restore',
  'routes',
  'settings',
  'shield',
  'vpn',
  'warning',
] as const satisfies readonly IconName[];

describe('Icon', () => {
  it('exports Icon', () => expect(Icon).toBeTypeOf('function'));

  for (const name of names) {
    for (const size of [16, 20, 24] as const) {
      it(`renders ${name} at ${size}px with decorative paths`, () => {
        const { container } = render(<Icon name={name} size={size} />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe(String(size));
        expect(svg?.getAttribute('height')).toBe(String(size));
        // The source glyphs reuse a 20px viewBox for these 16px variants.
        const glyphSize =
          name === 'copy' || (size === 16 && (name === 'routes' || name === 'diagnostics'))
            ? 20
            : size;
        expect(svg?.getAttribute('viewBox')).toBe(`0 0 ${glyphSize} ${glyphSize}`);
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
        expect(svg?.getAttribute('focusable')).toBe('false');
        const paths = svg?.querySelectorAll('path');
        expect(paths?.length).toBeGreaterThan(0);
        for (const path of paths ?? []) expect(path.getAttribute('d')).toMatch(/^M/i);
      });
    }
  }

  it('forwards its ref, classes and native attrs while preserving decoration', () => {
    const ref = createRef<SVGSVGElement>();
    render(
      <Icon
        ref={ref}
        name="info"
        class="first"
        className="second"
        aria-hidden="false"
        focusable="true"
        aria-label="Info"
        data-testid="icon"
      />,
    );
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
    expect(ref.current?.getAttribute('data-testid')).toBe('icon');
    expect(ref.current?.getAttribute('aria-label')).toBe('Info');
    expect(ref.current?.getAttribute('width')).toBe('20');
    expect(ref.current?.getAttribute('aria-hidden')).toBe('true');
    expect(ref.current?.getAttribute('focusable')).toBe('false');
    expect(ref.current?.classList.contains('first')).toBe(true);
    expect(ref.current?.classList.contains('second')).toBe(false);
    expect(ref.current?.classList.length).toBeGreaterThan(1);
    expect(ref.current?.hasAttribute('name')).toBe(false);
    expect(ref.current?.hasAttribute('size')).toBe(false);
  });
});
