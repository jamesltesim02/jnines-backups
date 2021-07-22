import React, { ReactElement } from "react";
import Notification from "rc-notification";
import CartOptionName from "../../cart/CartOptionName";
import { observer } from "mobx-react";
import { AppLocaleProvider } from "../AppLocale";
import { Icon } from "antd-mobile";

let _n = null as any;
Notification.newInstance(
  {
    maxCount: 5,
    style: {
      top: "40px",
      right: "5px"
    }
  },
  n => {
    _n = n;
  },
);

const SingleChild = observer((
  {
    options,
    status
  }: {
    options: any
    status: number
  }
) => {
  return (
    <AppLocaleProvider>
      <div className="NotificationChild-singleBet">
        <div>
          {
            status === 1
              ? <Icon type="check-circle-o" color="#00b400"/>
              : <Icon type="cross-circle" color="#FF4A4A"/>
          }
        </div>
        <div className="info">
          {/*球队vs球队*/}
          <div>
            {options.matchInfo.matchName}
          </div>
          {/*玩法@赔率*/}
          <div>
            <CartOptionName
              option={options}
              match={options.matchInfo}
              market={options.market}
            />
            @
            <span>
          <span>
            {options.odds.toFixed(2)}
          </span>
        </span>
          </div>
        </div>
      </div>
    </AppLocaleProvider>
  )
})

/**
 * open
 *
 * @param content
 * @param duration
 * @param style
 */
function open(
  {
    content,
    duration = 1.5,
    style
  }: {
    content: ReactElement
    duration?: number
    style?: Object
  }
) {
  _n.notice({
    duration,
    content,
    style,
    closable: true
  })
}

function openSingle(options: any, status: number) {
  open({
    content: <SingleChild options={options} status={status}/>,
    duration: 3
  })
}

const notification = (function () {
  return {
    open,
    openSingle
  }
})()

export default notification;
