import { Button, PageHeader } from '../../../../../../../dist/components.js';

export function DocPageHeaderExample() {
  return (
    <PageHeader
      title="PageHeader"
      description="Manage local connections."
      ref={(header: HTMLElement | null) =>
        header?.querySelector('h1')?.setAttribute('tabindex', '-1')
      }
      actions={<Button>Add connection</Button>}
    />
  );
}
