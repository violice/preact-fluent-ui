import { createRef, type JSX } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { Input } from '../index';

afterEach(cleanup);

it('forwards native refs, input events and uncontrolled form reset', async () => {
  const ref = createRef<HTMLInputElement>();
  let target: HTMLInputElement | undefined;
  render(
    <form aria-label="form">
      <Input
        ref={ref}
        name="port"
        defaultValue="80"
        aria-label="Port"
        class="first"
        className="ignored"
        onInput={(event) => {
          target = event.currentTarget;
        }}
      />
    </form>,
  );
  const input = screen.getByRole('textbox', { name: 'Port' }) as HTMLInputElement;
  expect(ref.current).toBe(input);
  expect(input.type).toBe('text');
  expect(input.classList.contains('first')).toBe(true);
  expect(input.classList.contains('ignored')).toBe(false);
  expect(input.hasAttribute('classes')).toBe(false);
  const user = userEvent.setup();
  await user.clear(input);
  await user.type(input, '443');
  expect(target).toBe(input);
  expect(new FormData(input.form!).get('port')).toBe('443');
  input.form!.reset();
  expect(input.value).toBe('80');
});

it('preserves controlled values and native state and attributes', () => {
  const { rerender } = render(
    <>
      <form id="settings" />
      <Input
        aria-label="Port"
        type="number"
        value="80"
        form="settings"
        name="port"
        required
        readOnly
        disabled
        aria-invalid="true"
        data-kind="port"
        min={1}
        max={65535}
        step={1}
      />
    </>,
  );
  const input = screen.getByRole('spinbutton') as HTMLInputElement;
  expect(input.form?.id).toBe('settings');
  expect(input.required).toBe(true);
  expect(input.readOnly).toBe(true);
  expect(input.disabled).toBe(true);
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(input.dataset.kind).toBe('port');
  expect([input.min, input.max, input.step]).toEqual(['1', '65535', '1']);
  rerender(
    <>
      <form id="settings" />
      <Input aria-label="Port" type="number" value="443" />
    </>,
  );
  expect(input.value).toBe('443');
});

it('resolves SignalLike values before fallback and preserves empty class', () => {
  const primary: JSX.SignalLike<string | undefined> = {
    value: undefined,
    peek() {
      return this.value;
    },
    subscribe() {
      return () => {};
    },
  };
  const fallback: JSX.SignalLike<string | undefined> = { ...primary, value: 'fallback' };
  const content = () => <Input aria-label="Port" class={primary} className={fallback} />;
  const { rerender } = render(content());
  const input = screen.getByRole('textbox');
  expect(input.classList.contains('fallback')).toBe(true);
  primary.value = 'primary';
  rerender(content());
  expect(input.classList.contains('primary')).toBe(true);
  expect(input.classList.contains('fallback')).toBe(false);
  primary.value = '';
  rerender(content());
  expect(input.classList.contains('fallback')).toBe(false);
  primary.value = undefined;
  rerender(content());
  expect(input.classList.contains('fallback')).toBe(true);
  rerender(<Input aria-label="Port" className="fallback" />);
  expect(input.classList.contains('fallback')).toBe(true);
  rerender(
    <Input
      aria-label="Port"
      class={null as unknown as JSX.Signalish<string | undefined>}
      className="fallback"
    />,
  );
  expect(input.classList.contains('fallback')).toBe(true);
});
