import { feedbackDocs } from '../../examples/feedback';
import { dataDocs } from '../../examples/data';
import { appShellDocs } from '../../examples/app-shell';
import { sidebarExamples, sidebarCodes } from '../../examples/sidebar';
import { buttonDoc } from './docs/button/doc';
import { cardDoc } from './docs/card/doc';
import { infoBarDoc } from './docs/info-bar/doc';
import { textDoc } from './docs/text/doc';
import { counterBadgeDoc } from './docs/counter-badge/doc';
import { statusBadgeDoc } from './docs/status-badge/doc';
import { selectDoc } from './docs/select/doc';
import { pageHeaderDoc } from './docs/page-header/doc';
import { emptyStateDoc } from './docs/empty-state/doc';
import { iconDoc } from './docs/icon/doc';
import { modalDoc } from './docs/modal/doc';
import { confirmDialogDoc } from './docs/confirm-dialog/doc';
import { dialogHeaderDoc } from './docs/dialog-header/doc';
import { dialogBodyDoc } from './docs/dialog-body/doc';
import { dialogFooterDoc } from './docs/dialog-footer/doc';
import { inputDoc } from './docs/input/doc';
import { textareaDoc } from './docs/textarea/doc';
import { fieldDoc } from './docs/field/doc';
import { checkboxDoc } from './docs/checkbox/doc';
import { switchDoc } from './docs/switch/doc';
import { textPreviewDoc } from './docs/text-preview/doc';
import { codeBlockDoc } from './docs/code-block/doc';
import type { ComponentDoc, Prop } from './types';
export type { ComponentDoc, GalleryPage, Prop } from './types';
export { native } from './native-props';

export const docs: ComponentDoc[] = [
  ...dataDocs,
  ...feedbackDocs,
  ...appShellDocs,
  buttonDoc,
  cardDoc,
  infoBarDoc,
  textDoc,
  counterBadgeDoc,
  statusBadgeDoc,
  selectDoc,
  pageHeaderDoc,
  emptyStateDoc,
  iconDoc,
  modalDoc,
  confirmDialogDoc,
  dialogHeaderDoc,
  dialogBodyDoc,
  dialogFooterDoc,
  inputDoc,
  textareaDoc,
  fieldDoc,
  checkboxDoc,
  switchDoc,
  ...(
    [
      'Sidebar',
      'SidebarHeader',
      'SidebarNav',
      'SidebarGroup',
      'SidebarItem',
      'SidebarFooter',
      'SidebarBrand',
    ] as const
  ).map((title) => ({
    title,
    slug: title.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
    purpose: {
      Sidebar: 'Compose expanded, rail or horizontal navigation with header, links and footer.',
      SidebarHeader: 'Place a brand or custom content at the top of navigation.',
      SidebarNav: 'Group navigation links in a named native nav landmark.',
      SidebarGroup: 'Group related navigation links with an optional visible label.',
      SidebarItem: 'Navigate with an anchor, run a button action or forward a custom root.',
      SidebarBrand: 'Display a decorative logo, title and optional description.',
      SidebarFooter: 'Place secondary content at the bottom of a Sidebar.',
    }[title],
    example: sidebarExamples[title],
    code: sidebarCodes[title],
    props:
      title === 'SidebarBrand'
        ? ([
            ['title', 'string, required', 'Visible brand title.'],
            [
              'logo / description',
              'ComponentChildren / string',
              'Decorative logo and optional supporting text.',
            ],
            ['classes', 'root, logo, content, title, description', 'Add classes to brand parts.'],
          ] as Prop[])
        : title === 'Sidebar'
          ? ([
              ['layout', 'Signalish<SidebarLayout>', 'expanded, rail or horizontal.'],
              [
                'scrollable',
                'Signalish<boolean>',
                'Make the nav scroll while header and footer remain visible.',
              ],
            ] as Prop[])
          : title === 'SidebarNav'
            ? ([
                [
                  'aria-label or aria-labelledby',
                  'string, required',
                  'Accessible navigation name.',
                ],
              ] as Prop[])
            : title === 'SidebarGroup'
              ? ([
                  [
                    'label',
                    'ComponentChildren',
                    'Optional group label linked through aria-labelledby.',
                  ],
                  ['classes', 'root, label, content', 'Add classes to group parts.'],
                ] as Prop[])
              : title === 'SidebarItem'
                ? ([
                    [
                      'href / as',
                      'anchor href / a | button',
                      'Plain anchors require href. Buttons accept disabled and reject href and active.',
                    ],
                    [
                      'render',
                      'VNode | callback',
                      'Replace the root; forward all composed props, children and ref. as still determines types and defaults.',
                    ],
                    [
                      'label / description',
                      'string',
                      'Explicit accessible name for complex rail content and supporting text.',
                    ],
                    ['active', 'Signalish<boolean>', 'Sets aria-current page.'],
                    ['icon', 'ComponentChildren', 'Optional decorative icon.'],
                    ['classes', 'root, icon, content, description', 'Add classes to item parts.'],
                  ] as Prop[])
                : [],
    accessibility: {
      SidebarBrand:
        'The logo is decorative. The title remains the visible brand text. No interactive wrapper is added.',
      Sidebar:
        'Size and responsive visibility belong to the application shell. Use SidebarNav for the navigation landmark.',
      SidebarHeader: 'Use visible branding and meaningful link text if the brand navigates.',
      SidebarNav:
        'Supply aria-label or aria-labelledby. Links use normal Tab and Enter navigation.',
      SidebarGroup:
        'A visible label names the group. Navigation remains native links without menu roles.',
      SidebarItem:
        'Active links expose aria-current page. Native modified clicks, targets and keyboard activation remain available. Icons are decorative.',
      SidebarFooter: 'Use descriptive text and native buttons or links for secondary actions.',
    }[title],
  })),
];

export const families = [
  ...['Table', 'DataList', 'Toolbar', 'Disclosure'].map((title) => ({
    title,
    slug: title.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
    members: docs.filter((doc) => doc.title.startsWith(title)),
  })),
  {
    title: 'AppShell',
    slug: 'app-shell',
    members: docs.filter((doc) => doc.title.startsWith('AppShell')),
  },
  {
    title: 'Sidebar',
    slug: 'sidebar',
    members: docs.filter((doc) => doc.title.startsWith('Sidebar')),
  },
  {
    title: 'Dialog',
    slug: 'dialog',
    members: ['Modal', 'DialogHeader', 'DialogBody', 'DialogFooter', 'ConfirmDialog'].map((title) =>
      docs.find((doc) => doc.title === title)!,
    ),
  },
];

export const componentDocs: ComponentDoc[] = [
  textPreviewDoc,
  codeBlockDoc,
  ...docs.filter((doc) => !families.some((family) => family.members.includes(doc))),
  ...families.map((family) => ({
    ...family.members[0]!,
    title: family.title,
    slug: family.slug,
    members: family.members,
    ...(family.title === 'Dialog'
      ? {
          purpose:
            'Compose a controlled modal or confirm an action with the dialog family. Dialog is a documentation group, not an exported component. Modal provides focus containment and restoration; DialogHeader, DialogBody and DialogFooter compose its contents. ConfirmDialog composes these parts with Cancel-first focus and pending action handling.',
          note: 'Choose the standard or confirmation scenario in the live example. Mount Modal or ConfirmDialog only while open.',
        }
      : {}),
  })),
];
