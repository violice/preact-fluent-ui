import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';

export const LocalLink = forwardRef<HTMLAnchorElement, JSX.IntrinsicElements['a']>((props, ref) => (
  <a {...props} ref={ref} />
));
