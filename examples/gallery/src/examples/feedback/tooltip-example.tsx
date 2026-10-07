import { css, cx } from '../../../../../.artifacts/gallery-styled-system/css';
import { useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import {
  Button,
  Tooltip,
  Icon,
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Modal,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function TooltipExample() {
  const open = useSignal(false);
  const initialFocus = useRef<HTMLButtonElement>(null);
  return (
    <div class={cx(galleryStyles.stack, css({ width: '100%' }))}>
      <TableContainer tabIndex={0} role="region" aria-label="Scrollable tooltip examples">
        <Table class={css({ minWidth: '520px' })} aria-label="Connection actions">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Profile</TableHeaderCell>
              <TableHeaderCell>Address</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {['Office', 'Home', 'Travel'].map((name) => (
              <TableRow key={name}>
                <TableHeaderCell scope="row">{name}</TableHeaderCell>
                <TableCell>192.168.1.20</TableCell>
                <TableCell>
                  <Tooltip content={`Refresh ${name} connection`}>
                    {(props) => (
                      <Button {...props} size="icon" aria-label={`Refresh ${name} connection`}>
                        <Icon name="refresh" size={16} />
                      </Button>
                    )}
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        data-theme="dark"
        class={css({
          '--pfui-colors-surface': '#232428',
          '--pfui-colors-surface-raised': '#34353b',
          '--pfui-colors-text': '#f3f4f6',
          '--pfui-colors-surface-muted': '#292a2f',
          '--pfui-colors-surface-hover': '#35373e',
          '--pfui-colors-surface-pressed': '#2d2f35',
          '--pfui-colors-border': '#3b3d44',
          '--pfui-colors-border-strong': '#626670',
          '--pfui-colors-control': '#37393f',
          '--pfui-colors-control-hover': '#40434b',
          '--pfui-colors-control-pressed': '#303238',
          '--pfui-colors-control-border': '#484b54',
          '--pfui-colors-control-bottom': '#656975',
          '--pfui-colors-focus': '#dceaff',
          '--pfui-colors-disabled': '#8e939e',
          '--pfui-shadows-control':
            'inset 0 1px 0 rgb(255 255 255 / 3%), 0 1px 2px rgb(0 0 0 / 10%)',
          colorScheme: 'dark',
          padding: '16px',
          background: 'var(--pfui-colors-surface)',
          color: 'var(--pfui-colors-text)',
        })}
      >
        <Tooltip content="This tooltip inherits the local dark theme" placement="right">
          {(props) => <Button {...props}>Local theme hint</Button>}
        </Tooltip>
      </div>
      <Button onClick={() => (open.value = true)}>Open tooltip dialog</Button>
      {open.value && (
        <Modal
          labelledBy="tooltip-dialog-title"
          initialFocusRef={initialFocus}
          onClose={() => (open.value = false)}
        >
          <DialogHeader id="tooltip-dialog-title" title="Connection actions" />
          <DialogBody>
            <Tooltip
              content="Refresh this connection without leaving the dialog"
              triggerProps={{ ref: initialFocus }}
            >
              {(props) => (
                <Button {...props} size="icon" aria-label="Refresh dialog connection">
                  <Icon name="refresh" size={16} />
                </Button>
              )}
            </Tooltip>
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => (open.value = false)}>Close dialog</Button>
          </DialogFooter>
        </Modal>
      )}
    </div>
  );
}
