import type { ComponentType } from 'preact';

export type Prop = [name: string, type: string, description: string];

export type ComponentDoc = {
  title: string;
  slug: string;
  purpose: string;
  example: ComponentType;
  code: string;
  props: Prop[];
  accessibility: string;
  note?: string;
  members?: ComponentDoc[];
};

export type GalleryPage = {
  path: string;
  title: string;
  group: 'Overview' | 'Components' | 'Styles' | 'Styling' | 'Utils';
  component: ComponentType;
  demoOwnsHeading?: boolean;
};
