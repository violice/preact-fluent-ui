import { useSignal } from '@preact/signals';
import { Button, EmptyState, Icon } from '../../../../../dist/components.js';

export function EmptyExample() {
  const added = useSignal(false);
  return (
    <EmptyState title={added.value ? 'Connection added' : 'No connections yet'}>
      <p>Add a sample connection to start. Longer descriptions fit inside the available space.</p>
      <Button onClick={() => (added.value = true)}>
        <Icon name="add" />
        Add connection
      </Button>
    </EmptyState>
  );
}
