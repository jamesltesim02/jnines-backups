import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {message, Statistic} from "antd";
import {useIntl} from "react-intl";
import {CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import mergeClass from "../../../utils/mergeClass";

import {TICKET_REMOVE_TIME, TICKET_STATUS} from "../../../consts/app";
import Bet from "../../../apis/Bet";
import Quote from "../../../apis/Quote";
import {withApi} from "../../../apis";
import member from "../../../stores/member";
import app from "../../../stores/app";
import ComboBetStore from "../../../stores/cart/ComboBet";
import CartStore, {TAB_INDEX} from "../../../stores/cart/Cart";
import MarketStore from "../../../stores/matchs/Market";
import MatchStore from "../../../stores/matchs/Match";

import M from '../../common/m';
import ComboTabItem from "./ComboTabItem";
import AmountInput from "../AmountInput";
import CartAccept from "../CartAccept";
import CartEmpty from "../CartEmpty";

const {Countdown} = Statistic;

function ComboTab(
  {
    api: {bet, quote},
    market,
    matchInfo,
  }: {
    api: { bet: Bet, quote: Quote }
    market: MarketStore
    matchInfo: MatchStore
  }
) {
  const intl = useIntl();

  // 串关投注金额
  const [betAmount, setBetAmount] = useState(0)
  // 接受的赔率模式
  const [accept, setAccept] = useState(app.oddsAccept)
  // 当前是否可投注
  const [betBle, setBetBle] = useState(false)
  // 当前购物车里的串关列表
  const {comboBet} = ComboBetStore
  // 串关总赔率
  const totalOdds = comboBet.reduce((acc, cur) => acc * cur.odds, 1).toFixed(2)
  // options
  const optionsList = comboBet.map(({optionId, odds}) => ({optionId, odds}))
  // 当前投注
  const [betting, setBetting] = useState(false)

  // 投注
  const doComboBet = () => {

    setBetting(true)

    // 投注金额
    if (betAmount === 0) {
      message.warning(
        intl.formatMessage({id: 'bet.amount_required'})
      );
      return;
    }
    // 余额不足
    if (betAmount > member.balance) {
      setBetting(false)
      message.warning('用户余额不足！')
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
              betN: comboBet.length,
              betCount: 1,
              betAmount: betAmount
            }
          ],
          options: optionsList
        }
      ]
    }).then((res) => {
      const {ticketId} = res[0]
      // 直接减去余额
      member.balance = member.balance - betAmount
      ComboBetStore.addToComboQueue({
        ticketId,
        betAmount,
        options: comboBet,
        status: undefined,
        errMsg: intl.formatMessage({id: 'bet.betting'}),
        removeTime: 0
      })
    }).finally(() => {
      setBetting(false)
    })
  }
  // 失败后重新投注
  function overwriteCombo (ticketId: string) {

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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (
      CartStore.currentTab === TAB_INDEX.COMBO
      &&
      ComboBetStore.comboBet.length > 0
    ) {
      quote.comboQuote(
        // params
        ComboBetStore.comboBet.map(v => ({optionId: v.optionId}))
      ).then(({options, extras}) => {
        // 点水回来判断errorCode,为0更新到market和match
        ComboBetStore.quoteComboBet(options, extras)

        if (options.errorCode === 0) {
          // 将点水结果加入store
          options.forEach((optionsItem: any) => {
            // 当前为串关,赔率放入comboOdds
            market.updateByQuote({
              ...optionsItem,
              comboOdds: optionsItem.odds,
              odds: null
            })
            // 将比分和marketGroup传给match
            matchInfo.setScoreByQuote(optionsItem.matchScore, market.marketGroup)
          })
        }
      })
    }
  }, [CartStore.currentTab,ComboBetStore.comboBet])

  return (
    <>
      {
        comboBet.length > 0
          ?
          <div className="comboTab-container">
            <div
              className="clear-combo"
              onClick={() => {
                ComboBetStore.clearComboBet()
              }}
            >
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
								</span>
              </div>
            </div>
            <button
              disabled={!(ComboBetStore.canDoComboBet() && betBle)}
              className="combo-bet-btn"
              onClick={() => doComboBet()}
            >
              {
                betting ?
                  <LoadingOutlined/> :
                  <>
                    <M id="bet.bet_label"/>
                    <M
                      id="bet.amount"
                      values={{amount: betAmount}}
                    />
                  </>
              }
            </button>
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
              const totalOdds = iTicket.options.reduce((acc, cur) => (acc * cur.odds), 1)
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
                          <M id={'common.close'} />
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
    quote: Quote
  }
)(observer(ComboTab));