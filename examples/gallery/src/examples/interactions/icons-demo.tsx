import { Icon } from '../../../../../dist/components.js';
import { galleryStyles } from '../../styles/gallery.styles.ts';
import { iconNames } from './dialog-scenarios';

export function IconsDemo() {
  return (
    <>
      {' '}
      <div>
        <div class={galleryStyles.icons}>
          {iconNames.map((name) => (
            <div class={galleryStyles.iconSample} key={name}>
              <Icon name={name} size={16} />
              <Icon name={name} size={20} />
              <Icon name={name} size={24} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
