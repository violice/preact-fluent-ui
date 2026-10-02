import { createRef } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { Modal } from './modal';

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
  document.body.style.overflow = '';
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
