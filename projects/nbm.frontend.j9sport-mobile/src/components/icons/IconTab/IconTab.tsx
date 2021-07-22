import React from 'react';
import images from './images';

import TogglableIcon from '../TogglableIcon';

function IconTab (
  {
    name,
    active
  }: {
    name: string,
    active: boolean
  }
) {
  return (
    <TogglableIcon
      src={images(`./${name}.png`)}
      activeSrc={images(`./${name}-active.png`)}
      active={active}
      size={22}
    />
  );
}

export default IconTab;
