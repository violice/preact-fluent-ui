import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { useSignal } from '@preact/signals';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Button,
  Text,
  Checkbox,
  InfoBar,
  mergeClasses,
  mergeProps,
  resolveClass,
  useRender,
} from '../../../dist/index.js';
import { CodeExample } from './code-block';
import styles from './gallery.module.css';

const LocalLink = forwardRef<HTMLAnchorElement, JSX.IntrinsicElements['a']>((props, ref) => (
  <a {...props} ref={ref} />
));
function RenderRoot({ custom }: { custom: boolean }) {
  return useRender({
    defaultTagName: 'a',
    props: {
      href: '#local-render',
      children: custom ? 'Custom Link root' : 'Native anchor root',
      onClick: (event) => event.preventDefault(),
      onAuxClick: (event) => event.preventDefault(),
    },
    render: custom ? (props) => <LocalLink {...props} /> : undefined,
  });
}
function RenderDemo() {
  return (
    <div class={styles.row}>
      <RenderRoot custom={false} />
      <RenderRoot custom />
    </div>
  );
}
function PropsDemo() {
  const cancel = useSignal(false);
  const result = useSignal('Click the composed button.');
  const props = mergeProps<JSX.IntrinsicElements['button']>(
    {
      onClick: () => {
        result.value += ' → internal';
      },
      style: { padding: '8px' },
    },
    {
      onClick: (event) => {
        result.value = 'consumer';
        if (cancel.value) {
          event.preventDefault();
          result.value += ' (cancelled)';
        }
      },
      style: { borderRadius: '8px' },
    },
  );
  return (
    <div class={styles.stack}>
      <Checkbox
        label="Cancel the internal handler"
        checked={cancel}
        onChange={(e) => {
          cancel.value = e.currentTarget.checked;
        }}
      />
      <button {...props}>Run composed handlers</button>
      <output>{result}</output>
    </div>
  );
}
function ClassesDemo({ resolve = false }: { resolve?: boolean }) {
  const enabled = useSignal(false);
  const classValue = useSignal<string | undefined>(undefined);
  const selected = resolve
    ? resolveClass(classValue, styles.signalAccent)
    : mergeClasses('local-base', classValue);
  return (
    <div class={styles.stack}>
      <Checkbox
        label={resolve ? 'Use an empty primary class' : 'Add the signal class'}
        checked={enabled}
        onChange={(e) => {
          enabled.value = e.currentTarget.checked;
          classValue.value = enabled.value ? (resolve ? '' : styles.signalAccent) : undefined;
        }}
      />
      <Button class={selected}>Class demonstration</Button>
      <output>{selected === '' ? '(empty class)' : (selected ?? '(undefined)')}</output>
    </div>
  );
}
type ApiRow = [parameter: string, type: string, description: string];
const utilityParameters: Record<string, ApiRow[]> = {
  useRender: [
    [
      'options',
      'UseRenderOptions<Tag, S>',
      'Required options object. Tag selects native prop and ref types; S types callback state.',
    ],
    ['options.defaultTagName', 'Tag, required', 'Native tag used when render is omitted.'],
    [
      'options.props',
      'JSX.IntrinsicElements[Tag]',
      'Optional native props, children and event handlers.',
    ],
    [
      'options.render',
      'RenderProp<JSX.IntrinsicElements[Tag], S>',
      'Optional VNode template or callback receiving composed props and state. Forward all props and the ref.',
    ],
    [
      'options.ref',
      'Ref<RootElement<Tag>> | readonly Ref<RootElement<Tag>>[]',
      'Optional typed root ref or readonly ref array; composed with native and template refs.',
    ],
    [
      'options.state',
      'S',
      'Optional state passed to the render callback; defaults to an empty object.',
    ],
  ],
  mergeProps: [
    [
      '...sources',
      '(Partial<P> | null | undefined)[]',
      'Prop objects in precedence order. Nullish sources are ignored. Classes accumulate, styles merge and handlers compose right to left.',
    ],
  ],
  mergeClasses: [
    [
      '...classes',
      'JSX.Signalish<string | undefined>[]',
      'Strings or Signalish values read at call time. Empty values are skipped.',
    ],
  ],
  resolveClass: [
    [
      'classProp',
      'JSX.Signalish<string | undefined>',
      'Primary class value, read at call time. An empty string suppresses the fallback.',
    ],
    [
      'className',
      'JSX.Signalish<string | undefined>',
      'Fallback used only when the primary value is nullish.',
    ],
  ],
};
const utilityReturns: Record<string, [type: string, description: string]> = {
  useRender: ['VNode', 'The native or custom root element without an extra wrapper.'],
  mergeProps: ['P', 'A new merged prop object. Inputs are unchanged; refs use right precedence.'],
  mergeClasses: ['string', 'Joined class names, or an empty string when none remain.'],
  resolveClass: ['string | undefined', 'The resolved primary or fallback class value.'],
};
const utilityDocs = [
  {
    title: 'useRender',
    slug: 'use-render',
    purpose: 'Compose a native or custom root without an extra wrapper.',
    signature:
      'useRender<Tag extends keyof JSX.IntrinsicElements, S extends object = Record<string, never>>(options: UseRenderOptions<Tag, S>): VNode',
    demo: RenderDemo,
    note: 'Both links stay in this demo. The custom Link forwards every prop, children and ref to one anchor.',
    code: `const LocalLink = forwardRef<HTMLAnchorElement, JSX.IntrinsicElements['a']>(\n  (props, ref) => <a {...props} ref={ref} />\n);\nfunction CustomRoot() {\n  return useRender({\n    defaultTagName: 'a',\n    props: { href: '#local', children: 'Local link', onClick: e => e.preventDefault() },\n    render: (props, state) => <LocalLink {...props} />,\n  });\n}`,
    limits:
      'Call this hook inside a component. Options include props, state, render and a typed root ref or readonly ref array. A VNode template merges its props after component props; explicit template children replace component children. Callbacks must forward the supplied props and ref. The default tag determines types and defaults; render does not infer DOM semantics. Native, template and external refs compose separately.',
  },
  {
    title: 'mergeProps',
    slug: 'merge-props',
    purpose: 'Combine prop objects without mutating the inputs.',
    signature: 'mergeProps<P extends object>(...sources: (Partial<P> | null | undefined)[]): P',
    demo: PropsDemo,
    note: 'The consumer handler runs first. Cancellation stops the internal handler.',
    code: `const props = mergeProps<JSX.IntrinsicElements['button']>(\n  { onClick: () => save(), style: { padding: '8px' } },\n  { onClick: e => { if (!valid) e.preventDefault(); }, style: { borderRadius: '8px' } },\n);\n<button {...props}>Save</button>`,
    limits:
      'Ordinary props use right precedence. Each source resolves class before className, then classes accumulate. Object styles merge by key; string styles replace the previous style, and an object after a string starts a new object. Handlers run right to left until defaultPrevented is true. Refs use right precedence here; useRender composes them.',
  },
  {
    title: 'mergeClasses',
    slug: 'merge-classes',
    purpose: 'Join string and Signalish class values.',
    signature: 'mergeClasses(...classes: JSX.Signalish<string | undefined>[]): string',
    demo: ClassesDemo,
    note: 'Toggle the signal to add a class to the local button.',
    code: `function Example() {\n  const extra = useSignal<string | undefined>('accent');\n  return <Button class={mergeClasses('base', extra)}>Example</Button>;\n}`,
    limits:
      'Reads each Signalish value when called and skips empty values. Call during component rendering or inside a computed signal to track changes. It does not resolve conflicting CSS rules or deduplicate classes.',
  },
  {
    title: 'resolveClass',
    slug: 'resolve-class',
    purpose: 'Select class with className as a nullish fallback.',
    signature:
      'resolveClass(classProp: JSX.Signalish<string | undefined>, className: JSX.Signalish<string | undefined>): string | undefined',
    demo: () => <ClassesDemo resolve />,
    note: 'Undefined selects the fallback outline. An empty primary class suppresses that fallback.',
    code: `function Example() {\n  const primary = useSignal<string | undefined>(undefined);\n  return <Button class={resolveClass(primary, 'fallback')}>Example</Button>;\n}`,
    limits:
      'An empty class is intentional. Only null or undefined selects className. Signalish values are read when called; this helper does not create a computed signal or resolve CSS conflicts.',
  },
];
export const utilityPages = utilityDocs.map((doc) => ({
  path: `/utils/${doc.slug}`,
  title: doc.title,
  group: 'Utils' as const,
  component: () => {
    const Demo = doc.demo;
    return (
      <div class={styles.sections}>
        <p>{doc.purpose}</p>
        <section class={styles.docSection}>
          <Text preset="subtitle1" render={<h2 />}>
            Example
          </Text>
          <div class={styles.preview}>
            <Demo />
          </div>
          <InfoBar>{doc.note}</InfoBar>
          <CodeExample code={doc.code} />
        </section>
        <section class={styles.docSection}>
          <Text preset="subtitle1" render={<h2 />} id={`${doc.slug}-api`}>
            API reference
          </Text>
          <pre class={styles.longText}>
            <code>{doc.signature}</code>
          </pre>
          <Table class={styles.propsTable} aria-labelledby={`${doc.slug}-api`}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell scope="col">Parameter</TableHeaderCell>
                <TableHeaderCell scope="col">Type</TableHeaderCell>
                <TableHeaderCell scope="col">Description</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utilityParameters[doc.title]!.map(([parameter, type, description]) => (
                <TableRow key={parameter}>
                  <TableHeaderCell scope="row">{parameter}</TableHeaderCell>
                  <TableCell>
                    <code>{type}</code>
                  </TableCell>
                  <TableCell>{description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div class={styles.docSection}>
            <Text preset="subtitle2" render={<h3 />}>
              Return value
            </Text>
            <p>
              <code>{utilityReturns[doc.title]![0]}</code>
            </p>
            <p>{utilityReturns[doc.title]![1]}</p>
          </div>
        </section>
        <section class={styles.docSection}>
          <Text preset="subtitle1" render={<h2 />}>
            Limitations
          </Text>
          <p>{doc.limits}</p>
        </section>
      </div>
    );
  },
}));
