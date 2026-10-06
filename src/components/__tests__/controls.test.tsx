import { createRef, type JSX } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import {
  Button,
  Card,
  EmptyState,
  Icon,
  InfoBar,
  PageHeader,
  Select,
  StatusBadge,
} from '../../index';

afterEach(cleanup);

describe('Button', () => {
  it('forwards the native button ref and resolves native class aliases', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} class="first" className="second">
        Save
      </Button>,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.classList.contains('first')).toBe(true);
    expect(ref.current?.classList.contains('second')).toBe(false);
    expect(ref.current?.classList.length).toBeGreaterThan(1);
  });

  it('does not submit a form by default', async () => {
    let submissions = 0;
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submissions += 1;
        }}
      >
        <Button>Save</Button>
      </form>,
    );

    await userEvent.setup().click(screen.getByRole('button', { name: 'Save' }));

    expect(submissions).toBe(0);
  });

  it('submits a form when type is submit', async () => {
    let submissions = 0;
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submissions += 1;
        }}
      >
        <Button type="submit">Save</Button>
      </form>,
    );

    await userEvent.setup().click(screen.getByRole('button', { name: 'Save' }));

    expect(submissions).toBe(1);
  });

  it('prevents clicks when disabled', async () => {
    let clicks = 0;
    render(
      <Button
        disabled
        onClick={() => {
          clicks += 1;
        }}
      >
        Save
      </Button>,
    );

    await userEvent.setup().click(screen.getByRole('button', { name: 'Save' }));

    expect(clicks).toBe(0);
  });

  it('passes accessible names and data attributes to the button', () => {
    render(
      <Button aria-label="Save profile" data-testid="save-profile">
        Save
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Save profile' })).toBe(
      screen.getByTestId('save-profile'),
    );
  });
});

describe('shared controls', () => {
  it('resolves native SignalLike class values and reads their updated values on rerender', () => {
    const signal = (value: string): JSX.SignalLike<string> => ({
      value,
      peek() {
        return this.value;
      },
      subscribe() {
        return () => {};
      },
    });
    const classProp = signal('first');
    const className = signal('second');
    const content = () => (
      <div>
        <Button class={classProp} className={className} data-testid="signal-button" />
        <Card class={classProp} className={className} data-testid="signal-card" />
        <InfoBar class={classProp} className={className} data-testid="signal-info" />
        <StatusBadge class={classProp} className={className} data-testid="signal-badge" />
        <Select class={classProp} className={className} data-testid="signal-select" />
        <PageHeader
          title="Title"
          description="Description"
          class={classProp}
          className={className}
          data-testid="signal-header"
        />
        <EmptyState
          title="Empty"
          class={classProp}
          className={className}
          data-testid="signal-empty"
        />
        <Icon name="info" class={classProp} className={className} data-testid="signal-icon" />
      </div>
    );
    const { rerender } = render(content());
    for (const element of screen.getAllByTestId(/^signal-/)) {
      expect(element.classList.contains('first')).toBe(true);
      expect(element.classList.contains('second')).toBe(false);
      expect(element.classList.contains('value')).toBe(false);
    }
    classProp.value = 'updated';
    className.value = 'changed';
    rerender(content());
    for (const element of screen.getAllByTestId(/^signal-/)) {
      expect(element.classList.contains('updated')).toBe(true);
      expect(element.classList.contains('changed')).toBe(false);
      expect(element.classList.contains('first')).toBe(false);
      expect(element.classList.contains('second')).toBe(false);
    }
  });

  it('exports the shared controls', () => {
    for (const component of [Card, InfoBar, StatusBadge, Select]) {
      expect(component).toBeTypeOf('function');
    }
  });

  it('forwards Card and StatusBadge refs, classes, and native attributes', () => {
    const card = createRef<HTMLElement>();
    const badge = createRef<HTMLSpanElement>();
    render(
      <Card ref={card} class="first" className="second" aria-label="Profile" data-testid="card">
        <StatusBadge
          ref={badge}
          tone="success"
          class="first"
          className="second"
          aria-label="Connected"
          data-testid="badge"
        >
          Online
        </StatusBadge>
      </Card>,
    );
    for (const [ref, tag, label, testId] of [
      [card, 'SECTION', 'Profile', 'card'],
      [badge, 'SPAN', 'Connected', 'badge'],
    ] as const) {
      expect(ref.current).toBe(screen.getByTestId(testId));
      expect(ref.current?.tagName).toBe(tag);
      expect(ref.current?.getAttribute('aria-label')).toBe(label);
      expect(ref.current?.classList.contains('first')).toBe(true);
      expect(ref.current?.classList.contains('second')).toBe(false);
      expect(ref.current?.classList.length).toBeGreaterThan(1);
      expect(ref.current?.hasAttribute('tone')).toBe(false);
    }
  });

  it('gives InfoBar a tone-specific live role and preserves explicit roles', () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <InfoBar
        ref={ref}
        tone="error"
        title="Failed"
        class="first"
        className="second"
        aria-label="Operation"
        data-testid="notice"
      >
        Retry
      </InfoBar>,
    );
    expect(ref.current).toBe(screen.getByRole('alert'));
    expect(ref.current?.classList.contains('first')).toBe(true);
    expect(ref.current?.classList.contains('second')).toBe(false);
    expect(ref.current?.getAttribute('aria-label')).toBe('Operation');
    expect(ref.current?.getAttribute('data-testid')).toBe('notice');
    expect(ref.current?.hasAttribute('tone')).toBe(false);
    expect(ref.current?.hasAttribute('title')).toBe(false);
    expect(screen.getByText('Failed').tagName).toBe('STRONG');
    expect(screen.getByText('Retry')).toBeTruthy();
    rerender(<InfoBar tone="info">Ready</InfoBar>);
    expect(screen.getByRole('status').textContent).toBe('Ready');
    rerender(
      <InfoBar tone="error" role="region">
        Custom
      </InfoBar>,
    );
    expect(screen.getByRole('region').textContent).toBe('Custom');
  });

  it('keeps native Select behavior and applies typed classes to their slots', async () => {
    const ref = createRef<HTMLSelectElement>();
    let selected = '';
    const { rerender } = render(
      <Select
        ref={ref}
        name="adapter"
        required
        value="one"
        class="first"
        className="second"
        classes={{ root: 'root-slot', wrapper: 'wrapper', icon: 'icon-slot' }}
        aria-label="Adapter"
        data-testid="select"
        onChange={(event) => {
          selected = event.currentTarget.value;
        }}
      >
        <option value="one">One</option>
        <option value="two">Two</option>
      </Select>,
    );
    const select = screen.getByRole('combobox', { name: 'Adapter' }) as HTMLSelectElement;
    expect(ref.current).toBe(select);
    expect(select.name).toBe('adapter');
    expect(select.required).toBe(true);
    expect(select.value).toBe('one');
    expect(select.getAttribute('data-testid')).toBe('select');
    expect(select.classList.contains('first')).toBe(true);
    expect(select.classList.contains('second')).toBe(false);
    expect(select.classList.contains('root-slot')).toBe(true);
    expect(select.parentElement?.querySelector('svg')?.classList.contains('icon-slot')).toBe(true);
    expect(select.hasAttribute('classes')).toBe(false);
    expect(select.classList.length).toBeGreaterThan(1);
    expect(select.classList.contains('wrapper')).toBe(false);
    expect(select.parentElement?.tagName).toBe('SPAN');
    expect(select.parentElement?.classList.contains('wrapper')).toBe(true);
    expect(select.parentElement?.classList.contains('first')).toBe(false);
    expect(select.parentElement?.classList.contains('second')).toBe(false);
    await userEvent.setup().selectOptions(select, 'two');
    expect(selected).toBe('two');
    rerender(
      <Select ref={ref} disabled value="one" aria-label="Adapter">
        <option value="one">One</option>
        <option value="two">Two</option>
      </Select>,
    );
    expect(select.disabled).toBe(true);
    expect(select.value).toBe('one');
  });
});

