import React from 'react';
import mergeClass from '../../../utils/mergeClass';

function TogglableIcon (
  {
    src,
    activeSrc,
    active = false,
    size,
    width,
    height,
  }: {
    src: any,
    activeSrc: any,
    active?: boolean,
    size?: number,
    width?: number,
    height?: number,
  }
) {
  return (
    <i
    className={mergeClass({
      'togglable-icon': true,
      active
    })}
    style={{
      width: width || size,
      height: height || size,
    }}
  >
    <img src={src} alt="" />
    <img src={activeSrc} alt="" />
  </i>
  );
}

export default TogglableIcon;
