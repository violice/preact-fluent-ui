import { createRef, type JSX } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { Textarea } from '../index';

afterEach(cleanup);

it('forwards textarea refs and native multiline values and resets uncontrolled forms', async () => {
  const ref = createRef<HTMLTextAreaElement>();
  render(
    <form>
      <Textarea
        ref={ref}
        aria-label="Notes"
        name="notes"
        defaultValue={'first\nsecond'}
        rows={4}
        cols={30}
        maxLength={100}
        className="fallback"
      />
    </form>,
  );
  const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
  expect(ref.current).toBe(textarea);
  expect([textarea.rows, textarea.cols, textarea.maxLength]).toEqual([4, 30, 100]);
  expect(textarea.classList.contains('fallback')).toBe(true);
  expect(textarea.hasAttribute('classes')).toBe(false);
  expect(textarea.value).toBe('first\nsecond');
  const user = userEvent.setup();
  await user.clear(textarea);
  await user.type(textarea, 'new{Enter}notes');
  expect(new FormData(textarea.form!).get('notes')).toBe('new\nnotes');
  textarea.form!.reset();
  expect(textarea.value).toBe('first\nsecond');
});

it('preserves controlled rerenders, native attributes and currentTarget', async () => {
  let target: HTMLTextAreaElement | undefined;
  const { rerender } = render(
    <Textarea
      aria-label="Notes"
      value="first"
      onInput={(event) => {
        target = event.currentTarget;
      }}
    />,
  );
  const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
  await userEvent.setup().type(textarea, 'x');
  expect(target).toBe(textarea);
  rerender(
    <Textarea
      aria-label="Notes"
      value={'next\nline'}
      required
      readOnly
      disabled
      aria-invalid="true"
      data-kind="notes"
    />,
  );
  expect(textarea.value).toBe('next\nline');
  expect(textarea.required).toBe(true);
  expect(textarea.readOnly).toBe(true);
  expect(textarea.disabled).toBe(true);
  expect(textarea.getAttribute('aria-invalid')).toBe('true');
  expect(textarea.dataset.kind).toBe('notes');
});

it('resolves class precedence and updated SignalLike values', () => {
  const primary: JSX.SignalLike<string | undefined> = {
    value: undefined,
    peek() {
      return this.value;
    },
    subscribe() {
      return () => {};
    },
  };
  const content = () => <Textarea aria-label="Notes" class={primary} className="fallback" />;
  const { rerender } = render(content());
  const textarea = screen.getByRole('textbox');
  expect(textarea.classList.contains('fallback')).toBe(true);
  primary.value = 'primary';
  rerender(content());
  expect(textarea.classList.contains('primary')).toBe(true);
  expect(textarea.classList.contains('fallback')).toBe(false);
  primary.value = '';
  rerender(content());
  expect(textarea.classList.contains('fallback')).toBe(false);
  primary.value = undefined;
  rerender(content());
  expect(textarea.classList.contains('fallback')).toBe(true);
});
