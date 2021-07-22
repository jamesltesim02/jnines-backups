import React from 'react'
import Button from '@/components/common/Button/Button'
import Waitingicon from '@/components/common/icons/Waitingicon'
import Successicon from '@/components/common/icons/Successicon'
import MyOrderList from '@/components/Bet/MyOrders/MyOrderList/MyOrderList';
import './OrderSuccess.css'

import {checkbets} from '@/api/bet'

export default class OrderSuccess extends React.Component {
  constructor ({order}) {
    super()
    this.state = {order}
    // 定时任务对象
    this.refreshTimer = null
    // 开始定时查询订单状态
    // this.refreshState()
  }

  /**
   * 启动定时查询订单状态
   */
  refreshState () {
    this.refreshTimer = setTimeout(async () => {
      let {dt: [{sta}]} = await checkbets({
        list: [
          {'no': this.state.order.orderNo}
        ]
      })

      if(sta === 109) {
        this.refreshState()
        return
      }
      
      order.bets[0].iscrt = {100: 2, 111: 4}[sta]
    }, 2000)
  }

  componentWillUnmount() {
    clearTimeout(this.refreshTimer)
  }

  render () {
    let {onClose, dialog} = this.props
    let {order} = this.state

    return (
      <div className="nb_OrderSuccessbox">
        <div className="nb_OrderSuccess">
          <div className="nb_OrderSuccessicon">
          {
            order.bets[0].iscrt == 2
            ? <Successicon />
            : <Waitingicon />
          }
          </div>
          <p>投注成功</p>
          <p>订单号：{order.orderNo}</p>
        </div>
        {
          !dialog
          ? <div className="nb_OrderSuccesspage">
              <MyOrderList items={[order]} />
            </div>
          : null
        }
        <div className="nb_OrderSuccessiconipt">
          <Button onClick={onClose} />
        </div>
      </div>
    )
  }
}
