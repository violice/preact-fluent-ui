import { createRef, type JSX } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { Checkbox } from '../index';

afterEach(cleanup);

it('uses label clicks and Space to deliver native change events', async () => {
  const changes: boolean[] = [];
  const targets: HTMLInputElement[] = [];
  render(
    <Checkbox
      label="Enabled"
      onChange={(event) => {
        targets.push(event.currentTarget);
        changes.push(event.currentTarget.checked);
      }}
    />,
  );
  const input = screen.getByRole('checkbox', { name: 'Enabled' }) as HTMLInputElement;
  const user = userEvent.setup();
  await user.click(screen.getByText('Enabled'));
  expect(input.checked).toBe(true);
  await user.keyboard(' ');
  expect(input.checked).toBe(false);
  expect(changes).toEqual([true, false]);
  expect(targets).toEqual([input, input]);
});

it('keeps disabled inputs unchanged and skips them in Tab order', async () => {
  let changes = 0;
  render(
    <>
      <Checkbox label="Disabled" disabled onChange={() => changes++} />
      <button>Next</button>
    </>,
  );
  const input = screen.getByRole('checkbox') as HTMLInputElement;
  const user = userEvent.setup();
  await user.click(screen.getByText('Disabled'));
  await user.tab();
  expect(document.activeElement).toBe(screen.getByRole('button'));
  await user.keyboard(' ');
  expect(input.checked).toBe(false);
  expect(changes).toBe(0);
});

it('submits native checkbox values and resets uncontrolled checked state', async () => {
  render(
    <form>
      <Checkbox label="Custom" name="custom" value="yes" defaultChecked />
      <Checkbox label="Default" name="default" />
      <Checkbox label="Disabled" name="disabled" defaultChecked disabled />
    </form>,
  );
  const custom = screen.getByRole('checkbox', { name: 'Custom' }) as HTMLInputElement;
  const standard = screen.getByRole('checkbox', { name: 'Default' }) as HTMLInputElement;
  expect([...new FormData(custom.form!).entries()]).toEqual([['custom', 'yes']]);
  const user = userEvent.setup();
  await user.click(custom);
  await user.click(standard);
  expect([...new FormData(custom.form!).entries()]).toEqual([['default', 'on']]);
  custom.form!.reset();
  expect(custom.checked).toBe(true);
  expect(standard.checked).toBe(false);
});

it('forwards native attributes and controlled checked changes to the input', () => {
  const { rerender } = render(
    <>
      <form id="settings" />
      <Checkbox
        label="Enabled"
        id="enabled"
        name="enabled"
        form="settings"
        checked={false}
        required
        aria-describedby="help"
        aria-invalid="true"
        data-kind="setting"
      />
    </>,
  );
  const input = screen.getByRole('checkbox') as HTMLInputElement;
  expect(input.id).toBe('enabled');
  expect(input.form?.id).toBe('settings');
  expect(input.required).toBe(true);
  expect(input.getAttribute('aria-describedby')).toBe('help');
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(input.dataset.kind).toBe('setting');
  expect(input.parentElement?.id).toBe('');
  rerender(
    <>
      <form id="settings" />
      <Checkbox label="Enabled" checked />
    </>,
  );
  expect(input.checked).toBe(true);
});

it('composes object refs and applies independent mixed and checked properties', () => {
  const ref = createRef<HTMLInputElement>();
  const { rerender, unmount } = render(
    <Checkbox ref={ref} label="Enabled" checked={false} indeterminate />,
  );
  const input = screen.getByRole('checkbox') as HTMLInputElement;
  expect(ref.current).toBe(input);
  expect(input.indeterminate).toBe(true);
  expect(input.checked).toBe(false);
  expect(input.hasAttribute('indeterminate')).toBe(false);
  rerender(<Checkbox ref={ref} label="Enabled" checked indeterminate={false} />);
  expect(input.checked).toBe(true);
  expect(input.indeterminate).toBe(false);
  unmount();
  expect(ref.current).toBe(null);
});

it('clears mixed natively on click and reapplies only on checked or mixed prop changes', async () => {
  const values: (HTMLInputElement | null)[] = [];
  const ref = (input: HTMLInputElement | null) => {
    values.push(input);
  };
  const { rerender, unmount } = render(<Checkbox ref={ref} label="Enabled" indeterminate />);
  const input = screen.getByRole('checkbox') as HTMLInputElement;
  expect(values).toEqual([input]);
  expect(input.indeterminate).toBe(true);
  await userEvent.setup().click(input);
  expect(input.indeterminate).toBe(false);
  rerender(<Checkbox ref={ref} label="Updated" indeterminate />);
  expect(input.indeterminate).toBe(false);
  expect(values).toEqual([input]);
  rerender(<Checkbox ref={ref} label="Updated" checked indeterminate />);
  expect(input.indeterminate).toBe(true);
  expect(input.checked).toBe(true);
  rerender(<Checkbox ref={ref} label="Updated" checked indeterminate={false} />);
  expect(input.indeterminate).toBe(false);
  rerender(<Checkbox ref={ref} label="Updated" checked indeterminate />);
  expect(input.indeterminate).toBe(true);
  unmount();
  expect(values).toEqual([input, null]);
});

it('combines class slots on their intended elements and hides the wrapper', () => {
  const primary: JSX.SignalLike<string | undefined> = {
    value: undefined,
    peek() {
      return this.value;
    },
    subscribe() {
      return () => {};
    },
  };
  const slot: JSX.SignalLike<string | undefined> = { ...primary, value: 'root-slot' };
  const content = () => (
    <Checkbox
      label="Enabled"
      hidden
      class={primary}
      className="fallback"
      classes={{
        root: slot,
        wrapper: 'wrapper-slot',
        label: 'label-slot',
        indicator: 'indicator-slot',
      }}
    />
  );
  const { rerender } = render(content());
  const input = screen.getByLabelText('Enabled') as HTMLInputElement;
  const wrapper = input.parentElement!;
  expect(input.className.split(' ').slice(-2)).toEqual(['fallback', 'root-slot']);
  expect(wrapper.tagName).toBe('LABEL');
  expect(wrapper.classList.contains('wrapper-slot')).toBe(true);
  expect(screen.getByText('Enabled').classList.contains('label-slot')).toBe(true);
  expect(wrapper.querySelector('.indicator-slot')?.getAttribute('aria-hidden')).toBe('true');
  expect(input.hidden).toBe(true);
  expect(wrapper.hidden).toBe(true);
  expect(input.hasAttribute('classes')).toBe(false);
  expect(input.hasAttribute('label')).toBe(false);
  primary.value = '';
  rerender(content());
  expect(input.classList.contains('fallback')).toBe(false);
  primary.value = 'primary';
  rerender(content());
  expect(input.className.split(' ').slice(-2)).toEqual(['primary', 'root-slot']);
  rerender(<Checkbox label="Enabled" className="fallback" />);
  expect(input.classList.contains('fallback')).toBe(true);
});
