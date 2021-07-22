import React from 'react';

import AppConfig from '../../../configs';
import { MediaPath } from '../../../consts/network';

import appStore from '../../../stores/app';

import Match from '../../../stores/matchs/Match';
import ItemContainer from './ItemContainer';

function LmtInfo (
  {
    match,
    active
  }: {
    match: Match,
    active: boolean
  }
) {
  const src = (
    `${
      AppConfig.MEDIA_URL
    }${
      MediaPath.LMT
    }?id=${
      match.lmtId
    }&locale=${
      appStore.locale
    }`
  );
  return (
    <ItemContainer
      className="lmt-info"
      active={active}
    >
      <iframe
        src={src}
        title="lmt"
        scrolling="no"
        allowFullScreen
      ></iframe>
    </ItemContainer>
  );
}

export default LmtInfo;
