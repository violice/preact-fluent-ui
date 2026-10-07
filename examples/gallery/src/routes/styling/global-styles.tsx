import { DocSection } from '../../components/documentation/doc-section';
import { CodeExample } from '../../components/code-block';
import { galleryStyles } from '../../styles/gallery.styles';

export function GlobalStyles() {
  return (
    <div class={galleryStyles.sections}>
      <p class={galleryStyles.lead}>
        globalStyles adds document rules to the generated stylesheet. Use it for body, your
        application root and other shared selectors.
      </p>
      <DocSection title="Define global rules">
        <CodeExample
          code={`fluentStyles({
  config: {
    presets: [fluentPreset],
    reset: false,
    native: false,
    globalStyles: {
      body: {
        margin: '0',
        backgroundColor: '{colors.canvas}',
        color: '{colors.text}',
      },
      '#app': { minHeight: '100vh' },
      '@media (max-width: 640px)': {
        '#app': { padding: '12px' },
      },
    },
  },
});`}
        />
        <p>
          Keys are selectors or supported at-rules. Values are style objects with CSS properties,
          token paths and nested rules. globalStyles is independent of reset and native; your rules
          are emitted even when both switches are disabled.
        </p>
      </DocSection>
      <DocSection title="Global rules or component classes">
        <p>
          Use globalStyles for intentional document-wide rules. Use css, cva or sva and apply their
          classes for styles belonging to a component. A broad selector such as button affects every
          matching element in its scope.
        </p>
        <p>
          Global rules merge across presets and your configuration. Generated layers follow reset,
          native, base, tokens, recipes and utilities. globalStyles belongs to base; recipes and
          utilities can override it according to the CSS cascade.
        </p>
      </DocSection>
      <DocSection title="Reusable conditions">
        <CodeExample
          code={`conditions: {
  compact: '@media (max-width: 640px)',
},
globalStyles: {
  '#app': {
    padding: '24px',
    _compact: { padding: '12px' },
  },
},`}
        />
        <p>
          Define a condition without the underscore, then use it with an underscore in style
          objects. The same conditions work in css definitions. Media queries define shared
          breakpoints; parent selectors can define contextual states.
        </p>
      </DocSection>
    </div>
  );
}
