import React from 'react';
import { Modal, Toast } from 'antd-mobile';
import Carousel from 'nuka-carousel';
import { useHistory } from 'react-router-dom';
// import User, { BalanceTarget } from "../../../apis/User";
import { BalanceTarget } from "../../../apis/User";
// import { useApi } from "../../../apis";
import memberStore from "../../../stores/member";

import ImageAGIN from './icons/AGIN.png';
import ImageAGQJ from './icons/AGQJ.png';
import ImageSHABA from './icons/SHABA.png';
import ImageYSB from './icons/YSB.png';
import ImageFISHING from './icons/FISHING.png';
import Image777 from './icons/777.png';
import ImageOddin from './icons/Oddin.png';
// import ImageVirtualSports from './icons/VirtualSports.png';
import ImageJ9 from './icons/j9_logo.png';

import { MainSitePath } from '../../../consts/app';
import { toMainSite } from '../../../utils/MainSiteUtils';
// import Pull from "../../../apis/Pull";

import { getGameStateSync, transferToGameSync } from '../../../apis/SyncApi';

const GAMES: Array<any> = [
  [
    {
      name: '九游会',
      subTitle: '真人游戏第一品牌',
      icon: ImageJ9,
      url: '',
      mainSite: true
    },
    {
      name: '沙巴体育',
      subTitle: '亚洲老牌体育平台',
      icon: ImageSHABA,
      url: '/other/shaba',
      target: BalanceTarget.SABA_IFRAME,
      liveTarget: 'saba',
    },
    {
      name: '真人国际厅',
      subTitle: '万人同场，美女互动',
      icon: ImageAGIN,
      url: MainSitePath.AGIN,
      mainSite: true
    },
    {
      name: '真人旗舰厅',
      subTitle: '百万限额，多台下注',
      icon: ImageAGQJ,
      url: MainSitePath.AGQJ,
      mainSite: true
    },
    // {
    //   name: '易胜博体育',
    //   subTitle: '稳健创新娱乐平台',
    //   icon: ImageYSB,
    //   url: 'other/ysb',
    //   target: BalanceTarget.SPORT,
    //   liveTarget: 'ysb'
    // },
  ],
  [
    {
      name: '易胜博体育',
      subTitle: '稳健创新娱乐平台',
      icon: ImageYSB,
      url: '/other/ysb',
      target: BalanceTarget.SPORT,
      liveTarget: 'ysb'
    },
    {
      name: '捕鱼王',
      subTitle: '在线捕鱼赢大钱',
      icon: ImageFISHING,
      url: MainSitePath.FISHING,
      mainSite: true
    },
    {
      name: '电子游戏',
      subTitle: '跨足五大类游戏产品',
      icon: Image777,
      url: MainSitePath.SLOT,
      mainSite: true
    },
    {
      name: '九游电竞',
      subTitle: '电竞直播现场投注',
      icon: ImageOddin,
      url: '/other/esport',
      target: BalanceTarget.SPORT,
      // 只在本地和测试环境打开
      // comingsoon: !/localhost|nbmm.co/gi.test(window.location.host),
      liveTarget: 'oddin'
    },
    // {
    //   name: '虚拟体育',
    //   subTitle: '在线游戏变革',
    //   icon: ImageVirtualSports,
    //   comingsoon: true,
    //   url: 'other/xun',
    // },
  ]
];

function GamesSlide () {
  // const [pull] = useApi([Pull])
  // const { user }: { user: User } = useApi({ user: User });
  const history = useHistory();
  const [transfering, setTransfering] = React.useState(false);

  const handleToGame = async (menu: any) => {
    if (menu.comingsoon) {
      return;
    }
    // 主站页面
    if (menu.mainSite) {
      toMainSite(menu.url, true);
      return;
    }
    // 未登录
    if (
      menu.url !== '/other/esport'
      &&
      !memberStore.isLoged
    ) {
      history.push('/login');
      return;
    }
    if (transfering) {
      return;
    }
    // 需要转账
    if (menu.target) {
      try {
        // const {maintenance, maintenancetime} = await pull.getSystemState(menu.liveTarget)
        const { maintenance, maintenancetime } = getGameStateSync(menu.liveTarget)
        if (maintenance) {
          Modal.alert(
            undefined,
            <div>
              <h2 >
                {maintenancetime.gameName}游戏厅正在维护中
              </h2>
              <p>维护开始时间：{maintenancetime.startTime}</p>
              <p>预计结束时间：{maintenancetime.endTime}</p>
            </div>,
            [
              {
                text: '关闭',
                onPress: () => {
                  return Promise.resolve();
                }
              }
            ]
          );
          return;
        }
        setTransfering(true);
        Toast.loading('正在将额度转入游戏,请稍后...');
        if (memberStore.isLoged) {
          // await user.userBalance({target: menu.target});
          transferToGameSync(menu.target);
          Modal.alert(
            undefined,
            <div>您的额度需要转回九游体育,点击立即转回即可游玩</div>,
            [
              {
                text: '立即转回',
                onPress: () => {
                  memberStore.reload();
                  return Promise.resolve();
                }
              }
            ]
          );
        }
        const {
          protocol,
          host
        } = window.location;
        window.open(`${protocol}//${host}${menu.url}`);
      } finally {
        Toast.hide();
        setTransfering(false);
      }
    }
  };

  return (
    <section className="game-entries">
      <Carousel
        disableEdgeSwiping={true}
        autoplay={false}
      >
        {
          GAMES.map((slide, index) => (
            <div
              key={index}
              className="sport-nav-slide"
            >
              {slide.map((menu: any) => (
                <a
                  key={menu.src}
                  onClick={(ev) => {
                    ev.preventDefault();
                    handleToGame(menu);
                    return;
                  }}
                  className={menu.comingsoon ? 'comingsoon' : undefined}
                  id={menu.url}
                >
                  <div>
                    <label>{menu.comingsoon ? '敬请期待' : menu.name}</label>
                    <span>{menu.subTitle}</span>
                  </div>
                  <img src={menu.icon} />
                </a>
              ))}
            </div>
          ))
        }
      </Carousel>
    </section>
  );
}

export default GamesSlide;
