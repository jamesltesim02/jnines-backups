import React from 'react';

import mergeClass from '../../../utils/mergeClass';

import RightBar from '../RightBar';

function MatchPanel (
  {
    children,
    className = undefined,
    showLive = true,
    sportId
  }: {
    children: any,
    className?: string,
    combo?: boolean,
    showLive?: boolean,
    sportId?: number
  }
) {
  return (
    <section
      className={mergeClass(
        'match-panel',
        className
      )}
    >
      {children}
      <RightBar
        showLive={showLive}
        sportId={sportId}
      />
    </section>
  )
}

export default MatchPanel;
