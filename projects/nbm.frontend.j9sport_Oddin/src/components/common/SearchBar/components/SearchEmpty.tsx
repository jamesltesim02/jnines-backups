import React from 'react';
import EmptyImg from '../../../icons/icon-normal/empty-man.png'

import M from '../../m';

function SearchEmpty(
) {
  return (
    <div>
      <div className="empty">
        <img
          alt={'empty'}
          src={EmptyImg}
          style={{marginBottom: 10}}
        />
        <M id="search.notfound" />
      </div>
    </div>
  );
}

export default SearchEmpty;