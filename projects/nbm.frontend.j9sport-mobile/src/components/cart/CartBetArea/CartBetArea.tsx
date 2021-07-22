import React, { useEffect, useState } from 'react';
import appStore from "../../../stores/app";
import { observer } from "mobx-react";
import { CURRENCY_MAP, OddsAccept } from "../../../consts/app";

import mergeClass from "../../../utils/mergeClass";
import Switch from "../../common/Switch";
import LoadingBar from "../../common/LoadingBar";
import deleteImg from "../images/delete.png";
import { Toast } from "antd-mobile";
import { useIntl } from "react-intl";
import { Icon } from "antd-mobile";

import M from '../../common/m'
import member from "../../../stores/member";

function CartBetArea(
  {
    doBet,
    betting,
    minBet,
    maxBet,
    odds,
    message
  }: {
    doBet: (amount: number, accept: number) => void
    betting: boolean
    minBet: number
    maxBet: number
    odds: number
    message?: string
  }
) {

  const intl = useIntl()

  // 投注额
  const [betAmount, setBetAmount] = useState('')
  // 隐藏placeholder
  const [hideLimit, setHideLimit] = useState(false)
  // accept: 是否接受赔率变化  NO: 不接受, BETTER: 接受更好赔率, ALL: 接受所有赔率
  const [accept, setAccept] = useState(appStore.oddsAccept)
  // 接受更好赔率
  const highOdds = accept === OddsAccept.BETTER || accept === OddsAccept.ALL
  // 接受所有赔率
  const allOdds = accept === OddsAccept.ALL

  useEffect(() => {
      if (appStore.acceptAmount > maxBet && maxBet !== 0) {
        setBetAmount(`${maxBet}`)
      } else {
        if (appStore.acceptAmount !== 0) {
          setBetAmount(`${appStore.acceptAmount}`)
        }
      }
    }
    , [maxBet])

  useEffect(() => {
    const hasBetAmount = betAmount.length > 0

    setHideLimit(hasBetAmount)
  }, [betAmount])

  // 输入金额
  const onNumEnter = (num: string) => {

    let mount = betAmount + num
    if (parseInt(mount) === 0 || maxBet === 0) {
      return;
    }
    if (parseInt(num) > 9) {
      mount = num
    }
    if (parseInt(mount) >= maxBet) {
      setBetAmount(maxBet.toString())
    } else {
      setBetAmount(betAmount + num)
    }
  }

  // 修改接受赔率
  const changeOddsAccept = (val: number) => {
    if (val === accept) {
      val === OddsAccept.BETTER
        ? setAccept(OddsAccept.NO)
        : setAccept(OddsAccept.BETTER)
    } else if (
      accept === OddsAccept.ALL
      &&
      val === OddsAccept.BETTER) {
      setAccept(OddsAccept.NO)
    } else {
      setAccept(val)
    }
  }

  return (
    <>
      <div className="cart-bet-area">
        <div className="bet-balance">
          <span>
            <M id="pages.balance" /> ：{CURRENCY_MAP[member.currency] + " " + member.balance.toFixed(2)}
          </span>
          <span className="bet-balance-message">
            {
              message
              ||
             <span>*实际盘口和赔率以受注结果为准</span>
            }
          </span>
        </div>
        <div className="bet-amount">
          <div className="bet-amount-input">
            <input
              readOnly
              type="text"
              value={betAmount}
            />
            {/*清除按钮*/}
            <Icon
              type="cross"
              className={
                mergeClass({
                  "bet-amount-clear": true,
                  "hide": !hideLimit
                })
              }
              onClick={() => setBetAmount('')}
            />
            <div
              className={
                mergeClass({
                  'hide': hideLimit
                })
              }
            >
              <p>
                <M id="bet.amount_required"/>
              </p>
              <p>
                <M
                  id="bet.amount_limit"
                  values={{
                    min: minBet,
                    max: maxBet
                  }}
                />
              </p>
            </div>
          </div>
          <button
            className="bet-amount-btn"
            onClick={() => {
              if (parseInt(betAmount) > 0) {
                if (parseInt(betAmount) < minBet) {
                  Toast.fail(
                    intl.formatMessage(
                      {id: 'bet.lowest_limit'},
                      {min: minBet}
                    )
                  )
                  return;
                }
                doBet(parseInt(betAmount), accept)
              } else {
                Toast.info(intl.formatMessage({id: 'settings.amount_holder'}))
              }
            }}
          >
            {
              !betting ?
                (<>
                  <span>
                    {
                      !message ?
                        <M id="ticket.bet"/>
                        : "确认投注"
                    }
                  </span>
                  <br/>
                  <span>
                    <M id="bet.will_return"/>
                    {
                      (odds * parseInt(betAmount) || 0).toFixed(2)
                    }
                  </span>
                </>)
                : <LoadingBar/>
            }
          </button>
        </div>
        <div className="bet-keyboard">
          {
            ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map(num => (
              <span
                key={num}
                className="bet-keyboard-num"
                onClick={() => onNumEnter(num)}
              >
                  {num}
                </span>
            ))
          }
          <span
            className="bet-keyboard-num"
            onClick={() => {
              if (member.balance < maxBet) {
                setBetAmount(Math.floor(member.balance).toFixed(0))
              }else {
                setBetAmount(maxBet.toFixed(0))
              }
            }}
          >
            最大
          </span>
          <span
            className="bet-keyboard-num"
            onClick={() => setBetAmount(betAmount.substring(0, betAmount.length - 1))}
          >
            <img src={deleteImg} alt=""/>
          </span>
        </div>
      </div>
      <div className="cart-bet-accept">
        <div className={
          mergeClass({
            "accept-selected": allOdds
          })
        }>
          <Switch
            onChange={() => changeOddsAccept(OddsAccept.ALL)}
            checked={allOdds}
          />
          <M id="bet.accept_all"/>
        </div>
        <div className={
          mergeClass({
            "accept-selected": highOdds
          })
        }>
          <Switch
            onChange={() => changeOddsAccept(OddsAccept.BETTER)}
            checked={highOdds}
          />
          <M id="bet.accept_better"/>
        </div>
      </div>
    </>
  );
}

export default observer(CartBetArea);