import type { ComponentChildren } from 'preact';
import { Text } from '../../../dist/components.js';
import styles from './gallery.module.css';

export function DocSection({ title, children }: { title: string; children: ComponentChildren }) {
  return (
    <section class={styles.docSection}>
      <Text preset="subtitle1" render={<h2 />}>
        {title}
      </Text>
      {children}
    </section>
  );
}
