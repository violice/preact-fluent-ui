import type { MarkdownDocument } from '@tanstack/markdown';
import { changelogStyles } from './changelog.styles.ts';
import { block } from './markdown';

export function ChangelogContent({ document }: { document: MarkdownDocument }) {
  return (
    <div class={changelogStyles.prose}>
      {document.children.filter((node) => node.type !== 'heading' || node.depth !== 1).map(block)}
    </div>
  );
}
