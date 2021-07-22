import React from 'react';
import {Statistic} from 'antd';
import {CloseOutlined} from "@ant-design/icons";
import topImg from "./img/top.png";

const {Countdown} = Statistic

function RedEnvelopeTop(
  {
    closeAll,
    actionTime,
    activeTime,
  }: {
    closeAll: any
    actionTime: number
    activeTime: number
  }
) {

  return (
    <div className="top">
      <div
        className="close-btn"
        onClick={() => closeAll()}
      >
        <CloseOutlined/>
      </div>
      <div className="top-count">
        <span>
          倒计时:
          <Countdown
            valueStyle={{
              color: '#FFF',
              fontSize: 16}}
            value={actionTime + (activeTime - 1) * 1000}
            format="s"
            onFinish={() => {
              closeAll()
            }}
          />
        </span>
      </div>
      <img src={topImg} alt="top"/>
    </div>
  );
}

export default RedEnvelopeTop;