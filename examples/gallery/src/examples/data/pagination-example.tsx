import { css, cx } from '../../../../../.artifacts/gallery-styled-system/css';
import { useSignal } from '@preact/signals';
import { Pagination } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';

export function PaginationExample() {
  const page = useSignal(2);
  return (
    <div class={cx(galleryStyles.sections, css({ width: '100%' }))}>
      <Pagination
        aria-label="Example pages"
        page={page.value}
        pageCount={4}
        onPageChange={(nextPage) => {
          page.value = nextPage;
        }}
        previousLabel="Previous"
        nextLabel="Next"
      />
      <Pagination
        aria-label="Localized pages"
        page={page.value}
        pageCount={4}
        onPageChange={(nextPage) => {
          page.value = nextPage;
        }}
        previousLabel="Назад"
        nextLabel="Далее"
        formatPageLabel={(current, total) => `Страница ${current} из ${total}`}
      />
      <Pagination
        aria-label="Empty pages"
        page={1}
        pageCount={0}
        onPageChange={(nextPage) => {
          page.value = nextPage;
        }}
        previousLabel="Previous"
        nextLabel="Next"
      />
      <Pagination
        aria-label="Disabled pages"
        page={2}
        pageCount={4}
        onPageChange={(nextPage) => {
          page.value = nextPage;
        }}
        previousLabel="Previous"
        nextLabel="Next"
        disabled
      />
    </div>
  );
}
