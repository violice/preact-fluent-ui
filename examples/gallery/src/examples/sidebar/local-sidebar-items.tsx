import type { JSX } from 'preact';
import { useSignal } from '@preact/signals';
import { Checkbox, Icon, SidebarItem } from '../../../../../dist/components.js';

export function LocalSidebarItems({
  first = 'Connections',
  second = 'Appearance',
  icon = false,
  selectableActive = false,
}: {
  first?: string;
  second?: string;
  icon?: boolean;
  selectableActive?: boolean;
}) {
  const selected = useSignal(0);
  const active = useSignal(true);
  const choose = (index: number) => (event: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    selected.value = index;
    if (index === 0) active.value = true;
  };
  return (
    <>
      {selectableActive && (
        <Checkbox
          label="Mark the example link active"
          checked={active}
          onChange={(event) => {
            active.value = event.currentTarget.checked;
          }}
        />
      )}
      <SidebarItem
        href="#demo-connections"
        active={selected.value === 0 && active.value}
        icon={icon ? <Icon name="network" /> : undefined}
        onClick={choose(0)}
        onAuxClick={choose(0)}
      >
        {first}
      </SidebarItem>
      <SidebarItem
        href="#demo-settings"
        active={selected.value === 1}
        onClick={choose(1)}
        onAuxClick={choose(1)}
      >
        {second}
      </SidebarItem>
      <SidebarItem
        as="button"
        icon={<Icon name="settings" />}
        label="Local settings"
        onClick={() => {
          selected.value = 1;
        }}
      >
        Settings
      </SidebarItem>
    </>
  );
}
