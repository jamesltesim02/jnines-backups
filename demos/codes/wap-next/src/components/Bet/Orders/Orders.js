import React from 'react'
import { connect } from 'react-redux'
import { bettingActions } from '@/reducers/betting'
import { quote } from '@/api/bet'

import OrderSuccess from './OrderSuccess'
import TitleTab from '@/components/common/TitleTab'
import SingleMode from './SingleMode/SingleMode'
import SeriesMode from './SeriesMode'
import EmptyItem from '../EmptyItem'

import './style.css'
import toast from '@/utils/toast';

/**
 * 点水出错信息
 * TODO 后期添加本地化设置
 */
const ERROR_MSG = {
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

class Orders extends React.Component {
  constructor() {
    super()
    this.state = {
      tabIndex: 0,
      order: null,
      quoteing: false,
      successed: false
    }
    this.mounted = false
  }

  /**
   * 将要挂载生命周期函数,每次显示投注单时都对列表进行点水
   */
  async componentWillMount() {
    let {
      betting,
      global: {
        isLoged,
        currentUser,
        config: {
          nb_currency,
          nb_odds_selset
        }
      },
      setBetting,
      clearBetting
    } = this.props

    if (!isLoged || !betting || !betting.length) {
      return
    }

    try {
      // 批量点水
      let newBettings = await quote({
        cid: currentUser.token,
        cry: nb_currency,
        ost: nb_odds_selset,
        oids: betting.map(({ oid, gpt = 1 }) => ({ oid, gpt }))
      })

      // 更新到store中
      setBetting(newBettings.filter(v => !!v.odds))
    } catch (e) {
      // 清空列表
      clearBetting()
      toast(ERROR_MSG[e.result] || ERROR_MSG[199])
    }
  }

  handleSuccess(data) {
    this.setState({
      successed: true,
      order: data
    })
  }

  render() {
    let {
      betting,
      clearBetting,
      deleteBetting
    } = this.props

    return (
      <div className="nb-order">
        <TitleTab
          tabs={['单式', '串关']}
          defaultIndex={this.state.tabIndex}
          onTabChange={index => this.setState({
            tabIndex: index,
            successed: false,
            order: null
          })}
        />
        {
          this.state.successed
            ? <OrderSuccess
                order={this.state.order}
                onClose={()=>this.setState({
                  successed: false,
                  order: null
                })}
              />
            : (
              betting && betting.length
                ? (
                  <div className="nb-order-panel">
                    {
                      this.state.tabIndex == 0
                        // 单式
                        ? <SingleMode
                            items={betting}
                            onDelete={deleteBetting}
                            onClear={clearBetting}
                            onSuccess={this.handleSuccess.bind(this)}
                          />
                        // 我的投注
                        : <SeriesMode
                            items={betting}
                            onDelete={deleteBetting}
                            onClear={clearBetting}
                            onSuccess={this.handleSuccess.bind(this)}
                          />
                    }
                  </div>
                )
                : <EmptyItem>暂无投注单</EmptyItem>
            )
        }
      </div>
    )
  }
}

export default connect(
  state => state,
  { ...bettingActions }
)(Orders)