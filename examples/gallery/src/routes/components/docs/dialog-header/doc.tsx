import type { ComponentDoc } from '../../types';
import { DocDialogHeaderExample } from './dialog-header-example';

export const dialogHeaderDoc: ComponentDoc = {
  title: 'DialogHeader',
  slug: 'dialog-header',
  purpose: 'Name a dialog with a heading and optional description.',
  example: DocDialogHeaderExample,
  code: '<DialogHeader id="dialog-title" title="Connection details" description="Review the configuration." />',
  props: [
    ['id', 'string, required', 'ID assigned to the h2 heading.'],
    ['title', 'string, required', 'Heading text.'],
    ['description', 'ComponentChildren', 'Optional description.'],
    ['classes', 'root, title, description', 'Add classes to header parts.'],
  ],
  accessibility:
    'Pass the heading id to Modal labelledBy. The ref and native props apply to the header element.',
};
