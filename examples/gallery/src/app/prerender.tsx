import { prerender as renderStatic } from 'preact-iso';
import { Gallery } from './gallery';
import { galleryPages } from '../routes/pages';
import { galleryBase } from '../routes/routing';

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
