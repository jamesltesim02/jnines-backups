import React from 'react';

import SearchImage from './search.png';

function IconSearch (
  {
    size = 20
  }: {
    size?: number
  }
) {
  return (
    <img
      alt=""
      src={SearchImage}
      className="icon-search"
      style={{
        width: size,
        height: size
      }}
    />
  );
}

export default IconSearch;
