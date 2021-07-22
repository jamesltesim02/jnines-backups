import React from 'react';

import CornerImage from './corner.png';

function IconSoccerScore (
  { type }: {
    type: string
  }
) {
  return (
    <span className="icon-other-score">
      {
        type === 'corner'
        ? <img alt="" src={CornerImage} />
        : <i className={type} />
      }
    </span>
  );
}

export default IconSoccerScore;
