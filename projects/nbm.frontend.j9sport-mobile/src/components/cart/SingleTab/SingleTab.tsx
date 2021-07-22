import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import { Toast } from "antd-mobile";
import { useIntl } from "react-intl";
import { useApi } from "../../../apis";
import Quote from "../../../apis/Quote";
import Bet from "../../../apis/Bet";
import memberStore from "../../../stores/member";
import SingleBetStore from "../../../stores/cart/SingleBet";
import CartStore from "../../../stores/cart/Cart";

import CartItem from "../CartItem";
import CartBetArea from "../CartBetArea";
import CartResult from "../CartResult";
import { collectOrder } from '../../../utils/collect';
import User, { BalanceTarget } from "../../../apis/User";

function SingleTab() {
  const intl = useIntl()
  const [bet, quote, user] = useApi([Bet, Quote, User])

  const [betting, setBetting] = useState(false)
  const [ticketInfo, setTicketInfo] = useState<any>({})
  const [betAreaMsg, setBetAreaMsg] = useState('')
  const {
    matchInfo,
    minBet,
    maxBet,
    odds,
    optionId,
    market,
    baseBetBar,
    betBar
  } = SingleBetStore.current

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {

    if (SingleBetStore.record.length === 0) {
      return
    }

    const current = SingleBetStore.current
    const record = SingleBetStore.record[0]

    if (record.betTime === current.betTime) {
      setTicketInfo(record)
    } else {
      setTicketInfo({})
    }
  }, [SingleBetStore.record])

  // 投注
  const doSingleBet = async (betAmount: number, accept: number) => {
    const {
      matchInfo: match,
      market,
    } = SingleBetStore.current;

    if (betting || !CartStore.showSidebar) {
      return;
    }
    setBetting(true)

    if (betAmount > memberStore.balance) {
      setBetting(false)
      Toast.fail(intl.formatMessage({id: 'toast.balance_less'}))
      return;
    }

    try {
      // 点水
      const {balance, options: [option]} = await quote.doQuote({
        options: [{optionId}],
        isBet: true
      })

      if (option.status !== 1) {
        Toast.info(intl.formatMessage({id: 'bet.unavailable'}))
        setBetting(false)
        return;
      }
      // 单式点水数据加入store
      SingleBetStore.addSingleBet({
        ...SingleBetStore.current,
        ...option
      })

      if (baseBetBar !== option.betBar && betAreaMsg === '') {
        setBetAreaMsg('（盘口有变化，再次点击投注）')
        setBetting(false)
        return;
      }

      // 本地余额不足,查体育钱包余额
      if (betAmount > balance) {
        const {targetBalance} = await user.userBalance({target: BalanceTarget.SABA_API})
        if ( betAmount > targetBalance) {
          Toast.fail(intl.formatMessage({id: 'toast.balance_less'}))
          setBetting(false)
          return;
        }
      }

      // 投注
      const res = await bet.doBet({
        accept: accept,
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
            optionId: option.optionId,
            odds: option.odds,
            betBar: option.betBar
          }]
        }]
      })
      const {ticketId} = res[0]
      const betTime = Date.now()

      // 直接减去余额
      memberStore.balance = memberStore.balance - betAmount
      // 加入记录中
      SingleBetStore.addToRecord({
        ticketId,
        betTime,
        betAmount: res[0].bets[0].betAmount,
        options: {...SingleBetStore.current}
      })
      SingleBetStore.addSingleBet({
        betTime,
        ...SingleBetStore.current
      })

      // 上报投注数据
      collectOrder(
        intl,
        ticketId,
        [{
          match,
          market,
          option
        }],
        betAmount
      );
    } finally {
      setBetting(false)
    }
  }

  // 能否串投
  const hasAddToCombo = (market.marketGroup !== 2 && matchInfo.comboState === 3) || (matchInfo.isLive && matchInfo.comboState === 2)

  return (
    <div>
      <div style={
        ticketInfo.status !== undefined ?
          {display: 'none'} : {}
      }>
        <CartItem
          className="in-cart"
          itemInfo={SingleBetStore.current}
          rightType={hasAddToCombo ? "add" : undefined}
        />
        <CartBetArea
          betting={betting}
          doBet={doSingleBet}
          minBet={minBet}
          maxBet={maxBet}
          odds={odds}
          message={betAreaMsg}
        />
      </div>
      <CartResult ticketInfo={ticketInfo}/>
    </div>
  );
}

export default observer(SingleTab);