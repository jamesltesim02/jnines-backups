import React from 'react';
import { observer } from 'mobx-react';
import { Carousel } from 'antd';
import { Link } from "react-router-dom"
import { InfoCircleOutlined } from '@ant-design/icons';

import appStore from '../../../stores/app';
import M from '../../common/m';

const BODY_KEYS: any = {
  zh: 'body',
  en: 'bodyEn'
}

function AnnouBar (
  {
    annous
  }: {
    annous: Array<any>
  }
) {
  return (
    <div className="annou-bar">
      <InfoCircleOutlined />
      {
        annous.length ? (
          <>
            <Carousel
              autoplay
              dots={false}
              dotPosition="right"
              pauseOnHover
              autoplaySpeed={3000}
            >
              {
                annous.map(annou => (
                  <div key={annou.noticeId}>{annou[BODY_KEYS[appStore.locale]]}</div>
                ))
              }
            </Carousel>
            <Link
              to="/announcement"
              className="more-annou"
            >
              <M id="pages.annou_more" />
            </Link>
          </>
        ) : (<M id="pages.annou_none" />)
      }
    </div>
  );
}

export default observer(AnnouBar);
