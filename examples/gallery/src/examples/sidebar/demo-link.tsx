import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';

export const DemoLink = forwardRef<HTMLAnchorElement, JSX.IntrinsicElements['a']>((props, ref) => (
  <a {...props} ref={ref} />
));
