import { css, token } from '../../../../../../.artifacts/gallery-styled-system/css';

export const tokenDemoStyles = css({ display: 'grid', gap: '3' });
export const tokenPanelStyles = css({
  padding: '4',
  color: 'text',
  backgroundColor: '{colors.surface}',
});

export function TokenDemo() {
  return (
    <div class={tokenDemoStyles}>
      <div class={tokenPanelStyles}>
        Token references in compiled styles follow the current theme.
      </div>
      <p style={{ color: token.var('colors.primary') }}>Inline color from token.var.</p>
      <code>{token.var('colors.primary')}</code>
      <p>Change the gallery palette or appearance to see both examples update.</p>
    </div>
  );
}
