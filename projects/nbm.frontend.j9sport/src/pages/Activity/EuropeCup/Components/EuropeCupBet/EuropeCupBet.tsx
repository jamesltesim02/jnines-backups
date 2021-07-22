import React, { useState, useEffect, forwardRef } from 'react';
import QueueAnim from "rc-queue-anim";
import { Spin, message } from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import { useApi } from "../../../../../apis";
import Theme from "../../../../../apis/Theme";
import mergeClass from "../../../../../utils/mergeClass";
import app from "../../../../../stores/app";
import memberStore from "../../../../../stores/member";

import ImageClose from "../../img/close.svg";
import ImageEmpty from "../../img/empty.svg";

import LoadingBar from "../../../../../components/common/LoadingBar";
import AmountInput from "../../../../../components/cart/AmountInput";
import CartAccept from "../../../../../components/cart/CartAccept";
import EuropeOptionName from "../EuropeOptionName";
import { EUROPE_MARKET_MAP } from "../EuropeOptionName/EuropeOptionName";

export type ANTEPOST = {
  AnteID: number
  AnteType: number
  AnteZh: string
  Group: string
  OutcomeID: number
  Odds: number
  OutcomeZh: string
}

const Bet = async (
  {
    theme,
    betAmount,
    betting,
    betBle,
    onBetting,
    onDelete,
    onFinish,
    accept,
    betItem,
    betType,
    getData
  }: {
    theme: any,
    betAmount: number,
    betting: boolean,
    betBle: boolean,
    onBetting: Function,
    onDelete: Function,
    onFinish: Function,
    accept: number,
    betType: number
    betItem: {
      betAmount: number,
      gameId: number,
      optionId: number,
      odds: number
    },
    getData: Function
  }
) => {
  if (!memberStore.isLoged) {
    memberStore.accountModal = {visible: true, type: 'login'}
    return;
  }

  if (memberStore.balance < betAmount) {
    message.warn('余额不足,请先充值')
    return;
  }

  if (betting || !betBle) {
    return;
  }
  try {
    onBetting()
    await theme.bet({
      accept,
      betType,
      clientApp: 100,
      clientId: 10077,
      frontId: app.frontId,
      token: memberStore.nbToken,
      userId: memberStore.userId,
      userName: memberStore.username,
      currency: memberStore.currency,
      betItems: [betItem]
    })
    message.success('投注成功')
    memberStore.reload()
    onDelete()
  } catch (e) {
    if (e) {
      [
        415,        //比赛已关盘
        416,        //玩法已关盘
        417,        //盘口改变
        418,        //赔率变化
      ].includes(e.code)
      &&
      setTimeout(() => {
          getData()
        }
        , 500)
    }
  } finally {
    onFinish()
  }
}

const Quote = async (
  {
    theme,
    betItem,
    betType
  }: {
    theme: any,
    betType: number
    betItem: {
      gameId: number,
      optionId: number,
    }
  }
) => {

  try {
    const res = await theme.quote({
      betType,
      clientApp: 100,
      clientId: 10077,
      frontId: app.frontId,
      token: memberStore.nbToken,
      userId: memberStore.userId,
      userName: memberStore.username,
      currency: memberStore.currency,
      betItems: [betItem]
    })
    return res
  } catch (e) {
  }
}

