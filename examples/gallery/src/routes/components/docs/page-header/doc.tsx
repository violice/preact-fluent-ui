import type { ComponentDoc } from '../../types';
import { DocPageHeaderExample } from './page-header-example';

export const pageHeaderDoc: ComponentDoc = {
  title: 'PageHeader',
  slug: 'page-header',
  purpose: 'Introduce a page with its title, description, actions and notices.',
  example: DocPageHeaderExample,
  code: `<PageHeader
  title="Connection workspace"
  description="Manage local connections."
  actions={<Button>Add connection</Button>}
/>`,
  props: [
    ['title', 'string, required', 'Page heading rendered as h1.'],
    ['description', 'string, required', 'Supporting text.'],
    ['actions / notices', 'ComponentChildren', 'Optional actions and notices.'],
    [
      'classes',
      'root, content, title, description, actions, notices',
      'Add classes to the header parts.',
    ],
  ],
  accessibility:
    'PageHeader renders h1. This documentation page uses the demonstration as its sole h1. Use a descriptive title and meaningful action labels.',
};
