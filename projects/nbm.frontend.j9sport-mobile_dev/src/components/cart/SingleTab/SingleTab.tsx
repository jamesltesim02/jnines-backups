import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import { Toast } from "antd-mobile";
import { useIntl } from "react-intl";
import { useApi } from "../../../apis";
import Bet from "../../../apis/Bet";
import member from "../../../stores/member";
import SingleBetStore from "../../../stores/cart/SingleBet";
import CartStore from "../../../stores/cart/Cart";

import CartItem from "../CartItem";
import CartBetArea from "../CartBetArea";
import CartResult from "../CartResult";
import { collectOrder } from '../../../utils/collect';

function SingleTab() {

  const intl = useIntl()

  const [bet] = useApi([Bet])

  const {minBet, maxBet, odds} = SingleBetStore.current

  // 投注中
  const [betting, setBetting] = useState(false)

  const [ticketInfo, setTicketInfo] = useState<any>({})

  const {matchInfo} = SingleBetStore.current

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
  const doSingleBet = (betAmount: number, accept: number) => {

    setBetting(true)

    if (betAmount > member.balance) {
      setBetting(false)
      Toast.fail(intl.formatMessage({id: 'toast.balance_less'}))
      return;
    }

    if (betting) {
      return;
    }

    const {
      matchInfo: match,
      market,
      ...option
    } = SingleBetStore.current;

    bet.doBet({
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
          odds: option.odds
        }]
      }]
    }).then((res: any) => {
      if (res) {
        const { ticketId } = res[0]
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
      }
    }).finally(() => {
      setBetting(false)
      member.reload()
    })
  }

  if (!CartStore.showSidebar) {
    return null;
  }

  // 能否串投
  const hasAddToCombo = matchInfo.comboState === 3 || (matchInfo.isLive && matchInfo.comboState === 2)

  return (
    <div>
      <div style={
        ticketInfo.status !== undefined ?
          {visibility: 'hidden'} : {}
      }>
        <CartItem
          itemInfo={SingleBetStore.current}
          rightType={hasAddToCombo ? "add" : undefined}
        />
        <CartBetArea
          betting={betting}
          doBet={doSingleBet}
          minBet={minBet}
          maxBet={maxBet}
          odds={odds}
        />
      </div>
      <CartResult ticketInfo={ticketInfo}/>
    </div>
  );
}

export default observer(SingleTab);