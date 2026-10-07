import type { ComponentType } from 'preact';
import { demoSource } from './demo-source';
import { CssDemo } from './examples/css-demo';
import cssSource from './examples/css-demo.tsx?raw';
import { DynamicDemo } from './examples/dynamic-demo';
import dynamicSource from './examples/dynamic-demo.tsx?raw';
import { CxDemo } from './examples/cx-demo';
import cxSource from './examples/cx-demo.tsx?raw';
import { CvaDemo } from './examples/cva-demo';
import cvaSource from './examples/cva-demo.tsx?raw';
import { SvaDemo } from './examples/sva-demo';
import svaSource from './examples/sva-demo.tsx?raw';
import { TokenDemo } from './examples/token-demo';
import tokenSource from './examples/token-demo.tsx?raw';
import { StylePage } from './style-page';
export type StyleDoc = {
  name: string;
  description: string;
  signature: string;
  code: string;
  demo: ComponentType;
  details?: { title: string; description: string; code?: string }[];
  parameters: [string, string, string][];
  returns: string;
  limits: string;
};

export const styleDocs: StyleDoc[] = [
  {
    name: 'css',
    description: 'Compile static style objects into atomic CSS classes.',
    signature: 'css(...styles: StyleObject[]): string',
    code: demoSource(cssSource),
    demo: CssDemo,
    details: [
      {
        title: 'Values, units and token references',
        description:
          'Numbers receive px for length properties; unitless properties such as opacity and fontWeight keep the number. A short token name is resolved using the property category. Full token references need braces. Raw CSS strings pass through unchanged. null and undefined declarations are skipped.',
        code: "css({ padding: '4', color: 'primary', borderRadius: 8, opacity: 0.8 });\ncss({ padding: '{spacing.4}', color: '{colors.primary}', width: '50%' });",
      },
      {
        title: 'Selectors and conditions',
        description:
          'Built-in _hover, _focusVisible, _active and _disabled conditions work without configuration. Nested selectors must contain &, and media, supports and container at-rules are supported. Named custom conditions come from your configuration.',
        code: "css({ _hover: { color: 'primary' }, '& > span': { fontWeight: 600 } });",
      },
      {
        title: 'Composition and spacing',
        description:
          'Multiple css objects are compiled and composed in argument order. Supported shorthands expand into individual declarations, allowing cx to resolve overlapping engine classes. In the same selector and condition, do not mix logical and physical margin or padding: choose paddingInlineStart for direction-aware spacing or paddingLeft for a fixed side.',
        code: "const base = css({ padding: '8px 12px' });\nconst override = css({ paddingLeft: 20 });\ncx(base, override);\n// For RTL-aware layouts, use logical spacing consistently.\ncss({ paddingInline: 12, paddingInlineStart: 20 });",
      },
      {
        title: 'Keyframes and custom properties',
        description:
          'Declare named keyframes at the top level of a static style object. Frames accept declarations, not nested selectors. Keyframe names are global, so use an application-specific name. Custom properties keep their spelling; numeric custom property values remain unitless.',
        code: "css({\n  '@keyframes appReveal': { from: { opacity: 0 }, to: { opacity: 1 } },\n  animation: 'appReveal 160ms ease-out',\n  '--panel-count': 3,\n  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },\n});",
      },
    ],
    parameters: [
      [
        '...styles',
        'StyleObject[]',
        'Static CSS objects, including token values, nested selectors and conditions. Later objects take precedence.',
      ],
    ],
    returns: 'string',
    limits:
      'Requires fluentStyles() in Vite and the generated stylesheet imported by your application. Keep definitions statically evaluable. Use css.dynamic for runtime values and cx to compose classes.',
  },
  {
    name: 'css.dynamic',
    description: 'Compile a style shape and pass runtime values through local CSS variables.',
    signature:
      'css.dynamic(style: DynamicStyleObject): { class: string; style: JSX.CSSProperties }',
    code: demoSource(dynamicSource),
    demo: DynamicDemo,
    parameters: [
      [
        'style',
        'DynamicStyleObject',
        'A statically known object shape with runtime string, number or Signalish leaves. Nested style objects are supported.',
      ],
    ],
    returns: '{ class, style }',
    limits:
      'Requires the Vite compiler. Spread both class and style onto the element. Numbers receive px except for unitless properties and custom properties. Strings can carry explicit units or token references; null and undefined leaves are omitted. Runtime values do not define new selectors or property names.',
  },
  {
    name: 'cx',
    description: 'Compose class names, resolve engine conflicts and read signal values.',
    signature: 'cx(...classes: ClassValue[]): string',
    code: demoSource(cxSource),
    demo: CxDemo,
    details: [
      {
        title: 'Signals and empty values',
        description:
          'cx accepts class strings, signals, nested readonly arrays, false, null and undefined. It does not accept object maps of class names. Call it during render or computed so signal reads are tracked.',
        code: "import { signal, computed } from '@preact/signals';\nconst extraClass = signal<string | undefined>(undefined);\nconst combined = computed(() => cx('base', extraClass));",
      },
      {
        title: 'Conflict boundaries',
        description:
          'Only equivalent property, selector, condition and layer contexts replace earlier engine declarations. Foreign class names are retained without inspecting their styles. Unsupported shorthand/longhand overlap such as font with fontSize throws; use explicit longhands. Mixing logical and physical margin or padding within one context also throws.',
        code: 'const first = css({ paddingLeft: 8 });\nconst last = css({ paddingLeft: 16 });\ncx(first, last); // Keeps the later paddingLeft rule\n// Prefer fontFamily and fontSize rather than composing font with fontSize.',
      },
    ],
    parameters: [
      [
        '...classes',
        'ClassValue[]',
        'Class strings, Signalish values and nested arrays. Empty values are skipped.',
      ],
    ],
    returns: 'string',
    limits:
      'Reads signals when called, so call during rendering or inside computed to track them. Equivalent engine declarations resolve in argument order. Foreign classes are deduplicated, but their CSS declarations are outside conflict resolution. Import ClassValue from /styles.',
  },
  {
    name: 'cva',
    description: 'Define a single-element recipe with typed variants and defaults.',
    signature: 'cva(definition: CvaDefinition): (selection?: Selections) => string',
    code: demoSource(cvaSource),
    demo: CvaDemo,
    details: [
      {
        title: 'Defaults and suppressed variants',
        description:
          'Omitting a selection or passing undefined keeps defaultVariants. Passing null suppresses that variant. Boolean selections use true and false branches; false can disable a true-only branch. Unknown selections are rejected by types and throw in development when types are bypassed.',
        code: 'actionStyles();\nactionStyles({ size: undefined }); // Default small branch\nactionStyles({ size: null }); // No size branch',
      },
      {
        title: 'Compound variants and types',
        description:
          'Compound rules require every specified selection to match. An array accepts any listed value. RecipeVariantProps extracts optional choices including null and undefined; RecipeVariant makes each choice required and removes null and undefined. Import these types from the generated entry.',
        code: "import type { RecipeVariantProps, RecipeVariant } from './styled-system/css';\ntype ActionProps = RecipeVariantProps<typeof actionStyles>;\ntype ActionChoices = RecipeVariant<typeof actionStyles>;",
      },
      {
        title: 'Override a recipe',
        description:
          'Recipes emit the recipes layer; css emits utilities. Utility declarations take precedence over recipe declarations even when class arguments are reversed. cx only resolves conflicts within equivalent engine declarations; CSS layers determine cross-layer precedence.',
        code: "const extraStyles = css({ padding: '24px' });\n<button class={cx(actionStyles({ size: 'small' }), extraStyles)}>Save</button>",
      },
    ],
    parameters: [
      [
        'definition',
        'CvaDefinition',
        'Optional base, variants, defaultVariants and compoundVariants. Compound rules put declarations in css.',
      ],
      [
        'selection',
        'Selections',
        'Call the returned recipe with variant choices. Boolean branches use true and false keys.',
      ],
    ],
    returns: '(selection?) => string',
    limits:
      'Define recipes statically with the Vite compiler. Runtime calls select compiled branches. Use RecipeVariantProps<typeof actionStyles> to extract optional selection props and RecipeVariant for required non-null choices.',
  },
  {
    name: 'sva',
    description: 'Define a recipe that returns a class for each named slot.',
    signature: 'sva(definition: SvaDefinition): (selection?: Selections) => Record<Slot, string>',
    code: demoSource(svaSource),
    demo: SvaDemo,
    details: [
      {
        title: 'Compound slot rules',
        description:
          'Every matching compound rule adds its per-slot styles. Slots without an override keep their base styles. The same defaults, null suppression, boolean choices and array matching as cva apply.',
        code: "compoundVariants: [\n  { compact: true, highlighted: true, css: { label: { color: 'primary' } } },\n],",
      },
      {
        title: 'Selectors between slots',
        description:
          'Use a slot placeholder in a recipe selector to refer to its stable generated marker class. The referenced slot must be declared in slots. RecipeVariantProps and RecipeVariant also extract selections from sva recipes.',
        code: "sva({\n  slots: ['root', 'label'],\n  base: { root: { '&:hover $label': { color: 'primary' } } },\n});",
      },
    ],
    parameters: [
      [
        'definition',
        'SvaDefinition',
        'Required slots plus optional per-slot base, variants, defaults and compound rules.',
      ],
      ['selection', 'Selections', 'Variant choices passed to the returned recipe.'],
    ],
    returns: '(selection?) => Record<Slot, string>',
    limits:
      'Requires the Vite compiler. Each style branch maps slot names to style objects. Apply each returned class to its corresponding element. Recipes add no markup or accessibility behavior.',
  },
  {
    name: 'token',
    description: 'Read a typed token reference as a CSS variable expression.',
    signature: 'token.var(path: TokenPath): string',
    code: demoSource(tokenSource),
    demo: TokenDemo,
    parameters: [['path', 'keyof token references', 'A known token path, such as colors.primary.']],
    returns: 'string, for example var(--pfui-colors-primary)',
    limits:
      'Returns a CSS variable reference rather than the resolved color or size. The generated theme stylesheet defines its value. The generated entry accepts only configured token paths in TypeScript. If types are bypassed, an unknown generated path returns undefined; do not use that as a fallback mechanism.',
  },
];

export const stylePages = styleDocs.map((doc) => ({
  path: `/styles/${doc.name.replace('.', '-')}`,
  title: doc.name,
  group: 'Styles' as const,
  component: () => <StylePage doc={doc} />,
}));
