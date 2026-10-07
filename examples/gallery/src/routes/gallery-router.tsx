import { ErrorBoundary, Router, Route } from 'preact-iso';
import { NotFound } from '../components/not-found/not-found';
import { galleryPages } from './pages';
import { galleryBase } from './routing';
export function GalleryRouter({ base }: { base: string }) {
  return (
    <ErrorBoundary>
      <Router>
        {galleryPages.map((page) => (
          <Route
            key={page.path}
            path={galleryBase(base) + page.path.replace(/^\//, '')}
            component={page.component}
          />
        ))}
        <Route default component={NotFound} />
      </Router>
    </ErrorBoundary>
  );
}
