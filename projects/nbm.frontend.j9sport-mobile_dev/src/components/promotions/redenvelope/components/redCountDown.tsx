import React, { useContext, useEffect, useState } from 'react';
import countDownImg from '../img/count-down.png';
import { RedContext } from "../redenvelope";

function RedCountDown() {
  // 倒计时秒数
  const COUNTDOWN_SECONDS = 5
  // 关闭倒计时
  const {closeCountDown}: any = useContext(RedContext)
  // 计时中标识
  const [timing, setTiming] = useState(true)
  // 当前秒数
  const [second, setSecond] = useState(COUNTDOWN_SECONDS)

  useEffect(() => {
    let interval = {} as any
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
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (second === 0) {
      closeCountDown()
    }
  }, [second])

  return (
    <div className="red-count-down">
      <div className="num">
        {second}
      </div>
      <img src={countDownImg} alt="countdown"/>
    </div>
  );
}

export default RedCountDown;