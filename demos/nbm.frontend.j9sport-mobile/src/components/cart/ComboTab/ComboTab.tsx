import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import { Toast, Icon } from "antd-mobile";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useApi } from "../../../apis";
import Quote from "../../../apis/Quote";
import Bet from "../../../apis/Bet";

import ComboBetStore from "../../../stores/cart/ComboBet";
import member from "../../../stores/member";
import CartStore from "../../../stores/cart/Cart";

import CartBetArea from "../CartBetArea";
import CartItem from "../CartItem";
import CartResult from "../CartResult";
import mergeClass from "../../../utils/mergeClass";
import M from '../../common/m'
import { useIntl } from "react-intl";

function ComboTab() {
  const intl = useIntl()
  const [quote, bet] = useApi([Quote, Bet])
  const [betting, setBetting] = useState(false)

  // 当前串关tab数据
  const {options} = ComboBetStore.current
  // 总赔率
  const totalOdds = options.reduce((acc, cur) => acc * cur.odds, 1)
  // 所有串关
  const optionsList = options.map(({optionId, odds}) => ({optionId, odds}))

  // 串关投注
  const doComboBet = (betAmount: number, accept: number) => {
    setBetting(true)

    const errItem = options.find(val => val.market.combo > options.length || val.errMsg !== '')
    // 余额不足
    if (betAmount > member.balance) {
      setBetting(false)
      Toast.fail(intl.formatMessage({id: 'toast.balance_less'}))
      return;
    }
    // 不满足条件
    if (errItem) {
      setBetting(false)
      Toast.fail(intl.formatMessage({id: 'toast.unable'}))
      return;
    }

    if (betting) {
      return;
    }

    bet.doBet({
      accept,
      betItems: [
        {
          betType: 2,
          bets: [
            {
              betM: 1,
              betN: options.length,
              betCount: 1,
              betAmount: betAmount
            }
          ],
          options: optionsList
        }
      ]
    }).then((res: any) => {
      const {ticketId} = res[0]
      // 直接减去余额
      member.balance = member.balance - betAmount
      // 更新ticketId到串关store
      ComboBetStore.current = {
        ticketId,
        betAmount,
        options,
        betTime: Date.now(),
        status: undefined,
      }
    }).finally(() => {
      member.reload()
      setBetting(false)
    })
  }

  // 串关点水
  const comboQuote = () => {
    quote.comboQuote(
      // params
      options.map(
        ({optionId}) => ({optionId})
      )
    ).then(({options, extras}: any) => {
        // 将点水结果加入store
        ComboBetStore.quoteComboBet(options, extras)
      }
    )
  }
  // 移除串关注单
  const removeComboQueue = (ev: React.MouseEvent, index: number) => {
    ev.stopPropagation()
    ComboBetStore.removeComboQueue(index)
    if (ComboBetStore.comboQueue.length === 0) {
      CartStore.toggleSidebar()
    }
  }

  const quoteMsg = (length: number, combo: number) => {
    if (length < combo) {
      if (combo === 2) {
        return <M id="bet.double_required"/>
      }
      if (combo === 3) {
        return <M id="bet.treble_required"/>
      }
      return <M id="bet.combo_required" values={{count: combo}}/>
    } else {
      return undefined
    }
  }
  /* eslint-disable react-hooks/exhaustive-deps */
  // 串关点水，不满足条件不点水
  useEffect(() => {
    const errItem = options.find(val => val.market.combo > options.length)
    if (!errItem && ComboBetStore.current.status === undefined) {
      comboQuote()
    }
  }, [])

  return (
    <div>
      <div className="combo-tab">
        {
          ComboBetStore.comboQueue.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  mergeClass({
                    "combo-tab-item": true,
                    "combo-tab-item-active": ComboBetStore.comboTabIdx === index
                  })
                }
                onClick={() => ComboBetStore.comboTabIdx = index}
              >
                {
                  item.status === undefined || item.status !== 0 ?
                  <M id="sports.1" />
                  : '失败注单'
                }
                <div
                  onClick={event => removeComboQueue(event, index)}
                  className="combo-tab-cross"
                >
                  <Icon
                    type="cross"
                    size="xxs"
                    color="#1e1e1e"
                  />
                </div>
              </div>
            )
          })
        }
      </div>
      <div style={
        ComboBetStore.current.status !== undefined ?
          {visibility: 'hidden'} : {}
      }>
        <TransitionGroup
          className="combo-list"
        >
          {
            !!ComboBetStore.current
            &&
            options.map((item) => (
              <CSSTransition
                key={item.optionId}
                timeout={300}
                classNames="combo-list-item"
              >
                <CartItem
                  itemInfo={item}
                  rightType={
                    options.length !== 1 ? "close" : undefined
                  }
                  quoteMsg={item.errMsg || quoteMsg(options.length,item.market.combo)}
                />
              </CSSTransition>
            ))
          }
        </TransitionGroup>

        <div
          className="combo-bet-area"
        >
          <div className="combo-info">
          <span>
            {
              options.length === 2 ?
                <M id="bet.double"/> :
                options.length === 3 ?
                  <M id="bet.treble"/> :
                  <M
                    id="bet.combo_var"
                    values={{
                      var: options.length
                    }}
                  />
            }
          </span>
            <span>
            <M id="bet.total_odds"/>
            @{totalOdds.toFixed(2)}
          </span>
          </div>
          <CartBetArea
            doBet={doComboBet}
            betting={betting}
            maxBet={options[0]?.maxBet || 0}
            minBet={options[0]?.minBet || 0}
            odds={totalOdds}
          />
        </div>
      </div>
      <CartResult
        combo={true}
        ticketInfo={ComboBetStore.current}
      />
    </div>
  );
}

export default observer(ComboTab);