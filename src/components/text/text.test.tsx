import { createRef } from 'preact';
import { signal } from '@preact/signals';
import { act, cleanup, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import { Text } from '../index';

afterEach(cleanup);

it('keeps heading typography separate from the default span semantics', () => {
  render(<Text preset="title1">A visual title</Text>);
  expect(screen.getByText('A visual title').tagName).toBe('SPAN');
  expect(screen.queryByRole('heading')).toBe(null);
});

it('uses the requested semantic root with composed refs and no wrapper', () => {
  const source = createRef<HTMLElement>();
  const template = createRef<HTMLHeadingElement>();
  const { container, unmount } = render(
    <Text
      preset="subtitle2"
      ref={source}
      class="section-title"
      id="saved-title"
      render={<h2 ref={template} class="template" />}
    >
      Saved routes
    </Text>,
  );
  const heading = screen.getByRole('heading', { level: 2, name: 'Saved routes' });
  expect(container.firstElementChild).toBe(heading);
  expect(source.current).toBe(heading);
  expect(template.current).toBe(heading);
  expect(heading.id).toBe('saved-title');
  expect(heading.classList.contains('section-title')).toBe(true);
  expect(heading.classList.contains('template')).toBe(true);
  expect(heading.hasAttribute('preset')).toBe(false);
  expect(heading.hasAttribute('render')).toBe(false);
  expect(heading.hasAttribute('tabindex')).toBe(false);
  unmount();
  expect(source.current).toBe(null);
  expect(template.current).toBe(null);
});

it('resolves reactive presets for render callbacks and defaults to body1', () => {
  const preset = signal<'caption1' | 'title1'>('caption1');
  const { rerender } = render(
    <Text preset={preset} render={(props, state) => <p {...props} data-preset={state.preset} />}>
      Profile details
    </Text>,
  );
  const paragraph = screen.getByText('Profile details');
  expect(paragraph.tagName).toBe('P');
  expect(paragraph.dataset.preset).toBe('caption1');
  const originalClass = paragraph.className;
  act(() => {
    preset.value = 'title1';
  });
  expect(paragraph.dataset.preset).toBe('title1');
  expect(paragraph.className).not.toBe(originalClass);
  rerender(
    <Text render={(props, state) => <p {...props} data-preset={state.preset} />}>
      Profile details
    </Text>,
  );
  expect(screen.getByText('Profile details').dataset.preset).toBe('body1');
});

it('resolves reactive colors without leaking the color prop to the native root', () => {
  const color = signal<'muted' | 'default'>('muted');
  const { rerender } = render(
    <Text color={color} render={(props, state) => <p {...props} data-color={state.color} />}>
      Route explanation
    </Text>,
  );
  const paragraph = screen.getByText('Route explanation');
  expect(paragraph.dataset.color).toBe('muted');
  expect(paragraph.hasAttribute('color')).toBe(false);
  const mutedClass = paragraph.className;
  act(() => {
    color.value = 'default';
  });
  expect(paragraph.dataset.color).toBe('default');
  expect(paragraph.className).not.toBe(mutedClass);
  rerender(
    <Text render={(props, state) => <p {...props} data-color={state.color} />}>
      Route explanation
    </Text>,
  );
  expect(screen.getByText('Route explanation').dataset.color).toBe('inherit');
  expect(screen.getByText('Route explanation').hasAttribute('color')).toBe(false);
});
