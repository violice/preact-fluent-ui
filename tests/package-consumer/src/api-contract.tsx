import { createRef } from 'preact';
import type { Ref } from 'preact';
import {
  Button,
  Card,
  ConfirmDialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  EmptyState,
  Icon,
  InfoBar,
  Modal,
  PageHeader,
  Select,
  StatusBadge,
} from '@violice/preact-fluent-ui';
import type {
  ButtonProps,
  CardProps,
  ConfirmDialogProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogHeaderProps,
  EmptyStateProps,
  IconName,
  IconProps,
  InfoBarProps,
  ModalProps,
  PageHeaderProps,
  SelectProps,
  StatusBadgeProps,
} from '@violice/preact-fluent-ui';

// The export map must reject source imports, even with bundler module resolution.
// @ts-expect-error Internal source paths are closed.
import type { ButtonProps as InternalButtonProps } from '@violice/preact-fluent-ui/src/components/button';
// @ts-expect-error Unknown variants must fail.
const badButton: ButtonProps = { variant: 'unknown' };
// @ts-expect-error Unknown icons must fail.
const badName: IconName = 'unknown';
// @ts-expect-error Icon sizes are exactly 16, 20 and 24.
const badIcon: IconProps = { name: 'add', size: 18 };
// @ts-expect-error All three localized labels are mandatory.
const badConfirm: ConfirmDialogProps = {
  title: 'Delete?',
  children: 'Profile',
  onClose() {},
  onConfirm() {},
};
export type NegativeContracts = [
  InternalButtonProps,
  typeof badButton,
  typeof badName,
  typeof badIcon,
  typeof badConfirm,
];

function refFor<T extends Element>(callback: boolean): Ref<T> {
  return callback
    ? (element: T | null) => {
        element?.getAttribute('id');
      }
    : createRef<T>();
}

export function ApiContract({ callback = false }: { callback?: boolean }) {
  const classes = { class: 'first', className: 'second' };
  const button: ButtonProps = {
    ...classes,
    type: 'submit',
    form: 'form',
    variant: 'primary',
    size: 'compact',
    onClick: (event) => {
      event.currentTarget.disabled = true;
    },
  };
  const card: CardProps = {
    ...classes,
    id: 'card',
    tabIndex: 0,
    onFocus: (event) => {
      event.currentTarget.dataset.focused = 'true';
    },
  };
  const info: InfoBarProps = {
    ...classes,
    tone: 'warning',
    title: 'Notice',
    'aria-live': 'polite',
    onClick: (event) => {
      event.currentTarget.hidden = false;
    },
  };
  const badge: StatusBadgeProps = {
    ...classes,
    tone: 'success',
    title: 'Status',
    onClick: (event) => {
      event.currentTarget.textContent = 'Ready';
    },
  };
  const icon: IconProps = {
    ...classes,
    name: 'network',
    size: 24,
    id: 'icon',
    onClick: (event) => {
      event.currentTarget.setAttribute('data-clicked', 'true');
    },
  };
  const select: SelectProps = {
    ...classes,
    name: 'mode',
    value: 'local',
    required: true,
    wrapperClassName: 'wrapper',
    onChange: (event) => {
      event.currentTarget.value = 'local';
    },
  };
  const page: PageHeaderProps = {
    ...classes,
    title: 'Profiles',
    description: 'Select a profile',
    actions: <Button>Save</Button>,
    notices: <InfoBar>Ready</InfoBar>,
    onClick: (event) => {
      event.currentTarget.dataset.clicked = 'true';
    },
  };
  const empty: EmptyStateProps = {
    ...classes,
    title: 'Empty',
    icon: 'routes',
    'aria-live': 'polite',
    onClick: (event) => {
      event.currentTarget.hidden = false;
    },
  };
  const header: DialogHeaderProps = {
    ...classes,
    id: 'dialog-title',
    title: 'Dialog',
    description: <span>Description</span>,
    onClick: (event) => {
      event.currentTarget.hidden = false;
    },
  };
  const body: DialogBodyProps = {
    ...classes,
    id: 'body',
    onClick: (event) => {
      event.currentTarget.hidden = false;
    },
  };
  const footer: DialogFooterProps = {
    ...classes,
    id: 'footer',
    onClick: (event) => {
      event.currentTarget.hidden = false;
    },
  };
  const initial = createRef<HTMLButtonElement>();
  const modal: ModalProps = {
    ...classes,
    labelledBy: header.id,
    initialFocusRef: initial,
    fallbackFocusRef: initial,
    children: <Button ref={initial}>Close</Button>,
    onClose() {},
    onKeyDown: (event) => {
      event.currentTarget.dataset.key = event.key;
    },
    id: 'modal',
  };
  const confirm: ConfirmDialogProps = {
    title: 'Delete?',
    children: 'Profile',
    cancelLabel: 'Cancel',
    confirmLabel: 'Delete',
    pendingLabel: 'Deleting',
    busy: false,
    danger: true,
    confirmDisabled: false,
    fallbackFocusRef: initial,
    onClose() {},
    onConfirm() {},
  };
  return (
    <>
      <Button {...button} ref={refFor<HTMLButtonElement>(callback)}>
        Save
      </Button>
      <Card {...card} ref={refFor<HTMLElement>(callback)}>
        Profile
      </Card>
      <InfoBar {...info} ref={refFor<HTMLDivElement>(callback)}>
        Notice
      </InfoBar>
      <StatusBadge {...badge} ref={refFor<HTMLSpanElement>(callback)}>
        Ready
      </StatusBadge>
      <Icon {...icon} ref={refFor<SVGSVGElement>(callback)} />
      <Select {...select} ref={refFor<HTMLSelectElement>(callback)}>
        <option value="local">Local</option>
      </Select>
      <PageHeader {...page} ref={refFor<HTMLElement>(callback)} />
      <EmptyState {...empty} ref={refFor<HTMLElement>(callback)}>
        Create a profile.
      </EmptyState>
      <DialogHeader {...header} ref={refFor<HTMLElement>(callback)} />
      <DialogBody {...body} ref={refFor<HTMLDivElement>(callback)}>
        Body
      </DialogBody>
      <DialogFooter {...footer} ref={refFor<HTMLElement>(callback)}>
        Footer
      </DialogFooter>
      <Modal {...modal} ref={refFor<HTMLDivElement>(callback)} />
      <ConfirmDialog {...confirm} />
    </>
  );
}
