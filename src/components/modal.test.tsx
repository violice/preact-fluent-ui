import { createRef } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { Modal } from './modal';

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
  document.body.removeAttribute('style');
  document.body.removeAttribute('tabindex');
});

it('portals to body, locks the background and wraps keyboard focus', async () => {
  const first = createRef<HTMLButtonElement>();
  const onClose = vi.fn();
  const { container } = render(
    <Modal labelledBy="title" initialFocusRef={first} onClose={onClose}>
      <h2 id="title">Dialog</h2>
      <button ref={first}>Cancel</button>
      <button disabled>Unavailable</button>
      <button>Confirm</button>
    </Modal>,
  );
  const dialog = screen.getByRole('dialog');
  expect(document.body.contains(dialog)).toBe(true);
  expect(container.contains(dialog)).toBe(false);
  expect(container.hasAttribute('inert')).toBe(true);
  expect(document.body.style.overflow).toBe('hidden');
  expect(document.activeElement).toBe(first.current);
  const user = userEvent.setup();
  await user.tab({ shift: true });
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Confirm' }));
  await user.tab();
  expect(document.activeElement).toBe(first.current);
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledOnce();
});

it('filters unavailable controls and follows positive tabindex before document order', async () => {
  render(
    <Modal labelledBy="title" initialFocusRef={createRef<HTMLElement>()} onClose={vi.fn()}>
      <h2 id="title">Dialog</h2>
      <button>Zero</button>
      <button tabIndex={2}>Second</button>
      <button tabIndex={1}>First</button>
      <button hidden>Hidden</button>
      <div hidden>
        <button>Hidden ancestor</button>
      </div>
      <div aria-hidden="true">
        <button>Aria hidden</button>
      </div>
      <div inert>
        <button>Inert</button>
      </div>
      <div style={{ display: 'none' }}>
        <button>Display none</button>
      </div>
      <div style={{ visibility: 'hidden' }}>
        <button>Invisible</button>
      </div>
      <fieldset disabled>
        <button>Disabled fieldset</button>
      </fieldset>
      <button disabled>Disabled</button>
      <button tabIndex={-1}>Negative</button>
      <input type="hidden" />
      <a href="#last">Last</a>
    </Modal>,
  );
  const user = userEvent.setup();
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'First' }));
  for (const name of ['Second', 'Zero', 'Last', 'First']) {
    await user.tab();
    expect(document.activeElement?.textContent).toBe(name);
  }
  await user.tab({ shift: true });
  expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Last' }));
});

it.each(['disabled', 'hidden', 'outside', 'detached'] as const)(
  'rejects an %s initial focus target',
  (kind) => {
    const initial = createRef<HTMLButtonElement>();
    if (kind === 'outside' || kind === 'detached') {
      initial.current = document.createElement('button');
      if (kind === 'outside') document.body.append(initial.current);
    }
    render(
      <Modal labelledBy="title" initialFocusRef={initial} onClose={vi.fn()}>
        <h2 id="title">Dialog</h2>
        {(kind === 'hidden' || kind === 'disabled') && (
          <button ref={initial} hidden={kind === 'hidden'} disabled={kind === 'disabled'}>
            Invalid
          </button>
        )}
        <button>Available</button>
      </Modal>,
    );
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Available' }));
  },
);

it('focuses an empty dialog and keeps Tab inside it', () => {
  render(
    <Modal labelledBy="empty-title" initialFocusRef={createRef<HTMLElement>()} onClose={vi.fn()}>
      <h2 id="empty-title">Empty</h2>
    </Modal>,
  );
  const dialog = screen.getByRole('dialog');
  expect(document.activeElement).toBe(dialog);
  expect(dialog.tabIndex).toBe(-1);
  for (const shiftKey of [false, true]) {
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey,
      bubbles: true,
      cancelable: true,
    });
    dialog.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(dialog);
  }
});

