import { createUtilityRoute } from './utility-page';
import {} from '../../../../../dist/components.js';
import { RenderDemo } from './render-demo';
import { PropsDemo } from './props-demo';
import { ClassesDemo } from './classes-demo';

export type ApiRow = [parameter: string, type: string, description: string];

export const utilityParameters: Record<string, ApiRow[]> = {
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

export const utilityReturns: Record<string, [type: string, description: string]> = {
  useRender: ['VNode', 'The native or custom root element without an extra wrapper.'],
  mergeProps: ['P', 'A new merged prop object. Inputs are unchanged; refs use right precedence.'],
  resolveClass: ['string | undefined', 'The resolved primary or fallback class value.'],
};

export const utilityDocs = [
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

export const utilityPages = utilityDocs
  .filter((doc) => doc.title !== 'cx')
  .map((doc) => ({
    path: `/utils/${doc.slug}`,
    title: doc.title,
    group: 'Utils' as const,
    component: createUtilityRoute(doc),
  }));
