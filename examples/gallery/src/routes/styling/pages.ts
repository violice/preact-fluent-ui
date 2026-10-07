import { Configuration } from './configuration';
import { Tokens } from './tokens';
import { GlobalStyles } from './global-styles';
import { Theming } from './theming';
import type { GalleryPage } from '../components/types';

export const stylingPages: GalleryPage[] = [
  {
    path: '/styling/configuration',
    title: 'Configuration',
    group: 'Styling',
    component: Configuration,
  },
  { path: '/styling/tokens', title: 'Tokens', group: 'Styling', component: Tokens },
  {
    path: '/styling/global-styles',
    title: 'Global styles',
    group: 'Styling',
    component: GlobalStyles,
  },
  { path: '/styling/theming', title: 'Theming', group: 'Styling', component: Theming },
];
