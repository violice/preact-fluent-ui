import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { useState } from 'preact/hooks';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { ConfirmDialog } from './confirm-dialog';

afterEach(cleanup);

const labels = { cancelLabel: 'Cancel', confirmLabel: 'Delete', pendingLabel: 'Deleting...' };

it('uses required English labels and starts on cancel', async () => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();
  render(
    <ConfirmDialog title="Delete profile?" {...labels} onClose={onClose} onConfirm={onConfirm}>
      Cannot be undone.
    </ConfirmDialog>,
  );
  const dialog = screen.getByRole('dialog', { name: 'Delete profile?' });
  expect(dialog.textContent).toBe('Delete profile?Cannot be undone.CancelDelete');
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }));
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Delete' }));
  expect(onConfirm).toHaveBeenCalledOnce();
  await user.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(onClose).toHaveBeenCalledOnce();
});

it('creates a new accessible title id after remounting in an app', async () => {
  const props = {
    title: 'Delete?',
    ...labels,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    children: 'Details',
  };
  function App() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open</button>
        {open && <ConfirmDialog {...props} onClose={() => setOpen(false)} />}
      </>
    );
  }
  render(<App />);
  const firstId = screen.getByRole('dialog').getAttribute('aria-labelledby');
  expect(firstId).toBeTruthy();
  expect(document.getElementById(firstId!)?.textContent).toBe('Delete?');
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Cancel' }));
  await user.click(screen.getByRole('button', { name: 'Open' }));
  const secondId = screen.getByRole('dialog').getAttribute('aria-labelledby');
  expect(secondId).not.toBe(firstId);
  expect(document.getElementById(secondId!)?.textContent).toBe('Delete?');
});

it.each([true, false])(
  'blocks all close and confirm actions while busy, initially busy = %s',
  async (initiallyBusy) => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    const props = { title: 'Delete?', ...labels, onClose, onConfirm, children: 'Details' };
    const { rerender } = render(<ConfirmDialog {...props} busy={initiallyBusy} />);
    if (!initiallyBusy) {
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }));
      rerender(<ConfirmDialog {...props} busy />);
    }
    const dialog = screen.getByRole('dialog');
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const confirm = screen.getByRole('button', { name: 'Deleting...' });
    expect((cancel as HTMLButtonElement).disabled).toBe(true);
    expect((confirm as HTMLButtonElement).disabled).toBe(true);
    expect(document.activeElement).toBe(dialog);
    const user = userEvent.setup();
    for (let attempt = 0; attempt < 2; attempt++) {
      await user.click(cancel);
      await user.click(confirm);
      await user.keyboard('{Escape}');
      await user.click(dialog.parentElement!);
      // Synthetic dispatch also covers guarded callbacks independently of native disabled behavior.
      fireEvent.click(cancel);
      fireEvent.click(confirm);
      expect(onClose).not.toHaveBeenCalled();
      expect(onConfirm).not.toHaveBeenCalled();
      await user.tab();
      expect(document.activeElement).toBe(dialog);
    }
    rerender(<ConfirmDialog {...props} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onConfirm).not.toHaveBeenCalled();
  },
);

it('confirmDisabled blocks only confirmation', async () => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();
  render(
    <ConfirmDialog
      title="Delete?"
      {...labels}
      confirmDisabled
      onClose={onClose}
      onConfirm={onConfirm}
    >
      Details
    </ConfirmDialog>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Delete' }));
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  expect(onConfirm).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(onClose).toHaveBeenCalledOnce();
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(2);
});
