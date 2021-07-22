import { observer } from "mobx-react";
import React from "react";

// import ImageLogo from './logo.png';

import appStore from '../../../../stores/app';
import logoImage from './images';

function Logo () {
  return (
    <img
      alt=""
      src={logoImage(`./${appStore.frontId}.png`)}
    />
  );
}

export default observer(Logo);
