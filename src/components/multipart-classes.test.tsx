import { createRef } from 'preact';
import type { JSX } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, expect, it } from 'vitest';
import { ConfirmDialog, DialogHeader, EmptyState, InfoBar, Modal, PageHeader } from '../index';

afterEach(cleanup);
const signal = (value: string | undefined): JSX.SignalLike<string | undefined> => ({
  value,
  peek: () => value,
  subscribe: () => () => {},
});

it('styles the owned PageHeader parts without adding a wrapper or leaking classes', () => {
  const { container } = render(
    <PageHeader
      title="Page"
      description="Description"
      actions={<button>Action</button>}
      notices="Notice"
      class={signal(undefined)}
      className="fallback"
      classes={{
        root: signal('page-root'),
        content: 'page-content',
        title: 'page-title',
        description: 'page-description',
        actions: 'page-actions',
        notices: 'page-notices',
      }}
    />,
  );
  const header = container.querySelector('header')!;
  expect(header.parentElement).toBe(container);
  expect(header.classList.contains('fallback')).toBe(true);
  expect(header.classList.contains('page-root')).toBe(true);
  expect(header.firstElementChild?.classList.contains('page-content')).toBe(true);
  expect(screen.getByRole('heading').classList.contains('page-title')).toBe(true);
  expect(screen.getByText('Description').classList.contains('page-description')).toBe(true);
  expect(screen.getByRole('button').parentElement?.classList.contains('page-actions')).toBe(true);
  expect(header.nextElementSibling?.classList.contains('page-notices')).toBe(true);
  expect(container.querySelector('[classes]')).toBeNull();
});

it('styles EmptyState icon/title/content and suppresses fallback for an empty class', () => {
  render(
    <EmptyState
      title="Empty"
      class={signal('')}
      className="fallback"
      classes={{
        root: 'empty-root',
        icon: signal('empty-icon'),
        title: 'empty-title',
        content: 'empty-content',
      }}
    >
      Content
    </EmptyState>,
  );
  const root = screen.getByRole('status');
  expect(root.classList.contains('empty-root')).toBe(true);
  expect(root.classList.contains('fallback')).toBe(false);
  expect(root.querySelector('svg')?.classList.contains('empty-icon')).toBe(true);
  expect(screen.getByRole('heading').classList.contains('empty-title')).toBe(true);
  expect(screen.getByText('Content').classList.contains('empty-content')).toBe(true);
  expect(root.hasAttribute('classes')).toBe(false);
});

it('styles InfoBar and DialogHeader slots on their semantic elements', () => {
  render(
    <>
      <InfoBar
        title="Notice"
        class="primary"
        className="fallback"
        classes={{ root: 'info-root', title: signal('info-title'), content: 'info-content' }}
      >
        Message
      </InfoBar>
      <DialogHeader
        id="heading"
        title="Dialog"
        description="Details"
        className="fallback"
        classes={{
          root: 'header-root',
          title: 'header-title',
          description: signal('header-description'),
        }}
      />
    </>,
  );
  const info = screen.getByRole('status');
  expect(info.classList.contains('primary')).toBe(true);
  expect(info.classList.contains('fallback')).toBe(false);
  expect(info.classList.contains('info-root')).toBe(true);
  expect(screen.getByText('Notice').classList.contains('info-title')).toBe(true);
  expect(screen.getByText('Message').classList.contains('info-content')).toBe(true);
  const heading = screen.getByRole('heading');
  expect(heading.id).toBe('heading');
  expect(heading.classList.contains('header-title')).toBe(true);
  expect(heading.parentElement?.classList.contains('header-root')).toBe(true);
  expect(heading.parentElement?.classList.contains('fallback')).toBe(true);
  expect(screen.getByText('Details').classList.contains('header-description')).toBe(true);
  expect(document.querySelector('[classes]')).toBeNull();
});

it('styles the Modal dialog and portal backdrop without changing the ref target', () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <Modal
      ref={ref}
      labelledBy="title"
      initialFocusRef={createRef<HTMLElement>()}
      onClose={() => {}}
      class="primary"
      className="fallback"
      classes={{ root: signal('modal-root'), backdrop: signal('modal-backdrop') }}
    >
      <h2 id="title">Modal</h2>
    </Modal>,
  );
  const dialog = screen.getByRole('dialog');
  expect(ref.current).toBe(dialog);
  expect(dialog.classList.contains('modal-root')).toBe(true);
  expect(dialog.classList.contains('primary')).toBe(true);
  expect(dialog.classList.contains('fallback')).toBe(false);
  expect(dialog.parentElement?.classList.contains('modal-backdrop')).toBe(true);
  expect(dialog.parentElement?.parentElement).toBe(document.body);
  expect(document.querySelector('[classes]')).toBeNull();
});

it('delegates ConfirmDialog slots while preserving accessible title and initial focus', () => {
  render(
    <ConfirmDialog
      title="Confirm"
      cancelLabel="Cancel"
      confirmLabel="Confirm action"
      pendingLabel="Pending"
      onClose={() => {}}
      onConfirm={() => {}}
      class={signal(undefined)}
      className="fallback"
      classes={{
        root: 'confirm-root',
        backdrop: 'confirm-backdrop',
        header: 'confirm-header',
        title: signal('confirm-title'),
        body: 'confirm-body',
        footer: 'confirm-footer',
        cancelButton: 'confirm-cancel',
        confirmButton: 'confirm-button',
      }}
    >
      Body
    </ConfirmDialog>,
  );
  const dialog = screen.getByRole('dialog', { name: 'Confirm' });
  expect(dialog.classList.contains('confirm-root')).toBe(true);
  expect(dialog.classList.contains('fallback')).toBe(true);
  expect(dialog.parentElement?.classList.contains('confirm-backdrop')).toBe(true);
  expect(screen.getByRole('heading').classList.contains('confirm-title')).toBe(true);
  expect(screen.getByRole('heading').parentElement?.classList.contains('confirm-header')).toBe(
    true,
  );
  expect(screen.getByText('Body').classList.contains('confirm-body')).toBe(true);
  const cancel = screen.getByRole('button', { name: 'Cancel' });
  expect(cancel.classList.contains('confirm-cancel')).toBe(true);
  expect(cancel.parentElement?.classList.contains('confirm-footer')).toBe(true);
  expect(
    screen.getByRole('button', { name: 'Confirm action' }).classList.contains('confirm-button'),
  ).toBe(true);
  expect(document.activeElement).toBe(cancel);
  expect(document.querySelector('[classes]')).toBeNull();
});
