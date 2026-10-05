import type { JSX, Ref, RefCallback } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import { useRender, type RenderProp } from '../utils/use-render';
import styles from './box.module.css';

const layoutProperties = [
  'display',
  'flex',
  'flexDirection',
  'flexWrap',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'order',
  'alignItems',
  'alignContent',
  'alignSelf',
  'justifyContent',
  'justifyItems',
  'justifySelf',
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridAutoColumns',
  'gridAutoRows',
  'gridAutoFlow',
  'gridColumn',
  'gridRow',
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'overflow',
  'overflowX',
  'overflowY',
  'gap',
  'rowGap',
  'columnGap',
  'padding',
  'paddingInline',
  'paddingBlock',
  'paddingInlineStart',
  'paddingInlineEnd',
  'paddingBlockStart',
  'paddingBlockEnd',
  'margin',
  'marginInline',
  'marginBlock',
  'marginInlineStart',
  'marginInlineEnd',
  'marginBlockStart',
  'marginBlockEnd',
] as const;
type LayoutProperty = (typeof layoutProperties)[number];
type SpacingProperty = Extract<
  LayoutProperty,
  'gap' | 'rowGap' | 'columnGap' | `padding${string}` | `margin${string}`
>;
export type BoxSpacing = `space-${1 | 2 | 3 | 4 | 5 | 6 | 8}` | (string & {}) | number;
type LayoutValues = Pick<JSX.CSSProperties, LayoutProperty> & {
  display?:
    | 'block'
    | 'inline'
    | 'inline-block'
    | 'flex'
    | 'inline-flex'
    | 'grid'
    | 'inline-grid'
    | 'contents'
    | 'none'
    | 'inherit'
    | 'initial'
    | 'unset'
    | 'revert'
    | 'revert-layer';
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
};
export type BoxLayoutProps = {
  [Key in LayoutProperty]?: JSX.Signalish<
    Key extends SpacingProperty ? BoxSpacing | null | undefined : LayoutValues[Key]
  >;
};
export interface BoxRenderState {
  /** Resolved layout props before native style overrides. */
  layout: JSX.CSSProperties;
}
export type BoxRenderProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> & {
  ref: RefCallback<HTMLElement>;
};
export type BoxProps = JSX.HTMLAttributes<HTMLElement> &
  BoxLayoutProps & {
    render?: RenderProp<BoxRenderProps, BoxRenderState>;
  };

function cssName(property: string): string {
  return property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function resolveValue<Value>(value: JSX.Signalish<Value>): Value {
  return value !== null && typeof value === 'object' && 'value' in value
    ? (value as JSX.SignalLike<Value>).value
    : (value as Value);
}

export const Box = /* @__PURE__ */ forwardRef<HTMLElement, BoxProps>(function Box(
  { render, style, class: classProp, className, ...props },
  ref,
) {
  const layout: JSX.CSSProperties = {};
  for (const property of layoutProperties) {
    const raw = props[property];
    delete props[property];
    const value = raw !== null && typeof raw === 'object' ? raw.value : raw;
    if (value == null) continue;
    const isSpacing = /^(gap|rowGap|columnGap|padding|margin)/.test(property);
    const unitless =
      property === 'flex' ||
      property === 'flexGrow' ||
      property === 'flexShrink' ||
      property === 'order' ||
      property === 'gridColumn' ||
      property === 'gridRow';
    layout[property] =
      isSpacing && typeof value === 'string' && /^space-(1|2|3|4|5|6|8)$/.test(value)
        ? `var(--${value})`
        : typeof value === 'number'
          ? `${value}${unitless ? '' : 'px'}`
          : value;
  }
  const nativeStyle = resolveValue<string | JSX.CSSProperties | undefined>(style);
  const composedStyle =
    typeof nativeStyle === 'string'
      ? `${Object.entries(layout)
          .map(([key, value]) => `${cssName(key)}:${value}`)
          .join(';')};${nativeStyle}`
      : { ...layout, ...nativeStyle };
  return useRender({
    defaultTagName: 'div',
    render:
      typeof render === 'function'
        ? (rootProps, state) =>
            render({ ...rootProps, ref: rootProps.ref as RefCallback<HTMLElement> }, state)
        : render,
    // The public ref accepts any HTMLElement; useRender composes it into a
    // callback so a native or component template may replace the default div.
    ref: ref as Ref<HTMLDivElement>,
    state: { layout },
    props: {
      ...(props as JSX.HTMLAttributes<HTMLDivElement>),
      class: mergeClasses(styles.box, resolveClass(classProp, className)),
      style: composedStyle,
    },
  });
});
