import React, { useEffect, useState } from 'react';
import { Popover } from "antd";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { observer } from "mobx-react";
import globalCompStore from "../../../../stores/globalComp";
import ImageEurope from "../../../../components/common/AppHeader/img/europe-enter.png";

function EuropeEnter() {
  const location = useLocation()
  const [popVisible, setPopVisible] = useState(false)
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (globalCompStore.hasEnterMsgShown) {
      return;
    }
    setPopVisible(true)
    if (count < 1) {
      setPopVisible(false)
      globalCompStore.hasEnterMsgShown = true
      return;
    }
    setTimeout(() => {
      setCount(count - 1)
    }, 1000)
  }, [count])

  if (location.pathname.includes('activity/europe-cup')) {
    return null;
  }

  return (
    <Popover
      visible={popVisible}
      placement="topLeft"
      trigger="hover"
      content={
        <div className="europe-enter-content">
          欧洲杯猜想火热进行中，
          点击了解更多！（{count}S）
        </div>
      }
    >
      <Link
        className="europe-enter"
        to="/activity/europe-cup"
      >
        <img src={ImageEurope} alt=""/>
      </Link>
    </Popover>
  );
}

export default observer(EuropeEnter);