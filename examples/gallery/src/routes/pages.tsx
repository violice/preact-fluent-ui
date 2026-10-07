import { stylingPages } from './styling/pages';
import { Changelog } from '../components/changelog';
import { utilityPages } from './utils';
import { About } from './overview/about';
import { GettingStarted } from './overview/getting-started';
import { stylePages } from './styles/style-docs';
import { componentDocs } from './components/component-docs';
import { createComponentRoute } from './components/component-route';
import type { GalleryPage } from './components/types';

export const galleryPages: GalleryPage[] = [
  ...utilityPages,
  {
    path: '/',
    title: 'Getting Started',
    group: 'Overview',
    component: GettingStarted,
  },
  { path: '/changelog', title: 'Changelog', group: 'Overview', component: Changelog },
  { path: '/about', title: 'About', group: 'Overview', component: About },
  ...componentDocs.map((doc) => ({
    path: `/components/${doc.slug}`,
    title: doc.title,
    group: 'Components' as const,
    component: createComponentRoute(doc),
    demoOwnsHeading: doc.title === 'PageHeader',
  })),
  ...stylingPages,
  ...stylePages,
];
