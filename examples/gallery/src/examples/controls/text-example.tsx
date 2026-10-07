import { css } from '../../../../../.artifacts/gallery-styled-system/css';
import { Text } from '../../../../../dist/components.js';
import type { TextColor } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';
import { textPresets } from './text-presets';

export function TextExample() {
  return (
    <div class={galleryStyles.stack}>
      {textPresets.map((preset) => (
        <Text key={preset} preset={preset} render={<p />} data-preset={preset}>
          {preset}
        </Text>
      ))}
      <Text preset="subtitle2" render={<h2 />}>
        Semantic heading
      </Text>
      <Text render={(props, state) => <p {...props} data-current-preset={state.preset} />}>
        A paragraph composed through a render callback.
      </Text>
      <Text>Default inline text</Text>
      <div class={css({ color: 'text-muted' })}>
        {(['inherit', 'default', 'muted', 'subtle'] satisfies TextColor[]).map((color) => (
          <Text key={color} color={color} render={<p />} data-color={color}>
            {color}
          </Text>
        ))}
      </div>
    </div>
  );
}
