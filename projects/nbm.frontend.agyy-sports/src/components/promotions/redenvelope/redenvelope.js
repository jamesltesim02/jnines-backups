import React, {createContext, useEffect, useState} from 'react';
import withApi from "../../../api";
import {makeStyles} from "@material-ui/styles";
import {inject, observer} from 'mobx-react'

import RedCountDown from "./components/redCountDown";
import RedAnimation from "./components/redAnimation";
import RedTop from "./components/redTop";

export const RedContext = createContext()

const useStyle = makeStyles({
  root: {
    zIndex: 1200,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,.2)"
  }
})

function Redenvelope(
  {
    api: {promo},
    store: {member, matchs}
  }
) {

  const classes = useStyle()
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

  useEffect(() => {
    // 红包飘落推送
    const handleNT1001 = ({detail}) => {
      // 判断是否在当前比赛
      if (matchs.detail.matchId === detail.matchId) {
        setActiveTime(detail.activeTime)
        setShowCountDown(true)
        setShowRed(true)
      }
    }
    // 红包结束推送
    const handleNT1003 = ({detail}) => {
      if (matchs.detail.actId === detail.actId) {
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
  },[])

  useEffect(() => {

    if (!matchs.detail || !member.isLoged) {
      return;
    }

    // 检查飘红包活动
    if (matchs.detail.activityInfo) {
      promo.getCheckRedAct(matchs.detail.activityInfo.actId,member.memberInfo.customerId).then(
        res => {
          if (res) {
            setActiveTime(((res.actionTime + res.activeTime * 1000) - Date.now())/1000)
            setShowRed(true)
          }
        }
      )
    }

  }, [matchs.detail])

  if (!showRed) {
    document.body.style.overflow = 'auto'
    return null;
  }else {
    document.body.style.overflow = 'hidden'
  }

  return (
    <div
      className={classes.root}
    >
      <RedContext.Provider value={{closeAct,closeCountDown}}>
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

export default withApi(["promo"])(
  inject('store')(
    observer(Redenvelope)
  )
);