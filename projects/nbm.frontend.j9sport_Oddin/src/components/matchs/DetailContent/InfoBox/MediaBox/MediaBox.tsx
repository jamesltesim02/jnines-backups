import React from 'react';
import Match from '../../../../../stores/matchs/Match';

import MediaTabs from './MediaTabs';

import Video from './Video';
import Lmt from './Lmt';
import { MediaType } from '../../../../../consts/match';

const MEDIA_COMPS = {
  [MediaType.VIDEO]: Video,
  [MediaType.LMT]: Lmt
};

function MediaBox (
  {
    match,
    fullscreen,
    onToggleFullscreen,
  }: {
    match: Match,
    fullscreen: boolean,
    onToggleFullscreen: (fullscreen: boolean) => void
  }
) {
  const [media, setMedia] = React.useState(match.medias[0]);

  return (
    <section className="media-box">
      <MediaTabs
        active={media}
        medias={match.medias}
        onMediaChange={setMedia}
      />
      <div className="content">
        {/* <MediaComp
          resource={resource}
          fixable
          fullable
          fullscreen={fullscreen}
          onToggleFullscreen={onToggleFullscreen}
        /> */}
        {
          match.medias.map(m => {
            const MediaComp = MEDIA_COMPS[m];
            return (
              <MediaComp
                key={m}
                resource={
                  m === MediaType.VIDEO
                  ? match.videoSrc
                  : match.lmtId
                }
                fixable
                fullable
                fullscreen={fullscreen}
                onToggleFullscreen={onToggleFullscreen}
                active={m === media}
              />
            );
          })
        }
      </div>
    </section>
  );
}

export default MediaBox;
