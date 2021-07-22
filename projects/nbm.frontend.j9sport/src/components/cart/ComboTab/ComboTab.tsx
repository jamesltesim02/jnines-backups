import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { message, Statistic, Spin } from "antd";
import { useIntl } from "react-intl";
import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import mergeClass from "../../../utils/mergeClass";
import { collectOrder } from "../../../utils/collect";
import { TICKET_REMOVE_TIME, TICKET_STATUS } from "../../../consts/app";
import { BalanceTarget } from "../../../apis/User";

import Bet from "../../../apis/Bet";
import Quote from "../../../apis/Quote";
import User from "../../../apis/User";
import { withApi } from "../../../apis";
import memberStore from "../../../stores/member";
import app from "../../../stores/app";
import ComboBetStore from "../../../stores/cart/ComboBet";
import CartStore, { TAB_INDEX } from "../../../stores/cart/Cart";

import M from '../../common/m';
import ComboTabItem from "./ComboTabItem";
import AmountInput from "../AmountInput";
import CartAccept from "../CartAccept";
import CartEmpty from "../CartEmpty";

const {Countdown} = Statistic;

function ComboTab(
  {
    api: {bet, quote, user},
  }: {
    api: { bet: Bet, quote: Quote, user: User }
  }
) {
  const intl = useIntl();
  // 串关投注金额
  const [betAmount, setBetAmount] = useState(0)
  // 接受的赔率模式
  const [accept, setAccept] = useState(app.oddsAccept)
  // 当前是否可投注
  const [betBle, setBetBle] = useState(false)
  // 当前投注
  const [betting, setBetting] = useState(false)
  // 投注按钮提示
  const [toolTipVisible, setToolTipVisible] = useState(false)
  // 点水状态
  const [quoting, setQuoting] = useState(false)

  const comboQuote = async (isBet?: boolean) => {
    try {
      setQuoting(true)
      // 查询参数
      const comboQuoteParams = ComboBetStore.comboBet.map(v => ({optionId: v.optionId}))
      const {balance, options, extras} = await quote.comboQuote({options: comboQuoteParams,isBet})
      // 将点水结果加入store
      ComboBetStore.quoteComboBet(options, extras)
      // 遍历更新对应串关market
      options.forEach((optionsItem: any) => {
        const comboBet = ComboBetStore.comboBet.find(v => v.optionId === optionsItem.optionId)
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
    } finally {
      setQuoting(false)
    }
  }

  // 投注
  const doComboBet = async () => {
    // 投注金额
    if (betAmount === 0) {
      message.warning(
        intl.formatMessage({id: 'bet.amount_required'})
      );
      return;
    }
    // 余额不足
    if (betAmount > memberStore.balance) {
      setBetting(false)
      // TODO 需添加到主语言文件中
      message.warning('用户余额不足！')
      return;
    }

    try {
      // 串关点水
      const balance = await comboQuote(true)
      if (betAmount > balance) {
        const {targetBalance} = await user.userBalance({target: BalanceTarget.SABA_API})
        if ( betAmount > targetBalance) {
          message.warn(intl.formatMessage({id: '用户余额不足！'}))
          setBetting(false)
          return;
        }
      }
      // 有变盘，用户选不接受所有盘口赔率变化，提示他
      if (
        ComboBetStore.betBarStatus
        &&
        !toolTipVisible
      ) {
        setToolTipVisible(true)
        setBetting(false)
        return;
      }
      const optionsList = comboBet.map(({optionId, odds, betBar}) => ({optionId, odds, betBar}))
      // 串关投注
      if (betting || !ComboBetStore.canDoComboBet) {
        return;
      }
      setBetting(true)
      const betRes = await bet.doBet({
        accept,
        betItems: [
          {
            betType: 2,
            bets: [
              {
                betM: 1,
                betN: comboBet.length,
                betCount: 1,
                betAmount: betAmount
              }
            ],
            options: optionsList
          }
        ]
      })
      if (betRes) {
        const [{ticketId}] = betRes
        // 直接减去余额
        memberStore.balance = memberStore.balance - betAmount;

        // 上报投注数据
        collectOrder(
          intl,
          ticketId,
          comboBet.map(
            ({matchInfo: match, market, ...option}) => ({match, market, option})
          ),
          betAmount
        );
        // 投注成功后添加到队列
        ComboBetStore.addToComboQueue({
          ticketId,
          betAmount,
          options: comboBet,
          status: undefined,
          errMsg: intl.formatMessage({id: 'bet.betting'}),
          removeTime: 0,
          addTime: Date.now()
        })
      }
    } finally {
      setToolTipVisible(false)
      setBetting(false)
    }
  }

  // 失败后重新投注
  function overwriteCombo(ticketId: string) {
    // 失败注单
    const failedTicket = ComboBetStore.comboQueue.find(v => v.ticketId === ticketId)
    if (failedTicket) {
      // 备份购物车订单
      ComboBetStore.comboBetBak = [...ComboBetStore.comboBet]
      // 失败订单加入购物车
      ComboBetStore.comboBet = [...failedTicket.options]
      // 删除失败订单
      ComboBetStore.removeComboQueue(ticketId)
    }
  }

  useEffect(() => {
    if (
      CartStore.currentTab === TAB_INDEX.COMBO
      &&
      ComboBetStore.comboBet.length > 1
    ) {
      comboQuote()
    }
  }, [CartStore.currentTab, ComboBetStore.comboBet.length])

  // 当前购物车里的串关列表
  const {comboBet} = ComboBetStore
  // 串关总赔率
  const totalOdds = comboBet.reduce((acc, cur) => acc * cur.odds, 1).toFixed(2)

  return (
    <>
      {
        comboBet.length > 0 ?
          <div className="comboTab-container">
            <div
              className="clear-combo"
              onClick={() => {
                ComboBetStore.clearComboBet()
              }}
            >
              {/* TODO 需要添加到主语言文件中 */}
              全部清除
            </div>
            <div className="comboTab">
              <div>
                {
                  comboBet.map(item => (
                      <ComboTabItem
                        option={item}
                        matchInfo={item.matchInfo}
                        market={item.market}
                        key={item.optionId}
                      />
                    )
                  )
                }
                {/* 点水加载遮盖 */}
                {
                  quoting
                  &&
                  <div className="quoting-mask">
                    <Spin/>
                  </div>
                }
              </div>
              <div className="comboTab-betArea">
								<span>
									<M
                    id="bet.combo_var"
                    values={{var: comboBet.length}}
                  />
								</span>
                <div>
                  <AmountInput
                    minBet={comboBet[0].minBet || 2}
                    maxBet={comboBet[0].maxBet || 10000}
                    onChange={(amount: number, betBle: boolean) => {
                      setBetBle(betBle)
                      setBetAmount(amount)
                    }}
                    onEnter={() => doComboBet()}
                  />
                  <div>
                    <span style={{color: '#ff0000'}}>* </span>
                    <M id="bet.limit"/>
                    <M
                      id="bet.amount"
                      values={{amount: comboBet[0].maxBet || 10000}}
                    />
                    {memberStore.currencyMark}
                  </div>
                </div>
              </div>
            </div>
            <CartAccept
              onChange={(val: number) => {
                setAccept(val)
              }}
            />
            {/*预计总返还金额&赔率 */}
            <div className="comboTab-return">
              <div>
                <M id="bet.total_odds"/>
                <span>{totalOdds}</span>
              </div>
              <div>
                <M id="bet.will_return"/>
                <span>
									<M
                    id="bet.amount"
                    values={{amount: (betAmount * Number(totalOdds)).toFixed(2)}}
                  />
                  {memberStore.currencyMark}
								</span>
              </div>
            </div>
            {
              toolTipVisible
              &&
              // TODO
              <div className="betBar-change-tooltip">(盘口有变化，请确认后再次点击投注)</div>
            }
            <button
              disabled={!(ComboBetStore.canDoComboBet && betBle && !quoting)}
              className="combo-bet-btn"
              onClick={doComboBet}
            >
              {
                betting ?
                  <LoadingOutlined/> :
                  <>
                    <M id="bet.bet_label"/>
                    <M
                      id="bet.amount"
                      values={{amount: betAmount + memberStore.currencyMark}}
                    />
                  </>
              }
            </button>
            <div className="bet-tips">
              <M id="bet.odds_tips" />
            </div>
          </div>
          :
          // 暂无数据
          <CartEmpty/>
      }
      {/*串投等待区*/}
      {
        ComboBetStore.comboQueue.length > 0
        &&
        <div style={{paddingTop: 10, borderTop: "1px solid var(--app-background-color)"}}>
          {
            ComboBetStore.comboQueue.map((iTicket, index) => {
              // 总赔率
              const totalOdds = iTicket.options.reduce((acc, cur) => (acc * cur?.odds), 1)
              return (
                <div
                  className={
                    mergeClass(
                      'comboTab-queue',
                      iTicket.status === TICKET_STATUS.SUCCESS && "success",
                      iTicket.status === TICKET_STATUS.FAILED && "failed"
                    )
                  }
                  key={index}
                >
                  {
                    iTicket.options.map(item => (
                      <ComboTabItem
                        wait={true}
                        option={item}
                        matchInfo={item.matchInfo}
                        market={item.market}
                        key={item.optionId}
                      />
                    ))
                  }
                  <div className="queue-info">
                    <div>
                      @{totalOdds.toFixed(2)}
                    </div>
                    <div>
                      <M id="bet.bet_label"/>
                      <span>
												<M
                          id="bet.amount"
                          values={{amount: betAmount.toFixed(2)}}
                        />
											</span>
                      <br/>
                      <M id="bet.will_return"/>
                      <span>
												<M
                          id="bet.amount"
                          values={{amount: (betAmount * totalOdds).toFixed(2)}}
                        />
											</span>
                    </div>
                  </div>
                  {/*投注加载*/}
                  <div
                    className={
                      mergeClass(
                        'loading',
                        iTicket.status === TICKET_STATUS.SUCCESS && "success",
                        iTicket.status === TICKET_STATUS.FAILED && "failed"
                      )
                    }
                    onClick={() => {
                      // 失败后重新投注
                      if (iTicket.status === TICKET_STATUS.FAILED) {
                        overwriteCombo(iTicket.ticketId)
                      }
                    }}
                  >
                    {
                      iTicket.status === TICKET_STATUS.SUCCESS
                        ? (<CheckCircleOutlined/>)
                        : (
                          iTicket.status === TICKET_STATUS.FAILED
                            ? (<InfoCircleOutlined/>)
                            : (<LoadingOutlined/>)
                        )
                    }
                    {iTicket.errMsg}
                  </div>
                  <div
                    className="close"
                    onClick={() => {
                      ComboBetStore.removeComboQueue(iTicket.ticketId)
                    }}
                  >
                    {
                      iTicket.status !== undefined ?
                        <>
                          {
                            iTicket.status !== TICKET_STATUS.FAILED ?
                              <>
                                <Countdown
                                  format={'s'}
                                  value={iTicket.removeTime + (TICKET_REMOVE_TIME + 1000)}
                                />S
                              </> : null
                          }
                          <M id={'common.close'}/>
                        </> : null
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      }
    </>
  )
}

export default withApi(
  {
    bet: Bet,
    quote: Quote,
    user: User
  }
)(observer(ComboTab));