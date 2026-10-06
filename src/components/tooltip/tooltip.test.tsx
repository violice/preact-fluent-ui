import { tooltipPosition } from './tooltip.styles';
const topProperty = Object.keys(tooltipPosition({ top: 0, left: 0, maxWidth: 280 }).style)[0];
import { signal } from '@preact/signals';
import { createRef } from 'preact';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Tooltip } from './tooltip';
import { Modal } from '../dialog/modal';
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
  expect(tooltip.style.getPropertyValue(topProperty)).toBe('92px');
  y = 200;
  fireEvent.scroll(button);
  expect(tooltip.style.getPropertyValue(topProperty)).toBe('192px');
  y = 250;
  fireEvent(window, new Event('resize'));
  expect(tooltip.style.getPropertyValue(topProperty)).toBe('242px');
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
    expect(tooltip.style.getPropertyValue(topProperty)).toBe('62px');
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

it('updates ancestor tokens, scheme and direction while visible without geometry events', async () => {
  const { container, unmount } = render(
    <div
      dir="ltr"
      style={{
        '--color-surface-raised': 'white',
        '--pfui-colors-surface-raised': 'pink',
        colorScheme: 'light',
      }}
    >
      <Tooltip content="Description">{(props) => <button {...props}>Action</button>}</Tooltip>
    </div>,
  );
  const ancestor = container.firstElementChild as HTMLElement;
  const button = screen.getByRole('button');
  button.getBoundingClientRect = () => new DOMRect(100, 100, 40, 20);
  act(() => button.focus());
  const tooltip = screen.getByRole('tooltip');
  expect(tooltip.style.getPropertyValue('--color-surface-raised')).toBe('white');
  expect(tooltip.style.getPropertyValue('--pfui-colors-surface-raised')).toBe('pink');
  await act(async () => {
    ancestor.style.setProperty('--color-surface-raised', 'purple');
    ancestor.style.colorScheme = 'dark';
    ancestor.dir = 'rtl';
    await Promise.resolve();
  });
  expect(tooltip.style.getPropertyValue('--color-surface-raised')).toBe('purple');
  expect(tooltip.style.colorScheme).toBe('dark');
  expect(tooltip.dir).toBe('rtl');
  expect(tooltip.style.getPropertyValue(topProperty)).toBe('92px');
  unmount();
  await act(async () => {
    ancestor.style.setProperty('--color-surface-raised', 'orange');
    await Promise.resolve();
  });
  expect(tooltip.style.getPropertyValue('--color-surface-raised')).toBe('purple');
});

it('updates class-based stylesheet themes when head CSS changes without geometry events', async () => {
  const sheet = document.createElement('style');
  sheet.textContent =
    '.tooltip-test-theme { --color-text: green; } .tooltip-test-alternate { --color-text: purple; }';
  document.head.append(sheet);
  try {
    render(
      <div class="tooltip-test-theme">
        <Tooltip content="Description">{(props) => <button {...props}>Action</button>}</Tooltip>
      </div>,
    );
    act(() => screen.getByRole('button').focus());
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.style.getPropertyValue('--color-text')).toBe('green');
    await act(async () => {
      screen.getByRole('button').parentElement!.className = 'tooltip-test-alternate';
      await Promise.resolve();
    });
    expect(tooltip.style.getPropertyValue('--color-text')).toBe('purple');
    await act(async () => {
      sheet.textContent = '.tooltip-test-alternate { --color-text: blue; }';
      await Promise.resolve();
    });
    expect(tooltip.style.getPropertyValue('--color-text')).toBe('blue');
  } finally {
    sheet.remove();
  }
});

it('refreshes system theme changes and releases media subscriptions on dismissal', () => {
  const queries = new Map<string, EventTarget>();
  vi.stubGlobal('matchMedia', (query: string) => {
    const events = new EventTarget();
    queries.set(query, events);
    return events;
  });
  try {
    setup();
    const button = screen.getByRole('button');
    button.style.setProperty('--color-text', 'green');
    act(() => button.focus());
    const tooltip = screen.getByRole('tooltip');
    button.style.setProperty('--color-text', 'purple');
    act(() => {
      queries.get('(prefers-color-scheme: dark)')?.dispatchEvent(new Event('change'));
    });
    expect(tooltip.style.getPropertyValue('--color-text')).toBe('purple');
    button.style.setProperty('--color-text', 'blue');
    act(() => {
      queries.get('(forced-colors: active)')?.dispatchEvent(new Event('change'));
    });
    expect(tooltip.style.getPropertyValue('--color-text')).toBe('blue');
    fireEvent.keyDown(button, { key: 'Escape' });
    button.style.setProperty('--color-text', 'orange');
    act(() => {
      for (const events of queries.values()) events.dispatchEvent(new Event('change'));
    });
    expect(tooltip.style.getPropertyValue('--color-text')).toBe('blue');
  } finally {
    vi.unstubAllGlobals();
  }
});

