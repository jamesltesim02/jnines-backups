import React from 'react'
import { connect } from 'react-redux'
import { bettingActions } from '@/reducers/betting'
import { btbet } from '@/api/bet'
import {toSeries, toMoc} from '@/utils/BettingUtils'
import {
  callUnLogin,
  callBetSuccess,
  callBetFail
} from '@/utils/ClientAdapter'

import SeriesMode from './SeriesMode'
import EmptyItem from '@/components/Bet/EmptyItem'
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

class SeriesModeContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      submiting: false
    }
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  /**
   * 提交投注事件
   * 
   * @param {array} bettings
   *      投注额度数据 
   */
  async handleSubmit(bettings) {

    // 是否登录
    if (!this.props.global.isLoged) {
      callUnLogin()
      return
    }

    // 如果正在提交中,则不继续提交
    if(this.submiting) {
      return
    }

    let {
      items,
      onClear,
      onSuccess,
      global: {
        currentUser: {
          token
        },
        config: {
          nb_client_type,
          nb_currency,
          nb_odds_ac,
          nb_odds_selset
        }
      }
    } = this.props

    this.setState({ submiting: true })
    
    try {
      // 调用投注
      let result = await btbet({
        cid: token,
        ost: nb_odds_selset,
        ac: nb_odds_ac,
        cry: nb_currency,
        ctype: nb_client_type,
        bets: bettings.map(v => ({
          gt: v.nm,
          amt: v.value,
          odd: v.odds,
          num: v.mct
        })),
        options: items.map(o => ({
          oid: o.oid,
          mid: o.mid,
          gid: o.gid,
          seq: '',
          gpt: 1,
          bar: o.ovalue,
          odds: o.odds
        }))
      })
      
      // 总投注额
      let betAmount = bettings.reduce(((sum, {value}) => sum + value), 0)
      // 投注项
      let ops = items.map(v =>({
        // 赔率
        odds: v.odds,
        // 玩法id
        gtp: v.gtp,
        // 比赛对阵名
        mn: `${v.htn} vs ${v.atn}`,
        // 投注项名
        onm: v.on,
        // 联赛名
        rn: v.rn,
        // 比分
        score: v.score,
        // 球类id
        sn: v.sno,
        // 比赛阶段
        bsg: v.bstage,
        // 玩法大类
        gptp: v.bcontent
      }))

      // 调用商户回调函数
      callBetSuccess({
        money: betAmount,
        // TODO 从语言文件中获取
        bet_name: '串关',
        orderNo: result.data,
        betNo: result.dt.map(v=>v.no).join(',')
      })

      // 转到提示成功界面
      onSuccess({
        // 订单号
        orderNo: result.data,
        // 投注金额
        bamt: betAmount,
        // 投注时间
        btm: Date.now(),
        // 投注单列表
        bets: bettings.map(v => ({
          // 订单状态
          iscrt: 1,
          // 结算金额
          crtamt: 0,
          // 投注玩法 二串一, 三串一...
          dptp: v.nm,
          // 投注项列表
          ops: ops,
        }))
      })

      // 清空投注单
      onClear()
    } catch (e) {
      console.log(e)
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
      items,
      global: {
        isLoged,
        currentUser,
        config: {
          nb_series_limit,
          nb_odds_selset,
          nb_default_bet
        }
      },
      onClear,
      onDelete
    } = this.props

    let serisesData = {
      items: items,
      serieses: toSeries(items.filter(v=>!v.optionState).map(v => ({oid: v.oid, mid: v.mid, odds: v.podds}))),
      matchOptionsCounts: toMoc(items)
    }

    return (
      serisesData.serieses && serisesData.serieses.length > 1
        ? (
          <SeriesMode
            {...serisesData}
            isLoged={isLoged}
            currentUser={currentUser}
            seriseLimit={nb_series_limit}
            oddsSelect={nb_odds_selset}
            nb_default_bet={nb_default_bet}
            onClear={onClear}
            onDelete={onDelete}
            onSubmit={this.handleSubmit.bind(this)}
          />
        )
        : <EmptyItem>暂无串关投注单</EmptyItem>
    )
  }
}

export default connect(
  state => state,
  { clearBetting: bettingActions.clearBetting }
)(SeriesModeContainer)