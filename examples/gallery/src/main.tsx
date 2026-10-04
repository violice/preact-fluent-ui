import '../../../dist/theme.css';
import '../../../dist/styles.css';
import { hydrate, prerender as renderStatic } from 'preact-iso';
import { Gallery } from './gallery';
import { galleryPages } from './gallery-pages';
import { galleryBase } from './gallery-routing';

if (typeof window !== 'undefined') {
  hydrate(<Gallery />, document.getElementById('gallery')!);
}

export async function prerender(data: { url: string }) {
  const base = galleryBase(import.meta.env.BASE_URL);
  const url = base + data.url.replace(/^\//, '');
  const page = galleryPages.find((page) => page.path === data.url);
  const { html } = await renderStatic(<Gallery base={base} url={url} />);
  return {
    html,
    // Artifact paths are relative to the deployed base, unlike browser navigation links.
    links: new Set(galleryPages.map((page) => page.path)),
    data: { pages: galleryPages.map(({ path, title }) => ({ path, title })) },
    head: { lang: 'en', title: `${page?.title ?? 'Page not found'} | Preact Fluent UI` },
  };
}
