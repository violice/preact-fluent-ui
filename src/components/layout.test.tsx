import { createRef } from 'preact';
import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import { DialogBody, DialogFooter, DialogHeader, EmptyState, PageHeader } from '../index';

afterEach(cleanup);

describe('layout', () => {
  it('forwards dialog part props and refs while putting the title id on h2', () => {
    const headerRef = createRef<HTMLElement>();
    const bodyRef = createRef<HTMLDivElement>();
    const footerRef = createRef<HTMLElement>();
    render(
      <>
        <DialogHeader
          ref={headerRef}
          id="dialog-title"
          title="Title"
          description="Description"
          class="first"
          className="second"
          data-testid="header"
          aria-label="Header"
        />
        <DialogBody
          ref={bodyRef}
          class="first"
          className="second"
          data-testid="body"
          aria-label="Body"
        >
          Content
        </DialogBody>
        <DialogFooter
          ref={footerRef}
          class="first"
          className="second"
          data-testid="footer"
          aria-label="Footer"
        >
          Actions
        </DialogFooter>
      </>,
    );
    const header = screen.getByTestId('header');
    const body = screen.getByTestId('body');
    const footer = screen.getByTestId('footer');
    expect(headerRef.current).toBe(header);
    expect(bodyRef.current).toBe(body);
    expect(footerRef.current).toBe(footer);
    expect(header.tagName).toBe('HEADER');
    expect(body.tagName).toBe('DIV');
    expect(footer.tagName).toBe('FOOTER');
    expect(header.hasAttribute('id')).toBe(false);
    expect(screen.getByRole('heading', { level: 2 }).id).toBe('dialog-title');
    expect(screen.getByText('Description')).toBeTruthy();
    expect(body.textContent).toBe('Content');
    expect(footer.textContent).toBe('Actions');
    for (const element of [header, body, footer]) {
      expect(element.classList.contains('first')).toBe(true);
      expect(element.classList.contains('second')).toBe(element !== header);
      expect(element.classList.length).toBeGreaterThan(element === header ? 1 : 2);
      expect(element.hasAttribute('aria-label')).toBe(true);
      expect(element.hasAttribute('title')).toBe(false);
      expect(element.hasAttribute('description')).toBe(false);
    }
  });

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
    expect(header.classList.contains('second')).toBe(false);
    expect(header.classList.length).toBeGreaterThan(1);
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
    expect(section.classList.contains('second')).toBe(false);
    expect(section.classList.length).toBeGreaterThan(1);
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