it('closes on the backdrop while preserving native props, classes, ref and cancelled keyboard handlers', () => {
  const ref = createRef<HTMLDivElement>();
  const initial = createRef<HTMLButtonElement>();
  const onClose = vi.fn();
  const onClick = vi.fn();
  const onKeyDown = vi.fn((event: KeyboardEvent) => event.preventDefault());
  render(
    <Modal
      ref={ref}
      labelledBy="title"
      initialFocusRef={initial}
      onClose={onClose}
      class="first"
      className="second"
      data-testid="dialog"
      aria-describedby="description"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <h2 id="title">Dialog</h2>
      <p id="description">Description</p>
      <button ref={initial}>Cancel</button>
    </Modal>,
  );
  const dialog = screen.getByRole('dialog');
  expect(ref.current).toBe(dialog);
  expect(dialog.getAttribute('aria-modal')).toBe('true');
  expect(dialog.getAttribute('aria-labelledby')).toBe('title');
  expect(dialog.getAttribute('aria-describedby')).toBe('description');
  expect(dialog.getAttribute('data-testid')).toBe('dialog');
  expect(dialog.tabIndex).toBe(0);
  expect(dialog.classList.contains('first')).toBe(true);
  expect(dialog.classList.contains('second')).toBe(true);
  expect(dialog.classList.length).toBeGreaterThan(2);
  for (const prop of ['labelledBy', 'initialFocusRef', 'fallbackFocusRef', 'onClose'])
    expect(dialog.hasAttribute(prop)).toBe(false);
  fireEvent.click(initial.current!);
  expect(onClick).toHaveBeenCalledOnce();
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.keyDown(initial.current!, { key: 'Tab' });
  expect(document.activeElement).toBe(initial.current);
  fireEvent.keyDown(initial.current!, { key: 'Escape' });
  expect(onKeyDown).toHaveBeenCalledTimes(2);
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.click(dialog.parentElement!);
  expect(onClose).toHaveBeenCalledOnce();
});

it('uses a provided fallback when opening without a focusable opener', async () => {
  const fallback = createRef<HTMLButtonElement>();
  render(<button ref={fallback}>Fallback</button>);
  const { unmount } = render(
    <Modal
      labelledBy="title"
      initialFocusRef={createRef<HTMLElement>()}
      fallbackFocusRef={fallback}
      onClose={vi.fn()}
    >
      <h2 id="title">Dialog</h2>
    </Modal>,
  );
  unmount();
  await waitFor(() => expect(document.activeElement).toBe(fallback.current));
});

it('redirects background focus into the dialog', () => {
  const background = document.createElement('button');
  document.body.append(background);
  render(
    <Modal labelledBy="title" initialFocusRef={createRef<HTMLElement>()} onClose={vi.fn()}>
      <h2 id="title">Dialog</h2>
      <button>Available</button>
    </Modal>,
  );
  background.focus();
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Available' }));
});

it('uses updated callbacks without restoring focus or unlocking the background', async () => {
  const opener = document.createElement('button');
  document.body.append(opener);
  opener.focus();
  const initial = createRef<HTMLButtonElement>();
  const firstClose = vi.fn();
  const nextClose = vi.fn();
  const { container, rerender, unmount } = render(
    <Modal labelledBy="title" initialFocusRef={initial} onClose={firstClose}>
      <h2 id="title">Dialog</h2>
      <button ref={initial}>Cancel</button>
      <button>Confirm</button>
    </Modal>,
  );
  screen.getByRole('button', { name: 'Confirm' }).focus();
  rerender(
    <Modal labelledBy="title" initialFocusRef={initial} onClose={nextClose}>
      <h2 id="title">Dialog</h2>
      <button ref={initial}>Cancel</button>
      <button>Confirm</button>
    </Modal>,
  );
  await Promise.resolve();
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Confirm' }));
  expect(container.hasAttribute('inert')).toBe(true);
  expect(document.body.style.overflow).toBe('hidden');
  fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
  expect(firstClose).not.toHaveBeenCalled();
  expect(nextClose).toHaveBeenCalledOnce();
  unmount();
  await waitFor(() => expect(document.activeElement).toBe(opener));
});

function FocusExample({ openerState }: { openerState: 'connected' | 'removed' | 'disabled' }) {
  const [open, setOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const initial = useRef<HTMLButtonElement>(null);
  const fallback = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={fallback}>Fallback</button>
      {!(finished && openerState === 'removed') && (
        <button disabled={finished && openerState === 'disabled'} onClick={() => setOpen(true)}>
          Opener
        </button>
      )}
      {open && (
        <Modal
          labelledBy="title"
          initialFocusRef={initial}
          fallbackFocusRef={fallback}
          onClose={() => setOpen(false)}
        >
          <h2 id="title">Dialog</h2>
          <button
            ref={initial}
            onClick={() => {
              setFinished(true);
              setOpen(false);
            }}
          >
            Finish
          </button>
        </Modal>
      )}
    </>
  );
}

