import { DocSection } from '../../components/documentation/doc-section';
import { useGalleryHref } from '../../state/gallery-context';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function About() {
  const href = useGalleryHref();
  return (
    <div class={galleryStyles.sections}>
      <p class={galleryStyles.lead}>Fluent-style components for Preact applications.</p>
      <p class={galleryStyles.lead}>
        Build desktop tools with familiar settings, forms, feedback and dialogs. This independent
        project is not an official Microsoft library or the complete Fluent component catalog.
      </p>
      <DocSection title="Why it exists">
        <p>
          The library grew from shared controls in desktop tools. Extracting those controls lets
          applications reuse the same presentation and native behavior without repeating button,
          field and dialog code.
        </p>
      </DocSection>
      <DocSection title="Design principles">
        <ul>
          <li>
            Native HTML props, events and refs remain available. Forms use named controls and
            FormData.
          </li>
          <li>
            CSS is explicit and opt-in. Configuration independently enables document defaults and
            native control styles alongside generated theme and component rules.
          </li>
          <li>
            Compose small components for larger layouts. Multipart components expose named class
            slots; single-element components accept a root class.
          </li>
          <li>
            Your application owns state and routing. Signals are optional, and the library has no
            router dependency.
          </li>
        </ul>
      </DocSection>
      <DocSection title="What is included">
        <p>
          <a class={galleryStyles.documentationLink} href={href('/components/button')}>
            Buttons
          </a>{' '}
          and labelled inputs cover common actions and data entry.{' '}
          <a class={galleryStyles.documentationLink} href={href('/components/info-bar')}>
            InfoBar
          </a>
          , badges and empty states present feedback. Modal and confirmation dialogs support
          controlled interactions.{' '}
          <a class={galleryStyles.documentationLink} href={href('/components/sidebar')}>
            Sidebar parts
          </a>
          , Card and PageHeader compose application layouts.
        </p>
      </DocSection>
      <DocSection title="Styles and themes">
        <p>
          The style engine compiles typed CSS objects, recipes and token references with the Vite
          plugin. Import css, cx, cva, sva and token from the generated styled-system/css entry.
          Configure fluentPreset for theme tokens and optional reset and native control styles. The{' '}
          <a class={galleryStyles.documentationLink} href={href('/styling/theming')}>
            Theming documentation
          </a>{' '}
          explains appearance modes and named theme scopes.
        </p>
      </DocSection>
      <DocSection title="Start building">
        <p>
          <a class={galleryStyles.documentationLink} href={href('/')}>
            Install the library and connect its CSS
          </a>
          , then try the local profile form and browse Components, Utils and Styles. Open Appearance
          settings in the sidebar to compare themes and style configuration throughout the
          documentation.
        </p>
      </DocSection>
    </div>
  );
}
