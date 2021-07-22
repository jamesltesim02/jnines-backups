import React, {useState} from "react";
import {withApi} from "../../../../apis";
import {observer} from "mobx-react";
import {QK_QUOTA} from "../../../../consts/app";
import SingleBetStore from "../../../../stores/cart/SingleBet";
import app from "../../../../stores/app";

import AmountInput from "../../../cart/AmountInput";
import M from "../../../common/m";
import mergeClass from "../../../../utils/mergeClass";
import Bet from "../../../../apis/Bet";
import member from "../../../../stores/member";
import { collectOrder } from "../../../../utils/collect";
import { useIntl } from "react-intl";

function FullQuickBet(
  {
    positionInfo,
    api: {bet}
  }: {
    positionInfo: any
    api: { bet: Bet }
  }
) {
  const intl = useIntl();

  // 投注金额
  const [betAmount, setBetAmount] = useState(0)
  // 返回金额 （投注额 * 赔率）
  const [returnAmount, setReturnAmount] = useState('')

  const [betBle, setBetBle] = useState(false)

  const [addAmount, setAddAmount] = useState(0)

  const {
    singleBet,
    singleBet: {
      matchInfo,
      market,
    }
  } = SingleBetStore

  function doSingleBet() {
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
          optionId: singleBet.optionId,
          odds: singleBet.odds,
          betBar: market.betBar
        }]
      }]
    }).then(res => {
      if (res) {
        const {ticketId} = res[0]
        // 直接减去余额
        member.balance = member.balance - betAmount;
        SingleBetStore.addToQueue = {
          ticketId,
          returnAmount,
          betAmount
        };
        // 上报投注数据
        collectOrder(
          intl,
          ticketId,
          [{
            match: matchInfo,
            market,
            option: singleBet
          }],
          betAmount
        );
        SingleBetStore.updateFullbetVersion();
      }
    })
  }

  return (
    <div
      className={
        mergeClass({
          "fullscreen-quickBet": true,
          "top": (window.innerHeight - positionInfo.y) < 200
        })
      }
      style={{ left: `min(0px,calc((${window.innerWidth}px - ${positionInfo.x}px) - 310px))` }}
      onClick={ev => ev.stopPropagation()}
    >
      <div className="bet-area">
        {/*金额*/}
        <AmountInput
          minBet={singleBet.minBet}
          maxBet={singleBet.maxBet}
          addAmount={addAmount}
          onEnter={() => {
            doSingleBet()
          }}
          onChange={(amount: number, betBle: boolean) => {
            setBetBle(betBle)
            setBetAmount(amount)
            setReturnAmount((amount * singleBet.odds).toFixed(2))
          }}
        />
        {/*投注按钮*/}
        <div
          // disabled={!betBle}
          className={
            mergeClass({
              "betBtn": true,
              "disable": !betBle
            })
          }
          onClick={() => {
            betBle
            &&
            doSingleBet()
          }}
        >
          <M id="bet.submit_bet"/>
        </div>
      </div>
      <div className="quick-quota">
        {
          QK_QUOTA.map(val => (
            <span
              className="quick-quota-item"
              key={val}
              onClick={() => {
                setAddAmount(betAmount + val)
              }}
            >
                {`+${val}`}
              </span>
          ))
        }
        <span
          className="quick-quota-item"
          onClick={() => {
            if (singleBet.maxBet < member.balance){
              setAddAmount(singleBet.maxBet)
            }else {
              setAddAmount(member.balance)
            }
          }}
        >
          最大
        </span>
      </div>
      <div className="return-amount">
        <M id="bet.will_return"/>
        <span>
						<M
              id="bet.amount"
              values={{amount: returnAmount}}
            />
					</span>
      </div>
    </div>
  )
}

export default withApi({bet: Bet})(observer(FullQuickBet));