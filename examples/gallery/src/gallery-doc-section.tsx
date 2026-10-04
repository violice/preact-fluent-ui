import type { ComponentChildren } from 'preact';
import styles from './gallery.module.css';

export function DocSection({ title, children }: { title: string; children: ComponentChildren }) {
  return (
    <section class={styles.docSection}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
