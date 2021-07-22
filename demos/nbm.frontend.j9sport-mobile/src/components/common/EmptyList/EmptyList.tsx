import React from 'react';

import IconImage from './icon.png';

import M from '../m';

function EmptyList (
  {
    message
  }: {
    message?: any
  }
) {
  return (
    <section className="empty-list">
      <div>
        <img alt="" src={IconImage} />
        <div className="msg">
          {message || <M id="common.norecords" />}
        </div>
      </div>
    </section>
  );
}

export default EmptyList;
