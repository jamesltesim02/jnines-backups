import React, { useEffect } from 'react';
import { useApi } from "../../../../../apis";
import { useState } from "react";
import { Toast } from "antd-mobile";
import QueueAnim from "rc-queue-anim";
import mergeClass from "../../../../../utils/mergeClass";
import Theme from "../../../../../apis/Theme";
import memberStore from "../../../../../stores/member";
import app from "../../../../../stores/app";
import IconClose from "../../../../../components/member/Dialog/icons/IconClose";
import ImageLoading from '../../../../../components/cart/images/loading.png'

import CartBetArea from "../../../../../components/cart/CartBetArea";
import EuropeMine from "../../EuropeCupPages/EuropeMine/EuropeMine";
import { EUROPE_MARKET_MAP } from "../EuropeOptionName/EuropeOptionName";

export enum BET_TYPE {
  "Early" = 3,
  "Normal" = 1
}

const Bet = async (
  {
    theme,
    betAmount,
    betting,
    onBetting,
    onSuccess,
    onFinish,
    onErrorChange,
    accept,
    betItem,
    betType
  }: {
    theme: any,
    betAmount: number,
    betting: boolean,
    onBetting: Function,
    onSuccess: Function,
    onFinish: Function,
    onErrorChange: Function
    accept: number,
    betType: number
    betItem: {
      betAmount: number,
      gameId: number,
      optionId: number,
      odds: number
    }
  }
) => {
  if (!memberStore.isLoged) {
    return;
  }

  if (memberStore.balance < betAmount) {
    Toast.info('余额不足,请先充值')
    return;
  }

  if (betting) {
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
    Toast.success('投注成功')
    memberStore.reload()
    onSuccess()
  } catch (e) {
    if (e) {
      [
        415,        //比赛已关盘
        416,        //玩法已关盘
        417,        //盘口改变
        418,        //赔率变化
      ].includes(e.code)
      &&
      onErrorChange()
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

function BetTicket(
  {
    match,
    option,
  }: {
    match: any
    option: any
  }
) {

  const market = match?.Markets?.find((market: any) => {
    return market.Options.find((v: any) => v.OptionID === option.OptionID)
  })

  return (
    <div className="europe-bet-ticket">
      <div className="europe-bet-ticket-content">
        <p>足球/欧洲杯</p>
        <p>
          {`${match.Competitor1Zh} VS ${match.Competitor2Zh}`}
        </p>
        <div>
          {EUROPE_MARKET_MAP[market.MarketType]}
        </div>
        <div>
          <span>
          {option.description}@{option.Odds?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

const AntdBetTicket = (
  {
    antepost,

  }: {
    antepost: any,
  }
) => {
  const {
    AnteZh,
    OutcomeZh,
    Odds
  } = antepost

  return (
    <div className="europe-bet-ticket">
      <div className="europe-bet-ticket-content">
        <p>足球/欧洲杯</p>
        <p>{AnteZh}</p>
        <div>
          <span>
            {OutcomeZh}
            @
            {Odds?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

function EuropeCupBet(
  {
    betType,
    antePost,
    match,
    option,
    onDelete,
    getData
  }: {
    betType: number
    antePost?: any,
    match?: any,
    option?: any
    onDelete: (id: number) => void
    getData: Function
  }
) {
  const [theme] = useApi([Theme])
  const [betting, setBetting] = useState(false)
  const [quoteData, setQuoteData] = useState({
    minBet: 2,                    //最低投注
    maxBet: 10000,                //最高投注
    maxReturn: 500000,
    status: 1                     //1=可售 0=停售；
  })
  const [tab, setTab] = useState(0)
  const Odds =  option?.Odds　|| antePost?.Odds
  const maxBet = quoteData.maxReturn / Odds < quoteData.maxBet ? quoteData.maxReturn / Odds : quoteData.maxBet

  if (!!antePost || !!option) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'visible'
  }

  const handleBet = (betAmount: number, accept: number) => {

    if (quoteData.status !== 1) {
      Toast.info('该项暂不可投')
      getData()
      setTimeout(() => {
        onDelete(option.OptionID)
      }, 500)
      return;
    }

    let betItem = {} as any

    if (betType === BET_TYPE.Normal) {
      betItem = {
        betAmount,
        gameId: match.GameID,
        optionId: option.OptionID,
        odds: option.Odds
      }
    } else {
      betItem = {
        betAmount,
        gameId: antePost.AnteID,
        optionId: antePost.OutcomeID,
        odds: antePost.Odds
      }
    }

    Bet({
      theme,
      accept,
      betAmount,
      betting,
      betType,
      betItem,
      onFinish() {
        getData()
        setBetting(false)
      },
      onSuccess() {
        setTimeout(() => {
          handleDelete()
        }, 500)
      },
      onErrorChange() {
        getData()
      },
      onBetting() {
        setBetting(true)
      }
    })
  }

  const handleDelete = () => {
    if (betType === BET_TYPE.Normal) {
      onDelete(option.OptionID)
    } else {
      onDelete(antePost.OutcomeID,)
    }
  }

  useEffect(() => {
    (async function () {
      if (!(!!antePost || !!option)) {
        return;
      }
      let betItem = {} as any

      if (betType === BET_TYPE.Normal) {
        betItem = {
          gameId: match.GameID,
          optionId: option.OptionID,
        }
      } else {
        betItem = {
          gameId: antePost.AnteID,
          optionId: antePost.OutcomeID,
        }
      }
      try {
        const [res] = await Quote({
          theme,
          betType,
          betItem
        })
        if (res) {
          setQuoteData(res)
        }
      } finally {
      }
    })()
  }, [antePost, option])

  if (!(!!antePost || !!option)) {
    return null;
  }

  return (
    <div
      className="europe-bet"
      style={{height: window.innerHeight}}
    >
      <div className="europe-bet-mask" onClick={handleDelete}></div>
      <QueueAnim
        type={['bottom', 'bottom']}
        duration={[500, 500]}
        ease={['easeOutBack', 'easeInOutCirc']}
        leaveReverse
      >
        <div
          key="europe-bet-sidebar"
          className="europe-bet-sidebar"
        >
          <header>
            {
              ["投注单", "未结算注单"].map((val, index) => (
                <button
                  key={val}
                  className={mergeClass({
                    "active": tab === index
                  })}
                  onClick={() => {
                    if (betting) {
                      return
                    }
                    setTab(index)
                  }}
                >
                  {val}
                </button>
              ))
            }
            <span
              className="close"
              onClick={handleDelete}
            >
            <IconClose/>
          </span>
          </header>
          {
            [
              <div
                className="europe-cart"
                onTouchMove={(event) => {
                  event.preventDefault()
                }}
              >
                <div>
                  {
                    betType === BET_TYPE.Normal ?
                      <BetTicket match={match} option={option}/>
                      :
                      <AntdBetTicket antepost={antePost}/>
                  }
                </div>
                <CartBetArea
                  doBet={handleBet}
                  betting={betting}
                  minBet={quoteData.minBet}
                  maxBet={memberStore.currency === 2 ? Math.floor((maxBet / 7)) : Math.floor(maxBet)}
                  odds={antePost?.Odds || option?.Odds}
                />
                {
                  betting
                  &&
                  <div className="betting-mask">
                    <img src={ImageLoading} alt=""/>
                  </div>
                }
              </div>,
              <EuropeMine useForBet={true}/>
            ][tab]
          }
        </div>
      </QueueAnim>
    </div>
  );
}

export default EuropeCupBet;