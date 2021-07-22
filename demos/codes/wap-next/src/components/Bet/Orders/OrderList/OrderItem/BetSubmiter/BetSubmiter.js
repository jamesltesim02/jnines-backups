import React from 'react'
import { connect } from 'react-redux'
import { bettingActions } from '@/reducers/betting'
import {
  callUnLogin,
  callBetSuccess,
  callBetFail
} from '@/utils/ClientAdapter'

import BetEditText from '@/components/common/BetEditText'
import KeyBoard from '@/components/common/KeyBoard'

import './BetSubmiter.css'

import { btbet } from '@/api/bet'
import toast from '@/utils/toast';

/**
 * 点水出错信息
 * TODO 后期添加本地化设置
 */
const ERROR_MSG = {
  '201': '盘口变更',
  '199': '系统错误',
  '198': '未验证的商户',
  '111': '已取消',
  '110': '已确认',
  '109': '等待中',
  '108': '参数错误',
  '107': '投注限额',
  '106': '用户余额不足',
  '105': '用户未登录',
  '104': '投注项停盘',
  '103': '盘口停盘',
  '102': '比赛停盘',
  '101': '赔率变化',
  '100': '成功',
  '99999': '网络超时'
}

class BettingSubmiter extends React.Component {
  constructor({
    global: {
      config: {
        nb_default_bet
      }
    }
  }) {
    super()
    this.state = {
      submiting: false,
      value: nb_default_bet || ''
    }
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  async handleSubmit() {
    // 如果未登录,调用商户登录事件
    if (!this.props.global.isLoged) {
      callUnLogin()
      return
    }

    // 如果已经在提交中则不再继续提交
    if (this.state.submiting) {
      return
    }

    let {
      deleteBetting,
      onSuccess,
      global: { currentUser, config },
      item
    } = this.props

    this.setState({ submiting: true })

    try {
      // 提交投注
      let result = await btbet({
        cid: currentUser.token,
        ost: config.nb_odds_selset,
        ac: config.nb_odds_ac,
        cry: config.nb_currency,
        ctype: config.nb_client_type,
        options: [{
          oid: item.oid,
          mid: item.mid,
          gid: item.gid,
          seq: item.seq,
          gpt: item.gpt,
          bar: item.ovalue || item.bar,
          odds: item.odds,
          ssamt: +this.state.value
        }]
      })

      // 调用商户回调函数
      callBetSuccess({
        money: this.state.value,
        bet_name: item.on,
        orderNo: result.data,
        betNo: result.dt[0].no
      })

      // 触发投注成功事件
      onSuccess && onSuccess({
        // 订单号
        orderNo: result.data,
        // 投注金额
        bamt: +this.state.value,
        // 投注时间
        btm: Date.now(),
        // 投注单列表
        bets: [{
          // 订单状态
          iscrt: 1,
          // 结算金额
          crtamt: 0,
          // 投注玩法 1: 单注
          dptp: 1,
          // 投注项列表
          ops: [{
            // 赔率
            odds: item.odds,
            // 玩法id
            gtp: item.gtp,
            // 比赛对阵名
            mn: `${item.htn} vs ${item.atn}`,
            // 投注项名
            onm: item.on,
            // 联赛名
            rn: item.rn,
            // 比分
            score: item.score,
            // 球类id
            sn: item.sno,
            // 比赛阶段
            bsg: item.bstage,
            // 玩法大类
            gptp: item.bcontent
          }]
        }]
      })

      // 删除投注单
      deleteBetting(item.oid)
    } catch (e) {
      console.warn(e)
      // 调用商户回调函数
      await callBetFail(e.result)
      // 提示投注出错
      toast(ERROR_MSG[e.result] || ERROR_MSG[199])
    } finally {
      this.mounted && this.setState({ submiting: false })
    }
  }

  render() {
    let {
      item: {
        podds,
        pym,
        wlm,
        wmin
      },
      global: {
        isLoged,
        currentUser
      },
      enable
    } = this.props

    let {
      value
    } = this.state

    let min = wmin || 2
    let max = podds > 2 ? parseInt(pym / (podds - 1)) : wlm


    let className = [
      'nb-order-bet-submiter',
      enable ? 'nb-active' : '',
      !isLoged ? 'nb-unlogin' : ''
    ].join(' ')

    return (
      <div className={className}>
        <div className="nb-order-item-input">
          <BetEditText
            width='100%'
            placeholder="投注金额"
            value={value}
          />
          {
            isLoged
              ? (
                <div className="nb-order-bet-stitle">
                  <div className="nb-order-bet-amount">
                    余额: <span>{currentUser.totalBalance}</span>
                  </div>
                  <div className="nb-order-bet-betting">
                    下注限额: <span>{min}-{max}</span>
                  </div>
                </div>
              )
              : null
          }
        </div>
        <KeyBoard
          value={value}
          max={max}
          onValueChange={value => this.setState({ value })}
          onSubmit={this.handleSubmit.bind(this)}
        />
      </div>
    )
  }
}

export default connect(
  state => state,
  {
    ...bettingActions
  }
)(BettingSubmiter)