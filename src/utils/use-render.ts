import { cloneElement, createElement } from 'preact';
import type { JSX, Ref, VNode } from 'preact';
import { useMemo } from 'preact/hooks';
import { mergeProps } from './merge-props';
export type RenderProp<P, S> = VNode | ((props: P, state: S) => VNode);
type RootElement<Tag extends keyof JSX.IntrinsicElements> =
  JSX.IntrinsicElements[Tag] extends JSX.HTMLAttributes<infer Element> ? Element : never;
export interface UseRenderOptions<
  Tag extends keyof JSX.IntrinsicElements,
  S extends object = Record<string, never>,
> {
  defaultTagName: Tag;
  render?: RenderProp<JSX.IntrinsicElements[Tag], S>;
  props?: JSX.IntrinsicElements[Tag];
  ref?: Ref<RootElement<Tag>> | readonly Ref<RootElement<Tag>>[];
  state?: S;
}
/** Composes a root without a wrapper. Render callbacks must forward props and ref. */
export function useRender<
  Tag extends keyof JSX.IntrinsicElements,
  S extends object = Record<string, never>,
>(options: UseRenderOptions<Tag, S>): VNode {
  const template = typeof options.render === 'function' ? undefined : options.render;
  const props = mergeProps<JSX.IntrinsicElements[Tag]>(options.props, template?.props);
  const refs = [
    options.props?.ref,
    ...(Array.isArray(options.ref) ? options.ref : [options.ref]),
    template?.ref,
  ].filter((ref): ref is Ref<RootElement<Tag>> => ref != null);
  const composedRef = useMemo(() => {
    const unique = [...new Set(refs)];
    return (node: RootElement<Tag> | null) => {
      const cleanups = unique.map((ref) => {
        if (typeof ref === 'function') {
          const cleanup = ref(node);
          return typeof cleanup === 'function' ? cleanup : () => ref(null);
        }
        if (ref) ref.current = node;
        return () => {
          if (ref) ref.current = null;
        };
      });
      return () => {
        for (const cleanup of cleanups) cleanup();
      };
    };
    // Ref arrays are compared by entries so fresh arrays do not detach unchanged refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
  props.className = undefined;
  props.ref = composedRef as JSX.IntrinsicElements[Tag]['ref'];
  if (typeof options.render === 'function') {
    return options.render(props, options.state ?? ({} as S));
  }
  return template ? cloneElement(template, props) : createElement(options.defaultTagName, props);
}
