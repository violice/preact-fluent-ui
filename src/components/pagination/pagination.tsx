import type { ComponentChildren, JSX } from 'preact';
import { forwardRef } from 'preact/compat';
import { cx } from '../../styling/runtime/cx';
import { resolveClass } from '../../utils/resolve-class';
import { Button } from '../button/button';
import styles from './pagination.styles';

export type PaginationProps = JSX.HTMLAttributes<HTMLElement> & {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  previousLabel: string;
  nextLabel: string;
  'aria-label': string;
  disabled?: boolean;
  formatPageLabel?: (page: number, pageCount: number) => ComponentChildren;
};

export const Pagination = /* @__PURE__ */ forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    {
      page,
      pageCount,
      onPageChange,
      previousLabel,
      nextLabel,
      disabled = false,
      formatPageLabel,
      class: classProp,
      className,
      ...props
    },
    ref,
  ) {
    const displayedPage = pageCount === 0 ? 0 : Math.min(Math.max(page, 1), pageCount);
    const previousDisabled = disabled || displayedPage <= 1;
    const nextDisabled = disabled || displayedPage >= pageCount;
    return (
      <nav {...props} ref={ref} class={cx(styles.pagination, resolveClass(classProp, className))}>
        <Button
          size="compact"
          disabled={previousDisabled}
          onClick={() => {
            if (!previousDisabled) onPageChange(displayedPage - 1);
          }}
        >
          {previousLabel}
        </Button>
        <span class={styles.indicator}>
          {formatPageLabel
            ? formatPageLabel(displayedPage, pageCount)
            : `${displayedPage} / ${pageCount}`}
        </span>
        <Button
          size="compact"
          disabled={nextDisabled}
          onClick={() => {
            if (!nextDisabled) onPageChange(displayedPage + 1);
          }}
        >
          {nextLabel}
        </Button>
      </nav>
    );
  },
);
