import type { ComponentChildren } from 'preact';
import { Text } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function DocSection({ title, children }: { title: string; children: ComponentChildren }) {
  return (
    <section class={galleryStyles.docSection}>
      <Text preset="subtitle1" render={<h2 />}>
        {title}
      </Text>
      {children}
    </section>
  );
}
