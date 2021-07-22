import React, { useEffect, useState } from 'react';
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { message } from "antd";
import Dialog from "../../../../../components/member/Dialog";
import { useApi } from "../../../../../apis";
import Theme from "../../../../../apis/Theme";
import app from "../../../../../stores/app";
import globalCompStore from "../../../../../stores/globalComp";
import memberStore from "../../../../../stores/member";
import { THEME_EVENT_ID } from "../../../../../consts/app";

import ImageTitle from './img/eu-quick-hd@3x.png';
import ImageReload from './img/reload.svg';
import IconClose from "../../../../../components/member/Dialog/icons/IconClose";
import IconTeam4Ec21 from "../../../../../components/promotions/common/IconTeam4Ec21";

import mergeClass from "../../../../../utils/mergeClass";
import LoadingBar from "../../../../../components/common/LoadingBar";
import ImageSuccess from '../../../../../components/account/img/success.svg'

export enum BET_TYPE {
  "Early" = 3,
  "Normal" = 1
}

type OPTION = {
  BetOption: string
  Odds: number
  OptionID: number
  Order: number
  Status: number
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function EuropeQuickBetArea(
  {
    match
  }: {
    match: any
  }
) {
  const history = useHistory()
  const [theme] = useApi([Theme])
  const [options, setOptions] = useState<Array<OPTION>>([])
  const [loading, setLoading] = useState(false)
  const [betting, setBetting] = useState(false)
  const [successAlert, setSuccessAlert] = useState(false)
  const [amount, setAmount] = useState<string>('')
  const [quoteData, setQuoteData] = useState({
    minBet: 2,                    //最低投注
    maxBet: 100000,                //最高投注
    maxReturn: 500000,
    status: 1                     //1=可售 0=停售；
  })
  const [option, setOption] = useState<any>({
    Odds: 1
  })
  const transMaxBet = quoteData?.maxReturn / option.Odds < quoteData.maxBet ? quoteData?.maxReturn / option.Odds : quoteData.maxBet
  const maxBet = memberStore.currency === 2 ? Math.floor((transMaxBet / 7)) : Math.floor(transMaxBet)
  const betble = maxBet >= Number(amount) && Number(amount) >= quoteData.minBet

  const params = {
    betType: BET_TYPE.Normal,
    clientApp: 100,
    clientId: 10077,
    frontId: app.frontId,
    token: memberStore.nbToken,
    userId: memberStore.userId,
    userName: memberStore.username,
    currency: memberStore.currency
  }

  const goEuropePage = () => {
    globalCompStore.hasHomeBetShown = true
    history.push('/activity/europe-cup/single')
  }

  const quote = async () => {
    try {
      const [res] = await theme.quote({
        ...params,
        betItems: [{
          optionId: option.OptionID,
          gameId: match.GameID
        }]
      })
      setQuoteData(res)
    } finally {
    }
  }

  const bet = async () => {
    if (betting || !betble) {
      return;
    }
    if (!memberStore.isLoged) {
      message.warn('您未登录，请先登录')
      memberStore.accountModal = {type: 'login',visible: true}
      return;
    }
    if (memberStore.balance < Number(amount)) {
      message.warn('余额不足,请先充值')
      return;
    }
    setBetting(true)
    memberStore.balance -= Number(amount)
    try {
      await theme.bet(
        {
          ...params,
          betItems: [{
            betAmount: Number(amount),
            gameId: match.GameID,
            optionId: option.OptionID,
            odds: option.Odds
          }]
        }
      )
      setSuccessAlert(true)
    } finally {
      memberStore.reload()
      setBetting(false)
    }
  }

  useEffect(() => {
    (async function () {
      try {
        setLoading(true)
        const res = await theme.getGameDetail(match.GameID)
        const [{Options}] = res.Markets.filter((v: any) => v.MarketType === 1 && v.IsOpen)
        setOptions(Options)
        setOption(Options[0])
      } finally {
        setLoading(false)
      }
    })()
  }, [match])

  useEffect(() => {
    if (option.OptionID) {
      quote()
    }
  }, [option])

  return (
    <div className="eucup-quick-bet-area">
      <ul>
        {
          options.map((v: any) => (
            <li
              className={
                mergeClass({
                  "active": option.OptionID === v.OptionID
                })
              }
              key={v.OptionID}
              onClick={() => setOption(v)}
            >
              {v.BetOption === '1' ? '主胜' : v.BetOption === '2' ? '客胜' : '平局'}
              <br/>
              {v.Odds.toFixed(2)}
            </li>
          ))
        }
      </ul>
      <div className="quick-amount-input">
        <input
          placeholder="请输入投注额"
          type="tel"
          maxLength={9}
          value={amount}
          onChange={({target: {value}}) => {
            setAmount(value.replace(/(\D)|(^0)/g, ''))
          }}
        />
        <div className="quick-amount-input-limit">限额：{`${quoteData.minBet} - ${Math.floor(maxBet)}`}</div>
        <button
          className={
            mergeClass({
              "betble": betble && !betting
            })
          }
          onClick={bet}
        >
          {betting ? <LoadingBar/> : "投注"}
        </button>
      </div>
      <div className="quick-amount-return">
        <span>预计返还：{(Number(amount) * option.Odds).toFixed(2)}</span>
        <Link to={'/activity/europe-cup/single'}>前往欧洲杯竞猜</Link>
      </div>
      <Dialog
        className="europe-quick-success-dialog"
        open={successAlert}
        onClose={() => {
          setAmount('')
          setSuccessAlert(false)
        }}
        closeButton
      >
        <img src={ImageSuccess} />
        投注成功！
        <button onClick={() => history.push('/activity/europe-cup/single')}>前往竞猜页查看注单</button>
      </Dialog>
    </div>
  )
}

function EuropeQuickBet() {
  const [theme] = useApi([Theme])
  const [loading, setLoading] = useState(false)
  const [matchList, setMatchList] = useState<any>([])
  const [currentMatch, setCurrentMatch] = useState<any>(null)

  useEffect(() => {
    (async function () {
      try {
        setLoading(true)
        const res = await theme.getGameList(THEME_EVENT_ID.EUROPE)
        const earlyMatch = res.filter((v: any) => v.GameState === 0 && v.IsOpen && !v.Memo)
        setMatchList(earlyMatch)
        setCurrentMatch(earlyMatch[getRandomInt(0, earlyMatch.length)])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (globalCompStore.hasHomeBetShown) {
    return null;
  }

  if (loading || matchList.length === 0 || !memberStore.isLoged) {
    return null;
  }

  return createPortal(
    <div className="eucup-quick-bet">
      <div className="eucup-quick-bet-mask"/>
      <div className="eucup-quick-bet-container">
        <header>
          <div className="eu-tit">
            <img src={ImageTitle} alt=""/>
          </div>
          <button onClick={() => globalCompStore.hasHomeBetShown = true}>
            <IconClose/>
          </button>
        </header>
        <section>
          {
            currentMatch
            &&
            <>
              <div className="eucup-quick-bet-team">
                <IconTeam4Ec21
                  circle
                  size={64}
                  name={currentMatch.Competitor1Zh}
                />
                <div style={{paddingTop: 10, lineHeight: "20px"}}>
                  {dayjs(currentMatch.Date).format('YYYY/MM/DD HH:mm')}
                </div>
                <IconTeam4Ec21
                  circle
                  size={64}
                  name={currentMatch.Competitor2Zh}
                />
                <div>{currentMatch.Competitor1Zh}(主)</div>
                <div>VS</div>
                <div>{currentMatch.Competitor2Zh}(客)</div>
              </div>
            </>
          }
          {
            currentMatch
            &&
            <EuropeQuickBetArea match={currentMatch}/>
          }
          <div className="eucup-quick-bet-note">
            *竞猜提供赔率更优越，投注不参与优惠活动
          </div>
          {/*{*/}
          {/*  matchList.length > 1*/}
          {/*  &&*/}
          {/*  <div className="eucup-quick-bet-change">*/}
          {/*    <button onClick={() => {*/}
          {/*      setCurrentMatch(matchList[getRandomInt(0, matchList.length)])*/}
          {/*    }}>*/}
          {/*      <img src={ImageReload}/>*/}
          {/*      换一场*/}
          {/*    </button>*/}
          {/*  </div>*/}
          {/*}*/}
        </section>
      </div>
    </div>,
    document.body
  );
}

export default observer(EuropeQuickBet);