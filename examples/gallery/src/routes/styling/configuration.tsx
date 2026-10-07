import { configurationOptions, pluginOptions } from './configuration-options';
import { configurationOverviewCode, configurationHelpersCode } from './configuration-code';
import { Text } from '../../../../../dist/components.js';
import { DocSection } from '../../components/documentation/doc-section';
import { CodeExample } from '../../components/code-block';
import { useGalleryHref } from '../../state/gallery-context';
import { galleryStyles } from '../../styles/gallery.styles';

export function Configuration() {
  const href = useGalleryHref();
  return (
    <div class={galleryStyles.sections}>
      <p class={galleryStyles.lead}>
        Configure generated CSS with fluentStyles in Vite. Style options belong inside config;
        generator options belong beside it.
      </p>
      <CodeExample code={configurationOverviewCode} />
      <p>
        This example shows every configuration field and generator option. reset, native, outdir and
        components use their recommended defaults; tokens, themes, conditions and global rules
        demonstrate optional customization. configFile is an alternative to the inline config
        object.
      </p>
      <p>The following examples describe each field separately.</p>
      {configurationOptions.map((option) => (
        <DocSection key={option.name} title={option.name}>
          <p>{option.description}</p>
          <p>Default: {option.defaultValue}</p>
          <CodeExample code={option.code} />
          {option.link && (
            <p>
              <a class={galleryStyles.documentationLink} href={href('/styling/' + option.link[0])}>
                {option.link[1]}
              </a>
            </p>
          )}
        </DocSection>
      ))}
      <DocSection title="defineConfig and definePreset">
        <p>
          Import these helpers from /config. defineConfig checks a configuration object while
          preserving inferred types. definePreset does the same for a reusable preset. They return
          the object unchanged; merging and token validation happen when the generator resolves it.
        </p>
        <CodeExample code={configurationHelpersCode} />
        <p>
          StylesConfig describes the complete configuration, ThemeDefinition describes token
          overrides and TokenLeaf describes a value with an optional description. Use type-only
          imports from /config when annotating shared configuration data.
        </p>
      </DocSection>
      <Text preset="subtitle1" render={<h2 />}>
        Generator options
      </Text>
      <p>These options are passed directly to fluentStyles, outside config.</p>
      {pluginOptions.map((option) => (
        <DocSection key={option.name} title={option.name}>
          <p>{option.description}</p>
          <p>Default: {option.defaultValue}</p>
          <CodeExample code={option.code} />
        </DocSection>
      ))}
    </div>
  );
}
