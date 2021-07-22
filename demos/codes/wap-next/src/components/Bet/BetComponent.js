import React from 'react'
import {connect} from 'react-redux'
import {callUnLogin} from '@/utils/ClientAdapter'
import Orders from './Orders/Orders'
import MyOrders from './MyOrders'
import Tabbar from "@/components/common/Tabbar/Tabbar"
import CloseIcon from '@/components/common/myicons/CloseIcon'

import './Bet.css'
/**
 * 投注单页面,分为"投注单"和"我的投注"两个tab
 */
class BetComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      // 当前显示的tab对应的索引
      tabIndex: 0
    }
  }

  /**
   * 切换tab
   * @param {number} tabIndex
   *    切换到的tab索引
   */
  async changeTab (tabIndex) {
    let {
      global: {isLoged}
    } = this.props

    // 没有登录时调用客户端的登录操作
    if(!isLoged && tabIndex == 1) {
      await callUnLogin()
    }

    this.setState({tabIndex})
  }

  render () {
    let classNames = [
      'nb-bet',
      this.props.dialog ? 'nb-independent' : ''
    ].join(' ')

    return (
      <div className={classNames}>
        <a onClick={this.props.onClose} className="nb-close-button"><CloseIcon /></a>
        <div className="nb-bet-tab-conatiner">
          <div className="nb-bet-tab">
            {
              ['投注单', '我的投注'].map((v, i) => (
                <a className={
                    [
                      'nb-bet-tab-item',
                      this.state.tabIndex == i ? 'nb-active' : ''
                    ].join(' ')
                  }
                  key={i}
                  onTouchStart={(e)=>this.changeTab(i)}
                >{v}</a>
              ))
            }
          </div>
        </div>
        <div className="nb-bet-content">
          {
            [
              // 投注单
              <Orders />,
              // 我的投注
              <MyOrders history={this.props.history} />
            ][this.state.tabIndex]
          }
        </div>
        {this.props.dialog ? null : <Tabbar/>}
      </div>
    )
  }
}

export default connect(state => state,null)(BetComponent)