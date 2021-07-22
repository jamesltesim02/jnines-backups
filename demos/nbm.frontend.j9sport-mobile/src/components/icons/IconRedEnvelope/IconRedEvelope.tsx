import React from 'react';
import mergeClass from '../../../utils/mergeClass';

import RedEvelopeImage from './list-icon.png';

function IconRedEvelope (
  {
    playing = false
  }: {
    playing: boolean
  }
) {
  return (
    <img
      src={RedEvelopeImage}
      className={mergeClass({
        'icon-red-evelope': true,
        playing
      })}
      alt=""
    />
  );
}

export default IconRedEvelope;