it.each(['connected', 'removed', 'disabled'] as const)(
  'restores focus when the opener is %s',
  async (openerState) => {
    const user = userEvent.setup();
    const { container } = render(<FocusExample openerState={openerState} />);
    await user.click(screen.getByRole('button', { name: 'Opener' }));
    await user.click(screen.getByRole('button', { name: 'Finish' }));
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole('button', {
          name: openerState === 'connected' ? 'Opener' : 'Fallback',
        }),
      ),
    );
    expect(container.hasAttribute('inert')).toBe(false);
  },
);

it('preserves existing inert and overflow while removing its own background locks', async () => {
  const previous = document.createElement('section');
  previous.setAttribute('inert', 'existing');
  document.body.append(previous);
  document.body.style.setProperty('overflow', 'scroll', 'important');
  const { container, unmount } = render(
    <Modal labelledBy="title" initialFocusRef={createRef<HTMLElement>()} onClose={vi.fn()}>
      <h2 id="title">Dialog</h2>
    </Modal>,
  );
  unmount();
  await Promise.resolve();
  expect(previous.getAttribute('inert')).toBe('existing');
  expect(container.hasAttribute('inert')).toBe(false);
  expect(document.body.style.overflow).toBe('scroll');
  expect(document.body.style.getPropertyPriority('overflow')).toBe('important');
  expect(document.body.hasAttribute('tabindex')).toBe(false);
});

it.each(['disabled', 'detached', 'hidden', 'inert'] as const)(
  'restores body instead of a router link when fallback is %s',
  async (kind) => {
    const link = document.createElement('a');
    link.href = '#page';
    link.setAttribute('aria-current', 'page');
    const fallback = createRef<HTMLElement>();
    const control = document.createElement('button');
    control.disabled = kind === 'disabled';
    control.hidden = kind === 'hidden';
    if (kind === 'inert') control.setAttribute('inert', '');
    fallback.current = control;
    document.body.append(link);
    if (kind !== 'detached') document.body.append(control);
    document.body.setAttribute('tabindex', '4');
    const { unmount } = render(
      <Modal
        labelledBy="title"
        initialFocusRef={createRef<HTMLElement>()}
        fallbackFocusRef={fallback}
        onClose={vi.fn()}
      >
        <h2 id="title">Dialog</h2>
      </Modal>,
    );
    unmount();
    await waitFor(() => expect(document.activeElement).toBe(document.body));
    expect(document.body.getAttribute('tabindex')).toBe('4');
    expect(link).not.toBe(document.activeElement);
  },
);

it('restores mixed overflow priorities without reverting unrelated body style changes', () => {
  document.body.style.setProperty('overflow-x', 'clip', 'important');
  document.body.style.setProperty('overflow-y', 'scroll');
  const { unmount } = render(
    <Modal labelledBy="title" initialFocusRef={createRef<HTMLElement>()} onClose={vi.fn()}>
      <h2 id="title">Dialog</h2>
    </Modal>,
  );
  // jsdom preserves initial longhands when setting a shorthand, unlike Chromium.
  // A real longhand update still exercises restoration of the owned properties.
  document.body.style.setProperty('overflow-x', 'auto');
  document.body.style.setProperty('overflow-y', 'auto', 'important');
  document.body.style.color = 'red';
  unmount();
  expect(document.body.style.getPropertyValue('overflow-x')).toBe('clip');
  expect(document.body.style.getPropertyPriority('overflow-x')).toBe('important');
  expect(document.body.style.getPropertyValue('overflow-y')).toBe('scroll');
  expect(document.body.style.getPropertyPriority('overflow-y')).toBe('');
  expect(document.body.style.color).toBe('red');
});

it('rejects concealed initial focus and skips failed candidates', () => {
  const initial = createRef<HTMLInputElement>();
  render(
    <Modal labelledBy="title" initialFocusRef={initial} onClose={vi.fn()}>
      <h2 id="title">Dialog</h2>

      <details>
        <summary>Disclosure</summary>
        <input ref={initial} />
      </details>
      <button>Footer</button>
    </Modal>,
  );
  expect(document.activeElement?.textContent).toBe('Disclosure');
});

it('continues initial focus after a candidate that cannot receive focus', () => {
  render(
    <Modal labelledBy="title" initialFocusRef={createRef<HTMLElement>()} onClose={vi.fn()}>
      <h2 id="title">Dialog</h2>
      <button
        ref={(element) => {
          if (element) element.focus = () => {};
        }}
      >
        Declines focus
      </button>
      <button>Available</button>
    </Modal>,
  );
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Available' }));
});

