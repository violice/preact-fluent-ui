export const configurationOptions = [
  {
    name: 'presets',
    description:
      'Shared configuration objects with tokens, conditions, global styles and defaults. Presets merge in order; your configuration applies after them.',
    defaultValue:
      'No presets in an explicit config object. fluentStyles() without config uses fluentPreset.',
    code: 'presets: [fluentPreset],',
  },
  {
    name: 'reset',
    description:
      'Enable document defaults: border-box sizing, body margin, theme font, text and background colors, inherited control fonts, and heading and paragraph defaults. Disable it if your application already owns these rules.',
    defaultValue: 'true with fluentPreset; false without a preset that enables it.',
    code: 'reset: false,',
  },
  {
    name: 'native',
    description:
      'Enable Fluent styling for plain HTML text inputs, select and textarea, including hover, focus, disabled and invalid states. Disable it to keep their existing appearance. Component CSS remains included independently.',
    defaultValue: 'true with fluentPreset; false without a preset that enables it.',
    code: 'native: true,',
  },
  {
    name: 'globalStyles',
    description:
      'Add global CSS rules keyed by selector or supported at-rule. Values are style objects with CSS properties and token references. These rules merge with preset rules and are emitted even when reset and native are disabled.',
    defaultValue: 'No additional rules.',
    code: "globalStyles: {\n  body: { margin: '0', backgroundColor: '{colors.canvas}' },\n  '#app': { minHeight: '100vh' },\n},",
    link: ['global-styles', 'Global styles'],
  },
  {
    name: 'theme.tokens',
    description:
      'Define concrete token values such as spacing, fonts and colors. Each leaf has a value. Direct entries replace top-level token groups from presets; use theme.extend to preserve neighboring tokens.',
    defaultValue: 'Token values inherited from presets.',
    code: "theme: {\n  tokens: {\n    spacing: { page: { value: '24px' } },\n  },\n},",
    link: ['tokens', 'Tokens'],
  },
  {
    name: 'theme.semanticTokens',
    description:
      'Define named roles such as primary action or page background. Values can reference other tokens and change by appearance mode. Direct entries replace top-level semantic token groups; use theme.extend for partial overrides.',
    defaultValue: 'Semantic tokens inherited from presets.',
    code: "theme: {\n  semanticTokens: {\n    app: {\n      heading: { value: { base: '#1456b8', _dark: '#8db8ff' } },\n    },\n  },\n},",
    link: ['tokens', 'Tokens'],
  },
  {
    name: 'theme.extend',
    description:
      'Deep-merge additional tokens or semantic tokens into the existing theme. Use this to add a token or override one value while retaining the rest of a preset group.',
    defaultValue: 'No additional token overrides.',
    code: "theme: {\n  extend: {\n    tokens: { spacing: { page: { value: '24px' } } },\n  },\n},",
    link: ['tokens', 'Tokens'],
  },
  {
    name: 'conditions',
    description:
      'Define reusable media queries or contextual selectors. Use a condition name with an underscore in style objects. For semantic token conditions, a selector must be a parent selector ending in & or an at-rule.',
    defaultValue: 'Conditions inherited from presets.',
    code: "conditions: {\n  compact: '@media (max-width: 640px)',\n},\n// In a style object: _compact: { padding: '12px' }",
    link: ['global-styles', 'Global styles'],
  },
  {
    name: 'themes',
    description:
      'Define named overrides for existing token paths. Apply a theme with data-pfui-theme on the document root or a container. Add new token paths to the base theme before overriding them here.',
    defaultValue: 'Named themes inherited from presets, or none.',
    code: "themes: {\n  brand: {\n    semanticTokens: {\n      colors: { primary: { value: '#1456b8' } },\n    },\n  },\n},",
    link: ['theming', 'Theming'],
  },
];

export const pluginOptions = [
  {
    name: 'config',
    description: 'Inline style configuration. All options above belong inside this object.',
    defaultValue: 'An object with presets: [fluentPreset] when omitted.',
    code: 'fluentStyles({ config: { presets: [fluentPreset], reset: false } });',
  },
  {
    name: 'configFile',
    description:
      'Load a default-exported configuration from a file relative to the Vite root. The file configuration replaces the inline config object.',
    defaultValue: 'No configuration file.',
    code: "fluentStyles({ configFile: './fluent.config.ts' });",
  },
  {
    name: 'outdir',
    description:
      'Choose the generated directory relative to the Vite root. Update your generated function and stylesheet imports if you change it. The output directory cannot be the project root itself.',
    defaultValue: 'styled-system',
    code: "fluentStyles({ outdir: 'src/styled-system' });",
  },
  {
    name: 'components',
    description:
      'Include precompiled library component CSS in the generated stylesheet. Disable it only when you do not need those rules, such as a build using only the style engine.',
    defaultValue: 'true',
    code: 'fluentStyles({ components: false });',
  },
  {
    name: 'sources',
    description:
      'Additional import sources whose css, cva and sva calls the compiler should extract. The package style entry and generated entry are already recognized.',
    defaultValue: 'No additional sources.',
    code: "fluentStyles({ sources: ['my-style-wrapper'] });",
  },
];
