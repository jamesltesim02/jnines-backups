import React from 'react';

import FlashImage from './flash.png';

function IconFlash ({ ...props }) {
  return (
    <i className="icon-flash">
      <img src={FlashImage} alt="" />
    </i>
  );
}

export default IconFlash;