import { createRef } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { Button } from './button';

afterEach(cleanup);

describe('Button', () => {
  it('forwards the native button ref and merges both class props', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} class="first" className="second">
        Save
      </Button>,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.classList.contains('first')).toBe(true);
    expect(ref.current?.classList.contains('second')).toBe(true);
    expect(ref.current?.classList.length).toBeGreaterThan(2);
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
