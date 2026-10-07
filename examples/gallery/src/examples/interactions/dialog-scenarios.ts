import type { ButtonProps, IconName } from '../../../../../dist/components.js';

export const iconNames: IconName[] = [
  'about',
  'adapter',
  'add',
  'chevron-down',
  'connected',
  'copy',
  'delete',
  'diagnostics',
  'disconnected',
  'edit',
  'eye',
  'info',
  'network',
  'open',
  'profile',
  'refresh',
  'restore',
  'routes',
  'settings',
  'shield',
  'vpn',
  'warning',
];

export const variants: NonNullable<ButtonProps['variant']>[] = [
  'default',
  'primary',
  'subtle',
  'danger',
];

export type Scenario = 'standard' | 'hidden' | 'empty' | 'removed' | 'confirmation';
