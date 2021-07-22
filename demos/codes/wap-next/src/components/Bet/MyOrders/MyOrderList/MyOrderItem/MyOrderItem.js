import React from 'react'
import format from 'simple-date-format'
import WfLocaleText from '@/components/common/WfLocaleText'
import OrderItemContainer from '@/components/Bet/OrderItemContainer'
import {Commen} from "@/assets/js/commenFunc.js"

import './MyOrderItem.css'

/**
 * 串关数字到中文的映射
 * TODO 本地化需要从语言文件中获取
 */
const SERIES_NAMES = [
  ,,
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五'
]

/**
 * 订单状态描述 (1=受理中,2=已投注,3=已结算,4=已撤单,5=已退单)
 * TODO 本地化需要从语言文件中获取
 */
const ORDER_STATES = [
  '',
  '受理中',
  '已投注',
  '已结算',
  '已撤单',
  '已退单'
]

/**
 * 玩法名称
 * TODO 本地化需要从语言文件中获取
 */
const GTP_NAMES = {
  '1': '标准盘',
  '10': '双胜彩',
  '11': '平局退款',
  '14': '让分标准盘',
  '16': '让球盘',
  '18': '大小盘',
  '26': '单双',
  '45': '波胆',
  '47': '半全场',
  '33': '主队胜且零封对手',
  '34': '客队胜且零封对手',
  '37': '标准盘及大小盘',
  '29': '两队均得分',
  '52': '最高分出现在哪个半场',
  '19': '主队大小盘',
  '20': '客队大小盘',
  '21': '精确进球数',
  '23': '主队全场进球数',
  '24': '客队全场进球数',
  '27': '主队全场单双',
  '28': '客队全场单'
}

const ONM_TYPE_MAP = {
  'Over': '大于',
  'Under': '小于',
  '1': '主',
  'X': '和',
  'x': '和',
  '2': '客',
  'Odd': '单',
  'Even': '双'
}

const {
  // 处理odds
  handleOdds,
  // 处理ovalue
  handleOvalue
} = Commen

const formatOnm = (onm) => {
  let type = onm.replace(/ \-?\d\.\d+?$/, '')
  let ovalue = onm.replace(type, '')

  type = type.trim()
  type = ONM_TYPE_MAP[type] || type

  return `${type} ${handleOvalue(ovalue)}`
}

export default class MyOrderItem extends React.Component {
  render () {
    let {
        // 投注金额
        bamt,
        // 投注时间
        btm,
        // 结算金额
        crtamt,
        // 订单状态
        iscrt,
        // 投注玩法 (单注,二串一,三串一...)
        dptp,
        // 投注项
        ops = []
    } = this.props.item

    // 串关总赔率
    let todds = ops.reduce((sum, {odds,gtp}) => sum * handleOdds(+odds || 0, gtp), 1)

    return (
      <OrderItemContainer>
        <div className="nb-myorder-item-title">
          <div>
            {
              iscrt == 3 && (
                <span
                  className={
                    [
                      'nb-myorder-status',
                      crtamt > 0
                        ? 'nb-myorder-profit'
                        : 'nb-myorder-loss'
                    ].join(' ')
                  }
                >{crtamt > 0 ? '盈' : '亏'}</span>
              )
            }
            <span className="nb-myorder-type">
              {dptp > 1 ? `${SERIES_NAMES[dptp]}串一` : '单式投注'}
            </span>
          </div>
          <div className="nb-myorder-date">{format(btm, 'yyyy/MM/dd HH:mm:ss')}</div>
        </div>
        <ul>
          {
            ops.map(({
              // 盘口key
              gtp,
              // 队伍 vs 名称
              mn,
              // 投注项赔率
              odds,
              // 投注项名称
              onm,
              // 联赛名称
              rn,
              // 比分
              score,
              sn,
              gptp,
              bsg
            }, i) => (
              <li key={i} className="nb-myorder-item-content">
                <div className="nb-myorder-name-state">
                  <div className="nb-myorder-name">{formatOnm(onm)} @{handleOdds(+odds, gtp).toFixed(2)}</div>
                  <div className="nb-myorder-state">{ORDER_STATES[iscrt]}</div>
                </div>
                <div className="nb-myorder-detail">
                  <div>
                    <WfLocaleText
                      sno={sn}
                      bcontent={gptp}
                      bstage={bsg}
                      gtp={gtp}
                    />
                  </div>
                  <div>
                    {mn}
                    <span className="nb-myorder-detail-score">{score}</span>
                  </div>
                  <div>{rn}</div>
                </div>
              </li>
            ))
          }
        </ul>
        <ul className="nb-myorder-item-footer">
          <li>
            <label>总本金</label>
            <span>{(+bamt||0).toFixed(2)}</span>
          </li>
          <li>
            <label>赔率</label>
            <span>{todds.toFixed(2)}</span>
          </li>
          {
            iscrt <= 2 
              ? (
                  <li>
                    <label>最高返还</label>
                    <span>{(todds * bamt).toFixed(2)}</span>
                  </li>
                )
              : (
                  <li>
                    <label>盈亏金额</label>
                    <span>{crtamt}</span>
                  </li>
                )
          }
        </ul>
      </OrderItemContainer>
    )
  }
}