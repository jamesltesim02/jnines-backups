import React from 'react';

import M from '../../../components/common/m';

function BlockHeader (
  {
    title,
    titleKey,
    extras
  }: {
    title?: any,
    titleKey?: string,
    extras?: any
  }
) {
  return (
    <header className="block-header">
      <div className="title-content">
        <span>
          {
            titleKey
            ? (<M id={titleKey} />)
            : title
          }
        </span>
      </div>
      {extras}
    </header>
  );
}

export default BlockHeader;