const BetTicket = forwardRef((
  {
    match,
    getData,
    option,
    onDelete,
    accept,
    setTotalReturn
  }: {
    match: any
    option: any
    onDelete: Function
    getData: Function
    accept: number,
    setTotalReturn: Function
  }
) => {
  const [theme] = useApi([Theme])
  const [betAmount, setBetAmount] = useState(0)
  const [betBle, setBetBle] = useState(false)
  const [betting, setBetting] = useState(false)
  const [quoteData, setQuoteData] = useState({
    minBet: 2,                    //最低投注
    maxBet: 10000,                //最高投注
    maxReturn: 500000,
    status: 1                     //1=可售 0=停售；
  })

  const market = match?.Markets?.find((market: any) => {
    return market.Options.find((v: any) => v.OptionID === option.OptionID)
  })

  const maxBet = quoteData.maxReturn / option.Odds < quoteData.maxBet ? quoteData.maxReturn / option.Odds : quoteData.maxBet

  const handleBet = () => {

    if (quoteData.status !== 1) {
      message.warn('该项已关闭')
      getData()
      setTimeout(() => {
        onDelete(option.OptionID)
      }, 500)
      return;
    }

    Bet({
      getData,
      theme,
      accept,
      betAmount,
      betting,
      betBle,
      betType: 1,
      betItem: {
        betAmount,
        gameId: match.GameID,
        optionId: option.OptionID,
        odds: option.Odds
      },
      onFinish() {
        setBetting(false)
      },
      onDelete() {
        onDelete(option.OptionID)
      },
      onBetting() {
        setBetting(true)
      }
    })
  }

  useEffect(() => {
    setTimeout(() => {
      const returnEls = Array.from(document.getElementsByClassName("europe-bet-return"))
      if (returnEls.length > 0) {
        setTotalReturn(returnEls.reduce((prev: any, cur: any) => {
          return prev + Number(cur.innerHTML.replace("预计返还: ", ''))
        }, 0))
      }
    }, 0)
  }, [betAmount])

  useEffect(() => {
    (async function () {
      try {
        const res = await Quote({
          theme,
          betType: 1,
          betItem: {
            optionId: option.OptionID,
            gameId: match.GameID
          }
        })
        if (res) {
          setQuoteData(res[0])
        }

      } finally {
      }
    })()
  }, [])

  return (
    <div className="europe-bet-ticket">
      <div className="europe-bet-ticket-header">
        <div>
          {option.description}@{option.Odds}
        </div>
        <img
          src={ImageClose}
          onClick={() => {
            onDelete(option.OptionID)
          }}
        />
      </div>
      <div className="europe-bet-ticket-content">
        <p>
          {EUROPE_MARKET_MAP[market.MarketType]}
        </p>
        <p>
          {`${match.Competitor1Zh} VS ${match.Competitor2Zh}`}
        </p>
        <p>足球/欧洲杯</p>
        <div className="europe-bet-amount">
          <AmountInput
            minBet={quoteData.minBet}
            maxBet={memberStore.currency === 2 ? Math.floor((maxBet / 7)) : Math.floor(maxBet)}
            onChange={(amount: number, betBle: boolean) => {
              setBetAmount(amount)
              setBetBle(betBle)
            }}
          />
          <button
            className={
              mergeClass({
                "betBle": betBle
              })
            }
            onClick={handleBet}
          >
            {betting ? <LoadingBar/> : '投注'}
          </button>
        </div>
        <div className="europe-bet-return">
          预计返还: {(betAmount * option.Odds).toFixed(2)}
        </div>
      </div>
      {
        betting
        &&
        <div className="betting-modal">
          <Spin size="large"/>
          投注中....
        </div>
      }
    </div>
  )
})

