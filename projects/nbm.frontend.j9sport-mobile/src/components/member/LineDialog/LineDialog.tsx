import React, { useEffect, useState } from 'react';
import Dialog from "../Dialog";
import { observer } from "mobx-react";
import appStore from "../../../stores/app";
import memberStore from "../../../stores/member";
import encodeSearchParams from "../../../utils/encodeSearchParams";
// @ts-ignore
import Ping from '../../../utils/ping';
import LoadingBar from "../../common/LoadingBar";
import AppConfig from "../../../configs";

const p = new Ping({
  favicon: '/heartbeat.jpg'
})
const {LINE_LIST} = AppConfig
type PING_LIST = Array<{ host: string, ping: number }>
const PING_COLOR = [
  'rgb(36, 170, 29)',
  'rgb(66, 221, 63)',
  'rgb(190, 246, 99)',
  'rgb(190, 246, 99)',
  'rgb(246, 152, 51)',
  'rgb(230, 22, 16)'
]

function LineDialog(
  {
    open,
    onClose
  }: {
    open: boolean
    onClose: any
  }
) {
  const [pingList, setPingList] = useState<PING_LIST>([])

  const getPing = async () => {
    const arr: PING_LIST = []
    for (const address of LINE_LIST) {
      try {
        await p.ping(address,
          function (err: any, data: any) {
            arr.push({
              host: address,
              ping: !!err ? 0 : data
            },)
          });
      } catch (e) {
      }
    }
    setPingList(arr)
  }
  useEffect(() => {
    if (open) {
      getPing()
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      closeButton
    >
      <div className="line-dialog">
        <header>请选择线路</header>
        <ul className="line-content">
          {
            pingList.length > 0
              ? pingList
                .sort((a, b) => {
                    if (b.ping === 0) {
                      return -1
                    }
                    return a.ping - b.ping
                  }
                )
                .map(({host, ping}, index) => {
                  const color = !ping ? PING_COLOR[5] : Math.floor(ping / 50) > 4 ? PING_COLOR[4] : PING_COLOR[Math.floor(ping / 50)]
                  const href = !memberStore.isLoged
                    ? host
                    : `${host}?${encodeSearchParams({
                      j9Token: memberStore.agToken,
                      currency: memberStore.currency,
                      frontId: appStore.frontId,
                      origin: appStore.origin,
                      clientType: appStore.clientType
                    })}`
                  return (
                    <li key={host}>
                      <a href={href}>
                        {host.replace(/http:\/\/|https:\/\//, '')}
                      </a>
                      <div style={{color}}>
                        {!!ping ? `${ping} 毫秒` : "超时"}
                        &emsp;
                        {index === 0 && ping !== 0 && '推荐'}
                      </div>
                    </li>
                  )
                })
              : <LoadingBar/>
          }
        </ul>
      </div>
    </Dialog>
  );
}

export default observer(LineDialog);