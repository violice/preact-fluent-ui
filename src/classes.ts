import type { JSX } from 'preact';
import clsx from 'clsx';

export function mergeClasses(...classes: JSX.Signalish<string | undefined>[]): string {
  return clsx(
    classes.map((value) => (value !== null && typeof value === 'object' ? value.value : value)),
  );
}

export function resolveClass(
  classProp: JSX.Signalish<string | undefined>,
  className: JSX.Signalish<string | undefined>,
): string | undefined {
  const primary = classProp !== null && typeof classProp === 'object' ? classProp.value : classProp;
  const fallback =
    className !== null && typeof className === 'object' ? className.value : className;
  return primary ?? fallback;
}
