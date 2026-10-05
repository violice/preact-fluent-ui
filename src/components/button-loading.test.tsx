import { createRef } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { Button } from './button';

afterEach(cleanup);

describe('Button loading', () => {
  it.each(['default', 'primary', 'subtle', 'danger'] as const)(
    'retains the text name and adds a decorative spinner for %s',
    (variant) => {
      render(
        <Button variant={variant} loading>
          Save
        </Button>,
      );
      const button = screen.getByRole('button', { name: 'Save' });
      expect(button.getAttribute('aria-busy')).toBe('true');
      expect(button.getAttribute('aria-disabled')).toBe('true');
      expect((button as HTMLButtonElement).disabled).toBe(false);
      expect(button.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
      expect(screen.queryByRole('status')).toBe(null);
      expect(button.hasAttribute('loading')).toBe(false);
    },
  );

  it('uses an explicit loading label only while loading', () => {
    const { rerender } = render(
      <Button loading loadingLabel="Saving">
        Save
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Saving' }).textContent).toBe('Saving');
    expect(screen.queryByText('Save')).toBe(null);
    rerender(<Button loadingLabel="Saving">Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.hasAttribute('aria-busy')).toBe(false);
    expect(button.hasAttribute('aria-disabled')).toBe(false);
    expect(button.hasAttribute('loadingLabel')).toBe(false);
  });

  it('replaces icon content without changing the explicit accessible name', () => {
    const { rerender } = render(
      <Button size="icon" loading aria-label="Refresh">
        <svg data-testid="refresh-icon" />
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Refresh' });
    expect(screen.queryByTestId('refresh-icon')).toBe(null);
    expect(button.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
    rerender(
      <Button size="icon" aria-label="Refresh">
        <svg data-testid="refresh-icon" />
      </Button>,
    );
    expect(screen.getByTestId('refresh-icon')).toBeTruthy();
  });

  it('retains native disabled precedence even while loading', () => {
    render(
      <Button loading disabled>
        Save
      </Button>,
    );
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('retains the same focused native element when loading starts', () => {
    const ref = createRef<HTMLButtonElement>();
    const { rerender } = render(
      <Button ref={ref} class="first" className="second">
        Save
      </Button>,
    );
    const button = screen.getByRole('button');
    button.focus();
    rerender(
      <Button ref={ref} loading class="first" className="second">
        Save
      </Button>,
    );
    expect(ref.current).toBe(button);
    expect(document.activeElement).toBe(button);
    expect((button as HTMLButtonElement).disabled).toBe(false);
    expect(button.classList.contains('first')).toBe(true);
    expect(button.classList.contains('second')).toBe(true);
  });

  it.each(['pointer', 'Enter', 'Space', 'programmatic'])(
    'suppresses %s activation and restores handler and form submission after loading',
    async (activation) => {
      let clicks = 0;
      let submissions = 0;
      const content = (loading: boolean) => (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submissions += 1;
          }}
        >
          <Button
            type="submit"
            loading={loading}
            onClick={() => {
              clicks += 1;
            }}
          >
            Save
          </Button>
        </form>
      );
      const { rerender } = render(content(true));
      const button = screen.getByRole('button') as HTMLButtonElement;
      const user = userEvent.setup();
      const activate = async () => {
        button.focus();
        if (activation === 'pointer') await user.click(button);
        else if (activation === 'programmatic') button.click();
        else await user.keyboard(activation === 'Enter' ? '{Enter}' : ' ');
      };
      await activate();
      expect(clicks).toBe(0);
      expect(submissions).toBe(0);
      rerender(content(false));
      await activate();
      expect(clicks).toBe(1);
      expect(submissions).toBe(1);
    },
  );
});