it('leaves interior radio Tab and arrow selection to the browser', () => {
  const initial = createRef<HTMLButtonElement>();
  render(
    <Modal labelledBy="title" initialFocusRef={initial} onClose={vi.fn()}>
      <h2 id="title">Dialog</h2>
      <button ref={initial}>Before</button>
      <input type="radio" name="choice" checked />
      <input type="radio" name="choice" />
      <button>After</button>
    </Modal>,
  );
  for (const target of [initial.current!, ...screen.getAllByRole('radio')]) {
    target.focus();
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(target);
  }
});

it('restores the latest fallback ref without unlocking on rerender', async () => {
  const old = createRef<HTMLButtonElement>();
  const next = createRef<HTMLButtonElement>();
  old.current = document.createElement('button');
  next.current = document.createElement('button');
  document.body.append(old.current, next.current);
  const props = {
    labelledBy: 'title',
    initialFocusRef: createRef<HTMLElement>(),
    onClose: vi.fn(),
    children: <button>Inside</button>,
  };
  const { rerender, unmount, container } = render(<Modal {...props} fallbackFocusRef={old} />);
  old.current.remove();
  rerender(<Modal {...props} fallbackFocusRef={next} />);
  expect(container.hasAttribute('inert')).toBe(true);
  expect(document.body.style.overflow).toBe('hidden');
  expect(document.activeElement?.textContent).toBe('Inside');
  unmount();
  await waitFor(() => expect(document.activeElement).toBe(next.current));
});

it('wraps to the selected radio and reads checked updates', () => {
  render(
    <Modal labelledBy="title" initialFocusRef={createRef<HTMLElement>()} onClose={vi.fn()}>
      <h2 id="title">Dialog</h2>
      <input type="radio" name="choice" aria-label="A" />
      <input type="radio" name="choice" aria-label="B" checked />
      <button>End</button>
    </Modal>,
  );
  const [a, b] = screen.getAllByRole('radio') as HTMLInputElement[];
  expect(document.activeElement).toBe(b);
  const end = screen.getByRole('button', { name: 'End' });
  a.checked = true;
  end.focus();
  fireEvent.keyDown(end, { key: 'Tab' });
  expect(document.activeElement).toBe(a);
});

it('wraps a group with no selection to its directional entry', () => {
  render(
    <Modal labelledBy="title" initialFocusRef={createRef<HTMLElement>()} onClose={vi.fn()}>
      <h2 id="title">Dialog</h2>
      <input type="radio" name="choice" aria-label="A" />
      <input type="radio" name="choice" aria-label="B" />
    </Modal>,
  );
  const [a, b] = screen.getAllByRole('radio');
  expect(document.activeElement).toBe(a);
  fireEvent.keyDown(a, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(b);
});

it('keeps unnamed radios and same-name radios with distinct form owners independent', () => {
  render(
    <Modal labelledBy="title" initialFocusRef={createRef<HTMLElement>()} onClose={vi.fn()}>
      <h2 id="title">Dialog</h2>
      <input type="radio" aria-label="Unnamed A" />
      <input type="radio" aria-label="Unnamed B" />
      <form id="one">
        <input type="radio" name="choice" aria-label="Form one" />
      </form>
      <form id="two">
        <input type="radio" name="choice" aria-label="Form two" checked />
      </form>
    </Modal>,
  );
  const radios = screen.getAllByRole('radio');
  for (const radio of radios.slice(0, -1)) {
    radio.focus();
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    radio.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  }
  radios[radios.length - 1]!.focus();
  fireEvent.keyDown(document.activeElement!, { key: 'Tab' });
  expect(document.activeElement).toBe(radios[0]);
});

it('accepts the closed details root as an initial focus target', () => {
  const initial = createRef<HTMLDetailsElement>();
  render(
    <Modal labelledBy="title" initialFocusRef={initial} onClose={vi.fn()}>
      <h2 id="title">Dialog</h2>
      <details ref={initial} tabIndex={0}>
        <summary>Disclosure</summary>
        <input aria-label="Concealed" />
      </details>
      <button>Footer</button>
    </Modal>,
  );
  expect(initial.current!.open).toBe(false);
  expect(document.activeElement).toBe(initial.current);
});
