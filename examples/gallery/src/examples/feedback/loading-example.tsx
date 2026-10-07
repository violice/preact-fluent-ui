import { css, cx } from '../../../../../.artifacts/gallery-styled-system/css';
import { LoadingState } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function LoadingExample() {
  return (
    <div class={cx(galleryStyles.stack, css({ width: '100%' }))}>
      <LoadingState label="Loading connection profiles">
        Saved profiles will appear when loading finishes.
      </LoadingState>
      <LoadingState appearance="inline" label="Refreshing profiles">
        Existing results remain available.
      </LoadingState>
    </div>
  );
}
