import React, {useEffect, useState} from "react";
import {Statistic} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import TweenOne from 'rc-tween-one';
import {withApi} from "../../../apis";
import Pull from "../../../apis/Pull";

// @ts-ignore
import BezierPlugin from 'rc-tween-one/lib/plugin/BezierPlugin'
import redEnvImagesContext from "./img/redEnv/index";
import openViewImg from './img/open-view.png';
import openViewCloseImg from './img/open-view-close.png';
import countDown from './img/count-down.png'
import member from "../../../stores/member";
import RedEnvelopeTop from "./RedEnvelopeTop";

TweenOne.plugins.push(BezierPlugin);
const {Countdown} = Statistic;

// 红包图片
const redEnvImageList = redEnvImagesContext.keys().map(redEnvImagesContext)

function RedEnvelope(
  {
    api: {pull},
    matchId,
    actId
  }: {
    api: { pull: Pull }
    matchId: string
    actId: string
  }
) {

  // 红包动画高度
  const aniHeight = window.innerHeight < 1600 ? 1600 : window.innerHeight + 100
  // 控制红包飘落
  const [redAnimation, setRedAnimation] = useState(true)
  // 控制红包主体区域
  const [showRedEnvelope, setShowRedEnvelope] = useState(false)
  // 控制活动结束
  const [actClose, setActClose] = useState(true)
  // 红包金额
  const [redAmount, setRedAmount] = useState(0)
  // 打开红包显示的信息
  const [redAmountMsg, setRedAmountMsg] = useState('继续抢红包')

  // 飘红包时长
  const [activeTime, setActiveTime] = useState(0)
  // 票红包开始时间
  const [actionTime, setActionTime] = useState(0)
  // 加载红包
  const [loading, setLoading] = useState(true)

  const closeAll = () => {
    setActClose(true)
    setRedAnimation(true)
    setShowRedEnvelope(true)
  }

  // 抢红包
  const getRedEnvLopes = () => {

    setLoading(true)

    pull.getRedEnvLopes(actId, member.username).then(res => {
      if (res) {
        setRedAmount(res.amount)
        setRedAmountMsg('继续抢红包')
      } else {
        setRedAmount(0)
        setRedAnimation(false)
        setRedAmountMsg('退出活动')
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  /*监听推送事件
  * nt1001: 红包活动开启推送
  * nt1002: 红包活动剩余数量推送
  * nt1003: 红包活动结束推送
  */
  useEffect(
    () => {
      // 检查是否可以开始飘红包
      pull.getCheckRedAct(actId, member.username).then(res => {
        if (res) {
          // 设置票红包时长
          setActiveTime(res.activeTime)
          // 设置飘红包开始时间
          setActionTime(res.actionTime)
          // 开始票红包
          setActClose(false)
          // 不倒计时直接开始
          setShowRedEnvelope(true)
        }
      })
    },
    [pull, actId]
  )

  useEffect(() => {
    //红包推送
    const handleNT1001 = ({detail}: any) => {
      // 判断是否在当前比赛
      if (matchId === detail.matchId) {
          // 设置票红包时长
          setActiveTime(detail.activeTime)
          // 设置飘红包开始时间
          setActionTime(detail.actionTime)
          // 开始票红包
          setActClose(false)
          // 倒计时开始
          setShowRedEnvelope(false)
          // 设置开始飘红包雨
          setRedAnimation(true)
      }
    }

    // 红包活动结束推送
    const handleNT1003 = ({detail}: any) => {
      if (detail.actId === actId) {
        closeAll()
      }
    }

    window.addEventListener('push-nt-1001', handleNT1001);
    window.addEventListener('push-nt-1003', handleNT1003);

    return () => {
      window.removeEventListener('push-nt-1001', handleNT1001);
      window.removeEventListener('push-nt-1003', handleNT1003);
    };
  }, [actId, matchId]);

  if (actClose) {
    return null;
  }

  return (
    <>
      {
        showRedEnvelope ?
          <div className='red-envelope-wrapper'>
            {/*头部*/}
            <RedEnvelopeTop
              closeAll={closeAll}
              actionTime={actionTime}
              activeTime={activeTime}
            />
            {/*红包打开状态*/}
            <div className="open-view _hidden">
              {/*加载中的红包*/}
              {
                loading ?
                  <div className="open-view-close">
                    <span>正在打开红包</span>
                    <LoadingOutlined style={{fontSize: 48}} spin/>
                    <img src={openViewCloseImg} alt="openViewCloseImg"/>
                  </div>
                  :
                  <div className="open-view-content">
                    <div className="title">
                      {
                        redAmount === 0 ? '再接再厉！' : '恭喜获得！'
                      }
                    </div>
                    <div className="tips">
                      <span>
                        {
                          redAmount !== 0 ? '现金红包' : ''
                        }
                      </span>
                      <div>
                        {
                          redAmount !== 0 ? '红包将会尽快派发' : ''
                        }
                      </div>
                    </div>
                    {
                      redAmount === 0 ?
                        <span
                          className="center"
                          style={{fontSize: 16}}
                        >
                          红包已抢完
                          <br/>
                          请期待下次进球
                        </span>
                        :
                        <span className="center">$: {redAmount.toFixed(2)}</span>
                    }
                    <img src={openViewImg} alt="open-view"/>
                    <div
                      className="keep-btn"
                      onClick={() => {
                        if (redAmount === 0) {
                          closeAll()
                        }
                        const openEl = document.getElementsByClassName('open-view')[0]
                        openEl.classList.add('_hidden')
                      }}
                    >
                      {redAmountMsg}
                    </div>
                  </div>
              }
            </div>
            {/*红包飘落动画*/}
            {
              redAnimation ?
                [...Array(80)].map((key, index) => {
                  const style = {
                    top: -150,
                    left: `${Math.random() * 100}%`,
                    transform: `scale(${1 + (Math.random() * 0.3 - 0.2)})`
                  }
                  return (
                    <TweenOne
                      className='envelope-item'
                      repeat={-1}
                      style={style}
                      key={index}
                      onMouseDown={() => {
                        const envEl = document.getElementsByClassName('envelope-item')[index]
                        const openEl = document.getElementsByClassName('open-view')[0]
                        openEl.classList.remove('_hidden')
                        envEl.classList.add('_hidden')
                        // 抢红包
                        getRedEnvLopes()
                      }}
                      animation={{
                        duration: 4000,
                        delay: Math.random() * 15000,
                        bezier: {
                          type: 'soft',
                          vars: [
                            {x: 0, y: 100},
                            {x: -300, y: 800},
                            {x: -600, y: aniHeight},
                          ],
                        }
                      }}
                    >
                      <img
                        src={redEnvImageList[Math.floor(Math.random() * redEnvImageList.length)]}
                        alt="redEnv"
                      />
                    </TweenOne>
                  )
                })
                : null
            }
          </div>
          :
          // 红包倒计时
          <div className="red-envelope-count">
            <Countdown
              valueStyle={{
                color: '#f40c06',
                fontSize: 32
              }}
              value={Date.now() + 5000}
              format="s"
              onFinish={() => {
                setShowRedEnvelope(true)
              }}
            />
            <img src={countDown} alt="countDown"/>
          </div>
      }
    </>
  )
}

export default withApi({pull: Pull})(RedEnvelope);