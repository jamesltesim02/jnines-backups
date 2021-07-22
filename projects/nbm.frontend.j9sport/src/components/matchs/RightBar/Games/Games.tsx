import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from "mobx-react";
import { ToolOutlined } from "@ant-design/icons"
import memberStore from "../../../../stores/member";
// import User, { BalanceTarget } from "../../../../apis/User";
import { BalanceTarget } from "../../../../apis/User";

import ImageShaba from './img/shaba.png';
import ImageXuni from './img/xuni.png';
import ImageYsb from './img/ysb.png';
import ImageOddin from './img/oddin.png';
import { message } from "antd";
// import { useApi } from "../../../../apis";
import Dialog from "../../../member/Dialog";
import OnlineCustomerService from "../../../common/OnlineCustomerService";
// import Pull from "../../../../apis/Pull";

import { getGameStateSync, transferToGameSync } from '../../../../apis/SyncApi';
import mergeClass from "../../../../utils/mergeClass";

const GAMES_MENU: Array<{
  name: string,
  description: string
  icon: any
  src: string
  target?: string
  comingsoon?: boolean
  liveTarget: string
}> = [
  {
    name: '沙巴体育',
    description: '亚洲老牌体育平台',
    icon: ImageShaba,
    src: '/other/shaba',
    target: BalanceTarget.SABA_IFRAME,
    liveTarget: 'saba',
  },
  {
    name: '易胜博',
    description: '稳健创新娱乐平台',
    icon: ImageYsb,
    src: '/other/ysb',
    target: BalanceTarget.SPORT,
    liveTarget: 'ysb'
  },
  {
    name: '九游电竞',
    description: '电竞直播现场投注',
    icon: ImageOddin,
    src: '/other/esport',
    target: BalanceTarget.SPORT,
    // 只在本地和测试环境打开
    // comingsoon: !/localhost|nbmm.co/gi.test(window.location.host),
    liveTarget: 'oddin'
  },
  {
    name: '虚拟体育',
    description: '在线游戏变革',
    icon: ImageXuni,
    src: '/other/xuni',
    comingsoon: true,
    liveTarget: 'xuni'
  },
]

function TransFailed() {
  return (
    <>
      <h2>转额失败!请检查您的余额，如有任何疑问请联系客服解决</h2>
      <OnlineCustomerService className="transfer-btn"/>
    </>
  )
}

function GameMaintain(
  {
    gameName,
    endTime,
    startTime
  }: {
    gameName: string
    endTime: string
    startTime: string
  }
) {
  return (
    <div style={{textAlign: 'center'}}>
      <h2 >
        <ToolOutlined style={{width: 20, marginRight: 10}}/>
        {gameName}游戏厅正在维护中
      </h2>
      <p>维护开始时间：{startTime}</p>
      <p>预计结束时间：{endTime}</p>
    </div>
  )
}

function Games() {
  // const [user] = useApi([User])
  // const [pull] = useApi([Pull])
  const [transfering, setTransfering] = React.useState(false);
  const [dialog, setDialog] = useState<{
    visible: boolean
    content?: JSX.Element
  }>({
    visible: false,
    content: <></>
  })

  const handleToGame = async (menu: any) => {
    if (menu.comingsoon) {
      return;
    }

    if (
      menu.src !== '/other/esport'
      &&
      !memberStore.isLoged
    ) {
      message.warn('请先登录')
      memberStore.goLogin();
      return;
    }
    if (memberStore.j9Reloading) {
      message.warn('请等待余额加载完成');
      return;
    }
    if (transfering) {
      return;
    }
    try {
      // const { maintenance, maintenancetime } = await pull.getSystemState(menu.liveTarget)
      const { maintenance, maintenancetime } = getGameStateSync(menu.liveTarget)
      if (maintenance) {
        setDialog({
          visible: true,
          content: (
            <GameMaintain
              gameName={menu.name}
              startTime={maintenancetime.startTime}
              endTime={maintenancetime.endTime}
            />
          )
        })
        return;
      }
      if (menu.target) {
        const hide = message.loading('正在将额度转入游戏,请稍后...');
        try {
          setTransfering(true);
          if (memberStore.isLoged) {
            // await user.userBalance({target: menu.target});
            transferToGameSync(menu.target);
          }
          const {
            protocol,
            host
          } = window.location;
          window.open(`${protocol}//${host}${menu.src}`);
          memberStore.j9TransModalVisible = true;
        } catch (e) {
          if (e.code === 501) {
            setDialog({visible: true, content: <TransFailed /> })
          }
        } finally {
          hide();
          setTransfering(false);
        }
      }
    }  catch (e) {
      console.error(e)
    }
  };

  return (
    <div className="right-bar-games">
      {
        GAMES_MENU.map((menu: any) => (
          <Link
            key={menu.description}
            to={menu.src}
            target={"_blank"}
            onClick={(event) => {
              event.preventDefault();
              handleToGame(menu);
            }}
            className={mergeClass({
              "comingsoon": menu.comingsoon,
            })}
            id={menu.src}
          >
            <div className="description">
              {menu.comingsoon ? '敬请期待' : menu.name}
              <span>
                {menu.description}
              </span>
            </div>
            <img src={menu.icon} alt=""/>
          </Link>
        ))
      }
      <Dialog
        open={dialog.visible}
        className="transfer-dialog"
        imgbg
        closeButton={true}
        onClose={() => setDialog({visible: false})}
      >
        {dialog.content}
      </Dialog>
    </div>
  );
}

export default observer(Games);