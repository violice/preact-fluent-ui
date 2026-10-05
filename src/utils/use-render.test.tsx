import { createRef } from 'preact';
import type { JSX, Ref } from 'preact';
import { forwardRef } from 'preact/compat';
import { useState } from 'preact/hooks';
import { signal } from '@preact/signals';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import { useRender } from './use-render';
import type { UseRenderOptions } from './use-render';

afterEach(cleanup);
function Root({
  rootRef,
  ...options
}: Omit<UseRenderOptions<'a', { active: boolean }>, 'ref'> & {
  rootRef?: UseRenderOptions<'a'>['ref'];
}) {
  return useRender({ ...options, ref: rootRef });
}
const Link = forwardRef<HTMLAnchorElement, JSX.IntrinsicElements['a']>((props, ref) => (
  <a {...props} ref={ref} />
));
it('renders the default root with source props and children', () => {
  render(<Root defaultTagName="a" props={{ href: '/source', children: 'Source' }} />);
  expect(screen.getByRole('link', { name: 'Source' }).getAttribute('href')).toBe('/source');
});
it('replaces the root with a custom Link, preserving or overriding children', () => {
  const ref = createRef<HTMLAnchorElement>();
  const { container, rerender } = render(
    <Root
      defaultTagName="a"
      rootRef={ref}
      props={{ href: '/source', children: 'Source' }}
      render={<Link href="/template" />}
    />,
  );
  expect(container.firstElementChild).toBe(ref.current);
  expect(container.children).toHaveLength(1);
  expect(screen.getByRole('link', { name: 'Source' }).getAttribute('href')).toBe('/template');
  rerender(
    <Root
      defaultTagName="a"
      props={{ children: 'Source' }}
      render={<Link href="/">Template</Link>}
    />,
  );
  expect(screen.getByRole('link', { name: 'Template' })).toBeTruthy();
});
it('merges template classes styles attributes and handlers without duplicating events', () => {
  const calls: string[] = [];
  const { rerender } = render(
    <Root
      defaultTagName="a"
      props={{
        href: '/source',
        class: 'source',
        style: { color: 'red', padding: 4 },
        onClick: (event) => {
          calls.push('source');
          event.preventDefault();
        },
      }}
      render={
        <a
          href="/template"
          className="template"
          style={{ color: 'blue' }}
          onClick={() => calls.push('template')}
        >
          Go
        </a>
      }
    />,
  );
  const node = screen.getByRole('link');
  expect(node.className).toBe('source template');
  expect(node.getAttribute('href')).toBe('/template');
  expect((node as HTMLElement).style.color).toBe('blue');
  expect((node as HTMLElement).style.padding).toBe('4px');
  fireEvent.click(node);
  expect(calls).toEqual(['template', 'source']);
  rerender(
    <Root
      defaultTagName="a"
      props={{
        onClick: (event) => {
          calls.push('source');
          event.preventDefault();
        },
      }}
      render={
        <a
          href="/"
          onClick={(event) => {
            event.preventDefault();
            calls.push('cancel');
          }}
        >
          Go
        </a>
      }
    />,
  );
  fireEvent.click(screen.getByRole('link'));
  expect(calls).toEqual(['template', 'source', 'cancel']);
});
it('composes source option and template refs, clears changed refs and avoids stable ref churn', () => {
  const seen: (HTMLAnchorElement | null)[] = [];
  const changed: (HTMLAnchorElement | null)[] = [];
  const callback = (node: HTMLAnchorElement | null) => {
    seen.push(node);
  };
  const replacement = (node: HTMLAnchorElement | null) => {
    changed.push(node);
  };
  const source = createRef<HTMLAnchorElement>();
  const template = createRef<HTMLAnchorElement>();
  const { rerender, unmount } = render(
    <Root
      defaultTagName="a"
      rootRef={[callback]}
      props={{ ref: source, children: 'Go' }}
      render={<a href="/" ref={template} />}
    />,
  );
  const node = screen.getByRole('link') as HTMLAnchorElement;
  expect(seen).toEqual([node]);
  expect(source.current).toBe(node);
  expect(template.current).toBe(node);
  rerender(
    <Root
      defaultTagName="a"
      rootRef={[callback]}
      props={{ ref: source, children: 'Next' }}
      render={<a href="/" ref={template} />}
    />,
  );
  expect(seen).toEqual([node]);
  rerender(
    <Root
      defaultTagName="a"
      rootRef={[replacement]}
      props={{ ref: source }}
      render={<a href="/" ref={template} />}
    />,
  );
  expect(seen).toEqual([node, null]);
  expect(changed).toEqual([node]);
  unmount();
  expect(changed).toEqual([node, null]);
  expect(source.current).toBeNull();
  expect(template.current).toBeNull();
});
it('passes final props and state to callbacks and reacts to state and Signalish classes', () => {
  const classValue = signal('first');
  const ref = createRef<HTMLAnchorElement>();
  let receivedRef: Ref<HTMLAnchorElement> | undefined;
  function Demo() {
    const [active, setActive] = useState(false);
    return useRender({
      defaultTagName: 'a',
      ref,
      state: { active },
      props: {
        href: '/',
        class: classValue,
        children: 'Go',
        onClick: (event) => {
          event.preventDefault();
          setActive(true);
        },
      },
      render: (props, state) => {
        receivedRef = props.ref;
        return <Link {...props} aria-current={state.active ? 'page' : undefined} />;
      },
    });
  }
  const { rerender } = render(<Demo />);
  expect(receivedRef).toBeTypeOf('function');
  fireEvent.click(screen.getByRole('link'));
  expect(screen.getByRole('link').getAttribute('aria-current')).toBe('page');
  expect(screen.getByRole('link').hasAttribute('data-active')).toBe(false);
  classValue.value = 'second';
  rerender(<Demo />);
  expect(screen.getByRole('link').className).toBe('second');
  expect(ref.current).toBe(screen.getByRole('link'));
});
it('defaults callback state to an empty object', () => {
  function Demo() {
    return useRender({
      defaultTagName: 'button',
      render: (props, state) => <button {...props}>{Object.keys(state).length}</button>,
    });
  }
  render(<Demo />);
  expect(screen.getByRole('button').textContent).toBe('0');
});

it('preserves callback ref cleanup on replacement and unmount', () => {
  const calls: string[] = [];
  const first = (node: HTMLAnchorElement | null) => {
    calls.push(node ? 'first node' : 'first null');
    return () => {
      calls.push('first cleanup');
    };
  };
  const second = (node: HTMLAnchorElement | null) => {
    calls.push(node ? 'second node' : 'second null');
    return () => {
      calls.push('second cleanup');
    };
  };
  const { rerender, unmount } = render(<Root defaultTagName="a" rootRef={first} />);
  rerender(<Root defaultTagName="a" rootRef={second} />);
  unmount();
  expect(calls).toEqual(['first node', 'first cleanup', 'second node', 'second cleanup']);
});
