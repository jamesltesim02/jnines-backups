import React, {useEffect, useState} from "react";
import {LoadingOutlined, CheckCircleOutlined, InfoCircleOutlined} from '@ant-design/icons';

import {TICKET_STATUS} from "../../../consts/app";
import mergeClass from "../../../utils/mergeClass";
import app from "../../../stores/app";

import M from '../../common/m';
import {useIntl} from "react-intl";

function AmountInput(
  {
    onChange,
    minBet = 0,
    maxBet = 1000000,
    onEnter,
    betAmount,
    status,
    wait = false,
    msg,
    addAmount,
    tips = ''
  }: {
    onChange?: Function,
    minBet?: number,
    maxBet?: number
    onEnter?: Function,
    betAmount?: number,
    status?: number,
    wait?: boolean,
    msg?: string,
    addAmount?: number,
    tips?: string
  }
) {
  const intl = useIntl();
  // 限额，点水回来之后的限额，用户余额的最大值
  const [amount, setAmount] = useState(app.acceptAmount)

  // 当前是否可投
  const [betBle, setBetBle] = useState(false)

  useEffect(
    () => {
      const betValid = () => {
        // 用户限额
        if (amount > maxBet || amount < minBet) {
          setBetBle(false)
        } else {
          setBetBle(true)
        }
      };
      onChange && onChange(amount, betBle);
      betValid();
    },
    [amount, betBle, onChange, maxBet, minBet]
  );

  useEffect(() => {
    if (addAmount && addAmount !== 0) {
      setAmount(addAmount)
    }
  }, [addAmount])

  useEffect(() => {
    if (maxBet === 0) {
      const inputEl = document.getElementById('_amount_input')
      if (inputEl) {
        inputEl.setAttribute('placeholder','该项已达上限')
      }
    }
  },[maxBet])

  return (
    <div
      className={mergeClass('bet-amount', !betBle ? "unbetble" : '')}
    >
      {
        wait
          ?
          // 受理中
          <div
            className={mergeClass(
              "loading-input",
              status === TICKET_STATUS.SUCCESS ?
                'success'
                : status === TICKET_STATUS.FAILED ?
                'failed'
                : 'loading'
            )}
          >
            {
              status === TICKET_STATUS.SUCCESS ?
                <CheckCircleOutlined/>
                : status === TICKET_STATUS.FAILED ?
                <InfoCircleOutlined/>
                : <LoadingOutlined spin/>
            }
            {
              (
                status === TICKET_STATUS.SUCCESS
                ||
                status === TICKET_STATUS.FAILED
              ) ? msg : (<M id="bet.betting"/>)
            }
          </div>
          : null
      }
      {/*减少按钮 */}
      <span
        className="increase"
        onClick={() => {
          if(maxBet !== 0) {
            amount > 0
            &&
            setAmount(amount - 1)
          }
        }}
      />
      {/*限额,不得大于余额*/}
      {
        betAmount
        ? <input type="text" defaultValue={betAmount}/>
        : <>
          {
            amount !== 0 ?
            <div className='maxbet-tips'>{tips}</div>
            : null
          }
          <input
            id="_amount_input"
            type="number"
            disabled={maxBet === 0}
            placeholder={
              intl.formatMessage(
                {id: 'bet.amount_limit'},
                {
                  min: String(minBet),
                  max: String(maxBet)
                }
              )
            }
            value={amount || ''}
            onChange={ev => {
              console.log(maxBet)
              if (Number(ev.target.value) > maxBet) {
                setAmount(maxBet)
              }else {
                setAmount(Number(ev.target.value.replace(/^(0+)|[^\d]+/g, '')))
              }
            }}
            onKeyDown={ev => {
              if (ev.key === 'Enter') {
                if (betBle) {
                  onEnter && onEnter()
                }
              }
            }}
          />
        </>
      }
      {/*增加按钮*/}
      <span
        className="decrease"
        onClick={() => {
          if (maxBet !== 0) {
            if (amount < maxBet) {
              setAmount(amount + 1)
            }
          }
        }}
      />
    </div>
  )
}

export default AmountInput;