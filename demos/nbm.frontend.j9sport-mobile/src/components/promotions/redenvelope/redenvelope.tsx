import React, { createContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react'
import { useApi } from "../../../apis";
import Promotion from "../../../apis/Promotion";

import matchs from "../../../stores/matchs/Matchs";
import member from "../../../stores/member";

import { RedCountDown } from "./components";
import { RedAnimation } from "./components";
import { RedTop } from "./components";

export const RedContext = createContext({})

function Redenvelope() {

  const [promo] = useApi([Promotion])

  // 显示红包活动
  const [showRed, setShowRed] = useState(false)
  // 显示倒计时
  const [showCountDown, setShowCountDown] = useState(false)
  // 活动倒计时
  const [activeTime, setActiveTime] = useState(0)

  // 关闭活动
  const closeAct = (val = false) => {
    setShowRed(val)
    setShowCountDown(val)
  }
  // 关闭倒计时
  const closeCountDown = (val = false) => {
    setShowCountDown(val)
  }
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // 红包飘落推送
    const handleNT1001 = ({detail}: any) => {
      // 判断是否在当前比赛
      if (matchs.detail?.matchId === detail.matchId) {
        setActiveTime(detail.activeTime)
        setShowCountDown(true)
        setShowRed(true)
      }
    }
    // 红包结束推送
    const handleNT1003 = ({detail}: any) => {
      if (matchs.detail?.actId === detail.actId) {
        setShowRed(false)
        setShowCountDown(false)
      }
    }

    window.addEventListener('push-nt-1001', handleNT1001);
    window.addEventListener('push-nt-1003', handleNT1003);

    return () => {
      window.removeEventListener('push-nt-1001', handleNT1001);
      window.removeEventListener('push-nt-1003', handleNT1003);
    };
  }, [])

  useEffect(() => {

    if (!matchs.detail || !member.isLoged) {
      return;
    }

    // 检查飘红包活动
    if (matchs.detail.activityInfo) {
      promo.getCheckRedAct(matchs.detail.activityInfo.actId, member.memberInfo.customerId).then(
        (res: any) => {
          if (res) {
            setActiveTime(((res.actionTime + res.activeTime * 1000) - Date.now()) / 1000)
            setShowRed(true)
          }
        }
      )
    }

  }, [matchs.detail])

  if (!showRed) {
    document.body.style.overflow = 'auto'
    return null;
  } else {
    document.body.style.overflow = 'hidden'
  }

  return (
    <div className="redenvelope">
      <RedContext.Provider value={{closeAct, closeCountDown}}>
        {
          /*红包开始倒计时*/
          showCountDown ?
            // 全屏倒计时
            <RedCountDown/> :
            <>
              {/*头部倒计时*/}
              <RedTop activeTime={activeTime} closeAct={() => closeAct()}/>
              {/*红包动画*/}
              <RedAnimation closeAct={() => closeAct()}/>
            </>
        }
      </RedContext.Provider>
    </div>
  );
}

export default (observer(Redenvelope));