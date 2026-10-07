import { samples } from '../../../../examples/code-samples';
import { InfoBarExample } from '../../../../examples/controls/info-bar-example';
import type { ComponentDoc } from '../../types';

export const infoBarDoc: ComponentDoc = {
  title: 'InfoBar',
  slug: 'info-bar',
  purpose: 'Communicate a result or warning with a title and message.',
  example: InfoBarExample,
  code: samples.notices.split('<StatusBadge')[0],
  props: [
    [
      'tone',
      'info | success | warning | error',
      'Default info. Error uses role alert; other tones use status.',
    ],
    ['title', 'string', 'Optional heading above the content.'],
    ['classes', 'root, title, content', 'Add classes to individual parts.'],
  ],
  accessibility:
    'Keep messages concise. Error messages use alert announcements; use the native role prop to adjust announcements when appropriate.',
};
