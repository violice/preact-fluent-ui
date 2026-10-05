import type { JSX } from 'preact';
import clsx from 'clsx';

export function mergeClasses(...classes: JSX.Signalish<string | undefined>[]): string {
  return clsx(
    classes.map((value) => (value !== null && typeof value === 'object' ? value.value : value)),
  );
}
