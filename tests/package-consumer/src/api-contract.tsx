import { createRef } from 'preact';
import { forwardRef } from 'preact/compat';
import type { JSX, Ref } from 'preact';
import {
  AppShell,
  AppShellWorkspace,
  AppShellHeader,
  AppShellContent,
  AppShellFooter,
  useRender,
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
  SidebarBrand,
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  Switch,
  Textarea,
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
  AppShellProps,
  AppShellWorkspaceProps,
  AppShellHeaderProps,
  AppShellContentProps,
  AppShellFooterProps,
  SidebarProps,
  SidebarHeaderProps,
  SidebarNavProps,
  SidebarGroupProps,
  SidebarItemProps,
  SidebarFooterProps,
  SidebarBrandProps,
  SidebarLayout,
  ButtonProps,
  CardProps,
  CheckboxProps,
  FieldControlProps,
  FieldProps,
  InputProps,
  SwitchProps,
  TextareaProps,
  ValidationState,
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

// Each expression must fail for its public prop contract, not module resolution.
// @ts-expect-error Unsupported public props.
const inputCheckbox = <Input type="checkbox" />;
// @ts-expect-error Unsupported public props.
const inputDate = <Input type="date" />;
const fieldState = (
  // @ts-expect-error Unsupported public props.
  <Field label="Name" validationState="invalid">
    {() => null}
  </Field>
);
// @ts-expect-error Unsupported public props.
const fieldChildren = <Field label="Name">Text</Field>;
// @ts-expect-error Unsupported public props.
const switchMixed = <Switch label="Auto" indeterminate />;
// @ts-expect-error Unsupported public props.
const switchType = <Switch label="Auto" type="checkbox" />;
// @ts-expect-error Unsupported public props.
const switchRole = <Switch label="Auto" role="checkbox" />;
// @ts-expect-error Unsupported public props.
const checkboxType = <Checkbox label="Save" type="radio" />;
// @ts-expect-error Unsupported public props.
const fieldLabel = <Field>{() => null}</Field>;
// @ts-expect-error Unsupported public props.
const checkboxLabel = <Checkbox />;
// @ts-expect-error Unsupported public props.
const switchLabel = <Switch />;
// @ts-expect-error Unsupported public props.
const inputSlot = <Input classes={{ root: 'bad' }} />;
// @ts-expect-error Unsupported public props.
const textareaSlot = <Textarea classes={{ root: 'bad' }} />;
const fieldSlot = (
  // @ts-expect-error Unsupported public props.
  <Field label="Label" classes={{ unknown: 'bad' }}>
    {() => null}
  </Field>
);
// @ts-expect-error Unsupported public props.
const checkboxSlot = <Checkbox label="Label" classes={{ unknown: 'bad' }} />;
// @ts-expect-error Unsupported public props.
const switchSlot = <Switch label="Label" classes={{ unknown: 'bad' }} />;
// @ts-expect-error Unsupported public props.
const selectSlot = <Select classes={{ unknown: 'bad' }} />;
// @ts-expect-error Unsupported public props.
const selectWrapper = <Select wrapperClassName="bad" />;
// @ts-expect-error Unsupported public props.
const checkboxWrapper = <Checkbox label="Label" wrapperClassName="bad" />;
// @ts-expect-error Unsupported public props.
const switchWrapper = <Switch label="Label" wrapperClassName="bad" />;
export const formNegativeContracts = [
  inputCheckbox,
  inputDate,
  fieldState,
  fieldChildren,
  switchMixed,
  switchType,
  switchRole,
  checkboxType,
  fieldLabel,
  checkboxLabel,
  switchLabel,
  inputSlot,
  textareaSlot,
  fieldSlot,
  checkboxSlot,
  switchSlot,
  selectSlot,
  selectWrapper,
  checkboxWrapper,
  switchWrapper,
];

const slotSignal: JSX.SignalLike<string | undefined> = {
  value: 'slot',
  peek: () => 'slot',
  subscribe: () => () => {},
};
export const multipartContracts = (
  <>
    <PageHeader
      title="Page"
      description="Description"
      classes={{
        root: slotSignal,
        content: slotSignal,
        title: slotSignal,
        description: slotSignal,
        actions: slotSignal,
        notices: slotSignal,
      }}
    />
    <EmptyState
      title="Empty"
      classes={{ root: slotSignal, icon: slotSignal, title: slotSignal, content: slotSignal }}
    />
    <InfoBar classes={{ root: slotSignal, title: slotSignal, content: slotSignal }} />
    <DialogHeader
      id="title"
      title="Dialog"
      classes={{ root: slotSignal, title: slotSignal, description: slotSignal }}
    />
    <Modal
      labelledBy="title"
      initialFocusRef={createRef()}
      onClose={() => {}}
      classes={{ root: slotSignal, backdrop: slotSignal }}
    >
      Body
    </Modal>
    <ConfirmDialog
      title="Confirm"
      cancelLabel="Cancel"
      confirmLabel="Confirm"
      pendingLabel="Pending"
      onClose={() => {}}
      onConfirm={() => {}}
      class={slotSignal}
      className={slotSignal}
      classes={{
        root: slotSignal,
        backdrop: slotSignal,
        header: slotSignal,
        title: slotSignal,
        body: slotSignal,
        footer: slotSignal,
        cancelButton: slotSignal,
        confirmButton: slotSignal,
      }}
    >
      Body
    </ConfirmDialog>
    {/* @ts-expect-error Unknown PageHeader slot. */}
    <PageHeader title="Page" description="Description" classes={{ unknown: 'bad' }} />
    {/* @ts-expect-error Unknown EmptyState slot. */}
    <EmptyState title="Empty" classes={{ unknown: 'bad' }} />
    {/* @ts-expect-error Unknown InfoBar slot. */}
    <InfoBar classes={{ unknown: 'bad' }} />
    {/* @ts-expect-error Unknown DialogHeader slot. */}
    <DialogHeader id="title" title="Dialog" classes={{ unknown: 'bad' }} />
    <Modal
      labelledBy="title"
      initialFocusRef={createRef()}
      onClose={() => {}}
      // @ts-expect-error Unknown slot.
      classes={{ unknown: 'bad' }}
    >
      Body
    </Modal>
    <ConfirmDialog
      title="Confirm"
      cancelLabel="Cancel"
      confirmLabel="Confirm"
      pendingLabel="Pending"
      onClose={() => {}}
      onConfirm={() => {}}
      // @ts-expect-error Unknown slot.
      classes={{ unknown: 'bad' }}
    >
      Body
    </ConfirmDialog>
  </>
);

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
    classes: { wrapper: 'wrapper' },
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
  const signal: JSX.SignalLike<string | undefined> = {
    value: 'signal-class',
    peek: () => 'signal-class',
    subscribe: () => () => {},
  };
  const state: ValidationState = 'warning';
  const input: InputProps = {
    class: signal,
    className: signal,
    type: 'number',
    onInput: (event) => {
      event.currentTarget.valueAsNumber = 443;
    },
  };
  const textarea: TextareaProps = {
    class: signal,
    className: signal,
    rows: 3,
    onInput: (event) => {
      event.currentTarget.rows = 4;
    },
  };
  const checkbox: CheckboxProps = {
    class: signal,
    className: signal,
    label: 'Remember',
    indeterminate: true,
    classes: { root: signal, wrapper: signal, label: signal, indicator: signal },
    onChange: (event) => {
      event.currentTarget.indeterminate = false;
    },
  };
  const toggle: SwitchProps = {
    class: signal,
    className: signal,
    label: 'Automatic',
    classes: { root: signal, wrapper: signal, label: signal, track: signal, thumb: signal },
    onChange: (event) => {
      event.currentTarget.checked = true;
    },
  };
  const field: FieldProps = {
    class: signal,
    className: signal,
    label: 'Mode',
    validationState: state,
    classes: { root: signal, label: signal, hint: signal, validation: signal },
    onClick: (event) => {
      event.currentTarget.dataset.clicked = 'true';
    },
    children: (control: FieldControlProps) => (
      <Select
        {...select}
        {...control}
        class={signal}
        className={signal}
        classes={{ root: signal, wrapper: signal, icon: signal }}
        ref={refFor<HTMLSelectElement>(callback)}
      >
        <option value="local">Local</option>
      </Select>
    ),
  };
  return (
    <>
      <Input {...input} ref={refFor<HTMLInputElement>(callback)} />
      <Textarea {...textarea} ref={refFor<HTMLTextAreaElement>(callback)} />
      <Checkbox {...checkbox} ref={refFor<HTMLInputElement>(callback)} />
      <Switch {...toggle} ref={refFor<HTMLInputElement>(callback)} />
      <Field {...field} ref={refFor<HTMLDivElement>(callback)} />
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

const sidebarProps: SidebarProps = { class: slotSignal, className: slotSignal };
const sidebarHeaderProps: SidebarHeaderProps = { title: 'Brand' };
const sidebarNavProps: SidebarNavProps = { 'aria-label': 'Documentation' };
const sidebarGroupProps: SidebarGroupProps = {
  label: 'Start',
  classes: { root: slotSignal, label: slotSignal, content: slotSignal },
};
const sidebarItemProps: SidebarItemProps = {
  href: '/',
  active: { value: true, peek: () => true, subscribe: () => () => {} },
  icon: <Icon name="add" />,
  classes: { root: slotSignal, icon: slotSignal, content: slotSignal },
  onClick: (event) => {
    event.currentTarget.focus();
  },
};
const sidebarFooterProps: SidebarFooterProps = { title: 'Settings' };
export const sidebarContracts = (
  <Sidebar {...sidebarProps} ref={createRef<HTMLElement>()}>
    <SidebarHeader {...sidebarHeaderProps} ref={createRef<HTMLDivElement>()}>
      Brand
    </SidebarHeader>
    <SidebarNav {...sidebarNavProps} ref={createRef<HTMLElement>()}>
      <SidebarGroup {...sidebarGroupProps} ref={createRef<HTMLDivElement>()}>
        <SidebarItem {...sidebarItemProps} ref={createRef<HTMLAnchorElement>()}>
          Overview
        </SidebarItem>
      </SidebarGroup>
    </SidebarNav>
    <SidebarNav aria-labelledby="navigation-heading" />
    <SidebarFooter {...sidebarFooterProps} ref={createRef<HTMLDivElement>()} />
  </Sidebar>
);
export const sidebarNegativeContracts = (
  <>
    {/* @ts-expect-error href is required. */}
    <SidebarItem>Missing href</SidebarItem>
    {/* @ts-expect-error A navigation label is required. */}
    <SidebarNav />
    {/* @ts-expect-error Unknown group slot. */}
    <SidebarGroup classes={{ unknown: 'bad' }} />
    {/* @ts-expect-error Unknown item slot. */}
    <SidebarItem href="/" classes={{ unknown: 'bad' }} />
    {/* @ts-expect-error Structural parts do not have slots. */}
    <Sidebar classes={{ root: 'bad' }} />
    {/* @ts-expect-error Structural parts do not have slots. */}
    <SidebarHeader classes={{ root: 'bad' }} />
    {/* @ts-expect-error Structural parts do not have slots. */}
    <SidebarNav aria-label="Navigation" classes={{ root: 'bad' }} />
    {/* @ts-expect-error Structural parts do not have slots. */}
    <SidebarFooter classes={{ root: 'bad' }} />
  </>
);

// Utilities infer native props, events, state and the selected root's ref.
export function RenderContract() {
  return useRender({
    defaultTagName: 'a',
    ref: createRef<HTMLAnchorElement>(),
    state: { active: true },
    props: {
      href: '/native',
      children: 'Native',
      onClick: (event) => {
        event.currentTarget.href = '/next';
      },
    },
    render: (props, state) => (
      <ContractLink {...props} aria-current={state.active ? 'page' : undefined} />
    ),
  });
}
const ContractLink = forwardRef<HTMLAnchorElement, JSX.IntrinsicElements['a']>((props, ref) => (
  <a {...props} ref={ref} />
));
export function TemplateRenderContract() {
  return useRender({
    defaultTagName: 'a',
    props: { children: 'Template' },
    render: <ContractLink href="/custom" />,
  });
}
export function SvgRenderContract() {
  return useRender({
    defaultTagName: 'svg',
    ref: createRef<SVGSVGElement>(),
    props: { viewBox: '0 0 24 24' },
  });
}
export function InvalidRenderContracts() {
  useRender({
    defaultTagName: 'button',
    props: {
      // @ts-expect-error Native button roots reject href.
      href: '/',
    },
  });
  useRender({
    defaultTagName: 'button',
    // @ts-expect-error Native button roots reject anchor refs.
    ref: createRef<HTMLAnchorElement>(),
  });
  useRender({
    defaultTagName: 'svg',
    // @ts-expect-error SVG roots reject HTML refs.
    ref: createRef<HTMLDivElement>(),
  });
}

export const sidebarActionContracts = (
  <>
    <SidebarItem
      as="button"
      ref={createRef<HTMLButtonElement>()}
      disabled
      onClick={(event) => {
        event.currentTarget.disabled = true;
      }}
    >
      Settings
    </SidebarItem>
    <SidebarItem
      href="/"
      ref={createRef<HTMLAnchorElement>()}
      onClick={(event) => {
        event.currentTarget.href = '/next';
      }}
    >
      Home
    </SidebarItem>
    <SidebarItem render={<ContractLink href="/custom" />} ref={createRef<HTMLAnchorElement>()}>
      Custom
    </SidebarItem>
    {/* @ts-expect-error Buttons do not accept href. */}
    <SidebarItem as="button" href="/" />
    {/* @ts-expect-error Buttons cannot be the current page. */}
    <SidebarItem as="button" active />
    {/* @ts-expect-error Anchors do not accept disabled. */}
    <SidebarItem href="/" disabled />
    {/* @ts-expect-error An anchor ref cannot refer to a button. */}
    <SidebarItem as="button" ref={createRef<HTMLAnchorElement>()} />
    {/* @ts-expect-error A button ref cannot refer to an anchor. */}
    <SidebarItem href="/" ref={createRef<HTMLButtonElement>()} />
    {/* @ts-expect-error Buttons do not accept target. */}
    <SidebarItem as="button" target="_blank" />
    {/* @ts-expect-error Buttons do not accept download. */}
    <SidebarItem as="button" download />
  </>
);

const appLayout: JSX.SignalLike<SidebarLayout> = {
  value: 'rail',
  peek: () => 'rail',
  subscribe: () => () => {},
};
const brandContract: SidebarBrandProps = {
  title: 'App',
  description: 'Desktop',
  logo: <Icon name="network" />,
  classes: {
    root: slotSignal,
    logo: slotSignal,
    content: slotSignal,
    title: slotSignal,
    description: slotSignal,
  },
};
export const appSidebarContracts = (
  <Sidebar layout={appLayout} scrollable>
    <SidebarBrand {...brandContract} ref={createRef<HTMLDivElement>()} hidden />
    <SidebarItem href="/" render={(props, state) => <a {...props} data-layout={state.layout} />} />
    <SidebarItem
      as="button"
      render={(props) => (
        <button
          {...props}
          onClick={(event) => {
            event.currentTarget.disabled = true;
          }}
        />
      )}
    />
    {/* @ts-expect-error Buttons cannot declare current page. */}
    <SidebarItem as="button" aria-current="page" />
  </Sidebar>
);

const shellProps: AppShellProps = {
  navigationLayout: appLayout,
  class: slotSignal,
  className: slotSignal,
  hidden: false,
};
const workspaceProps: AppShellWorkspaceProps = { tabIndex: -1, 'aria-label': 'Workspace' };
const shellHeaderProps: AppShellHeaderProps = { title: 'Header' };
const shellContentProps: AppShellContentProps = {
  onClick: (event) => {
    event.currentTarget.align = 'left';
  },
};
const shellFooterProps: AppShellFooterProps = { hidden: true };
export function AppShellContract({ callback = false }: { callback?: boolean }) {
  return (
    <AppShell {...shellProps} ref={refFor<HTMLDivElement>(callback)}>
      <Sidebar layout={appLayout} />
      <AppShellWorkspace {...workspaceProps} ref={refFor<HTMLElement>(callback)}>
        <AppShellHeader {...shellHeaderProps} ref={refFor<HTMLDivElement>(callback)} />
        <AppShellContent {...shellContentProps} ref={refFor<HTMLDivElement>(callback)}>
          Content
        </AppShellContent>
        <AppShellFooter {...shellFooterProps} ref={refFor<HTMLDivElement>(callback)} />
      </AppShellWorkspace>
    </AppShell>
  );
}
export const appShellNegativeContracts = (
  <>
    {/* @ts-expect-error Unknown layout. */}
    <AppShell navigationLayout="compact" />
    {/* @ts-expect-error Shell is a div, not a link. */}
    <AppShell href="/" />
    {/* @ts-expect-error Workspace is main, not a link. */}
    <AppShellWorkspace href="/" />
    {/* @ts-expect-error Structural parts do not have slots. */}
    <AppShellContent classes={{ root: 'bad' }} />
    {/* @ts-expect-error Shell requires a div ref. */}
    <AppShell ref={createRef<HTMLButtonElement>()} />
    {/* @ts-expect-error Header requires a div ref. */}
    <AppShellHeader ref={createRef<HTMLAnchorElement>()} />
  </>
);

// Sidebar has one application style and no appearance variant.
// @ts-expect-error Sidebar appearance was removed
<Sidebar appearance="app" />;

import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableCaption,
  Pagination,
  DataToolbar,
  DataToolbarGroup,
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
  Separator,
} from '@violice/preact-fluent-ui';
import type {
  TableProps,
  TableContainerProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeaderCellProps,
  TableCellProps,
  TableCaptionProps,
  PaginationProps,
  DataToolbarProps,
  DataToolbarGroupProps,
  DataListProps,
  DataListItemProps,
  DataListLabelProps,
  DataListValueProps,
  SeparatorProps,
} from '@violice/preact-fluent-ui';
const tableProps: TableProps = { class: slotSignal, hidden: false };
const tableContainerProps: TableContainerProps = { class: slotSignal, hidden: false };
const tableHeaderProps: TableHeaderProps = { class: slotSignal, hidden: false };
const tableBodyProps: TableBodyProps = { class: slotSignal, hidden: false };
const tableFooterProps: TableFooterProps = { class: slotSignal, hidden: false };
const tableRowProps: TableRowProps = { class: slotSignal, hidden: false };
const tableHeaderCellProps: TableHeaderCellProps = { class: slotSignal, hidden: false };
const tableCellProps: TableCellProps = { class: slotSignal, hidden: false };
const tableCaptionProps: TableCaptionProps = { class: slotSignal, hidden: false };
const paginationProps: PaginationProps = {
  page: 1,
  pageCount: 3,
  onPageChange: () => {},
  previousLabel: 'Previous',
  nextLabel: 'Next',
  'aria-label': 'Pages',
};
const dataToolbarProps: DataToolbarProps = { class: slotSignal, hidden: false };
const dataToolbarGroupProps: DataToolbarGroupProps = { class: slotSignal, hidden: false };
const dataListProps: DataListProps = { class: slotSignal, hidden: false };
const dataListItemProps: DataListItemProps = { class: slotSignal, hidden: false };
const dataListLabelProps: DataListLabelProps = { class: slotSignal, hidden: false };
const dataListValueProps: DataListValueProps = { class: slotSignal, hidden: false };
const separatorProps: SeparatorProps = { class: slotSignal, hidden: false };
export const dataComponentContracts = (
  <>
    <Table {...tableProps} ref={createRef<HTMLTableElement>()} />
    <TableContainer {...tableContainerProps} ref={createRef<HTMLDivElement>()} />
    <TableHeader {...tableHeaderProps} ref={createRef<HTMLTableSectionElement>()} />
    <TableBody {...tableBodyProps} ref={createRef<HTMLTableSectionElement>()} />
    <TableFooter {...tableFooterProps} ref={createRef<HTMLTableSectionElement>()} />
    <TableRow {...tableRowProps} ref={createRef<HTMLTableRowElement>()} />
    <TableHeaderCell {...tableHeaderCellProps} ref={createRef<HTMLTableCellElement>()} />
    <TableCell {...tableCellProps} ref={createRef<HTMLTableCellElement>()} />
    <TableCaption {...tableCaptionProps} ref={createRef<HTMLTableCaptionElement>()} />
    <Pagination {...paginationProps} ref={createRef<HTMLElement>()} />
    <DataToolbar {...dataToolbarProps} ref={createRef<HTMLDivElement>()} />
    <DataToolbarGroup {...dataToolbarGroupProps} ref={createRef<HTMLDivElement>()} />
    <DataList {...dataListProps} ref={createRef<HTMLDListElement>()} />
    <DataListItem {...dataListItemProps} ref={createRef<HTMLDivElement>()} />
    <DataListLabel {...dataListLabelProps} ref={createRef<HTMLElement>()} />
    <DataListValue {...dataListValueProps} ref={createRef<HTMLElement>()} />
    <Separator {...separatorProps} ref={createRef<HTMLDivElement>()} />
  </>
);
export const dataNegativeContracts = (
  <>
    {/* @ts-expect-error Reject invalid or reserved public props. */}
    <DataList direction="diagonal" />
    {/* @ts-expect-error Reject invalid or reserved public props. */}
    <Separator role="separator" />
    {/* @ts-expect-error Reject invalid or reserved public props. */}
    <Separator aria-hidden={false} />
    {/* @ts-expect-error Reject invalid or reserved public props. */}
    <Separator aria-orientation="vertical" />
    {/* @ts-expect-error Reject invalid or reserved public props. */}
    <Table density="dense" />
    {/* @ts-expect-error Reject invalid or reserved public props. */}
    <Pagination
      page={1}
      pageCount={3}
      onPageChange={() => {}}
      previousLabel="Back"
      nextLabel="Next"
    />
  </>
);
