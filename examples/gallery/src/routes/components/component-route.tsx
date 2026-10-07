import type { ComponentDoc } from './types';
import { ComponentPage } from './component-page';

export function createComponentRoute(doc: ComponentDoc) {
  return function ComponentRoute() {
    return <ComponentPage doc={doc} />;
  };
}
