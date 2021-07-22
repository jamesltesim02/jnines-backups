import React from 'react';

import { MediaType } from '../../../../../../consts/match';
import mergeClass from '../../../../../../utils/mergeClass';

import M from '../../../../../common/m';
import IconFlash from '../../../../../icons/IconFlash';
import IconVideo from '../../../../../icons/IconVideo';

const ICONS = {
  [MediaType.VIDEO]: <IconVideo />,
  [MediaType.LMT]: <IconFlash />,
};

function MediaTabs (
  {
    active,
    medias,
    onMediaChange = () => {}
  }: {
    active: MediaType,
    medias: MediaType[],
    onMediaChange: (active: MediaType) => void
  }
) {
  return (
    <header
      className={mergeClass({
        'media-tab': true,
        'multiple': medias.length > 1
      })}
    >
      {
        medias.map(media => (
          <button
            key={media}
            onClick={() => {
              if (media !== active) {
                onMediaChange(media);
              }
            }}
            className={media === active ? 'active' : undefined}
          >
            {ICONS[media]}
            <M id={`match.media_${media}`} />
          </button>
        ))
      }
    </header>
  );
}

export default MediaTabs;
