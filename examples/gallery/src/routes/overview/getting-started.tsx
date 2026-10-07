import { DocSection } from '../../components/documentation/doc-section';
import { QuickstartExample, quickstartCode } from '../../examples/quickstart';
import { CodeExample } from '../../components/code-block';
import { useGalleryHref } from '../../state/gallery-context';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function GettingStarted() {
  const href = useGalleryHref();
  return (
    <div class={galleryStyles.sections}>
      <p class={galleryStyles.lead}>
        Add Fluent-style components to an existing Preact application with Vite. The plugin
        generates your theme and CSS; your application imports the generated files.
      </p>
      <DocSection title="1. Install">
        <p>
          The library supports Preact ^10.27.0. Add the package and the Vite tooling if your project
          does not already have them.
        </p>
        <CodeExample
          language="shell"
          code={`npm install @violice/preact-fluent-ui preact
npm install -D vite @preact/preset-vite`}
        />
      </DocSection>
      <DocSection title="2. Configure CSS generation">
        <p>
          Add fluentStyles before the Preact plugin in vite.config.ts. This configuration uses the
          Fluent theme with document defaults and native control styles enabled. This is the
          recommended starting configuration. fluentPreset enables reset and native by default.
        </p>
        <CodeExample
          code={`import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { fluentStyles } from '@violice/preact-fluent-ui/vite';
import { fluentPreset } from '@violice/preact-fluent-ui/config';

export default defineConfig({
  plugins: [
    fluentStyles({
      config: { presets: [fluentPreset] },
    }),
    preact(),
  ],
});`}
        />
        <p>
          Start Vite to generate styled-system at the project root. The directory contains css.ts
          for style functions and typed token references, and styles.css for theme, component and
          application CSS. The plugin manages these files; configure it rather than editing
          generated files.
        </p>
        <CodeExample language="shell" code="npx vite" />
      </DocSection>
      <DocSection title="3. Import the stylesheet once">
        <p>
          Add the generated stylesheet to your application entry. For an entry at src/main.tsx, use
          the path below. Adjust relative paths if your files are elsewhere.
        </p>
        <CodeExample
          code={`// src/main.tsx
import { render } from 'preact';
import '../styled-system/styles.css';
import { App } from './app';

render(<App />, document.getElementById('app')!);`}
        />
        <p>
          This single stylesheet includes the configured theme, component rules and extracted
          application styles.
        </p>
      </DocSection>
      <DocSection title="4. Render a component">
        <p>Import UI components from the package's /components entry.</p>
        <CodeExample
          code={`// src/app.tsx
import { Button } from '@violice/preact-fluent-ui/components';

export function App() {
  return <Button onClick={() => alert('Saved')}>Save</Button>;
}`}
        />
      </DocSection>
      <DocSection title="5. Add your own styles">
        <p>
          Import css and the other style functions from the generated styled-system/css entry. Its
          token types reflect your plugin configuration. Define reusable styles outside components
          and apply the returned class.
        </p>
        <CodeExample
          code={`// src/app.tsx
import { Button } from '@violice/preact-fluent-ui/components';
import { css } from '../styled-system/css';

export const actionStyles = css({
  marginInlineStart: '8px',
});

export function App() {
  return <Button class={actionStyles}>Save</Button>;
}`}
        />
        <p>
          Use the same generated entry for cx, cva, sva and token. See the{' '}
          <a class={galleryStyles.documentationLink} href={href('/styles/css')}>
            Styles documentation
          </a>{' '}
          for static rules, runtime values and recipes.
        </p>
      </DocSection>
      <DocSection title="Configure styles and themes">
        <p>
          Continue with these pages to customize document defaults, tokens, global rules and themes.
        </p>
        <ul>
          {[
            ['configuration', 'Configuration'],
            ['tokens', 'Tokens'],
            ['global-styles', 'Global styles'],
            ['theming', 'Theming'],
          ].map(([slug, title]) => (
            <li key={slug}>
              <a class={galleryStyles.documentationLink} href={href('/styling/' + slug)}>
                {title}
              </a>
            </li>
          ))}
        </ul>
      </DocSection>
      <DocSection title="Where imports come from">
        <ul>
          <li>
            Components such as Button, Field and Input come from
            @violice/preact-fluent-ui/components.
          </li>
          <li>
            Style functions css, cx, cva, sva and token come from your generated styled-system/css.
          </li>
          <li>
            Composition helpers mergeProps, resolveClass and useRender come from
            @violice/preact-fluent-ui/utils when you need them.
          </li>
          <li>
            fluentStyles and fluentPreset belong in Vite configuration and come from /vite and
            /config.
          </li>
        </ul>
        <p>
          Shared types such as ClassValue and StyleObject are available as type-only imports from
          @violice/preact-fluent-ui/styles. Application style functions use the generated entry.
        </p>
      </DocSection>
      <DocSection title="Try a profile form">
        <p>
          Field connects labels to native controls. Submit named values with FormData and display
          the result in InfoBar. This example saves only local demo state.
        </p>
        <QuickstartExample />
        <CodeExample code={quickstartCode} />
        <p>
          Use native HTML props, refs and events. Give every input a label and every icon button an
          accessible name. Button defaults to type="button"; set type="submit" for a form action.
        </p>
      </DocSection>
    </div>
  );
}
