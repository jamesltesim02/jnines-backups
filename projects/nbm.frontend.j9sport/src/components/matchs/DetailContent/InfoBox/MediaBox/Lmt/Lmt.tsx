import React from 'react';

import AppConfig from '../../../../../../configs';
import { MediaPath } from '../../../../../../consts/network';

import appStore from '../../../../../../stores/app';

import MediaContainer from '../MediaContainer';

function Lmt (
  {
    resource,
    active,
    ...props
  }: any
) {
  const src = (
    `${
      AppConfig.MEDIA_URL
    }${
      MediaPath.LMT
    }?id=${
      resource
    }&locale=${
      appStore.locale
    }`
  );

  return (
    <div className={`lmt-box ${active ? 'active' : ''}`}>
      <MediaContainer {...props}>
        <iframe
          src={src}
          title="lmt"
          scrolling="no"
          allowFullScreen
        ></iframe>
      </MediaContainer>
    </div>
  );
}

export default Lmt;
