import { createRef, type ComponentChildren } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { Field, Input, Select, type ValidationState } from '../../index';

afterEach(cleanup);

it('links label, required and descriptions and removes stale native state', async () => {
  const content = (described: boolean) => (
    <Field
      label="Port"
      controlId="port"
      hint={described ? 'Hint' : undefined}
      validationState={described ? 'error' : 'none'}
      validationMessage={described ? 'Invalid' : undefined}
      required={described}
    >
      {(props) => <Input {...props} />}
    </Field>
  );
  const { rerender } = render(content(true));
  const input = screen.getByRole('textbox', { name: 'Port' }) as HTMLInputElement;
  expect(input.id).toBe('port');
  expect(input.required).toBe(true);
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(input.getAttribute('aria-describedby')).toBe('port-hint port-validation');
  expect(document.getElementById('port-validation')?.textContent).toBe('Invalid');
  expect(screen.getByText('*').getAttribute('aria-hidden')).toBe('true');
  await userEvent.setup().click(screen.getByText('Port'));
  expect(document.activeElement).toBe(input);
  expect(screen.queryByRole('alert')).toBeNull();
  expect(document.querySelector('[aria-live]')).toBeNull();
  rerender(content(false));
  expect(input.hasAttribute('aria-describedby')).toBe(false);
  expect(input.hasAttribute('aria-invalid')).toBe(false);
  expect(input.required).toBe(false);
  expect(document.getElementById('port-hint')).toBeNull();
  expect(document.getElementById('port-validation')).toBeNull();
});

it.each(['none', 'error', 'warning', 'success'] as ValidationState[])(
  'sets invalid only for error with state %s, independently of a message',
  (state) => {
    const content = (message?: string) => (
      <Field label="Port" controlId="port" validationState={state} validationMessage={message}>
        {(props) => <input {...props} />}
      </Field>
    );
    const { rerender } = render(content());
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-invalid')).toBe(state === 'error' ? 'true' : null);
    expect(input.hasAttribute('aria-describedby')).toBe(false);
    rerender(content('Message'));
    expect(input.getAttribute('aria-invalid')).toBe(state === 'error' ? 'true' : null);
    expect(input.getAttribute('aria-describedby')).toBe('port-validation');
  },
);

it.each([null, undefined, false, '', 0] as ComponentChildren[])(
  'renders only present descriptions for value %s',
  (value) => {
    render(
      <Field label="Port" controlId="port" hint={value} validationMessage={value}>
        {(props) => <input {...props} />}
      </Field>,
    );
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-describedby')).toBe(
      value === 0 ? 'port-hint port-validation' : null,
    );
    if (value === 0) {
      expect(document.getElementById('port-hint')?.textContent).toBe('0');
      expect(document.getElementById('port-validation')?.textContent).toBe('0');
    }
  },
);

it('generates distinct stable ids and composes native input and Select', () => {
  const content = (hint: string) => (
    <>
      <Field label="First" hint={hint}>
        {(props) => <input {...props} />}
      </Field>
      <Field label="Second">
        {(props) => (
          <Select {...props}>
            <option>Automatic</option>
          </Select>
        )}
      </Field>
    </>
  );
  const { rerender } = render(content('Hint'));
  const first = screen.getByRole('textbox', { name: 'First' });
  const second = screen.getByRole('combobox', { name: 'Second' });
  const ids = [first.id, second.id];
  expect(ids[0]).not.toBe('');
  expect(ids[0]).not.toBe(ids[1]);
  rerender(content('Updated'));
  expect([first.id, second.id]).toEqual(ids);
  expect(document.getElementById(`${first.id}-hint`)?.textContent).toBe('Updated');
});

it('forwards root props and ref and adds each typed class slot', () => {
  const ref = createRef<HTMLDivElement>();
  const content = (primary?: string) => (
    <Field
      ref={ref}
      id="root"
      data-kind="field"
      hidden
      title="Details"
      class={primary}
      className="fallback"
      classes={{
        root: 'root-slot',
        label: 'label-slot',
        hint: 'hint-slot',
        validation: 'validation-slot',
      }}
      label="Port"
      controlId="port"
      hint="Hint"
      validationMessage="Message"
    >
      {(props) => (
        <Input
          {...props}
          aria-describedby={[props['aria-describedby'], 'external'].filter(Boolean).join(' ')}
        />
      )}
    </Field>
  );
  const { rerender, unmount } = render(content('primary'));
  const root = document.getElementById('root')!;
  expect(ref.current).toBe(root);
  expect(root.hidden).toBe(true);
  expect(root.dataset.kind).toBe('field');
  expect(root.title).toBe('Details');
  expect(root.className.split(' ').slice(-2)).toEqual(['primary', 'root-slot']);
  expect(root.hasAttribute('classes')).toBe(false);
  expect(root.hasAttribute('controlId')).toBe(false);
  expect(screen.getByText('Port').classList.contains('label-slot')).toBe(true);
  expect(screen.getByText('Hint').classList.contains('hint-slot')).toBe(true);
  expect(screen.getByText('Message').classList.contains('validation-slot')).toBe(true);
  expect(document.getElementById('port')?.getAttribute('aria-describedby')).toBe(
    'port-hint port-validation external',
  );
  rerender(content(''));
  expect(root.classList.contains('fallback')).toBe(false);
  rerender(content());
  expect(root.classList.contains('fallback')).toBe(true);
  unmount();
  expect(ref.current).toBeNull();
});
