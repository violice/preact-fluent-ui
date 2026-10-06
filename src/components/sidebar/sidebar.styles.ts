import { sva, css } from '../../styling';
export const sidebarClasses = sva({
  slots: [
    'sidebar',
    'header',
    'footer',
    'nav',
    'group',
    'content',
    'label',
    'item',
    'icon',
    'itemText',
    'itemContent',
    'description',
    'brand',
    'brandLogo',
    'brandContent',
    'brandTitle',
    'hint',
    'itemWithIcon',
    'itemTextWithIcon',
    'brandContentWithLogo',
  ],
  base: {
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      boxSizing: 'border-box',
      minWidth: '0',
      padding: 'var(--space-3)',
      fontFamily: 'var(--font-body)',
      fontSynthesis: 'none',
      fontSize: 'var(--type-body)',
      lineHeight: '20px',
      color: 'var(--color-text)',
      background: 'var(--sidebar-background, var(--color-card))',
      overflowWrap: 'anywhere',
      '&[hidden]': {
        display: 'none',
      },
    },
    header: {
      minWidth: '0',
      padding: 'var(--space-2)',
      '&[hidden]': {
        display: 'none',
      },
      flexShrink: '0',
    },
    footer: {
      minWidth: '0',
      padding: 'var(--space-2)',
      '&[hidden]': {
        display: 'none',
      },
      flexShrink: '0',
      marginBlockStart: 'auto',
    },
    nav: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '0',
      gap: 'var(--space-4)',
      '&[hidden]': {
        display: 'none',
      },
    },
    group: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '0',
      '&[hidden]': {
        display: 'none',
      },
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '0',
      gap: 'var(--space-1)',
    },
    label: {
      padding: 'var(--space-2) var(--space-3)',
      color: 'var(--color-text-muted)',
      fontWeight: '600',
    },
    item: {
      position: 'relative',
      width: '100%',
      minHeight: '44px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      minWidth: '0',
      padding: 'var(--space-2) var(--space-3)',
      borderRadius: 'var(--radius-sm)',
      color: 'inherit',
      textDecoration: 'none',
      overflowWrap: 'anywhere',
      '&:hover': {
        background: 'var(--sidebar-hover-background, var(--color-surface-hover))',
      },
      "&[aria-current='page']": {
        background: 'var(--sidebar-active-background, var(--color-surface-hover))',
        color: 'var(--sidebar-active-color, var(--color-accent))',
        fontWeight: '600',
      },
      "&[aria-current='page']::before": {
        content: "''",
        position: 'absolute',
        insetInlineStart: '0',
        insetBlock: 'var(--space-2)',
        width: '3px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-accent)',
      },
      '&:focus-visible': {
        outline: '2px solid var(--color-accent)',
        outlineOffset: '2px',
      },
      '@media (forced-colors: active)': {
        "&[aria-current='page']": {
          outline: '1px solid Highlight',
        },
        "&[aria-current='page']::before": {
          background: 'Highlight',
          forcedColorAdjust: 'none',
        },
        '&:focus-visible': {
          outlineColor: 'Highlight',
        },
        'button&:disabled': {
          color: 'GrayText',
          opacity: '1',
        },
      },
      '&[hidden]': {
        display: 'none',
      },
      'button&': {
        border: '0',
        background: 'transparent',
        font: 'inherit',
        textAlign: 'start',
        cursor: 'pointer',
      },
      'button&:disabled': {
        opacity: '0.5',
        cursor: 'default',
      },
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        transition: 'none',
      },
    },
    icon: {
      display: 'inline-flex',
      flex: '0 0 auto',
      alignItems: 'center',
    },
    itemText: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '0',
    },
    itemContent: {
      minWidth: '0',
    },
    description: {
      color: 'var(--color-text-muted)',
      fontSize: 'var(--type-caption)',
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      minWidth: '0',
      boxSizing: 'border-box',
      padding: 'var(--space-2)',
      '&[hidden]': {
        display: 'none',
      },
    },
    brandLogo: {
      display: 'inline-flex',
      flexShrink: '0',
    },
    brandContent: {
      minWidth: '0',
    },
    brandTitle: {
      fontWeight: '600',
    },
    hint: {
      position: 'fixed',
      zIndex: '1000',
      transform: 'translateY(-50%)',
      maxWidth: 'min(240px, calc(100vw - 16px))',
      boxSizing: 'border-box',
      padding: 'var(--space-2) var(--space-3)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--color-card)',
      color: 'var(--color-text)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--type-caption)',
      overflowWrap: 'anywhere',
      pointerEvents: 'none',
      '@media (forced-colors: active)': {
        borderColor: 'CanvasText',
      },
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        transition: 'none',
      },
    },
  },
  variants: {
    layout: {
      expanded: {},
      rail: {
        itemWithIcon: {
          justifyContent: 'center',
        },
        label: {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clipPath: 'inset(50%)',
          whiteSpace: 'nowrap',
          border: '0',
        },
        itemTextWithIcon: {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clipPath: 'inset(50%)',
          whiteSpace: 'nowrap',
          border: '0',
        },
        brandContentWithLogo: {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clipPath: 'inset(50%)',
          whiteSpace: 'nowrap',
          border: '0',
        },
        description: {
          display: 'none',
        },
        brand: {
          justifyContent: 'center',
        },
      },
      horizontal: {
        sidebar: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        nav: {
          flexDirection: 'row',
          alignItems: 'center',
          overflowX: 'auto',
          overflowY: 'hidden',
        },
        group: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        content: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        item: {
          width: 'auto',
          flexShrink: '0',
          "&[aria-current='page']::before": {
            insetInline: 'var(--space-2)',
            insetBlock: 'auto 0',
            width: 'auto',
            height: '3px',
          },
        },
        footer: {
          marginBlockStart: '0',
          marginInlineStart: 'auto',
        },
      },
    },
    scrollable: {
      false: {},
      true: {
        nav: {
          flex: '1',
          minHeight: '0',
          overflowY: 'auto',
        },
      },
    },
  },
  defaultVariants: {
    layout: 'expanded',
    scrollable: false,
  },
  compoundVariants: [
    {
      layout: 'horizontal',
      scrollable: true,
      css: {
        nav: {
          overflowY: 'hidden',
        },
      },
    },
  ],
});
export default sidebarClasses();

export function sidebarHintPosition(position: { top: number; left: number }) {
  return css.dynamic({ top: position.top, left: position.left });
}
