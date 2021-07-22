import React, { useEffect, useState } from 'react';
import TopImg from '../img/top.png'

function RedTop(
  {
    closeAct,
    activeTime
  }: {
    closeAct: Function
    activeTime: number
  }
) {

  // 计时中标识
  const [timing, setTiming] = useState(true)
  // 当前秒数
  const [second, setSecond] = useState(parseInt(String(activeTime)))

  useEffect(() => {
    let interval = {} as any
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
  
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (second <= 0) {
      closeAct()
    }
  }, [second])

  return (
    <div className="red-top">
      <span className="close"
            onClick={() => closeAct()}
      >X</span>
      <p>倒数计时：{second}</p>
      <img src={TopImg} alt="redtop"/>
    </div>
  );
}

export default RedTop;