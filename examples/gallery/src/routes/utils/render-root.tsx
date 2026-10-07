import { useRender } from '../../../../../dist/utils.js';
import { LocalLink } from './local-link';

export function RenderRoot({ custom }: { custom: boolean }) {
  return useRender({
    defaultTagName: 'a',
    props: {
      href: '#local-render',
      children: custom ? 'Custom Link root' : 'Native anchor root',
      onClick: (event) => event.preventDefault(),
      onAuxClick: (event) => event.preventDefault(),
    },
    render: custom ? (props) => <LocalLink {...props} /> : undefined,
  });
}
