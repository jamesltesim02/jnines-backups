import React from 'react';
import TogglableIcon from '../TogglableIcon';

import FavoriteImage from './favorite.png';
import FavoriteActiveImage from './favorite-active.png';

function IconFavorite (
  {
    active = false
  }: {
    active?: boolean
  }
) {
  return (
    <TogglableIcon
      src={FavoriteImage}
      activeSrc={FavoriteActiveImage}
      active={active}
      size={13}
    />
  );
}

export default IconFavorite;
