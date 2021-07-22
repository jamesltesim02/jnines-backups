import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/styles";
import TopImg from '../img/top.png'

const useStyle = makeStyles({
  root: {
    position: "absolute",
    width: 200,
    height: 120,
    zIndex: 3,
    left: "50%",
    transform: "translateX(-50%)",
    "& > img": {
      width: "100%",
      height: "100%",
    },
    "& > p": {
      position: "absolute",
      fontSize: 12,
      color: "#ffffff",
      left: "50%",
      transform: "translateX(-50%)"
    },
    "& > .close": {
      position: "absolute",
      right: 0,
      top: "20%",
      display: "inline-block",
      width: 28,
      height: 28,
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,.5)",
      textAlign: "center",
      lineHeight: "32px",
      fontWeight: 600,
    }
  }
})


function RedTop(
  {
    closeAct,
    activeTime
  }
) {

  const classes = useStyle()

  // 计时中标识
  const [timing, setTiming] = useState(true)
  // 当前秒数
  const [second, setSecond] = useState(parseInt(activeTime))

  useEffect(() => {
    let interval
    // 开始倒计时
    if (timing) {
      interval = setInterval(() => {
        setSecond(preSecond => {
          if (preSecond <= 1) {
            setTiming(false)
            clearInterval(interval)
            // 结束活动
            return 0
          } else {
            return preSecond - 1
          }
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timing])

  useEffect(() => {
    if (second <= 0) {
      closeAct()
    }
  },[second])

  return (
    <div className={classes.root}>
      <span className="close"
            onClick={() => closeAct()}
      >X</span>
      <p>倒数计时：{second}</p>
      <img src={TopImg} alt="redtop"/>
    </div>
  );
}

export default RedTop;