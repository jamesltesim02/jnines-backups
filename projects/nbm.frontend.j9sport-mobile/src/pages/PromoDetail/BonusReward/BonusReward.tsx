import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import { Toast } from "antd-mobile";
import { useApi } from "../../../apis";
import Theme from "../../../apis/Theme";
import memberStore from "../../../stores/member";

import AppHeader from "../../../components/common/AppHeader/AppHeader";
import ImageTitle from './img/bonus-title.png';
import ImageFigure from './img/cristiano-ronaldo.webp';
import ImageContentTit from './img/bonus-reward-tit-1.png';
import ImageRuleTit from './img/bonus-reward-tit-2.png';
import ImageFootball from './img/score-football.svg';
import { useHistory } from "react-router";

const BET_LIST = [
  500,
  2000,
  5000,
  10000,
  20000,
  50000,
  100000,
  200000,
  500000,
  1000000,
  2000000,
]

const BONUS_LIST = [
  2,
  8,
  18,
  38,
  100,
  300,
  500,
  1000,
  2500,
  5000,
  10000,
]

function BonusReward() {

  const history = useHistory()
  const [theme] = useApi([Theme])
  const [amount, setAmount] = useState(0)
  const [progressHeight, setProgressHeight] = useState('')
  const amountIndex = BET_LIST.findIndex(value => value > amount) === -1 ? BONUS_LIST.length : BET_LIST.findIndex(value => value > amount)
  const willGetting = BONUS_LIST.slice(0, amountIndex).reduce((prev, cur) => prev + cur, 0)
  const progress = amount >= 2000000 ? 1 : Math.round((amount - BET_LIST[amountIndex - 1]) / (BET_LIST[amountIndex] - BET_LIST[amountIndex - 1]) * 100) / 100
  const nextBonus = BET_LIST[amountIndex] - amount

  useEffect(() => {
    if (willGetting !== 0) {
      const stripEls = document.getElementsByClassName('progress-bar-strip-item') as HTMLCollectionOf<HTMLElement>
      const tHeight = document.getElementsByClassName('progress-bar-strip')[0].clientHeight
      const pHeight = Array.from(stripEls)
        .slice(0, amountIndex + 1)
        .reduce((prev, acc, index) => {
          if (index === amountIndex) {
            return prev + acc.offsetHeight * progress
          }
          return prev + acc.offsetHeight
        }, 0)
      const progressHeight = Math.round((pHeight / tHeight * 10000) / 100)
      setProgressHeight(progressHeight + "%")
    }
  }, [amount])

  useEffect(() => {
    (async function () {
      try {
        if (!memberStore.isLoged) {
          Toast.info('您未登录,请先登录')
          setTimeout(() => {
            history.push("/login")
          }, 1000)
          return;
        }
        const amount = await theme.getEurope21BonusReward({userId: memberStore.userId})
        setAmount(amount)
      } catch (e) {
      }
    })()
  }, [memberStore.isLoged])

  return (
    <div className="bonus-reward">
      <AppHeader/>
      <section>
        <div className="bonus-reward-title">
          <img src={ImageTitle} alt=""/>
          <div className="date">
            2021年6月12日－7月12日
          </div>
          <div className="bonus-reward-figure">
            <img src={ImageFigure} alt=""/>
          </div>
        </div>
        <div className="bonus-reward-content">
          <div className="bonus-reward-content-tit">
            <img src={ImageContentTit} alt=""/>
          </div>
          <div className="will-getting">
            您累计已领取奖金：<span>{willGetting} USDT</span>
            {
              amount < BET_LIST[BET_LIST.length - 1]
              &&
              <>
                <br/>
                距离下一档还需投注：<span>{nextBonus.toFixed(0)} USDT</span>
              </>
            }
          </div>
          <div className="progress-bar">
            <div>
              <ul>
                {
                  [...BET_LIST].reverse().map((betAmount => (
                    <li key={betAmount}>
                      {betAmount}
                    </li>
                  )))
                }
                <span style={{textAlign: "right"}}>
                  投注额
                </span>
              </ul>
            </div>
            <div>
              <ul className="progress-bar-strip">
                <div
                  className="progress-bar-strip-cover"
                  style={{height: progressHeight}}
                >
                  <img src={ImageFootball} alt=""/>
                </div>
                <li className="progress-bar-strip-item"/>
                {
                  BET_LIST.map((betAmount => (
                    <li
                      key={betAmount}
                      className="progress-bar-strip-item"
                    >
                    </li>
                  )))
                }
              </ul>
            </div>
            <div>
              <ul className="progress-bar-bonus">
                {
                  [...BONUS_LIST].reverse().map((betAmount => (
                    <li key={betAmount}>
                      {betAmount}
                    </li>
                  )))
                }
                <span>
                  奖金USDT
                </span>
              </ul>
            </div>
          </div>
        </div>
        <div className="bonus-reward-rule">
          <img src={ImageRuleTit} alt=""/>
          <p>1.此次活动需要在九游体育进行投注才能参与，仅统计单式投注，投注赔率大于1.7。</p>
          <p>2.获得的奖金无需流水即可提款。</p>
          <p>3.本期活动有效期为6月12日0：00-7月12日23：59，用户每达到一级即可获得相应奖金，每天0：00按日达标情况统计并12小时内派发奖金。</p>
          <p>4.若会员身份、电子邮箱地址、电话号码、支付方式（ 借记卡/银行账户号码 ）、或 IP 地址有相似的资料将视为不符合条件。</p>
          <p>5.任何会员若以任何不诚实手段，包括滥用多个账户、对赌、冒充、伪造身份、合谋作弊等参加此活动将视为违规，违规者将会被取消申请资格并不需事先作任何通知。</p>
          <p>6.对于违规者, 九游体育有权取消其相关红利及其盈利。</p>
          <p>7.此活动条款最终解释权属于九游体育所有。</p>
        </div>
      </section>
    </div>
  );
}

export default observer(BonusReward);