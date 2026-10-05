import { createRef } from 'preact';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Tooltip } from './tooltip';
import { Modal } from './modal';
import { copyTooltipTheme } from './tooltip-theme';
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}
function setup() {
  return render(
    <Tooltip content="Description">{(props) => <button {...props}>Action</button>}</Tooltip>,
  );
}
it('adds no wrapper and delays hover by 500ms', () => {
  const { container } = setup();
  const button = screen.getByRole('button');
  expect(container.firstElementChild).toBe(button);
  fireEvent.pointerEnter(button);
  advance(499);
  expect(screen.queryByRole('tooltip')).toBe(null);
  advance(1);
  expect(screen.getByRole('tooltip').textContent).toBe('Description');
  fireEvent.pointerLeave(button);
  advance(100);
  expect(screen.queryByRole('tooltip')).toBe(null);
});
it('opens on focus and preserves focus while pointer departs', () => {
  setup();
  const button = screen.getByRole('button');
  act(() => button.focus());
  expect(screen.getByRole('tooltip')).toBeTruthy();
  fireEvent.pointerLeave(button);
  advance(100);
  expect(screen.getByRole('tooltip')).toBeTruthy();
  act(() => button.blur());
  advance(100);
  expect(screen.queryByRole('tooltip')).toBe(null);
});
it('lets the pointer travel from trigger to hoverable tooltip', () => {
  setup();
  const button = screen.getByRole('button');
  fireEvent.pointerEnter(button);
  advance(500);
  fireEvent.pointerLeave(button);
  fireEvent.pointerEnter(screen.getByRole('tooltip'));
  advance(100);
  expect(screen.getByRole('tooltip')).toBeTruthy();
  fireEvent.pointerLeave(screen.getByRole('tooltip'));
  advance(100);
  expect(screen.queryByRole('tooltip')).toBe(null);
});
it('suppresses reopening after Escape until the interaction ends', () => {
  setup();
  const button = screen.getByRole('button');
  act(() => button.focus());
  fireEvent.pointerEnter(button);
  fireEvent.keyDown(button, { key: 'Escape' });
  advance(600);
  expect(screen.queryByRole('tooltip')).toBe(null);
  fireEvent.pointerEnter(button);
  advance(500);
  expect(screen.queryByRole('tooltip')).toBe(null);
  fireEvent.pointerLeave(button);
  act(() => button.blur());
  advance(100);
  act(() => button.focus());
  expect(screen.getByRole('tooltip')).toBeTruthy();
});
it('composes caller descriptions, handlers and exact ref without changing the name', () => {
  const ref = createRef<HTMLElement>();
  const calls: string[] = [];
  const { unmount } = render(
    <Tooltip
      content="Description"
      triggerProps={{
        ref,
        'aria-describedby': 'existing existing',
        'aria-label': 'Named action',
        onFocus: () => calls.push('focus'),
        onPointerEnter: () => calls.push('enter'),
        onBlur: () => calls.push('blur'),
        onPointerLeave: () => calls.push('leave'),
      }}
    >
      {(props) => <button {...props}>Action</button>}
    </Tooltip>,
  );
  const button = screen.getByRole('button', { name: 'Named action' });
  expect(ref.current).toBe(button);
  act(() => button.focus());
  const tooltip = screen.getByRole('tooltip');
  expect(button.getAttribute('aria-describedby')).toBe(`existing ${tooltip.id}`);
  fireEvent.pointerEnter(button);
  fireEvent.pointerLeave(button);
  act(() => button.blur());
  expect(calls).toEqual(['focus', 'enter', 'leave', 'blur']);
  unmount();
  expect(ref.current).toBe(null);
});
it('updates visible content with a stable description id and cleans pending timers on unmount', () => {
  const { rerender, unmount } = setup();
  const button = screen.getByRole('button');
  act(() => button.focus());
  const id = screen.getByRole('tooltip').id;
  rerender(<Tooltip content="Updated">{(props) => <button {...props}>Action</button>}</Tooltip>);
  expect(screen.getByRole('tooltip').textContent).toBe('Updated');
  expect(screen.getByRole('tooltip').id).toBe(id);
  act(() => button.blur());
  fireEvent.pointerEnter(button);
  unmount();
  advance(1000);
  expect(screen.queryByRole('tooltip')).toBe(null);
  expect(vi.getTimerCount()).toBe(0);
});
it('portals into the modal backdrop outside its scrolling dialog and consumes Escape first', () => {
  const ref = createRef<HTMLButtonElement>();
  const close = vi.fn();
  render(
    <Modal labelledBy="title" initialFocusRef={ref} onClose={close}>
      <h2 id="title">Dialog</h2>
      <Tooltip content="Modal description" triggerProps={{ ref }}>
        {(props) => <button {...props}>Action</button>}
      </Tooltip>
    </Modal>,
  );
  const button = screen.getByRole('button');
  act(() => button.focus());
  const tooltip = screen.getByRole('tooltip');
  const dialog = screen.getByRole('dialog');
  expect(tooltip.parentElement).toBe(dialog.parentElement);
  expect(dialog.contains(tooltip)).toBe(false);
  expect(tooltip.closest('[inert]')).toBe(null);
  fireEvent.keyDown(button, { key: 'Escape' });
  expect(screen.queryByRole('tooltip')).toBe(null);
  expect(close).not.toHaveBeenCalled();
});
it('repositions on nested scrolling and viewport resize', () => {
  setup();
  const button = screen.getByRole('button');
  let y = 100;
  button.getBoundingClientRect = () => new DOMRect(100, y, 40, 20);
  act(() => button.focus());
  const tooltip = screen.getByRole('tooltip');
  expect(tooltip.style.top).toBe('92px');
  y = 200;
  fireEvent.scroll(button);
  expect(tooltip.style.top).toBe('192px');
  y = 250;
  fireEvent(window, new Event('resize'));
  expect(tooltip.style.top).toBe('242px');
});
it('copies custom theme tokens, color scheme and inherited direction', () => {
  const parent = document.createElement('div');
  parent.dir = 'rtl';
  const trigger = document.createElement('button');
  const target = document.createElement('div');
  parent.append(trigger);
  document.body.append(parent);
  trigger.style.setProperty('--color-surface-raised', 'purple');
  trigger.style.setProperty('--space-2', '11px');
  trigger.style.colorScheme = 'dark';
  copyTooltipTheme(trigger, target);
  expect(target.style.getPropertyValue('--color-surface-raised')).toBe('purple');
  expect(target.style.getPropertyValue('--space-2')).toBe('11px');
  expect(target.style.colorScheme).toBe('dark');
  expect(target.dir).toBe('rtl');
  parent.remove();
});

