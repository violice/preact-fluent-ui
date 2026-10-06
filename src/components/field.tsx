import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { useId } from 'preact/hooks';
import { mergeClasses } from '../utils/merge-classes';
import { resolveClass } from '../utils/resolve-class';
import { fieldClasses } from './field.styles';

export type ValidationState = 'none' | 'error' | 'warning' | 'success';

export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: true;
}

export type FieldProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> & {
  classes?: Partial<
    Record<'root' | 'label' | 'hint' | 'validation', JSX.Signalish<string | undefined>>
  >;
  label: ComponentChildren;
  controlId?: string;
  hint?: ComponentChildren;
  validationMessage?: ComponentChildren;
  validationState?: ValidationState;
  required?: boolean;
  children: (props: FieldControlProps) => ComponentChildren;
};

function hasContent(value: ComponentChildren): boolean {
  return value !== null && value !== undefined && value !== false && value !== '';
}

export const Field = /* @__PURE__ */ forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    class: classProp,
    className,
    classes,
    label,
    controlId,
    hint,
    validationMessage,
    validationState = 'none',
    required,
    children,
    ...props
  },
  ref,
) {
  const styles = fieldClasses({ validationState });
  const generatedId = useId();
  const id = controlId ?? generatedId;
  const hasHint = hasContent(hint);
  const hasValidation = hasContent(validationMessage);
  const describedBy =
    [hasHint && `${id}-hint`, hasValidation && `${id}-validation`].filter(Boolean).join(' ') ||
    undefined;
  const control: FieldControlProps = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': validationState === 'error' ? true : undefined,
    required: required ? true : undefined,
  };
  return (
    <div
      {...props}
      ref={ref}
      class={mergeClasses(styles.root, resolveClass(classProp, className), classes?.root)}
    >
      <label htmlFor={id} class={mergeClasses(styles.label, classes?.label)}>
        {label}
        {required && (
          <span aria-hidden="true" class={styles.required}>
            *
          </span>
        )}
      </label>
      {children(control)}
      {hasHint && (
        <div id={`${id}-hint`} class={mergeClasses(styles.hint, classes?.hint)}>
          {hint}
        </div>
      )}
      {hasValidation && (
        <div id={`${id}-validation`} class={mergeClasses(styles.validation, classes?.validation)}>
          {validationMessage}
        </div>
      )}
    </div>
  );
});
