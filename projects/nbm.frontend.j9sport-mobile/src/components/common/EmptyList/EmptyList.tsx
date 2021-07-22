import React from 'react';

import IconImage from './icon.png';

import M from '../m';

function EmptyList(
  {
    message,
    style,
    image,
    size
  }: {
    message?: any
    style?: any
    image?: any
    size?: number
  }
) {
  return (
    <section
      className="empty-list"
      style={style}
    >
      <div>
        <img
          alt=""
          style={size ? {
            height: size,
            width: size
          } : {}}
          src={image || IconImage}
        />
        <div className="msg">
          {message || <M id="common.norecords"/>}
        </div>
      </div>
    </section>
  );
}

export default EmptyList;
