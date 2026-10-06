import type { JSX } from 'preact';
import { cx } from '../styling/cx';

export function mergeClasses(...classes: JSX.Signalish<string | undefined>[]): string {
  return cx(
    classes.map((value) => (value !== null && typeof value === 'object' ? value.value : value)),
  );
}
