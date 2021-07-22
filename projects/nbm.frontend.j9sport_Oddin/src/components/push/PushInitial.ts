import React from 'react';
import { observer } from 'mobx-react';

import memberStore from '../../stores/member';
import appStore from '../../stores/app';
import matchStore from '../../stores/matchs';
import cartStore from '../../stores/cart';

import PushConnection, { PushEvent } from './PushConnection';
import { PushNt } from '../../consts/match';

const PUSH_CONNECTION = new PushConnection();

/* eslint-disable react-hooks/exhaustive-deps */
function PushInitial () {
  const { current: connection } = React.useRef(PUSH_CONNECTION);
  const [connectVersion, setConnectVersion] = React.useState(0);

  const { isLoged } = memberStore;

  // 当首次打开或者登录状态发生变化时建立推送连接
  React.useEffect(
    () => {
      if (connectVersion === 0) {
        return;
      }

      let signature = (
        isLoged ? (
          [
            memberStore.userId,
            appStore.clientType,
            memberStore.currency,
            appStore.originType
          ].join('_')
        ) : (
          `Temp${Date.now()}${Math.random()}`
        )
      );

      if (connection.connected) {
        connection.reconnect(signature, memberStore.userId);
      } else {
        connection.connect(signature, memberStore.userId);
      }

      // 注册页面焦点获取事件, 重新创建链接以及注册推送数据
      // window.addEventListener('focus', connection.reconnect.bind(connection));

      return () => {
        connection.disconnect();
        // window.removeEventListener('focus', connection.reconnect.bind(connection));
      };
    },
    [connection, connectVersion]
  );

  React.useEffect(
    () => {
      if (
        isLoged
        &&
        connection.userId === memberStore.userId
      ) {
        return;
      }

      setConnectVersion(v => v + 1);
    },
    [connection, isLoged, setConnectVersion]
  );

  const matchPushData = matchStore.pushData;
  const cartPushData = cartStore.pushData;
  // 推送数据注册 
  React.useEffect(
    () => {
      if (!connection) {
        return;
      }
      const token = (
        memberStore.token
        ||
        (`Token${Date.now()}${Math.random()}_${appStore.clientType}`)
      );

      connection.on(
        {
          token,
          ...matchPushData,
          options: cartPushData,
        },
        (event: PushEvent) => {
          // 收到推送事件触发全局事件
          window.dispatchEvent(new CustomEvent(
            `push-nt-${event.nt}`,
            { detail: event.data }
          ));

          // 注单变化只触发购物车中的事件
          if (event.nt === PushNt.ORDER) {
            cartStore.onDataChange(event);
          } else {
            // 触发列表事件
            matchStore.onDataChange(event);
            // 触发购物车事件
            const index = cartPushData.findIndex(
              ({ matchId }) => (
                event.data
                &&
                matchId === event.data.mid
              )
            );
            if (index > -1) {
              cartStore.onDataChange(event);
            }
          }
        }
      );
    },
    [connection, matchPushData, cartPushData]
  );

  return null;
}

export default observer(PushInitial);

