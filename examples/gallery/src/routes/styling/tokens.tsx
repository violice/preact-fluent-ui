import { DocSection } from '../../components/documentation/doc-section';
import { CodeExample } from '../../components/code-block';
import { galleryStyles } from '../../styles/gallery.styles';

export function Tokens() {
  return (
    <div class={galleryStyles.sections}>
      <p class={galleryStyles.lead}>
        Tokens name reusable colors, spacing, fonts and other style values. The compiler generates
        CSS variables and typed references from your configuration.
      </p>
      <DocSection title="Concrete and semantic tokens">
        <p>
          theme.tokens stores concrete values. theme.semanticTokens names roles such as a page
          background or primary action color. Each token leaf has a value. References to other
          tokens use braces.
        </p>
        <CodeExample
          code={`theme: {
  extend: {
    tokens: {
      spacing: { page: { value: '24px' } },
      colors: { brand: { value: '#1456b8' } },
    },
    semanticTokens: {
      colors: { 'page-heading': { value: '{colors.brand}' } },
    },
  },
},`}
        />
        <p>
          Use theme.extend to merge into the preset without losing neighboring tokens. Direct
          theme.tokens and theme.semanticTokens entries replace top-level groups, so defining colors
          there can replace the preset's colors group.
        </p>
      </DocSection>
      <DocSection title="Token names in CSS objects">
        <p>
          A short name is resolved using the property category: padding and gap look in spacing,
          color and backgroundColor in colors, borderRadius in radii, and fontFamily in fonts. Full
          paths require braces. Use a full path for other categories such as fontSizes and shadows.
          A bare string such as colors.primary is ordinary CSS text and is not a token reference.
        </p>
        <CodeExample
          code={`css({ padding: '4', color: 'primary' });
css({ padding: '{spacing.4}', color: '{colors.primary}', fontSize: '{fontSizes.body}' });
css({ border: '1px solid {colors.border}' });`}
        />
        <p>
          fluentPreset includes fonts, fontSizes, fontWeights, radii and spacing, concrete palette
          and system color values, and semantic colors, shadows and codeColors. Use semantic roles
          for application surfaces and text so appearance and forced-colors changes follow the
          theme.
        </p>
      </DocSection>
      <DocSection title="Use tokens in styles">
        <CodeExample
          code={`import { css, token } from '../styled-system/css';

export const pageStyles = css({
  padding: '{spacing.page}',
  color: '{colors.page-heading}',
});

<div class={pageStyles}>Page content</div>
<div style={{ color: token.var('colors.page-heading') }}>Heading</div>`}
        />
        <p>
          css resolves token paths for the property being compiled. token.var returns a CSS variable
          reference, rather than a resolved color or number. Import both from the generated entry so
          custom paths are included in its token types.
        </p>
      </DocSection>
      <DocSection title="Mode-dependent values">
        <CodeExample
          code={`theme: {
  extend: {
    semanticTokens: {
      colors: {
        'page-heading': {
          value: {
            base: '#1456b8',
            _dark: '#8db8ff',
            _forcedColors: 'CanvasText',
          },
        },
      },
    },
  },
},`}
        />
        <p>
          A conditional value requires base. _dark and _light select appearance modes. fluentPreset
          supplies the forcedColors condition for _forcedColors. Preserve system colors for readable
          text and focus indicators in forced-colors mode.
        </p>
        <p>
          Unknown references and circular aliases fail configuration validation. Load the generated
          stylesheet for token variables to have values.
        </p>
      </DocSection>
    </div>
  );
}
