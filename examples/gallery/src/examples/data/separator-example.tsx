import { css, cx } from '../../../../../.artifacts/gallery-styled-system/css';
import { Button, Toolbar, ToolbarGroup, Separator } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function SeparatorExample() {
  return (
    <div class={cx(galleryStyles.sections, css({ width: '100%' }))}>
      <span>Decorative horizontal separator</span>
      <Separator />
      <span>Semantic section boundary</span>
      <Separator decorative={false} aria-label="Section boundary" />
      <Toolbar>
        <ToolbarGroup>
          <Button>First action</Button>
          <Separator orientation="vertical" />
          <Button>Second action</Button>
        </ToolbarGroup>
      </Toolbar>
      <div>
        <Toolbar>
          <ToolbarGroup>
            <span>Section</span>
            <Separator
              orientation="vertical"
              decorative={false}
              aria-label="Vertical boundary"
              class={css({ height: '32px' })}
            />
            <span>Next section</span>
          </ToolbarGroup>
        </Toolbar>
      </div>
    </div>
  );
}
