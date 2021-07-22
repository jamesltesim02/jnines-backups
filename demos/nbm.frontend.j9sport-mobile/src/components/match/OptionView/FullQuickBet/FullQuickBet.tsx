import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useApi } from "../../../../apis";

import { QK_QUOTA } from "../../../../consts/app";
import SingleBetStore from "../../../../stores/cart/SingleBet";
import app from "../../../../stores/app";

import M from "../../../common/m";
import mergeClass from "../../../../utils/mergeClass";
import member from "../../../../stores/member";
import Bet from "../../../../apis/Bet";
import { Toast } from "antd-mobile";
import { useIntl } from "react-intl";

function FullQuickBet(
  {
    positionInfo,
  }: {
    positionInfo: any
  }
) {

  const [bet] = useApi([Bet])
  const intl = useIntl()

  const [betting, setBetting] = useState(false)

  // 投注金额
  const [betAmount, setBetAmount] = useState(app.acceptAmount)

  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    setScrollTop(document.getElementsByClassName('drawer-content')[0].scrollTop)
  }, [])

  // 投注
  const doSingleBet = (betAmount: number) => {

    setBetting(true)

    if (betAmount > member.balance) {
      setBetting(false)
      Toast.fail(intl.formatMessage({id: 'toast.balance_less'}))
      return;
    }

    if (!betAmount) {
      Toast.fail(intl.formatMessage({id: 'bet.amount_required'}))
      setBetting(false)
      return;
    }

    if (betAmount < SingleBetStore.current.minBet) {
      Toast.fail(
        intl.formatMessage(
          {id: 'bet.lowest_limit'},
          {min: SingleBetStore.current.minBet}
        )
      )
    }

    if (betting) {
      return;
    }

    bet.doBet({
      accept: app.oddsAccept,
      autoTransfer: true,
      betItems: [{
        betType: 1,
        bets: [{
          betM: 1,
          betN: 1,
          betCount: 1,
          betAmount: betAmount
        }],
        options: [{
          optionId: SingleBetStore.current.optionId,
          odds: SingleBetStore.current.odds
        }]
      }]
    }).then((res: any) => {
      if (res) {

        const {ticketId} = res[0]

        const betTime = Date.now()

        // 直接减去余额
        member.balance = member.balance - betAmount
        // 加入记录中
        SingleBetStore.addToRecord({
          ticketId,
          betTime,
          betAmount: res[0].bets[0].betAmount,
          options: {...SingleBetStore.current}
        })
        // 移除当前注单
        SingleBetStore.removeSingleBet()
        Toast.info(intl.formatMessage({id: 'ticket.status_1'}))
      }
    }).finally(() => {
      member.reload()
      setBetting(false)
    })
  }

  if (!positionInfo) {
    return null;
  }

  return (
    <div
      className="fullscreen-wrapper"
      style={{
        top: scrollTop
      }}
    >
      <div
        className={
          mergeClass({
            "fullscreen-quickBet": true,
          })
        }
        style={
          {
            left: `min(0px,calc((${window.innerWidth}px - ${positionInfo.x}px)))`,
            top: positionInfo.y > window.innerHeight / 2 ? (positionInfo.y + scrollTop) - 120 : (positionInfo.y + scrollTop) + 30
          }
        }
        onClick={ev => ev.stopPropagation()}
      >
        <div className="bet-area">
          {/*投注按钮*/}
          <div className="bet-amount">
            <div className="bet-amount-input">
              <input
                type="number"
                pattern="[0-9]*"
                value={betAmount}
                onChange={event => {
                  if (!betAmount && parseInt(event.target.value) === 0) {
                    return;
                  }
                  if (parseInt(event.target.value) > SingleBetStore.current.maxBet) {
                    setBetAmount(SingleBetStore.current.maxBet)
                  } else {
                    setBetAmount(parseInt(event.target.value))
                  }
                }}
              />
              <div>
                <p>
                  <M
                    id="bet.amount_limit"
                    values={{
                      min: SingleBetStore.current.minBet,
                      max: SingleBetStore.current.maxBet
                    }}
                  />
                </p>
              </div>
            </div>
            <button
              className="bet-amount-btn"
              onClick={() => {
                doSingleBet(betAmount)
              }}
            >
              <span>
                <M id="ticket.bet"/>
              </span>
              <br/>
              <span>
                <M id="bet.will_return"/>:
                {
                  betAmount ?
                    (SingleBetStore.current.odds * betAmount).toFixed(2)
                    : 0
                }
              </span>
            </button>
          </div>
        </div>
        <div className="quick-quota">
          {
            QK_QUOTA.map(val => (
              <span
                className="quick-quota-item"
                key={val}
                onClick={() => {
                  if (val > SingleBetStore.current.maxBet) {
                    setBetAmount(SingleBetStore.current.maxBet)
                  } else {
                    setBetAmount(val)
                  }
                }}
              >
                {`+${val}`}
              </span>
            ))
          }
          <span
            className="quick-quota-item"
            onClick={() => {
              setBetAmount(SingleBetStore.current.maxBet)
            }}
          >
          最大
        </span>
        </div>
      </div>
    </div>
  )
}

export default observer(FullQuickBet);