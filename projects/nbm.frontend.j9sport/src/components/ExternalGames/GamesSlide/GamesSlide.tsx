import React from 'react';
import { MainSitePath } from '../../../consts/app';
import { getMainSiteUrl } from '../../../utils/MainSiteUtils';

import ImageAGIN from './icons/AGIN.png';
import ImageAGQJ from './icons/AGQJ.png';
import ImageFISHING from './icons/FISHING.png';
import Image777 from './icons/777.png';
import ImageHot from './icons/external-hot.png';

import ImageJ9 from './icons/j9_logo.png';

const GAMES = [
  [
    {
      name: '九游会',
      icon: ImageJ9,
      url: '',
    },
    {
      name: '真人国际厅',
      icon: ImageAGIN,
      url: MainSitePath.AGIN,
    },
    {
      name: '真人旗舰厅',
      icon: ImageAGQJ,
      url: MainSitePath.AGQJ,
    },
    {
      name: '捕鱼王',
      icon: ImageFISHING,
      url: MainSitePath.FISHING,
    },
    {
      name: '电子游戏',
      icon: Image777,
      url: MainSitePath.SLOT,
    },
  ]
];

function GamesSlide () {
  return (
    <section className="game-entries">
      <img className="external-hot" src={ImageHot} alt=""/>
      {
        GAMES.map((slide, index) => (
          <div
            key={index}
            className="sport-nav-slide"
          >
            {slide.map(menu => (
              <a
                key={menu.name}
                href={getMainSiteUrl(menu.url)}
                target="_blank"
              >
                <img src={menu.icon} />
                <span>{menu.name}</span>
              </a>
            ))}
          </div>
        ))
      }
    </section>
  );
}

export default GamesSlide;
