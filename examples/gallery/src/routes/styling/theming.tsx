import { DocSection } from '../../components/documentation/doc-section';
import { CodeExample } from '../../components/code-block';
import { galleryStyles } from '../../styles/gallery.styles';

export function Theming() {
  return (
    <div class={galleryStyles.sections}>
      <p class={galleryStyles.lead}>
        Appearance mode and named themes are independent. A mode selects light or dark values; a
        named theme overrides existing tokens within a scope.
      </p>
      <DocSection title="System, light and dark appearance">
        <p>
          Without an explicit mode, the generated stylesheet follows prefers-color-scheme. Set
          data-color-mode to light or dark on the document root to choose a mode explicitly.
        </p>
        <CodeExample
          code={`// Explicit appearance
document.documentElement.dataset.colorMode = 'dark';

// Follow the system again
delete document.documentElement.dataset.colorMode;`}
        />
        <p>
          You can also set data-color-mode on a subtree. Nested scopes allow a preview to use a
          different appearance from the surrounding application.
        </p>
      </DocSection>
      <DocSection title="Define a named theme">
        <p>
          Add a theme in config.themes. Named themes override paths that already exist in the base
          configuration. Add new paths with theme.extend first.
        </p>
        <CodeExample
          code={`themes: {
  brand: {
    semanticTokens: {
      colors: {
        primary: {
          value: {
            base: '#1456b8',
            _dark: '#8db8ff',
            _forcedColors: 'LinkText',
          },
        },
        'on-primary': {
          value: {
            base: '#ffffff',
            _dark: '#102040',
            _forcedColors: 'Canvas',
          },
        },
      },
    },
  },
},`}
        />
        <p>
          Conditional overrides replace the token's value, so supply the modes and forced-colors
          behavior you need. Check contrast for text, controls, hover states and focus indicators
          after changing a palette.
        </p>
      </DocSection>
      <DocSection title="Apply a theme">
        <CodeExample
          code={`<section data-pfui-theme="brand">
  <Button>Brand action</Button>
</section>

<section data-pfui-theme="brand" data-color-mode="dark">
  <Button>Dark brand action</Button>
</section>`}
        />
        <p>
          Set data-pfui-theme on the document root for the whole application, or on a container for
          a local theme. Components and token-based application styles inherit generated variables.
          Changing attributes switches themes without rebuilding styles.
        </p>
      </DocSection>
    </div>
  );
}