const AntdBetTicket = forwardRef((
  {
    getData,
    antepost,
    onDelete,
    setTotalReturn,
    accept
  }: {
    getData: Function
    antepost: ANTEPOST,
    onDelete: Function,
    setTotalReturn: Function,
    accept: number
  }
) => {

  const [theme] = useApi([Theme])
  const [betAmount, setBetAmount] = useState(0)
  const [betBle, setBetBle] = useState(false)
  const [betting, setBetting] = useState(false)
  const [quoteData, setQuoteData] = useState({
    minBet: 2,                    //最低投注
    maxBet: 10000,                //最高投注
    maxReturn: 500000,
    status: 1                     //1=可售 0=停售；
  })

  const {
    AnteID,
    AnteType,
    AnteZh,
    Group,
    OutcomeID,
    OutcomeZh,
    Odds
  } = antepost

  const maxBet = quoteData.maxReturn / Odds < quoteData.maxBet ? quoteData.maxReturn / Odds : quoteData.maxBet

  const handleBet = () => {
    Bet({
      getData,
      theme,
      accept,
      betAmount,
      betting,
      betBle,
      betType: 3,
      betItem: {
        betAmount,
        gameId: AnteID,
        optionId: OutcomeID,
        odds: Odds
      },
      onFinish() {
        setBetting(false)
      },
      onDelete() {
        onDelete(OutcomeID)
      },
      onBetting() {
        setBetting(true)
      }
    })
  }

  useEffect(() => {
    setTimeout(() => {
      const returnEls = Array.from(document.getElementsByClassName("europe-bet-return"))
      if (returnEls.length > 0) {
        setTotalReturn(returnEls.reduce((prev: any, cur: any) => {
          return prev + Number(cur.innerHTML.replace("预计返还: ", ''))
        }, 0))
      }
    }, 0)
  }, [betAmount])

  useEffect(() => {
    (async function () {
      try {
        const res = await Quote({
          theme,
          betType: 3,
          betItem: {
            optionId: OutcomeID,
            gameId: AnteID
          }
        })
        if (res) {
          setQuoteData(res[0])
        }
      } finally {
      }
    })()
  }, [])

  return (
    <div className="europe-bet-ticket">
      <div className="europe-bet-ticket-header">
        <div>
          {OutcomeZh}
          @
          {Odds?.toFixed(2)}
        </div>
        <img
          src={ImageClose}
          onClick={() => {
            onDelete(OutcomeID)
          }}
        />
      </div>
      <div className="europe-bet-ticket-content">
        <p>
          {AnteZh}
        </p>
        <p>足球/欧洲杯</p>
        <div className="europe-bet-amount">
          <AmountInput
            minBet={quoteData.minBet}
            maxBet={memberStore.currency === 2 ? Math.floor((maxBet / 7)) : Math.floor(maxBet)}
            onChange={(amount: number, betBle: boolean) => {
              setBetAmount(amount)
              setBetBle(betBle)
            }}
          />
          <button
            className={
              mergeClass({
                "betBle": betBle
              })
            }
            onClick={handleBet}
          >
            {betting ? <LoadingBar/> : '投注'}
          </button>
        </div>
        <div className="europe-bet-return">
          预计返还: {(betAmount * Odds).toFixed(2)}
        </div>
      </div>
      {
        betting
        &&
        <div className="betting-modal">
          <Spin size="large"/>
          投注中....
        </div>
      }
    </div>
  )
})

enum BET_TYPE {
  BET,
  UNSETTILE
}

