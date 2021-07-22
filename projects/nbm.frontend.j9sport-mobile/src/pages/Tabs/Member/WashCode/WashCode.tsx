import React, { useEffect, useState } from 'react';
import { useApi } from "../../../../apis";
import User from "../../../../apis/User";
import { Toast } from "antd-mobile";
import mergeClass from "../../../../utils/mergeClass";

import BackButton from "../../../../components/common/BackButton";
import OnlineCustomerService from "../../../../components/common/OnlineCustomerService";
import Dialog from "../../../../components/member/Dialog";

import ImageCustom from '../img/custom.svg';
import ImageExpanded from './img/expanded.svg';
import ico1 from './img/ico1.png';
import ico3 from './img/ico3.png';
import ico5 from './img/ico5.png';
import ico8 from './img/ico8.png';
import ico12 from './img/ico12.png';
import ImageSuccess from '../ProfileSettings/ChangePhone/img/success.png';
import { useHistory } from "react-router";

const GAME_IMG: any = {
  1: ico1,
  3: ico3,
  5: ico5,
  8: ico8,
  12: ico12
}

const NumFormatToLocale = (num: number) => {
  const numStr = num.toFixed(2)
  const padEnd = numStr.substring(numStr.length - 3, numStr.length)
  const padStart = Math.floor(num).toLocaleString()
  return padStart + padEnd
}

type RebateInfoType = {
  amount: number
  customerId: number
  gameKind: string
  gameKindName: string
  loginName: string
  rate: number
  superiorRate: number
  totalTurnoverAmount: number
  turnoverAmount: number
  whetherStandard: boolean
}

function WashCodeGameItem(
  {
    rebateInfo
  }: {
    rebateInfo: RebateInfoType
  }
) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={
      mergeClass({
        'wash-code-item': true,
        expanded
      })
    }>
      <div className="rebate">
        <img src={GAME_IMG[rebateInfo.gameKind]} alt=""/>
        <div>
          <p>
            洗码比例
            <span>{rebateInfo.rate}%</span>
          </p>
          <p style={{fontSize: 16}}>{rebateInfo.gameKindName}</p>
        </div>
        <div>
          <p>
            未结算洗码
          </p>
          <p style={{fontSize: 18}}>
            {NumFormatToLocale(rebateInfo.amount)}
          </p>
        </div>
        <div onClick={() => {
          setExpanded(!expanded)
        }}>
          <p>详情</p>
          <button>
            <img className="expanded-img" src={ImageExpanded} alt=""/>
          </button>
        </div>
      </div>
      <div className="details">
        <p>可结算有效投注额：{NumFormatToLocale(rebateInfo.turnoverAmount)}</p>
        <p>本周总有效投注额：{NumFormatToLocale(rebateInfo.totalTurnoverAmount)}</p>
      </div>
    </div>
  )
}

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

  const settleble = washCodeData.rebateInfo.find((val: any) => val.amount > washCodeData.rebateMinAmount)
  const showSettleDialog = settleData?.totalAmount !== 0

  const handleSettleWashCode = async () => {
    if (!settleble) {
      return;
    }
    try {
      Toast.loading('请稍等...')
      const res = await user.settleWashCode()
      setSettleData(res)
    } finally {
      Toast.hide()
    }
  }

  const handleClear = () => {
    setSettleData({
      totalAmount: 0,
      resultList: []
    })
  }

  const getWashCodeData = async () => {
    try {
      Toast.loading('加载中...')
      const res = await user.getWashCodeDetail()
      setWashCodeData(res)
    } finally {
      Toast.hide()
    }
  }

  useEffect(() => {
    (async function () {
      await getWashCodeData()
    })()
  }, [])

  return (
    <div className="wash-code">
      <header>
        <BackButton/>
        <span>游戏洗码</span>
        <OnlineCustomerService>
          <img src={ImageCustom} alt=""/>
        </OnlineCustomerService>
      </header>
      <section>
        <div className="wash-code-info">
          <div>
            <p>可结算洗码 USDT</p>
          </div>
          <div className="rebate-amount">
            {NumFormatToLocale(washCodeData.rebateTotalAmount)}
            <button onClick={() => history.push('/member/wash-code-promo')}>洗码优惠规则</button>
          </div>
        </div>
        <div className="wash-code-list">
          {
            washCodeData.rebateInfo?.map((info: RebateInfoType) => (
                <WashCodeGameItem
                  key={info.gameKindName}
                  rebateInfo={info}
                />
              )
            )
          }
        </div>
        <div className="wash-code-rule">
          <div>规则说明</div>
          <ul>
            <li>
              结算周期按自然周计算，未结算额度将于隔周一零点
              后清零，并于隔周一晚间六点前结算派发至账户内。
            </li>
            <li>
              单个游戏类型的洗码佣金 {washCodeData.rebateMinAmount.toFixed(0)} USDT即可随时结算。
            </li>
          </ul>
        </div>
        <button
          className={
            mergeClass({
              "wash-code-wash": true,
              settleble
            })
          }
          onClick={handleSettleWashCode}
        >
          一键洗码
        </button>
      </section>
      <Dialog
        className="wash-code-dialog"
        open={showSettleDialog}
        onClose={handleClear}
        closeButton
      >
        <div>
          <img src={ImageSuccess} alt=""/>
          <p>
            已成功添加
            <span>
            &nbsp;{NumFormatToLocale(settleData.totalAmount)} USDT&nbsp;
          </span>
            洗码
          </p>
        </div>
        <div className="operate">
          <button onClick={() => history.push('/')}>去赢钱</button>
          <button onClick={() => {
            handleClear()
            getWashCodeData()
          }}
          >
            确定
          </button>
        </div>
      </Dialog>
    </div>
  );
}

export default WashCode;