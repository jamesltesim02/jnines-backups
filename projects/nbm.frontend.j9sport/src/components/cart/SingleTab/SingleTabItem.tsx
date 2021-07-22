import React, { useEffect, useState } from "react";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { withApi } from "../../../apis";
import { observer } from "mobx-react";
import { message } from "antd";

import Bet from "../../../apis/Bet";
import Quote from "../../../apis/Quote";
import User from "../../../apis/User";
import SingleBetStore from "../../../stores/cart/SingleBet";
import ComboBetStore from "../../../stores/cart/ComboBet";
import mergeClass from "../../../utils/mergeClass";
import { MatchState } from "../../../consts/match";
import memberStore from "../../../stores/member";
import { useIntl } from "react-intl";
import { collectOrder } from "../../../utils/collect";
import { BalanceTarget } from "../../../apis/User";

import CartOptionName from "../CartOptionName";
import MarketName from "../../matchs/MarketName";
import AmountInput from "../AmountInput";
import Switch from "../../common/Switch";
import M from "../../common/m"

function SingleTabItem(
  {
    api: {bet, quote, user},
    accept,
  }: {
    api: { bet: Bet, quote: Quote, user: User }
    accept?: number
  }
) {
  const intl = useIntl();
  // 投注金额
  const [betAmount, setBetAmount] = useState(0)
  // 返回金额 （投注额 * 赔率）
  const [returnAmount, setReturnAmount] = useState('')
  // 能否投注
  const [betBle, setBetBle] = useState(false)
  // 串投
  const [joinCombo, setJoinCombo] = useState(false)
  // 投注中
  const [betting, setBetting] = useState(false)
  // 投注按钮提示
  const [toolTipVisible, setToolTipVisible] = useState(false)

  const {
    singleBet,
    singleBet: {
      matchInfo,
      market,
      optionId
    }
  } = SingleBetStore

  // 显示加入串关按钮
  const canAddToCombo = () => {
    // 角球串关
    if (market.marketGroup === 2) {
      return false;
    }
    if (
      market.combo === 0 ||
      matchInfo.comboState === 0 ||
      (matchInfo.isLive && matchInfo.comboState === 1)
    ) {
      return false;
    }
    if (
      matchInfo.comboState === 3 ||
      (matchInfo.isLive && matchInfo.comboState === 2)
    ) {
      return true;
    }
  }
  // 加入串关
  const addToCombo = (val: boolean) => {
    if (!val) {
      ComboBetStore.removeComboBet(singleBet.optionId)
    } else {
      ComboBetStore.addToComboBet({
        ...singleBet
      })
    }
  }

  // 投注
  const doSingleBet = async () => {

    if (betting) {
      return;
    }

    if (betAmount > memberStore.balance) {
      setBetting(false)
      // TODO 
      message.warning('用户余额不足！')
      return;
    }

    try {
      setBetting(true)
      // 单式点水,查询出用户本地余额
      const {options: [option], balance} = await quote.doQuote({
        options: [{optionId}],
        isBet: true
      })
      // 本地余额不足,查体育钱包余额
      if (betAmount > balance) {
        const {targetBalance} = await user.userBalance({target: BalanceTarget.SABA_API})
        if ( betAmount > targetBalance) {
          message.warn(intl.formatMessage({id: '用户余额不足！'}))
          setBetting(false)
          return;
        }
      }
      if (!option || option.status !== 1) {
        message.warning(
          intl.formatMessage({id: 'bet.unavailable'})
        );
        return;
      }
      // 点水数据加入store
      SingleBetStore.singleBet = {
        ...singleBet,
        ...option
      }

      // 有变盘，提示
      if (!toolTipVisible && (!SingleBetStore.betBarStatus || option.betBar !== singleBet.betBar)) {
        setToolTipVisible(true)
        setBetting(false)
        return;
      }

      // 投注
      const betRes = await bet.doBet({
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
            optionId: singleBet.optionId,
            odds: singleBet.odds,
            betBar: market.betBar
          }]
        }]
      })
      if (betRes) {
        const {ticketId} = betRes[0]
        // 直接减去余额
        memberStore.balance = memberStore.balance - betAmount
        SingleBetStore.addToQueue = {
          ticketId,
          returnAmount,
          betAmount,
          addTime: Date.now()
        }
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
        SingleBetStore.removeSingleBet()
      }
    } finally {
      setBetting(false)
    }
  }

  useEffect(() => {
    setToolTipVisible(false)
    const inputEl = document.getElementById('_amount_input')
    if (inputEl) {
      inputEl.focus()
      setJoinCombo(false)
    }
  }, [singleBet.optionId])

  return (
    <div className="singleTab-item">
      {/*注单相关信息*/}
      <div>
        {/*删除按钮*/}
        <CloseOutlined
          className="remove-bet"
          onClick={() => {
            SingleBetStore.removeSingleBet()
          }}
        />
        {/*玩法@赔率*/}
        <div>
          <CartOptionName
            option={singleBet}
            match={matchInfo}
            market={market}
          />
          @
          <div className={mergeClass(
            "bet-odds-change",
            SingleBetStore.oddsStatus
          )}
          >
						<span>
							{singleBet.odds.toFixed(2)}
						</span>
          </div>
        </div>
        {/*玩法*/}
        <div>
          <MarketName
            {...market}
            sportId={matchInfo.sportId}
          />
        </div>
        {/*球队vs球队 滚球比分*/}
        <div>
          {matchInfo.matchName}
          <span style={{color: "#FF4A4A "}}>
						{
              matchInfo.matchState === MatchState.LIVE
              &&
              ` [${singleBet.matchScore !== '' ? singleBet.matchScore : '0:0'}] `
            }
					</span>
        </div>
        {/*球类/联赛名*/}
        <div><M id={`sports.${matchInfo.sportId}`}></M> / {matchInfo.tournamentName}</div>
      </div>
      {/*投注金额区*/}
      <div className="bet-area">
        {/*金额*/}
        <AmountInput
          minBet={singleBet.minBet}
          maxBet={singleBet.maxBet}
          onEnter={doSingleBet}
          onChange={(amount: number, betBle: boolean) => {
            setBetBle(betBle)
            setBetAmount(amount)
            setReturnAmount((amount * singleBet.odds).toFixed(2))
          }}
        />
        {/*投注按钮*/}
        <button
          disabled={!betBle}
          className="betBtn"
          onClick={doSingleBet}
        >
          {
            betting ?
              <LoadingOutlined/> :
              <M id="bet.submit_bet"/>
          }
        </button>
      </div>
      {
        toolTipVisible
        &&
        <div className="betBar-change-tooltip right">(盘口有变化，请确认后再次点击投注)</div>
      }
      {/*是否加入串关*/}
      <div className="add-combo">
        <div style={!canAddToCombo() ? {visibility: 'hidden'} : {}}>
          <Switch
            width={34}
            height={10}
            checked={joinCombo}
            onChange={(check: boolean) => {
              setJoinCombo(check)
              addToCombo(check)
            }}
          />
          <M id="bet.add_to_combo"/>
        </div>
        {/*预计返回的金额*/}
        <div>
          <M id="bet.will_return"/>
          <span className="return-amount">
						<M
              id="bet.amount"
              values={{amount: returnAmount + memberStore.currencyMark}}
            />
					</span>
        </div>
      </div>
    </div>
  )
}

export default withApi({
  bet: Bet,
  quote: Quote,
  user: User
})(observer(SingleTabItem));