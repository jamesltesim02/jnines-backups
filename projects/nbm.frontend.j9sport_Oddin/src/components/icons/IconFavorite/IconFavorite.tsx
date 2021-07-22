import React from 'react';
import { StarFilled } from '@ant-design/icons';

import mergeClass from '../../../utils/mergeClass'

function IconFavorite (
  { active }: {
    active: boolean
  }
) {
  return (
    <i
      className={mergeClass({
        'icon-favorite': true,
        active
      })}
    >
      <StarFilled />
    </i>
  );
}

export default IconFavorite;
