import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import { useHistory } from "react-router";
import { Spin } from "antd";
import { useApi } from "../../../apis";
import User from "../../../apis/User";
import { MEMBER_RELOAD_EVENT } from "../../../consts/app";
import mergeClass from "../../../utils/mergeClass";

import Dialog from "../../../components/member/Dialog";
import MemberLayout from "../../../components/member/MemberLayout";
import ImagePromo from './img/rabet_more.png';

const NumFormatToLocale = (num: number) => {
  const numStr = num.toFixed(2)
  const padEnd = numStr.substring(numStr.length - 3, numStr.length)
  const padStart = Math.floor(num).toLocaleString()
  return padStart + padEnd
}

const GameKindMap = ["真人游戏", "电子游戏", "捕鱼王", "体育电竞", "彩票游戏"]

function WashCode() {
  const history = useHistory()
  const [user] = useApi([User])
  const [settleData, setSettleData] = useState<any>({
    totalAmount: 0,
    resultList: []
  })
  const [washCodeData, setWashCodeData] = useState({
    currentLevel: 1, //当前用户星级
    rebateMinAmount: 2,  //最小洗码金额
    rebateTotalAmount: 0, //可洗码总金额
    totalAmount: 0.00,  //总洗码金额
    totalTurnoverAmount: 0,  //当周总有效投注额
    turnoverAmount: 0,  //可结算有效投注额
    rebateInfo: []
  })
  const [loading, setLoading] = useState(false)
  const settleble = washCodeData.rebateInfo.find((val: any) => val.amount > washCodeData.rebateMinAmount)
  const showSettleDialog = settleData?.totalAmount !== 0

  const handleSettleWashCode = async () => {
    if (!settleble || loading) {
      return;
    }
    try {
      setLoading(true)
      const res = await user.settleWashCode()
      setSettleData(res)
      // 重新查询额度
      window.dispatchEvent(new Event(MEMBER_RELOAD_EVENT));
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setSettleData({
      totalAmount: 0,
      resultList: []
    })
    getWashCodeData()
  }

  const getWashCodeData = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true)
      const res = await user.getWashCodeDetail()
      setWashCodeData(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (async function () {
      await getWashCodeData()
    })()
  }, [])

  return (
    <MemberLayout
      title="游戏洗码"
      subTitle={"CASH REBATE CENTER"}
      className="wash-code"
    >
      <header className="wash-code-header">
        <div>
          <p>本周未结算洗码金额（USDT）</p>
          <div className="settle">
            <span>{NumFormatToLocale(washCodeData.rebateTotalAmount)}</span>
            <button
              onClick={handleSettleWashCode}
              className={
                mergeClass({
                  settleble
                })
              }
            >
              一键结算
            </button>
          </div>
        </div>
        <div>
          <p>本周可结算有效投注额</p>
          <span>{NumFormatToLocale(washCodeData.turnoverAmount)}</span>
        </div>
        <div>
          <p>本周总有效投注额</p>
          <span>{NumFormatToLocale(washCodeData.totalTurnoverAmount)}</span>
        </div>
        <div onClick={() => history.push('/washcode-promo')}>
          查看洗码优惠
          <img src={ImagePromo} alt=""/>
        </div>
      </header>
      <ul className="wash-code-list">
        <li>
          <div></div>
          <div>未结算洗码金额</div>
          <div>可结算有效投注额</div>
          <div>当周总有效投注额</div>
        </li>
        {
          washCodeData.rebateInfo.map((item: any) => (
            <li key={item.gameKindName}>
              <div>
                {item.gameKindName}
                <p className="wash-proportion">(洗码比例{item.rate}%)</p>
              </div>
              <div>{NumFormatToLocale(item.amount)}</div>
              <div>{NumFormatToLocale(item.turnoverAmount)}</div>
              <div>{NumFormatToLocale(item.totalTurnoverAmount)}</div>
            </li>
          ))
        }
        <div
          className={
            mergeClass({
              'loading-modal': true,
              hide: !loading
            })
          }
        >
          <Spin size={'large'}/>
        </div>
      </ul>
      <div className="wash-code-rule">
        <div>活动规则</div>
        <ul>
          <li>单个游戏类型的洗码佣金 {washCodeData.rebateMinAmount} USDT即可随时结算。</li>
          <li>洗码比例按照玩家当前会员等级对应比例结算；</li>
          <li>结算周期按自然周计算， 未结算额度将于隔周一零点后清零 ，并于隔周一晚间六点前结算派发至账户内；</li>
        </ul>
      </div>
      <Dialog
        className="wash-code-dialog"
        open={showSettleDialog}
        onClose={handleClear}
        imgbg
        closeButton
      >
        <h3>恭喜你</h3>
        <ul>
          {
            settleData.resultList.map((item: any, index: number) => {
              return (
                <li key={index}>
                  【{GameKindMap[index]}】
                  <span dangerouslySetInnerHTML={{__html: item.data}}></span>
                </li>
              )
            })
          }
        </ul>
      </Dialog>
    </MemberLayout>
  );
}

export default observer(WashCode);