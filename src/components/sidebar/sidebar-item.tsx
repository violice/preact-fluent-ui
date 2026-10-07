import type { ComponentChildren, JSX, Ref, VNode } from 'preact';
import { forwardRef } from 'preact/compat';
import { useCallback, useContext, useRef, useState } from 'preact/hooks';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { mergeProps } from '../../utils/merge-props';
import { useRender } from '../../utils/use-render';
import type { RenderProp } from '../../utils/use-render';
import { SidebarContext, sidebarValue } from './sidebar-context';
import type { SidebarLayout } from './sidebar-context';
import { SidebarHint } from './sidebar-hint';

type ItemState = { active: boolean; layout: SidebarLayout };
type Common = {
  icon?: ComponentChildren;
  children?: ComponentChildren;
  description?: string;
  label?: string;
  classes?: Partial<
    Record<'root' | 'icon' | 'content' | 'description', JSX.Signalish<string | undefined>>
  >;
};
type AnchorBase = Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'ref' | 'disabled'> &
  Common & {
    as?: 'a';
    active?: JSX.Signalish<boolean>;
    disabled?: never;
    ref?: Ref<HTMLAnchorElement>;
  };
type AnchorProps = AnchorBase &
  (
    | {
        href: NonNullable<JSX.AnchorHTMLAttributes<HTMLAnchorElement>['href']>;
        render?: RenderProp<JSX.IntrinsicElements['a'], ItemState>;
      }
    | {
        href?: JSX.AnchorHTMLAttributes<HTMLAnchorElement>['href'];
        render: RenderProp<JSX.IntrinsicElements['a'], ItemState>;
      }
  );
type ButtonProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'ref'> &
  Common & {
    as: 'button';
    href?: never;
    target?: never;
    download?: never;
    active?: never;
    'aria-current'?: never;
    ref?: Ref<HTMLButtonElement>;
    render?: RenderProp<JSX.IntrinsicElements['button'], ItemState>;
  };
export type SidebarItemProps = AnchorProps | ButtonProps;
type ItemComponent = {
  (props: AnchorProps): VNode | null;
  (props: ButtonProps): VNode | null;
};
export const SidebarItem = /* @__PURE__ */ forwardRef<HTMLElement, SidebarItemProps>(
  function SidebarItem(
    {
      as = 'a',
      icon,
      active,
      description,
      label,
      classes,
      children,
      render,
      class: classProp,
      className,
      ...props
    },
    ref,
  ) {
    const { layout, styles } = useContext(SidebarContext);
    const trigger = useRef<HTMLElement>(null);
    const [hint, setHint] = useState(false);
    const hovered = useRef(false);
    const focused = useRef(false);
    const focusVisible = useRef(false);
    const dismissed = useRef(false);
    const dismissHint = useCallback(() => {
      dismissed.current = true;
      setHint(false);
    }, []);
    const hasIcon = icon !== undefined && icon !== null && icon !== false;
    const isActive = as === 'a' && !!sidebarValue(active ?? false);
    const text = label ?? (typeof children === 'string' ? children : undefined);
    const root = useRender({
      defaultTagName: as as 'a',
      render: render as RenderProp<JSX.IntrinsicElements['a'], ItemState> | undefined,
      ref: [ref as Ref<HTMLAnchorElement>, trigger as Ref<HTMLAnchorElement>],
      state: { active: isActive, layout },
      props: mergeProps<JSX.IntrinsicElements['a'] & { 'data-has-icon'?: boolean }>(
        {
          onMouseEnter: () => {
            hovered.current = true;
            setHint(!dismissed.current);
          },
          onMouseLeave: () => {
            hovered.current = false;
            if (!focused.current) dismissed.current = false;
            setHint(!dismissed.current && focusVisible.current);
          },
          onFocus: (event) => {
            focused.current = true;
            focusVisible.current = event.currentTarget.matches(':focus-visible');
            setHint(!dismissed.current && (focusVisible.current || hovered.current));
          },
          onBlur: () => {
            focused.current = false;
            focusVisible.current = false;
            if (!hovered.current) dismissed.current = false;
            setHint(!dismissed.current && hovered.current);
          },
          onKeyDown: (event) => {
            if (event.key === 'Escape') dismissHint();
          },
        },
        props as JSX.IntrinsicElements['a'],
        {
          type:
            as === 'button'
              ? ((props as ButtonProps).type ?? 'button')
              : (props as AnchorProps).type,
          'aria-current': as === 'a' && isActive ? 'page' : undefined,
          'aria-label': label ?? props['aria-label'],
          'data-has-icon': hasIcon,
          class: cx(
            styles.item,
            hasIcon && styles.itemWithIcon,
            resolveClass(classProp, className),
            classes?.root,
          ),
          children: (
            <>
              {hasIcon && (
                <span aria-hidden="true" class={cx(styles.icon, classes?.icon)}>
                  {icon}
                </span>
              )}
              <span class={cx(styles.itemText, hasIcon && styles.itemTextWithIcon)}>
                <span class={cx(styles.itemContent, classes?.content)}>{children}</span>
                {description && (
                  <span
                    aria-hidden={layout === 'rail' || undefined}
                    class={cx(styles.description, classes?.description)}
                  >
                    {description}
                  </span>
                )}
              </span>
            </>
          ),
        },
      ),
    });
    return (
      <>
        {root}
        {hint &&
          layout === 'rail' &&
          text &&
          !sidebarValue(props.hidden ?? false) &&
          typeof document !== 'undefined' && (
            <SidebarHint trigger={trigger} text={text} onDismiss={dismissHint} />
          )}
      </>
    );
  },
) as ItemComponent;