it('Escape cancels a pending hover before it opens', () => {
  setup();
  const button = screen.getByRole('button');
  fireEvent.pointerEnter(button);
  advance(250);
  fireEvent.keyDown(button, { key: 'Escape' });
  advance(500);
  expect(screen.queryByRole('tooltip')).toBe(null);
  fireEvent.pointerLeave(button);
  fireEvent.pointerEnter(button);
  advance(500);
  expect(screen.getByRole('tooltip')).toBeTruthy();
});

it('repositions when element dimensions change and releases its size observer', () => {
  const observers: {
    callback: ResizeObserverCallback;
    elements: Element[];
    disconnected: boolean;
  }[] = [];
  class Observer {
    state: (typeof observers)[number];
    constructor(callback: ResizeObserverCallback) {
      this.state = { callback, elements: [], disconnected: false };
      observers.push(this.state);
    }
    observe(element: Element) {
      this.state.elements.push(element);
    }
    disconnect() {
      this.state.disconnected = true;
    }
  }
  vi.stubGlobal('ResizeObserver', Observer);
  try {
    const { unmount } = setup();
    const button = screen.getByRole('button');
    button.getBoundingClientRect = () => new DOMRect(100, 100, 40, 20);
    act(() => button.focus());
    const tooltip = screen.getByRole('tooltip');
    tooltip.getBoundingClientRect = () => new DOMRect(0, 0, 60, 30);
    act(() => observers[0]!.callback([], {} as ResizeObserver));
    expect(tooltip.style.top).toBe('62px');
    expect(observers[0]!.elements).toEqual([button, tooltip]);
    unmount();
    expect(observers[0]!.disconnected).toBe(true);
  } finally {
    vi.unstubAllGlobals();
  }
});

it('allows a new trigger interaction after Escape ends tooltip-only hover', () => {
  setup();
  const button = screen.getByRole('button');
  fireEvent.pointerEnter(button);
  advance(500);
  fireEvent.pointerLeave(button);
  fireEvent.pointerEnter(screen.getByRole('tooltip'));
  fireEvent.keyDown(document.body, { key: 'Escape' });
  expect(screen.queryByRole('tooltip')).toBe(null);
  fireEvent.pointerEnter(button);
  advance(500);
  expect(screen.getByRole('tooltip')).toBeTruthy();
});
