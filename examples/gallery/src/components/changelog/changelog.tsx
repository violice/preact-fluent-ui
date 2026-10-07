import { ChangelogContent } from './changelog-content';
import { document } from './markdown';

export function Changelog() {
  return <ChangelogContent document={document} />;
}
