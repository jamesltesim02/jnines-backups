import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react';
import Match from '../../../../stores/matchs/Match';

import MatchInfo from './MatchInfo';
import MediaBox from './MediaBox';
import mergeClass from '../../../../utils/mergeClass';

function DetailMedia (
  {
    match,
    fullscreen,
    onToggleFullscreen,
    style
  }: {
    match: Match,
    fullscreen: boolean,
    onToggleFullscreen: (fullscreen: boolean) => void
    style?: CSSProperties
  }
) {
  const ref = React.useRef<HTMLDivElement>(null);
  const mediaAvailable = match.medias.length > 0;

  return (
    <div
      ref={ref}
      style={style}
      className={mergeClass({
        'info-box': true,
        'media-available': mediaAvailable
      })}
    >
      <MatchInfo match={match} />
      {
        mediaAvailable ? (
          <MediaBox
            match={match}
            fullscreen={fullscreen}
            onToggleFullscreen={onToggleFullscreen}
          />
        ) : null
      }
    </div>
  );
}

export default observer(DetailMedia);
