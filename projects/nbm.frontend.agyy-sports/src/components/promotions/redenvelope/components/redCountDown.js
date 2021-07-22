import React, {useContext, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/styles";
import countDownImg from '../img/count-down.png';
import {RedContext} from "../redenvelope";

const useStyle = makeStyles({
  root: {
    position: "absolute",
    left: "50%",
    top: "40%",
    transform: "translateX(-50%)",
    width: "75vw",
    height: "26vw",
    animation: "$drop-down .3s ease-out",
    '& > img': {
      width: "100%",
      height: "100%",
    },
    '& .num': {
      color: "#f40c06",
      fontSize: "6vw",
      position: "absolute",
      right: "11%",
      top: "41%"
    }
  },
  "@keyframes drop-down": {
    "0%": {
      top: "-10%"
    },
    "100%": {
      top: "40%"
    }
  }
})

function RedCountDown() {

  const classes = useStyle()
  // 倒计时秒数
  const COUNTDOWN_SECONDS = 5
  // 关闭倒计时
  const {closeCountDown} = useContext(RedContext)
  // 计时中标识
  const [timing, setTiming] = useState(true)
  // 当前秒数
  const [second, setSecond] = useState(COUNTDOWN_SECONDS)

  useEffect(() => {
    let interval
    // 开始倒计时
    if (timing) {
      interval = setInterval(() => {
        setSecond(preSecond => {
          if (preSecond <= 1) {
            setTiming(false)
            clearInterval(interval)
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
    if (second === 0) {
      closeCountDown()
    }
  },[second])

  return (
    <div className={classes.root}>
      <div className="num">
        {second}
      </div>
      <img src={countDownImg} alt="countdown"/>
    </div>
  );
}

export default RedCountDown;