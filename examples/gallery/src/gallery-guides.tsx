import { DocSection } from './gallery-doc-section';
import { QuickstartExample, quickstartCode } from './gallery-quickstart';
import { useSignal, useComputed } from '@preact/signals';
import { Button, Checkbox, Field, InfoBar, Input } from '../../../dist/index.js';
import { CodeExample } from './code-block';
import { FormsDemo } from './gallery-demos';
import { useGalleryHref } from './gallery-context';
import styles from './gallery.module.css';
export function About() {
  const href = useGalleryHref();
  return (
    <div class={styles.sections}>
      <p class={styles.lead}>Fluent-style components for Preact applications.</p>
      <p class={styles.lead}>
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
            CSS is explicit and opt-in. Minimal imports theme tokens and component styles; Full also
            adds the optional document reset and native control styles.
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
          <a class={styles.documentationLink} href={href('/components/button')}>
            Buttons
          </a>{' '}
          and labelled inputs cover common actions and data entry.{' '}
          <a class={styles.documentationLink} href={href('/components/info-bar')}>
            InfoBar
          </a>
          , badges and empty states present feedback. Modal and confirmation dialogs support
          controlled interactions.{' '}
          <a class={styles.documentationLink} href={href('/components/sidebar')}>
            Sidebar parts
          </a>
          , Card and PageHeader compose application layouts.
        </p>
      </DocSection>
      <DocSection title="Styling and themes">
        <p>
          Theme tokens control color, typography and spacing. Primary colors identify actions;
          accent colors mark selection and emphasis. Override them independently for your
          application. The{' '}
          <a class={styles.documentationLink} href={href('/guides/theming')}>
            Theming guide
          </a>{' '}
          covers tokens and CSS imports. The{' '}
          <a class={styles.documentationLink} href={href('/guides/styling')}>
            Styling guide
          </a>{' '}
          covers classes, inline styles and CSS modules.
        </p>
      </DocSection>
      <DocSection title="Start building">
        <p>
          <a class={styles.documentationLink} href={href('/')}>
            Install the library and connect its CSS
          </a>
          , then try the local profile form. Continue with the{' '}
          <a class={styles.documentationLink} href={href('/guides/forms')}>
            Forms guide
          </a>{' '}
          for validation or the{' '}
          <a class={styles.documentationLink} href={href('/guides/signals')}>
            Signals guide
          </a>{' '}
          for reactive values. Open Appearance settings in the sidebar to compare themes and CSS
          presets throughout the documentation.
        </p>
      </DocSection>
    </div>
  );
}
export function GettingStarted() {
  return (
    <div class={styles.sections}>
      <p class={styles.lead}>
        Install the package, import its CSS once and compose native controls in your application.
      </p>
      <DocSection title="Install">
        <p>The library supports Preact ^10.27.0.</p>
        <CodeExample language="shell" code="npm install @violice/preact-fluent-ui preact" />
      </DocSection>
      <DocSection title="Minimal CSS">
        <p>
          Import theme tokens and component styles in your application entry. Your existing document
          and native control styles remain in charge.
        </p>
        <CodeExample
          code={`import '@violice/preact-fluent-ui/theme.css';
import '@violice/preact-fluent-ui/styles.css';`}
        />
      </DocSection>
      <DocSection title="Full CSS">
        <p>
          Optionally add the document reset and native form control styling after the required
          imports.
        </p>
        <CodeExample
          code={`import '@violice/preact-fluent-ui/reset.css';
import '@violice/preact-fluent-ui/native-controls.css';`}
        />
      </DocSection>
      <DocSection title="Build a profile form">
        <p>
          Field connects labels to native controls. Submit named values with FormData and display
          the result in InfoBar. This example saves only local demo state.
        </p>
        <QuickstartExample />
        <CodeExample code={quickstartCode} />
      </DocSection>
      <DocSection title="Native events and labels">
        <p>
          Use native HTML props, refs and events. Give every input a label and every icon button an
          accessible name. Button defaults to type="button"; set type="submit" for a form action.
        </p>
      </DocSection>
    </div>
  );
}
export function FormsGuide() {
  return (
    <div class={styles.sections}>
      <p class={styles.lead}>
        Keep field values and validation in your form. Field connects the label, hint and error to
        the control; native controls submit through FormData.
      </p>
      <FormsDemo />
      <DocSection title="Accessibility">
        <p>
          Show inline errors next to their fields. Use native names and values for submission.
          Disabled controls are excluded from FormData.
        </p>
      </DocSection>
    </div>
  );
}
export function ThemingGuide() {
  return (
    <div class={styles.sections}>
      <p class={styles.lead}>
        The persistent appearance controls choose Minimal or Full CSS, system, light or dark
        appearance, and standard, green or custom colors. Settings travel with page links and
        browser history.
      </p>
      <DocSection title="Override tokens">
        <CodeExample
          language="css"
          code={`:root {
  --color-accent: #147d44;
  --color-primary: #147d44;
  --color-on-primary: #ffffff;
}
@media (prefers-color-scheme: dark) {
  :root { --color-accent: #63d49a; }
}`}
        />
        <InfoBar title="Contrast">
          Check text, controls and focus indicators after changing colors. Keep forced-colors
          behavior available.
        </InfoBar>
      </DocSection>
      <DocSection title="Primary and accent">
        <p>
          Primary colors identify actions and documentation links. Accent colors mark selection and
          decorative emphasis. Set --color-on-primary for readable text on primary buttons.
        </p>
      </DocSection>
      <DocSection title="CSS layers">
        <p>
          Theme tokens, component styles, optional document reset and native controls are separate
          CSS imports. The package does not declare cascade layers. Load application overrides after
          library styles. If your build wraps library imports in a cascade layer, unlayered
          application rules take priority over those layered rules.
        </p>
      </DocSection>
    </div>
  );
}
export function SignalsGuide() {
  const value = useSignal('Office connection');
  const disabled = useSignal(false);
  const accent = useSignal(false);
  const className = useComputed(() => (accent.value ? styles.signalAccent : ''));
  return (
    <div class={styles.sections}>
      <p class={styles.lead}>
        JSX.Signalish accepts reactive values without adding a Signals dependency to the library.
        Install @preact/signals in your application to create signals.
      </p>
      <DocSection title="Live example">
        <div class={styles.preview}>
          <Field label="Signal value">
            {(control) => (
              <Input
                {...control}
                value={value}
                onInput={(event) => {
                  value.value = event.currentTarget.value;
                }}
              />
            )}
          </Field>
          <Checkbox
            label="Disable the signal button"
            checked={disabled}
            onChange={(event) => {
              disabled.value = event.currentTarget.checked;
            }}
          />
          <Checkbox
            label="Apply the signal class"
            checked={accent}
            onChange={(event) => {
              accent.value = event.currentTarget.checked;
            }}
          />
          <Button disabled={disabled} class={className}>
            Signal button
          </Button>
        </div>
        <InfoBar title="Current value">{value}</InfoBar>
        <CodeExample
          code={`import { useSignal, useComputed } from '@preact/signals';
import { Button, Checkbox, Field, InfoBar, Input } from '@violice/preact-fluent-ui';

export function SignalExample() {
  const value = useSignal('Office connection');
  const disabled = useSignal(false);
  const accent = useSignal(false);
  const className = useComputed(() => accent.value ? 'accented' : '');

  return (
    <div>
      <div>
        <Field label="Signal value">
          {control => <Input {...control} value={value}
            onInput={event => { value.value = event.currentTarget.value; }} />}
        </Field>
        <Checkbox label="Disable the signal button" checked={disabled}
          onChange={event => { disabled.value = event.currentTarget.checked; }} />
        <Checkbox label="Apply the signal class" checked={accent}
          onChange={event => { accent.value = event.currentTarget.checked; }} />
        <Button disabled={disabled} class={className}>Signal button</Button>
      </div>
      <InfoBar title="Current value">{value}</InfoBar>
    </div>
  );
}`}
        />
      </DocSection>
      <DocSection title="Local and global state">
        <p>
          This example owns its signals. The gallery appearance store lives in the persistent shell
          and survives page changes.
        </p>
      </DocSection>
    </div>
  );
}

export function StylingGuide() {
  return (
    <div class={styles.sections}>
      <DocSection title="Component classes">
        <p>
          class adds to built-in classes. className is the fallback. Multipart components expose
          named classes slots; single-element components use class.
        </p>
        <CodeExample
          code={
            '<Button class="save-action">Save</Button>\n<Field classes={{ label: "field-label" }} label="Name">\n  {control => <Input {...control} />}\n</Field>'
          }
        />
      </DocSection>
      <DocSection title="Inline styles and CSS modules">
        <p>
          Use native style props for local values and imported CSS module classes for reusable
          rules. Only multipart components expose classes; Button and other single-element
          components accept class.
        </p>
        <CodeExample
          code={`import styles from './actions.module.css';

<Button class={styles.save} style={{ marginInlineStart: '8px' }}>Save</Button>
<Button className="fallback-action">Cancel</Button>`}
        />
      </DocSection>
    </div>
  );
}
