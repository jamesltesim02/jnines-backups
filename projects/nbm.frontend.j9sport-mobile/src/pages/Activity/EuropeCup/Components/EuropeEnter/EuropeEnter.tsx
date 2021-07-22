import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import ImageEurope from "../../img/europe-enter.png";
import { useLocation } from "react-router";
import globalCompStore from "../../../../../stores/globalComp";

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
    return <div></div>;
  }

  return (
    <Link
      className="europe-enter"
      to="/activity/europe-cup"
    >
      <img src={ImageEurope} alt=""/>
      {
        popVisible
          &&
        <div className="europe-enter-content">
          欧洲杯猜想火热进行中，
          点击了解更多！（{count}S）
        </div>
      }
    </Link>
  );
}

export default observer(EuropeEnter);