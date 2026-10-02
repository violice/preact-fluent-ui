import { createRef } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import { EmptyState, PageHeader } from '../index';

afterEach(cleanup);

describe('layout', () => {
  it('exports layout components', () => {
    expect(PageHeader).toBeTypeOf('function');
    expect(EmptyState).toBeTypeOf('function');
  });

  it('forwards PageHeader native attributes and renders notices after the header', () => {
    const ref = createRef<HTMLElement>();
    render(
      <PageHeader
        ref={ref}
        title="Profiles"
        description="Manage profiles"
        class="first"
        className="second"
        aria-label="Profiles header"
        data-testid="header"
        actions={<button>Add</button>}
        notices={<p>Read only</p>}
      />,
    );
    const header = screen.getByTestId('header');
    expect(ref.current).toBe(header);
    expect(header.tagName).toBe('HEADER');
    expect(header.getAttribute('aria-label')).toBe('Profiles header');
    expect(header.classList.contains('first')).toBe(true);
    expect(header.classList.contains('second')).toBe(true);
    expect(header.classList.length).toBeGreaterThan(2);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Profiles');
    expect(header.contains(screen.getByRole('button', { name: 'Add' }))).toBe(true);
    expect(header.nextElementSibling?.contains(screen.getByText('Read only'))).toBe(true);
    for (const prop of ['title', 'description', 'actions', 'notices'])
      expect(header.hasAttribute(prop)).toBe(false);
  });

  it('forwards EmptyState native attributes and supports a custom role and icon', () => {
    const ref = createRef<HTMLElement>();
    const { rerender } = render(
      <EmptyState
        ref={ref}
        title="No profiles"
        class="first"
        className="second"
        aria-label="Empty profiles"
        data-testid="empty"
      >
        Add a profile
      </EmptyState>,
    );
    const section = screen.getByRole('status');
    expect(ref.current).toBe(section);
    expect(section.tagName).toBe('SECTION');
    expect(section.getAttribute('aria-label')).toBe('Empty profiles');
    expect(section.getAttribute('data-testid')).toBe('empty');
    expect(section.classList.contains('first')).toBe(true);
    expect(section.classList.contains('second')).toBe(true);
    expect(section.classList.length).toBeGreaterThan(2);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('No profiles');
    expect(screen.getByText('Add a profile')).toBeTruthy();
    const defaultPath = section.querySelector('path')?.getAttribute('d');
    expect(defaultPath).toBeTruthy();
    rerender(<EmptyState title="No adapters" icon="network" role="region" />);
    expect(screen.getByRole('region').querySelector('path')?.getAttribute('d')).not.toBe(
      defaultPath,
    );
    for (const prop of ['title', 'icon'])
      expect(screen.getByRole('region').hasAttribute(prop)).toBe(false);
  });
});