function EuropeCupBet(
  {
    match,
    anteposts,
    options,
    onDelete,
    getData,
  }: {
    match?: any
    anteposts?: any
    options?: any
    onDelete: Function
    getData: Function
  }
) {
  const [theme] = useApi([Theme])
  const [accept, setAccept] = useState(app.oddsAccept)
  const [totalReturn, setTotalReturn] = useState(0)
  const [betType, setBetType] = useState(BET_TYPE.BET)
  const [unsettle, setUnsettle] = useState([])

  useEffect(() => {
    (async function () {
      if (!memberStore.isLoged) {
        return;
      }
      try {
        const res = await theme.getBetList({
          userId: memberStore.userId,
          StartTime: dayjs().subtract(1, 'month').valueOf().toString(),
          EndTime: dayjs().valueOf().toString(),
          BetStatus: 1,
          PageSize: 5,
          Page: 1
        })
        setUnsettle(res.List)
      } finally {
      }
    })()
  }, [betType])

  return (
    <div className="europe-bet">
      <div className="europe-nav">
        <button
          className={
            mergeClass({
              "active": betType === BET_TYPE.BET
            })
          }
          onClick={() => setBetType(BET_TYPE.BET)}
        >
          投注单
        </button>
        <button
          className={
            mergeClass({
              "active": betType === BET_TYPE.UNSETTILE
            })
          }
          onClick={() => setBetType(BET_TYPE.UNSETTILE)}
        >
          未结算注单
        </button>
      </div>
      {
        betType === BET_TYPE.BET ?
          <>
            {
              options?.length > 0 ?
                <div>
                  <QueueAnim
                    type={['left', 'right']}
                    duration={[500, 500]}
                    ease={['easeOutBack', 'easeInOutCirc']}
                    leaveReverse
                  >
                    {
                      options.map((option: any) => (
                        <BetTicket
                          getData={getData}
                          setTotalReturn={(amount: number) => setTotalReturn(amount)}
                          key={option.OptionID}
                          accept={accept}
                          match={match}
                          option={option}
                          onDelete={onDelete}
                        />
                      ))
                    }
                  </QueueAnim>
                  <div className="europe-bet-accept">
                    <CartAccept onChange={(accept: number) => {
                      setAccept(accept)
                    }}/>
                    <div className="europe-bet-accept-return">
                      <span>总订单数: {options.length}</span>
                      <span>预计返还: {totalReturn.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                :
                anteposts?.length > 0 ?
                  <div>
                    <QueueAnim
                      type={['left', 'right']}
                      duration={[500, 500]}
                      ease={['easeOutBack', 'easeInOutCirc']}
                      leaveReverse
                    >
                      {
                        anteposts.map((antepost: any) => (
                          <AntdBetTicket
                            getData={getData}
                            accept={accept}
                            setTotalReturn={(amount: number) => setTotalReturn(amount)}
                            key={antepost.OutcomeID}
                            onDelete={onDelete}
                            antepost={antepost}
                          />
                        ))
                      }
                    </QueueAnim>
                    <div className="europe-bet-accept">
                      <CartAccept onChange={(accept: number) => {
                        setAccept(accept)
                      }}/>
                      <div className="europe-bet-accept-return">
                        <span>总订单数: {anteposts.length}</span>
                        <span>预计返还: {totalReturn.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  :
                  <div className="europe-bet-empty">
                    <img src={ImageEmpty} alt=""/>
                    暂无投注单
                  </div>
            }
          </>
          :
          <div>
            {
              unsettle.map((ticket: any) => {
                const {
                  BetID,
                  BetTime,
                  Odds,
                  BetAmount,
                } = ticket
                return (
                  <div
                    className="unsettle"
                    key={BetID}
                  >
                    <header>
                      <p>下单时间:{dayjs(BetTime).format('YYYY/MM/DD HH:mm')}</p>
                      <p>注单号码:{BetID}</p>
                    </header>
                    <section>
                      <EuropeOptionName {...ticket}/>
                    </section>
                    <footer>
                      <div>投注额: {BetAmount.toFixed(2)}</div>
                      <span>预计返还: {(BetAmount * Odds).toFixed(2)}</span>
                    </footer>
                  </div>
                )
              })
            }
          </div>
      }
      <div className="europe-rule">
        <div className="europe-rule-content">
          <h3>竞猜规则</h3>
          <br/>
          1. 所有竞猜游戏的赛果，唯一参考结算标准为欧足联-欧洲杯官方网址数据（
          <a
            target={"_blank"}
            href="https://www.uefa.com/uefaeuro-2020">https://www.uefa.com/uefaeuro-2020/
          </a>
          ）
          <br/>
          2. 单场比赛竞猜的全部游戏，竞猜选项为90分钟常规上下半场的结果，不包含加时赛和点球大战。
          <br/>
          3.
          最佳射手竞猜，如果出现进球数相同、并列最佳射手的情况，所竞猜投注获得的奖金，将按照并列最佳射手的人数，等比例降低。比如，竞猜奖金赔率为10倍，有2名并列最佳射手，则最终返奖为5倍(10/2)；如有3名并列最佳射手，则最终返奖为3.33倍(10/3)，以此类推。
          <br/>
          4.竞猜提供赔率更优越，投注不参与优惠活动。
        </div>
      </div>
    </div>
  );
}

export default observer(EuropeCupBet);