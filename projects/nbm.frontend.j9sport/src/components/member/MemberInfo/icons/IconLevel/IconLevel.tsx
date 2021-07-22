import React from 'react';

import IconLevel01 from './icon-level-01.svg';
import IconLevel02 from './icon-level-02.svg';
import IconLevel03 from './icon-level-03.svg';
import IconLevel05 from './icon-level-05.svg';
import IconLevel04 from './icon-level-04.svg';
import IconLevel06 from './icon-level-06.svg';
import IconLevel07 from './icon-level-07.svg';

const ICONS: Record<string, any> = {
  1: IconLevel01,
  2: IconLevel02,
  3: IconLevel03,
  5: IconLevel05,
  4: IconLevel04,
  6: IconLevel06,
  7: IconLevel07,
};

function IconLevel (
  {
    level
  } : {
    level: number
  }
) {
  if (level === 0) {
    return null;
  }
  return <img src={ICONS[level]} />;
}

export default IconLevel;