it('Select resolves missing and empty SignalLike classes before fallback', () => {
  const primary: JSX.SignalLike<string | undefined> = {
    value: undefined,
    peek() {
      return this.value;
    },
    subscribe() {
      return () => {};
    },
  };
  const root: JSX.SignalLike<string | undefined> = { ...primary, value: 'root-slot' };
  const wrapper: JSX.SignalLike<string | undefined> = { ...primary, value: 'wrapper-slot' };
  const icon: JSX.SignalLike<string | undefined> = { ...primary, value: 'icon-slot' };
  const content = () => (
    <Select
      aria-label="Choice"
      class={primary}
      className="fallback"
      classes={{ root, wrapper, icon }}
    />
  );
  const { rerender } = render(content());
  const select = screen.getByRole('combobox');
  expect(select.className.split(' ').slice(-2)).toEqual(['fallback', 'root-slot']);
  expect(select.parentElement?.classList.contains('wrapper-slot')).toBe(true);
  expect(select.parentElement?.querySelector('svg')?.classList.contains('icon-slot')).toBe(true);
  primary.value = 'primary';
  root.value = 'updated-root';
  wrapper.value = 'updated-wrapper';
  icon.value = 'updated-icon';
  rerender(content());
  expect(select.className.split(' ').slice(-2)).toEqual(['primary', 'updated-root']);
  expect(select.parentElement?.classList.contains('updated-wrapper')).toBe(true);
  expect(select.parentElement?.querySelector('svg')?.classList.contains('updated-icon')).toBe(true);
  expect(select.classList.contains('fallback')).toBe(false);
  primary.value = '';
  rerender(content());
  expect(select.classList.contains('fallback')).toBe(false);
  primary.value = undefined;
  rerender(content());
  expect(select.classList.contains('fallback')).toBe(true);
});
