import React from 'react';

import openViewImg from '../img/open-view.png'
import openViewCloseImg from '../img/open-view-close.png'

function RedOpenView(
  {
    closeAct,
    redAmount,
    showOpenView = false,
    setShowOpenView,
    loading
  }: {
    closeAct: Function
    redAmount: number
    setShowOpenView: Function
    loading: boolean
    showOpenView: boolean
  }
) {

  if (!showOpenView) {
    return null;
  }

  const RedAgain = () => (
    <>
      <p className="title">恭喜获得</p>
      <p className="cash">现金红包</p>
      <p className="soon">红包将会尽快派发</p>
      <div
        className="btn"
        onClick={() => setShowOpenView(false)}
      >继续抢红包
      </div>
    </>
  )

  const NoMore = () => (
    <>
      <p className="title">再接再厉</p>
      <div
        className="btn"
        onClick={() => closeAct()}
      >退出活动
      </div>
    </>
  )

  return (
    <div className="red-open-view">
      <div className="content">
        {
          loading ?
            <>
              <p className="title">正在打开红包</p>
              <img src={openViewCloseImg} alt="openview"/>
            </>
            :
            <>
              {
                redAmount ?
                  <RedAgain/> :
                  <NoMore/>
              }
              {
                redAmount ?
                  <div className="amount">
                    <p>
                      $
                      <span>{redAmount.toFixed(2)}</span>
                    </p>
                  </div> :
                  <div className="nomore">
                    红包已抢完
                    <br/>
                    请期待下次进球
                  </div>
              }
              <img src={openViewImg} alt="openview"/>
            </>
        }
      </div>
    </div>
  );
}

export default RedOpenView;