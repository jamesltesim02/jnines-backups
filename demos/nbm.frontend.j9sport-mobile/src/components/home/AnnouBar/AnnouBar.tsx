import React from 'react';
import { Carousel, Icon } from 'antd-mobile';
import appStore from '../../../stores/app';
import { useHistory } from 'react-router-dom'

import SpeakerImage from './speaker.png';

const BODY_KEYS: any = {
  zh: 'body',
  en: 'bodyEn'
}

function AnnouBar(
  {
    annous
  }: {
    annous: Array<any>
  }
) {

  const history = useHistory()

  return (
    <div
      className="annou-bar"
      onClick={() => history.push('/announce')}
    >
      <img src={SpeakerImage} alt=""/>
      <Carousel
        vertical
        dots={false}
        autoplay
        infinite
      >
        {
          annous.map(annou => (
            <div
              key={annou.noticeId}
              className="annou-bar-item"
            >{annou[BODY_KEYS[appStore.locale]]}</div>
          ))
        }
      </Carousel>
      <Icon
        type="right"
        size="xs"
      />
    </div>
  );
}

export default AnnouBar;
