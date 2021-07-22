import React, {useState} from 'react';
import TweenOne from 'rc-tween-one';
import {inject,observer} from "mobx-react";
import withApi from "../../../../api";
import {makeStyles} from "@material-ui/styles";
// @ts-ignore
import BezierPlugin from 'rc-tween-one/lib/plugin/BezierPlugin'
import redEnvImagesContext from "../img/redEnv";
import RedOpenView from "./redOpenView";

TweenOne.plugins.push(BezierPlugin);

// 红包图片
const redEnvImageList = redEnvImagesContext.keys().map(redEnvImagesContext)

const useStyle = makeStyles({
  root: {
    position: "absolute",
    zIndex: 2,
    width: 50,
    height: 70,
    '& img': {
      width: "100%",
      height: "100%"
    }
  }
})

function RedAnimation(
  {
    closeAct,
    api: {promo},
    store: {member,matchs}
  }
) {
  const classes = useStyle()
  // 红包动画高度
  const aniHeight = window.innerHeight < 1600 ? 1600 : window.innerHeight + 100

  // 打开红包弹框
  const [showOpenView, setShowOpenView] = useState(false)

  // 红包金额
  const [redAmount, setRedAmount] = useState(0)

  // 红包加载
  const [loading, setLoading] = useState(true)

  function getRedenvelope() {
    setLoading(true)

    setShowOpenView(true)
    promo.getRedEnvLopes(
      matchs.detail.activityInfo.actId,
      member.memberInfo.customerId,
      member.userId
    ).then(res => {
      if (res) {
        setRedAmount(res.amount)
      }else {
        setRedAmount(0)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <>
      {/*红包弹框*/}
      <RedOpenView
        closeAct={closeAct}
        showOpenView={showOpenView}
        setShowOpenView={(val) => setShowOpenView(val)}
        redAmount={redAmount}
        loading={loading}
      />
      {
        [...Array(80)].map((key, index) => {
          const style = {
            top: -150,
            left: `${Math.random() * 110}%`,
            transform: `scale(${1 + (Math.random() * 0.3 - 0.2)})`
          }
          return (
            <TweenOne
              key={index}
              className={classes.root}
              repeat={-1}
              style={style}
              paused={showOpenView}
              animation={
                {
                  duration: 5000,
                  delay: Math.random() * index * 500,
                  bezier: {
                    type: 'soft',
                    vars: [
                      {x: 0, y: 100},
                      {x: -200, y: aniHeight / 2},
                      {x: -400, y: aniHeight},
                    ]
                  }
                }
              }
              onTouchStart={() => {
                getRedenvelope()
              }}
            >
              <img
                src={redEnvImageList[Math.floor(Math.random() * redEnvImageList.length)].default}
                alt="redEnv"
              />
            </TweenOne>
          )
        })
      }
    </>
  );
}

export default withApi(['promo'])(
  inject('store')(
    observer(RedAnimation)
  )
);