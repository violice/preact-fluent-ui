import type { JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../styling/cx';
import { fluentIconPaths } from './fluent-icon-paths';
import styles from './icon.module.css';

export type IconName = keyof typeof fluentIconPaths;
export type IconProps = Omit<JSX.SVGAttributes<SVGSVGElement>, 'children' | 'width' | 'height'> & {
  name: IconName;
  size?: 16 | 20 | 24;
};

export const Icon = /* @__PURE__ */ forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = 20, class: classProp, className, ...props },
  ref,
) {
  const glyph = fluentIconPaths[name][size];
  return (
    <svg
      {...props}
      ref={ref}
      class={cx(styles.icon, classProp, className)}
      width={size}
      height={size}
      viewBox={`0 0 ${glyph.size} ${glyph.size}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {glyph.paths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
});
