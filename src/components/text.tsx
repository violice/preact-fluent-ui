import type { JSX, RefCallback } from 'preact';
import { forwardRef } from 'preact/compat';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import { useRender } from '../utils/use-render';
import type { RenderProp } from '../utils/use-render';
import styles from './text.module.css';

export type TextPreset =
  | 'caption2'
  | 'caption1'
  | 'body1'
  | 'subtitle2'
  | 'subtitle1'
  | 'title3'
  | 'title2'
  | 'title1'
  | 'largeTitle'
  | 'display';

export type TextColor = 'inherit' | 'default' | 'muted' | 'subtle';

export interface TextRenderState {
  preset: TextPreset;
  color: TextColor;
}

export type TextRenderProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'> & {
  ref: RefCallback<HTMLElement>;
};

export interface TextProps extends JSX.HTMLAttributes<HTMLElement> {
  preset?: JSX.Signalish<TextPreset>;
  color?: JSX.Signalish<TextColor>;
  render?: RenderProp<TextRenderProps, TextRenderState>;
}

export const Text = /* @__PURE__ */ forwardRef<HTMLElement, TextProps>(function Text(
  { preset = 'body1', color = 'inherit', render, class: classProp, className, ...props },
  ref,
) {
  const resolvedPreset = typeof preset === 'object' ? preset.value : preset;
  const resolvedColor = typeof color === 'object' ? color.value : color;
  return useRender({
    defaultTagName: 'span',
    render:
      typeof render === 'function'
        ? (rootProps, state) =>
            render(
              // useRender always supplies a composed callback ref, which can be
              // forwarded to any native HTML root without an object-ref cast.
              { ...rootProps, ref: rootProps.ref as RefCallback<HTMLElement> },
              state,
            )
        : render,
    ref,
    state: { preset: resolvedPreset, color: resolvedColor },
    props: {
      ...props,
      class: mergeClasses(
        styles.text,
        styles[resolvedPreset],
        resolvedColor === 'inherit' ? undefined : styles[resolvedColor],
        resolveClass(classProp, className),
      ),
    },
  });
});
