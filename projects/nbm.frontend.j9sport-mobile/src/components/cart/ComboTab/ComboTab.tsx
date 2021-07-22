import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import { Toast, Icon } from "antd-mobile";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useApi } from "../../../apis";
import Quote from "../../../apis/Quote";
import Bet from "../../../apis/Bet";

import ComboBetStore from "../../../stores/cart/ComboBet";
import memberStore from "../../../stores/member";
import CartStore from "../../../stores/cart/Cart";

import CartBetArea from "../CartBetArea";
import CartItem from "../CartItem";
import CartResult from "../CartResult";
import mergeClass from "../../../utils/mergeClass";
import M from '../../common/m'
import { useIntl } from "react-intl";
import { collectOrder } from '../../../utils/collect';
import User, { BalanceTarget } from "../../../apis/User";

function ComboTab() {
  const intl = useIntl()
  const [quote, bet, user] = useApi([Quote, Bet, User])
  const [betting, setBetting] = useState(false)
  // 错误信息
  const [betAreaMsg, setBetAreaMsg] = useState('')
  const {options} = ComboBetStore.current
  // 总赔率
  const totalOdds = options.reduce((acc, cur) => acc * cur.odds, 1)

  // 串关点水
  const comboQuote = async (isBet?: boolean) => {
    try {
      const {
        options,
        extras,
        balance
      } = await quote.comboQuote({
        options: ComboBetStore.current.options.map(({optionId}) => ({optionId})),
        isBet
      })
      // 将点水结果加入store
      ComboBetStore.quoteComboBet(options, extras)
      // 遍历更新对应串关market
      options.forEach((optionsItem: any) => {
        const comboBet = ComboBetStore.current.options.find(v => v.optionId === optionsItem.optionId)
        if (comboBet && optionsItem.errorCode === 0) {
          if (!comboBet.market.updateByQuote) {
            return;
          }
          // 当前为串关,赔率放入comboOdds
          comboBet.market.updateByQuote({
            ...optionsItem,
            comboOdds: optionsItem.odds,
            odds: null
          })
          // 将比分和marketGroup传给match
          comboBet.matchInfo.setScoreByQuote(optionsItem.matchScore, comboBet.market.marketGroup)
        }
      })
      // 投注的时候返回余额
      if (isBet) {
        return balance
      }
    } catch (e) {
    }
  }

  // 串关投注
  const doComboBet = async (betAmount: number, accept: number) => {

    // 余额不足
    if (betAmount > memberStore.balance) {
      Toast.fail(intl.formatMessage({id: 'toast.balance_less'}))
      return;
    }
    // 错误项
    const errItem = options.find(val => val.market.combo > options.length || val.errMsg !== '' || val.status === -1)
    // 不满足条件
    if (errItem) {
      Toast.fail(intl.formatMessage({id: 'toast.unable'}))
      return;
    }
    try {
      setBetting(true)
      // 投注前点水
      const balance = await comboQuote(true)
      if (betAmount > balance) {
        const {targetBalance} = await user.userBalance({target: BalanceTarget.SABA_API})
        if ( betAmount > targetBalance) {
          Toast.fail(intl.formatMessage({id: 'toast.balance_less'}))
          setBetting(false)
          return;
        }
      }
      // 盘口变化项
      const betBarChanges = options.find(option => (option.betBar !== option.baseBetBar))
      if (betBarChanges && betAreaMsg === '') {
        setBetAreaMsg('（盘口有变化，再次点击投注）')
        return;
      }
      // 所有串关
      const optionsList = ComboBetStore.current.options.map(({optionId, odds, betBar}) => ({optionId, odds, betBar}))
      const res = await bet.doBet({
        accept,
        betItems: [
          {
            betType: 2,
            bets: [
              {
                betM: 1,
                betN: ComboBetStore.current.options.length,
                betCount: 1,
                betAmount: betAmount
              }
            ],
            options: optionsList
          }
        ]
      })
      const {ticketId} = res[0]
      // 直接减去余额
      memberStore.balance = memberStore.balance - betAmount

      // 上报投注数据
      collectOrder(
        intl,
        ticketId,
        options.map(
          ({matchInfo: match, market, ...option}) => ({match, market, option})
        ),
        betAmount
      );

      // 更新ticketId到串关store
      ComboBetStore.current = {
        ticketId,
        betAmount,
        options,
        betTime: Date.now(),
        status: undefined,
      }
    } finally {
      setBetting(false)
    }
  }

  // 移除串关注单
  const removeComboQueue = (ev: React.MouseEvent, index: number) => {
    ev.stopPropagation()
    ComboBetStore.removeComboQueue(index)
    if (ComboBetStore.comboQueue.length === 0) {
      CartStore.toggleSidebar()
    }
  }

  const quoteMsg = (length: number, option: any) => {
    if (option.status === -1 || option.status === 0) {
      return '盘口已关闭'
    }
    const {combo} = option.market
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
    if (
      !errItem
      &&
      ComboBetStore.current.status === undefined
      &&
      CartStore.showSidebar
    ) {
      comboQuote()
    }
  }, [ComboBetStore.current.options.length])

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
                    <M id="sports.1"/>
                    : '失败注单'
                }
                <div
                  onClick={event => removeComboQueue(event, index)}
                  className="combo-tab-cross"
                >
                  <Icon
                    type="cross"
                    size="xxs"
                    color="var(--app-background-color)"
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
                  className="in-cart"
                  itemInfo={item}
                  rightType={options.length !== 1 ? "close" : undefined}
                  quoteMsg={quoteMsg(options.length, item)}
                />
              </CSSTransition>
            ))
          }
        </TransitionGroup>

        <div className="combo-bet-area">
          <div className="combo-info">
          <span>
            {
              options.length === 2 ?
                <M id="bet.double"/> :
                options.length === 3 ?
                  <M id="bet.treble"/> :
                  <M
                    id="bet.combo_var"
                    values={{var: options.length}}
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
            message={betAreaMsg}
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