it('clears copied tokens when their source declaration is removed', async () => {
  const { container } = render(
    <div style={{ '--color-text': 'purple' }}>
      <Tooltip content="Description">{(props) => <button {...props}>Action</button>}</Tooltip>
    </div>,
  );
  const ancestor = container.firstElementChild as HTMLElement;
  act(() => screen.getByRole('button').focus());
  const tooltip = screen.getByRole('tooltip');
  expect(tooltip.style.getPropertyValue('--color-text')).toBe('purple');
  await act(async () => {
    ancestor.style.removeProperty('--color-text');
    await Promise.resolve();
  });
  expect(tooltip.style.getPropertyValue('--color-text')).toBe('');
});

function renderTooltipPair() {
  return render(
    <>
      <Tooltip content="First description">{(props) => <button {...props}>First</button>}</Tooltip>
      <Tooltip content="Second description">
        {(props) => <button {...props}>Second</button>}
      </Tooltip>
    </>,
  );
}

it('Escape dismisses focused and hovered tooltip instances together', () => {
  renderTooltipPair();
  act(() => screen.getByRole('button', { name: 'First' }).focus());
  fireEvent.pointerEnter(screen.getByRole('button', { name: 'Second' }));
  advance(500);
  expect(screen.getAllByRole('tooltip')).toHaveLength(2);
  fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
  expect(screen.queryAllByRole('tooltip')).toHaveLength(0);
  advance(500);
  expect(screen.queryAllByRole('tooltip')).toHaveLength(0);
});

it('Escape dismisses both tooltips during focus handoff before the leave grace period', () => {
  renderTooltipPair();
  act(() => screen.getByRole('button', { name: 'First' }).focus());
  act(() => screen.getByRole('button', { name: 'Second' }).focus());
  expect(screen.getAllByRole('tooltip')).toHaveLength(2);
  fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
  expect(screen.queryAllByRole('tooltip')).toHaveLength(0);
});

it('Escape cancels a pending first hover and dismisses a visible second tooltip', () => {
  renderTooltipPair();
  fireEvent.pointerEnter(screen.getByRole('button', { name: 'First' }));
  act(() => screen.getByRole('button', { name: 'Second' }).focus());
  expect(screen.getAllByRole('tooltip')).toHaveLength(1);
  fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
  expect(screen.queryAllByRole('tooltip')).toHaveLength(0);
  advance(500);
  expect(screen.queryAllByRole('tooltip')).toHaveLength(0);
});

it('first Modal Escape dismisses every tooltip and second Escape closes the dialog', () => {
  const ref = createRef<HTMLButtonElement>();
  const close = vi.fn();
  render(
    <Modal labelledBy="pair-title" initialFocusRef={ref} onClose={close}>
      <h2 id="pair-title">Dialog</h2>
      <Tooltip content="First description" triggerProps={{ ref }}>
        {(props) => <button {...props}>First</button>}
      </Tooltip>
      <Tooltip content="Second description">
        {(props) => <button {...props}>Second</button>}
      </Tooltip>
    </Modal>,
  );
  act(() => screen.getByRole('button', { name: 'First' }).focus());
  fireEvent.pointerEnter(screen.getByRole('button', { name: 'Second' }));
  advance(500);
  expect(screen.getAllByRole('tooltip')).toHaveLength(2);
  fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
  expect(screen.queryAllByRole('tooltip')).toHaveLength(0);
  expect(close).not.toHaveBeenCalled();
  fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
  expect(close).toHaveBeenCalledTimes(1);
});

it('resolves portal class aliases from signal values', () => {
  const primary = signal<string | undefined>(undefined);
  render(
    <Tooltip content="Description" class={primary} className="fallback">
      {(props) => <button {...props}>Action</button>}
    </Tooltip>,
  );
  act(() => screen.getByRole('button').focus());
  const tooltip = screen.getByRole('tooltip');
  expect(tooltip.classList.contains('fallback')).toBe(true);
  act(() => {
    primary.value = 'primary';
  });
  expect(tooltip.classList.contains('primary')).toBe(true);
  expect(tooltip.classList.contains('fallback')).toBe(false);
  act(() => {
    primary.value = '';
  });
  expect(tooltip.classList.contains('primary')).toBe(false);
  expect(tooltip.classList.contains('fallback')).toBe(false);
});
